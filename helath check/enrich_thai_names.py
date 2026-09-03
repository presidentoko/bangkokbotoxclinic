#!/usr/bin/env python3
"""Pull Thai hospital names out of the Apify Google Maps export.

The official register is Thai-only. Our rows are English-only, with `name_th`
populated on 24 of 321 — which is why matching had to go through a hand-written
transliteration table and topped out at 30 pairs.

The Apify export has been sitting in this folder with the Thai name in its
`subTitle` field for 77 of those businesses. This writes them into
web/data/hospital_names_th.json (a sidecar, so the next export_to_json run does
not erase them) for match_registry.py to use.

Matching Thai to Thai needs no transliteration and cannot mistake one chain for
another.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATASET = HERE / "apify_dataset.json"
SLUG_MAP = HERE / "apify_slug_map.json"
DB = HERE / "web" / "data" / "checkup_db.json"
OUT = HERE / "web" / "data" / "hospital_names_th.json"

THAI = re.compile(r"[฀-๿]")


def main() -> int:
    records = json.loads(DATASET.read_text(encoding="utf-8"))
    slug_map = json.loads(SLUG_MAP.read_text(encoding="utf-8"))
    db = json.loads(DB.read_text(encoding="utf-8"))
    known = {h["slug"] for h in db["hospitals"]}
    already = {h["slug"]: h.get("name_th") for h in db["hospitals"] if h.get("name_th")}

    # The slug map is keyed on the search string the scrape was driven with
    # ("Bangkok Hospital Bangkok Thailand"), not on the record's own title, so
    # the title lookup misses two thirds of the file. Coordinates are the
    # reliable join: both sides came from the same Google listing, so a match
    # inside 150 m is the same building.
    import math

    def km(a_lat, a_lng, b_lat, b_lng):
        a_lat, a_lng, b_lat, b_lng = float(a_lat), float(a_lng), float(b_lat), float(b_lng)
        p = math.pi / 180
        h = (0.5 - math.cos((b_lat - a_lat) * p) / 2
             + math.cos(a_lat * p) * math.cos(b_lat * p) * (1 - math.cos((b_lng - a_lng) * p)) / 2)
        return 12742 * math.asin(math.sqrt(h))

    geo = [(h["slug"], h["lat"], h["lng"]) for h in db["hospitals"] if h.get("lat") and h.get("lng")]

    by_title: dict[str, str] = {}
    for query, slug in slug_map.items():
        title = re.sub(r"\s+(Bangkok|Thailand)\s*", " ", query).strip()
        by_title[title.lower()] = slug

    out: dict[str, str] = {}
    unmapped: list[str] = []
    for r in records:
        sub = (r.get("subTitle") or "").strip()
        if not sub or not THAI.search(sub):
            continue
        title = (r.get("title") or "").strip()
        slug = by_title.get(title.lower())
        if not slug:
            # Fall back to the query form the map actually uses.
            for suffix in (" Bangkok Thailand", " Thailand", ""):
                slug = slug_map.get(f"{title}{suffix}")
                if slug:
                    break
        if not slug or slug not in known:
            loc = r.get("location") or {}
            if loc.get("lat") and loc.get("lng"):
                near = [(km(loc["lat"], loc["lng"], la, ln), sl) for sl, la, ln in geo]
                near.sort()
                if near and near[0][0] <= 0.15:
                    slug = near[0][1]
            if not slug or slug not in known:
                unmapped.append(title)
                continue
        if slug in already:
            continue
        out[slug] = sub

    OUT.write_text(
        json.dumps({"source": "apify_dataset.json subTitle", "names": out}, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )
    print(f"[thai-names] {len(out)} new Thai names ({len(already)} already in the DB)")
    if unmapped:
        print(f"[thai-names] {len(unmapped)} Apify records had a Thai name but no slug: {unmapped[:5]}")
    print(f"[thai-names] wrote {OUT.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
