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

    def pick_samples(chunks: list[tuple[str, int, str]], n: int = 3):
        good = [c for c in chunks if 60 <= len(c[0]) <= 350 and c[1] >= 4]
        good.sort(key=lambda x: -x[1])
        return [{"text": t, "rating": r, "author": a or "Google reviewer"}
                for t, r, a in good[:n]]

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

    # 5. 기존 master_db.json 과 머지 (place_id 기준, 신규 데이터 우선) + 기존 항목도 재필터
    if out_path.exists():
        try:
            with open(out_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
            existing_suppliers = existing.get("suppliers", existing) if isinstance(existing, dict) else existing
            new_ids = {s["id"] for s in suppliers}

            def _clean_existing(s: dict) -> bool:
                if not s.get("id") or s["id"] in new_ids:
                    return False
                name_l = (s.get("name") or "").lower()
                pt_l = (s.get("primary_type") or "").lower()
                if pt_l in EXCLUDE_CATEGORIES:
                    return False
                if any(sig in name_l for sig in HARD_EXCLUDE_NAME):
                    return False
                for sig in SOFT_EXCLUDE_NAME:
                    if sig in name_l:
                        if not any(k in name_l for k in KEEP_OVERRIDE_KWS):
                            return False
                return True

            kept = [s for s in existing_suppliers if _clean_existing(s)]
            removed = len(existing_suppliers) - len(new_ids & {s.get("id") for s in existing_suppliers}) - len(kept)
            suppliers = suppliers + kept
            print(f"Merged with existing: +{len(kept)} kept (filtered {removed} bad) → total {len(suppliers)}")
        except Exception as e:
            print(f"Warning: could not merge existing DB: {e}")

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
