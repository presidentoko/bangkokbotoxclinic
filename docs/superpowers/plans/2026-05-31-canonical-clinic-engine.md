# Canonical Clinic Engine Implementation Plan (Plan 1 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared canonical clinic data engine that loads the existing per-city scraper CSV outputs, dedupes clinics across cities/sources into one record per clinic, tags each clinic by procedure niche (dental / botox / hair), and emits a single `canonical.json` that the botox and dental sites will both consume.

**Architecture:** A small, pure-Python package `engine/` with focused modules (models → load → resolve → procedures → build_canonical). No network, no scraping — it reads CSVs already produced by the fleet and writes JSON. This makes the whole foundation unit-testable with fixture CSVs. Later plans (dental site, botox site, daily pipeline) consume `canonical.json`.

**Tech Stack:** Python 3.12 (existing `.venv`), `pytest` (to be added — not yet installed), stdlib `csv`/`json`/`dataclasses`. Test runner: `.venv\Scripts\python.exe -m pytest`.

**Scope note:** This plan is the foundation only. Price-index extraction, trust scoring, EN↔KR translation, and the build-time duplicate-content gate are downstream (Plan 1b / Plan 2). This plan produces a deduped, procedure-tagged canonical dataset — working, testable software on its own.

**Grounding facts (verified in repo):**
- Clinic CSV header (`utf-8-sig`/BOM): `place_id,name,primary_type,formatted_address,plus_code,latitude,longitude,phone,website,menu_url,rating,total_reviews,price_level,price_symbol,business_status,editorial_summary,maps_url`
- Reviews CSV header (`reviews/<place_id>_reviews.csv`): `review_id,place_id,restaurant_name,rating,text,author_name,author_id,author_uri,author_photo_uri,author_is_local_guide,author_review_count,author_photo_count,relative_date,spent_amount,sort_source`
- Output dir patterns: `<city>/output`, `<city>/clinics_output`, `bangkok_clinics/output`, `dental_output/<city>` — each containing `clinics.csv` and a `reviews/` subdir.

---

### Task 0: Bootstrap pytest and the engine package

**Files:**
- Create: `requirements-dev.txt`
- Create: `engine/__init__.py`
- Create: `tests/__init__.py`
- Create: `tests/test_smoke.py`
- Create: `pytest.ini`

- [ ] **Step 1: Create the dev requirements file**

Create `requirements-dev.txt`:

```
pytest==8.3.4
```

- [ ] **Step 2: Install pytest into the existing venv**

Run: `.venv\Scripts\python.exe -m pip install -r requirements-dev.txt`
Expected: `Successfully installed pytest-8.3.4` (plus its deps).

- [ ] **Step 3: Create empty package markers**

Create `engine/__init__.py` (empty file).
Create `tests/__init__.py` (empty file).

- [ ] **Step 4: Create pytest config**

Create `pytest.ini`:

```ini
[pytest]
testpaths = tests
python_files = test_*.py
addopts = -q
```

- [ ] **Step 5: Write a smoke test**

Create `tests/test_smoke.py`:

```python
def test_smoke():
    assert True
```

- [ ] **Step 6: Run the smoke test**

Run: `.venv\Scripts\python.exe -m pytest tests/test_smoke.py -v`
Expected: PASS (1 passed).

- [ ] **Step 7: Commit**

```bash
git add requirements-dev.txt pytest.ini engine/__init__.py tests/__init__.py tests/test_smoke.py
git commit -m "chore: bootstrap pytest and engine package"
```

---

### Task 1: Clinic and Review data models

**Files:**
- Create: `engine/models.py`
- Test: `tests/test_models.py`

- [ ] **Step 1: Write the failing test**

Create `tests/test_models.py`:

```python
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.venv\Scripts\python.exe -m pytest tests/test_models.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'engine.models'`.

- [ ] **Step 3: Write minimal implementation**

Create `engine/models.py`:

```python
from __future__ import annotations

from dataclasses import dataclass, field, asdict


@dataclass
class Review:
    author: str
    rating: float
    text: str
    source: str           # "google" | "pantip" | "reddit" | "naver" | "youtube"
    lang: str = "en"
    spent_amount: str = ""  # raw price signal from the review row, e.g. "฿30,000"


@dataclass
class Clinic:
    place_id: str
    name: str
    city: str
    lat: float
    lng: float
    address: str = ""
    phone: str = ""
    website: str = ""
    rating: float = 0.0
    total_reviews: int = 0
    primary_type: str = ""
    procedures: list[str] = field(default_factory=list)
    reviews: list[Review] = field(default_factory=list)
    sources: list[str] = field(default_factory=lambda: ["google"])

    def to_dict(self) -> dict:
        return asdict(self)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.venv\Scripts\python.exe -m pytest tests/test_models.py -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add engine/models.py tests/test_models.py
git commit -m "feat(engine): add Clinic and Review data models"
```

---

### Task 2: Load clinics from a clinics.csv

**Files:**
- Create: `engine/load.py`
- Create: `tests/fixtures/bangkok/clinics.csv`
- Test: `tests/test_load_clinics.py`

- [ ] **Step 1: Create the fixture CSV**

Create `tests/fixtures/bangkok/clinics.csv` (note the UTF-8 BOM is handled by the loader via `utf-8-sig`; write this file as plain UTF-8):

```csv
place_id,name,primary_type,formatted_address,plus_code,latitude,longitude,phone,website,menu_url,rating,total_reviews,price_level,price_symbol,business_status,editorial_summary,maps_url
p1,Smile Dental Clinic,dentist,"123 Sukhumvit, Bangkok",,13.7400,100.5300,+6620000000,https://smile.example,,4.8,210,,,OPERATIONAL,Top dental clinic,https://maps.google/p1
p2,Glow Aesthetic Center,beauty,"45 Silom, Bangkok",,13.7250,100.5340,+6620000001,https://glow.example,,4.6,98,,,OPERATIONAL,Botox and filler,https://maps.google/p2
,No ID Row,dentist,"nowhere",,0,0,,,,,0,,,,,
```

- [ ] **Step 2: Write the failing test**

Create `tests/test_load_clinics.py`:

```python
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `.venv\Scripts\python.exe -m pytest tests/test_load_clinics.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'engine.load'`.

- [ ] **Step 4: Write minimal implementation**

Create `engine/load.py`:

```python
from __future__ import annotations

import csv
from pathlib import Path

from engine.models import Clinic, Review


def _to_float(value: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _to_int(value: str) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0


def load_clinics_csv(path: Path, city: str) -> list[Clinic]:
    """Load a fleet clinics.csv (utf-8-sig/BOM) into Clinic objects.

    Rows with an empty place_id are skipped (incomplete records).
    """
    clinics: list[Clinic] = []
    with open(path, encoding="utf-8-sig", newline="") as fh:
        for row in csv.DictReader(fh):
            place_id = (row.get("place_id") or "").strip()
            if not place_id:
                continue
            clinics.append(
                Clinic(
                    place_id=place_id,
                    name=(row.get("name") or "").strip(),
                    city=city,
                    lat=_to_float(row.get("latitude")),
                    lng=_to_float(row.get("longitude")),
                    address=(row.get("formatted_address") or "").strip(),
                    phone=(row.get("phone") or "").strip(),
                    website=(row.get("website") or "").strip(),
                    rating=_to_float(row.get("rating")),
                    total_reviews=_to_int(row.get("total_reviews")),
                    primary_type=(row.get("primary_type") or "").strip(),
                )
            )
    return clinics
```

- [ ] **Step 5: Run test to verify it passes**

Run: `.venv\Scripts\python.exe -m pytest tests/test_load_clinics.py -v`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add engine/load.py tests/test_load_clinics.py tests/fixtures/bangkok/clinics.csv
git commit -m "feat(engine): load clinics from fleet clinics.csv"
```

---

### Task 3: Load reviews for a clinic

**Files:**
- Modify: `engine/load.py` (add `load_reviews`)
- Create: `tests/fixtures/bangkok/reviews/p1_reviews.csv`
- Test: `tests/test_load_reviews.py`

- [ ] **Step 1: Create the fixture reviews CSV**

Create `tests/fixtures/bangkok/reviews/p1_reviews.csv`:

```csv
review_id,place_id,restaurant_name,rating,text,author_name,author_id,author_uri,author_photo_uri,author_is_local_guide,author_review_count,author_photo_count,relative_date,spent_amount,sort_source
r1,p1,Smile Dental Clinic,5,Great implants and friendly staff,Alice,a1,,,,12,3,2 months ago,"฿30,000",google
r2,p1,Smile Dental Clinic,4,Veneers looked good,Bob,b1,,,,4,0,1 month ago,,google
```

- [ ] **Step 2: Write the failing test**

Create `tests/test_load_reviews.py`:

```python
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `.venv\Scripts\python.exe -m pytest tests/test_load_reviews.py -v`
Expected: FAIL with `ImportError: cannot import name 'load_reviews'`.

- [ ] **Step 4: Add the implementation**

Append to `engine/load.py`:

```python
def load_reviews(reviews_dir: Path, place_id: str) -> list[Review]:
    """Load reviews/<place_id>_reviews.csv. Returns [] if the file is absent."""
    path = reviews_dir / f"{place_id}_reviews.csv"
    if not path.exists():
        return []
    out: list[Review] = []
    with open(path, encoding="utf-8-sig", newline="") as fh:
        for row in csv.DictReader(fh):
            out.append(
                Review(
                    author=(row.get("author_name") or "").strip(),
                    rating=_to_float(row.get("rating")),
                    text=(row.get("text") or "").strip(),
                    source="google",
                    spent_amount=(row.get("spent_amount") or "").strip(),
                )
            )
    return out
```

- [ ] **Step 5: Run test to verify it passes**

Run: `.venv\Scripts\python.exe -m pytest tests/test_load_reviews.py -v`
Expected: PASS (2 passed).

- [ ] **Step 6: Commit**

```bash
git add engine/load.py tests/test_load_reviews.py tests/fixtures/bangkok/reviews/p1_reviews.csv
git commit -m "feat(engine): load per-clinic reviews from reviews csv"
```

---

### Task 4: Entity resolution — dedupe clinics by place_id

**Files:**
- Create: `engine/resolve.py`
- Test: `tests/test_resolve.py`

The same clinic appears in multiple city/output folders. `place_id` (Google Maps id) is the unique key. Merging keeps one record and unions reviews + sources.

- [ ] **Step 1: Write the failing test**

Create `tests/test_resolve.py`:

```python
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.venv\Scripts\python.exe -m pytest tests/test_resolve.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'engine.resolve'`.

- [ ] **Step 3: Write minimal implementation**

Create `engine/resolve.py`:

```python
from __future__ import annotations

from engine.models import Clinic


def _merge_into(base: Clinic, other: Clinic) -> None:
    """Fold `other` into `base` (same place_id)."""
    # Prefer the record with more total_reviews as the canonical name/identity.
    if other.total_reviews > base.total_reviews:
        base.name = other.name
        base.total_reviews = other.total_reviews
        base.rating = other.rating
        base.address = other.address or base.address
        base.phone = other.phone or base.phone
        base.website = other.website or base.website
    base.reviews.extend(other.reviews)
    for s in other.sources:
        if s not in base.sources:
            base.sources.append(s)


def dedupe_clinics(clinics: list[Clinic]) -> list[Clinic]:
    """Collapse clinics sharing a place_id into one record, unioning reviews/sources."""
    by_id: dict[str, Clinic] = {}
    for c in clinics:
        existing = by_id.get(c.place_id)
        if existing is None:
            by_id[c.place_id] = c
        else:
            _merge_into(existing, c)
    return list(by_id.values())
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.venv\Scripts\python.exe -m pytest tests/test_resolve.py -v`
Expected: PASS (2 passed).

- [ ] **Step 5: Commit**

```bash
git add engine/resolve.py tests/test_resolve.py
git commit -m "feat(engine): dedupe clinics by place_id with review/source union"
```

---

### Task 5: Procedure tagging (dental / botox / hair)

**Files:**
- Create: `engine/procedures.py`
- Test: `tests/test_procedures.py`

Tagging decides which site a clinic belongs to (the no-duplicate partition). A clinic may get multiple tags (multi-specialty). Signals: name, primary_type, and review text (EN + Thai keywords).

- [ ] **Step 1: Write the failing test**

Create `tests/test_procedures.py`:

```python
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.venv\Scripts\python.exe -m pytest tests/test_procedures.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'engine.procedures'`.

- [ ] **Step 3: Write minimal implementation**

Create `engine/procedures.py`:

```python
from __future__ import annotations

from engine.models import Clinic

# Order matters only for deterministic output; a clinic may match several.
PROCEDURE_KEYWORDS: dict[str, list[str]] = {
    "dental": [
        "dental", "dentist", "teeth", "tooth", "implant", "orthodont",
        "braces", "veneer", "whitening", "root canal",
        "ทันตกรรม", "ฟัน", "รากฟันเทียม", "จัดฟัน",
    ],
    "botox": [
        "botox", "filler", "aesthetic", "skin booster", "ulthera",
        "dermatolog", "injectable", "mesotherapy",
        "โบท็อก", "ฟิลเลอร์", "ผิว",
    ],
    "hair": [
        "hair transplant", "fue", "dhi", "fut", "hairline", "scalp",
        "ปลูกผม",
    ],
}


def tag_procedures(clinic: Clinic) -> list[str]:
    """Return the procedure niches this clinic matches, in PROCEDURE_KEYWORDS order."""
    haystack = " ".join(
        [clinic.name, clinic.primary_type] + [r.text for r in clinic.reviews]
    ).lower()
    tags: list[str] = []
    for niche, keywords in PROCEDURE_KEYWORDS.items():
        if any(kw in haystack for kw in keywords):
            tags.append(niche)
    return tags
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.venv\Scripts\python.exe -m pytest tests/test_procedures.py -v`
Expected: PASS (5 passed).

- [ ] **Step 5: Commit**

```bash
git add engine/procedures.py tests/test_procedures.py
git commit -m "feat(engine): procedure niche tagging (dental/botox/hair)"
```

---

### Task 6: Build canonical.json orchestrator

**Files:**
- Create: `engine/build_canonical.py`
- Test: `tests/test_build_canonical.py`

Ties it together: given a list of `(output_dir, city)` pairs, load all clinics + their reviews, dedupe, tag, and write `canonical.json`. Also runnable as a CLI.

- [ ] **Step 1: Write the failing test**

Create `tests/test_build_canonical.py`:

```python
import json
from pathlib import Path

from engine.build_canonical import build_canonical

FIX_DIR = Path(__file__).parent / "fixtures" / "bangkok"


def test_build_canonical_writes_tagged_deduped_json(tmp_path):
    out_file = tmp_path / "canonical.json"
    count = build_canonical(
        sources=[(FIX_DIR, "bangkok")],
        out_path=out_file,
    )
    assert count == 2
    data = json.loads(out_file.read_text(encoding="utf-8"))
    by_id = {c["place_id"]: c for c in data}
    # p1 has reviews loaded and is tagged dental
    assert "dental" in by_id["p1"]["procedures"]
    assert len(by_id["p1"]["reviews"]) == 2
    # p2 tagged botox from its editorial/name "Glow Aesthetic" + no reviews file
    assert "botox" in by_id["p2"]["procedures"]
    assert by_id["p2"]["reviews"] == []
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.venv\Scripts\python.exe -m pytest tests/test_build_canonical.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'engine.build_canonical'`.

- [ ] **Step 3: Write minimal implementation**

Create `engine/build_canonical.py`:

```python
from __future__ import annotations

import json
import sys
from pathlib import Path

from engine.load import load_clinics_csv, load_reviews
from engine.procedures import tag_procedures
from engine.resolve import dedupe_clinics


def build_canonical(sources: list[tuple[Path, str]], out_path: Path) -> int:
    """Load every (output_dir, city), dedupe, tag, write canonical.json.

    Each output_dir is expected to contain `clinics.csv` and a `reviews/` subdir.
    Returns the number of canonical clinics written.
    """
    all_clinics = []
    for output_dir, city in sources:
        clinics_csv = output_dir / "clinics.csv"
        if not clinics_csv.exists():
            continue
        reviews_dir = output_dir / "reviews"
        for clinic in load_clinics_csv(clinics_csv, city=city):
            clinic.reviews = load_reviews(reviews_dir, clinic.place_id)
            all_clinics.append(clinic)

    deduped = dedupe_clinics(all_clinics)
    for clinic in deduped:
        clinic.procedures = tag_procedures(clinic)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = [c.to_dict() for c in deduped]
    out_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return len(deduped)


# Known fleet output directories (relative to repo root). Extend as cities are added.
DEFAULT_SOURCES: list[tuple[str, str]] = [
    ("dental_output/bangkok", "bangkok"),
    ("bangkok_clinics/output", "bangkok"),
    ("pattaya/clinics_output", "pattaya"),
    ("phuket/clinics_output", "phuket"),
    ("chiang_mai/clinics_output", "chiang_mai"),
]


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    sources = [(repo_root / rel, city) for rel, city in DEFAULT_SOURCES]
    out_path = repo_root / "engine" / "data" / "canonical.json"
    count = build_canonical(sources, out_path)
    print(f"[canonical] wrote {count} clinics -> {out_path}")


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.venv\Scripts\python.exe -m pytest tests/test_build_canonical.py -v`
Expected: PASS.

- [ ] **Step 5: Run the full test suite**

Run: `.venv\Scripts\python.exe -m pytest -v`
Expected: all tests PASS (smoke + models + load_clinics + load_reviews + resolve + procedures + build_canonical).

- [ ] **Step 6: Smoke-run against real data**

Run: `.venv\Scripts\python.exe -m engine.build_canonical`
Expected: prints `[canonical] wrote N clinics -> ...engine\data\canonical.json` with N > 0 (real Bangkok dental + clinic data). Inspect a few entries to confirm `procedures` tags look right.

- [ ] **Step 7: Commit**

```bash
git add engine/build_canonical.py tests/test_build_canonical.py
git commit -m "feat(engine): build deduped+tagged canonical.json from fleet outputs"
```

> Note: `engine/data/canonical.json` is a generated artifact. Add `engine/data/` to `.gitignore` in a follow-up if it should not be tracked.

---

## Self-Review

**Spec coverage (vs design spec §5/§7/§8):**
- Canonical DB with one record per clinic → Tasks 1, 4, 6 ✅
- Entity resolution / dedupe (no clinic stored twice) → Task 4 ✅
- Procedure tagging for niche partition (dental/botox) → Task 5 ✅
- Reuse of existing CSV outputs (no re-scrape) → Tasks 2, 3, 6 ✅
- Deferred (explicitly out of scope for Plan 1, in later plans): price extraction → PriceIndex, trust score, EN↔KR translation, build-time duplicate-content gate, per-site JSON projection (botox.json/dental.json), Next.js page generation. These are Plan 1b/2/3/4.

**Placeholder scan:** No TBD/TODO; every code step contains complete code; every command has expected output. ✅

**Type/name consistency:** `Clinic`, `Review`, `load_clinics_csv`, `load_reviews`, `dedupe_clinics`, `tag_procedures`, `build_canonical` used identically across tasks. `spent_amount` carried on `Review` for downstream price extraction. ✅

---

## Follow-on plans (not in this plan)
- **Plan 1b — Enrichment & PriceIndex:** clinic official-site scraper, `฿` price extractor → `price_index.json`, trust score, EN↔KR translation.
- **Plan 2 — Dental site (bangkokbestclinic):** project `canonical.json` → `dental.json`, Next.js 6 page types, duplicate-content gate, deploy + IndexNow.
- **Plan 3 — Botox site (bangkokbotoxclinic):** same engine, botox projection.
- **Plan 4 — Daily pipeline orchestration:** nightly enrich→build→deploy→ping, watchdog-supervised, one-workstream-at-a-time load control.
