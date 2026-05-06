"""master_db.json 자동 재빌드 데몬.

- clinics.csv mtime 또는 reviews/ 디렉토리 mtime 변경 감지 → 재빌드
- 5분마다 폴링
- watchdog 가 관리 (죽으면 재시작)
- 출력 로그: logs/master_db_builder.log
"""
from __future__ import annotations

import logging
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CLINIC_OUT = ROOT / "bangkok_clinics" / "output"
BUILD_SCRIPT = ROOT / "web" / "scripts" / "build_master_db.py"
OUT_JSON = ROOT / "web" / "data" / "master_db.json"
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"

POLL_INTERVAL = 300  # 5분

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


def latest_input_mtime() -> float:
    """clinics.csv + reviews/ 디렉토리 안 모든 파일의 max mtime."""
    paths: list[Path] = []
    csv_path = CLINIC_OUT / "clinics.csv"
    if csv_path.exists():
        paths.append(csv_path)
    reviews_dir = CLINIC_OUT / "reviews"
    if reviews_dir.exists():
        # 디렉토리 mtime — 새 파일 추가 감지
        paths.append(reviews_dir)
        # 안의 파일들도 확인 (수정 감지용 — 단 파일이 많으면 비용 증가)
        # 562+ 파일 → stat 체크 충분히 빠름.
        for p in reviews_dir.glob("*.csv"):
            paths.append(p)
    if not paths:
        return 0.0
    return max(p.stat().st_mtime for p in paths)


def output_mtime() -> float:
    return OUT_JSON.stat().st_mtime if OUT_JSON.exists() else 0.0


def run_build() -> bool:
    log.info("재빌드 시작 ...")
    t0 = time.time()
    try:
        result = subprocess.run(
            [str(VENV_PY), str(BUILD_SCRIPT)],
            capture_output=True, text=True, timeout=600, encoding="utf-8",
        )
    except subprocess.TimeoutExpired:
        log.warning("빌드 타임아웃 600초 초과 — 다음 사이클")
        return False
    except Exception as e:
        log.error(f"빌드 spawn 실패: {e}")
        return False

    elapsed = time.time() - t0
    if result.returncode != 0:
        log.error(f"빌드 실패 (exit {result.returncode}, {elapsed:.1f}s):")
        log.error(result.stderr[-1000:] if result.stderr else "(no stderr)")
        return False
    # build_master_db.py 의 stdout 그대로 흘림
    for line in (result.stdout or "").splitlines():
        log.info(f"  {line}")
    log.info(f"재빌드 완료 ({elapsed:.1f}s)")
    return True


def main():
    log.info(f"watch_and_build 시작 PID={os.getpid()} (poll={POLL_INTERVAL}s)")
    log.info(f"  clinic out: {CLINIC_OUT}")
    log.info(f"  output: {OUT_JSON}")

    if not BUILD_SCRIPT.exists():
        log.error(f"build script 없음: {BUILD_SCRIPT}")
        sys.exit(1)

    # 시작 시 1회 무조건 빌드
    run_build()
    last_input = latest_input_mtime()

    while True:
        time.sleep(POLL_INTERVAL)
        cur = latest_input_mtime()
        if cur > last_input:
            log.info(f"입력 변경 감지 (mtime {last_input:.0f} → {cur:.0f}, "
                     f"+{cur - last_input:.0f}s)")
            if run_build():
                last_input = cur
        else:
            log.info("변경 없음 — 스킵")


if __name__ == "__main__":
    main()
