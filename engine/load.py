from __future__ import annotations

import csv
from pathlib import Path

from engine.models import Clinic, Review


def _to_float(value: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _to_int(value: str) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0


def load_clinics_csv(path: Path, city: str) -> list[Clinic]:
    """Load a fleet clinics.csv (utf-8-sig/BOM) into Clinic objects.

    Rows with an empty place_id are skipped (incomplete records).
    """
    clinics: list[Clinic] = []
    with open(path, encoding="utf-8-sig", newline="") as fh:
        for row in csv.DictReader(fh):
            place_id = (row.get("place_id") or "").strip()
            if not place_id:
                continue
            clinics.append(
                Clinic(
                    place_id=place_id,
                    name=(row.get("name") or "").strip(),
                    city=city,
                    lat=_to_float(row.get("latitude")),
                    lng=_to_float(row.get("longitude")),
                    address=(row.get("formatted_address") or "").strip(),
                    phone=(row.get("phone") or "").strip(),
                    website=(row.get("website") or "").strip(),
                    rating=_to_float(row.get("rating")),
                    total_reviews=_to_int(row.get("total_reviews")),
                    primary_type=(row.get("primary_type") or "").strip(),
                )
            )
    return clinics


def load_reviews(reviews_dir: Path, place_id: str) -> list[Review]:
    """Load reviews/<place_id>_reviews.csv. Returns [] if the file is absent."""
    path = reviews_dir / f"{place_id}_reviews.csv"
    if not path.exists():
        return []
    out: list[Review] = []
    with open(path, encoding="utf-8-sig", newline="") as fh:
        for row in csv.DictReader(fh):
            out.append(
                Review(
                    author=(row.get("author_name") or "").strip(),
                    rating=_to_float(row.get("rating")),
                    text=(row.get("text") or "").strip(),
                    source="google",
                    spent_amount=(row.get("spent_amount") or "").strip(),
                )
            )
    return out
