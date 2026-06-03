from __future__ import annotations

import json
import sys
from pathlib import Path

from engine.load import load_clinics_csv, load_reviews
from engine.procedures import tag_procedures
from engine.resolve import dedupe_clinics


def build_canonical(sources: list[tuple[Path, str]], out_path: Path) -> int:
    """Load every (output_dir, city), dedupe, tag, write canonical.json.

    Each output_dir is expected to contain `clinics.csv` and a `reviews/` subdir.
    Returns the number of canonical clinics written.
    """
    all_clinics = []
    for output_dir, city in sources:
        clinics_csv = output_dir / "clinics.csv"
        if not clinics_csv.exists():
            continue
        reviews_dir = output_dir / "reviews"
        for clinic in load_clinics_csv(clinics_csv, city=city):
            clinic.reviews = load_reviews(reviews_dir, clinic.place_id)
            all_clinics.append(clinic)

    deduped = dedupe_clinics(all_clinics)
    for clinic in deduped:
        clinic.procedures = tag_procedures(clinic)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = [c.to_dict() for c in deduped]
    out_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return len(deduped)


# Known fleet output directories (relative to repo root). Extend as cities are added.
DEFAULT_SOURCES: list[tuple[str, str]] = [
    ("dental_output/bangkok", "bangkok"),
    ("bangkok_clinics/output", "bangkok"),
    ("pattaya/clinics_output", "pattaya"),
    ("phuket/clinics_output", "phuket"),
    ("chiang_mai/clinics_output", "chiang_mai"),
]


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    sources = [(repo_root / rel, city) for rel, city in DEFAULT_SOURCES]
    out_path = repo_root / "engine" / "data" / "canonical.json"
    count = build_canonical(sources, out_path)
    print(f"[canonical] wrote {count} clinics -> {out_path}")


if __name__ == "__main__":
    sys.exit(main())
