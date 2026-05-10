"""recover bangkok_clinics/output/clinics.csv from a known-good master_db.json snapshot.

Use only when scraper.py race-trashed clinics.csv. Maps JSON clinic objects back
to scraper CSV columns. NOT a perfect inverse — some optional fields (price_level,
plus_code, editorial_summary, menu_url) may be empty since master_db doesn't keep
them. Worst case scraper later refills them on re-scrape.
"""
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "recovered_master_db.json"
DST = ROOT / "bangkok_clinics" / "output" / "clinics.csv"

CSV_COLS = [
    "place_id", "name", "primary_type", "formatted_address",
    "plus_code", "latitude", "longitude",
    "phone", "website", "menu_url",
    "rating", "total_reviews",
    "price_level", "price_symbol",
    "business_status", "editorial_summary", "maps_url",
]


def main() -> int:
    if not SRC.exists():
        print(f"missing source: {SRC}", file=sys.stderr)
        return 1
    with open(SRC, encoding="utf-8") as f:
        db = json.load(f)
    clinics = db.get("clinics", [])
    print(f"source: {len(clinics)} clinics in {SRC.name}")

    rows = []
    for c in clinics:
        rows.append({
            "place_id": c.get("place_id", ""),
            "name": c.get("name", ""),
            "primary_type": c.get("primary_type", ""),
            "formatted_address": c.get("address", ""),
            "plus_code": "",
            "latitude": c.get("lat", "") if c.get("lat") is not None else "",
            "longitude": c.get("lng", "") if c.get("lng") is not None else "",
            "phone": c.get("phone", ""),
            "website": c.get("website", ""),
            "menu_url": "",
            "rating": c.get("rating", ""),
            "total_reviews": c.get("total_reviews", ""),
            "price_level": "",
            "price_symbol": "",
            "business_status": c.get("business_status", ""),
            "editorial_summary": "",
            "maps_url": c.get("maps_url", ""),
        })

    # Write with utf-8-sig (BOM) to match scraper output convention
    with open(DST, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLS, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

    print(f"wrote {len(rows)} rows to {DST.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
