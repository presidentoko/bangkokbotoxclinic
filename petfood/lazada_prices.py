"""Retail prices for the pet-food catalogue, from Lazada Thailand.

Replaces petfood/shopee_prices.py, which could not work as written:

  * it took ``min()`` of the first five results of a ``sortBy=price&order=asc``
    search, with no check that any of them were the product being priced. The
    cheapest hit on a "Royal Canin Maxi Adult" search is a sample sachet or a
    food scoop, not the 15 kg bag;
  * its price regex was ``\\d{2,6}``, which matches review counts, sold counts
    and pack sizes as readily as prices;
  * it divided by ``weight_kg``, which is 1.0 on all 986 records, so
    ``price_per_kg`` could only ever equal ``price_thb``;
  * and it wrote to ``deliverable/data/petfood.json`` — a different file from
    the one the site reads.

Shopee serves an empty shell to a headless browser; Lazada renders results
server-side and exposes them as ``[data-qa-locator="product-item"]`` cards, so
that is the source here.

The important part is what gets *rejected*. A search engine will happily fill a
page with other brands, and a listing without a declared pack size cannot yield
a price per kilo. Both are dropped rather than guessed, and the reported price
is the median of what survives — not the minimum, which is always the odd one
out.

    python -m petfood.lazada_prices --limit 3 --verbose   # control run first
    python -m petfood.lazada_prices                       # full run
    python -m petfood.lazada_prices --apply               # write petfood.json
"""

from __future__ import annotations

import argparse
import json
import re
import statistics
import time
import unicodedata
from pathlib import Path
from urllib.parse import quote_plus

ROOT = Path(__file__).resolve().parent.parent
FOODS = ROOT / "web-petbkk" / "data" / "petfood.json"
CHECKPOINT = ROOT / "petfood" / "lazada_prices.json"

SEARCH = "https://www.lazada.co.th/catalog/?q={}"

# Alibaba's WAF answers a flagged client with HTTP 200 and a redirect to
# /_____tmd_____/punish — a 19-byte page, not an error. Left undetected the run
# reads that as "no listings matched", writes a zero price for every remaining
# product, and keeps hammering an address that is already blocked. Both halves
# of that are worse than stopping.
BLOCK_MARKERS = ("_____tmd_____", "/punish", "captcha", "x5secdata")


class Blocked(RuntimeError):
    """The marketplace is refusing this client, not this query."""


UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# "฿1,114.00" — anchored on the currency symbol so sold counts and review
# counts cannot be mistaken for prices.
PRICE_RE = re.compile(r"฿\s*([\d,]+(?:\.\d{1,2})?)")

# Pack size in the listing title. The unit is required: "2.3K ชิ้น" is a sold
# count, and a bare number is nothing at all.
WEIGHT_RE = re.compile(
    r"(\d+(?:[.,]\d+)?)\s*(kgs?|กก\.?|กิโลกรัม|กิโล|g\b|gs?\b|กรัม)",
    re.IGNORECASE,
)

# Words that carry no identifying power in a product title.
STOPWORDS = {
    "dog", "cat", "food", "dry", "wet", "canned", "recipe", "adult", "puppy",
    "kitten", "senior", "formula", "pet", "for", "and", "with", "the", "size",
    "care", "health", "breed", "อาหาร", "สุนัข", "แมว", "ชนิด", "เม็ด", "สูตร",
}

MIN_PRICE_THB = 30.0
MAX_PRICE_THB = 20_000.0
# A bag under 100 g is a sample or a treat, not the product being priced.
MIN_WEIGHT_KG = 0.1
MAX_WEIGHT_KG = 25.0


def norm(text: str) -> str:
    """Casefold and strip apostrophes so "Hill's" matches "Hills"."""
    t = unicodedata.normalize("NFKC", text or "").lower()
    return re.sub(r"[''`´]", "", t)


def brand_tokens(brand: str) -> list[str]:
    return [t for t in re.split(r"[^a-z0-9]+", norm(brand)) if len(t) > 1]


# Hill's prescription diets are identified almost entirely by a two-character
# code — "k/d with Chicken Dog Food", "a/d with Chicken Wet Dog/Cat Food". Split
# on punctuation and dropped for being short, they left seventeen different
# products sharing the query "hills science diet chicken", which would have
# priced all seventeen off whichever one Lazada happened to rank first.
RX_CODE = re.compile(r"\b([a-z])/(d)\b")

# Thai runs, for the brands whose product names carry no English at all
# (Whiskas, Pedigree). Thai does not space between words, but these names do
# space between phrases, so the phrases are the usable unit.
RX_THAI = re.compile(r"[฀-๿]{3,}")


def model_tokens(food: dict) -> list[str]:
    """Distinctive words identifying this product within its brand.

    Thai product names usually carry the English model in brackets —
    "อาหารสุนัขโต … (MAXI LIGHT WEIGHT CARE)" — which is the most reliable
    handle available, so it is preferred when present.
    """
    name = food.get("name_en") or food.get("name_th") or ""
    bracketed = re.findall(r"\(([^)]*[A-Z]{2,}[^)]*)\)", name)
    source = bracketed[0] if bracketed else name
    lowered = norm(source)

    codes = [f"{a}/{b}" for a, b in RX_CODE.findall(lowered)]
    words = [w for w in re.split(r"[^a-z0-9]+", lowered) if len(w) > 2]
    thai = [t for t in RX_THAI.findall(source) if t not in STOPWORDS]

    out: list[str] = []
    for tok in codes + [w for w in words if w not in STOPWORDS] + thai:
        if tok not in out:
            out.append(tok)
    return out[:6]


# Species and life stage are structured fields we trust, and they are exactly
# the words STOPWORDS removes from the title. Ten different Hill's products —
# dog and cat, puppy and adult, dry and wet — collapsed onto the query
# "hills science diet sensitive stomach skin salmon"; without the species term
# they would all have been priced off whichever one Lazada ranked first.
ANIMAL_TERMS = {
    "dog": ("dog", "สุนัข", "หมา", "น้องหมา"),
    "cat": ("cat", "แมว", "น้องแมว"),
}
STAGE_QUERY = {"puppy": "puppy", "senior": "senior", "adult": ""}


def build_query(food: dict) -> str:
    animal = "dog" if food.get("animal") == "dog" else "cat"
    stage = STAGE_QUERY.get(food.get("life_stage", ""), "")
    parts = (
        brand_tokens(food.get("brand", ""))
        + model_tokens(food)[:5]
        + [animal]
        + ([stage] if stage else [])
    )
    return " ".join(dict.fromkeys(p for p in parts if p))


def parse_weight_kg(title: str) -> float | None:
    """The single declared pack size in the title, in kilograms.

    Returns None when the title declares more than one — "Royal Canin French
    Bulldog Adult (3 kg.และ 9 kg.)" is a variant listing whose displayed price
    belongs to one of the options and the card does not say which. Taking the
    larger size understated that product by a factor of three; taking the
    smaller would overstate a different one. Neither is knowable from the card,
    so the listing is dropped.
    """
    sizes: set[float] = set()
    for value, unit in WEIGHT_RE.findall(title):
        try:
            num = float(value.replace(",", "."))
        except ValueError:
            continue
        kg = num / 1000.0 if unit.lower().startswith(("g", "กรัม")) else num
        if MIN_WEIGHT_KG <= kg <= MAX_WEIGHT_KG:
            sizes.add(round(kg, 3))
    return sizes.pop() if len(sizes) == 1 else None


def model_hits(title: str, models: list[str]) -> int:
    t = norm(title)
    return sum(1 for m in models if m in t)


def animal_ok(title: str, animal: str) -> bool:
    """The listing must name the species this product is for.

    Cheap and decisive: a cat-food listing is never the right price for a dog
    food, and Lazada mixes both freely in one result page for a brand query.
    Titles are Thai as often as English, so both vocabularies are checked.
    """
    t = norm(title)
    return any(term in t for term in ANIMAL_TERMS[animal])


def matches(title: str, brands: list[str], models: list[str]) -> bool:
    """Every brand word, and enough model words to identify the line.

    One model word is not enough. "Royal Canin Poodle Loaf" searched on a single
    hit matched "Royal canin GASTROINTESTINAL loaf 400g" — same brand, same word
    "loaf", an entirely different product, and with only two results in the set
    it set the median. Where a product name gives two or more distinctive words,
    two must land.
    """
    t = norm(title)
    if not all(b in t for b in brands):
        return False
    if not models:
        return True
    return model_hits(title, models) >= min(2, len(models))


def parse_cards(page, brands: list[str], models: list[str], animal: str) -> list[dict]:
    out: list[dict] = []
    for card in page.query_selector_all('[data-qa-locator="product-item"]'):
        try:
            text = card.inner_text() or ""
        except Exception:
            continue
        title = text.split("\n")[0].strip()
        if not matches(title, brands, models) or not animal_ok(title, animal):
            continue

        price_m = PRICE_RE.search(text)
        if not price_m:
            continue
        try:
            price = float(price_m.group(1).replace(",", ""))
        except ValueError:
            continue
        if not (MIN_PRICE_THB <= price <= MAX_PRICE_THB):
            continue

        weight = parse_weight_kg(title)
        if weight is None:
            continue

        link = card.query_selector("a[href]")
        href = link.get_attribute("href") if link else None
        url = ("https:" + href) if href and href.startswith("//") else (href or "")

        out.append({
            "hits": model_hits(title, models),
            "title": title[:120],
            "price_thb": price,
            "weight_kg": weight,
            "price_per_kg": round(price / weight, 2),
            "url": url.split("?")[0],
        })
    return out


# Price per kilo legitimately falls as pack size rises — a 3 kg bag really does
# cost about twice per kilo what a 12 kg bag costs. So a wide spread is only
# partly an error signal, and the cut-off is set well above ordinary pack-size
# economics: past this, the match set is describing more than one product.
MAX_SPREAD = 8.0


def summarize(listings: list[dict]) -> dict | None:
    """Median price per kilo, plus one concrete listing to quote.

    Median rather than minimum: the cheapest hit on any marketplace search is a
    sachet, a mislabelled bundle or a bait listing. Median rather than mean
    because a single 15 kg bag among 1 kg bags would drag an average badly.

    The representative listing is picked only from those matching the most model
    words. The median ฿/kg can be carried by a listing for a neighbouring
    formula — a multi-breed Royal Canin bundle, say — and quoting that listing's
    price and pack size as *this* product's would be a specific false claim,
    even though the per-kilo figure is sound.
    """
    # Three is the smallest set where a median means anything; with two, an
    # unrelated listing is half the evidence.
    if len(listings) < 3:
        return None
    per_kg = statistics.median(l["price_per_kg"] for l in listings)
    lo = min(l["price_per_kg"] for l in listings)
    hi = max(l["price_per_kg"] for l in listings)
    if lo <= 0 or hi / lo > MAX_SPREAD:
        return None
    best_hits = max(l["hits"] for l in listings)
    candidates = [l for l in listings if l["hits"] == best_hits]
    rep = min(candidates, key=lambda l: abs(l["price_per_kg"] - per_kg))
    return {
        "price_thb": rep["price_thb"],
        "weight_kg": rep["weight_kg"],
        "price_per_kg": round(per_kg, 2),
        "buy_url": rep["url"],
        "matched": len(listings),
        "spread": round(hi / lo, 2),
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="stop after N products")
    ap.add_argument("--verbose", action="store_true")
    ap.add_argument("--apply", action="store_true", help="write petfood.json")
    # Two and a half seconds got roughly sixty searches through before the WAF
    # tripped. Slower is not optional here; it is the difference between a run
    # that finishes and one that is blocked a tenth of the way in.
    ap.add_argument("--delay", type=float, default=8.0)
    ap.add_argument("--proxy-ports", default="",
                    help="comma-separated local SOCKS5 ports to rotate through")
    ap.add_argument("--ids", nargs="*")
    args = ap.parse_args()

    foods = json.loads(FOODS.read_text(encoding="utf-8"))
    done: dict = {}
    if CHECKPOINT.exists():
        done = json.loads(CHECKPOINT.read_text(encoding="utf-8"))

    if args.apply:
        apply_prices(foods, done)
        return

    targets = [f for f in foods if not args.ids or f["id"] in args.ids]
    targets = [f for f in targets if f["id"] not in done]
    if args.limit:
        targets = targets[: args.limit]
    print(f"{len(targets)} products to price ({len(done)} already done)")

    from playwright.sync_api import sync_playwright

    hit = miss = 0
    with sync_playwright() as pw:
        ports = [int(p) for p in args.proxy_ports.split(",") if p.strip()]
        launch_kwargs = {"headless": True}
        if ports:
            launch_kwargs["proxy"] = {"server": f"socks5://127.0.0.1:{ports[0]}"}
            print(f"routing through socks5://127.0.0.1:{ports[0]}")
        browser = pw.chromium.launch(**launch_kwargs)
        ctx = browser.new_context(user_agent=UA, locale="th-TH")
        page = ctx.new_page()
        # Images and fonts are a large share of the bytes and none of the data.
        page.route(
            re.compile(r"\.(png|jpe?g|webp|gif|svg|woff2?|mp4)(\?|$)"),
            lambda route: route.abort(),
        )

        for i, food in enumerate(targets, 1):
            query = build_query(food)
            brands, models = brand_tokens(food["brand"]), model_tokens(food)
            animal = "dog" if food.get("animal") == "dog" else "cat"
            try:
                page.goto(SEARCH.format(quote_plus(query)),
                          wait_until="domcontentloaded", timeout=40000)
                page.wait_for_timeout(2200)
                if any(m in page.url for m in BLOCK_MARKERS):
                    raise Blocked(page.url[:120])
                listings = parse_cards(page, brands, models, animal)
            except Blocked as exc:
                CHECKPOINT.write_text(json.dumps(done, ensure_ascii=False), encoding="utf-8")
                print(f"\n  [{i}] BLOCKED by the marketplace WAF: {exc}")
                print("  Stopping so the address is not burned further. Progress is"
                      f" saved in {CHECKPOINT.name}; re-run later to resume.")
                print("  A block usually clears in hours. Raise --delay, or supply"
                      " residential exits with --proxy-ports.")
                break
            except Exception as exc:
                print(f"  [{i}] ERROR {type(exc).__name__} {query[:40]}")
                listings = []

            result = summarize(listings)
            if result:
                hit += 1
                done[food["id"]] = result
                if args.verbose:
                    print(f"  [{i}] ✓ {query[:44]:46} ฿{result['price_per_kg']}/kg "
                          f"from {result['matched']} listings (spread x{result['spread']})")
                    for l in listings[:4]:
                        print(f"        {l['weight_kg']:>5}kg ฿{l['price_thb']:>8.0f} "
                              f"= ฿{l['price_per_kg']:>7.1f}/kg  {l['title'][:62]}")
            else:
                miss += 1
                done[food["id"]] = {"price_per_kg": 0, "matched": len(listings)}
                if args.verbose:
                    print(f"  [{i}] ✗ {query[:44]:46} ({len(listings)} usable listings)")

            if i % 20 == 0 or i == len(targets):
                CHECKPOINT.write_text(json.dumps(done, ensure_ascii=False), encoding="utf-8")
                print(f"  … {i}/{len(targets)}  hit={hit} miss={miss}")
            time.sleep(args.delay)

        browser.close()

    CHECKPOINT.write_text(json.dumps(done, ensure_ascii=False), encoding="utf-8")
    print(f"\nhit {hit} / miss {miss}  -> {CHECKPOINT.name}")
    print("review, then re-run with --apply")


def apply_prices(foods: list[dict], done: dict) -> None:
    """Merge priced results into petfood.json."""
    priced = {k: v for k, v in done.items() if v.get("price_per_kg", 0) > 0}
    if not priced:
        print("nothing priced yet")
        return

    per_kg = sorted(v["price_per_kg"] for v in priced.values())
    print(f"pricing {len(priced)} products")
    print(f"  ฿/kg  min {per_kg[0]:.0f}  p25 {per_kg[len(per_kg)//4]:.0f}  "
          f"median {statistics.median(per_kg):.0f}  "
          f"p75 {per_kg[3*len(per_kg)//4]:.0f}  max {per_kg[-1]:.0f}")

    updated = 0
    for food in foods:
        rec = priced.get(food["id"])
        if not rec:
            continue
        food["price_thb"] = rec["price_thb"]
        food["price_per_kg"] = rec["price_per_kg"]
        # weight_kg was 1.0 on every record — a default, not a measurement. The
        # matched listing's declared pack size is a real one.
        food["weight_kg"] = rec["weight_kg"]
        # Marks the value as read off a real listing, which is what lets the
        # site show it at all — see lib/types.ts.
        food["weight_verified"] = True
        if rec.get("buy_url"):
            food["buy_url"] = rec["buy_url"]
        updated += 1

    backup = FOODS.with_suffix(".json.pricebak")
    backup.write_text(FOODS.read_text(encoding="utf-8"), encoding="utf-8")
    FOODS.write_text(json.dumps(foods, ensure_ascii=False), encoding="utf-8")
    print(f"updated {updated} products -> {FOODS.name} (backup {backup.name})")


if __name__ == "__main__":
    main()
