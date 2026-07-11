"""
hair_output/<city>/{clinics.csv, reviews/} → dbd-scraper/hair/thaihairguide_master.csv

build-data.mjs 가 읽는 포맷으로 변환. 주기적으로 실행하면 thaifacialclinic.com 데이터 갱신.
실행: .venv/Scripts/python.exe scripts/build_hair_master_csv.py
"""
from __future__ import annotations

import csv
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HAIR_OUT = ROOT / "hair_output"
OUT_CSV  = ROOT / "dbd-scraper" / "hair" / "thaihairguide_master.csv"

CITIES = ["bangkok", "phuket", "chiang_mai", "pattaya"]

CITY_LABELS = {
    "bangkok":    "Bangkok",
    "phuket":     "Phuket",
    "chiang_mai": "Chiang Mai",
    "pattaya":    "Pattaya",
}

HAIR_KEYWORDS = re.compile(
    r"hair|transplant|ผม|plu[ck]|fue|fut|dhi|prp|hairline|scalp|smp|trich|ปลูกผม",
    re.IGNORECASE,
)
EXCLUDE_KEYWORDS = re.compile(
    r"hair removal|laser hair|barber|hair salon|wig|beauty salon|hair color|แต่งผม|ทำสี",
    re.IGNORECASE,
)

KO_KEYWORDS = re.compile(r"korean|한국|naver|ko\b", re.IGNORECASE)
EN_KEYWORDS = re.compile(r"english|international|foreign|expat", re.IGNORECASE)


def is_hair_relevant(name: str, category: str) -> bool:
    txt = f"{name} {category}"
    if EXCLUDE_KEYWORDS.search(txt):
        return False
    return bool(HAIR_KEYWORDS.search(txt))


def in_thailand(clinic: dict) -> bool:
    """태국 좌표 범위 밖(DHI Colombo/Pune 등 해외 체인점) 차단.
    좌표 없으면 통과 (보조 필터)."""
    try:
        la = float(clinic.get("latitude") or "")
        ln = float(clinic.get("longitude") or "")
    except (TypeError, ValueError):
        return True
    return 5.5 <= la <= 20.6 and 97.2 <= ln <= 105.9


def load_reviews(reviews_dir: Path, place_id: str) -> list[dict]:
    """Load _reviews.csv for a given place_id (encoded as hex in filename)."""
    if not reviews_dir.exists():
        return []
    safe_id = place_id.replace(":", "_")
    rev_file = reviews_dir / f"{safe_id}_reviews.csv"
    if not rev_file.exists():
        return []
    rows = []
    try:
        with open(rev_file, encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                rows.append({
                    "source":   "google",
                    "reviewer": row.get("author_name", ""),
                    "rating":   row.get("rating"),
                    "date":     row.get("relative_date", ""),
                    "text":     row.get("text", "")[:400],
                })
    except Exception:
        pass
    return rows


def build_row(clinic: dict, city_name: str, reviews: list[dict]) -> dict:
    """Map bangkokclinics scraper output → thaihairguide_master.csv row."""
    name     = clinic.get("name", "")
    category = clinic.get("primary_type", "")
    place_id = clinic.get("place_id", "")
    rating   = clinic.get("rating", "")
    total_r  = clinic.get("total_reviews", "")
    address  = clinic.get("formatted_address", "") or clinic.get("address", "")
    phone    = clinic.get("phone", "")
    website  = clinic.get("website", "")
    maps_url = clinic.get("maps_url", "")

    top_review = reviews[0] if reviews else {}
    avg_rating = ""
    if reviews:
        vals = [float(r["rating"]) for r in reviews if r.get("rating")]
        if vals:
            avg_rating = f"{sum(vals)/len(vals):.2f}"

    # Language detection from category / editorial summary
    editorial = clinic.get("editorial_summary", "")
    is_ko = bool(KO_KEYWORDS.search(f"{name} {editorial} {category}"))
    is_en = bool(EN_KEYWORDS.search(f"{name} {editorial} {category}"))

    # Procedures — infer from category
    procs: list[str] = []
    cat_l = category.lower()
    name_l = name.lower()
    txt = cat_l + " " + name_l
    if "fue" in txt:      procs.append("FUE")
    if "dhi" in txt:      procs.append("DHI")
    if "smp" in txt or "scalp micro" in txt: procs.append("SMP")
    if "prp" in txt:      procs.append("PRP")
    if "beard" in txt:    procs.append("Beard Transplant")
    if "eyebrow" in txt:  procs.append("Eyebrow Transplant")
    if not procs and is_hair_relevant(name, category):
        procs = ["FUE", "DHI"]  # default for hair transplant clinics

    return {
        "place_id":              place_id,
        "name":                  name,
        "address":               address,
        "city":                  CITY_LABELS.get(city_name, "Bangkok"),
        "rating":                rating,
        "review_count":          total_r,
        "phone":                 phone,
        "website":               website,
        "category":              category,
        "google_maps_url":       maps_url,
        # Bookimed — not scraped in this pipeline
        "bookimed_slug":         "",
        "bookimed_url":          "",
        "bookimed_price_from":   "",
        # Reviews
        "reviews_scraped_count": len(reviews),
        "avg_scraped_rating":    avg_rating,
        "top_review_text":       top_review.get("text", "")[:600],
        "top_review_source":     top_review.get("source", ""),
        "reviews_json":          json.dumps(reviews[:10], ensure_ascii=False),
        # Photos / Videos — not in this pipeline
        "photo_urls_json":       "[]",
        "top_photo_url":         "",
        "videos_json":           "[]",
        "top_video_id":          "",
        "top_video_title":       "",
        "photos_count":          "0",
        "videos_count":          "0",
        # Website enrichment — not in this pipeline
        "website_email":         "",
        "website_facebook":      "",
        "website_instagram":     "",
        "website_line_id":       "",
        "website_main_content":  "",
        # Signals
        "procedures":            ",".join(procs),
        "is_hair_relevant":      "True" if is_hair_relevant(name, category) else "False",
        "is_korean_friendly":    "True" if is_ko else "False",
        "is_english_friendly":   "True" if is_en else "False",
        "is_chinese_friendly":   "False",
        "is_arabic_friendly":    "False",
    }


def main():
    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)

    all_rows: list[dict] = []
    seen_ids: set[str] = set()

    for city in CITIES:
        city_dir    = HAIR_OUT / city
        clinics_csv = city_dir / "clinics.csv"
        reviews_dir = city_dir / "reviews"

        if not clinics_csv.exists():
            print(f"[build_hair] 스킵 (없음): {clinics_csv}")
            continue

        with open(clinics_csv, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            rows = list(reader)

        added = 0
        for clinic in rows:
            pid = clinic.get("place_id", "")
            if not pid or pid in seen_ids:
                continue
            name = clinic.get("name", "")
            cat  = clinic.get("primary_type", "")
            if not is_hair_relevant(name, cat):
                continue
            if not in_thailand(clinic):
                continue
            reviews = load_reviews(reviews_dir, pid)
            row = build_row(clinic, city, reviews)
            all_rows.append(row)
            seen_ids.add(pid)
            added += 1

        print(f"[build_hair] {city}: {added}개 추가 (총 {len(rows)}개 중)")

    if not all_rows:
        print("[build_hair] 데이터 없음 — hair_output/ 스크래핑 먼저 실행하세요.")
        return

    fieldnames = list(all_rows[0].keys())
    with open(OUT_CSV, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"[build_hair] 완료: {len(all_rows)}개 클리닉 → {OUT_CSV}")


if __name__ == "__main__":
    main()
