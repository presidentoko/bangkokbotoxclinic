"""Price the catalogue from an affiliate product feed instead of by scraping.

Scraping Lazada does not scale: `/catalog/?q=` is blocked outright and
indefinitely, the `/tag/<slug>/` path that worked around it stops returning
product data after roughly 150 requests, and the run process is killed silently
long before 986 products are done. An affiliate network hands over the same
data as a file, with no rate limit and no WAF, and the account needed to get it
is one the site needs anyway to monetise its outbound links.

This reads whatever the network exports — Involve Asia, AccessTrade, Lazada
Open Platform and Shopee all publish CSV or JSON with a title, a price and a
URL — and matches it against the catalogue with the same rules the scraper
used, which were the part that actually took work to get right:

  * every brand word must appear in the listing title, and two model words
    where the product name offers two;
  * the listing must name the species;
  * a title declaring two pack sizes is unusable, because the price belongs to
    one of them and the row does not say which;
  * the published figure is the median price per kilo across surviving
    listings, never the minimum;
  * the concrete listing quoted alongside it comes from those matching the most
    model words.

Column names differ per network, so they are detected rather than assumed; pass
--map to override. Nothing is written without --apply.

    python -m petfood.import_price_feed feed.csv                 # dry run
    python -m petfood.import_price_feed feed.csv --verbose
    python -m petfood.import_price_feed feed.csv --apply
    python -m petfood.import_price_feed feed.json --map title=name,price=sale_price,url=link
"""

from __future__ import annotations

import argparse
import csv
import json
import shutil
import statistics
import sys
from collections import Counter
from pathlib import Path

from petfood.lazada_prices import (
    MAX_PRICE_THB, MIN_PRICE_THB, animal_ok, brand_tokens, matches,
    model_hits, model_tokens, parse_weight_kg, summarize,
)

# How many catalogue products may legitimately share one set of matched
# listings. Two covers a product sold in a couple of pack sizes as separate
# rows; beyond that the names are not telling the products apart.
MAX_PRODUCTS_PER_SIGNATURE = 2

ROOT = Path(__file__).resolve().parent.parent
FOODS = ROOT / "web-petbkk" / "data" / "petfood.json"

# Field names seen across the SEA affiliate networks, best first.
TITLE_KEYS = ("product_name", "productname", "title", "name", "item_name", "product")
PRICE_KEYS = ("sale_price", "price", "discount_price", "current_price",
              "product_price", "final_price", "offer_price")
URL_KEYS = ("promo_link", "affiliate_link", "tracking_link", "product_link",
            "url", "link", "product_url", "deeplink")


def load_rows(path: Path) -> list[dict]:
    """Read a feed as a list of dicts, whatever container it arrives in."""
    text = path.read_text(encoding="utf-8-sig", errors="replace")
    if path.suffix.lower() == ".json" or text.lstrip()[:1] in "[{":
        data = json.loads(text)
        if isinstance(data, dict):
            # Networks wrap the array in one of a few envelope keys.
            for key in ("data", "results", "products", "items", "offers"):
                inner = data.get(key)
                if isinstance(inner, list):
                    return inner
                if isinstance(inner, dict):
                    for k2 in ("data", "products", "items"):
                        if isinstance(inner.get(k2), list):
                            return inner[k2]
            raise SystemExit(f"could not find a product array in {path.name}")
        return data
    return list(csv.DictReader(text.splitlines()))


def detect(rows: list[dict], candidates: tuple[str, ...], label: str) -> str:
    """Pick the feed's column for a field, by name then by content."""
    if not rows:
        raise SystemExit("feed is empty")
    keys = {k.lower().replace(" ", "_"): k for k in rows[0]}
    for cand in candidates:
        if cand in keys:
            return keys[cand]
    for cand in candidates:
        for low, orig in keys.items():
            if cand in low:
                return orig
    raise SystemExit(
        f"could not find the {label} column. Columns are: {list(rows[0])}\n"
        f"Pass --map {label}=<column>"
    )


def to_price(raw) -> float | None:
    """Parse a price cell. Feeds mix '฿1,234.00', '1234', and 1234.0."""
    if raw is None:
        return None
    if isinstance(raw, (int, float)):
        value = float(raw)
    else:
        cleaned = "".join(c for c in str(raw) if c.isdigit() or c == ".")
        if not cleaned or cleaned.count(".") > 1:
            return None
        try:
            value = float(cleaned)
        except ValueError:
            return None
    return value if MIN_PRICE_THB <= value <= MAX_PRICE_THB else None


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("feed", type=Path)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--verbose", action="store_true")
    ap.add_argument("--map", default="", help="title=col,price=col,url=col")
    args = ap.parse_args()

    rows = load_rows(args.feed)
    overrides = dict(
        pair.split("=", 1) for pair in args.map.split(",") if "=" in pair
    )
    col_title = overrides.get("title") or detect(rows, TITLE_KEYS, "title")
    col_price = overrides.get("price") or detect(rows, PRICE_KEYS, "price")
    col_url = overrides.get("url") or detect(rows, URL_KEYS, "url")
    print(f"{len(rows)} feed rows  "
          f"(title={col_title!r} price={col_price!r} url={col_url!r})")

    # Normalise once; the matcher runs over this for every product.
    listings: list[dict] = []
    for row in rows:
        title = str(row.get(col_title) or "").strip()
        price = to_price(row.get(col_price))
        if not title or price is None:
            continue
        weight = parse_weight_kg(title)
        if weight is None:
            continue
        listings.append({
            "title": title,
            "price_thb": price,
            "weight_kg": weight,
            "price_per_kg": round(price / weight, 2),
            "url": str(row.get(col_url) or "").strip(),
        })
    print(f"{len(listings)} usable listings "
          f"(a title must declare exactly one pack size)")

    foods = json.loads(FOODS.read_text(encoding="utf-8"))
    priced: dict[str, dict] = {}
    reasons: Counter[str] = Counter()

    for food in foods:
        brands = brand_tokens(food.get("brand", ""))
        models = model_tokens(food)
        animal = "dog" if food.get("animal") == "dog" else "cat"

        hits = []
        for listing in listings:
            title = listing["title"]
            if not matches(title, brands, models) or not animal_ok(title, animal):
                continue
            hits.append({**listing, "hits": model_hits(title, models)})

        result = summarize(hits)
        if result:
            # Which listings produced this figure. Products whose names cannot
            # tell them apart end up with byte-identical evidence, and pricing
            # them all the same is the fabrication this whole exercise exists to
            # avoid — see the collapse check below.
            result["_sig"] = "|".join(sorted(h["url"] or h["title"] for h in hits))
            priced[food["id"]] = result
        else:
            reasons["no matching listing" if not hits else
                    "too few listings or spread too wide"] += 1

    # A signature shared by several products means the matcher could not
    # distinguish them — eight Thai-named Whiskas lines matched the same three
    # listings and would all have been published at one price. None of them is
    # knowable, so none is published.
    shared = Counter(v["_sig"] for v in priced.values())
    ambiguous = {sig for sig, n in shared.items() if n > MAX_PRODUCTS_PER_SIGNATURE}
    dropped = [k for k, v in priced.items() if v["_sig"] in ambiguous]
    for key in dropped:
        del priced[key]
    reasons["indistinguishable from other products in the same feed rows"] += len(dropped)

    for food in foods:
        rec = priced.get(food["id"])
        if rec:
            rec.pop("_sig", None)
            if args.verbose:
                print(f"  ✓ {food['brand'][:16]:18} {(food['name_en'] or '')[:34]:36} "
                      f"฿{rec['price_per_kg']}/kg from {rec['matched']}")

    print(f"\npriced {len(priced)} of {len(foods)} products")
    for reason, n in reasons.most_common():
        print(f"  {n:4}  {reason}")
    if not priced:
        raise SystemExit("nothing matched — check the feed covers these brands")

    per_kg = sorted(v["price_per_kg"] for v in priced.values())
    print(f"\n฿/kg  min {per_kg[0]:.0f}  p25 {per_kg[len(per_kg)//4]:.0f}  "
          f"median {statistics.median(per_kg):.0f}  "
          f"p75 {per_kg[3*len(per_kg)//4]:.0f}  max {per_kg[-1]:.0f}")

    if not args.apply:
        print("\ndry run — re-run with --apply to write petfood.json")
        return

    for food in foods:
        rec = priced.get(food["id"])
        if not rec:
            continue
        food["price_thb"] = rec["price_thb"]
        food["price_per_kg"] = rec["price_per_kg"]
        food["weight_kg"] = rec["weight_kg"]
        food["weight_verified"] = True
        if rec.get("buy_url"):
            food["buy_url"] = rec["buy_url"]

    shutil.copy2(FOODS, FOODS.with_suffix(".json.feedbak"))
    FOODS.write_text(json.dumps(foods, ensure_ascii=False), encoding="utf-8")
    print(f"\nwrote {FOODS.name} (backup {FOODS.with_suffix('.json.feedbak').name})")
    print("next: npm run build:index && rebuild the site")


if __name__ == "__main__":
    sys.exit(main())
