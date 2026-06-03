"""Answer-first th/en summaries via Claude, cached by a hash of the salient inputs."""
from __future__ import annotations
import hashlib, json, os

def _key(prod: dict) -> str:
    salient = {"name": prod.get("name"), "brand": prod.get("brand"),
               "actives": [a["inci"] for a in prod.get("ingredient_analysis", [])],
               "score": prod.get("total_score"), "rev": prod.get("review_summary", {}).get("count")}
    return hashlib.sha1(json.dumps(salient, sort_keys=True, ensure_ascii=False).encode()).hexdigest()

def _prompt(prod: dict, lang: str) -> str:
    actives = ", ".join(a["inci"] for a in prod.get("ingredient_analysis", [])) or "—"
    L = "Thai" if lang == "th" else "English"
    return (f"Write ONE answer-first {L} sentence (max 35 words) for a skincare directory: "
            f"product '{prod.get('name')}' by {prod.get('brand')}; key actives: {actives}; "
            f"reviews: {prod.get('review_summary',{}).get('count',0)}. "
            f"State the verdict first. No marketing fluff, no emojis.")

class AnthropicClient:
    def __init__(self, model: str | None = None):
        from anthropic import Anthropic
        self._c = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
        self.model = model or "claude-haiku-4-5-20251001"
    def summarize(self, prompt: str, lang: str) -> str:
        r = self._c.messages.create(model=self.model, max_tokens=120,
                                    messages=[{"role":"user","content":prompt}])
        return r.content[0].text.strip()

def product_summary(prod: dict, client, cache: dict) -> dict:
    h = _key(prod)
    hit = cache.get(h)
    if hit:
        return hit
    out = {lang: client.summarize(_prompt(prod, lang), lang) for lang in ("th","en")}
    cache[h] = out
    return out

def main() -> int:
    from cosmetics.build_master_db import MASTER_DB
    from cosmetics import config
    # Cache lives in a SEPARATE file so a master_db rebuild (e.g. merging more Pantip
    # data) never wipes it — subsequent gen runs are then ~free (cache hits only).
    cache_path = config.STATE_DIR / "summary_cache.json"
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    try:
        cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path.exists() else {}
    except Exception:
        cache = {}
    client = AnthropicClient()
    new = 0
    for prod in db["products"].values():
        before = len(cache)
        prod["llm_summary"] = product_summary(prod, client, cache)
        new += int(len(cache) > before)
        if new and new % 25 == 0 and len(cache) != before:
            cache_path.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")  # checkpoint
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    db.pop("_summary_cache", None)  # keep master_db lean
    MASTER_DB.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"summaries: {len(db['products'])} products, {new} new API generations")
    return 0

if __name__ == "__main__":
    import sys; sys.exit(main())
