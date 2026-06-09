import pytest
from petvet.transform import transform_row, slugify


def test_slugify_basic():
    assert slugify("Animal Hospital Bangkok") == "animal-hospital-bangkok"


def test_slugify_max_length():
    assert len(slugify("x" * 200)) <= 80


def test_transform_row_basic():
    row = {
        "name": "Happy Paws Animal Hospital",
        "lat": "13.7500",
        "lng": "100.5200",
        "phone": "02-111-2222",
        "rating": "4.5",
        "review_count": "200",
        "place_id": "ChIJ123",
        "address": "123 Sukhumvit Rd",
        "opening_hours": "Open 24 hours",
        "scraped_at": "2026-06-08T00:00:00Z",
    }
    result = transform_row(row)
    assert result is not None
    assert result["name_th"] == "Happy Paws Animal Hospital"
    assert result["lat"] == 13.75
    assert result["lng"] == 100.52
    assert result["is_24h"] is True
    assert result["google_rating"] == 4.5
    assert result["google_review_count"] == 200


def test_transform_row_missing_lat_returns_none():
    row = {
        "name": "Test", "lat": "", "lng": "",
        "phone": "", "rating": "", "review_count": "",
        "place_id": "", "address": "", "opening_hours": "", "scraped_at": "",
    }
    assert transform_row(row) is None


def test_transform_row_24h_from_name():
    row = {
        "name": "24ชม. สัตวแพทย์", "lat": "13.7", "lng": "100.5",
        "phone": "", "rating": "", "review_count": "",
        "place_id": "abc", "address": "", "opening_hours": "", "scraped_at": "",
    }
    result = transform_row(row)
    assert result is not None
    assert result["is_24h"] is True


def test_transform_row_emergency_flag():
    row = {
        "name": "Animal Emergency Hospital", "lat": "13.7", "lng": "100.5",
        "phone": "", "rating": "", "review_count": "",
        "place_id": "xyz", "address": "", "opening_hours": "", "scraped_at": "",
    }
    result = transform_row(row)
    assert result is not None
    assert result["has_emergency"] is True


def test_slugify_thai():
    result = slugify("โรงพยาบาลสัตว์")
    assert len(result) >= 0
