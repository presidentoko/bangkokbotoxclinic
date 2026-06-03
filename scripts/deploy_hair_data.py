"""
Hair-site daily data deploy — mirrors deploy_data_to_main.py for dental.

Flow:
  1. Validate dbd-scraper/hair/thaihairguide_master.csv exists + non-empty
  2. Run `node scripts/build-data.mjs` in thaifacialclinic-portable/ → regenerates clinics.json
  3. Commit thaifacialclinic-portable/public/data/clinics.json to origin/main via isolated worktree
  4. Push → Vercel git integration triggers auto-deploy

Run manually:  .venv/Scripts/python.exe scripts/deploy_hair_data.py
Scheduled:     Windows Task Scheduler "DeployHairData" (daily 06:00)
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SOURCE_CSV = REPO / "dbd-scraper" / "hair" / "thaihairguide_master.csv"
PROJECT = REPO / "thaifacialclinic-portable"
CLINICS_JSON = PROJECT / "public" / "data" / "clinics.json"
REL_CLINICS = "thaifacialclinic-portable/public/data/clinics.json"
WT = REPO.parent.parent / ".deploy-hair-wt"
LOG = REPO / "logs" / "deploy_hair_data.log"

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


def validate_source_csv(path: Path) -> int:
    """Returns data row count or raises FileNotFoundError / ValueError."""
    if not path.exists():
        raise FileNotFoundError(f"CSV not found: {path}")
    lines = path.read_text(encoding="utf-8-sig").strip().splitlines()
    data_rows = len(lines) - 1  # subtract header row
    if data_rows <= 0:
        raise ValueError(f"CSV has 0 data rows: {path}")
    return data_rows


def run_node_build(project_root: Path, out_file: Path) -> int:
    """Runs build-data.mjs, returns clinic count from generated JSON. Raises RuntimeError on failure."""
    result = subprocess.run(
        ["node", "scripts/build-data.mjs"],
        cwd=str(project_root),
        text=True,
        encoding="utf-8",
        capture_output=True,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"node build failed (exit {result.returncode}): {result.stderr.strip()[:300]}"
        )
    try:
        data = json.loads(out_file.read_text(encoding="utf-8"))
        return data.get("total", 0)
    except (json.JSONDecodeError, OSError) as e:
        raise RuntimeError(f"node build output unreadable: {e}") from e


def main() -> int:
    # 1. Validate source CSV
    try:
        csv_rows = validate_source_csv(SOURCE_CSV)
    except (FileNotFoundError, ValueError) as e:
        log(f"source CSV invalid — 종료: {e}")
        return 1

    log(f"source CSV OK: {csv_rows} rows")

    # 2. Run Node.js build → regenerate clinics.json
    try:
        clinic_count = run_node_build(PROJECT, CLINICS_JSON)
    except RuntimeError as e:
        log(f"build 실패 — 종료: {e}")
        return 1

    log(f"build 완료: {clinic_count} clinics → {CLINICS_JSON}")

    if clinic_count == 0:
        log("build returned 0 clinics — 중단 (빈 데이터 배포 방지)")
        return 1

    # 3. Fetch latest origin/main
    git(["fetch", "origin", "main"], REPO, check=False)

    # 4. (Re)create isolated detached worktree at origin/main
    git(["worktree", "remove", "--force", str(WT)], REPO, check=False)
    if WT.exists():
        shutil.rmtree(WT, ignore_errors=True)
    try:
        git(["worktree", "add", "--detach", str(WT), "origin/main"], REPO)
    except subprocess.CalledProcessError as e:
        log(f"worktree 생성 실패 — 종료: {e.stderr.strip()[:200]}")
        return 1

    try:
        # 5. Copy clinics.json into worktree and stage
        dst = WT / REL_CLINICS
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(CLINICS_JSON, dst)
        git(["add", REL_CLINICS], WT)

        # 6. Skip if unchanged vs origin/main
        if git(["diff", "--cached", "--quiet"], WT, check=False).returncode == 0:
            log(f"변경 없음 (origin/main과 동일, {clinic_count} clinics) — 스킵")
            return 0

        # 7. Commit
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        msg = (
            f"chore(data): auto-update hair clinics.json → {clinic_count} clinics @ {today}\n\n"
            "Automated daily hair data deploy (isolated origin/main worktree).\n\n"
            "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
        )
        git(
            ["-c", f"user.name={GIT_NAME}", "-c", f"user.email={GIT_EMAIL}",
             "commit", "-F", "-"],
            WT,
            stdin=msg,
        )

        # 8. Push with retries
        pushed = False
        for i in range(1, 5):
            p = git(["push", "origin", "HEAD:main"], WT, check=False)
            if p.returncode == 0:
                pushed = True
                break
            log(f"push 재시도 {i}/4 실패: {(p.stderr or '').strip().splitlines()[-1:]}")
            time.sleep(3)

        if not pushed:
            log("push 4회 실패 — 종료 (다음 주기 재시도)")
            return 1

        log(f"✅ push 완료 → Vercel 자동 배포 트리거 ({clinic_count} clinics)")
        return 0
    finally:
        git(["worktree", "remove", "--force", str(WT)], REPO, check=False)
        if WT.exists():
            shutil.rmtree(WT, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
