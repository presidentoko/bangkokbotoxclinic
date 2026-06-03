from engine.models import Clinic, Review
from engine.resolve import dedupe_clinics


def test_dedupe_merges_same_place_id():
    a = Clinic(place_id="p1", name="Smile Dental", city="bangkok", lat=13.74, lng=100.53)
    a.reviews.append(Review(author="A", rating=5.0, text="x", source="google"))
    b = Clinic(place_id="p1", name="Smile Dental", city="bangkok", lat=13.74, lng=100.53)
    b.reviews.append(Review(author="B", rating=4.0, text="y", source="pantip"))
    b.sources = ["pantip"]
    c = Clinic(place_id="p2", name="Glow", city="bangkok", lat=13.72, lng=100.53)

    out = dedupe_clinics([a, b, c])

    assert len(out) == 2
    merged = {x.place_id: x for x in out}["p1"]
    assert len(merged.reviews) == 2
    assert set(merged.sources) == {"google", "pantip"}


def test_dedupe_keeps_higher_review_count_name():
    a = Clinic(place_id="p1", name="Old Name", city="bangkok", lat=1, lng=1, total_reviews=10)
    b = Clinic(place_id="p1", name="Better Name", city="bangkok", lat=1, lng=1, total_reviews=99)
    out = dedupe_clinics([a, b])
    assert len(out) == 1
    assert out[0].name == "Better Name"
    assert out[0].total_reviews == 99
