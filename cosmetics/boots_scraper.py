"""Boots Thailand product scraper.

Uses Playwright + SOCKS5 proxy (Akamai WAF bypass).
Intercepts Nuxt.js API responses + parses ld+json for product data.
Products saved as output/products/boots_{slug}.json with source="boots".

Usage:
    python -m cosmetics.boots_scraper              # full batch
    python -m cosmetics.boots_scraper --limit 20   # smoke test
"""
from __future__ import annotations
import argparse, json, logging, re, time
from pathlib import Path
from playwright.sync_api import sync_playwright, Page, Response

from cosmetics import config
from cosmetics.konvy_fetch import is_waf_challenge

log = logging.getLogger("cosmetics.boots")
BASE = "https://www.boots.co.th"

CONCERN_KEYWORDS = {
    "acne":       ["สิว", "acne serum", "salicylic acid", "niacinamide acne"],
    "whitening":  ["ฝ้า", "vitamin c serum", "whitening serum", "alpha arbutin"],
    "antiaging":  ["ลดริ้วรอย", "retinol serum", "anti aging"],
    "pores":      ["รูขุมขน", "pore serum"],
    "oilcontrol": ["คุมมัน", "oil control"],
    "sensitive":  ["ผิวแพ้", "centella cica serum"],
}

CSV_FIELDS = ["product_id", "url", "name", "brand", "price_thb", "list_price_thb",
              "discount_pct", "volume", "image_url", "description", "sku",
              "ingredients", "ingredient_count", "concern_seeds",
              "konvy_rating", "konvy_review_count", "sold_count", "source", "fetched_at"]


# ── Pure helpers ──────────────────────────────────────────────────────────────

def boots_slug_to_id(url: str) -> str:
    """Extract product slug from Boots URL. '/p/product-name' -> 'product-name'"""
    m = re.search(r"/p/([^/?#]+)", url)
    return m.group(1) if m else ""


def _parse_ingredients(description: str) -> list[str]:
    """Extract INCI ingredients from product description (comma-separated)."""
    if not description or len(description) < 15:
        return []
    # Look for ingredient section
    text = description
    for marker in ["ingredients:", "ส่วนประกอบ:", "composition:"]:
        idx = text.lower().find(marker)
        if idx != -1:
            text = text[idx + len(marker):].strip()
            break
    parts = [p.strip().rstrip(".") for p in re.split(r",\s*", text)]
    inci = [p for p in parts if 3 <= len(p) <= 80
            and not re.fullmatch(r"[\d\s%.]+", p)
            and re.search(r"[A-Za-z฀-๿]", p)]
    return inci[:80]


def parse_product_from_ldjson(ld: dict, page_url: str) -> dict:
    """Parse Boots product from ld+json Product schema."""
    slug = boots_slug_to_id(page_url)
    product_id = f"boots_{slug}" if slug else ""

    brand_raw = ld.get("brand") or {}
    brand = brand_raw.get("name", "") if isinstance(brand_raw, dict) else str(brand_raw)

    offers = ld.get("offers") or {}
    price_thb = float(offers.get("price") or 0)
    list_price_thb = float(offers.get("highPrice") or 0)
    discount_pct = 0
    if list_price_thb > price_thb > 0:
        discount_pct = int(round((list_price_thb - price_thb) / list_price_thb * 100))

    ar = ld.get("aggregateRating") or {}
    rating = float(ar.get("ratingValue") or 0)
    reviews = int(ar.get("reviewCount") or 0)

    image = ld.get("image") or ""
    if isinstance(image, list):
        image = image[0] if image else ""

    description = (ld.get("description") or "").strip()
    ingredients = _parse_ingredients(description)

    name = ld.get("name") or ""
    vol_m = re.search(r"(\d+(?:\.\d+)?)\s*(ml|g|oz)\b", name, re.I)
    volume = f"{vol_m.group(1)}{vol_m.group(2)}" if vol_m else ""

    return {
        "product_id": product_id,
        "url": page_url,
        "name": name,
        "brand": brand,
        "price_thb": price_thb,
        "list_price_thb": list_price_thb,
        "discount_pct": discount_pct,
        "volume": volume,
        "image_url": str(image),
        "description": description,
        "sku": str(ld.get("sku") or ""),
        "ingredients": ingredients,
        "ingredient_count": len(ingredients),
        "konvy_rating": rating,
        "konvy_review_count": reviews,
        "sold_count": 0,
        "source": "boots",
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def parse_product_from_api(data: dict, page_url: str) -> dict:
    """Parse Boots product from intercepted Nuxt/API JSON response."""
    slug = boots_slug_to_id(data.get("url", "") or page_url)
    product_id = f"boots_{slug}" if slug else f"boots_{data.get('code','unknown')}"

    price_raw = data.get("price") or {}
    price_thb = float(price_raw.get("value") or 0)

    images = data.get("images") or []
    image_url = ""
    for img in images:
        if img.get("format") in ("product", "zoom", "thumbnail"):
            src = img.get("url") or ""
            image_url = (BASE + src) if src.startswith("/") else src
            break

    name = data.get("name") or ""
    vol_m = re.search(r"(\d+(?:\.\d+)?)\s*(ml|g|oz)\b", name, re.I)

    return {
        "product_id": product_id,
        "url": BASE + (data.get("url") or "") if not page_url.startswith("http") else page_url,
        "name": name,
        "brand": data.get("brand") or "",
        "price_thb": price_thb,
        "list_price_thb": 0.0,
        "discount_pct": 0,
        "volume": f"{vol_m.group(1)}{vol_m.group(2)}" if vol_m else "",
        "image_url": image_url,
        "description": data.get("summary") or data.get("description") or "",
        "sku": str(data.get("code") or ""),
        "ingredients": [],
        "ingredient_count": 0,
        "konvy_rating": float(data.get("averageRating") or 0),
        "konvy_review_count": int(data.get("numberOfReviews") or 0),
        "sold_count": 0,
        "source": "boots",
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def normalize_boots_product(p: dict) -> dict:
    out = dict(p)
    for f in CSV_FIELDS:
        if f not in out:
            out[f] = ""
    ing = out.get("ingredients", [])
    if isinstance(ing, list):
        out["ingredients"] = "|".join(ing)
    seeds = out.get("concern_seeds", [])
    if isinstance(seeds, list):
        out["concern_seeds"] = "|".join(seeds)
    return out


# ── Playwright scraping ───────────────────────────────────────────────────────

def _find_ldjson_product(html: str) -> dict:
    for m in re.finditer(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                         html, re.DOTALL | re.IGNORECASE):
        try:
            d = json.loads(m.group(1))
            if isinstance(d, list):
                d = next((x for x in d if x.get("@type") == "Product"), {})
            if d.get("@type") == "Product":
                return d
        except Exception:
            continue
    return {}


class _ProductInterceptor:
    """Listens to Nuxt API responses to capture product JSON."""
    def __init__(self):
        self.products: list[dict] = []
        self.product_urls: list[str] = []

    def on_response(self, resp: Response) -> None:
        url = resp.url
        ct = resp.headers.get("content-type", "")
        if "application/json" not in ct:
            return
        # Search result endpoint
        if any(k in url for k in ["/search", "/products", "/catalogue"]):
            try:
                body = resp.json()
                self._extract_products(body, url)
            except Exception:
                pass
        # Individual product
        if "/p/" in url or "/product" in url:
            try:
                body = resp.json()
                if isinstance(body, dict) and body.get("name") and body.get("price"):
                    self.products.append(body)
            except Exception:
                pass

    def _extract_products(self, body: "dict | list", source_url: str) -> None:
        if isinstance(body, list):
            for item in body:
                if isinstance(item, dict) and item.get("name") and item.get("price"):
                    self.products.append(item)
        elif isinstance(body, dict):
            for key in ["products", "results", "items", "data", "searchResult"]:
                items = body.get(key)
                if isinstance(items, list):
                    for item in items:
                        if isinstance(item, dict) and item.get("name"):
                            self.products.append(item)
                    return
            # Might be a product array wrapper
            if body.get("name") and body.get("price"):
                self.products.append(body)


def scrape_search_results(page: Page, interceptor: _ProductInterceptor,
                          search_url: str) -> list[str]:
    """Load search page, collect product URLs from DOM."""
    try:
        page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
        for _ in range(3):
            page.evaluate("window.scrollBy(0, window.innerHeight)")
            page.wait_for_timeout(1000)
        links = page.locator("a[href*='/p/']").all()
        urls = []
        seen = set()
        for link in links[:40]:
            try:
                href = link.get_attribute("href") or ""
                if "/p/" not in href:
                    continue
                full = href if href.startswith("http") else BASE + href
                slug = boots_slug_to_id(full)
                if slug and slug not in seen:
                    seen.add(slug)
                    urls.append(full)
            except Exception:
                continue
        return urls
    except Exception as e:
        log.warning(f"search error {search_url}: {e}")
        return []


def scrape_product(page: Page, interceptor: _ProductInterceptor,
                   url: str) -> "dict | None":
    """Load product page, try ld+json first, then intercepted API data."""
    interceptor.products.clear()
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(2000)
        html = page.content()
        if is_waf_challenge(html):
            log.warning(f"WAF on {url}")
            return None
        # Try ld+json first (most reliable)
        ld = _find_ldjson_product(html)
        if ld:
            return parse_product_from_ldjson(ld, url)
        # Try intercepted API data
        if interceptor.products:
            return parse_product_from_api(interceptor.products[-1], url)
        return None
    except Exception as e:
        log.warning(f"product error {url}: {e}")
        return None


# ── Progress / persistence ────────────────────────────────────────────────────

def _prog_path() -> Path:
    return config.STATE_DIR / "boots_progress.json"

def _load_progress() -> dict:
    p = _prog_path()
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}

def _save_progress(prog: dict) -> None:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    _prog_path().write_text(json.dumps(prog, ensure_ascii=False, indent=2), encoding="utf-8")

def _product_path(pid: str) -> Path:
    return config.OUTPUT_DIR / "products" / f"{pid}.json"

def save_product(p: dict) -> Path:
    path = _product_path(p["product_id"])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(normalize_boots_product(p), ensure_ascii=False, indent=2),
                    encoding="utf-8")
    return path


# ── Main crawler ──────────────────────────────────────────────────────────────

def crawl(limit: "int | None" = None, port: "int | None" = None) -> int:
    _port = port or config.PROXY_PORT_BASE
    progress = _load_progress()
    done = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            proxy={"server": f"socks5://{config.PROXY_HOST}:{_port}"},
            args=["--disable-blink-features=AutomationControlled", "--no-sandbox"],
        )
        ctx = browser.new_context(
            user_agent=config.USER_AGENT,
            viewport={"width": 1280, "height": 720},
            extra_http_headers={"Accept-Language": "th-TH,th;q=0.9,en;q=0.8"},
        )
        page = ctx.new_page()
        interceptor = _ProductInterceptor()
        page.on("response", interceptor.on_response)

        try:
            for concern, keywords in CONCERN_KEYWORDS.items():
                for kw in keywords:
                    search_url = f"{BASE}/search?q={kw.replace(' ', '+')}"
                    log.info(f"[boots] searching: {kw!r} ({concern})")
                    urls = scrape_search_results(page, interceptor, search_url)
                    log.info(f"[boots]   {len(urls)} product URLs found")
                    time.sleep(1.5)

                    for purl in urls:
                        pid = f"boots_{boots_slug_to_id(purl)}"
                        if not pid or pid == "boots_":
                            continue
                        if progress.get(pid, {}).get("status") == "ok":
                            continue
                        if _product_path(pid).exists():
                            progress[pid] = {"status": "ok"}
                            continue

                        time.sleep(1.5)
                        product = scrape_product(page, interceptor, purl)
                        if product:
                            product["concern_seeds"] = [concern]
                            save_product(product)
                            progress[pid] = {"status": "ok", "name": product["name"][:60]}
                            done += 1
                            log.info(f"[boots] OK {pid} {product['name'][:45]} ฿{product['price_thb']:.0f}")
                        else:
                            progress[pid] = {"status": "error"}

                        _save_progress(progress)
                        if limit and done >= limit:
                            log.info(f"[boots] limit {limit} reached")
                            return 0
        finally:
            browser.close()

    log.info(f"[boots] DONE: {done} products")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--port", type=int, default=None)
    args = ap.parse_args()
    logging.basicConfig(level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
    return crawl(args.limit, args.port)


if __name__ == "__main__":
    import sys; sys.exit(main())
