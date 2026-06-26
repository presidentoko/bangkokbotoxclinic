"""
Bangkok Cooking Class Google Maps Scraper
- Playwright + SOCKS5 프록시 (NordVPN 멀티-슬롯)
- Google Maps 검색 → 상세 페이지 + 리뷰
- 부정 필터: restaurant/catering/ghost kitchen 제외
- 긍정 신호 확인: 리뷰에 수업/요리 키워드 있어야 통과
- 출력: cooking_classes/output/places.json  (장소 + 리뷰 통합)

실행:
    cd cooking_classes
    python scraper.py

    # 특정 쿼리만:
    SEARCH_QUERY="thai cooking class sukhumvit" python scraper.py

    # 워커 수 조정:
    N_WORKERS=2 python scraper.py
"""

from __future__ import annotations

import csv
import json
import os
import re
import sys
import tempfile
import time
import logging
import threading
from dataclasses import dataclass, field, asdict
from pathlib import Path
from queue import Queue, Empty
from urllib.parse import quote_plus

import csv as _csv_mod

# CSV 필드 크기 한도 상향 (Windows C long overflow 방지)
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

# ── VPN rotation 정책 (clinic scraper 동일) ──────────────────
MAX_TASK_RETRIES = 2
SLOW_THRESHOLD_SEC = 120
ROTATE_TIMEOUT_SEC = 90
ROTATE_EVERY_TASKS = 15


def _rotate_vpn_and_wait(vpn_idx: int, timeout: float = ROTATE_TIMEOUT_SEC) -> bool:
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
    return port - config.VPN_PORT_BASE


# ── 데이터 구조 ──────────────────────────────────────────────

@dataclass
class CookingPlace:
    place_id: str
    name: str
    primary_type: str = ""
    formatted_address: str = ""
    latitude: str = ""
    longitude: str = ""
    phone: str = ""
    website: str = ""
    rating: str = ""
    total_reviews: int = 0
    price_level: str = ""
    business_status: str = ""
    editorial_summary: str = ""
    maps_url: str = ""
    # cooking-class-specific
    has_class_signals: bool = False   # 리뷰에서 수업 신호 감지 여부
    search_query: str = ""            # 이 장소를 찾은 검색 쿼리


@dataclass
class ReviewItem:
    review_id: str
    place_id: str
    place_name: str
    rating: int
    text: str
    author_name: str
    author_id: str
    author_uri: str
    author_photo_uri: str
    author_is_local_guide: int = 0
    author_review_count: int = 0
    author_photo_count: int = 0
    relative_date: str = ""
    sort_source: str = ""


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

_DEAD_TUNNEL_PAGE_MARKERS = (
    "can't reach the internet",
    "can’t reach the internet",
    "can't reach this page",
    "no internet",
)


def is_socks_dead_error(msg: str) -> bool:
    return any(p in msg for p in _SOCKS_ERR_PATTERNS)


def is_dead_tunnel_page_name(name: str) -> bool:
    if not name:
        return False
    low = name.lower()
    return any(m in low for m in _DEAD_TUNNEL_PAGE_MARKERS)


class SocksDeadError(Exception):
    pass


class GotoExhaustedError(Exception):
    pass


def goto_with_retry(page: Page, url: str, wait_until: str = "domcontentloaded",
                     retries: int = 3, delay: float = 4.0) -> bool:
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


# ── 부정 필터 / 긍정 신호 ────────────────────────────────────

_NEG_LOWER = [p.lower() for p in config.NEGATIVE_PATTERNS]
_SIG_LOWER = [s.lower() for s in config.CLASS_SIGNALS]


def _is_negative_place(name: str, primary_type: str) -> bool:
    """이름/카테고리에 부정 패턴 포함 시 True (쿠킹클래스가 아님)"""
    combined = (name + " " + primary_type).lower()
    # Allow "cooking class" / "cooking school" even if it contains "restaurant" substring
    # by requiring the negative word to stand mostly alone
    for pat in _NEG_LOWER:
        if pat in combined:
            # Exceptions: if the place explicitly says "class" or "school", keep it
            if any(kw in combined for kw in ("class", "school", "workshop", "culinary", "lesson")):
                continue
            return True
    return False


def _has_class_signal(reviews: list[ReviewItem]) -> bool:
    """리뷰 텍스트에 수업 관련 키워드가 하나라도 있으면 True"""
    for r in reviews:
        low = r.text.lower()
        if any(sig in low for sig in _SIG_LOWER):
            return True
    return False


# ── 검색 ────────────────────────────────────────────────────

def search_places(page: Page, query: str) -> list[str]:
    log.info(f"검색: {query}")
    url = add_hl_en(f"https://www.google.com/maps/search/{quote_plus(query)}")
    try:
        page.goto(url, wait_until="domcontentloaded")
    except Exception as e:
        if is_socks_dead_error(str(e)):
            raise SocksDeadError(str(e))
        raise
    safe_sleep(2.5)
    dismiss_popups(page)
    scroll_all_panels(page, times=7, delay=1.2)

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


# ── 상세 페이지 수집 ─────────────────────────────────────────

def get_place_full(page: Page, maps_url: str, query: str = "") -> CookingPlace | None:
    if not goto_with_retry(page, add_hl_en(maps_url), retries=3, delay=3.0):
        return None
    safe_sleep(2.0)
    try:
        page.wait_for_selector("div.F7nice", timeout=20000)
        try:
            page.wait_for_function(
                "() => { const el = document.querySelector('div.F7nice'); "
                "return el && el.innerText && el.innerText.includes('('); }",
                timeout=8000,
            )
        except Exception:
            pass
    except Exception:
        log.warning("  F7nice 미로드 → 추가 대기")
        safe_sleep(3.0)

    current_url = page.url
    name = ""
    try:
        name = page.locator("h1").first.inner_text(timeout=5000).strip()
    except Exception:
        pass
    if is_dead_tunnel_page_name(name):
        raise SocksDeadError(f"dead tunnel page: {name[:80]!r}")
    if not name or name == "Results":
        return None

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
        log.info(f"  건너뜀 (리뷰 {total_reviews}개 < {config.MIN_REVIEW_COUNT}): {name}")
        return None

    # primary type (카테고리)
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

    # 부정 필터 — 이름/카테고리 체크
    if _is_negative_place(name, primary_type):
        log.info(f"  건너뜀 (부정 패턴): {name} [{primary_type}]")
        return None

    # 주소
    address = ""
    try:
        el = page.locator('button[data-item-id="address"]')
        if el.count() > 0:
            address = el.first.inner_text(timeout=2000).strip()
    except Exception:
        pass

    # 전화
    phone = ""
    try:
        el = page.locator('button[data-item-id^="phone:tel:"]')
        if el.count() > 0:
            aria = el.first.get_attribute("aria-label") or ""
            phone = aria.replace("Phone:", "").strip()
    except Exception:
        pass

    # 웹사이트
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

    # 가격대
    price_level = ""
    try:
        el = page.locator('[aria-label*="priced"]')
        for i in range(min(el.count(), 5)):
            aria = el.nth(i).get_attribute("aria-label") or ""
            if "priced" in aria.lower():
                price_level = aria.strip()
                break
    except Exception:
        pass

    # 영업 상태
    business_status = ""
    try:
        for kw in ["Open", "Temporarily closed", "Permanently closed", "Closed"]:
            el = page.locator(f'span:has-text("{kw}")')
            if el.count() > 0:
                business_status = kw
                break
    except Exception:
        pass

    # 에디토리얼 요약
    editorial_summary = ""
    try:
        el = page.locator('div.PYvSYb, div.WeS02d .fontBodyMedium')
        if el.count() > 0:
            editorial_summary = el.first.inner_text(timeout=500).strip()
    except Exception:
        pass

    lat, lng = extract_coords_from_url(current_url)
    place_id = extract_place_id_from_url(current_url)

    place = CookingPlace(
        place_id=place_id,
        name=name,
        primary_type=primary_type,
        formatted_address=address,
        latitude=lat,
        longitude=lng,
        phone=phone,
        website=website,
        rating=rating,
        total_reviews=total_reviews,
        price_level=price_level,
        business_status=business_status,
        editorial_summary=editorial_summary,
        maps_url=current_url,
        search_query=query,
    )
    log.info(f"  ✓ {name} | {primary_type} | ★{rating} ({total_reviews})")
    return place


# ── 리뷰 수집 ───────────────────────────────────────────────

AUTHOR_ID_RE = re.compile(r"/contrib/(\d+)")
REVIEW_COUNT_RE = re.compile(r"(\d[\d,]*)\s*review")
PHOTO_COUNT_RE = re.compile(r"(\d[\d,]*)\s*photo")


def _parse_author_from_card(card) -> tuple[str, str, str, str, int, int, int]:
    name = ""
    uri = ""
    photo_uri = ""
    is_lg = 0
    rc = 0
    pc = 0
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
    if not name:
        try:
            el = card.locator("div.d4r55")
            if el.count() > 0:
                name = el.first.inner_text(timeout=500).strip()
        except Exception:
            pass
    aid = ""
    m = AUTHOR_ID_RE.search(uri)
    if m:
        aid = m.group(1)
    try:
        img = card.locator('img.NBa7we')
        if img.count() > 0:
            photo_uri = img.first.get_attribute("src") or ""
    except Exception:
        pass
    return name, aid, uri, photo_uri, is_lg, rc, pc


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


def _parse_cards(page: Page, place_id: str, sort_source: str, place_name: str = "") -> list[ReviewItem]:
    reviews: list[ReviewItem] = []
    cards = page.locator('div[data-review-id]')
    for i in range(cards.count()):
        try:
            card = cards.nth(i)
            rid = card.get_attribute("data-review-id") or ""
            star = 0
            try:
                aria = card.locator('span[role="img"]').first.get_attribute("aria-label") or ""
                m = re.search(r"(\d)", aria)
                if m:
                    star = int(m.group(1))
            except Exception:
                pass
            text = ""
            try:
                el = card.locator("span.wiI7pd")
                if el.count() > 0:
                    text = el.first.inner_text(timeout=2000).strip()
            except Exception:
                pass
            a_name, a_id, a_uri, a_photo, a_lg, a_rc, a_pc = _parse_author_from_card(card)
            rel_date = ""
            try:
                el = card.locator("span.rsqaWe")
                if el.count() > 0:
                    rel_date = el.first.inner_text(timeout=1000).strip()
            except Exception:
                pass
            reviews.append(ReviewItem(
                review_id=rid, place_id=place_id, place_name=place_name,
                rating=star, text=text,
                author_name=a_name, author_id=a_id, author_uri=a_uri,
                author_photo_uri=a_photo, author_is_local_guide=a_lg,
                author_review_count=a_rc, author_photo_count=a_pc,
                relative_date=rel_date, sort_source=sort_source,
            ))
        except Exception:
            continue
    return reviews


def collect_reviews(page: Page, place: CookingPlace) -> list[ReviewItem]:
    try:
        page.goto(add_hl_en(place.maps_url), wait_until="domcontentloaded")
    except Exception as e:
        if is_socks_dead_error(str(e)):
            raise SocksDeadError(str(e))
        raise
    safe_sleep(2.5)

    review_tab = page.locator('button[role="tab"]:has-text("Reviews")')
    if review_tab.count() == 0:
        log.warning(f"  Reviews 탭 없음: {place.name}")
        return []
    review_tab.first.click()
    safe_sleep(2.0)

    all_reviews: list[ReviewItem] = []
    seen_ids: set[str] = set()

    def add_unique(parsed: list[ReviewItem]) -> int:
        added = 0
        for r in parsed:
            if r.review_id and r.review_id not in seen_ids:
                seen_ids.add(r.review_id)
                all_reviews.append(r)
                added += 1
        return added

    log.info("  [Most relevant] 수집")
    _select_sort(page, "0")
    _scroll_and_load(page, target=100)
    p1 = _parse_cards(page, place.place_id, "relevant", place.name)
    n1 = add_unique(p1)
    log.info(f"  [Most relevant] DOM {len(p1)}개 → 고유 {n1}개")

    log.info("  [Newest] 수집")
    _select_sort(page, "1")
    safe_sleep(2)
    _scroll_and_load(page, target=100)
    p2 = _parse_cards(page, place.place_id, "newest", place.name)
    n2 = add_unique(p2)
    log.info(f"  [Newest] DOM {len(p2)}개 → 신규 {n2}개")

    log.info(f"  총 고유 리뷰: {len(all_reviews)}개")
    return all_reviews


# ── 저장 ────────────────────────────────────────────────────

class _FileLock:
    """파일 단위 락 (원자적 read-modify-write, O_EXCL 기반)"""
    def __init__(self, path: Path, timeout: float = 30.0):
        self.lock_path = path.with_suffix(path.suffix + ".lock")
        self.timeout = timeout
        self._held = False

    def __enter__(self):
        deadline = time.time() + self.timeout
        while time.time() < deadline:
            try:
                fd = os.open(str(self.lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                os.write(fd, str(os.getpid()).encode())
                os.close(fd)
                self._held = True
                return self
            except FileExistsError:
                try:
                    if time.time() - self.lock_path.stat().st_mtime > 60:
                        try:
                            self.lock_path.unlink()
                        except OSError:
                            pass
                        continue
                except OSError:
                    pass
                time.sleep(0.05)
        log.warning(f"  csv lock {self.lock_path.name} {self.timeout}s timeout — 진행")
        return self

    def __exit__(self, *args):
        if self._held:
            try:
                self.lock_path.unlink()
            except OSError:
                pass


def _merge_and_save_places(path: Path, new_places: list[dict]):
    """기존 places.json 유지 + 신규 place_id 추가/갱신 (lock + atomic write)"""
    tmp = path.with_suffix(".json.tmp")
    with _FileLock(path):
        existing: dict[str, dict] = {}
        if path.exists():
            try:
                existing = {p["place_id"]: p for p in json.loads(path.read_text(encoding="utf-8"))}
            except Exception:
                pass
        for p in new_places:
            pid = p["place_id"]
            if pid in existing:
                # 기존 리뷰 보존하면서 메타 갱신
                old_reviews = existing[pid].get("reviews", [])
                existing[pid] = {**p, "reviews": old_reviews or p.get("reviews", [])}
            else:
                existing[pid] = p
        merged = list(existing.values())
        tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
        os.replace(str(tmp), str(path))
    log.info(f"  저장: {path} ({len(merged)}건)")


def _merge_and_save_reviews(path: Path, place_id: str, reviews: list[dict]):
    """리뷰를 places.json 내 해당 장소에 병합 저장"""
    with _FileLock(path):
        existing: list[dict] = []
        if path.exists():
            try:
                existing = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                pass
        # place_id 맞는 항목에 reviews 갱신
        updated = False
        for entry in existing:
            if entry.get("place_id") == place_id:
                seen_ids = {r["review_id"] for r in entry.get("reviews", [])}
                new_unique = [r for r in reviews if r["review_id"] not in seen_ids]
                entry["reviews"] = entry.get("reviews", []) + new_unique
                updated = True
                break
        if not updated:
            log.warning(f"  리뷰 병합 실패: {place_id} 장소 없음")
            return
        tmp = path.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
        os.replace(str(tmp), str(path))


# ── 워커 ────────────────────────────────────────────────────

def worker(
    worker_id: int, task_queue: Queue, result_queue: Queue, proxy_port: int,
):
    """
    워커 스레드 — clinic scraper.py 와 동일한 구조:
    - 자체 Playwright 인스턴스
    - 독립 브라우저 context + SOCKS5 프록시
    - VPN rotate (느린 작업 / 정기)
    - 실패 시 VPN rotate + context 재생성 + 재큐잉
    """
    proxy_url = f"socks5://{config.PROXY_HOST}:{proxy_port}"
    log.info(f"[W{worker_id}] 시작 (proxy={proxy_url})")
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
            {"name": "SOCS",
             "value": "CAISHAgDEhJnd3NfMjAyMzA1MDEtMF9SQzIaAmVuIAEaBgiA_LyaBg",
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

    _worker_done = False
    while not _worker_done:
        try:
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
                pending_rotate = False
                task_success_count = 0

                while True:
                    try:
                        task = task_queue.get(timeout=2)
                    except Empty:
                        continue
                    if task is None:
                        _worker_done = True
                        break

                    if len(task) == 3:
                        idx, href, query = task
                        retries = 0
                    else:
                        idx, href, query, retries = task

                    periodic = (task_success_count > 0
                                and task_success_count % ROTATE_EVERY_TASKS == 0)
                    if pending_rotate or periodic:
                        reason = "느린 작업" if pending_rotate else f"{ROTATE_EVERY_TASKS}건 정기"
                        log.info(f"[W{worker_id}] VPN 교체: {reason}")
                        pending_rotate = False
                        _rotate_vpn_and_wait(_vpn_idx_for(proxy_port))
                        try:
                            context.close()
                        except Exception:
                            pass
                        context, page = _build_context(browser)

                    t0 = time.time()
                    try:
                        log.info(f"[W{worker_id}] #{idx} 시작 (try {retries+1}): {href[:80]}")
                        place = get_place_full(page, href, query)
                        if not place:
                            elapsed = time.time() - t0
                            if elapsed > SLOW_THRESHOLD_SEC:
                                pending_rotate = True
                            result_queue.put(("skip", href))
                            continue
                        reviews = collect_reviews(page, place)
                        # 긍정 신호 체크
                        place.has_class_signals = _has_class_signal(reviews)
                        elapsed = time.time() - t0
                        log.info(
                            f"[W{worker_id}] #{idx} 완료: {place.name[:40]} "
                            f"({len(reviews)} 리뷰, signals={place.has_class_signals}, {elapsed:.0f}s)"
                        )
                        if elapsed > SLOW_THRESHOLD_SEC:
                            pending_rotate = True
                        task_success_count += 1
                        result_queue.put(("ok", (place, reviews)))
                    except Exception as e:
                        elapsed = time.time() - t0
                        log.warning(f"[W{worker_id}] #{idx} 실패 ({elapsed:.0f}s): {e}")
                        _rotate_vpn_and_wait(_vpn_idx_for(proxy_port))
                        try:
                            context.close()
                        except Exception:
                            pass
                        try:
                            context, page = _build_context(browser)
                        except Exception as e2:
                            log.warning(f"[W{worker_id}] context rebuild 실패 → browser 재시작: {e2}")
                            try:
                                browser.close()
                            except Exception:
                                pass
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
                                break
                        # 재큐잉 (retries 소진 전까지)
                        if retries + 1 < MAX_TASK_RETRIES:
                            task_queue.put((idx, href, query, retries + 1))
                            log.info(f"[W{worker_id}] #{idx} 재큐잉 (try {retries+2})")
                        else:
                            log.warning(f"[W{worker_id}] #{idx} 재시도 소진 → 포기")
                            result_queue.put(("error", str(e)))

                try:
                    browser.close()
                except Exception:
                    pass
        except BaseException as e:
            if isinstance(e, KeyboardInterrupt):
                break
            log.warning(f"[W{worker_id}] Playwright 충돌 ({e.__class__.__name__}: {e}) → 5초 후 재시작")
            try:
                _rotate_vpn_and_wait(_vpn_idx_for(proxy_port))
            except Exception:
                pass
            time.sleep(5)
    log.info(f"[W{worker_id}] 종료")


# ── 검색 쿼리 생성 ───────────────────────────────────────────

def build_queries() -> list[str]:
    """config.KEYWORDS x config.AREAS 조합 또는 SEARCH_QUERY 단일 오버라이드"""
    if config.SEARCH_QUERY:
        return [config.SEARCH_QUERY]
    queries = []
    seen = set()
    for kw in config.KEYWORDS:
        for area in config.AREAS:
            q = f"{kw} {area} bangkok"
            if q not in seen:
                seen.add(q)
                queries.append(q)
        # 지역 없는 직접 쿼리도 포함
        q0 = f"{kw} bangkok"
        if q0 not in seen:
            seen.add(q0)
            queries.append(q0)
    return queries


# ── 메인 ─────────────────────────────────────────────────────

def main():
    out_dir = Path(config.OUTPUT_DIR)
    out_dir.mkdir(parents=True, exist_ok=True)
    places_json = out_dir / "places.json"
    skipped_file = out_dir / "skipped_hrefs.txt"

    # 기존 완료 장소 로드
    existing_place_ids: set[str] = set()
    if places_json.exists():
        try:
            data = json.loads(places_json.read_text(encoding="utf-8"))
            existing_place_ids = {p["place_id"] for p in data}
            log.info(f"기존 장소 {len(existing_place_ids)}개 로드 (resume)")
        except Exception as e:
            log.warning(f"기존 places.json 읽기 실패: {e}")

    # 스킵 href 로드
    skipped_hrefs: set[str] = set()
    if skipped_file.exists():
        try:
            skipped_hrefs = {l.strip() for l in
                             skipped_file.read_text(encoding="utf-8").splitlines() if l.strip()}
        except Exception:
            pass

    # 쿼리 목록 생성
    queries = build_queries()
    log.info(f"검색 쿼리: {len(queries)}개")

    # Phase 1: 검색 결과 수집 (단일 스레드로 전체 쿼리 돌기)
    # (clinic scraper는 grid 탐색이 따로 있지만 cooking class는 쿼리 수가 적어 단일 phase로)
    discovered: list[tuple[str, str]] = []  # (href, query)
    seen_hrefs: set[str] = set()

    # 검색은 워커 0번 포트 사용
    search_port = config.PROXY_PORT_BASE
    search_proxy = f"socks5://{config.PROXY_HOST}:{search_port}"

    log.info("=" * 60)
    log.info("Phase 1: 쿠킹클래스 장소 탐색")
    log.info("=" * 60)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=not (not config.HEADLESS),
            slow_mo=config.SLOW_MO,
            proxy={"server": search_proxy},
            args=["--disable-blink-features=AutomationControlled"],
        )
        ctx = browser.new_context(
            locale="en-US",
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
        )
        ctx.add_cookies([
            {"name": "CONSENT", "value": "PENDING+987",
             "domain": ".google.com", "path": "/"},
            {"name": "SOCS",
             "value": "CAISHAgDEhJnd3NfMjAyMzA1MDEtMF9SQzIaAmVuIAEaBgiA_LyaBg",
             "domain": ".google.com", "path": "/"},
        ])
        page = ctx.new_page()
        page.set_default_timeout(15000)

        for q in queries:
            try:
                hrefs = search_places(page, q)
                for h in hrefs:
                    if h not in seen_hrefs and h not in skipped_hrefs:
                        pid = extract_place_id_from_url(h)
                        if pid not in existing_place_ids:
                            seen_hrefs.add(h)
                            discovered.append((h, q))
                safe_sleep(2.0)
            except SocksDeadError:
                log.warning("  Phase 1: SOCKS dead → VPN rotate")
                _rotate_vpn_and_wait(0)
                safe_sleep(5)
            except Exception as e:
                log.warning(f"  검색 실패 ({q}): {e}")

        browser.close()

    log.info(f"Phase 1 완료: {len(discovered)}개 신규 후보")

    if not discovered:
        log.info("신규 후보 없음 — 종료")
        return

    # Phase 2: 상세 + 리뷰 병렬 수집
    log.info("=" * 60)
    log.info(f"Phase 2: 상세 수집 ({config.N_WORKERS}개 워커)")
    log.info("=" * 60)

    task_q: Queue = Queue()
    result_q: Queue = Queue()

    for i, (href, query) in enumerate(discovered):
        task_q.put((i + 1, href, query))

    import signal as _sig

    stop_event = threading.Event()

    def _sig_handler(signum, _frame):
        log.warning(f"signal {signum} → graceful shutdown")
        stop_event.set()

    _sig.signal(_sig.SIGINT, _sig_handler)
    _sig.signal(_sig.SIGTERM, _sig_handler)

    threads: list[threading.Thread] = []
    for w in range(config.N_WORKERS):
        port = config.PROXY_PORT_BASE + w
        t = threading.Thread(target=worker, args=(w, task_q, result_q, port), daemon=True)
        t.start()
        threads.append(t)

    success = 0
    skip_count = 0
    start_ts = time.time()
    target_n = config.MAX_PLACES

    collected_places: list[dict] = []
    seen_collected: set[str] = set()

    while not stop_event.is_set():
        if target_n is not None and success >= target_n:
            break
        try:
            status, payload = result_q.get(timeout=3)
        except Empty:
            if task_q.empty():
                # 워커가 아직 처리 중일 수 있으니 잠시 더 대기
                all_done = all(not t.is_alive() for t in threads)
                if all_done:
                    break
            continue

        if status == "skip":
            skip_count += 1
            if payload:
                skipped_hrefs.add(payload)
                try:
                    with open(skipped_file, "a", encoding="utf-8") as sf:
                        sf.write(payload + "\n")
                except Exception:
                    pass
            continue

        if status != "ok" or not payload:
            continue

        place, reviews = payload
        if place.place_id in seen_collected or place.place_id in existing_place_ids:
            continue
        seen_collected.add(place.place_id)
        success += 1

        # places.json 에 저장 (리뷰 포함)
        place_dict = asdict(place)
        place_dict["reviews"] = [asdict(r) for r in reviews]
        collected_places.append(place_dict)

        _merge_and_save_places(places_json, [place_dict])

        elapsed = time.time() - start_ts
        rate = success / elapsed if elapsed else 0
        remaining = len(discovered) - success - skip_count
        log.info(
            f"  ✓ [{success}] {place.name[:35]} | "
            f"리뷰 {len(reviews)} | 수업신호 {place.has_class_signals} | "
            f"스킵 {skip_count} | 남은 {remaining} | {rate*60:.1f}/분"
        )

    # 종료 처리
    log.info(f"수집 중단/완료 → 워커 정리 (성공 {success}, 스킵 {skip_count})")
    stop_event.set()
    try:
        while True:
            task_q.get_nowait()
    except Empty:
        pass
    for _ in threads:
        task_q.put(None)
    for t in threads:
        t.join(timeout=30)

    log.info("=" * 60)
    log.info("완료!")
    log.info(f"  신규 수집: {success}개")
    log.info(f"  스킵: {skip_count}개")
    log.info(f"  출력: {places_json.absolute()}")
    log.info("=" * 60)


if __name__ == "__main__":
    main()
