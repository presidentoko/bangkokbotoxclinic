"""Merge the Chiang Mai / Pattaya / Phuket grid scans into hospitals.json.

Tags every record — old and new — with a `city` field, then appends the new
cities. The tag matters beyond labelling: `lib/hospitals.ts` and the Bangkok
hub/24h/emergency/district pages all call `loadHospitals()` unfiltered, and
every one of them prints Bangkok-specific copy ("โรงพยาบาลสัตว์ในกรุงเทพ N
แห่ง"). Merging without a way to tell the cities apart would make that copy
wrong the moment it runs — a Chiang Mai clinic counted into "Bangkok's 985",
or worse, its own detail page schema falling back to `addressRegion:
"กรุงเทพมหานคร"` because nothing said otherwise. The `city` field is what lets
those pages filter back down to just Bangkok, unchanged, while the new records
sit in the same file waiting for their own pages.

Coordinates for the new records are still the grid *probe point*, not the
clinic's own location — exactly the state Bangkok's 496 were in before
`backfill_places.py` corrected them via the Places API (New). That backfill is
billed per record (~$0.017 each engine call), so it is not run automatically
here; `hasPreciseCoord()` in lib/hospitals.ts already treats a coordinate
shared with other records as untrustworthy and hides the map/geo claim
accordingly, so publishing before backfill is safe, just imprecise.

`has_surgery` is set to `false` rather than defaulting to `True`, unlike the
original Bangkok transform — that hardcoded `True` was a fabrication bug
(feedback_petvet_fabricated_data.md); it is not reproduced here for new
records, but existing Bangkok records are left as they already are (a
separate, already-known issue, not this script's to fix).

    python petvet/merge_cities.py --dry-run
    python petvet/merge_cities.py --apply
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOSPITALS = ROOT / "web-petbkk" / "data" / "hospitals.json"

CITIES = {
    "chiangmai": ROOT / "petvet_output_chiangmai" / "discovered_places.csv",
    "pattaya":   ROOT / "petvet_output_pattaya" / "discovered_places.csv",
    "phuket":    ROOT / "petvet_output_phuket" / "discovered_places.csv",
}


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")[:80]


def _float_or_none(val: str) -> float | None:
    try:
        return float(val) if val and val.strip() else None
    except ValueError:
        return None


def _int_or_none(val: str) -> int | None:
    try:
        return int(float(val)) if val and val.strip() else None
    except ValueError:
        return None


def transform_row(row: dict, city: str, taken_ids: set[str]) -> dict | None:
    name = row.get("name", "").strip()
    if not name:
        return None
    lat = _float_or_none(row.get("first_seen_lat", ""))
    lng = _float_or_none(row.get("first_seen_lng", ""))
    if lat is None or lng is None or lat == 0 or lng == 0:
        return None

    raw_text = (row.get("raw_card_text", "") or "").lower()
    is_24h = (
        "24" in name
        or "ตลอด 24" in raw_text
        or "open 24" in raw_text
        or "24 hours" in raw_text
        or "24ชม" in raw_text
    )

    base_id = slugify(name) or slugify(row.get("place_id", ""))
    hid = base_id
    n = 2
    while hid in taken_ids:
        hid = f"{base_id}-{n}"
        n += 1
    taken_ids.add(hid)

    return {
        "id": hid,
        "name_th": name,
        "name_en": name,
        "address": row.get("address_hint", ""),
        "lat": lat,
        "lng": lng,
        "phone": "",
        "is_24h": is_24h,
        "has_emergency": "ฉุกเฉิน" in name or "emergency" in name.lower(),
        "has_surgery": False,
        "price_consult": None,
        "price_emergency_surcharge": None,
        "price_neuter_male": None,
        "price_neuter_female": None,
        "price_vaccine": None,
        "google_rating": _float_or_none(row.get("rating", "")),
        "google_review_count": _int_or_none(row.get("review_count", "")),
        "google_place_id": row.get("place_id", ""),
        "updated_at": "",
        "city": city,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    existing = json.loads(HOSPITALS.read_text(encoding="utf-8"))
    taken_ids = {h["id"] for h in existing}
    taken_place_ids = {h.get("google_place_id") for h in existing if h.get("google_place_id")}

    tagged_existing = 0
    for h in existing:
        if "city" not in h:
            h["city"] = "bangkok"
            tagged_existing += 1

    added: list[dict] = []
    skipped_dupe = 0
    for city, path in CITIES.items():
        if not path.exists():
            print(f"  {city}: no CSV at {path}, skipping")
            continue
        rows = list(csv.DictReader(path.open(encoding="utf-8-sig")))
        city_added = 0
        for row in rows:
            pid = row.get("place_id", "")
            if pid and pid in taken_place_ids:
                skipped_dupe += 1
                continue
            rec = transform_row(row, city, taken_ids)
            if rec:
                added.append(rec)
                if pid:
                    taken_place_ids.add(pid)
                city_added += 1
        print(f"  {city}: {city_added} of {len(rows)} rows added")

    print(f"\nexisting Bangkok records freshly tagged city='bangkok': {tagged_existing}")
    print(f"duplicate place_id skipped (already in file): {skipped_dupe}")
    print(f"new records: {len(added)}")
    print(f"total after merge: {len(existing) + len(added)}")

    if not args.apply:
        print("\ndry run — re-run with --apply to write hospitals.json")
        return

    backup = HOSPITALS.with_suffix(".json.citybak")
    shutil.copy2(HOSPITALS, backup)
    HOSPITALS.write_text(
        json.dumps(existing + added, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\nwrote {HOSPITALS} (backup {backup.name})")


if __name__ == "__main__":
    main()
