import json
from pathlib import Path

from engine.project import project, slugify


def test_slugify_basic():
    assert slugify("Smile Dental Clinic") == "smile-dental-clinic"


def test_slugify_special_chars():
    assert slugify("Dr. Smith's Clinic (Bangkok)") == "dr-smiths-clinic-bangkok"


def test_slugify_thai_strips_to_empty():
    assert slugify("คลินิก ทันตกรรม") == ""


def test_project_filters_to_dental_only(tmp_path):
    canonical = [
        {"place_id": "p1", "name": "Smile Dental", "city": "bangkok",
         "lat": 13.7, "lng": 100.5, "address": "123 St", "phone": "",
         "website": "", "rating": 4.8, "total_reviews": 100,
         "primary_type": "dentist", "procedures": ["dental"],
         "reviews": [], "sources": ["google"]},
        {"place_id": "p2", "name": "Glow Botox", "city": "bangkok",
         "lat": 13.7, "lng": 100.5, "address": "456 Rd", "phone": "",
         "website": "", "rating": 4.5, "total_reviews": 50,
         "primary_type": "beauty", "procedures": ["botox"],
         "reviews": [], "sources": ["google"]},
    ]
    canonical_path = tmp_path / "canonical.json"
    canonical_path.write_text(json.dumps(canonical), encoding="utf-8")
    out_path = tmp_path / "dental.json"

    count = project("dental", canonical_path, out_path)

    assert count == 1
    data = json.loads(out_path.read_text(encoding="utf-8"))
    assert data[0]["place_id"] == "p1"
    assert data[0]["slug"] == "smile-dental-bangkok"


def test_project_slug_collision_resolved(tmp_path):
    canonical = [
        {"place_id": "p1", "name": "Bangkok Dental", "city": "bangkok",
         "lat": 13.7, "lng": 100.5, "address": "", "phone": "", "website": "",
         "rating": 4.8, "total_reviews": 100, "primary_type": "dentist",
         "procedures": ["dental"], "reviews": [], "sources": ["google"]},
        {"place_id": "p2", "name": "Bangkok Dental", "city": "bangkok",
         "lat": 13.8, "lng": 100.6, "address": "", "phone": "", "website": "",
         "rating": 4.5, "total_reviews": 50, "primary_type": "dentist",
         "procedures": ["dental"], "reviews": [], "sources": ["google"]},
    ]
    canonical_path = tmp_path / "canonical.json"
    canonical_path.write_text(json.dumps(canonical), encoding="utf-8")
    out_path = tmp_path / "dental.json"

    project("dental", canonical_path, out_path)
    data = json.loads(out_path.read_text(encoding="utf-8"))
    slugs = [c["slug"] for c in data]
    assert len(slugs) == len(set(slugs)), "Slugs must be unique"
