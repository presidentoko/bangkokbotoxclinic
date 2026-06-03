# Cosmetics Data Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the ~415 scraped Konvy acne/whitening products into a ranked, scored, AEO-ready `master_db.json` driven by a curated ingredient dictionary + Konvy review aggregation, plus LLM answer-first summaries.

**Architecture:** Pure-Python build pipeline in the existing `cosmetics/` package. A hand-curated `ingredient_db.json` provides per-ingredient efficacy/safety. `scoring.py` computes ingredient/review/value/total scores; `review_aggregate.py` summarizes the review corpus; `build_master_db.py` orchestrates → writes `cosmetics/web/data/master_db.json` with per-concern rankings; `gen_summaries.py` adds cached Claude-generated th/en summaries. Logic modules are pure and unit-tested (pytest, matching the existing `cosmetics/tests/` setup).

**Tech Stack:** Python 3.12 (`PYTHONUTF8=1`), pytest, anthropic SDK (Claude API) for summaries. No web framework here (that's Plan 2).

**Run tests with:** `PYTHONUTF8=1 PYTHONIOENCODING=utf-8 <py312> -m pytest cosmetics/tests/ -q` where `<py312>` = `C:/Users/yn/AppData/Local/Programs/Python/Python312/python.exe`, run from the worktree root `C:/Users/yn/Desktop/Work/0_main/deliverable/deliverable/.claude/worktrees/cosmetics-aeo`.

> **Worktree/git note:** We are in the isolated worktree `worktree-cosmetics-aeo`. Commit ONLY the specific paths each step lists (`git add <path>`), never `git add -A` (the live repo's automation stages other people's files). See memory `deliverable-repo-watchdog-git-hazard`.

---

## File Structure

- Create `cosmetics/web/data/ingredient_db.json` — curated ingredient dictionary (data).
- Create `cosmetics/ingredients.py` — load dict, normalize INCI, match product ingredients → analysis.
- Create `cosmetics/scoring.py` — `ingredient_score`, `review_score`, `value_score`, `total_score`.
- Create `cosmetics/review_aggregate.py` — summarize a product's review corpus.
- Create `cosmetics/build_master_db.py` — orchestrate: load products + dict + reviews → scores → rankings → write `master_db.json`.
- Create `cosmetics/gen_summaries.py` — Claude API answer-first th/en summaries, cached into master_db.
- Create tests: `cosmetics/tests/test_ingredients.py`, `test_scoring.py`, `test_review_aggregate.py`, `test_build_master_db.py`.

Constants (concern keys `"acne"`, `"whitening"`; efficacy scale 0-3; weights 0.45/0.45/0.10) live in `cosmetics/scoring.py` as module constants and are imported elsewhere — single source of truth.

---

### Task 1: Curated ingredient dictionary + loader

**Files:**
- Create: `cosmetics/web/data/ingredient_db.json`
- Create: `cosmetics/ingredients.py`
- Test: `cosmetics/tests/test_ingredients.py`

- [ ] **Step 1: Create the seed dictionary** (real starter set; expand to ~40-60 later using the SAME structure)

Create `cosmetics/web/data/ingredient_db.json`:

```json
{
  "Niacinamide": {"th_name":"ไนอาซินาไมด์","en_name":"Niacinamide","aliases":["Vitamin B3","Nicotinamide"],"role":"active","concern_efficacy":{"acne":2,"whitening":3},"safety_flags":[],"mechanism_th":"ลดการสร้างเม็ดสีและควบคุมความมัน เสริมเกราะผิว","mechanism_en":"Inhibits melanosome transfer (brightening) and regulates sebum; supports barrier.","typical_pct":"2-5%","evidence_note":"Strong evidence for brightening and barrier; moderate for acne.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Salicylic Acid":{"th_name":"กรดซาลิไซลิก","en_name":"Salicylic Acid","aliases":["BHA","Beta Hydroxy Acid"],"role":"active","concern_efficacy":{"acne":3,"whitening":0},"safety_flags":["irritant"],"mechanism_th":"BHA ละลายในน้ำมัน ผลัดเซลล์ในรูขุมขน ลดสิวอุดตัน","mechanism_en":"Oil-soluble BHA that exfoliates inside pores, clearing comedones.","typical_pct":"0.5-2%","evidence_note":"Gold-standard comedolytic.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Benzoyl Peroxide":{"th_name":"เบนโซอิลเปอร์ออกไซด์","en_name":"Benzoyl Peroxide","aliases":["BPO"],"role":"active","concern_efficacy":{"acne":3,"whitening":0},"safety_flags":["irritant"],"mechanism_th":"ฆ่าเชื้อ C. acnes ลดสิวอักเสบ","mechanism_en":"Antibacterial against C. acnes; reduces inflammatory acne.","typical_pct":"2.5-5%","evidence_note":"Strong for inflammatory acne.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Azelaic Acid":{"th_name":"กรดอะเซลาอิก","en_name":"Azelaic Acid","aliases":[],"role":"active","concern_efficacy":{"acne":2,"whitening":2},"safety_flags":[],"mechanism_th":"ลดสิวและจุดด่างดำ ต้านการอักเสบ","mechanism_en":"Anti-inflammatory; treats acne and post-inflammatory hyperpigmentation.","typical_pct":"10-20%","evidence_note":"Dual acne+brightening.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Adapalene":{"th_name":"อะดาพาลีน","en_name":"Adapalene","aliases":["Retinoid"],"role":"active","concern_efficacy":{"acne":3,"whitening":1},"safety_flags":["irritant","photosensitizer"],"mechanism_th":"เรตินอยด์ ปรับการผลัดเซลล์ ลดสิวอุดตัน","mechanism_en":"Retinoid normalizing follicular keratinization; comedolytic.","typical_pct":"0.1%","evidence_note":"OTC retinoid for acne.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Ascorbic Acid":{"th_name":"วิตามินซี","en_name":"Vitamin C (L-Ascorbic Acid)","aliases":["L-Ascorbic Acid","Vitamin C"],"role":"active","concern_efficacy":{"acne":1,"whitening":3},"safety_flags":[],"mechanism_th":"แอนติออกซิแดนต์ ยับยั้งไทโรซิเนส ลดจุดด่างดำ ผิวกระจ่างใส","mechanism_en":"Antioxidant; inhibits tyrosinase to fade dark spots and brighten.","typical_pct":"10-20%","evidence_note":"Strong brightening evidence.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Sodium Ascorbyl Phosphate":{"th_name":"โซเดียมแอสคอร์บิลฟอสเฟต","en_name":"Sodium Ascorbyl Phosphate","aliases":["SAP"],"role":"active","concern_efficacy":{"acne":2,"whitening":2},"safety_flags":[],"mechanism_th":"อนุพันธ์วิตามินซีที่เสถียร ลดสิวและจุดด่างดำ","mechanism_en":"Stable vitamin C derivative; brightening with mild anti-acne data.","typical_pct":"1-5%","evidence_note":"Stable VitC derivative.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Alpha-Arbutin":{"th_name":"อัลฟาอาร์บูติน","en_name":"Alpha-Arbutin","aliases":["Arbutin"],"role":"active","concern_efficacy":{"acne":0,"whitening":3},"safety_flags":[],"mechanism_th":"ยับยั้งไทโรซิเนส ลดจุดด่างดำ","mechanism_en":"Tyrosinase inhibitor; fades hyperpigmentation.","typical_pct":"1-2%","evidence_note":"Effective brightener.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Tranexamic Acid":{"th_name":"กรดทรานเซซามิก","en_name":"Tranexamic Acid","aliases":[],"role":"active","concern_efficacy":{"acne":0,"whitening":3},"safety_flags":[],"mechanism_th":"ลดฝ้าและจุดด่างดำ","mechanism_en":"Reduces melasma and dark spots.","typical_pct":"2-5%","evidence_note":"Strong for melasma.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Kojic Acid":{"th_name":"กรดโคจิก","en_name":"Kojic Acid","aliases":[],"role":"active","concern_efficacy":{"acne":0,"whitening":2},"safety_flags":["irritant"],"mechanism_th":"ยับยั้งไทโรซิเนส ลดจุดด่างดำ","mechanism_en":"Tyrosinase inhibitor for brightening.","typical_pct":"1-2%","evidence_note":"Brightener; can irritate.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Centella Asiatica Extract":{"th_name":"ใบบัวบก","en_name":"Centella Asiatica","aliases":["Cica","Gotu Kola"],"role":"active","concern_efficacy":{"acne":1,"whitening":0},"safety_flags":[],"mechanism_th":"ปลอบประโลม ลดการอักเสบ ฟื้นเกราะผิว","mechanism_en":"Soothing, anti-inflammatory; supports barrier repair.","typical_pct":"n/a","evidence_note":"Soothing adjunct for acne-prone skin.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Zinc PCA":{"th_name":"ซิงค์ พีซีเอ","en_name":"Zinc PCA","aliases":["Zinc"],"role":"active","concern_efficacy":{"acne":2,"whitening":0},"safety_flags":[],"mechanism_th":"ควบคุมความมัน ต้านเชื้อ","mechanism_en":"Sebum-regulating and antibacterial.","typical_pct":"0.1-1%","evidence_note":"Oil control adjunct.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Tea Tree Oil":{"th_name":"น้ำมันที ทรี","en_name":"Tea Tree Oil","aliases":["Melaleuca Alternifolia Leaf Oil"],"role":"active","concern_efficacy":{"acne":2,"whitening":0},"safety_flags":["irritant","fragrance"],"mechanism_th":"ต้านเชื้อแบคทีเรียสิว","mechanism_en":"Antibacterial against acne bacteria.","typical_pct":"5%","evidence_note":"Natural anti-acne; sensitizing.","sources":["https://pubmed.ncbi.nlm.nih.gov/"]},
  "Glycerin":{"th_name":"กลีเซอรีน","en_name":"Glycerin","aliases":["Glycerol"],"role":"humectant","concern_efficacy":{"acne":0,"whitening":0},"safety_flags":[],"mechanism_th":"ดึงน้ำเข้าสู่ผิว","mechanism_en":"Humectant that draws water into skin.","typical_pct":"n/a","evidence_note":"Hydration base.","sources":[]},
  "Hyaluronic Acid":{"th_name":"กรดไฮยาลูรอนิก","en_name":"Hyaluronic Acid","aliases":["Sodium Hyaluronate"],"role":"humectant","concern_efficacy":{"acne":0,"whitening":0},"safety_flags":[],"mechanism_th":"กักเก็บความชุ่มชื้น","mechanism_en":"Holds moisture in skin.","typical_pct":"n/a","evidence_note":"Hydration.","sources":[]},
  "Alcohol Denat.":{"th_name":"แอลกอฮอล์","en_name":"Alcohol Denat.","aliases":["Denatured Alcohol","SD Alcohol"],"role":"solvent","concern_efficacy":{"acne":0,"whitening":0},"safety_flags":["alcohol","irritant"],"mechanism_th":"ตัวทำละลาย อาจระคายเคืองถ้าเข้มข้น","mechanism_en":"Solvent; can dry/irritate at high levels.","typical_pct":"n/a","evidence_note":"Caution ingredient.","sources":[]},
  "Fragrance":{"th_name":"น้ำหอม","en_name":"Fragrance (Parfum)","aliases":["Parfum"],"role":"additive","concern_efficacy":{"acne":0,"whitening":0},"safety_flags":["fragrance","irritant"],"mechanism_th":"แต่งกลิ่น อาจก่อการระคายเคือง/แพ้","mechanism_en":"Scent; common irritant/allergen.","typical_pct":"n/a","evidence_note":"Caution ingredient.","sources":[]}
}
```

- [ ] **Step 2: Write the failing test**

Create `cosmetics/tests/test_ingredients.py`:

```python
from cosmetics import ingredients

def test_load_and_schema():
    db = ingredients.load_db()
    assert "Niacinamide" in db
    e = db["Niacinamide"]
    for k in ("th_name","en_name","aliases","role","concern_efficacy","safety_flags",
              "mechanism_th","mechanism_en","typical_pct","sources"):
        assert k in e, f"missing {k}"
    assert set(e["concern_efficacy"]) >= {"acne","whitening"}
    for v in e["concern_efficacy"].values():
        assert 0 <= v <= 3

def test_normalize_matches_alias_and_case():
    assert ingredients.normalize("Aqua/Water") == "aqua/water"
    assert ingredients.normalize("  SODIUM   Hyaluronate ") == "sodium hyaluronate"

def test_match_ingredients_by_name_and_alias():
    db = ingredients.load_db()
    matched = ingredients.match(["Niacinamide", "Vitamin B3", "Aqua", "BHA"], db)
    keys = {m["inci"] for m in matched}
    assert "Niacinamide" in keys          # exact
    assert "Salicylic Acid" in keys       # via alias "BHA"
    # dedupe: Niacinamide + alias Vitamin B3 collapse to one
    assert sum(1 for m in matched if m["inci"] == "Niacinamide") == 1
```

- [ ] **Step 3: Run test, verify FAIL**

Run: `... -m pytest cosmetics/tests/test_ingredients.py -q`
Expected: FAIL (`ModuleNotFoundError: cosmetics.ingredients`).

- [ ] **Step 4: Implement `cosmetics/ingredients.py`**

```python
"""Curated ingredient dictionary: load, normalize INCI, match product ingredients."""
from __future__ import annotations
import json, functools
from pathlib import Path

DB_PATH = Path(__file__).parent / "web" / "data" / "ingredient_db.json"

@functools.lru_cache(maxsize=1)
def load_db(path: str | None = None) -> dict:
    p = Path(path) if path else DB_PATH
    return json.loads(p.read_text(encoding="utf-8"))

def normalize(name: str) -> str:
    return " ".join((name or "").strip().lower().split())

@functools.lru_cache(maxsize=1)
def _alias_index() -> dict:
    """normalized name/alias -> canonical INCI key."""
    idx = {}
    for inci, e in load_db().items():
        idx[normalize(inci)] = inci
        idx[normalize(e.get("en_name", ""))] = inci
        for a in e.get("aliases", []):
            idx[normalize(a)] = inci
    idx.pop("", None)
    return idx

def match(product_ingredients: list[str], db: dict) -> list[dict]:
    """Return dict entries for product ingredients found in the DB, order-preserving, deduped."""
    idx = _alias_index()
    out, seen = [], set()
    for raw in product_ingredients:
        inci = idx.get(normalize(raw))
        if inci and inci not in seen:
            seen.add(inci)
            e = db[inci]
            out.append({"inci": inci, "role": e["role"],
                        "concern_efficacy": e["concern_efficacy"],
                        "safety_flags": e["safety_flags"]})
    return out
```

- [ ] **Step 5: Run test, verify PASS**

Run: `... -m pytest cosmetics/tests/test_ingredients.py -q`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add cosmetics/web/data/ingredient_db.json cosmetics/ingredients.py cosmetics/tests/test_ingredients.py
git commit -m "feat(cosmetics): curated ingredient dictionary + matcher"
```

---

### Task 2: Scoring — ingredient_score

**Files:**
- Create: `cosmetics/scoring.py`
- Test: `cosmetics/tests/test_scoring.py`

- [ ] **Step 1: Write the failing test**

Create `cosmetics/tests/test_scoring.py`:

```python
from cosmetics import scoring

def test_constants():
    assert scoring.WEIGHTS == {"ingredient": 0.45, "review": 0.45, "value": 0.10}
    assert abs(sum(scoring.WEIGHTS.values()) - 1.0) < 1e-9

def test_ingredient_score_rewards_relevant_actives():
    # one strong acne active (efficacy 3) -> high; irrelevant humectant -> ignored for acne
    analysis = [
        {"inci":"Salicylic Acid","role":"active","concern_efficacy":{"acne":3,"whitening":0},"safety_flags":["irritant"]},
        {"inci":"Glycerin","role":"humectant","concern_efficacy":{"acne":0,"whitening":0},"safety_flags":[]},
    ]
    acne = scoring.ingredient_score(analysis, "acne")
    whit = scoring.ingredient_score(analysis, "whitening")
    assert 0 <= acne <= 100 and 0 <= whit <= 100
    assert acne > whit  # relevant active only helps acne

def test_ingredient_score_penalizes_caution_flags():
    base = [{"inci":"Niacinamide","role":"active","concern_efficacy":{"acne":0,"whitening":3},"safety_flags":[]}]
    flagged = base + [{"inci":"Fragrance","role":"additive","concern_efficacy":{"acne":0,"whitening":0},"safety_flags":["fragrance","irritant"]}]
    assert scoring.ingredient_score(flagged, "whitening") < scoring.ingredient_score(base, "whitening")

def test_ingredient_score_empty_is_low_not_negative():
    s = scoring.ingredient_score([], "acne")
    assert 0 <= s <= 20
```

- [ ] **Step 2: Run test, verify FAIL**

Run: `... -m pytest cosmetics/tests/test_scoring.py -q`
Expected: FAIL (`ModuleNotFoundError: cosmetics.scoring`).

- [ ] **Step 3: Implement `ingredient_score` in `cosmetics/scoring.py`**

```python
"""Transparent scoring: ingredient / review / value -> total. Pure functions."""
from __future__ import annotations

WEIGHTS = {"ingredient": 0.45, "review": 0.45, "value": 0.10}
CONCERNS = ("acne", "whitening")

# ingredient_score tuning
_EFFICACY_CAP = 6          # sum of efficacy beyond this saturates to full marks
_FLAG_PENALTY = 6          # points subtracted per distinct caution flag
_BASE = 10                 # floor so a no-active product isn't 0

def ingredient_score(analysis: list[dict], concern: str) -> float:
    """0-100 from relevant actives (efficacy-weighted, saturating) minus caution penalties."""
    eff_sum = sum(a["concern_efficacy"].get(concern, 0) for a in analysis)
    reward = min(eff_sum, _EFFICACY_CAP) / _EFFICACY_CAP * (100 - _BASE)  # 0..90
    flags = set()
    for a in analysis:
        flags.update(a.get("safety_flags", []))
    penalty = _FLAG_PENALTY * len(flags)
    return max(0.0, min(100.0, _BASE + reward - penalty))
```

- [ ] **Step 4: Run test, verify PASS**

Run: `... -m pytest cosmetics/tests/test_scoring.py -q`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add cosmetics/scoring.py cosmetics/tests/test_scoring.py
git commit -m "feat(cosmetics): ingredient_score"
```

---

### Task 3: Scoring — review_score (Bayesian), value_score, total_score + ranking

**Files:**
- Modify: `cosmetics/scoring.py`
- Modify: `cosmetics/tests/test_scoring.py`

- [ ] **Step 1: Add failing tests**

Append to `cosmetics/tests/test_scoring.py`:

```python
def test_review_score_bayesian_shrinks_low_count():
    # same 5.0 rating, but 2 reviews should score below 500 reviews (shrinks toward prior)
    hi = scoring.review_score(5.0, 500, prior_mean=4.2)
    lo = scoring.review_score(5.0, 2,   prior_mean=4.2)
    assert 0 <= lo < hi <= 100
    assert scoring.review_score(0, 0, prior_mean=4.2) == 0.0  # no rating -> 0

def test_value_score_cheaper_scores_higher():
    cheap = scoring.value_score(price_per_ml=10.0, median_per_ml=30.0)
    pricey = scoring.value_score(price_per_ml=60.0, median_per_ml=30.0)
    assert 0 <= pricey < cheap <= 100

def test_total_score_weighted_blend():
    t = scoring.total_score(ingredient=80, review=60, value=40)
    assert abs(t - (0.45*80 + 0.45*60 + 0.10*40)) < 1e-9

def test_rank_products_orders_desc_with_tiebreak():
    prods = [
        {"product_id":"a","total_score":{"acne":70.0},"sold_count":10},
        {"product_id":"b","total_score":{"acne":70.0},"sold_count":99},  # tie -> sold breaks
        {"product_id":"c","total_score":{"acne":85.0},"sold_count":1},
    ]
    ranked = scoring.rank_products(prods, "acne")
    assert [p["product_id"] for p in ranked] == ["c","b","a"]
```

- [ ] **Step 2: Run test, verify FAIL**

Run: `... -m pytest cosmetics/tests/test_scoring.py -q`
Expected: FAIL (`AttributeError: review_score`).

- [ ] **Step 3: Implement in `cosmetics/scoring.py`** (append)

```python
BAYES_C = 30  # confidence constant: reviews needed to outweigh the prior

def review_score(rating: float, count: int, prior_mean: float = 4.2,
                 best: float = 5.0) -> float:
    """Bayesian-adjusted 0-100. Few reviews shrink toward prior_mean; 0 count -> 0."""
    if not count or rating <= 0:
        return 0.0
    adj = (BAYES_C * prior_mean + count * rating) / (BAYES_C + count)
    return max(0.0, min(100.0, adj / best * 100.0))

def value_score(price_per_ml: float, median_per_ml: float) -> float:
    """0-100; at/above 2x median -> 0, at/below ~0 -> 100, median -> 50."""
    if not price_per_ml or not median_per_ml or price_per_ml <= 0:
        return 50.0
    ratio = price_per_ml / median_per_ml          # 1.0 == median
    return max(0.0, min(100.0, (2.0 - ratio) * 50.0))

def total_score(ingredient: float, review: float, value: float) -> float:
    return (WEIGHTS["ingredient"] * ingredient
            + WEIGHTS["review"] * review
            + WEIGHTS["value"] * value)

def rank_products(products: list[dict], concern: str) -> list[dict]:
    """Sort by total_score[concern] desc, sold_count desc tiebreak."""
    return sorted(products,
                  key=lambda p: (p.get("total_score", {}).get(concern, 0.0),
                                 p.get("sold_count", 0)),
                  reverse=True)
```

- [ ] **Step 4: Run test, verify PASS**

Run: `... -m pytest cosmetics/tests/test_scoring.py -q`
Expected: PASS (all scoring tests).

- [ ] **Step 5: Commit**

```bash
git add cosmetics/scoring.py cosmetics/tests/test_scoring.py
git commit -m "feat(cosmetics): review/value/total scores + ranking"
```

---

### Task 4: Review corpus aggregation

**Files:**
- Create: `cosmetics/review_aggregate.py`
- Test: `cosmetics/tests/test_review_aggregate.py`

- [ ] **Step 1: Write the failing test**

Create `cosmetics/tests/test_review_aggregate.py`:

```python
from cosmetics import review_aggregate as ra

SAMPLE = [
    {"rating":5,"body":"ดีมาก สิวยุบ ใช้แล้วหน้าใส","author":"a","timestamp":"t","helpful_count":3},
    {"rating":4,"body":"หน้าใสขึ้น แต่กลิ่นแรง","author":"b","timestamp":"t","helpful_count":1},
    {"rating":2,"body":"แพ้ ระคายเคือง","author":"c","timestamp":"t","helpful_count":0},
]

def test_summary_counts_and_avg():
    s = ra.summarize(SAMPLE)
    assert s["count"] == 3
    assert abs(s["avg"] - (11/3)) < 1e-9
    assert s["pos_count"] == 2 and s["neg_count"] == 1   # rating>=4 pos, <=2 neg

def test_summary_keywords_extracted():
    s = ra.summarize(SAMPLE, top_k=3)
    assert isinstance(s["pos_keywords"], list)
    assert isinstance(s["neg_keywords"], list)
    assert len(s["pos_keywords"]) <= 3

def test_summary_empty():
    s = ra.summarize([])
    assert s["count"] == 0 and s["avg"] == 0.0 and s["pos_keywords"] == []

def test_sample_reviews_picks_helpful():
    s = ra.summarize(SAMPLE, n_samples=2)
    assert len(s["samples"]) == 2
    assert s["samples"][0]["helpful_count"] >= s["samples"][1]["helpful_count"]
```

- [ ] **Step 2: Run test, verify FAIL**

Run: `... -m pytest cosmetics/tests/test_review_aggregate.py -q`
Expected: FAIL (`ModuleNotFoundError`).

- [ ] **Step 3: Implement `cosmetics/review_aggregate.py`**

```python
"""Summarize a product's Konvy review corpus: avg, pos/neg split, keyword frequency, samples."""
from __future__ import annotations
import re
from collections import Counter

# Thai has no spaces between words; for MVP use a simple stopword + token-length filter
# over whitespace/punct splits. (Open item: swap in a Thai tokenizer like pythainlp later.)
_STOP = {"และ","ที่","มาก","แต่","ใช้","แล้ว","เป็น","ก็","นะ","ค่ะ","ครับ","มี","ไม่",
         "the","a","is","it","i","very","but","use","used","and","to"}
_TOKEN = re.compile(r"[A-Za-z฀-๿]{3,}")

def _keywords(reviews, top_k):
    c = Counter()
    for r in reviews:
        for tok in _TOKEN.findall((r.get("body") or "").lower()):
            if tok not in _STOP:
                c[tok] += 1
    return [w for w, _ in c.most_common(top_k)]

def summarize(reviews: list[dict], top_k: int = 8, n_samples: int = 3) -> dict:
    if not reviews:
        return {"count":0,"avg":0.0,"pos_count":0,"neg_count":0,
                "pos_keywords":[],"neg_keywords":[],"samples":[]}
    ratings = [float(r.get("rating") or 0) for r in reviews]
    pos = [r for r in reviews if float(r.get("rating") or 0) >= 4]
    neg = [r for r in reviews if float(r.get("rating") or 0) <= 2]
    samples = sorted(reviews, key=lambda r: r.get("helpful_count", 0), reverse=True)[:n_samples]
    return {
        "count": len(reviews),
        "avg": sum(ratings) / len(ratings),
        "pos_count": len(pos), "neg_count": len(neg),
        "pos_keywords": _keywords(pos, top_k),
        "neg_keywords": _keywords(neg, top_k),
        "samples": samples,
    }
```

- [ ] **Step 4: Run test, verify PASS**

Run: `... -m pytest cosmetics/tests/test_review_aggregate.py -q`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add cosmetics/review_aggregate.py cosmetics/tests/test_review_aggregate.py
git commit -m "feat(cosmetics): review corpus aggregation"
```

---

### Task 5: build_master_db.py orchestrator

**Files:**
- Create: `cosmetics/build_master_db.py`
- Test: `cosmetics/tests/test_build_master_db.py`

- [ ] **Step 1: Write the failing test** (drives the pure helper `build_db`, no file IO)

Create `cosmetics/tests/test_build_master_db.py`:

```python
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
```

- [ ] **Step 2: Run test, verify FAIL**

Run: `... -m pytest cosmetics/tests/test_build_master_db.py -q`
Expected: FAIL (`ModuleNotFoundError`).

- [ ] **Step 3: Implement `cosmetics/build_master_db.py`**

```python
"""Orchestrate: products + ingredient_db + review corpora -> scored, ranked master_db.json."""
from __future__ import annotations
import json, re, statistics, time
from pathlib import Path

from cosmetics import config, ingredients, scoring, review_aggregate

MASTER_DB = config.OUTPUT_DIR.parent / "web" / "data" / "master_db.json"
_VOL = re.compile(r"(\d+(?:\.\d+)?)\s*ml", re.I)

def _ml(volume: str) -> float:
    m = _VOL.search(volume or "")
    return float(m.group(1)) if m else 0.0

def build_db(products: list[dict], reviews_by_id: dict) -> dict:
    db = ingredients.load_db()
    # prior mean rating across products that have ratings
    rated = [p["konvy_rating"] for p in products if p.get("konvy_rating")]
    prior = statistics.mean(rated) if rated else 4.2
    # global median price/ml for value_score (concern-independent scalar; MVP simplification)
    for p in products:
        ml = _ml(p.get("volume", ""))
        p["_ppml"] = (p["price_thb"] / ml) if (ml and p.get("price_thb")) else 0.0
    _all_ppml = [p["_ppml"] for p in products if p["_ppml"]]
    med_ppml = statistics.median(_all_ppml) if _all_ppml else 0.0

    out_products = {}
    for p in products:
        ing_list = p.get("ingredients", [])
        if isinstance(ing_list, str):                      # scraper stores "|"-joined string
            ing_list = [x for x in ing_list.split("|") if x]
        analysis = ingredients.match(ing_list, db)
        rsum = review_aggregate.summarize(reviews_by_id.get(p["product_id"], []))
        rev = scoring.review_score(p.get("konvy_rating", 0) or 0,
                                   p.get("konvy_review_count", 0) or 0, prior_mean=prior)
        val = scoring.value_score(p["_ppml"], med_ppml)    # scalar
        ing, tot = {}, {}
        for c in scoring.CONCERNS:
            ing[c] = scoring.ingredient_score(analysis, c)
            tot[c] = scoring.total_score(ing[c], rev, val)
        rec = dict(p)
        rec.pop("_ppml", None)
        rec.update({"ingredient_analysis": analysis, "ingredient_score": ing,
                    "review_score": rev, "value_score": val,
                    "total_score": tot, "review_summary": rsum})
        out_products[p["product_id"]] = rec

    rankings = {}
    for c in scoring.CONCERNS:
        pool = [pp for pp in out_products.values() if c in pp.get("concern_seeds", [])] or list(out_products.values())
        ranked = scoring.rank_products(pool, c)
        rankings[c] = [{"product_id": pp["product_id"], "total_score": pp["total_score"][c]} for pp in ranked]
    return {"generated_at": None, "products": out_products, "rankings": rankings}

def _load_reviews() -> dict:
    out = {}
    rdir = config.REVIEWS_DIR
    if rdir.exists():
        for f in rdir.glob("*_konvy.json"):
            pid = f.name.split("_")[0]
            try:
                out[pid] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                out[pid] = []
    return out

def main() -> int:
    products = [json.loads(f.read_text(encoding="utf-8"))
                for f in sorted((config.OUTPUT_DIR / "products").glob("*.json"))]
    db = build_db(products, _load_reviews())
    db["generated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    MASTER_DB.parent.mkdir(parents=True, exist_ok=True)
    MASTER_DB.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"master_db: {len(db['products'])} products -> {MASTER_DB}")
    return 0

if __name__ == "__main__":
    import sys; sys.exit(main())
```

> Note: product JSONs from the scraper store `ingredients` as a `|`-joined string; the test passes a list. The Step-3 implementation already handles both (the `isinstance(ing_list, str)` split), so real `master_db.json` and the unit test both work.

- [ ] **Step 4: Run test, verify PASS**

Run: `... -m pytest cosmetics/tests/test_build_master_db.py -q`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full pipeline on real data (smoke)**

Run: `... -m cosmetics.build_master_db`
Expected: prints `master_db: <N> products -> ...master_db.json`; file exists and is valid JSON with `products` + `rankings.acne` + `rankings.whitening`.

- [ ] **Step 6: Commit**

```bash
git add cosmetics/build_master_db.py cosmetics/tests/test_build_master_db.py
git commit -m "feat(cosmetics): build_master_db orchestrator + rankings"
```

---

### Task 6: gen_summaries.py — cached Claude answer-first summaries

**Files:**
- Create: `cosmetics/gen_summaries.py`
- Test: `cosmetics/tests/test_gen_summaries.py`

> Uses the Anthropic SDK. REQUIRED SUB-SKILL when implementing this task: `claude-api` (for correct client usage + prompt caching). Model: `claude-opus-4-8` or `claude-haiku-4-5-20251001` for cost. Reads `ANTHROPIC_API_KEY` from env.

- [ ] **Step 1: Write the failing test** (inject a fake client so no network)

Create `cosmetics/tests/test_gen_summaries.py`:

```python
from cosmetics import gen_summaries as g

class FakeClient:
    def __init__(self): self.calls = 0
    def summarize(self, prompt, lang):
        self.calls += 1
        return f"[{lang}] summary"

def test_product_summary_cached_by_hash():
    fc = FakeClient()
    prod = {"product_id":"1","name":"Acne Serum","brand":"X",
            "ingredient_analysis":[{"inci":"Salicylic Acid"}],
            "total_score":{"acne":72.0},"review_summary":{"count":200,"avg":4.6}}
    cache = {}
    s1 = g.product_summary(prod, client=fc, cache=cache)
    s2 = g.product_summary(prod, client=fc, cache=cache)   # same input -> cache hit
    assert s1 == s2
    assert set(s1) == {"th","en"}
    assert fc.calls == 2   # one per language, only first time
```

- [ ] **Step 2: Run test, verify FAIL**

Run: `... -m pytest cosmetics/tests/test_gen_summaries.py -q`
Expected: FAIL (`ModuleNotFoundError`).

- [ ] **Step 3: Implement `cosmetics/gen_summaries.py`**

```python
"""Answer-first th/en summaries via Claude, cached by a hash of the salient inputs."""
from __future__ import annotations
import hashlib, json, os

def _key(prod: dict) -> str:
    salient = {"name": prod.get("name"), "brand": prod.get("brand"),
               "actives": [a["inci"] for a in prod.get("ingredient_analysis", [])],
               "score": prod.get("total_score"), "rev": prod.get("review_summary", {}).get("count")}
    return hashlib.sha1(json.dumps(salient, sort_keys=True, ensure_ascii=False).encode()).hexdigest()

def _prompt(prod: dict, lang: str) -> str:
    actives = ", ".join(a["inci"] for a in prod.get("ingredient_analysis", [])) or "—"
    L = "Thai" if lang == "th" else "English"
    return (f"Write ONE answer-first {L} sentence (max 35 words) for a skincare directory: "
            f"product '{prod.get('name')}' by {prod.get('brand')}; key actives: {actives}; "
            f"reviews: {prod.get('review_summary',{}).get('count',0)}. "
            f"State the verdict first. No marketing fluff, no emojis.")

class AnthropicClient:
    def __init__(self, model: str | None = None):
        from anthropic import Anthropic
        self._c = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
        self.model = model or "claude-haiku-4-5-20251001"
    def summarize(self, prompt: str, lang: str) -> str:
        r = self._c.messages.create(model=self.model, max_tokens=120,
                                    messages=[{"role":"user","content":prompt}])
        return r.content[0].text.strip()

def product_summary(prod: dict, client, cache: dict) -> dict:
    h = _key(prod)
    hit = cache.get(h)
    if hit:
        return hit
    out = {lang: client.summarize(_prompt(prod, lang), lang) for lang in ("th","en")}
    cache[h] = out
    return out
```

- [ ] **Step 4: Run test, verify PASS**

Run: `... -m pytest cosmetics/tests/test_gen_summaries.py -q`
Expected: PASS.

- [ ] **Step 5: Add `main()` that enriches master_db.json (no test; manual)**

Append to `cosmetics/gen_summaries.py`:
```python
def main() -> int:
    from cosmetics.build_master_db import MASTER_DB
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    cache = db.get("_summary_cache", {})
    client = AnthropicClient()
    for prod in db["products"].values():
        prod["llm_summary"] = product_summary(prod, client, cache)
    db["_summary_cache"] = cache
    MASTER_DB.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"summaries: {len(db['products'])} products")
    return 0

if __name__ == "__main__":
    import sys; sys.exit(main())
```

- [ ] **Step 6: Commit**

```bash
git add cosmetics/gen_summaries.py cosmetics/tests/test_gen_summaries.py
git commit -m "feat(cosmetics): cached Claude answer-first summaries"
```

---

### Task 7: Full suite + pipeline integration check

- [ ] **Step 1: Run the entire cosmetics test suite**

Run: `... -m pytest cosmetics/tests/ -q`
Expected: PASS (existing 16 + new ~13 = ~29 tests).

- [ ] **Step 2: Run the full build chain on real data**

Run: `... -m cosmetics.build_master_db` then (with `ANTHROPIC_API_KEY` set) `... -m cosmetics.gen_summaries`
Expected: `master_db.json` exists with `products`, `rankings.acne`, `rankings.whitening`, and each product has `ingredient_analysis`, `*_score`, `review_summary`, `llm_summary`.

- [ ] **Step 3: Spot-check a ranking**

Open `cosmetics/web/data/master_db.json`; confirm the top acne product has a high-efficacy acne active in `ingredient_analysis` and the top whitening product has Vitamin C / Niacinamide / Arbutin / Tranexamic. If not, revisit `ingredient_db.json` efficacy values.

- [ ] **Step 4: Commit any tuning**

```bash
git add cosmetics/web/data/ingredient_db.json
git commit -m "chore(cosmetics): tune ingredient efficacy from ranking spot-check"
```

---

## Open Items (carry to Plan 2 / later, from spec §10)
- Expand `ingredient_db.json` from the ~16-entry seed to the full ~40-60 acne/whitening set (same structure; data-entry task).
- Tune `BAYES_C`, `_EFFICACY_CAP`, `_FLAG_PENALTY`, value normalization against real rankings.
- Thai keyword extraction currently regex+stopwords; consider `pythainlp` tokenizer later.
- `affiliate_url` format is added in Plan 2 once Involve Asia signup yields the link template (external task).
