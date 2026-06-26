"""쿠킹클래스 스크래퍼 설정"""
import os

# Google Maps 검색 쿼리 매트릭스 (AREAS x KEYWORDS)
AREAS = [
    "Sukhumvit", "Silom", "Sathorn", "Old Town Rattanakosin",
    "Chinatown", "Thonglor", "Ari", "Bang Rak", "Riverside", "On Nut",
]
KEYWORDS = [
    "thai cooking class",
    "cooking school",
    "culinary class",
    "market tour cooking",
    "thai food workshop",
]

# SEARCH_QUERY 환경변수로 단일 쿼리 오버라이드 가능 (watchdog 호환)
SEARCH_QUERY = os.environ.get("SEARCH_QUERY", "")
SEARCH_TAG = os.environ.get("SEARCH_TAG", "")

# ── 필터 패턴 ──
# 부정 패턴: 아래 키워드가 이름/카테고리에 있으면 스킵
NEGATIVE_PATTERNS = [
    "restaurant", "catering", "equipment", "ghost kitchen",
    "dark kitchen", "food delivery", "grocery", "supermarket",
    "hotel kitchen", "commissary", "cloud kitchen",
]

# 긍정 신호: 리뷰에 하나라도 있으면 '실제 수업' 장소로 인정
CLASS_SIGNALS = [
    "hands-on", "recipe", "learn to cook", "learned", "instructor",
    "teacher", "wok", "สอน", "ทำอาหาร", "เรียน", "workshop",
    "class", "lesson", "cooking session", "demonstration",
]

# ── 수집 설정 ──
MIN_REVIEW_COUNT = 3        # 최소 리뷰 수
MAX_PLACES = None           # None = 무제한
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", "output")

# ── VPN / 프록시 설정 (NordVPN SOCKS5, nordvpn_runner.py 관리) ──
PROXY_HOST = "127.0.0.1"
VPN_PORT_BASE = 2080         # nordvpn_runner idx=0 포트

PROXY_PORT_BASE = int(os.environ.get("PROXY_PORT_BASE", "2080"))
N_WORKERS = int(os.environ.get("N_WORKERS", "4"))

# legacy compat
PROXY_PORT = 2080

# ── 브라우저 설정 ──
HEADLESS = True
SLOW_MO = 50
LANGUAGE = "en"
