"""auto_git_push 1시간 주기 루프 — watchdog 가 관리."""
from __future__ import annotations

import logging
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "web" / "scripts" / "auto_git_push.py"
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"

# Vercel Hobby 한도: 100 deploy / 24h, 모든 프로젝트 합산.
# 같은 repo에 연결된 프로젝트: botox + dental + restaurants = 3개
# (web-restaurants/auto_push_loop 은 redundant 라 disabled — 이 루프가 두 master_db
#  다 push 함. auto_git_push.py 가 MASTER_DBS 리스트에 둘 다 포함)
# 6h 주기 = push 4/24h × 3 프로젝트 = 12 deploy/day (한도 1/8, 수동 deploy 80+ 여유)
INTERVAL = 21600  # 6시간

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


def run_once():
    log.info("auto_git_push 호출")
    try:
        result = subprocess.run(
            [str(VENV_PY), str(SCRIPT)],
            capture_output=True, text=True, timeout=180, encoding="utf-8",
        )
        for line in (result.stdout or "").splitlines():
            log.info(f"  {line}")
        if result.returncode != 0:
            log.warning(f"exit {result.returncode}: {result.stderr[-500:]}")
    except subprocess.TimeoutExpired:
        log.warning("타임아웃 (180s)")
    except Exception as e:
        log.error(f"spawn 실패: {e}")


def main():
    log.info(f"auto_push_loop 시작 PID={os.getpid()} (interval {INTERVAL}s)")
    while True:
        run_once()
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
