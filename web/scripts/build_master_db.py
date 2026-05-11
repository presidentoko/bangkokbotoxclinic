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
WEB_DATA = ROOT / "web" / "data"

# 멀티시티 클리닉 데이터 소스. 도시 추가 시 여기 한 줄.
# 외국인 인기 순서. Pattaya 클리닉 scraper 가동 후 자동으로 합쳐짐.
SOURCES: list[dict] = [
    {
        "city_label": "Bangkok",
        "city_slug": "bangkok",
        "clinics_csv": ROOT / "bangkok_clinics" / "output" / "clinics.csv",
        "reviews_dir": ROOT / "bangkok_clinics" / "output" / "reviews",
    },
    {
        "city_label": "Pattaya",
        "city_slug": "pattaya",
        "clinics_csv": ROOT / "pattaya" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "pattaya" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Phuket",
        "city_slug": "phuket",
        "clinics_csv": ROOT / "phuket" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "phuket" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Chiang Mai",
        "city_slug": "chiang-mai",
        "clinics_csv": ROOT / "chiang_mai" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "chiang_mai" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Koh Samui",
        "city_slug": "koh-samui",
        "clinics_csv": ROOT / "koh_samui" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "koh_samui" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Krabi",
        "city_slug": "krabi",
        "clinics_csv": ROOT / "krabi" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "krabi" / "clinics_output" / "reviews",
    },
    {
        "city_label": "Hua Hin",
        "city_slug": "hua-hin",
        "clinics_csv": ROOT / "hua_hin" / "clinics_output" / "clinics.csv",
        "reviews_dir": ROOT / "hua_hin" / "clinics_output" / "reviews",
    },
]

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

# 다른 도시의 district / 관광지 키워드. 외국인 인기 도시 위주.
_PATTAYA_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Naklua", ["naklua", "wong amat"]),
    ("Central Pattaya", ["central pattaya", "pattaya central", "soi buakhao"]),
    ("South Pattaya", ["south pattaya", "walking street"]),
    ("Pratamnak", ["pratamnak", "pratumnak"]),
    ("Jomtien", ["jomtien", "jomthien", "dongtan"]),
    ("Bang Lamung", ["bang lamung", "banglamung"]),
    ("Nong Prue", ["nong prue"]),
    ("Huai Yai", ["huai yai", "huay yai"]),
]

_PHUKET_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Patong", ["patong"]),
    ("Karon", ["karon"]),
    ("Kata", ["kata noi", "kata yai", " kata "]),
    ("Kamala", ["kamala"]),
    ("Surin", ["surin beach", "bang tao"]),
    ("Cherng Talay", ["cherng talay", "cherngtalay", "laguna phuket"]),
    ("Rawai", ["rawai", "naiharn", "nai harn"]),
    ("Chalong", ["chalong"]),
    ("Phuket Town", ["phuket town", "muang phuket", "old town phuket"]),
    ("Kathu", ["kathu"]),
    ("Mai Khao", ["mai khao", "nai yang"]),
]

_CHIANG_MAI_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Old City", ["old city chiang mai", "tha phae", "ratchadamnoen"]),
    ("Nimman", ["nimman", "nimmanhaemin", "santitham"]),
    ("Chang Khlan", ["chang khlan", "night bazaar"]),
    ("Hang Dong", ["hang dong"]),
    ("Mae Rim", ["mae rim"]),
    ("San Sai", ["san sai", "sansai"]),
    ("Saraphi", ["saraphi"]),
    ("Mueang Chiang Mai", ["mueang chiang mai"]),
]

_KOH_SAMUI_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Chaweng", ["chaweng"]),
    ("Lamai", ["lamai"]),
    ("Bophut", ["bophut", "fisherman's village"]),
    ("Maenam", ["maenam", "mae nam"]),
    ("Choeng Mon", ["choeng mon"]),
    ("Nathon", ["nathon", "na thon"]),
    ("Lipa Noi", ["lipa noi"]),
]

_KRABI_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Ao Nang", ["ao nang", "aonang"]),
    ("Krabi Town", ["krabi town", "muang krabi"]),
    ("Klong Muang", ["klong muang", "khlong muang"]),
    ("Tubkaek", ["tubkaek", "tub kaek"]),
    ("Railay", ["railay", "rai leh"]),
]

_HUA_HIN_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Hua Hin Town", ["hua hin town", "muang hua hin"]),
    ("Khao Tao", ["khao tao"]),
    ("Cha-am", ["cha-am", "cha am", "chaam"]),
    ("Pranburi", ["pranburi", "pran buri"]),
]

# city_label → districts dict. extract_district 가 사용.
_DISTRICTS_BY_CITY: dict[str, list[tuple[str, list[str]]]] = {
    "Bangkok": _DISTRICT_KEYS,
    "Pattaya": _PATTAYA_DISTRICTS,
    "Phuket": _PHUKET_DISTRICTS,
    "Chiang Mai": _CHIANG_MAI_DISTRICTS,
    "Koh Samui": _KOH_SAMUI_DISTRICTS,
    "Krabi": _KRABI_DISTRICTS,
    "Hua Hin": _HUA_HIN_DISTRICTS,
}


def extract_district(address: str, city_label: str = "Bangkok") -> str:
    """주소에서 도시별 district 추출. 도시 매핑 없으면 빈 문자열."""
    if not address:
        return ""
    a = address.lower()
    keys = _DISTRICTS_BY_CITY.get(city_label, _DISTRICT_KEYS)
    for canonical, aliases in keys:
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
# ── Doctor mention extraction ─────────────────────────────────
# 리뷰 텍스트에서 의사 이름 추출. EN/TH/KO 패턴.
# 영어: "Dr. Sirikul" / "Doctor Park Min" / "Dr Bhumi"
# 태국어: "หมอ Sirikul" / "นพ.ภูมิ" / "พญ.สิริกุล"
# 한국어: "박 선생님" / "민준 선생님"
DR_EN_RE = re.compile(r"\b(?:Dr\.?|Doctor)\s+([A-Z][\w'\-]+(?:\s+[A-Z][\w'\-]+){0,2})\b")
DR_TH_RE = re.compile(r"(?:หมอ|นพ\.|พญ\.|แพทย์)\s*([ก-๛A-Za-z]+(?:\s+[ก-๛A-Za-z]+)?)")
DR_KO_RE = re.compile(r"([가-힣]{2,4})\s*선생(?:님)?")

# 흔한 false positive (영어 인사말/대명사/장소명)
DOCTOR_BLOCKLIST = {
    "the", "this", "that", "but", "and", "for", "with", "she", "her", "him", "his",
    "you", "they", "their", "very", "really", "so", "all", "every", "highly",
    "bangkok", "thailand", "korea", "japan", "asia", "clinic", "doctor", "medical",
    "smith", "john", "jane",  # generic placeholders sometimes appearing in templates
}


def _normalize_doctor_name(raw: str) -> str:
    """공백 정리, title case, max 3 단어, blocklist 필터."""
    s = re.sub(r"\s+", " ", raw).strip().rstrip(".,;:!?")
    if not s or len(s) > 50:
        return ""
    tokens = s.split()
    if not tokens:
        return ""
    # blocklist 첫 token 제거
    if tokens[0].lower() in DOCTOR_BLOCKLIST:
        return ""
    # English 일 때 title case
    if all(re.fullmatch(r"[A-Za-z'\-]+", t) for t in tokens):
        tokens = [t.capitalize() for t in tokens[:3]]
    else:
        tokens = tokens[:3]
    return " ".join(tokens)


def extract_doctors(text: str) -> list[str]:
    """텍스트에서 의사 이름 추출 (normalized)."""
    if not text:
        return []
    names = []
    for m in DR_EN_RE.finditer(text):
        n = _normalize_doctor_name(m.group(1))
        if n:
            names.append(n)
    for m in DR_TH_RE.finditer(text):
        n = _normalize_doctor_name(m.group(1))
        if n:
            names.append(n)
    for m in DR_KO_RE.finditer(text):
        n = _normalize_doctor_name(m.group(1))
        if n:
            names.append(n)
    return names


def doctor_slug(name: str) -> str:
    """URL 슬러그 — ASCII transliteration 없이 lowercase + dash."""
    s = name.lower()
    s = re.sub(r"[^\w\s가-힣ก-๛-]", "", s)
    s = re.sub(r"\s+", "-", s).strip("-")
    return s[:50]


def analyze_reviews(reviews_dir: Path, place_id: str, clinic_name: str = "") -> dict:
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
        "doctor_stats": [],
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

    # 언어 분류 + 텍스트 누적 + 의사 mention 집계
    lang_count = {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0}
    text_chunks_by_lang: dict[str, list[tuple[str, int, str]]] = {
        "th": [], "en": [], "ko": [], "ja": [], "other": []
    }
    # doctor name → { ratings: [], lang_count: {}, sample: str }
    doctor_data: dict[str, dict] = {}
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

        # 의사 mention — 한 리뷰에 여러 의사 가능
        mentioned = set(extract_doctors(text))
        for doc in mentioned:
            d = doctor_data.setdefault(doc, {
                "ratings": [], "lang_count": {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0},
                "samples": [],
            })
            d["ratings"].append(rt)
            d["lang_count"][lang] += 1
            # 짧고 좋은 sample 후보 (50-250자, rating ≥ 4)
            if 50 <= len(text) <= 250 and rt >= 4 and len(d["samples"]) < 2:
                d["samples"].append({"text": text, "rating": rt, "lang": lang})

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

    # 부정 리뷰 샘플 — B2B dashboard 의 review-reply 초안 + competitor weakness 용.
    # 평점 1-3, 길이 60-400자. 가장 낮은 평점 우선 (최악 먼저).
    def pick_negative(chunks: list[tuple[str, int, str]], n: int = 3):
        all_lang: list[tuple[str, int, str]] = []
        for _lang, lst in text_chunks_by_lang.items():
            all_lang.extend(lst)
        bad = [c for c in all_lang if 60 <= len(c[0]) <= 400 and c[1] <= 3 and c[1] >= 1]
        bad.sort(key=lambda x: (x[1], -len(x[0])))  # rating asc, length desc
        return [{"text": t, "rating": r, "author": a} for t, r, a in bad[:n]]

    # 의사별 집계 — mention 2회 이상만 채택, top 10
    # 클리닉 이름과 겹치는 단어는 false positive (예: "Dr.Balance Clinic" → "Balance")
    clinic_words = set()
    if clinic_name:
        clinic_words = {w.lower() for w in re.findall(r"[A-Za-z]{2,}", clinic_name)}
    doctor_stats: list[dict] = []
    for doc_name, d in doctor_data.items():
        if len(d["ratings"]) < 2:
            continue  # 1회 mention 은 노이즈
        # 클리닉 이름 단어와 매칭되면 skip
        doc_tokens = {t.lower() for t in doc_name.split() if re.fullmatch(r"[A-Za-z]+", t)}
        if doc_tokens and doc_tokens.issubset(clinic_words):
            continue
        avg = sum(d["ratings"]) / len(d["ratings"])
        primary_lang = max(d["lang_count"].items(), key=lambda kv: kv[1])[0]
        doctor_stats.append({
            "name": doc_name,
            "slug": doctor_slug(doc_name),
            "mentions": len(d["ratings"]),
            "rating_avg": round(avg, 2),
            "language_count": d["lang_count"],
            "primary_lang": primary_lang,
            "samples": d["samples"],
        })
    doctor_stats.sort(key=lambda x: -x["mentions"])
    doctor_stats = doctor_stats[:10]

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
        "sample_reviews_negative": pick_negative(text_chunks_by_lang, n=3),
        "doctor_stats": doctor_stats,
        "derived_categories": categories,
    }


# ── 단일 도시 처리 ────────────────────────────────────────────
def process_source(
    source: dict,
    clinics: list[dict],
    district_counter: Counter,
    category_counter: Counter,
    city_counter: Counter,
    lang_total: Counter,
    seen_place_ids: set[str],
) -> int:
    """source 한 도시의 clinics.csv 읽어 clinics 리스트에 append. 처리 건수 반환.
    csv 없으면 0 반환 (Pattaya 등 아직 scrape 안 된 도시).
    seen_place_ids: 이미 다른 도시에서 처리한 place_id 는 skip (CSV 내 또는 도시간 중복). """
    csv_path: Path = source["clinics_csv"]
    reviews_dir: Path = source["reviews_dir"]
    city_label: str = source["city_label"]
    city_slug: str = source["city_slug"]
    if not csv_path.exists():
        return 0

    n = 0
    with open(csv_path, encoding="utf-8-sig", errors="replace", newline="") as f:
        for row in csv.DictReader(f):
            place_id = (row.get("place_id") or "").strip()
            name = (row.get("name") or "").strip()
            if not place_id or not name:
                continue
            if place_id in seen_place_ids:
                continue
            seen_place_ids.add(place_id)

            try:
                rating = float(row.get("rating") or 0)
            except ValueError:
                rating = 0.0
            try:
                total_reviews = int(float(row.get("total_reviews") or 0))
            except ValueError:
                total_reviews = 0

            address = (row.get("formatted_address") or "").strip()
            district = extract_district(address, city_label)
            if district:
                district_counter[district] += 1
            city_counter[city_label] += 1

            review_sig = analyze_reviews(reviews_dir, place_id, clinic_name=name)

            base_cat_set = tag_categories_from_text(
                f"{row.get('primary_type', '')} {name}"
            )
            categories = sorted(base_cat_set | set(review_sig["derived_categories"]))
            for c in categories:
                category_counter[c] += 1

            for lang, k in review_sig["language_breakdown"].items():
                lang_total[lang] += k

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

            name_lang = detect_lang(name)

            clinics.append({
                "id": place_id.replace(":", "_"),
                "place_id": place_id,
                "name": name,
                "name_lang": name_lang,
                "primary_type": row.get("primary_type", ""),
                "address": address,
                "city_label": city_label,
                "city_slug": city_slug,
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
                "sample_reviews_negative": review_sig.get("sample_reviews_negative", []),
                "doctor_stats": review_sig.get("doctor_stats", []),
                "business_status": row.get("business_status", ""),
                "maps_url": row.get("maps_url", ""),
            })
            n += 1
    return n


def merge_external_data(clinics: list[dict]) -> None:
    """data/external_reviews/{clinic_id}.json + data/pricing/{clinic_id}.json merge."""
    ext_dir = WEB_DATA / "external_reviews"
    price_dir = WEB_DATA / "pricing"
    ext_n = 0
    price_n = 0
    for c in clinics:
        cid = c["id"]
        ext_file = ext_dir / f"{cid}.json"
        if ext_file.exists():
            try:
                c["external_reviews"] = json.loads(ext_file.read_text(encoding="utf-8"))
                ext_n += 1
            except Exception as e:
                print(f"[merge ext] {cid} err: {e}", file=sys.stderr)
        price_file = price_dir / f"{cid}.json"
        if price_file.exists():
            try:
                data = json.loads(price_file.read_text(encoding="utf-8"))
                c["pricing"] = data if isinstance(data, list) else data.get("prices", [])
                price_n += 1
            except Exception as e:
                print(f"[merge price] {cid} err: {e}", file=sys.stderr)
    if ext_n or price_n:
        print(f"[merge] external_reviews={ext_n}, pricing={price_n}")


# ── 메인 ──────────────────────────────────────────────────────
def main():
    bangkok_csv = SOURCES[0]["clinics_csv"]
    if not bangkok_csv.exists():
        print(f"NOT FOUND: {bangkok_csv}", file=sys.stderr)
        sys.exit(1)

    WEB_DATA.mkdir(parents=True, exist_ok=True)
    out_path = WEB_DATA / "master_db.json"

    clinics: list[dict] = []
    district_counter: Counter[str] = Counter()
    category_counter: Counter[str] = Counter()
    city_counter: Counter[str] = Counter()
    lang_total = Counter()
    seen_place_ids: set[str] = set()

    per_city_counts: list[tuple[str, int]] = []
    for source in SOURCES:
        n = process_source(
            source, clinics, district_counter, category_counter,
            city_counter, lang_total, seen_place_ids,
        )
        per_city_counts.append((source["city_label"], n))

    # External reviews + pricing 통합 (scraper가 채워두는 데이터 merge)
    merge_external_data(clinics)

    clinics.sort(key=lambda c: (-c["trust_score"], -c["total_reviews"]))

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_clinics": len(clinics),
        "with_district": sum(1 for c in clinics if c["district"]),
        "with_categories": sum(1 for c in clinics if c["categories"]),
        "with_reviews_scraped": sum(1 for c in clinics if c["scraped_review_count"] > 0),
        "language_total": dict(lang_total),
        "city_counts": dict(city_counter.most_common()),
        "district_counts": dict(district_counter.most_common()),
        "category_counts": dict(category_counter.most_common()),
        "clinics": clinics,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"[OK] wrote {out_path}")
    print(f"  clinics: {len(clinics)}")
    for label, n in per_city_counts:
        print(f"    {label}: {n}")
    print(f"  with district: {payload['with_district']}")
    print(f"  with categories: {payload['with_categories']}")
    print(f"  with reviews scraped: {payload['with_reviews_scraped']}")
    print(f"  review languages (TH/EN/other): {dict(lang_total)}")
    print(f"  top districts: {list(district_counter.most_common(5))}")
    print(f"  category counts: {dict(category_counter.most_common())}")


if __name__ == "__main__":
    main()
