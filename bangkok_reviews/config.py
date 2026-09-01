"""검색 및 수집 설정 — 환경변수로 도시별 오버라이드 가능"""
import os

# Google Maps 검색 쿼리 목록 (테스트용: 1개 지역만)
SEARCH_QUERIES = [
    "restaurant in Sukhumvit Bangkok",
]

MIN_REVIEW_COUNT = 30       # 최소 리뷰 수

# discovered_places 의 review_count == 0 인 항목을 큐에 넣을지.
#
# 0 은 "리뷰가 없다"가 아니라 "그리드가 카드에서 숫자를 못 읽었다"는 뜻이라,
# 기본값은 통과시키는 쪽이다 — 갓 스캔한 도시에서 이걸 버리면 멀쩡한 식당을
# 놓친다.
#
# 다만 그리드가 충분히 돈 도시에서는 이 값이 압도적으로 "진짜 리뷰가 거의 없는
# 곳"이 된다. 방콕이 그 상태다: 발견 34,412곳 중 rc==0 이 10,696곳이고,
# rc>=30 인 진짜 대상은 7,542곳뿐인데 큐에는 18,238곳이 들어가 절반 이상을
# 열어보고 버리는 데 쓴다(처리율 1.3/분 기준 9일 → 3.5일 차이).
SKIP_UNKNOWN_REVIEW_COUNT = os.environ.get("SKIP_UNKNOWN_REVIEW_COUNT", "0") == "1"
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

# Grid (식당 발견) 워커
GRID_PROXY_PORT = 2080       # 포트 1개
GRID_N_WORKERS = 1

# Review (상세 + 리뷰 수집) 워커
PROXY_PORT_BASE = 2081       # 2081..2085
N_WORKERS = 5

# legacy
PROXY_PORT = 2080
