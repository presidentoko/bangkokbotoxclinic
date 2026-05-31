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
# Konvy 카테고리/검색 시드 URL은 recon에서 확정해 여기에 채운다.
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
