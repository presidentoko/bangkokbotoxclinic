"""Boots Thailand review scraper.

Uses Playwright (via KonvyBrowser stealth) + SOCKS5 proxy.
Intercepts product page network traffic to find review data.

Public API mirrors watsons_reviews.py:
  find_reviews(product_name, brand, port) -> dict
  save_boots(product_id, data) -> Path
  main()

Usage:
  python -m cosmetics.boots_reviews
"""
from __future__ import annotations
import json, logging, re, time
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import unquote, quote_plus

from cosmetics import config
from cosmetics.konvy_fetch import KonvyBrowser, is_socks_dead_error, is_waf_challenge

log = logging.getLogger("cosmetics.boots_reviews")

BASE = "https://www.boots.co.th"
SEARCH_URL = f"{BASE}/search?q={{query}}"

_REVIEW_RE = re.compile(r"review", re.I)


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _normalize(name: str) -> str:
    n = re.sub(r"\d+\s*(ml|g|mg|oz|pcs?)\b", "", name, flags=re.I)
    return re.sub(r"\s+", " ", n).strip().lower()


def _score(query: str, name: str, brand: str) -> float:
    brand_token = brand.lower().split()[0] if brand else ""
    # Hard-zero if brand absent from candidate — avoids cross-category noise
    if brand_token and brand_token not in name.lower():
        return 0.0
    ascii_name = "".join(c if ord(c) < 128 else " " for c in name)
    base = _similarity(_normalize(query), _normalize(ascii_name))
    boost = 0.3 if brand_token and brand_token in name.lower() else 0.0
    return base + boost


def _snippets(raw: list[dict], source_url: str) -> list[dict]:
    out = []
    for r in raw[:15]:
        text = (r.get("reviewText") or r.get("comment") or r.get("body") or
                r.get("text") or r.get("review") or "").strip()
        if not text or len(text) < 10:
            continue
        out.append({
            "text": text[:400],
            "author": (r.get("nickname") or r.get("alias") or
                       r.get("reviewer") or r.get("name") or ""),
            "rating": float(r.get("rating") or r.get("overallRating") or 0),
            "date": r.get("date") or r.get("submissionTime") or "",
            "source_url": source_url,
        })
    return out


def _empty(product_name: str) -> dict:
    return {
        "source": "boots", "product_name": product_name,
        "matched_name": "", "similarity": 0.0,
        "product_count": 0, "review_count": 0, "snippets": [],
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def _is_blocked(html: str) -> bool:
    if not html or len(html) < 2000:
        low = (html or "").lower()
        return "access denied" in low or "edgesuite.net" in low
    return False


def _extract_api_products(body: "dict | list") -> list[tuple[str, str]]:
    """Pull (url, name) pairs from boots.co.th search API response."""
    results: list[tuple[str, str]] = []

    def _from_item(item: dict) -> None:
        name = item.get("name") or ""
        url = item.get("url") or ""
        if name and url:
            full = url if url.startswith("http") else BASE + url
            results.append((full, name))

    if isinstance(body, list):
        for item in body:
            if isinstance(item, dict) and item.get("name"):
                _from_item(item)
    elif isinstance(body, dict):
        for key in ("products", "results", "items", "data", "searchResult"):
            items = body.get(key)
            if isinstance(items, list):
                for item in items:
                    if isinstance(item, dict) and item.get("name"):
                        _from_item(item)
                break
        if not results and body.get("name"):
            _from_item(body)
    return results


def _fetch_one(
    browser: KonvyBrowser,
    product_name: str,
    brand: str,
    sim_threshold: float = 0.45,
) -> dict:
    page = browser._page
    query = f"{brand} {product_name}".strip()
    api_reviews: list[dict] = []
    api_products: list[tuple[str, str]] = []
    matched: dict = {}

    def _on_response(response):
        url = response.url
        ct = response.headers.get("content-type", "")
        if "json" not in ct or "boots.co.th" not in url:
            return
        try:
            body = response.json()
        except Exception:
            return
        # Capture review API responses
        if _REVIEW_RE.search(url):
            reviews = (body.get("reviews") or body.get("results") or
                       body.get("data") or [])
            if isinstance(reviews, list) and reviews:
                api_reviews.extend(reviews)
                log.info(f"[boots] intercepted {len(reviews)} reviews from {url[:80]}")
        # Capture search/product listing API responses
        elif any(k in url for k in ("/search", "/products", "/catalogue")):
            prods = _extract_api_products(body)
            if prods:
                api_products.extend(prods)
                log.info(f"[boots] intercepted {len(prods)} products from {url[:80]}")

    page.on("response", _on_response)
    try:
        search_url = SEARCH_URL.format(query=quote_plus(query))
        log.info(f"[boots] search: {search_url}")
        html = browser.fetch_html(search_url, scroll=3, settle_ms=6000)

        if _is_blocked(html) or not html or is_waf_challenge(html):
            log.warning("[boots] blocked/WAF")
            raise RuntimeError("boots_blocked")

        # DOM links: filter out non-product hrefs (pagination, social, etc.)
        links = page.locator("a[href*='/p/']").all()
        dom_candidates: list[tuple[str, str]] = []
        seen: set[str] = set()

        for link in links[:30]:
            try:
                href = link.get_attribute("href") or ""
                if "/p/" not in href:
                    continue
                # Skip pure pagination or very short slugs (e.g. /p/1, /p/2)
                slug_part = href.split("/p/")[-1].split("?")[0].split("#")[0]
                if len(slug_part) < 5:
                    continue
                full = href if href.startswith("http") else BASE + href
                if full in seen:
                    continue
                seen.add(full)
                link_name = ""
                try:
                    link_name = (link.inner_text(timeout=300) or "").strip()[:120]
                except Exception:
                    pass
                if not link_name:
                    link_name = unquote(slug_part).replace("-", " ").strip()
                # Skip clearly non-product names (@handle, URLs, very short)
                if link_name and not link_name.startswith("@") and len(link_name) > 4:
                    dom_candidates.append((full, link_name))
            except Exception:
                continue

        # Merge DOM + API candidates (API is more reliable when available)
        seen_urls: set[str] = {u for u, _ in dom_candidates}
        for u, n in api_products:
            if u not in seen_urls:
                dom_candidates.append((u, n))
                seen_urls.add(u)

        candidates = dom_candidates
        if not candidates:
            log.info(f"[boots] no product links for {product_name!r}")
            return _empty(product_name)

        log.info(f"[boots] {len(candidates)} candidates for {product_name!r}")

        norm_q = _normalize(f"{brand} {product_name}")
        scored = sorted(
            [(u, n, _score(norm_q, n, brand)) for u, n in candidates],
            key=lambda x: x[2], reverse=True,
        )
        best_url, best_name, best_sim = scored[0]
        log.info(f"[boots] best: {best_name!r} score={best_sim:.2f}")

        if best_sim < sim_threshold:
            log.info(f"[boots] score {best_sim:.2f} < {sim_threshold} — skip")
            return _empty(product_name)

        matched = {"url": best_url, "name": best_name, "similarity": best_sim}

        time.sleep(1.5)
        log.info(f"[boots] navigating to {best_url}")
        browser.fetch_html(best_url, scroll=5, settle_ms=6000)
        time.sleep(2)

    finally:
        page.remove_listener("response", _on_response)

    snippets = _snippets(api_reviews, matched.get("url", ""))
    log.info(f"[boots] {len(snippets)} snippets for {product_name!r}")
    return {
        "source": "boots",
        "product_name": product_name,
        "matched_name": matched.get("name", ""),
        "similarity": round(matched.get("similarity", 0), 3),
        "product_count": 1 if matched else 0,
        "review_count": len(snippets),
        "snippets": snippets,
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def find_reviews(product_name: str, brand: str, port: int | None = None) -> dict:
    _port = port or config.PROXY_PORT_BASE
    try:
        with KonvyBrowser(_port) as browser:
            return _fetch_one(browser, product_name, brand)
    except Exception as e:
        log.warning(f"[boots] browser error for {product_name!r}: {e}")
        return _empty(product_name)


def save_boots(product_id: str, data: dict) -> Path:
    out = config.REVIEWS_DIR / f"{product_id}_boots.json"
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"[boots] saved → {out}")
    return out


# Same whitelist as Watsons — both are drugstore chains
_BOOTS_BRANDS = {
    "Eucerin","La Roche Posay","CeraVe","Neutrogena","Cetaphil","Bioderma",
    "Avene","Vichy","COSRX","NIVEA","Garnier","L'Oreal Paris","Olay","Vaseline",
    "Hada Labo","Senka","Biore","Rohto","Dove","Pond's","ACNE-AID",
    "Smooth E","CLEAR NOSE","Plantnery","Mentholatum","Nu Formula","BK",
    "SKINTIFIC","MizuMi","BANOBAGI","Mediheal","PROVAMED","DERMEDY",
    "Cathy Doll","Smooto Japan","HER HYNESS","Puricas","Snail White",
    "Some By Mi","Isntree","Klairs","Beauty of Joseon","Naruko",
}


def main() -> int:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=None)
    parser.add_argument("--shard", default=None, help="I/N e.g. 0/4")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s [%(levelname)s] %(message)s")

    from cosmetics import vpn_up
    ports = vpn_up.pick_active_ports()
    if not ports:
        print("ERROR: no active VPN ports"); return 1

    db_path = config.ROOT / "web" / "data" / "master_db.json"
    all_products: list[dict] = list(
        json.loads(db_path.read_text(encoding="utf-8"))["products"].values()
    ) if db_path.exists() else []

    boots_brands_lower = {b.lower() for b in _BOOTS_BRANDS}
    all_products = [
        p for p in all_products
        if p.get("brand", "").lower() in boots_brands_lower
    ]

    pending = [
        p for p in all_products
        if p.get("product_id")
        and not (config.REVIEWS_DIR / f"{p['product_id']}_boots.json").exists()
    ]
    total = len(all_products)
    skip = total - len(pending)
    done = fail = 0

    if args.shard:
        shard_i, shard_n = map(int, args.shard.split("/"))
        pending = [p for j, p in enumerate(pending) if j % shard_n == shard_i]
        print(f"Boots reviews shard {shard_i}/{shard_n}: {len(pending)} products")
    else:
        print(f"Boots reviews: {len(pending)} pending / {total} in brand whitelist "
              f"/ {skip} already done")

    port = args.port if args.port else ports[-1]

    while pending:
        try:
            with KonvyBrowser(port) as browser:
                while pending:
                    p = pending[0]
                    pid = str(p["product_id"])
                    idx = total - len(pending) + 1
                    print(f"[{idx}/{total}] {pid}: {p.get('name','')[:50]}")
                    try:
                        data = _fetch_one(browser, p.get("name", ""), p.get("brand", ""))
                        save_boots(pid, data)
                        done += 1
                        pending.pop(0)
                        print(f"  → matched={data['matched_name'][:30]!r} "
                              f"reviews={data['review_count']}")
                        time.sleep(2.5)
                    except KeyboardInterrupt:
                        raise
                    except Exception as e:
                        err = str(e)
                        log.error(f"{pid}: {err}")
                        fail += 1
                        pending.pop(0)
                        if is_socks_dead_error(err):
                            raise
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.warning(f"[boots] browser restart: {e}")
            time.sleep(5)

    print(f"\nDone. fetched={done} skipped={skip} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys; sys.exit(main())
