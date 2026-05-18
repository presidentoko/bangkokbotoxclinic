"""
Ingest merge_handoff/sources/output_{dental,hair} into bangkok_clinics-format
output so build_master_db.py can pick them up via its SOURCES list.

Schema mapping (merge_handoff GMaps export → bangkok_clinics):

  merge_handoff clinics.csv (10 cols)
    city, name, category, rating, review_count, address,
    phone, website, place_id, url
  → bangkok_clinics clinics.csv (17 cols)
    place_id, name, primary_type, formatted_address, plus_code,
    latitude, longitude, phone, website, menu_url,
    rating, total_reviews, price_level, price_symbol,
    business_status, editorial_summary, maps_url

  merge_handoff reviews.csv (8 cols)
    place_id, city, clinic_name, review_id,
    reviewer_name, reviewer_rating, date, text
  → bangkok_clinics reviews/<full_pid>_reviews.csv (15 cols)
    review_id, place_id, restaurant_name, rating, text,
    author_name, author_id, author_uri, author_photo_uri,
    author_is_local_guide, author_review_count,
    author_photo_count, relative_date, spent_amount, sort_source

Place_id format:
  merge_handoff stores half: "0x30e29eb5a2505035"
  We need full pair from URL: ".../!1s0x...:0x...!..."
  → output as "0x...:0x..." for clinics.csv (bangkok_clinics uses colon)
  → review filenames use "0x..._0x..." (colon → underscore) per build_master_db

Fields we DON'T have:
  - lat/lng (extractable from URL: !3d<lat>!4d<lng>)
  - business_status, editorial_summary, plus_code, price_level/symbol
  - author_id/uri/photo, local_guide, author_review_count
  These go in as empty/null. Trust Score levers that depend on missing
  fields (Local Guide ratio, reviewer authority) will be 0 for these
  clinics. Acceptable degradation — directory listing still works.

Output:
  merge_handoff/_export/dental/clinics.csv + reviews/
  merge_handoff/_export/hair/clinics.csv + reviews/
"""
from __future__ import annotations

import csv
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCES_DIR = ROOT / "merge_handoff" / "sources"
EXPORT_DIR = ROOT / "merge_handoff" / "_export"

# Regex: extract full place_id pair from a Google Maps URL like
#   .../data=!4m7!3m6!1s<cid1>:<cid2>!8m2!3d<lat>!4d<lng>!...
RE_FULL_PLACE_ID = re.compile(r"!1s(0x[a-f0-9]+):(0x[a-f0-9]+)!")
RE_LATLNG = re.compile(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)")

BK_CLINICS_HEADER = [
    "place_id", "name", "primary_type", "formatted_address", "plus_code",
    "latitude", "longitude", "phone", "website", "menu_url",
    "rating", "total_reviews", "price_level", "price_symbol",
    "business_status", "editorial_summary", "maps_url",
]

BK_REVIEWS_HEADER = [
    "review_id", "place_id", "restaurant_name", "rating", "text",
    "author_name", "author_id", "author_uri", "author_photo_uri",
    "author_is_local_guide", "author_review_count",
    "author_photo_count", "relative_date", "spent_amount", "sort_source",
]


def extract_full_place_id(url: str) -> tuple[str, str | None, str | None]:
    """Return (full_place_id_with_colon, lat, lng) or (None, None, None) on failure."""
    m = RE_FULL_PLACE_ID.search(url or "")
    if not m:
        return ("", None, None)
    full = f"{m.group(1)}:{m.group(2)}"
    lat = lng = None
    m2 = RE_LATLNG.search(url or "")
    if m2:
        lat, lng = m2.group(1), m2.group(2)
    return (full, lat, lng)


def convert_clinics(src_csv: Path, out_csv: Path) -> dict[str, str]:
    """Write bangkok_clinics-format clinics.csv. Return {half_pid: full_pid} map for review join."""
    out_csv.parent.mkdir(parents=True, exist_ok=True)
    pid_map: dict[str, str] = {}  # "0x30e29eb..." → "0x30e29eb...:0x...."
    converted = skipped_no_pid = 0

    with open(src_csv, encoding="utf-8-sig", errors="replace", newline="") as f_in, \
         open(out_csv, "w", encoding="utf-8-sig", newline="") as f_out:
        reader = csv.DictReader(f_in)
        writer = csv.writer(f_out, quoting=csv.QUOTE_NONNUMERIC)
        writer.writerow(BK_CLINICS_HEADER)

        for row in reader:
            half_pid = row.get("place_id", "").strip()
            url = row.get("url", "")
            full_pid, lat, lng = extract_full_place_id(url)
            if not full_pid:
                # Fallback: maybe the half_pid is enough if URL is missing.
                # Without full pid we can't join reviews and master_db dedupe is partial.
                if half_pid:
                    full_pid = half_pid  # degraded — review join may fail
                else:
                    skipped_no_pid += 1
                    continue

            pid_map[half_pid] = full_pid

            writer.writerow([
                full_pid,
                row.get("name", ""),
                row.get("category", "") or "Clinic",     # primary_type ← category
                row.get("address", ""),                  # formatted_address
                "",                                      # plus_code
                lat or "",
                lng or "",
                row.get("phone", ""),
                row.get("website", ""),
                "",                                      # menu_url
                row.get("rating", "") or "0",
                row.get("review_count", "") or "0",      # total_reviews
                "",                                      # price_level
                "",                                      # price_symbol
                "Open",                                  # business_status — assume Open
                "",                                      # editorial_summary
                url,                                     # maps_url
            ])
            converted += 1

    return {"_pid_map": pid_map, "_stats": {"converted": converted, "skipped_no_pid": skipped_no_pid}}


def convert_reviews(src_csv: Path, out_dir: Path, pid_map: dict[str, str]) -> int:
    """Group reviews.csv rows by place_id, write per-place files in bangkok_clinics format."""
    out_dir.mkdir(parents=True, exist_ok=True)
    by_pid: dict[str, list[dict]] = defaultdict(list)

    with open(src_csv, encoding="utf-8-sig", errors="replace", newline="") as f:
        for row in csv.DictReader(f):
            half_pid = row.get("place_id", "").strip()
            if not half_pid:
                continue
            full_pid = pid_map.get(half_pid, half_pid)
            by_pid[full_pid].append(row)

    files_written = 0
    for full_pid, rows in by_pid.items():
        # bangkok_clinics review filenames replace colon with underscore.
        fn_base = full_pid.replace(":", "_")
        reviews_path = out_dir / f"{fn_base}_reviews.csv"
        with open(reviews_path, "w", encoding="utf-8-sig", newline="") as f_out:
            writer = csv.writer(f_out, quoting=csv.QUOTE_NONNUMERIC)
            writer.writerow(BK_REVIEWS_HEADER)
            for r in rows:
                writer.writerow([
                    r.get("review_id", ""),
                    full_pid,
                    r.get("clinic_name", ""),
                    r.get("reviewer_rating", "") or "0",
                    r.get("text", ""),
                    r.get("reviewer_name", ""),
                    "",   # author_id
                    "",   # author_uri
                    "",   # author_photo_uri
                    "",   # author_is_local_guide
                    "",   # author_review_count
                    "",   # author_photo_count
                    r.get("date", ""),
                    "",   # spent_amount
                    "",   # sort_source
                ])
        files_written += 1
    return files_written


def ingest_one(source_name: str) -> dict:
    src = SOURCES_DIR / f"output_{source_name}"
    out = EXPORT_DIR / source_name
    print(f"[{source_name}] {src} → {out}")

    clinics_src = src / "clinics.csv"
    clinics_out = out / "clinics.csv"
    if not clinics_src.exists():
        print(f"  ERROR: {clinics_src} not found")
        return {}
    result = convert_clinics(clinics_src, clinics_out)
    pid_map = result["_pid_map"]
    stats = result["_stats"]
    print(f"  clinics: {stats['converted']} converted, {stats['skipped_no_pid']} skipped (no place_id)")

    reviews_src = src / "reviews.csv"
    reviews_out = out / "reviews"
    if reviews_src.exists():
        n = convert_reviews(reviews_src, reviews_out, pid_map)
        print(f"  reviews: {n} per-place review files written")
    else:
        print(f"  reviews: source not found, skipping")

    return stats


if __name__ == "__main__":
    print(f"ROOT: {ROOT}")
    print(f"sources: {SOURCES_DIR}")
    print(f"export:  {EXPORT_DIR}")
    print()
    for source in ["dental", "hair"]:
        ingest_one(source)
        print()
    print("Done. Add these to build_master_db.py SOURCES:")
    print(f"""
    {{
        "city_label": "Bangkok",
        "city_slug": "bangkok",
        "clinics_csv": ROOT / "merge_handoff" / "_export" / "dental" / "clinics.csv",
        "reviews_dir": ROOT / "merge_handoff" / "_export" / "dental" / "reviews",
    }},
    {{
        "city_label": "Bangkok",
        "city_slug": "bangkok",
        "clinics_csv": ROOT / "merge_handoff" / "_export" / "hair" / "clinics.csv",
        "reviews_dir": ROOT / "merge_handoff" / "_export" / "hair" / "reviews",
    }},
""")
