"""
Pet food scraper — Royal Canin TH
Uses Next.js data API for nutritional info.
Output: data/petfood.json
Run: python -m petfood.scraper
"""
from __future__ import annotations
import json
import re
import ssl
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright, Page

from petfood.parse_ingredients import parse_ingredients, calc_dry_matter, meets_aafco, score_food

ROOT = Path(__file__).parent.parent
OUTPUT = ROOT / "data" / "petfood.json"

SKIP_SLUGS = {
    "retail-products", "puppy-food", "adult-dog-food", "senior-dog-food",
    "kitten-food", "adult-cat-food", "senior-cat-food", "vet-products",
}

CATEGORY_URLS = [
    ("https://www.royalcanin.com/th/dogs/products/retail-products", "dog"),
    ("https://www.royalcanin.com/th/dogs/products/puppy-food", "dog"),
    ("https://www.royalcanin.com/th/dogs/products/adult-dog-food", "dog"),
    ("https://www.royalcanin.com/th/dogs/products/senior-dog-food", "dog"),
    ("https://www.royalcanin.com/th/cats/products/retail-products", "cat"),
    ("https://www.royalcanin.com/th/cats/products/kitten-food", "cat"),
    ("https://www.royalcanin.com/th/cats/products/adult-cat-food", "cat"),
    ("https://www.royalcanin.com/th/cats/products/senior-cat-food", "cat"),
]

_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")[:100]


def _get_build_id(page: Page) -> str:
    """Extract Next.js build ID from __NEXT_DATA__ script tag."""
    try:
        data = page.evaluate("() => window.__NEXT_DATA__?.buildId")
        if data:
            return data
    except Exception:
        pass
    # fallback: parse from HTML
    html = page.content()
    m = re.search(r'"buildId"\s*:\s*"([^"]+)"', html)
    return m.group(1) if m else "latest"


def _fetch_product_api(build_id: str, url: str) -> dict | None:
    """Fetch product data from Next.js data API."""
    # url like: https://www.royalcanin.com/th/dogs/products/retail-products/maxi-adult-1094
    m = re.match(r"https://www\.royalcanin\.com(/th/.+)", url.rstrip("/"))
    if not m:
        return None
    path_part = m.group(1)
    # Build path params: path=dogs&path=products&path=...
    segments = path_part.lstrip("/").split("/")[1:]  # skip 'th'
    params = "&".join(f"path={s}" for s in segments)
    api_url = f"https://www.royalcanin.com/_next/data/{build_id}/th-th{path_part}.json?site=th&language=th-th&{params}"
    req = urllib.request.Request(
        api_url,
        headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "th-TH,th;q=0.9"},
    )
    try:
        resp = urllib.request.urlopen(req, timeout=20, context=_SSL_CTX)
        return json.loads(resp.read())
    except Exception as e:
        print(f"    API fetch failed for {url}: {e}")
        return None


def _parse_thai_nutrients(text: str) -> dict[str, float]:
    """Parse Thai nutritional label text.

    Example: 'โปรตีนไม่น้อยกว่า 5.5%, ไขมัน ไม่น้อยกว่า 3.5%, กากไม่มากกว่า 2.4%, ความชื้น ไม่มากกว่า 82%'
    """
    result = {"protein": 0.0, "fat": 0.0, "fiber": 0.0, "moisture": 0.0}
    if not text:
        return result

    def _pct(pattern: str) -> float:
        m = re.search(pattern + r"\D*?(\d+(?:\.\d+)?)\s*%", text)
        return float(m.group(1)) if m else 0.0

    result["protein"] = _pct(r"โปรตีน")
    result["fat"] = _pct(r"ไขมัน")
    result["fiber"] = _pct(r"กาก")
    result["moisture"] = _pct(r"ความชื้น")
    return result


def _parse_product_from_api(api_data: dict, url: str, animal: str) -> dict | None:
    """Build product record from Next.js API data."""
    try:
        response = api_data["pageProps"]["productData"]["response"]
    except (KeyError, TypeError):
        return None

    title = response.get("title") or response.get("name") or ""
    if not title or "Gateway" in title:
        return None

    # Lifestage
    lifestages = response.get("lifestages", [])
    if any(s in lifestages for s in ("puppy", "kitten", "growth")):
        life_stage = "puppy"
    elif any(s in lifestages for s in ("senior", "mature")):
        life_stage = "senior"
    else:
        life_stage = "adult"

    # Also check title
    t_lower = title.lower()
    if any(w in t_lower for w in ["puppy", "kitten", "ลูก", "starter", "junior"]):
        life_stage = "puppy"
    elif any(w in t_lower for w in ["senior", "mature", "7+", "สูงวัย"]):
        life_stage = "senior"

    # Nutrition from Thai text
    ni = response.get("nutritionalInfo", [])
    nutrients: dict[str, float] = {"protein": 0.0, "fat": 0.0, "fiber": 0.0, "moisture": 0.0}
    ing_text = ""
    for item in ni:
        desc = item.get("description", "")
        t = item.get("title", "")
        if "analyticalConstituants" in t or "โปรตีน" in desc:
            nutrients = _parse_thai_nutrients(desc)
        elif "ingredients" in t.lower() or "ส่วนผสม" in desc or "ส่วนประกอบ" in desc:
            ing_text = desc

    # Try original_product for ingredients
    orig = response.get("original_product")
    if orig and isinstance(orig, dict):
        comp = orig.get("composition_ingredients") or orig.get("ingredients") or ""
        if comp and len(comp) > len(ing_text):
            ing_text = comp

    # Also check original_product.composition list
    if orig and isinstance(orig, dict):
        comp_list = orig.get("composition", [])
        for c in comp_list:
            if isinstance(c, dict):
                ing_raw = c.get("ingredients") or c.get("composition") or ""
                if ing_raw and len(ing_raw) > len(ing_text):
                    ing_text = ing_raw

    # Technology: wet vs dry
    tech = response.get("technology", "")
    if tech == "wet":
        sub_category = "wet_food"
    else:
        sub_category = response.get("subCategory", "") or "dry_food"

    protein = nutrients["protein"]
    fat = nutrients["fat"]
    fiber = nutrients["fiber"]
    moisture = nutrients["moisture"] or (80.0 if sub_category == "wet_food" else 10.0)

    weight_kg = 1.0
    m = re.search(r"(\d+(?:\.\d+)?)\s*kg", title, re.I)
    if m:
        weight_kg = float(m.group(1))

    ingredients = parse_ingredients(ing_text)
    counts = score_food(ingredients)
    protein_dm = calc_dry_matter(protein, moisture)
    fat_dm = calc_dry_matter(fat, moisture)

    return {
        "id": slugify(f"royal-canin-{title}"),
        "brand": "Royal Canin",
        "name_en": title,
        "name_th": title,
        "animal": animal,
        "life_stage": life_stage,
        "sub_category": sub_category,
        "weight_kg": weight_kg,
        "price_thb": 0.0,
        "price_per_kg": 0.0,
        "buy_url": f"https://shopee.co.th/search?keyword={slugify(title)}",
        "source_url": url,
        "protein_pct": protein,
        "fat_pct": fat,
        "fiber_pct": fiber,
        "moisture_pct": moisture,
        "protein_dm": protein_dm,
        "fat_dm": fat_dm,
        "aafco_meets": meets_aafco(protein_dm, fat_dm, life_stage),
        "ingredients": ingredients,
        **counts,
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def collect_product_urls(page: Page) -> list[tuple[str, str]]:
    """Collect (url, animal) pairs from category pages."""
    seen: set[str] = set()
    pairs: list[tuple[str, str]] = []

    for cat_url, animal in CATEGORY_URLS:
        try:
            page.goto(cat_url, wait_until="domcontentloaded", timeout=30000)
            time.sleep(5)
            hrefs = page.eval_on_selector_all("a[href]", "els => [...new Set(els.map(e=>e.href))]")
            product_hrefs = [
                h for h in hrefs
                if "/th/" in h and "/products/" in h
                and len(h.rstrip("/").split("/")) >= 8
                and h.rstrip("/").split("/")[-1] not in SKIP_SLUGS
                and h not in seen
            ]
            print(f"  {cat_url}: {len(product_hrefs)} product links")
            for h in product_hrefs:
                seen.add(h)
                pairs.append((h, animal))
        except Exception as e:
            print(f"  category error {cat_url}: {e}")

    return pairs


def main():
    OUTPUT.parent.mkdir(exist_ok=True)
    all_products: list[dict] = []
    build_id = ""

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, slow_mo=200)
        ctx = browser.new_context(
            locale="th-TH",
            extra_http_headers={"Accept-Language": "th-TH,th;q=0.9,en;q=0.8"},
        )
        page = ctx.new_page()

        print("=== Collecting product URLs ===")
        pairs = collect_product_urls(page)

        # Get build_id from last loaded page
        build_id = _get_build_id(page)
        print(f"  Build ID: {build_id}")
        browser.close()

    print(f"\n=== Fetching product data via API ({len(pairs)} products) ===")
    seen_ids: set[str] = set()
    for url, animal in pairs:
        api_data = _fetch_product_api(build_id, url)
        if not api_data:
            continue
        p = _parse_product_from_api(api_data, url, animal)
        if p and p["id"] not in seen_ids:
            seen_ids.add(p["id"])
            all_products.append(p)
            print(f"  ✓ {p['name_th'][:50]} [{p['animal']}/{p['life_stage']}] protein={p['protein_pct']}%")
        time.sleep(0.5)

    OUTPUT.write_text(json.dumps(all_products, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n✓ {len(all_products)} products → {OUTPUT}")


if __name__ == "__main__":
    main()
