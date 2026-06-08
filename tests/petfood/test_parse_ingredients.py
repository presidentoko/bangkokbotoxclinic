import pytest
from petfood.parse_ingredients import parse_ingredients, calc_dry_matter, meets_aafco, score_food


def test_parse_basic():
    result = parse_ingredients("Salmon, Brown Rice, BHA")
    assert len(result) == 3
    assert result[0] == {"name": "Salmon", "grade": "green", "position": 1}
    assert result[1] == {"name": "Brown Rice", "grade": "yellow", "position": 2}
    assert result[2] == {"name": "BHA", "grade": "black", "position": 3}


def test_parse_empty():
    assert parse_ingredients("") == []


def test_parse_strips_trailing_dot():
    result = parse_ingredients("Salmon.")
    assert result[0]["name"] == "Salmon"


def test_parse_position_order():
    result = parse_ingredients("Beef, Corn, Chicken")
    positions = [r["position"] for r in result]
    assert positions == [1, 2, 3]


def test_dry_matter_calc():
    # 26% protein, 10% moisture → DM = 26 / (1 - 0.10) = 28.9%
    assert calc_dry_matter(26.0, 10.0) == 28.9


def test_dry_matter_zero_moisture():
    assert calc_dry_matter(30.0, 0.0) == 30.0


def test_aafco_adult_pass():
    assert meets_aafco(18.0, 5.5, "adult") is True


def test_aafco_adult_fail_protein():
    assert meets_aafco(17.9, 5.5, "adult") is False


def test_aafco_puppy_pass():
    assert meets_aafco(22.0, 8.0, "puppy") is True


def test_aafco_puppy_fail():
    assert meets_aafco(18.0, 5.5, "puppy") is False


def test_score_food():
    ingredients = [
        {"name": "Salmon", "grade": "green", "position": 1},
        {"name": "Rice", "grade": "yellow", "position": 2},
        {"name": "BHA", "grade": "black", "position": 3},
    ]
    counts = score_food(ingredients)
    assert counts == {"green_count": 1, "yellow_count": 1, "red_count": 0, "black_count": 1}
