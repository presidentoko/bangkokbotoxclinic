"""Watsons Thailand review scraper.

Uses Playwright (via KonvyBrowser) + SOCKS5 proxy.
Intercepts SAP OCC API /reviews endpoint for clean JSON reviews.
Falls back to httpx direct OCC request (faster if Akamai allows it).

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
from cosmetics.konvy_fetch import KonvyBrowser, is_socks_dead_error, is_waf_challenge


def _is_blocked(html: str) -> bool:
    """Detect Akamai / generic 'Access Denied' hard-block (distinct from WAF JS challenge)."""
    if not html or len(html) < 2000:
        low = (html or "").lower()
        if "access denied" in low or "edgesuite.net" in low or "reference #" in low:
            return True
    return False

log = logging.getLogger("cosmetics.watsons_reviews")

BASE = "https://www.watsons.co.th"
SEARCH_URL = f"{BASE}/search?q={{query}}"

# SAP OCC API — Watsons TH uses /api/v2/wtcth/products/{code}/paginatedReviews
_REVIEWS_API_RE = re.compile(r"/(?:rest|api)/v2/[^/]+/products/([^/]+)/paginatedReviews", re.I)
_OCC_BASE_RE = re.compile(r"(https://[^/?]+/(?:rest|api)/v2/[^/?]+)", re.I)
_OCC_BASE_DEFAULT = "https://api.watsons.co.th/api/v2/wtcth"

# Brands confirmed on Watsons TH (from hit analysis) + known drugstore brands.
# Products outside this set are skipped to cut pass time 8h → ~1h.
_WATSONS_BRANDS = {
    # Confirmed hits
    "Plantnery","Mentholatum","Smooto Japan","BANOBAGI","Dr.PONG (Skincare)",
    "MizuMi","PROVAMED","CLEAR NOSE","Nu Formula","BK","Smooth E","DERMEDY",
    "Ziiit","PWP","Puricas","Mediheal","CBG Devices","NIVEA","SKINTIFIC",
    "Garnier","SWISSE","HER HYNESS","Cathy Doll","Oxe Cure","Senka",
    "HADABIREI","Kaowmanee","Interpharma","AESTURA","CURESYS","Bioderma",
    "Hada Labo","Verite","SuperShades",
    # Major international brands stocked by Watsons TH
    "Eucerin","La Roche Posay","CeraVe","Neutrogena","Cetaphil","Vaseline",
    "L'Oreal Paris","Vichy","Avene","Olay","COSRX","Biore","Rohto","Dove",
    "Simple","Pond's","Nivea","Bioderma",
    # Thai mass-market brands
    "Rojukiss","Cute Press","ACNE-AID","Mistine","Snail White","Hiisees",
    "Derma Angel","Yanhee","Natracare","Blackmore","BLACKMORES",
    # More drugstore brands
    "Himalaya","Naruko","Some By Mi","Isntree","Round Lab","Beauty of Joseon",
    "Klairs","Axis-Y","Anua","I'm From","By Wishtrend",
}


def _occ_code(url_code: str) -> str:
    """Convert URL product code BP_102430 → API code 102430."""
    return url_code.split("_")[-1] if "_" in url_code else url_code


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _normalize(name: str) -> str:
    """Lowercase, strip volume/size suffixes for matching."""
    n = re.sub(r"\d+\s*(ml|g|mg|oz|pcs?)\b", "", name, flags=re.I)
    return re.sub(r"\s+", " ", n).strip().lower()


def _snippets_from_raw(raw: list[dict], source_url: str) -> list[dict]:
    snippets = []
    for r in raw[:15]:
        text = (r.get("comment") or r.get("headline") or "").strip()
        if not text or len(text) < 10:
            continue
        snippets.append({
            "text": text[:300],
            "author": r.get("alias") or r.get("principal", {}).get("name", ""),
            "rating": float(r.get("rating") or 0),
            "date": r.get("date", ""),
            "source_url": source_url,
        })
    return snippets


def _reviews_via_httpx(
    occ_base: str, product_code: str, port: int,
    httpx_ok: list,  # [True] → set to [False] on first 403 to skip all future calls
) -> list[dict]:
    """Try fetching OCC reviews directly — skips Playwright page nav if Akamai allows it."""
    if not httpx_ok[0]:
        return []
    try:
        import httpx
        api_code = _occ_code(product_code)  # BP_102430 → 102430
        url = (f"{occ_base}/products/{api_code}/paginatedReviews"
               "?currentPage=0&pageSize=20&sort=score%3Adesc&lang=th&curr=THB")
        proxies = {"all://": f"socks5://{config.PROXY_HOST}:{port}"}
        with httpx.Client(
            proxies=proxies, timeout=12,
            headers={"Accept": "application/json", "User-Agent": config.USER_AGENT},
        ) as c:
            r = c.get(url)
            if r.status_code == 200:
                body = r.json()
                return body.get("results") or body.get("reviews", [])
            if r.status_code == 403:
                log.debug(f"[watsons] httpx 403 — disabling direct API for this session")
                httpx_ok[0] = False
            else:
                log.debug(f"[watsons] httpx {r.status_code} for {product_code}")
    except Exception as e:
        log.debug(f"[watsons] httpx direct failed for {product_code}: {e}")
    return []


def _fetch_one(
    browser: KonvyBrowser,
    product_name: str,
    brand: str,
    port: int,
    occ_base: list,        # mutable holder: [str|None] — shared across calls
    httpx_ok: list,        # [True] → flipped to [False] after first 403
    sim_threshold: float = 0.55,
) -> dict:
    """Fetch reviews for one product using an already-open KonvyBrowser.

    occ_base is a 1-element list used as a mutable string holder so the OCC
    store base URL (e.g. https://www.watsons.co.th/rest/v2/watsonsth) is
    captured on first interception and reused for subsequent httpx calls.
    """
    page = browser._page
    query = f"{brand} {product_name}".strip()
    api_reviews: dict[str, list] = {}
    matched_product: dict = {}

    def _on_response(response):
        url = response.url
        if not occ_base[0]:
            m = _OCC_BASE_RE.match(url)
            if m:
                occ_base[0] = m.group(1)
        if _REVIEWS_API_RE.search(url):
            try:
                body = response.json()
                m = _REVIEWS_API_RE.search(url)
                code = m.group(1) if m else "unknown"
                # paginatedReviews uses "results"; plain /reviews uses "reviews"
                reviews = body.get("results") or body.get("reviews", [])
                if reviews:
                    api_reviews[code] = reviews
                    log.info(f"[watsons] intercepted {len(reviews)} reviews for {code}")
            except Exception:
                pass

    page.on("response", _on_response)
    try:
        # ── Step 1: Search ─────────────────────────────────────────────
        search_url = SEARCH_URL.format(query=query.replace(" ", "+"))
        log.info(f"[watsons] search: {search_url}")
        html = browser.fetch_html(search_url, scroll=3, settle_ms=8000)
        log.info(f"[watsons] search html size={len(html or '')}")
        if _is_blocked(html):
            log.warning("[watsons] Akamai block on search — raising to trigger browser restart")
            raise RuntimeError("akamai_block")
        if not html or is_waf_challenge(html):
            log.warning("[watsons] WAF on search page")
            return _empty(product_name)

        # ── Step 2: Find product links from DOM ────────────────────────
        product_links = page.locator("a[href*='/p/']").all()
        candidates: list[tuple[str, str]] = []
        seen: set[str] = set()

        for link in product_links[:20]:
            try:
                href = link.get_attribute("href") or ""
                if "/p/" not in href:
                    continue
                full_url = BASE + href
                if full_url in seen:
                    continue
                seen.add(full_url)
                link_name = ""
                # 1st try: child text elements (fast path)
                try:
                    name_el = link.locator("p, span, h2, h3").first
                    link_name = (name_el.inner_text(timeout=300) or "").strip()
                except Exception:
                    pass
                # 2nd try: full anchor inner text
                if not link_name:
                    try:
                        link_name = (link.inner_text(timeout=300) or "").strip()[:120]
                    except Exception:
                        pass
                # 3rd try: decode URL slug  /th/<slug>/p/<code>
                if not link_name:
                    from urllib.parse import unquote
                    slug = href.split("/p/")[0].rsplit("/", 1)[-1]
                    link_name = unquote(slug).replace("-", " ").strip()
                if link_name:
                    candidates.append((full_url, link_name))
            except Exception:
                continue

        if not candidates:
            log.info(f"[watsons] no product links found for {product_name!r}")
            return _empty(product_name)

        log.info(f"[watsons] {len(candidates)} candidates for {product_name!r}")

        # ── Step 3: Score candidates by name similarity ────────────────
        # Watsons slugs are "<brand>-<Thai transliteration>-..." so raw similarity
        # against English queries is always low.  Score by: brand-in-slug boost +
        # similarity on ASCII-only portion of the name.
        norm_query = _normalize(f"{brand} {product_name}")
        brand_token = brand.lower().split()[0]  # first word of brand for slug check

        def _score(name: str) -> float:
            ascii_part = "".join(c if ord(c) < 128 else " " for c in name)
            base = _similarity(norm_query, _normalize(ascii_part))
            boost = 0.3 if brand_token in name.lower() else 0.0
            return base + boost

        scored = sorted(
            [(url, name, _score(name)) for url, name in candidates],
            key=lambda x: x[2], reverse=True
        )
        best_url, best_name, best_sim = scored[0]
        log.info(f"[watsons] best match: {best_name!r} score={best_sim:.2f}")

        if best_sim < sim_threshold:
            log.info(f"[watsons] score {best_sim:.2f} < {sim_threshold} — skip")
            return _empty(product_name)

        matched_product = {"url": best_url, "name": best_name, "similarity": best_sim}

        # ── Step 4a: Try httpx direct OCC API ─────────────────────────
        # Product code is the last path segment of /p/<slug>/<code>
        product_code = best_url.rstrip("/").split("/")[-1]
        if occ_base[0] and product_code and httpx_ok[0]:
            raw_httpx = _reviews_via_httpx(occ_base[0], product_code, port, httpx_ok)
            if raw_httpx:
                log.info(
                    f"[watsons] httpx direct: {len(raw_httpx)} reviews for {product_code}"
                )
                snippets = _snippets_from_raw(raw_httpx, best_url)
                return _result(product_name, matched_product, snippets)

        # ── Step 4b: Navigate to product page (triggers /reviews API) ──
        time.sleep(1.5)
        log.info(f"[watsons] navigating to {best_url}")
        browser.fetch_html(best_url, scroll=4, settle_ms=8000)
        time.sleep(2)  # let API response arrive

    finally:
        page.remove_listener("response", _on_response)

    # ── Step 5: Process intercepted reviews ───────────────────────────
    all_raw: list[dict] = []
    for reviews_list in api_reviews.values():
        all_raw.extend(reviews_list)

    snippets = _snippets_from_raw(all_raw, matched_product.get("url", ""))
    log.info(f"[watsons] {len(snippets)} review snippets for {product_name!r}")
    return _result(product_name, matched_product, snippets)


def _result(product_name: str, matched: dict, snippets: list[dict]) -> dict:
    return {
        "source": "watsons",
        "product_name": product_name,
        "matched_name": matched.get("name", ""),
        "similarity": round(matched.get("similarity", 0), 3),
        "product_count": 1 if matched else 0,
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
    try:
        with KonvyBrowser(_port) as browser:
            return _fetch_one(browser, product_name, brand, _port,
                              occ_base=[_OCC_BASE_DEFAULT], httpx_ok=[True],
                              sim_threshold=sim_threshold)
    except Exception as e:
        log.warning(f"[watsons] browser error for {product_name!r}: {e}")
        return _empty(product_name)


def save_watsons(product_id: str, data: dict) -> Path:
    """Write to cosmetics/output/reviews/<product_id>_watsons.json."""
    out = config.REVIEWS_DIR / f"{product_id}_watsons.json"
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"[watsons] saved → {out}")
    return out


def main() -> int:
    """Batch: fetch Watsons reviews for products missing _watsons.json. Resumable."""
    import argparse, os
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=None, help="VPN SOCKS5 port to use")
    parser.add_argument("--shard", default=None, help="I/N e.g. 0/4 — worker index / total workers")
    parser.add_argument("--no-proxy", action="store_true", help="Direct connection (no SOCKS5) — use with phone hotspot")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s")

    if args.no_proxy:
        port = None
        print("Running WITHOUT proxy (direct connection)")
    else:
        from cosmetics import vpn_up
        ports = vpn_up.pick_active_ports()
        if not ports:
            print("ERROR: no active VPN ports"); return 1
        port = args.port if args.port else (vpn_up.pick_healthy_port(ports) or ports[-1])

    db_path = config.ROOT / "web" / "data" / "master_db.json"
    all_products: list[dict] = list(
        json.loads(db_path.read_text(encoding="utf-8"))["products"].values()
    ) if db_path.exists() else []

    # Only scrape brands that are carried by Watsons Thailand.
    # Skipping Konvy-only niche brands cuts pass time 8h → ~1h.
    watsons_brands = {b.lower() for b in _WATSONS_BRANDS}
    all_products = [
        p for p in all_products
        if p.get("brand", "").lower() in watsons_brands
    ]

    # Build resumable pending list (skip already-done)
    pending = [
        p for p in all_products
        if p.get("product_id")
        and not (config.REVIEWS_DIR / f"{p['product_id']}_watsons.json").exists()
    ]
    total = len(all_products)
    skip = total - len(pending)
    done = fail = 0

    if args.shard:
        shard_i, shard_n = map(int, args.shard.split("/"))
        pending = [p for j, p in enumerate(pending) if j % shard_n == shard_i]
        print(f"[watsons] shard {shard_i}/{shard_n}: {len(pending)} products")
    else:
        print(f"[watsons] {len(pending)} pending / {total} total / {skip} already done")

    print(f"[watsons] port={port if port else 'direct(no-proxy)'}")

    # Outer loop: recreate browser on crash/tunnel death
    while pending:
        occ_base: list = [_OCC_BASE_DEFAULT]
        httpx_ok: list = [True]
        try:
            with KonvyBrowser(port) as browser:
                while pending:
                    p = pending[0]
                    pid = str(p["product_id"])
                    idx = total - len(pending) + 1
                    print(f"[{idx}/{total}] {pid}: {p.get('name','')[:50]} (port {port})")
                    try:
                        data = _fetch_one(
                            browser, p.get("name", ""), p.get("brand", ""),
                            port, occ_base, httpx_ok,
                        )
                        save_watsons(pid, data)
                        done += 1
                        pending.pop(0)
                        print(f"  → matched={data['matched_name'][:30]!r} "
                              f"reviews={data['review_count']}")
                        time.sleep(3.0)
                    except KeyboardInterrupt:
                        raise
                    except Exception as e:
                        err = str(e)
                        log.error(f"{pid}: {err}")
                        fail += 1
                        pending.pop(0)
                        if is_socks_dead_error(err):
                            raise  # restart the browser
        except KeyboardInterrupt:
            break
        except Exception as e:
            log.warning(f"[watsons] browser restart after: {e}")
            time.sleep(5)

    print(f"\nDone. fetched={done} skipped={skip} failed={fail}")
    return 0


if __name__ == "__main__":
    import sys; sys.exit(main())
