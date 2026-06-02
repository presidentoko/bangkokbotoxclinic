from cosmetics import build_master_db as b

PRODUCTS = [
    {"product_id":"1","name":"Acne Serum","brand":"X","price_thb":300,"volume":"30ml",
     "ingredients":["Salicylic Acid","Glycerin"],"konvy_rating":4.6,"konvy_review_count":200,"sold_count":50,"concern_seeds":["acne"]},
    {"product_id":"2","name":"Bright Serum","brand":"Y","price_thb":900,"volume":"30ml",
     "ingredients":["Ascorbic Acid","Niacinamide"],"konvy_rating":4.8,"konvy_review_count":400,"sold_count":80,"concern_seeds":["whitening"]},
]
REVIEWS = {"1":[{"rating":5,"body":"สิวยุบ","helpful_count":2}], "2":[]}

def test_build_db_scores_and_ranks():
    db = b.build_db(PRODUCTS, REVIEWS)
    assert set(db["rankings"]) == {"acne","whitening"}
    p1 = db["products"]["1"]
    assert "ingredient_score" in p1 and "acne" in p1["ingredient_score"]
    assert 0 <= p1["total_score"]["acne"] <= 100
    assert p1["review_summary"]["count"] == 1
    # product 2 (vit C + niacinamide) should top whitening ranking
    assert db["rankings"]["whitening"][0]["product_id"] == "2"

def test_build_db_volume_parsed_for_value():
    db = b.build_db(PRODUCTS, REVIEWS)
    # value uses price per ml; both 30ml so cheaper (300) beats pricier on value
    assert db["products"]["1"]["value_score"] >= db["products"]["2"]["value_score"]
