"""Watsons Thailand review scraper.

Uses Playwright (via KonvyBrowser) + SOCKS5 proxy.
Intercepts SAP OCC API /reviews endpoint for clean JSON reviews.

Public API mirrors pantip_reviews.py:
  find_reviews(product_name, brand, port) -> dict
  save_watsons(product_id, data) -> Path
  main()

Usage:
  COSMETICS_PORT_LIST=2087 python -m cosmetics.watsons_reviews
"""
from __future__ import annotations
import json, logging, re, time
from difflib import SequenceMatcher
from pathlib import Path

from cosmetics import config
from cosmetics.konvy_fetch import KonvyBrowser, is_waf_challenge

log = logging.getLogger("cosmetics.watsons_reviews")

BASE = "https://www.watsons.co.th"
SEARCH_URL = f"{BASE}/search?q={{query}}"

# SAP OCC API — intercepted from network traffic
_REVIEWS_API_RE = re.compile(r"/rest/v2/[^/]+/products/([^/]+)/reviews", re.I)
_PRODUCTS_API_RE = re.compile(r"/rest/v2/[^/]+/search\?", re.I)


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _normalize(name: str) -> str:
    """Lowercase, strip volume/size suffixes for matching."""
    n = re.sub(r"\d+\s*(ml|g|mg|oz|pcs?)\b", "", name, flags=re.I)
    return re.sub(r"\s+", " ", n).strip().lower()


def find_reviews(
    product_name: str,
    brand: str,
    port: int | None = None,
    max_products: int = 3,
    sim_threshold: float = 0.55,
) -> dict:
    """Search Watsons for a product and return its reviews.

    Returns dict with keys: source, product_name, product_count,
    review_count, snippets, fetched_at
    """
    _port = port or config.PROXY_PORT_BASE
    query = f"{brand} {product_name}".strip()

    intercepted_reviews: list[dict] = []
    matched_product: dict = {}

    try:
        with KonvyBrowser(_port) as browser:
            page = browser._page

            # ── Intercept SAP OCC API responses ──────────────────────────
            api_reviews: dict = {}  # product_code -> list[review]

            def _on_response(response):
                url = response.url
                if _REVIEWS_API_RE.search(url):
                    try:
                        body = response.json()
                        code_match = _REVIEWS_API_RE.search(url)
                        code = code_match.group(1) if code_match else "unknown"
                        reviews = body.get("reviews", [])
                        if reviews:
                            api_reviews[code] = reviews
                            log.info(f"[watsons] intercepted {len(reviews)} reviews for {code}")
                    except Exception:
                        pass

            page.on("response", _on_response)

            # ── Step 1: Search ─────────────────────────────────────────────
            search_url = SEARCH_URL.format(query=query.replace(" ", "+"))
            log.info(f"[watsons] search: {search_url}")
            html = browser.fetch_html(search_url, scroll=3, settle_ms=4000)
            if not html or is_waf_challenge(html):
                log.warning("[watsons] WAF on search page")
                return _empty(product_name)

            # ── Step 2: Find product links from DOM ────────────────────────
            # Angular renders product cards with href /p/<slug>/<code>
            product_links = page.locator("a[href*='/p/']").all()
            candidates: list[tuple[str, str]] = []  # (url, name)
            seen: set[str] = set()

            for link in product_links[:20]:
                try:
                    href = link.get_attribute("href") or ""
                    if not href.startswith("/p/"):
                        continue
                    full_url = BASE + href
                    if full_url in seen:
                        continue
                    seen.add(full_url)
                    # Try to get product name from link text or nearby element
                    name_el = link.locator("p, span, h2, h3").first
                    link_name = ""
                    try:
                        link_name = (name_el.inner_text(timeout=1000) or "").strip()
                    except Exception:
                        pass
                    if link_name:
                        candidates.append((full_url, link_name))
                except Exception:
                    continue

            if not candidates:
                log.info(f"[watsons] no product links found for {product_name!r}")
                return _empty(product_name)

            log.info(f"[watsons] {len(candidates)} candidates for {product_name!r}")

            # ── Step 3: Score candidates by name similarity ────────────────
            norm_query = _normalize(f"{brand} {product_name}")
            scored = sorted(
                [(url, name, _similarity(norm_query, _normalize(name)))
                 for url, name in candidates],
                key=lambda x: x[2], reverse=True
            )
            best_url, best_name, best_sim = scored[0]
            log.info(f"[watsons] best match: {best_name!r} sim={best_sim:.2f}")

            if best_sim < sim_threshold:
                log.info(f"[watsons] similarity {best_sim:.2f} < {sim_threshold} — skip")
                return _empty(product_name)

            matched_product = {"url": best_url, "name": best_name, "similarity": best_sim}

            # ── Step 4: Navigate to product page (triggers /reviews API) ──
            time.sleep(1.5)
            log.info(f"[watsons] navigating to {best_url}")
            browser.fetch_html(best_url, scroll=4, settle_ms=5000)
            time.sleep(2)  # let API response arrive

    except Exception as e:
        log.warning(f"[watsons] browser error for {product_name!r}: {e}")
        return _empty(product_name)

    # ── Step 5: Process intercepted reviews ───────────────────────────────
    all_raw: list[dict] = []
    for reviews_list in api_reviews.values():
        all_raw.extend(reviews_list)

    snippets = []
    for r in all_raw[:15]:
        text = (r.get("comment") or r.get("headline") or "").strip()
        if not text or len(text) < 10:
            continue
        snippets.append({
            "text": text[:300],
            "author": r.get("alias") or r.get("principal", {}).get("name", ""),
            "rating": float(r.get("rating") or 0),
            "date": r.get("date", ""),
            "source_url": matched_product.get("url", ""),
        })

    log.info(f"[watsons] {len(snippets)} review snippets for {product_name!r}")
    return {
        "source": "watsons",
        "product_name": product_name,
        "matched_name": matched_product.get("name", ""),
        "similarity": round(matched_product.get("similarity", 0), 3),
        "product_count": 1 if matched_product else 0,
        "review_count": len(snippets),
        "snippets": snippets,
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def _empty(product_name: str) -> dict:
    return {
        "source": "watsons", "product_name": product_name,
        "matched_name": "", "similarity": 0.0,
        "product_count": 0, "review_count": 0, "snippets": [],
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def save_watsons(product_id: str, data: dict) -> Path:
    """Write to cosmetics/output/reviews/<product_id>_watsons.json."""
    out = config.REVIEWS_DIR / f"{product_id}_watsons.json"
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"[watsons] saved → {out}")
    return out


def main() -> int:
    """Batch: fetch Watsons reviews for products missing _watsons.json. Resumable."""
    import os
    logging.basicConfig(level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s")

    from cosmetics import vpn_up
    ports = vpn_up.pick_active_ports()
    if not ports:
        print("ERROR: no active VPN ports"); return 1

    db_path = config.ROOT / "web" / "data" / "master_db.json"
    products: list[dict] = list(
        json.loads(db_path.read_text(encoding="utf-8"))["products"].values()
    ) if db_path.exists() else []

    port_idx = 0
    done = skip = fail = 0
    for i, p in enumerate(products, 1):
        pid = str(p.get("product_id", ""))
        if not pid:
            continue
        out = config.REVIEWS_DIR / f"{pid}_watsons.json"
        if out.exists():
            skip += 1; continue
        port = ports[port_idx % len(ports)]
        print(f"[{i}/{len(products)}] {pid}: {p.get('name','')[:50]} (port {port})")
        try:
            data = find_reviews(p.get("name",""), p.get("brand",""), port=port)
            save_watsons(pid, data)
            done += 1
            print(f"  → matched={data['matched_name'][:30]!r} reviews={data['review_count']}")
            port_idx += 1
            time.sleep(3.0)
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.error(f"{pid}: {e}"); fail += 1
    print(f"\nDone. fetched={done} skipped={skip} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys; sys.exit(main())
