"""
Hills Science Diet Thailand scraper
URL: https://www.hillspet.co.th/

Run: python -m petfood.hills_scraper
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
BASE_URL = "https://www.hillspet.co.th"

CATEGORY_URLS = [
    (f"{BASE_URL}/dog-food", "dog"),
    (f"{BASE_URL}/cat-food", "cat"),
]

SKIP_SLUGS = {"dog-food", "cat-food", "all"}


def _slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")[:80]


def _parse_life_stage(title: str) -> str:
    t = title.lower()
    if any(w in t for w in ["puppy", "kitten", "junior", "ลูก", "starter"]):
        return "puppy"
    if any(w in t for w in ["senior", "mature", "7+", "11+", "สูงวัย"]):
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
            for h in hrefs:
                h = h.split("?")[0].rstrip("/")
                parts = h.split("/")
                if len(parts) >= 5 and parts[-1] not in SKIP_SLUGS and h not in seen:
                    if "dog-food" in h or "cat-food" in h:
                        seen.add(h)
                        pairs.append((h, animal))
            print(f"  {cat_url}: {len([p for p in pairs if p[1]==animal])} links")
        except Exception as e:
            print(f"  error {cat_url}: {e}")

    return pairs


def _parse_product_page(page: Page, url: str, animal: str) -> dict | None:
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        time.sleep(3)
        body = page.inner_text("body")

        # Title
        title = ""
        try:
            title = page.inner_text("h1").strip()
        except Exception:
            m = re.search(r"<title>([^<]+)</title>", page.content())
            if m:
                title = m.group(1).split("|")[0].strip()

        if not title:
            return None

        # Ingredients — look for "ส่วนประกอบ" or "Ingredients" section
        ing_text = ""
        patterns = [
            r"ส่วนประกอบ[:\s]*\n?([^\n]{50,600})",
            r"[Ii]ngredients[:\s]*\n?([^\n]{50,600})",
            r"วัตถุดิบ[:\s]*\n?([^\n]{50,600})",
        ]
        for pat in patterns:
            m = re.search(pat, body)
            if m:
                ing_text = m.group(1).strip()
                break

        # Nutrition — look for percentage values
        def _pct(pattern: str) -> float:
            m = re.search(pattern + r"[^\d]*(\d+(?:\.\d+)?)\s*%", body, re.IGNORECASE)
            return float(m.group(1)) if m else 0.0

        protein = _pct(r"โปรตีน|[Pp]rotein")
        fat = _pct(r"ไขมัน|[Ff]at")
        fiber = _pct(r"กาก|[Ff]iber|[Ff]ibre")
        moisture = _pct(r"ความชื้น|[Mm]oisture")

        # Detect wet/dry from title or URL
        is_wet = any(w in title.lower() + url for w in ["wet", "loaf", "stew", "mousse", "เปียก", "gravy"])
        moisture = moisture or (78.0 if is_wet else 10.0)

        life_stage = _parse_life_stage(title)
        sub_category = "wet_food" if is_wet else "dry_food"

        ingredients = parse_ingredients(ing_text)
        counts = score_food(ingredients)
        protein_dm = calc_dry_matter(protein, moisture)
        fat_dm = calc_dry_matter(fat, moisture)

        food_id = f"hills-{_slugify(title)}"

        return {
            "id": food_id,
            "brand": "Hills Science Diet",
            "name_en": title,
            "name_th": title,
            "animal": animal,
            "life_stage": life_stage,
            "sub_category": sub_category,
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

        print("=== Collecting Hills TH product URLs ===")
        pairs = _collect_product_urls(page)
        new_pairs = [(u, a) for u, a in pairs if u not in existing_sources]
        print(f"  New products to scrape: {len(new_pairs)} / {len(pairs)} total")

        for i, (url, animal) in enumerate(new_pairs, 1):
            print(f"  [{i}/{len(new_pairs)}] {url.split('/')[-1]}")
            product = _parse_product_page(page, url, animal)
            if product:
                new_products.append(product)
                print(f"    ✓ {product['name_en'][:50]} [{animal}/{product['life_stage']}]")
                if product["ingredients"]:
                    print(f"      {len(product['ingredients'])} ingredients (G:{product['green_count']} Y:{product['yellow_count']} R:{product['red_count']})")
            time.sleep(1)

        browser.close()

    if new_products:
        all_products = existing + new_products
        OUTPUT.write_text(json.dumps(all_products, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\n✓ Added {len(new_products)} Hills products → total {len(all_products)}")
    else:
        print("\n✗ No new products found")


if __name__ == "__main__":
    main()
