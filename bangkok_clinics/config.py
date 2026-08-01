"""검색 및 수집 설정 — clinic edition. 환경변수로 phase별 오버라이드 가능."""
import os

# Google Maps 검색 쿼리 — 환경변수로 phase 별 변경 가능
#   Phase 1 (영문): SEARCH_QUERY=clinic       SEARCH_TAG=en
#   Phase 2 (태국): SEARCH_QUERY=คลินิก       SEARCH_TAG=th
SEARCH_QUERY = os.environ.get("SEARCH_QUERY", "clinic")
SEARCH_TAG = os.environ.get("SEARCH_TAG", "")  # checkpoint 파일 분리 키. 비우면 단일 공유.

# legacy (호환): 사용 안 함 — grid 기반
SEARCH_QUERIES = [SEARCH_QUERY]

MIN_REVIEW_COUNT = 5        # 최소 리뷰 수 — 더 많은 long-tail 클리닉 노출 위해 10→5
REVIEWS_PER_RATING = 10     # 별점당 최대 수집 리뷰 수 (1~5점 각각)
MAX_RESTAURANTS = None      # 무제한 (전체 수집)

# "complete" 처리된 장소도 이 일수가 지나면 재수집 큐에 다시 편입 — 새로
# 달린 리뷰를 계속 따라잡기 위함 (2026-07-29: review 큐가 한 번 완료되면
# 영구히 재방문 안 해서 신규 리뷰가 전혀 안 쌓이던 문제 발견 후 추가).
# collect_reviews_for_restaurant()는 매번 relevant+newest 전체를 다시 긁고
# 파일을 덮어쓰므로, 재수집 자체가 곧 "최신 리뷰까지 반영"이 된다 — 별도
# diff/증분 로직 불필요. 리뷰 파일 mtime이 "마지막 재수집" 신호.
REVIEW_REFRESH_DAYS = int(os.environ.get("REVIEW_REFRESH_DAYS", "7"))
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

# SOCKS5 프록시 설정 — NordVPN 6 포트 (nordvpn_runner.py 관리)
PROXY_HOST = "127.0.0.1"
VPN_PORT_BASE = 2080         # nordvpn_runner 의 idx=0 포트 (rotate marker 계산용)

# Grid (장소 발견) 워커 — env override 가능 (default 2 포트 2080-2081)
GRID_PROXY_PORT = int(os.environ.get("GRID_PROXY_PORT", "2080"))
GRID_N_WORKERS = int(os.environ.get("GRID_N_WORKERS", "2"))

# Review (상세 + 리뷰 수집) 워커 — env override 가능 (default 4 포트 2082-2085)
# Bangkok grid 끝난 후엔 N_WORKERS=5 + PROXY_PORT_BASE=2080으로 포트 review에 몰아줌.
PROXY_PORT_BASE = int(os.environ.get("PROXY_PORT_BASE", "2082"))
N_WORKERS = int(os.environ.get("N_WORKERS", "6"))

# legacy
PROXY_PORT = 2080
