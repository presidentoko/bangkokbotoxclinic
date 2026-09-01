"""
Re-enriches petfood.json entries that have empty ingredients.
Fetches each product page directly via Playwright and parses ingredients from DOM.

Run: python -m petfood.enrich
"""
from __future__ import annotations
import json
import re
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

from petfood.parse_ingredients import parse_ingredients, calc_dry_matter, meets_aafco, score_food

ROOT = Path(__file__).parent.parent
from petfood.paths import FOODS as OUTPUT  # single catalogue; see petfood/paths.py
def _extract_ingredients_from_page(page) -> str:
    """Try multiple DOM selectors to find ingredient text on product page."""
    selectors = [
        # Royal Canin TH - common content containers
        '[class*="ingredient"]',
        '[class*="composition"]',
        '[data-id*="ingredient"]',
        '[data-id*="composition"]',
        # Generic rich text containers with Thai ingredient keywords
        'p:has-text("ส่วนประกอบ")',
        'p:has-text("ส่วนผสม")',
        'div:has-text("ส่วนประกอบ")',
        'li:has-text("ส่วนประกอบ")',
        '[class*="nutritional"] p',
        '[class*="product-detail"] p',
        '[class*="tab-content"] p',
        # Fallback: any paragraph with ingredient-like commas
    ]
    for sel in selectors:
        try:
            els = page.query_selector_all(sel)
            for el in els:
                text = el.inner_text().strip()
                if len(text) > 50 and (',' in text or ',' in text):
                    # check for Thai ingredient words
                    if any(w in text for w in ['แป้ง', 'โปรตีน', 'น้ำมัน', 'ข้าว', 'ไก่', 'ปลา', 'แร่', 'วิตา', 'ข้าวโพด', 'ถั่ว', 'เนื้อ']):
                        return text
        except Exception:
            continue

    # Last resort: dump all text and grep
    try:
        body = page.inner_text('body')
        # Look for ingredient block pattern
        m = re.search(
            r'ส่วนประกอบ[:\s]*(.{50,600}?)(?:คุณค่าทางโภชนาการ|วิธีการให้อาหาร|ข้อมูลโภชนาการ|\n\n)',
            body
        )
        if m:
            return m.group(1).strip()
        m = re.search(
            r'ส่วนผสม[:\s]*(.{50,600}?)(?:คุณค่าทางโภชนาการ|วิธีการให้อาหาร|ข้อมูลโภชนาการ|\n\n)',
            body
        )
        if m:
            return m.group(1).strip()
    except Exception:
        pass

    return ''


def _extract_nutrients_from_page(page) -> dict[str, float]:
    """Extract nutrition percentages from page text."""
    result = {"protein": 0.0, "fat": 0.0, "fiber": 0.0, "moisture": 0.0}
    try:
        body = page.inner_text('body')
        def _pct(pattern: str) -> float:
            m = re.search(pattern + r'[^\d]*(\d+(?:\.\d+)?)\s*%', body)
            return float(m.group(1)) if m else 0.0
        result['protein'] = _pct(r'โปรตีน')
        result['fat'] = _pct(r'ไขมัน')
        result['fiber'] = _pct(r'กาก')
        result['moisture'] = _pct(r'ความชื้น')
    except Exception:
        pass
    return result


def main():
    with open(OUTPUT, encoding='utf-8') as f:
        foods: list[dict] = json.load(f)

    to_enrich = [f for f in foods if not f.get('ingredients') and f.get('source_url')]
    print(f'Foods to enrich: {len(to_enrich)} / {len(foods)}')

    if not to_enrich:
        print('Nothing to enrich.')
        return

    enriched_count = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, slow_mo=100)
        ctx = browser.new_context(
            locale='th-TH',
            extra_http_headers={'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8'},
        )
        page = ctx.new_page()

        for food in to_enrich:
            url = food['source_url']
            print(f'  [{enriched_count+1}/{len(to_enrich)}] {food["name_th"][:45]}...')
            try:
                page.goto(url, wait_until='domcontentloaded', timeout=30000)
                # Wait a bit for dynamic content
                time.sleep(3)

                ing_text = _extract_ingredients_from_page(page)

                if ing_text:
                    ingredients = parse_ingredients(ing_text)
                    counts = score_food(ingredients)
                    food['ingredients'] = ingredients
                    food.update(counts)

                    # Re-parse nutrients if zeros
                    if food.get('protein_pct', 0) == 0:
                        nut = _extract_nutrients_from_page(page)
                        if nut['protein'] > 0:
                            food['protein_pct'] = nut['protein']
                            food['fat_pct'] = nut['fat']
                            food['fiber_pct'] = nut['fiber']
                            food['moisture_pct'] = nut['moisture'] or food['moisture_pct']

                    moisture = food.get('moisture_pct', 10.0) or 10.0
                    food['protein_dm'] = calc_dry_matter(food['protein_pct'], moisture)
                    food['fat_dm'] = calc_dry_matter(food['fat_pct'], moisture)
                    food['aafco_meets'] = meets_aafco(food['protein_dm'], food['fat_dm'], food['life_stage'])
                    food['updated_at'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

                    enriched_count += 1
                    print(f'    ✓ {len(ingredients)} ingredients (G:{counts["green_count"]} Y:{counts["yellow_count"]} R:{counts["red_count"]})')
                else:
                    print(f'    ✗ no ingredient text found')

            except Exception as e:
                print(f'    ✗ error: {e}')

            time.sleep(1)

        browser.close()

    OUTPUT.write_text(json.dumps(foods, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'\n✓ Enriched {enriched_count}/{len(to_enrich)} foods → {OUTPUT}')


if __name__ == '__main__':
    main()
