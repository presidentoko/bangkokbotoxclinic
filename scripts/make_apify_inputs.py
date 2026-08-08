#!/usr/bin/env python3
"""
Emit Apify compass/crawler-google-places input files for the venues whose data
we're still missing.

Targeting by placeId instead of by search term: we already know exactly which
venues need filling, so a search run would spend most of its credits
rediscovering venues we have and pulling in gyms/hotels we'd throw away
(the yoga search returned 549 records of which 306 were usable).

Venues whose id predates the ChIJ format go into startUrls with their stored
Google Maps URL instead — same actor, same output shape.

Reviews stay off (maxReviews: 0). They only feed a capped 15-point bonus in
trust_score and no page requires review text to render, so buying them would
multiply the bill for very little.

Usage:
    python scripts/make_apify_inputs.py
Writes to apify_inputs/.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_DIR = ROOT / "web-thaigle" / "data" / "by-niche"
OUT_DIR = ROOT / "apify_inputs"

BACKFILLED = {"spa", "yoga-pilates"}


def top_niche(places: list[dict]) -> list[dict]:
    rated = [p for p in places if p["trust_score"] > 0 and p.get("rating") and (p.get("review_count") or 0) > 0]
    pool = rated if rated else [p for p in places if p["trust_score"] > 0]
    return sorted(pool, key=lambda p: p["trust_score"], reverse=True)


def qualifying(niche: str, places: list[dict]) -> list[dict]:
    """Mirror of lib/niches.ts qualifyingNichePlaces — the set that has pages."""
    top = top_niche(places)
    if niche not in BACKFILLED:
        return top
    ranked = {p["id"] for p in top}
    unrated = sorted(
        (p for p in places if p["id"] not in ranked and p["trust_score"] > 0),
        key=lambda p: p["trust_score"], reverse=True,
    )
    allp = top + unrated
    if niche != "spa":
        return allp
    return [p for p in allp
            if p["price_min_thb"] > 0 or p.get("top_review_text") or p.get("reviews_sample") or p.get("top_photo_url")]


# The 2026-06-20 pipeline stored `review_count` as the number of review
# samples it scraped (max 5), not the Google total. Pages render it verbatim,
# so a gym with hundreds of reviews advertises "★5.0 (5 Reviews)" — on a site
# whose whole claim is ranking by real Google reviews. It also makes
# trust_score incomparable: spa and yoga were rebuilt from real totals and
# score 84-100, everything else still scores 8-56 off a number capped at 5.
# Every venue in these niches is affected, so the whole set is requested.
def _sample_count_review(p: dict) -> bool:
    rc = p.get("review_count")
    return rc is not None and rc <= 10


# (niche, human label, predicate for "still missing something")
TARGETS = [
    ("spa", "photos", lambda p: not p.get("top_photo_url")),
    ("yoga-pilates", "rating", lambda p: p.get("rating") is None),
    ("coworking", "photos", lambda p: not p.get("top_photo_url")),
    ("diving", "photos", lambda p: not p.get("top_photo_url")),
    ("cooking", "reviewcount", _sample_count_review),
    ("coworking", "reviewcount", _sample_count_review),
    ("diving", "reviewcount", _sample_count_review),
    ("muay-thai", "reviewcount", _sample_count_review),
    ("wellness", "reviewcount", _sample_count_review),
]


def build_input(place_ids: list[str], start_urls: list[str]) -> dict:
    payload: dict = {
        "language": "en",
        "scrapePlaceDetailPage": True,
        "maxImages": 5,
        "maxReviews": 0,
        "maxQuestions": 0,
        "scrapeContacts": False,
        "maximumLeadsEnrichmentRecords": 0,
        "skipClosedPlaces": False,  # we want to learn if one closed
    }
    if place_ids:
        payload["placeIds"] = place_ids
    if start_urls:
        payload["startUrls"] = [{"url": u} for u in start_urls]
    return payload


def main() -> int:
    OUT_DIR.mkdir(exist_ok=True)
    grand_ids: list[str] = []
    grand_urls: list[str] = []
    print(f"{'file':32} {'placeIds':>9} {'startUrls':>10}")

    for niche, label, missing in TARGETS:
        places = json.loads((NICHE_DIR / f"{niche}.json").read_text(encoding="utf-8"))["places"]
        need = [p for p in qualifying(niche, places) if missing(p)]
        ids = [p["id"] for p in need if str(p["id"]).startswith("ChI")]
        urls = [p["google_maps_url"] for p in need
                if not str(p["id"]).startswith("ChI") and p.get("google_maps_url")]

        name = f"{niche}_{label}.json"
        (OUT_DIR / name).write_text(
            json.dumps(build_input(ids, urls), ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{name:32} {len(ids):>9} {len(urls):>10}")
        grand_ids += ids
        grand_urls += urls

    # De-dupe across niches — a venue can appear in two of them.
    grand_ids = list(dict.fromkeys(grand_ids))
    grand_urls = list(dict.fromkeys(grand_urls))
    (OUT_DIR / "ALL_COMBINED.json").write_text(
        json.dumps(build_input(grand_ids, grand_urls), ensure_ascii=False, indent=2), encoding="utf-8")
    total = len(grand_ids) + len(grand_urls)
    print(f"{'ALL_COMBINED.json':32} {len(grand_ids):>9} {len(grand_urls):>10}")
    print(f"\ntotal venues: {total}  →  roughly ${total/1000*1.5:.2f}–${total/1000*5:.2f} at $1.5–5 / 1,000")
    print(f"written to {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
