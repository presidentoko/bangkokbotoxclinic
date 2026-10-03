"""Apify 입력 생성기 — 5차 배치 ($5 x 5 계정 = $25).

4차($100, 계정 20개) 다음에 남은 5계정을 쓴다. 4차 결과를 아직 못 봤으므로
**4차와 겹치지 않는 공백만** 고른다.

── 왜 이 두 가지인가 (2026-10-03 실측) ──────────────────────────────────
  1. 이메일 추출 (계정 21~23, $15)  actor: vdrmota/contact-info-scraper
     자사 도메인이 있는데 이메일이 없는 공급사 1,898곳 (고유 호스트 1,665개).
     현재 이메일 보유는 1,191곳 — 전체의 13%다.

     커미션 모델이 이걸 필요로 한다. 파트너 공장을 모으려면 먼저 연락할 방법이
     있어야 하는데, 전화는 태국어 통화라 장벽이 있고 이메일은 영문 제안서를
     보낼 수 있는 유일한 채널이다. 2026-10-02 에 욕실가구 공장이 먼저 연락해
     온 것처럼 기다리는 것 외에 할 수 있는 게 없는 상태다.

     바이어 쪽에서도 FAQ 에 "직접 연락할 수 있다" 고 써놨는데 실제로는 전화번호
     뿐인 곳이 많다.

  2. 얇은 OEM 버티컬 보강 (계정 24~25, $10)  actor: compass/crawler-google-places
     이미 만들어 검색에 노출될 준비가 된 페이지인데 목록이 빈약하다:
       /oem/medical-devices  16곳
       /oem/cosmetics        33곳
       /oem/furniture        38곳
     태국이 실제로 강한 분야인데 우리 데이터가 얕다. 신규 페이지를 더 만드는
     것보다 노출 준비가 끝난 페이지를 두껍게 하는 쪽이 효율이 낫다.

── 일부러 뺀 것 ─────────────────────────────────────────────────────────
  리뷰 5~9건 구간 929곳: 4차에서 1,115곳을 돌렸고 그 결과를 아직 못 봤다.
  리뷰가 순위를 움직이는지 확인한 뒤에 쓴다.

  좌표 미확인 단지 21곳: 이름만으로 검색하면 오매칭이 많다. 상세 페이지에서
  좌표를 다시 받는 게 먼저이고 그건 돈이 아니라 코드 작업이다.

실행: python scripts/gen_apify_inputs_v5.py
출력: scripts/apify_inputs_v5/ 에 JSON 5개 + README.md
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "scripts" / "apify_inputs_v5"
MASTER_DB = ROOT / "data" / "master_db.json"

EMAIL_ACCOUNTS = 3
VERTICAL_ACCOUNTS = 2

# 계정당 도메인 상한. 3차에서 871 도메인 x 3요청이 $5 안쪽이었다.
MAX_DOMAINS_PER_ACCOUNT = 600
MAX_PLACES_PER_ACCOUNT = 700
MAX_REVIEWS = 2

# 회사 이메일이 안 나오는 호스트 — 긁어도 플랫폼 고객센터 주소만 나온다.
SOCIAL_HOSTS = (
    "facebook.", "instagram.", "line.me", "lin.ee", "shopee.", "lazada.",
    "linktr.ee", "tiktok.", "youtube.", "twitter.", "x.com", "wa.me",
    "blogspot.", "wixsite.", "business.site", "google.com",
)

# 얇은 버티컬을 채울 태국어 검색어 + 지역. 영어 검색어로는 태국 B2B 제조사가
# Google Maps 에 잘 안 걸린다 (1·2차에서 확인).
VERTICAL_TARGETS: list[tuple[str, list[str], list[tuple[float, float]]]] = [
    (
        "cosmetics_medical",
        [
            "โรงงานผลิตเครื่องสำอาง",      # 화장품 제조
            "รับผลิตเครื่องสำอาง OEM",      # 화장품 OEM
            "โรงงานผลิตครีม",               # 크림 제조
            "โรงงานผลิตอาหารเสริม",         # 건강보조식품
            "โรงงานผลิตเครื่องมือแพทย์",    # 의료기기 제조
            "ผู้ผลิตถุงมือยางทางการแพทย์",  # 의료용 장갑
        ],
        [
            (13.736, 100.523),  # Bangkok
            (14.021, 100.525),  # Pathum Thani
            (13.599, 100.597),  # Samut Prakan
            (13.361, 100.985),  # Chonburi
            (13.820, 100.062),  # Nakhon Pathom
            (18.788, 98.985),   # Chiang Mai
        ],
    ),
    (
        "furniture_wood",
        [
            "โรงงานผลิตเฟอร์นิเจอร์",       # 가구 제조
            "รับผลิตเฟอร์นิเจอร์ OEM",      # 가구 OEM
            "โรงงานไม้",                     # 목재 공장
            "ผู้ผลิตเฟอร์นิเจอร์ไม้",        # 목재 가구
            "โรงงานผลิตตู้",                 # 수납장 제조
        ],
        [
            (13.599, 100.597),  # Samut Prakan
            (13.547, 100.274),  # Samut Sakhon
            (13.361, 100.985),  # Chonburi
            (18.574, 99.009),   # Lamphun
            (18.788, 98.985),   # Chiang Mai
            (14.979, 102.098),  # Nakhon Ratchasima
        ],
    ),
]


def host_of(url: str) -> str:
    m = re.match(r"https?://([^/]+)", url or "")
    return m.group(1).lower() if m else ""


def clean_url(url: str) -> str:
    """쿼리스트링·프래그먼트 제거. master_db 의 website 상당수가 GMB 링크라
    ?utm_source=google-gmb 가 붙어 있는데, 그대로 두면 크롤러가 파라미터 변형을
    서로 다른 페이지로 세서 도메인당 3요청 예산을 낭비한다."""
    return re.split(r"[?#]", url, maxsplit=1)[0]


def chunk(items: list, n: int) -> list[list]:
    if n <= 0:
        return []
    size, extra = divmod(len(items), n)
    out, i = [], 0
    for k in range(n):
        take = size + (1 if k < extra else 0)
        out.append(items[i:i + take])
        i += take
    return out


def build_email_input(urls: list[str]) -> dict:
    return {
        "startUrls": [{"url": u} for u in urls],
        # 홈에 이메일이 없으면 /contact, /about 한 단계까지만. 더 깊이 들어가면
        # 도메인당 비용이 급히 늘고 회수율은 거의 안 오른다 (3차에서 확인).
        "maxDepth": 1,
        "maxRequestsPerStartUrl": 3,
        "sameDomain": True,
        "considerChildFrames": False,
    }


def build_place_input(start_urls: list[str]) -> dict:
    return {
        "startUrls": [{"url": u} for u in start_urls],
        "maxCrawledPlaces": MAX_PLACES_PER_ACCOUNT,
        "maxReviews": MAX_REVIEWS,
        "language": "en",
        "countryCode": "th",
        "scrapeReviewerName": False,
        "scrapeReviewerId": False,
    }


def search_url(term: str, lat: float, lng: float, zoom: int = 11) -> str:
    return f"https://www.google.com/maps/search/{quote(term)}/@{lat},{lng},{zoom}z"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    suppliers = json.loads(MASTER_DB.read_text(encoding="utf-8"))["suppliers"]

    # ── 이메일 대상: 자사 도메인 있고 이메일 없음, 호스트 기준 중복 제거 ──
    seen: set[str] = set()
    email_urls: list[str] = []
    for s in suppliers:
        w = s.get("website")
        if not w or s.get("email"):
            continue
        h = host_of(w)
        if not h or h in seen or any(k in h for k in SOCIAL_HOSTS):
            continue
        seen.add(h)
        email_urls.append(clean_url(w))

    # verified·리뷰 많은 곳을 앞으로 — 크레딧이 중간에 떨어져도 값어치 큰 쪽부터
    # 확보된다. 파트너 영업 대상으로도 그쪽이 먼저다.
    by_host = {host_of(s.get("website") or ""): s for s in suppliers if s.get("website")}
    email_urls.sort(
        key=lambda u: -(
            (100 if by_host.get(host_of(u), {}).get("verified") else 0)
            + (by_host.get(host_of(u), {}).get("total_reviews") or 0)
        )
    )
    email_urls = email_urls[: MAX_DOMAINS_PER_ACCOUNT * EMAIL_ACCOUNTS]

    files: list[tuple[str, dict, str, str]] = []  # (name, payload, actor, desc)

    for i, part in enumerate(chunk(email_urls, EMAIL_ACCOUNTS), start=21):
        files.append((
            f"acct_{i:02d}_email.json",
            build_email_input(part),
            "vdrmota/contact-info-scraper",
            f"이메일·연락처 추출 — 도메인 {len(part)}개",
        ))

    for i, (label, terms, spots) in enumerate(VERTICAL_TARGETS, start=21 + EMAIL_ACCOUNTS):
        urls = [search_url(t, lat, lng) for t in terms for lat, lng in spots]
        files.append((
            f"acct_{i:02d}_{label}.json",
            build_place_input(urls),
            "compass/crawler-google-places",
            f"얇은 버티컬 보강: {label} — 검색 {len(urls)}건",
        ))

    for name, payload, _actor, _desc in files:
        (OUT_DIR / name).write_bytes(
            (json.dumps(payload, ensure_ascii=False, indent=1) + "\n").encode("utf-8")
        )

    readme = [
        "# Apify 5차 배치 — $5 x 5 계정 ($25)",
        "",
        "⚠️ **4차와 달리 액터가 두 종류다.** 파일마다 맞는 액터를 쓸 것.",
        "",
        "| # | 파일 | 액터 | 내용 |",
        "|---|------|------|------|",
    ]
    for name, _payload, actor, desc in files:
        readme.append(f"| {name[5:7]} | `{name}` | `{actor}` | {desc} |")
    readme += [
        "",
        "## 실행 방법",
        "",
        "1. 표의 액터를 Apify 콘솔에서 연다",
        "2. Input 탭 → 오른쪽 위에서 **JSON** 모드로 전환",
        "3. 파일 내용을 그대로 붙여넣고 Start",
        "4. 끝나면 Dataset → Export → **JSON**",
        "5. 받은 파일을 `data/apify_raw/2026-10-03/` 에 넣는다 (파일명 그대로 유지)",
        "6. 전부 끝나면 알려줄 것 — 병합·리빌드·배포는 내가 한다",
        "",
        "## 이번 배치가 노리는 것",
        "",
        f"- **이메일 (계정 21~23)**: 자사 도메인이 있는데 이메일이 없는 공급사가",
        f"  1,898곳이다. 현재 이메일 보유는 1,191곳 — 전체의 13%. 커미션 모델에서",
        "  파트너 공장을 모으려면 먼저 연락할 방법이 필요한데, 전화는 태국어 통화라",
        "  장벽이 있고 이메일이 영문 제안서를 보낼 수 있는 유일한 채널이다.",
        "  verified·리뷰 많은 순으로 정렬해 뒀다 — 크레딧이 떨어져도 값어치 큰",
        "  쪽부터 확보된다.",
        "- **버티컬 (계정 24~25)**: `/oem/medical-devices` 16곳, `/oem/cosmetics`",
        "  33곳, `/oem/furniture` 38곳. 이미 만들어 검색 노출 준비가 끝난 페이지인데",
        "  목록이 빈약하다. 신규 페이지를 더 만드는 것보다 이쪽이 효율이 낫다.",
        "",
        "## 일부러 뺀 것",
        "",
        "- 리뷰 5~9건 구간 929곳: 4차에서 1,115곳을 돌렸고 결과를 아직 못 봤다.",
        "  리뷰가 순위를 움직이는지 확인한 뒤에 쓴다.",
        "- 좌표 미확인 단지 21곳: 이름만 검색하면 오매칭이 많다. 좌표를 다시 받는",
        "  코드 작업이 먼저다.",
        "",
        "## 주의",
        "",
        "- `python scripts/rebuild_master_db.py` 는 **`--skip-apify` 없이** 돌릴 것.",
        "  2026-10-02 에 그 플래그로 master_db 가 8,977 → 2,963 으로 떨어졌다.",
        "- 이메일 병합은 `scripts/merge_contact_emails.py` 가 website 호스트로 매칭한다.",
        "  리빌드가 자동으로 호출하므로 따로 돌릴 필요는 없다.",
    ]
    (OUT_DIR / "README.md").write_bytes(("\n".join(readme) + "\n").encode("utf-8"))

    print(f"wrote {len(files)} input files + README to {OUT_DIR}")
    print(f"  이메일 대상 도메인: {len(email_urls)} (전체 공백 1,665 중 상위)")
    for name, payload, actor, desc in files:
        n = len(payload["startUrls"])
        print(f"  {name:34} {actor.split('/')[1]:28} {n:4}건")


if __name__ == "__main__":
    main()
