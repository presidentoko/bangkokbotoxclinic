"""
모발이식 클리닉 직접 텍스트 검색 — 그리드 없이 도시별 쿼리 1회 실행.

흐름:
  각 도시 × 쿼리 → Google Maps 텍스트 검색 → 스크롤 → place_id 수집
  → hair_output/<city>/discovered_places.csv 저장
  → hair_review_<city>.disabled 제거 (review 스크래퍼 자동 가동, 결과 있을 때만)
  → 완료 후 "처리할 포인트 없음. 종료." 출력 (watchdog grid_done_check)

재시도 정책: 도시별로 이미 discovered_places.csv 에 결과가 있으면(MIN_EXISTING
개 이상) 스킵 — bangkok/chiang_mai 는 다시 안 돌고 phuket/pattaya 처럼 0개인
도시만 자동으로 재시도됨. HAIR_FORCE_CITIES 환경변수(콤마구분)로 특정 도시만
강제 재실행 가능.
"""
from __future__ import annotations

import csv
import json
import logging
import os
import re
import tempfile
import time
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import quote_plus

ROOT = Path(__file__).resolve().parent.parent
HAIR_OUT = ROOT / "hair_output"
RUN_DIR  = ROOT / "run"
DONE_MARKER = "처리할 포인트 없음. 종료."
MIN_EXISTING_TO_SKIP = 10  # 이미 이만큼 발견돼 있으면 재실행 안 함

_TMPDIR = Path(tempfile.gettempdir())
VPN_PORT_BASE = 2080
ROTATE_TIMEOUT_SEC = 90

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

CITIES = [
    {"name": "bangkok",    "lat": 13.7462890, "lng": 100.5346890, "zoom": 12},
    {"name": "phuket",     "lat":  7.8804,    "lng":  98.3923,    "zoom": 12},
    {"name": "chiang_mai", "lat": 18.7883,    "lng":  98.9853,    "zoom": 12},
    {"name": "pattaya",    "lat": 12.9236,    "lng": 100.8825,    "zoom": 12},
]

# 모발이식 특화 쿼리 — 미용실/살롱 제외용으로 "transplant/ปลูก/이식" 키워드만 사용
QUERIES = [
    "hair transplant clinic Thailand",
    "FUE hair transplant Bangkok",
    "DHI hair transplant clinic",
    "คลินิกปลูกผม",
    "ปลูกผม กรุงเทพ",
    "모발이식 방콕",
]

EXCLUDE_RE = re.compile(
    r"hair removal|laser hair|barber|hair salon|wig|beauty salon|hair color|"
    r"แต่งผม|ทำสี|waxing|threading|blow dry",
    re.IGNORECASE,
)

PROXY_PORT = int(os.environ.get("HAIR_PROXY_PORT", "2080"))

DEAD_MARKERS = (
    "target page, context or browser has been closed",
    "err_socks_connection_failed",
    "err_proxy_connection_failed",
    "err_connection_reset",
    "err_connection_closed",
)


def _rotate_vpn_and_wait(port: int, timeout: float = ROTATE_TIMEOUT_SEC) -> bool:
    """proxy port 의 VPN 터널 교체 요청 후 nordvpn_runner 가 새 서버로 붙을 때까지 대기."""
    vpn_idx = port - VPN_PORT_BASE
    status_path = _TMPDIR / "vpn_status.json"
    old_server = ""
    try:
        data = json.loads(status_path.read_text())
        for p in data.get("ports", []):
            if p.get("idx") == vpn_idx:
                old_server = p.get("server", "")
                break
    except Exception:
        pass
    (_TMPDIR / f"rotate_port_{vpn_idx}").touch()
    log.info(f"  VPN rotate 요청 (idx={vpn_idx}, old={old_server})")
    deadline = time.time() + timeout
    while time.time() < deadline:
        time.sleep(1)
        try:
            data = json.loads(status_path.read_text())
            for p in data.get("ports", []):
                if p.get("idx") == vpn_idx:
                    cur = p.get("server", "")
                    if cur and cur != old_server and p.get("alive"):
                        log.info(f"  VPN rotated idx={vpn_idx} → {cur}")
                        return True
        except Exception:
            pass
    log.warning(f"  VPN rotate idx={vpn_idx} 타임아웃")
    return False

CSV_FIELDS = [
    "place_id", "name", "href",
    "rating", "review_count", "price_symbol", "primary_type",
    "address_hint", "status_hint", "raw_card_text",
    "first_seen_lat", "first_seen_lng",
]


@dataclass
class Place:
    place_id: str
    name: str
    href: str
    rating: str = ""
    review_count: int = 0
    price_symbol: str = ""
    primary_type: str = ""
    address_hint: str = ""
    status_hint: str = ""
    raw_card_text: str = ""
    first_seen_lat: float = 0.0
    first_seen_lng: float = 0.0


def _extract_place_id(href: str) -> str:
    m = re.search(r"place/[^/]+/(ChIJ[A-Za-z0-9_\-]+)", href)
    if m:
        return m.group(1)
    m = re.search(r"0x[0-9a-f]+:0x[0-9a-f]+", href)
    if m:
        return m.group(0)
    return ""


def _dismiss_consent(page) -> None:
    try:
        if "consent.google.com" in (page.url or ""):
            for sel in ('button[aria-label*="Accept"]', 'button[aria-label*="Agree"]',
                        'form[action*="consent"] button'):
                try:
                    btn = page.locator(sel).first
                    if btn.count() > 0:
                        btn.click(timeout=3000)
                        time.sleep(1)
                        break
                except Exception:
                    pass
    except Exception:
        pass


def _scroll_to_end(page, max_scrolls: int = 60, delay: float = 1.2) -> int:
    panel_sel = 'div[role="feed"]'
    count = 0
    prev_h = 0
    stable = 0
    for _ in range(max_scrolls):
        try:
            panel = page.locator(panel_sel).first
            if panel.count() == 0:
                break
            h = panel.evaluate("el => el.scrollHeight")
            panel.evaluate("el => el.scrollTop = el.scrollHeight")
            time.sleep(delay)
            new_h = panel.evaluate("el => el.scrollHeight")
            count += 1
            # 끝에 도달했는지 확인
            try:
                end_txt = page.locator('text="You\'ve reached the end of the list."').count()
                if end_txt > 0:
                    break
            except Exception:
                pass
            if new_h == prev_h:
                stable += 1
                if stable >= 3:
                    break
            else:
                stable = 0
            prev_h = new_h
        except Exception:
            break
    return count


def _extract_cards(page, lat: float, lng: float) -> list[Place]:
    results: list[Place] = []
    seen: set[str] = set()

    cards = page.locator('div.Nv2PK')
    n = cards.count()
    for i in range(n):
        try:
            card = cards.nth(i)
            link = card.locator('a[href*="/maps/place/"]').first
            if link.count() == 0:
                continue
            href = link.get_attribute("href") or ""
            pid = _extract_place_id(href)
            if not pid or pid in seen:
                continue
            seen.add(pid)

            aria = link.get_attribute("aria-label") or ""
            try:
                card_text = card.inner_text(timeout=1500)
            except Exception:
                card_text = ""

            name = aria.strip() or (card_text.split("\n")[0].strip() if card_text else "")

            # 모발이식 무관 제외
            if EXCLUDE_RE.search(f"{name} {card_text[:100]}"):
                continue

            # 별점
            rating = ""
            review_count = 0
            try:
                star_el = card.locator('span.ZkP5Je').first
                if star_el.count() > 0:
                    sa = star_el.get_attribute("aria-label") or ""
                    m = re.search(r"(\d+\.\d+)", sa)
                    if m:
                        rating = m.group(1)
                    m2 = re.search(r"(\d[\d,]*)\s*(?:Reviews?|리뷰|个)", sa, re.I)
                    if m2:
                        review_count = int(m2.group(1).replace(",", ""))
            except Exception:
                pass

            # 카테고리 힌트
            primary_type = ""
            lines = card_text.split("\n") if card_text else []
            if len(lines) > 2:
                primary_type = lines[2].strip()

            results.append(Place(
                place_id=pid, name=name, href=href,
                rating=rating, review_count=review_count,
                primary_type=primary_type,
                raw_card_text=card_text[:300],
                first_seen_lat=lat, first_seen_lng=lng,
            ))
        except Exception:
            continue

    return results


def search_city(city: dict) -> list[Place]:
    from playwright.sync_api import sync_playwright

    lat, lng, zoom = city["lat"], city["lng"], city["zoom"]
    all_places: dict[str, Place] = {}

    def _launch(pw):
        browser = pw.chromium.launch(
            headless=True,
            slow_mo=80,
            proxy={"server": f"socks5://127.0.0.1:{PROXY_PORT}"},
            args=["--no-sandbox", "--disable-gpu", "--lang=en-US"],
        )
        ctx = browser.new_context(locale="en-US")
        page = ctx.new_page()
        return browser, ctx, page

    with sync_playwright() as pw:
        browser, ctx, page = _launch(pw)

        for query in QUERIES:
            url = (f"https://www.google.com/maps/search/{quote_plus(query)}/"
                   f"@{lat:.6f},{lng:.6f},{zoom}z?hl=en")
            log.info(f"  [{city['name']}] 검색: {query}")

            rebuilds_left = 2  # SOCKS dead 시 VPN rotate + 브라우저 재시작 후 재시도
            loaded = False
            while True:
                last_err = ""
                for attempt in range(3):
                    try:
                        page.goto(url, wait_until="domcontentloaded", timeout=25000)
                        time.sleep(3)
                        _dismiss_consent(page)
                        loaded = True
                        break
                    except Exception as e:
                        last_err = str(e)
                        log.warning(f"    goto 실패 (시도 {attempt+1}): {last_err[:60]}")
                        time.sleep(3)

                if loaded:
                    break

                is_dead = any(m in last_err.lower() for m in DEAD_MARKERS)
                if is_dead and rebuilds_left > 0:
                    rebuilds_left -= 1
                    log.warning(f"  [{city['name']}] SOCKS dead 감지 → VPN rotate + 브라우저 재시작")
                    for obj in (ctx, browser):
                        try:
                            obj.close()
                        except Exception:
                            pass
                    _rotate_vpn_and_wait(PROXY_PORT)
                    try:
                        browser, ctx, page = _launch(pw)
                    except Exception as e:
                        log.error(f"  [{city['name']}] 브라우저 재시작 실패: {e}")
                        break
                    continue

                log.warning(f"  [{city['name']}] {query} — 로드 실패, 스킵")
                break

            if not loaded:
                continue

            n_scrolls = _scroll_to_end(page)
            log.info(f"    스크롤 {n_scrolls}회")

            places = _extract_cards(page, lat, lng)
            new_count = 0
            for p in places:
                if p.place_id not in all_places:
                    all_places[p.place_id] = p
                    new_count += 1
            log.info(f"    신규 {new_count}개 (총 {len(all_places)}개)")
            time.sleep(2)

        for obj in (ctx, browser):
            try:
                obj.close()
            except Exception:
                pass

    return list(all_places.values())


def save_discovered(city_name: str, places: list[Place]) -> None:
    out_dir = HAIR_OUT / city_name
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "discovered_places.csv"

    # 기존 파일 읽어서 합치기
    existing: dict[str, dict] = {}
    if csv_path.exists():
        try:
            with open(csv_path, encoding="utf-8-sig") as f:
                for row in csv.DictReader(f):
                    existing[row["place_id"]] = row
        except Exception:
            pass

    for p in places:
        existing[p.place_id] = {
            "place_id": p.place_id, "name": p.name, "href": p.href,
            "rating": p.rating, "review_count": p.review_count,
            "price_symbol": p.price_symbol, "primary_type": p.primary_type,
            "address_hint": p.address_hint, "status_hint": p.status_hint,
            "raw_card_text": p.raw_card_text,
            "first_seen_lat": p.first_seen_lat, "first_seen_lng": p.first_seen_lng,
        }

    tmp_path = csv_path.with_suffix(".csv.tmp")
    with open(tmp_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(existing.values())
    os.replace(tmp_path, csv_path)

    log.info(f"  [{city_name}] 저장 완료: {len(existing)}개 → {csv_path}")
    return len(existing)


def _existing_count(city_name: str) -> int:
    csv_path = HAIR_OUT / city_name / "discovered_places.csv"
    if not csv_path.exists():
        return 0
    try:
        with open(csv_path, encoding="utf-8-sig") as f:
            return sum(1 for _ in csv.DictReader(f))
    except Exception:
        return 0


def main():
    force = {c.strip() for c in os.environ.get("HAIR_FORCE_CITIES", "").split(",") if c.strip()}

    log.info("=== 모발이식 직접 검색 시작 ===")
    log.info(f"쿼리 {len(QUERIES)}개 × 도시 {len(CITIES)}개, proxy=127.0.0.1:{PROXY_PORT}")

    ran_any = False
    for city in CITIES:
        name = city["name"]
        existing_n = _existing_count(name)
        if name not in force and existing_n >= MIN_EXISTING_TO_SKIP:
            log.info(f"[{name}] 이미 {existing_n}개 발견됨 — 스킵 (재실행하려면 HAIR_FORCE_CITIES={name})")
            continue

        ran_any = True
        log.info(f"[{name}] 검색 시작 (기존 {existing_n}개)")
        try:
            places = search_city(city)
        except Exception as e:
            log.error(f"[{name}] 오류: {e}")
            places = []

        total_n = save_discovered(name, places)

        # review 스크래퍼는 실제로 수집된 게 있을 때만 활성화 — 0개인데 활성화하면
        # review 워커가 빈 큐 붙잡고 무한 대기하다 crash-loop 로 영구 disabled 됨.
        dis = RUN_DIR / f"hair_review_{name}.disabled"
        if total_n > 0:
            if dis.exists():
                dis.unlink()
                log.info(f"  [{name}] hair_review 활성화 ({total_n}개)")
        else:
            log.warning(f"  [{name}] 수집 0개 — hair_review 활성화 안 함, 다음 사이클에 재시도")

    if not ran_any:
        log.info("모든 도시가 이미 충분한 데이터 보유 — 재실행 없음.")
    log.info("=== 모발이식 직접 검색 사이클 종료 ===")
    log.info(DONE_MARKER)


if __name__ == "__main__":
    main()
