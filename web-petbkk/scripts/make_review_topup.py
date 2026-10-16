#!/usr/bin/env python3
"""
A top-up input for the clinics the review run under-delivered on.

The 2026-10-16 run asked 805 clinics for up to 30 reviews each and came back
with 16,005 reviews for $8.00 — but 96 clinics returned nothing at all and 120
returned fewer than they were asked for, 2,991 reviews missing in total.

That is not the clinics' fault, and the shape of the failure says so. Silent
rate by quarter of each input file:

    reviews_01_of_02   Q1  0/102   Q2  4/102   Q3  7/102   Q4  72/102
    reviews_02_of_02   Q1  0/99    Q2  3/99    Q3  0/99    Q4  10/99

A run that answers everything at the start and almost nothing at the end is
being throttled or cut short; a run hitting clinics that genuinely have no
reviews would fail evenly. The cross-checks agree it is not structural — the
shortfall rate is 12-17% across all four cities and 13-15% whether or not the
clinic is open 24 hours — and the clinics it dropped are not small: median 67
reviews advertised, and among the silent ones one with 789 and one with 580.

This is the failure mode feedback_scraper_partial_source_shrink is about: the
run reported success, so nothing looked wrong, but "ok" is not "complete". The
dental site hit the same thing on 2026-10-15 and had to restore 3,043 reviews a
limited-view scrape had cut (commit 704ee74).

So: re-ask, only for the gap. 113 clinics whose shortfall is 5 reviews or more,
2,978 reviews, ~$1.49. Clinics short by 1-4 reviews are left alone — Google's
advertised count includes ratings without text and moves day to day, so a gap
that small is as likely to be the count being stale as the scrape being wrong.

Ordered biggest-advertised first, so if the run is throttled again it loses the
tail rather than the clinics with the most to give. Merge the result into the
first run improve-only (see make_review_inputs.py): a clinic that answered 30
reviews the first time and 3 this time must keep the 30.

Usage:
    python web-petbkk/scripts/make_review_topup.py \
        --run apify_exports/petbkk_reviews_20261016 \
        [--cap 30] [--min-gap 5]
"""
from __future__ import annotations

import argparse
import collections
import glob
import json
from pathlib import Path

HERE = Path(__file__).resolve()
WEB = HERE.parents[1]
ROOT = HERE.parents[2]
DATA = WEB / "data"
IN_DIR = ROOT / "apify_inputs" / "petbkk_hospital_reviews"
COST_PER_REVIEW = 0.50 / 1000


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True, help="directory of the run's dataset JSON files")
    ap.add_argument("--cap", type=int, default=30, help="maxReviews the run asked for")
    ap.add_argument("--min-gap", type=int, default=5)
    args = ap.parse_args()

    run_dir = (ROOT / args.run) if not Path(args.run).is_absolute() else Path(args.run)

    rows = []
    for f in sorted(glob.glob(str(run_dir / "*.json"))):
        # The probe used a different cap, so it would read as a shortfall.
        if Path(f).name.startswith("00_"):
            continue
        rows += json.loads(Path(f).read_text(encoding="utf-8"))

    asked: list[str] = []
    for f in sorted(IN_DIR.glob("reviews_*.json")):
        asked += json.loads(f.read_text(encoding="utf-8"))["placeIds"]

    hospitals = json.loads((DATA / "hospitals.json").read_text(encoding="utf-8"))
    excluded = set(json.loads((DATA / "hospital-excluded.json").read_text(encoding="utf-8"))["excluded"])
    by_pid = {h["google_place_id_new"]: h for h in hospitals if h["id"] not in excluded}

    returned: collections.Counter[str] = collections.Counter()
    for r in rows:
        pid = r.get("placeId") or (r.get("searchString") or "").replace("place_id:", "")
        returned[pid] += 1

    gaps = []
    for pid in asked:
        advertised = by_pid[pid].get("google_review_count") or 0
        want = min(advertised, args.cap)
        gap = want - returned[pid]
        if gap >= args.min_gap:
            gaps.append((advertised, gap, pid))

    gaps.sort(reverse=True)
    silent = sum(1 for _, _, p in gaps if not returned[p])
    missing = sum(g for _, g, _ in gaps)

    print(f"run: {len(rows):,} reviews over {len(returned)} clinics, {len(asked)} asked")
    print(f"  clinics short by >={args.min_gap}: {len(gaps)}  (returned nothing: {silent})")
    print(f"  reviews to re-ask for:          {missing:,}  ~${missing * COST_PER_REVIEW:.2f}")

    payload = {
        "placeIds": [pid for _, _, pid in gaps],
        "maxReviews": args.cap,
        "reviewsSort": "mostRelevant",
        "reviewsOrigin": "google",
        "language": "th",
        "personalData": False,
    }
    out = IN_DIR / "topup_01.json"
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n  wrote {out.relative_to(ROOT)}: {len(gaps)} clinics")
    print("\nMerge improve-only: a clinic that gave 30 reviews last time and 3")
    print("this time keeps the 30.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
