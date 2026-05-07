"""
Bangkok Restaurant Google Maps Scraper (Full metadata edition)
- Playwright + SOCKS5 프록시 (다중 슬롯 VPN)
- 식당 검색 → 상세 + About 탭 전 features → 리뷰(+ author UUID + 구조화 메타)
- place_id 기반 파일 생성
"""

from __future__ import annotations

import csv
import json
import re
import sys
import tempfile
import time
import logging
import threading
from dataclasses import dataclass, field
from pathlib import Path
from queue import Queue, Empty
from urllib.parse import quote_plus

# 매우 긴 필드(영업시간 등 누적 머지로 비대해진 셀) 읽을 수 있도록 한도 상향.
# Windows C long 한도로 OverflowError 나는 케이스 회피.
_csv_max = sys.maxsize
while True:
    try:
        csv.field_size_limit(_csv_max)
        break
    except OverflowError:
        _csv_max = int(_csv_max / 10)

_TMPDIR = Path(tempfile.gettempdir())

from playwright.sync_api import sync_playwright, Page

import config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ── VPN rotation 정책 ────────────────────────────────────────
MAX_TASK_RETRIES = 2         # 작업 1건당 최대 재시도 횟수 (초과 시 포기)
SLOW_THRESHOLD_SEC = 120     # 1건 처리 시간이 이 이상이면 다음 작업 전 VPN 교체
ROTATE_TIMEOUT_SEC = 90      # vpn_runner가 새 터널을 올릴 때까지 최대 대기 (45→90, NordVPN 일부 서버 boot 30s+)
ROTATE_EVERY_TASKS = 15      # 이 주기(성공 건수)마다 워커가 정기적으로 VPN 교체


def _rotate_vpn_and_wait(vpn_idx: int, timeout: float = ROTATE_TIMEOUT_SEC) -> bool:
    """
    vpn_idx = nordvpn_runner 에서 관리하는 포트 인덱스 (port - VPN_PORT_BASE).
    /tmp/rotate_port_<vpn_idx> 를 touch해서 runner 에 rotate 신호.
    /tmp/vpn_status.json 에서 server 가 바뀌고 alive=True 될 때까지 대기.
    """
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


def _vpn_idx_for(port: int) -> int:
    """proxy port 번호 → nordvpn_runner 의 idx"""
    return port - config.VPN_PORT_BASE


# ── 데이터 구조 ──────────────────────────────────────────────

@dataclass
class Restaurant:
    # 기본 식별
    place_id: str
    name: str
    primary_type: str = ""           # 예: Indian restaurant
    # 위치
    formatted_address: str = ""
    plus_code: str = ""
    latitude: str = ""
    longitude: str = ""
    # 연락
    phone: str = ""                  # 로컬 형식
    website: str = ""
    # 평가/가격
    rating: str = ""                 # 4.7
    total_reviews: int = 0
    price_level: str = ""            # aria-label: "Moderately priced"
    price_symbol: str = ""           # UI 표시 기호 (₩₩ 등)
    # 상태/부가
    business_status: str = ""        # Open / Temporarily closed / Permanently closed
    editorial_summary: str = ""
    menu_url: str = ""
    maps_url: str = ""


@dataclass
class RestaurantFeature:
    """About 탭의 각 섹션 아래 표시된 feature 한 건"""
    place_id: str
    section: str      # "Service options", "Offerings", etc.
    feature: str      # "Dine-in", "Vegetarian options" 등
    present: int = 1  # 표시되어 있으면 1 (Google Maps는 해당하는 것만 표시함)


@dataclass
class RestaurantHours:
    place_id: str
    day: str          # Monday, Tuesday, ...
    hours_text: str   # "11 AM to 11 PM" 혹은 "Closed"


@dataclass
class ReviewItem:
    review_id: str
    place_id: str
    restaurant_name: str
    rating: int
    text: str
    # author
    author_name: str
    author_id: str             # contributor 21자리 숫자 ID
    author_uri: str            # 전체 contributor URL
    author_photo_uri: str
    author_is_local_guide: int = 0   # 0/1
    author_review_count: int = 0
    author_photo_count: int = 0
    relative_date: str = ""
    spent_amount: str = ""
    sort_source: str = ""      # "relevant" | "newest"


@dataclass
class ReviewMeta:
    review_id: str
    place_id: str
    food_rating: str = ""
    service_rating: str = ""
    atmosphere_rating: str = ""
    meal_type: str = ""
    price_per_person: str = ""
    group_size: str = ""
    wait_time: str = ""
    reservation: str = ""
    service_type: str = ""
    recommended_dishes: str = ""


# ── 유틸리티 ─────────────────────────────────────────────────

def safe_sleep(sec: float = 1.5):
    time.sleep(sec)


def add_hl_en(url: str) -> str:
    if "hl=" in url:
        return re.sub(r"hl=[a-z-]+", "hl=en", url)
    return url + ("&hl=en" if "?" in url else "?hl=en")


def extract_place_id_from_url(url: str) -> str:
    m = re.search(r"!1s(0x[0-9a-f]+:[0-9a-fx]+)", url)
    if m:
        return m.group(1)
    m = re.search(r"/place/([^/]+)/", url)
    if m:
        return m.group(1)[:60]
    return f"url_{hash(url) % 10**8}"


def extract_coords_from_url(url: str) -> tuple[str, str]:
    m = re.search(r"@(-?\d+\.\d+),(-?\d+\.\d+)", url)
    if m:
        return m.group(1), m.group(2)
    return "", ""


def place_id_to_filename(place_id: str) -> str:
    return place_id.replace(":", "_")


def scroll_all_panels(page: Page, times: int = 3, delay: float = 1.0):
    for _ in range(times):
        try:
            page.evaluate("""() => {
                document.querySelectorAll('div').forEach(el => {
                    const s = getComputedStyle(el);
                    if ((s.overflowY === 'auto' || s.overflowY === 'scroll')
                        && el.scrollHeight > el.clientHeight + 10) {
                        el.scrollTop = el.scrollHeight;
                    }
                });
            }""")
        except Exception:
            pass
        safe_sleep(delay)


_SOCKS_ERR_PATTERNS = (
    "ERR_SOCKS_CONNECTION_FAILED",
    "ERR_PROXY_CONNECTION_FAILED",
    "ERR_TUNNEL_CONNECTION_FAILED",
    "ERR_EMPTY_RESPONSE",
    "ERR_CONNECTION_CLOSED",
    "ERR_CONNECTION_RESET",
    "ERR_CONNECTION_REFUSED",
    "ERR_CONNECTION_TIMED_OUT",
)


def is_socks_dead_error(msg: str) -> bool:
    return any(p in msg for p in _SOCKS_ERR_PATTERNS)


class SocksDeadError(Exception):
    """SOCKS proxy died; workers should catch this and rotate VPN immediately."""


class GotoExhaustedError(Exception):
    """goto 가 retries 번 다 실패 — context rebuild + VPN rotate 필요"""


def goto_with_retry(page: Page, url: str, wait_until: str = "domcontentloaded",
                     retries: int = 3, delay: float = 4.0) -> bool:
    """SOCKS 연결 실패는 재시도해도 복구 불가 → 즉시 상위로 올려 VPN 교체 유도.
    timeout 등으로 retries 다 소진되면 GotoExhaustedError → worker 가 context 재생성."""
    last_err = ""
    for attempt in range(retries):
        try:
            page.goto(url, wait_until=wait_until, timeout=20000)
            return True
        except Exception as e:
            msg = str(e)
            if is_socks_dead_error(msg):
                log.warning(f"  SOCKS dead 감지 → 즉시 rotate: {msg[:120]}")
                raise SocksDeadError(msg)
            last_err = msg[:200]
            log.warning(f"  goto 실패 (try {attempt+1}/{retries}): {msg[:120]}")
            time.sleep(delay)
    raise GotoExhaustedError(f"goto {retries}회 실패: {last_err}")


_CONSENT_SELECTORS = (
    'button[aria-label*="Reject all"]',
    'button[aria-label*="Accept all"]',
    'button[aria-label*="Agree"]',
    'button:has-text("Reject all")',
    'button:has-text("Accept all")',
    'button:has-text("I agree")',
    'form[action*="consent"] button',
)


def dismiss_popups(page: Page):
    """Google consent/popup 자동 처리. consent.google.com 리다이렉트 + maps 오버레이 모두 커버."""
    try:
        if "consent.google.com" in (page.url or ""):
            for sel in _CONSENT_SELECTORS:
                try:
                    btn = page.locator(sel).first
                    if btn.count() > 0 and btn.is_visible(timeout=1500):
                        btn.click()
                        page.wait_for_load_state("domcontentloaded", timeout=10000)
                        return
                except Exception:
                    continue
        for sel in _CONSENT_SELECTORS:
            try:
                btn = page.locator(sel).first
                if btn.count() > 0 and btn.is_visible(timeout=1000):
                    btn.click()
                    safe_sleep(1.5)
                    return
            except Exception:
                continue
    except Exception:
        pass


# ── 식당 검색/상세 ───────────────────────────────────────────

def search_restaurants(page: Page, query: str) -> list[str]:
    log.info(f"검색: {query}")
    url = add_hl_en(f"https://www.google.com/maps/search/{quote_plus(query)}")
    try:
        page.goto(url, wait_until="domcontentloaded")
    except Exception as e:
        if is_socks_dead_error(str(e)):
            raise SocksDeadError(str(e))
        raise
    safe_sleep(4)
    dismiss_popups(page)
    scroll_all_panels(page, times=10, delay=1.5)

    links = page.locator('a[href*="/maps/place/"]')
    hrefs = []
    seen = set()
    for i in range(links.count()):
        try:
            href = links.nth(i).get_attribute("href") or ""
            if href and href not in seen:
                seen.add(href)
                hrefs.append(href)
        except Exception:
            continue
    log.info(f"  고유 결과: {len(hrefs)}개")
    return hrefs


_DAY_NAMES = {"Monday", "Tuesday", "Wednesday", "Thursday",
              "Friday", "Saturday", "Sunday"}


def _extract_hours(page: Page, place_id: str) -> list[RestaurantHours]:
    """영업시간 테이블에서 요일별 추출 (table.eK4R0e는 이미 펼쳐진 상태)"""
    hours: list[RestaurantHours] = []
    try:
        table = page.locator('table.eK4R0e')
        if table.count() == 0:
            return hours

        rows = table.first.locator('tr')
        for i in range(rows.count()):
            try:
                row = rows.nth(i)
                # td[0] = 요일, td[1] = 시간
                cells = row.locator('td, th')
                if cells.count() < 2:
                    continue
                day = cells.nth(0).inner_text(timeout=500).strip()
                hrs = cells.nth(1).inner_text(timeout=500).strip()
                # 시간 정보에 추가 공백/캐리지리턴 제거
                hrs = re.sub(r"\s+", " ", hrs)
                if day in _DAY_NAMES and hrs:
                    hours.append(RestaurantHours(
                        place_id=place_id, day=day, hours_text=hrs,
                    ))
            except Exception:
                continue
    except Exception as e:
        log.warning(f"  영업시간 파싱 실패: {e}")
    return hours


# Material Icons PUA 문자 제거 (About 탭 li의 체크마크 등)
_PUA_RE = re.compile(r"[\ue000-\uf8ff]")


def _clean_feature_text(text: str) -> str:
    """li 텍스트에서 아이콘/체크마크 제거 + 공백 정리"""
    text = _PUA_RE.sub("", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _extract_about_features(page: Page, place_id: str) -> list[RestaurantFeature]:
    """About 탭의 section/feature를 <h2> + <li> 기반으로 직접 추출"""
    features: list[RestaurantFeature] = []
    try:
        about_tab = page.locator('button[role="tab"]:has-text("About")')
        if about_tab.count() == 0:
            return features
        about_tab.first.click()
        safe_sleep(3)
        scroll_all_panels(page, times=3, delay=1.0)

        sections = page.locator('div.iP2t7d')
        for i in range(sections.count()):
            try:
                sec = sections.nth(i)
                h2s = sec.locator('h2')
                if h2s.count() == 0:
                    continue
                section_name = h2s.first.inner_text(timeout=1000).strip()
                if not section_name:
                    continue

                lis = sec.locator('li')
                for j in range(lis.count()):
                    try:
                        raw = lis.nth(j).inner_text(timeout=500)
                        feat = _clean_feature_text(raw)
                        if feat:
                            features.append(RestaurantFeature(
                                place_id=place_id, section=section_name,
                                feature=feat, present=1,
                            ))
                    except Exception:
                        continue
            except Exception:
                continue
    except Exception as e:
        log.warning(f"  About 파싱 실패: {e}")
    return features


def get_restaurant_full(
    page: Page, maps_url: str
) -> tuple[Restaurant | None, list[RestaurantFeature], list[RestaurantHours]]:
    if not goto_with_retry(page, add_hl_en(maps_url), retries=3, delay=3.0):
        return None, [], []
    safe_sleep(3)
    # F7nice(별점+리뷰수) 렌더링 대기
    try:
        page.wait_for_selector("div.F7nice", timeout=20000)
        # 괄호(리뷰수) 까지 로드되는지 짧게 대기 — 없는 식당도 있으므로 실패는 무시
        try:
            page.wait_for_function(
                "() => { const el = document.querySelector('div.F7nice'); "
                "return el && el.innerText && el.innerText.includes('('); }",
                timeout=8000,
            )
        except Exception:
            pass
    except Exception:
        log.warning(f"  F7nice 미로드 → 추가 대기")
        safe_sleep(5)

    current_url = page.url
    name = ""
    try:
        name = page.locator("h1").first.inner_text(timeout=5000).strip()
    except Exception:
        pass
    if not name or name == "Results":
        return None, [], []

    # rating + review count
    rating = ""
    total_reviews = 0
    fnice_text = ""
    try:
        fnice = page.locator("div.F7nice")
        if fnice.count() > 0:
            fnice_text = fnice.first.inner_text(timeout=3000)
            m = re.search(r"(\d+\.\d+)", fnice_text)
            if m:
                rating = m.group(1)
            m = re.search(r"\(([\d,]+)\)", fnice_text)
            if m:
                total_reviews = int(m.group(1).replace(",", ""))
    except Exception:
        pass

    if total_reviews < config.MIN_REVIEW_COUNT:
        log.info(f"  건너뜀 (리뷰 {total_reviews}개 < {config.MIN_REVIEW_COUNT}): "
                  f"{name} | F7nice={fnice_text!r}")
        return None, [], []

    # 주소
    address = ""
    try:
        el = page.locator('button[data-item-id="address"]')
        if el.count() > 0:
            address = el.first.inner_text(timeout=2000).strip()
    except Exception:
        pass

    # Plus code
    plus_code = ""
    try:
        el = page.locator('button[data-item-id="oloc"]')
        if el.count() > 0:
            aria = el.first.get_attribute("aria-label") or ""
            # "Plus code: PHV4+RV Bangkok, Thailand"
            plus_code = aria.replace("Plus code:", "").strip()
    except Exception:
        pass

    # Phone
    phone = ""
    try:
        el = page.locator('button[data-item-id^="phone:tel:"]')
        if el.count() > 0:
            aria = el.first.get_attribute("aria-label") or ""
            phone = aria.replace("Phone:", "").strip()
    except Exception:
        pass

    # Website
    website = ""
    try:
        el = page.locator('a[data-item-id="authority"]')
        if el.count() > 0:
            website = el.first.get_attribute("href") or ""
        else:
            el = page.locator('[data-item-id="authority"]')
            if el.count() > 0:
                website = el.first.get_attribute("href") or ""
    except Exception:
        pass

    # Menu URL
    menu_url = ""
    try:
        el = page.locator('[data-item-id="menu"]')
        if el.count() > 0:
            menu_url = el.first.get_attribute("href") or ""
    except Exception:
        pass

    # price level
    price_level = ""
    price_symbol = ""
    try:
        el = page.locator('[aria-label*="priced"]')
        for i in range(min(el.count(), 5)):
            aria = el.nth(i).get_attribute("aria-label") or ""
            if "priced" in aria.lower():
                price_level = aria.strip()
                try:
                    price_symbol = el.nth(i).inner_text(timeout=500).strip()
                except Exception:
                    pass
                break
    except Exception:
        pass

    # primary type
    primary_type = ""
    try:
        el = page.locator('button.DkEaL, button[jsaction*="category"]')
        for i in range(min(el.count(), 3)):
            try:
                t = el.nth(i).inner_text(timeout=500).strip()
                if t:
                    primary_type = t
                    break
            except Exception:
                pass
    except Exception:
        pass

    # business status (Open / Temporarily/Permanently closed)
    business_status = ""
    try:
        for kw in ["Open", "Temporarily closed", "Permanently closed", "Closed"]:
            el = page.locator(f'span:has-text("{kw}")')
            if el.count() > 0:
                # '영업 중' 표기는 사이드패널 상단에 있음
                business_status = kw
                break
    except Exception:
        pass

    # editorial summary
    editorial_summary = ""
    try:
        el = page.locator('div.PYvSYb, div.WeS02d .fontBodyMedium')
        if el.count() > 0:
            editorial_summary = el.first.inner_text(timeout=500).strip()
    except Exception:
        pass

    lat, lng = extract_coords_from_url(current_url)
    place_id = extract_place_id_from_url(current_url)

    rest = Restaurant(
        place_id=place_id, name=name, primary_type=primary_type,
        formatted_address=address, plus_code=plus_code,
        latitude=lat, longitude=lng,
        phone=phone, website=website,
        rating=rating, total_reviews=total_reviews,
        price_level=price_level, price_symbol=price_symbol,
        business_status=business_status,
        editorial_summary=editorial_summary,
        menu_url=menu_url,
        maps_url=current_url,
    )
    log.info(f"  ✓ {name} | {primary_type} | ★{rating} ({total_reviews}) | {price_level}")

    # 영업시간
    hours = _extract_hours(page, place_id)
    log.info(f"    영업시간: {len(hours)}일 수집")

    # About features
    features = _extract_about_features(page, place_id)
    log.info(f"    About features: {len(features)}개 수집")

    return rest, features, hours


# ── 리뷰 메타 파싱 ───────────────────────────────────────────

def parse_review_metadata(review_id: str, place_id: str, text: str) -> ReviewMeta:
    meta = ReviewMeta(review_id=review_id, place_id=place_id)

    m = re.search(r"Food:\s*(\d)", text)
    if m:
        meta.food_rating = m.group(1)
    m = re.search(r"Service:\s*(\d)", text)
    if m:
        meta.service_rating = m.group(1)
    m = re.search(r"Atmosphere:\s*(\d)", text)
    if m:
        meta.atmosphere_rating = m.group(1)

    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for i, line in enumerate(lines):
        if i + 1 >= len(lines):
            continue
        nxt = lines[i + 1]
        if line == "Meal type":
            meta.meal_type = nxt
        elif line == "Price per person":
            meta.price_per_person = nxt
        elif line == "Group size":
            meta.group_size = nxt
        elif line == "Wait time":
            meta.wait_time = nxt
        elif line == "Reservation":
            meta.reservation = nxt
        elif line == "Recommended dishes":
            dishes = []
            for j in range(i + 1, min(i + 10, len(lines))):
                if lines[j] in ("Meal type", "Price per person", "Group size",
                                "Wait time", "Reservation", "Dine in", "Takeout",
                                "Delivery", "Food", "Service", "Atmosphere"):
                    break
                if re.match(r"^(Food|Service|Atmosphere):\s*\d", lines[j]):
                    break
                dishes.append(lines[j])
            meta.recommended_dishes = ", ".join(dishes)
        elif line in ("Dine in", "Takeout", "Delivery"):
            meta.service_type = line

    return meta


# ── 리뷰 수집 ───────────────────────────────────────────────

def _select_sort(page: Page, data_index: str):
    sort_btn = page.locator('button[aria-label="Sort reviews"]')
    if sort_btn.count() > 0:
        sort_btn.first.click()
        safe_sleep(1)
        option = page.locator(f'div[role="menuitemradio"][data-index="{data_index}"]')
        if option.count() > 0:
            option.first.click()
            safe_sleep(2)


def _scroll_and_load(page: Page, target: int) -> int:
    prev = 0
    for i in range(20):
        scroll_all_panels(page, times=2, delay=1.0)
        try:
            btns = page.locator('button.w8nwRe.kyuRq')
            for j in range(btns.count()):
                btns.nth(j).click()
                safe_sleep(0.15)
        except Exception:
            pass
        cur = page.locator('div[data-review-id]').count()
        log.info(f"    스크롤 {i+1}: {cur}개")
        if cur >= target or cur == prev:
            break
        prev = cur
    return page.locator('div[data-review-id]').count()


AUTHOR_ID_RE = re.compile(r"/contrib/(\d+)")
REVIEW_COUNT_RE = re.compile(r"(\d[\d,]*)\s*review")
PHOTO_COUNT_RE = re.compile(r"(\d[\d,]*)\s*photo")


def _parse_author_from_card(card) -> tuple[str, str, str, str, int, int, int]:
    """(name, id, uri, photo_uri, is_local_guide, review_count, photo_count)"""
    name = ""
    uri = ""
    photo_uri = ""
    is_lg = 0
    rc = 0
    pc = 0

    # author button with data-href
    try:
        btn = card.locator('button.al6Kxe[data-href*="/contrib/"]').first
        if btn.count() > 0:
            uri = btn.get_attribute("data-href") or ""
            raw = ""
            try:
                raw = btn.inner_text(timeout=1000).strip()
            except Exception:
                pass
            lines = [l.strip() for l in raw.split("\n") if l.strip()]
            if lines:
                name = lines[0]
                meta_line = lines[1] if len(lines) > 1 else ""
                if "Local Guide" in meta_line:
                    is_lg = 1
                m = REVIEW_COUNT_RE.search(meta_line)
                if m:
                    rc = int(m.group(1).replace(",", ""))
                m = PHOTO_COUNT_RE.search(meta_line)
                if m:
                    pc = int(m.group(1).replace(",", ""))
    except Exception:
        pass

    # name fallback
    if not name:
        try:
            el = card.locator("div.d4r55")
            if el.count() > 0:
                name = el.first.inner_text(timeout=500).strip()
        except Exception:
            pass

    # author id
    aid = ""
    m = AUTHOR_ID_RE.search(uri)
    if m:
        aid = m.group(1)

    # profile photo
    try:
        img = card.locator('img.NBa7we')
        if img.count() > 0:
            photo_uri = img.first.get_attribute("src") or ""
    except Exception:
        pass

    return name, aid, uri, photo_uri, is_lg, rc, pc


def _parse_cards(
    page: Page, place_id: str, sort_source: str, restaurant_name: str = ""
) -> tuple[list[ReviewItem], list[ReviewMeta]]:
    reviews: list[ReviewItem] = []
    metas: list[ReviewMeta] = []
    cards = page.locator('div[data-review-id]')

    for i in range(cards.count()):
        try:
            card = cards.nth(i)
            rid = card.get_attribute("data-review-id") or ""

            # 별점
            star = 0
            try:
                aria = card.locator('span[role="img"]').first.get_attribute("aria-label") or ""
                m = re.search(r"(\d)", aria)
                if m:
                    star = int(m.group(1))
            except Exception:
                pass

            # 본문
            text = ""
            try:
                el = card.locator("span.wiI7pd")
                if el.count() > 0:
                    text = el.first.inner_text(timeout=2000).strip()
            except Exception:
                pass

            # 작성자 정보 (UUID 포함)
            a_name, a_id, a_uri, a_photo, a_lg, a_rc, a_pc = _parse_author_from_card(card)

            # 날짜
            rel_date = ""
            try:
                el = card.locator("span.rsqaWe")
                if el.count() > 0:
                    rel_date = el.first.inner_text(timeout=1000).strip()
            except Exception:
                pass

            # 금액
            spent = ""
            try:
                for kw in ["spent", "฿", "THB", "₩", "$"]:
                    el = card.locator(f'span:has-text("{kw}")')
                    if el.count() > 0:
                        spent = el.first.inner_text(timeout=1000).strip()
                        break
            except Exception:
                pass

            # 메타데이터 (카드 전체 텍스트에서)
            card_text = ""
            try:
                card_text = card.inner_text(timeout=2000)
            except Exception:
                pass

            reviews.append(ReviewItem(
                review_id=rid, place_id=place_id, restaurant_name=restaurant_name,
                rating=star, text=text,
                author_name=a_name, author_id=a_id, author_uri=a_uri,
                author_photo_uri=a_photo, author_is_local_guide=a_lg,
                author_review_count=a_rc, author_photo_count=a_pc,
                relative_date=rel_date, spent_amount=spent, sort_source=sort_source,
            ))
            metas.append(parse_review_metadata(rid, place_id, card_text))
        except Exception:
            continue

    return reviews, metas


def collect_reviews_for_restaurant(
    page: Page, restaurant: Restaurant
) -> tuple[list[ReviewItem], list[ReviewMeta]]:
    try:
        page.goto(add_hl_en(restaurant.maps_url), wait_until="domcontentloaded")
    except Exception as e:
        if is_socks_dead_error(str(e)):
            raise SocksDeadError(str(e))
        raise
    safe_sleep(4)

    review_tab = page.locator('button[role="tab"]:has-text("Reviews")')
    if review_tab.count() == 0:
        log.warning(f"  Reviews 탭 없음: {restaurant.name}")
        return [], []
    review_tab.first.click()
    safe_sleep(3)

    all_reviews: list[ReviewItem] = []
    all_metas: list[ReviewMeta] = []
    seen_ids: set[str] = set()

    def add_unique(parsed_r, parsed_m) -> int:
        added = 0
        for r, m in zip(parsed_r, parsed_m):
            if r.review_id and r.review_id not in seen_ids:
                seen_ids.add(r.review_id)
                all_reviews.append(r)
                all_metas.append(m)
                added += 1
        return added

    log.info("  [Most relevant] 수집")
    _select_sort(page, "0")
    _scroll_and_load(page, target=100)
    p1_r, p1_m = _parse_cards(page, restaurant.place_id, "relevant", restaurant.name)
    n1 = add_unique(p1_r, p1_m)
    log.info(f"  [Most relevant] DOM {len(p1_r)}개 → 고유 {n1}개")

    log.info("  [Newest] 수집")
    _select_sort(page, "1")
    safe_sleep(2)
    _scroll_and_load(page, target=100)
    p2_r, p2_m = _parse_cards(page, restaurant.place_id, "newest", restaurant.name)
    n2 = add_unique(p2_r, p2_m)
    log.info(f"  [Newest] DOM {len(p2_r)}개 → 신규 {n2}개")

    log.info(f"  총 고유 리뷰: {len(all_reviews)}개")
    meta_filled = sum(
        1 for m in all_metas
        if m.food_rating or m.meal_type or m.price_per_person
        or m.group_size or m.wait_time or m.service_type
    )
    log.info(f"  메타데이터 있음: {meta_filled}/{len(all_metas)}")
    return all_reviews, all_metas


# ── CSV 저장 ─────────────────────────────────────────────────

def _merge_and_save_restaurants(
    path: Path, new_restaurants: list[Restaurant], existing_ids: set[str]
):
    """모든 기존 row 보존 + 신규 place_id는 교체하여 저장.
    existing_ids는 더 이상 필터 용도가 아니라 호환용 파라미터.
    신규 collection의 place_id는 기존 row를 덮어쓴다."""
    header = ["place_id", "name", "primary_type",
              "formatted_address", "plus_code", "latitude", "longitude",
              "phone", "website", "menu_url",
              "rating", "total_reviews", "price_level", "price_symbol",
              "business_status", "editorial_summary", "maps_url"]
    new_pids = {r.place_id for r in new_restaurants}
    preserved: list[list[str]] = []
    if path.exists():
        with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
            r = csv.reader(f)
            rows = list(r)
            if rows and rows[0] == header:
                preserved = [row for row in rows[1:]
                              if row and row[0] and row[0] not in new_pids]
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow(header)
        for row in preserved:
            w.writerow(row)
        for r_ in new_restaurants:
            w.writerow([
                r_.place_id, r_.name, r_.primary_type,
                r_.formatted_address, r_.plus_code, r_.latitude, r_.longitude,
                r_.phone, r_.website, r_.menu_url,
                r_.rating, r_.total_reviews, r_.price_level, r_.price_symbol,
                r_.business_status, r_.editorial_summary, r_.maps_url,
            ])


def _merge_and_save_features(
    path: Path, new_features: list[RestaurantFeature], existing_ids: set[str]
):
    """신규 place_id의 기존 features는 제거 후 새로 씀 (그 외 기존 row 보존)"""
    header = ["place_id", "section", "feature", "present"]
    new_pids = {x.place_id for x in new_features}
    preserved: list[list[str]] = []
    if path.exists():
        with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
            r = csv.reader(f)
            rows = list(r)
            if rows and rows[0] == header:
                preserved = [row for row in rows[1:]
                              if row and row[0] and row[0] not in new_pids]
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow(header)
        for row in preserved:
            w.writerow(row)
        for x in new_features:
            w.writerow([x.place_id, x.section, x.feature, x.present])


def _merge_and_save_hours(
    path: Path, new_hours: list[RestaurantHours], existing_ids: set[str]
):
    header = ["place_id", "day", "hours_text"]
    new_pids = {h.place_id for h in new_hours}
    preserved: list[list[str]] = []
    if path.exists():
        with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
            r = csv.reader(f)
            rows = list(r)
            if rows and rows[0] == header:
                preserved = [row for row in rows[1:]
                              if row and row[0] and row[0] not in new_pids]
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow(header)
        for row in preserved:
            w.writerow(row)
        for h in new_hours:
            w.writerow([h.place_id, h.day, h.hours_text])


def save_restaurants_csv(restaurants: list[Restaurant], path: Path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow([
            "place_id", "name", "primary_type",
            "formatted_address", "plus_code", "latitude", "longitude",
            "phone", "website", "menu_url",
            "rating", "total_reviews", "price_level", "price_symbol",
            "business_status", "editorial_summary", "maps_url",
        ])
        for r in restaurants:
            w.writerow([
                r.place_id, r.name, r.primary_type,
                r.formatted_address, r.plus_code, r.latitude, r.longitude,
                r.phone, r.website, r.menu_url,
                r.rating, r.total_reviews, r.price_level, r.price_symbol,
                r.business_status, r.editorial_summary, r.maps_url,
            ])
    log.info(f"식당 목록 저장: {path} ({len(restaurants)}건)")


def save_features_csv(features: list[RestaurantFeature], path: Path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow(["place_id", "section", "feature", "present"])
        for x in features:
            w.writerow([x.place_id, x.section, x.feature, x.present])
    log.info(f"식당 features 저장: {path} ({len(features)}건)")


def save_hours_csv(hours: list[RestaurantHours], path: Path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow(["place_id", "day", "hours_text"])
        for h in hours:
            w.writerow([h.place_id, h.day, h.hours_text])
    log.info(f"식당 영업시간 저장: {path} ({len(hours)}건)")


def save_reviews_csv(reviews: list[ReviewItem], path: Path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow([
            "review_id", "place_id", "restaurant_name", "rating", "text",
            "author_name", "author_id", "author_uri", "author_photo_uri",
            "author_is_local_guide", "author_review_count", "author_photo_count",
            "relative_date", "spent_amount", "sort_source",
        ])
        for r in reviews:
            w.writerow([
                r.review_id, r.place_id, r.restaurant_name, r.rating, r.text,
                r.author_name, r.author_id, r.author_uri, r.author_photo_uri,
                r.author_is_local_guide, r.author_review_count, r.author_photo_count,
                r.relative_date, r.spent_amount, r.sort_source,
            ])


def save_metas_csv(metas: list[ReviewMeta], path: Path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow([
            "review_id", "place_id",
            "food_rating", "service_rating", "atmosphere_rating",
            "meal_type", "price_per_person", "group_size",
            "wait_time", "reservation", "service_type", "recommended_dishes",
        ])
        for m in metas:
            w.writerow([
                m.review_id, m.place_id,
                m.food_rating, m.service_rating, m.atmosphere_rating,
                m.meal_type, m.price_per_person, m.group_size,
                m.wait_time, m.reservation, m.service_type, m.recommended_dishes,
            ])


# ── 병렬 처리 ────────────────────────────────────────────────

def worker(
    worker_id: int, task_queue: Queue, result_queue: Queue,
    proxy_port: int,
):
    """
    한 워커 스레드:
    - 자체 Playwright 인스턴스
    - 독립 브라우저 context (쿠키 격리)
    - 전용 프록시 포트 (고정 IP)
    - task_queue에서 href를 받아 상세 + 리뷰 수집 → result_queue로 보냄
    """
    proxy_url = f"socks5://{config.PROXY_HOST}:{proxy_port}"
    log.info(f"[W{worker_id}] 시작 (proxy={proxy_url})")

    # config.HEADLESS=False 면 모든 워커 visible (디버그 용도)
    is_visible = not config.HEADLESS

    BLOCK_TYPES = {"image", "media", "font"}
    BLOCK_HOSTS = (
        "doubleclick.net", "google-analytics.com",
        "googletagmanager.com", "googleadservices.com",
        "googlesyndication.com", "adservice.google",
        "facebook.com", "facebook.net", "fbcdn.net",
        "scorecardresearch.com", "hotjar.com",
    )
    def _block_route(route, request):
        if request.resource_type in BLOCK_TYPES:
            return route.abort()
        if any(h in request.url for h in BLOCK_HOSTS):
            return route.abort()
        return route.continue_()

    def _build_context(browser):
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
        ctx.add_cookies([
            {"name": "CONSENT", "value": "PENDING+987",
             "domain": ".google.com", "path": "/"},
            {"name": "SOCS", "value": "CAISHAgDEhJnd3NfMjAyMzA1MDEtMF9SQzIaAmVuIAEaBgiA_LyaBg",
             "domain": ".google.com", "path": "/"},
            {"name": "NID", "value": "511=consent_ok",
             "domain": ".google.com", "path": "/"},
        ])
        ctx.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    { name: 'Chrome PDF Viewer' },
                    { name: 'Chromium PDF Viewer' },
                    { name: 'Native Client' }
                ]
            });
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en']
            });
            window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {}, app: {} };
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(p) {
                if (p === 37445) return 'Intel Inc.';
                if (p === 37446) return 'Intel Iris OpenGL Engine';
                return getParameter.call(this, p);
            };
            const origQuery = navigator.permissions && navigator.permissions.query;
            if (origQuery) {
                navigator.permissions.query = (p) => (
                    p && p.name === 'notifications'
                        ? Promise.resolve({ state: Notification.permission })
                        : origQuery(p)
                );
            }
        """)
        ctx.route("**/*", _block_route)
        pg = ctx.new_page()
        pg.set_default_timeout(15000)
        return ctx, pg

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=not is_visible,
            slow_mo=config.SLOW_MO,
            proxy={"server": proxy_url},
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-features=IsolateOrigins,site-per-process",
            ],
        )
        context, page = _build_context(browser)
        pending_rotate = False  # 직전 작업이 느렸으면 True → 다음 작업 전 rotate
        task_success_count = 0  # 이 워커가 성공한 누적 작업 수 (정기 rotate 트리거)

        while True:
            try:
                task = task_queue.get(timeout=2)
            except Empty:
                # producer 가 새 작업을 넣을 수 있으니 즉시 종료하지 않고 계속 대기.
                # None sentinel 받을 때만 종료.
                continue
            if task is None:
                break

            # (idx, href) 또는 (idx, href, retries)
            if len(task) == 2:
                idx, href = task
                retries = 0
            else:
                idx, href, retries = task

            # 직전 작업이 느렸거나 정기 교체 주기 도달 시 먼저 VPN 교체
            periodic = (task_success_count > 0
                        and task_success_count % ROTATE_EVERY_TASKS == 0)
            if pending_rotate or periodic:
                reason = "느린 작업" if pending_rotate else f"{ROTATE_EVERY_TASKS}건 정기"
                log.info(f"[W{worker_id}] VPN 교체: {reason}")
                pending_rotate = False
                _rotate_vpn_and_wait(_vpn_idx_for(proxy_port))
                try: context.close()
                except Exception: pass
                context, page = _build_context(browser)

            t0 = time.time()
            try:
                log.info(f"[W{worker_id}] #{idx} 시작 (try {retries+1})")
                rest, feats, hours = get_restaurant_full(page, href)
                if not rest:
                    elapsed = time.time() - t0
                    log.info(f"[W{worker_id}] #{idx} 스킵 ({elapsed:.0f}s)")
                    if elapsed > SLOW_THRESHOLD_SEC:
                        pending_rotate = True
                    result_queue.put(("skip", None))
                    continue
                reviews, metas = collect_reviews_for_restaurant(page, rest)
                elapsed = time.time() - t0
                log.info(f"[W{worker_id}] #{idx} 완료: {rest.name[:40]}... "
                         f"({len(reviews)} 리뷰, {elapsed:.0f}s)")
                if elapsed > SLOW_THRESHOLD_SEC:
                    log.info(f"[W{worker_id}] 느림({elapsed:.0f}s) → 다음 작업 전 VPN 교체")
                    pending_rotate = True
                task_success_count += 1
                result_queue.put(("ok", (rest, feats, hours, reviews, metas)))
            except Exception as e:
                elapsed = time.time() - t0
                log.warning(f"[W{worker_id}] #{idx} 실패 ({elapsed:.0f}s): {e}")
                # 즉시 VPN rotate + 브라우저 context 재생성
                _rotate_vpn_and_wait(_vpn_idx_for(proxy_port))
                try: context.close()
                except Exception: pass
                try:
                    context, page = _build_context(browser)
                except Exception as e2:
                    log.warning(f"[W{worker_id}] context rebuild 실패, browser 재시작: {e2}")
                    try: browser.close()
                    except Exception: pass
                    try:
                        browser = pw.chromium.launch(
                            headless=not is_visible,
                            slow_mo=config.SLOW_MO,
                            proxy={"server": proxy_url},
                            args=[
                                "--disable-blink-features=AutomationControlled",
                                "--disable-features=IsolateOrigins,site-per-process",
                            ],
                        )
                        context, page = _build_context(browser)
                        log.info(f"[W{worker_id}] browser 재시작 성공")
                    except Exception as e3:
                        log.error(f"[W{worker_id}] browser 재시작 실패: {e3}")
                        result_queue.put(("error", str(e)))
                        break  # 이 워커는 종료 — 남은 작업은 다른 워커가 처리
                # 재시도 (큐에 되돌려 아무 워커나 집게)
                if retries + 1 < MAX_TASK_RETRIES:
                    task_queue.put((idx, href, retries + 1))
                    log.info(f"[W{worker_id}] #{idx} 재큐잉 (try {retries+2})")
                else:
                    log.warning(f"[W{worker_id}] #{idx} 재시도 소진 → 포기")
                    result_queue.put(("error", str(e)))

        try:
            browser.close()
        except Exception:
            pass
    log.info(f"[W{worker_id}] 종료")


# ── 메인 ─────────────────────────────────────────────────────

def main():
    out_dir = Path(config.OUTPUT_DIR)
    out_dir.mkdir(exist_ok=True)
    reviews_dir = out_dir / "reviews"
    reviews_dir.mkdir(exist_ok=True)

    discovered_csv = out_dir / "discovered_places.csv"

    def _read_discovered() -> list[tuple[str, int]]:
        """discovered_places.csv 를 읽어 [(href, review_count)] 반환.
        review_count<MIN_REVIEW_COUNT 인 항목은 사전 필터 (상세 페이지 안 감).
        아직 카드에서 review_count 캡처 못한 건 (=0) 일단 통과."""
        out: list[tuple[str, int]] = []
        if not discovered_csv.exists():
            return out
        try:
            with open(discovered_csv, newline="", encoding="utf-8-sig", errors="replace") as f:
                for row in csv.DictReader(f):
                    href = row.get("href") or ""
                    if not href:
                        continue
                    try:
                        rc = int(row.get("review_count") or 0)
                    except ValueError:
                        rc = 0
                    # rc == 0 (미확정) 또는 >= MIN 인 경우만 통과
                    if rc == 0 or rc >= config.MIN_REVIEW_COUNT:
                        out.append((href, rc))
        except Exception as e:
            log.warning(f"discovered read 실패: {e}")
        return out

    log.info("=" * 60)
    log.info("1단계: 식당 후보 확보 (review_count 사전 필터 포함)")
    log.info("=" * 60)
    initial = _read_discovered()
    if not initial:
        log.warning("discovered_places.csv 비어있음 — grid 가 아직 안 찾았을 수 있음. 대기 진입.")

    seen_hrefs: set[str] = set()
    unique_hrefs: list[str] = []
    for href, _rc in initial:
        if href not in seen_hrefs:
            seen_hrefs.add(href)
            unique_hrefs.append(href)

    # Resume 판정:
    #   - complete: relevant + newest 두 sort_source 모두 수집됨 → 스킵
    #   - partial: 하나만 수집됨 (타임아웃 등) → 재처리
    #   - none/failed: 0건인데 리뷰 30+ → 재처리
    def _review_status(pid_fn: str) -> str:
        p = reviews_dir / f"{pid_fn}_reviews.csv"
        if not p.exists():
            return "none"
        try:
            with open(p, encoding="utf-8-sig", errors="replace") as f:
                r = csv.DictReader(f)
                sources = {(row.get("sort_source") or "").strip() for row in r}
        except Exception:
            return "none"
        sources.discard("")
        if not sources:
            return "none"
        if "relevant" in sources and "newest" in sources:
            return "complete"
        return "partial"

    existing_ids: set[str] = set()
    retry_ids: set[str] = set()  # partial/failed
    partial_cnt = failed_cnt = 0
    restaurants_path = out_dir / "clinics.csv"
    if restaurants_path.exists():
        with open(restaurants_path, newline="", encoding="utf-8-sig", errors="replace") as f:
            r = csv.DictReader(f)
            for row in r:
                pid = row.get("place_id", "")
                if not pid:
                    continue
                try:
                    total = int(float(row.get("total_reviews") or 0))
                except (ValueError, TypeError):
                    total = 0
                pid_fn = place_id_to_filename(pid)
                status = _review_status(pid_fn)
                if status == "complete":
                    existing_ids.add(pid)
                elif status == "partial":
                    retry_ids.add(pid)
                    partial_cnt += 1
                elif total >= config.MIN_REVIEW_COUNT:
                    # none + 리뷰 많음 = 완전 실패
                    retry_ids.add(pid)
                    failed_cnt += 1
                else:
                    existing_ids.add(pid)  # 리뷰 적어서 비어있는 건 정상
    log.info(f"기존 완료: {len(existing_ids)} | 부분수집 재시도: {partial_cnt} | 완전실패 재시도: {failed_cnt}")

    # 필터링된 후보만 큐에 넣기
    filtered_hrefs = []
    for href in unique_hrefs:
        pid = extract_place_id_from_url(href)
        if pid not in existing_ids:
            filtered_hrefs.append(href)

    target_n = config.MAX_RESTAURANTS  # None이면 무제한
    log.info(f"전체 후보: {len(unique_hrefs)} | 신규 처리 대상: {len(filtered_hrefs)}")
    log.info(f"목표: {'무제한' if target_n is None else target_n}")
    log.info(f"워커: {config.N_WORKERS}개 "
             f"(포트 {config.PROXY_PORT_BASE}~{config.PROXY_PORT_BASE + config.N_WORKERS - 1})")

    task_q: Queue = Queue()
    result_q: Queue = Queue()
    enqueued_hrefs: set[str] = set()
    idx_counter = [0]  # 가변 카운터 (producer 가 증가)

    def _enqueue(href: str):
        idx_counter[0] += 1
        task_q.put((idx_counter[0], href))
        enqueued_hrefs.add(href)

    for href in filtered_hrefs:
        _enqueue(href)

    # discovered_places.csv 주기 재스캔 (grid 실시간 반영)
    stop_producer = threading.Event()
    def producer_loop():
        while not stop_producer.is_set():
            try:
                added = 0
                for href, _rc in _read_discovered():
                    if href in enqueued_hrefs:
                        continue
                    pid = extract_place_id_from_url(href)
                    if pid in existing_ids:
                        enqueued_hrefs.add(href)  # 넣은 것으로 간주 (재추가 방지)
                        continue
                    _enqueue(href)
                    added += 1
                if added:
                    log.info(f"[producer] discovered 재스캔: +{added} 신규")
            except Exception as e:
                log.warning(f"[producer] 오류: {e}")
            stop_producer.wait(10)  # 10초 주기 — grid 신규 발견 빠르게 픽업
    producer_t = threading.Thread(target=producer_loop, daemon=True)
    producer_t.start()

    threads: list[threading.Thread] = []
    for w in range(config.N_WORKERS):
        port = config.PROXY_PORT_BASE + w
        t = threading.Thread(target=worker, args=(w, task_q, result_q, port), daemon=True)
        t.start()
        threads.append(t)

    # 결과 수집: 초기에는 기존 CSV 로드 없이 append-style 로 확장
    # 매 성공마다 해당 식당의 리뷰/메타는 새 파일로 저장,
    # restaurants/features/hours는 누적 append로 저장
    restaurants: list[Restaurant] = []
    all_features: list[RestaurantFeature] = []
    all_hours: list[RestaurantHours] = []
    seen_ids: set[str] = set()

    success = 0
    skip_count = 0
    start_ts = time.time()

    stop_event = threading.Event()
    def _sig_handler(signum, _frame):
        log.warning(f"signal {signum} 수신 → graceful shutdown")
        stop_event.set()
    import signal as _sig
    _sig.signal(_sig.SIGINT, _sig_handler)
    _sig.signal(_sig.SIGTERM, _sig_handler)

    def should_stop() -> bool:
        if stop_event.is_set():
            return True
        return target_n is not None and success >= target_n

    last_idle_log = 0.0
    while not should_stop():
        try:
            status, payload = result_q.get(timeout=3)
        except Empty:
            # 큐가 비면 producer가 새 작업 가져올 때까지 대기
            if task_q.empty() and time.time() - last_idle_log > 60:
                log.info(f"  대기 중… (enqueued {len(enqueued_hrefs)}, success {success})")
                last_idle_log = time.time()
            continue

        if status == "skip":
            skip_count += 1
            continue
        if status != "ok" or not payload:
            continue
        rest, feats, hours, reviews, metas = payload
        if rest.place_id in seen_ids or rest.place_id in existing_ids:
            continue
        seen_ids.add(rest.place_id)
        restaurants.append(rest)
        all_features.extend(feats)
        all_hours.extend(hours)
        success += 1

        pid_fn = place_id_to_filename(rest.place_id)
        rp = reviews_dir / f"{pid_fn}_reviews.csv"
        mp = reviews_dir / f"{pid_fn}_meta.csv"
        # 리뷰 0건이면 파일 생성 안 함 (스크래핑 실패 구분 용이)
        if reviews:
            save_reviews_csv(reviews, rp)
        else:
            rp.unlink(missing_ok=True)
        if metas:
            save_metas_csv(metas, mp)
        else:
            mp.unlink(missing_ok=True)
        # append_restaurant 모드: 첫 성공 시 헤더 포함하여 기존 행 + 신규 통합 저장
        # 그 후부터는 매번 전체 다시 쓰기 (간단 + 크기 작음)
        _merge_and_save_restaurants(restaurants_path, restaurants, existing_ids)
        _merge_and_save_features(out_dir / "clinic_features.csv", all_features, existing_ids)
        _merge_and_save_hours(out_dir / "clinic_hours.csv", all_hours, existing_ids)

        elapsed = time.time() - start_ts
        rate = success / elapsed if elapsed else 0
        remaining = len(filtered_hrefs) - success - skip_count
        log.info(
            f"  ✓ [{success}] {rest.name[:35]} | "
            f"스킵 {skip_count} | 남은 후보 {remaining} | "
            f"처리율 {rate*60:.1f}/분"
        )

    # 종료 처리
    log.info(f"수집 중단/완료 → 워커 정리 (성공 {success}, 스킵 {skip_count})")
    stop_producer.set()
    try:
        while True:
            task_q.get_nowait()
    except Empty:
        pass
    for _ in threads:
        task_q.put(None)
    for t in threads:
        t.join(timeout=30)
    producer_t.join(timeout=5)

    log.info("=" * 60)
    log.info("완료!")
    log.info(f"  식당: {len(restaurants)}개")
    log.info(f"  features: {len(all_features)}건")
    log.info(f"  hours: {len(all_hours)}건")
    log.info(f"  출력: {out_dir.absolute()}")
    log.info("=" * 60)


if __name__ == "__main__":
    main()
