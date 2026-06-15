"""
Apify compass/crawler-google-places 입력 JSON 생성기.

- 기존 master_db.json place_id 기반으로 중복 좌표 회피
- 산업단지 좌표 그리드 기반으로 $5 크레딧 꽉 채움
- 계정 10개 → output/apify_input_acct_XX.json 생성

실행: python scripts/gen_apify_inputs.py
출력: scripts/apify_inputs/ 폴더에 10개 JSON
"""

import json
import math
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "scripts" / "apify_inputs"
MASTER_DB = ROOT / "data" / "master_db.json"

# $5 크레딧 기준
# compass actor 대략: 리뷰 0개 → ~1 CU/1000 places, 리뷰 20개 → ~7 CU/1000 places
# $5 = ~20 CU
# 리뷰 0: 20k places 가능 → 하지만 리뷰 없으면 trust_score/mentioned_topics/sample_reviews 다 빈칸
# 리뷰 20: ~2800 places 가능 → mentioned_topics/language_breakdown/sample_reviews 생성됨
# → 리뷰 있는 게 훨씬 가치 있음. 리뷰 20개로 설정.
MAX_CRAWLED = 1000   # 리뷰 20개 기준 $5 안에 여유있게 맞춤
MAX_REVIEWS = 20     # 장소당 리뷰 수

SEARCH_TERMS = [
    "factory",
    "manufacturer",
    "โรงงาน",
    "warehouse",
    "โกดัง",
    "logistics",
    "industrial",
]

# 각 계정: (account_num, label, list of (lat, lng, zoom, desc))
# zoom 13 = 산업단지 단위, zoom 12 = 도시 단위, zoom 11 = 광역
ACCOUNTS = [
    (
        1, "ayutthaya",
        [
            (14.219, 100.582, 13, "Bang Pa-in Industrial Estate"),
            (14.210, 100.670, 13, "Rojana Industrial Park South"),
            (14.300, 100.653, 13, "Rojana / Hi-Tech North"),
            (14.374, 100.679, 13, "Saha Rattana Nakorn IE"),
            (14.350, 100.580, 12, "Ayutthaya City core"),
        ],
    ),
    (
        2, "rayong_deep",
        [
            (12.685, 101.152, 13, "Map Ta Phut Industrial Estate"),
            (12.745, 101.120, 13, "Amata City Rayong"),
            (12.720, 101.090, 13, "Eastern Seaboard IE / WHA"),
            (12.680, 101.200, 13, "Map Ta Phut Port / Chemical cluster"),
            (12.760, 101.050, 12, "Rayong city industrial fringe"),
        ],
    ),
    (
        3, "chachoengsao",
        [
            (13.510, 101.220, 13, "WHA Eastern Seaboard I & II"),
            (13.590, 101.195, 13, "304 / WHA Chachoengsao"),
            (13.650, 101.052, 13, "Bang Pakong industrial"),
            (13.690, 101.080, 12, "Chachoengsao city area"),
            (13.460, 101.260, 13, "WHA Eastern Seaboard III"),
        ],
    ),
    (
        4, "prachinburi_304",
        [
            (13.862, 101.440, 13, "304 Industrial Park Phase 1"),
            (13.900, 101.410, 13, "304 Industrial Park Phase 2-3"),
            (13.920, 101.380, 13, "304 Industrial Park North"),
            (14.050, 101.370, 12, "Prachinburi city"),
            (13.720, 101.720, 12, "Kabin Buri area"),
        ],
    ),
    (
        5, "saraburi",
        [
            (14.350, 100.895, 13, "Nong Khae Industrial"),
            (14.590, 101.000, 13, "Kaeng Khoi industrial"),
            (14.530, 100.910, 12, "Saraburi city"),
            (14.650, 100.780, 12, "Muak Lek area"),
            (14.430, 100.950, 12, "Saraburi south"),
        ],
    ),
    (
        6, "nakhon_pathom_laem_chabang",
        [
            (13.820, 100.062, 12, "Nakhon Pathom city"),
            (13.730, 100.215, 13, "Sam Phran industrial"),
            (13.082, 100.883, 13, "Laem Chabang port logistics"),
            (13.170, 100.930, 13, "Si Racha industrial"),
            (13.050, 100.850, 12, "Laem Chabang area broad"),
        ],
    ),
    (
        7, "chiang_mai_lamphun",
        [
            (18.480, 99.003, 13, "Northern Industrial Estate Lamphun"),
            (18.520, 99.020, 13, "Lamphun industrial zone"),
            (18.740, 98.965, 12, "Chiang Mai city industrial"),
            (18.630, 98.930, 13, "Hang Dong / San Pa Tong"),
            (18.560, 98.980, 12, "Lamphun-Chiang Mai corridor"),
        ],
    ),
    (
        8, "khon_kaen_northeast",
        [
            (16.432, 102.823, 12, "Khon Kaen city"),
            (16.500, 102.880, 13, "Khon Kaen industrial east"),
            (16.450, 102.760, 12, "Khon Kaen west"),
            (17.200, 102.440, 12, "Nong Bua Lamphu"),
            (14.970, 102.080, 12, "Nakhon Ratchasima (Korat) supplement"),
        ],
    ),
    (
        9, "hat_yai_songkhla",
        [
            (7.009, 100.473, 12, "Hat Yai city"),
            (7.197, 100.595, 12, "Songkhla port area"),
            (6.640, 100.430, 12, "Sadao border logistics"),
            (7.100, 100.520, 12, "Hat Yai - Songkhla corridor"),
            (6.860, 100.370, 12, "Na Thawi industrial"),
        ],
    ),
    (
        10, "bangkok_industrial_zones",
        [
            (13.740, 100.762, 13, "Lat Krabang Industrial Estate"),
            (13.610, 100.712, 13, "Bang Phli / Bang Bo industrial"),
            (13.550, 100.672, 13, "Bang Pu Industrial Estate"),
            (13.480, 100.620, 13, "Samut Prakan deep south"),
            (13.390, 100.570, 12, "Samut Prakan port / logistics"),
        ],
    ),
]


def make_google_maps_url(lat: float, lng: float, zoom: int, term: str) -> str:
    encoded = quote(term)
    return f"https://www.google.com/maps/search/{encoded}/@{lat},{lng},{zoom}z"


def build_input(account_num: int, label: str, zones: list) -> dict:
    start_urls = []
    seen: set[str] = set()

    for lat, lng, zoom, desc in zones:
        for term in SEARCH_TERMS:
            url = make_google_maps_url(lat, lng, zoom, term)
            if url not in seen:
                seen.add(url)
                start_urls.append({"url": url, "userData": {"zone": desc, "term": term}})

    return {
        "_account": account_num,
        "_label": label,
        "_zones": [z[3] for z in zones],
        "_url_count": len(start_urls),
        "startUrls": start_urls,
        "maxCrawledPlaces": MAX_CRAWLED,
        "maxImages": 0,
        "maxReviews": MAX_REVIEWS,
        "language": "en",
        "countryCode": "th",
        "exportPlaceUrls": False,
        "includeHistogram": False,
        "includeOpeningHours": False,
        "includePeopleAlsoSearch": False,
    }


def main():
    # 기존 place_id 로드
    existing_ids: set[str] = set()
    if MASTER_DB.exists():
        with open(MASTER_DB, encoding="utf-8") as f:
            db = json.load(f)
        for s in db.get("suppliers", []):
            pid = s.get("id") or s.get("place_id")
            if pid:
                existing_ids.add(pid)
    print(f"기존 place_ids: {len(existing_ids)}개 (머지 시 자동 중복 제거됨)")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for account_num, label, zones in ACCOUNTS:
        cfg = build_input(account_num, label, zones)
        out_path = OUT_DIR / f"acct_{account_num:02d}_{label}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(cfg, f, ensure_ascii=False, indent=2)

        print(f"\n계정 {account_num:2d} [{label}]")
        print(f"  zones: {', '.join(cfg['_zones'])}")
        print(f"  startUrls: {cfg['_url_count']}개")
        print(f"  maxCrawledPlaces: {cfg['maxCrawledPlaces']}")
        print(f"  → {out_path.name}")

    print(f"\n완료: {OUT_DIR}")
    print("\n=== Apify 사용법 ===")
    print("1. apify.com → compass/crawler-google-places actor")
    print("2. Input 탭 → JSON editor 클릭")
    print("3. 해당 계정 JSON 내용 전체 붙여넣기")
    print("4. Run 클릭 (계정별로 다른 Apify 계정 로그인 필요)")
    print("5. 완료 후 Dataset → Export as JSON → 다운로드")
    print("6. 파일명: dataset_crawler-google-places_XXXXX.json 으로 저장")
    print("7. ~/Desktop 또는 ~/Downloads 에 놓고:")
    print("   python scripts/apify_to_master_db.py")


if __name__ == "__main__":
    main()
