"""검색 및 수집 설정 — clinic edition. 환경변수로 phase별 오버라이드 가능."""
import os

# Google Maps 검색 쿼리 — 환경변수로 phase 별 변경 가능
#   Phase 1 (영문): SEARCH_QUERY=clinic       SEARCH_TAG=en
#   Phase 2 (태국): SEARCH_QUERY=คลินิก       SEARCH_TAG=th
SEARCH_QUERY = os.environ.get("SEARCH_QUERY", "clinic")
SEARCH_TAG = os.environ.get("SEARCH_TAG", "")  # checkpoint 파일 분리 키. 비우면 단일 공유.

# legacy (호환): 사용 안 함 — grid 기반
SEARCH_QUERIES = [SEARCH_QUERY]

MIN_REVIEW_COUNT = 10       # 최소 리뷰 수 (클리닉은 식당보다 적음 → 30→10)
REVIEWS_PER_RATING = 10     # 별점당 최대 수집 리뷰 수 (1~5점 각각)
MAX_RESTAURANTS = None      # 무제한 (전체 수집)
OUTPUT_DIR = os.environ.get("CITY_OUTPUT_DIR", "output")

# ── 그리드 스캔 설정 (식당 발견 Phase) ──
GRID_CENTER_LAT = float(os.environ.get("CITY_LAT", "13.7462890"))
GRID_CENTER_LNG = float(os.environ.get("CITY_LNG", "100.5346890"))

_radius_m = int(os.environ.get("CITY_RADIUS_M", "30000"))
# Zone grid: 반경 내 500m 균일 step
GRID_ZONES = [
    (_radius_m, 500),
]
GRID_SUBDIVIDE_THRESHOLD = 999999  # 분할 비활성 (균일 step 고정)
GRID_MIN_STEP_M = 500
GRID_ZOOM = 17                  # Google Maps zoom level

# legacy (호환): 사용 안 함
GRID_RADIUS_M = 15000
GRID_STEP_M = 500

# 브라우저 설정
HEADLESS = True             # True로 바꾸면 브라우저 안 보임
SLOW_MO = 50                # 밀리초 — 너무 빠르면 차단당할 수 있음
LANGUAGE = "en"             # Google Maps UI 언어 (식당명 영어 표시)

# SOCKS5 프록시 설정 — NordVPN 8 포트 (nordvpn_runner.py 관리)
PROXY_HOST = "127.0.0.1"
VPN_PORT_BASE = 2080         # nordvpn_runner 의 idx=0 포트 (rotate marker 계산용)

# Grid (장소 발견) 워커 — 2 포트 (2080-2081)
GRID_PROXY_PORT = 2080       # 첫 grid 워커 포트 (idx 0); 추가 워커는 +1, +2…
GRID_N_WORKERS = 2

# Review (상세 + 리뷰 수집) 워커 — 6 포트 (2082-2087)
PROXY_PORT_BASE = 2082
N_WORKERS = 6

# legacy
PROXY_PORT = 2080
