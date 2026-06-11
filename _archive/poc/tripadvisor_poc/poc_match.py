"""TripAdvisor 매칭 PoC.

목표: web/data/master_db.json의 Bangkok 클리닉 N개를 TripAdvisor에서 검색해서
매칭률(이름+위치로 매칭되는 비율) + 어떤 데이터 뽑을 수 있는지 측정.

사용 슬롯: SOCKS5 포트 2080 (현재 idle — grid 종료 후 비어있음).
1 worker, headless, 요청 간 2-3s 슬립으로 GMaps 스크래퍼와 자원 충돌 최소화.
"""
from __future__ import annotations

import json
import math
import random
import re
import sys
import time
import urllib.parse
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Optional

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

ROOT = Path(__file__).parent.parent
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
OUT_JSON = Path(__file__).parent / "poc_results.json"
DEBUG_DIR = Path(__file__).parent / "debug_html"
# PoC v2: 직결. 10 요청은 TA가 ratelimit하지 않을 것. 차단되면 proxy로 전환.
PROXY = None  # e.g. "socks5://127.0.0.1:2083" if needed
SAMPLE_SIZE = 10
CITY_SLUG = "bangkok"

CLINIC_TYPES = (
    "clinic", "dental", "medical", "hospital", "beauty",
    "cosmetic", "surgery", "skin", "spa", "aesthetic", "laser",
)


@dataclass
class MatchResult:
    src_name: str
    src_place_id: str
    src_lat: float
    src_lng: float
    src_rating: float
    src_total_reviews: int
    search_url: str
    ta_url: Optional[str] = None
    ta_name: Optional[str] = None
    ta_rating: Optional[float] = None
    ta_review_count: Optional[int] = None
    ta_category: Optional[str] = None
    match_score: float = 0.0
    notes: str = ""


def _normalize(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^\w\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _name_similarity(a: str, b: str) -> float:
    """간단한 token Jaccard. 0~1."""
    ta = set(_normalize(a).split())
    tb = set(_normalize(b).split())
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


def pick_sample() -> list[dict]:
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = [c for c in db["clinics"] if c.get("city_slug") == CITY_SLUG]
    # 진짜 클리닉만 — primary_type이 의료/미용 관련 키워드 포함
    def is_clinic(c):
        t = (c.get("primary_type") or "").lower()
        return any(k in t for k in CLINIC_TYPES)
    clinics = [c for c in clinics if is_clinic(c)]
    clinics.sort(key=lambda c: c.get("total_reviews", 0), reverse=True)
    return clinics[:SAMPLE_SIZE]


def search_tripadvisor(page, query: str, debug_slug: str) -> tuple[str, Optional[dict]]:
    """TA 검색 → 첫 번째 attraction/health 결과 후보 반환.

    매칭 실패 시 debug_html/<slug>.html 로 페이지 저장해서 셀렉터 디버그.
    """
    q = urllib.parse.quote_plus(query)
    url = f"https://www.tripadvisor.com/Search?q={q}"
    page.goto(url, wait_until="domcontentloaded", timeout=45000)
    # 페이지 안정화 짧게 — JS 렌더링 결과 카드 대기
    try:
        page.wait_for_load_state("networkidle", timeout=8000)
    except PWTimeout:
        pass
    # 결과 카드 후보 셀렉터 (TA가 자주 바꿈 — 광범위하게 시도)
    selectors = [
        "a[href*='/Attraction_Review']",
        "a[href*='/AttractionProductReview']",
        "a[href*='-d'][href*='-Reviews']",  # 일반 review 페이지
        "a[href*='/ShowUserReviews']",
        "[data-automation='search-result-card'] a",
        "div.result-card a",
        "a[href*='tripadvisor.com'][href*='-d']",
    ]
    first_href = None
    first_text = None
    matched_sel = None
    for sel in selectors:
        try:
            el = page.query_selector(sel)
            if el:
                href = el.get_attribute("href")
                if href and ("-d" in href or "Attraction_Review" in href):
                    first_href = href
                    first_text = (el.inner_text() or "").strip().split("\n")[0]
                    matched_sel = sel
                    break
        except Exception:
            continue
    if not first_href:
        # 디버그용 페이지 저장
        try:
            DEBUG_DIR.mkdir(exist_ok=True)
            (DEBUG_DIR / f"{debug_slug}.html").write_text(page.content(), encoding="utf-8")
            title = page.title()[:80]
            body_snippet = (page.inner_text("body")[:200] if page.query_selector("body") else "")
            print(f"    [debug] title={title!r} body_start={body_snippet!r}")
        except Exception:
            pass
        return url, None
    if first_href.startswith("/"):
        first_href = "https://www.tripadvisor.com" + first_href
    return url, {"href": first_href, "title": first_text, "selector": matched_sel}


def fetch_ta_page(page, url: str) -> dict:
    """TA 디테일 페이지에서 이름/평점/리뷰수/카테고리 추출."""
    page.goto(url, wait_until="domcontentloaded", timeout=30000)
    out = {}
    # H1
    try:
        h1 = page.query_selector("h1")
        if h1:
            out["name"] = (h1.inner_text() or "").strip()
    except Exception:
        pass
    # 평점 — TA는 svg/aria-label로 노출
    try:
        bubble = page.query_selector("svg[aria-label*='of 5 bubbles'], svg[aria-label*='out of 5']")
        if bubble:
            lbl = bubble.get_attribute("aria-label") or ""
            m = re.search(r"([\d.]+)\s*(?:of|out of)\s*5", lbl)
            if m:
                out["rating"] = float(m.group(1))
    except Exception:
        pass
    # 리뷰 카운트
    try:
        body_text = page.inner_text("body")
        m = re.search(r"([\d,]+)\s*review", body_text, re.IGNORECASE)
        if m:
            out["review_count"] = int(m.group(1).replace(",", ""))
    except Exception:
        pass
    # 카테고리 (breadcrumb)
    try:
        crumbs = page.query_selector_all("nav a, [data-automation='breadcrumb'] a")
        if crumbs:
            out["category"] = " > ".join((c.inner_text() or "").strip() for c in crumbs if c.inner_text())[:200]
    except Exception:
        pass
    return out


def main() -> int:
    sample = pick_sample()
    print(f"sample size: {len(sample)} bangkok clinics (top by total_reviews)")
    for i, c in enumerate(sample):
        print(f"  {i+1}. {c['name'][:60]} | {c['primary_type']} | reviews={c['total_reviews']}")

    results: list[MatchResult] = []

    with sync_playwright() as pw:
        launch_kwargs = dict(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-features=IsolateOrigins,site-per-process",
            ],
        )
        if PROXY:
            launch_kwargs["proxy"] = {"server": PROXY}
        browser = pw.chromium.launch(**launch_kwargs)
        ctx = browser.new_context(
            locale="en-US",
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
            extra_http_headers={"Accept-Language": "en-US,en;q=0.9"},
        )
        ctx.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
        )
        page = ctx.new_page()
        page.set_default_timeout(20000)

        for i, c in enumerate(sample):
            query = f"{c['name']} Bangkok"
            r = MatchResult(
                src_name=c["name"],
                src_place_id=c["place_id"],
                src_lat=c.get("lat", 0.0),
                src_lng=c.get("lng", 0.0),
                src_rating=c.get("rating", 0.0),
                src_total_reviews=c.get("total_reviews", 0),
                search_url="",
            )
            try:
                slug = re.sub(r"[^a-zA-Z0-9]+", "_", c["name"])[:40].strip("_") or f"clinic_{i+1}"
                search_url, first = search_tripadvisor(page, query, slug)
                r.search_url = search_url
                if not first:
                    r.notes = "no search result"
                    print(f"[{i+1}/{len(sample)}] NO_MATCH: {c['name'][:50]}")
                else:
                    detail = fetch_ta_page(page, first["href"])
                    r.ta_url = first["href"]
                    r.ta_name = detail.get("name") or first.get("title")
                    r.ta_rating = detail.get("rating")
                    r.ta_review_count = detail.get("review_count")
                    r.ta_category = detail.get("category")
                    r.match_score = _name_similarity(c["name"], r.ta_name or "")
                    print(
                        f"[{i+1}/{len(sample)}] match_score={r.match_score:.2f} "
                        f"src='{c['name'][:30]}' → ta='{(r.ta_name or '')[:40]}' "
                        f"rating={r.ta_rating} reviews={r.ta_review_count}"
                    )
            except Exception as e:
                r.notes = f"error: {type(e).__name__}: {str(e)[:200]}"
                print(f"[{i+1}/{len(sample)}] ERROR: {r.notes}")
            results.append(r)
            time.sleep(random.uniform(2.0, 3.5))

        ctx.close()
        browser.close()

    OUT_JSON.write_text(
        json.dumps([asdict(r) for r in results], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    # 요약
    total = len(results)
    matched = sum(1 for r in results if r.ta_url and r.match_score >= 0.3)
    strong = sum(1 for r in results if r.ta_url and r.match_score >= 0.5)
    print()
    print("=" * 60)
    print(f"total: {total}")
    print(f"matched (score≥0.30): {matched} ({100*matched/total:.0f}%)")
    print(f"strong matched (score≥0.50): {strong} ({100*strong/total:.0f}%)")
    print(f"output: {OUT_JSON}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
