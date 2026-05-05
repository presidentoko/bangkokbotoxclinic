"""deploy_trigger 30분 주기 루프 — watchdog 가 관리."""
from __future__ import annotations

import logging
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TRIGGER = ROOT / "web" / "scripts" / "deploy_trigger.py"
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"

INTERVAL = 1800  # 30분

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


def run_trigger():
    log.info("deploy_trigger 호출")
    try:
        result = subprocess.run(
            [str(VENV_PY), str(TRIGGER)],
            capture_output=True, text=True, timeout=60,
            encoding="utf-8",
        )
        for line in (result.stdout or "").splitlines():
            log.info(f"  {line}")
        if result.returncode != 0:
            log.warning(f"trigger exit {result.returncode}: {result.stderr[-500:]}")
    except subprocess.TimeoutExpired:
        log.warning("trigger 타임아웃")
    except Exception as e:
        log.error(f"trigger spawn 실패: {e}")


def main():
    if not os.environ.get("VERCEL_DEPLOY_HOOK", "").strip():
        log.info("VERCEL_DEPLOY_HOOK 미설정 — deploy_loop 비활성, idle.")
        # 죽지는 않고 sleep — watchdog 가 죽었다고 재시작 안 하게.
        while True:
            time.sleep(3600)

    log.info(f"deploy_loop 시작 PID={os.getpid()} (interval {INTERVAL}s)")
    while True:
        run_trigger()
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
