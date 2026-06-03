from pathlib import Path

from engine.load import load_reviews

REVIEWS_DIR = Path(__file__).parent / "fixtures" / "bangkok" / "reviews"


def test_load_reviews_for_place():
    reviews = load_reviews(REVIEWS_DIR, place_id="p1")
    assert len(reviews) == 2
    assert reviews[0].author == "Alice"
    assert reviews[0].rating == 5.0
    assert reviews[0].text == "Great implants and friendly staff"
    assert reviews[0].source == "google"
    assert reviews[0].spent_amount == "฿30,000"


def test_load_reviews_missing_file_returns_empty():
    assert load_reviews(REVIEWS_DIR, place_id="does_not_exist") == []
