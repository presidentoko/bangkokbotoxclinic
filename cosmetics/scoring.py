"""Transparent scoring: ingredient / review / value -> total. Pure functions."""
from __future__ import annotations

WEIGHTS = {"ingredient": 0.45, "review": 0.45, "value": 0.10}
CONCERNS = ("acne", "whitening", "antiaging", "pores", "oilcontrol", "sensitive")

# ingredient_score tuning
_EFFICACY_CAP = 6          # sum of efficacy beyond this saturates to full marks
_FLAG_PENALTY = 6          # points subtracted per distinct caution flag
_BASE = 10                 # floor so a no-active product isn't 0

def ingredient_score(analysis: list[dict], concern: str) -> float:
    """0-100 from relevant actives (efficacy-weighted, saturating) minus caution penalties."""
    eff_sum = sum(a["concern_efficacy"].get(concern, 0) for a in analysis)
    reward = min(eff_sum, _EFFICACY_CAP) / _EFFICACY_CAP * (100 - _BASE)  # 0..90
    flags = set()
    for a in analysis:
        flags.update(a.get("safety_flags", []))
    penalty = _FLAG_PENALTY * len(flags)
    return max(0.0, min(100.0, _BASE + reward - penalty))

BAYES_C = 30  # confidence constant: reviews needed to outweigh the prior

def review_score(rating: float, count: int, prior_mean: float = 4.2,
                 best: float = 5.0) -> float:
    """Bayesian-adjusted 0-100. Few reviews shrink toward prior_mean; 0 count -> 0."""
    if not count or rating <= 0:
        return 0.0
    adj = (BAYES_C * prior_mean + count * rating) / (BAYES_C + count)
    return max(0.0, min(100.0, adj / best * 100.0))

def value_score(price_per_ml: float, median_per_ml: float) -> float:
    """0-100; at/above 2x median -> 0, at/below ~0 -> 100, median -> 50."""
    if not price_per_ml or not median_per_ml or price_per_ml <= 0:
        return 50.0
    ratio = price_per_ml / median_per_ml          # 1.0 == median
    return max(0.0, min(100.0, (2.0 - ratio) * 50.0))

def total_score(ingredient: float, review: float, value: float) -> float:
    return (WEIGHTS["ingredient"] * ingredient
            + WEIGHTS["review"] * review
            + WEIGHTS["value"] * value)

def rank_products(products: list[dict], concern: str) -> list[dict]:
    """Sort by total_score[concern] desc, sold_count desc tiebreak."""
    return sorted(products,
                  key=lambda p: (p.get("total_score", {}).get(concern, 0.0),
                                 p.get("sold_count", 0)),
                  reverse=True)
