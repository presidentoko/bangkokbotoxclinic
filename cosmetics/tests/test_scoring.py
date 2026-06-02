from cosmetics import scoring

def test_constants():
    assert scoring.WEIGHTS == {"ingredient": 0.45, "review": 0.45, "value": 0.10}
    assert abs(sum(scoring.WEIGHTS.values()) - 1.0) < 1e-9

def test_ingredient_score_rewards_relevant_actives():
    # one strong acne active (efficacy 3) -> high; irrelevant humectant -> ignored for acne
    analysis = [
        {"inci":"Salicylic Acid","role":"active","concern_efficacy":{"acne":3,"whitening":0},"safety_flags":["irritant"]},
        {"inci":"Glycerin","role":"humectant","concern_efficacy":{"acne":0,"whitening":0},"safety_flags":[]},
    ]
    acne = scoring.ingredient_score(analysis, "acne")
    whit = scoring.ingredient_score(analysis, "whitening")
    assert 0 <= acne <= 100 and 0 <= whit <= 100
    assert acne > whit  # relevant active only helps acne

def test_ingredient_score_penalizes_caution_flags():
    base = [{"inci":"Niacinamide","role":"active","concern_efficacy":{"acne":0,"whitening":3},"safety_flags":[]}]
    flagged = base + [{"inci":"Fragrance","role":"additive","concern_efficacy":{"acne":0,"whitening":0},"safety_flags":["fragrance","irritant"]}]
    assert scoring.ingredient_score(flagged, "whitening") < scoring.ingredient_score(base, "whitening")

def test_ingredient_score_empty_is_low_not_negative():
    s = scoring.ingredient_score([], "acne")
    assert 0 <= s <= 20
