"""Apify 입력 JSON 생성기 — 4차 배치 ($5 x 20 계정 = $100).

── 왜 이 세 가지인가 (2026-10-02 실측) ────────────────────────────────────
3차는 "깊이"(이메일·리뷰)에 썼다. 4차는 **비어 있는 칸**을 채운다. 세 공백이
전부 수익 경로와 직접 닿아 있다.

  1. 산업단지 입주사 (계정 01~08, $40)
     공식 단지 83곳을 어제 확보했는데 입주사가 매칭된 건 11곳뿐이다. 77곳이
     비었다 — 촌부리 19, 라용 13, 사뭇프라칸 6. "industrial estate in
     thailand"(49회)·"thailand industrial park"(42회)의 답이 이 페이지이고,
     돈 낼 쪽(Amata·WHA 같은 단지 운영사)이 여기 있다. 지금 광고 제안으로
     보여줄 수 있는 건 "단지 목록"까지다.

  2. 문턱 바로 아래 도x업종 (계정 09~14, $30)
     도x업종 페이지는 공급사 10곳부터 생성된다(lib/cityCategory.ts). 지금
     89개 조합이 5~9곳 구간에 있어서, 조합당 1~5곳만 더 있으면 페이지가
     하나씩 생긴다. 태국어 페이지는 문턱이 5인데 39개 조합이 2~4곳에 있다 —
     클릭이 실제로 나오는 쪽이 태국 국내다.

  3. 비어 있는 제품 업종 (계정 15~18, $20)
     욕실가구·위생도기 8곳(실제 제조사는 TOTO 하나, 나머지는 건자재 소매점),
     초콜릿·제과 7곳, 콜드체인 34곳. 욕실가구는 2026-10-02 에 그 업종 OEM
     공장이 직접 문의해서 확인된 공백이다 — 바이어가 찾는데 우리에게 없다.

  예비 (계정 19~20, $10): 실패·중단분 재시도용. 1~3 중 결과가 가장 얇게 나온
  쪽에 돌린다.

리뷰 수집은 이번에 하지 않는다. 5,473곳이 리뷰 본문이 없어 끌리지만, 3차에서
이미 14개 계정을 썼고 리뷰 액터는 건수 기반 과금이라 $100이 빠르게 녹는다.
빈 칸을 채우는 쪽이 지금 효율이 높다.

── 액터 ──────────────────────────────────────────────────────────────────
전부 `compass/crawler-google-places` 하나만 쓴다. 3차처럼 파일마다 다른 액터를
붙이는 실수를 할 여지를 없앴다.

영어 검색어로는 태국 B2B 제조사가 Google Maps 에 잘 안 걸린다(1·2차에서 확인).
그래서 검색어는 태국어, 위치는 좌표로 준다.

실행: python scripts/gen_apify_inputs_v4.py
출력: scripts/apify_inputs_v4/ 에 JSON 20개 + README.md
"""
from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "scripts" / "apify_inputs_v4"
MASTER_DB = ROOT / "data" / "master_db.json"
IEAT = ROOT / "data" / "ieat_estates.json"

ACTOR = "compass/crawler-google-places"

# 계정당 상한. place 건수가 비용을 좌우하므로 $5 안쪽으로 보수적으로 잡는다.
# 3차에서 365 places x 15 reviews 가 $5 안쪽이었고, 여기서는 리뷰를 거의 받지
# 않으므로(2건) place 를 더 넉넉히 쓸 수 있다.
MAX_PLACES_PER_ACCOUNT = 700
# 목록 수집이 목적이라 리뷰는 최소만 받는다 — 0 으로 두면 평점도 안 오는 경우가 있다.
MAX_REVIEWS = 2

# 단지 좌표는 도 중심값을 쓴다. 단지별 좌표가 데이터에 없고, 추측해서 넣으면
# 틀린 반경을 긁는다. 도 단위 + 단지명 검색어 조합으로 커버한다.
PROVINCE_CENTERS: dict[str, tuple[float, float]] = {
    "Chonburi": (13.361, 100.985),
    "Chon Buri": (13.361, 100.985),
    "Rayong": (12.683, 101.254),
    "Samut Prakan": (13.599, 100.597),
    "Chachoengsao": (13.690, 101.077),
    "Bangkok": (13.736, 100.523),
    "Phra Nakhon Si Ayutthaya": (14.361, 100.578),
    "Prachinburi": (14.047, 101.373),
    "Prachin Buri": (14.047, 101.373),
    "Saraburi": (14.528, 100.911),
    "Samut Sakhon": (13.547, 100.274),
    "Pathum Thani": (14.021, 100.525),
    "Ratchaburi": (13.528, 99.814),
    "Lamphun": (18.574, 99.009),
    "Songkhla": (7.199, 100.595),
    "Udon Thani": (17.414, 102.787),
    "Nakhon Sawan": (15.704, 100.137),
    "Ubon Ratchathani": (15.244, 104.848),
    "Pichit": (16.439, 100.349),
    "Phichit": (16.439, 100.349),
    "Nakhon Ratchasima": (14.979, 102.098),
    "Surat Thani": (9.140, 99.333),
    "Trat": (12.243, 102.515),
    "Sa Kaeo": (13.824, 102.065),
    "Mukdahan": (16.542, 104.721),
    "Lopburi": (14.799, 100.653),
    "Suphan Buri": (14.474, 100.117),
    "Khon Kaen": (16.441, 102.836),
    "Roi Et": (16.054, 103.653),
    "Nong Khai": (17.878, 102.742),
    "Si Racha": (13.174, 100.931),
    "Map Ta Phut": (12.685, 101.152),
}

# 단지 안에서 찾을 업종 — 태국어. "โรงงาน"(공장) 단독은 노이즈가 많아서
# 업종을 붙인다.
ESTATE_TERMS = [
    "โรงงาน",
    "โรงงานผลิตชิ้นส่วน",
    "บริษัท ผู้ผลิต",
    "คลังสินค้า โรงงาน",
]

# 문턱 아래 조합을 채울 태국어 업종 검색어. lib/types.ts 의 카테고리 키에 대응.
CATEGORY_TERMS_TH: dict[str, list[str]] = {
    "manufacturer": ["โรงงานผู้ผลิต", "บริษัท ผู้ผลิต", "โรงงานอุตสาหกรรม"],
    "auto_parts": ["โรงงานผลิตชิ้นส่วนยานยนต์", "ผู้ผลิตอะไหล่รถยนต์"],
    "warehouse": ["คลังสินค้า", "โกดังให้เช่า", "คลังสินค้าให้เช่า"],
    "logistics": ["บริษัทขนส่ง", "โลจิสติกส์", "ตัวแทนออกของ"],
    "packaging": ["โรงงานบรรจุภัณฑ์", "ผู้ผลิตกล่องกระดาษ", "โรงงานผลิตถุงพลาสติก"],
    "food_mfg": ["โรงงานผลิตอาหาร", "โรงงานแปรรูปอาหาร", "ผู้ผลิตอาหารแช่แข็ง"],
    "plastic": ["โรงงานพลาสติก", "ฉีดพลาสติก", "ผู้ผลิตบรรจุภัณฑ์พลาสติก"],
    "steel": ["โรงงานเหล็ก", "แปรรูปเหล็ก", "ผู้ผลิตโครงสร้างเหล็ก"],
    "rubber": ["โรงงานยาง", "ผู้ผลิตผลิตภัณฑ์ยาง"],
    "equipment": ["ผู้จำหน่ายอุปกรณ์อุตสาหกรรม", "เครื่องจักรอุตสาหกรรม"],
    "machining": ["โรงกลึง", "รับกลึงโลหะ", "ผู้ผลิตแม่พิมพ์"],
    "chemical": ["โรงงานเคมีภัณฑ์", "ผู้ผลิตเคมีอุตสาหกรรม"],
    "electronics": ["โรงงานอิเล็กทรอนิกส์", "ผู้ผลิตแผงวงจร"],
    "textile": ["โรงงานทอผ้า", "โรงงานสิ่งทอ", "ผู้ผลิตเสื้อผ้า"],
}

# 비어 있는 제품 업종 — 전국 단위로 넓게 긁는다.
PRODUCT_TARGETS: list[tuple[str, list[str], list[str]]] = [
    (
        "bathroom_sanitary",
        ["โรงงานผลิตสุขภัณฑ์", "ผู้ผลิตเฟอร์นิเจอร์ห้องน้ำ", "โรงงานผลิตอ่างล้างหน้า",
         "ผู้ผลิตตู้เก็บของห้องน้ำ", "โรงงานกระจกเงา"],
        ["Samut Prakan", "Samut Sakhon", "Chonburi", "Bangkok", "Pathum Thani", "Ratchaburi"],
    ),
    (
        "chocolate_confectionery",
        ["โรงงานผลิตช็อกโกแลต", "โรงงานผลิตลูกอม", "โรงงานผลิตขนมหวาน", "ผู้ผลิตเบเกอรี่ส่ง"],
        ["Bangkok", "Pathum Thani", "Samut Prakan", "Chonburi", "Nakhon Pathom", "Chiang Mai"],
    ),
    (
        "cold_chain",
        ["ห้องเย็น", "คลังสินค้าห้องเย็น", "ห้องเย็นให้เช่า", "โรงงานแช่แข็ง"],
        ["Samut Sakhon", "Samut Prakan", "Chonburi", "Songkhla", "Surat Thani", "Pathum Thani"],
    ),
    (
        "rice_grain",
        ["โรงสีข้าว", "โรงงานแปรรูปข้าว", "ผู้ส่งออกข้าว"],
        ["Nakhon Ratchasima", "Roi Et", "Suphan Buri", "Khon Kaen", "Lopburi", "Udon Thani"],
    ),
]

# Chiang Mai / Nakhon Pathom 좌표 (PRODUCT_TARGETS 에서 쓴다)
PROVINCE_CENTERS.setdefault("Chiang Mai", (18.788, 98.985))
PROVINCE_CENTERS.setdefault("Nakhon Pathom", (13.820, 100.062))

MIN_CITY_CATEGORY = 10   # lib/cityCategory.ts 와 같은 값
MIN_CITY_CATEGORY_TH = 5


def search_url(term: str, lat: float, lng: float, zoom: int = 12) -> str:
    return f"https://www.google.com/maps/search/{quote(term)}/@{lat},{lng},{zoom}z"


def build_input(start_urls: list[str]) -> dict:
    return {
        "startUrls": [{"url": u} for u in start_urls],
        "maxCrawledPlaces": MAX_PLACES_PER_ACCOUNT,
        "maxReviews": MAX_REVIEWS,
        "language": "en",       # 결과 필드는 영어로 — 기존 파서와 맞춘다
        "countryCode": "th",
        "scrapeReviewerName": False,
        "scrapeReviewerId": False,
    }


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


def city_slug_to_province(slug: str) -> str:
    """city slug → PROVINCE_CENTERS 키. 못 찾으면 빈 문자열."""
    pretty = slug.replace("_", " ").title()
    for key in PROVINCE_CENTERS:
        if key.lower().replace(" ", "") == pretty.lower().replace(" ", ""):
            return key
    return ""


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    suppliers = db["suppliers"]
    estates = json.loads(IEAT.read_text(encoding="utf-8"))["estates"]

    files: list[tuple[str, dict, str]] = []  # (filename, input, 설명)

    # ── Part A: 단지 입주사 (계정 01~08) ──────────────────────────────────
    # 좌표를 아는 도의 단지 전부를 대상으로 한다.
    #
    # 처음에는 "입주사가 이미 매칭된 단지는 제외" 로 짰다가 버렸다. 공급사 한 곳의
    # estate_name 이 그냥 "industrial estate" 라는 일반명사여서, 그게 단지 이름
    # 62개 전부와 부분일치해 대상이 0건이 됐다. 애초에 입주사가 있는 단지는 11곳뿐이라
    # 제외해서 아끼는 양도 거의 없고, 병합은 place_id 기준 멱등이라 겹쳐도 무해하다.
    targets = []
    for e in estates:
        if not e.get("province"):
            continue
        center = PROVINCE_CENTERS.get(e["province"])
        if not center:
            continue
        targets.append((e["name"], e.get("name_th"), center))

    estate_urls: list[str] = []
    for name, name_th, (lat, lng) in targets:
        # 단지명 자체로 한 번 (영문·태국어), 그리고 단지 주변 업종 검색.
        estate_urls.append(search_url(name, lat, lng, 13))
        if name_th:
            estate_urls.append(search_url(name_th, lat, lng, 13))
        for term in ESTATE_TERMS[:2]:
            estate_urls.append(search_url(f"{term} {name}", lat, lng, 13))

    for i, part in enumerate(chunk(estate_urls, 8), start=1):
        files.append((
            f"acct_{i:02d}_estates.json",
            build_input(part),
            f"산업단지 입주사 — 검색 {len(part)}건",
        ))

    # ── Part B: 문턱 아래 도x업종 (계정 09~14) ────────────────────────────
    counts: dict[tuple[str, str], int] = {}
    for s in suppliers:
        c = s.get("city") or ""
        if not c:
            continue
        for k in s.get("categories") or []:
            counts[(c, k)] = counts.get((c, k), 0) + 1

    th_cities = set(json.loads((ROOT / "lib" / "thCities.json").read_text(encoding="utf-8")))
    th_cats = {"manufacturer", "auto_parts", "industrial_estate", "warehouse",
               "logistics", "packaging", "food_mfg"}

    gap_urls: list[str] = []
    gaps_logged: list[str] = []
    for (city, cat), n in sorted(counts.items(), key=lambda x: -x[1]):
        terms = CATEGORY_TERMS_TH.get(cat)
        if not terms:
            continue
        province = city_slug_to_province(city)
        center = PROVINCE_CENTERS.get(province)
        if not center:
            continue
        near_en = MIN_CITY_CATEGORY - 5 <= n < MIN_CITY_CATEGORY
        near_th = city in th_cities and cat in th_cats and 2 <= n < MIN_CITY_CATEGORY_TH
        if not (near_en or near_th):
            continue
        lat, lng = center
        for term in terms:
            gap_urls.append(search_url(term, lat, lng, 11))
        gaps_logged.append(f"{city}/{cat} ({n})")

    for i, part in enumerate(chunk(gap_urls, 6), start=9):
        files.append((
            f"acct_{i:02d}_gaps.json",
            build_input(part),
            f"문턱 아래 도x업종 — 검색 {len(part)}건",
        ))

    # ── Part C: 비어 있는 제품 업종 (계정 15~18) ──────────────────────────
    for i, (label, terms, provinces) in enumerate(PRODUCT_TARGETS, start=15):
        urls: list[str] = []
        for term in terms:
            for p in provinces:
                center = PROVINCE_CENTERS.get(p)
                if center:
                    urls.append(search_url(term, center[0], center[1], 11))
        files.append((
            f"acct_{i:02d}_{label}.json",
            build_input(urls),
            f"제품 업종 보강: {label} — 검색 {len(urls)}건",
        ))

    # ── 예비 (계정 19~20) ─────────────────────────────────────────────────
    # 내용은 Part A 의 앞부분과 같다. 1~3 중 얇게 나온 쪽을 다시 돌리거나,
    # 중단된 계정의 남은 검색어를 여기서 이어 받는다.
    for i, part in enumerate(chunk(estate_urls, 20)[:2], start=19):
        files.append((
            f"acct_{i:02d}_reserve.json",
            build_input(part),
            f"예비 — 실패분 재시도용 (단지 검색 {len(part)}건)",
        ))

    for name, payload, _ in files:
        (OUT_DIR / name).write_bytes(
            (json.dumps(payload, ensure_ascii=False, indent=1) + "\n").encode("utf-8")
        )

    readme = [
        "# Apify 4차 배치 — $5 x 20 계정",
        "",
        "액터는 **전부 `compass/crawler-google-places` 하나**다. 3차처럼 파일마다",
        "다른 액터를 쓰지 않는다.",
        "",
        "## 실행 방법",
        "",
        "1. Apify 콘솔에서 해당 액터를 연다",
        "2. Input 탭 → JSON 모드로 바꾼다",
        "3. 아래 표의 파일 내용을 그대로 붙여넣고 Start",
        "4. 끝나면 Dataset → Export → JSON 으로 내려받는다",
        f"5. 받은 파일을 `data/apify_raw/2026-10-02/` 에 넣는다 "
        "(파일명은 `dataset_crawler-google-places_*.json` 형태 유지 — 파서가 그 패턴으로 찾는다)",
        "6. `python scripts/rebuild_master_db.py` 후 빌드·배포",
        "",
        f"계정당 상한은 {MAX_PLACES_PER_ACCOUNT} places, 리뷰 {MAX_REVIEWS}건으로 잡았다.",
        "$5 를 넘기면 Apify 가 중간에 멈추는데, 병합은 place_id 기준 idempotent 라서",
        "중단된 데이터셋을 그대로 export 해도 안전하다.",
        "",
        "| # | 파일 | 내용 |",
        "|---|------|------|",
    ]
    for name, payload, desc in files:
        readme.append(f"| {name[5:7]} | `{name}` | {desc} |")
    readme += [
        "",
        "## 이번 배치가 노리는 것",
        "",
        "- **계정 01~08 (단지)**: 공식 단지 83곳 중 입주사가 매칭된 건 11곳뿐이다.",
        "  단지 운영사(Amata·WHA)가 광고를 살 수 있는 쪽이고, 그들에게 보여줄 근거가",
        "  \"단지 목록\" 에서 \"입주사 목록\" 으로 올라간다.",
        f"- **계정 09~14 (문턱)**: 아래 조합들이 페이지 생성 문턱 바로 밑에 있다. "
        f"대상 {len(gaps_logged)}개:",
        "",
        "  " + ", ".join(gaps_logged[:40]) + (" …" if len(gaps_logged) > 40 else ""),
        "",
        "- **계정 15~18 (제품)**: 욕실가구·위생도기는 8곳뿐이고 그중 실제 제조사는",
        "  TOTO 하나다. 2026-10-02 에 욕실가구 OEM 공장이 직접 문의해서 확인된 공백이다.",
        "",
        "## 받은 뒤 확인할 것",
        "",
        "병합 후 `python scripts/rebuild_master_db.py` 결과에서:",
        "",
        "- `total_suppliers` 가 줄지 않았는지 (줄면 CSV/Apify 쪽 문제)",
        "- 단지 입주사: `/estate` 에서 입주사 매칭 단지 수가 11 → 몇으로 늘었는지",
        "- 문턱: 도x업종 페이지 수가 172 → 몇으로 늘었는지",
        "- **`--skip-apify` 로 돌리지 말 것** — master_db 가 CSV 기준으로 축소된다",
        "  (2026-10-02 에 실제로 8,977 → 2,963 으로 떨어뜨렸다)",
    ]
    (OUT_DIR / "README.md").write_bytes(("\n".join(readme) + "\n").encode("utf-8"))

    print(f"wrote {len(files)} input files + README to {OUT_DIR}")
    print(f"  단지 대상: {len(targets)}곳, 검색 {len(estate_urls)}건")
    print(f"  문턱 조합: {len(gaps_logged)}개, 검색 {len(gap_urls)}건")
    print(f"  제품 업종: {len(PRODUCT_TARGETS)}개")


if __name__ == "__main__":
    main()
