"""
Convert hair-project CSV (thaihairguide_master.csv) → merge_handoff sources format.

Pipeline:
  hair-project (646 rows, 45 cols)
    ↓ (this script)
  merge_handoff/sources/output_hair_v2/clinics.csv (per-city, 10 cols)
  merge_handoff/sources/output_hair_v2/reviews.csv (8 cols)
    ↓ (scripts/ingest_merge_handoff.py — already exists)
  merge_handoff/_export/hair_v2/{clinics.csv, reviews/}
    ↓ (web/scripts/build_master_db.py — needs SOURCES entry added)
  web/data/master_db.json

Skips Bookimed-only rows (bm_*) — no Google place_id → no hex extraction possible.
Those can be added as a separate Bookimed-only source later via external_reviews field.
"""
from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

try: sys.stdout.reconfigure(encoding="utf-8")
except: pass

HAIR_CSV = Path(r"C:\Users\yn\Downloads\hair-project\hair-project\data\thaihairguide_master.csv")
ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "merge_handoff" / "sources" / "output_hair_v2"

# extract hex place_id pair from Google Maps URL (same regex as ingest_merge_handoff.py)
RE_HEX_PID = re.compile(r"!1s(0x[a-f0-9]+):(0x[a-f0-9]+)!")

# merge_handoff sources/output_*/clinics.csv schema (10 cols)
CLINIC_COLS = ["city", "name", "category", "rating", "review_count",
               "address", "phone", "website", "place_id", "url"]

# merge_handoff sources/output_*/reviews.csv schema (8 cols)
REVIEW_COLS = ["place_id", "city", "clinic_name", "review_id",
               "reviewer_name", "reviewer_rating", "date", "text"]


def normalize_city(city: str) -> str:
    """Map hair-project city values to canonical labels matching existing master_db."""
    s = (city or "").strip()
    if not s: return ""
    # Canonical mapping — match cities already in master_db's city_counts
    aliases = {
        "bangkok": "Bangkok", "bkk": "Bangkok", "krung thep": "Bangkok",
        "pattaya": "Pattaya", "chonburi": "Pattaya",
        "phuket": "Phuket", "patong": "Phuket",
        "chiang mai": "Chiang Mai", "chiangmai": "Chiang Mai",
        "chiang rai": "Chiang Rai",
        "koh samui": "Koh Samui", "ko samui": "Koh Samui", "samui": "Koh Samui",
        "krabi": "Krabi", "hua hin": "Hua Hin", "huahin": "Hua Hin",
        "khon kaen": "Khon Kaen", "khonkaen": "Khon Kaen",
        "korat": "Korat", "nakhon ratchasima": "Korat",
        "hat yai": "Hat Yai", "hatyai": "Hat Yai", "songkhla": "Hat Yai",
        "udon thani": "Udon Thani", "udonthani": "Udon Thani",
        "ayutthaya": "Ayutthaya",
        "nakhon si thammarat": "Nakhon Si Thammarat",
    }
    return aliases.get(s.lower(), s)


def safe_float(v, default=0.0):
    try:
        f = float(str(v).strip() or 0)
        return f if 0 <= f <= 5 else default  # Bookimed scale weirdness — reject if not 0-5
    except (ValueError, TypeError):
        return default


def safe_int(v, default=0):
    try:
        return int(float(str(v).strip() or 0))
    except (ValueError, TypeError):
        return default


def city_slug(label: str) -> str:
    return label.lower().replace(" ", "_") if label else "unknown"


def convert():
    with open(HAIR_CSV, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    n_total = len(rows)
    n_bookimed_skipped = 0
    n_no_hex = 0
    n_written = 0
    n_reviews = 0

    # Per-city buckets: build_master_db.py SOURCES is per-(city_label, dir).
    # Split hair_v2 into one source dir per city so each clinic gets correct city_label.
    by_city_clinics: dict[str, list[dict]] = {}
    by_city_reviews: dict[str, list[dict]] = {}

    for r in rows:
        url = (r.get("google_maps_url") or "").strip()
        # Skip Bookimed-only (no Google URL)
        if not url:
            n_bookimed_skipped += 1
            continue
        m = RE_HEX_PID.search(url)
        if not m:
            n_no_hex += 1
            continue
        hex_pid = f"{m.group(1)}:{m.group(2)}"

        city = normalize_city(r.get("city"))
        name = (r.get("name") or "").strip()
        if not name:
            continue

        # rating: only trust if 0-5; hair-project assigns Bookimed score to rating
        # for some Google rows (data bleed). Use safe_float guard.
        rating = safe_float(r.get("rating"))
        review_count = safe_int(r.get("review_count"))

        if not city:
            continue  # skip rows with no city — can't bucket

        by_city_clinics.setdefault(city, []).append({
            "city": city,
            "name": name,
            "category": (r.get("category") or "Hair Transplant Clinic").strip(),
            "rating": f"{rating:.1f}" if rating else "",
            "review_count": str(review_count) if review_count else "",
            "address": (r.get("address") or "").strip(),
            "phone": (r.get("phone") or "").strip(),
            "website": (r.get("website") or "").strip(),
            "place_id": m.group(1),  # half — ingest script expands from URL
            "url": url,
        })
        n_written += 1

        # Pull reviews from reviews_json if present
        reviews_json = (r.get("reviews_json") or "").strip()
        if reviews_json:
            try:
                rev_list = json.loads(reviews_json)
                if isinstance(rev_list, list):
                    for i, rev in enumerate(rev_list):
                        if not isinstance(rev, dict):
                            continue
                        text = (rev.get("text") or "").strip()
                        if not text:
                            continue
                        rev_rating = rev.get("rating")
                        try:
                            rev_rating = float(rev_rating) if rev_rating else None
                            if rev_rating and not (0 <= rev_rating <= 5):
                                rev_rating = None
                        except (ValueError, TypeError):
                            rev_rating = None
                        by_city_reviews.setdefault(city, []).append({
                            "place_id": m.group(1),
                            "city": city,
                            "clinic_name": name,
                            "review_id": f"{m.group(1)}_{i}",
                            "reviewer_name": (rev.get("reviewer") or rev.get("author") or "").strip(),
                            "reviewer_rating": str(rev_rating) if rev_rating else "",
                            "date": (rev.get("date") or "").strip(),
                            "text": text,
                        })
                        n_reviews += 1
            except (json.JSONDecodeError, TypeError):
                pass

    # Write per-city dirs: merge_handoff/sources/output_hair_v2_<city_slug>/
    base = ROOT / "merge_handoff" / "sources"
    written_dirs = []
    for city, clinics in by_city_clinics.items():
        slug = city_slug(city)
        out_dir = base / f"output_hair_v2_{slug}"
        out_dir.mkdir(parents=True, exist_ok=True)
        with open(out_dir / "clinics.csv", "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=CLINIC_COLS)
            w.writeheader()
            w.writerows(clinics)
        reviews = by_city_reviews.get(city, [])
        with open(out_dir / "reviews.csv", "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=REVIEW_COLS)
            w.writeheader()
            w.writerows(reviews)
        written_dirs.append((slug, city, len(clinics), len(reviews)))

    # Summary
    print(f"Hair-project conversion → merge_handoff sources/output_hair_v2_<city>/")
    print(f"  total rows in: {n_total}")
    print(f"  Bookimed-only (skipped — no Google URL): {n_bookimed_skipped}")
    print(f"  no extractable hex place_id: {n_no_hex}")
    print(f"  clinics written: {n_written} across {len(written_dirs)} cities")
    print(f"  reviews extracted: {n_reviews}")
    print()
    print(f"  per-city breakdown:")
    for slug, city, nc, nr in sorted(written_dirs, key=lambda x: -x[2]):
        print(f"    output_hair_v2_{slug:30}  city='{city:25}'  clinics={nc:3}  reviews={nr:4}")

    # Emit SOURCES snippets to copy into build_master_db.py
    print()
    print(f"  ADD THESE TO web/scripts/build_master_db.py SOURCES list:")
    for slug, city, _, _ in sorted(written_dirs, key=lambda x: -x[2]):
        # city_slug for master_db: use lowercase dash-separated (matches existing pattern like 'chiang-mai')
        mdb_slug = city.lower().replace(" ", "-")
        print(f'    {{ "city_label": "{city}", "city_slug": "{mdb_slug}",')
        print(f'      "clinics_csv": ROOT / "merge_handoff" / "_export" / "hair_v2_{slug}" / "clinics.csv",')
        print(f'      "reviews_dir": ROOT / "merge_handoff" / "_export" / "hair_v2_{slug}" / "reviews" }},')


if __name__ == "__main__":
    convert()
