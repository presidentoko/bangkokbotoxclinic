"""Thai multi-brand pet food, from Thonglor Pet Shop's WooCommerce store API.

The catalogue's blind spot was never the imported premium brands — it holds 385
Hill's and 208 Open Farm SKUs. It was the shelf a Thai owner actually stands in
front of, and more to the point the shelf a Thai pet influencer actually posts
about: Nekko, Jerhigh, INABA/CIAO, Maria, Toro, Zeal, Dr.Choice, Petsimo,
Felina Canino. None of those brands existed in the dataset at all, so the site
had nothing to say the moment someone searched a brand they had just been sold
on. Coverage is the whole product here: a verification site that answers "no
data" is worse than useless, because the visitor learns not to come back.

thonglorpetshop.com is a WooCommerce shop with the Store API left open at
``/wp-json/wc/store/v1/products``, which makes it a better source than the
brands' own sites:

  * one request pattern reaches ~30 brands instead of one, and the brand-site
    survey found most of those brands have no working site at all (six of the
    ten domains tried do not resolve);
  * it publishes Thai ingredient panels (``ส่วนประกอบ:``) and guaranteed
    analysis, which the brand sites mostly do not — Bellotta's own shop, for
    instance, returns 60 products with marketing prose and no panel;
  * prices are real retail baht from a shop that actually sells the item, not a
    marketplace search result that might be a different pack size.

Two caveats, both handled below rather than papered over:

  * The shop sells toys, shampoo and litter from the same API. An early pass
    let a Virbac derma shampoo through and its "Ceramide 3, Cholesterol, Aqua"
    read as an ingredient panel. ``is_food()`` is therefore a deny-list first
    and an allow-list second.
  * Ingredient strings are comma-separated but contain parenthesised groups
    ("แร่ธาตุ (เฟอร์รัสซัลเฟต, สังกะสีออกไซด์)"). Splitting naively on commas
    tears those apart into fragments that grade as unknown, so the split below
    is paren-aware.

    python -m petfood.thonglor_scraper --verbose          # dry run, prints what it would add
    python -m petfood.thonglor_scraper --brand nekko -v   # single-brand control run
    python -m petfood.thonglor_scraper --apply
"""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import ssl
import time
import urllib.parse
import urllib.request

from petfood.ingredient_grades import grade_ingredient
from petfood.paths import FOODS

BASE = "https://thonglorpetshop.com"
API = BASE + "/wp-json/wc/store/v1/products?per_page=100&page={}"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# Categories that mean "this is not food", checked before anything else. The
# shop files a dental gel under both "Oral Care" and "Dog Food & Treat", so a
# pure allow-list is not enough.
NOT_FOOD = (
    "Accessories", "Toys", "Dolls", "Grooming", "Shampoo", "Conditioner",
    "Carrier", "Trolley", "Toiletries", "Bowl", "Food Storage", "Bed",
    "Furniture", "Scratcher", "Cat Condo", "Oral Care", "Toothbrush",
    "Dental Gel", "Tick", "Flea", "Prevention", "Litter", "Cage", "Leash",
    "Collar", "Clothes", "อุปกรณ์", "ของเล่น", "ตุ๊กตา", "ที่นอน", "กระเป๋า",
    "ทำความสะอาด", "แปรง", "สเปรย์", "ที่ลับเล็บ", "ชามอาหาร", "ทรายแมว",
)
FOOD_WORDS = ("Food", "Treat", "อาหาร", "ขนม")

# Category names that are neither a food type nor an equipment type are the
# shop's brand facets. Everything in the two tuples above, plus these shape
# words, is excluded to leave the brand behind.
NOT_BRAND = NOT_FOOD + FOOD_WORDS + (
    "Brand", "Others", "อื่นๆ", "Diet", "สูตร", "Supplement", "วิตามิน",
    "Wet", "Dry", "Freeze", "Stick", "Lickable", "Dental", "Mother & Baby",
    "Prescription", "Veterinary", "Science",
)

# The shop files some products under their *manufacturer* — 33 items sat under
# "Mars" and 21 under "Nestle" — which is exactly the wrong label for this
# site's job. Nobody watches an influencer and then searches "Mars"; they
# search "Whiskas". The real brand is in the product title, so it is resolved
# from there first and the category is only a fallback. Ordered longest-first
# so "Purina Pro Plan" is not swallowed by "Purina".
BRAND_FROM_NAME: list[tuple[re.Pattern[str], str]] = [
    (re.compile(p, re.I), b) for p, b in [
        (r"\bpro[\s-]?plan\b|โปรแพลน", "Purina Pro Plan"),
        (r"\bpurina\s+one\b|เพียวริน่า\s*วัน", "Purina One"),
        (r"\bfriskies\b|ฟริสกี้ส์", "Friskies"),
        (r"\bfelix\b|เฟลิกซ์", "Felix"),
        (r"\bfancy\s*feast\b", "Fancy Feast"),
        (r"\bpurina\b|เพียวริน่า", "Purina"),
        (r"\btemptations\b|เทมเทช", "Temptations"),
        (r"\bwhiskas\b|วิสกัส", "Whiskas"),
        (r"\bpedigree\b|เพดดิกรี", "Pedigree"),
        (r"\bsheba\b|ชีบา", "Sheba"),
        (r"\bcesar\b|ซีซาร์", "Cesar"),
        (r"\broyal\s*canin\b|โรยัล\s*คานิน", "Royal Canin"),
        (r"\bhill'?s\b|ฮิลล์", "Hills Science Diet"),
        (r"\bciao\b|เชา", "CIAO"),
        (r"\binaba\b", "Inaba"),
        (r"\bnekko\b|เน็กโกะ", "Nekko"),
        (r"\bjerhigh\b|เจอร์ไฮ", "Jerhigh"),
        (r"\bme-?o\b|มีโอ", "Me-O"),
        (r"\bsmart\s*heart\b|สมาร์ทฮาร์ท", "SmartHeart"),
        (r"\bmaxima\b", "Maxima"),
        (r"\bbellotta\b|เบลลอตต้า", "Bellotta"),
        (r"\bmonchou\b", "Monchou"),
        (r"\btoro\b|โทโร่", "Toro"),
        (r"\bzeal\b", "Zeal"),
        (r"\borijen\b", "Orijen"),
        (r"\bacana\b", "Acana"),
        (r"\btaste\s+of\s+the\s+wild\b", "Taste of the Wild"),
        (r"\bziwi\b", "Ziwi Peak"),
        (r"\bopen\s*farm\b", "Open Farm"),
        (r"\bvirbac\b", "Virbac"),
    ]
]

# Category labels normalised onto the spelling the catalogue already uses, so a
# brand does not end up split across "Hill's" and "Hills Science Diet".
BRAND_ALIASES = {
    "hill's": "Hills Science Diet", "hills": "Hills Science Diet",
    "royal canin": "Royal Canin", "nekko": "Nekko", "inaba": "Inaba",
    "ciao": "CIAO", "jerhigh": "Jerhigh", "toro": "Toro",
    "taste of the wild": "Taste of the Wild", "me-o": "Me-O",
    "dr.choice [intervetta]": "Dr.Choice", "dr.choice": "Dr.Choice",
    "hercules": "Hercules", "pramy": "Prama",
}

# Manufacturer facets: never a usable brand on their own.
NOT_A_BRAND = {"mars", "nestle", "nestlé", "foodinnova", "cc pet", "intervetta"}

# The shop prefixes withdrawn lines with "(ยกเลิก)" — cancelled.
DISCONTINUED = "ยกเลิก"

CURRENCY_DIVISOR = 100  # Store API quotes minor units with currency_minor_unit=2

# "9kg." / "1.5 kg" / "400g" / "70 g" — the pack size is in the product title.
WEIGHT_RE = re.compile(r"(\d+(?:\.\d+)?)\s*(kg|กก|กิโล|g|gram|กรัม|G)\b", re.I)

ING_RE = re.compile(r"(?:ส่วนผสม|ส่วนประกอบ)\s*[:：]\s*\n?([^\n]{40,})")
GA_MARKERS = ("ไม่น้อยกว่า", "ไม่มากกว่า")
GA_PATTERNS = {
    "protein_pct": re.compile(r"(?:โปรตีน|crude\s*protein)[^\d%]{0,30}?([\d.]+)\s*%", re.I),
    "fat_pct": re.compile(r"(?:ไขมัน|crude\s*fat)[^\d%]{0,30}?([\d.]+)\s*%", re.I),
    "fiber_pct": re.compile(r"(?:กาก|เยื่อใย|crude\s*fib(?:re|er))[^\d%]{0,30}?([\d.]+)\s*%", re.I),
    "moisture_pct": re.compile(r"(?:ความชื้น|moisture)[^\d%]{0,30}?([\d.]+)\s*%", re.I),
}

CAT_WORDS = ("แมว", "cat", "kitten", "feline")
DOG_WORDS = ("สุนัข", "หมา", "dog", "puppy", "canine")

# Sanity bounds. A 0.02 kg "pack" is a single lickable sachet priced per box,
# and a ฿90,000 line item is a wholesale carton; both wreck ฿/kg comparisons.
MIN_WEIGHT_KG, MAX_WEIGHT_KG = 0.03, 25.0
MIN_PRICE_THB, MAX_PRICE_THB = 15.0, 12000.0

ctx = ssl.create_default_context()


def fetch_all(verbose: bool = False) -> list[dict]:
    out: list[dict] = []
    for page in range(1, 30):
        req = urllib.request.Request(API.format(page), headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
            batch = json.loads(resp.read().decode("utf-8"))
        if not batch:
            break
        out.extend(batch)
        if verbose:
            print(f"  page {page}: +{len(batch)} (total {len(out)})")
        if len(batch) < 100:
            break
        time.sleep(0.6)
    return out


def text_of(raw: str | None) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "\n", raw or ""))


def cats_of(p: dict) -> list[str]:
    return [html.unescape(c["name"]) for c in p.get("categories", [])]


def is_food(p: dict) -> bool:
    names = cats_of(p)
    for n in names:
        if any(bad in n for bad in NOT_FOOD):
            return False
    return any(any(w in n for w in FOOD_WORDS) for n in names)


def brand_of(p: dict, name: str = "") -> str | None:
    """Brand from the product title first, the category facet second."""
    for pat, brand in BRAND_FROM_NAME:
        if pat.search(name):
            return brand
    for n in cats_of(p):
        if any(w in n for w in NOT_BRAND):
            continue
        label = n.strip()
        if label.lower() in NOT_A_BRAND:
            continue
        return BRAND_ALIASES.get(label.lower(), label)
    return None


def split_ingredients(line: str) -> list[str]:
    """Split on commas that are not inside parentheses.

    "แร่ธาตุ (เฟอร์รัสซัลเฟต, สังกะสีออกไซด์), วิตามิน" has to yield two rows,
    not three, or the fragments grade as unknown and drag panel coverage below
    the threshold that makes a grade publishable at all.
    """
    items, depth, buf = [], 0, []
    for ch in line:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth = max(0, depth - 1)
        if ch == "," and depth == 0:
            items.append("".join(buf))
            buf = []
        else:
            buf.append(ch)
    items.append("".join(buf))
    return [s.strip(" .•-–—\t") for s in items]


def parse_panel(body: str) -> list[dict]:
    for m in ING_RE.finditer(body):
        line = m.group(1)
        # The same heading introduces the guaranteed-analysis block on some
        # products ("ส่วนประกอบ: โปรตีน ไม่น้อยกว่า 26%"). That is nutrition,
        # not a panel, and grading it would count "ไขมัน" as an ingredient.
        if any(w in line for w in GA_MARKERS):
            continue
        rows = [s for s in split_ingredients(line) if 1 < len(s) < 80]
        # Some panels repeat the heading inside the line itself
        # ("ส่วนประกอบ:\nส่วนผสม: ผลพลอยได้จากไก่, ..."), which would otherwise
        # glue the label onto the first ingredient and grade it as unknown.
        if rows:
            rows[0] = re.sub(r"^\s*(?:ส่วนผสม|ส่วนประกอบ)\s*[:：]\s*", "", rows[0]).strip()
        rows = [r for r in rows if 1 < len(r) < 80]
        if len(rows) >= 3:
            return [{"name": r, "grade": grade_ingredient(r)} for r in rows]
    return []


def parse_ga(body: str) -> dict[str, float]:
    out: dict[str, float] = {}
    for key, pat in GA_PATTERNS.items():
        m = pat.search(body)
        if m:
            try:
                val = float(m.group(1))
            except ValueError:
                continue
            if 0 < val <= 100:
                out[key] = val
    return out


def weight_kg_of(name: str) -> float:
    best = 0.0
    for num, unit in WEIGHT_RE.findall(name):
        try:
            v = float(num)
        except ValueError:
            continue
        kg = v if unit.lower() in ("kg", "กก", "กิโล") else v / 1000.0
        best = max(best, kg)
    return best


def animal_of(p: dict, name: str) -> str | None:
    hay = (" ".join(cats_of(p)) + " " + name).lower()
    is_cat = any(w in hay for w in CAT_WORDS)
    is_dog = any(w in hay for w in DOG_WORDS)
    if is_cat and not is_dog:
        return "cat"
    if is_dog and not is_cat:
        return "dog"
    return None


# Dry beats wet: "อาหารเม็ด" (kibble) is decisive, and the Thai title of a dry
# food often also mentions the wet variant. English markers need word
# boundaries — a substring test for "can" matches "Royal Canin", which quietly
# labelled every Royal Canin kibble as wet food and then used 78% moisture to
# compute its dry-matter protein.
_DRY_RE = re.compile(r"อาหารเม็ด|แบบเม็ด|ชนิดเม็ด|\bdry\b|\bkibble\b", re.I)
_WET_RE = re.compile(
    r"อาหารเปียก|แบบเปียก|ชนิดเปียก|กระป๋อง|เพาช์|ขนมแมวเลีย|"
    r"\bwet\b|\bcanned\b|\bcans?\b|\bpouch\b|\bmousse\b|\bloaf\b|\bgravy\b|\bjelly\b",
    re.I,
)


def is_wet(p: dict, name: str) -> bool:
    hay = name + " " + " ".join(cats_of(p))
    if _DRY_RE.search(hay):
        return False
    return bool(_WET_RE.search(hay))


def life_stage_of(name: str) -> str:
    low = name.lower()
    if any(w in low for w in ("puppy", "kitten", "ลูกสุนัข", "ลูกแมว", "junior")):
        return "puppy"
    if any(w in low for w in ("senior", "7+", "11+", "อาวุโส", "สูงวัย", "mature")):
        return "senior"
    return "adult"


def record_id(p: dict, name: str) -> str:
    """A readable ASCII id, which becomes the product's URL on the site.

    Most permalinks are already clean ("perfecta-vet-hypoallergenic-dog"), but
    some carry percent-encoded Thai ("2-%e0%b9%81%e0%b8%96%e0%b8%a1-1-pawganic-
    organic-dog-cracker"). Taking the last path segment verbatim and handing it
    to the site's slugifier turned those escapes into runs of hex —
    "tlps-nekko-gold-e0b980e0b899e0b987e0b881..." — which is a working URL and
    an unreadable one.

    So: decode the escapes, drop what is not ASCII, and fall back to the Latin
    words in the product title. The site separately requires ASCII slugs, since
    Thai ones 404'd there before.

    Dropping the Thai then makes the readable part ambiguous — every "Nekko
    Gold" variant whose flavour is written only in Thai reduces to the same
    "nekko-gold", which collapsed 553 products onto 435 ids. The id is the key
    for review lookups, saved items and affiliate tracking, so it has to be
    unique per product; the shop's own numeric product id is appended to
    guarantee that without giving up readability.
    """
    raw = (p.get("permalink") or "").rstrip("/").rsplit("/", 1)[-1]
    decoded = urllib.parse.unquote(raw)
    slug = re.sub(r"[^a-z0-9]+", "-", decoded.lower()).strip("-")
    # A slug of only separators and digits ("2-1") says nothing; prefer the name.
    if len(re.sub(r"[^a-z]", "", slug)) < 4:
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    shop_id = str(p.get("id") or "")
    return f"tlps-{slug}"[:110].strip("-") + f"-{shop_id}"


def build_record(p: dict) -> dict | None:
    name = html.unescape(p.get("name") or "").strip()
    if not name or DISCONTINUED in name:
        return None
    brand = brand_of(p, name)
    if not brand:
        return None
    animal = animal_of(p, name)
    if not animal:
        return None

    body = text_of(p.get("description")) + "\n" + text_of(p.get("short_description"))
    ingredients = parse_panel(body)
    ga = parse_ga(body)

    try:
        price = float(p.get("prices", {}).get("price") or 0) / CURRENCY_DIVISOR
    except (TypeError, ValueError):
        price = 0.0
    weight = weight_kg_of(name)
    if not (MIN_PRICE_THB <= price <= MAX_PRICE_THB):
        price = 0.0
    if not (MIN_WEIGHT_KG <= weight <= MAX_WEIGHT_KG):
        weight = 0.0
    per_kg = round(price / weight, 2) if price and weight else 0.0

    sub_category = "wet_food" if is_wet(p, name) else "dry_food"
    wet = sub_category == "wet_food"
    moisture = ga.get("moisture_pct", 78.0 if wet else 10.0)

    def dm(pct: float) -> float:
        factor = 1.0 - moisture / 100.0
        return round(pct / factor, 1) if factor > 0 and pct else 0.0

    protein = ga.get("protein_pct", 0.0)
    fat = ga.get("fat_pct", 0.0)

    counts = {"green_count": 0, "yellow_count": 0, "red_count": 0,
              "black_count": 0, "neutral_count": 0, "unknown_count": 0}
    for ing in ingredients:
        key = f"{ing['grade']}_count"
        if key in counts:
            counts[key] += 1

    return {
        "id": record_id(p, name),
        "brand": brand,
        "name_en": name,
        "name_th": name,
        "animal": animal,
        "life_stage": life_stage_of(name),
        "sub_category": sub_category,
        "weight_kg": weight,
        "weight_verified": bool(weight),
        "price_thb": price,
        "price_per_kg": per_kg,
        "buy_url": p.get("permalink") or BASE,
        "source_url": p.get("permalink") or BASE,
        "protein_pct": protein,
        "fat_pct": fat,
        "fiber_pct": ga.get("fiber_pct", 0.0),
        "moisture_pct": moisture,
        "protein_dm": dm(protein),
        "fat_dm": dm(fat),
        # Nothing on this site states AAFCO compliance, so it stays false
        # rather than being inferred from the presence of a nutrition panel.
        "aafco_meets": False,
        "ingredients": ingredients,
        **counts,
        "ing_total": len(ingredients),
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def publishable(r: dict) -> bool:
    """Same bar the website applies in lib/grading.ts::hasPublishableData."""
    return bool(r["ing_total"] >= 3 or r["protein_pct"] > 0
                or r["fat_pct"] > 0 or r["price_thb"] > 0)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--brand", help="only this brand (substring, case-insensitive)")
    ap.add_argument("--apply", action="store_true", help="write to the catalogue")
    ap.add_argument("--verbose", "-v", action="store_true")
    args = ap.parse_args()

    print(f"Fetching {BASE} store API ...")
    raw = fetch_all(verbose=args.verbose)
    print(f"  {len(raw)} products in the shop")

    foods = [p for p in raw if is_food(p)]
    print(f"  {len(foods)} pass the food filter")

    records: list[dict] = []
    for p in foods:
        r = build_record(p)
        if r and publishable(r):
            records.append(r)
    print(f"  {len(records)} build a publishable record")

    if args.brand:
        want = args.brand.lower()
        records = [r for r in records if want in r["brand"].lower()]
        print(f"  {len(records)} after --brand {args.brand!r}")

    existing = json.loads(FOODS.read_text(encoding="utf-8"))
    known_src = {e.get("source_url") for e in existing}
    known_id = {e.get("id") for e in existing}
    new = [r for r in records if r["source_url"] not in known_src and r["id"] not in known_id]

    by_brand: dict[str, int] = {}
    graded = 0
    for r in new:
        by_brand[r["brand"]] = by_brand.get(r["brand"], 0) + 1
        scored = r["green_count"] + r["yellow_count"] + r["red_count"] + r["black_count"]
        if scored >= 3 and (scored + r["neutral_count"]) / max(r["ing_total"], 1) >= 0.5:
            graded += 1

    have = {e["brand"].lower() for e in existing}
    print(f"\n{len(new)} new products ({len(records) - len(new)} already in the catalogue)")
    print(f"  {graded} of them carry a panel good enough to grade")
    print(f"  {sum(1 for r in new if r['price_thb'] > 0)} with a price")
    print(f"  {sum(1 for r in new if r['protein_pct'] > 0)} with guaranteed analysis")
    print("\n  by brand (* = brand entirely new to the catalogue):")
    for b, n in sorted(by_brand.items(), key=lambda kv: -kv[1]):
        star = "*" if b.lower() not in have else " "
        print(f"   {star} {n:>4}  {b}")

    if args.verbose:
        print("\n  sample records:")
        for r in new[:8]:
            print(f"    {r['brand']:<16} {r['name_en'][:52]:<52} "
                  f"฿{r['price_thb']:>7.0f} {r['weight_kg']:>5.2f}kg  "
                  f"ing={r['ing_total']:<3} {r['animal']}/{r['life_stage']}")

    if not args.apply:
        print("\nDry run. Re-run with --apply to write.")
        return

    backup = FOODS.with_suffix(".json.tlpsbak")
    shutil.copy2(FOODS, backup)
    merged = existing + new
    FOODS.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nBackup  → {backup}")
    print(f"Written → {FOODS}  ({len(existing)} → {len(merged)})")


if __name__ == "__main__":
    main()
