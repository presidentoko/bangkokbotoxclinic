"""
Pet food scraper — Royal Canin TH
Output: data/petfood.json
Run: python -m petfood.scraper
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


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")[:100]


def _extract_float(text: str) -> float:
    m = re.search(r"(\d+(?:\.\d+)?)", text)
    return float(m.group(1)) if m else 0.0


def _detect_life_stage(name: str) -> str:
    n = name.lower()
    if any(w in n for w in ["puppy", "kitten", "junior", "starter", "growth"]):
        return "puppy"
    if any(w in n for w in ["senior", "mature", "ageing", "aging", "7+"]):
        return "senior"
    return "adult"


def scrape_royal_canin(page: Page) -> list[dict]:
    products = []
    catalog_urls = [
        ("https://www.royalcanin.com/th/dogs/products", "dog"),
        ("https://www.royalcanin.com/th/cats/products", "cat"),
    ]
    for catalog_url, animal in catalog_urls:
        page.goto(catalog_url, wait_until="networkidle", timeout=30000)
        time.sleep(2)

        hrefs = page.eval_on_selector_all(
            "a[href*='/th/dogs/products/'], a[href*='/th/cats/products/']",
            "els => [...new Set(els.map(e => e.href).filter(h => h.split('/').length > 7))]",
        )
        print(f"  Royal Canin {animal}: {len(hrefs)} product links")

        for href in hrefs[:60]:
            try:
                p = _scrape_royal_canin_product(page, href, animal)
                if p:
                    products.append(p)
                time.sleep(1.5)
            except Exception as e:
                print(f"    skip {href}: {e}")

    return products


def _scrape_royal_canin_product(page: Page, url: str, animal: str) -> dict | None:
    page.goto(url, wait_until="domcontentloaded", timeout=25000)

    name_el = page.query_selector("h1")
    if not name_el:
        return None
    name = name_el.inner_text().strip()
    if not name:
        return None

    ing_text = ""
    for label in ["Composition", "ส่วนประกอบ", "COMPOSITION"]:
        try:
            el = page.locator(f"text='{label}'").first
            if el.count():
                sibling = el.locator("xpath=following-sibling::p[1]")
                if sibling.count():
                    ing_text = sibling.inner_text().strip()
                    break
                parent_sib = el.locator("xpath=../following-sibling::*[1]")
                if parent_sib.count():
                    ing_text = parent_sib.inner_text().strip()
                    break
        except Exception:
            pass

    def get_pct(labels: list[str]) -> float:
        for label in labels:
            try:
                el = page.locator(f"text='{label}'").first
                if el.count():
                    row = el.locator("xpath=..")
                    txt = row.inner_text()
                    return _extract_float(txt)
            except Exception:
                pass
        return 0.0

    protein = get_pct(["Crude protein", "โปรตีนรวม", "Protein"])
    fat = get_pct(["Crude fat", "ไขมันรวม", "Fat"])
    fiber = get_pct(["Crude fibre", "Crude fiber", "เส้นใย"])
    moisture = get_pct(["Moisture", "ความชื้น"]) or 10.0

    price = 0.0
    for sel in ["[class*='price']", "[class*='Price']", "span:has-text('฿')"]:
        try:
            el = page.query_selector(sel)
            if el:
                price = _extract_float(el.inner_text().replace(",", ""))
                if price > 0:
                    break
        except Exception:
            pass

    weight_kg = 1.0
    m = re.search(r"(\d+(?:\.\d+)?)\s*kg", name, re.I)
    if m:
        weight_kg = float(m.group(1))

    life_stage = _detect_life_stage(name)
    ingredients = parse_ingredients(ing_text)
    counts = score_food(ingredients)
    protein_dm = calc_dry_matter(protein, moisture)
    fat_dm = calc_dry_matter(fat, moisture)

    return {
        "id": slugify(f"royal-canin-{name}"),
        "brand": "Royal Canin",
        "name_en": name,
        "name_th": name,
        "animal": animal,
        "life_stage": life_stage,
        "weight_kg": weight_kg,
        "price_thb": price,
        "price_per_kg": round(price / weight_kg, 2) if weight_kg else 0.0,
        "buy_url": f"https://shopee.co.th/search?keyword={slugify(name)}",
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


def main():
    OUTPUT.parent.mkdir(exist_ok=True)
    all_products: list[dict] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, slow_mo=300)
        ctx = browser.new_context(
            locale="th-TH",
            extra_http_headers={"Accept-Language": "th-TH,th;q=0.9,en;q=0.8"},
        )
        page = ctx.new_page()

        print("=== Scraping Royal Canin TH ===")
        all_products.extend(scrape_royal_canin(page))

        browser.close()

    seen: dict[str, dict] = {}
    for p in all_products:
        seen[p["id"]] = p
    deduped = list(seen.values())

    OUTPUT.write_text(json.dumps(deduped, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n✓ {len(deduped)} products → {OUTPUT}")


if __name__ == "__main__":
    main()
