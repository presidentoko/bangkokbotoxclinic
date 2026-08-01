"""
Apify compass/crawler-google-places 입력 JSON 생성기 — 2차 배치 ($5 x 20).

1차 배치(scripts/apify_inputs/, 2026-07-14)가 electronics/chemical/rubber/
textile/packaging을 이미 타겟했는데도 여전히 얇았음(각 60~100개) — 일반
영어 검색어로는 소비자 대상이 아닌 B2B 제조사가 Google Maps에 잘 안 걸림.

2차 배치 전략:
- 계정 1~10: 같은 카테고리를 더 구체적인 태국어 업종 용어 + 산단 좌표로 재검색
- 계정 11~20: 아직 거의 안 건드린 지역(푸켓/우돈타니/치앙라이 등) 신규 커버

실행: python scripts/gen_apify_inputs_v2.py
출력: scripts/apify_inputs_v2/ 폴더에 20개 JSON
"""

import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "scripts" / "apify_inputs_v2"
MASTER_DB = ROOT / "data" / "master_db.json"

MAX_CRAWLED = 2500
MAX_REVIEWS = 20

# ── Part A: 얇은 카테고리 재타겟 — 업종별 구체 태국어 용어 + 산단 좌표 ──
CATEGORY_ACCOUNTS = [
    (
        1, "chemical_deep",
        ["โรงงานเคมี", "โรงงานเคมีภัณฑ์", "chemical manufacturer", "petrochemical plant", "สารเคมีอุตสาหกรรม"],
        [
            (12.685, 101.152, 13, "Map Ta Phut Industrial Estate (chemical core)"),
            (13.550, 100.672, 13, "Bangpoo Industrial Estate"),
            (13.510, 101.220, 13, "WHA Eastern Seaboard I & II"),
            (14.350, 100.895, 13, "Nong Khae Saraburi chemical cluster"),
            (13.55, 100.27, 13, "Samut Sakhon industrial"),
        ],
    ),
    (
        2, "rubber_deep",
        ["โรงงานยาง", "ยางพารา แปรรูป", "rubber products manufacturer", "ถุงมือยาง โรงงาน", "rubber processing plant"],
        [
            (7.009, 100.473, 12, "Hat Yai rubber belt"),
            (9.140, 99.330, 12, "Surat Thani rubber processing"),
            (8.430, 99.960, 12, "Nakhon Si Thammarat rubber"),
            (7.564, 99.616, 12, "Trang rubber region"),
            (13.170, 100.930, 13, "Si Racha / Chon Buri rubber-glove cluster"),
        ],
    ),
    (
        3, "electronics_deep2",
        ["โรงงานอิเล็กทรอนิกส์", "แผงวงจร PCB", "electronics OEM assembly", "SMT PCB assembly", "wire harness manufacturer"],
        [
            (14.219, 100.582, 13, "Bang Pa-in Industrial Estate (HDD/electronics)"),
            (14.070, 100.610, 13, "Navanakorn IE electronics"),
            (14.300, 100.653, 13, "Rojana / Hi-Tech North electronics"),
            (18.480, 99.003, 13, "Northern IE Lamphun electronics"),
            (13.442, 101.048, 12, "Amata Nakorn electronics"),
        ],
    ),
    (
        4, "machining_steel_deep",
        ["โรงกลึง CNC", "โรงงานเหล็ก", "sheet metal fabrication", "precision machining shop", "งานปั๊มโลหะ"],
        [
            (13.610, 100.712, 13, "Bang Phli / Bang Bo metalwork cluster"),
            (13.442, 101.048, 12, "Chon Buri metal fabrication"),
            (12.745, 101.120, 13, "Rayong precision machining"),
            (13.55, 100.27, 13, "Samut Sakhon steel/metal"),
            (13.740, 100.762, 13, "Lat Krabang machining"),
        ],
    ),
    (
        5, "machinery_equipment_deep",
        ["โรงงานเครื่องจักร", "industrial machinery manufacturer", "อะไหล่เครื่องจักรอุตสาหกรรม", "automation equipment Thailand"],
        [
            (13.610, 100.712, 13, "Bang Phli industrial machinery"),
            (13.442, 101.048, 12, "Chon Buri machinery"),
            (14.070, 100.610, 13, "Pathum Thani machinery"),
            (13.740, 100.762, 13, "Lat Krabang equipment manufacturers"),
        ],
    ),
    (
        6, "industrial_estate_offices",
        ["นิคมอุตสาหกรรม", "สำนักงานนิคมอุตสาหกรรม", "industrial estate management office", "IEAT industrial estate"],
        [
            (12.685, 101.152, 12, "Map Ta Phut"),
            (12.745, 101.120, 12, "Amata City Rayong"),
            (13.442, 101.048, 12, "Amata Nakorn Chon Buri"),
            (13.510, 101.220, 12, "WHA Eastern Seaboard"),
            (14.219, 100.582, 12, "Bang Pa-in / Rojana Ayutthaya"),
            (18.480, 99.003, 12, "Northern IE Lamphun"),
            (13.862, 101.440, 12, "304 Industrial Park Prachinburi"),
        ],
    ),
    (
        7, "textile_garment_deep",
        ["โรงงานสิ่งทอ", "โรงงานตัดเย็บเสื้อผ้า", "garment manufacturer OEM", "textile mill Thailand", "โรงงานปักผ้า"],
        [
            (13.610, 100.712, 13, "Samut Prakan textile"),
            (13.820, 100.062, 12, "Nakhon Pathom garment"),
            (13.55, 100.27, 13, "Samut Sakhon textile"),
            (13.536, 99.818, 12, "Ratchaburi textile belt"),
        ],
    ),
    (
        8, "plastic_packaging_deep",
        ["โรงงานพลาสติก", "บรรจุภัณฑ์พลาสติก", "injection molding factory", "packaging manufacturer Thailand", "โรงงานฉีดพลาสติก"],
        [
            (13.55, 100.27, 13, "Samut Sakhon plastic/packaging"),
            (13.610, 100.712, 13, "Samut Prakan packaging"),
            (13.442, 101.048, 12, "Chon Buri plastic OEM"),
            (14.070, 100.610, 13, "Pathum Thani packaging"),
        ],
    ),
    (
        9, "exporter_trading_deep",
        ["บริษัทส่งออก", "trading company export Thailand", "OEM ODM export manufacturer", "export packing company"],
        [
            (13.740, 100.762, 13, "Lat Krabang export/air cargo"),
            (13.480, 100.620, 13, "Samut Prakan air cargo export"),
            (13.756, 100.501, 12, "Bangkok CBD trading offices"),
        ],
    ),
    (
        10, "auto_parts_deep2",
        ["ชิ้นส่วนยานยนต์", "อะไหล่รถยนต์ อุตสาหกรรม", "automotive stamping parts", "auto parts Tier 2 supplier"],
        [
            (13.442, 101.048, 12, "Amata Nakorn auto parts (Chon Buri)"),
            (12.745, 101.120, 13, "Amata City Rayong auto parts"),
            (13.510, 101.220, 13, "Chachoengsao auto parts (WHA)"),
            (14.219, 100.582, 13, "Ayutthaya auto parts (Honda cluster)"),
        ],
    ),
]

# ── Part B: 신규 지역 — 기존 배치가 거의 안 건드린 지역 ──
SEARCH_TERMS_BROAD = ["factory", "manufacturer", "โรงงาน", "warehouse", "โกดัง", "logistics", "industrial"]

GEO_ACCOUNTS = [
    (11, "phuket_krabi", [
        (7.890, 98.398, 12, "Phuket city / industrial fringe"),
        (8.086, 98.906, 12, "Krabi town"),
    ]),
    (12, "udon_thani", [
        (17.364, 102.815, 12, "Udon Thani city"),
        (17.400, 102.850, 13, "Udon Thani industrial estate"),
    ]),
    (13, "nakhon_sawan", [
        (15.708, 100.137, 12, "Nakhon Sawan city"),
        (15.650, 100.100, 12, "Nakhon Sawan logistics/river port"),
    ]),
    (14, "chiang_rai", [
        (19.910, 99.831, 12, "Chiang Rai city"),
        (20.270, 100.080, 12, "Mae Sai border trade"),
    ]),
    (15, "trang_phatthalung", [
        (7.564, 99.616, 12, "Trang city"),
        (7.617, 100.077, 12, "Phatthalung"),
    ]),
    (16, "ubon_ratchathani", [
        (15.229, 104.856, 12, "Ubon Ratchathani city"),
        (15.250, 104.870, 13, "Ubon Ratchathani industrial"),
    ]),
    (17, "ratchaburi_phetchaburi", [
        (13.536, 99.818, 12, "Ratchaburi city"),
        (13.111, 99.940, 12, "Phetchaburi"),
    ]),
    (18, "loei_nong_khai_deep", [
        (17.487, 101.722, 12, "Loei city"),
        (17.877, 102.747, 12, "Nong Khai border trade"),
    ]),
    (19, "surin_sisaket_deep", [
        (14.881, 103.494, 12, "Surin city"),
        (15.119, 104.322, 12, "Si Sa Ket city"),
    ]),
    (20, "nakhon_si_thammarat_deep", [
        (8.430, 99.960, 12, "Nakhon Si Thammarat city"),
        (8.630, 99.870, 12, "Nakhon Si Thammarat industrial fringe"),
    ]),
]


def gmaps_url(lat: float, lng: float, zoom: int, term: str) -> str:
    return f"https://www.google.com/maps/search/{quote(term)}/@{lat},{lng},{zoom}z"


def build_category_input(num: int, label: str, terms: list, zones: list) -> dict:
    start_urls = []
    seen: set[str] = set()
    for lat, lng, zoom, desc in zones:
        for term in terms:
            url = gmaps_url(lat, lng, zoom, term)
            if url not in seen:
                seen.add(url)
                start_urls.append({"url": url, "userData": {"zone": desc, "term": term}})
    return {
        "_account": num,
        "_label": label,
        "_zones": [z[3] for z in zones],
        "_terms": terms,
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


def build_geo_input(num: int, label: str, zones: list) -> dict:
    return build_category_input(num, label, SEARCH_TERMS_BROAD, zones)


def main():
    existing_ids: set[str] = set()
    if MASTER_DB.exists():
        db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
        existing_ids = {s.get("id") for s in db.get("suppliers", []) if s.get("id")}
    print(f"기존 place_ids: {len(existing_ids)}개 (머지 시 자동 중복 제거됨)\n")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=== Part A: 얇은 카테고리 재타겟 (1~10) ===")
    for num, label, terms, zones in CATEGORY_ACCOUNTS:
        cfg = build_category_input(num, label, terms, zones)
        out_path = OUT_DIR / f"acct_{num:02d}_{label}.json"
        out_path.write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  계정 {num:2d} [{label}] — {cfg['_url_count']} startUrls → {out_path.name}")

    print("\n=== Part B: 신규 지역 (11~20) ===")
    for num, label, zones in GEO_ACCOUNTS:
        cfg = build_geo_input(num, label, zones)
        out_path = OUT_DIR / f"acct_{num:02d}_{label}.json"
        out_path.write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  계정 {num:2d} [{label}] — {cfg['_url_count']} startUrls → {out_path.name}")

    print(f"\n완료: {OUT_DIR}")
    print("\n=== 사용법 ===")
    print("1. apify.com → compass/crawler-google-places actor")
    print("2. Input 탭 → JSON editor → 해당 계정 JSON 전체 붙여넣기 → Run")
    print("3. 완료 후 Dataset → Export as JSON → 다운로드")
    print(f"4. 다운로드한 파일을 data/apify_raw/<날짜>/ 에 저장")
    print("5. python scripts/apify_to_master_db.py 실행 → 자동 병합")


if __name__ == "__main__":
    main()
