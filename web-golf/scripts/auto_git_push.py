"""master_db.json 변경 시 자동 git commit + push.

전제: git credential.helper 가 store 로 설정되고 ~/.git-credentials 에
GitHub PAT 가 저장되어 있어야 함 (1회 셋업).

이 스크립트가 push 하면 → Vercel 이 GitHub webhook 받음 → auto-deploy.
"""
from __future__ import annotations

import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
STATE_FILE = ROOT / "run" / "auto_git_push.state"


def run(cmd: list[str], cwd: Path = ROOT, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd, cwd=str(cwd), capture_output=True, text=True,
        encoding="utf-8", check=check,
    )


def main() -> int:
    if not MASTER_DB.exists():
        print(f"[auto_git_push] {MASTER_DB} 없음 — 종료")
        return 0

    cur_mtime = MASTER_DB.stat().st_mtime
    last_mtime = 0.0
    if STATE_FILE.exists():
        try:
            last_mtime = float(STATE_FILE.read_text().strip())
        except (OSError, ValueError):
            pass

    if cur_mtime <= last_mtime:
        print(f"[auto_git_push] master_db 변경 없음 (mtime {cur_mtime:.0f}) — 스킵")
        return 0

    # git working tree 가 깨끗한지 확인 — master_db.json 만 변경되어야 함
    status = run(["git", "status", "--porcelain", "web/data/master_db.json"], check=False)
    if status.stdout.strip() == "":
        # mtime 변경됐지만 실제 콘텐츠 동일 (unchanged hash)
        print(f"[auto_git_push] mtime 만 변경 (콘텐츠 동일) — state 갱신만")
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(str(cur_mtime))
        return 0

    print(f"[auto_git_push] master_db 변경 감지 — commit + push")

    # 다른 변경사항(코드 등) 같이 못 들어가게 master_db.json 만 add
    run(["git", "add", "web/data/master_db.json"])

    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    msg = f"chore(data): auto-update master_db @ {ts}"
    commit = run(["git", "commit", "-m", msg], check=False)
    if commit.returncode != 0:
        # 변경 사항 없거나 다른 이유로 실패
        print(f"[auto_git_push] commit 실패: {commit.stderr.strip()[:200]}")
        # state 만 갱신해서 같은 mtime 으로 반복 시도 안 하게
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(str(cur_mtime))
        return 0
    print(f"[auto_git_push] commit: {commit.stdout.strip()[:200]}")

    push = run(["git", "push", "origin", "main"], check=False)
    if push.returncode != 0:
        print(f"[auto_git_push] push 실패: {push.stderr.strip()[:300]}", file=sys.stderr)
        return 1

    print(f"[auto_git_push] push 완료 → Vercel auto-deploy 트리거됨")

    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(str(cur_mtime))
    return 0


if __name__ == "__main__":
    sys.exit(main())
