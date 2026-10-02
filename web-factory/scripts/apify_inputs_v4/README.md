# Apify 4차 배치 — $5 x 20 계정

액터는 **전부 `compass/crawler-google-places` 하나**다. 3차처럼 파일마다
다른 액터를 쓰지 않는다.

## 실행 방법

1. Apify 콘솔에서 해당 액터를 연다
2. Input 탭 → JSON 모드로 바꾼다
3. 아래 표의 파일 내용을 그대로 붙여넣고 Start
4. 끝나면 Dataset → Export → JSON 으로 내려받는다
5. 받은 파일을 `data/apify_raw/2026-10-02/` 에 넣는다 (파일명은 `dataset_crawler-google-places_*.json` 형태 유지 — 파서가 그 패턴으로 찾는다)
6. `python scripts/rebuild_master_db.py` 후 빌드·배포

계정당 상한은 700 places, 리뷰 2건으로 잡았다.
$5 를 넘기면 Apify 가 중간에 멈추는데, 병합은 place_id 기준 idempotent 라서
중단된 데이터셋을 그대로 export 해도 안전하다.

| # | 파일 | 내용 |
|---|------|------|
| 01 | `acct_01_estates.json` | 산업단지 입주사 — 검색 31건 |
| 02 | `acct_02_estates.json` | 산업단지 입주사 — 검색 31건 |
| 03 | `acct_03_estates.json` | 산업단지 입주사 — 검색 31건 |
| 04 | `acct_04_estates.json` | 산업단지 입주사 — 검색 31건 |
| 05 | `acct_05_estates.json` | 산업단지 입주사 — 검색 30건 |
| 06 | `acct_06_estates.json` | 산업단지 입주사 — 검색 30건 |
| 07 | `acct_07_estates.json` | 산업단지 입주사 — 검색 30건 |
| 08 | `acct_08_estates.json` | 산업단지 입주사 — 검색 30건 |
| 09 | `acct_09_gaps.json` | 문턱 아래 도x업종 — 검색 32건 |
| 10 | `acct_10_gaps.json` | 문턱 아래 도x업종 — 검색 32건 |
| 11 | `acct_11_gaps.json` | 문턱 아래 도x업종 — 검색 32건 |
| 12 | `acct_12_gaps.json` | 문턱 아래 도x업종 — 검색 32건 |
| 13 | `acct_13_gaps.json` | 문턱 아래 도x업종 — 검색 32건 |
| 14 | `acct_14_gaps.json` | 문턱 아래 도x업종 — 검색 32건 |
| 15 | `acct_15_bathroom_sanitary.json` | 제품 업종 보강: bathroom_sanitary — 검색 30건 |
| 16 | `acct_16_chocolate_confectionery.json` | 제품 업종 보강: chocolate_confectionery — 검색 24건 |
| 17 | `acct_17_cold_chain.json` | 제품 업종 보강: cold_chain — 검색 24건 |
| 18 | `acct_18_rice_grain.json` | 제품 업종 보강: rice_grain — 검색 18건 |
| 19 | `acct_19_reserve.json` | 예비 — 실패분 재시도용 (단지 검색 13건) |
| 20 | `acct_20_reserve.json` | 예비 — 실패분 재시도용 (단지 검색 13건) |

## 이번 배치가 노리는 것

- **계정 01~08 (단지)**: 공식 단지 83곳 중 입주사가 매칭된 건 11곳뿐이다.
  단지 운영사(Amata·WHA)가 광고를 살 수 있는 쪽이고, 그들에게 보여줄 근거가
  "단지 목록" 에서 "입주사 목록" 으로 올라간다.
- **계정 09~14 (문턱)**: 아래 조합들이 페이지 생성 문턱 바로 밑에 있다. 대상 71개:

  surat_thani/equipment (9), chachoengsao/plastic (9), songkhla/rubber (9), pathum_thani/auto_parts (9), sa_kaeo/warehouse (9), prachin_buri/food_mfg (9), samut_sakhon/steel (9), trat/warehouse (9), mukdahan/warehouse (9), si_racha/logistics (9), si_racha/auto_parts (9), phra_nakhon_si_ayutthaya/equipment (8), rayong/rubber (8), nakhon_pathom/equipment (8), nakhon_pathom/logistics (8), chon_buri/rubber (8), songkhla/plastic (8), samut_prakan/rubber (8), chiang_mai/logistics (8), pathum_thani/plastic (8), mukdahan/manufacturer (8), samut_sakhon/warehouse (8), rayong/machining (7), chachoengsao/chemical (7), pathum_thani/machining (7), rayong/food_mfg (7), samut_sakhon/logistics (7), rayong/steel (6), songkhla/machining (6), prachin_buri/auto_parts (6), phra_nakhon_si_ayutthaya/food_mfg (6), chachoengsao/machining (6), chiang_mai/food_mfg (6), chachoengsao/equipment (5), songkhla/food_mfg (5), chiang_mai/equipment (5), nakhon_ratchasima/auto_parts (5), khon_kaen/warehouse (5), ratchaburi/manufacturer (5), lamphun/logistics (5) …

- **계정 15~18 (제품)**: 욕실가구·위생도기는 8곳뿐이고 그중 실제 제조사는
  TOTO 하나다. 2026-10-02 에 욕실가구 OEM 공장이 직접 문의해서 확인된 공백이다.

## 받은 뒤 확인할 것

병합 후 `python scripts/rebuild_master_db.py` 결과에서:

- `total_suppliers` 가 줄지 않았는지 (줄면 CSV/Apify 쪽 문제)
- 단지 입주사: `/estate` 에서 입주사 매칭 단지 수가 11 → 몇으로 늘었는지
- 문턱: 도x업종 페이지 수가 172 → 몇으로 늘었는지
- **`--skip-apify` 로 돌리지 말 것** — master_db 가 CSV 기준으로 축소된다
  (2026-10-02 에 실제로 8,977 → 2,963 으로 떨어뜨렸다)
