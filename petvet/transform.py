"""Convert petvet_output/discovered_places.csv → data/hospitals.json"""
from __future__ import annotations
import csv
import json
import re
from pathlib import Path

ROOT   = Path(__file__).parent.parent
INPUT  = ROOT / "petvet_output" / "discovered_places.csv"
OUTPUT = ROOT / "data" / "hospitals.json"


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


def transform_row(row: dict) -> dict | None:
    name = row.get("name", "").strip()
    if not name:
        return None
    lat = _float_or_none(row.get("first_seen_lat", ""))
    lng = _float_or_none(row.get("first_seen_lng", ""))
    if lat is None or lng is None or lat == 0 or lng == 0:
        return None

    raw_text = row.get("raw_card_text", "").lower()
    is_24h = (
        "24" in name
        or "ตลอด 24" in raw_text
        or "open 24" in raw_text
        or "24 hours" in raw_text
        or "24ชม" in raw_text
    )

    return {
        "id": slugify(name),
        "name_th": name,
        "name_en": name,
        "address": row.get("address_hint", ""),
        "lat": lat,
        "lng": lng,
        "phone": "",
        "is_24h": is_24h,
        "has_emergency": "ฉุกเฉิน" in name or "emergency" in name.lower(),
        "has_surgery": True,
        "price_consult": None,
        "price_emergency_surcharge": None,
        "price_neuter_male": None,
        "price_neuter_female": None,
        "price_vaccine": None,
        "google_rating": _float_or_none(row.get("rating", "")),
        "google_review_count": _int_or_none(row.get("review_count", "")),
        "google_place_id": row.get("place_id", ""),
        "updated_at": "",
    }


def main():
    if not INPUT.exists():
        print(f"Input not found: {INPUT}")
        return

    hospitals: list[dict] = []
    seen: set[str] = set()

    with open(INPUT, encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            h = transform_row(row)
            if h and h["id"] not in seen:
                seen.add(h["id"])
                hospitals.append(h)

    OUTPUT.parent.mkdir(exist_ok=True)
    OUTPUT.write_text(json.dumps(hospitals, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ {len(hospitals)} hospitals → {OUTPUT}")


if __name__ == "__main__":
    main()
