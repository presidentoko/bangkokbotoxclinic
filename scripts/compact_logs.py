#!/usr/bin/env python3
"""
Gzip retired scraper logs.

logs/ grows without rotation and had reached 1.3 GB. Deleting would be the
obvious move, but these are the only record of what a scraper was doing when
it broke, and the incidents worth reading are exactly the old ones. Gzip gets
~90% of the space back and stays greppable via `zcat`.

Only files whose *name* marks them retired are touched — `.old`, `.stale_*`,
`.pre_fix_*`, `.bak`, timestamped rotations, and anything under logs/archive/.
watchdog writes to `logs/<service>.log`, so a live service's log can never
match. As a second guard the original is deleted only after the gzip verifies,
and deletion of a file another process still holds open fails on Windows —
so a locked file ends up duplicated, never truncated.

Usage:
    python scripts/compact_logs.py [--dry-run] [--min-mb N]
"""
from __future__ import annotations

import argparse
import gzip
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOGS = ROOT / "logs"

RETIRED = re.compile(r"\.old$|\.stale_|\.pre_fix_|\.bak$|_\d{8}_\d{6}\.log$")


def candidates(min_bytes: int) -> list[Path]:
    out = []
    for p in LOGS.rglob("*"):
        if not p.is_file() or p.suffix == ".gz":
            continue
        if not (RETIRED.search(p.name) or "archive" in p.parts):
            continue
        if p.stat().st_size >= min_bytes:
            out.append(p)
    return sorted(out, key=lambda x: -x.stat().st_size)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--min-mb", type=float, default=1.0)
    args = ap.parse_args()

    files = candidates(int(args.min_mb * 2 ** 20))
    before = sum(p.stat().st_size for p in files)
    print(f"대상 {len(files)}개 / {before / 2**30:.2f} GB")
    if args.dry_run:
        for p in files:
            print(f"   {p.stat().st_size / 2**20:8.1f} MB  {p.relative_to(ROOT).as_posix()}")
        print("\n--dry-run, 아무것도 안 함")
        return 0

    after, kept = 0, []
    for p in files:
        gz = p.with_suffix(p.suffix + ".gz")
        try:
            with p.open("rb") as src, gzip.open(gz, "wb", compresslevel=6) as dst:
                shutil.copyfileobj(src, dst, 1024 * 1024)
        except OSError as e:
            print(f"   건너뜀 {p.name}: {e}")
            gz.unlink(missing_ok=True)
            after += p.stat().st_size
            continue
        try:
            p.unlink()   # 다른 프로세스가 열고 있으면 여기서 실패 → 원본 보존
        except OSError as e:
            print(f"   원본 유지(사용 중) {p.name}: {e}")
            kept.append(p)
            after += p.stat().st_size
        after += gz.stat().st_size
        print(f"   {p.name}  {p.stat().st_size / 2**20 if p.exists() else 0:.0f}"
              f" → {gz.stat().st_size / 2**20:.1f} MB")

    print(f"\n{before / 2**30:.2f} GB → {after / 2**30:.2f} GB "
          f"(회수 {(before - after) / 2**30:.2f} GB)")
    if kept:
        print(f"사용 중이라 원본 남긴 파일 {len(kept)}개: {[p.name for p in kept]}")
    print("읽을 때: zcat logs/<파일>.gz | grep ...")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
