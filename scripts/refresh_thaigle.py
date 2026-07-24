"""
web-thaigle 데이터 자동 갱신 + Vercel 재배포 스크립트.
watchdog 또는 수동으로 실행.

Usage:
  python scripts/refresh_thaigle.py           # 데이터 갱신만
  python scripts/refresh_thaigle.py --deploy  # 갱신 + vercel prod 배포
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
import time
import zipfile
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
THAIGLE = ROOT / "web-thaigle"
DATA_ZIP = THAIGLE / "data.zip"
DATA_DIR = THAIGLE / "data"

NICHE_FILES = [
    "by-niche/muay-thai.json",
    "by-niche/spa.json",
    "by-niche/wellness.json",
    "by-niche/yoga-pilates.json",
    "by-niche/cooking.json",
    "by-niche/coworking.json",
    "by-niche/diving.json",
    "community/muay-thai.json",
    "community/spa.json",
    "community/wellness.json",
    "community/yoga-pilates.json",
    "community/cooking.json",
    "community/coworking.json",
    "community/diving.json",
    "per_place_klook.json",
]


def extract_data():
    if not DATA_ZIP.exists():
        print(f"[refresh] ❌ data.zip not found: {DATA_ZIP}")
        return False

    print(f"[refresh] 📦 Extracting data.zip → {DATA_DIR}")
    with zipfile.ZipFile(DATA_ZIP, "r") as zf:
        for rel in NICHE_FILES:
            zip_path = f"data/{rel}"
            dest = DATA_DIR / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            try:
                with zf.open(zip_path) as src, open(dest, "wb") as dst:
                    dst.write(src.read())
                print(f"  ✓ {rel}")
            except KeyError:
                print(f"  ⚠ not in zip: {zip_path}")
    return True


def deploy():
    print(f"[refresh] 🚀 Running vercel --prod...")
    result = subprocess.run(
        ["vercel", "--prod", "--archive=tgz"],
        cwd=THAIGLE,
        check=False,
    )
    if result.returncode == 0:
        print("[refresh] ✓ Deployed to production.")
    else:
        print(f"[refresh] ❌ Deploy failed (exit {result.returncode})")


def _ts() -> str:
    # watchdog.py's parse_log_timestamp only recognizes a leading
    # "[YYYY-MM-DD HH:MM:SS]" (or bare "[HH:MM:SS]") — these [watcher] lines
    # previously had no timestamp at all, so progress_stale() could never
    # find a parseable match and always fell through to "stale", crash-looping
    # this service every ~2.5min despite it running fine.
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def watch(interval: int = 300):
    """data.zip 변경 감지 → 자동 추출 + 배포. 무한 루프."""
    print(f"[{_ts()}] [watcher] 👀 Watching {DATA_ZIP} every {interval}s...", flush=True)
    last_mtime: float = DATA_ZIP.stat().st_mtime if DATA_ZIP.exists() else 0
    while True:
        time.sleep(interval)
        try:
            mtime = DATA_ZIP.stat().st_mtime
        except FileNotFoundError:
            continue
        if mtime != last_mtime:
            print(f"[{_ts()}] [watcher] 📦 data.zip changed — refreshing...", flush=True)
            last_mtime = mtime
            ok = extract_data()
            if ok:
                deploy()
        else:
            print(f"[{_ts()}] [watcher] ✓ no change", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--deploy", action="store_true", help="Also deploy to Vercel after extraction")
    parser.add_argument("--watch", action="store_true", help="Watch data.zip for changes and auto-deploy")
    parser.add_argument("--interval", type=int, default=300, help="Watch interval in seconds (default 300)")
    args = parser.parse_args()

    if args.watch:
        watch(interval=args.interval)
    else:
        ok = extract_data()
        if ok and args.deploy:
            deploy()
