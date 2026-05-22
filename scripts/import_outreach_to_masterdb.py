"""outreach_hdmall_discovered.csv + outreach_missed_clinics.csv → master_db.json.

Stub Clinic 레코드로 추가 (place_id, name, rating, reviews만 있음). 추후 watchdog
Bangkok grid + review가 돌아가면 자연스럽게 풍부화됨 (place_id 일치하면 덮어쓰기).

품질 필터:
- 이미 master_db에 있는 place_id → skip
- name에 spa/salon/massage 있으면 skip (false positive)
- reviews < 5 인데 rating도 없으면 skip
"""
from __future__ import annotations

import csv
import json
import math
import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[1]
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
EXTRA_FILE = ROOT / "web" / "data" / "extra_clinics.json"  # 영구 stubs — master rebuild 와 무관
HDMALL_CSV = ROOT / "outreach_hdmall_discovered.csv"
MISSED_CSV = ROOT / "outreach_missed_clinics.csv"

NAME_BLOCK_RE = re.compile(
    r"\b(spa|massage|salon|cafe|restaurant|barbershop|car\s*wash|"
    r"hotel|condo|apartment|fitness|gym|laundry|coffee|bakery)\b", re.I
)
NAME_ALLOW_RE = re.compile(
    r"\b(clinic|dental|dentist|medical|aesthetic|aesthetique|derm|skin|hair|"
    r"eye|laser|plastic|surgery|surgeon|hospital|wellness|anti.aging|"
    r"ปลูกผม|คลินิก|ทันตกรรม|เวชกรรม|ศูนย์|โรงพยาบาล|ผิว|จัดฟัน)\b", re.I
)


def trust_score(rating: float, total_reviews: int) -> float:
    if rating <= 0 or total_reviews <= 0:
        return 0.0
    rating_part = (rating / 5.0) * 50
    volume_part = min(40, math.log10(max(1, total_reviews)) * 12)
    return round(min(100.0, rating_part + volume_part), 1)


def safe_float(s: str) -> float:
    if not s:
        return 0.0
    try:
        return float(s)
    except Exception:
        return 0.0


def safe_int(s: str) -> int:
    if not s:
        return 0
    try:
        return int(float(s))
    except Exception:
        return 0


def name_passes_filter(name: str) -> bool:
    if not name:
        return False
    if NAME_BLOCK_RE.search(name):
        return False
    if NAME_ALLOW_RE.search(name):
        return True
    # 외래어/태국어 단어가 없어도 단순 영문 X Clinic 류는 통과 (clinic 위에서 캐치됨)
    return False


def make_stub(place_id: str, name: str, rating: float, reviews: int, lat: float | None, lng: float | None, maps_url: str, match_confidence: float = 1.0) -> dict:
    return {
        "id": place_id,
        "place_id": place_id,
        "name": name,
        "name_lang": "en" if re.search(r"[A-Za-z]", name) else "th",
        "primary_type": "Medical clinic",  # 기본 (실제 데이터는 추후 watchdog가 갱신)
        "address": "",
        "city_label": "Bangkok",
        "city_slug": "bangkok",
        "district": "",
        "phone": "",
        "website": "",
        "lat": lat,
        "lng": lng,
        "rating": rating,
        "total_reviews": reviews,
        "trust_score": trust_score(rating, reviews),
        "categories": [],
        "scraped_review_count": 0,
        "local_guide_count": 0,
        "avg_author_review_count": 0,
        "language_breakdown": {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0},
        "service_mentions": {},
        "mentioned_topics": [],
        "rating_trend": {
            "recent": {"count": 0, "avg": None},
            "midterm": {"count": 0, "avg": None},
            "old": {"count": 0, "avg": None},
            "trend": "insufficient_data",
        },
        "sample_reviews_th": [],
        "sample_reviews_en": [],
        "sample_reviews_ko": [],
        "business_status": "Open",
        "maps_url": maps_url,
        "_stub": True,  # marker — 추후 watchdog가 갱신 시 덮어씀
        "_match_confidence": match_confidence,  # 0~1. lookup 매칭 신뢰도. admin 검토용
        "_needs_review": match_confidence < 0.6,  # 0.6 미만은 사람이 확인 필요
    }


def main() -> int:
    if not MASTER_DB.exists():
        print(f"NOT FOUND: {MASTER_DB}", file=sys.stderr)
        return 1
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    existing_pids = {c.get("place_id", "") for c in db["clinics"]}
    # extra_clinics.json 도 기존 stub 으로 카운트 (중복 import 방지)
    if EXTRA_FILE.exists():
        prior_extra = json.loads(EXTRA_FILE.read_text(encoding="utf-8"))
        for c in prior_extra.get("clinics", []):
            existing_pids.add(c.get("place_id", ""))
        print(f"loaded prior extra_clinics: {len(prior_extra.get('clinics', []))}")
    print(f"master_db: {len(db['clinics'])} clinics, total unique place_ids: {len(existing_pids)}")

    new_clinics: list[dict] = []
    skipped_dup = 0
    skipped_filter = 0
    skipped_no_pid = 0

    # 1) HDmall discovered (59 검증된 신규)
    if HDMALL_CSV.exists():
        with HDMALL_CSV.open("r", encoding="utf-8", newline="") as f:
            for row in csv.DictReader(f):
                pid = row.get("place_id", "").strip()
                if not pid:
                    skipped_no_pid += 1
                    continue
                if pid in existing_pids:
                    skipped_dup += 1
                    continue
                name = row.get("found_name", "").strip() or row.get("brand_name", "").strip()
                if not name_passes_filter(name):
                    skipped_filter += 1
                    continue
                lat = safe_float(row.get("lat", "")) or None
                lng = safe_float(row.get("lng", "")) or None
                rating = safe_float(row.get("rating", ""))
                reviews = safe_int(row.get("reviews", ""))
                confidence = safe_float(row.get("match_confidence", "")) or 0.5  # 누락된 (구) row 는 중립
                stub = make_stub(pid, name, rating, reviews, lat, lng, row.get("maps_url", ""), match_confidence=confidence)
                stub["_source"] = "hdmall"
                new_clinics.append(stub)
                existing_pids.add(pid)
    print(f"HDmall pass: +{len([c for c in new_clinics if c.get('_source')=='hdmall'])} new, {skipped_dup} dup, {skipped_filter} filtered")

    n_hdmall_added = len(new_clinics)
    skipped_dup_2 = 0
    skipped_filter_2 = 0

    # 2) discovered_places missed (~651 후보 — 노이즈 많으므로 보수적으로)
    if MISSED_CSV.exists():
        with MISSED_CSV.open("r", encoding="utf-8", newline="") as f:
            for row in csv.DictReader(f):
                pid = row.get("place_id", "").strip()
                if not pid:
                    continue
                if pid in existing_pids:
                    skipped_dup_2 += 1
                    continue
                name = row.get("name", "").strip()
                reviews = safe_int(row.get("reviews", ""))
                rating = safe_float(row.get("rating", ""))
                # 보수적: 리뷰 10+ 또는 rating 4.5+ 만 (signal 있는 것)
                if reviews < 10 and rating < 4.5:
                    skipped_filter_2 += 1
                    continue
                if not name_passes_filter(name):
                    skipped_filter_2 += 1
                    continue
                stub = make_stub(pid, name, rating, reviews, None, None, row.get("maps_url", ""))
                stub["_source"] = "discovered_places"
                new_clinics.append(stub)
                existing_pids.add(pid)
    print(f"discovered_places pass: +{len(new_clinics)-n_hdmall_added} new, {skipped_dup_2} dup, {skipped_filter_2} filtered")

    if not new_clinics:
        print("No new clinics to add.")
        return 0

    # 기존 extra_clinics.json + 신규 합치기 (idempotent re-run 가능)
    prior: list[dict] = []
    if EXTRA_FILE.exists():
        prior = json.loads(EXTRA_FILE.read_text(encoding="utf-8")).get("clinics", [])
    all_extras = prior + new_clinics

    EXTRA_FILE.write_text(
        json.dumps({"clinics": all_extras, "generated_at": __import__("datetime").datetime.now().isoformat()}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"✓ Written: extra_clinics.json now {len(all_extras)} stubs (+{len(new_clinics)} new this run)")
    print("  master_db.json untouched — loader merges extra_clinics at runtime.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
