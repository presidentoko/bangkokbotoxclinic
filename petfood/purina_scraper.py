"""
Purina Thailand scraper — Pro Plan, One, Felix, Friskies
URL: https://www.purina.co.th/

Run: python -m petfood.purina_scraper
"""
from __future__ import annotations
import json
import re
import time
from pathlib import Path

from playwright.sync_api import sync_playwright, Page

from petfood.parse_ingredients import parse_ingredients, calc_dry_matter, meets_aafco, score_food

ROOT = Path(__file__).parent.parent
OUTPUT = ROOT / "data" / "petfood.json"
BASE_URL = "https://www.purina.co.th"

CATEGORY_URLS = [
    (f"{BASE_URL}/food/dog", "dog"),
    (f"{BASE_URL}/food/cat", "cat"),
    (f"{BASE_URL}/our-brands/pro-plan/dog", "dog"),
    (f"{BASE_URL}/our-brands/pro-plan/cat", "cat"),
    (f"{BASE_URL}/our-brands/one/dog", "dog"),
    (f"{BASE_URL}/our-brands/one/cat", "cat"),
]

BRAND_MAP = {
    "pro plan": "Purina Pro Plan",
    "pro-plan": "Purina Pro Plan",
    "purina one": "Purina One",
    "one ": "Purina One",
    "felix": "Felix",
    "friskies": "Friskies",
    "fancy feast": "Fancy Feast",
    "cat chow": "Cat Chow",
    "dog chow": "Dog Chow",
}


def _slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")[:80]


def _detect_brand(title: str, url: str) -> str:
    combined = (title + " " + url).lower()
    for key, brand in BRAND_MAP.items():
        if key in combined:
            return brand
    return "Purina"


def _parse_life_stage(title: str) -> str:
    t = title.lower()
    if any(w in t for w in ["puppy", "kitten", "junior", "ลูก", "starter", "large breed puppy"]):
        return "puppy"
    if any(w in t for w in ["senior", "mature", "7+", "11+", "สูงวัย", "aging"]):
        return "senior"
    return "adult"


def _collect_product_urls(page: Page) -> list[tuple[str, str]]:
    seen: set[str] = set()
    pairs: list[tuple[str, str]] = []

    for cat_url, animal in CATEGORY_URLS:
        try:
            page.goto(cat_url, wait_until="domcontentloaded", timeout=30000)
            time.sleep(4)
            hrefs = page.eval_on_selector_all("a[href]", "els => [...new Set(els.map(e=>e.href))]")
            before = len(pairs)
            for h in hrefs:
                h = h.split("?")[0].rstrip("/")
                if h in seen:
                    continue
                # Product pages: /food/dog/{slug} or /food/cat/{slug}
                if re.search(r"/food/(dog|cat)/[a-z0-9-]{5,}", h):
                    seen.add(h)
                    pairs.append((h, animal))
            print(f"  {cat_url}: +{len(pairs)-before}")
        except Exception as e:
            print(f"  error {cat_url}: {e}")

    return pairs


def _parse_product_page(page: Page, url: str, animal: str) -> dict | None:
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        time.sleep(3)
        body = page.inner_text("body") or ""

        title = ""
        try:
            title = (page.inner_text("h1") or "").strip()
        except Exception:
            pass
        if not title:
            m = re.search(r"<title>([^<]+)</title>", page.content())
            title = m.group(1).split("|")[0].strip() if m else ""
        if not title:
            return None

        # Ingredients: "วัตถุดิบ" or "Ingredients"
        ing_text = ""
        patterns = [
            r"วัตถุดิบ[:\s]*\n?([^\n]{50,700})",
            r"ส่วนประกอบ[:\s]*\n?([^\n]{50,700})",
            r"[Ii]ngredients[:\s]*\n?([^\n]{50,700})",
        ]
        for pat in patterns:
            m = re.search(pat, body)
            if m:
                ing_text = m.group(1).strip()
                break

        def _pct(pattern: str) -> float:
            try:
                m = re.search(pattern + r"[^\d]*(\d+(?:\.\d+)?)\s*%", body, re.IGNORECASE)
                return float(m.group(1)) if m else 0.0
            except (TypeError, ValueError):
                return 0.0

        protein = _pct(r"โปรตีน|[Pp]rotein|Crude [Pp]rotein")
        fat = _pct(r"ไขมัน|[Ff]at|Crude [Ff]at")
        fiber = _pct(r"กาก|[Ff]iber|[Ff]ibre|Crude [Ff]iber")
        moisture = _pct(r"ความชื้น|[Mm]oisture")

        is_wet = any(w in title.lower() + url for w in ["wet", "loaf", "stew", "mousse", "เปียก", "gravy", "jelly", "pate"])
        moisture = moisture or (78.0 if is_wet else 10.0)

        life_stage = _parse_life_stage(title)
        brand = _detect_brand(title, url)
        food_id = f"purina-{_slugify(title)}"

        ingredients = parse_ingredients(ing_text)
        counts = score_food(ingredients)
        protein_dm = calc_dry_matter(protein, moisture)
        fat_dm = calc_dry_matter(fat, moisture)

        return {
            "id": food_id,
            "brand": brand,
            "name_en": title,
            "name_th": title,
            "animal": animal,
            "life_stage": life_stage,
            "sub_category": "wet_food" if is_wet else "dry_food",
            "weight_kg": 1.0,
            "price_thb": 0.0,
            "price_per_kg": 0.0,
            "buy_url": f"https://shopee.co.th/search?keyword={_slugify(title)}",
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
    except Exception as e:
        print(f"    parse error {url}: {e}")
        return None


def main():
    with open(OUTPUT, encoding="utf-8") as f:
        existing: list[dict] = json.load(f)

    existing_sources = {f["source_url"] for f in existing}
    new_products: list[dict] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, slow_mo=100)
        ctx = browser.new_context(
            locale="th-TH",
            extra_http_headers={"Accept-Language": "th-TH,th;q=0.9,en;q=0.8"},
        )
        page = ctx.new_page()

        print("=== Collecting Purina TH product URLs ===")
        pairs = _collect_product_urls(page)
        # Deduplicate
        seen_ids: set[str] = set()
        new_pairs = []
        for u, a in pairs:
            if u not in existing_sources and u not in seen_ids:
                seen_ids.add(u)
                new_pairs.append((u, a))
        print(f"  New products: {len(new_pairs)} / {len(pairs)} total")

        for i, (url, animal) in enumerate(new_pairs, 1):
            print(f"  [{i}/{len(new_pairs)}] {url.split('/')[-1]}")
            product = _parse_product_page(page, url, animal)
            if product:
                new_products.append(product)
                g, y, r = product["green_count"], product["yellow_count"], product["red_count"]
                print(f"    ✓ {product['brand']} | {product['name_en'][:40]} G:{g} Y:{y} R:{r}")
            time.sleep(1)

        browser.close()

    if new_products:
        all_products = existing + new_products
        OUTPUT.write_text(json.dumps(all_products, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\n✓ Added {len(new_products)} Purina products → total {len(all_products)}")
    else:
        print("\n✗ No new products found")


if __name__ == "__main__":
    main()
