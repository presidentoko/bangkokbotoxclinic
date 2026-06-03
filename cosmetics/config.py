"""Konvy 화장품 스크래퍼 설정. 기존 pantip/config.py 패턴을 따름."""
import os
import urllib.parse
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
CONCERNS = ["acne", "whitening", "antiaging", "pores", "oilcontrol", "sensitive"]

# 검색 기반 시드 (recon 2026-06-01 확정): Konvy 검색 = /list/?title=<kw>, 키워드당 ~32개.
# 카테고리 서브트리는 JS라 안 잡혀서, 고민별 태국어 키워드로 니치(여드름+미백)를 정밀 커버.
SEARCH_KEYWORDS = {
    "acne": ["สิว", "รักษาสิว", "แต้มสิว", "สิวอุดตัน", "สิวอักเสบ",
             "ลดรอยสิว", "เจลแต้มสิว", "เซรั่มลดสิว"],
    "whitening": ["ฝ้า", "กระ", "จุดด่างดำ", "ผิวกระจ่างใส", "วิตามินซี",
                  "ไนอาซินาไมด์", "ผิวขาว", "อาร์บูติน", "ลดรอยดำ", "เซรั่มหน้าใส"],
    "antiaging": ["ริ้วรอย", "ลดริ้วรอย", "เซรั่มริ้วรอย", "ผิวกระชับ",
                  "เซรั่มคอลลาเจน", "เรตินอล", "ต่อต้านวัย"],
    "pores": ["รูขุมขน", "กระชับรูขุมขน", "ลดรูขุมขน", "เซรั่มรูขุมขน",
              "ผิวเรียบเนียน"],
    "oilcontrol": ["คุมมัน", "ควบคุมความมัน", "ผิวมัน", "ลดความมัน",
                   "เซรั่มคุมมัน"],
    "sensitive": ["ผิวแพ้ง่าย", "ผิวบอบบาง", "ปลอบประโลมผิว", "เสริมเกราะผิว",
                  "ผิวแดง"],
}
# 추가 폭(breadth)용 카테고리 허브도 시드에 포함 (113=스킨케어 일반).
CATEGORY_SEEDS = {"acne": ["113"]}

def listing_seed_bases() -> "list[tuple[str, str]]":
    """(listing_url, concern) 시드 '베이스'(page 미포함) — 키워드 검색 + 카테고리 허브.
    discover()가 베이스마다 paged_url로 ?page=N을 돌며 천장(=한 페이지 32개)을 넘긴다."""
    pairs: "list[tuple[str, str]]" = []
    for concern, kws in SEARCH_KEYWORDS.items():
        for kw in kws:
            pairs.append((f"https://www.konvy.com/list/?title={urllib.parse.quote(kw)}", concern))
    for concern, cats in CATEGORY_SEEDS.items():
        for cat in cats:
            pairs.append((f"https://www.konvy.com/mall/list.php?param={cat}-0-0-0&from=category", concern))
    return pairs


def paged_url(base: str, page: int) -> str:
    """Konvy 목록 페이지네이션: page<=1은 베이스 그대로, 그 외엔 ?page=N/&page=N 부착.
    (관측된 형태: /list/skincare/?page=2 ... ?page=201)"""
    if page <= 1:
        return base
    sep = "&" if "?" in base else "?"
    return f"{base}{sep}page={page}"


def search_listing_urls(pages: "int | None" = None) -> "list[tuple[str, str]]":
    """(listing_url, concern) 전체 — 각 베이스를 1..pages 페이지로 확장."""
    n = DISCOVER_PAGES_PER_SEED if pages is None else pages
    out: "list[tuple[str, str]]" = []
    for base, concern in listing_seed_bases():
        for p in range(1, n + 1):
            out.append((paged_url(base, p), concern))
    return out

# 디스커버리 캐시 TTL (초). 멀티데이 패스마다 재탐색하지 않도록.
DISCOVER_TTL_SEC = int(os.getenv("COSMETICS_DISCOVER_TTL", "43200"))  # 12h

# 시드당 페이지네이션 깊이(보수적). 한 페이지=상품 ~32개. 베이스 41개 × 이 값이
# 디스커버리당 listing fetch 수의 상한. discover()는 '새 URL 0개' 페이지에서 조기 종료.
DISCOVER_PAGES_PER_SEED = int(os.getenv("COSMETICS_DISCOVER_PAGES", "8"))

# ── 매너 딜레이 (초) ──
DELAY_LIST_SEC = float(os.getenv("COSMETICS_DELAY_LIST", "2.0"))
DELAY_PRODUCT_SEC = float(os.getenv("COSMETICS_DELAY_PRODUCT", "2.0"))
DELAY_REVIEW_SEC = float(os.getenv("COSMETICS_DELAY_REVIEW", "1.0"))

MAX_LIST_PAGES = int(os.getenv("COSMETICS_MAX_LIST_PAGES", "50"))
MAX_REVIEW_PAGES = int(os.getenv("COSMETICS_MAX_REVIEW_PAGES", "20"))

# ── 터널 플랩 내성 (2090/2091 NordVPN exit가 자주 끊김) ──
# 둘 다 죽었을 때 복구를 기다리는 라운드 수 × 라운드당 대기.
TUNNEL_RECOVER_ROUNDS = int(os.getenv("COSMETICS_TUNNEL_RECOVER_ROUNDS", "10"))
TUNNEL_RECOVER_WAIT_SEC = int(os.getenv("COSMETICS_TUNNEL_RECOVER_WAIT", "15"))
# 상품 수집 중 SOCKS 사망 시 허용하는 총 포트 로테이션 횟수.
MAX_TUNNEL_ROTATIONS = int(os.getenv("COSMETICS_MAX_TUNNEL_ROTATIONS", "40"))

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
