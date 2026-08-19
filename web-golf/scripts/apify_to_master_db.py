"""Apify Google Maps export → master_db.json (golf edition).

Input: Apify "crawler-google-places" + "Google-Maps-Reviews-Scraper" JSON exports.
Output: web-golf/data/master_db.json

Schema mirrors restaurant version with golf-specific adaptations:
- `cuisines` → `course_categories` (course, driving_range, country_club, etc.)
- `cuisine_mentions` → `feature_mentions` (challenging, scenic, well_maintained, etc.)
- Trend analysis disabled (Apify reviews don't include dates).
"""
from __future__ import annotations

import csv
import json
import math
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[2]
WEB_DATA = ROOT / "web-golf" / "data"

HOME = Path.home()
APIFY_SEARCH_DIRS = [
    HOME / "Desktop",
    HOME / "Downloads",
    HOME / "Desktop" / "골프" / "이름만",
    HOME / "Desktop" / "골프" / "리뷰도",
    HOME / "Downloads" / "골프" / "이름만",
    HOME / "Downloads" / "골프" / "리뷰도",
]


def find_files(pattern: str) -> list[Path]:
    out: list[Path] = []
    seen: set[str] = set()
    for d in APIFY_SEARCH_DIRS:
        if not d.exists():
            continue
        for p in d.glob(pattern):
            if p.name in seen:
                continue
            seen.add(p.name)
            out.append(p)
    return sorted(out)


# Apify 다운로드 파일명은 액터 이름에서 나온다. "Google Maps Scraper" 는
# crawler-google-places / google-maps-scraper 등으로 떨어지므로 둘 다 받는다.
# 패턴이 안 맞으면 "0 files found" 로 조용히 지나가 빈 master_db 를 쓰게 된다.
PLACE_FILES = (
    find_files("dataset_crawler-google-places_*.json")
    + find_files("dataset_google-maps-scraper*.json")
    + find_files("dataset_Google-Maps-Scraper*.json")
)
REVIEW_FILES = (
    find_files("dataset_Google-Maps-Reviews-Scraper_*.json")
    + find_files("dataset_google-maps-reviews-scraper*.json")
)


# ── Place ID 추출 ─────────────────────────────────────────────
_PLACE_ID_RE = re.compile(r"query_place_id=([\w-]+)")


def extract_place_id(url: str) -> str:
    if not url:
        return ""
    m = _PLACE_ID_RE.search(url)
    return m.group(1) if m else ""


# ── 언어 감지 ─────────────────────────────────────────────────
_THAI_RE = re.compile(r"[฀-๿]")
_LATIN_RE = re.compile(r"[A-Za-z]")
_KOREAN_RE = re.compile(r"[가-힣ᄀ-ᇿ]")
_JAPANESE_RE = re.compile(r"[ぁ-ゟ゠-ヿ]")


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
    lt = len(_LATIN_RE.findall(text)) / total
    if lt > 0.3 and th < 0.05 and ko < 0.05:
        return "en"
    return "other"


# ── 골프 코스 카테고리 ────────────────────────────────────────
# Apify 'categories' 배열 + 리뷰 텍스트 분석으로 태깅.
_GOLF_CATEGORY_MAP: dict[str, list[str]] = {
    "course":          ["golf course", "public golf course", "country club"],
    "country_club":    ["country club"],
    "driving_range":   ["golf driving range", "driving range"],
    "indoor":          ["indoor golf course", "indoor golf"],
    "instructor":      ["golf instructor", "golf coach"],
    "shop":            ["golf shop"],
    "resort":          ["resort hotel", "resort"],
    "club":            ["golf club"],
    "mini_golf":       ["mini golf"],
    "private_club":    ["private golf club"],
}


def tag_golf_categories(categories: list[str]) -> list[str]:
    cat_l = [c.lower() for c in categories]
    found: list[str] = []
    for tag, kws in _GOLF_CATEGORY_MAP.items():
        if any(any(kw in c for kw in kws) for c in cat_l):
            found.append(tag)
    return found


# ── 골프 토픽 패턴 (리뷰 텍스트에서 추출) ─────────────────────
_TOPIC_PATTERNS: dict[str, list[str]] = {
    "challenging":     ["challenging", "difficult", "tough course", "challenging layout"],
    "easy_course":     ["easy course", "beginner friendly", "forgiving"],
    "well_maintained": ["well maintained", "well-maintained", "great condition", "perfect condition", "fairway condition"],
    "poor_condition":  ["poor condition", "patchy", "bare patches", "neglected"],
    "scenic":          ["scenic", "beautiful", "stunning view", "mountain view", "ocean view", "amazing view"],
    "championship":    ["championship", "tournament", "pga", "professional"],
    "expensive":       ["expensive", "pricey", "overpriced", "steep green fee"],
    "affordable":      ["affordable", "cheap", "good value", "reasonable price", "budget"],
    "weekend_busy":    ["busy on weekend", "crowded weekend", "long wait weekend"],
    "weekday_quiet":   ["quiet weekday", "empty weekday"],
    "fast_pace":       ["fast pace", "good pace of play", "quick rounds"],
    "slow_pace":       ["slow pace", "5 hour round", "6 hour round", "slow play"],
    "good_caddy":      ["great caddy", "excellent caddy", "experienced caddy", "professional caddy"],
    "english_caddy":   ["english speaking caddy", "english caddy", "international caddy"],
    "korean_caddy":    ["korean caddy", "korean speaking", "한국어 캐디", "한국어"],
    "japanese_caddy":  ["japanese caddy", "japanese speaking"],
    "good_clubhouse":  ["great clubhouse", "excellent clubhouse", "fancy clubhouse", "luxury clubhouse"],
    "basic_clubhouse": ["basic clubhouse", "old clubhouse", "outdated"],
    "good_food":       ["good food", "great restaurant", "delicious", "good clubhouse food"],
    "fun_layout":      ["fun layout", "interesting design", "creative course"],
    "long_course":     ["long course", "long holes", "back tees"],
    "short_course":    ["short course", "executive course", "compact"],
    "good_practice":   ["practice facility", "great practice", "driving range good", "practice green"],
    "tournament_ready":["tournament", "professional grade", "host"],
    "old_course":      ["traditional", "old style", "classic"],
    "modern_course":   ["modern course", "new course", "recent design"],
    "international":   ["international", "tourist", "foreigners welcome"],
    "members_only":    ["members only", "private", "exclusive"],
    "wedding_venue":   ["wedding", "function hall", "events"],
    "near_airport":    ["near airport", "close to airport", "10 minutes from airport"],
    "long_drive":      ["far from city", "long drive", "remote location"],
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


# ── 신뢰도 점수 ───────────────────────────────────────────────
def trust_score(rating: float, total_reviews: int,
                scraped_review_count: int,
                avg_text_length: float) -> float:
    """0-100. Apify 데이터엔 Local Guide 정보 없어서 변형:
    - rating × 50%
    - volume log × 40%
    - sample 수집 비율 × 5%
    - 평균 리뷰 텍스트 길이 (성실한 리뷰어 시그널) × 5%."""
    if rating <= 0 or total_reviews <= 0:
        return 0.0
    rating_part = (rating / 5.0) * 50
    volume_part = min(40, math.log10(max(1, total_reviews)) * 12)
    coverage = scraped_review_count / max(1, total_reviews)
    coverage_part = min(5, coverage * 50)
    text_part = min(5, math.log10(max(1, avg_text_length)) * 1.5)
    return round(rating_part + volume_part + coverage_part + text_part, 1)


# ── 메인 변환 ─────────────────────────────────────────────────
def main() -> int:
    WEB_DATA.mkdir(parents=True, exist_ok=True)
    out_path = WEB_DATA / "master_db.json"

    # 0. 입력이 없으면 즉시 중단. 없는 채로 진행하면 코스 0개짜리 master_db 를 써서
    # 639개 페이지가 통째로 사라진다 (/course/[id] 는 dynamicParams=false 라 전부 하드 404).
    if not PLACE_FILES:
        print("[abort] place export 를 못 찾았다. Desktop / Downloads 에")
        print("        dataset_crawler-google-places_*.json (또는 dataset_google-maps-scraper*.json)")
        print("        을 두고 다시 실행할 것. master_db 는 건드리지 않았다.")
        return 1

    # 1. Places 로드 + dedupe
    print(f"Place files found: {len(PLACE_FILES)}")
    for path in PLACE_FILES:
        print(f"  - {path.name}")
    places_by_id: dict[str, dict] = {}
    for path in PLACE_FILES:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for raw in data:
            url = raw.get("url", "")
            pid = extract_place_id(url)
            if not pid:
                continue
            # 첫 등장만 유지 (dedupe)
            if pid not in places_by_id:
                places_by_id[pid] = {**raw, "_place_id": pid, "_url_decoded": unquote(url)}

    print(f"Unique places: {len(places_by_id)}")

    # 2. Thailand + golf-related 필터
    GOLF_KEYWORDS = ("golf", "country club", "driving range")
    def is_golf(p):
        cats = " ".join(p.get("categories") or []).lower()
        category_name = (p.get("categoryName") or "").lower()
        title = (p.get("title") or "").lower()
        haystack = f"{cats} {category_name} {title}"
        return any(k in haystack for k in GOLF_KEYWORDS)

    thai_places = {pid: p for pid, p in places_by_id.items()
                    if p.get("countryCode") == "TH" and is_golf(p)}
    print(f"Thailand golf places: {len(thai_places)}")

    # 3. Reviews 로드 + url 별로 그룹 + dedupe
    print(f"\nReview files found: {len(REVIEW_FILES)}")
    for path in REVIEW_FILES:
        print(f"  - {path.name}")
    reviews_by_url: dict[str, list[dict]] = defaultdict(list)
    seen_review_keys: set[tuple] = set()
    for path in REVIEW_FILES:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for r in data:
            url = r.get("url", "")
            text = (r.get("text") or "")[:100]
            stars = r.get("stars")
            key = (url, stars, text)
            if key in seen_review_keys:
                continue
            seen_review_keys.add(key)
            if url:
                reviews_by_url[url].append(r)
    print(f"Reviews after dedupe: {len(reviews_by_url)} unique URLs, "
          f"{sum(len(v) for v in reviews_by_url.values())} total reviews")

    # 4. URL → place_id 매핑 + 리뷰 attach
    reviews_by_pid: dict[str, list[dict]] = defaultdict(list)
    for url, revs in reviews_by_url.items():
        pid = extract_place_id(url)
        if pid:
            reviews_by_pid[pid].extend(revs)

    # 4b. Google Maps Scraper 를 maxReviews > 0 으로 돌리면 리뷰가 별도 데이터셋이 아니라
    # place 레코드의 reviews[] 안에 실려 온다. 액터를 하나만 돌리는 경우가 그렇다.
    # 그때도 리뷰를 살리려면 여기서 꺼내야 한다 — 안 그러면 리뷰를 돈 주고 긁어놓고
    # 전부 버리게 된다. dedupe 키는 위와 같은 (place, stars, text) 조합을 쓴다.
    embedded = 0
    for pid, p in thai_places.items():
        for r in (p.get("reviews") or []):
            text = (r.get("text") or "")[:100]
            key = (pid, r.get("stars"), text)
            if key in seen_review_keys:
                continue
            seen_review_keys.add(key)
            reviews_by_pid[pid].append(r)
            embedded += 1
    if embedded:
        print(f"Reviews embedded in place records: {embedded}")
    print(f"Reviews attached to places: {sum(len(v) for v in reviews_by_pid.values())} "
          f"across {len(reviews_by_pid)} places")

    # 5. Build records
    courses: list[dict] = []
    state_counter: Counter[str] = Counter()
    category_counter: Counter[str] = Counter()
    lang_total = Counter()

    for pid, p in thai_places.items():
        name = p.get("title", "").strip()
        if not name:
            continue

        rating = float(p.get("totalScore") or 0)
        total_reviews = int(p.get("reviewsCount") or 0)

        state = (p.get("state") or "").strip()
        city = (p.get("city") or "").strip()
        # district = city (Apify 'city' 가 종종 District 단위)

        if state:
            state_counter[state] += 1

        # Categories
        raw_cats = p.get("categories", []) or []
        categories = tag_golf_categories(raw_cats)
        for c in categories:
            category_counter[c] += 1

        # 주소 조합
        street = (p.get("street") or "").strip()
        address = ", ".join(filter(None, [street, city, state, "Thailand"]))

        # Reviews
        revs = reviews_by_pid.get(pid, [])
        scraped_count = len(revs)

        # 텍스트 분석
        all_text = " ".join((r.get("text") or "") for r in revs)
        topics = extract_topics(all_text)

        # 언어 분류
        lang_count = {"th": 0, "en": 0, "ko": 0, "ja": 0, "other": 0}
        chunks_by_lang: dict[str, list[tuple[str, int, str]]] = {
            "th": [], "en": [], "ko": [], "ja": [], "other": []
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

        # Sample reviews (4-5점 + 80-300자)
        def pick_samples(chunks: list[tuple[str, int, str]], n: int = 5):
            # 상한이 300자였는데, 그게 가장 자세히 쓴 리뷰만 골라서 버리고 있었다.
            # 이번 수집분 2,066건 기준 301자 이상 고평점 리뷰 208건(13%)이 그렇게 날아갔다 —
            # 코스 페이지에 실릴 고유 텍스트가 곧 색인 여부를 가르는 상황에서 정반대로 가는 필터다.
            # 길이순이 아니라 길이 하한만 두고, 같은 별점이면 긴 쪽을 먼저 쓴다.
            good = [c for c in chunks if 80 <= len(c[0]) <= 1200 and c[1] >= 4]
            good.sort(key=lambda x: (-x[1], -len(x[0])))
            return [{"text": t, "rating": r, "author": a or "Google reviewer"}
                    for t, r, a in good[:n]]

        # 평균 리뷰 텍스트 길이
        text_lengths = [len(t) for t in [r.get("text") or "" for r in revs] if t]
        avg_len = sum(text_lengths) / len(text_lengths) if text_lengths else 0

        ts = trust_score(rating, total_reviews, scraped_count, avg_len)

        # 좌표 (없음 — 향후 enrichment)
        lat, lng = None, None

        # Maps URL — Apify가 search URL 줬으니 그대로 (place_id 포함되어 deep link 가능)
        maps_url = p.get("url", "")

        courses.append({
            "id": pid,
            "place_id": pid,
            "name": name,
            "primary_type": (p.get("categoryName") or "").strip(),
            "address": address,
            "city": (state or "Thailand").lower().replace(" ", "_"),  # city_id slug
            "city_label": state or "Thailand",
            "district": city,  # 'city' 필드는 보통 District 또는 sub-area
            "phone": (p.get("phone") or "").strip(),
            "website": (p.get("website") or "").strip(),
            "lat": lat,
            "lng": lng,
            "rating": rating,
            "total_reviews": total_reviews,
            "trust_score": ts,
            "categories": categories,
            "raw_categories": raw_cats,
            "scraped_review_count": scraped_count,
            "language_breakdown": lang_count,
            "mentioned_topics": topics,
            "sample_reviews_th": pick_samples(chunks_by_lang["th"]),
            "sample_reviews_en": pick_samples(chunks_by_lang["en"]),
            "sample_reviews_ko": pick_samples(chunks_by_lang["ko"]),
            "maps_url": maps_url,
            # 빈 필드 (식당 schema 와 호환)
            "menu_url": "",
            "price_level": "",
            "price_symbol": "",
            "local_guide_count": 0,  # Apify 가 안 줌
            "avg_author_review_count": 0,
            "cuisine_mentions": {},
            "rating_trend": {  # 트렌드 데이터 없음
                "recent": {"count": 0, "avg": None},
                "midterm": {"count": 0, "avg": None},
                "old": {"count": 0, "avg": None},
                "trend": "insufficient_data",
            },
            "business_status": "",
        })

    # 정렬 (sponsored 가 sort 시 적용됨)
    courses.sort(key=lambda c: (-c["trust_score"], -c["total_reviews"]))

    # --- 삭제 가드 -------------------------------------------------------
    # 이 스크립트는 master_db 를 Apify export 로부터 통째로 새로 쓴다. 그래서 export 가
    # 한 코스라도 빠뜨리면 그 코스는 조용히 사라진다. web-golf 는 /course/[id] 를
    # dynamicParams = false 로 잠가놨기 때문에 사라진 코스는 곧바로 하드 404 가 되고,
    # 색인돼 있던 페이지라면 그대로 색인에서 떨어진다.
    #
    # Apify export 는 "어떤 코스가 존재하는가"의 정답이 아니라 리뷰 데이터의 갱신본이다.
    # (액터가 조기 종료하거나, 크레딧이 떨어지거나, 검색 반경이 달라지면 얼마든지 줄어든다.)
    # 그래서 이전 master_db 에만 있는 코스는 지우지 않고 그대로 물려준다. 진짜로 폐업한
    # 코스를 빼는 건 의도적으로 해야 하는 일이지, 스크랩 사고의 부작용이면 안 된다.
    #
    # 같은 코스가 양쪽에 다 있을 때도 통째로 덮어쓰면 안 된다. 한 번의 수집은 코스당
    # maxReviews 만큼만 가져오므로, 이전에 다른 각도로 모아둔 샘플보다 적을 수 있다.
    # 실제로 2026-08-19 갱신에서 170개 코스를 새로 긁었더니 샘플이 1,534 -> 1,441 로
    # 줄었다. 평점/리뷰수 같은 스칼라는 새 값이 맞지만, 리뷰 샘플과 토픽은 합쳐야 한다.
    carried_over = 0
    merged_back = 0
    if out_path.exists():
        try:
            with open(out_path, "r", encoding="utf-8") as f:
                prev = json.load(f)
            prev_courses = prev.get("courses", prev.get("restaurants", []))
            prev_by_id = {(c.get("place_id") or c.get("id")): c for c in prev_courses}
            fresh_ids = {c.get("place_id") or c.get("id") for c in courses}

            def union_samples(new_list, old_list, cap=5):
                out, seen = [], set()
                for s in list(new_list or []) + list(old_list or []):
                    t = (s.get("text") or "").strip()
                    if not t or t in seen:
                        continue
                    seen.add(t)
                    out.append(s)
                return out[:cap]

            for c in courses:
                pc = prev_by_id.get(c.get("place_id") or c.get("id"))
                if not pc:
                    continue
                before = sum(len(c.get(f"sample_reviews_{l}") or []) for l in ("en", "th", "ko"))
                for lang in ("en", "th", "ko"):
                    key = f"sample_reviews_{lang}"
                    c[key] = union_samples(c.get(key), pc.get(key))
                after = sum(len(c.get(f"sample_reviews_{l}") or []) for l in ("en", "th", "ko"))
                if after > before:
                    merged_back += after - before
                # 토픽도 마찬가지 — 새 수집이 못 잡은 토픽을 지울 이유가 없다.
                if not c.get("mentioned_topics") and pc.get("mentioned_topics"):
                    c["mentioned_topics"] = pc["mentioned_topics"]
                # 구 파이프라인이 남긴 전체 리뷰 배열은 새 수집엔 없으므로 보존한다.
                if not c.get("scraped_reviews") and pc.get("scraped_reviews"):
                    c["scraped_reviews"] = pc["scraped_reviews"]
                for k in ("hero_image", "top_photo_url", "photos", "lat", "lng", "website"):
                    if not c.get(k) and pc.get(k):
                        c[k] = pc[k]
            if merged_back:
                print(f"[guard] 이전 데이터에서 되살린 리뷰 샘플: {merged_back}건")

            for pc in prev_courses:
                pid = pc.get("place_id") or pc.get("id")
                if pid and pid not in fresh_ids:
                    pc["_carried_over_from"] = prev.get("generated_at")
                    courses.append(pc)
                    carried_over += 1
            if carried_over:
                print(f"\n[guard] 이번 export 에 없는 기존 코스 {carried_over}개를 유지했다.")
                print("        (지우려면 의도적으로 처리할 것 — 삭제는 곧 하드 404다)")
                # 재계산이 필요한 집계는 아래에서 courses 로부터 다시 구한다.
                state_counter = Counter(c.get("city_label") or c.get("city") or "" for c in courses)
                state_counter.pop("", None)
                category_counter = Counter(k for c in courses for k in (c.get("categories") or []))
        except (OSError, ValueError) as e:
            print(f"[guard] 이전 master_db 를 읽지 못해 가드를 건너뛴다: {e}")

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_courses": len(courses),
        "city_counts": dict(state_counter.most_common()),
        "with_district": sum(1 for c in courses if c["district"]),
        "with_categories": sum(1 for c in courses if c["categories"]),
        "with_reviews_scraped": sum(1 for c in courses if c["scraped_review_count"] > 0),
        "language_total": dict(lang_total),
        "district_counts": {f"{c['city']}/{c['district']}": 1 for c in courses if c["district"]},
        "category_counts": dict(category_counter.most_common()),
        # 메인 데이터 — 식당 schema와 alias 호환:
        "courses": courses,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] wrote {out_path}")
    print(f"  courses: {len(courses)}")
    print(f"  by state: {dict(state_counter.most_common())}")
    print(f"  by category: {dict(category_counter.most_common())}")
    print(f"  with reviews: {payload['with_reviews_scraped']}")
    print(f"  language total: {dict(lang_total)}")

    # Re-apply CSV enrichment + Korean auto-labeling so the bot's rebuild
    # doesn't wipe out the merged signals. Idempotent — safe to run every cycle.
    print("\n[post] re-applying CSV enrichment + korean labeling …")
    import subprocess
    scripts_dir = Path(__file__).resolve().parent
    for script in ("merge_master_csv.py", "auto_label_korean_friendly.py"):
        script_path = scripts_dir / script
        if not script_path.exists():
            print(f"  skip — {script} not found")
            continue
        try:
            subprocess.run([sys.executable, str(script_path)], check=True)
        except subprocess.CalledProcessError as e:
            print(f"  [warn] {script} failed: {e}")

    return 0


if __name__ == "__main__":
    # Windows console UTF-8
    import io
    if hasattr(sys.stdout, "buffer"):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

    raise SystemExit(main())
