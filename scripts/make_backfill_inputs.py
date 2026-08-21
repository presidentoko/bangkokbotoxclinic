#!/usr/bin/env python3
"""
Build the Apify input files for the 2026-08 backfill.

Not scripts/make_apify_inputs.py: that one filters its targets through
qualifying(), which is the set that *already has pages*. The whole point of
this run is the venues that have no page yet, so that filter excludes exactly
what we want — it emits 4 spa placeIds where the real target is 1,710.

Three jobs, independent, run in this order:

  1. spa ratings      1,710 venues  -> ~1,640 new pages
  2. niche ratings       88 venues  ->    ~88 new pages
  3. restaurant photos ~3,265       -> photos + hours on existing pages

Plus a smoke test of 5 venues drawn from job 1. Run that first and confirm
the export actually carries totalScore and imageUrls before spending on the
rest — a 1,710-venue run that comes back without ratings is money gone, and
that failure mode has happened here before with a different scraper.

Reviews stay off (maxReviews: 0). Nothing on the site renders review text for
these venues; what is missing is the rating, the review *count*, and photos.

Usage:
    python scripts/make_backfill_inputs.py
Writes to apify_inputs/backfill_2026_08/.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_DIR = ROOT / "web-thaigle" / "data" / "by-niche"
MASTER_DB = ROOT / "web-thaigle" / "data" / "master_db.json"
OUT_DIR = ROOT / "apify_inputs" / "backfill_2026_08"

# Google Maps URLs carry the modern ChIJ id in the !19s segment. The
# restaurant records key on the older hex CID pair, which the actor cannot
# take as placeIds — so the ChIJ is lifted out of the URL, and anything
# without one falls back to startUrls.
CHIJ_IN_URL = re.compile(r"!19s(ChI[A-Za-z0-9_\-]+)")

# Some scraped rows have shifted columns — maps_url holding a bare "http" or a
# phone number. Apify rejects the whole input file on the first bad entry
# ("Items at positions [...] do not contain valid URLs"), so one corrupt row
# blocks a 3,000-venue run. Filtered rather than repaired: a row whose columns
# are shifted cannot be trusted to identify the right venue anyway.
VALID_URL = re.compile(r"^https?://\S+$")


def build_input(place_ids: list[str], start_urls: list[str]) -> dict:
    """Same payload shape make_apify_inputs.py uses, for one actor run."""
    payload: dict = {
        "language": "en",
        "scrapePlaceDetailPage": True,
        "maxImages": 5,
        "maxReviews": 0,
        "maxQuestions": 0,
        "scrapeContacts": False,
        "maximumLeadsEnrichmentRecords": 0,
        # We want to be told when a venue has closed rather than have it
        # silently dropped — enrich_from_apify.py reports closures.
        "skipClosedPlaces": False,
    }
    if place_ids:
        payload["placeIds"] = place_ids
    if start_urls:
        payload["startUrls"] = [{"url": u} for u in start_urls]
    return payload


def write(name: str, ids: list[str], urls: list[str], note: str) -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / name).write_text(
        json.dumps(build_input(ids, urls), ensure_ascii=False, indent=2), encoding="utf-8")
    n = len(ids) + len(urls)
    print(f"  {name:34} {len(ids):>6} ids {len(urls):>5} urls  = {n:>5}   {note}")
    return n


def rated(p: dict) -> bool:
    return bool(p.get("rating")) and (p.get("review_count") or 0) > 0 and (p.get("trust_score") or 0) > 0


def main() -> int:
    print("Apify backfill inputs\n")
    total = 0

    # ---- job 1: spa venues that have no rating -----------------------------
    spa = json.loads((NICHE_DIR / "spa.json").read_text(encoding="utf-8"))["places"]
    spa_need = [p for p in spa if not p.get("permanently_closed") and not rated(p)]
    spa_ids = [p["id"] for p in spa_need if str(p["id"]).startswith("ChI")]
    spa_urls = [p.get("google_maps_url") for p in spa_need
                if not str(p["id"]).startswith("ChI") and p.get("google_maps_url")]
    total += write("1_spa_ratings.json", spa_ids, [u for u in spa_urls if u],
                   "-> ~1,640 new pages")

    # ---- smoke test: 5 from job 1 ------------------------------------------
    write("0_smoke_test.json", spa_ids[:5], [], "RUN THIS FIRST")

    # ---- job 2: the other niches' unrated venues ---------------------------
    ids2: list[str] = []
    urls2: list[str] = []
    for niche in ["diving", "cooking", "muay-thai", "coworking", "wellness", "yoga-pilates"]:
        places = json.loads((NICHE_DIR / f"{niche}.json").read_text(encoding="utf-8"))["places"]
        need = [p for p in places if not p.get("permanently_closed") and not rated(p)]
        ids2 += [p["id"] for p in need if str(p["id"]).startswith("ChI")]
        urls2 += [p["google_maps_url"] for p in need
                  if not str(p["id"]).startswith("ChI") and p.get("google_maps_url")]
    ids2 = list(dict.fromkeys(ids2))
    urls2 = list(dict.fromkeys(urls2))
    total += write("2_niche_ratings.json", ids2, urls2, "-> new pages in 6 niches")

    # ---- job 3: restaurants, for photos and hours --------------------------
    restaurants = json.loads(MASTER_DB.read_text(encoding="utf-8"))["restaurants"]
    need_r = [r for r in restaurants if not r.get("photos")]
    ids3: list[str] = []
    urls3: list[str] = []
    # The merge has to map results back onto the hex place_id the records use,
    # so the ChIJ -> place_id direction is written out alongside the input.
    chij_map: dict[str, str] = {}
    for r in need_r:
        m = CHIJ_IN_URL.search(r.get("maps_url") or "")
        if m:
            ids3.append(m.group(1))
            chij_map[m.group(1)] = r["place_id"]
        elif VALID_URL.match(r.get("maps_url") or ""):
            urls3.append(r["maps_url"])
    total += write("3_restaurant_photos.json", ids3, urls3, "-> photos + hours on existing pages")
    (OUT_DIR / "3_restaurant_chij_map.json").write_text(
        json.dumps(chij_map, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"  {'3_restaurant_chij_map.json':34} {len(chij_map):>6} pairs        (needed by the merge)")

    print(f"\n  total venues across jobs 1-3: {total:,}")
    print(f"  rough cost at $1.5-5 / 1,000: ${total/1000*1.5:.2f} - ${total/1000*5:.2f}")
    print(f"\n  actor: compass/crawler-google-places")
    print(f"  written to {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
