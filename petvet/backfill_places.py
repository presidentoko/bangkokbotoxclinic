"""Repair data/hospitals.json from the Google Places API (New).

Why this exists
---------------
`transform.py` writes `first_seen_lat/lng` — the grid *probe point* a clinic was
discovered from — as the clinic's own coordinate. 463 of 503 records (92%) end
up sharing a coordinate with another clinic; 99 sit on the single grid centre
13.74629,100.53005, among them clinics that are really in Thon Buri, Pathum Wan
and Bangkok Noi.

The stored `google_place_id` is not a Places API id. It is the Google Maps
*ftid* hex pair (`0x…:0x…`). But a `ChIJ…` place id is nothing more than
base64url over a tiny protobuf holding those same two 64-bit values in
little-endian order, so the real place id can be computed offline from what we
already have — no text search, and therefore no chance of matching the wrong
business. `ftid_to_place_id()` below is verified round-trip against ids returned
by the API.

Alongside the coordinate this also repairs, from the same single request:
  * `address`      — 149 records carry a leading " · " listing artefact, 9 are
                     empty, and only 24 contain a postcode. The API returns the
                     full Thai address including the เขต (district).
  * `name_th`      — 197 records have an English-only "Thai" name.
  * `is_24h`       — currently inferred from the words on a listing card.
  * `phone`, `website`, `google_rating`, `google_review_count`
  * `business_status` — some scraped clinics have since closed permanently.

Usage
-----
    python petvet/backfill_places.py            # resumes from the checkpoint
    python petvet/backfill_places.py --dry-run  # 5 records, prints, writes nothing

Reads GOOGLE_API_KEY from the repo-root .env. Requires the *Places API (New)*
to be enabled; the legacy Places API is not sufficient and returns
REQUEST_DENIED for this project.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOSPITALS = ROOT / "web-petbkk" / "data" / "hospitals.json"
CHECKPOINT = ROOT / "petvet" / "places_backfill.json"

# Everything below is one request per place. Keep the mask tight: fields outside
# the Essentials/Pro tiers are billed at a higher rate and none are needed here.
FIELD_MASK = ",".join([
    "id",
    "displayName",
    "location",
    "formattedAddress",
    "nationalPhoneNumber",
    "websiteUri",
    "rating",
    "userRatingCount",
    "regularOpeningHours.openNow",
    "regularOpeningHours.weekdayDescriptions",
    "businessStatus",
])

WORKERS = 6
MAX_RETRIES = 3


def load_api_key() -> str:
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8", errors="replace").splitlines():
            if line.startswith("GOOGLE_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip()
    key = os.environ.get("GOOGLE_API_KEY", "").strip()
    if not key:
        sys.exit("GOOGLE_API_KEY not found in .env or environment")
    return key


def ftid_to_place_id(ftid: str) -> str | None:
    """`0x30e29f2aabc84815:0xcd67e8a5a77aabdc` -> `ChIJFUjIqyqf4jAR3Kt6p6XoZ80`.

    The protobuf is: field 1 (length-delimited, 18 bytes) containing field 1 and
    field 2 as fixed64 little-endian. Verified against ids the API returns.
    """
    try:
        first, second = ftid.split(":")
        raw = (
            b"\x0a\x12\x09"
            + int(first, 16).to_bytes(8, "little")
            + b"\x11"
            + int(second, 16).to_bytes(8, "little")
        )
    except (ValueError, OverflowError):
        return None
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def fetch_place(place_id: str, key: str) -> dict | None:
    url = f"https://places.googleapis.com/v1/places/{place_id}?languageCode=th&regionCode=TH"
    req = urllib.request.Request(url, headers={
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
    })
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            # 404 = the place is gone from Google; that is an answer, not a failure.
            if e.code == 404:
                return {"_gone": True}
            if e.code in (429, 500, 502, 503) and attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
                continue
            body = e.read().decode("utf-8", "replace")[:200]
            return {"_error": f"HTTP {e.code}: {body}"}
        except Exception as e:  # noqa: BLE001 - network layer, keep going
            if attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
                continue
            return {"_error": str(e)}
    return None


def is_open_24h(place: dict) -> bool | None:
    hours = place.get("regularOpeningHours") or {}
    descriptions = hours.get("weekdayDescriptions") or []
    if not descriptions:
        return None
    # Google renders a round-the-clock place as "จันทร์: เปิดตลอด 24 ชั่วโมง"
    # (or "Open 24 hours" under an English languageCode).
    return all(
        ("เปิดตลอด 24 ชั่วโมง" in d) or ("Open 24 hours" in d)
        for d in descriptions
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="fetch 5 records, print, write nothing")
    args = parser.parse_args()

    key = load_api_key()
    hospitals = json.loads(HOSPITALS.read_text(encoding="utf-8"))

    done: dict[str, dict] = {}
    if CHECKPOINT.exists() and not args.dry_run:
        done = json.loads(CHECKPOINT.read_text(encoding="utf-8"))
        print(f"checkpoint: {len(done)} already fetched")

    todo = [h for h in hospitals if h["id"] not in done]
    if args.dry_run:
        todo = todo[:5]
    print(f"fetching {len(todo)} of {len(hospitals)}")

    def work(h: dict) -> tuple[str, dict]:
        pid = ftid_to_place_id(h.get("google_place_id", ""))
        if not pid:
            return h["id"], {"_error": "unconvertible ftid"}
        result = fetch_place(pid, key) or {"_error": "no response"}
        result["_place_id"] = pid
        return h["id"], result

    completed = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        for hid, result in pool.map(work, todo):
            done[hid] = result
            completed += 1
            if completed % 25 == 0:
                print(f"  {completed}/{len(todo)}")
                if not args.dry_run:
                    CHECKPOINT.write_text(json.dumps(done, ensure_ascii=False), encoding="utf-8")

    if args.dry_run:
        for h in todo:
            r = done[h["id"]]
            print("-" * 70)
            print(h["name_en"][:50])
            print("  stored :", round(h["lat"], 6), round(h["lng"], 6))
            if "location" in r:
                print("  real   :", r["location"]["latitude"], r["location"]["longitude"])
                print("  name_th:", r.get("displayName", {}).get("text"))
                print("  address:", r.get("formattedAddress", "")[:80])
                print("  24h    :", is_open_24h(r), "| status:", r.get("businessStatus"))
            else:
                print("  ->", r)
        return

    CHECKPOINT.write_text(json.dumps(done, ensure_ascii=False), encoding="utf-8")

    ok = sum(1 for r in done.values() if "location" in r)
    gone = sum(1 for r in done.values() if r.get("_gone"))
    err = sum(1 for r in done.values() if r.get("_error"))
    print(f"\nresolved {ok} · gone from Google {gone} · errors {err}")
    print(f"checkpoint written to {CHECKPOINT.relative_to(ROOT)}")
    print("review it, then run: python petvet/apply_places.py")


if __name__ == "__main__":
    main()
