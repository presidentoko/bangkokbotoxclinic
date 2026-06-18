"""
Shopify-based pet food brand scraper — uses /products.json API (no JS needed)
Brands: Merrick, Instinct, Open Farm, Ziwi Peak, Nulo, Rawz, Orijen (Chewy Shopify?)

Run: python -m petfood.shopify_scraper
"""
from __future__ import annotations
import json, re, time
from pathlib import Path
import urllib.request, urllib.error

ROOT   = Path(__file__).parent.parent
OUTPUT = ROOT / "data" / "petfood.json"

SHOPIFY_BRANDS = [
    {
        "key": "open_farm",
        "brand": "Open Farm",
        "base": "https://openfarmpet.com",
        "animal_default": "dog",
    },
    {
        "key": "ziwi",
        "brand": "Ziwi Peak",
        "base": "https://ziwipets.com",
        "animal_default": "cat",
    },
    {
        "key": "nulo",
        "brand": "Nulo",
        "base": "https://nulo.com",
        "animal_default": "dog",
    },
    {
        "key": "rawz",
        "brand": "Rawz",
        "base": "https://rawznaturalpetfood.com",
        "animal_default": "cat",
    },
    {
        "key": "canidae",
        "brand": "Canidae",
        "base": "https://www.canidae.com",
        "animal_default": "dog",
    },
    {
        "key": "natural_balance",
        "brand": "Natural Balance",
        "base": "https://www.naturalbalanceinc.com",
        "animal_default": "dog",
    },
    {
        "key": "diamond",
        "brand": "Diamond Naturals",
        "base": "https://www.diamondpet.com",
        "animal_default": "dog",
    },
    {
        "key": "wellness",
        "brand": "Wellness",
        "base": "https://www.wellnesspetfood.com",
        "animal_default": "dog",
    },
    {
        "key": "castor_pollux",
        "brand": "Castor & Pollux",
        "base": "https://www.castorandpollux.com",
        "animal_default": "dog",
    },
    {
        "key": "stella_chewy",
        "brand": "Stella & Chewy's",
        "base": "https://www.stellaandchewys.com",
        "animal_default": "dog",
    },
    {
        "key": "victor",
        "brand": "Victor",
        "base": "https://www.victordogfood.com",
        "animal_default": "dog",
    },
    {
        "key": "fromm",
        "brand": "Fromm",
        "base": "https://www.frommfamily.com",
        "animal_default": "dog",
    },
    {
        "key": "orijen",
        "brand": "Orijen",
        "base": "https://www.orijen.ca",
        "animal_default": "dog",
    },
    {
        "key": "sportmix",
        "brand": "Sportmix",
        "base": "https://www.sportmixpetfood.com",
        "animal_default": "dog",
    },
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


def _slugify(t: str) -> str:
    t = re.sub(r"[^\w\s-]", "", t.lower())
    return re.sub(r"[\s_]+", "-", t).strip("-")[:80]


def _life_stage(t: str) -> str:
    t = t.lower()
    if any(w in t for w in ["puppy", "kitten", "junior", "whelp", "starter"]): return "puppy"
    if any(w in t for w in ["senior", "mature", "aging", "7+", "11+"]): return "senior"
    return "adult"


def _detect_animal(tags: list[str], title: str, default: str) -> str:
    combined = " ".join(tags + [title]).lower()
    if "cat" in combined or "kitten" in combined or "feline" in combined: return "cat"
    if "dog" in combined or "puppy" in combined or "canine" in combined: return "dog"
    return default


def _is_food(title: str, tags: list[str], product_type: str) -> bool:
    combined = (title + " " + " ".join(tags) + " " + product_type).lower()
    non_food = ["toy", "leash", "collar", "harness", "bed", "bowl", "shampoo",
                "supplement", "probiotic", "dental", "treat"]
    # Allow treats — they are food-adjacent
    if any(w in combined for w in ["toy", "leash", "collar", "harness", "bed", "bowl", "shampoo"]):
        return False
    return True


def _fetch_json(url: str) -> dict | None:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        print(f"  fetch error {url}: {e}")
        return None


def _parse_product(p: dict, brand: str, animal_default: str, base: str,
                   existing_sources: set[str]) -> list[dict]:
    """One Shopify product may have variants — return one entry per relevant variant."""
    title = p.get("title", "")
    if not title: return []
    if not _is_food(title, p.get("tags", []), p.get("product_type", "")): return []

    handle = p.get("handle", _slugify(title))
    source_url = f"{base}/products/{handle}"
    if source_url in existing_sources: return []

    animal = _detect_animal(p.get("tags", []), title, animal_default)
    ls = _life_stage(title)

    is_wet = any(w in title.lower() for w in
                 ["wet", "pate", "pâté", "stew", "loaf", "gravy",
                  "broth", "jelly", "mousse", "pouch", "can"])

    # Extract ingredient text from body_html
    body = re.sub(r"<[^>]+>", " ", p.get("body_html") or "")
    ing_text = ""
    m = re.search(r"[Ii]ngredients[:\s]+([^.]{30,800})", body)
    if m: ing_text = m.group(1).strip()

    def _pct(pat: str) -> float:
        try:
            m = re.search(pat + r"[^\d]*(\d+(?:\.\d+)?)\s*%", body, re.IGNORECASE)
            return float(m.group(1)) if m else 0.0
        except (TypeError, ValueError): return 0.0

    protein  = _pct(r"Crude Protein|Protein Min")
    fat      = _pct(r"Crude Fat|Fat Min")
    fiber    = _pct(r"Crude Fiber|Fiber Max")
    moisture = _pct(r"Moisture Max|Moisture")
    moisture = moisture or (78.0 if is_wet else 10.0)

    from petfood.parse_ingredients import parse_ingredients, calc_dry_matter, meets_aafco, score_food
    ing    = parse_ingredients(ing_text)
    counts = score_food(ing)
    p_dm   = calc_dry_matter(protein, moisture)
    f_dm   = calc_dry_matter(fat, moisture)

    return [{
        "id": f"{_slugify(brand)}-{handle}"[:100],
        "brand": brand,
        "name_en": title, "name_th": title,
        "animal": animal, "life_stage": ls,
        "sub_category": "wet_food" if is_wet else "dry_food",
        "weight_kg": 1.0, "price_thb": 0.0, "price_per_kg": 0.0,
        "buy_url": f"https://shopee.co.th/search?keyword={_slugify(brand)}+{_slugify(title)}",
        "source_url": source_url,
        "protein_pct": protein, "fat_pct": fat,
        "fiber_pct": fiber, "moisture_pct": moisture,
        "protein_dm": p_dm, "fat_dm": f_dm,
        "aafco_meets": meets_aafco(p_dm, f_dm, ls),
        "ingredients": ing, **counts,
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }]


def scrape_shopify(cfg: dict, existing_sources: set[str]) -> list[dict]:
    base = cfg["base"]
    brand = cfg["brand"]
    products = []
    page = 1

    print(f"\n=== {brand} ===")
    while True:
        url = f"{base}/products.json?limit=250&page={page}"
        data = _fetch_json(url)
        if not data or not data.get("products"):
            break
        items = data["products"]
        print(f"  page {page}: {len(items)} items")
        for p in items:
            new = _parse_product(p, brand, cfg["animal_default"], base, existing_sources)
            products.extend(new)
        if len(items) < 250:
            break
        page += 1
        time.sleep(0.5)

    print(f"  → {len(products)} new products")
    return products


def main():
    with open(OUTPUT, encoding="utf-8") as f:
        existing: list[dict] = json.load(f)
    existing_sources = {x["source_url"] for x in existing}
    all_new: list[dict] = []

    for cfg in SHOPIFY_BRANDS:
        new = scrape_shopify(cfg, existing_sources)
        if new:
            all_new.extend(new)
            existing.extend(new)
            existing_sources.update(p["source_url"] for p in new)
            OUTPUT.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"  Saved {len(new)} {cfg['brand']} → total {len(existing)}")

    print(f"\n✓ Done. Added {len(all_new)} Shopify products → total {len(existing)}")


if __name__ == "__main__":
    main()
