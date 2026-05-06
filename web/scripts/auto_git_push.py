"""master_db.json 변경 시 자동 git commit + push.

여러 master_db 파일(클리닉 + 식당) 둘 다 감지. 둘 중 하나라도 변경되면 함께 commit.
Vercel 은 GitHub push 받으면 auto-deploy.
"""
from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MASTER_DBS = [
    ROOT / "web" / "data" / "master_db.json",
    ROOT / "web-restaurants" / "data" / "master_db.json",
]
STATE_FILE = ROOT / "run" / "auto_git_push.state"


def run(cmd: list[str], cwd: Path = ROOT, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd, cwd=str(cwd), capture_output=True, text=True,
        encoding="utf-8", check=check,
    )


def latest_mtime() -> float:
    return max((p.stat().st_mtime for p in MASTER_DBS if p.exists()), default=0.0)


def main() -> int:
    cur_mtime = latest_mtime()
    if cur_mtime == 0:
        print("[auto_git_push] master_db 파일 없음 — 종료")
        return 0

    last_mtime = 0.0
    if STATE_FILE.exists():
        try:
            last_mtime = float(STATE_FILE.read_text().strip())
        except (OSError, ValueError):
            pass

    if cur_mtime <= last_mtime:
        print(f"[auto_git_push] master_db 변경 없음 (mtime {cur_mtime:.0f}) — 스킵")
        return 0

    # 변경된 path 만 add
    paths_changed: list[str] = []
    for p in MASTER_DBS:
        if not p.exists():
            continue
        rel = p.relative_to(ROOT).as_posix()
        status = run(["git", "status", "--porcelain", rel], check=False)
        if status.stdout.strip():
            paths_changed.append(rel)

    if not paths_changed:
        print(f"[auto_git_push] mtime 만 변경 (콘텐츠 동일) — state 갱신")
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(str(cur_mtime))
        return 0

    print(f"[auto_git_push] 변경 감지: {paths_changed} → commit + push")

    for path in paths_changed:
        run(["git", "add", path])

    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    msg = f"chore(data): auto-update master_db @ {ts} ({len(paths_changed)} dataset)"
    commit = run(["git", "commit", "-m", msg], check=False)
    if commit.returncode != 0:
        print(f"[auto_git_push] commit 실패: {commit.stderr.strip()[:200]}")
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(str(cur_mtime))
        return 0
    print(f"[auto_git_push] commit: {commit.stdout.strip()[:200]}")

    push = run(["git", "push", "origin", "main"], check=False)
    if push.returncode != 0:
        print(f"[auto_git_push] push 실패: {push.stderr.strip()[:300]}", file=sys.stderr)
        return 1

    print("[auto_git_push] push 완료 → Vercel auto-deploy 트리거됨")
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(str(cur_mtime))
    return 0


if __name__ == "__main__":
    sys.exit(main())
