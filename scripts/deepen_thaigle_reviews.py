#!/usr/bin/env python3
"""
Publish more of the review text web-thaigle already has on disk.

The restaurant pages carry a median of 487 characters of review text. The
scrape collected a median of 7,151 per venue. The gap is not missing data: it
is build_master_db.py's `pick_samples`, which keeps three reviews, only those
between 80 and 300 characters, and only those rated 4 or better. Measured over
a 400-venue sample, lifting that to ten reviews of up to 1,200 characters takes
the median to 4,090 — 8.4x — and improves 396 of 400 pages.

Why that matters here and not just as polish: thaigle lost 80% of its
impressions in a day on 2026-07-24, petbkk 94% on 08-16 and the dental site
92% on 08-18, all three being Google Maps data in a template. On the activity
side the same measurement said pages with unique review text earn an
impression 18.2% of the time against 1.0% without. Review text is the only
field on a venue page that is the venue's own.

Why this script and not a fix to build_master_db.py: that builder writes
web-restaurants/data/master_db.json (8,625 restaurants, regenerated from the
scrape on a schedule). web-thaigle reads its own copy, which holds the 3,269
restaurants derived from slug-map.json. The two are deliberately different
sets and the thaigle one must not move — so this follows
backfill_restaurants_local.py: fill thaigle's copy from local sources, assert
the restaurant set is unchanged, and never touch the builder's output.

Rules:
- Never add or remove a restaurant. The count is asserted before writing.
- Only ever improve. A venue keeps what it has unless the new selection holds
  strictly more text, so re-running is a no-op and an Apify-sourced sample is
  never replaced by a weaker local one.
- Longest first. The probe on Indiagate measured `reviewsSort=newest` at 605
  characters over 20 reviews against `mostRelevant` at 7,646 — recency selects
  for one-line ratings, length selects for the reviews that say something.

Usage:
    python scripts/deepen_thaigle_reviews.py [--dry-run] [--max-reviews 10]
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
THAIGLE_DB = ROOT / "web-thaigle" / "data" / "master_db.json"
REVIEW_DIRS = [
    ROOT / "bangkok_reviews" / "output" / "reviews",
    ROOT / "pattaya" / "output" / "reviews",
]

# One scrape run wrote an unterminated quote, so the reader sees the rest of
# that file as a single 1.2 MB field. Same allowance the sibling scripts make.
csv.field_size_limit(min(sys.maxsize, 2**31 - 1))

MIN_CHARS = 80
# 1,200 rather than 300. The upper bound existed to keep cards even, but the
# longest reviews are the ones that describe the place; the card already
# clamps its display height in CSS.
MAX_CHARS = 1200

THAI = re.compile(r"[฀-๿]")


def lang_of(text: str) -> str:
    """Thai script anywhere means a Thai review; everything else renders as en.

    Matches the two buckets the page actually reads
    (`sample_reviews_en` + `sample_reviews_th`); the builder's third bucket,
    `sample_reviews_ko`, is not rendered, so a Korean review would be dropped
    by putting it there.
    """
    return "th" if THAI.search(text) else "en"


def review_csv(place_id: str) -> Path | None:
    fn = (place_id or "").replace(":", "_")
    if not fn:
        return None
    for d in REVIEW_DIRS:
        p = d / f"{fn}_reviews.csv"
        if p.exists():
            return p
    return None


def pick(path: Path, limit: int) -> dict[str, list[dict]]:
    try:
        with open(path, encoding="utf-8-sig", errors="replace", newline="") as f:
            rows = list(csv.DictReader(f))
    except Exception:
        return {"en": [], "th": []}

    by_lang: dict[str, list[dict]] = {"en": [], "th": []}
    for r in rows:
        text = (r.get("text") or "").strip()
        if not (MIN_CHARS <= len(text) <= MAX_CHARS):
            continue
        try:
            rating = int(float(r.get("rating") or 0))
        except ValueError:
            rating = 0
        by_lang[lang_of(text)].append(
            {"text": text, "rating": rating, "author": r.get("author_name", "")}
        )

    for lang in by_lang:
        by_lang[lang].sort(key=lambda x: -len(x["text"]))

    # Split the budget 60/40 towards English, then let either language use what
    # the other did not. Most venues have far more of one than the other, and a
    # hard per-language cap would leave the budget unspent.
    want_en = (limit * 6) // 10
    en = by_lang["en"][:want_en]
    th = by_lang["th"][: limit - len(en)]
    en += by_lang["en"][len(en) : len(en) + (limit - len(en) - len(th))]
    return {"en": en, "th": th}


def chars(rec: dict) -> int:
    return sum(
        len((x or {}).get("text") or "")
        for x in (rec.get("sample_reviews_en") or []) + (rec.get("sample_reviews_th") or [])
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--max-reviews", type=int, default=10)
    args = ap.parse_args()

    db = json.loads(THAIGLE_DB.read_text(encoding="utf-8"))
    restaurants = db["restaurants"]
    before_count = len(restaurants)
    before_ids = {r.get("id") for r in restaurants}

    improved = no_csv = unchanged = 0
    before_total = after_total = 0
    deltas: list[int] = []

    for r in restaurants:
        had = chars(r)
        before_total += had
        path = review_csv(r.get("place_id"))
        if path is None:
            no_csv += 1
            after_total += had
            continue
        picked = pick(path, args.max_reviews)
        new = sum(len(x["text"]) for x in picked["en"] + picked["th"])
        if new <= had:
            unchanged += 1
            after_total += had
            continue
        r["sample_reviews_en"] = picked["en"]
        r["sample_reviews_th"] = picked["th"]
        improved += 1
        after_total += new
        deltas.append(new - had)

    assert len(restaurants) == before_count, "restaurant count changed"
    assert {r.get("id") for r in restaurants} == before_ids, "restaurant set changed"

    deltas.sort()
    med = deltas[len(deltas) // 2] if deltas else 0
    print(f"[deepen] restaurants {before_count} (unchanged)")
    print(f"[deepen] improved {improved}, already better {unchanged}, no review csv {no_csv}")
    print(f"[deepen] review text total {before_total:,} -> {after_total:,} chars")
    print(f"[deepen] median gain on improved pages +{med:,} chars")

    if args.dry_run:
        print("[deepen] --dry-run, nothing written")
        return 0

    tmp = THAIGLE_DB.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(tmp, THAIGLE_DB)
    print(f"[deepen] wrote {THAIGLE_DB}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
