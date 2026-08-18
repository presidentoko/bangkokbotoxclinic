"""Merge petvet/places_backfill.json into web-petbkk/data/hospitals.json.

Run `backfill_places.py` first. This step is deliberately separate so the fetched
payload can be inspected before anything overwrites the live dataset.

What it changes, and why each is safe:

  lat / lng   Replaced outright. The stored values are grid probe points (92% of
              records share a coordinate); the API values are the clinics'.
              Guarded by a Bangkok bounding box.
  address     Replaced with `formattedAddress`, which carries the เขต and a
              postcode. The scraped `address_hint` was a listing fragment — 149
              had a leading " · ", 9 were empty, 24 had a postcode.
  district    New. Parsed out of the Thai address; the key that "vets near X"
              landing pages need and that nothing in the dataset had before.
  name_th     Replaced with the Thai displayName where the stored one is
              English-only (197 records were).
  is_24h      Taken from real opening hours where Google returned them (442
              records). Where it did not, the existing value is kept — it was
              78/79 correct against the ones we could check.
  phone / website / google_rating / google_review_count
              Refreshed; `website` is new (it was absent on all 503).

  `id` and `name_en` are never touched. Slugs are derived from them, so leaving
  them alone keeps all 503 URLs stable — and the run still diffs slugs before
  and after and refuses to write if any moved, because a collision-counter shift
  would otherwise retire indexed URLs silently.

Records Google no longer serves (404) or reports CLOSED_PERMANENTLY are dropped
and listed, so redirects can be added for them.
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOSPITALS = ROOT / "web-petbkk" / "data" / "hospitals.json"
CHECKPOINT = ROOT / "petvet" / "places_backfill.json"

BKK = (13.49, 14.00, 100.32, 100.95)  # lat_min, lat_max, lng_min, lng_max

# Google renders a round-the-clock place as "วันจันทร์: เปิด 24 ชั่วโมง".
# Note it is "เปิด 24", not "เปิดตลอด 24" — the latter matches nothing.
OPEN_24H = ("เปิด 24 ชั่วโมง", "Open 24 hours")


def to_slug(text: str) -> str:
    """Mirror of lib/slugify.ts, needed only for the before/after slug diff."""
    text = unicodedata.normalize("NFKD", str(text or ""))
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")[:80]


def base_slug(h: dict) -> str:
    from_id = to_slug(h.get("id", ""))
    if len(from_id) > 5:
        return from_id
    from_name = to_slug(h.get("name_en", ""))
    if len(from_name) > 5:
        return from_name
    return to_slug(h.get("google_place_id", ""))


def slugs_of(hospitals: list[dict]) -> dict[str, str]:
    counts: dict[str, int] = {}
    out: dict[str, str] = {}
    for h in hospitals:
        base = base_slug(h)
        n = counts.get(base, 0) + 1
        counts[base] = n
        out[h["id"]] = base if n == 1 else f"{base}-{n}"
    return out


def district_of(address: str) -> str | None:
    m = re.search(r"เขต\s*([ก-๙]+)", address or "")
    return m.group(1) if m else None


def is_24h(place: dict) -> bool | None:
    days = (place.get("regularOpeningHours") or {}).get("weekdayDescriptions") or []
    if not days:
        return None
    return all(any(t in d for t in OPEN_24H) for d in days)


def main() -> None:
    hospitals = json.loads(HOSPITALS.read_text(encoding="utf-8"))
    fetched = json.loads(CHECKPOINT.read_text(encoding="utf-8"))

    before = slugs_of(hospitals)

    kept: list[dict] = []
    dropped: list[tuple[str, str, str]] = []
    stats = {k: 0 for k in ("coord", "address", "district", "name_th", "is_24h", "phone", "website", "rating")}

    for h in hospitals:
        r = fetched.get(h["id"]) or {}

        if r.get("_gone"):
            dropped.append((before[h["id"]], h["name_en"], "delisted from Google"))
            continue
        if r.get("businessStatus") == "CLOSED_PERMANENTLY":
            dropped.append((before[h["id"]], h["name_en"], "closed permanently"))
            continue

        loc = r.get("location")
        if loc:
            lat, lng = loc["latitude"], loc["longitude"]
            if BKK[0] < lat < BKK[1] and BKK[2] < lng < BKK[3]:
                h["lat"], h["lng"] = lat, lng
                stats["coord"] += 1

        addr = r.get("formattedAddress")
        if addr:
            h["address"] = addr.strip()
            stats["address"] += 1
            d = district_of(addr)
            if d:
                h["district"] = d
                stats["district"] += 1

        th = (r.get("displayName") or {}).get("text")
        # Only overwrite when the stored "Thai" name has no Thai in it at all.
        if th and not re.search(r"[ก-๙]", h.get("name_th", "")):
            h["name_th"] = th
            stats["name_th"] += 1

        h24 = is_24h(r)
        if h24 is not None and h24 != h.get("is_24h"):
            h["is_24h"] = h24
            stats["is_24h"] += 1

        if r.get("nationalPhoneNumber"):
            h["phone"] = r["nationalPhoneNumber"]
            stats["phone"] += 1
        if r.get("websiteUri"):
            h["website"] = r["websiteUri"]
            stats["website"] += 1
        if r.get("rating") is not None:
            h["google_rating"] = r["rating"]
            h["google_review_count"] = r.get("userRatingCount", h.get("google_review_count"))
            stats["rating"] += 1
        if r.get("_place_id"):
            h["google_place_id_new"] = r["_place_id"]
        h["updated_at"] = "2026-08-18"

        kept.append(h)

    after = slugs_of(kept)
    moved = [(hid, before[hid], after[hid]) for hid in after if before.get(hid) != after[hid]]
    if moved:
        print(f"ABORT: {len(moved)} slugs would change, which would retire indexed URLs:")
        for hid, b, a in moved[:10]:
            print(f"  {b}  ->  {a}")
        raise SystemExit(1)

    HOSPITALS.write_text(json.dumps(kept, ensure_ascii=False, indent=2), encoding="utf-8")

    coords = {f"{h['lat']:.5f},{h['lng']:.5f}" for h in kept}
    print(f"wrote {len(kept)} hospitals ({len(dropped)} dropped)")
    print(f"distinct coordinates: {len(coords)}/{len(kept)}")
    for k, v in stats.items():
        print(f"  {k:9s} updated on {v}")
    print("\nslugs unchanged for all kept records")
    if dropped:
        print("\ndropped — add redirects for these:")
        for slug, name, why in dropped:
            print(f"  /hospital/{slug}  ({name[:40]}) — {why}")


if __name__ == "__main__":
    main()
