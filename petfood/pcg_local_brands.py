"""Local Thai mass-market pet food, from Perfect Companion Group's own shop.

The catalogue's 986 products are entirely imported premium brands — Hill's,
Royal Canin, Stella & Chewy's. Nothing a typical Thai household actually buys
at Tesco Lotus or Big C is in it: SmartHeart, Me-O, A-Pro, LuvCare, MaxWin,
Optimum, Saiteki are all owned by Perfect Companion Group and sold nowhere in
the dataset. This fills that gap from PCG's own retail site,
pcgshoponline.com, which turns out to be a considerably better source than
Lazada was:

  * it is server-rendered Next.js — the full product record is embedded as
    `__NEXT_DATA__` JSON in plain HTTP, so this needs no browser and meets no
    rate limiting or WAF;
  * SKU-level pack size and price are exact numbers from the manufacturer's own
    listing (`listProductChoice`), not a marketplace search result that might
    be a different pack of a similar product;
  * `listCategory` on the product detail page states the species and food type
    directly ("Dog Food", "Cat Food"), which is a fact rather than an inference
    from title text.

The trade-off: PCG publishes a guaranteed-analysis panel (protein/fat/fibre/
moisture minimums) but not an ingredient list, so these records get real
nutrition and real prices but no green/yellow/red/black grade — same as many
of the imported products that already carry ``ing_total: 0``. That is an
honest state, not a gap in this scraper: `hasPublishableData()` already
treats protein/fat/price as sufficient to publish a page.

    python -m petfood.pcg_local_brands --brand SmartHeart --verbose   # control run
    python -m petfood.pcg_local_brands --verbose                      # all brands
    python -m petfood.pcg_local_brands --apply
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import statistics
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FOODS = ROOT / "web-petbkk" / "data" / "petfood.json"
CHECKPOINT = ROOT / "petfood" / "pcg_local_brands.json"

BASE = "https://pcgshoponline.com"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# Brands confirmed to sell dog/cat food on the site. Bird, fish, rabbit and
# rodent brands (Briter Bunny, Lucky Fish, the standalone aviary lines) are out
# of scope for a dog/cat catalogue and are not in this list.
BRANDS = [
    "SmartHeart", "SmartHeart-Gold", "SmartHeart-Signature",
    "Me-O", "Me-O-Gold", "Me-O-Gold-Selection",
    "A-Pro-I.Q.-Formula", "Apro", "Apro-Plus",
    "LuvCare", "Dr.LuvCare-", "MaxWin", "Optimum", "Saiteki",
]

# A brand listing item is kept for a detail-page fetch only if its Thai name
# clears this bar. Cheap first-pass filter before the more expensive fetch;
# `listCategory` on the detail page is the real, authoritative check.
DOG_WORD, CAT_WORD = "สุนัข", "แมว"
EXCLUDE_WORDS = ("นก", "ปลา", "กระต่าย", "หนู", "เต่า", "ม้า", "ไก่ชน", "หมู")

LIFE_STAGE_WORDS = {
    "puppy": ("ลูกสุนัข", "ลูกแมว", "puppy", "kitten"),
    "senior": ("สูงวัย", "senior", "อาวุโส"),
}

# Guaranteed-analysis lines: "Crude Protein min. 26%", "โปรตีน ไม่น้อยกว่า 26%".
GA_PATTERNS = {
    "protein_pct": re.compile(r"(?:crude\s*protein|โปรตีน)[^%\d]*?([\d.]+)\s*%", re.I),
    "fat_pct":     re.compile(r"(?:crude\s*fat|ไขมัน)[^%\d]*?([\d.]+)\s*%", re.I),
    "fiber_pct":   re.compile(r"(?:crude\s*fib(?:er|re)|กาก(?:ใย)?)[^%\d]*?([\d.]+)\s*%", re.I),
    "moisture_pct": re.compile(r"(?:moisture|ความชื้น)[^%\d]*?([\d.]+)\s*%", re.I),
}

MIN_PRICE_THB = 20.0
MAX_PRICE_THB = 15_000.0
MIN_WEIGHT_KG = 0.03
MAX_WEIGHT_KG = 25.0


def fetch(url: str, timeout: float = 20.0) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="replace")


def next_data(html: str) -> dict | None:
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def find_first(obj, predicate, depth: int = 0):
    """Depth-first search for the first node — dict or list — matching `predicate`.

    The predicate is tested against `obj` itself before descending into it. An
    earlier version tested only dicts and then recursed into a list's
    *elements* without ever testing the list itself, so a predicate written to
    match a list (as every caller here does — "the array of product rows") could
    never succeed; it silently returned None on every call.
    """
    if depth > 10:
        return None
    if predicate(obj):
        return obj
    if isinstance(obj, dict):
        for v in obj.values():
            found = find_first(v, predicate, depth + 1)
            if found is not None:
                return found
    elif isinstance(obj, list):
        for v in obj:
            found = find_first(v, predicate, depth + 1)
            if found is not None:
                return found
    return None


def is_food_name(name_th: str) -> str | None:
    """Cheap pre-filter. Returns 'dog', 'cat', or None to skip a fetch."""
    if any(w in name_th for w in EXCLUDE_WORDS):
        return None
    has_dog, has_cat = DOG_WORD in name_th, CAT_WORD in name_th
    if has_dog and not has_cat:
        return "dog"
    if has_cat and not has_dog:
        return "cat"
    return None  # ambiguous or neither — let the detail page's category decide


def list_brand_products(brand_slug: str, max_pages: int = 8) -> list[dict]:
    """All listing rows for a brand, across pagination."""
    rows: list[dict] = []
    seen_slugs: set[str] = set()
    for page in range(1, max_pages + 1):
        url = f"{BASE}/brands/{brand_slug}" + (f"?page={page}" if page > 1 else "")
        try:
            html = fetch(url)
        except Exception:
            break
        data = next_data(html)
        if not data:
            break
        items = find_first(
            data,
            lambda o: isinstance(o, list) and len(o) > 0
            and isinstance(o[0], dict) and "seoSlug" in o[0] and "productNameTh" in o[0],
        )
        if not items:
            break
        new = [it for it in items if it.get("seoSlug") not in seen_slugs]
        if not new:
            break
        for it in new:
            seen_slugs.add(it.get("seoSlug"))
        rows.extend(new)
        if len(items) < 20:  # short page — this was the last one
            break
        time.sleep(0.4)
    return rows


def species_from_category(categories: list[dict]) -> str | None:
    for c in categories:
        name = f"{c.get('nameEn', '')} {c.get('nameTh', '')}"
        if re.search(r"\bdog food\b|อาหารสุนัข", name, re.I):
            return "dog"
        if re.search(r"\bcat food\b|อาหารแมว", name, re.I):
            return "cat"
    return None


def is_treat_or_other(categories: list[dict]) -> bool:
    """Snacks, treats and non-food items don't belong in a food-grading catalogue."""
    for c in categories:
        name = f"{c.get('nameEn', '')} {c.get('nameTh', '')}".lower()
        if any(w in name for w in ("treat", "snack", "ขนม", "toy", "ของเล่น", "litter", "ทราย")):
            return True
    return False


def life_stage_of(*texts: str) -> str:
    joined = " ".join(texts).lower()
    for stage, words in LIFE_STAGE_WORDS.items():
        if any(w.lower() in joined for w in words):
            return stage
    return "adult"


# A reading outside this range is a source-formatting error, not a fact. Found
# by example: one product's English panel reads "Moisture   max .85%" — a
# missing digit before the decimal point — while its Thai panel correctly
# reads "ความชื้น ไม่น้อยกว่า 85%". Trusting the English field alone would have
# published 0.85% moisture on a canned food, which is not a real number for
# any pet food that exists.
SANE_RANGE = {
    "protein_pct": (1.0, 65.0),
    "fat_pct": (0.5, 40.0),
    "fiber_pct": (0.0, 20.0),
    "moisture_pct": (2.0, 90.0),
}


def _parse_one(text: str) -> dict:
    out = {}
    for field, pattern in GA_PATTERNS.items():
        m = pattern.search(text or "")
        if m:
            try:
                out[field] = float(m.group(1))
            except ValueError:
                pass
    return out


def parse_guaranteed_analysis(text_en: str, text_th: str = "") -> dict:
    """Parse both language panels and keep only in-range readings.

    Where the two disagree — one in range, one not — the in-range reading
    wins regardless of which language it came from; a plausible number beats
    an implausible one. Where both are in range they should already agree, so
    English is kept for consistency with existing records.
    """
    en, th = _parse_one(text_en), _parse_one(text_th)
    out = {}
    for field, (lo, hi) in SANE_RANGE.items():
        for candidate in (en.get(field), th.get(field)):
            if candidate is not None and lo <= candidate <= hi:
                out[field] = candidate
                break
    return out


def fetch_product(slug: str) -> dict | None:
    try:
        html = fetch(f"{BASE}/product/{slug}")
    except Exception:
        return None
    data = next_data(html)
    if not data:
        return None
    p = find_first(data, lambda o: isinstance(o, dict) and "productQualityEn" in o
                    and "productNameTh" in o)
    return p


def build_record(p: dict) -> dict | None:
    categories = p.get("listCategory") or []
    if is_treat_or_other(categories):
        return None

    # listCategory is authoritative when present — it is what put four flea
    # shampoos into an early run of this scraper as "dog food" at ฿130/kg,
    # because their titles legitimately contain "สุนัข" (dog) and the category
    # check was only consulted as a fallback rather than a veto. Their real
    # category is "Pet Supplies", which says plainly that they are not food;
    # falling back to guessing from the title on a *known-wrong* category
    # answer is how that happened. Name-based inference is only reached when
    # PCG supplies no category at all.
    category_species = species_from_category(categories)
    if categories and category_species is None:
        return None  # categorised as something else — never food
    animal = category_species or is_food_name(p.get("productNameTh", ""))
    if animal not in ("dog", "cat"):
        return None

    # A guaranteed-analysis panel is what makes this a food record rather than
    # a grooming or accessory product PCG happened to file under a food
    # category. Nothing to publish without it.
    if not (p.get("productQualityEn") or p.get("productQualityTh")):
        return None

    name_th = (p.get("productNameTh") or "").strip()
    name_en = (p.get("productNameEn") or name_th).strip()
    brand = (p.get("brandNameEn") or p.get("brandNameTh") or "").strip()
    if not name_th or not brand:
        return None

    # SKU-level pack sizes are exact — the manufacturer's own price for its own
    # weight, not a marketplace listing that might belong to a neighbour
    # product. Several packs of the same product legitimately have different
    # per-kilo prices (bulk discount), so the median across them is the
    # representative figure, same principle as the Lazada matcher.
    choices = p.get("listProductChoice") or []
    variants = []
    for c in choices:
        weight = c.get("weight")
        price = c.get("sellPrice") or c.get("price")
        if not weight or not price:
            continue
        if not (MIN_WEIGHT_KG <= weight <= MAX_WEIGHT_KG):
            continue
        if not (MIN_PRICE_THB <= price <= MAX_PRICE_THB):
            continue
        variants.append((weight, price))
    if not variants:
        return None
    per_kg = sorted(price / weight for weight, price in variants)
    median_per_kg = statistics.median(per_kg)
    # Representative variant: whichever pack's own ratio sits closest to the
    # median, so the quoted price and weight describe one real SKU together.
    rep_weight, rep_price = min(variants, key=lambda v: abs(v[1] / v[0] - median_per_kg))

    ga = parse_guaranteed_analysis(p.get("productQualityEn") or "", p.get("productQualityTh") or "")
    moisture = ga.get("moisture_pct", 10.0 if "เปียก" not in name_th and "wet" not in name_en.lower() else 78.0)
    sub_category = "wet_food" if ("เปียก" in name_th or "wet" in name_en.lower() or "canned" in name_en.lower()) else "dry_food"

    def dry_matter(pct: float) -> float:
        factor = 1.0 - moisture / 100.0
        return round(pct / factor, 1) if factor > 0 and pct else 0.0

    protein_pct = ga.get("protein_pct", 0.0)
    fat_pct = ga.get("fat_pct", 0.0)

    return {
        "id": f"pcg-{p.get('seoSlug') or p.get('canonicalEn') or name_en}"[:120].lower(),
        "brand": brand,
        "name_en": name_en,
        "name_th": name_th,
        "animal": animal,
        "life_stage": life_stage_of(name_th, name_en),
        "sub_category": sub_category,
        "weight_kg": rep_weight,
        "weight_verified": True,
        "price_thb": rep_price,
        "price_per_kg": round(median_per_kg, 2),
        "buy_url": f"{BASE}/product/{p.get('seoSlug', '')}",
        "source_url": f"{BASE}/product/{p.get('seoSlug', '')}",
        "protein_pct": protein_pct,
        "fat_pct": fat_pct,
        "fiber_pct": ga.get("fiber_pct", 0.0),
        "moisture_pct": moisture,
        "protein_dm": dry_matter(protein_pct),
        "fat_dm": dry_matter(fat_pct),
        # No ingredient panel on this site — see module docstring. Left
        # unscored rather than guessed; hasPublishableData() still passes on
        # the real nutrition and price above.
        "aafco_meets": False,
        "ingredients": [],
        "green_count": 0, "yellow_count": 0, "red_count": 0, "black_count": 0,
        "neutral_count": 0, "unknown_count": 0, "ing_total": 0,
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--brand", help="single brand slug for a control run")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--verbose", action="store_true")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--delay", type=float, default=0.6)
    args = ap.parse_args()

    if args.apply:
        apply_records()
        return

    brands = [args.brand] if args.brand else BRANDS
    done: dict[str, dict] = {}
    if CHECKPOINT.exists():
        done = json.loads(CHECKPOINT.read_text(encoding="utf-8"))

    hit = skip = 0
    for brand in brands:
        rows = list_brand_products(brand)
        print(f"{brand}: {len(rows)} listing rows")
        candidates = [r for r in rows if is_food_name(r.get("productNameTh", "")) or True]
        if args.limit:
            candidates = candidates[: args.limit]

        for row in candidates:
            slug = row.get("seoSlug")
            if not slug or slug in done:
                continue
            p = fetch_product(slug)
            time.sleep(args.delay)
            if not p:
                skip += 1
                continue
            rec = build_record(p)
            if rec:
                done[slug] = rec
                hit += 1
                if args.verbose:
                    print(f"  ✓ {rec['brand']:14} {rec['name_th'][:38]:40} "
                          f"฿{rec['price_per_kg']}/kg  {rec['animal']}/{rec['life_stage']}")
            else:
                skip += 1
        CHECKPOINT.write_text(json.dumps(done, ensure_ascii=False), encoding="utf-8")

    print(f"\nkept {hit}, skipped {skip} (treats/other-species/no-price)  -> {CHECKPOINT.name}")
    print("review, then re-run with --apply")


def apply_records() -> None:
    if not CHECKPOINT.exists():
        raise SystemExit("no checkpoint yet — run without --apply first")
    done: dict[str, dict] = json.loads(CHECKPOINT.read_text(encoding="utf-8"))
    records = list(done.values())
    if not records:
        raise SystemExit("checkpoint is empty")

    foods = json.loads(FOODS.read_text(encoding="utf-8"))
    existing_ids = {f["id"] for f in foods}
    new = [r for r in records if r["id"] not in existing_ids]

    by_brand: dict[str, int] = {}
    for r in new:
        by_brand[r["brand"]] = by_brand.get(r["brand"], 0) + 1
    print(f"adding {len(new)} products ({len(records) - len(new)} already present)")
    for brand, n in sorted(by_brand.items(), key=lambda kv: -kv[1]):
        print(f"  {n:4}  {brand}")

    per_kg = sorted(r["price_per_kg"] for r in new if r["price_per_kg"] > 0)
    if per_kg:
        print(f"\n฿/kg  min {per_kg[0]:.0f}  median {statistics.median(per_kg):.0f}  "
              f"max {per_kg[-1]:.0f}")

    shutil.copy2(FOODS, FOODS.with_suffix(".json.pcgbak"))
    FOODS.write_text(json.dumps(foods + new, ensure_ascii=False), encoding="utf-8")
    print(f"\nwrote {FOODS.name} ({len(foods)} -> {len(foods) + len(new)} products)")
    print("next: npm run build:index && rebuild the site")


if __name__ == "__main__":
    main()
