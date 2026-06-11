"""HDmall.co.th 매칭 PoC.

목표: master_db의 Bangkok 클리닉 N개를 HDmall에서 검색해서
- 매칭률 측정 (이름 유사도)
- 각 매칭 클리닉의 패키지 수, HDmall 평점/리뷰수 수집
- master_db에 enrich 가능한 데이터 카탈로그 파악

검색 페이지의 "ผู้ให้บริการแนะนำ" 카드 섹션에 onclick JS로
brand_name/brand_rating/card_url이 명시되어 있어서 정규식 파싱.
"""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Optional

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

ROOT = Path(__file__).parent.parent
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
OUT_JSON = Path(__file__).parent / "poc_results.json"
DEBUG_DIR = Path(__file__).parent / "debug_html"
SAMPLE_SIZE = 10
CITY_SLUG = "bangkok"

CLINIC_TYPES = (
    "clinic", "dental", "medical", "hospital", "beauty",
    "cosmetic", "surgery", "skin", "spa", "aesthetic", "laser",
)


# onclick JS 안의 capture 페이로드에서 필드 뽑기
RE_BRAND_NAME = re.compile(r"brand_name:\s*'([^']+)'")
RE_BRAND_RATING = re.compile(r"brand_rating:\s*([0-9.]+|null)")
RE_CARD_URL = re.compile(r"card_url:\s*'([^']+)'")
RE_RATING_COUNT = re.compile(r"ai-overview-brand-rating-count[^>]*>\(([0-9,]+)\)")
RE_RESULT_COUNT = re.compile(r"(\d[\d,]*)\s*ผลลัพธ์")


@dataclass
class BrandCard:
    name: str
    url: str
    rating: Optional[float] = None
    rating_count: Optional[int] = None


@dataclass
class MatchResult:
    src_name: str
    src_place_id: str
    src_rating: float
    src_total_reviews: int
    src_primary_type: str
    search_url: str
    hdmall_result_count: int = 0
    candidates: list[dict] = field(default_factory=list)
    best_match_name: Optional[str] = None
    best_match_url: Optional[str] = None
    best_match_rating: Optional[float] = None
    best_match_rating_count: Optional[int] = None
    best_match_score: float = 0.0
    notes: str = ""


def _normalize(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^\w\s]", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _name_similarity(a: str, b: str) -> float:
    ta = set(_normalize(a).split())
    tb = set(_normalize(b).split())
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


def pick_sample() -> list[dict]:
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = [c for c in db["clinics"] if c.get("city_slug") == CITY_SLUG]

    def is_clinic(c):
        t = (c.get("primary_type") or "").lower()
        return any(k in t for k in CLINIC_TYPES)

    clinics = [c for c in clinics if is_clinic(c)]
    clinics.sort(key=lambda c: c.get("total_reviews", 0), reverse=True)
    return clinics[:SAMPLE_SIZE]


def parse_search_response(html: str) -> tuple[int, list[BrandCard]]:
    m = RE_RESULT_COUNT.search(html)
    result_count = int(m.group(1).replace(",", "")) if m else 0

    cards: list[BrandCard] = []
    # 카드별로 split: onclick에 posthog.capture('ai_overview_brand_clicked' 가 있는
    # div 의 onclick payload + 그 뒤 ~3KB 안의 rating_count 텍스트를 같이 본다.
    # 각 onclick payload 단위로 잘라서 multi-match.
    onclick_re = re.compile(
        r"onclick=\"(?P<oc>[^\"]*posthog\.capture\('ai_overview_brand_clicked'[^\"]*)\"",
        re.DOTALL,
    )
    matches = list(onclick_re.finditer(html))
    for i, mm in enumerate(matches):
        onclick = mm.group("oc")
        name_m = RE_BRAND_NAME.search(onclick)
        rating_m = RE_BRAND_RATING.search(onclick)
        url_m = RE_CARD_URL.search(onclick)
        if not (name_m and url_m):
            continue
        rating: Optional[float] = None
        if rating_m and rating_m.group(1) != "null":
            try:
                rating = float(rating_m.group(1))
            except ValueError:
                pass
        # rating_count: 현재 카드 onclick 끝 ~ 다음 카드 onclick 시작 사이 chunk에서 찾음
        chunk_start = mm.end()
        chunk_end = matches[i + 1].start() if i + 1 < len(matches) else min(chunk_start + 3000, len(html))
        chunk = html[chunk_start:chunk_end]
        rc_m = RE_RATING_COUNT.search(chunk)
        rating_count = int(rc_m.group(1).replace(",", "")) if rc_m else None
        cards.append(BrandCard(
            name=name_m.group(1),
            url=url_m.group(1),
            rating=rating,
            rating_count=rating_count,
        ))
    return result_count, cards


def search_hdmall(page, query: str, debug_slug: str) -> tuple[str, int, list[BrandCard]]:
    q = urllib.parse.quote_plus(query)
    url = f"https://hdmall.co.th/search?q={q}"
    page.goto(url, wait_until="domcontentloaded", timeout=30000)
    try:
        page.wait_for_load_state("networkidle", timeout=8000)
    except PWTimeout:
        pass
    html = page.content()
    DEBUG_DIR.mkdir(exist_ok=True)
    (DEBUG_DIR / f"{debug_slug}.html").write_text(html, encoding="utf-8")
    result_count, cards = parse_search_response(html)
    return url, result_count, cards


def main() -> int:
    sample = pick_sample()
    print(f"sample size: {len(sample)} bangkok clinics (top by total_reviews)")
    for i, c in enumerate(sample):
        print(f"  {i+1}. {c['name'][:60]} | {c['primary_type']} | reviews={c['total_reviews']}")

    results: list[MatchResult] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-features=IsolateOrigins,site-per-process",
            ],
        )
        ctx = browser.new_context(
            locale="th-TH",
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
            extra_http_headers={"Accept-Language": "th,en;q=0.9"},
        )
        ctx.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
        )
        page = ctx.new_page()
        page.set_default_timeout(20000)

        for i, c in enumerate(sample):
            query = c["name"]
            slug = re.sub(r"[^a-zA-Z0-9]+", "_", c["name"])[:40].strip("_") or f"clinic_{i+1}"
            r = MatchResult(
                src_name=c["name"],
                src_place_id=c["place_id"],
                src_rating=c.get("rating", 0.0),
                src_total_reviews=c.get("total_reviews", 0),
                src_primary_type=c.get("primary_type", ""),
                search_url="",
            )
            try:
                url, result_count, cards = search_hdmall(page, query, slug)
                r.search_url = url
                r.hdmall_result_count = result_count
                r.candidates = [asdict(card) for card in cards]
                # 매칭 best 선택: 이름 유사도 최고점
                if cards:
                    best = max(cards, key=lambda card: _name_similarity(c["name"], card.name))
                    r.best_match_name = best.name
                    r.best_match_url = best.url
                    r.best_match_rating = best.rating
                    r.best_match_rating_count = best.rating_count
                    r.best_match_score = _name_similarity(c["name"], best.name)
                    print(
                        f"[{i+1}/{len(sample)}] results={result_count} brands={len(cards)} "
                        f"best='{best.name[:35]}' score={r.best_match_score:.2f} "
                        f"rating={best.rating} reviews={best.rating_count}"
                    )
                else:
                    r.notes = f"no brand cards (result_count={result_count})"
                    print(f"[{i+1}/{len(sample)}] results={result_count} brands=0 NO_CARDS")
            except Exception as e:
                r.notes = f"error: {type(e).__name__}: {str(e)[:200]}"
                print(f"[{i+1}/{len(sample)}] ERROR: {r.notes}")
            results.append(r)
            time.sleep(1.5)

        ctx.close()
        browser.close()

    OUT_JSON.write_text(
        json.dumps([asdict(r) for r in results], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    total = len(results)
    matched = sum(1 for r in results if r.best_match_url and r.best_match_score >= 0.3)
    strong = sum(1 for r in results if r.best_match_url and r.best_match_score >= 0.5)
    has_rating = sum(1 for r in results if r.best_match_rating is not None)
    print()
    print("=" * 60)
    print(f"total: {total}")
    print(f"matched (name jaccard ≥0.30): {matched} ({100*matched/total:.0f}%)")
    print(f"strong matched (≥0.50): {strong} ({100*strong/total:.0f}%)")
    print(f"with HDmall rating: {has_rating} ({100*has_rating/total:.0f}%)")
    print(f"output: {OUT_JSON}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
