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

def test_review_score_bayesian_shrinks_low_count():
    # same 5.0 rating, but 2 reviews should score below 500 reviews (shrinks toward prior)
    hi = scoring.review_score(5.0, 500, prior_mean=4.2)
    lo = scoring.review_score(5.0, 2,   prior_mean=4.2)
    assert 0 <= lo < hi <= 100
    assert scoring.review_score(0, 0, prior_mean=4.2) == 0.0  # no rating -> 0

def test_value_score_cheaper_scores_higher():
    cheap = scoring.value_score(price_per_ml=10.0, median_per_ml=30.0)
    pricey = scoring.value_score(price_per_ml=60.0, median_per_ml=30.0)
    assert 0 <= pricey < cheap <= 100

def test_total_score_weighted_blend():
    t = scoring.total_score(ingredient=80, review=60, value=40)
    assert abs(t - (0.45*80 + 0.45*60 + 0.10*40)) < 1e-9

def test_rank_products_orders_desc_with_tiebreak():
    prods = [
        {"product_id":"a","total_score":{"acne":70.0},"sold_count":10},
        {"product_id":"b","total_score":{"acne":70.0},"sold_count":99},  # tie -> sold breaks
        {"product_id":"c","total_score":{"acne":85.0},"sold_count":1},
    ]
    ranked = scoring.rank_products(prods, "acne")
    assert [p["product_id"] for p in ranked] == ["c","b","a"]
