"""Per-place Naver CAFE search — populate per-business Korean cafe mentions.

Different from per_place_naver.py (blog): cafe = membership/community posts,
often more candid travel reports from Korean tourists about specific places.

For each place in siamverified-portable/public/data/places.json, search Naver
cafe articles for "{place.name} {place.city}" and store top hits keyed by
place_id.

Output: siamverified-portable/public/data/per_place_naver_cafe.json
Schema: { "<place_id>": [ {cafe_url, cafe_name, post_title, post_snippet,
                            query, scraped_at}, ... ], ... }

Resume-safe: places already in the output file are skipped.
"""
from __future__ import annotations

import argparse
import json
import logging
import time
from urllib.parse import quote

import httpx

from . import common
from . import naver_cafe_harvest as nch

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("per_place_naver_cafe")

PLACES_JSON = common.REPO_ROOT / "siamverified-portable" / "public" / "data" / "places.json"
OUTPUT = common.REPO_ROOT / "siamverified-portable" / "public" / "data" / "per_place_naver_cafe.json"

DELAY = 1.5
MAX_PAGES_PER_QUERY = 2
MAX_HITS_KEPT = 6
SAVE_EVERY_N = 25

# Naver cafe search returns hits only for Korean-language queries — English
# place names paired with a Korean keyword work; pure-English doesn't.
CITY_KO = {
    "bangkok": "방콕",
    "phuket": "푸켓",
    "chiang mai": "치앙마이",
    "chiang rai": "치앙라이",
    "pattaya": "파타야",
    "hua hin": "후아힌",
    "koh samui": "코사무이",
    "koh phangan": "팡안",
    "koh tao": "코타오",
    "krabi": "끄라비",
    "ayutthaya": "아유타야",
    "khon kaen": "콘깬",
    "korat": "코랏",
    "hat yai": "핫야이",
}


def load_places() -> list[dict]:
    if not PLACES_JSON.exists():
        log.error(f"missing {PLACES_JSON}")
        return []
    return json.loads(PLACES_JSON.read_text(encoding="utf-8")).get("places", [])


def load_existing() -> dict[str, list[dict]]:
    if not OUTPUT.exists():
        return {}
    try:
        return json.loads(OUTPUT.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def save(data: dict[str, list[dict]]) -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUTPUT.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    tmp.replace(OUTPUT)


def search_for_place(
    client: httpx.Client,
    place: dict,
    max_hits: int = MAX_HITS_KEPT,
) -> list[dict]:
    name = (place.get("name") or "").strip()
    city = (place.get("city") or "").strip()
    if not name:
        return []

    # Korean-flavored queries — Naver cafe needs at least one Korean term to
    # return any cafe results, even when the place name is English.
    city_ko = CITY_KO.get(city.lower(), "")
    queries: list[str] = [f"{name} 후기", f"{name} 태국"]
    if city_ko:
        queries.append(f"{name} {city_ko}")
        queries.append(f"{city_ko} {name} 후기")

    hits: list[dict] = []
    seen_keys: set[str] = set()

    def url_key(u: str) -> str:
        # Strip the JWT-bearing `?art=...` query — same post appears with
        # different tokens across queries, so we dedup on the cafe path.
        return u.split("?", 1)[0]

    for q in queries:
        for page in range(1, MAX_PAGES_PER_QUERY + 1):
            start = (page - 1) * 10 + 1
            url = ("https://search.naver.com/search.naver"
                   f"?where=article&query={quote(q)}&start={start}")
            html = nch.fetch_with_retry(client, url)
            if not html:
                break
            page_hits = nch.parse_cafe_results(html)
            for h in page_hits:
                if not h.get("cafe_url"):
                    continue
                key = url_key(h["cafe_url"])
                if key in seen_keys:
                    continue
                seen_keys.add(key)
                hits.append({
                    "cafe_url": h["cafe_url"],
                    "cafe_name": h.get("cafe_name", ""),
                    "post_title": h.get("post_title", ""),
                    "post_snippet": h.get("post_snippet", ""),
                    "post_date": h.get("post_date", ""),
                    "author": h.get("author", ""),
                    "query": q,
                    "scraped_at": common.now_iso(),
                })
                if len(hits) >= max_hits:
                    return hits
            time.sleep(DELAY)
            if not page_hits:
                break
    return hits


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="stop after N places (0 = all)")
    ap.add_argument("--niche", default="", help="only this niche (optional)")
    ap.add_argument("--max-hits", type=int, default=MAX_HITS_KEPT,
                    help=f"cap per place (default {MAX_HITS_KEPT})")
    args = ap.parse_args()

    places = load_places()
    if args.niche:
        places = [p for p in places if p.get("niche") == args.niche]
    if args.limit:
        places = places[: args.limit]
    log.info(f"loaded {len(places)} places, max_hits={args.max_hits}")

    existing = load_existing()
    log.info(f"existing: {len(existing)} places already scraped")

    pending = [p for p in places if p.get("id") and p["id"] not in existing]
    log.info(f"pending: {len(pending)} places to scrape")

    out = dict(existing)
    written = 0
    total_hits = 0
    with httpx.Client(headers=nch.HEADERS, follow_redirects=True, timeout=30) as client:
        for i, p in enumerate(pending, 1):
            pid = p["id"]
            log.info(f"({i}/{len(pending)}) [{p.get('niche')}] {p.get('name')!r} @ {p.get('city')}")
            try:
                hits = search_for_place(client, p, max_hits=args.max_hits)
            except Exception as e:
                log.warning(f"  failed: {type(e).__name__}: {e}")
                hits = []
            out[pid] = hits
            written += 1
            total_hits += len(hits)
            log.info(f"  → {len(hits)} hits (run total: {written} places, {total_hits} hits)")
            if written % SAVE_EVERY_N == 0:
                save(out)
                log.info(f"  [checkpoint] saved {len(out)} entries")
    save(out)
    log.info(f"DONE — {len(out)} places, +{written} processed, "
             f"{total_hits} cafe hits → {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
