"""Publish the opening hours already sitting in places_backfill.json.

The August backfill asked Places for ``regularOpeningHours`` and got weekday
descriptions for 442 of 497 clinics, but ``apply_places.py`` only merged
coordinates, phone, rating and website — the hours were fetched, paid for and
then dropped on the floor. Opening hours are the single most-asked thing about
a clinic, so they are worth publishing.

They go to their own file rather than into hospitals.json. ``lib/hospitals.ts``
is imported by a ``'use client'`` component, so every byte added there ships to
every visitor's browser; hours are only ever rendered on the statically built
detail page, which reads them server-side.

Also drops clinics Google now reports as CLOSED_PERMANENTLY.

    python petvet/apply_hours.py --dry-run
    python petvet/apply_hours.py
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHECKPOINT = ROOT / "petvet" / "places_backfill.json"
HOSPITALS = ROOT / "web-petbkk" / "data" / "hospitals.json"
HOURS_OUT = ROOT / "web-petbkk" / "data" / "hospital-hours.json"

# Places returns Thai day names; schema.org wants English enum values.
DAY_MAP = {
    "วันจันทร์": "Monday", "วันอังคาร": "Tuesday", "วันพุธ": "Wednesday",
    "วันพฤหัสบดี": "Thursday", "วันศุกร์": "Friday", "วันเสาร์": "Saturday",
    "วันอาทิตย์": "Sunday",
    # Places answers in the locale it detects; a handful of listings come back
    # in English even though the rest of the record is Thai.
    "Monday": "Monday", "Tuesday": "Tuesday", "Wednesday": "Wednesday",
    "Thursday": "Thursday", "Friday": "Friday", "Saturday": "Saturday",
    "Sunday": "Sunday",
}
CLOSED_WORDS = ("ปิด", "Closed")
OPEN_24H = ("เปิด 24 ชั่วโมง", "Open 24 hours", "เปิดตลอด 24 ชั่วโมง")

_TIME = re.compile(r"(\d{1,2}):(\d{2})")
# "7:30–14:00, 14:30–19:30" — a lunch break, on 13 of 3,094 weekday lines.
_RANGE = re.compile(r"(\d{1,2}):(\d{2})\s*[–\-—~]\s*(\d{1,2}):(\d{2})")


def parse_day(line: str) -> list[dict]:
    """Turn "วันจันทร์: 8:00–16:00" into schema.org-shaped rows.

    Returns a row per opening range, not one merged range: collapsing
    "7:30–14:00, 14:30–19:30" to 7:30–19:30 would advertise the clinic as open
    through a half-hour it is shut.
    """
    if ":" not in line:
        return []
    day_th, _, rest = line.partition(":")
    day = DAY_MAP.get(day_th.strip())
    if not day:
        return []
    rest = rest.strip()
    # Order and the digit guard both matter. Thai "เปิด" (open) contains "ปิด"
    # (closed) as a substring, so a naive `"ปิด" in rest` reports every 24-hour
    # clinic as shut for the day. Only a line with no clock time at all can mean
    # closed.
    if any(w in rest for w in OPEN_24H):
        return [{"day": day, "opens": "00:00", "closes": "23:59"}]
    if not _TIME.search(rest):
        return [{"day": day, "closed": True}] if any(w in rest for w in CLOSED_WORDS) else []
    return [
        {
            "day": day,
            "opens": f"{int(h1):02d}:{m1}",
            "closes": f"{int(h2):02d}:{m2}",
        }
        for h1, m1, h2, m2 in _RANGE.findall(rest)
    ]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    checkpoint = json.loads(CHECKPOINT.read_text(encoding="utf-8"))
    hospitals = json.loads(HOSPITALS.read_text(encoding="utf-8"))

    closed_ids = {
        hid for hid, rec in checkpoint.items()
        if isinstance(rec, dict) and rec.get("businessStatus") == "CLOSED_PERMANENTLY"
    }

    hours: dict[str, dict] = {}
    structured_ok = 0
    for h in hospitals:
        rec = checkpoint.get(h["id"])
        if not isinstance(rec, dict):
            continue
        lines = (rec.get("regularOpeningHours") or {}).get("weekdayDescriptions") or []
        if not lines:
            continue
        spec = [row for l in lines for row in parse_day(l)]
        if spec:
            structured_ok += 1
        hours[h["id"]] = {"text": lines, "spec": spec}

    kept = [h for h in hospitals if h["id"] not in closed_ids]
    dropped = [h for h in hospitals if h["id"] in closed_ids]

    print(f"hospitals            {len(hospitals)} -> {len(kept)}")
    print(f"dropped (closed)     {[h['id'] for h in dropped]}")
    print(f"hours published      {len(hours)}  "
          f"({structured_ok} parsed into openingHoursSpecification)")
    size = len(json.dumps(hours, ensure_ascii=False).encode())
    print(f"hospital-hours.json  {size/1024:.0f} KB (server-side only)")

    if args.dry_run:
        print("\n--dry-run: no files written")
        return

    if dropped:
        shutil.copy2(HOSPITALS, HOSPITALS.with_suffix(".json.bak"))
        HOSPITALS.write_text(json.dumps(kept, ensure_ascii=False), encoding="utf-8")
        print(f"rewrote {HOSPITALS.name}")
    HOURS_OUT.write_text(json.dumps(hours, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {HOURS_OUT.name}")


if __name__ == "__main__":
    main()
