from engine.models import Clinic, Review


def test_clinic_to_dict_roundtrip():
    c = Clinic(
        place_id="abc",
        name="Smile Dental",
        city="bangkok",
        lat=13.74,
        lng=100.53,
    )
    c.reviews.append(Review(author="A", rating=5.0, text="great", source="google"))
    d = c.to_dict()
    assert d["place_id"] == "abc"
    assert d["name"] == "Smile Dental"
    assert d["reviews"][0]["text"] == "great"
    assert d["sources"] == ["google"]
    assert d["procedures"] == []
