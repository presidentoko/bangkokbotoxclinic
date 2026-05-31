# Konvy 카탈로그 스크래퍼 (Unit ①) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Konvy에서 여드름·미백 관련 스킨케어 제품의 메타데이터(제품명·브랜드·가격·용량·이미지·**INCI 성분**)와 Konvy 자체 리뷰를 안전하게 수집해 `cosmetics/output/products.csv` + `reviews/<id>_konvy.json`로 저장한다.

**Architecture:** 기존 엔진 패턴을 그대로 따른다 — 전용 `cosmetics/` 모듈, `config.py` 상수, 체크포인트(`state/progress.json`) 기반 재시작 안전, per-item 에러 격리 + 서킷 브레이커. 수집은 **Konvy 전용 NordVPN 2터널(포트 2090–2091)**을 통해 나가며, 터널 기동 실패 시 시분할로 자동 폴백한다. 파서 selector/JSON 경로는 **실 IP(태국 프록시)로 캡처한 fixture**에 대해 TDD로 확정한다(블라인드 selector 금지).

**Tech Stack:** Python 3.12, httpx, BeautifulSoup(lxml), Playwright(JS 렌더링이 필요할 때만), pytest, NordVPN SOCKS5(`nordvpn_runner.py` 재사용).

---

## File Structure

| 파일 | 책임 |
|---|---|
| `cosmetics/config.py` | 경로·프록시 포트(2090–2091)·딜레이·재시도·시드 카테고리 등 모든 상수 |
| `cosmetics/models.py` | `Product`, `KonvyReview` 데이터클래스 (단일 진실 소스) |
| `cosmetics/fetcher.py` | 프록시 경유 HTTP GET (재시도·백오프·SOCKS-dead 감지). pantip `fetch_with_retry` 패턴 |
| `cosmetics/konvy_parse.py` | 순수 함수 파서: HTML/JSON → `Product`/`KonvyReview`. **fixture 기반 테스트 대상** |
| `cosmetics/konvy_scraper.py` | 크롤 루프(목록→상세→리뷰), 체크포인트, 서킷 브레이커, CSV/JSON 저장 |
| `cosmetics/vpn_up.py` | 2090–2091 터널 기동 + 헬스체크 + 시분할 폴백 판정 |
| `cosmetics/tests/conftest.py` | fixture 로더 |
| `cosmetics/tests/fixtures/` | 실 캡처된 Konvy 목록/상세/리뷰 응답 (Task 1에서 생성) |
| `cosmetics/tests/test_konvy_parse.py` | 파서 단위 테스트 |
| `cosmetics/output/` | `products.csv`, `reviews/<id>_konvy.json` |
| `cosmetics/state/` | `progress.json`, `heartbeat` |
| `requirements.txt` | (수정) httpx, beautifulsoup4, lxml, pytest 추가 |

---

## Task 0: 모듈 스캐폴딩 + 의존성

**Files:**
- Create: `cosmetics/__init__.py`, `cosmetics/tests/__init__.py`
- Modify: `requirements.txt`

- [ ] **Step 1: 디렉토리/패키지 파일 생성**

```bash
mkdir -p cosmetics/tests/fixtures cosmetics/output/reviews cosmetics/state
printf '' > cosmetics/__init__.py
printf '' > cosmetics/tests/__init__.py
```

- [ ] **Step 2: requirements.txt에 의존성 추가**

`requirements.txt`에 다음 줄을 추가 (기존 `playwright>=1.49` 아래):

```
httpx>=0.27
beautifulsoup4>=4.12
lxml>=5.0
pytest>=8.0
```

- [ ] **Step 3: 설치**

Run: `pip install -r requirements.txt`
Expected: httpx, beautifulsoup4, lxml, pytest 설치 성공.

- [ ] **Step 4: pytest 동작 확인**

Run: `python -m pytest cosmetics/ -q`
Expected: `no tests ran` (수집 0건, 에러 없음).

- [ ] **Step 5: Commit**

```bash
git add cosmetics/__init__.py cosmetics/tests/__init__.py requirements.txt
git commit -m "chore(cosmetics): scaffold module + test deps"
```

---

## Task 1: 설정 + 데이터 모델

**Files:**
- Create: `cosmetics/config.py`, `cosmetics/models.py`

- [ ] **Step 1: `cosmetics/config.py` 작성**

```python
"""Konvy 화장품 스크래퍼 설정. 기존 pantip/config.py 패턴을 따름."""
import os
from pathlib import Path

ROOT = Path(__file__).parent
OUTPUT_DIR = ROOT / "output"
REVIEWS_DIR = OUTPUT_DIR / "reviews"          # <product_id>_konvy.json
PRODUCTS_CSV = OUTPUT_DIR / "products.csv"
STATE_DIR = ROOT / "state"
FIXTURES_DIR = ROOT / "tests" / "fixtures"

# ── 프록시 (기존 엔진과 충돌 방지: 기존은 2080–2087 점유) ──
PROXY_HOST = "127.0.0.1"
PROXY_PORT_BASE = int(os.environ.get("COSMETICS_PROXY_BASE", "2090"))  # 전용 2090–2091
N_TUNNELS = int(os.environ.get("COSMETICS_TUNNELS", "2"))
# 폴백(시분할) 시 빌려쓸 기존 풀 꼬리 포트
FALLBACK_PORT_BASE = int(os.environ.get("COSMETICS_FALLBACK_BASE", "2086"))

# ── 시드: 시작 범위는 여드름 + 미백 두 고민 ──
# Konvy 카테고리/검색 시드 URL은 Task 2의 recon에서 확정해 여기에 채운다.
CONCERNS = ["acne", "whitening"]

# ── 매너 딜레이 (초) ──
DELAY_LIST_SEC = float(os.getenv("COSMETICS_DELAY_LIST", "2.0"))
DELAY_PRODUCT_SEC = float(os.getenv("COSMETICS_DELAY_PRODUCT", "2.0"))
DELAY_REVIEW_SEC = float(os.getenv("COSMETICS_DELAY_REVIEW", "1.0"))

MAX_LIST_PAGES = int(os.getenv("COSMETICS_MAX_LIST_PAGES", "50"))
MAX_REVIEW_PAGES = int(os.getenv("COSMETICS_MAX_REVIEW_PAGES", "20"))

# ── 재시도 / 서킷 브레이커 (pantip과 동일 정책) ──
MAX_RETRIES = 3
RETRY_BACKOFF_SEC = [5, 15, 45]
CIRCUIT_BREAKER_FAILS = 8
CIRCUIT_BREAKER_PAUSE_SEC = 600

USER_AGENT = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
              "AppleWebKit/537.36 (KHTML, like Gecko) "
              "Chrome/124.0.0.0 Safari/537.36")
HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "th,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
}
HEADERS_AJAX = {
    **HEADERS,
    "Accept": "application/json, text/plain, */*",
    "X-Requested-With": "XMLHttpRequest",
}
```

- [ ] **Step 2: `cosmetics/models.py` 작성**

```python
"""Konvy 스크래퍼 데이터 모델 — 모든 모듈이 공유하는 단일 진실 소스."""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class KonvyReview:
    review_id: str
    rating: float            # 1~5 별점
    body: str
    author: str = ""
    timestamp: str = ""      # 원문 표기 그대로(파싱은 집계기에서)
    helpful_count: int = 0


@dataclass
class Product:
    product_id: str          # Konvy 제품 식별자 (URL slug 또는 내부 id)
    url: str
    name: str
    brand: str = ""
    price_thb: float = 0.0
    volume: str = ""         # "30ml", "50g" 등 원문 표기
    image_url: str = ""
    ingredients_raw: str = ""        # INCI 원문 문자열 (파싱 전)
    ingredients: list[str] = field(default_factory=list)  # 분해된 INCI 리스트
    concern_seeds: list[str] = field(default_factory=list)  # 어떤 고민 시드에서 발견됐나
    konvy_rating: float = 0.0        # 제품 평균 별점
    konvy_review_count: int = 0
    fetched_at: str = ""
```

- [ ] **Step 3: import 확인**

Run: `python -c "from cosmetics import config, models; print(config.PROXY_PORT_BASE, models.Product.__name__)"`
Expected: `2090 Product`

- [ ] **Step 4: Commit**

```bash
git add cosmetics/config.py cosmetics/models.py
git commit -m "feat(cosmetics): config + data models"
```

---

## Task 2: Konvy recon — 실 fixture 캡처 (selector 확정의 근거)

> 블라인드 selector 작성 금지. Konvy는 geo/bot 게이팅이 있어 **반드시 태국 프록시 경유**로 실제 응답을 받아 저장한 뒤, 그 fixture에 대해 파서를 TDD한다. 이 Task는 코드가 아니라 **데이터 캡처**다.

**Files:**
- Create: `cosmetics/tests/fixtures/list_acne_p1.html` (또는 `.json`)
- Create: `cosmetics/tests/fixtures/product_sample.html` (또는 `.json`)
- Create: `cosmetics/tests/fixtures/reviews_sample.json` (또는 `.html`)
- Create: `cosmetics/RECON.md` (캡처한 구조 메모: URL 패턴·렌더링 방식·selector/JSON 경로)

- [ ] **Step 1: VPN 2090–2091 기동** (Task 7의 `vpn_up.py`가 아직 없으면 수동)

```bash
python nordvpn_runner.py --ports 2 --base-port 2090 --auth nordvpn/auth.txt --proto tcp &
# 30~60초 후 포트 2090 LISTEN 확인
```

- [ ] **Step 2: 프록시 경유로 여드름 목록 1페이지 캡처**

```bash
curl -x socks5h://127.0.0.1:2090 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36" \
  "https://www.konvy.com/skincare/" -o cosmetics/tests/fixtures/list_acne_p1.html
# 파일이 비었거나 차단 페이지면: 검색 URL(예: https://www.konvy.com/search.php?q=...) 또는
# JS 렌더링 필요 → Playwright로 대체 캡처(아래 Step 4).
```

- [ ] **Step 3: 렌더링 방식 판정**

`cosmetics/tests/fixtures/list_acne_p1.html`을 열어 확인:
- 제품 카드가 HTML에 그대로 있으면 → **httpx 경로** (pantip 패턴)
- 빈 컨테이너 + `<script>`로 데이터 주입 / XHR 호출이면 → **JSON API 경로**(네트워크 탭의 endpoint URL을 `RECON.md`에 기록) 또는 **Playwright 경로**

- [ ] **Step 4: (JS 렌더링인 경우) Playwright로 목록·상세·리뷰 캡처**

```python
# scratch 스크립트 (커밋 안 함). 캡처 결과만 fixtures/에 저장.
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(proxy={"server": "socks5://127.0.0.1:2090"})
    pg = b.new_page()
    pg.goto("https://www.konvy.com/skincare/", wait_until="networkidle")
    open("cosmetics/tests/fixtures/list_acne_p1.html","w",encoding="utf-8").write(pg.content())
    # 제품 1개 상세 + 리뷰도 동일하게 캡처
    b.close()
```

- [ ] **Step 5: 상세·리뷰 fixture 캡처 + `RECON.md` 작성**

`RECON.md`에 반드시 기록:
- 목록 URL 패턴 + 페이지네이션 방식(query param? path? infinite scroll XHR?)
- 상세 URL 패턴 + `product_id` 추출 위치
- 각 필드의 selector 또는 JSON 경로: name, brand, price, volume, image, **INCI 성분**, 평균 별점, 리뷰 수
- 리뷰 데이터 위치(상세 HTML 내장 vs 별도 XHR endpoint) + 리뷰 페이지네이션

- [ ] **Step 6: Commit (fixture + recon 메모)**

```bash
git add cosmetics/tests/fixtures/ cosmetics/RECON.md
git commit -m "chore(cosmetics): capture Konvy fixtures + recon notes"
```

---

## Task 3: 목록 파서 — 제품 URL/ID 추출 (TDD)

**Files:**
- Create: `cosmetics/konvy_parse.py`
- Create: `cosmetics/tests/conftest.py`
- Create: `cosmetics/tests/test_konvy_parse.py`

- [ ] **Step 1: fixture 로더 작성** (`conftest.py`)

```python
from pathlib import Path
import pytest

FIX = Path(__file__).parent / "fixtures"

@pytest.fixture
def fixture_text():
    def _load(name: str) -> str:
        return (FIX / name).read_text(encoding="utf-8")
    return _load
```

- [ ] **Step 2: 실패하는 테스트 작성** (`test_konvy_parse.py`)

> `RECON.md`에서 확인한 **실제 값**으로 기대치를 채운다(아래 `EXPECT_*`는 fixture를 보고 교체).

```python
from cosmetics import konvy_parse

def test_parse_listing_extracts_product_links(fixture_text):
    html = fixture_text("list_acne_p1.html")
    links = konvy_parse.parse_listing(html)
    # RECON.md에서 확인한 실제 개수/형식으로 교체
    assert len(links) >= 1
    assert all(u.startswith("http") for u in links)
    assert all("konvy.com" in u for u in links)
```

- [ ] **Step 3: 테스트 실패 확인**

Run: `python -m pytest cosmetics/tests/test_konvy_parse.py::test_parse_listing_extracts_product_links -v`
Expected: FAIL (`AttributeError: module ... has no attribute 'parse_listing'`)

- [ ] **Step 4: `parse_listing` 구현** (selector는 `RECON.md` 기준으로 확정)

```python
"""Konvy 응답 → 도메인 객체. 순수 함수(네트워크 없음)라 fixture로 테스트 가능."""
from __future__ import annotations
import re
from bs4 import BeautifulSoup

def parse_listing(html: str) -> list[str]:
    """제품 목록 페이지 HTML → 제품 상세 URL 리스트.
    selector는 RECON.md에서 확정한 제품 카드 앵커 기준.
    """
    soup = BeautifulSoup(html, "lxml")
    urls: list[str] = []
    seen: set[str] = set()
    # RECON.md의 실제 카드 selector로 교체 (예: 'a.product-item-link')
    for a in soup.select("a[href*='/health-beauty/'], a.product-link"):
        href = a.get("href") or ""
        if not href:
            continue
        if href.startswith("/"):
            href = "https://www.konvy.com" + href
        if "konvy.com" in href and href not in seen:
            seen.add(href)
            urls.append(href)
    return urls
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `python -m pytest cosmetics/tests/test_konvy_parse.py::test_parse_listing_extracts_product_links -v`
Expected: PASS. (실패 시 fixture의 실제 카드 selector로 `select(...)` 인자 교정 → 재실행)

- [ ] **Step 6: Commit**

```bash
git add cosmetics/konvy_parse.py cosmetics/tests/conftest.py cosmetics/tests/test_konvy_parse.py
git commit -m "feat(cosmetics): listing parser (product URL extraction)"
```

---

## Task 4: 상세 파서 — 제품 메타 + INCI 성분 (TDD)

**Files:**
- Modify: `cosmetics/konvy_parse.py`
- Modify: `cosmetics/tests/test_konvy_parse.py`

- [ ] **Step 1: 실패하는 테스트 추가** (기대값은 `product_sample` fixture의 실제 값으로 교체)

```python
from cosmetics.models import Product

def test_parse_product_extracts_core_fields(fixture_text):
    html = fixture_text("product_sample.html")
    p = konvy_parse.parse_product(html, url="https://www.konvy.com/sample.html")
    assert isinstance(p, Product)
    assert p.name                      # 비어있지 않음
    assert p.price_thb > 0
    assert p.product_id                # URL/HTML에서 추출됨
    # INCI: recon에서 성분 노출 확인했다면 1개 이상
    assert len(p.ingredients) >= 1
```

- [ ] **Step 2: 실패 확인**

Run: `python -m pytest cosmetics/tests/test_konvy_parse.py::test_parse_product_extracts_core_fields -v`
Expected: FAIL (`parse_product` 없음)

- [ ] **Step 3: `parse_product` + INCI 분해 구현**

```python
import time

_PRICE_RE = re.compile(r"[\d,]+(?:\.\d+)?")

def _to_price(text: str) -> float:
    m = _PRICE_RE.search((text or "").replace(",", ""))
    return float(m.group()) if m else 0.0

def split_inci(raw: str) -> list[str]:
    """INCI 원문 문자열 → 성분 리스트. 콤마/줄바꿈 분리 + 트림 + 빈값 제거."""
    if not raw:
        return []
    parts = re.split(r"[,\n;•·]+", raw)
    out: list[str] = []
    for p in parts:
        s = re.sub(r"\s+", " ", p).strip(" .")
        if s and len(s) >= 2:
            out.append(s)
    return out

def _product_id_from_url(url: str) -> str:
    m = re.search(r"/([^/]+?)\.html", url) or re.search(r"[?&]id=(\d+)", url)
    return m.group(1) if m else url.rstrip("/").split("/")[-1]

def parse_product(html: str, url: str) -> Product:
    """상세 페이지 HTML → Product. selector는 RECON.md 기준."""
    soup = BeautifulSoup(html, "lxml")
    def text(sel: str) -> str:
        el = soup.select_one(sel)
        return el.get_text(" ", strip=True) if el else ""
    name = text("h1.product-name, h1")                 # RECON.md로 교정
    brand = text(".product-brand, a.brand")            # RECON.md로 교정
    price = _to_price(text(".product-price, .price"))  # RECON.md로 교정
    volume = text(".product-size, .volume")            # RECON.md로 교정
    img_el = soup.select_one(".product-image img, img.main-image")
    image_url = (img_el.get("src") or img_el.get("data-src") or "") if img_el else ""
    ingredients_raw = text("#ingredients, .ingredient, .product-ingredient")  # RECON.md로 교정
    return Product(
        product_id=_product_id_from_url(url),
        url=url, name=name, brand=brand, price_thb=price, volume=volume,
        image_url=image_url, ingredients_raw=ingredients_raw,
        ingredients=split_inci(ingredients_raw),
        fetched_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    )
```

- [ ] **Step 4: 통과 확인**

Run: `python -m pytest cosmetics/tests/test_konvy_parse.py::test_parse_product_extracts_core_fields -v`
Expected: PASS. (실패 시 fixture 실제 selector로 교정 후 재실행)

- [ ] **Step 5: `split_inci` 단위 테스트 추가 + 통과**

```python
def test_split_inci_handles_commas_and_blanks():
    raw = "Water, Niacinamide,  , Salicylic Acid\nGlycerin"
    assert konvy_parse.split_inci(raw) == ["Water", "Niacinamide", "Salicylic Acid", "Glycerin"]
```

Run: `python -m pytest cosmetics/tests/test_konvy_parse.py::test_split_inci_handles_commas_and_blanks -v`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add cosmetics/konvy_parse.py cosmetics/tests/test_konvy_parse.py
git commit -m "feat(cosmetics): product detail parser + INCI splitter"
```

---

## Task 5: 리뷰 파서 (TDD)

**Files:**
- Modify: `cosmetics/konvy_parse.py`
- Modify: `cosmetics/tests/test_konvy_parse.py`

- [ ] **Step 1: 실패하는 테스트 추가** (fixture가 HTML이면 `fixture_text`, JSON이면 별도 로더)

```python
from cosmetics.models import KonvyReview

def test_parse_reviews_extracts_rating_and_body(fixture_text):
    raw = fixture_text("reviews_sample.json")   # 또는 reviews_sample.html
    reviews = konvy_parse.parse_reviews(raw)
    assert len(reviews) >= 1
    r = reviews[0]
    assert isinstance(r, KonvyReview)
    assert 1 <= r.rating <= 5
    assert r.body
```

- [ ] **Step 2: 실패 확인**

Run: `python -m pytest cosmetics/tests/test_konvy_parse.py::test_parse_reviews_extracts_rating_and_body -v`
Expected: FAIL (`parse_reviews` 없음)

- [ ] **Step 3: `parse_reviews` 구현** (JSON or HTML — RECON.md의 실제 형식에 맞춰 한쪽 채택)

```python
import json

def parse_reviews(raw: str) -> list[KonvyReview]:
    """리뷰 응답(JSON 또는 HTML) → KonvyReview 리스트.
    RECON.md에서 리뷰가 XHR JSON이면 JSON 분기, 상세 HTML 내장이면 HTML 분기 사용.
    """
    raw = raw.lstrip("﻿")
    # JSON 분기
    try:
        data = json.loads(raw)
        out: list[KonvyReview] = []
        items = data.get("reviews") if isinstance(data, dict) else data
        for it in (items or []):
            out.append(KonvyReview(
                review_id=str(it.get("id") or it.get("review_id") or ""),
                rating=float(it.get("rating") or it.get("score") or 0),
                body=str(it.get("comment") or it.get("body") or "").strip(),
                author=str(it.get("user_name") or it.get("author") or ""),
                timestamp=str(it.get("created_at") or it.get("date") or ""),
                helpful_count=int(it.get("helpful") or 0),
            ))
        return [r for r in out if r.body]
    except (json.JSONDecodeError, ValueError):
        pass
    # HTML 분기 (RECON.md의 리뷰 카드 selector로 교정)
    soup = BeautifulSoup(raw, "lxml")
    out = []
    for card in soup.select(".review-item, .product-review"):
        body_el = card.select_one(".review-text, .comment")
        rating_el = card.select_one("[data-rating], .stars")
        rating = 0.0
        if rating_el:
            rating = float((rating_el.get("data-rating") or "0").strip() or 0)
        out.append(KonvyReview(
            review_id=card.get("data-id", ""),
            rating=rating,
            body=body_el.get_text(" ", strip=True) if body_el else "",
            author=(card.select_one(".review-author").get_text(strip=True)
                    if card.select_one(".review-author") else ""),
        ))
    return [r for r in out if r.body]
```

- [ ] **Step 4: 통과 확인**

Run: `python -m pytest cosmetics/tests/test_konvy_parse.py::test_parse_reviews_extracts_rating_and_body -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cosmetics/konvy_parse.py cosmetics/tests/test_konvy_parse.py
git commit -m "feat(cosmetics): review parser"
```

---

## Task 6: 프록시 fetcher (재시도·백오프·SOCKS-dead 감지)

**Files:**
- Create: `cosmetics/fetcher.py`
- Create: `cosmetics/tests/test_fetcher.py`

- [ ] **Step 1: 실패하는 테스트 작성** (네트워크 없이 백오프 로직만 검증 — httpx mock)

```python
import httpx
from cosmetics import fetcher, config

def test_fetch_retries_on_503_then_succeeds(monkeypatch):
    calls = {"n": 0}
    def fake_get(url, headers=None):
        calls["n"] += 1
        if calls["n"] < 2:
            return httpx.Response(503, text="busy")
        return httpx.Response(200, text="ok")
    monkeypatch.setattr(fetcher, "_sleep", lambda s: None)  # 백오프 즉시
    client = type("C", (), {"get": staticmethod(fake_get)})()
    status, body = fetcher.fetch_with_retry(client, "http://x")
    assert status == 200 and body == "ok" and calls["n"] == 2
```

- [ ] **Step 2: 실패 확인**

Run: `python -m pytest cosmetics/tests/test_fetcher.py -v`
Expected: FAIL (`module 'cosmetics.fetcher' has no attribute ...`)

- [ ] **Step 3: `fetcher.py` 구현** (pantip `fetch_with_retry` 이식 + 프록시 클라이언트)

```python
"""프록시 경유 HTTP. pantip/scraper.py 패턴 이식."""
from __future__ import annotations
import logging, time
import httpx
from . import config

log = logging.getLogger("cosmetics.fetch")

_SOCKS_DEAD = ("ERR_PROXY_CONNECTION_FAILED", "Connection refused",
               "SOCKS", "proxy")

def is_socks_dead_error(msg: str) -> bool:
    m = (msg or "").lower()
    return any(s.lower() in m for s in _SOCKS_DEAD)

def _sleep(sec: float) -> None:
    time.sleep(sec)

def make_client(port: int) -> httpx.Client:
    proxy = f"socks5://{config.PROXY_HOST}:{port}"
    return httpx.Client(headers=config.HEADERS, follow_redirects=True,
                        timeout=30.0, proxy=proxy)

def fetch_with_retry(client, url: str, ajax: bool = False) -> tuple[int, str]:
    headers = config.HEADERS_AJAX if ajax else None
    last_status, last_body = 0, ""
    for attempt in range(config.MAX_RETRIES):
        try:
            r = client.get(url, headers=headers) if headers else client.get(url)
            last_status, last_body = r.status_code, r.text
            if r.status_code == 200:
                return r.status_code, r.text
            if r.status_code in (429, 502, 503, 504):
                _sleep(config.RETRY_BACKOFF_SEC[min(attempt, len(config.RETRY_BACKOFF_SEC)-1)])
                continue
            return r.status_code, r.text
        except Exception as e:  # noqa: BLE001 — 네트워크/프록시 예외 전반
            log.warning(f"{type(e).__name__} on {url}: {str(e)[:80]}")
            _sleep(config.RETRY_BACKOFF_SEC[min(attempt, len(config.RETRY_BACKOFF_SEC)-1)])
    return last_status, last_body
```

> 참고: httpx 버전에 따라 프록시 인자가 `proxy=`(0.27+) 또는 `proxies=`. 설치 버전 기준으로 맞춘다. SOCKS 지원 위해 `httpx[socks]`가 필요하면 requirements에 `httpx[socks]`로 교체.

- [ ] **Step 4: 통과 확인**

Run: `python -m pytest cosmetics/tests/test_fetcher.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cosmetics/fetcher.py cosmetics/tests/test_fetcher.py
git commit -m "feat(cosmetics): proxy fetcher with retry/backoff"
```

---

## Task 7: VPN 기동 + 시분할 자동 폴백

**Files:**
- Create: `cosmetics/vpn_up.py`
- Create: `cosmetics/tests/test_vpn_up.py`

- [ ] **Step 1: 실패하는 테스트 — 포트 헬스체크 판정 로직**

```python
from cosmetics import vpn_up

def test_pick_ports_prefers_dedicated_when_alive(monkeypatch):
    monkeypatch.setattr(vpn_up, "ports_alive", lambda ports: set(ports))  # 다 살아있음
    assert vpn_up.pick_active_ports() == [2090, 2091]

def test_pick_ports_falls_back_when_dedicated_dead(monkeypatch):
    monkeypatch.setattr(vpn_up, "ports_alive", lambda ports: {2086, 2087} & set(ports))
    assert vpn_up.pick_active_ports() == [2086, 2087]
```

- [ ] **Step 2: 실패 확인**

Run: `python -m pytest cosmetics/tests/test_vpn_up.py -v`
Expected: FAIL

- [ ] **Step 3: `vpn_up.py` 구현**

```python
"""Konvy 전용 VPN 터널 기동 + 시분할 폴백 판정.

전략:
  1) 전용 2090–2091 기동 시도 → 살아나면 그걸 쓴다.
  2) (계정 동시접속 한도 초과 등으로) 안 살아나면 기존 풀 꼬리(2086–2087)로 폴백.
"""
from __future__ import annotations
import socket, subprocess, time, logging
from pathlib import Path
from . import config

log = logging.getLogger("cosmetics.vpn")

def _port_open(port: int, host: str = None) -> bool:
    host = host or config.PROXY_HOST
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1.0)
        return s.connect_ex((host, port)) == 0

def ports_alive(ports: list[int]) -> set[int]:
    return {p for p in ports if _port_open(p)}

def dedicated_ports() -> list[int]:
    return [config.PROXY_PORT_BASE + i for i in range(config.N_TUNNELS)]

def fallback_ports() -> list[int]:
    return [config.FALLBACK_PORT_BASE + i for i in range(config.N_TUNNELS)]

def start_dedicated(auth: Path, wait_sec: int = 60) -> bool:
    """전용 터널 runner 기동. wait_sec 안에 포트가 살아나면 True."""
    subprocess.Popen(
        ["python", "nordvpn_runner.py", "--ports", str(config.N_TUNNELS),
         "--base-port", str(config.PROXY_PORT_BASE), "--auth", str(auth), "--proto", "tcp"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    deadline = time.time() + wait_sec
    while time.time() < deadline:
        if ports_alive(dedicated_ports()) == set(dedicated_ports()):
            return True
        time.sleep(3)
    return False

def pick_active_ports() -> list[int]:
    """현재 사용할 포트 결정. 전용이 살아있으면 전용, 아니면 폴백."""
    if ports_alive(dedicated_ports()) == set(dedicated_ports()):
        return dedicated_ports()
    fb = ports_alive(fallback_ports())
    if fb:
        log.warning(f"전용 터널 불가 → 시분할 폴백 {sorted(fb)}")
        return sorted(fb)
    return dedicated_ports()  # 마지막 수단: 전용 포트(추후 기동 대기)
```

- [ ] **Step 4: 통과 확인**

Run: `python -m pytest cosmetics/tests/test_vpn_up.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cosmetics/vpn_up.py cosmetics/tests/test_vpn_up.py
git commit -m "feat(cosmetics): VPN bring-up + time-share fallback"
```

---

## Task 8: 크롤 루프 + CSV/JSON 저장 (체크포인트·서킷브레이커)

**Files:**
- Create: `cosmetics/konvy_scraper.py`
- Create: `cosmetics/tests/test_scraper_io.py`

- [ ] **Step 1: 실패하는 테스트 — CSV writer (순수 I/O, 네트워크 없음)**

```python
import csv
from cosmetics import konvy_scraper
from cosmetics.models import Product

def test_write_products_csv(tmp_path, monkeypatch):
    out = tmp_path / "products.csv"
    monkeypatch.setattr(konvy_scraper.config, "PRODUCTS_CSV", out)
    p = Product(product_id="abc", url="http://x", name="Test Serum",
                brand="BrandX", price_thb=590.0, volume="30ml",
                ingredients=["Water", "Niacinamide"])
    konvy_scraper.write_products_csv([p])
    rows = list(csv.DictReader(out.open(encoding="utf-8")))
    assert rows[0]["product_id"] == "abc"
    assert rows[0]["name"] == "Test Serum"
    assert "Niacinamide" in rows[0]["ingredients"]
```

- [ ] **Step 2: 실패 확인**

Run: `python -m pytest cosmetics/tests/test_scraper_io.py -v`
Expected: FAIL

- [ ] **Step 3: `konvy_scraper.py` 구현 (저장 + 크롤 루프)**

```python
"""Konvy 크롤 오케스트레이션: 목록→상세→리뷰, 체크포인트, 서킷브레이커.

기존 pantip/scraper.py main() 패턴을 따름:
  - per-item 에러 격리 (제품 1개 실패가 전체를 죽이지 않음)
  - 매 제품 progress.json 저장 (재시작 안전)
  - 연속 실패 N회 → 서킷브레이커 일시정지
  - heartbeat 파일 (health 모니터용)
"""
from __future__ import annotations
import argparse, csv, json, logging, sys, time
from dataclasses import asdict
from pathlib import Path

from . import config, konvy_parse, fetcher, vpn_up
from .models import Product

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger("cosmetics")

CSV_FIELDS = ["product_id", "url", "name", "brand", "price_thb", "volume",
              "image_url", "ingredients", "concern_seeds", "konvy_rating",
              "konvy_review_count", "fetched_at"]

def write_products_csv(products: list[Product]) -> Path:
    config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with config.PRODUCTS_CSV.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        w.writeheader()
        for p in products:
            row = asdict(p)
            row["ingredients"] = "|".join(p.ingredients)
            row["concern_seeds"] = "|".join(p.concern_seeds)
            row.pop("ingredients_raw", None)
            w.writerow({k: row.get(k, "") for k in CSV_FIELDS})
    return config.PRODUCTS_CSV

def save_reviews(product_id: str, reviews: list) -> Path:
    config.REVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    p = config.REVIEWS_DIR / f"{product_id}_konvy.json"
    p.write_text(json.dumps([asdict(r) for r in reviews], ensure_ascii=False, indent=2),
                 encoding="utf-8")
    return p

def load_progress() -> dict:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    p = config.STATE_DIR / "progress.json"
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}

def save_progress(prog: dict) -> None:
    config.STATE_DIR.mkdir(parents=True, exist_ok=True)
    (config.STATE_DIR / "progress.json").write_text(
        json.dumps(prog, ensure_ascii=False, indent=2), encoding="utf-8")

def listing_urls_for(concern: str) -> list[str]:
    """RECON.md에서 확정한 고민별 시드 목록 URL 생성기.
    예: 검색 기반이면 f'https://www.konvy.com/search.php?q={term}&page={n}'.
    실제 URL 패턴은 RECON.md 기준으로 채운다."""
    raise NotImplementedError("RECON.md의 목록 URL 패턴으로 구현")

def crawl(limit: int | None = None) -> int:
    ports = vpn_up.pick_active_ports()
    log.info(f"using proxy ports: {ports}")
    client = fetcher.make_client(ports[0])
    progress = load_progress()
    products: list[Product] = []
    consecutive_fails = 0
    try:
        for concern in config.CONCERNS:
            for list_url in listing_urls_for(concern):
                status, html = fetcher.fetch_with_retry(client, list_url)
                if status != 200:
                    continue
                for purl in konvy_parse.parse_listing(html):
                    pid = purl.rstrip("/").split("/")[-1]
                    if progress.get(pid, {}).get("status") == "ok":
                        continue
                    try:
                        time.sleep(config.DELAY_PRODUCT_SEC)
                        s, phtml = fetcher.fetch_with_retry(client, purl)
                        if s != 200:
                            raise RuntimeError(f"product HTTP {s}")
                        product = konvy_parse.parse_product(phtml, purl)
                        product.concern_seeds = [concern]
                        # 리뷰: RECON.md가 별도 XHR이면 그 endpoint로 fetch, 내장이면 phtml 재사용
                        reviews = konvy_parse.parse_reviews(phtml)
                        product.konvy_review_count = len(reviews)
                        if reviews:
                            product.konvy_rating = round(
                                sum(r.rating for r in reviews) / len(reviews), 2)
                            save_reviews(product.product_id, reviews)
                        products.append(product)
                        progress[pid] = {"status": "ok", "name": product.name,
                                         "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
                        consecutive_fails = 0
                    except Exception as e:  # noqa: BLE001
                        consecutive_fails += 1
                        progress[pid] = {"status": "error", "error": f"{type(e).__name__}: {e}"}
                        log.warning(f"product {pid} fail: {e}")
                        if consecutive_fails >= config.CIRCUIT_BREAKER_FAILS:
                            log.error(f"circuit breaker — pause {config.CIRCUIT_BREAKER_PAUSE_SEC}s")
                            save_progress(progress); write_products_csv(products)
                            time.sleep(config.CIRCUIT_BREAKER_PAUSE_SEC)
                            consecutive_fails = 0
                    save_progress(progress)
                    (config.STATE_DIR / "heartbeat").write_text(
                        time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), encoding="utf-8")
                    if limit and len(products) >= limit:
                        write_products_csv(products); return 0
    finally:
        client.close()
        write_products_csv(products)
        save_progress(progress)
    log.info(f"DONE: {len(products)} products")
    return 0

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None)
    args = ap.parse_args()
    return crawl(limit=args.limit)

if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: 통과 확인**

Run: `python -m pytest cosmetics/tests/test_scraper_io.py -v`
Expected: PASS

- [ ] **Step 5: 전체 테스트 통과 확인**

Run: `python -m pytest cosmetics/ -v`
Expected: 모든 테스트 PASS.

- [ ] **Step 6: Commit**

```bash
git add cosmetics/konvy_scraper.py cosmetics/tests/test_scraper_io.py
git commit -m "feat(cosmetics): crawl loop + CSV/JSON persistence"
```

---

## Task 9: 라이브 스모크 런 (소량) + listing_urls_for 확정

**Files:**
- Modify: `cosmetics/konvy_scraper.py` (`listing_urls_for` 실제 구현)

- [ ] **Step 1: `listing_urls_for` 를 RECON.md 패턴으로 구현**

`NotImplementedError` 자리에 Task 2에서 확인한 실제 목록/검색 URL 패턴을 채운다. 예(검색 기반인 경우):

```python
from urllib.parse import quote
CONCERN_TERMS = {
    "acne": ["สิว", "acne", "ครีมรักษาสิว"],       # RECON으로 검증된 검색어
    "whitening": ["ไวท์เทนนิ่ง", "whitening", "ฝ้า"],
}
def listing_urls_for(concern: str) -> list[str]:
    urls = []
    for term in CONCERN_TERMS.get(concern, []):
        for page in range(1, config.MAX_LIST_PAGES + 1):
            urls.append(f"https://www.konvy.com/search.php?q={quote(term)}&page={page}")
    return urls
```

- [ ] **Step 2: VPN 기동 (전용 2090–2091 시도)**

Run: `python -c "from cosmetics import vpn_up; from pathlib import Path; print('dedicated up' if vpn_up.start_dedicated(Path('nordvpn/auth.txt')) else 'fallback to time-share'); print(vpn_up.pick_active_ports())"`
Expected: `dedicated up` + `[2090, 2091]` (한도 초과면 `fallback...` 출력)

- [ ] **Step 3: 5개 제품만 스모크 런**

Run: `python -m cosmetics.konvy_scraper --limit 5`
Expected: `DONE: 5 products`, 에러 없이 종료.

- [ ] **Step 4: 출력 검증**

Run: `python -c "import csv; rows=list(csv.DictReader(open('cosmetics/output/products.csv',encoding='utf-8'))); print(len(rows)); print(rows[0]['name'], rows[0]['price_thb'], rows[0]['ingredients'][:60])"`
Expected: 5행, name/price 채워짐, ingredients에 성분 파이프 구분 문자열. (INCI가 비면 RECON.md의 성분 selector 재확인 → Task 4 selector 교정)

- [ ] **Step 5: Commit**

```bash
git add cosmetics/konvy_scraper.py cosmetics/output/products.csv
git commit -m "feat(cosmetics): live concern listing URLs + smoke run (5 products)"
```

---

## 다음 플랜 (이 플랜 범위 밖 — 각각 별도 plan)

이 플랜은 Unit ① 카탈로그 스크래퍼만 다룬다. 후속:
- **Plan 2 — Unit ② 성분 사전·과학** (`cosmetics/ingredients/`): INCI → 고민별 효능/유해 태그
- **Plan 3 — Unit ③ 리뷰 집계기**: Konvy 리뷰 + Pantip(기존 스크래퍼) 집계 → `review_score`
- **Plan 4 — Unit ④ 랭킹 엔진**: `build_master_db.py` → `cosmetics/web/data/master_db.json`
- **Plan 5 — Unit ⑤ AEO 사이트**: Next.js + JSON-LD/llms.txt + 제휴/광고 (태국어+영어)
- **운영**: watchdog에 화장품 배치 서비스 등록

---

## Self-Review (작성자 점검 결과)

- **Spec 커버리지:** 이 플랜은 spec §5 Unit ①(카탈로그 스크래퍼)과 §6(VPN 자동 폴백)을 구현. §5 ②③④⑤는 의도적으로 후속 플랜으로 분리(스코프 체크: spec이 다중 서브시스템 → 서브시스템별 플랜).
- **Placeholder 점검:** `listing_urls_for`와 파서 selector는 "RECON.md 기준으로 확정"으로 명시 — 이는 임의 placeholder가 아니라 **실 캡처 fixture 기반 TDD**의 정상 단계(Task 2가 그 데이터를 먼저 생성). 코드 골격·테스트·config·모델·fetcher·VPN·크롤루프·CSV는 모두 구체 코드로 제공.
- **타입 일관성:** `Product`/`KonvyReview` 필드는 models.py 정의와 parser/CSV/scraper에서 동일하게 사용. CSV_FIELDS는 Product 필드 집합의 부분(ingredients/concern_seeds는 join, ingredients_raw는 제외)으로 일관.
- **알려진 변동점:** httpx 프록시 인자(`proxy=` vs `proxies=`)와 SOCKS extra(`httpx[socks]`)는 설치 버전에 맞춰 Task 6에서 확정. 리뷰가 XHR JSON인지 HTML 내장인지는 Task 2 recon이 결정(parse_reviews는 양쪽 분기 모두 보유).
