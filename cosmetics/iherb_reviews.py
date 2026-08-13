"""iHerb Thailand review scraper.

Searches th.iherb.com for each product and intercepts the review API.
No SOCKS5 proxy needed — iHerb has no aggressive bot protection.

Public API mirrors watsons_reviews.py:
  find_reviews(product_name, brand) -> dict
  save_iherb(product_id, data) -> Path
  main()

Usage:
  python -m cosmetics.iherb_reviews
"""
from __future__ import annotations
import json, logging, re, time
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import unquote, quote_plus

from cosmetics import config

log = logging.getLogger("cosmetics.iherb_reviews")

BASE = "https://th.iherb.com"
SEARCH_URL = f"{BASE}/search?query={{query}}"

_REVIEW_API_RE = re.compile(
    r"iherb\.com/(?:ugc-reviews-api|review-api|r)/.*?(?:partNumber|productId|catalogNumber)[=/](\w+)",
    re.I,
)
# iHerb review API patterns observed in network traffic
_REVIEW_URL_RE = re.compile(
    r"iherb\.com.*/reviews?.*(?:partNumber|part_number|productId)=([^&]+)", re.I
)


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _normalize(name: str) -> str:
    n = re.sub(r"\d+\s*(ml|g|mg|oz|pcs?|count|ct)\b", "", name, flags=re.I)
    return re.sub(r"\s+", " ", n).strip().lower()


def _clean_query(name: str, brand: str) -> str:
    """Strip packaging noise and deduplicate brand prefix."""
    clean = re.sub(r"\[.*?\]|\(.*?\)", "", name).strip()
    clean = re.sub(r"\s+", " ", clean)
    # Remove duplicate brand prefix (product_name often already starts with brand)
    if clean.lower().startswith(brand.lower()):
        clean = clean[len(brand):].strip()
    return f"{brand} {clean}".strip()


def _brand_matches(name: str, brand: str) -> bool:
    """Whole-word brand check against a candidate product name.

    The previous guard took `brand.lower().split()[0]` and asked whether that
    substring appeared anywhere in the candidate. For "La Roche Posay" that is
    the two-letter token "la", which occurs inside ordinary words — "wild PLAnet
    wild sardines" scored 0.462 against a La Roche-Posay serum and cleared the
    0.45 threshold. Every "matched" iHerb row in output/reviews is a false
    positive of this kind (krill oil matched to La Roche-Posay, NMN complex
    matched to SOME BY MI). No reviews were ever extracted, so nothing was
    corrupted — but the moment extraction works, those reviews would be attached
    to the wrong products.

    Now: require a whole-word hit, and for multi-word brands require the two
    most distinctive words rather than just the first.
    """
    if not brand:
        return True
    hay = re.sub(r"[^a-z0-9]+", " ", name.lower())
    words = [w for w in re.sub(r"[^a-z0-9]+", " ", brand.lower()).split() if len(w) >= 3]
    if not words:
        # Brand is entirely short tokens (e.g. "3M") — fall back to an exact
        # whole-word match on the raw brand string.
        token = re.sub(r"[^a-z0-9]+", " ", brand.lower()).strip()
        return bool(token) and re.search(rf"\b{re.escape(token)}\b", hay) is not None
    hits = sum(1 for w in words if re.search(rf"\b{re.escape(w)}\b", hay))
    return hits >= min(2, len(words))


def _score(query: str, name: str, brand: str) -> float:
    # Hard-zero if the brand isn't really present — avoids cross-category noise
    if not _brand_matches(name, brand):
        return 0.0
    base = _similarity(_normalize(query), _normalize(name))
    return base + 0.25


def _extract_search_products(body: "dict | list") -> list[tuple[str, str]]:
    """Pull (url, name) pairs from iHerb search API response."""
    results: list[tuple[str, str]] = []

    def _from_item(item: dict) -> None:
        name = (item.get("name") or item.get("productName") or
                item.get("title") or item.get("displayName") or "")
        url_path = (item.get("url") or item.get("link") or
                    item.get("href") or item.get("productUrl") or "")
        part = (item.get("catalogEntryCode") or item.get("partNumber") or
                item.get("productId") or "")
        if name:
            if url_path:
                full = url_path if url_path.startswith("http") else BASE + url_path
            elif part:
                full = f"{BASE}/pr/{part}"
            else:
                full = ""
            results.append((full, name))

    if isinstance(body, list):
        for item in body[:30]:
            if isinstance(item, dict) and (item.get("name") or item.get("productName")):
                _from_item(item)
    elif isinstance(body, dict):
        for key in ("products", "items", "results", "data",
                    "catalogEntryList", "productList", "searchResults"):
            items = body.get(key)
            if isinstance(items, list) and items:
                for item in items[:30]:
                    if isinstance(item, dict):
                        _from_item(item)
                if results:
                    break
    return results


def find_reviews(
    product_name: str,
    brand: str,
    sim_threshold: float = 0.45,
) -> dict:
    """Search iHerb for a product and return its reviews."""
    from playwright.sync_api import sync_playwright

    query = _clean_query(product_name, brand)
    api_reviews: list[dict] = []
    api_products: list[tuple[str, str]] = []
    review_urls_seen: set[str] = set()
    search_urls_seen: set[str] = set()

    def _on_response(response):
        url = response.url
        if "iherb.com" not in url:
            return
        ct = response.headers.get("content-type", "")
        if "json" not in ct:
            return
        # Capture review API responses
        if re.search(r"/reviews?[/?]", url, re.I) or "review" in url.lower():
            if url in review_urls_seen:
                return
            review_urls_seen.add(url)
            try:
                body = response.json()
                reviews = (body.get("reviews") or body.get("data") or
                           body.get("results") or [])
                if isinstance(reviews, list) and reviews:
                    api_reviews.extend(reviews)
                    log.info(f"[iherb] intercepted {len(reviews)} reviews from {url[:80]}")
            except Exception:
                pass
        # Capture search/product listing API responses
        elif any(k in url.lower() for k in ("search", "catalog", "/products", "listing")):
            if url in search_urls_seen:
                return
            search_urls_seen.add(url)
            try:
                body = response.json()
                prods = _extract_search_products(body)
                if prods:
                    api_products.extend(prods)
                    log.info(f"[iherb] intercepted {len(prods)} search products from {url[:80]}")
            except Exception:
                pass

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(
                headless=True,
                args=["--disable-blink-features=AutomationControlled"],
            )
            ctx = browser.new_context(
                locale="th-TH",
                user_agent=config.USER_AGENT,
                viewport={"width": 1366, "height": 768},
            )
            ctx.add_init_script(
                "Object.defineProperty(navigator,'webdriver',{get:()=>undefined})"
            )
            page = ctx.new_page()
            page.on("response", _on_response)

            # Step 1: Search
            search_url = SEARCH_URL.format(query=quote_plus(query))
            log.info(f"[iherb] search: {search_url}")
            page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(8000)

            # Step 2: Find product candidates
            # Priority 1: __NEXT_DATA__ (Next.js hydration state — most reliable)
            candidates: list[tuple[str, str]] = []
            try:
                next_data_raw = page.evaluate(
                    "() => { var el = document.getElementById('__NEXT_DATA__'); return el ? el.textContent : null; }"
                )
                if next_data_raw:
                    import json as _json
                    nd = _json.loads(next_data_raw)
                    # Walk common paths for search results in iHerb's Next.js data
                    def _walk(obj, depth=0):
                        if depth > 8 or not isinstance(obj, (dict, list)):
                            return
                        if isinstance(obj, list):
                            if len(obj) >= 3 and isinstance(obj[0], dict):
                                extracted = _extract_search_products(obj)
                                if extracted:
                                    candidates.extend(extracted)
                                    return
                            for item in obj:
                                _walk(item, depth + 1)
                        elif isinstance(obj, dict):
                            # Likely keys for search result lists
                            for key in ("products", "items", "results", "productList",
                                        "catalogEntryList", "searchResults", "data"):
                                if key in obj and isinstance(obj[key], list) and len(obj[key]) >= 2:
                                    extracted = _extract_search_products(obj[key])
                                    if extracted:
                                        candidates.extend(extracted)
                                        return
                            for v in obj.values():
                                _walk(v, depth + 1)
                    _walk(nd)
                    if candidates:
                        log.info(f"[iherb] __NEXT_DATA__: {len(candidates)} products")
            except Exception as e:
                log.debug(f"[iherb] __NEXT_DATA__ parse error: {e}")

            # Priority 2: API-intercepted products (filtered to search-specific endpoints)
            if not candidates:
                # Only use api_products from URLs that look like actual search results
                search_prods = [
                    (u, n) for u, n in api_products
                    if any(k in u.lower() for k in ("search/results", "filteredsearch",
                                                      "searchresult", "textsearch"))
                ]
                if search_prods:
                    candidates = search_prods
                    log.info(f"[iherb] search API: {len(candidates)} products")

            # Priority 3: DOM product cards (specific selectors)
            if not candidates:
                for selector in (
                    ".product-cell-title a[href*='/pr/']",
                    ".product-title a[href*='/pr/']",
                    "[data-component-type='s-search-result'] a[href*='/pr/']",
                    ".product-inner a[href*='/pr/']",
                ):
                    links = page.locator(selector).all()
                    if links:
                        log.info(f"[iherb] DOM {selector!r}: {len(links)} hits")
                        seen: set[str] = set()
                        for link in links[:25]:
                            try:
                                href = link.get_attribute("href") or ""
                                full = href if href.startswith("http") else BASE + href
                                if full in seen:
                                    continue
                                seen.add(full)
                                link_name = (link.inner_text(timeout=300) or "").strip()[:120]
                                if not link_name:
                                    slug = href.split("/pr/")[-1].split("?")[0]
                                    link_name = unquote(slug).replace("-", " ").strip()
                                if link_name and len(link_name) > 4:
                                    candidates.append((full, link_name))
                            except Exception:
                                continue
                        if candidates:
                            break

            if not candidates:
                log.info(f"[iherb] no product links for {product_name!r}")
                browser.close()
                return _empty(product_name)

            log.info(f"[iherb] {len(candidates)} candidates for {product_name!r}")

            # Step 3: Score — log top 3 for diagnostics
            norm_q = _normalize(query)
            scored = sorted(
                [(u, n, _score(norm_q, n, brand)) for u, n in candidates],
                key=lambda x: x[2], reverse=True,
            )
            for u, n, s in scored[:3]:
                log.info(f"[iherb]   candidate: {n!r:.60} score={s:.2f}")
            best_url, best_name, best_sim = scored[0]
            log.info(f"[iherb] best: {best_name!r} score={best_sim:.2f}")

            if best_sim < sim_threshold:
                log.info(f"[iherb] score {best_sim:.2f} < {sim_threshold} — skip")
                browser.close()
                return _empty(product_name)

            # Step 4: Navigate to product page (triggers review API)
            time.sleep(1)
            log.info(f"[iherb] navigating to {best_url}")
            page.goto(best_url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)
            # Scroll to trigger lazy-loaded reviews
            for _ in range(4):
                page.mouse.wheel(0, 3000)
                page.wait_for_timeout(1500)
            page.wait_for_timeout(4000)

            browser.close()

    except Exception as e:
        log.warning(f"[iherb] error for {product_name!r}: {e}")
        return _empty(product_name)

    snippets = _snippets(api_reviews, best_url if candidates else "")
    log.info(f"[iherb] {len(snippets)} snippets for {product_name!r}")
    return {
        "source": "iherb",
        "product_name": product_name,
        "matched_name": best_name if candidates else "",
        "similarity": round(best_sim if candidates else 0, 3),
        "product_count": 1 if candidates else 0,
        "review_count": len(snippets),
        "snippets": snippets,
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def _snippets(raw: list[dict], source_url: str) -> list[dict]:
    out = []
    for r in raw[:15]:
        text = (r.get("review") or r.get("comment") or r.get("body") or
                r.get("text") or r.get("reviewText") or "").strip()
        if not text or len(text) < 10:
            continue
        out.append({
            "text": text[:400],
            "author": (r.get("reviewer") or r.get("nickname") or
                       r.get("name") or r.get("userName") or ""),
            "rating": float(r.get("rating") or r.get("overallRating") or 0),
            "date": r.get("date") or r.get("submissionTime") or "",
            "source_url": source_url,
        })
    return out


def _empty(product_name: str) -> dict:
    return {
        "source": "iherb", "product_name": product_name,
        "matched_name": "", "similarity": 0.0,
        "product_count": 0, "review_count": 0, "snippets": [],
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def save_iherb(product_id: str, data: dict) -> Path:
    out = config.REVIEWS_DIR / f"{product_id}_iherb.json"
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"[iherb] saved → {out}")
    return out


# iHerb carries many international brands — useful subset of our DB
_IHERB_BRANDS = {
    "CeraVe","La Roche Posay","Eucerin","Neutrogena","Cetaphil","Bioderma",
    "Avene","Vichy","COSRX","Some By Mi","Isntree","Round Lab","Klairs",
    "Beauty of Joseon","Axis-Y","Anua","I'm From","By Wishtrend","Naruko",
    "Mediheal","SKINTIFIC","Hada Labo","Himalaya","NIVEA","Garnier",
    "L'Oreal Paris","Olay","Neutrogena","Vaseline","Rohto","Dove",
    "BLACKMORES","SWISSE","Senka","Simple",
}


STOP_FILE = config.STATE_DIR / "STOP_IHERB"


def main() -> int:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--shard", default=None, help="I/N e.g. 0/4")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s [%(levelname)s] %(message)s")

    db_path = config.ROOT / "web" / "data" / "master_db.json"
    all_products: list[dict] = list(
        json.loads(db_path.read_text(encoding="utf-8"))["products"].values()
    ) if db_path.exists() else []

    iherb_brands_lower = {b.lower() for b in _IHERB_BRANDS}
    all_products = [
        p for p in all_products
        if p.get("brand", "").lower() in iherb_brands_lower
    ]

    pending = [
        p for p in all_products
        if p.get("product_id")
        and not (config.REVIEWS_DIR / f"{p['product_id']}_iherb.json").exists()
    ]
    total = len(all_products)
    skip = total - len(pending)
    done = fail = 0

    if args.shard:
        shard_i, shard_n = map(int, args.shard.split("/"))
        pending = [p for j, p in enumerate(pending) if j % shard_n == shard_i]
        print(f"iHerb reviews shard {shard_i}/{shard_n}: {len(pending)} products")
    else:
        print(f"iHerb reviews: {len(pending)} pending / {total} in brand whitelist "
              f"/ {skip} already done")

    for i, p in enumerate(pending, 1):
        if STOP_FILE.exists():
            log.info("STOP_IHERB seen — stopping")
            break
        pid = str(p["product_id"])
        print(f"[{i}/{len(pending)}] {pid}: {p.get('name','')[:50]}")
        try:
            data = find_reviews(p.get("name", ""), p.get("brand", ""))
            save_iherb(pid, data)
            done += 1
            print(f"  → matched={data['matched_name'][:35]!r} reviews={data['review_count']}")
            time.sleep(2.0)
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.error(f"{pid}: {e}")
            fail += 1

    print(f"\nDone. fetched={done} skipped={skip} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys; sys.exit(main())
