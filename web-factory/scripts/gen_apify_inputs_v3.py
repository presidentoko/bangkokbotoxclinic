"""
Apify 입력 JSON 생성기 — 3차 배치 ($5 x 20 계정).

── 왜 신규 공급사 수집이 아닌가 ───────────────────────────────────────────
2026-08-06 Search Console: 색인 1,647 / 미색인 8,216. 이미 등재된 페이지의
83%를 구글이 색인하지 않기로 한 상태에서 공급사를 더 넣으면 크롤 예산만
더 잘게 쪼개진다. 미색인의 원인은 개수가 아니라 내용 — 대부분의 supplier
페이지에 구글맵에 없는 정보가 없다.

현재 데이터 공백 (8,379개 기준):
  이메일          0      ← B2B 디렉토리의 핵심 필드가 통째로 비어 있음
  회사 소개문      0
  리뷰 본문     2,491    (평점은 5,584개가 보유 → 3,596개가 수집 대상)
  DBD 검증       803     ← 무료. scripts/dbd_rematch_overnight.py 로 별도 진행

그래서 3차 배치는 '넓이'가 아니라 '깊이'에 쓴다.

── 계정 배분 ─────────────────────────────────────────────────────────────
  01~03  이메일/연락처 추출   actor: vdrmota/contact-info-scraper
  04~17  리뷰 본문 수집        actor: compass/crawler-google-places
  18~20  얇은 카테고리 보강    actor: compass/crawler-google-places

리뷰 대상은 total_reviews 내림차순으로 정렬해서 배분한다 — 크레딧이 중간에
떨어져도 리뷰가 많은(=콘텐츠 가치가 큰) 업체부터 확보된다. 병합은
place_id 기준 idempotent 라서 중단된 데이터셋을 그대로 export 해도 안전하다.

실행: python scripts/gen_apify_inputs_v3.py
출력: scripts/apify_inputs_v3/ 에 JSON 20개 + README.md
"""

import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "scripts" / "apify_inputs_v3"
MASTER_DB = ROOT / "data" / "master_db.json"

EMAIL_ACCOUNTS = 3
REVIEW_ACCOUNTS = 14
CATEGORY_ACCOUNTS = 3

# 계정당 리뷰 상한. compass actor 는 place 건수보다 리뷰 건수가 비용을 좌우해서
# 넉넉히 잡으면 $5 를 넘긴다. 15건이면 AEO 인용/페이지 본문에 쓰기 충분하고
# 계정당 365 places x 15 reviews 면 $5 안쪽으로 들어온다.
MAX_REVIEWS = 15

# 소셜/마켓플레이스 링크는 회사 이메일이 안 나오므로 제외.
SOCIAL_HOSTS = (
    "facebook.", "instagram.", "line.me", "shopee.", "lazada.",
    "linktr.ee", "tiktok.", "youtube.", "twitter.", "x.com",
)


def host_of(url: str) -> str:
    m = re.match(r"https?://([^/]+)", url or "")
    return m.group(1).lower() if m else ""


def clean_url(url: str) -> str:
    """쿼리스트링/프래그먼트 제거 — master_db 의 website 값 상당수가 GMB 링크라
    ?utm_source=google-gmb 같은 파라미터를 달고 있다. 그대로 두면 크롤러가
    파라미터 변형을 서로 다른 페이지로 세서 계정당 3요청 예산을 낭비한다."""
    return re.split(r"[?#]", url, maxsplit=1)[0]


def chunk(items: list, n: int) -> list[list]:
    """items 를 n 개 묶음으로 최대한 고르게 나눈다."""
    if n <= 0:
        return []
    size, extra = divmod(len(items), n)
    out, i = [], 0
    for k in range(n):
        take = size + (1 if k < extra else 0)
        out.append(items[i:i + take])
        i += take
    return out


# ── Part C: 얇은 카테고리 보강 (계정 18~20) ────────────────────────────────
# 1·2차에서 영어 검색어로는 B2B 제조사가 Google Maps 에 잘 안 걸린다는 걸
# 확인했으므로 태국어 업종 용어 + 산업단지 좌표로만 검색한다.
CATEGORY_TARGETS = [
    (
        "chemical_electronics_deep",
        ["โรงงานเคมีภัณฑ์", "โรงงานอิเล็กทรอนิกส์", "ผู้ผลิตแผงวงจร", "โรงงานผลิตชิ้นส่วนอิเล็กทรอนิกส์"],
        [
            (12.685, 101.152, 13, "Map Ta Phut Industrial Estate"),
            (13.510, 101.220, 13, "WHA Eastern Seaboard I & II"),
            (14.070, 100.620, 13, "Nava Nakorn / Pathum Thani"),
            (13.550, 100.672, 13, "Bangpoo Industrial Estate"),
        ],
    ),
    (
        "machining_metal_deep",
        ["โรงกลึง", "รับกลึงโลหะ", "โรงงานแปรรูปโลหะ", "ผู้ผลิตแม่พิมพ์", "โรงงานปั๊มโลหะ"],
        [
            (13.600, 100.750, 12, "Samut Prakan metalworking belt"),
            (13.365, 100.985, 12, "Chachoengsao / Bang Pakong"),
            (13.080, 101.150, 12, "Amata City Rayong"),
            (13.780, 100.480, 12, "Bangkok western industrial"),
        ],
    ),
    (
        "rubber_textile_deep",
        ["โรงงานยางพารา", "โรงงานถุงมือยาง", "โรงงานทอผ้า", "โรงงานสิ่งทอ", "ผู้ผลิตเสื้อผ้าสำเร็จรูป"],
        [
            (7.009, 100.473, 12, "Hat Yai rubber belt"),
            (9.140, 99.330, 12, "Surat Thani rubber processing"),
            (18.580, 98.980, 12, "Lamphun / Chiang Mai textile"),
            (13.660, 100.280, 12, "Samut Sakhon textile"),
        ],
    ),
]


def build_email_input(urls: list[str]) -> dict:
    return {
        "startUrls": [{"url": u} for u in urls],
        # 홈에 이메일이 없으면 /contact, /about 한 단계까지만 따라간다.
        # 더 깊이 들어가면 도메인당 비용이 급격히 늘고 회수율은 거의 안 오른다.
        "maxDepth": 1,
        "maxRequestsPerStartUrl": 3,
        "sameDomain": True,
        "considerChildFrames": False,
    }


def build_review_input(place_ids: list[str]) -> dict:
    return {
        # place_id 직접 지정 — 이름/좌표 검색과 달리 오매칭이 없다.
        "startUrls": [
            {"url": f"https://www.google.com/maps/place/?q=place_id:{pid}"}
            for pid in place_ids
        ],
        "maxReviews": MAX_REVIEWS,
        "reviewsSort": "newest",
        "language": "en",
        "scrapeResponseFromOwnerText": True,
        # 리뷰 작성자 개인정보는 받지 않는다 — 쓰지 않는 데이터이고 비용만 는다.
        "scrapeReviewerName": False,
        "scrapeReviewerId": False,
        "scrapeReviewId": False,
        "scrapeReviewUrl": False,
    }


def build_category_input(terms: list[str], spots: list[tuple]) -> dict:
    start_urls = []
    for term in terms:
        for lat, lng, zoom, _label in spots:
            start_urls.append({
                "url": f"https://www.google.com/maps/search/{quote(term)}/@{lat},{lng},{zoom}z"
            })
    return {
        "startUrls": start_urls,
        "maxCrawledPlaces": 2000,
        "maxReviews": 10,
        "language": "en",
        "countryCode": "th",
    }


def main() -> None:
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    suppliers = db["suppliers"]

    # ── 이메일 대상: 자사 도메인 보유, 호스트 기준 중복 제거 ──
    seen_hosts: set[str] = set()
    email_urls: list[str] = []
    for s in suppliers:
        w = s.get("website")
        if not w:
            continue
        h = host_of(w)
        if not h or h in seen_hosts or any(k in h for k in SOCIAL_HOSTS):
            continue
        seen_hosts.add(h)
        email_urls.append(clean_url(w))

    # ── 리뷰 대상: 구글 리뷰는 있는데 본문이 하나도 저장 안 된 업체 ──
    # scraped_review_count 로 거르면 안 된다. 그 필드가 >0 인데 본문은 하나도
    # 없는 업체가 1,508곳 있다 — 과거 스크랩이 카운트만 남기고 텍스트를
    # 저장하지 못한 것으로, 그 업체들도 다시 긁어야 하는 대상이다.
    def has_review_text(s: dict) -> bool:
        return bool(
            s.get("external_reviews")
            or s.get("sample_reviews_en")
            or s.get("sample_reviews_th")
            or s.get("sample_reviews_ko")
        )

    review_targets = [
        s for s in suppliers
        if (s.get("total_reviews") or 0) > 0 and not has_review_text(s)
    ]
    review_targets.sort(key=lambda s: -(s.get("total_reviews") or 0))
    review_ids = [s["place_id"] for s in review_targets if s.get("place_id")]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: list[dict] = []
    n = 0

    for part in chunk(email_urls, EMAIL_ACCOUNTS):
        n += 1
        name = f"acct_{n:02d}_email"
        (OUT_DIR / f"{name}.json").write_text(
            json.dumps(build_email_input(part), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        manifest.append({
            "file": f"{name}.json",
            "actor": "vdrmota/contact-info-scraper",
            "what": f"웹사이트 {len(part)}곳에서 이메일·전화·SNS 추출",
        })

    for part in chunk(review_ids, REVIEW_ACCOUNTS):
        n += 1
        name = f"acct_{n:02d}_reviews"
        (OUT_DIR / f"{name}.json").write_text(
            json.dumps(build_review_input(part), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        manifest.append({
            "file": f"{name}.json",
            "actor": "compass/crawler-google-places",
            "what": f"업체 {len(part)}곳 리뷰 본문 최대 {MAX_REVIEWS}건씩",
        })

    for slug, terms, spots in CATEGORY_TARGETS[:CATEGORY_ACCOUNTS]:
        n += 1
        name = f"acct_{n:02d}_{slug}"
        (OUT_DIR / f"{name}.json").write_text(
            json.dumps(build_category_input(terms, spots), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        manifest.append({
            "file": f"{name}.json",
            "actor": "compass/crawler-google-places",
            "what": f"태국어 {len(terms)}개 용어 x 산단 {len(spots)}곳 신규 수집",
        })

    rows = "\n".join(
        f"| {i + 1:02d} | `{m['file']}` | `{m['actor']}` | {m['what']} |"
        for i, m in enumerate(manifest)
    )
    (OUT_DIR / "README.md").write_text(
        f"""# Apify 3차 배치 — $5 x 20 계정

3차는 신규 공급사 수집이 **아니라** 기존 {len(suppliers):,}곳을 두껍게 만드는 데 쓴다.
이유와 근거는 `scripts/gen_apify_inputs_v3.py` 상단 주석 참고.

액터가 두 종류다. 파일마다 붙여넣을 액터가 다르니 표를 보고 맞춰서 실행할 것.

| # | 파일 | 액터 | 내용 |
|---|------|------|------|
{rows}

## 실행 순서

1. apify.com 에서 해당 계정 로그인
2. 표의 **액터** 검색 → Input 탭 → JSON editor
3. 해당 파일 내용 전체 붙여넣기 → Run
4. 완료 후 Dataset → Export as JSON → 다운로드
5. 받은 파일을 `data/apify_raw/<날짜>/` 에 저장 (폴더 없으면 생성)
6. 전부 모이면 액터별로 **다른 스크립트**를 돌린다:

```bash
# 04~20번 (compass/crawler-google-places) — place_id 기준 병합
python scripts/apify_to_master_db.py

# 01~03번 (contact-info-scraper) — website 호스트 기준 병합
python scripts/merge_contact_emails.py --dry-run data/apify_raw/<날짜>/   # 먼저 확인
python scripts/merge_contact_emails.py data/apify_raw/<날짜>/
```

`apify_to_master_db.py` 는 place_id 로 매칭하는데 contact scraper 출력에는
place_id 가 없어서 그 경로로는 이메일이 들어오지 않는다. 그래서 별도 스크립트가 있다.
두 스크립트 모두 같은 폴더를 넘겨도 안전하다 — 각자 자기 형식이 아닌 파일은 건너뛴다.

## 크레딧이 중간에 떨어지면

그 시점까지 수집된 Dataset 을 그대로 Export 하면 된다.
병합은 place_id 기준이라 중복 실행해도 안전하고, 리뷰 대상은
리뷰 많은 업체부터 정렬돼 있어서 앞부분일수록 가치가 크다.

## 병합 후 반드시 할 것

`apify_to_master_db.py` 는 파일만 갱신한다. **git commit 까지 해야 배포에 반영된다.**
7월 배치가 이 단계를 빠뜨려서 몇 주 동안 묻혀 있었다.
""",
        encoding="utf-8",
    )

    print(f"gen_apify_inputs_v3: {n}개 계정 설정 생성 → {OUT_DIR}")
    print(f"  이메일 대상 도메인 : {len(email_urls):,}")
    print(f"  리뷰 대상 업체     : {len(review_ids):,} (리뷰 많은 순)")
    print(f"  신규 카테고리 계정 : {CATEGORY_ACCOUNTS}")


if __name__ == "__main__":
    main()
