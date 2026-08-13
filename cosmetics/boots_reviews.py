"""Boots Thailand product-rating scraper.

Rewritten 2026-08-13. Boots moved from www.boots.co.th to store.boots.co.th and
dropped /search?q= entirely (it now redirects to the homepage), which is why all
366 previously saved files had an empty matched_name — the browser scraper never
found a single candidate. The new storefront exposes a plain JSON API with no bot
protection, so this module no longer needs Playwright or a SOCKS5 proxy at all.

  GET https://store.boots.co.th/api/v1/products?q=<term>&locale=th
      -> {"page_information": {...}, "entities": [ {...}, ... ]}

Note the query parameter is `q`. `search=`, `keyword=`, `query=` and friends are
accepted but silently ignored, returning the unfiltered catalogue — which is a
quiet way to match every product against the same 20 rows.

What Boots actually carries (measured over 193 products across 10 brands):
  rating + number_of_reviews  83%
  i_ean_code                 100%
  key_ingredients              0%  (field exists, never populated)
  review text                  —   (every review endpoint 404s)

So this yields aggregate ratings, not review prose. Public API:
  find_rating(product_name, brand) -> dict
  save_boots(product_id, data) -> Path
  main()

Usage:
  python -m cosmetics.boots_reviews
  python -m cosmetics.boots_reviews --shard 0/4
"""
from __future__ import annotations
import json, logging, re, time, urllib.error, urllib.parse, urllib.request
from difflib import SequenceMatcher
from pathlib import Path

from cosmetics import config

log = logging.getLogger("cosmetics.boots_reviews")

BASE = "https://store.boots.co.th"
API = f"{BASE}/api/v1/products"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _normalize(name: str) -> str:
    n = re.sub(r"\d+\s*(ml|g|mg|oz|pcs?)\b", "", name or "", flags=re.I)
    n = re.sub(r"[^a-z0-9 ]+", " ", n.lower())
    return re.sub(r"\s+", " ", n).strip()


def _brand_matches(name: str, brand: str) -> bool:
    """Whole-word brand check.

    The old guard asked whether `brand.lower().split()[0]` appeared anywhere in
    the candidate. For "La Roche Posay" that is the two-letter token "la", which
    hits inside unrelated words — the same defect that filled the iHerb corpus
    with krill-oil matches. Require whole words, and two of them for multi-word
    brands.
    """
    if not brand:
        return True
    hay = re.sub(r"[^a-z0-9]+", " ", (name or "").lower())
    words = [w for w in re.sub(r"[^a-z0-9]+", " ", brand.lower()).split() if len(w) >= 3]
    if not words:
        token = re.sub(r"[^a-z0-9]+", " ", brand.lower()).strip()
        return bool(token) and re.search(rf"\b{re.escape(token)}\b", hay) is not None
    hits = sum(1 for w in words if re.search(rf"\b{re.escape(w)}\b", hay))
    return hits >= min(2, len(words))


def _score(query: str, candidate_en: str, brand: str) -> float:
    if not _brand_matches(candidate_en, brand):
        return 0.0
    return _similarity(_normalize(query), _normalize(candidate_en)) + 0.25


def _api_search(term: str, timeout: int = 25, size: int = 20, page: int = 1) -> list[dict]:
    """One page of results. Paging is `size` + `page` — `page_id`, `offset`,
    `skip`, `from`, `start` and `per_page` are all accepted and silently ignored,
    which makes a wrong guess look like a catalogue with only 20 products in it.
    """
    url = f"{API}?q={urllib.parse.quote(term)}&locale=th&size={size}&page={page}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = json.loads(r.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError) as e:
        log.warning(f"[boots] api error for {term!r}: {type(e).__name__}: {e}")
        return []
    return body.get("entities") or []


def fetch_brand_catalog(brand: str, max_pages: int = 12) -> list[dict]:
    """Every Boots listing for a brand, paged out."""
    out: list[dict] = []
    seen: set[str] = set()
    for page in range(1, max_pages + 1):
        ents = _api_search(brand, size=100, page=page)
        if not ents:
            break
        fresh = 0
        for e in ents:
            key = str(e.get("item_code") or e.get("id") or e.get("i_ean_code") or "")
            if key and key not in seen:
                seen.add(key)
                out.append(e)
                fresh += 1
        if fresh == 0:
            break
        time.sleep(0.4)
    return out


def build_ean_index(brands: "set[str] | list[str]") -> dict[str, dict]:
    """EAN -> Boots entity, across the given brands.

    Name similarity cannot separate products *within* a brand — a first pass
    matched "Mediheal Derma Modeling Pack" to "Mediheal Essential Mask Teatree"
    at 0.85 and "Garnier Bright Complete Booster Serum" to "Garnier Micellar
    Pink" at 0.68. Barcodes are exact, and both sides carry them: master_db has
    a 13-digit code for 907 of 1,003 products and Boots publishes i_ean_code for
    100% of listings. (Searching the API *by* barcode does not work — `q` does
    not index them — so the catalogue has to be pulled and indexed locally.)
    """
    index: dict[str, dict] = {}
    for b in sorted(brands):
        ents = fetch_brand_catalog(b)
        added = 0
        for e in ents:
            ean = str(e.get("i_ean_code") or "").strip()
            if ean and ean not in index:
                index[ean] = e
                added += 1
        log.info(f"[boots] catalog {b!r}: {len(ents)} listings, +{added} EANs")
    return index


def _empty(product_name: str) -> dict:
    return {
        "source": "boots", "product_name": product_name,
        "matched_name": "", "similarity": 0.0, "product_count": 0,
        "rating": 0.0, "review_count": 0, "ean": "", "price": 0,
        "snippets": [],
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def rating_from_entity(product_name: str, e: dict, how: str, sim: float = 1.0) -> dict:
    return {
        "source": "boots",
        "product_name": product_name,
        "matched_name": (e.get("product_name_en") or e.get("name") or ""),
        "matched_by": how,
        "similarity": round(sim, 3),
        "product_count": 1,
        "rating": float(e.get("rating") or 0),
        "review_count": int(e.get("number_of_reviews") or 0),
        "ean": str(e.get("i_ean_code") or "").strip(),
        "price": e.get("price") or 0,
        "snippets": [],
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def find_rating(product_name: str, brand: str, sim_threshold: float = 0.55) -> dict:
    """Search Boots for a product and return its aggregate rating."""
    term = f"{brand} {product_name}".strip() if brand else product_name
    ents = _api_search(term)
    if not ents and brand:
        ents = _api_search(brand)
    if not ents:
        return _empty(product_name)

    scored = []
    for e in ents:
        cand = (e.get("product_name_en") or e.get("name") or "")
        scored.append((_score(product_name, cand, brand), cand, e))
    scored.sort(key=lambda x: x[0], reverse=True)
    best_sim, best_name, best = scored[0]

    if best_sim < sim_threshold:
        log.info(f"[boots] best {best_name[:40]!r} score={best_sim:.2f} < {sim_threshold} — skip")
        return _empty(product_name)

    rating = float(best.get("rating") or 0)
    count = int(best.get("number_of_reviews") or 0)
    log.info(f"[boots] {product_name[:38]!r} -> {best_name[:38]!r} "
             f"score={best_sim:.2f} rating={rating} n={count}")
    return {
        "source": "boots",
        "product_name": product_name,
        "matched_name": best_name,
        "similarity": round(best_sim, 3),
        "product_count": len(ents),
        "rating": rating,
        "review_count": count,
        "ean": str(best.get("i_ean_code") or "").strip(),
        "price": best.get("price") or 0,
        # Boots exposes no review prose — every review endpoint 404s. Kept for
        # shape-compatibility with the watsons/konvy corpus loaders.
        "snippets": [],
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


# Back-compat alias: callers/tests referencing the old name keep working.
find_reviews = find_rating


def save_boots(product_id: str, data: dict) -> Path:
    out = config.REVIEWS_DIR / f"{product_id}_boots.json"
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return out


_BOOTS_BRANDS = {
    "Eucerin", "La Roche Posay", "CeraVe", "Neutrogena", "Cetaphil", "Bioderma",
    "Avene", "Vichy", "COSRX", "NIVEA", "Garnier", "L'Oreal Paris", "Olay", "Vaseline",
    "Hada Labo", "Senka", "Biore", "Rohto", "Dove", "Pond's", "ACNE-AID",
    "Smooth E", "CLEAR NOSE", "Plantnery", "Mentholatum", "Nu Formula", "BK",
    "SKINTIFIC", "MizuMi", "BANOBAGI", "Mediheal", "PROVAMED", "DERMEDY",
    "Cathy Doll", "Smooto Japan", "HER HYNESS", "Puricas", "Snail White",
    "Some By Mi", "Isntree", "Klairs", "Beauty of Joseon", "Naruko",
}

STOP_FILE = config.STATE_DIR / "STOP_BOOTS"


def main() -> int:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--shard", default=None, help="I/N e.g. 0/4")
    parser.add_argument("--refresh", action="store_true",
                        help="re-fetch products that already have a saved file")
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    db_path = config.ROOT / "web" / "data" / "master_db.json"
    if not db_path.exists():
        print("master_db.json 없음 — 종료")
        return 1
    all_products = list(json.loads(db_path.read_text(encoding="utf-8"))["products"].values())

    brands_lower = {b.lower() for b in _BOOTS_BRANDS}
    all_products = [p for p in all_products if (p.get("brand") or "").lower() in brands_lower]

    pending = [
        p for p in all_products
        if p.get("product_id")
        and (args.refresh or not (config.REVIEWS_DIR / f"{p['product_id']}_boots.json").exists())
    ]
    if args.shard:
        i, n = map(int, args.shard.split("/"))
        pending = [p for j, p in enumerate(pending) if j % n == i]
    if args.limit:
        pending = pending[:args.limit]

    print(f"Boots ratings: {len(pending)} pending / {len(all_products)} in brand whitelist")
    if not pending:
        print("Nothing to do.")
        return 0

    # One catalogue pull for the brands actually needed, then exact EAN joins.
    needed = {(p.get("brand") or "").strip() for p in pending if p.get("brand")}
    print(f"Building EAN index over {len(needed)} brands…")
    ean_index = build_ean_index(needed)
    print(f"EAN index: {len(ean_index)} Boots listings")

    done = by_ean = by_name = miss = fail = 0
    for i, p in enumerate(pending, 1):
        if STOP_FILE.exists():
            log.info("STOP_BOOTS seen — stopping")
            break
        pid = str(p["product_id"])
        try:
            ean = str(p.get("gtin8") or "").strip()
            hit = ean_index.get(ean) if ean else None
            if hit is not None:
                data = rating_from_entity(p.get("name", ""), hit, "ean")
                by_ean += 1
            else:
                # No barcode join — fall back to name similarity, which is only
                # trustworthy across brands, not within one.
                data = find_rating(p.get("name", ""), p.get("brand", ""))
                if data["matched_name"]:
                    data["matched_by"] = "name"
                    by_name += 1
                else:
                    miss += 1
                time.sleep(0.5)
            save_boots(pid, data)
            done += 1
            if i % 25 == 0 or i == len(pending):
                print(f"  [{i}/{len(pending)}] ean={by_ean} name={by_name} miss={miss} fail={fail}")
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.error(f"{pid}: {type(e).__name__}: {e}")
            fail += 1

    print(f"\nDone. saved={done} matched_by_ean={by_ean} matched_by_name={by_name} "
          f"unmatched={miss} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
