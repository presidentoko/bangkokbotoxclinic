"""Transparent scoring: ingredient / review / value -> total. Pure functions."""
from __future__ import annotations
import math

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


def review_score_multi(sources: list[tuple[float, int]], prior_mean: float = 4.2,
                       best: float = 5.0) -> float:
    """Bayesian score over several retailers, pooled by review count.

    `sources` is [(rating, count), ...]. Pooling before shrinking — rather than
    scoring each retailer and averaging — keeps the confidence weighting honest:
    a product with 4.9 from 3 Konvy reviews and 4.2 from 200 Boots reviews should
    land near 4.2, which averaging per-source would not do. It also means a
    second source can only ever sharpen the estimate, never dilute it, because
    the shared prior is applied once to the combined evidence.
    """
    pooled = [(r, c) for r, c in sources if c > 0 and r > 0]
    if not pooled:
        return 0.0
    total = sum(c for _, c in pooled)
    weighted = sum(r * c for r, c in pooled)
    adj = (BAYES_C * prior_mean + weighted) / (BAYES_C + total)
    return max(0.0, min(100.0, adj / best * 100.0))

# --- review scoring on the corpus's own scale --------------------------------
#
# Konvy ratings are degenerate: 748 of 879 rated products sit at exactly 5.0 and
# the corpus mean is 4.86. Scoring `rating/5*100` therefore produced a near
# constant — measured 92.1-99.9, sigma 0.99 — so the 45% review weight moved a
# product's total by at most 3.5 points while ingredient_score moved it by 45.
# The site advertises "45% real reviews"; in practice reviews decided nothing.
#
# Fix, in three parts:
#   1. rescale the rating against the band the corpus actually occupies (p5-p95)
#      so 4.9 and 5.0 stop being the same number;
#   2. keep Bayesian shrinkage, but toward the middle of that new scale, so a
#      product with one review regresses to mid-pack instead of to 97;
#   3. add a log-volume term, because with ratings this compressed the count is
#      the more informative signal — 2,129 reviews at 4.9 is stronger evidence
#      than 1 review at 5.0, and step 2 alone separated them by only 6 points.
#
# Modelled before adoption: sigma 0.99 -> 9.2, and the ordering becomes
#   4.9/2129 -> 84.4   5.0/1 -> 57.4   4.2/200 -> 24.0
REVIEW_QUALITY_WEIGHT = 0.75    # remainder goes to the volume term
REVIEW_BAND_LO_PCT = 0.05
REVIEW_BAND_HI_PCT = 0.95


def rating_band(pooled_ratings: list[float]) -> tuple[float, float]:
    """(p5, p95) of the corpus's per-product pooled ratings."""
    if not pooled_ratings:
        return (0.0, 5.0)
    s = sorted(pooled_ratings)
    lo = s[min(len(s) - 1, int(len(s) * REVIEW_BAND_LO_PCT))]
    hi = s[min(len(s) - 1, int(len(s) * REVIEW_BAND_HI_PCT))]
    return (lo, hi) if hi > lo else (s[0], s[-1] if s[-1] > s[0] else s[0] + 1e-9)


def _rescale(rating: float, band: tuple[float, float]) -> float:
    lo, hi = band
    if hi <= lo:
        return 50.0
    return max(0.0, min(100.0, (rating - lo) / (hi - lo) * 100.0))


def review_score_scaled(sources: list[tuple[float, int]], band: tuple[float, float],
                        prior_mean: float, max_count: int) -> float:
    """0-100 from every retailer reporting an aggregate rating.

    `sources` is [(rating, count), ...]; counts are pooled before shrinking so a
    second retailer sharpens the estimate rather than being averaged against it.
    """
    pooled = [(r, c) for r, c in sources if c > 0 and r > 0]
    if not pooled:
        return 0.0
    total = sum(c for _, c in pooled)
    rating = sum(r * c for r, c in pooled) / total

    base = _rescale(rating, band)
    mid = _rescale(prior_mean, band)
    quality = (BAYES_C * mid + total * base) / (BAYES_C + total)

    ceiling = math.log10(1 + max(max_count, 1))
    volume = min(1.0, math.log10(1 + total) / ceiling) * 100.0 if ceiling > 0 else 0.0

    score = REVIEW_QUALITY_WEIGHT * quality + (1 - REVIEW_QUALITY_WEIGHT) * volume
    return max(0.0, min(100.0, score))


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
