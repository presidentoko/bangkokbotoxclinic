"""Curated ingredient dictionary: load, normalize INCI, match product ingredients."""
from __future__ import annotations
import json, functools
from pathlib import Path

DB_PATH = Path(__file__).parent / "web" / "data" / "ingredient_db.json"

@functools.lru_cache(maxsize=1)
def load_db(path: str | None = None) -> dict:
    p = Path(path) if path else DB_PATH
    return json.loads(p.read_text(encoding="utf-8"))

def normalize(name: str) -> str:
    return " ".join((name or "").strip().lower().split())

@functools.lru_cache(maxsize=1)
def _alias_index() -> dict:
    """normalized name/alias -> canonical INCI key."""
    idx = {}
    for inci, e in load_db().items():
        idx[normalize(inci)] = inci
        idx[normalize(e.get("en_name", ""))] = inci
        for a in e.get("aliases", []):
            idx[normalize(a)] = inci
    idx.pop("", None)
    return idx

def match(product_ingredients: list[str], db: dict) -> list[dict]:
    """Return dict entries for product ingredients found in the DB, order-preserving, deduped."""
    idx = _alias_index()
    out, seen = [], set()
    for raw in product_ingredients:
        inci = idx.get(normalize(raw))
        if inci and inci not in seen:
            seen.add(inci)
            e = db[inci]
            out.append({"inci": inci, "role": e["role"],
                        "concern_efficacy": e["concern_efficacy"],
                        "safety_flags": e["safety_flags"]})
    return out
