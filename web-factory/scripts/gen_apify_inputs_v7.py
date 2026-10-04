"""Apify 입력 생성기 — 7차 배치: 태국 소상공인 OEM (รับผลิต) ($5 x 3 계정 = $15).

── 왜 ──────────────────────────────────────────────────────────────────
2026-10-04 에 /th/oem/[slug] 를 만들었다 (lib/smeOemTh.ts). 태국 소상공인이
자기 브랜드를 만들 때 치는 "รับผลิตครีม", "โรงงานสกรีนแก้ว", "โรงงานกล่องอาหาร"
같은 검색어에 대응하는 페이지다. 기존 데이터로 10개 품목이 다 문턱(8곳)을
넘었지만 얇은 품목이 있다:

    snack-food 10 · cleaning 10 · screen-printing 24 · supplements 27 · food-packaging 29

공급사가 적으면 페이지가 얇고, 9월에 얇은 페이지 때문에 순위를 잃었다.
이 배치는 그 품목들을 두껍게 하는 데 쓴다.

── 어디서 ──────────────────────────────────────────────────────────────
OEM 공장은 방콕 외곽에 몰려 있다 (사뭇쁘라깐·사뭇사콘·논타부리·빠툼타니·
나콘빠톰). 촌부리·치앙마이는 식품·음료·포장 수요가 있어 넣었다.

── 일부러 안 한 것 ─────────────────────────────────────────────────────
- 중고 집기(มือสอง)·도매가(ราคาส่ง): 페이지를 만들지 않기로 한 의도라 긁지 않는다.
- 카페용 커피 "로스터리": 대부분 카페라 필터가 버린다. "โรงคั่วกาแฟ" 로만 찾는다.

── 필터 사전 확인 (2026-10-04) ─────────────────────────────────────────
병합 필터가 Commercial printer / Label printer / Screen printing shop /
Coffee roasters 를 전부 버리고 있었다. 이 배치 전에 SUPPLY_KEYWORDS 와
STRONG_KEEP_NAME 에 인쇄·스크린·รับผลิต 어휘를 넣었다. 병합 후 이 품목들의
통과율을 꼭 확인할 것 ([[project-apify-batch-filters]]).

액터: compass/crawler-google-places
실행: python scripts/gen_apify_inputs_v7.py
출력: scripts/apify_inputs_v7/ 에 JSON 3개 + README.md
"""
from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "scripts" / "apify_inputs_v7"

ACTOR = "compass/crawler-google-places"
MAX_PLACES_PER_ACCOUNT = 700
MAX_REVIEWS = 2

# OEM 공장 밀집 지역.
AREAS: list[tuple[str, float, float, str]] = [
    ("bangkok", 13.756, 100.502, "กรุงเทพ"),
    ("samut_prakan", 13.599, 100.597, "สมุทรปราการ"),
    ("samut_sakhon", 13.547, 100.274, "สมุทรสาคร"),
    ("nonthaburi", 13.859, 100.521, "นนทบุรี"),
    ("pathum_thani", 14.021, 100.525, "ปทุมธานี"),
    ("nakhon_pathom", 13.820, 100.063, "นครปฐม"),
    ("chon_buri", 13.361, 100.985, "ชลบุรี"),
    ("chiang_mai", 18.788, 98.985, "เชียงใหม่"),
]

# 계정별 품목 묶음. 얇은 품목을 먼저, 그리고 계정마다 고르게.
ACCOUNTS: list[tuple[str, str, list[str]]] = [
    ("acct_30_beauty_supplement.json", "เครื่องสำอาง · อาหารเสริม · สบู่", [
        "รับผลิตครีม OEM",
        "รับผลิตอาหารเสริม",
        "รับผลิตสบู่",
        "รับผลิตน้ำยาทำความสะอาด",
    ]),
    ("acct_31_food_drink.json", "ซอส · ขนม · เครื่องดื่ม · กาแฟ", [
        "รับผลิตซอส",
        "รับผลิตขนม OEM",
        "รับผลิตเครื่องดื่ม",
        "โรงคั่วกาแฟ",
    ]),
    ("acct_32_pack_print.json", "บรรจุภัณฑ์ · สกรีน · ฉลาก · เสื้อ", [
        "โรงงานกล่องอาหาร",
        "โรงงานสกรีนแก้ว",
        "โรงพิมพ์ฉลากสินค้า",
        "รับผลิตเสื้อ โรงงาน",
    ]),
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


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    files: list[tuple[str, dict, str]] = []
    for name, desc, terms in ACCOUNTS:
        urls = [
            search_url(f"{term} {th_name}", lat, lng)
            for term in terms
            for _slug, lat, lng, th_name in AREAS
        ]
        files.append((name, build_input(urls), f"{desc} — 검색 {len(urls)}건"))

    for name, payload, _ in files:
        (OUT_DIR / name).write_bytes(
            (json.dumps(payload, ensure_ascii=False, indent=1) + "\n").encode("utf-8")
        )

    readme = [
        "# Apify 7차 배치 — 태국 소상공인 OEM ($5 x 3 계정 = $15)",
        "",
        f"액터는 전부 `{ACTOR}` 하나다.",
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
        "4. `data/apify_raw/2026-10-04/` 에 넣기 (파일명 그대로) — 자동 리빌드가 10분 안에 집어간다",
        "",
        "## 이번 배치가 노리는 것",
        "",
        "`/th/oem/*` (태국 소상공인 รับผลิต 페이지) 의 얇은 품목:",
        "",
        "| 품목 | 지금 공급사 |",
        "|---|---|",
        "| snack-food | 10 |",
        "| cleaning | 10 |",
        "| screen-printing | 24 |",
        "| supplements | 27 |",
        "| food-packaging | 29 |",
        "",
        "지역: 방콕·사뭇쁘라깐·사뭇사콘·논타부리·빠툼타니·나콘빠톰·촌부리·치앙마이.",
        "",
        "## 일부러 뺀 것",
        "",
        "- **중고 집기(มือสอง)·도매가(ราคาส่ง)**: 페이지를 만들지 않기로 했다 —",
        "  중고는 장터 사업이고, 도매가는 가격 데이터가 없으면 답이 안 된다.",
        "- **카페형 커피 로스터리**: 대부분 카페라 필터가 버린다. `โรงคั่วกาแฟ` 로만 찾는다.",
    ]
    (OUT_DIR / "README.md").write_bytes(("\n".join(readme) + "\n").encode("utf-8"))

    print(f"wrote {len(files)} input files + README to {OUT_DIR}")
    for name, payload, desc in files:
        print(f"  {name:34} {len(payload['startUrls']):3}건  {desc}")


if __name__ == "__main__":
    main()
