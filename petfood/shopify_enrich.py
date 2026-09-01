"""
Ingredient backfill for Shopify-based pet food items with empty ingredients.

Strategy per brand:
  openfarmpet.com  — h4 tags inside ingredients-modal div (static HTML)
  ziwipets.com     — ingredients block in HTML body
  stellaandchewys  — skipped (JS-rendered, needs Playwright)

Also removes obvious non-food items (toys, accessories) from DB.

Run: python -m petfood.shopify_enrich
     python -m petfood.shopify_enrich --dry-run
     python -m petfood.shopify_enrich --clean-only   # just remove non-food items
"""
from __future__ import annotations
import argparse
import json
import re
import time
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

from petfood.parse_ingredients import parse_ingredients, calc_dry_matter, meets_aafco, score_food

ROOT   = Path(__file__).parent.parent
from petfood.paths import FOODS as OUTPUT  # single catalogue; see petfood/paths.py
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

# Items that clearly aren't food — remove from DB
NON_FOOD_PATTERNS = [
    r"tennis.?ball", r"toy\b", r"leash", r"collar", r"harness", r"bandana",
    r"hoodie", r"shirt", r"apparel", r"treat.?dispenser", r"silicone",
    r"bowl\b", r"mat\b", r"bed\b", r"crate\b", r"fence\b", r"gate\b",
    r"insert\b", r"springland", r"shampoo", r"conditioner", r"brush\b",
    r"nail.?clip", r"dental.?chew",
]
NON_FOOD_RE = re.compile("|".join(NON_FOOD_PATTERNS), re.IGNORECASE)


def _is_non_food(item: dict) -> bool:
    name = (item.get("name_en") or "") + " " + (item.get("name_th") or "")
    handle = (item.get("source_url") or "").rstrip("/").split("/")[-1]
    return bool(NON_FOOD_RE.search(name) or NON_FOOD_RE.search(handle))


def _fetch_html(url: str) -> str | None:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        return urllib.request.urlopen(req, timeout=20).read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"    ✗ fetch error: {e}")
        return None


# ── Open Farm: h4 tags inside ingredients-modal ───────────────────────────────

def _extract_open_farm(html: str) -> str:
    idx = html.find('class="ingredients-modal"')
    if idx < 0:
        return ""
    block = html[idx:idx+20000]
    h4s = re.findall(r"<h4[^>]*>(.*?)</h4>", block, re.DOTALL)
    names = []
    for h in h4s:
        name = re.sub(r"<[^>]+>", "", h).strip()
        if name and 2 < len(name) < 80 and name.lower() not in {
            "ingredients", "guaranteed analysis", "calorie content", "feeding guidelines",
        }:
            names.append(name)
    return ", ".join(names)


def _extract_nutrition_html(html: str) -> dict:
    def _pct(pat: str) -> float:
        m = re.search(r"(?:" + pat + r")[^\d]*(\d+(?:\.\d+)?)\s*%", html, re.IGNORECASE)
        if m and m.group(1) is not None:
            return float(m.group(1))
        return 0.0

    return {
        "protein":  _pct(r"Crude Protein|Protein Min"),
        "fat":      _pct(r"Crude Fat|Fat Min"),
        "fiber":    _pct(r"Crude Fiber|Fiber Max"),
        "moisture": _pct(r"Moisture Max|Moisture"),
    }


# ── Ziwi Peak: ingredients inside modal drawer ────────────────────────────────

def _extract_ziwi(html: str) -> str:
    # Ziwi stores ingredients in a modal: data-modal-content-id="Ingredients"
    # followed by <div class="rte small-paragraph"><p>INGREDIENT LIST</p>
    idx = html.find('data-modal-content-id="Ingredients"')
    if idx < 0:
        idx = html.find("data-modal-content-id='Ingredients'")
    if idx > 0:
        block = html[idx:idx+5000]
        # Find first <p> inside the modal
        m = re.search(r"<p[^>]*>(.*?)</p>", block, re.DOTALL)
        if m:
            raw = re.sub(r"<[^>]+>", " ", m.group(1))
            raw = re.sub(r"&amp;", "&", raw)
            raw = re.sub(r"\s+", " ", raw).strip()
            if len(raw) >= 30 and "," in raw:
                return raw
    return ""


# ── Dispatcher ────────────────────────────────────────────────────────────────

def enrich_item(item: dict) -> bool:
    source_url = item.get("source_url", "")
    domain = urlparse(source_url).netloc

    html = _fetch_html(source_url)
    if not html:
        return False

    if domain == "openfarmpet.com":
        ing_text = _extract_open_farm(html)
    elif domain == "ziwipets.com":
        ing_text = _extract_ziwi(html)
    else:
        return False  # stellaandchewys.com: JS-rendered, skip

    if not ing_text:
        return False

    ing = parse_ingredients(ing_text)
    if not ing:
        return False

    nutr    = _extract_nutrition_html(html)
    is_wet  = item.get("sub_category") == "wet_food"
    moisture = nutr["moisture"] or (78.0 if is_wet else 10.0)
    counts  = score_food(ing)
    p_dm    = calc_dry_matter(nutr["protein"], moisture)
    f_dm    = calc_dry_matter(nutr["fat"], moisture)

    item.update({
        "ingredients":  ing,
        "protein_pct":  nutr["protein"]  or item.get("protein_pct", 0.0),
        "fat_pct":      nutr["fat"]      or item.get("fat_pct", 0.0),
        "fiber_pct":    nutr["fiber"]    or item.get("fiber_pct", 0.0),
        "moisture_pct": moisture,
        "protein_dm":   p_dm,
        "fat_dm":       f_dm,
        "aafco_meets":  meets_aafco(p_dm, f_dm, item.get("life_stage", "adult")),
        **counts,
    })
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run",    action="store_true")
    parser.add_argument("--clean-only", action="store_true", help="Only remove non-food items")
    args = parser.parse_args()

    with open(OUTPUT, encoding="utf-8") as f:
        foods: list[dict] = json.load(f)

    # ── Step 1: Remove non-food items ─────────────────────────────────────────
    before = len(foods)
    foods = [x for x in foods if not _is_non_food(x)]
    removed = before - len(foods)
    print(f"Removed {removed} non-food items. Remaining: {len(foods)}")

    if args.clean_only:
        if not args.dry_run and removed > 0:
            OUTPUT.write_text(json.dumps(foods, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"✓ Saved (clean only) → {OUTPUT}")
        return

    # ── Step 2: Enrich Shopify items ──────────────────────────────────────────
    SUPPORTED = {"openfarmpet.com", "ziwipets.com"}
    targets = [
        x for x in foods
        if not x.get("ingredients")
        and urlparse(x.get("source_url", "")).netloc in SUPPORTED
    ]
    print(f"Targets: {len(targets)} items to enrich (Open Farm + Ziwi Peak)")

    updated = 0
    for i, item in enumerate(targets):
        brand = item.get("brand", "")
        name  = item.get("name_en", "")[:50]
        print(f"  [{i+1}/{len(targets)}] {brand} — {name}")
        if enrich_item(item):
            updated += 1
            print(f"    ✓ {len(item['ingredients'])} ingredients")
        else:
            print(f"    ⚠ skipped")
        time.sleep(0.4)

    print(f"\n✓ Enriched {updated}/{len(targets)}")

    if not args.dry_run and (removed > 0 or updated > 0):
        OUTPUT.write_text(json.dumps(foods, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"✓ Saved → {OUTPUT}")
    elif args.dry_run:
        print("(dry-run: not saved)")


if __name__ == "__main__":
    main()
