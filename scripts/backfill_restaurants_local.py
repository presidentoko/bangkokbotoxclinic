#!/usr/bin/env python3
"""
Fill the restaurant records in web-thaigle from data already on disk.

The 3,269 restaurant pages carry no photo and no opening hours — not because
the data was never collected, but because the thaigle build never read the
files it was collected into. bangkok_reviews and pattaya both wrote hours and
photo CSVs during their scrape runs, and web-restaurants' own master_db has a
photos field the thaigle copy lacks. This merges all three, which costs
nothing, before any decision about buying the remainder from Apify.

Rules, matching enrich_from_apify.py so the two behave the same way:
- Fill only. An existing value is never replaced, so re-running is a no-op and
  a later Apify run cannot be undone by re-running this.
- Never add or remove a restaurant. The page set is derived from slug-map.json
  and must not move; the script asserts the count is unchanged before writing.
- Report, don't act, on anything ambiguous.

Usage:
    python scripts/backfill_restaurants_local.py [--dry-run]
"""
from __future__ import annotations

import argparse
import csv
import sys
import datetime as dt
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
THAIGLE_DB = ROOT / "web-thaigle" / "data" / "master_db.json"

HOURS_CSVS = [
    ROOT / "bangkok_reviews" / "output" / "restaurant_hours.csv",
    ROOT / "pattaya" / "output" / "restaurant_hours.csv",
]
PHOTO_DIRS = [
    ROOT / "bangkok_reviews" / "output" / "photos",
    ROOT / "pattaya" / "output" / "photos",
]
SIBLING_DB = ROOT / "web-restaurants" / "data" / "master_db.json"

# One scrape run wrote an unterminated quote, so the reader sees the rest of
# the file as a single 1.2 MB field and raises past the 128 KB default. The
# row is skipped by the ":" check below either way; this just lets the reader
# reach it instead of dying on it.
csv.field_size_limit(min(sys.maxsize, 2**31 - 1))

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Google renders a two-shift day as one unbroken string — "12–3 PM6:45–10:30 PM"
# — because the shifts are separate DOM nodes and the scrape took textContent.
# Split where a meridiem is immediately followed by a digit; nothing else in
# these values has that shape.
SHIFT_JOIN = re.compile(r"(?<=[AP]M)(?=\d)")


def clean_hours(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return ""
    #   (narrow no-break space) shows up between the time and meridiem and
    # renders as a stray box in some fonts.
    text = text.replace(" ", " ").replace(" ", " ")
    text = SHIFT_JOIN.sub(", ", text)
    return re.sub(r"\s+", " ", text).strip()


def load_hours() -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    for path in HOURS_CSVS:
        if not path.exists():
            print(f"[hours] missing, skipped: {path}")
            continue
        # utf-8-sig: the header carries a BOM, so a plain utf-8 read names the
        # first column "﻿place_id" and every lookup silently misses.
        with path.open(encoding="utf-8-sig", newline="") as fh:
            rows = malformed = 0
            for row in csv.DictReader(fh):
                pid = (row.get("place_id") or "").strip()
                day = (row.get("day") or "").strip()
                hours = clean_hours(row.get("hours_text") or "")
                # A truncated line ("0x3") has no colon and no day.
                if ":" not in pid or day not in DAYS or not hours:
                    malformed += 1
                    continue
                out.setdefault(pid, {})[day] = hours
                rows += 1
        print(f"[hours] {path.name}: {rows} rows, {malformed} skipped")
    return out


def load_photos() -> dict[str, list[dict[str, str]]]:
    out: dict[str, list[dict[str, str]]] = {}
    for d in PHOTO_DIRS:
        if not d.exists():
            continue
        for path in sorted(d.glob("*.csv")):
            try:
                with path.open(encoding="utf-8-sig", newline="") as fh:
                    photos = []
                    pid = ""
                    for row in csv.DictReader(fh):
                        pid = (row.get("place_id") or "").strip()
                        url = (row.get("url_medium") or row.get("url_thumb") or "").strip()
                        if url:
                            photos.append({"url": url, "alt": (row.get("alt") or "").strip()})
                    if pid and photos:
                        out.setdefault(pid, []).extend(photos[:6])
            except Exception as e:
                print(f"[photos] unreadable, skipped {path.name}: {e}")
    # The sibling site's db already merged a batch of these.
    if SIBLING_DB.exists():
        sib = json.loads(SIBLING_DB.read_text(encoding="utf-8"))
        for r in sib.get("restaurants", []):
            if r.get("photos") and r.get("place_id"):
                out.setdefault(r["place_id"], list(r["photos"])[:6])
    print(f"[photos] {len(out)} place_ids with at least one photo")
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    db = json.loads(THAIGLE_DB.read_text(encoding="utf-8"))
    restaurants = db["restaurants"]
    before_count = len(restaurants)
    before_ids = {r["id"] for r in restaurants}

    hours = load_hours()
    photos = load_photos()

    filled_hours = filled_photos = 0
    for r in restaurants:
        pid = r.get("place_id") or ""
        if not r.get("opening_hours"):
            got = hours.get(pid)
            if got:
                # Store in weekday order so the page renders Monday-first
                # without having to sort a dict at render time.
                r["opening_hours"] = {d: got[d] for d in DAYS if d in got}
                filled_hours += 1
        if not r.get("photos"):
            got_p = photos.get(pid)
            if got_p:
                r["photos"] = got_p
                filled_photos += 1

    assert len(restaurants) == before_count, "restaurant count changed"
    assert {r["id"] for r in restaurants} == before_ids, "restaurant id set changed"

    print(f"\n[backfill] hours filled: {filled_hours}  photos filled: {filled_photos}")
    print(f"[backfill] now with hours: {sum(1 for r in restaurants if r.get('opening_hours'))}/{before_count}")
    print(f"[backfill] now with photos: {sum(1 for r in restaurants if r.get('photos'))}/{before_count}")

    if args.dry_run:
        print("[backfill] --dry-run, nothing written")
        return 0

    db["generated_at"] = dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")
    THAIGLE_DB.write_text(json.dumps(db, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"[backfill] wrote {THAIGLE_DB}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
