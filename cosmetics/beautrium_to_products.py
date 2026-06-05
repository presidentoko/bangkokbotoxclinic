"""Convert beautrium_products.json to per-product JSON files compatible with build_master_db.

Reads:  <main>/cosmetics/output/beautrium/beautrium_products.json
Writes: <worktree>/cosmetics/output/products/bt_XXXXX.json

Usage:
    python -m cosmetics.beautrium_to_products [--dry-run]
"""
from __future__ import annotations
import argparse, json, logging, re, time
from pathlib import Path

from cosmetics import config

log = logging.getLogger("cosmetics.beautrium_to_products")

# Beautrium data lives in the main repo, not the worktree
_MAIN = Path(__file__).resolve().parent.parent.parent.parent.parent  # deliverable root
_BT_FILE = _MAIN / "cosmetics" / "output" / "beautrium" / "beautrium_products.json"

# Target categories: Skincare + Derma only
SKINCARE_CATS = {12, 17}

# Keyword → concern_seeds mapping (applied to name.lower())
_CONCERN_KEYWORDS: list[tuple[list[str], str]] = [
    (["acne", "blemish", "pimple", "spot", "clear acne", "anti-acne", "blackhead", "whitehead",
      "salicyl", "benzoyl", "sulfur", "สิว", "สิวอุดตัน"], "acne"),
    (["whiten", "bright", "glow", "radianc", "vitamin c", "niacinamide", "dark spot", "pigment",
      "melasma", "ฝ้า", "กระ", "จุดด่างดำ", "ขาว"], "whitening"),
    (["anti-age", "antiage", "anti age", "wrinkle", "retinol", "retinyl", "peptide", "collagen",
      "firm", "lift", "youth", "renew", "ริ้วรอย", "กระชับ"], "antiaging"),
    (["pore", "pores", "blackhead", "sebum", "mattif", "รูขุมขน"], "pores"),
    (["oil control", "oil free", "mattif", "sebum control", "ควบคุมมัน"], "oilcontrol"),
    (["sensitive", "calm", "sooth", "gentle", "redness", "irritat", "centella", "cica",
      "barrier", "ceramide", "แพ้ง่าย", "บอบบาง", "ระคายเคือง"], "sensitive"),
]


def _concern_seeds(name: str, cat1_id: int) -> str:
    """Return pipe-joined concern seeds based on name keywords and category."""
    n = name.lower()
    found: list[str] = []
    for keywords, concern in _CONCERN_KEYWORDS:
        if any(kw in n for kw in keywords):
            if concern not in found:
                found.append(concern)
    if not found:
        # Category-level fallback
        if cat1_id == 17:   # Derma
            found = ["acne", "sensitive"]
        else:               # Skincare
            found = ["sensitive", "whitening"]
    return "|".join(found)


def _normalize_brand(brand: str) -> str:
    """Standard-case brand name for consistency."""
    # Title-case single-word, preserve multi-word as-is if already mixed
    b = brand.strip()
    if b == b.upper() and len(b) > 2:
        return b.title()  # "LA ROCHE-POSAY" → "La Roche-Posay"
    return b


def convert(bt_products: list[dict]) -> list[dict]:
    """Filter and convert Beautrium products to the standard product format."""
    results = []
    for p in bt_products:
        if p.get("cat1_id") not in SKINCARE_CATS:
            continue
        if not p.get("available") or p.get("sold_out"):
            continue
        if not p.get("name"):
            continue

        name = (p["name"] or "").strip()
        brand = _normalize_brand(p.get("brand") or p.get("brand_th") or "")
        price = float(p.get("price_thb") or 0)
        if price <= 0:
            continue  # skip free/unknown price products

        concern = _concern_seeds(name, p["cat1_id"])

        product = {
            "product_id": p["product_id"],          # "bt_XXXXX"
            "source": "beautrium",
            "url": p.get("url") or "",
            "name": name,
            "brand": brand,
            "price_thb": price,
            "list_price_thb": float(p.get("list_price_thb") or price),
            "discount_pct": int(p.get("discount_pct") or 0),
            "volume": "",                            # not available from listing API
            "image_url": p.get("image_url") or "",
            "images": [],
            "sku": str(p.get("mat_no") or ""),
            "gtin8": "",
            "description": "",
            "ingredients": "",                       # not available from Beautrium API
            "ingredient_count": 0,
            "concern_seeds": concern,
            # Rating data stored in beautrium_* fields AND konvy_* fields for scoring compat
            "beautrium_rating": float(p.get("rating") or 0),
            "beautrium_review_count": int(p.get("review_count") or 0),
            "konvy_rating": float(p.get("rating") or 0),
            "konvy_review_count": int(p.get("review_count") or 0),
            "sold_count": 0,
            "reviews_scraped": False,
            "fetched_at": p.get("scraped_at") or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        results.append(product)
    return results


def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="Print stats without writing")
    ap.add_argument("--bt-file", default=str(_BT_FILE), help="Path to beautrium_products.json")
    args = ap.parse_args()

    bt_file = Path(args.bt_file)
    if not bt_file.exists():
        log.error("Not found: %s", bt_file)
        return 1

    log.info("Loading %s", bt_file)
    with open(bt_file, encoding="utf-8-sig") as f:
        bt_products = json.load(f)
    log.info("Loaded %d Beautrium products", len(bt_products))

    converted = convert(bt_products)
    log.info("Converted %d skincare/derma products", len(converted))

    if args.dry_run:
        from collections import Counter
        concerns = Counter()
        for p in converted:
            for c in p["concern_seeds"].split("|"):
                concerns[c] += 1
        print(f"\nDry run: {len(converted)} products would be written")
        print("Concern distribution:", dict(concerns))
        print("Sample:", json.dumps(converted[0], ensure_ascii=False, indent=2))
        return 0

    out_dir = config.OUTPUT_DIR / "products"
    out_dir.mkdir(parents=True, exist_ok=True)

    written = 0
    skipped = 0
    for p in converted:
        out_file = out_dir / f"{p['product_id']}.json"
        if out_file.exists():
            # Don't overwrite Konvy products — only write if it's a bt_ file
            if not p["product_id"].startswith("bt_"):
                skipped += 1
                continue
        out_file.write_text(json.dumps(p, ensure_ascii=False, indent=2), encoding="utf-8")
        written += 1

    log.info("Written: %d  Skipped: %d", written, skipped)
    print(f"\nDone. {written} Beautrium products added to {out_dir}")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
