#!/usr/bin/env python3
"""
Enrich web-thaigle/data/by-niche/yoga-pilates.json from an Apify
compass/crawler-google-places export.

Why this exists
---------------
Same failure as spa: the 2026-06-20 pipeline captured yoga venue names and
photos but 0% rating, 0% review count, 0% address, 0% website across all 284
records. Unlike spa the pages do exist (the niche has no content gate), but
they carry a name and a photo and nothing else.

There is no yoga scraper in this repo — spa_output/ has no yoga equivalent —
so the input here is an Apify export instead of our own scrape. Places-only:
reviews were deliberately not purchased. They only feed a capped 15-point
bonus in trust_score, and yoga pages don't need review text to be generated.

What this does
--------------
- Filters the export to venues that are actually yoga/pilates. The search
  returns gyms, hotels, dance schools and physiotherapy clinics that happen to
  offer a class; matching is on category, categories[] and title, in English
  and Thai (โยคะ / พิลาทิส), since plenty of Thai studios have no English
  category.
- Joins on placeId (ChIJ...), which is the same key the existing records use,
  so an enriched venue keeps the URL it already has. Only 21 of the 284
  existing records appear in the export, so this mostly *adds*: the old grid
  scrape and Apify's search discovered largely disjoint sets.
- Never drops an existing record, so no live URL can 404.

city comes from `state` (the province), not `city` — Apify's `city` is
district-level ("Pai District", "Mueang Phuket District") while the site keys
on province names ("Bangkok", "Phuket", "Chiang Mai") for its niche×city
landing pages.

trust_score follows the formula published on /methodology, minus the two
reviewer-quality terms we have no data for (they are bonuses, worth at most
15 of 100 combined):
    rating/5*50 + min(log10(reviews)*12, 40)

Usage:
    python scripts/enrich_yoga_niche.py <apify-export.json> [--limit N] [--dry-run]
"""
from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_JSON = ROOT / "web-thaigle" / "data" / "by-niche" / "yoga-pilates.json"

# English and Thai. Thai studios frequently carry a generic English category
# ("Gym") with the discipline only in the Thai trading name.
YOGA_RE = re.compile(r"yoga|pilates|reformer|โยคะ|พิลาทิส|พิลาทิ", re.IGNORECASE)


def slugify(text: str) -> str:
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", text.lower()))


def make_slug(niche: str, name: str, place_id: str) -> str:
    # Matches the existing records: "{niche}-{slugified name}-{last 6 of id}".
    return re.sub(r"-+", "-", f"{niche}-{slugify(name)}-{slugify(place_id[-6:])}")


def trust_score(rating: float | None, reviews: int | None) -> int:
    if not rating or not reviews or reviews <= 0:
        return 0
    score = rating / 5 * 50 + min(math.log10(reviews) * 12, 40)
    return max(0, min(100, round(score)))


def is_yoga(rec: dict) -> bool:
    fields = [rec.get("categoryName") or "", rec.get("title") or ""]
    fields += list(rec.get("categories") or [])
    return any(YOGA_RE.search(f) for f in fields)


def opening_hours_json(rec: dict) -> str:
    hours = rec.get("openingHours") or []
    if not hours:
        return ""
    return json.dumps({h.get("day"): h.get("hours") for h in hours if h.get("day")},
                      ensure_ascii=False)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("export", help="Apify crawler-google-places JSON export")
    ap.add_argument("--limit", type=int, default=0,
                    help="cap newly emitted venues by trust_score (0 = no cap)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    raw = json.loads(Path(args.export).read_text(encoding="utf-8"))
    records = raw if isinstance(raw, list) else raw.get("items", [])
    print(f"[yoga] export records: {len(records)}")

    relevant = [
        r for r in records
        if is_yoga(r)
        and str(r.get("placeId", "")).startswith("ChI")
        and not r.get("permanentlyClosed")
        and not r.get("temporarilyClosed")
        and r.get("totalScore")
        and (r.get("reviewsCount") or 0) > 0
    ]
    print(f"[yoga] yoga/pilates with rating + reviews, open: {len(relevant)}")

    # Same venue can be returned by several of the search terms.
    best: dict[str, dict] = {}
    for r in relevant:
        pid = r["placeId"]
        if pid not in best or (r.get("reviewsCount") or 0) > (best[pid].get("reviewsCount") or 0):
            best[pid] = r

    ranked = sorted(
        best.values(),
        key=lambda r: trust_score(r.get("totalScore"), r.get("reviewsCount")),
        reverse=True,
    )
    if args.limit:
        ranked = ranked[: args.limit]
    print(f"[yoga] unique venues to apply: {len(ranked)}")

    db = json.loads(NICHE_JSON.read_text(encoding="utf-8"))
    places = db["places"]
    by_id = {p["id"]: p for p in places}
    template = places[0]

    updated = added = 0
    for r in ranked:
        pid = r["placeId"]
        images = [u for u in (r.get("imageUrls") or []) if u]
        payload = {
            "id": pid,
            "name": (r.get("title") or "").strip(),
            "address": (r.get("address") or "").strip(),
            # `state` is the province; Apify's `city` is a district
            # ("Pai District") and doesn't match the site's city keys.
            "city": (r.get("state") or r.get("city") or "").strip(),
            "rating": r.get("totalScore"),
            "review_count": r.get("reviewsCount"),
            "phone": (r.get("phone") or "").strip(),
            "website": (r.get("website") or "").strip(),
            "category": (r.get("categoryName") or "").strip(),
            "google_maps_url": (r.get("url") or "").strip(),
            "opening_hours_json": opening_hours_json(r),
            "trust_score": trust_score(r.get("totalScore"), r.get("reviewsCount")),
        }
        if images:
            payload["top_photo_url"] = images[0]
            payload["photos_sample"] = images[:5]
            payload["photos_count"] = r.get("imagesCount") or len(images)

        existing = by_id.get(pid)
        if existing is not None:
            existing.update(payload)
            updated += 1
        else:
            rec = {
                **template,
                **payload,
                "niche": "yoga-pilates",
                "slug": make_slug("yoga-pilates", payload["name"], pid),
                # No reviews were purchased — leave the review fields empty
                # rather than inheriting the template venue's.
                "reviews_scraped_count": 0,
                "avg_scraped_rating": None,
                "top_review_text": "",
                "reviews_sample": [],
                "videos_count": 0,
                "top_video_id": "",
                "videos_sample": [],
                "price_min_thb": 0,
                "price_max_thb": 0,
                "price_unit": "unknown",
                "price_band": "unknown",
                "is_partner": False,
                "affiliate": {
                    k: re.sub(r"query=[^&]*", "query=" + payload["name"].replace(" ", "+"), v)
                    if isinstance(v, str) else v
                    for k, v in (template.get("affiliate") or {}).items()
                },
                "source_badges": {
                    **(template.get("source_badges") or {}),
                    "google_reviews": 0,
                    "photos": len(images),
                    "videos": 0,
                },
            }
            if not images:
                rec["top_photo_url"] = ""
                rec["photos_sample"] = []
                rec["photos_count"] = 0
            places.append(rec)
            by_id[pid] = rec
            added += 1

    db["total"] = len(places)
    print(f"[yoga] enriched existing: {updated}   added new: {added}   total: {len(places)}")

    if args.dry_run:
        print("[yoga] --dry-run, not writing")
        return 0

    NICHE_JSON.write_text(json.dumps(db, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"[yoga] ✅ wrote {NICHE_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
