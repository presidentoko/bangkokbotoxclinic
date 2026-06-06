r"""
Branch-independent data-only deploy of the clinic+dental master_db to production `main`.

Why this exists: the scrape working tree usually sits on a feature/chore branch
(e.g. chore/sweep-window-pause) with lots of in-progress code. Vercel deploys from
`main`. The old auto_push_loop committed to the *current* branch, so it can't reach
production when we're off `main`. This script instead applies ONLY web/data/master_db.json
onto an isolated `origin/main` worktree and pushes — never mixing in branch code.

Run manually:  .venv\Scripts\python.exe scripts\deploy_data_to_main.py
Scheduled:     Windows Task Scheduler "DeployClinicDentalMasterDB" (daily / every 24h)

Safe to run repeatedly: if master_db is unchanged vs origin/main it skips (no empty deploy).
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent          # ...\deliverable\deliverable
SRC = REPO / "web" / "data" / "master_db.json"
WT = REPO.parent.parent / ".deploy-main-wt"            # ...\0_main\.deploy-main-wt (outside repo)
REL = "web/data/master_db.json"
LOG = REPO / "logs" / "deploy_data_to_main.log"

GIT_NAME = "presidentoko"
GIT_EMAIL = "chillanel22@gmail.com"


def log(msg: str) -> None:
    line = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(line, flush=True)
    try:
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except OSError:
        pass


def git(args, cwd, check=True, stdin=None):
    return subprocess.run(
        ["git", *args], cwd=str(cwd), text=True, encoding="utf-8",
        capture_output=True, input=stdin, check=check,
    )


def main() -> int:
    if not SRC.exists():
        log("source master_db.json 없음 — 종료")
        return 0

    # 1) validate source JSON (skip if builder mid-write / corrupt)
    try:
        data = json.load(open(SRC, encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        log(f"source JSON invalid (빌더 쓰는 중일 수 있음) — 스킵: {e}")
        return 0
    n_clinics = data.get("total_clinics")

    # 2) refresh origin/main ref (best-effort; worktree falls back to last-known ref)
    git(["fetch", "origin", "main"], REPO, check=False)

    # 3) (re)create isolated detached worktree at origin/main
    git(["worktree", "remove", "--force", str(WT)], REPO, check=False)
    if WT.exists():
        shutil.rmtree(WT, ignore_errors=True)
    try:
        git(["worktree", "add", "--detach", str(WT), "origin/main"], REPO)
    except subprocess.CalledProcessError as e:
        log(f"worktree 생성 실패 — 종료: {e.stderr.strip()[:200]}")
        return 1

    try:
        # 4) write minified data matching production format (raw UTF-8, compact separators)
        dst = WT / REL
        with open(dst, "w", encoding="utf-8", newline="") as f:
            json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        git(["add", REL], WT)

        # 5) skip if no actual change vs origin/main
        if git(["diff", "--cached", "--quiet"], WT, check=False).returncode == 0:
            log(f"변경 없음 (origin/main 과 동일, {n_clinics} clinics) — 스킵")
            return 0

        # 6) commit + push (fast-forward onto origin/main)
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        msg = (
            f"chore(data): auto-update clinic+dental master_db -> {n_clinics} clinics @ {today}\n\n"
            "Automated 24h data-only deploy (isolated origin/main worktree).\n\n"
            "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
        )
        git(["-c", f"user.name={GIT_NAME}", "-c", f"user.email={GIT_EMAIL}",
             "commit", "-F", "-"], WT, stdin=msg)

        pushed = False
        for i in range(1, 5):
            p = git(["push", "origin", "HEAD:main"], WT, check=False)
            if p.returncode == 0:
                pushed = True
                break
            log(f"push 재시도 {i}/4 실패: {(p.stderr or '').strip().splitlines()[-1:] }")
            time.sleep(3)
        if not pushed:
            log("push 4회 실패 — 종료 (다음 주기 재시도)")
            return 1

        log(f"✅ push 완료 → Vercel 자동 배포 트리거 ({n_clinics} clinics)")

        # Vercel Deploy Hook — 즉시 재빌드 트리거 (ISR 캐시 만료 대기 없이)
        for hook_env in ("VERCEL_DEPLOY_HOOK_BOTOX", "VERCEL_DEPLOY_HOOK_DENTAL", "VERCEL_DEPLOY_HOOK"):
            hook_url = os.environ.get(hook_env)
            if hook_url:
                try:
                    req = urllib.request.Request(hook_url, method="POST")
                    urllib.request.urlopen(req, timeout=10)
                    log(f"Vercel Deploy Hook triggered ({hook_env})")
                except Exception as e:
                    log(f"Deploy Hook 실패 ({hook_env}) — 무시: {e}")

        return 0
    finally:
        git(["worktree", "remove", "--force", str(WT)], REPO, check=False)
        if WT.exists():
            shutil.rmtree(WT, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
