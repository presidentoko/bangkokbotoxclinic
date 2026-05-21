"""
Wrapper: ingest all merge_handoff/sources/output_hair_v2_<city>/ dirs via
the existing ingest_merge_handoff.ingest_one() function.

Produced by convert_hair_project_to_handoff.py. After ingest, the 15
hair_v2_<city> exports are ready for build_master_db.py to pick up via
SOURCES entries.
"""
from __future__ import annotations
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from ingest_merge_handoff import ingest_one  # type: ignore

SOURCES_DIR = ROOT / "merge_handoff" / "sources"


def main():
    dirs = sorted(p.name[len("output_"):] for p in SOURCES_DIR.glob("output_hair_v2_*") if p.is_dir())
    if not dirs:
        print("No output_hair_v2_* dirs found. Run convert_hair_project_to_handoff.py first.")
        sys.exit(1)
    print(f"Ingesting {len(dirs)} hair_v2 city sources...")
    print()
    totals = {"clinics": 0, "skipped": 0}
    for name in dirs:
        stats = ingest_one(name)
        if stats:
            totals["clinics"] += stats.get("converted", 0)
            totals["skipped"] += stats.get("skipped_no_pid", 0)
        print()
    print(f"Totals: {totals['clinics']} clinics ingested, {totals['skipped']} skipped (no place_id)")


if __name__ == "__main__":
    main()
