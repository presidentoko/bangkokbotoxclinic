"""
그리드 스캐너 (Phase 1: 식당 발견)
- 중심 좌표(예: Siam Paragon)에서 나선형으로 500m 간격 확장
- 각 좌표에서 Google Maps 검색 → place_id 수집 + 전역 dedupe
- 출력: output/discovered_places.csv
- 매 N 포인트마다 체크포인트 저장, 중단 후 재개 가능
"""

from __future__ import annotations

import csv
import json
import math
import os
import re
import subprocess
import sys
import tempfile
import threading
import time
import logging
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote_plus

_TMPDIR = Path(tempfile.gettempdir())

from playwright.sync_api import sync_playwright, Page, TimeoutError as PwTimeout

import petvet.config as config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


# ── SOCKS 죽음 감지 / VPN 교체 ───────────────────────────────
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
    pass


def _rotate_vpn_and_wait(worker_id: int, timeout: float = 45.0) -> bool:
    """/tmp/rotate_port_<worker_id> 신호 → vpn_status.json에서 server 바뀌고 alive 될 때까지 대기."""
    status_path = _TMPDIR / "vpn_status.json"
    old_server = ""
    try:
        data = json.loads(status_path.read_text())
        for p in data.get("ports", []):
            if p.get("idx") == worker_id:
                old_server = p.get("server", "")
                break
    except Exception:
        pass
    (_TMPDIR / f"rotate_port_{worker_id}").touch()
    log.info(f"[W{worker_id}] VPN rotate 요청 (old={old_server})")
    deadline = time.time() + timeout
    while time.time() < deadline:
        time.sleep(2)
        try:
            data = json.loads(status_path.read_text())
            for p in data.get("ports", []):
                if p.get("idx") == worker_id:
                    cur = p.get("server", "")
                    if cur and cur != old_server and p.get("alive"):
                        log.info(f"[W{worker_id}] VPN rotated → {cur}")
                        return True
        except Exception:
            pass
    log.warning(f"[W{worker_id}] VPN rotate 타임아웃")
    return False


@dataclass
class DiscoveredPlace:
    place_id: str
    name: str
    href: str
    rating: str = ""          # "4.7"
    review_count: int = 0     # 8311
    price_symbol: str = ""    # "$$" / "฿฿"
    primary_type: str = ""    # "Indian restaurant"
    address_hint: str = ""    # 카드에 보이는 주소 일부
    status_hint: str = ""     # "Open" / "Closed" / "Opens 5 PM" 등
    raw_card_text: str = ""   # 파싱 실패 대비 원본 저장
    first_seen_lat: float = 0.0
    first_seen_lng: float = 0.0


# ── 유틸 ─────────────────────────────────────────────────────

def spiral_grid(center_lat: float, center_lng: float,
                radius_m: int, step_m: int) -> list[tuple[float, float]]:
    """중심부터 나선형으로 radius_m까지 step_m 간격 좌표 생성.
    ring 수가 늘어날수록 각 ring의 포인트 수도 비례해서 증가."""
    points = [(center_lat, center_lng)]
    lat_per_m = 1.0 / 111_000.0
    lng_per_m = 1.0 / (111_000.0 * math.cos(math.radians(center_lat)))

    max_ring = math.ceil(radius_m / step_m)
    for ring in range(1, max_ring + 1):
        r_m = ring * step_m
        n_points = max(6, round(2 * math.pi * r_m / step_m))
        for i in range(n_points):
            angle = 2 * math.pi * i / n_points
            dy_m = r_m * math.sin(angle)
            dx_m = r_m * math.cos(angle)
            lat = center_lat + dy_m * lat_per_m
            lng = center_lng + dx_m * lng_per_m
            points.append((lat, lng))
    return points


def zone_grid(center_lat: float, center_lng: float,
              zones: list[tuple[int, int]]) -> list[tuple[float, float, int]]:
    """Concentric zones 기반 base grid. zones=[(max_radius_m, step_m), ...]
    반환: [(lat, lng, step)] — step은 해당 포인트가 "소유하는" 셀 크기.
    """
    base_step = zones[0][1]
    points: list[tuple[float, float, int]] = [(center_lat, center_lng, base_step)]
    lat_per_m = 1.0 / 111_000.0
    lng_per_m = 1.0 / (111_000.0 * math.cos(math.radians(center_lat)))

    prev_r = 0
    for max_r, step in zones:
        r = prev_r + step
        while r <= max_r:
            n_points = max(6, round(2 * math.pi * r / step))
            for i in range(n_points):
                angle = 2 * math.pi * i / n_points
                dy_m = r * math.sin(angle)
                dx_m = r * math.cos(angle)
                lat = center_lat + dy_m * lat_per_m
                lng = center_lng + dx_m * lng_per_m
                points.append((lat, lng, step))
            r += step
        prev_r = max_r
    return points


def subdivide_point(lat: float, lng: float, step: int,
                    center_lat: float) -> list[tuple[float, float, int]]:
    """부모 셀을 2×2 subcell로 분할. 각 subcell의 중심은 부모로부터 ±step/4."""
    new_step = step // 2
    offset_m = step / 4
    lat_per_m = 1.0 / 111_000.0
    lng_per_m = 1.0 / (111_000.0 * math.cos(math.radians(center_lat)))
    dy = offset_m * lat_per_m
    dx = offset_m * lng_per_m
    return [
        (lat + dy, lng + dx, new_step),
        (lat + dy, lng - dx, new_step),
        (lat - dy, lng + dx, new_step),
        (lat - dy, lng - dx, new_step),
    ]


def coord_key(lat: float, lng: float) -> str:
    """좌표 키 — 소수점 5자리 ≈ 1m 정밀. step은 키에 포함하지 않음
    (같은 좌표를 step 달리해서 두 번 스캔할 일은 없음)."""
    return f"{lat:.5f},{lng:.5f}"


def extract_place_id(href: str) -> str:
    m = re.search(r"!1s(0x[0-9a-f]+:[0-9a-fx]+)", href)
    if m:
        return m.group(1)
    m = re.search(r"/place/([^/]+)/", href)
    if m:
        return m.group(1)[:60]
    return ""


def extract_coords_from_href(href: str) -> tuple[float, float] | None:
    """href에서 실제 장소 좌표 추출 (!8m2!3d{lat}!4d{lng})"""
    m = re.search(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)", href)
    if m:
        return float(m.group(1)), float(m.group(2))
    return None


# 도시 바운딩박스: 중심 ± (반경 + 20km 여유)
_margin_m = config.GRID_ZONES[0][0] + 20_000
_margin_lat = _margin_m / 111_000
_margin_lng = _margin_m / (111_000 * math.cos(math.radians(config.GRID_CENTER_LAT)))
_CITY_LAT_MIN = config.GRID_CENTER_LAT - _margin_lat
_CITY_LAT_MAX = config.GRID_CENTER_LAT + _margin_lat
_CITY_LNG_MIN = config.GRID_CENTER_LNG - _margin_lng
_CITY_LNG_MAX = config.GRID_CENTER_LNG + _margin_lng


def is_in_bangkok(href: str) -> bool:
    """href 좌표가 도시 범위 안에 있으면 True. 좌표 없으면 True (통과)"""
    coords = extract_coords_from_href(href)
    if coords is None:
        return True
    lat, lng = coords
    return _CITY_LAT_MIN <= lat <= _CITY_LAT_MAX and _CITY_LNG_MIN <= lng <= _CITY_LNG_MAX


def scroll_feed_to_end(page: Page, max_scrolls: int = 50,
                        delay: float = 1.0, stable_rounds: int = 3) -> int:
    """검색 결과 패널을 끝까지 스크롤.
    - 스크롤 높이가 N번 연속 변하지 않거나
    - "reached the end of the list" 메시지가 보이거나
    - max_scrolls 도달 시 종료
    리턴: 실제 수행한 스크롤 횟수
    """
    prev_height = -1
    stable = 0

    for i in range(max_scrolls):
        try:
            # 스크롤 가능 패널 전부 bottom으로
            heights = page.evaluate("""() => {
                const hs = [];
                document.querySelectorAll('div').forEach(el => {
                    const s = getComputedStyle(el);
                    if ((s.overflowY === 'auto' || s.overflowY === 'scroll')
                        && el.scrollHeight > el.clientHeight + 10) {
                        el.scrollTop = el.scrollHeight;
                        hs.push(el.scrollHeight);
                    }
                });
                return hs;
            }""")
        except Exception:
            heights = []
        time.sleep(delay)

        # 끝 메시지 감지
        try:
            end_el = page.locator('text=/reached the end of the list/i')
            if end_el.count() > 0:
                return i + 1
        except Exception:
            pass

        cur_height = max(heights) if heights else 0
        if cur_height == prev_height:
            stable += 1
            if stable >= stable_rounds:
                return i + 1
        else:
            stable = 0
            prev_height = cur_height

    return max_scrolls


def rotate_ip(wait_sec: float = 3.0):
    """SOCKS 프록시의 active IP 중 하나를 로테이션 (docker kill -s USR1)"""
    try:
        subprocess.run(
            ["docker", "kill", "-s", "USR1", "freevpn"],
            check=False, capture_output=True, timeout=5,
        )
        log.warning("  ⟲ IP rotation requested (USR1)")
        time.sleep(wait_sec)
    except Exception as e:
        log.warning(f"  IP rotation 실패: {e}")


def rotate_all_ips(wait_sec: float = 5.0):
    """모든 active IP를 한 번에 교체 (docker kill -s USR2)"""
    try:
        subprocess.run(
            ["docker", "kill", "-s", "USR2", "freevpn"],
            check=False, capture_output=True, timeout=5,
        )
        log.warning("  ⟲⟲ ALL IP rotation requested (USR2)")
        time.sleep(wait_sec)
    except Exception as e:
        log.warning(f"  IP rotation 실패: {e}")


_CONSENT_SELECTORS = (
    'button[aria-label*="Reject all"]',
    'button[aria-label*="Accept all"]',
    'button[aria-label*="Agree"]',
    'button:has-text("Reject all")',
    'button:has-text("Accept all")',
    'button:has-text("I agree")',
    'form[action*="consent"] button',
)


def dismiss_consent(page) -> bool:
    """Google 동의 다이얼로그(overlay 또는 consent.google.com 리다이렉트) 자동 처리."""
    try:
        # consent.google.com 리다이렉트 페이지
        if "consent.google.com" in (page.url or ""):
            for sel in _CONSENT_SELECTORS:
                try:
                    btn = page.locator(sel).first
                    if btn.count() > 0 and btn.is_visible(timeout=1500):
                        btn.click()
                        page.wait_for_load_state("domcontentloaded", timeout=10000)
                        return True
                except Exception:
                    continue
        # overlay modal
        for sel in _CONSENT_SELECTORS:
            try:
                btn = page.locator(sel).first
                if btn.count() > 0 and btn.is_visible(timeout=1000):
                    btn.click()
                    time.sleep(1.5)
                    return True
            except Exception:
                continue
    except Exception:
        pass
    return False


_BLOCK_TYPES = {"image", "media", "font"}
_BLOCK_HOSTS = (
    "doubleclick.net", "google-analytics.com",
    "googletagmanager.com", "googleadservices.com",
    "googlesyndication.com", "adservice.google",
    "facebook.com", "facebook.net", "fbcdn.net",
    "scorecardresearch.com", "hotjar.com",
)


def _grid_block_route(route, request):
    if request.resource_type in _BLOCK_TYPES:
        return route.abort()
    if any(h in request.url for h in _BLOCK_HOSTS):
        return route.abort()
    return route.continue_()


def fresh_context(browser):
    """새 브라우저 context 생성. CONSENT/SOCS 쿠키 사전 주입 + image/font/ads 블로킹."""
    ctx = browser.new_context(
        locale="en-US",
        extra_http_headers={"Accept-Language": "en-US,en;q=0.9"},
        user_agent=(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/130.0.0.0 Safari/537.36"
        ),
    )
    # 최신 consent 쿠키 (2024+). 동의 "reject all" 기록값.
    ctx.add_cookies([
        {"name": "CONSENT", "value": "PENDING+987",
         "domain": ".google.com", "path": "/"},
        {"name": "SOCS", "value": "CAISHAgDEhJnd3NfMjAyMzA1MDEtMF9SQzIaAmVuIAEaBgiA_LyaBg",
         "domain": ".google.com", "path": "/"},
        {"name": "NID", "value": "511=consent_ok",
         "domain": ".google.com", "path": "/"},
    ])
    ctx.route("**/*", _grid_block_route)
    pg = ctx.new_page()
    pg.set_default_timeout(15000)
    return ctx, pg


# ── 스캔 ─────────────────────────────────────────────────────

_RATING_ONLY_RE = re.compile(r"^(\d\.\d)$")
_STATUS_RE = re.compile(r"\b(Open|Closed|Opens|Closes|Permanently closed|Temporarily closed)\b", re.IGNORECASE)
_PRICE_RE = re.compile(r"(\$+|฿+|€+|₩+|£+)")

# 검색 결과 카드 텍스트 예시:
#   CO LIMITED Central World       ← 이름
#   4.8                            ← 별점 (리뷰 수는 없음)
#   Thai restaurant · 7th Floor... ← 카테고리 · 주소hint
#   Closed · Opens 11 AM           ← 영업상태
#   (Reserve a table 등 기타)
#
# ※ 리뷰 수, 가격대, 전체 주소는 검색 결과에 노출되지 않음 → 상세 페이지에서만 수집 가능


def parse_card_info(aria: str, card_text: str, rating_from_aria: str = "") -> dict:
    info = {
        "rating": rating_from_aria, "review_count": 0, "price_symbol": "",
        "primary_type": "", "address_hint": "", "status_hint": "",
    }

    lines = [l.strip() for l in card_text.split("\n") if l.strip()]

    # 별점 숫자 단독 라인 (aria에서 못 가져왔을 때 fallback)
    if not info["rating"]:
        for line in lines[:4]:
            m = _RATING_ONLY_RE.match(line)
            if m:
                info["rating"] = m.group(1)
                break

    # 카테고리 · 주소 라인
    for line in lines:
        if "·" in line and not _STATUS_RE.search(line):
            parts = [p.strip() for p in line.split("·") if p.strip()]
            if parts:
                info["primary_type"] = parts[0]
            if len(parts) >= 2:
                # 주소 hint는 가운뎃점 이후 모든 토큰 결합
                info["address_hint"] = " · ".join(parts[1:])
            break

    # 영업 상태 라인
    for line in lines:
        if _STATUS_RE.search(line):
            info["status_hint"] = line
            break

    # 가격 심볼이 드물게라도 있을 수 있으니 시도
    m = _PRICE_RE.search(card_text)
    if m:
        info["price_symbol"] = m.group(1)

    return info


def scan_point(page: Page, lat: float, lng: float,
               zoom: int, retries: int = 2) -> list[DiscoveredPlace]:
    """한 좌표에서 검색 → DiscoveredPlace 리스트 (첫 발견 정보 포함)"""
    query = quote_plus(config.SEARCH_QUERY)
    url = (f"https://www.google.com/maps/search/{query}/"
           f"@{lat:.6f},{lng:.6f},{zoom}z?hl=en")

    for attempt in range(retries + 1):
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=20000)
            time.sleep(3)
            dismiss_consent(page)
            break
        except PwTimeout:
            log.warning(f"    goto timeout (try {attempt+1})")
        except Exception as e:
            msg = str(e)
            if is_socks_dead_error(msg):
                # 상위에서 받아서 VPN rotate
                raise SocksDeadError(msg)
            log.warning(f"    goto 실패: {msg[:80]}")
        time.sleep(2)
    else:
        return []

    n_scrolls = scroll_feed_to_end(page, max_scrolls=40, delay=1.0, stable_rounds=3)
    log.info(f"    스크롤 {n_scrolls}회로 끝까지 로드")

    # 카드 단위로 파싱 (Nv2PK가 안정적인 카드 클래스, 없으면 link ancestor)
    cards = page.locator('div.Nv2PK')
    n_cards = cards.count()
    results: list[DiscoveredPlace] = []
    seen: set[str] = set()

    if n_cards > 0:
        for i in range(n_cards):
            try:
                card = cards.nth(i)
                link = card.locator('a[href*="/maps/place/"]').first
                if link.count() == 0:
                    continue
                href = link.get_attribute("href") or ""
                pid = extract_place_id(href)
                if not pid or pid in seen:
                    continue
                if not is_in_bangkok(href):
                    continue
                seen.add(pid)

                aria = link.get_attribute("aria-label") or ""
                try:
                    card_text = card.inner_text(timeout=1500)
                except Exception:
                    card_text = ""

                # 이름: aria-label이 이름인 경우 많음, 없으면 첫 라인
                name = aria.strip() if aria else ""
                if not name and card_text:
                    name = card_text.split("\n")[0].strip()

                # 별점 + 리뷰수: span.ZkP5Je (role=img aria) 가 통합 소스
                # 영어: aria="4.7 stars 117 Reviews"
                # 한국어: aria="별표 4.7개 리뷰 117개"
                # 리뷰 하나/소수면 "리뷰 N개" 파트가 생략됨
                rating_aria = ""
                rc_from_aria = 0
                try:
                    star_el = card.locator('span.ZkP5Je').first
                    if star_el.count() > 0:
                        sa = star_el.get_attribute("aria-label") or ""
                        m = re.search(r"(\d+\.\d+)", sa)
                        if m:
                            rating_aria = m.group(1)
                        # "117 Reviews" / "리뷰 117개" / "117개 리뷰" 패턴
                        m = re.search(r"(\d[\d,]*)\s*(?:Reviews?|리뷰|个)", sa, re.I)
                        if m:
                            rc_from_aria = int(m.group(1).replace(",", ""))
                        elif "리뷰" in sa:
                            m2 = re.search(r"리뷰\s*(\d[\d,]*)\s*개", sa)
                            if m2:
                                rc_from_aria = int(m2.group(1).replace(",", ""))
                except Exception:
                    pass
                # 리뷰수 fallback: span.UY7F9 → "(117)"
                rc_from_span = 0
                if not rc_from_aria:
                    try:
                        uy = card.locator('span.UY7F9').first
                        if uy.count() > 0:
                            txt = (uy.text_content() or "").strip()
                            m = re.search(r"\(\s*(\d[\d,]*)\s*\)", txt)
                            if m:
                                rc_from_span = int(m.group(1).replace(",", ""))
                    except Exception:
                        pass

                info = parse_card_info(aria, card_text, rating_from_aria=rating_aria)
                if rc_from_aria or rc_from_span:
                    info["review_count"] = rc_from_aria or rc_from_span

                results.append(DiscoveredPlace(
                    place_id=pid, name=name, href=href,
                    rating=info["rating"],
                    review_count=info["review_count"],
                    price_symbol=info["price_symbol"],
                    primary_type=info["primary_type"],
                    address_hint=info["address_hint"],
                    status_hint=info["status_hint"],
                    raw_card_text=card_text[:500],
                    first_seen_lat=lat, first_seen_lng=lng,
                ))
            except Exception:
                continue
    else:
        # fallback: 링크만 (카드 구조가 다른 경우)
        links = page.locator('a[href*="/maps/place/"]')
        for i in range(links.count()):
            try:
                el = links.nth(i)
                href = el.get_attribute("href") or ""
                pid = extract_place_id(href)
                if not pid or pid in seen:
                    continue
                if not is_in_bangkok(href):
                    continue
                seen.add(pid)
                aria = el.get_attribute("aria-label") or ""
                results.append(DiscoveredPlace(
                    place_id=pid, name=aria, href=href,
                    first_seen_lat=lat, first_seen_lng=lng,
                ))
            except Exception:
                continue

    return results


CSV_FIELDS = [
    "place_id", "name", "href",
    "rating", "review_count", "price_symbol", "primary_type",
    "address_hint", "status_hint", "raw_card_text",
    "first_seen_lat", "first_seen_lng",
]


def save_csv(discovered: dict[str, DiscoveredPlace], path: Path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(CSV_FIELDS)
        for d in discovered.values():
            w.writerow([
                d.place_id, d.name, d.href,
                d.rating, d.review_count, d.price_symbol, d.primary_type,
                d.address_hint, d.status_hint, d.raw_card_text,
                d.first_seen_lat, d.first_seen_lng,
            ])


def load_discovered(path: Path) -> dict[str, DiscoveredPlace]:
    discovered: dict[str, DiscoveredPlace] = {}
    if path.exists():
        with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
            r = csv.DictReader(f)
            for row in r:
                pid = row["place_id"]
                discovered[pid] = DiscoveredPlace(
                    place_id=pid,
                    name=row.get("name", ""),
                    href=row.get("href", ""),
                    rating=row.get("rating", ""),
                    review_count=int(row.get("review_count") or 0),
                    price_symbol=row.get("price_symbol", ""),
                    primary_type=row.get("primary_type", ""),
                    address_hint=row.get("address_hint", ""),
                    status_hint=row.get("status_hint", ""),
                    raw_card_text=row.get("raw_card_text", ""),
                    first_seen_lat=float(row.get("first_seen_lat") or 0),
                    first_seen_lng=float(row.get("first_seen_lng") or 0),
                )
    return discovered


def _checkpoint_path(path: Path) -> Path:
    tag = (getattr(config, "SEARCH_TAG", "") or "").strip()
    if tag:
        return path.with_suffix(f".{tag}.checkpoint")
    return path.with_suffix(".checkpoint")


def load_coord_checkpoint(path: Path, center_lat: float, center_lng: float) -> set[str]:
    """좌표 기반 checkpoint 로드.
    기존 int-index 체크포인트가 있으면 (lat,lng) 키로 마이그레이션 후 .legacy로 백업."""
    cp = _checkpoint_path(path)
    done: set[str] = set()
    if not cp.exists():
        return done
    text = cp.read_text().strip()
    if not text:
        return done

    # 포맷 판별: 전부 숫자 토큰이면 레거시 int-index
    tokens = text.split()
    if tokens and all(t.isdigit() for t in tokens):
        # 레거시: 예전 spiral_grid(center, 15000, 500) 인덱스
        old_points = spiral_grid(center_lat, center_lng, 15000, 500)
        for t in tokens:
            i = int(t)
            if 0 <= i < len(old_points):
                lat, lng = old_points[i]
                done.add(coord_key(lat, lng))
        # 백업
        try:
            cp.rename(cp.with_suffix(".checkpoint.legacy"))
        except Exception:
            pass
        log.info(f"레거시 int-index checkpoint → 좌표 키 {len(done)}개로 마이그레이션")
        return done

    # 신규 포맷: 한 줄당 "lat,lng"
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        parts = line.split(",")
        if len(parts) >= 2:
            try:
                done.add(coord_key(float(parts[0]), float(parts[1])))
            except ValueError:
                pass
    return done


def save_coord_checkpoint(path: Path, done: set[str]):
    cp = _checkpoint_path(path)
    cp.write_text("\n".join(sorted(done)))


# ── 메인 ─────────────────────────────────────────────────────

def _grid_worker(
    worker_id: int, proxy_port: int,
    work: deque, done_coords: set, discovered: dict,
    point_stats: list, counters: dict, state_lock: threading.Lock,
    center_lat: float,
):
    """병렬 grid worker.
    - 전용 proxy_port로 브라우저 launch
    - work 큐에서 (lat, lng, step) 소비
    - SocksDeadError → VPN rotate + context 재생성 + 작업 재큐잉
    - N 포인트마다 정기 rotate (카운터가 임계 도달 시 본인 포트 교체)
    """
    proxy_url = f"socks5://{config.PROXY_HOST}:{proxy_port}"
    SUBDIVIDE_THRESHOLD = config.GRID_SUBDIVIDE_THRESHOLD
    MIN_STEP = config.GRID_MIN_STEP_M
    ROTATE_EVERY = 20           # 이 워커가 처리한 포인트 수 기준 정기 교체 주기
    EMPTY_POLL_LIMIT = 5        # 빈 큐 polling을 이만큼 연속 실패하면 종료 판단
    # 조기 종료: 연속 N cell 모두 신규=0이면 saturation 으로 보고 워크 종료.
    # 0으로 두면 비활성. 큰 도시 dense grid (Bangkok 30km+500m) 에서 ~80~90% 데이터로
    # 시간 단축. dental 같이 grid 중첩 많은 케이스에서 효과 큼.
    SATURATION_ZERO_STREAK = int(os.environ.get("SATURATION_ZERO_STREAK", "500"))

    my_processed = 0
    my_zeros = 0
    empty_polls = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=config.HEADLESS,
            slow_mo=config.SLOW_MO,
            proxy={"server": proxy_url},
            args=["--disable-blink-features=AutomationControlled"],
        )
        context, page = fresh_context(browser)

        def rebuild_context():
            nonlocal context, page, browser
            try: page.close()
            except Exception: pass
            try: context.close()
            except Exception: pass
            try:
                context, page = fresh_context(browser)
            except Exception as e:
                log.warning(f"[W{worker_id}] context rebuild 실패, browser 재시작: {e}")
                try: browser.close()
                except Exception: pass
                browser = pw.chromium.launch(
                    headless=config.HEADLESS,
                    slow_mo=config.SLOW_MO,
                    proxy={"server": proxy_url},
                    args=["--disable-blink-features=AutomationControlled"],
                )
                context, page = fresh_context(browser)
                log.info(f"[W{worker_id}] browser 재시작 성공")

        while True:
            # 작업 pop
            with state_lock:
                if counters.get("saturated"):
                    break
                if work:
                    lat, lng, step = work.popleft()
                    counters["active"] += 1
                    item = (lat, lng, step)
                else:
                    item = None
                    all_idle = counters["active"] == 0
            if item is None:
                if all_idle:
                    break
                empty_polls += 1
                if empty_polls >= EMPTY_POLL_LIMIT:
                    break
                time.sleep(1)
                continue
            empty_polls = 0

            lat, lng, step = item
            key = coord_key(lat, lng)
            with state_lock:
                if key in done_coords:
                    counters["active"] -= 1
                    continue

            # 정기 rotate (내가 처리한 포인트가 ROTATE_EVERY배수 도달)
            if my_processed > 0 and my_processed % ROTATE_EVERY == 0:
                log.info(f"[W{worker_id}] {ROTATE_EVERY}포인트 정기 rotate")
                _rotate_vpn_and_wait(worker_id)
                rebuild_context()

            try:
                results = scan_point(page, lat, lng, config.GRID_ZOOM)

                # 공유 상태 갱신
                new_count = 0
                with state_lock:
                    for d in results:
                        if d.place_id not in discovered:
                            d.first_seen_lat = lat
                            d.first_seen_lng = lng
                            discovered[d.place_id] = d
                            new_count += 1
                    n_total = len(results)
                    n_dup = n_total - new_count
                    done_coords.add(key)
                    counters["processed"] += 1
                    counters["active"] -= 1
                    point_stats.append((n_total, new_count, n_dup))

                    # Saturation: 연속 N cell 모두 신규=0이면 워크 종료
                    if SATURATION_ZERO_STREAK > 0:
                        if new_count == 0:
                            counters["zero_streak"] = counters.get("zero_streak", 0) + 1
                        else:
                            counters["zero_streak"] = 0
                        if (counters["zero_streak"] >= SATURATION_ZERO_STREAK
                                and not counters.get("saturated")):
                            counters["saturated"] = True
                            work.clear()
                            log.warning(
                                f"[W{worker_id}] saturation: 마지막 "
                                f"{counters['zero_streak']} cell 모두 신규=0 → 조기 종료 "
                                f"(누적 {len(discovered)}개)"
                            )

                    # 밀도 높으면 4분할 재큐잉
                    if new_count >= SUBDIVIDE_THRESHOLD and step // 2 >= MIN_STEP:
                        added = 0
                        for sp in subdivide_point(lat, lng, step, center_lat):
                            if coord_key(sp[0], sp[1]) not in done_coords:
                                work.append(sp)
                                added += 1
                        if added:
                            counters["subdivide"] += 1
                            log.info(f"[W{worker_id}] ↳ subdivide +{added} @ {step//2}m")

                my_processed += 1
                dup_pct = (n_dup / n_total * 100) if n_total else 0
                log.info(f"[W{worker_id}] ({lat:.5f},{lng:.5f}) step={step}m "
                         f"| 결과 {n_total} 신규 {new_count} ({dup_pct:.0f}%중복) "
                         f"| 누적 {len(discovered)}")

                if len(results) == 0:
                    my_zeros += 1
                    if my_zeros >= 2:
                        log.warning(f"[W{worker_id}] 연속 0건 → VPN rotate")
                        _rotate_vpn_and_wait(worker_id)
                        rebuild_context()
                        my_zeros = 0
                else:
                    my_zeros = 0

            except SocksDeadError as e:
                log.warning(f"[W{worker_id}] SOCKS dead → 즉시 rotate: {str(e)[:80]}")
                _rotate_vpn_and_wait(worker_id)
                rebuild_context()
                with state_lock:
                    work.append((lat, lng, step))
                    counters["active"] -= 1
            except Exception as e:
                log.warning(f"[W{worker_id}] ({lat:.5f},{lng:.5f}) 실패: {str(e)[:120]}")
                with state_lock:
                    work.append((lat, lng, step))
                    counters["active"] -= 1
                # 연속 실패 3회 시 rotate
                counters_fail_key = f"fail_{worker_id}"
                with state_lock:
                    counters[counters_fail_key] = counters.get(counters_fail_key, 0) + 1
                    fails = counters[counters_fail_key]
                if fails >= 3:
                    log.warning(f"[W{worker_id}] 연속 실패 {fails}회 → rotate")
                    _rotate_vpn_and_wait(worker_id)
                    rebuild_context()
                    with state_lock:
                        counters[counters_fail_key] = 0

        try: browser.close()
        except Exception: pass
    log.info(f"[W{worker_id}] 종료 (내 처리: {my_processed}개)")


def main():
    out_dir = Path(config.OUTPUT_DIR)
    out_dir.mkdir(exist_ok=True)
    out_path = out_dir / "discovered_places.csv"

    center_lat = config.GRID_CENTER_LAT
    center_lng = config.GRID_CENTER_LNG

    tag = (getattr(config, "SEARCH_TAG", "") or "").strip()
    log.info(f"검색 쿼리: '{config.SEARCH_QUERY}' (tag={tag or 'none'}) "
             f"| checkpoint={_checkpoint_path(out_path).name}")

    base_points = zone_grid(center_lat, center_lng, config.GRID_ZONES)
    limit = int(os.getenv("GRID_LIMIT", "0"))
    if limit > 0:
        base_points = base_points[:limit]
    log.info(f"Base 포인트: {len(base_points)}개 "
             f"(center {center_lat},{center_lng}, zones={config.GRID_ZONES})")

    discovered = load_discovered(out_path)
    done_coords = load_coord_checkpoint(out_path, center_lat, center_lng)
    log.info(f"기존 발견: {len(discovered)}개 | 처리된 좌표: {len(done_coords)}개")

    work: deque = deque()
    for lat, lng, step in base_points:
        if coord_key(lat, lng) not in done_coords:
            work.append((lat, lng, step))
    log.info(f"처리 대기: {len(work)}개 base point")

    if not work:
        log.info("처리할 포인트 없음. 종료.")
        save_csv(discovered, out_path)
        return

    # 병렬 워커 실행
    n_workers = getattr(config, "GRID_N_WORKERS", config.N_WORKERS)
    port_base = getattr(config, "GRID_PROXY_PORT", config.PROXY_PORT_BASE)
    log.info(f"Grid 워커: {n_workers}개 "
             f"(포트 {port_base}~{port_base + n_workers - 1})")

    state_lock = threading.Lock()
    counters = {"processed": 0, "subdivide": 0, "active": 0}
    point_stats: list[tuple[int, int, int]] = []
    start_time = time.time()

    # 주기적 체크포인트 저장 스레드
    stop_saver = threading.Event()
    def saver_loop():
        last_saved = 0
        while not stop_saver.is_set():
            time.sleep(30)
            with state_lock:
                proc = counters["processed"]
                snap_disc = dict(discovered)
                snap_done = set(done_coords)
            if proc > last_saved:
                save_csv(snap_disc, out_path)
                save_coord_checkpoint(out_path, snap_done)
                log.info(f"  ✓ 체크포인트 저장 (processed={proc}, 식당 {len(snap_disc)})")
                last_saved = proc
    saver_t = threading.Thread(target=saver_loop, daemon=True)
    saver_t.start()

    threads = []
    for w in range(n_workers):
        port = port_base + w
        t = threading.Thread(
            target=_grid_worker,
            args=(w, port, work, done_coords, discovered,
                  point_stats, counters, state_lock, center_lat),
            daemon=True,
        )
        t.start()
        threads.append(t)

    # 진행 모니터
    try:
        while any(t.is_alive() for t in threads):
            time.sleep(10)
            with state_lock:
                proc = counters["processed"]
                sub = counters["subdivide"]
                active = counters["active"]
                remaining = len(work)
            elapsed = time.time() - start_time
            rate = proc / elapsed if elapsed > 0 else 0
            eta_s = remaining / rate if rate > 0 else 0
            log.info(f"★ 진행: processed={proc} | pending={remaining} | "
                     f"active={active} | subdivide={sub} | "
                     f"식당={len(discovered)} | 속도={rate*60:.1f}/분 | ETA {eta_s/60:.1f}분")
    except KeyboardInterrupt:
        log.warning("Ctrl+C: 저장 후 종료")

    for t in threads:
        t.join(timeout=5)
    stop_saver.set()

    save_csv(discovered, out_path)
    save_coord_checkpoint(out_path, done_coords)

    log.info("=" * 60)
    log.info(f"그리드 스캔 완료!")
    log.info(f"  처리: {counters['processed']} 포인트 (subdivide {counters['subdivide']}회)")
    log.info(f"  발견 식당: {len(discovered)}개")
    log.info(f"  출력: {out_path.absolute()}")
    log.info("=" * 60)

    # 중복률 구간별 분석 (10 포인트 단위 이동평균)
    if point_stats:
        log.info("── 중복률 구간 분석 (10 포인트 윈도우) ──")
        W = 10
        for start in range(0, len(point_stats), W):
            window = point_stats[start:start + W]
            t = sum(x[0] for x in window)
            n = sum(x[1] for x in window)
            d = sum(x[2] for x in window)
            pct = (d / t * 100) if t else 0
            log.info(
                f"  포인트 {start+1}~{start+len(window)}: "
                f"결과 {t} | 신규 {n} | 중복 {d} ({pct:.0f}%)"
            )

        # 누적 신규 식당 수 추이
        log.info("── 누적 고유 식당 수 추이 ──")
        cum = 0
        for i, stats in enumerate(point_stats, 1):
            cum += stats[1]
            if i % 5 == 0 or i == len(point_stats):
                log.info(f"  {i} 포인트까지: {cum}개")


if __name__ == "__main__":
    main()
