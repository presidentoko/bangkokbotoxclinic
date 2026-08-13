"""Apify Google Maps export → master_db.json (Thai Supply Hub edition).

Input (자동 glob):
- Place files: 'crawler-google-places' + 'google-maps-extractor' JSON
- Review files: 'Google-Maps-Reviews-Scraper' JSON
- 검색 디렉토리: ~/Desktop, ~/Downloads, ~/Downloads/공단/공단/{이름만,리뷰}

Output: web-factory/data/master_db.json

스키마는 기존 supplier 형식 유지하되 review 데이터가 있으면 풍부하게 채움:
- scraped_review_count, language_breakdown, mentioned_topics
- sample_reviews_en/th/ko
- trust_score 에 review coverage + avg text length 가산.
"""
from __future__ import annotations

import json
import math
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[2]
WEB_DATA = ROOT / "web-factory" / "data"

HOME = Path.home()
APIFY_SEARCH_DIRS = [
    # Primary — drop new Apify exports here. Consolidated so raw scrape dumps
    # aren't scattered across Desktop/Downloads (which made prior batches easy
    # to lose — the 2026-07-14 batch sat unmerged in Downloads for weeks).
    WEB_DATA / "apify_raw",
    HOME / "Desktop",
    HOME / "Downloads",
    HOME / "Downloads" / "with review 리뷰",
    HOME / "Downloads" / "공단" / "공단" / "이름만",
    HOME / "Downloads" / "공단" / "공단" / "리뷰",
    HOME / "Desktop" / "공단" / "공단",
    HOME / "Desktop" / "공단" / "공단" / "이름만",
    HOME / "Desktop" / "공단" / "공단" / "리뷰",
]

PLACE_FILE_PATTERNS = [
    "dataset_crawler-google-places_*.json",
    "dataset_google-maps-extractor_*.json",
]
REVIEW_FILE_PATTERNS = [
    "dataset_Google-Maps-Reviews-Scraper_*.json",
]


def find_files(patterns: list[str]) -> list[Path]:
    out: list[Path] = []
    seen: set[str] = set()
    for d in APIFY_SEARCH_DIRS:
        if not d.exists():
            continue
        # apify_raw is organized into dated subfolders (data/apify_raw/2026-07-14/...),
        # so it needs a recursive glob; the legacy Desktop/Downloads paths hold files
        # directly and a recursive glob there would be slow and pick up unrelated junk.
        globber = d.rglob if d == WEB_DATA / "apify_raw" else d.glob
        for pat in patterns:
            for p in globber(pat):
                if p.name in seen:
                    continue
                seen.add(p.name)
                out.append(p)
    return sorted(out)


_PLACE_ID_RE = re.compile(r"query_place_id=([\w-]+)")


def extract_place_id(url: str) -> str:
    if not url:
        return ""
    m = _PLACE_ID_RE.search(url)
    return m.group(1) if m else ""


# ── enrichment 보존 ──────────────────────────────────────────
# Apify export 에 애초에 존재하지 않는 필드들. 다른 파이프라인 단계가 붙인 것이라
# 겹치는 place_id 를 만나도 무조건 기존 값을 살린다.
#   build_db_from_csv.py  : verified / dbd / yp / estate / photos / 좌표 / b2b_score
#   merge_contact_emails.py: email / emails_all / linkedin
PRESERVE_ALWAYS = (
    "verified", "dbd", "yp", "halal_certified", "estate_name", "estate_slug",
    "years_in_business", "is_consumer", "b2b_score", "province_en", "lat", "lng",
    "hero_image", "photos", "external_reviews", "email", "emails_all", "linkedin",
)
# Apify 도 채우긴 하지만 비어서 올 때가 있는 필드 — 비었을 때만 기존 값으로 메운다.
PRESERVE_IF_EMPTY = ("phone", "website", "address", "district", "business_status")
# 리뷰 파생값은 한 덩어리로 움직여야 한다. 이번 배치에 리뷰 파일이 없어서
# scraped_review_count 가 0 으로 나오면 CSV 쪽 리뷰 통계를 통째로 되살린다.
REVIEW_DERIVED = (
    "scraped_review_count", "language_breakdown", "mentioned_topics",
    "sample_reviews_th", "sample_reviews_en", "sample_reviews_ko",
)


def merge_enrichment(new: dict, old: dict) -> bool:
    """old 의 enrichment 를 new 에 얹는다. 바뀐 게 있으면 True."""
    changed = False
    for k in PRESERVE_ALWAYS:
        v = old.get(k)
        if v not in (None, "", [], {}) and new.get(k) != v:
            new[k] = v
            changed = True
    for k in PRESERVE_IF_EMPTY:
        if not new.get(k) and old.get(k):
            new[k] = old[k]
            changed = True
    if not new.get("scraped_review_count") and old.get("scraped_review_count"):
        for k in REVIEW_DERIVED:
            if old.get(k) is not None:
                new[k] = old[k]
        changed = True
    # trust_score 는 Apify 가 리뷰 기반으로 다시 계산한다. CSV 의 b2b_score 가 더 많은
    # 신호(DBD·공단·사진)를 보고 매긴 점수라 그쪽이 있으면 그걸 쓴다 — 사이트의
    # computeTrustScore 도 b2b_score 를 우선한다.
    if old.get("b2b_score"):
        new["trust_score"] = old["b2b_score"]
    return changed


# ── 언어 감지 (review text) ───────────────────────────────────
_THAI_RE = re.compile(r"[฀-๿]")
_LATIN_RE = re.compile(r"[A-Za-z]")
_KOREAN_RE = re.compile(r"[가-힣ᄀ-ᇿ]")
_JAPANESE_RE = re.compile(r"[ぁ-ゟ゠-ヿ]")
_CHINESE_RE = re.compile(r"[一-鿿]")


def detect_lang(text: str) -> str:
    if not text:
        return "other"
    total = len(text)
    ko = len(_KOREAN_RE.findall(text)) / total
    if ko > 0.15:
        return "ko"
    th = len(_THAI_RE.findall(text)) / total
    if th > 0.3:
        return "th"
    ja = len(_JAPANESE_RE.findall(text)) / total
    if ja > 0.2 and ko < 0.05:
        return "ja"
    zh = len(_CHINESE_RE.findall(text)) / total
    if zh > 0.3 and ja < 0.1:
        return "zh"
    lt = len(_LATIN_RE.findall(text)) / total
    if lt > 0.3 and th < 0.05 and ko < 0.05:
        return "en"
    return "other"


# ── B2B supplier 토픽 패턴 ────────────────────────────────────
_TOPIC_PATTERNS: dict[str, list[str]] = {
    "high_quality":      ["high quality", "great quality", "premium quality", "excellent quality", "top quality"],
    "poor_quality":      ["poor quality", "bad quality", "defective", "low quality", "subpar"],
    "on_time":           ["on time", "fast delivery", "quick turnaround", "prompt delivery", "delivered on time"],
    "delayed":           ["delayed", "late delivery", "slow delivery", "took forever", "behind schedule"],
    "english_support":   ["english speaking", "english support", "speak english", "communicate in english", "english staff"],
    "chinese_support":   ["chinese speaking", "mandarin", "中文"],
    "korean_support":    ["korean speaking", "한국어", "korean staff"],
    "japanese_support":  ["japanese speaking", "日本語", "japanese staff"],
    "responsive":        ["responsive", "quick reply", "fast response", "quick response", "reply quickly"],
    "unresponsive":      ["no response", "unresponsive", "ignored", "never replied", "no reply"],
    "competitive_price": ["competitive price", "good price", "affordable", "reasonable price", "great value"],
    "expensive":         ["expensive", "overpriced", "high price", "pricey"],
    "low_moq":           ["low moq", "low minimum", "small order", "small batch"],
    "oem_odm":           ["oem", "odm", "private label", "custom order", "custom design", "customizable"],
    "export_ready":      ["export", "shipping worldwide", "international shipping", "international order", "global shipping"],
    "iso_certified":     ["iso certified", "iso 9001", "iso 14001", "certified", "certification"],
    "food_safety":       ["haccp", "fssc 22000", "fssc22000", "gmp certified", "halal"],
    "factory_tour":      ["factory tour", "factory visit", "showroom visit", "site visit", "showroom"],
    "experienced":       ["experienced", "since 19", "since 20", "decades", "established", "long history"],
    "modern_machinery":  ["modern machinery", "state of the art", "advanced equipment", "modern equipment", "automated"],
    "friendly_staff":    ["friendly staff", "helpful staff", "professional team", "great staff", "kind staff"],
    "good_packaging":    ["packaging", "packed well", "well packed", "good packaging"],
    "bulk_orders":       ["bulk order", "wholesale", "container load", "large order"],
    "samples_available": ["sample", "samples available", "free sample", "send a sample"],
    "warehouse_large":   ["large warehouse", "huge warehouse", "spacious warehouse", "warehouse space"],
    "good_location":     ["good location", "convenient location", "easy access", "near port", "near highway"],
    "clean_facility":    ["clean facility", "clean factory", "well organized", "tidy", "well-maintained"],
    "outdated":          ["outdated", "old equipment", "old machinery", "needs upgrade"],
}


def extract_topics(text: str) -> list[dict]:
    text_l = text.lower()
    out: list[dict] = []
    for topic, patterns in _TOPIC_PATTERNS.items():
        n = sum(text_l.count(p) for p in patterns)
        if n > 0:
            out.append({"topic": topic, "count": n})
    out.sort(key=lambda x: -x["count"])
    return out


# ── 공장/공단/창고/물류 키워드 ─────────────────────────────────
SUPPLY_KEYWORDS = (
    "manufacturer", "manufacturing", "factory", "plant",
    "industrial", "warehouse", "logistics", "fabricat",
    "machining", "packaging",
    "corporate office", "exporter", "machinery",
    "auto parts", "rubber", "textile", "steel", "metal",
    "chemical", "electronic", "plastic",
)

EXCLUDE_CATEGORIES = {
    "butcher shop", "restaurant", "store", "outlet store",
    "beauty salon", "hair salon", "convenience store",
    "supermarket", "cafe", "coffee shop", "bar",
    "shopping mall", "fast food restaurant",
    "mattress store", "toy store", "jewelry store",
    "lighting store", "hardware store", "department store",
    "grocery store", "clothing store", "shoe store",
    "furniture store", "bicycle store", "sportwear store", "sportswear store",
    "gas station", "petrol station",
    "tourist attraction", "atm", "bank",
    "used auto parts store", "auto parts store",
    "car repair and maintenance service", "car wash",
    "plant nursery", "wholesale plant nursery", "garden center",
    "lodging", "hotel", "motel", "resort", "hostel",
    "apartment complex", "apartment building", "condominium complex",
    "self-storage facility", "electronics store",
    "auto repair shop", "tire shop", "car dealer",
    "wholesale market", "market", "flea market",
    "laundry service", "dry cleaning service",
    "health spa", "massage therapist", "spa",
    "pharmacy", "drug store", "hospital", "clinic",
    "school", "university", "kindergarten",
    "temple", "church", "mosque",
    "car rental agency", "travel agency",
    "event venue", "banquet hall", "golf course",
    "swimming pool", "gym", "fitness center",
    "warehouse store", "wholesale store",
    "family restaurant", "food court", "bakery", "dessert shop",
    "real estate agency", "real estate developer",
    "jewelry manufacturer",
    "fashion accessories store", "fashion designer",
    "electronics company",
}

INDUSTRIAL_ESTATE_NAME_SIGNALS = (
    "industrial estate", "industrial park", "industrial zone", "industrial city",
    "amata", "wha", "hemaraj", "rojana", "saha group",
    "pinthong", "pingthong", "lat krabang", "navanakorn", "bangchan",
    "bangpoo", "bang poo", "map ta phut", "laem chabang",
    "ihp", "304 industrial",
)


def has_estate_signal(title: str) -> bool:
    t = (title or "").lower()
    return any(sig in t for sig in INDUSTRIAL_ESTATE_NAME_SIGNALS)


_REAL_ESTATE_CATEGORIES = {
    "real estate agency", "real estate developer", "real estate agent",
    "industrial real estate agency", "commercial real estate agency",
    "real estate consultant", "property management company",
    "housing development", "apartment building", "condominium complex",
}


_SUPPLY_CATEGORY_MAP: dict[str, list[str]] = {
    "manufacturer":      ["manufacturer"],
    "auto_parts":        ["auto parts manufacturer", "automotive parts"],
    "factory":           ["factory", "car factory"],
    "warehouse":         ["warehouse", "storage"],
    "industrial_estate": ["industrial real estate", "industrial park", "industrial zone"],
    "logistics":         ["logistics", "distribution"],
    "food_mfg":          ["food manufacturer", "frozen food", "food product"],
    "electronics":       ["electronics manufacturer"],
    "chemical":          ["chemical manufacturer"],
    "plastic":           ["plastic"],
    "steel":             ["steel", "metal fabricator"],
    "machining":         ["machining", "mechanical plant"],
    "equipment":         ["equipment supplier", "industrial equipment", "factory equipment"],
    "corporate_office":  ["corporate office", "headquarters"],
    "packaging":         ["packaging"],
    "rubber":            ["rubber"],
    "textile":           ["textile"],
    "machinery":         ["machinery"],
    "exporter":          ["exporter"],
}


def tag_supply_categories(raw_cats: list[str], category_name: str, title: str) -> list[str]:
    haystack = " | ".join([(c or "").lower() for c in raw_cats] + [(category_name or "").lower()])
    title_has_estate = has_estate_signal(title)
    found: list[str] = []
    for tag, kws in _SUPPLY_CATEGORY_MAP.items():
        if not any(kw in haystack for kw in kws):
            continue
        if tag == "industrial_estate" and not title_has_estate:
            continue
        found.append(tag)
    return found


HARD_EXCLUDE_NAME = (
    "factory outlet", "brand outlet", "outlet store", "outlet center",
    "outlet mall", "outlet village",
    "experience shop", "experience center", "flagship store",
    "pantip", "central world", "central festival", "central plaza",
    "terminal 21", "robinson", "big c", "lotus", "makro",
    "index living", "the mall", "homepro", "home pro", "global house",
    "self store", "u store", "istoreich",
    "adidas", "nike", "samsung experience", "apple store",
    "jewelry outlet", "jewellery outlet",
)

SOFT_EXCLUDE_NAME = (
    "outlet", "b-quik",
    "condo", "condominium", "apartment", "residence", "village",
    "school", "hospital", "temple", "church", "mosque",
    "resort", "hotel", "golf",
    "shopping mall", "department store", "supermarket",
    "spa", "salon", "massage",
)

KEEP_OVERRIDE_KWS = ("industrial estate", "industrial park", "manufacturing")


# EXCLUDE_CATEGORIES 는 완전일치로만 비교돼서 두 갈래로 샜다.
#
#   1) "restaurant" 는 걸리지만 "Italian restaurant" / "Thai restaurant" 는 통과.
#   2) 아래 all() 은 카테고리가 하나라도 목록 밖이면 통과시킨다. The Deli Factory 는
#      Restaurant·Bakery·Supermarket·Pizza Takeout 등 10개를 달고도 "Deli" 와
#      "Delivery service" 가 목록에 없어서 살아남았다.
#
# 그 결과 9,056건 중 197건(2.2%)이 소비자 업소였다. 상당수는 이름에 factory 가
# 들어가서 SUPPLY_KEYWORDS 최종 관문까지 통과한 것들이다 — "The barber factory",
# "Nail Factory Central", "Fun Factory Boardgame Cafe".
#
# 그래서 부분일치로 바꾸되, 대상을 "store"/"shop"/"service" 같은 일반명사가 아니라
# 소비자 업종을 특정하는 어휘로 한정한다. 그런 낱말이 없으면 예전과 똑같이 동작한다.
CONSUMER_TOKENS = (
    "restaurant", "cafe", "coffee shop", "coffee roastery", "bakery", "dessert",
    "ice cream", "candy", "confectionery", "chocolate", "salad shop", "food court",
    "noodle", "street food", "bar & grill", "live music bar", "pub",
    "hotel", "motel", "resort", "hostel", "guest house", "homestay", "lodging",
    "spa", "salon", "barber", "nail ", "massage", "tattoo", "piercing",
    "clinic", "hospital", "dental", "pharmacy", "drug store", "veterinar",
    "school", "college", "university", "kindergarten", "tutoring",
    "temple", "church", "mosque", "shrine",
    "gym", "fitness", "yoga", "bowling", "cinema", "karaoke", "amusement",
    "tourist", "travel agency", "souvenir", "board game", "art studio",
    "convenience store", "supermarket", "hypermarket", "grocery",
    "department store", "shopping mall", "thrift store", "second hand store",
    "cosmetics store", "lingerie", "clothing store", "youth clothing",
    "toy store", "gift shop", "baby store", "pet ", "florist",
    "car wash", "car dealer", "car rental", "car stereo",
    "apartment", "condominium", "housing development", "housing complex",
    "laundry", "dry clean",
    # 개인 물건을 고쳐주는 가게. "truck repair" / "hydraulic repair" 같은 산업용
    # 수리는 건드리지 않도록 대상을 하나씩 적는다.
    "electronics repair", "electrical repair", "mobile phone repair",
    "computer repair", "motorcycle repair", "appliance repair",
    # 생활용품 소매. 여기서도 "store" 같은 일반명사는 쓰지 않는다.
    "appliance store", "home goods", "home improvement", "cell phone",
    "computer store", "copy shop", "work clothes", "dairy store",
    "car battery", "vitamin", "health and beauty", "toiletries",
    "kitchen furniture", "antique furniture", "outdoor furniture",
)
# 이 낱말이 같은 카테고리 문자열에 있으면 소비자 판정을 취소한다.
# "auto parts manufacturer" 를 "auto parts store" 와 함께 떨구지 않기 위한 장치.
B2B_TOKENS = (
    "manufactur", "wholesal", "industrial", "factory", "plant", "supplier",
    "distributor", "export", "import", "logistic", "freight", "warehouse",
    "oem", "machining", "fabricat", "contract", "b2b", "packaging",
)


def _consumer_score(strings: list[str]) -> tuple[int, int]:
    """(소비자 신호 수, B2B 신호 수). 카테고리 문자열 단위로 센다."""
    consumer = b2b = 0
    for s in strings:
        s = (s or "").lower()
        if not s:
            continue
        has_b2b = any(t in s for t in B2B_TOKENS)
        if has_b2b:
            b2b += 1
        elif any(t in s for t in CONSUMER_TOKENS):
            consumer += 1
    return consumer, b2b


# 이게 하나라도 붙어 있으면 다수결과 무관하게 남긴다.
# 소매 간판을 같이 단 제조업체가 있다 — "เดอะโชว์" 는 Costume store·Clothing store 와
# 함께 Clothes and fabric manufacturer 를, "Masota Chocolate" 은 Coffee shop 과 함께
# Chocolate factory 를 달고 있다. 공장을 가진 곳을 매장 간판 수로 떨구면 안 된다.
STRONG_KEEP_TOKENS = (
    "manufactur", "factory", "oem", "odm", "fabricat", "foundry", "refinery",
    "industrial estate", "industrial park", "mill",
)


# 상호에 있으면 카테고리와 무관하게 남긴다.
#
# 구글이 붙이는 카테고리가 자주 틀린다. Siam Yamato Steel(대형 철강사)은
# "Home improvement store", Kamar Silver Factory and Exporting 은 "Body piercing
# shop", Life by NK OEM Factory 는 "Vitamin & supplements store" 로 분류돼 있다.
#
# "factory" 자체는 여기 넣지 않는다 — 태국에서 상호 장식으로 흔히 쓴다
# ("The barber factory", "Nail Factory Central", "Salad Factory", "Keep Factory").
# 장식으로 쓰이지 않는 낱말만 고른다.
#
# 이 목록은 놓치는 쪽(소비자 업소가 남는 것)보다 잘못 떨구는 쪽(실제 공급사가
# 사라지는 것)의 손해가 크다는 판단으로 넉넉하게 잡았다. 남은 미용실 한 곳은
# 등급이 낮아 어차피 noindex 지만, 지워진 제조사는 재고와 색인 대상 페이지를
# 통째로 잃는다.
STRONG_KEEP_NAME = (
    "oem", "odm", "manufactur", "export", "industr", "supply", "supplies",
    "steel", "chemical", "plastic", "rubber", "textile", "packaging",
    "machinery", "foundry", "logistics", "warehouse",
    # "<산업재> factory" 형태 — 상호 장식이 아니라 실제 생산시설을 가리킨다.
    # (MVP Garment Factory, Gel Supplement Factory, JKINTERFOODS FACTORY,
    #  Dura' Kitchen Factory 1, Traditional Bamboo Handcraft factory)
    "garment", "supplement", "kitchen", "bamboo", "extract",
    "handcraft", "handicraft", "interfood", "food company",
    "โรงงาน", "โรงกลึง", "โรงสี",
)


def looks_consumer(category_name: str, categories: list[str], title: str = "") -> bool:
    """소비자 업소로 볼 것인가. 카테고리들의 다수결."""
    cn = (category_name or "").lower()
    cats = [(c or "").lower() for c in (categories or [])]

    if any(t in s for s in [cn, *cats] for t in STRONG_KEEP_TOKENS):
        return False
    if any(t in (title or "").lower() for t in STRONG_KEEP_NAME):
        return False

    # 대표 카테고리 자체가 소비자 업종이면 그것으로 끝. Google 이 첫 번째로 붙인
    # 분류라 가장 신뢰도가 높다.
    if cn and not any(t in cn for t in B2B_TOKENS) and any(t in cn for t in CONSUMER_TOKENS):
        return True

    consumer, b2b = _consumer_score(cats)
    return consumer > 0 and consumer > b2b


def is_supply(p: dict) -> bool:
    cats = p.get("categories") or []
    category_name = p.get("categoryName") or ""
    title = p.get("title") or ""

    cat_l = [(c or "").lower() for c in cats]
    cn_l = category_name.lower()

    # primary_type 이 명시적 제외 목록이면 즉시 탈락
    if cn_l in EXCLUDE_CATEGORIES:
        return False
    if cat_l and all(c in EXCLUDE_CATEGORIES for c in cat_l):
        return False
    if looks_consumer(category_name, cats, title):
        return False

    title_l = title.lower()

    if any(sig in title_l for sig in HARD_EXCLUDE_NAME):
        return False

    if any(sig in title_l for sig in SOFT_EXCLUDE_NAME):
        if not any(k in title_l for k in KEEP_OVERRIDE_KWS):
            return False

    is_real_estate = cn_l in _REAL_ESTATE_CATEGORIES or any(c in _REAL_ESTATE_CATEGORIES for c in cat_l)
    if is_real_estate and not has_estate_signal(title):
        return False

    haystack = f"{' '.join(cat_l)} {cn_l} {title_l}"
    return any(k in haystack for k in SUPPLY_KEYWORDS)


# ── 신뢰도 점수 ───────────────────────────────────────────────
def trust_score(rating: float, total_reviews: int,
                scraped_review_count: int = 0,
                avg_text_length: float = 0) -> float:
    """0-100. rating 50 + volume 40 + coverage 5 + text_length 5."""
    if rating <= 0 or total_reviews <= 0:
        return 0.0
    rating_part = (rating / 5.0) * 50
    volume_part = min(40, math.log10(max(1, total_reviews)) * 12)
    coverage = scraped_review_count / max(1, total_reviews) if total_reviews else 0
    coverage_part = min(5, coverage * 50)
    text_part = min(5, math.log10(max(1, avg_text_length)) * 1.5)
    return round(rating_part + volume_part + coverage_part + text_part, 1)


def slugify(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_") or "thailand"


def main():
    WEB_DATA.mkdir(parents=True, exist_ok=True)
    out_path = WEB_DATA / "master_db.json"

    place_files = find_files(PLACE_FILE_PATTERNS)
    review_files = find_files(REVIEW_FILE_PATTERNS)
    print(f"Place files found: {len(place_files)}")
    for path in place_files:
        print(f"  P  {path.name}")
    print(f"Review files found: {len(review_files)}")
    for path in review_files:
        print(f"  R  {path.name}")
    print()

    # 1. Places 로드 + dedupe (place_id 기준)
    places_by_id: dict[str, dict] = {}
    raw_total = 0
    for path in place_files:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        raw_total += len(data)
        for raw in data:
            url = raw.get("url", "")
            pid = extract_place_id(url)
            if not pid:
                continue
            if pid not in places_by_id:
                places_by_id[pid] = {**raw, "_place_id": pid, "_url_decoded": unquote(url)}

    print(f"Raw place records: {raw_total}")
    print(f"Unique by place_id: {len(places_by_id)}")

    # 2. Thailand + supply 필터
    thai_supply = {pid: p for pid, p in places_by_id.items()
                   if (p.get("countryCode") or "").upper() == "TH" and is_supply(p)}
    print(f"Thailand supply records: {len(thai_supply)}")

    # 3. Reviews 로드 + dedupe + group by place_id
    reviews_by_pid: dict[str, list[dict]] = defaultdict(list)
    seen_review_keys: set[tuple] = set()
    raw_review_total = 0
    for path in review_files:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        raw_review_total += len(data)
        for r in data:
            url = r.get("url", "") or r.get("reviewUrl", "")
            text = (r.get("text") or "")[:120]
            stars = r.get("stars")
            name = r.get("name") or ""
            key = (url, stars, text, name)
            if key in seen_review_keys:
                continue
            seen_review_keys.add(key)
            pid = extract_place_id(url)
            if pid:
                reviews_by_pid[pid].append(r)

    total_unique_reviews = sum(len(v) for v in reviews_by_pid.values())
    print(f"Raw review records: {raw_review_total}")
    print(f"Unique reviews after dedupe: {total_unique_reviews}")
    print(f"Suppliers with at least 1 review: {sum(1 for pid in thai_supply if reviews_by_pid.get(pid))}")
    print()

    # 4. Build supplier records
    suppliers: list[dict] = []
    state_counter: Counter[str] = Counter()
    category_counter: Counter[str] = Counter()
    primary_type_counter: Counter[str] = Counter()
    district_counter: Counter[str] = Counter()
    lang_total = Counter()

    # 화면과 schema.org Review 마크업에 실릴 리뷰를 고른다.
    #
    # 예전 기준은 `60 <= len <= 350 and stars >= 4` 에 별점 내림차순 정렬이었고,
    # 두 군데가 문제였다.
    #
    # 길이 — 태국어는 정보 밀도가 높아서 60자 하한이 실질적인 본문을 잘라냈다.
    # 수집한 53,427 건 중 통과가 14,836 건뿐이었다. 실제 텍스트를 구간별로 확인해
    # 보면 15~24자는 "ของดี ราคาถูกครับ"(좋고 쌉니다) 같은 상투구지만, 30자부터는
    # "เป็นบริษัทผลิตชิ้นส่วนอะไหล่รถยนต์"(자동차 부품 제조사) 처럼 내용이 있다.
    # 그래서 하한을 30 으로 내리고 상한을 600 으로 올렸다.
    #
    # 별점 — 이게 더 큰 문제였다. 이 샘플은 components/JsonLd.tsx 가 reviewRating
    # 붙은 Review 로 내보내는데, 같은 페이지의 aggregateRating 은 구글 전체 평점을
    # 쓴다. 전체를 대표한다고 하면서 4★ 이상만 마크업하는 건 구글 리뷰 스니펫
    # 정책이 금지하는 선별 표시다. 별점 하한을 없앴다.
    #
    # 정렬도 별점 내림차순이었다 — 통과한 것 중에서도 좋은 것부터 담으니 같은
    # 선별이 한 번 더 걸린다.
    #
    # 그렇다고 단순히 길이순으로 담으면 반대쪽으로 치우친다. 실측하면 1★ 리뷰는
    # 평균 153자, 5★ 는 76자다 — 불만은 길게 쓰고 만족은 짧게 쓴다. 길이순 정렬만
    # 넣었더니 샘플의 1★ 비중이 원본 9.3% 에서 16% 로 뛰었다.
    #
    # 그래서 슬롯을 그 supplier 자신의 별점 분포대로 배분하고(최대잉여법), 배분된
    # 별점 안에서 가장 긴 리뷰를 고른다. 규칙이 별점의 높낮이를 보지 않으므로
    # 선별이 아니고, 결과가 aggregateRating 과 어긋나지도 않는다.
    def pick_samples(chunks: list[tuple[str, int, str]], n: int = 3):
        good = [c for c in chunks if 30 <= len(c[0]) <= 600]
        if not good:
            return []
        by_rating: dict[int, list[tuple[str, int, str]]] = {}
        for c in good:
            by_rating.setdefault(c[1], []).append(c)
        for v in by_rating.values():
            v.sort(key=lambda x: -len(x[0]))

        # 최대잉여법: 정수 몫을 먼저 주고, 남은 슬롯은 소수부가 큰 순으로.
        total = len(good)
        quota = {r: len(v) * n / total for r, v in by_rating.items()}
        take = {r: min(int(q), len(by_rating[r])) for r, q in quota.items()}
        left = n - sum(take.values())
        for r in sorted(quota, key=lambda r: (-(quota[r] - int(quota[r])), -len(by_rating[r]))):
            if left <= 0:
                break
            if take[r] < len(by_rating[r]):
                take[r] += 1
                left -= 1

        picked = [c for r, k in take.items() for c in by_rating[r][:k]]
        picked.sort(key=lambda x: -len(x[0]))
        return [{"text": t, "rating": r, "author": a or "Google reviewer"}
                for t, r, a in picked[:n]]

    for pid, p in thai_supply.items():
        name = (p.get("title") or "").strip()
        if not name:
            continue

        try:
            rating = float(p.get("totalScore") or 0)
        except (TypeError, ValueError):
            rating = 0.0
        try:
            total_reviews = int(p.get("reviewsCount") or 0)
        except (TypeError, ValueError):
            total_reviews = 0

        state = (p.get("state") or "").strip()
        state_norm = re.sub(r"[:;].*$", "", state).strip()
        if state_norm.lower() in ("chonbri",):
            state_norm = "Chonburi"
        if state_norm.lower() == "chon buri":
            state_norm = "Chon Buri"

        city_district = (p.get("city") or "").strip()

        if state_norm:
            state_counter[state_norm] += 1
        if city_district:
            district_counter[f"{slugify(state_norm or 'thailand')}/{city_district}"] += 1

        raw_cats = p.get("categories") or []
        if not raw_cats and p.get("categoryName"):
            raw_cats = [p["categoryName"]]
        category_name = p.get("categoryName") or ""
        if category_name:
            primary_type_counter[category_name] += 1

        tags = tag_supply_categories(raw_cats, category_name, name)
        for t in tags:
            category_counter[t] += 1

        street = (p.get("street") or "").strip()
        address = ", ".join(filter(None, [street, city_district, state_norm, "Thailand"]))

        # Reviews
        revs = reviews_by_pid.get(pid, [])
        scraped_count = len(revs)

        all_text = " ".join((r.get("text") or "") for r in revs)
        topics = extract_topics(all_text) if all_text else []

        lang_count = {"th": 0, "en": 0, "ko": 0, "ja": 0, "zh": 0, "other": 0}
        chunks_by_lang: dict[str, list[tuple[str, int, str]]] = {
            "th": [], "en": [], "ko": [], "ja": [], "zh": [], "other": []
        }
        for r in revs:
            text = (r.get("text") or "").strip()
            if not text:
                continue
            lang = detect_lang(text)
            lang_count[lang] += 1
            try:
                stars = int(r.get("stars") or 0)
            except (ValueError, TypeError):
                stars = 0
            chunks_by_lang[lang].append((text, stars, r.get("name") or ""))

        for k, v in lang_count.items():
            lang_total[k] += v

        text_lengths = [len(t) for t in [r.get("text") or "" for r in revs] if t]
        avg_len = sum(text_lengths) / len(text_lengths) if text_lengths else 0

        ts = trust_score(rating, total_reviews, scraped_count, avg_len)

        # language_breakdown은 schema 호환 위해 5-key (zh 제외)
        lang_breakdown_compat = {k: lang_count.get(k, 0) for k in ("th", "en", "ko", "ja", "other")}
        lang_breakdown_compat["other"] += lang_count.get("zh", 0)

        suppliers.append({
            "id": pid,
            "place_id": pid,
            "name": name,
            "primary_type": category_name.strip(),
            "address": address,
            "city": slugify(state_norm or "thailand"),
            "city_label": state_norm or "Thailand",
            "district": city_district,
            "phone": (p.get("phone") or "").strip(),
            "website": (p.get("website") or "").strip(),
            "lat": None,
            "lng": None,
            "rating": rating,
            "total_reviews": total_reviews,
            "trust_score": ts,
            "categories": tags,
            "raw_categories": raw_cats,
            "image_url": (p.get("imageUrl") or "").strip(),
            "scraped_review_count": scraped_count,
            "language_breakdown": lang_breakdown_compat,
            "mentioned_topics": topics,
            "sample_reviews_th": pick_samples(chunks_by_lang["th"]),
            "sample_reviews_en": pick_samples(chunks_by_lang["en"]),
            "sample_reviews_ko": pick_samples(chunks_by_lang["ko"]),
            "maps_url": p.get("url", ""),
            "menu_url": "",
            "price_level": "",
            "price_symbol": "",
            "local_guide_count": 0,
            "avg_author_review_count": 0,
            "cuisine_mentions": {},
            "rating_trend": {
                "recent":  {"count": 0, "avg": None},
                "midterm": {"count": 0, "avg": None},
                "old":     {"count": 0, "avg": None},
                "trend": "insufficient_data",
            },
            "business_status": "",
        })

    # 5. 기존 master_db.json 과 머지 (place_id 기준) + 기존 항목도 재필터
    #
    # 겹치는 place_id 는 예전엔 기존 레코드를 통째로 버리고 Apify 레코드로 갈아치웠다.
    # Apify 가 들고 오는 건 rating / review / category 뿐인데, 버려지는 쪽에는
    # build_db_from_csv.py 가 붙여둔 DBD·사진·공단·좌표와 merge_contact_emails.py 가
    # 붙여둔 이메일이 들어 있었다. 그래서 rebuild 를 돌릴 때마다 enrichment 가 조용히
    # 사라졌다 — 실측: verified 853→795, estate_slug 126→44, photos 620→577.
    # 이제 Apify 값을 기본으로 쓰되 enrichment 필드는 기존 레코드에서 얹어 보존한다.
    if out_path.exists():
        try:
            with open(out_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
            existing_suppliers = existing.get("suppliers", existing) if isinstance(existing, dict) else existing
            by_id = {s["id"]: s for s in suppliers}

            def _clean_existing(s: dict) -> bool:
                name_l = (s.get("name") or "").lower()
                pt_l = (s.get("primary_type") or "").lower()
                if pt_l in EXCLUDE_CATEGORIES:
                    return False
                # is_supply() 와 같은 판정을 건다. 여기만 빼면 이번 배치의 raw 에
                # 없는 기존 supplier 는 계속 소비자 업소인 채로 남는다.
                if looks_consumer(s.get("primary_type") or "",
                                  s.get("raw_categories") or [],
                                  s.get("name") or ""):
                    return False
                if any(sig in name_l for sig in HARD_EXCLUDE_NAME):
                    return False
                for sig in SOFT_EXCLUDE_NAME:
                    if sig in name_l:
                        if not any(k in name_l for k in KEEP_OVERRIDE_KWS):
                            return False
                return True

            kept, enriched, dropped = [], 0, 0
            for s in existing_suppliers:
                sid = s.get("id")
                if not sid:
                    continue
                if not _clean_existing(s):
                    dropped += 1
                    continue
                new = by_id.get(sid)
                if new is None:
                    kept.append(s)          # Apify 이번 배치에 없는 기존 supplier — 그대로
                    continue
                if merge_enrichment(new, s):
                    enriched += 1

            suppliers = suppliers + kept
            print(f"Merged with existing: +{len(kept)} kept, {enriched} enriched in place, "
                  f"{dropped} filtered → total {len(suppliers)}")
        except Exception as e:
            print(f"Warning: could not merge existing DB: {e}")

    # hero_image 는 CSV 파이프라인에서만 나온다. Apify 는 같은 사진을 image_url 로 넣는데
    # SupplierCard / supplier 상세 / estate 페이지는 hero_image 만 읽어서, Apify 로만 들어온
    # 4,600여 개가 사진이 있는데도 카드에 회색 여백만 나오고 있었다.
    for s in suppliers:
        if not s.get("hero_image") and s.get("image_url"):
            s["hero_image"] = s["image_url"]

    # 6. 정렬 (trust_score DESC, total_reviews DESC)
    suppliers.sort(key=lambda c: (-c["trust_score"], -c["total_reviews"]))

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_suppliers": len(suppliers),
        "city_counts": dict(state_counter.most_common()),
        "with_district": sum(1 for c in suppliers if c["district"]),
        "with_categories": sum(1 for c in suppliers if c["categories"]),
        "with_website": sum(1 for c in suppliers if c["website"]),
        "with_phone": sum(1 for c in suppliers if c["phone"]),
        "with_reviews_scraped": sum(1 for c in suppliers if c["scraped_review_count"] > 0),
        "category_counts": dict(category_counter.most_common()),
        "primary_type_counts": dict(primary_type_counter.most_common(50)),
        "district_counts": dict(district_counter.most_common()),
        "language_total": {k: lang_total.get(k, 0) for k in ("th", "en", "ko", "ja", "other")},
        "suppliers": suppliers,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"[OK] wrote {out_path}")
    print(f"  suppliers: {len(suppliers)}")
    print(f"  by state: {dict(state_counter.most_common(10))}")
    print(f"  by category tag: {dict(category_counter.most_common())}")
    print(f"  with website: {payload['with_website']}")
    print(f"  with phone:   {payload['with_phone']}")
    print(f"  with reviews scraped: {payload['with_reviews_scraped']}")
    print(f"  language total: {payload['language_total']}")


if __name__ == "__main__":
    import io
    if hasattr(sys.stdout, "buffer"):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    main()
