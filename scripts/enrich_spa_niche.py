#!/usr/bin/env python3
"""
Enrich web-thaigle/data/by-niche/spa.json from the live spa_output/ scrape.

Why this exists
---------------
by-niche/spa.json was produced on 2026-06-20 by a pipeline that is not in this
repo, and for spa (and yoga-pilates) it captured names only: 0% rating, 0%
review count, 0% address, 0% website across all 2,000 records. Because those
pages had nothing on them, the website gates them out of generateStaticParams,
so only 58 of 2,000 spa venues actually have a page — while spa/wellness
queries are the single largest impression cluster in Search Console.

The scraper itself was never broken. spa_output/ already holds the detail data
(rating, total reviews, address, phone, website, plus full review text per
place); it simply was never converted into the site's niche format. This is
that conversion.

Behaviour
---------
- Merges rather than replaces. Every existing record is kept as-is unless the
  scrape has data for it, so none of the 58 URLs that are live today can 404 —
  27 of them aren't in the scrape at all.
- Joins on the Google place id (ChIJ...) parsed out of maps_url, because the
  scraper's own place_id is in the 0x..:0x.. hex form while the site's records
  are keyed by ChIJ id. Slugs are derived exactly the way the existing data
  derives them, so an enriched record keeps the URL it already has.
- --limit caps how many *newly enriched* venues are emitted, ranked by
  trust_score. Records outside the cap are left untouched and stay gated out.

trust_score follows the formula published on /methodology and in llms.txt:
    rating/5*50 + min(log10(reviews)*12, 40)
                + min(local_guide_ratio*20, 10)
                + min(log10(avg_author_reviews)*2, 5)

Note that this is NOT reproducible from the existing spa.json: that file stores
`review_count` as the number of scraped review samples (max 5), not the real
Google total, so the original scores can't be recomputed from what was kept.
Scores here are computed from real totals, which means enriched spa venues
score higher than venues in niches whose data is still thin. That reflects the
evidence actually available per venue, but it does make the number
non-comparable across niches until the other datasets are re-run.

Usage:
    python scripts/enrich_spa_niche.py --limit 500
    python scripts/enrich_spa_niche.py --limit 500 --dry-run
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPA_OUTPUT = ROOT / "spa_output"
NICHE_JSON = ROOT / "web-thaigle" / "data" / "by-niche" / "spa.json"

CITIES = {"bangkok": "Bangkok", "pattaya": "Pattaya", "phuket": "Phuket"}

CHIJ_RE = re.compile(r"!19s(ChI[A-Za-z0-9_-]+)")

# csv fields here routinely contain embedded newlines and very long review
# bodies; the default limit raises _csv.Error on the bigger review files.
csv.field_size_limit(min(sys.maxsize, 2**31 - 1))


def slugify(text: str) -> str:
    """Mirrors the slug shape already present in by-niche/*.json."""
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"^-|-$", "", s)


def make_slug(niche: str, name: str, place_id: str) -> str:
    # Existing records are "{niche}-{slugified name}-{last 6 chars of the id}",
    # lowercased, with non-alphanumerics folded to dashes — e.g. the id ending
    # "hvr_NY" becomes "hvr-ny".
    tail = slugify(place_id[-6:])
    return re.sub(r"-+", "-", f"{niche}-{slugify(name)}-{tail}")


def read_csv(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with io.open(path, encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


def to_float(v) -> float | None:
    try:
        f = float(str(v).strip())
        return f if math.isfinite(f) else None
    except (TypeError, ValueError):
        return None


def to_int(v) -> int | None:
    f = to_float(v)
    return int(f) if f is not None else None


def trust_score(rating, total_reviews, local_guide_ratio, avg_author_reviews) -> int:
    if not rating or not total_reviews or total_reviews <= 0:
        return 0
    score = rating / 5 * 50
    score += min(math.log10(total_reviews) * 12, 40)
    score += min((local_guide_ratio or 0) * 20, 10)
    if avg_author_reviews and avg_author_reviews > 0:
        score += min(math.log10(avg_author_reviews) * 2, 5)
    return max(0, min(100, round(score)))


def load_reviews(city_dir: Path, hex_place_id: str) -> dict:
    """Per-place review file, keyed by the hex place id with ':' → '_'."""
    fname = hex_place_id.replace(":", "_") + "_reviews.csv"
    rows = read_csv(city_dir / "reviews" / fname)
    if not rows:
        return {"sample": [], "top_text": "", "lg_ratio": 0.0, "avg_author": 0.0, "n": 0, "avg_rating": None}

    local_guides = sum(1 for r in rows if str(r.get("author_is_local_guide", "")).strip() == "1")
    author_counts = [c for c in (to_int(r.get("author_review_count")) for r in rows) if c]
    ratings = [x for x in (to_float(r.get("rating")) for r in rows) if x]

    with_text = [r for r in rows if (r.get("text") or "").strip()]
    # Longest review first: the fullest one makes the best page excerpt.
    with_text.sort(key=lambda r: len(r["text"]), reverse=True)

    sample = [
        {
            "source": "google",
            "reviewer": (r.get("author_name") or "").strip(),
            "rating": to_float(r.get("rating")),
            "date": (r.get("relative_date") or "").strip(),
            "text": (r.get("text") or "").strip(),
        }
        for r in with_text[:3]
    ]

    return {
        "sample": sample,
        "top_text": with_text[0]["text"].strip() if with_text else "",
        "lg_ratio": local_guides / len(rows) if rows else 0.0,
        "avg_author": sum(author_counts) / len(author_counts) if author_counts else 0.0,
        "n": len(rows),
        "avg_rating": round(sum(ratings) / len(ratings), 2) if ratings else None,
    }


def collect_scraped() -> dict[str, dict]:
    """ChIJ place id -> enrichment payload, best row per place across cities."""
    out: dict[str, dict] = {}
    for city_slug, city_label in CITIES.items():
        city_dir = SPA_OUTPUT / city_slug
        rows = read_csv(city_dir / "clinics.csv")
        if not rows:
            continue
        print(f"[spa] {city_slug}: {len(rows)} rows")
        for r in rows:
            maps_url = (r.get("maps_url") or "").strip()
            m = CHIJ_RE.search(maps_url)
            if not m:
                continue
            chij = m.group(1)
            rating = to_float(r.get("rating"))
            total_reviews = to_int(r.get("total_reviews"))
            if not rating or not total_reviews:
                continue

            rev = load_reviews(city_dir, (r.get("place_id") or "").strip())
            score = trust_score(rating, total_reviews, rev["lg_ratio"], rev["avg_author"])

            payload = {
                "id": chij,
                "name": (r.get("name") or "").strip(),
                "address": (r.get("formatted_address") or "").strip(),
                "city": city_label,
                "rating": rating,
                "review_count": total_reviews,
                "phone": (r.get("phone") or "").strip(),
                "website": (r.get("website") or "").strip(),
                "category": (r.get("primary_type") or "").strip(),
                "google_maps_url": maps_url,
                "reviews_scraped_count": rev["n"],
                "avg_scraped_rating": rev["avg_rating"],
                "top_review_text": rev["top_text"],
                "reviews_sample": rev["sample"],
                "trust_score": score,
            }
            # Same venue can appear in two city scrapes; keep the richer row.
            prev = out.get(chij)
            if prev is None or payload["trust_score"] > prev["trust_score"]:
                out[chij] = payload
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=500,
                    help="max newly enriched venues to emit, ranked by trust_score")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not NICHE_JSON.exists():
        print(f"[spa] ❌ {NICHE_JSON} not found")
        return 1

    db = json.loads(NICHE_JSON.read_text(encoding="utf-8"))
    places = db["places"]
    by_id = {p["id"]: p for p in places}

    scraped = collect_scraped()
    print(f"[spa] scraped venues with rating + reviews: {len(scraped)}")

    ranked = sorted(scraped.values(), key=lambda p: p["trust_score"], reverse=True)[: args.limit]
    print(f"[spa] emitting top {len(ranked)} by trust_score "
          f"({ranked[-1]['trust_score']}–{ranked[0]['trust_score']})" if ranked else "[spa] nothing to emit")

    updated = added = 0
    for payload in ranked:
        existing = by_id.get(payload["id"])
        if existing is not None:
            existing.update(payload)
            # source_badges drives the "what we have on this venue" display.
            existing.setdefault("source_badges", {})
            existing["source_badges"]["google_reviews"] = payload["reviews_scraped_count"]
            updated += 1
        else:
            rec = {
                # Start from the shape of an existing record so every one of the
                # 37 fields stays present, then overwrite what we know.
                **{k: v for k, v in places[0].items()},
                **payload,
                "niche": "spa",
                "slug": make_slug("spa", payload["name"], payload["id"]),
                # No photo/video/price data in this scrape — say so rather than
                # inheriting the template record's counts.
                "photos_count": 0,
                "top_photo_url": "",
                "photos_sample": [],
                "videos_count": 0,
                "top_video_id": "",
                "videos_sample": [],
                "price_min_thb": 0,
                "price_max_thb": 0,
                "price_unit": "unknown",
                "price_band": "unknown",
                "opening_hours_json": "",
                "is_partner": False,
                "affiliate": {
                    k: re.sub(r"query=[^&]*", "query=" + payload["name"].replace(" ", "+"), v)
                    if isinstance(v, str) else v
                    for k, v in (places[0].get("affiliate") or {}).items()
                },
                "source_badges": {
                    **(places[0].get("source_badges") or {}),
                    "google_reviews": payload["reviews_scraped_count"],
                    "photos": 0,
                    "videos": 0,
                },
            }
            places.append(rec)
            by_id[rec["id"]] = rec
            added += 1

    db["total"] = len(places)
    print(f"[spa] enriched existing: {updated}   added new: {added}   total records: {len(places)}")

    if args.dry_run:
        print("[spa] --dry-run, not writing")
        return 0

    NICHE_JSON.write_text(json.dumps(db, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"[spa] ✅ wrote {NICHE_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
