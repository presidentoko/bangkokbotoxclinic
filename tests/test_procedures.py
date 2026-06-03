from engine.models import Clinic, Review
from engine.procedures import tag_procedures


def _clinic(name="", primary_type="", review_text=""):
    c = Clinic(place_id="p", name=name, city="bangkok", lat=1, lng=1, primary_type=primary_type)
    if review_text:
        c.reviews.append(Review(author="a", rating=5.0, text=review_text, source="google"))
    return c


def test_tags_dental_from_name():
    assert tag_procedures(_clinic(name="Smile Dental Implant Clinic")) == ["dental"]


def test_tags_botox_from_review_text():
    tags = tag_procedures(_clinic(name="Glow Center", review_text="got botox and filler here"))
    assert tags == ["botox"]


def test_tags_multi_specialty():
    c = _clinic(name="Bangkok Dental & Aesthetic", review_text="veneers and botox")
    assert set(tag_procedures(c)) == {"dental", "botox"}


def test_tags_thai_keywords():
    assert tag_procedures(_clinic(name="คลินิก ทันตกรรม")) == ["dental"]


def test_no_match_returns_empty():
    assert tag_procedures(_clinic(name="Generic Spa")) == []
