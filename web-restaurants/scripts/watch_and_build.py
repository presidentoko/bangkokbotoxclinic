"""Restaurant master_db 자동 재빌드 데몬.

- bangkok_reviews/output, pattaya/output 변경 감지 → 재빌드
- 5분마다 폴링
- watchdog 가 관리
- 로그: logs/restaurants_db_builder.log
"""
from __future__ import annotations

import logging
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INPUT_DIRS = [
    ROOT / "bangkok_reviews" / "output",
    ROOT / "pattaya" / "output",
]
BUILD_SCRIPT = ROOT / "web-restaurants" / "scripts" / "build_master_db.py"
OUT_JSON = ROOT / "web-restaurants" / "data" / "master_db.json"
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"

POLL_INTERVAL = 300  # 5분

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


def latest_input_mtime() -> float:
    paths: list[Path] = []
    for d in INPUT_DIRS:
        if not d.exists():
            continue
        rest = d / "restaurants.csv"
        if rest.exists():
            paths.append(rest)
        reviews = d / "reviews"
        if reviews.exists():
            paths.append(reviews)
            for p in reviews.glob("*.csv"):
                paths.append(p)
    if not paths:
        return 0.0
    return max(p.stat().st_mtime for p in paths)


def run_build() -> bool:
    log.info("재빌드 시작 ...")
    t0 = time.time()
    try:
        result = subprocess.run(
            [str(VENV_PY), str(BUILD_SCRIPT)],
            capture_output=True, text=True, timeout=600, encoding="utf-8",
        )
    except subprocess.TimeoutExpired:
        log.warning("빌드 타임아웃 600s")
        return False
    except Exception as e:
        log.error(f"빌드 spawn 실패: {e}")
        return False

    elapsed = time.time() - t0
    if result.returncode != 0:
        log.error(f"빌드 실패 (exit {result.returncode}, {elapsed:.1f}s):")
        log.error(result.stderr[-1000:] if result.stderr else "(no stderr)")
        return False
    for line in (result.stdout or "").splitlines():
        log.info(f"  {line}")
    log.info(f"재빌드 완료 ({elapsed:.1f}s)")
    return True


def main():
    log.info(f"watch_and_build (restaurants) 시작 PID={os.getpid()} (poll={POLL_INTERVAL}s)")

    if not BUILD_SCRIPT.exists():
        log.error(f"build script 없음: {BUILD_SCRIPT}")
        sys.exit(1)

    run_build()
    last_input = latest_input_mtime()

    while True:
        time.sleep(POLL_INTERVAL)
        cur = latest_input_mtime()
        if cur > last_input:
            log.info(f"입력 변경 감지 (+{cur - last_input:.0f}s)")
            if run_build():
                last_input = cur
        else:
            log.info("변경 없음 — 스킵")


if __name__ == "__main__":
    main()
