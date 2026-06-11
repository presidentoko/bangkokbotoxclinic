from __future__ import annotations

import json
import sys
from pathlib import Path

from engine.load import load_clinics_csv, load_reviews
from engine.procedures import tag_procedures
from engine.resolve import dedupe_clinics


def _load_opt_out(repo_root: Path) -> set[str]:
    p = repo_root / "data" / "opt_out.json"
    if not p.exists():
        return set()
    data = json.loads(p.read_text(encoding="utf-8"))
    ids: set[str] = set()
    for entry in data.get("blocked", []):
        for field in ("id", "slug", "name"):
            v = entry.get(field, "")
            if v:
                ids.add(v.lower())
    return ids


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

    repo_root = out_path.resolve().parents[1]
    opt_out = _load_opt_out(repo_root)
    deduped = dedupe_clinics(all_clinics)
    if opt_out:
        before = len(deduped)
        deduped = [
            c for c in deduped
            if not any(v in opt_out for v in (
                (c.place_id or "").lower(),
                (c.slug or "").lower(),
                (c.name or "").lower(),
            ))
        ]
        removed = before - len(deduped)
        if removed:
            print(f"[canonical] opt-out removed {removed} clinic(s)")
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
