"""
Bangkok Restaurant Google Maps Scraper (Full metadata edition)
- Playwright + SOCKS5 프록시 (다중 슬롯 VPN)
- 식당 검색 → 상세 + About 탭 전 features → 리뷰(+ author UUID + 구조화 메타)
- place_id 기반 파일 생성
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
ROTATE_EVERY_TASKS = 8       # 2026-08-31: 15→8. 강등은 출구 활동량에 반응한다(실측) — 실패 전에 선제 교체

# 2026-09-03: 브라우저 프로세스를 주기적으로 새로 띄운다.
#
# 왜: chromium 은 오래 돌수록 메모리를 누적한다. 실측으로 워커당 비용이
# 갓 띄웠을 때 ~480MB → 몇 시간 뒤 940MB 이상으로 늘었고, 그 때문에
#   - 켤 때 여유 3.0GB 였던 것이 한 시간 만에 1.0GB 로 떨어지고
#   - ram_manager 가 pause 선(0.9GB)에서 다른 스크래퍼를 밀어냈다(09-03 실측)
# "워커를 몇 개 돌릴 수 있나" 가 시간에 따라 변하는 값이 되어, 고정 N_WORKERS
# 로는 답이 없었다. 워커 수를 줄이는 건 증상 대응이고 원인은 이 누적이다.
#
# 성공 건수가 아니라 '시도' 기준으로 센다. 차단 구간에서는 성공이 0이라
# task_success_count 기반이면 영원히 재활용되지 않는다 — 그런데 메모리는
# 실패로도 똑같이 쌓인다.
#
# 40건: 작업당 20~35초라 20~25분에 한 번. context 재생성(수백 ms)과 달리
# 프로세스 재시작은 2~3초가 들지만, 그 빈도면 처리량 손실이 0.2% 미만이다.
RECYCLE_EVERY_TASKS = 40
# 2026-08-07: 연속 실패/스킵이 이만큼 쌓이면 성공 여부와 무관하게 VPN 교체.
# 이게 없으면 출구 IP 가 구글에 소프트 차단됐을 때 워커가 영구히 갇힌다 —
# periodic 교체는 task_success_count(성공 시에만 증가)에 묶여 있어 성공이 0이면
# 절대 안 돌고, pending_rotate 는 elapsed > SLOW_THRESHOLD_SEC(120s) 조건인데
# 차단 시 no_name 스킵은 30초 만에 끝나 이것도 안 걸린다. 실제로 방콕 리뷰
# 2대가 1,223건 전수 실패(성공 0)하는 동안 교체가 한 번도 일어나지 않았고,
# watchdog 이 600초마다 kick → 재시작만 5시간에 60회 반복했다.
CONSEC_FAIL_ROTATE = 5
EMPTY_MAP_RETRIES = 0        # 2026-08-31 02:30: 재시도 무효 확인(0/40) — 달궈진 출구는 한동안 100% 빈 지도
EMPTY_MAP_CTX_RETRIES = 0    # 2026-08-31 02:30: 컨텍스트(0/51)·브라우저 재시작(0/26)도 무효 — 즉시 회전이 답
EMPTY_MAP_RETRY_DELAY = 4.0  # 초
# 2026-08-31: 컨텍스트 초기 쿠키. 빈 지도 재시도 때도 이 상태로 되돌린다 —
# 실패 직후 '새 컨텍스트 + 이 쿠키'는 50% 정상인데 같은 컨텍스트 재시도는 0% 였다.
# 구글이 세션에 심은 NID/__Secure-STRP 가 강등 상태를 물고 있는 것으로 본다.
INITIAL_COOKIES = [
        {"name": "CONSENT", "value": "PENDING+987",
         "domain": ".google.com", "path": "/"},
        {"name": "SOCS", "value": "CAISHAgDEhJnd3NfMjAyMzA1MDEtMF9SQzIaAmVuIAEaBgiA_LyaBg",
         "domain": ".google.com", "path": "/"},
        {"name": "NID", "value": "511=consent_ok",
         "domain": ".google.com", "path": "/"},
    ]


# ── 큐 고갈 시 정상 종료 ──────────────────────────────────────
# 큐가 이만큼 연속으로 비어 있고(진행 중 작업 0건 포함) 새로 들어오는 것도
# 없으면 "할 일이 없다"로 보고 메인 루프를 빠져나간다.
#
# 2026-08-07: 이게 없어서 방콕 리뷰가 5시간에 60회 재시작했다. 원인 구조는
#   1) MAX_RESTAURANTS=None(무제한)이면 should_stop() 이 영원히 False —
#      큐가 다 말라도 메인 루프를 못 벗어난다.
#   2) 그래서 종료 직전 라인("수집 중단/완료 → 워커 정리")을 찍을 수가 없고,
#      이 라인을 REVIEW_DONE_MARKER 로 보는 watchdog 의 review_naturally_done()
#      은 무제한 모드에서 도달 불가능한 죽은 코드가 된다.
#   3) 남는 건 progress_stale 뿐인데 이건 성공 라인만 센다. 할 일이 없어
#      성공이 0이면 "행(hang)"으로 오판 → kick → 재시작 → 후보 재계산 →
#      또 할 일 없음 → kick … 무한 반복. 매 사이클마다 크롬을 새로 띄운다.
# 즉 "할 일이 없다"와 "멈췄다"를 구별할 방법이 없던 게 문제였다.
#
# 값을 300초로 잡은 이유: watchdog 이 kick 하기까지 걸리는 최소 시간
# (progress_grace_sec 420 / progress_stale_sec 600, 실측 약 7분)보다 반드시
# 짧아야 kick 보다 정상 종료가 먼저 일어나 마커를 남길 수 있다. 이 값을
# 올리려면 watchdog 쪽 grace/stale 도 같이 올릴 것.
IDLE_EXIT_SEC = int(os.environ.get("IDLE_EXIT_SEC", "300"))

CLOSED_STATUSES = ("permanently closed", "temporarily closed")

# ── 버티컬 순도 필터 ─────────────────────────────────────────
# 검색 키워드에 미용실/외국지점이 섞여 들어오는 문제 차단 (2026-07-10):
# 헤어 수집분에 DHI Colombo(스리랑카)·Dr. Viral Desai Pune(인도)·
# 허브 트리트먼트 가게가 실제로 들어와 있었음.
_OUT_HINT = (os.environ.get("CITY_OUTPUT_DIR", "") + " "
             + os.environ.get("SEARCH_TAG", "")).lower()
VERTICAL = ("hair" if "hair" in _OUT_HINT
            else "dental" if "dental" in _OUT_HINT
            # 스파/마사지 버티컬 (2026-07-23 신설) 분기가 없어서 "clinic" 으로
            # 떨어지고 있었다. 그 결과 아래 OFF_VERTICAL_RE(=클리닉 순수도 필터,
            # massage/spa/นวด/สปา 를 배제)가 **수집 대상 그 자체**를 걸러냈다.
            # 2026-08-08 실측: 파타야 발견 2,595곳 중 2,267곳(87.4%)이 이 필터에
            # 걸려 후보가 213개로 줄었고, clinics.csv 는 114행에 머물렀다.
            # 방콕도 14,334 → 1,227 로 85% 가 날아가고 있었다.
            else "spa" if ("spa" in _OUT_HINT or "massage" in _OUT_HINT)
            else "clinic")

# 버티컬 무관 업소 (미용실·스파·네일·안경점 등)
OFF_VERTICAL_RE = re.compile(
    r"hair salon|barber|beauty salon|nail|massage|\bspa\b|waxing|tattoo|"
    r"piercing|wig|hairdress|hair extension|makeup|eyelash|\blash\b|\bbrow\b|"
    r"optician|optical|pharmacy|drugstore|veterinar|\bpet\b|\bgym\b|fitness|"
    r"restaurant|cafe|coffee|hotel|hostel|"
    r"ร้านทำผม|ตัดผม|ร้านเสริมสวย|นวด|สปา|ทำเล็บ|ร้านสัก|ต่อขนตา|ร้านแว่น|ร้านขายยา|"
    r"미용실|네일|마사지",
    re.IGNORECASE,
)
# 모발이식 시그널 — 있으면 헤어 버티컬에서 차단 면제
HAIR_SIGNAL_RE = re.compile(
    r"transplant|graft|\bfue\b|\bdhi\b|restoration|regrow|hair loss|"
    r"hair clinic|hair center|scalp|trichol|"
    r"ปลูกผม|รักษาผมร่วง|모발이식|이식",
    re.IGNORECASE,
)
# 스파/마사지 시그널 — HAIR_SIGNAL_RE 와 같은 역할. OFF_VERTICAL_RE 가
# massage/spa 를 배제하므로, 스파 버티컬에서는 이 시그널이 있으면 면제해준다.
# 이게 없으면 스파 스크래퍼가 스파를 걸러낸다(2026-08-08 규명).
# 면제는 "spa 신호가 있을 때"만이라 식당·카페·안경점·헬스장 등은 그대로 배제된다.
SPA_SIGNAL_RE = re.compile(
    r"massage|\bspa\b|wellness|onsen|sauna|therapy|therapist|reflexolog|"
    r"นวด|สปา|마사지|스파",
    re.IGNORECASE,
)
# 치과 시그널 — 덴탈 버티컬은 이게 없으면 수집 안 함 (allowlist)
DENTAL_SIGNAL_RE = re.compile(
    r"dent|orthodont|ทันตกรรม|ทันตแพทย์|จัดฟัน|คลินิกฟัน|รักษาฟัน|หมอฟัน|"
    r"치과|임플란트",
    re.IGNORECASE,
)

# 태국 좌표 범위 — 외국 지점(구글 텍스트검색이 전세계 체인점을 돌려줌) 차단
TH_LAT_RANGE = (5.5, 20.6)
TH_LNG_RANGE = (97.2, 105.9)


def _vertical_reject(name: str, primary_type: str) -> str:
    """버티컬에 안 맞으면 skip 사유 문자열, 맞으면 빈 문자열."""
    blob = f"{name} {primary_type}"
    if VERTICAL == "dental":
        if not DENTAL_SIGNAL_RE.search(blob):
            return f"category:not_dental:{(primary_type or name)[:40]}"
        return ""
    if VERTICAL == "hair":
        if HAIR_SIGNAL_RE.search(blob):
            return ""
        if OFF_VERTICAL_RE.search(blob):
            return f"category:off_vertical:{(primary_type or name)[:40]}"
        return ""
    if VERTICAL == "spa":
        # hair 와 같은 구조 — spa 신호가 있으면 OFF_VERTICAL_RE 를 면제한다.
        # OFF_VERTICAL_RE 에 massage/spa/นวด/สปา 가 들어 있어서, 면제가 없으면
        # 스파 버티컬이 수집 대상을 스스로 배제한다(2026-08-08 규명).
        if SPA_SIGNAL_RE.search(blob):
            return ""
        if OFF_VERTICAL_RE.search(blob):
            return f"category:off_vertical:{(primary_type or name)[:40]}"
        return ""
    # clinic (에스테틱/보톡스)
    if OFF_VERTICAL_RE.search(blob):
        return f"category:off_vertical:{(primary_type or name)[:40]}"
    return ""


def _outside_thailand(lat: str, lng: str) -> bool:
    try:
        la, ln = float(lat), float(lng)
    except (TypeError, ValueError):
        return False  # 좌표 못 읽으면 통과 (좌표는 보조 필터)
    return not (TH_LAT_RANGE[0] <= la <= TH_LAT_RANGE[1]
                and TH_LNG_RANGE[0] <= ln <= TH_LNG_RANGE[1])

_skip_reason_local = threading.local()


def _set_skip_reason(reason: str) -> None:
    _skip_reason_local.value = reason


def _pop_skip_reason() -> str:
    return getattr(_skip_reason_local, "value", "unknown")


_profile_lock_fh = None


def _acquire_profile_lock() -> bool:
    """로그인 프로필 독점 잠금. 프로세스가 죽으면 OS 가 잠금을 풀어서 낡은 잠금이 안 남는다."""
    global _profile_lock_fh
    if os.name != "nt" or not config.GMAPS_PROFILE:
        return True
    import msvcrt
    lock_path = Path(config.GMAPS_PROFILE).resolve().with_name(
        Path(config.GMAPS_PROFILE).name + ".scraper.lock")
    fh = open(lock_path, "a+")
    try:
        fh.seek(0)
        msvcrt.locking(fh.fileno(), msvcrt.LK_NBLCK, 1)
    except OSError:
        fh.close()
        return False
    _profile_lock_fh = fh
    return True


def _kill_stale_profile_chrome() -> None:
    """로그인 프로필을 붙잡고 있는 크롬을 정리한다 (로그인 모드 전용).

    프로필은 한 크롬만 열 수 있다. 워치독 kick·ram_manager pause 로 이전
    스크래퍼가 죽으면 playwright 가 띄운 크롬이 남아(grid 좀비와 같은 현상)
    새 launch_persistent_context 가 실패하고 서비스가 재시작 루프에 빠진다.
    커맨드라인에 **이 프로필 경로**가 든 chrome.exe 만 죽인다 — 사용자의
    개인 크롬은 다른 user-data-dir 이라 걸리지 않는다.
    """
    if os.name != "nt" or not config.GMAPS_PROFILE:
        return
    import subprocess
    prof = str(Path(config.GMAPS_PROFILE).resolve()).replace("'", "''")
    ps = (
        "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
        f"Where-Object {{ $_.CommandLine -and $_.CommandLine.Contains('{prof}') }} | "
        "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; $_.ProcessId }"
    )
    try:
        out = subprocess.run(["powershell", "-NoProfile", "-Command", ps],
                             capture_output=True, text=True, timeout=60).stdout.split()
        if out:
            log.warning(f"  로그인 프로필을 잡고 있던 크롬 {len(out)}개 정리")
            time.sleep(2)
    except Exception as e:
        log.warning(f"  프로필 크롬 정리 실패: {str(e)[:80]}")


def _rotate_vpn_and_wait(vpn_idx: int, timeout: float = ROTATE_TIMEOUT_SEC) -> bool:
    """
    vpn_idx = nordvpn_runner 에서 관리하는 포트 인덱스 (port - VPN_PORT_BASE).
    /tmp/rotate_port_<vpn_idx> 를 touch해서 runner 에 rotate 신호.
    /tmp/vpn_status.json 에서 server 가 바뀌고 alive=True 될 때까지 대기.
    """
    if config.GMAPS_PROFILE:
        # 로그인 모드는 프록시를 안 쓴다. 여기서 touch 하면 이 포트 번호를 실제로
        # 쓰는 **다른 서비스**의 터널을 회전시켜 버린다.
        return True
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


# Google Maps 는 리뷰를 UI 언어로 보여준다 — 원문이 다른 언어면 번역본을 준다.
# hl=en 고정이었기 때문에 태국어 리뷰가 전부 구글 영어 번역본으로 저장됐다
# (master_db language_total = {th: 4, en: 156146}).
#
# 대조군 실측 (place 0x311d672186f06fd3, 2026-10-15, 같은 클리닉·같은 정렬):
#   hl=en → 본문 있는 리뷰 5건 중 태국어 0건, 평균 290자 (영어 번역본)
#   hl=th → 본문 있는 리뷰 5건 중 태국어 5건, 평균 220자 (원문)
#
# 기본값은 "en" 으로 둔다 — 환경변수를 준 실행만 동작이 바뀐다.
#
# 로케일을 두 개로 나눈 이유: 이 스크래퍼는 리뷰만 긁는 게 아니라 같은 실행에서
# 영업시간("Monday", "11 AM to 11 PM")·feature 섹션("Service options")·영업상태
# ("Permanently closed")·가격대(aria-label "Moderately priced") 도 읽는다. 그 파싱은
# 전부 영어 문자열 비교라서, 상세 페이지까지 th 로 넘기면 리뷰를 살리는 대신
# 영업시간과 상태를 통째로 잃는다. 리뷰 탭은 collect_reviews_for_restaurant() 가
# 어차피 자기 goto 를 따로 하므로, 거기만 REVIEW_HL 로 보내면 추가 로드 없이 분리된다.
MAPS_HL = (os.environ.get("MAPS_HL") or "en").strip() or "en"
REVIEW_HL = (os.environ.get("REVIEW_HL") or MAPS_HL).strip() or MAPS_HL


def add_hl(url: str, hl: str = "") -> str:
    hl = hl or MAPS_HL
    if "hl=" in url:
        return re.sub(r"hl=[a-z-]+", f"hl={hl}", url)
    return url + (f"&hl={hl}" if "?" in url else f"?hl={hl}")


# 2026-08-07 조사 기록 (no_name 전수 실패): 저장된 maps_url 형식은 문제가 아니다.
# 한때 "구글이 /maps/place/{태국어 이름} 세그먼트를 버린다"고 판단했으나, 이는
# 재현성 있는 규칙이 아니라 그 시점의 상태였다. 스크래퍼 2대를 정지시킨 뒤
# 같은 URL 을 다시 재보니 원본 그대로 5/5 성공했고, /maps/search 우회는 오히려
# 3/5 로 더 나빴다(동명 업체 오착지). 실제 원인은 출구 IP 단위 속도 제한으로,
# 차단되면 구글이 장소를 해석하지 않고 접속 IP 위치 중심의 빈 지도를 준다
# (h1 없음 → no_name, 지도 하단이 "Map data ©2026 Indonesia" 처럼 프록시 국가).
# 즉 no_name 이 대량으로 뜨면 셀렉터가 아니라 요청 속도를 의심할 것.


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

# 터널이 죽어도 HTTP 응답은 200 으로 떨어지는 경우가 있어 (Chrome 이 보여주는
# "Google Maps can't reach the internet" 페이지). h1 텍스트가 이 패턴이면
# 죽은 터널로 취급해 즉시 rotate.
_DEAD_TUNNEL_PAGE_MARKERS = (
    "can't reach the internet",
    "can’t reach the internet",  # smart apostrophe variant
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
    """SOCKS proxy died; workers should catch this and rotate VPN immediately."""


# ── 전역 차단 서킷브레이커 (2026-08-21 신설) ────────────────────────────────
# 출구 IP 차단은 rotate 로 푼다는 게 전제였는데, 그 전제가 깨지는 날이 있다.
# 2026-08-22 실측: 11시간 동안 서로 다른 서버 510개로 713회 교체했는데 690회가
# 차단, 성공 3건. 어제는 같은 서버 풀에서 국가별로 11~46% 성공하던 것이 오늘은
# de/fr/nl/th/kr/tw/hk/ph/vn 전부 0% 였다 — 서버 선택 문제가 아니라 구글이
# NordVPN 출구를 국가 무관하게 광범위하게 막은 것이라 rotate 로는 못 푼다.
#
# 그 상태에서 계속 때리면 산출은 0인데 "서로 다른 IP 690개가 같은 패턴으로
# 접근" 이라는 신호만 계속 보낸다 — 차단을 더 굳힐 뿐이다. 일정 연속 차단이
# 쌓이면 전 워커를 함께 쉬게 한다. 성공이 한 건이라도 나오면 즉시 해제.
BLOCK_STREAK_TRIP = 30          # 2026-08-31: 12→30. 빈 지도는 확률적 강등(12~50%)이지 확정 차단이 아니다
BLOCK_COOLDOWN_SEC = 3 * 60     # 2026-08-31: 30분→3분. 30분 전역 정지가 처리량을 0으로 눌렀다(08-22~30 실측)
_block_lock = threading.Lock()
_block_streak = 0
_block_cooldown_until = 0.0

# 2026-08-22: 상태를 디스크에 남긴다. 워치독의 progress_pattern 이
# `✓ [N]…처리율`(= 한 건 성공 완료)만 진행으로 인정하기 때문에, 전면 차단
# 구간에는 성공이 0이라 progress_stale_sec=600 이 매번 걸려 이 서비스가
# 10분마다 통째로 재시작된다(2026-08-21 실측 37회). 메모리에만 두면 그때마다
# 카운트가 0으로 돌아가 차단기가 영원히 발동하지 못한다 — 실제로 12:13~12:21
# 구간은 차단 5건에서 워치독에 죽었다.
# 파일에 남기면 재시작 직후 곧바로 쿨다운을 이어받아 요청을 안 내보낸다.
# (근본 해결은 watchdog 의 PROG_REVIEW 에 쿨다운 라인을 추가하는 것인데,
#  그건 watchdog 재시작이 필요해 별건으로 둔다.)
# 임계는 30 → 12 로 낮춘다. 워커 3개 × 30~60초면 10분 창에 12건은 쌓이지만
# 30건은 못 쌓는다. 어제 정상 구간에서도 12건 연속 차단은 나온 적이 없다.
_BLOCK_STATE_FILE: "Path | None" = None


def _load_block_state() -> None:
    """이전 프로세스가 남긴 쿨다운을 이어받는다."""
    global _block_streak, _block_cooldown_until
    if not _BLOCK_STATE_FILE or not _BLOCK_STATE_FILE.exists():
        return
    try:
        d = json.loads(_BLOCK_STATE_FILE.read_text(encoding="utf-8"))
        _block_streak = int(d.get("streak", 0))
        _block_cooldown_until = float(d.get("until", 0.0))
    except Exception:
        return
    remain = _block_cooldown_until - time.time()
    if remain > 0:
        log.warning(f"이전 실행의 차단 쿨다운 이어받음 — {int(remain)}초 남음")


def _save_block_state() -> None:
    if not _BLOCK_STATE_FILE:
        return
    try:
        tmp = _BLOCK_STATE_FILE.with_suffix(".json.tmp")
        tmp.write_text(json.dumps({"streak": _block_streak,
                                   "until": _block_cooldown_until}), encoding="utf-8")
        os.replace(tmp, _BLOCK_STATE_FILE)
    except Exception:
        pass


def _note_blocked_exit() -> None:
    """차단 응답 1건 기록. 임계 넘으면 전 워커 공통 쿨다운을 건다."""
    global _block_streak, _block_cooldown_until
    with _block_lock:
        _block_streak += 1
        if _block_streak >= BLOCK_STREAK_TRIP and time.time() >= _block_cooldown_until:
            _block_cooldown_until = time.time() + BLOCK_COOLDOWN_SEC
            log.error(
                f"⛔ 연속 차단 {_block_streak}건 — 출구 전체가 막힌 것으로 판단. "
                f"{BLOCK_COOLDOWN_SEC // 60}분 쉰다 (계속 때리면 차단만 굳는다). "
                f"성공이 나오면 즉시 해제."
            )
        _save_block_state()


def _record_server_outcome(vpn_idx: int, ok: bool) -> None:
    """이 포트가 지금 쓰는 출구 서버의 성적을 nordvpn_runner 에 알린다.

    2026-08-25: 서버마다 성적이 극단적으로 갈린다는 걸 로그로 확인했다.
    08-23 이후 519개 서버 중 93개는 성공 2건 이상(nl1072 는 9승 0패,
    de1265 6승 0패), 반대로 130개는 2회 이상 시도했는데 성공이 0이다.
    그런데 pick_server() 는 리스트 순서대로 조건에 맞는 첫 서버를 집을 뿐
    "이 서버가 실제로 데이터를 가져왔는가" 를 전혀 보지 않는다. 519개를
    무작위로 도니 평균 35% 로 수렴하는 것이다.

    성공한 서버를 기억해 우대하면 돈을 들이지 않고 성공률을 올릴 수 있다.
    통신은 이미 있는 파일 방식을 그대로 쓴다(rotate_port_N 과 같은 디렉터리).
    """
    try:
        status = json.loads((_TMPDIR / "vpn_status.json").read_text())
        host = ""
        for p_ in status.get("ports", []):
            if p_.get("idx") == vpn_idx:
                # vpn_status.json 의 server 는 "nl1253.nordvpn.com (186.247.163.8:443)"
                # 형식이다. 러너의 pick_server 는 s["host"](순수 호스트명)로 조회하므로
                # 괄호 앞부분만 써야 매칭된다 — 통째로 쓰면 키가 영원히 안 맞아
                # 성적이 쌓여도 선택에 반영되지 않는다(2026-08-25 첫 기록에서 발견).
                host = (p_.get("server", "") or "").split(" ")[0].strip()
                break
        if not host:
            return
        f = _TMPDIR / "vpn_server_scores.json"
        try:
            scores = json.loads(f.read_text())
        except Exception:
            scores = {}
        e = scores.setdefault(host, {"ok": 0, "bad": 0})
        e["ok" if ok else "bad"] += 1
        tmp = f.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(scores))
        os.replace(tmp, f)
    except Exception:
        # 성적 기록은 보조 기능이다 — 실패해도 수집을 막지 않는다.
        pass


def _note_success() -> None:
    """성공 1건 기록. 차단 연속 카운트와 쿨다운을 모두 푼다."""
    global _block_streak, _block_cooldown_until
    with _block_lock:
        if _block_streak or _block_cooldown_until:
            _block_streak = 0
            _block_cooldown_until = 0.0
            _save_block_state()


# 쿨다운 대기 중 하트비트 주기. watchdog 의 progress_stale_sec 가 600초라,
# 그보다 충분히 짧게 찍어야 "멈춘 것"으로 오판되지 않는다. watchdog 쪽
# PROG_REVIEW 가 이 라인을 진행으로 인정하도록 함께 수정했다 — 둘 중 하나만
# 바꾸면 의미가 없다(패턴만 바꾸면 침묵 구간에 죽고, 하트비트만 찍으면 패턴에
# 안 걸려 역시 죽는다).
BLOCK_HEARTBEAT_SEC = 240


# 쿨다운 중 정찰 간격. 전 워커 합쳐 이 간격마다 1건만 통과시킨다.
PROBE_INTERVAL_SEC = 20   # 2026-08-31: 300→20. 쿨다운 중에도 절반 속도로는 돈다
_probe_lock = threading.Lock()
_last_probe = 0.0


def _try_take_probe_slot() -> bool:
    """쿨다운 중 정찰 1건을 가져갈 수 있으면 True.

    2026-08-25: 차단기와 서버 성적 수집이 서로를 막고 있었다.
    성적 기반 선택은 "어떤 출구가 되는지" 데이터가 있어야 작동하는데, 차단기가
    30분씩 전 워커를 재우니 시도 자체가 없어 성적이 안 쌓인다 — 45분에 시도 2건.
    설치는 됐는데 학습이 안 되는 상태였다.

    그래서 쿨다운 중에도 5분에 1건은 통과시킨다. 목적이 둘이다:
      (1) 성적 데이터를 계속 모아 어떤 서버가 살아있는지 파악
      (2) 전면 차단이 풀렸는지 감지 — 성공하면 _note_success 가 쿨다운을 즉시 해제
    요청량은 시간당 12건으로, 차단 이전 정상 구간(시간당 수십~수백)의 극히
    일부라 차단을 굳힐 수준이 아니다. 잠그는 것과 완전히 눈 감는 것은 다르다.
    """
    global _last_probe
    with _probe_lock:
        now = time.time()
        if now - _last_probe >= PROBE_INTERVAL_SEC:
            _last_probe = now
            return True
    return False


def _wait_if_blocked(worker_id: int) -> None:
    """쿨다운 중이면 대기. 성공이 나오면 즉시, 정찰 차례면 1건 통과."""
    announced = False
    last_beat = 0.0
    while True:
        with _block_lock:
            remain = _block_cooldown_until - time.time()
        if remain <= 0:
            if announced:
                log.info(f"[W{worker_id}] 쿨다운 해제 — 재개")
            return
        if _try_take_probe_slot():
            log.info(f"[W{worker_id}] 정찰 1건 (쿨다운 {int(remain)}초 남음)")
            return
        now = time.time()
        if not announced:
            log.warning(f"[W{worker_id}] 차단 쿨다운 대기 {int(remain)}초")
            announced = True
            last_beat = now
        elif now - last_beat >= BLOCK_HEARTBEAT_SEC:
            # 살아 있고 의도적으로 쉬는 중임을 알린다. 없으면 watchdog 이
            # 10분 침묵을 정체로 보고 프로세스를 죽인다.
            log.warning(f"[W{worker_id}] 차단 쿨다운 대기 {int(remain)}초")
            last_beat = now
        time.sleep(min(30, remain))


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
    # MAPS_HL=th 로 돌 때의 같은 버튼들. form[action*=consent] 폴백이 마지막에
    # 받아주긴 하지만, 그건 폼 안의 첫 버튼을 누르므로 '동의'를 고를 수 없다.
    'button:has-text("ปฏิเสธทั้งหมด")',
    'button:has-text("ยอมรับทั้งหมด")',
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
    url = add_hl(f"https://www.google.com/maps/search/{quote_plus(query)}")
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
        safe_sleep(2.0)
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
    # 2026-08-31: 빈 지도(/maps/place//)는 출구 차단이 아니라 구글의 확률적 강등이다.
    # 실패 직후 같은 출구에서 다시 열면 약 절반이 정상으로 온다(실측 8건). 그래서
    # 회전으로 올리기 전에 같은 출구에서 EMPTY_MAP_RETRIES 회 더 연다.
    # 회전은 비싸다 — 하루 5,500 spawn 중 3,000 이 터널 실패였다.
    log.info(f"  URL {maps_url[:200]}")  # 2026-08-31 진단: 실패한 href 를 밖에서 재현하기 위해
    for _attempt in range(EMPTY_MAP_RETRIES + 1):
        if not goto_with_retry(page, add_hl(maps_url), retries=3, delay=3.0):
            _set_skip_reason("goto_failed")
            return None, [], []
        safe_sleep(2.0)
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
            safe_sleep(3.0)

        current_url = page.url
        name = ""
        try:
            name = page.locator("h1").first.inner_text(timeout=5000).strip()
        except Exception:
            pass
        # 로그인 모드에서 clear_cookies() 는 로그아웃이다.
        if "/maps/place//" in current_url and _attempt < EMPTY_MAP_RETRIES and not config.GMAPS_PROFILE:
            log.info(f"  빈 지도 — 쿠키 초기화 후 같은 출구에서 재시도 {_attempt + 1}/{EMPTY_MAP_RETRIES}")
            try:
                page.context.clear_cookies()
                page.context.add_cookies(INITIAL_COOKIES)
            except Exception as _e:
                log.warning(f"  쿠키 초기화 실패: {_e}")
            safe_sleep(EMPTY_MAP_RETRY_DELAY)
            continue
        break
    if is_dead_tunnel_page_name(name):
        raise SocksDeadError(f"dead tunnel page detected: {name[:80]!r}")
    if not name or name == "Results":
        # 2026-08-20: no_name 이 대량으로 뜰 때(오늘 17:36 이후 100%) 로그만 봐서는
        # "출구 IP 가 차단돼 빈 지도를 받았다"와 "터널이 끊겨 페이지가 안 떴다"를
        # 구분할 수 없었다. 위 2026-08-07 기록이 말하는 판별 근거는 지도 하단
        # 저작권 표기의 국가명(차단이면 프록시 국가가 찍힌다)인데, 그걸 아무도
        # 안 찍고 있었다. 진단은 이 한 줄이면 끝나므로 상시로 남긴다.
        try:
            attribution = page.locator("div.gb_Ic, .gmnoprint, [jsaction*='copyright']").first.inner_text(timeout=1500).strip()
        except Exception:
            attribution = ""
        if not attribution:
            try:
                body = page.locator("body").inner_text(timeout=1500)
                attribution = next((ln.strip() for ln in body.splitlines() if "Map data" in ln or "©" in ln), "")
            except Exception:
                attribution = ""
        try:
            title = page.title()
        except Exception:
            title = ""
        log.warning(
            f"  no_name 상세 | title={title[:60]!r} | url={current_url[:110]} | 지도표기={attribution[:80]!r}"
        )
        # 2026-08-20: 위 진단 로그를 켜자마자 답이 나왔다. no_name 81건의 URL 이
        # 전부 `/maps/place//@48.68,2.50`(파리) `/@52.51,13.38`(베를린) 형태였다 —
        # place 세그먼트가 **비어 있고** 좌표가 방콕이 아니라 출구 IP 위치다.
        # 구글이 그 출구 IP 를 차단하면 장소를 해석하지 않고 접속 IP 중심의 빈
        # 지도를 준다(파일 상단 2026-08-07 기록과 같은 현상).
        #
        # 이건 "이 장소에 내용이 없다"가 아니라 "이 터널로는 아무것도 못 본다"이다.
        # 그런데 여기서 skip 으로 처리하면 (1) 그 href 가 세션 내 재큐잉에서 빠지고
        # (2) 다음 세션에 재시도 예산이 1 깎여, 3세션이면 멀쩡한 클리닉이 영구
        # 제외된다 — 오늘 727건이 정확히 그렇게 소진됐다.
        # SocksDeadError 로 올리면 호출부가 VPN 을 교체하고 같은 href 를 큐에
        # 되돌린다. 예산도 안 깎인다.
        if "/maps/place//" in current_url:
            raise SocksDeadError(
                f"blocked exit IP — empty place map at {current_url[:80]}"
            )
        _set_skip_reason("no_name")
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
        _set_skip_reason(f"low_reviews:{total_reviews}")
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

    if business_status.lower() in CLOSED_STATUSES:
        log.info(f"  건너뜀 ({business_status}): {name}")
        _set_skip_reason(f"closed:{business_status}")
        return None, [], []

    # 버티컬 순도: 미용실/무관 업종/타 버티컬 차단
    _reject = _vertical_reject(name, primary_type)
    if _reject:
        log.info(f"  건너뜀 (버티컬 불일치, {primary_type or '?'}): {name}")
        _set_skip_reason(_reject)
        return None, [], []

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

    # 태국 밖 지점 차단 (구글 텍스트검색이 DHI Colombo 같은 해외 체인점을 섞어줌)
    if _outside_thailand(lat, lng):
        log.info(f"  건너뜀 (태국 밖 {lat},{lng}): {name}")
        _set_skip_reason(f"geo:{lat},{lng}")
        return None, [], []

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

# 리뷰 탭·정렬 버튼 셀렉터는 두 가지 이유로 깨진다:
#   (1) 로케일 — aria-label 이 UI 언어를 따른다 ("Sort reviews" / "จัดเรียงรีวิว")
#   (2) 구글의 UI 변종 — 2026-10-15 실측에서 같은 장소가 두 DOM 을 줬다.
#       변종 A: button[data-value="Sort"], aria-label="Sort reviews"
#       변종 B: button[aria-expanded][aria-haspopup], aria-label 이 "Sort reviews"
#               가 아니라 **현재 정렬값**("เกี่ยวข้องที่สุด" = Most relevant)
# 그래서 언어·라벨에 기대지 않고, 눌러서 메뉴가 열리는지로 판정한다.
_SORT_BUTTON_SELECTORS = (
    'button[aria-label="Sort reviews"]',   # 변종 A (영어)
    'button[data-value="Sort"]',           # 변종 A, 언어 무관
    'button[aria-expanded][aria-haspopup]',  # 변종 B, 언어 무관
    'button[aria-label*="จัดเรียง"]',        # 태국어 라벨 폴백
    'button[aria-label*="เรียงลำดับ"]',
)

_REVIEW_TAB_WORDS = ("review", "รีวิว")

# 2026-10-15: 정렬 버튼을 누르면 구글이 정렬 메뉴 대신
# "Sign-in to get the best of Google Maps" 인터스티셜을 띄운다(로그인 안 된 세션).
# 실측: 클릭이 DOM 에 추가한 39개 요소가 전부 그 다이얼로그였고, menuitemradio 는
# 0개였다. 결과는 **기본 정렬 10건에서 수집 중단** — dental_output 리뷰 파일
# 중앙값이 8월 78 → 10월 25 로 떨어지고 10월 405개 중 154개가 10건 이하인 원인이다.
# 옛 _select_sort 는 `if count > 0` 한 줄이라 이걸 침묵으로 넘겼다.
#
# "Sign in" 버튼은 절대 누르지 않는다 — 계정이 붙으면 스크래퍼가 식별되고,
# 리뷰 UI 도 로그인 변종으로 바뀐다.
_DISMISS_WORDS = ("dismiss", "not now", "no thanks", "ปิด", "ไม่ใช่ตอนนี้", "ไม่เป็นไร")
_NEVER_CLICK_WORDS = ("sign in", "sign-in", "ลงชื่อ", "เข้าสู่ระบบ")


def dismiss_signin_dialog(page: Page) -> bool:
    """로그인 권유 다이얼로그를 닫는다. 실제로 닫았으면 True."""
    try:
        dlg = page.locator('div[role="dialog"]')
        for i in range(dlg.count()):
            d = dlg.nth(i)
            try:
                if not d.is_visible(timeout=500):
                    continue
            except Exception:
                continue
            btns = d.locator("button")
            for j in range(btns.count()):
                b = btns.nth(j)
                try:
                    label = ((b.inner_text(timeout=400) or "") + " "
                             + (b.get_attribute("aria-label") or "")).strip().lower()
                except Exception:
                    continue
                if not label or any(w in label for w in _NEVER_CLICK_WORDS):
                    continue
                if any(w in label for w in _DISMISS_WORDS):
                    try:
                        b.click(timeout=2000)
                        safe_sleep(1)
                        return True
                    except Exception:
                        continue
        # 라벨로 못 찾으면 Escape — 다이얼로그가 사라졌는지로 판정한다.
        before = dlg.count()
        if before:
            page.keyboard.press("Escape")
            safe_sleep(0.6)
            return page.locator('div[role="dialog"]').count() < before
    except Exception:
        pass
    return False


def _reviews_tab(page: Page):
    """리뷰 탭 locator 또는 None. hl=en 에서는 기존과 동일한 셀렉터를 먼저 쓴다."""
    tab = page.locator('button[role="tab"]:has-text("Reviews")')
    if tab.count() > 0:
        return tab.first
    tabs = page.locator('button[role="tab"]')
    for i in range(tabs.count()):
        t = tabs.nth(i)
        try:
            blob = ((t.inner_text(timeout=800) or "") + " "
                    + (t.get_attribute("aria-label") or "")).lower()
        except Exception:
            continue
        if any(w in blob for w in _REVIEW_TAB_WORDS):
            return t
    return None


def _select_sort(page: Page, data_index: str) -> bool:
    """정렬을 실제로 적용했으면 True.

    예전 구현은 `if count > 0` 한 줄이라, 구글이 변종 B 를 주면 **조용히 아무
    것도 하지 않고** 넘어갔다. 그러면 [Most relevant] 와 [Newest] 두 패스가
    같은 기본 정렬을 긁고, 두 번째 패스의 신규 0건이 "리뷰가 그만큼뿐"으로
    보인다 — 정렬이 수율을 지배하는 스크래퍼에서 가장 비싼 침묵이다.
    """
    option_sel = (f'div[role="menuitemradio"][data-index="{data_index}"], '
                  f'div[role="menuitemcheckbox"][data-index="{data_index}"]')
    for sel in _SORT_BUTTON_SELECTORS:
        for attempt in (1, 2):
            try:
                btn = page.locator(sel)
                if btn.count() == 0:
                    break
                btn.first.click(timeout=3000)
                safe_sleep(1)
                option = page.locator(option_sel)
                if option.count() == 0:
                    # 메뉴가 안 열렸다. 가장 흔한 이유는 로그인 인터스티셜이
                    # 가로챈 것 — 닫고 같은 버튼을 한 번 더 누른다. 그래도
                    # 안 열리면 이 셀렉터는 정렬 버튼이 아니다.
                    if attempt == 1 and dismiss_signin_dialog(page):
                        continue
                    try:
                        page.keyboard.press("Escape")
                        safe_sleep(0.5)
                    except Exception:
                        pass
                    break
                option.first.click()
                safe_sleep(2)
                return True
            except Exception:
                break
    log.warning(f"  정렬 버튼을 못 찾음 (data-index={data_index}) — 기본 정렬로 수집됨")
    return False


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
# "Local Guide · 20 reviews · 9 photos" / 태국어 UI 에서는
# "Local Guide · 22 รีวิว · 146 รูปภาพ" ("Local Guide" 는 번역되지 않는다).
REVIEW_COUNT_RE = re.compile(r"(\d[\d,]*)\s*(?:review|รีวิว)")
PHOTO_COUNT_RE = re.compile(r"(\d[\d,]*)\s*(?:photo|รูปภาพ)")


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
            # 2026-10-18: 로그인 모드에서 일부 장소는 별 아이콘(span[role=img])
            # 없이 "5/5" 텍스트로 별점을 준다. 예전처럼 count 확인 없이
            # get_attribute 를 부르면 카드마다 기본 타임아웃(15s)을 다 기다려
            # 리뷰 100개 화면 하나에 25분이 걸렸고 별점은 전부 0 으로 저장됐다.
            star = 0
            try:
                stars = card.locator('span[role="img"][aria-label]')
                if stars.count() > 0:
                    aria = stars.first.get_attribute("aria-label", timeout=1000) or ""
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
            if not star:
                m = re.search(r"(?<![\d.])([1-5])/5(?!\d)", card_text)
                if m:
                    star = int(m.group(1))

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
        page.goto(add_hl(restaurant.maps_url, REVIEW_HL), wait_until="domcontentloaded")
    except Exception as e:
        if is_socks_dead_error(str(e)):
            raise SocksDeadError(str(e))
        raise
    safe_sleep(2.5)

    review_tab = _reviews_tab(page)
    if review_tab is None:
        log.warning(f"  Reviews 탭 없음: {restaurant.name}")
        return [], []
    review_tab.click()
    safe_sleep(2.0)
    dismiss_signin_dialog(page)

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
    sorted_relevant = _select_sort(page, "0")
    _scroll_and_load(page, target=100)
    p1_r, p1_m = _parse_cards(page, restaurant.place_id, "relevant", restaurant.name)
    n1 = add_unique(p1_r, p1_m)
    log.info(f"  [Most relevant] DOM {len(p1_r)}개 → 고유 {n1}개")

    log.info("  [Newest] 수집")
    sorted_newest = _select_sort(page, "1")
    if not (sorted_relevant and sorted_newest):
        # 둘 중 하나라도 실패했으면 두 패스가 같은 목록이다. sort_source 라벨이
        # 거짓이 되므로 숫자를 그대로 믿지 말라고 남긴다.
        log.warning("  정렬 미적용 — 두 패스가 같은 기본 정렬일 수 있음 "
                    f"(relevant={sorted_relevant}, newest={sorted_newest})")
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

class _FileLock:
    """Read-modify-write race 방지. 8 worker 동시 CSV merge 중 데이터 손실 사례 (2026-05-09)
    이후 추가. O_EXCL atomic create 기반 — 외부 dep 없음. 60s stale lock 자동 회수."""

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
                # 60s 넘은 lock 은 stale 로 간주 → 회수
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
        # timeout — 그래도 진행 (block 보다 stale 위험을 받아들임)
        log.warning(f"  csv lock {self.lock_path.name} {self.timeout}s timeout — 진행")
        return self

    def __exit__(self, *args):
        if self._held:
            try:
                self.lock_path.unlink()
            except OSError:
                pass


def _atomic_write_csv(path: Path, header: list[str], rows: list[list]):
    """tmp → rename atomic. 부분-쓰기 상태에서 reader 가 truncated CSV 보는 거 방지.

    _FileLock 은 이 스크립트의 다른 인스턴스끼리만 서로 보호한다 — 백신
    실시간 검사, OneDrive 동기화 등 외부 프로세스가 찰나 파일을 열어두면
    os.replace 가 WinError 5(Access is denied)로 죽는다. 이 예외가 main()
    까지 안 잡혀서 스크래퍼 프로세스 전체가 죽는 사고가 있었다(2026-08-19,
    bangkok_clinics_review — 재시작 폭주 → ram_manager 가 자원 소모로 오인해
    일시정지). 외부 프로세스의 파일 오픈은 보통 수십 ms 안에 끝나므로 짧은
    재시도로 대부분 회복된다."""
    tmp = path.with_suffix(path.suffix + f".tmp.{os.getpid()}")
    with open(tmp, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow(header)
        for r in rows:
            w.writerow(r)
    # 2026-09-01: 재시도 총 1.2초로는 부족했다 — master_db_builder 등이 이 CSV 를
    # 읽는 동안(수 초) os.replace 가 계속 막혀 오늘만 세션 크래시 4회(재시작 8회 중).
    # 총 ~30초까지 기다리고, 그래도 안 되면 raise 하지 않는다: 이 저장은 merge
    # 방식이라 다음 저장 주기에 같은 내용이 다시 합쳐진다. 한 번 미루는 것이
    # 세션 전체(진행 중 작업·큐·예산 카운트)를 죽이는 것보다 싸다.
    for attempt in range(10):
        try:
            os.replace(str(tmp), str(path))  # POSIX + Windows atomic
            return
        except PermissionError:
            time.sleep(min(6.0, 0.3 * (2 ** attempt)))
    log.error(f"  {path.name} 교체 30초 실패 — 이번 저장은 건너뜀 (다음 주기에 재병합)")
    try:
        os.remove(str(tmp))
    except Exception:
        pass


def _merge_and_save_restaurants(
    path: Path, new_restaurants: list[Restaurant], existing_ids: set[str]
):
    """모든 기존 row 보존 + 신규 place_id는 교체하여 저장.
    existing_ids는 더 이상 필터 용도가 아니라 호환용 파라미터.
    신규 collection의 place_id는 기존 row를 덮어쓴다.
    Lock + atomic write — 동시 worker race 방지 (2026-05-09 데이터 손실 사고 fix)."""
    header = ["place_id", "name", "primary_type",
              "formatted_address", "plus_code", "latitude", "longitude",
              "phone", "website", "menu_url",
              "rating", "total_reviews", "price_level", "price_symbol",
              "business_status", "editorial_summary", "maps_url"]
    with _FileLock(path):
        new_pids = {r.place_id for r in new_restaurants}
        preserved: list[list[str]] = []
        if path.exists():
            with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
                r = csv.reader(f)
                rows = list(r)
                if rows and rows[0] == header:
                    preserved = [row for row in rows[1:]
                                  if row and row[0] and row[0] not in new_pids]
        out_rows = list(preserved)
        for r_ in new_restaurants:
            out_rows.append([
                r_.place_id, r_.name, r_.primary_type,
                r_.formatted_address, r_.plus_code, r_.latitude, r_.longitude,
                r_.phone, r_.website, r_.menu_url,
                r_.rating, r_.total_reviews, r_.price_level, r_.price_symbol,
                r_.business_status, r_.editorial_summary, r_.maps_url,
            ])
        _atomic_write_csv(path, header, out_rows)


def _merge_and_save_features(
    path: Path, new_features: list[RestaurantFeature], existing_ids: set[str]
):
    """신규 place_id의 기존 features는 제거 후 새로 씀 (그 외 기존 row 보존)"""
    header = ["place_id", "section", "feature", "present"]
    with _FileLock(path):
        new_pids = {x.place_id for x in new_features}
        preserved: list[list[str]] = []
        if path.exists():
            with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
                r = csv.reader(f)
                rows = list(r)
                if rows and rows[0] == header:
                    preserved = [row for row in rows[1:]
                                  if row and row[0] and row[0] not in new_pids]
        out_rows = list(preserved) + [[x.place_id, x.section, x.feature, x.present] for x in new_features]
        _atomic_write_csv(path, header, out_rows)


def _merge_and_save_hours(
    path: Path, new_hours: list[RestaurantHours], existing_ids: set[str]
):
    header = ["place_id", "day", "hours_text"]
    with _FileLock(path):
        new_pids = {h.place_id for h in new_hours}
        preserved: list[list[str]] = []
        if path.exists():
            with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
                r = csv.reader(f)
                rows = list(r)
                if rows and rows[0] == header:
                    preserved = [row for row in rows[1:]
                                  if row and row[0] and row[0] not in new_pids]
        out_rows = list(preserved) + [[h.place_id, h.day, h.hours_text] for h in new_hours]
        _atomic_write_csv(path, header, out_rows)


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


REVIEW_HEADER = [
    "review_id", "place_id", "restaurant_name", "rating", "text",
    "author_name", "author_id", "author_uri", "author_photo_uri",
    "author_is_local_guide", "author_review_count", "author_photo_count",
    "relative_date", "spent_amount", "sort_source",
]

_TEXT_COL = REVIEW_HEADER.index("text")
_RATING_COL = REVIEW_HEADER.index("rating")
_THAI_CHARS = re.compile(r"[฀-๿]")


def _review_row(r: ReviewItem) -> list:
    return [
        r.review_id, r.place_id, r.restaurant_name, r.rating, r.text,
        r.author_name, r.author_id, r.author_uri, r.author_photo_uri,
        r.author_is_local_guide, r.author_review_count, r.author_photo_count,
        r.relative_date, r.spent_amount, r.sort_source,
    ]


def review_row_is_better(new_row: list, old_row: list) -> bool:
    """새 row 로 기존 row 를 대체해야 하면 True.

    두 가지만 더 좋다고 본다:
      1. 기존 본문이 비었는데 새 본문이 있다
      2. 새 본문은 태국어인데 기존은 아니다 — hl=en 으로 긁은 구글 번역본을
         원문으로 바꾸는 경우 (원문이 번역본보다 짧은 게 보통이라, 길이
         규칙만 쓰면 번역본이 이긴다)
      3. 새 본문이 20% 이상 길다 — "See more" 를 못 눌러 잘린 걸 복구
    그 외에는 기존을 유지한다. **리뷰 수가 줄어드는 방향의 쓰기는 없다.**
    """
    new_t = (new_row[_TEXT_COL] or "").strip()
    old_t = (old_row[_TEXT_COL] or "").strip()
    # 4. 기존 별점이 0 인데 새 별점이 있다 — 2026-10-18 별점 파서 버그(별
    #    아이콘 없는 "5/5" 표기)로 0 으로 저장된 줄을 재수집 때 복구한다.
    if str(old_row[_RATING_COL]) in ("0", "") and str(new_row[_RATING_COL]) not in ("0", "") \
            and (new_t or not old_t):
        return True
    if not new_t:
        return False
    if not old_t:
        return True
    new_th = bool(_THAI_CHARS.search(new_t))
    old_th = bool(_THAI_CHARS.search(old_t))
    if new_th != old_th:
        # 원문이 번역본을 이긴다. 길이 비교보다 **먼저** 와야 한다 — 영어
        # 번역본은 태국어 원문보다 길어지는 게 보통이라(실측 중앙값 290 vs 220),
        # 길이 규칙이 먼저 걸리면 번역본이 원문을 덮어쓴다.
        return new_th
    return len(new_t) > len(old_t) * 1.2


def save_reviews_csv(reviews: list[ReviewItem], path: Path):
    """기존 파일과 **합집합**으로 저장한다.

    2026-10-15: 예전 구현은 `open(path, "w")` 로 통째로 덮어썼다. 구글이 리뷰
    정렬/더보기를 로그인 게이트 뒤로 옮긴 뒤로 한 번에 5~10건만 긁히는데,
    그 5건이 78건짜리 파일을 대체했다. 실측(dental_output/bangkok, 표본 40):
    66→7, 69→6, 57→5, 54→8 … 12/40 이 80% 이상을 잃었다.
    2026-09-23 에 "0건이면 파일을 지우지 말 것"은 고쳤지만, **적게 긁힌 경우**는
    같은 사고의 다른 입구로 남아 있었다. 수집량은 스크래퍼가 통제할 수 없으니
    (출구 IP·구글 게이트·UI 변종) 쓰기 자체가 단조 증가여야 한다.
    """
    with _FileLock(path):
        existing: dict[str, list] = {}
        order: list[str] = []
        if path.exists():
            try:
                with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
                    rows = list(csv.reader(f))
                if rows and rows[0] == REVIEW_HEADER:
                    for row in rows[1:]:
                        if row and row[0]:
                            if row[0] not in existing:
                                order.append(row[0])
                            existing[row[0]] = row
                elif rows:
                    # 헤더가 다르면 스키마가 바뀐 것 — 합칠 수 없으므로 건드리지
                    # 않고 새로 쓴다(옛 동작). 조용한 유실을 막으려고 남긴다.
                    log.warning(f"  {path.name}: 헤더 불일치 — 합치지 않고 새로 씀")
            except Exception as e:
                log.warning(f"  {path.name} 읽기 실패 — 합치지 않음: {str(e)[:80]}")

        added = improved = 0
        for r in reviews:
            row = _review_row(r)
            rid = r.review_id
            if not rid:
                continue
            if rid not in existing:
                existing[rid] = row
                order.append(rid)
                added += 1
            elif review_row_is_better(row, existing[rid]):
                existing[rid] = row
                improved += 1

        _atomic_write_csv(path, REVIEW_HEADER, [existing[k] for k in order])
        if added or improved:
            log.info(f"    {path.name}: 총 {len(order)}건 (신규 {added}, 개선 {improved})")


META_HEADER = [
    "review_id", "place_id",
    "food_rating", "service_rating", "atmosphere_rating",
    "meal_type", "price_per_person", "group_size",
    "wait_time", "reservation", "service_type", "recommended_dishes",
]


def save_metas_csv(metas: list[ReviewMeta], path: Path):
    """reviews 와 같은 이유로 합집합 저장 (save_reviews_csv 주석 참조).

    여기선 "더 좋다" 가 단순하다 — 채워진 칸이 더 많은 쪽을 쓴다. 이 필드들은
    원래 식당용(food_rating·meal_type·recommended_dishes)이라 클리닉에서는
    대개 비어 있고, 영어 라벨 비교로 파싱하므로 REVIEW_HL=th 에서는 전부 빈다.
    그래서 th 재수집이 en 으로 채워둔 메타를 지우지 않는 게 특히 중요하다.
    """
    filled = lambda row: sum(1 for c in row[2:] if (c or "").strip())
    with _FileLock(path):
        existing: dict[str, list] = {}
        order: list[str] = []
        if path.exists():
            try:
                with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
                    rows = list(csv.reader(f))
                if rows and rows[0] == META_HEADER:
                    for row in rows[1:]:
                        if row and row[0]:
                            if row[0] not in existing:
                                order.append(row[0])
                            existing[row[0]] = row
                elif rows:
                    log.warning(f"  {path.name}: 헤더 불일치 — 합치지 않고 새로 씀")
            except Exception as e:
                log.warning(f"  {path.name} 읽기 실패 — 합치지 않음: {str(e)[:80]}")

        for m in metas:
            if not m.review_id:
                continue
            row = [
                m.review_id, m.place_id,
                m.food_rating, m.service_rating, m.atmosphere_rating,
                m.meal_type, m.price_per_person, m.group_size,
                m.wait_time, m.reservation, m.service_type, m.recommended_dishes,
            ]
            old_row = existing.get(m.review_id)
            if old_row is None:
                existing[m.review_id] = row
                order.append(m.review_id)
            elif filled(row) > filled(old_row):
                existing[m.review_id] = row

        _atomic_write_csv(path, META_HEADER, [existing[k] for k in order])


# ── 병렬 처리 ────────────────────────────────────────────────

class InFlight:
    """지금 워커가 붙잡고 있는 작업 수.

    task_q.empty() 만으로는 "할 일 없음"을 판정할 수 없다 — 워커가 30초짜리
    작업을 물고 있는 동안에도 큐는 비어 있기 때문이다. 이걸 안 세면 느린
    작업 한 건이 진행 중일 때 메인 루프가 큐 고갈로 오판해 종료해버린다.
    """

    def __init__(self):
        self._busy: set[int] = set()
        self._lock = threading.Lock()

    def busy(self, worker_id: int) -> None:
        with self._lock:
            self._busy.add(worker_id)

    def idle(self, worker_id: int) -> None:
        with self._lock:
            self._busy.discard(worker_id)

    @property
    def count(self) -> int:
        with self._lock:
            return len(self._busy)


_SIGNED_IN_UA: str | None = None  # 로그인 모드 헤드리스용 UA (HeadlessChrome → Chrome)


class _SignedInBrowser:
    """로그인 프로필 영속 컨텍스트를 Browser 처럼 쓰기 위한 껍데기 (close 만 필요)."""

    def __init__(self, ctx):
        self.ctx = ctx

    def close(self):
        self.ctx.close()


class _TabContext:
    """로그인 모드의 '컨텍스트' = 탭 하나. close() 는 그 탭만 닫는다."""

    def __init__(self, page):
        self.page = page

    def close(self):
        self.page.close()


def worker(
    worker_id: int, task_queue: Queue, result_queue: Queue,
    proxy_port: int, inflight: InFlight,
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

    def _launch(pw):
        """브라우저 기동. 로그인 모드면 로그인 프로필의 영속 컨텍스트를 연다."""
        if config.GMAPS_PROFILE:
            global _SIGNED_IN_UA
            _kill_stale_profile_chrome()
            kw = dict(
                channel="chrome",  # 로그인한 그 크롬과 같은 지문 — 쿠키가 다른 UA 에서
                                   # 쓰이면 구글 보안 검사에 걸리기 쉽다
                headless=not is_visible,
                slow_mo=config.SLOW_MO,
                locale="en-US",
                viewport={"width": 1280, "height": 800},
                args=["--disable-blink-features=AutomationControlled"],
            )
            # 헤드리스 크롬은 UA 에 "HeadlessChrome" 을 단다. 로그인해 있어도 그
            # UA 면 limited view 가 다시 걸린다(2026-10-16 실측: F7nice '4.8' 만,
            # 리뷰수 없음 → 전량 low_reviews 스킵). 같은 버전의 일반 Chrome UA 로
            # 바꾸면 '4.8\n(1,849)' 로 정상. 버전을 지어내지 않으려고 실제 UA 를
            # 한 번 읽어서 고친다.
            if not is_visible and _SIGNED_IN_UA is None:
                probe = pw.chromium.launch_persistent_context(config.GMAPS_PROFILE, **kw)
                try:
                    _SIGNED_IN_UA = probe.new_page().evaluate("navigator.userAgent").replace(
                        "HeadlessChrome", "Chrome")
                finally:
                    probe.close()
            if not is_visible:
                kw["user_agent"] = _SIGNED_IN_UA
            return _SignedInBrowser(pw.chromium.launch_persistent_context(config.GMAPS_PROFILE, **kw))
        return pw.chromium.launch(
            headless=not is_visible,
            slow_mo=config.SLOW_MO,
            proxy={"server": proxy_url},
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-features=IsolateOrigins,site-per-process",
            ],
        )

    def _build_context(browser):
        if isinstance(browser, _SignedInBrowser):
            # 영속 컨텍스트는 하나뿐이고 닫으면 브라우저가 닫힌다. "컨텍스트 재생성"
            # 은 새 탭으로 대신하고, 돌려주는 context 의 close() 는 그 탭만 닫는다.
            # 쿠키·UA·init 스크립트는 건드리지 않는다 — 로그인 세션을 그대로 쓴다.
            pg = browser.ctx.new_page()
            pg.route("**/*", _block_route)
            pg.set_default_timeout(15000)
            return _TabContext(pg), pg
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
        ctx.add_cookies(INITIAL_COOKIES)
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

    _worker_done = False  # sentinel(None) 받으면 True → 외부 루프 탈출
    while not _worker_done:
        try:
            with sync_playwright() as pw:
                browser = _launch(pw)
                context, page = _build_context(browser)
                pending_rotate = False  # 직전 작업이 느렸으면 True → 다음 작업 전 rotate
                task_success_count = 0  # 이 워커가 성공한 누적 작업 수 (정기 rotate 트리거)
                consec_fail = 0  # 연속 실패/스킵 — 차단된 출구 IP 탈출용
                tasks_since_recycle = 0  # 브라우저 재활용 주기 카운터 (2026-09-03)
                # 2026-08-31: href 별 빈 지도 횟수. 실측: 실패 직후 같은 출구에서 새 컨텍스트로
                # 열면 약 50% 정상 — 회전(비쌈, 터널 실패 동반)보다 먼저 이걸 쓴다.
                _empty_map_hits: dict[str, int] = {}

                while True:
                    # get 직전에 idle, 작업을 받으면 busy. 루프 위로 돌아오는
                    # 모든 경로(성공/스킵/예외/재큐잉)가 여기를 다시 지나므로
                    # 별도 finally 없이도 카운트가 새지 않는다.
                    inflight.idle(worker_id)
                    try:
                        task = task_queue.get(timeout=2)
                    except Empty:
                        # producer 가 새 작업을 넣을 수 있으니 즉시 종료하지 않고 계속 대기.
                        # None sentinel 받을 때만 종료.
                        continue
                    if task is None:
                        _worker_done = True
                        break
                    inflight.busy(worker_id)

                    # (idx, href) 또는 (idx, href, retries)
                    if len(task) == 2:
                        idx, href = task
                        retries = 0
                    else:
                        idx, href, retries = task

                    # 전 출구가 막힌 상태면 여기서 함께 쉰다 (위 서킷브레이커 주석 참조)
                    _wait_if_blocked(worker_id)

                    # 2026-09-03: 브라우저 메모리 누적 리셋. context 만 새로 만드는
                    # 것으로는 안 된다 — 누적은 프로세스에 쌓인다.
                    tasks_since_recycle += 1
                    if tasks_since_recycle >= RECYCLE_EVERY_TASKS:
                        tasks_since_recycle = 0
                        log.info(f"[W{worker_id}] 브라우저 재활용 ({RECYCLE_EVERY_TASKS}건 주기)")
                        try: context.close()
                        except Exception: pass
                        try: browser.close()
                        except Exception: pass
                        try:
                            browser = _launch(pw)
                            context, page = _build_context(browser)
                        except Exception as _e:
                            # 재기동 실패는 치명적이다 — 이 워커는 브라우저 없이 못 돈다.
                            log.error(f"[W{worker_id}] 브라우저 재활용 실패: {_e}")
                            raise

                    # 직전 작업이 느렸거나 정기 교체 주기 도달 시 먼저 VPN 교체
                    periodic = (task_success_count > 0
                                and task_success_count % ROTATE_EVERY_TASKS == 0)
                    stuck = consec_fail >= CONSEC_FAIL_ROTATE
                    if pending_rotate or periodic or stuck:
                        if stuck:
                            reason = f"연속 실패 {consec_fail}건 — 출구 IP 차단 의심"
                        elif pending_rotate:
                            reason = "느린 작업"
                        else:
                            reason = f"{ROTATE_EVERY_TASKS}건 정기"
                        log.info(f"[W{worker_id}] VPN 교체: {reason}")
                        pending_rotate = False
                        consec_fail = 0
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
                            reason = _pop_skip_reason()
                            log.info(f"[W{worker_id}] #{idx} 스킵 ({elapsed:.0f}s) — {reason}")
                            if elapsed > SLOW_THRESHOLD_SEC:
                                pending_rotate = True
                            consec_fail += 1
                            result_queue.put(("skip", (href, reason)))
                            continue
                        reviews, metas = collect_reviews_for_restaurant(page, rest)
                        elapsed = time.time() - t0
                        log.info(f"[W{worker_id}] #{idx} 완료: {rest.name[:40]}... "
                                 f"({len(reviews)} 리뷰, {elapsed:.0f}s)")
                        if elapsed > SLOW_THRESHOLD_SEC:
                            log.info(f"[W{worker_id}] 느림({elapsed:.0f}s) → 다음 작업 전 VPN 교체")
                            pending_rotate = True
                        task_success_count += 1
                        consec_fail = 0
                        _note_success()
                        _record_server_outcome(_vpn_idx_for(proxy_port), True)
                        result_queue.put(("ok", (rest, feats, hours, reviews, metas)))
                    except Exception as e:
                        elapsed = time.time() - t0
                        consec_fail += 1
                        log.warning(f"[W{worker_id}] #{idx} 실패 ({elapsed:.0f}s): {e}")
                        # SOCKS/프록시 문제로 확인된 경우만 rotate — 타임아웃, 셀렉터
                        # 미스, 파싱 에러 등 VPN과 무관한 실패까지 매번 rotate하면
                        # 멀쩡히 살아있는 터널을 계속 깨뜨리는 꼴이라 오히려 역효과.
                        # (2026-07-31 발견: 방콕 포함 전체 review 스크래퍼가 며칠째
                        # 성공률 0에 수렴 — 원인이 여기, 모든 예외가 무조건 rotate를
                        # 태워서 새 터널 부팅 실패까지 겹치는 상시 rotate 루프였음.
                        # nordvpn_runner 자체 헬스체크에 있던 것과 같은 종류의
                        # zero-tolerance 즉시재부팅 안티패턴.)
                        _soft_retry = False
                        if "blocked exit IP" in str(e):
                            _empty_map_hits[href] = _empty_map_hits.get(href, 0) + 1
                            if _empty_map_hits[href] <= EMPTY_MAP_CTX_RETRIES:
                                _soft_retry = True
                                log.info(f"[W{worker_id}] #{idx} 빈 지도 — 회전 없이 컨텍스트 재생성 후 재시도 "
                                         f"{_empty_map_hits[href]}/{EMPTY_MAP_CTX_RETRIES}")
                            else:
                                _note_blocked_exit()
                                _record_server_outcome(_vpn_idx_for(proxy_port), False)
                        if not _soft_retry and (isinstance(e, SocksDeadError) or is_socks_dead_error(str(e))):
                            _rotate_vpn_and_wait(_vpn_idx_for(proxy_port))
                        try: context.close()
                        except Exception: pass
                        # 2026-08-31 02:00 실측: 같은 출구·같은 시각에 워커는 빈 지도, 밖에서 띄운 새
                        # 브라우저 프로세스는 정상. 같은 프로세스의 새 컨텍스트는 50%, 새 프로세스는
                        # 100% — 강등이 브라우저 프로세스에 묶여 있다. 빈 지도면 컨텍스트가 아니라
                        # 프로세스를 새로 띄운다 (아래 rebuild 실패 경로와 같은 코드).
                        if _soft_retry:
                            try: browser.close()
                            except Exception: pass
                            browser = None
                        try:
                            if browser is None:
                                raise RuntimeError("empty-map: browser relaunch")
                            context, page = _build_context(browser)
                        except Exception as e2:
                            if browser is None:
                                log.info(f"[W{worker_id}] 빈 지도 — 브라우저 프로세스 재시작")
                            else:
                                log.warning(f"[W{worker_id}] context rebuild 실패, browser 재시작: {e2}")
                            try: browser.close()
                            except Exception: pass
                            try:
                                browser = _launch(pw)
                                context, page = _build_context(browser)
                                log.info(f"[W{worker_id}] browser 재시작 성공")
                            except Exception as e3:
                                log.error(f"[W{worker_id}] browser 재시작 실패: {e3}")
                                result_queue.put(("error", str(e)))
                                break  # inner loop 탈출 → outer except가 없으면 pw 재시작
                        # 재시도 (큐에 되돌려 아무 워커나 집게)
                        if _soft_retry:
                            task_queue.put((idx, href, retries))   # 예산 안 깎음
                        elif retries + 1 < MAX_TASK_RETRIES:
                            task_queue.put((idx, href, retries + 1))
                            log.info(f"[W{worker_id}] #{idx} 재큐잉 (try {retries+2})")
                        elif "blocked exit IP" in str(e):
                            # 2026-08-31 아침 실측: 빈 지도로 반복 실패하는 href 는 집 IP
                            # 에서도 5/6 이 빈 지도 — 출구 문제가 아니라 사실상 죽은 URL 이다.
                            # 그런데 08-20 설계("차단은 예산을 안 깎는다") 때문에 이런 href 가
                            # 영원히 큐 앞에 남았다: 산 것은 완료돼 떠나고 죽은 것만 쌓이는
                            # 체(sieve). 재시도 소진 시 skip 으로 보내 예산(3세션)을 깎는다 —
                            # 진짜 일시 차단이었다면 다음 세션 두 번 안에 살아난다.
                            log.warning(f"[W{worker_id}] #{idx} 빈 지도 재시도 소진 → 예산 차감 skip")
                            result_queue.put(("skip", (href, "empty_map_exhausted")))
                        else:
                            log.warning(f"[W{worker_id}] #{idx} 재시도 소진 → 포기")
                            result_queue.put(("error", str(e)))

                try:
                    browser.close()
                except Exception:
                    pass
        except BaseException as e:
            # Playwright Node.js 서버 EPIPE 크래시 등 → 워커 자체 재시작
            # SystemExit/KeyboardInterrupt 포함하여 잡아야 함 (Node.js crash → sys.exit 경로)
            # 작업을 물고 있다가 크래시했을 수 있다 — busy 로 남으면 메인
            # 루프가 영원히 "진행 중"으로 보고 큐 고갈 판정을 못 한다.
            inflight.idle(worker_id)
            if isinstance(e, KeyboardInterrupt):
                break
            log.warning(f"[W{worker_id}] Playwright 충돌 ({e.__class__.__name__}: {e}) → 5초 후 재시작")
            try:
                _rotate_vpn_and_wait(_vpn_idx_for(proxy_port))
            except Exception:
                pass
            time.sleep(5)
    inflight.idle(worker_id)
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
                    status_hint = (row.get("status_hint") or "").lower()
                    if any(s in status_hint for s in CLOSED_STATUSES):
                        continue
                    # 버티컬 순도 사전필터 — 카드 정보만으로 확실히 무관한
                    # 업소(미용실 등)는 상세 방문 비용 자체를 아낌.
                    # 덴탈 allowlist 는 카드 정보가 부실할 수 있어 여기선
                    # 적용 안 함 (상세 페이지에서 최종 판정).
                    blob = f"{row.get('name','')} {row.get('primary_type','')}"
                    if OFF_VERTICAL_RE.search(blob) and not (
                            (VERTICAL == "hair" and HAIR_SIGNAL_RE.search(blob))
                            or (VERTICAL == "spa" and SPA_SIGNAL_RE.search(blob))):
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
    def _review_status(pid_fn: str) -> tuple[str, int]:
        """(status, 수집된 리뷰 행수) 반환."""
        p = reviews_dir / f"{pid_fn}_reviews.csv"
        if not p.exists():
            return "none", 0
        try:
            with open(p, encoding="utf-8-sig", errors="replace") as f:
                r = csv.DictReader(f)
                sources: set[str] = set()
                n_rows = 0
                for row in r:
                    n_rows += 1
                    sources.add((row.get("sort_source") or "").strip())
        except Exception:
            return "none", 0
        sources.discard("")
        if not sources:
            return "none", 0
        if "relevant" in sources and "newest" in sources:
            return "complete", n_rows
        return "partial", n_rows

    existing_ids: set[str] = set()
    retry_ids: set[str] = set()  # partial/failed
    retry_hrefs: dict[str, str] = {}  # pid -> maps_url, clinics.csv 기준 (재시도용)
    refresh_ids: set[str] = set()  # complete 이지만 오래돼서 새 리뷰 확인 필요
    refresh_hrefs: dict[str, str] = {}
    partial_cnt = failed_cnt = 0
    refresh_cutoff = time.time() - config.REVIEW_REFRESH_DAYS * 86400
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
                status, n_rows = _review_status(pid_fn)
                # partial 수렴: 리뷰 적은 곳은 newest 탭이 없어 sort_source 가
                # 하나만 나올 수 있음 → 영원히 partial 로 남아 재시작마다
                # 재수집하는 낭비 (Patama 루프). 수집 행수가 전체 리뷰수에
                # 근접하면 사실상 완료로 취급.
                # n_rows >= 100 절대상한: 총리뷰 수백 개짜리는 구글맵 스크롤
                # 한계상 0.8 비율을 영원히 못 채워 만성 partial 루프가 됨
                if status == "partial" and (total <= 10 or n_rows >= total * 0.8 or n_rows >= 100):
                    status = "complete"
                if status == "complete":
                    # 새 리뷰가 계속 쌓이는데 "complete"는 영구 제외라 한 번
                    # 다 긁고 나면 다시는 안 봤던 문제 (2026-07-29) — 리뷰
                    # 파일 mtime이 REVIEW_REFRESH_DAYS보다 오래되면 재수집
                    # 큐에 다시 넣는다. collect_reviews_for_restaurant()는
                    # 매번 relevant+newest 전체를 다시 긁어 덮어쓰므로 이
                    # 재수집 자체가 곧 "최신까지 반영"이다.
                    review_file = reviews_dir / f"{pid_fn}_reviews.csv"
                    try:
                        stale = review_file.stat().st_mtime < refresh_cutoff
                    except OSError:
                        stale = False
                    if stale and row.get("maps_url"):
                        refresh_ids.add(pid)
                        refresh_hrefs[pid] = row["maps_url"]
                    else:
                        existing_ids.add(pid)
                elif status == "partial":
                    retry_ids.add(pid)
                    partial_cnt += 1
                    if row.get("maps_url"):
                        retry_hrefs[pid] = row["maps_url"]
                elif total >= config.MIN_REVIEW_COUNT:
                    # none + 리뷰 많음 = 완전 실패
                    retry_ids.add(pid)
                    failed_cnt += 1
                    if row.get("maps_url"):
                        retry_hrefs[pid] = row["maps_url"]
                else:
                    existing_ids.add(pid)  # 리뷰 적어서 비어있는 건 정상
    # 재시도 예산 (세션 간 지속) — 재시작이 잦은 시기엔 같은 partial 을 수십 번
    # 재수집하는 낭비가 남 (2026-07-11: VPN 장애 + 킥 폭풍으로 하루 재시작 140회
    # × 동일 재시도 큐 = 완료 로그 ~900건이 실제 신규 18건). pid당 3세션까지만
    # 재시도, 이후엔 수집분으로 완료 취급. 리셋: retry_attempts.json 삭제.
    # 차단 서킷브레이커 상태 파일을 이 실행의 출력 디렉터리에 연결하고,
    # 이전 프로세스가 남긴 쿨다운이 있으면 이어받는다 (워치독이 10분마다
    # 재시작시켜도 요청을 다시 내보내지 않게 하는 것이 목적).
    global _BLOCK_STATE_FILE
    _BLOCK_STATE_FILE = out_dir / "block_state.json"
    _load_block_state()

    retry_budget_file = out_dir / "retry_attempts.json"
    try:
        retry_attempts: dict[str, int] = json.loads(retry_budget_file.read_text(encoding="utf-8"))
    except Exception:
        retry_attempts = {}
    _exhausted = {pid for pid in retry_ids if retry_attempts.get(pid, 0) >= 3}
    if _exhausted:
        log.info(f"재시도 예산(3회) 소진: {len(_exhausted)}개 — 수집분으로 완료 처리")
        retry_ids -= _exhausted
        existing_ids |= _exhausted
    # 2026-08-21: 예전엔 여기서 retry_ids 전원에게 무조건 +1 을 했다. 즉 예산이
    # "몇 번 시도했는가"가 아니라 "프로세스가 몇 번 떴는가"로 깎였다.
    # watchdog 은 progress 정체를 감지하면 이 서비스를 킥하는데, 안 좋은 구간엔
    # 그게 몇 분 간격으로 난다 — 실제로 2026-08-21 04:23 / 04:30 / 04:38 에 15분
    # 동안 3번 재시작하면서, 클리닉을 단 한 곳도 건드리지 않고 예산 3을 다 태워
    # 714건이 영구 제외됐다(전날 리셋한 것이 하룻밤 만에 재소진).
    # 위 주석이 막으려던 "재시작 140회 × 동일 재시도 큐"가 바로 이 경로다 —
    # 세는 단위가 세션이라 완화책이 오히려 증상을 만들고 있었다.
    # 이제는 결과가 실제로 돌아왔을 때만 센다(아래 _bump_retry 호출 2곳).
    def _persist_retry_budget() -> None:
        try:
            _tmp_budget = retry_budget_file.with_suffix(".json.tmp")
            _tmp_budget.write_text(json.dumps(retry_attempts), encoding="utf-8")
            os.replace(_tmp_budget, retry_budget_file)
        except Exception:
            pass

    # href → pid 역인덱스. skip 결과는 href 만 들고 오는데 예산은 pid 로 센다.
    _retry_pid_by_href = {href: pid for pid, href in retry_hrefs.items()}

    def _bump_retry(pid: str) -> None:
        retry_attempts[pid] = retry_attempts.get(pid, 0) + 1
        _persist_retry_budget()

    # 성공 시 카운트를 지우지는 않는다. 재시도 대상의 대다수(526/709)가
    # "partial" 즉 일부만 수집된 장소인데, 재수집해도 여전히 partial 일 수 있다.
    # 성공했다고 지우면 그런 장소는 영원히 재시도돼 예산이 무의미해진다 —
    # 예산의 목적은 "3번 시도해도 안 채워지면 수집분으로 확정"이므로,
    # 결과가 무엇이든 시도가 끝나면 1을 센다.

    log.info(f"기존 완료: {len(existing_ids)} | 부분수집 재시도: {partial_cnt} | 완전실패 재시도: {failed_cnt} | 예산소진 제외: {len(_exhausted)} | 신규 리뷰 재스캔({config.REVIEW_REFRESH_DAYS}일 경과): {len(refresh_ids)}")

    # 이전 세션에서 스킵된 href 로드 (재시작 시 큐 롤백 방지)
    skipped_file = out_dir / "skipped_hrefs.txt"
    skipped_hrefs: set[str] = set()
    skipped_reasons: dict[str, str] = {}
    if skipped_file.exists():
        try:
            # 신규 포맷: "href\treason". 구 포맷(href만)도 그대로 지원.
            for _line in skipped_file.read_text(encoding="utf-8").splitlines():
                if not _line.strip():
                    continue
                _parts = _line.rstrip("\n").split("\t", 1)
                skipped_hrefs.add(_parts[0])
                skipped_reasons[_parts[0]] = _parts[1] if len(_parts) > 1 else ""
        except Exception:
            pass

    # 필터링된 후보만 큐에 넣기
    filtered_hrefs = []
    seen_filtered_pids: set[str] = set()
    for href in unique_hrefs:
        pid = extract_place_id_from_url(href)
        if pid not in existing_ids and href not in skipped_hrefs:
            filtered_hrefs.append(href)
            seen_filtered_pids.add(pid)

    # partial/완전실패 재시도 대상 — discovered_places.csv 에 더 이상 없어도
    # clinics.csv 에 기록된 maps_url 로 재시도 큐에 편입 (예전엔 retry_ids 만
    # 계산하고 실제로 큐에 안 넣는 버그가 있었음)
    #
    # 2026-09-24: skipped_hrefs 전체를 차단으로 쓰던 걸 closed 만으로 좁힌다.
    # 아래 재스캔 경로가 09-01 에 이미 통과한 것과 같은 판단인데, 그때 재시도
    # 경로는 안 고쳐서 여기만 남아 있었다.
    #
    # 실측(방콕 스파, 빈칸 525곳): 506곳이 skipped 에 막혀 있었고 사유는
    #   low_reviews:0            470
    #   category:off_vertical     34   (그 중 27곳이 "Massage spa" — 스파
    #                                   스크래퍼가 마사지 스파를 제외했다)
    #   closed                     2
    # low_reviews:0 은 "그 순간 페이지에 리뷰가 0개로 보였다"는 일시적 관측인데,
    # **같은 장소가 clinics.csv 에는 전부 total_reviews >= 5 로 기록돼 있다.**
    # 우리 데이터 둘이 모순이고 틀린 쪽은 한 번 본 화면이다. off_vertical 도
    # 오분류이며, 통과시켜도 수집 후 필터에서 다시 걸리므로 안전하다.
    # 폐업(closed)만 영구 사유로 남긴다.
    #
    # 범위를 여기로 좁히는 게 핵심 — skipped_hrefs 의 의미를 전역으로 바꾸면
    # 다른 도시·버티컬의 발견 단계까지 영향이 간다.
    _PERMANENT_SKIP = ("closed",)

    def _retry_blocked(href: str) -> bool:
        if href not in skipped_hrefs:
            return False
        return skipped_reasons.get(href, "").startswith(_PERMANENT_SKIP)

    retry_added = 0
    retry_unblocked = 0
    for pid in retry_ids:
        href = retry_hrefs.get(pid)
        if href and pid not in seen_filtered_pids and not _retry_blocked(href):
            if href in skipped_hrefs:
                retry_unblocked += 1
            filtered_hrefs.append(href)
            seen_filtered_pids.add(pid)
            retry_added += 1

    # 신규 리뷰 재스캔 편입.
    #
    # 2026-09-01: 여기 있던 "skipped_hrefs 와 실질적으로 겹치지 않지만 방어적으로
    # 동일 체크" 라는 전제가 틀렸다. 실측으로 재스캔 대상 1,481곳 중 1,340곳(90%)이
    # skipped_hrefs 에 막혀 있었다. 그 결과 큐에는 죽은 찌꺼기만 남고 살아있는
    # 작업은 밖에 갇혀서, 성공률이 1~9% 로 떨어졌다(09-01 오후).
    #
    # 막힌 1,340곳의 사유: low_reviews 745, 사유없음(구 포맷) 506,
    #                      category 79, closed 11.
    # low_reviews 는 "그 순간 페이지에 리뷰가 안 보였다"는 일시적 관측인데 이
    # 장소들은 complete 리뷰 파일을 이미 갖고 있다 — 수집 가능하다는 증거다.
    # 사유없음은 사유 포맷 도입 이전의 레거시다. 둘 다 재스캔을 막을 근거가
    # 못 된다. 실제로 영구인 것은 폐업(closed)과 타버티컬(category) 뿐이다.
    _PERMANENT_SKIP = ("closed", "category")

    def _permanently_skipped(href: str) -> bool:
        if href not in skipped_hrefs:
            return False
        return skipped_reasons.get(href, "").split(":")[0] in _PERMANENT_SKIP

    refresh_added = 0
    for pid in refresh_ids:
        href = refresh_hrefs.get(pid)
        if href and pid not in seen_filtered_pids and not _permanently_skipped(href):
            filtered_hrefs.append(href)
            seen_filtered_pids.add(pid)
            refresh_added += 1

    if config.GMAPS_PROFILE:
        # 프로필 폴더는 한 프로세스만 열 수 있고, 한 계정을 여러 탭·출구로 동시에
        # 돌리면 계정 보안 검사에 걸린다.
        if config.N_WORKERS != 1:
            log.info(f"로그인 모드 — 워커 {config.N_WORKERS} → 1")
        config.N_WORKERS = 1
        if not _acquire_profile_lock():
            # 다른 인스턴스가 이 프로필로 돌고 있다. 같이 돌면 _kill_stale_profile_chrome
            # 이 서로의 크롬을 죽여 큐 전체를 실패로 태운다 (10-21 23:32 사고).
            log.error("로그인 프로필을 다른 스크래퍼가 쓰는 중 — 이 인스턴스는 종료")
            sys.exit(3)
        log.info(f"로그인 모드: 프로필 {config.GMAPS_PROFILE} (프록시·VPN 회전 없음)")
    target_n = config.MAX_RESTAURANTS  # None이면 무제한
    log.info(f"전체 후보: {len(unique_hrefs)} | 신규 처리 대상: {len(filtered_hrefs)} (재시도 편입 {retry_added}개[skipped 해제 {retry_unblocked}개], 리뷰 재스캔 편입 {refresh_added}개)")
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

    # 2026-08-31: 셔플. 완료된 href 는 큐를 떠나고 죽은 href 는 남아, 결정적
    # 순서로는 매 재시작마다 같은 죽은 앞부분(idx 1~40)만 갈았다 — 08-31 새벽
    # 실측: 실패 idx 중앙값 76, 완료 idx 는 42 이후에만. 유일하게 재시작 없이
    # 1시간 45분 달린 07:14~08:59 구간만 앞부분을 통과해 57% 를 냈다.
    import random as _random
    _random.shuffle(filtered_hrefs)
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
                    if href in skipped_hrefs:
                        enqueued_hrefs.add(href)  # 스킵 목록에 있으면 큐에 안 넣음
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

    inflight = InFlight()
    threads: list[threading.Thread] = []
    for w in range(config.N_WORKERS):
        port = config.PROXY_PORT_BASE + w
        t = threading.Thread(target=worker,
                             args=(w, task_q, result_q, port, inflight),
                             daemon=True)
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
    idle_since = 0.0  # 큐가 완전히 마른 시각 (0 = 마르지 않음)
    while not should_stop():
        try:
            status, payload = result_q.get(timeout=3)
        except Empty:
            # 큐가 비면 producer가 새 작업 가져올 때까지 대기.
            # 단 "비었다"는 대기 중인 작업 0건 + 처리 중인 작업 0건 둘 다여야
            # 한다 — 워커가 한 건 물고 있는 동안에도 task_q 는 비어 있다.
            drained = task_q.empty() and inflight.count == 0
            if not drained:
                idle_since = 0.0
                continue
            now = time.time()
            if idle_since == 0.0:
                idle_since = now
            elif now - idle_since >= IDLE_EXIT_SEC:
                # 할 일이 없다. 여기서 빠져나가야 아래 종료 처리가
                # REVIEW_DONE_MARKER 를 찍고, watchdog 이 이걸 보고 "자연 종료"
                # 로 판정해 .disabled 를 걸어준다. 안 그러면 watchdog 이
                # progress 정체로 오판해 무한 재시작한다 (IDLE_EXIT_SEC 주석 참고).
                log.info(f"큐 고갈 {int(now - idle_since)}초 — 처리할 신규 항목 없음")
                break
            if now - last_idle_log > 60:
                remain = int(IDLE_EXIT_SEC - (now - idle_since))
                log.info(f"  대기 중… (enqueued {len(enqueued_hrefs)}, "
                         f"success {success}, {remain}초 후 종료)")
                last_idle_log = now
            continue
        idle_since = 0.0  # 결과가 들어왔으면 마른 상태 아님

        if status == "skip":
            skip_count += 1
            if payload:  # (href, reason)
                skip_href, skip_reason = payload
                skipped_hrefs.add(skip_href)  # 세션 내 재큐잉 방지 (메모리)
                # 실제로 한 번 시도해서 못 건진 경우 — 여기서만 예산을 깎는다.
                # (2026-08-31: 빈 지도 재시도 소진분도 empty_map_exhausted 로 여기 온다.)
                _skip_pid = _retry_pid_by_href.get(skip_href)
                if _skip_pid:
                    _bump_retry(_skip_pid)
                # 영구 skip은 콘텐츠성 사유만. goto_failed/no_name 같은
                # 인프라성 실패를 파일에 쓰면 VPN 장애 기간의 실패가
                # 영구화되어 큐가 마름 (2026-07-08~10: 재시도 대상 623개
                # 전원이 skip 목록에 갇혀 3일 무수확).
                permanent = skip_reason.startswith(
                    ("low_reviews", "closed", "category", "geo"))
                if permanent:
                    try:
                        with open(skipped_file, "a", encoding="utf-8") as _sf:
                            _sf.write(f"{skip_href}\t{skip_reason}\n")
                    except Exception:
                        pass
            continue
        if status != "ok" or not payload:
            continue
        rest, feats, hours, reviews, metas = payload
        # 재시도 대상이 한 번 처리됐다 — 결과가 좋든 나쁘든 시도 1회로 센다.
        if rest.place_id in retry_ids:
            _bump_retry(rest.place_id)
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
        # 리뷰 0건이면 파일 생성 안 함 (스크래핑 실패 구분 용이).
        #
        # 단, **이미 있는 파일은 절대 지우지 않는다** (2026-09-23).
        # 원래는 0건일 때 unlink(missing_ok=True) 를 했는데, 이건 "파일을 안
        # 만든다"가 아니라 "예전에 성공한 수집을 파괴한다"로 동작했다.
        # 방콕 갭필 실측: 90초마다 3개씩 사라지고 새로 생기는 건 0개,
        # 35분 동안 4,050 → 4,015 로 줄었다. 빈칸이 460 → 553 으로 늘어난 것도
        # 새 곳을 못 채워서가 아니라 채워둔 곳이 지워져서였다.
        #
        # 0건은 대개 진실이 아니다 — clinics.csv 의 total_reviews 가 5 이상인
        # 곳만 큐에 들어오므로, 0건으로 돌아왔다면 구글이 스로틀링으로 빈
        # 지도를 준 것이다(메모: empty-map-is-throttling). 즉 VPN 이 나쁠수록
        # 더 많이 지운다 — 가장 데이터를 잃으면 안 될 때 가장 많이 잃는다.
        if reviews:
            save_reviews_csv(reviews, rp)
        if metas:
            save_metas_csv(metas, mp)
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
