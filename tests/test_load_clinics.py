from pathlib import Path

from engine.load import load_clinics_csv

FIX = Path(__file__).parent / "fixtures" / "bangkok" / "clinics.csv"


def test_load_clinics_basic():
    clinics = load_clinics_csv(FIX, city="bangkok")
    # the row with empty place_id is skipped
    assert len(clinics) == 2
    by_id = {c.place_id: c for c in clinics}
    assert by_id["p1"].name == "Smile Dental Clinic"
    assert by_id["p1"].city == "bangkok"
    assert by_id["p1"].lat == 13.74
    assert by_id["p1"].rating == 4.8
    assert by_id["p1"].total_reviews == 210
    assert by_id["p2"].primary_type == "beauty"
