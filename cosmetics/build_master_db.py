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

def build_db(products: list[dict], reviews_by_id: dict) -> dict:
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
        rec = dict(p)
        rec.pop("_ppml", None)
        rec.update({"ingredient_analysis": analysis, "ingredient_score": ing,
                    "review_score": rev, "value_score": val,
                    "total_score": tot, "review_summary": rsum})
        out_products[p["product_id"]] = rec

    rankings = {}
    for c in scoring.CONCERNS:
        pool = [pp for pp in out_products.values() if c in pp.get("concern_seeds", [])] or list(out_products.values())
        ranked = scoring.rank_products(pool, c)
        rankings[c] = [{"product_id": pp["product_id"], "total_score": pp["total_score"][c]} for pp in ranked]
    return {"generated_at": None, "products": out_products, "rankings": rankings}

def _load_reviews() -> dict:
    out = {}
    rdir = config.REVIEWS_DIR
    if rdir.exists():
        for f in rdir.glob("*_konvy.json"):
            pid = f.name.split("_")[0]
            try:
                out[pid] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                out[pid] = []
    return out

def main() -> int:
    products = [json.loads(f.read_text(encoding="utf-8"))
                for f in sorted((config.OUTPUT_DIR / "products").glob("*.json"))]
    db = build_db(products, _load_reviews())
    db["generated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    MASTER_DB.parent.mkdir(parents=True, exist_ok=True)
    MASTER_DB.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"master_db: {len(db['products'])} products -> {MASTER_DB}")
    return 0

if __name__ == "__main__":
    import sys; sys.exit(main())
