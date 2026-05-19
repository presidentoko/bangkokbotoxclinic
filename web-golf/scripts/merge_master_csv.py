"""Merge thailandgolfguide_master.csv enrichment into data/master_db.json.

Additive: existing Course objects keep their Apify-derived fields (rating_trend,
sample_reviews_*, mentioned_topics, etc.) and gain new fields from the CSV
(photos, videos, korean_blogs, scraped_reviews, golf_score, website enrichment).

Net-new courses (CSV-only with is_golf_filtered=True) are synthesized with
sensible defaults so the existing /course/[id] page can render them.
"""
from __future__ import annotations

import csv
import json
import math
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "export" / "thailandgolfguide_master.csv"
DB_PATH = ROOT / "data" / "master_db.json"

# Existing slug conventions (from observed master_db rows)
CITY_SLUG_OVERRIDES = {
    "Chon Buri": "chon_buri",
    "Chiang Mai": "chiang_mai",
    "Pathum Thani": "pathum_thani",
    "Prachuap Khiri Khan": "prachuap_khiri_khan",
    "Phra Nakhon Si Ayutthaya": "phra_nakhon_si_ayutthaya",
    "Nakhon Pathom": "nakhon_pathom",
    "Nakhon Ratchasima": "nakhon_ratchasima",
    "Nakhon Nayok": "nakhon_nayok",
    "Samut Prakan": "samut_prakan",
    "Surat Thani": "surat_thani",
    "Mae Hong Son": "mae_hong_son",
}


def slugify_city(name: str) -> str:
    if not name:
        return ""
    if name in CITY_SLUG_OVERRIDES:
        return CITY_SLUG_OVERRIDES[name]
    return re.sub(r"\s+", "_", name.strip().lower())


def to_int(v: str | None) -> int:
    if v is None or v == "":
        return 0
    try:
        return int(float(v))
    except ValueError:
        return 0


def to_float(v: str | None) -> float | None:
    if v is None or v == "":
        return None
    try:
        f = float(v)
    except ValueError:
        return None
    if math.isnan(f) or math.isinf(f):
        return None
    return f


def to_bool(v: str | None) -> bool:
    return str(v).strip().lower() == "true"


def _clean_nan(obj):
    """Recursively replace Python float('nan') with None so output is valid JSON."""
    if isinstance(obj, float) and math.isnan(obj):
        return None
    if isinstance(obj, dict):
        return {k: _clean_nan(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_clean_nan(x) for x in obj]
    return obj


def parse_json_field(v: str | None):
    if not v or not v.strip():
        return None
    s = v.strip()
    if not (s.startswith("[") or s.startswith("{")):
        return None
    try:
        # json.loads accepts NaN by default; clean it out so downstream is valid JSON.
        return _clean_nan(json.loads(s))
    except json.JSONDecodeError:
        return None


# CSV `category` (Google Maps primary type) → existing site categories list
CATEGORY_MAP: dict[str, list[str]] = {
    "Golf course": ["course"],
    "Public golf course": ["course"],
    "Private golf course": ["private_club", "course"],
    "Golf club": ["club", "course"],
    "Country club": ["country_club", "course"],
    "Golf resort": ["resort", "course"],
    "Resort": ["resort"],
    "Golf driving range": ["driving_range"],
    "Driving range": ["driving_range"],
    "Indoor golf course": ["indoor"],
    "Indoor golf": ["indoor"],
    "Golf instructor": ["instructor"],
    "Golf instruction": ["instructor"],
    "Golf school": ["instructor"],
    "Golf shop": ["shop"],
    "Sporting goods store": ["shop"],
    "Miniature golf course": ["mini_golf"],
    "Golf": ["course"],
}


def map_category(cat: str) -> list[str]:
    return CATEGORY_MAP.get(cat, ["course"])


def synth_trust_score(rating: float | None, total_reviews: int) -> float:
    """Mirror the page.tsx breakdown so synthesized courses look comparable."""
    if not rating or rating <= 0:
        return 0.0
    rating_part = (rating / 5.0) * 50.0
    volume_part = min(40.0, math.log10(max(1, total_reviews)) * 12.0)
    return round(rating_part + volume_part, 2)


def synth_course_from_csv(row: dict) -> dict:
    pid = row["place_id"]
    name = row.get("name") or "Unknown"
    rating = to_float(row.get("rating")) or 0.0
    total_reviews = to_int(row.get("review_count"))
    raw_cat = (row.get("category") or "").strip()
    cats = map_category(raw_cat)
    city_label = (row.get("city") or "").strip()
    city = slugify_city(city_label)

    return {
        "id": pid,
        "place_id": pid,
        "name": name,
        "primary_type": raw_cat or "Golf course",
        "address": row.get("address") or "",
        "city": city,
        "city_label": city_label,
        "district": "",
        "phone": row.get("phone") or "",
        "website": row.get("website") or "",
        "menu_url": "",
        "lat": to_float(row.get("lat")),
        "lng": to_float(row.get("lng")),
        "rating": rating,
        "total_reviews": total_reviews,
        "trust_score": synth_trust_score(rating, total_reviews),
        "categories": cats,
        "raw_categories": [raw_cat] if raw_cat else [],
        "price_level": "",
        "price_symbol": "",
        "scraped_review_count": to_int(row.get("reviews_scraped_count")),
        "local_guide_count": 0,
        "avg_author_review_count": 0,
        "language_breakdown": {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0},
        "cuisine_mentions": {},
        "mentioned_topics": [],
        "rating_trend": {
            "recent": {"count": 0, "avg": None},
            "midterm": {"count": 0, "avg": None},
            "old": {"count": 0, "avg": None},
            "trend": "insufficient_data",
        },
        "sample_reviews_th": [],
        "sample_reviews_en": [],
        "sample_reviews_ko": [],
        "business_status": "Open",
        "maps_url": row.get("google_maps_url") or "",
    }


# lat/lng is missing from CSV `lat`/`lng` columns but embedded in
# google_maps_url as `!3d{lat}!4d{lng}`. Extract from URL.
_LATLNG_RE = re.compile(r"!3d(-?[\d.]+)!4d(-?[\d.]+)")


def latlng_from_url(url: str | None) -> tuple[float | None, float | None]:
    if not url:
        return (None, None)
    m = _LATLNG_RE.search(url)
    if not m:
        return (None, None)
    try:
        return (float(m.group(1)), float(m.group(2)))
    except ValueError:
        return (None, None)


# Fields lifted from the CSV onto every matched course (existing + synthesized).
def csv_extras(row: dict) -> dict:
    photos = parse_json_field(row.get("photo_urls_json")) or []
    videos = parse_json_field(row.get("videos_json")) or []
    korean_blogs = parse_json_field(row.get("korean_blogs_json")) or []
    scraped_reviews = parse_json_field(row.get("reviews_json")) or []
    holes = to_int(row.get("website_holes")) or None
    par = to_int(row.get("website_par")) or None
    green_fee = (row.get("website_green_fee_mentions") or "").strip()
    lat, lng = latlng_from_url(row.get("google_maps_url"))

    out = {
        "golf_score": to_float(row.get("golf_score")) or 0.0,
        "is_korean_friendly": to_bool(row.get("is_korean_friendly")),
        "is_english_friendly": to_bool(row.get("is_english_friendly")),
        "is_golf_filtered": to_bool(row.get("is_golf_filtered")),
        "data_sources": (row.get("data_sources") or "").split(",") if row.get("data_sources") else [],
        "top_photo_url": row.get("top_photo_url") or "",
        "photos": photos,
        "videos": videos,
        "korean_blogs": korean_blogs,
        "scraped_reviews": scraped_reviews,
        "top_review_text": row.get("top_review_text") or "",
        # Website enrichment (drop empties)
        "website_title": row.get("website_title") or "",
        "website_meta_description": row.get("website_meta_description") or "",
        "website_email": row.get("website_email") or "",
        "website_facebook": row.get("website_facebook") or "",
        "website_instagram": row.get("website_instagram") or "",
        "website_line_id": row.get("website_line_id") or "",
        "website_phone_secondary": row.get("website_phone_secondary") or "",
        "green_fee_mentions": green_fee,
    }
    if holes is not None:
        out["holes"] = holes
    if par is not None:
        out["par"] = par
    if lat is not None and lng is not None:
        out["lat"] = lat
        out["lng"] = lng
    # Strip empty strings to keep JSON tight
    return {k: v for k, v in out.items() if not (isinstance(v, str) and v == "")}


def main():
    if not CSV_PATH.exists():
        print(f"CSV not found: {CSV_PATH}", file=sys.stderr)
        sys.exit(1)
    if not DB_PATH.exists():
        print(f"master_db.json not found: {DB_PATH}", file=sys.stderr)
        sys.exit(1)

    with DB_PATH.open(encoding="utf-8") as f:
        db = json.load(f)

    courses = db.get("courses") or db.get("restaurants") or []
    by_pid = {c["place_id"]: c for c in courses}

    enriched = 0
    added = 0
    skipped = 0

    with CSV_PATH.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            pid = row.get("place_id")
            if not pid:
                continue
            extras = csv_extras(row)
            if pid in by_pid:
                by_pid[pid].update(extras)
                enriched += 1
                continue
            # Net-new: only add if it's a golf-filtered place
            if not extras.get("is_golf_filtered"):
                skipped += 1
                continue
            new_course = synth_course_from_csv(row)
            new_course.update(extras)
            courses.append(new_course)
            by_pid[pid] = new_course
            added += 1

    # Recompute city_counts / category_counts and metadata
    city_counts: dict[str, int] = {}
    category_counts: dict[str, int] = {}
    for c in courses:
        cl = c.get("city_label") or ""
        if cl:
            city_counts[cl] = city_counts.get(cl, 0) + 1
        for cat in c.get("categories") or []:
            category_counts[cat] = category_counts.get(cat, 0) + 1

    db["courses"] = courses
    db["total_courses"] = len(courses)
    db["city_counts"] = dict(sorted(city_counts.items(), key=lambda x: -x[1]))
    db["category_counts"] = dict(sorted(category_counts.items(), key=lambda x: -x[1]))
    db["csv_merged_at"] = datetime.now(timezone.utc).isoformat()

    with DB_PATH.open("w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f"enriched existing: {enriched}")
    print(f"added new (golf-filtered): {added}")
    print(f"skipped (CSV-only, no signal): {skipped}")
    print(f"total courses now: {len(courses)}")


if __name__ == "__main__":
    main()
