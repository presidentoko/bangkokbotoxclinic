"""iHerb Thailand product scraper.

Scrapes skincare products from th.iherb.com using Playwright (Cloudflare-safe).
Products saved as output/products/iherb_{id}.json with source="iherb".
No SOCKS5 proxy needed — iHerb is an international site.

Usage:
    python -m cosmetics.iherb_scraper              # full batch
    python -m cosmetics.iherb_scraper --limit 20   # smoke test
"""
from __future__ import annotations
import argparse, json, logging, re, time
from pathlib import Path
from playwright.sync_api import sync_playwright, Page

from cosmetics import config

log = logging.getLogger("cosmetics.iherb")
BASE = "https://th.iherb.com"

# Same concern → Thai search keywords as Konvy, adapted for iHerb search
CONCERN_KEYWORDS = {
    "acne":      ["acne serum", "salicylic acid", "niacinamide acne", "benzoyl peroxide"],
    "whitening": ["niacinamide brightening", "vitamin c serum", "alpha arbutin", "tranexamic acid"],
    "antiaging": ["retinol serum", "vitamin c anti aging", "peptide serum"],
    "pores":     ["niacinamide pores", "pore minimizer serum"],
    "oilcontrol":["oil control serum", "zinc niacinamide"],
    "sensitive": ["centella asiatica", "cica serum", "ceramide sensitive"],
}

CSV_FIELDS = ["product_id", "url", "name", "brand", "price_thb", "list_price_thb",
              "discount_pct", "volume", "image_url", "description", "sku", "gtin8",
              "ingredients", "ingredient_count", "concern_seeds",
              "konvy_rating", "konvy_review_count", "sold_count", "source", "fetched_at"]


# ── Pure helpers (unit-testable, no network) ──────────────────────────────────

def iherb_slug_to_id(url: str) -> str:
    """Extract numeric product ID from iHerb URL. '/pr/slug/12345' → '12345'"""
    m = re.search(r"/(\d+)(?:[/?#].*)?$", url)
    return m.group(1) if m else ""


def extract_ingredients_from_description(description: str) -> list[str]:
    """Extract INCI ingredient list from iHerb description field.

    iHerb embeds the full ingredient list in the description text.
    Format: comma-separated INCI names, often after 'Ingredients:' prefix.
    Returns empty list if the description looks like marketing copy (not ingredient list).
    """
    if not description:
        return []

    # Try to find ingredient-list section
    text = description
    for marker in ["ingredients:", "composition:", "inci:"]:
        idx = text.lower().find(marker)
        if idx != -1:
            text = text[idx + len(marker):].strip()
            break

    # Split by commas — ingredient lists are comma-separated
    parts = [p.strip().rstrip(".") for p in re.split(r",\s*", text) if p.strip()]

    # Ingredient lists must have multiple items; a single chunk is marketing copy
    if len(parts) < 2:
        return []

    # Filter: real INCI names are typically 2-60 chars, no sentences
    inci = []
    for part in parts:
        # Skip long sentences (marketing copy)
        if len(part) > 80 or "." in part:
            continue
        # Skip pure numbers or very short strings
        if re.fullmatch(r"[\d\s%.]+", part) or len(part) < 3:
            continue
        # At least one Latin letter or Thai char
        if not re.search(r"[A-Za-z฀-๿]", part):
            continue
        inci.append(part)

    return inci[:80]  # cap at 80 ingredients


def parse_product_ldjson(ld: dict, page_url: str) -> dict:
    """Parse iHerb ld+json Product schema into our product dict format."""
    product_id_raw = str(ld.get("productID") or iherb_slug_to_id(page_url) or "")
    product_id = f"iherb_{product_id_raw}" if product_id_raw else ""

    brand_raw = ld.get("brand") or {}
    brand = brand_raw.get("name", "") if isinstance(brand_raw, dict) else str(brand_raw)

    # Price: find THB offer, then strikethrough
    price_thb = 0.0
    list_price_thb = 0.0
    offers = ld.get("offers") or {}
    price_specs = offers.get("priceSpecification") or []
    if not price_specs and offers.get("price"):
        # Simple offer format
        price_thb = float(offers.get("price", 0) or 0)
    for spec in price_specs:
        if spec.get("priceCurrency") == "THB":
            if spec.get("priceType") == "StrikethroughPrice":
                list_price_thb = float(spec.get("price", 0) or 0)
            else:
                price_thb = float(spec.get("price", 0) or 0)

    discount_pct = 0
    if list_price_thb > price_thb > 0:
        discount_pct = int(round((list_price_thb - price_thb) / list_price_thb * 100))

    ar = ld.get("aggregateRating") or {}
    rating = float(ar.get("ratingValue") or 0)
    review_count = int(ar.get("reviewCount") or 0)

    image = ld.get("image") or ""
    if isinstance(image, list):
        image = image[0] if image else ""

    description = (ld.get("description") or "").strip()
    ingredients = extract_ingredients_from_description(description)

    # Volume from name: "1 fl oz (30 ml)" → "30ml"
    name = ld.get("name") or ""
    vol_m = re.search(r"(\d+(?:\.\d+)?)\s*(ml|g|oz|fl oz)\b", name, re.I)
    volume = f"{vol_m.group(1)}{vol_m.group(2)}" if vol_m else ""

    gtin = str(ld.get("gtin12") or ld.get("gtin8") or "")
    sku = str(ld.get("sku") or "")

    return {
        "product_id": product_id,
        "url": page_url,
        "name": name,
        "brand": brand,
        "price_thb": price_thb,
        "list_price_thb": list_price_thb,
        "discount_pct": discount_pct,
        "volume": volume,
        "image_url": image,
        "description": description,
        "sku": sku,
        "gtin8": gtin,
        "ingredients": ingredients,
        "ingredient_count": len(ingredients),
        "konvy_rating": rating,
        "konvy_review_count": review_count,
        "sold_count": 0,
        "source": "iherb",
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def normalize_iherb_product(p: dict) -> dict:
    """Ensure product dict has all required CSV fields."""
    out = dict(p)
    for f in CSV_FIELDS:
        if f not in out:
            out[f] = ""
    # ingredients: join list to |-separated string for CSV
    ing = out.get("ingredients", [])
    if isinstance(ing, list):
        out["ingredients"] = "|".join(ing)
    seeds = out.get("concern_seeds", [])
    if isinstance(seeds, list):
        out["concern_seeds"] = "|".join(seeds)
    return out


# ── Playwright scraping ───────────────────────────────────────────────────────

def _extract_ldjson_product(html: str) -> dict:
    """Find the first ld+json Product schema in HTML."""
    for m in re.finditer(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                         html, re.DOTALL | re.IGNORECASE):
        try:
            data = json.loads(m.group(1))
            if isinstance(data, list):
                data = next((d for d in data if d.get("@type") == "Product"), {})
            if data.get("@type") == "Product":
                return data
        except Exception:
            continue
    return {}


def scrape_search_page(page: Page, url: str) -> list[str]:
    """Load a search results page, scroll to load products, return product URLs."""
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        # Scroll to trigger lazy-loading
        for _ in range(4):
            page.evaluate("window.scrollBy(0, window.innerHeight)")
            page.wait_for_timeout(800)

        # Extract product links
        links = page.locator("a[href*='/pr/']").all()
        urls = []
        seen = set()
        for link in links:
            try:
                href = link.get_attribute("href") or ""
                if "/pr/" not in href:
                    continue
                full = href if href.startswith("http") else BASE + href
                # Normalize: remove query params
                full = re.sub(r"\?.*$", "", full)
                pid = iherb_slug_to_id(full)
                if pid and pid not in seen:
                    seen.add(pid)
                    urls.append(full)
            except Exception:
                continue
        return urls
    except Exception as e:
        log.warning(f"search page error {url}: {e}")
        return []


def scrape_product_page(page: Page, url: str) -> dict | None:
    """Load an iHerb product page and parse ld+json."""
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        html = page.content()
        ld = _extract_ldjson_product(html)
        if not ld:
            log.warning(f"no ld+json at {url}")
            return None
        return parse_product_ldjson(ld, url)
    except Exception as e:
        log.warning(f"product page error {url}: {e}")
        return None


# ── Progress / persistence ────────────────────────────────────────────────────

def _progress_path() -> Path:
    return config.STATE_DIR / "iherb_progress.json"


def _load_progress() -> dict:
    p = _progress_path()
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def _save_progress(prog: dict) -> None:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    _progress_path().write_text(json.dumps(prog, ensure_ascii=False, indent=2), encoding="utf-8")


def _product_path(product_id: str) -> Path:
    return config.OUTPUT_DIR / "products" / f"{product_id}.json"


def save_product(p: dict) -> Path:
    path = _product_path(p["product_id"])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(normalize_iherb_product(p), ensure_ascii=False, indent=2),
                    encoding="utf-8")
    return path


# ── Main crawler ──────────────────────────────────────────────────────────────

def crawl(limit: int | None = None) -> int:
    """Discover and scrape iHerb products for all concerns."""
    progress = _load_progress()
    done = 0

    with sync_playwright() as pw:
        # No proxy needed for iHerb (international site)
        browser = pw.chromium.launch(headless=True, args=[
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
        ])
        ctx = browser.new_context(
            user_agent=config.USER_AGENT,
            viewport={"width": 1280, "height": 720},
            extra_http_headers={"Accept-Language": "th-TH,th;q=0.9,en;q=0.8"},
        )
        page = ctx.new_page()

        try:
            for concern, keywords in CONCERN_KEYWORDS.items():
                for kw in keywords:
                    search_url = f"{BASE}/search?kw={kw.replace(' ', '+')}"
                    log.info(f"[iherb] searching: {kw!r} ({concern})")

                    product_urls = scrape_search_page(page, search_url)
                    log.info(f"[iherb]   found {len(product_urls)} products")
                    time.sleep(1.5)

                    for purl in product_urls:
                        pid = f"iherb_{iherb_slug_to_id(purl)}"
                        if not pid or pid == "iherb_":
                            continue
                        if progress.get(pid, {}).get("status") == "ok":
                            continue
                        if _product_path(pid).exists():
                            progress[pid] = {"status": "ok"}
                            continue

                        time.sleep(1.2)
                        product = scrape_product_page(page, purl)
                        if product:
                            product["concern_seeds"] = [concern]
                            save_product(product)
                            progress[pid] = {"status": "ok", "name": product["name"][:60]}
                            done += 1
                            log.info(f"[iherb] OK {pid} {product['name'][:50]} "
                                     f"({product['ingredient_count']} ingr, ฿{product['price_thb']:.0f})")
                        else:
                            progress[pid] = {"status": "error"}

                        _save_progress(progress)
                        if limit and done >= limit:
                            log.info(f"[iherb] limit {limit} reached")
                            return 0
        finally:
            browser.close()

    log.info(f"[iherb] DONE: {done} new products")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    args = ap.parse_args()
    logging.basicConfig(level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
    return crawl(args.limit)


if __name__ == "__main__":
    import sys; sys.exit(main())
