"""
멀티 브랜드 스크래퍼 — Me-O, Sheba, Taste of the Wild, Farmina,
                       Applaws, Blue Buffalo, Eukanuba, Alpo, Nutro,
                       Purina Dog Chow, Royal Canin EN

Run: python -m petfood.morefood_scraper
     python -m petfood.morefood_scraper --brand meo  # 특정 브랜드만
"""
from __future__ import annotations
import argparse, json, re, time
from pathlib import Path
from playwright.sync_api import sync_playwright, Page
from petfood.parse_ingredients import parse_ingredients, calc_dry_matter, meets_aafco, score_food

ROOT   = Path(__file__).parent.parent
OUTPUT = ROOT / "data" / "petfood.json"

# ── 브랜드 설정 ──────────────────────────────────────────────────────────────
BRANDS: list[dict] = [
    {
        "key": "meo",
        "brand": "Me-O",
        "animal": "cat",
        "locale": "th-TH",
        "category_urls": [
            "https://www.me-o.co.th/products",
            "https://www.me-o.co.th/products/dry-food",
            "https://www.me-o.co.th/products/wet-food",
        ],
        "product_re": r"me-o\.co\.th/products/[a-z0-9-]{6,}$",
        "ignore_ssl": False,
    },
    {
        "key": "sheba",
        "brand": "Sheba",
        "animal": "cat",
        "locale": "th-TH",
        "category_urls": [
            "https://www.sheba.co.th/our-products",
            "https://www.sheba.co.th/our-products/pate",
            "https://www.sheba.co.th/our-products/cuts-in-gravy",
        ],
        "product_re": r"sheba\.co\.th/our-products/[a-z0-9-]+/[a-z0-9-]{5,}$",
        "ignore_ssl": False,
    },
    {
        "key": "totw",
        "brand": "Taste of the Wild",
        "animal": "dog",   # has both, will detect per URL
        "locale": "en-US",
        "category_urls": [
            "https://www.tasteofthewildpetfood.com/dog-food",
            "https://www.tasteofthewildpetfood.com/cat-food",
        ],
        "product_re": r"tasteofthewildpetfood\.com/(dog|cat)-food/[a-z0-9-]{6,}$",
        "ignore_ssl": False,
    },
    {
        "key": "farmina",
        "brand": "Farmina",
        "animal": "dog",
        "locale": "en-US",
        "category_urls": [
            "https://www.farmina.com/en/products/dog",
            "https://www.farmina.com/en/products/cat",
        ],
        "product_re": r"farmina\.com/en/products/(dog|cat)/[a-z0-9-]{6,}",
        "ignore_ssl": False,
    },
    {
        "key": "applaws",
        "brand": "Applaws",
        "animal": "cat",
        "locale": "en-US",
        "category_urls": [
            "https://www.applaws.com/products/cat/cat-food",
            "https://www.applaws.com/products/dog/dog-food",
        ],
        "product_re": r"applaws\.com/products/(cat|dog)/[a-z0-9/-]{8,}$",
        "ignore_ssl": False,
    },
    {
        "key": "bluebuffalo",
        "brand": "Blue Buffalo",
        "animal": "dog",
        "locale": "en-US",
        "category_urls": [
            "https://www.bluebuffalo.com/dog-food",
            "https://www.bluebuffalo.com/cat-food",
        ],
        "product_re": r"bluebuffalo\.com/(dog|cat)-food/[a-z0-9-]{6,}$",
        "ignore_ssl": False,
    },
    {
        "key": "eukanuba",
        "brand": "Eukanuba",
        "animal": "dog",
        "locale": "en-US",
        "category_urls": [
            "https://www.eukanuba.com/our-products/dog/dry-food",
            "https://www.eukanuba.com/our-products/dog/wet-food",
        ],
        "product_re": r"eukanuba\.com/our-products/dog/[a-z0-9-]+/[a-z0-9-]{5,}$",
        "ignore_ssl": False,
    },
    {
        "key": "alpo",
        "brand": "Alpo",
        "animal": "dog",
        "locale": "en-US",
        "category_urls": [
            "https://www.alpo.com/our-products/dry-dog-food",
            "https://www.alpo.com/our-products/wet-dog-food",
        ],
        "product_re": r"alpo\.com/our-products/[a-z0-9-]+/[a-z0-9-]{5,}$",
        "ignore_ssl": False,
    },
    {
        "key": "nutro",
        "brand": "Nutro",
        "animal": "dog",
        "locale": "en-US",
        "category_urls": [
            "https://www.nutro.com/natural-dog-food",
            "https://www.nutro.com/natural-cat-food",
        ],
        "product_re": r"nutro\.com/natural-(dog|cat)-food/[a-z0-9-]{6,}$",
        "ignore_ssl": False,
    },
    {
        "key": "merrick",
        "brand": "Merrick",
        "animal": "dog",
        "locale": "en-US",
        "category_urls": [
            "https://www.merrickpetcare.com/collections/dog-food",
            "https://www.merrickpetcare.com/collections/cat-food",
        ],
        "product_re": r"merrickpetcare\.com/products/[a-z0-9-]{6,}$",
        "ignore_ssl": False,
    },
    {
        "key": "instinct",
        "brand": "Instinct",
        "animal": "dog",
        "locale": "en-US",
        "category_urls": [
            "https://www.instinctpetfood.com/collections/dog-food",
            "https://www.instinctpetfood.com/collections/cat-food",
        ],
        "product_re": r"instinctpetfood\.com/products/[a-z0-9-]{6,}$",
        "ignore_ssl": False,
    },
    {
        "key": "smartheart",
        "brand": "SmartHeart",
        "animal": "dog",
        "locale": "th-TH",
        "category_urls": [
            "https://smartheart.co.th/dog-food/",
            "https://smartheart.co.th/cat-food/",
        ],
        "product_re": r"smartheart\.co\.th/(?:product|dog-food|cat-food)/[a-z0-9-]{4,}/?$",
        "ignore_ssl": False,
    },
    {
        "key": "iams",
        "brand": "Iams",
        "animal": "dog",
        "locale": "en-US",
        "category_urls": [
            "https://www.iams.com/dog-food",
            "https://www.iams.com/cat-food",
        ],
        "product_re": r"iams\.com/(?:dog|cat)-food/[a-z0-9-]{6,}$",
        "ignore_ssl": False,
    },
]

BRAND_MAP = {b["key"]: b for b in BRANDS}


# ── 공통 헬퍼 ────────────────────────────────────────────────────────────────

def _slugify(t: str) -> str:
    t = re.sub(r"[^\w\s-]", "", t.lower())
    return re.sub(r"[\s_]+", "-", t).strip("-")[:80]


def _life_stage(t: str) -> str:
    t = t.lower()
    if any(w in t for w in ["puppy", "kitten", "junior", "ลูก", "whelp", "starter"]): return "puppy"
    if any(w in t for w in ["senior", "mature", "aging", "สูงวัย", "7+", "11+"]): return "senior"
    return "adult"


def _detect_animal(url: str, default: str) -> str:
    if "/cat" in url or "cat-food" in url: return "cat"
    if "/dog" in url or "dog-food" in url: return "dog"
    return default


def _collect_urls(page: Page, cfg: dict) -> list[tuple[str, str]]:
    seen: set[str] = set()
    pattern = re.compile(cfg["product_re"])
    pairs: list[tuple[str, str]] = []

    for cat_url in cfg["category_urls"]:
        try:
            page.goto(cat_url, wait_until="domcontentloaded", timeout=30000)
            time.sleep(4)
            hrefs = page.eval_on_selector_all("a[href]", "els => [...new Set(els.map(e=>e.href))]")
            before = len(pairs)
            for h in hrefs:
                h = h.split("?")[0].rstrip("/")
                if h not in seen and pattern.search(h):
                    seen.add(h)
                    animal = _detect_animal(h, cfg["animal"])
                    pairs.append((h, animal))
            print(f"  {cat_url}: +{len(pairs)-before}")
        except Exception as e:
            print(f"  error {cat_url}: {e}")
    return pairs


def _parse_page(page: Page, url: str, animal: str, brand: str) -> dict | None:
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        time.sleep(3)
        body = page.inner_text("body") or ""
        title = (page.inner_text("h1") or "").strip()
        if not title:
            m = re.search(r"<title>([^<]+)</title>", page.content())
            title = m.group(1).split("|")[0].split("–")[0].strip() if m else ""
        if not title or len(title) < 4: return None

        # Skip generic category/article pages
        skip = {"dog food", "cat food", "dry food", "wet food", "all products",
                 "our products", "404", "page not found"}
        if title.lower() in skip: return None

        ing_text = ""
        for pat in [
            r"ส่วนประกอบ[:\s]*\n?([^\n]{30,800})",
            r"วัตถุดิบ[:\s]*\n?([^\n]{30,800})",
            r"[Ii]ngredients[:\s]*\n?([^\n]{30,800})",
        ]:
            m = re.search(pat, body)
            if m: ing_text = m.group(1).strip(); break

        def _pct(pat: str) -> float:
            try:
                m = re.search(pat + r"[^\d]*(\d+(?:\.\d+)?)\s*%", body, re.IGNORECASE)
                return float(m.group(1)) if m else 0.0
            except (TypeError, ValueError): return 0.0

        protein  = _pct(r"โปรตีน|Crude Protein|Protein")
        fat      = _pct(r"ไขมัน|Crude Fat|Fat")
        fiber    = _pct(r"กาก|Crude Fiber|Fiber")
        moisture = _pct(r"ความชื้น|Moisture")
        is_wet   = any(w in title.lower() + url for w in
                       ["wet", "pate", "pâté", "stew", "loaf", "gravy",
                        "broth", "jelly", "mousse", "เปียก", "pouch"])
        moisture = moisture or (78.0 if is_wet else 10.0)

        ls     = _life_stage(title)
        ing    = parse_ingredients(ing_text)
        counts = score_food(ing)
        p_dm   = calc_dry_matter(protein, moisture)
        f_dm   = calc_dry_matter(fat, moisture)

        return {
            "id": f"{_slugify(brand)}-{_slugify(title)}",
            "brand": brand,
            "name_en": title, "name_th": title,
            "animal": animal, "life_stage": ls,
            "sub_category": "wet_food" if is_wet else "dry_food",
            "weight_kg": 1.0, "price_thb": 0.0, "price_per_kg": 0.0,
            "buy_url": f"https://shopee.co.th/search?keyword={_slugify(brand)}+{_slugify(title)}",
            "source_url": url,
            "protein_pct": protein, "fat_pct": fat,
            "fiber_pct": fiber, "moisture_pct": moisture,
            "protein_dm": p_dm, "fat_dm": f_dm,
            "aafco_meets": meets_aafco(p_dm, f_dm, ls),
            "ingredients": ing, **counts,
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
    except Exception as e:
        print(f"    parse error {url}: {e}"); return None


def run_brand(cfg: dict, existing_sources: set[str]) -> list[dict]:
    new_products: list[dict] = []
    print(f"\n{'='*50}")
    print(f"=== {cfg['brand']} ===")
    print(f"{'='*50}")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, slow_mo=80)
        page = browser.new_context(
            locale=cfg.get("locale", "en-US"),
            ignore_https_errors=cfg.get("ignore_ssl", False),
            extra_http_headers={"Accept-Language": f"{cfg.get('locale','en-US')},en;q=0.8"},
        ).new_page()

        pairs = [(u, a) for u, a in _collect_urls(page, cfg) if u not in existing_sources]
        print(f"  New products: {len(pairs)}")

        for i, (url, animal) in enumerate(pairs, 1):
            slug = url.split("/")[-1][:40]
            print(f"  [{i}/{len(pairs)}] {slug}")
            p = _parse_page(page, url, animal, cfg["brand"])
            if p:
                new_products.append(p)
                g, y, r = p["green_count"], p["yellow_count"], p["red_count"]
                print(f"    ✓ {p['name_en'][:50]} G:{g} Y:{y} R:{r}")
            time.sleep(1)

        browser.close()
    return new_products


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--brand", help="Run only this brand key (e.g. meo, sheba, totw)")
    args = parser.parse_args()

    with open(OUTPUT, encoding="utf-8") as f:
        existing: list[dict] = json.load(f)
    existing_sources = {x["source_url"] for x in existing}

    targets = [BRAND_MAP[args.brand]] if args.brand and args.brand in BRAND_MAP else BRANDS
    all_new: list[dict] = []

    for cfg in targets:
        new = run_brand(cfg, existing_sources)
        if new:
            all_new.extend(new)
            # Save incrementally after each brand
            existing.extend(new)
            existing_sources.update(p["source_url"] for p in new)
            OUTPUT.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"  → Saved {len(new)} {cfg['brand']} products (running total: {len(existing)})")

    print(f"\n✓ Done. Added {len(all_new)} products total → {len(existing)} total in DB")


if __name__ == "__main__":
    main()
