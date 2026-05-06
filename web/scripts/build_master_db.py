"""Master DB builder — enriched.

Reads bangkok_clinics scraper output and produces web/data/master_db.json
with full review analysis: language breakdown (TH/EN), mentioned phrases,
service mentions, rating trend. Re-runnable while scraper is live.
"""
from __future__ import annotations

import csv
import json
import math
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CLINIC_OUT = ROOT / "bangkok_clinics" / "output"
WEB_DATA = ROOT / "web" / "data"

csv.field_size_limit(min(2**31 - 1, sys.maxsize))


# ── District 추출 ─────────────────────────────────────────────
_DISTRICT_KEYS: list[tuple[str, list[str]]] = [
    ("Pathum Wan", ["pathum wan", "pathumwan", "siam"]),
    ("Watthana", ["watthana", "wattana", "thong lor", "thonglor", "ekkamai",
                  "asok", "asoke", "phrom phong", "promphong", "nana"]),
    ("Khlong Toei", ["khlong toei", "klongtoey", "klong toey"]),
    ("Bang Rak", ["bang rak", "bangrak", "silom", "sala daeng"]),
    ("Sathon", ["sathon", "sathorn"]),
    ("Phaya Thai", ["phaya thai", "phayathai", "ari", "saphan khwai"]),
    ("Ratchathewi", ["ratchathewi", "victory monument"]),
    ("Huai Khwang", ["huai khwang", "huaykhwang", "ratchada"]),
    ("Din Daeng", ["din daeng"]),
    ("Chatuchak", ["chatuchak", "lat yao", "phahonyothin"]),
    ("Bang Kapi", ["bang kapi"]),
    ("Lat Phrao", ["lat phrao", "latphrao"]),
    ("Wang Thonglang", ["wang thonglang"]),
    ("Phra Khanong", ["phra khanong", "prakhanong", "on nut", "onnut"]),
    ("Bang Na", ["bang na", "bangna"]),
    ("Suan Luang", ["suan luang"]),
    ("Yan Nawa", ["yan nawa", "yannawa"]),
    ("Bang Kho Laem", ["bang kho laem"]),
    ("Khlong San", ["khlong san"]),
    ("Thon Buri", ["thon buri", "thonburi"]),
    ("Bang Phlat", ["bang phlat"]),
    ("Phasi Charoen", ["phasi charoen"]),
    ("Bangkok Noi", ["bangkok noi"]),
    ("Bangkok Yai", ["bangkok yai"]),
    ("Don Mueang", ["don mueang", "donmueang"]),
    ("Lak Si", ["lak si"]),
    ("Bang Sue", ["bang sue"]),
    ("Dusit", ["dusit"]),
    ("Pom Prap Sattru Phai", ["pom prap"]),
    ("Samphanthawong", ["samphanthawong", "yaowarat", "chinatown"]),
    ("Phra Nakhon", ["phra nakhon", "rattanakosin"]),
    ("Min Buri", ["min buri", "minburi"]),
    ("Nong Chok", ["nong chok"]),
    ("Khan Na Yao", ["khan na yao"]),
    ("Saphan Sung", ["saphan sung"]),
    ("Bueng Kum", ["bueng kum"]),
    ("Lat Krabang", ["lat krabang", "latkrabang"]),
    ("Prawet", ["prawet"]),
    ("Bang Bon", ["bang bon"]),
    ("Nong Khaem", ["nong khaem"]),
    ("Bang Khae", ["bang khae"]),
    ("Taling Chan", ["taling chan"]),
    ("Thawi Watthana", ["thawi watthana"]),
    ("Khlong Sam Wa", ["khlong sam wa"]),
    ("Sai Mai", ["sai mai"]),
    ("Bang Khen", ["bang khen"]),
]


def extract_district(address: str) -> str:
    if not address:
        return ""
    a = address.lower()
    for canonical, aliases in _DISTRICT_KEYS:
        for alias in aliases:
            if alias in a:
                return canonical
    return ""


# ── 언어 감지 (TH / EN / other) ───────────────────────────────
# 태국어 unicode block: U+0E00-U+0E7F (Thai script).
_THAI_RE = re.compile(r"[฀-๿]")
_LATIN_RE = re.compile(r"[A-Za-z]")
_KOREAN_RE = re.compile(r"[가-힣ᄀ-ᇿ]")
_JAPANESE_RE = re.compile(r"[ぁ-ゟ゠-ヿ㐀-䷿一-龯]")


def detect_lang(text: str) -> str:
    """간단 분류: th / en / other.
    태국/한국/일본/영어/기타 분류."""
    if not text:
        return "other"
    total = len(text)
    if total == 0:
        return "other"
    ko = len(_KOREAN_RE.findall(text)) / total
    if ko > 0.15:
        return "ko"
    th = len(_THAI_RE.findall(text)) / total
    if th > 0.3:
        return "th"
    ja = len(_JAPANESE_RE.findall(text)) / total
    if ja > 0.2 and ko < 0.05:
        return "ja"
    lt = len(_LATIN_RE.findall(text)) / total
    if lt > 0.3 and th < 0.05 and ko < 0.05:
        return "en"
    return "other"


# ── 카테고리 키워드 (review 텍스트 매칭에도 재사용) ───────────
_CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "botox": ["botox", "botulinum", "botulax", "dysport", "xeomin",
              "บอท็อกซ์", "โบท็อกซ์", "โบ"],
    "filler": ["filler", "juvederm", "restylane", "belotero", "fillers",
               "ฟิลเลอร์", "ฟิล"],
    "hifu": ["hifu", "ulthera", "ultherapy", "thermage", "termage", "ultraformer"],
    "facial": ["facial", "skin care", "skincare", "skin treatment", "aesthetic",
               "beauty clinic", "ผิว"],
    "laser": ["laser", "ipl", "co2 laser", "fraxel", "pico", "เลเซอร์"],
    "dental": ["dental", "dentist", "tooth", "ทันตกรรม", "ฟัน"],
    "hair_transplant": ["hair transplant", "hair restoration", "scalp transplant"],
    "eye": ["lasik", "ophthalmology", "eye clinic"],
}


def tag_categories_from_text(text: str) -> set[str]:
    text_l = text.lower()
    found: set[str] = set()
    for cat, kws in _CATEGORY_KEYWORDS.items():
        if any(kw in text_l for kw in kws):
            found.add(cat)
    return found


def count_service_mentions(text: str) -> dict[str, int]:
    """리뷰 전체 텍스트에서 시술명 언급 횟수."""
    text_l = text.lower()
    counts: dict[str, int] = {}
    for cat, kws in _CATEGORY_KEYWORDS.items():
        n = 0
        for kw in kws:
            n += text_l.count(kw)
        if n > 0:
            counts[cat] = n
    return counts


# ── 토픽 / 멘션 구절 추출 ─────────────────────────────────────
# 자주 언급되는 클리닉 평가 키워드 (한국 사용자가 검색할 만한 것 제외 — TH/EN 만)
_TOPIC_PATTERNS: dict[str, list[str]] = {
    "genuine_brand":      ["genuine", "authentic", "original brand", "ของแท้", "แท้"],
    "english_speaking":   ["english", "english speaking", "speaks english", "พูดภาษาอังกฤษ"],
    "clean_facility":     ["clean", "cleanliness", "hygienic", "sterile", "สะอาด"],
    "long_wait":          ["long wait", "wait time", "waited", "ต้องรอ", "รอนาน"],
    "expensive":          ["expensive", "pricey", "overpriced", "แพง"],
    "affordable":         ["affordable", "cheap", "reasonable price", "good price",
                           "ไม่แพง", "ราคาดี", "ราคาถูก"],
    "professional":       ["professional", "experienced doctor", "professional staff",
                           "หมอเก่ง", "หมอดี", "มืออาชีพ"],
    "friendly_staff":     ["friendly", "kind staff", "polite", "พนักงานดี", "เป็นกันเอง"],
    "results_satisfied":  ["satisfied", "great results", "happy with", "พอใจ", "ผลลัพธ์ดี"],
    "no_pain":            ["no pain", "painless", "doesn't hurt", "ไม่เจ็บ"],
    "recommend":          ["recommend", "recommended", "would come back",
                           "แนะนำ", "จะมาอีก"],
    "korean_doctor":      ["korean doctor", "korean trained", "หมอเกาหลี"],
    "promotion":          ["promotion", "discount", "package deal", "โปรโมชั่น", "โปร"],
    "premium":            ["premium", "luxury", "high-end", "หรู"],
}


def extract_mentioned_topics(text: str) -> list[dict]:
    """리뷰 텍스트에서 토픽 매칭. 각 토픽당 매칭 횟수 리턴."""
    text_l = text.lower()
    found: list[dict] = []
    for topic, patterns in _TOPIC_PATTERNS.items():
        n = 0
        for pat in patterns:
            n += text_l.count(pat)
        if n > 0:
            found.append({"topic": topic, "count": n})
    found.sort(key=lambda x: -x["count"])
    return found


# ── 평점 트렌드 ───────────────────────────────────────────────
# Google Maps relative_date 패턴: "a week ago", "2 months ago", "a year ago", etc.
def _bucket_relative_date(rel: str) -> str:
    """recent (<3mo) / midterm (3-12mo) / old (>1yr) / unknown."""
    if not rel:
        return "unknown"
    r = rel.lower().strip()
    # Day / week / month / year 단위 + 숫자 또는 'a'
    if "day" in r or "hour" in r:
        return "recent"
    if "week" in r:
        return "recent"
    m = re.search(r"(\d+|a)\s*month", r)
    if m:
        n = 1 if m.group(1) == "a" else int(m.group(1))
        return "recent" if n < 3 else "midterm"
    m = re.search(r"(\d+|a)\s*year", r)
    if m:
        n = 1 if m.group(1) == "a" else int(m.group(1))
        return "midterm" if n < 1 else "old"  # "a year ago" 는 midterm 경계
    if "yesterday" in r or "today" in r:
        return "recent"
    return "unknown"


def compute_rating_trend(rows: list[dict]) -> dict:
    buckets: dict[str, list[float]] = {"recent": [], "midterm": [], "old": [], "unknown": []}
    for row in rows:
        try:
            rt = float(row.get("rating") or 0)
        except ValueError:
            continue
        if rt <= 0:
            continue
        b = _bucket_relative_date(row.get("relative_date", ""))
        buckets[b].append(rt)
    out = {}
    for k in ("recent", "midterm", "old"):
        ratings = buckets[k]
        out[k] = {
            "count": len(ratings),
            "avg": round(sum(ratings) / len(ratings), 2) if ratings else None,
        }
    # trend label
    rec = out["recent"]["avg"]
    old = out["old"]["avg"] if out["old"]["avg"] is not None else out["midterm"]["avg"]
    if rec is not None and old is not None:
        if rec - old >= 0.3:
            out["trend"] = "improving"
        elif old - rec >= 0.3:
            out["trend"] = "declining"
        else:
            out["trend"] = "stable"
    else:
        out["trend"] = "insufficient_data"
    return out


# ── 신뢰도 점수 ───────────────────────────────────────────────
def trust_score(rating: float, total_reviews: int,
                local_guide_count: int, scraped_review_count: int,
                avg_author_review_count: float) -> float:
    """0-100 친화. rating/volume/local-guide 비율/리뷰어 권위 가중."""
    if rating <= 0 or total_reviews <= 0:
        return 0.0
    rating_part = (rating / 5.0) * 50  # 0-50
    volume_part = min(40, math.log10(max(1, total_reviews)) * 12)  # 0-40
    lg_ratio = (local_guide_count / scraped_review_count) if scraped_review_count > 0 else 0
    lg_part = min(10, lg_ratio * 20)  # 0-10
    # 리뷰어 평균 리뷰수 100+ 면 추가 신뢰
    authority_part = min(5, math.log10(max(1, avg_author_review_count)) * 2)
    return round(rating_part + volume_part + lg_part + authority_part, 1)


# ── 좌표 fallback ─────────────────────────────────────────────
_COORDS_RE = re.compile(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)")


def coords_from_maps_url(url: str) -> tuple[float | None, float | None]:
    if not url:
        return None, None
    m = _COORDS_RE.search(url)
    if m:
        return float(m.group(1)), float(m.group(2))
    return None, None


# ── 리뷰 분석 (메인 enrichment) ───────────────────────────────
def analyze_reviews(reviews_dir: Path, place_id: str) -> dict:
    """reviews/<pid>_reviews.csv 분석.
    리턴: scraped_count, local_guide_count, avg_author_review_count,
    language_breakdown, service_mentions, mentioned_topics, rating_trend,
    sample_reviews_th, sample_reviews_en, derived_categories."""
    fn = place_id.replace(":", "_")
    p = reviews_dir / f"{fn}_reviews.csv"
    empty = {
        "scraped_count": 0,
        "local_guide_count": 0,
        "avg_author_review_count": 0.0,
        "language_breakdown": {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0},
        "service_mentions": {},
        "mentioned_topics": [],
        "rating_trend": {"recent": {"count": 0, "avg": None},
                         "midterm": {"count": 0, "avg": None},
                         "old": {"count": 0, "avg": None},
                         "trend": "insufficient_data"},
        "sample_reviews_th": [],
        "sample_reviews_en": [],
        "sample_reviews_ko": [],
        "derived_categories": [],
    }
    if not p.exists():
        return empty

    rows: list[dict] = []
    try:
        with open(p, encoding="utf-8-sig", errors="replace", newline="") as f:
            for row in csv.DictReader(f):
                rows.append(row)
    except Exception:
        return empty

    if not rows:
        return empty

    scraped = len(rows)
    lg = sum(1 for r in rows
             if str(r.get("author_is_local_guide", "0")).strip() in ("1", "1.0"))
    arc_list: list[int] = []
    for r in rows:
        try:
            arc_list.append(int(float(r.get("author_review_count") or 0)))
        except ValueError:
            pass
    avg_arc = sum(arc_list) / len(arc_list) if arc_list else 0.0

    # 언어 분류 + 텍스트 누적
    lang_count = {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0}
    text_chunks_by_lang: dict[str, list[tuple[str, int, str]]] = {
        "th": [], "en": [], "ko": [], "ja": [], "other": []
    }
    for r in rows:
        text = (r.get("text") or "").strip()
        if not text:
            continue
        lang = detect_lang(text)
        lang_count[lang] += 1
        try:
            rt = int(float(r.get("rating") or 0))
        except ValueError:
            rt = 0
        text_chunks_by_lang[lang].append((text, rt, r.get("author_name", "")))

    # 전체 텍스트 통합 (서비스 멘션/토픽 추출용)
    all_text = " ".join(t for chunks in text_chunks_by_lang.values()
                        for t, _, _ in chunks)

    services = count_service_mentions(all_text)
    topics = extract_mentioned_topics(all_text)
    categories = sorted(tag_categories_from_text(all_text))

    # 샘플 리뷰: 언어별 평점 4-5점 우선, 길이 80-300자.
    def pick_samples(chunks: list[tuple[str, int, str]], n: int = 3):
        good = [c for c in chunks if 80 <= len(c[0]) <= 300 and c[1] >= 4]
        good.sort(key=lambda x: -x[1])
        return [{"text": t, "rating": r, "author": a} for t, r, a in good[:n]]

    return {
        "scraped_count": scraped,
        "local_guide_count": lg,
        "avg_author_review_count": round(avg_arc, 1),
        "language_breakdown": lang_count,
        "service_mentions": services,
        "mentioned_topics": topics,
        "rating_trend": compute_rating_trend(rows),
        "sample_reviews_th": pick_samples(text_chunks_by_lang["th"]),
        "sample_reviews_en": pick_samples(text_chunks_by_lang["en"]),
        "sample_reviews_ko": pick_samples(text_chunks_by_lang["ko"]),
        "derived_categories": categories,
    }


# ── 메인 ──────────────────────────────────────────────────────
def main():
    clinics_csv = CLINIC_OUT / "clinics.csv"
    reviews_dir = CLINIC_OUT / "reviews"
    if not clinics_csv.exists():
        print(f"NOT FOUND: {clinics_csv}", file=sys.stderr)
        sys.exit(1)

    WEB_DATA.mkdir(parents=True, exist_ok=True)
    out_path = WEB_DATA / "master_db.json"

    clinics: list[dict] = []
    district_counter: Counter[str] = Counter()
    category_counter: Counter[str] = Counter()
    lang_total = Counter()

    with open(clinics_csv, encoding="utf-8-sig", errors="replace", newline="") as f:
        for row in csv.DictReader(f):
            place_id = (row.get("place_id") or "").strip()
            name = (row.get("name") or "").strip()
            if not place_id or not name:
                continue

            try:
                rating = float(row.get("rating") or 0)
            except ValueError:
                rating = 0.0
            try:
                total_reviews = int(float(row.get("total_reviews") or 0))
            except ValueError:
                total_reviews = 0

            address = (row.get("formatted_address") or "").strip()
            district = extract_district(address)
            if district:
                district_counter[district] += 1

            review_sig = analyze_reviews(reviews_dir, place_id)

            # 카테고리: primary_type + name + derived_categories 합집합
            base_cat_set = tag_categories_from_text(
                f"{row.get('primary_type', '')} {name}"
            )
            categories = sorted(base_cat_set | set(review_sig["derived_categories"]))
            for c in categories:
                category_counter[c] += 1

            for lang, n in review_sig["language_breakdown"].items():
                lang_total[lang] += n

            ts = trust_score(
                rating, total_reviews,
                review_sig["local_guide_count"],
                review_sig["scraped_count"],
                review_sig["avg_author_review_count"],
            )

            lat, lng = None, None
            try:
                if row.get("latitude"):
                    lat = float(row["latitude"])
                if row.get("longitude"):
                    lng = float(row["longitude"])
            except ValueError:
                pass
            if lat is None:
                lat, lng = coords_from_maps_url(row.get("maps_url", ""))

            # name 의 언어로 도메인 노출 우선순위 결정 (en 우선, th 보조)
            name_lang = detect_lang(name)

            clinics.append({
                "id": place_id.replace(":", "_"),
                "place_id": place_id,
                "name": name,
                "name_lang": name_lang,
                "primary_type": row.get("primary_type", ""),
                "address": address,
                "district": district,
                "phone": row.get("phone", ""),
                "website": row.get("website", ""),
                "lat": lat,
                "lng": lng,
                "rating": rating,
                "total_reviews": total_reviews,
                "trust_score": ts,
                "categories": categories,
                "scraped_review_count": review_sig["scraped_count"],
                "local_guide_count": review_sig["local_guide_count"],
                "avg_author_review_count": review_sig["avg_author_review_count"],
                "language_breakdown": review_sig["language_breakdown"],
                "service_mentions": review_sig["service_mentions"],
                "mentioned_topics": review_sig["mentioned_topics"],
                "rating_trend": review_sig["rating_trend"],
                "sample_reviews_th": review_sig["sample_reviews_th"],
                "sample_reviews_en": review_sig["sample_reviews_en"],
                "business_status": row.get("business_status", ""),
                "maps_url": row.get("maps_url", ""),
            })

    # 정렬: trust_score 내림차순
    clinics.sort(key=lambda c: (-c["trust_score"], -c["total_reviews"]))

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_clinics": len(clinics),
        "with_district": sum(1 for c in clinics if c["district"]),
        "with_categories": sum(1 for c in clinics if c["categories"]),
        "with_reviews_scraped": sum(1 for c in clinics if c["scraped_review_count"] > 0),
        "language_total": dict(lang_total),
        "district_counts": dict(district_counter.most_common()),
        "category_counts": dict(category_counter.most_common()),
        "clinics": clinics,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"[OK] wrote {out_path}")
    print(f"  clinics: {len(clinics)}")
    print(f"  with district: {payload['with_district']}")
    print(f"  with categories: {payload['with_categories']}")
    print(f"  with reviews scraped: {payload['with_reviews_scraped']}")
    print(f"  review languages (TH/EN/other): {dict(lang_total)}")
    print(f"  top districts: {list(district_counter.most_common(5))}")
    print(f"  category counts: {dict(category_counter.most_common())}")


if __name__ == "__main__":
    main()
