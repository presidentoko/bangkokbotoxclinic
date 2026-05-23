"""Pantip 스크래퍼 설정."""
import os
from pathlib import Path

ROOT = Path(__file__).parent
OUTPUT_DIR = ROOT / "output"
THREADS_DIR = OUTPUT_DIR / "threads"      # 토픽 ID 별 canonical 저장 (dedup)
CLINICS_DIR = OUTPUT_DIR / "clinics"      # 클리닉 ID 별 mention index
STATE_DIR = ROOT / "state"

# master_db 경로 (4998개 clinic record)
MASTER_DB = ROOT.parent / "web" / "data" / "master_db.json"

# 시드 필터 1: 이 카테고리 중 하나라도 매칭되는 clinic 만 대상
TARGET_CATEGORIES = {"dental", "facial", "laser", "botox", "filler",
                     "hifu", "hair_transplant", "eye"}

# 카테고리 → 자매 사이트 bucket 매핑.
# 한 클리닉이 여러 bucket 에 속할 수 있음 (e.g. dental + cosmetic).
# 영업 시 각 자매 사이트 별로 해당 bucket clinic 만 노출.
BUCKETS = {
    "hair":     {"hair_transplant"},
    "dental":   {"dental"},
    "cosmetic": {"facial", "laser", "botox", "filler", "hifu", "eye"},
}
# 처리 순서: round-robin 으로 골고루 채움. hair 가 121 개로 가장 적어서
# 먼저 소진되더라도 cosmetic/dental 은 계속 진행됨.
BUCKET_ORDER = ["hair", "cosmetic", "dental"]

# 시드 필터 2: primary_type 도 의료/뷰티/덴탈 계열이어야 함
# (master_db 에 쇼핑몰/호텔이 category=dental 로 잡혀서 섞이는 거 방지)
TARGET_PRIMARY_TYPES = {
    "Dental clinic", "Dentist", "Medical clinic", "Skin care clinic",
    "Plastic surgery clinic", "Beauty salon", "Hair transplantation clinic",
    "Dermatologist", "Cosmetic dentist", "Doctor", "Clinic", "Medical office",
    "Specialized clinic", "Wellness center", "Medical Center", "Cosmetics industry",
    "Beauty product supplier", "Hair removal service", "Eye care center",
    "Ophthalmologist", "Orthodontist", "Oral surgeon", "Endodontist",
    "Periodontist", "Prosthodontist", "Aesthetics", "Physical therapy clinic",
    "Acupuncture clinic", "Hospital",
}

# 요청 간 매너 딜레이 (초) — 20-clinic 테스트에서 100% 200 OK 받아서 safe 범위로 조정
DELAY_SEARCH_SEC = float(os.getenv("PANTIP_DELAY_SEARCH", "1.5"))
DELAY_THREAD_SEC = float(os.getenv("PANTIP_DELAY_THREAD", "1.5"))
DELAY_COMMENTS_SEC = float(os.getenv("PANTIP_DELAY_COMMENTS", "0.8"))

# 검색당 최대 처리 토픽 수 — 메가스레드 폭주 방지
MAX_THREADS_PER_SEARCH = int(os.getenv("PANTIP_MAX_THREADS", "10"))

# 댓글 페이지네이션 한도
MAX_COMMENT_PAGES = int(os.getenv("PANTIP_MAX_COMMENT_PAGES", "20"))   # 100개씩 → 2000 댓글까지

# 검색 페이지네이션 한도
MAX_SEARCH_PAGES = int(os.getenv("PANTIP_MAX_SEARCH_PAGES", "3"))      # 10개씩 → 30 토픽까지

# 재시도
MAX_RETRIES = 3
RETRY_BACKOFF_SEC = [5, 15, 45]   # 1차, 2차, 3차

# 백오프: 연속 실패 시 일시 정지
CIRCUIT_BREAKER_FAILS = 8         # 연속 8회 실패 = 일시 정지
CIRCUIT_BREAKER_PAUSE_SEC = 600   # 10분

# 매너있게 cookie/세션 유지
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

# 매칭 정확도: 클리닉명이 본문에 실제로 등장하는지
# - exact: 정확히 일치 (그대로 substring)
# - normalized: 공백/특수문자 제거 후 비교
MIN_NAME_LENGTH = 4         # 너무 짧은 이름은 fp 폭증 → 스킵
GENERIC_BLOCKLIST = {       # 검색해도 의미없는 이름 — 시드에서 제외
    "Clinic", "Hospital", "Dental Clinic", "Beauty Clinic", "Medical Center",
}
