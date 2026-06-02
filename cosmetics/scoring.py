"""Transparent scoring: ingredient / review / value -> total. Pure functions."""
from __future__ import annotations

WEIGHTS = {"ingredient": 0.45, "review": 0.45, "value": 0.10}
CONCERNS = ("acne", "whitening")

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
