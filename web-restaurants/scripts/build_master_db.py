"""Master DB builder — Restaurants edition.

Reads bangkok_reviews/output + pattaya/output (multi-city) and produces
web-restaurants/data/master_db.json.

Schema differences from clinic version:
- `cuisines` (multi) instead of medical `categories`
- `cuisine_mentions` from review text
- Restaurant-specific topics (fresh, spicy, halal, vegetarian, etc.)
- `city` field per restaurant (multi-city support)
- `price_level` / `price_symbol` carried through

Future cities just need an entry in CITIES list — auto-incorporated.
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

# (city_id, output_dir, display_name)
CITIES = [
    ("bangkok", ROOT / "bangkok_reviews" / "output", "Bangkok"),
    ("pattaya", ROOT / "pattaya" / "output", "Pattaya"),
    # 나중에 데이터 생기는 도시 추가만 하면 자동 반영:
    # ("chiang_mai", ROOT / "chiang_mai" / "output", "Chiang Mai"),
    # ("phuket", ROOT / "phuket" / "output", "Phuket"),
]

WEB_DATA = ROOT / "web-restaurants" / "data"
csv.field_size_limit(min(2**31 - 1, sys.maxsize))


# ── 도시별 District 매핑 ──────────────────────────────────────
_BKK_DISTRICTS: list[tuple[str, list[str]]] = [
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
    ("Don Mueang", ["don mueang", "donmueang"]),
    ("Lak Si", ["lak si"]),
    ("Bang Sue", ["bang sue"]),
    ("Dusit", ["dusit"]),
    ("Samphanthawong", ["samphanthawong", "yaowarat", "chinatown"]),
    ("Phra Nakhon", ["phra nakhon", "rattanakosin"]),
]
_PATTAYA_DISTRICTS: list[tuple[str, list[str]]] = [
    ("Central Pattaya", ["central pattaya", "pattaya central"]),
    ("North Pattaya", ["north pattaya", "naklua"]),
    ("South Pattaya", ["south pattaya", "jomtien"]),
    ("Pattaya Beach", ["beach road", "walking street"]),
]
DISTRICT_KEYS_BY_CITY = {"bangkok": _BKK_DISTRICTS, "pattaya": _PATTAYA_DISTRICTS}


def extract_district(address: str, city_id: str) -> str:
    if not address:
        return ""
    keys = DISTRICT_KEYS_BY_CITY.get(city_id, [])
    a = address.lower()
    for canonical, aliases in keys:
        for alias in aliases:
            if alias in a:
                return canonical
    return ""


# ── 언어 감지 ─────────────────────────────────────────────────
_THAI_RE = re.compile(r"[฀-๿]")
_LATIN_RE = re.compile(r"[A-Za-z]")


def detect_lang(text: str) -> str:
    if not text:
        return "other"
    total = len(text)
    th_ratio = len(_THAI_RE.findall(text)) / total
    lt_ratio = len(_LATIN_RE.findall(text)) / total
    if th_ratio > 0.3:
        return "th"
    if lt_ratio > 0.3 and th_ratio < 0.05:
        return "en"
    return "other"


# ── 음식 카테고리 ─────────────────────────────────────────────
_CUISINE_KEYWORDS: dict[str, list[str]] = {
    "thai": ["thai restaurant", "thai food", "tom yum", "pad thai", "som tam",
             "อาหารไทย", "ต้มยำ", "ผัดไทย"],
    "street_food": ["street food", "food stall", "noodle stall", "อาหารริมทาง"],
    "japanese": ["japanese restaurant", "sushi", "ramen", "izakaya", "yakitori",
                 "japanese", "อาหารญี่ปุ่น", "ซูชิ", "ราเมง"],
    "korean": ["korean restaurant", "korean bbq", "korean food", "kimchi",
               "อาหารเกาหลี", "เกาหลี", "한식", "한국"],
    "chinese": ["chinese restaurant", "dim sum", "yum cha", "cantonese",
                "sichuan", "อาหารจีน", "ติ่มซำ"],
    "italian": ["italian restaurant", "pizza", "pasta", "trattoria", "osteria",
                "อิตาเลียน", "พิซซ่า"],
    "indian": ["indian restaurant", "biryani", "curry house", "tandoori"],
    "vietnamese": ["vietnamese restaurant", "pho", "banh mi"],
    "seafood": ["seafood restaurant", "seafood", "อาหารทะเล"],
    "buffet": ["buffet restaurant", "all you can eat", "บุฟเฟ่ต์"],
    "cafe": ["cafe", "coffee shop", "espresso bar", "specialty coffee", "coffeehouse"],
    "bakery": ["bakery", "patisserie", "boulangerie", "ขนมปัง"],
    "bar_pub": ["bar", "pub", "cocktail bar", "wine bar", "speakeasy", "rooftop bar"],
    "fine_dining": ["fine dining", "michelin", "tasting menu", "chef's table"],
    "vegetarian": ["vegetarian restaurant", "vegan restaurant", "plant-based",
                   "อาหารมังสวิรัติ"],
    "halal": ["halal", "muslim restaurant", "ฮาลาล"],
    "dessert": ["dessert shop", "ice cream", "gelato", "boba", "bingsu", "ของหวาน"],
    "western": ["western", "european", "american", "burger", "steakhouse", "grill"],
    "fusion": ["fusion", "modern thai", "asian fusion"],
    "breakfast": ["breakfast", "brunch", "all-day breakfast"],
}


def tag_cuisines(primary_type: str, name: str, review_blob: str) -> list[str]:
    haystack = f"{primary_type} {name} {review_blob}".lower()
    cats: list[str] = []
    for cat, kws in _CUISINE_KEYWORDS.items():
        if any(kw in haystack for kw in kws):
            cats.append(cat)
    return cats


def count_cuisine_mentions(text: str) -> dict[str, int]:
    text_l = text.lower()
    counts: dict[str, int] = {}
    for cat, kws in _CUISINE_KEYWORDS.items():
        n = sum(text_l.count(kw) for kw in kws)
        if n > 0:
            counts[cat] = n
    return counts


# ── 식당 토픽 패턴 ────────────────────────────────────────────
_TOPIC_PATTERNS: dict[str, list[str]] = {
    "fresh":            ["fresh", "freshly made", "made to order", "สด", "สดใหม่"],
    "tasty":            ["delicious", "tasty", "yummy", "amazing food", "อร่อย"],
    "spicy":            ["spicy", "hot", "เผ็ด"],
    "authentic":        ["authentic", "traditional", "ดั้งเดิม", "แท้"],
    "fast_service":     ["fast service", "quick service", "served quickly", "เร็ว"],
    "long_wait":        ["long wait", "wait time", "rather slow", "นาน", "รอนาน"],
    "expensive":        ["expensive", "pricey", "overpriced", "แพง"],
    "affordable":       ["affordable", "cheap", "reasonable price", "good value",
                         "ไม่แพง", "ราคาดี", "ถูก"],
    "good_portion":     ["big portion", "generous portion", "huge serving", "เยอะ"],
    "small_portion":    ["small portion", "tiny portion", "น้อย"],
    "english_menu":     ["english menu", "english speaking", "เมนูภาษาอังกฤษ"],
    "halal_certified":  ["halal certified", "halal", "muslim friendly", "ฮาลาล"],
    "vegetarian_friendly": ["vegetarian friendly", "vegan options", "plant-based",
                            "มังสวิรัติ"],
    "kid_friendly":     ["kid friendly", "family friendly", "children", "เด็ก"],
    "good_atmosphere":  ["nice atmosphere", "cozy", "ambience", "บรรยากาศดี"],
    "instagram_worthy": ["instagrammable", "photo worthy", "รูปสวย"],
    "good_view":        ["great view", "rooftop", "skyline", "วิวสวย"],
    "live_music":       ["live music", "band", "ดนตรีสด"],
    "korean_friendly":  ["korean menu", "korean", "한국어 메뉴", "한국어"],
    "japanese_friendly":["japanese menu", "japanese speaking"],
    "michelin":         ["michelin", "michelin guide", "michelin star"],
    "dirty":            ["dirty", "unsanitary", "สกปรก"],
    "long_lines":       ["long line", "queue", "ต่อแถว"],
    "tourist_trap":     ["tourist trap", "overpriced for tourists"],
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


# ── 평점 트렌드 ───────────────────────────────────────────────
def _bucket_relative_date(rel: str) -> str:
    if not rel:
        return "unknown"
    r = rel.lower().strip()
    if "day" in r or "hour" in r or "yesterday" in r or "today" in r:
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
        return "midterm" if n < 1 else "old"
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
    if rating <= 0 or total_reviews <= 0:
        return 0.0
    rating_part = (rating / 5.0) * 50
    volume_part = min(40, math.log10(max(1, total_reviews)) * 12)
    lg_ratio = (local_guide_count / scraped_review_count) if scraped_review_count > 0 else 0
    lg_part = min(10, lg_ratio * 20)
    authority_part = min(5, math.log10(max(1, avg_author_review_count)) * 2)
    return round(rating_part + volume_part + lg_part + authority_part, 1)


_COORDS_RE = re.compile(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)")


def coords_from_maps_url(url: str) -> tuple[float | None, float | None]:
    if not url:
        return None, None
    m = _COORDS_RE.search(url)
    if m:
        return float(m.group(1)), float(m.group(2))
    return None, None


def analyze_reviews(reviews_dir: Path, place_id: str) -> dict:
    fn = place_id.replace(":", "_")
    p = reviews_dir / f"{fn}_reviews.csv"
    empty = {
        "scraped_count": 0, "local_guide_count": 0, "avg_author_review_count": 0.0,
        "language_breakdown": {"th": 0, "en": 0, "other": 0},
        "cuisine_mentions": {}, "mentioned_topics": [],
        "rating_trend": {
            "recent": {"count": 0, "avg": None}, "midterm": {"count": 0, "avg": None},
            "old": {"count": 0, "avg": None}, "trend": "insufficient_data",
        },
        "sample_reviews_th": [], "sample_reviews_en": [],
        "derived_cuisines": [],
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
    lg = sum(1 for r in rows if str(r.get("author_is_local_guide", "0")).strip() in ("1", "1.0"))
    arc_list: list[int] = []
    for r in rows:
        try:
            arc_list.append(int(float(r.get("author_review_count") or 0)))
        except ValueError:
            pass
    avg_arc = sum(arc_list) / len(arc_list) if arc_list else 0.0

    lang_count = {"th": 0, "en": 0, "other": 0}
    text_chunks_by_lang: dict[str, list[tuple[str, int, str]]] = {"th": [], "en": [], "other": []}
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

    all_text = " ".join(t for chunks in text_chunks_by_lang.values() for t, _, _ in chunks)
    cuisines = count_cuisine_mentions(all_text)
    topics = extract_topics(all_text)
    derived = sorted({k for k in cuisines if cuisines[k] >= 2})

    def pick_samples(chunks: list[tuple[str, int, str]], n: int = 3):
        good = [c for c in chunks if 80 <= len(c[0]) <= 300 and c[1] >= 4]
        good.sort(key=lambda x: -x[1])
        return [{"text": t, "rating": r, "author": a} for t, r, a in good[:n]]

    return {
        "scraped_count": scraped,
        "local_guide_count": lg,
        "avg_author_review_count": round(avg_arc, 1),
        "language_breakdown": lang_count,
        "cuisine_mentions": cuisines,
        "mentioned_topics": topics,
        "rating_trend": compute_rating_trend(rows),
        "sample_reviews_th": pick_samples(text_chunks_by_lang["th"]),
        "sample_reviews_en": pick_samples(text_chunks_by_lang["en"]),
        "derived_cuisines": derived,
    }


def main():
    WEB_DATA.mkdir(parents=True, exist_ok=True)
    out_path = WEB_DATA / "master_db.json"

    restaurants: list[dict] = []
    district_counter: Counter[str] = Counter()
    cuisine_counter: Counter[str] = Counter()
    city_counter: Counter[str] = Counter()
    lang_total = Counter()

    for city_id, output_dir, display_name in CITIES:
        rest_csv = output_dir / "restaurants.csv"
        reviews_dir = output_dir / "reviews"
        if not rest_csv.exists():
            print(f"[skip] {city_id}: {rest_csv} not found")
            continue

        with open(rest_csv, encoding="utf-8-sig", errors="replace", newline="") as f:
            for row in csv.DictReader(f):
                place_id = (row.get("place_id") or "").strip()
                name = (row.get("name") or "").strip()
                if not place_id or not name:
                    continue
                # Sanity: 파일/URL 안전한 place_id 만 사용. 특수문자 있으면 스킵.
                # 정상 place_id 형식: "0x{hex}:0x{hex}"
                if not re.match(r"^[0-9a-fA-Fx:_-]+$", place_id):
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
                district = extract_district(address, city_id)
                if district:
                    district_counter[f"{city_id}/{district}"] += 1

                review_sig = analyze_reviews(reviews_dir, place_id)

                base_cuisines = set(tag_cuisines(row.get("primary_type", ""), name, ""))
                cuisines = sorted(base_cuisines | set(review_sig["derived_cuisines"]))
                for c in cuisines:
                    cuisine_counter[c] += 1

                for lang, n in review_sig["language_breakdown"].items():
                    lang_total[lang] += n

                ts = trust_score(
                    rating, total_reviews,
                    review_sig["local_guide_count"], review_sig["scraped_count"],
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

                city_counter[city_id] += 1

                restaurants.append({
                    "id": place_id.replace(":", "_"),
                    "place_id": place_id,
                    "name": name,
                    "primary_type": row.get("primary_type", ""),
                    "address": address,
                    "city": city_id,
                    "city_label": display_name,
                    "district": district,
                    "phone": row.get("phone", ""),
                    "website": row.get("website", ""),
                    "menu_url": row.get("menu_url", ""),
                    "lat": lat,
                    "lng": lng,
                    "rating": rating,
                    "total_reviews": total_reviews,
                    "trust_score": ts,
                    "cuisines": cuisines,
                    "price_level": row.get("price_level", ""),
                    "price_symbol": row.get("price_symbol", ""),
                    "scraped_review_count": review_sig["scraped_count"],
                    "local_guide_count": review_sig["local_guide_count"],
                    "avg_author_review_count": review_sig["avg_author_review_count"],
                    "language_breakdown": review_sig["language_breakdown"],
                    "cuisine_mentions": review_sig["cuisine_mentions"],
                    "mentioned_topics": review_sig["mentioned_topics"],
                    "rating_trend": review_sig["rating_trend"],
                    "sample_reviews_th": review_sig["sample_reviews_th"],
                    "sample_reviews_en": review_sig["sample_reviews_en"],
                    "business_status": row.get("business_status", ""),
                    "maps_url": row.get("maps_url", ""),
                })

    restaurants.sort(key=lambda c: (-c["trust_score"], -c["total_reviews"]))

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_restaurants": len(restaurants),
        "city_counts": dict(city_counter.most_common()),
        "with_district": sum(1 for c in restaurants if c["district"]),
        "with_cuisines": sum(1 for c in restaurants if c["cuisines"]),
        "with_reviews_scraped": sum(1 for c in restaurants if c["scraped_review_count"] > 0),
        "language_total": dict(lang_total),
        "district_counts": dict(district_counter.most_common()),
        "cuisine_counts": dict(cuisine_counter.most_common()),
        "restaurants": restaurants,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"[OK] wrote {out_path}")
    print(f"  restaurants: {len(restaurants)}")
    print(f"  by city: {dict(city_counter.most_common())}")
    print(f"  cuisines (top): {dict(cuisine_counter.most_common(10))}")
    print(f"  with reviews scraped: {payload['with_reviews_scraped']}")


if __name__ == "__main__":
    main()
