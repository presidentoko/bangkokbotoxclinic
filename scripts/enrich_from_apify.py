#!/usr/bin/env python3
"""
Merge an Apify compass/crawler-google-places export into the niche datasets.

Generic version of enrich_yoga_niche.py: takes any export keyed by placeId and
fills whatever each matched venue is missing, across every niche at once. Used
for the photo/rating top-up runs, where one export spans spa, yoga-pilates,
coworking and diving.

Rules:
- Match on placeId (ChIJ...), which is what the niche records are keyed by.
- Only ever fill a field that is currently empty, except photos, which are
  refreshed whenever the export has them — a fresher Google photo is strictly
  better than a stale one, and photos are the reason most of these runs exist.
- Never add a venue that isn't already in the dataset. This is a top-up for
  known venues; discovery is a separate job with different input.
- Recompute trust_score only when this run is what supplied the rating, so an
  existing score computed from richer inputs (spa's, which had reviewer
  quality data) isn't overwritten with a weaker one.
- Report permanently/temporarily closed venues rather than acting on them:
  taking a page down is a decision, not a side effect of a data merge.

Usage:
    python scripts/enrich_from_apify.py <export.json> [--dry-run]
"""
from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_DIR = ROOT / "web-thaigle" / "data" / "by-niche"


def trust_score(rating, reviews) -> int:
    if not rating or not reviews or reviews <= 0:
        return 0
    return max(0, min(100, round(rating / 5 * 50 + min(math.log10(reviews) * 12, 40))))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("export")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    raw = json.loads(Path(args.export).read_text(encoding="utf-8"))
    records = raw if isinstance(raw, list) else raw.get("items", [])
    by_pid = {}
    for r in records:
        pid = r.get("placeId")
        if pid:
            by_pid[pid] = r
    print(f"[apify] export records: {len(records)}  unique placeIds: {len(by_pid)}")

    closed: list[str] = []
    totals = {"photos": 0, "rating": 0, "address": 0, "phone": 0, "website": 0, "hours": 0}

    for path in sorted(NICHE_DIR.glob("*.json")):
        db = json.loads(path.read_text(encoding="utf-8"))
        touched = 0
        for p in db["places"]:
            r = by_pid.get(p["id"])
            if not r:
                continue
            changed = False

            # Permanently closed venues get flagged so lib/niches.ts can drop
            # them from every listing and stop generating their page. A
            # *temporarily* closed one is left alone on purpose: it reopens,
            # and retiring the URL now means rebuilding it — and its indexing —
            # later. Google keeps temporarily-closed listings for the same
            # reason.
            if r.get("permanentlyClosed"):
                if not p.get("permanently_closed"):
                    p["permanently_closed"] = True
                    changed = True
                closed.append(f"{path.stem}: PERMANENT  {p['name']} ({p['slug']})")
            elif r.get("temporarilyClosed"):
                closed.append(f"{path.stem}: temporary  {p['name']} ({p['slug']})")

            images = [u for u in (r.get("imageUrls") or []) if u]
            if images:
                p["top_photo_url"] = images[0]
                p["photos_sample"] = images[:5]
                p["photos_count"] = r.get("imagesCount") or len(images)
                badges = p.get("source_badges") or {}
                badges["photos"] = len(images)
                p["source_badges"] = badges
                totals["photos"] += 1
                changed = True

            supplied_rating = False
            if p.get("rating") is None and r.get("totalScore"):
                p["rating"] = r["totalScore"]
                p["review_count"] = r.get("reviewsCount")
                totals["rating"] += 1
                supplied_rating = True
                changed = True

            for field, src in (("address", "address"), ("phone", "phone"),
                               ("website", "website"), ("category", "categoryName")):
                if not p.get(field) and (r.get(src) or "").strip():
                    p[field] = r[src].strip()
                    totals[field if field in totals else "address"] += 1
                    changed = True

            if not p.get("opening_hours_json") and (r.get("openingHours") or []):
                p["opening_hours_json"] = json.dumps(
                    {h.get("day"): h.get("hours") for h in r["openingHours"] if h.get("day")},
                    ensure_ascii=False)
                totals["hours"] += 1
                changed = True

            # Only when this run is what gave the venue its rating — otherwise
            # we'd replace a score built from reviewer-quality data with one
            # that has no access to it.
            if supplied_rating:
                p["trust_score"] = trust_score(p.get("rating"), p.get("review_count"))

            if changed:
                touched += 1

        if touched:
            print(f"[apify] {path.stem}: {touched} venues updated")
            if not args.dry_run:
                path.write_text(json.dumps(db, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"\n[apify] filled — photos {totals['photos']}, rating {totals['rating']}, "
          f"address {totals['address']}, phone {totals['phone']}, "
          f"website {totals['website']}, hours {totals['hours']}")
    if closed:
        print(f"\n[apify] closure reports from Google ({len(closed)}):")
        for c in sorted(closed):
            print(f"    {c}")
        print("    PERMANENT → flagged, drops out of listings. temporary → left as-is.")
    if args.dry_run:
        print("\n[apify] --dry-run, nothing written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
