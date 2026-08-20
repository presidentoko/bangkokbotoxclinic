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
WEB_DATA = ROOT / "web" / "data"
DENTAL_OUT = ROOT / "dental_output"
BUILD_SCRIPT = ROOT / "web" / "scripts" / "build_master_db.py"
CRISIS_SCRIPT = ROOT / "web" / "scripts" / "crisis_alert.py"
OUT_JSON = WEB_DATA / "master_db.json"
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"

POLL_INTERVAL = 300  # 5분

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


def latest_input_mtime() -> float:
    """Max mtime across every input the builder absorbs. Adds files mean dir
    mtime bumps; modifications mean file mtime bumps — we check both layers
    on the few directories that actually feed into master_db.json.

    Tracked sources:
      1. bangkok_clinics/output/clinics.csv + reviews/  — GMaps clinic data
      2. web/data/external_reviews/ + web/data/pricing/ — HDmall enrich
         (builder merges these per-clinic by place_id at build time)
      3. dental_output/<city>/discovered_places.csv     — dental grid output
         (currently only the GMaps-card data; full review enrichment is
         a separate scraper not yet wired up)
    """
    paths: list[Path] = []

    # 1. Bangkok clinic scraper output
    csv_path = CLINIC_OUT / "clinics.csv"
    if csv_path.exists():
        paths.append(csv_path)
    reviews_dir = CLINIC_OUT / "reviews"
    if reviews_dir.exists():
        paths.append(reviews_dir)
        for p in reviews_dir.glob("*.csv"):
            paths.append(p)

    # 2. HDmall enrichment files — JSON dirs that build_master_db.py merges per place_id
    for sub in ("external_reviews", "pricing", "doctor_xref"):
        d = WEB_DATA / sub
        if d.exists():
            paths.append(d)
            # File-level mtime catches in-place rewrites by the HDmall scraper
            for p in d.glob("*.json"):
                paths.append(p)

    # 3. Dental grid output — one CSV per city
    if DENTAL_OUT.exists():
        paths.append(DENTAL_OUT)
        for csv in DENTAL_OUT.glob("*/discovered_places.csv"):
            paths.append(csv)

    # 4. Pantip mention 인덱스 — pantip/output/clinics/<id>.json 추가/변경되면 rebuild.
    #    build_master_db.merge_pantip_data 가 이 디렉토리를 읽어 master_db.json 에 머지함.
    pantip_clinics_dir = ROOT / "pantip" / "output" / "clinics"
    if pantip_clinics_dir.exists():
        paths.append(pantip_clinics_dir)

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

    # 빌드 성공 → crisis alert chain. 파트너 신규 부정 리뷰 detect → LINE/email push.
    run_crisis_alert()
    return True


def run_crisis_alert() -> None:
    if not CRISIS_SCRIPT.exists():
        log.warning(f"crisis_alert.py 없음: {CRISIS_SCRIPT} — 스킵")
        return
    try:
        result = subprocess.run(
            [str(VENV_PY), str(CRISIS_SCRIPT)],
            capture_output=True, text=True, timeout=120, encoding="utf-8",
        )
        for line in (result.stdout or "").splitlines():
            log.info(f"  crisis: {line}")
        if result.returncode != 0:
            log.warning(f"crisis_alert exit {result.returncode}: {(result.stderr or '')[-500:]}")
    except Exception as e:
        log.error(f"crisis_alert spawn 실패: {e}")


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
