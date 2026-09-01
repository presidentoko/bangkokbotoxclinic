"""Quick debug: show raw body text for sample missing-ingredient items"""
from __future__ import annotations
import json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT   = Path(__file__).parent.parent
from petfood.paths import FOODS as OUTPUT  # single catalogue; see petfood/paths.py
SAMPLES = {
    "pedigree":  "https://www.pedigree.co.th/our-products/dry-food/adult-beef-liver-vegetable",
    "whiskas":   "https://www.whiskas.co.th/our-products/dry-food/whiskas-junior-tuna-and-salmon-flavour",
    "purina":    "https://www.purina.co.th/food/dog/pro-plan-calming-care",
    "stella":    "https://www.stellaandchewys.com/products/turkey-carnivore-crunch",
    "ziwi":      "https://ziwipets.com/products/ziwi-lamb-green-tripe",
    "openfarm":  "https://openfarmpet.com/products/rustic-blend-variety-pack-for-cats",
}

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(locale="th-TH")
    page = ctx.new_page()

    for name, url in SAMPLES.items():
        print(f"\n{'='*60}")
        print(f"=== {name} ===")
        print(f"URL: {url}")
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=30000)
            import time; time.sleep(4)
            body = page.inner_text("body") or ""
            html = page.content() or ""
            print(f"Body length: {len(body)}, HTML length: {len(html)}")
            # Find ingredient lines
            lines = body.split("\n")
            for i, line in enumerate(lines):
                l = line.strip()
                if any(k in l for k in ["ingredient", "Ingredient", "INGREDIENT", "ส่วนประกอบ", "วัตถุดิบ"]):
                    context = "\n".join(lines[max(0,i-1):i+5]).strip()
                    print(f">> Found at line {i}: {context[:400]}")
                    break
            else:
                # Show first 800 chars of body
                print("(no ingredient keyword found)")
                print("Body preview:", body[:500])
        except Exception as e:
            print(f"ERROR: {e}")

    browser.close()
