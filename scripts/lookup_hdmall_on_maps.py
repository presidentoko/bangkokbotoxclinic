"""outreach_hdmall_unmatched.csv → Google Maps 검색 → place_id + URL 확보.

각 unmatched HDmall brand에 대해:
1. Google Maps 'q=<brand> Bangkok' 검색
2. 첫 result 클릭 → place_id 추출 (URL의 !1s<hex>:<hex>! 패턴)
3. 클리닉 시그널 (rating/reviews/primary_type) 확인
4. Bangkok 위치면 outreach_hdmall_discovered.csv에 저장

결과는 별도 import 스크립트가 master_db에 흡수 가능.
resume 지원: 이미 검색된 brand 자동 스킵.
"""
from __future__ import annotations

import argparse
import csv
import json
import random
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from threading import Lock

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

ROOT = Path(__file__).resolve().parents[1]
INPUT_CSV = ROOT / "outreach_hdmall_unmatched.csv"
OUTPUT_CSV = ROOT / "outreach_hdmall_discovered.csv"
LOG_FILE = ROOT / "logs" / "hdmall_maps_lookup.log"
LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

PLACE_ID_RE = re.compile(r"!1s(0x[a-f0-9]+):(0x[a-f0-9]+)!")
COORDS_RE = re.compile(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)")
PLACE_NAME_RE = re.compile(r"/place/([^/@]+)")
# Reject obvious "search results page" titles
REJECT_NAMES = {"ผลลัพธ์", "Results", "Search results", "검색 결과"}
# Greater Bangkok bbox — Nonthaburi, Pathum Thani, Samut Prakan 외곽 분원까지 포함
# (기존 13.5-14.0 / 100.3-100.9 는 방콕시 좁은 영역만 잡아 외곽 분원이 빠지는 문제)
BKK_LAT = (13.3, 14.2)
BKK_LNG = (100.1, 101.0)
# Clinic name 필터 — 검색 결과가 명백히 비의료(스파/식당 등)이면 reject
CLINIC_NAME_BLOCK_RE = re.compile(
    r"\b(spa|massage|salon|cafe|restaurant|hotel|condo|apartment|fitness|gym|"
    r"car\s*wash|barbershop|laundry|coffee|bakery)\b", re.I
)
# Clinic-positive 키워드 — 적어도 하나는 이름에 있어야 통과
CLINIC_NAME_ALLOW_RE = re.compile(
    r"\b(clinic|dental|dentist|medical|aesthetic|aesthetique|derm|skin|hair|eye|"
    r"laser|hospital|plastic|surgery|surgeon|anti.aging|wellness|center|centre|"
    r"คลินิก|ทันตกรรม|เวชกรรม|ศูนย์|โรงพยาบาล|ปลูกผม|ผิว|จัดฟัน)\b", re.I
)

_log_lock = Lock()


def log(msg: str, lvl: str = "INFO") -> None:
    line = f"{datetime.now():%Y-%m-%d %H:%M:%S} [{lvl}] {msg}"
    with _log_lock:
        print(line, flush=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")


def is_bangkok(lat: float, lng: float) -> bool:
    return BKK_LAT[0] <= lat <= BKK_LAT[1] and BKK_LNG[0] <= lng <= BKK_LNG[1]


def _tokens(s: str) -> set[str]:
    """소문자 정규화 + 영문/태국어 토큰. 공통 stopword 제외."""
    import urllib.parse
    s = urllib.parse.unquote(s).lower()
    s = re.sub(r"\([^)]+\)", " ", s)
    s = re.sub(r"\[[^\]]+\]", " ", s)
    s = re.sub(r"สาขา\s*\S+", " ", s)
    s = re.sub(r"[^\w\s]", " ", s, flags=re.UNICODE)
    toks = set(s.split())
    STOP = {"clinic", "medical", "center", "centre", "hospital", "dental", "the", "and",
            "bangkok", "thailand", "co", "ltd", "by",
            "คลินิก", "ทันตกรรม", "เวชกรรม", "ศูนย์"}
    return {t for t in toks if t not in STOP and len(t) > 1}


def is_likely_match(brand_name: str, place_name: str) -> bool:
    """brand_name(HDmall) 과 place_name(GMaps) 가 같은 클리닉을 가리키는지 휴리스틱."""
    if not place_name or place_name in REJECT_NAMES:
        return False
    ta = _tokens(brand_name)
    tb = _tokens(place_name)
    if not ta or not tb:
        return False
    inter = len(ta & tb)
    if inter == 0:
        return False
    # 최소 1개 substantial token 공유 + 작은 셋 기준으로 30% 이상 contained
    # (40% → 30% 완화: 약어/긴 이름 매칭율 향상, false positive는 별도 검증으로 차단)
    smaller = min(len(ta), len(tb))
    return inter / smaller >= 0.3


def match_confidence(brand_name: str, place_name: str, rating_str: str, reviews_str: str) -> float:
    """0-1 매칭 신뢰도. import 단계에서 stub 의 _match_confidence 로 저장.
    낮은 confidence 는 admin '신규 stub 검토' 탭에서 우선 검수."""
    score = 0.0

    # Token 일치 강도 (0~0.4)
    ta = _tokens(brand_name)
    tb = _tokens(place_name)
    if ta and tb:
        smaller = min(len(ta), len(tb))
        if smaller > 0:
            overlap = len(ta & tb) / smaller
            score += min(0.4, overlap * 0.4)

    # 이름이 clinic-positive 키워드 포함 (0.25)
    if CLINIC_NAME_ALLOW_RE.search(place_name):
        score += 0.25
    # 이름이 명시적 block 키워드면 페널티
    if CLINIC_NAME_BLOCK_RE.search(place_name):
        score -= 0.4

    # Rating signal (0~0.2) — 4.0+ 이면 만점
    try:
        r = float(rating_str)
        if r >= 4.0:
            score += 0.2
        elif r >= 3.5:
            score += 0.1
    except (ValueError, TypeError):
        pass

    # Review volume signal (0~0.15) — 20+ 면 만점, log scale
    try:
        rv = int(reviews_str.replace(",", "")) if reviews_str else 0
        if rv >= 20:
            score += 0.15
        elif rv >= 5:
            score += 0.07
    except (ValueError, TypeError):
        pass

    return round(max(0.0, min(1.0, score)), 2)


def load_already_done() -> set[str]:
    done = set()
    if OUTPUT_CSV.exists():
        with OUTPUT_CSV.open("r", encoding="utf-8", newline="") as f:
            for row in csv.DictReader(f):
                done.add(row.get("brand_name", ""))
    return done


def load_existing_place_ids() -> set[str]:
    """master_db 에 이미 있는 place_id set — 중복 import 방지."""
    master = ROOT / "web" / "data" / "master_db.json"
    if not master.exists():
        return set()
    db = json.loads(master.read_text(encoding="utf-8"))
    return {c.get("place_id", "") for c in db.get("clinics", [])}


def dismiss_consent(page) -> None:
    for sel in ['button[aria-label*="Accept"]', 'button:has-text("Accept all")']:
        try:
            b = page.locator(sel).first
            if b.is_visible(timeout=1200):
                b.click(timeout=1500)
                page.wait_for_timeout(500)
                return
        except Exception:
            pass


def _try_single_query(page, brand_name: str, query: str) -> dict | None:
    """단일 쿼리 시도. 매칭 + Bangkok bbox 통과시 dict, 아니면 None."""
    url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(random.randint(2000, 3500))
    except PWTimeout:
        return None
    dismiss_consent(page)
    return _extract_result(page, brand_name)


def lookup_one(page, brand_name: str) -> dict | None:
    """반환: {place_id, name, rating, reviews, lat, lng, maps_url, match_confidence} 또는 None.

    Variant retry: 첫 시도 "brand Bangkok" 실패 시 brand 단독으로 한 번 더.
    (Bangkok 명시가 외곽 분원 / 일반명 brand 매칭을 막는 경우 보완.)"""
    for query in (f"{brand_name} Bangkok", brand_name):
        res = _try_single_query(page, brand_name, query)
        if res:
            return res
        # 다음 variant 시도 전 짧은 휴식
        time.sleep(random.uniform(1.0, 2.0))
    return None


def _extract_result(page, brand_name: str) -> dict | None:
    """현재 page 가 /place/ URL 이면 추출 + 검증. None = reject."""

    # 검색 결과가 단일 매칭이면 자동으로 place page로 redirect됨.
    # 여러 결과면 첫 번째 클릭.
    cur_url = page.url
    if "/place/" not in cur_url:
        # Try clicking first result
        try:
            first = page.locator('a[href*="/place/"]').first
            if first.is_visible(timeout=2500):
                first.click(timeout=2500)
                page.wait_for_timeout(random.randint(2000, 3500))
                cur_url = page.url
        except Exception:
            pass

    if "/place/" not in cur_url:
        return None

    # URL의 /place/<NAME>/ 부분에서 place_name 추출 (먼저 검증)
    pm = PLACE_NAME_RE.search(cur_url)
    place_name_from_url = pm.group(1).replace("+", " ") if pm else ""

    # Brand 와 place_name 매칭 검증 (잘못된 fallback 결과 reject)
    if not is_likely_match(brand_name, place_name_from_url):
        return None

    # place_id 추출
    m = PLACE_ID_RE.search(cur_url)
    if not m:
        return None
    cid_hex = f"{m.group(1)}:{m.group(2)}"

    # 좌표 추출
    lat = lng = None
    cm = COORDS_RE.search(cur_url)
    if cm:
        try:
            lat = float(cm.group(1))
            lng = float(cm.group(2))
        except ValueError:
            pass

    # Bangkok 외부 reject
    if lat and lng and not is_bangkok(lat, lng):
        log(f"  skip — out of Bangkok bbox ({lat:.3f},{lng:.3f}): {brand_name}", lvl="DEBUG")
        return None

    # 페이지 데이터: name, rating, reviews
    name = ""
    rating = ""
    reviews = ""
    primary_type = ""
    try:
        # h1 = 진짜 이름
        h1 = page.locator('h1').first
        if h1.is_visible(timeout=1500):
            name = h1.inner_text(timeout=1500).strip()
    except Exception:
        pass
    try:
        rating_el = page.locator('span[aria-hidden="true"]').first
        # Get rating element near the h1
        # Use simpler regex on page HTML
        html = page.content()
        rm = re.search(r'aria-label="(\d\.\d) stars?"', html)
        if rm:
            rating = rm.group(1)
        rev_m = re.search(r'aria-label="(\d{1,3}(?:,\d{3})*)\s+reviews?"', html)
        if rev_m:
            reviews = rev_m.group(1).replace(",", "")
    except Exception:
        pass

    # 자동 거부: 명시 block 키워드 매칭 (spa/salon/cafe 등) → false positive 차단
    if CLINIC_NAME_BLOCK_RE.search(name or place_name_from_url):
        log(f"  skip — block keyword in name ({name or place_name_from_url}): {brand_name}", lvl="DEBUG")
        return None

    confidence = match_confidence(brand_name, name or place_name_from_url, rating, reviews)

    return {
        "brand_name": brand_name,
        "place_id": cid_hex,
        "found_name": name,
        "rating": rating,
        "reviews": reviews,
        "lat": lat or "",
        "lng": lng or "",
        "maps_url": cur_url,
        "match_confidence": confidence,
    }


def worker(worker_id: int, brands: list[str], already_done: set[str], existing_pids: set[str]) -> int:
    n_found = 0
    n_dup = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled"])
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            locale="en-US",
            viewport={"width": 1366, "height": 900},
        )
        page = ctx.new_page()
        for brand in brands:
            if brand in already_done:
                continue
            try:
                res = lookup_one(page, brand)
                if res:
                    if res["place_id"] in existing_pids:
                        n_dup += 1
                        log(f"[W{worker_id}] DUP {brand[:45]:45} → place_id 이미 master_db에 있음")
                        continue
                    n_found += 1
                    conf = res.get("match_confidence", 0.0)
                    log(f"[W{worker_id}] OK  {brand[:45]:45} → {res['found_name'][:35]} ({res['rating']}/{res['reviews']}) conf={conf}")
                    # 안전 append (lock + flush)
                    with _log_lock:
                        write_header = not OUTPUT_CSV.exists()
                        with OUTPUT_CSV.open("a", encoding="utf-8", newline="") as f:
                            w = csv.DictWriter(f, fieldnames=["brand_name", "place_id", "found_name", "rating", "reviews", "lat", "lng", "maps_url", "match_confidence"])
                            if write_header:
                                w.writeheader()
                            w.writerow(res)
                else:
                    log(f"[W{worker_id}] -   {brand[:45]:45} (no Bangkok result)")
                time.sleep(random.uniform(2.0, 4.0))
            except Exception as e:
                log(f"[W{worker_id}] ERR {brand[:45]:45} {str(e)[:80]}", lvl="WARN")
        browser.close()
    log(f"[W{worker_id}] worker totals: found={n_found} dup={n_dup}")
    return n_found


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--limit", type=int, default=None, help="Run on top N only")
    args = ap.parse_args()

    if not INPUT_CSV.exists():
        log(f"INPUT NOT FOUND: {INPUT_CSV}", lvl="ERROR")
        return 1

    already_done = load_already_done()
    existing_pids = load_existing_place_ids()
    log(f"Already done: {len(already_done)} | master_db existing place_ids: {len(existing_pids)}")

    brands = []
    with INPUT_CSV.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            name = row.get("brand_name", "").strip()
            if name and name not in already_done:
                brands.append(name)

    if args.limit:
        brands = brands[: args.limit]

    log(f"To process: {len(brands)} brands across {args.workers} workers")
    buckets = [[] for _ in range(args.workers)]
    for i, b in enumerate(brands):
        buckets[i % args.workers].append(b)

    total = 0
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futs = {ex.submit(worker, i + 1, buckets[i], already_done, existing_pids): i + 1 for i in range(args.workers)}
        for fut in as_completed(futs):
            wid = futs[fut]
            try:
                r = fut.result()
                log(f"[W{wid}] DONE found={r}")
                total += r
            except Exception as e:
                log(f"[W{wid}] CRASH {e}", lvl="ERROR")
    log(f"전체 완료: discovered={total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
