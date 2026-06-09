from __future__ import annotations
from petfood.ingredient_grades import grade_ingredient


def parse_ingredients(raw: str) -> list[dict]:
    """Split comma-separated ingredient text and grade each item."""
    if not raw or not raw.strip():
        return []
    parts = [p.strip().rstrip(".") for p in raw.split(",") if p.strip()]
    return [
        {"name": p, "grade": grade_ingredient(p), "position": i + 1}
        for i, p in enumerate(parts)
    ]


def calc_dry_matter(pct: float, moisture_pct: float) -> float:
    """Convert as-fed % to dry matter basis %."""
    dm_factor = 1.0 - (moisture_pct / 100.0)
    if dm_factor <= 0:
        return 0.0
    return round(pct / dm_factor, 1)


def meets_aafco(protein_dm: float, fat_dm: float, life_stage: str) -> bool:
    """Check AAFCO minimums."""
    if life_stage in ("puppy", "kitten"):
        return protein_dm >= 22.0 and fat_dm >= 8.0
    return protein_dm >= 18.0 and fat_dm >= 5.5


def score_food(ingredients: list[dict]) -> dict:
    """Return count dict for each grade."""
    counts = {"green_count": 0, "yellow_count": 0, "red_count": 0, "black_count": 0}
    for ing in ingredients:
        key = f"{ing['grade']}_count"
        counts[key] += 1
    return counts
