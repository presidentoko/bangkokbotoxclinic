"""Apify 입력 생성기 — 6차 배치 ($5 x 4 계정 = $20).

4차($100)·5차($25) 다음 남은 4계정. 앞 배치와 겹치지 않는 공백만 고른다.

── 왜 태국 국내 커버리지인가 ─────────────────────────────────────────────
클릭이 실제로 나오는 곳은 태국이다 (3개월 52클릭 중 30). 그런데 태국어 페이지가
있는 도 중에 공급사가 60곳도 안 되는 데가 6곳이다:

    map_ta_phut 22 · mukdahan 31 · khon_kaen 34 · si_racha 53 · sa_kaeo 54 · trat 57

khon_kaen 은 "คลังสินค้า ขอนแก่น"(창고 ขอนแก่น)로 54회 노출된 곳인데 창고가
5곳뿐이다. 태국어 도x업종 페이지는 공급사 5곳부터 생성되므로(lib/cityCategory.ts),
이 도들을 채우면 페이지가 바로 생긴다. 1~2곳 구간에 31개 조합이 더 있다.

계정 04 는 공급사가 1~4곳뿐인 도를 훑는다 — 남부 농업·고무 지대(trang, satun,
phatthalung)와 동북부(loei, maha_sarakham, nong_bua_lam_phu). 산업 밀도가 낮아
우선순위는 마지막이지만, 지금은 그 도 페이지에 보여줄 게 거의 없다.

── 일부러 안 쓴 근거 ─────────────────────────────────────────────────────
"산단은 많은데 공급사가 적은 도" 를 찾으려다 Chonburi 43곳 / Prachinburi 0곳
이라는 숫자를 봤는데, 슬러그 불일치였다 (공식 "Chonburi" vs 우리 canonical
"chon_buri", 실제로는 1,448곳 / 173곳). 불균형이 아니라 집계 버그였다.
그 축은 버렸다. 참고로 이 슬러그 변형들(pathumthanee, suphanburi, srisaket,
"city")은 lib/cityNorm.ts 에 별칭을 더해 정리할 거리이고 돈이 들지 않는다.

영어 도x업종 3~4곳 구간 100개도 뺐다. 문턱이 10이라 조합당 6~7곳이 더 필요한데,
태국어 쪽은 문턱이 5라서 같은 돈으로 페이지가 더 많이 생긴다.

액터: 전부 compass/crawler-google-places.
실행: python scripts/gen_apify_inputs_v6.py
출력: scripts/apify_inputs_v6/ 에 JSON 4개 + README.md
"""
from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "scripts" / "apify_inputs_v6"

ACTOR = "compass/crawler-google-places"
MAX_PLACES_PER_ACCOUNT = 700
MAX_REVIEWS = 2

# 태국어 페이지가 있는데 공급사가 얇은 도 (실측 2026-10-03).
THIN_TH_PROVINCES: list[tuple[str, float, float, str]] = [
    ("khon_kaen", 16.441, 102.836, "ขอนแก่น"),
    ("map_ta_phut", 12.685, 101.152, "มาบตาพุด"),
    ("mukdahan", 16.542, 104.721, "มุกดาหาร"),
    ("si_racha", 13.174, 100.931, "ศรีราชา"),
    ("sa_kaeo", 13.824, 102.065, "สระแก้ว"),
    ("trat", 12.243, 102.515, "ตราด"),
]

# 공급사가 1~4곳뿐인 도. 남부 고무·농업 + 동북부.
NEAR_EMPTY_PROVINCES: list[tuple[str, float, float, str]] = [
    ("trang", 7.559, 99.611, "ตรัง"),
    ("satun", 6.623, 100.067, "สตูล"),
    ("phatthalung", 7.617, 100.074, "พัทลุง"),
    ("loei", 17.486, 101.727, "เลย"),
    ("maha_sarakham", 16.185, 103.300, "มหาสารคาม"),
    ("nong_bua_lam_phu", 17.204, 102.440, "หนองบัวลำภู"),
    ("ang_thong", 14.589, 100.455, "อ่างทอง"),
]

# 태국어 페이지가 있는 7개 업종에 대응하는 검색어. 문턱이 5라서 업종별로 조금만
# 더 나와도 페이지가 생긴다.
CORE_TERMS: list[str] = [
    "โรงงาน",                  # 공장 (manufacturer)
    "คลังสินค้า",              # 창고 (warehouse)
    "บริษัทขนส่ง",             # 운송·물류 (logistics)
    "โรงงานผลิตอาหาร",         # 식품 제조 (food_mfg)
    "โรงงานบรรจุภัณฑ์",        # 포장 (packaging)
    "อะไหล่รถยนต์ โรงงาน",     # 자동차 부품 (auto_parts)
]

# 거의 빈 도에는 넓게 — 업종을 좁히면 결과가 0 이 된다.
BROAD_TERMS: list[str] = [
    "โรงงาน",
    "คลังสินค้า",
    "บริษัทขนส่ง",
    "โรงสีข้าว",
    "โรงงานยางพารา",
]


def search_url(term: str, lat: float, lng: float, zoom: int = 11) -> str:
    return f"https://www.google.com/maps/search/{quote(term)}/@{lat},{lng},{zoom}z"


def build_input(urls: list[str]) -> dict:
    return {
        "startUrls": [{"url": u} for u in urls],
        "maxCrawledPlaces": MAX_PLACES_PER_ACCOUNT,
        "maxReviews": MAX_REVIEWS,
        "language": "en",
        "countryCode": "th",
        "scrapeReviewerName": False,
        "scrapeReviewerId": False,
    }


def chunk(items: list, n: int) -> list[list]:
    size, extra = divmod(len(items), n)
    out, i = [], 0
    for k in range(n):
        take = size + (1 if k < extra else 0)
        out.append(items[i:i + take])
        i += take
    return out


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    files: list[tuple[str, dict, str]] = []

    # 계정 26~28: 얇은 태국어 도 6개 x 핵심 업종 6개 = 36 검색
    thin_urls = [
        search_url(f"{term} {th_name}", lat, lng)
        for _slug, lat, lng, th_name in THIN_TH_PROVINCES
        for term in CORE_TERMS
    ]
    for i, part in enumerate(chunk(thin_urls, 3), start=26):
        files.append((
            f"acct_{i:02d}_thin_th.json",
            build_input(part),
            f"얇은 태국어 도 보강 — 검색 {len(part)}건",
        ))

    # 계정 29: 거의 빈 도 7개 x 넓은 업종 5개 = 35 검색
    empty_urls = [
        search_url(f"{term} {th_name}", lat, lng)
        for _slug, lat, lng, th_name in NEAR_EMPTY_PROVINCES
        for term in BROAD_TERMS
    ]
    files.append((
        "acct_29_near_empty.json",
        build_input(empty_urls),
        f"공급사 1~4곳인 도 훑기 — 검색 {len(empty_urls)}건",
    ))

    for name, payload, _ in files:
        (OUT_DIR / name).write_bytes(
            (json.dumps(payload, ensure_ascii=False, indent=1) + "\n").encode("utf-8")
        )

    readme = [
        "# Apify 6차 배치 — $5 x 4 계정 ($20)",
        "",
        f"액터는 전부 `{ACTOR}` 하나다 (5차와 달리 contact-info-scraper 는 안 쓴다).",
        "",
        "| # | 파일 | 내용 |",
        "|---|------|------|",
    ]
    for name, payload, desc in files:
        readme.append(f"| {name[5:7]} | `{name}` | {desc} |")
    readme += [
        "",
        "## 실행 방법",
        "",
        "1. 액터 열고 Input 탭 → **JSON** 모드",
        "2. 파일 내용 붙여넣고 Start",
        "3. Dataset → Export → **JSON**",
        "4. `data/apify_raw/2026-10-03/` 에 넣기 (파일명 그대로)",
        "",
        "## 이번 배치가 노리는 것",
        "",
        "클릭이 실제로 나오는 곳은 태국이다 (3개월 52클릭 중 30). 그런데 태국어",
        "페이지가 있는 도 중 공급사가 60곳도 안 되는 데가 6곳이다:",
        "",
        "| 도 | 공급사 |",
        "|---|---|",
        "| map_ta_phut | 22 |",
        "| mukdahan | 31 |",
        "| khon_kaen | 34 |",
        "| si_racha | 53 |",
        "| sa_kaeo | 54 |",
        "| trat | 57 |",
        "",
        "`khon_kaen` 은 \"คลังสินค้า ขอนแก่น\" 으로 54회 노출된 곳인데 창고가 5곳뿐이다.",
        "태국어 도x업종 페이지는 **공급사 5곳부터** 생성되므로(lib/cityCategory.ts),",
        "이 도들을 채우면 페이지가 바로 생긴다. 1~2곳 구간에 31개 조합이 더 있다.",
        "",
        "계정 29 는 공급사가 1~4곳뿐인 도를 훑는다 — trang, satun, phatthalung,",
        "loei, maha_sarakham, nong_bua_lam_phu, ang_thong. 산업 밀도가 낮아 우선순위는",
        "마지막이지만 지금은 그 도 페이지에 보여줄 게 거의 없다.",
        "",
        "## 일부러 뺀 것",
        "",
        "- **영어 도x업종 3~4곳 구간 100개**: 문턱이 10이라 조합당 6~7곳이 더 필요하다.",
        "  태국어 쪽 문턱이 5라서 같은 돈으로 페이지가 더 많이 생긴다.",
        "- **좌표 미확인 단지 21곳**: IEAT 상세 페이지가 비어 있어(그래서 애초에 도",
        "  정보도 없었다) 좌표 복구가 안 된다.",
        "- **\"산단 많은데 공급사 적은 도\"**: 그런 축을 만들려다 Chonburi 43곳 /",
        "  Prachinburi 0곳이라는 숫자를 봤는데 슬러그 불일치였다 (공식 \"Chonburi\" vs",
        "  canonical \"chon_buri\", 실제 1,448곳 / 173곳). 집계 버그였고 축은 버렸다.",
        "",
        "## 돈 안 드는 후속 정리",
        "",
        "`pathumthanee`, `suphanburi`, `srisaket`, `\"city\"` 같은 슬러그 변형이",
        "각각 공급사 1곳씩 들고 따로 서 있다. lib/cityNorm.ts 에 별칭을 더하면",
        "본래 도로 합쳐진다 — 코드 작업이고 비용은 없다.",
    ]
    (OUT_DIR / "README.md").write_bytes(("\n".join(readme) + "\n").encode("utf-8"))

    print(f"wrote {len(files)} input files + README to {OUT_DIR}")
    for name, payload, desc in files:
        print(f"  {name:28} {len(payload['startUrls']):3}건  {desc}")


if __name__ == "__main__":
    main()
