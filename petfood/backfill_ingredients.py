"""
Backfill missing ingredients for existing petfood.json items.
Uses Playwright for JS-rendered/tab-based sites.

Run: python -m petfood.backfill_ingredients
"""
from __future__ import annotations
import json, re, time
from pathlib import Path
from playwright.sync_api import sync_playwright, Page

from petfood.parse_ingredients import parse_ingredients, calc_dry_matter, meets_aafco, score_food

ROOT   = Path(__file__).parent.parent
OUTPUT = ROOT / "data" / "petfood.json"


def _clean_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&[a-z]+;", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _click_tab(page: Page, keywords: list[str], timeout: int = 3000) -> bool:
    """Try to click a tab/button matching any keyword."""
    for kw in keywords:
        try:
            els = page.locator(f"button:has-text('{kw}'), [role=tab]:has-text('{kw}'), a:has-text('{kw}')")
            if els.count() > 0:
                els.first.click(timeout=timeout)
                time.sleep(1.5)
                return True
        except Exception:
            pass
    return False


# ── domain-specific extractors ────────────────────────────────────────────────

def _extract_whiskas(page: Page) -> str:
    body = page.inner_text("body") or ""
    # "วัตถุดิบที่ใช้เป็นส่วนผสมอาหาร" is the header; ingredients are on next non-empty line
    m = re.search(
        r"วัตถุดิบที่ใช้เป็นส่วนผสมอาหาร\s*\n+\s*(.{30,900})",
        body, re.DOTALL
    )
    if m:
        # Take only first line (ingredients are on one line)
        first_line = m.group(1).split("\n")[0].strip()
        if len(first_line) > 20:
            return first_line
    # Fallback: generic Thai ingredient header
    for pat in [
        r"วัตถุดิบ[^\n]*\n+\s*(.{30,900})",
        r"ส่วนประกอบ[^\n]*\n+\s*(.{30,900})",
        r"[Ii]ngredients[^\n]*\n+\s*(.{30,900})",
    ]:
        m = re.search(pat, body, re.DOTALL)
        if m:
            first_line = m.group(1).split("\n")[0].strip()
            if len(first_line) > 20:
                return first_line
    return ""


def _extract_purina(page: Page) -> str:
    # Click the วัตถุดิบ/Ingredients tab
    _click_tab(page, ["วัตถุดิบ", "ส่วนประกอบ", "Ingredients"])
    body = page.inner_text("body") or ""
    for pat in [
        r"วัตถุดิบ\s*\n+\s*(.{30,900})",
        r"ส่วนประกอบ[:\s]*\n+\s*(.{30,900})",
        r"[Ii]ngredients[:\s]*\n+\s*(.{30,900})",
        r"วัตถุดิบ[:\s]*([^\n]{30,})",
        r"ส่วนประกอบ[:\s]*([^\n]{30,})",
    ]:
        m = re.search(pat, body, re.DOTALL)
        if m:
            first_line = m.group(1).split("\n")[0].strip()
            if len(first_line) > 20:
                return first_line
    return ""


def _extract_stella(page: Page) -> str:
    # Click Ingredients tab/accordion
    _click_tab(page, ["Ingredients", "Ingredient"])
    time.sleep(1)
    body = page.inner_text("body") or ""
    # After clicking, ingredient content should appear below the tab
    m = re.search(
        r"Ingredients\s*\n+\s*(.{60,}?)(?:\n\s*(?:Guaranteed|Feeding|You may|$))",
        body, re.DOTALL
    )
    if m:
        text = m.group(1).strip()
        first_block = re.split(r"\n\s*\n", text)[0]
        return first_block[:800]
    # Broader fallback
    m = re.search(r"Ingredients\s*\n+\s*(.{60,900})", body, re.DOTALL)
    if m:
        return m.group(1).split("\n")[0].strip()
    return ""


def _extract_ziwi(page: Page) -> str:
    _click_tab(page, ["Ingredients", "Ingredient"])
    time.sleep(1)
    body = page.inner_text("body") or ""
    html = page.content() or ""
    # Try modal section in HTML
    idx = html.find('data-modal-content-id="Ingredients"')
    if idx > 0:
        block = html[idx:idx+5000]
        m_p = re.search(r"<p[^>]*>(.*?)</p>", block, re.DOTALL)
        if m_p:
            return _clean_html(m_p.group(1))[:600]
    # Body text fallback
    m = re.search(r"Ingredients\s*\n+\s*(.{60,900})", body, re.DOTALL)
    if m:
        return m.group(1).split("\n")[0].strip()
    return ""


def _extract_openfarm(page: Page) -> str:
    html = page.content() or ""
    idx = html.find('class="ingredients-modal"')
    if idx > 0:
        block = html[idx:idx+20000]
        h4s = re.findall(r"<h4[^>]*>(.*?)</h4>", block, re.DOTALL)
        if h4s:
            return ", ".join(_clean_html(h) for h in h4s if _clean_html(h))[:800]
    # Fallback: click "Ingredients" section
    _click_tab(page, ["Ingredients", "Ingredient"])
    time.sleep(1)
    body = page.inner_text("body") or ""
    m = re.search(r"Ingredients\s*\n+\s*(.{60,900})", body, re.DOTALL)
    if m:
        return m.group(1).split("\n")[0].strip()
    return ""


DOMAIN_HANDLERS = {
    "whiskas.co.th":       _extract_whiskas,
    "purina.co.th":        _extract_purina,
    "stellaandchewys.com": _extract_stella,
    "ziwipets.com":        _extract_ziwi,
    "openfarmpet.com":     _extract_openfarm,
}


def _get_domain(url: str) -> str:
    m = re.search(r"https?://(?:www\.)?([^/]+)", url)
    return m.group(1) if m else ""


# ── main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    with open(OUTPUT, encoding="utf-8") as f:
        foods: list[dict] = json.load(f)

    missing = [i for i, x in enumerate(foods) if not x.get("ingredients")]
    print(f"Missing ingredients: {len(missing)} / {len(foods)}\n")

    from collections import Counter
    domain_counts = Counter(_get_domain(foods[i].get("source_url", "")) for i in missing)
    for d, c in domain_counts.most_common():
        handler = "✓" if any(k in d for k in DOMAIN_HANDLERS) else "✗ skip"
        print(f"  {c:3d}  {d}  {handler}")
    print()

    updated = 0
    skipped = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, slow_mo=50)
        ctx = browser.new_context(
            locale="th-TH",
            extra_http_headers={"Accept-Language": "th-TH,th;q=0.9,en;q=0.8"},
        )
        page = ctx.new_page()

        for n, idx in enumerate(missing, 1):
            item = foods[idx]
            url = item.get("source_url", "")
            domain = _get_domain(url)
            handler_key = next((k for k in DOMAIN_HANDLERS if k in domain), None)

            if not handler_key:
                skipped += 1
                continue

            label = f"{item.get('brand','')} — {item.get('name_en','')[:40]}"
            print(f"[{n}/{len(missing)}] {label}")

            try:
                page.goto(url, wait_until="domcontentloaded", timeout=30000)
                time.sleep(2)
                ing_text = DOMAIN_HANDLERS[handler_key](page)
            except Exception as e:
                print(f"    ✗ error: {e}")
                skipped += 1
                continue

            if not ing_text or len(ing_text) < 15:
                print(f"    ✗ no ingredients found")
                skipped += 1
                continue

            ingredients = parse_ingredients(ing_text)
            if not ingredients:
                print(f"    ✗ parse returned empty ({ing_text[:60]}...)")
                skipped += 1
                continue

            counts = score_food(ingredients)
            item["ingredients"] = ingredients
            item.update(counts)

            protein    = item.get("protein_pct", 0) or 0
            fat        = item.get("fat_pct", 0) or 0
            moisture   = item.get("moisture_pct", 10) or 10
            life_stage = item.get("life_stage", "adult")
            item["protein_dm"]  = calc_dry_matter(protein, moisture)
            item["fat_dm"]      = calc_dry_matter(fat, moisture)
            item["aafco_meets"] = meets_aafco(item["protein_dm"], item["fat_dm"], life_stage)

            g, y, r = counts["green_count"], counts["yellow_count"], counts["red_count"]
            print(f"    ✓ {len(ingredients)} ingredients  G:{g} Y:{y} R:{r}")
            updated += 1
            time.sleep(0.3)

        browser.close()

    print(f"\n{'='*40}")
    print(f"Updated: {updated}  |  Skipped: {skipped}")

    if updated > 0:
        OUTPUT.write_text(json.dumps(foods, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"✓ Saved → {OUTPUT}")
        web_out = ROOT / "web-petbkk" / "data" / "petfood.json"
        if web_out.exists():
            web_out.write_text(json.dumps(foods, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"✓ Synced → {web_out}")


if __name__ == "__main__":
    main()
