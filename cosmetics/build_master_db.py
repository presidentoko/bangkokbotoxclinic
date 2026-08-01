"""Orchestrate: products + ingredient_db + review corpora -> scored, ranked master_db.json."""
from __future__ import annotations
import json, re, statistics, time
from pathlib import Path

from cosmetics import config, ingredients, scoring, review_aggregate

MASTER_DB = config.OUTPUT_DIR.parent / "web" / "data" / "master_db.json"
_VOL = re.compile(r"(\d+(?:\.\d+)?)\s*ml", re.I)

def _ml(volume: str) -> float:
    m = _VOL.search(volume or "")
    return float(m.group(1)) if m else 0.0

def build_db(products: list[dict], reviews_by_id: dict,
             youtube_by_id: dict | None = None,
             watsons_by_id: dict | None = None) -> dict:
    db = ingredients.load_db()
    # prior mean rating across products that have ratings
    rated = [p["konvy_rating"] for p in products if p.get("konvy_rating")]
    prior = statistics.mean(rated) if rated else 4.2
    # global median price/ml for value_score (concern-independent scalar; MVP simplification)
    for p in products:
        ml = _ml(p.get("volume", ""))
        p["_ppml"] = (p["price_thb"] / ml) if (ml and p.get("price_thb")) else 0.0
    _all_ppml = [p["_ppml"] for p in products if p["_ppml"]]
    med_ppml = statistics.median(_all_ppml) if _all_ppml else 0.0

    # Ingredient score above this threshold auto-promotes a product into the concern's
    # seed pool even if not explicitly tagged by the scraper. Keeps the ranking pool
    # honest: products with no meaningful actives for a concern stay out.
    AUTO_SEED_THRESHOLD = 30

    out_products = {}
    for p in products:
        ing_list = p.get("ingredients", [])
        if isinstance(ing_list, str):                      # scraper stores "|"-joined string
            ing_list = [x for x in ing_list.split("|") if x]
        analysis = ingredients.match(ing_list, db)
        rsum = review_aggregate.summarize(reviews_by_id.get(p["product_id"], []))
        rev = scoring.review_score(p.get("konvy_rating", 0) or 0,
                                   p.get("konvy_review_count", 0) or 0, prior_mean=prior)
        val = scoring.value_score(p["_ppml"], med_ppml)    # scalar
        ing, tot = {}, {}
        for c in scoring.CONCERNS:
            ing[c] = scoring.ingredient_score(analysis, c)
            tot[c] = scoring.total_score(ing[c], rev, val)
        pantip = _load_pantip(p["product_id"])
        rec = dict(p)
        rec.pop("_ppml", None)
        rec.update({"ingredient_analysis": analysis, "ingredient_score": ing,
                    "review_score": rev, "value_score": val,
                    "total_score": tot, "review_summary": rsum})
        if pantip is not None:
            rec["pantip"] = pantip
        yt = (youtube_by_id or {}).get(p["product_id"])
        if yt and yt.get("video_count", 0) > 0:
            rec["youtube"] = yt
        wt = (watsons_by_id or {}).get(p["product_id"])
        if wt and wt.get("review_count", 0) > 0:
            rec["watsons"] = wt
        out_products[p["product_id"]] = rec

    # Auto-enrich concern_seeds: products with ingredient_score >= AUTO_SEED_THRESHOLD
    # for a concern get that concern added to their seeds. Expands thin pools like
    # antiaging (217→more) and oilcontrol (29→more) without manual re-tagging.
    # Only applies when ingredient_analysis is present (score > BASE implies real actives).
    auto_tagged_counts: dict[str, int] = {c: 0 for c in scoring.CONCERNS}
    for pp in out_products.values():
        seeds = pp.get("concern_seeds", "")
        if isinstance(seeds, list):
            current = set(seeds)
        else:
            current = set(s.strip() for s in seeds.split("|") if s.strip())
        enriched = False
        for c in scoring.CONCERNS:
            if c not in current and pp["ingredient_score"].get(c, 0) >= AUTO_SEED_THRESHOLD:
                current.add(c)
                auto_tagged_counts[c] += 1
                enriched = True
        if enriched:
            pp["concern_seeds"] = list(current)
    for c, n in auto_tagged_counts.items():
        if n:
            print(f"  auto-tagged {n} products → {c}")

    def _in_seeds(pp: dict, concern: str) -> bool:
        cs = pp.get("concern_seeds", "")
        if isinstance(cs, list):
            return concern in cs
        return concern in cs.split("|")

    rankings = {}
    for c in scoring.CONCERNS:
        pool = [pp for pp in out_products.values() if _in_seeds(pp, c)] or list(out_products.values())
        ranked = scoring.rank_products(pool, c)
        rankings[c] = [{"product_id": pp["product_id"], "total_score": pp["total_score"][c]} for pp in ranked]
    return {"generated_at": None, "products": out_products, "rankings": rankings}

def _load_youtube() -> dict:
    out = {}
    if config.REVIEWS_DIR.exists():
        for f in config.REVIEWS_DIR.glob("*_youtube.json"):
            pid = f.name.split("_youtube")[0]
            try:
                out[pid] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                pass
    return out

def _load_watsons() -> dict:
    out = {}
    if config.REVIEWS_DIR.exists():
        for f in config.REVIEWS_DIR.glob("*_watsons.json"):
            pid = f.name.split("_watsons")[0]
            try:
                out[pid] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                pass
    return out

def _load_reviews() -> dict:
    out = {}
    rdir = config.REVIEWS_DIR
    if rdir.exists():
        for f in rdir.glob("*_konvy.json"):
            pid = f.name.split("_")[0]
            try:
                data = json.loads(f.read_text(encoding="utf-8-sig"))
                if isinstance(data, dict):
                    # new format: {source, product_name, review_count, snippets, fetched_at}
                    out[pid] = data.get("snippets") or []
                elif isinstance(data, list):
                    out[pid] = data
                else:
                    out[pid] = []
            except Exception:
                out[pid] = []
    return out


def _load_pantip(product_id: str) -> "dict | None":
    """Load and compact pantip review data for a product, or return None."""
    rdir = config.REVIEWS_DIR
    f = rdir / f"{product_id}_pantip.json"
    if not f.exists():
        return None
    try:
        raw = json.loads(f.read_text(encoding="utf-8"))
    except Exception:
        return None
    snippets = raw.get("snippets", [])[:4]
    compact_snippets = [
        {k: s[k] for k in ("text", "topic_id", "author") if k in s}
        for s in snippets
    ]
    return {
        "mention_count": raw.get("mention_count", 0),
        "thread_count": raw.get("thread_count", 0),
        "snippets": compact_snippets,
    }

def _load_ingredient_patches() -> dict[str, list[str]]:
    patch_file = config.STATE_DIR / "ingredient_patches.json"
    if patch_file.exists():
        try:
            return json.loads(patch_file.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def main() -> int:
    fresh_products = [json.loads(f.read_text(encoding="utf-8"))
                       for f in sorted((config.OUTPUT_DIR / "products").glob("*.json"))]

    # output/products/*.json is local, gitignored scrape-run state — it is NOT
    # guaranteed to still be on disk (a fresh checkout/session has none of it, as
    # happened here: a run that only got through 23 products before hitting the
    # VPN tunnel budget would otherwise silently REPLACE a 1002-product database
    # with a 23-product one). master_db.json itself is git-committed and durable,
    # so treat its existing products as the floor and layer fresh scrape results
    # on top, keyed by product_id (fresh wins on conflict). This also means a
    # rebuild now picks up review data collected into output/reviews/ this
    # session even for products whose own output/products/*.json wasn't re-fetched.
    existing_by_id: dict = {}
    if MASTER_DB.exists():
        try:
            existing_by_id = json.loads(MASTER_DB.read_text(encoding="utf-8")).get("products", {})
        except Exception:
            existing_by_id = {}
    merged_by_id = dict(existing_by_id)
    for p in fresh_products:
        merged_by_id[str(p["product_id"])] = p
    products = list(merged_by_id.values())
    if existing_by_id:
        print(f"merging {len(fresh_products)} freshly scraped product(s) with "
              f"{len(existing_by_id)} already in master_db.json -> {len(products)} total")

    # Apply ingredient backfill patches (products.csv is patched separately; merge here)
    patches = _load_ingredient_patches()
    if patches:
        patched = 0
        for p in products:
            pid = str(p.get("product_id", ""))
            if pid in patches and not p.get("ingredients"):
                ings = patches[pid]
                if ings:  # skip empty-list entries (confirmed no ingredients)
                    p["ingredients"] = "|".join(ings)
                    p["ingredient_count"] = len(ings)
                    patched += 1
        if patched:
            print(f"Applied ingredient patches: {patched} products updated")
    db = build_db(products, _load_reviews(), _load_youtube(), _load_watsons())
    db["generated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    MASTER_DB.parent.mkdir(parents=True, exist_ok=True)
    MASTER_DB.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"master_db: {len(db['products'])} products -> {MASTER_DB}")
    return 0

if __name__ == "__main__":
    import sys; sys.exit(main())
