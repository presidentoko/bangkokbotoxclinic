# Apify 6차 배치 — $5 x 4 계정 ($20)

액터는 전부 `compass/crawler-google-places` 하나다 (5차와 달리 contact-info-scraper 는 안 쓴다).

| # | 파일 | 내용 |
|---|------|------|
| 26 | `acct_26_thin_th.json` | 얇은 태국어 도 보강 — 검색 12건 |
| 27 | `acct_27_thin_th.json` | 얇은 태국어 도 보강 — 검색 12건 |
| 28 | `acct_28_thin_th.json` | 얇은 태국어 도 보강 — 검색 12건 |
| 29 | `acct_29_near_empty.json` | 공급사 1~4곳인 도 훑기 — 검색 35건 |

## 실행 방법

1. 액터 열고 Input 탭 → **JSON** 모드
2. 파일 내용 붙여넣고 Start
3. Dataset → Export → **JSON**
4. `data/apify_raw/2026-10-03/` 에 넣기 (파일명 그대로)

## 이번 배치가 노리는 것

클릭이 실제로 나오는 곳은 태국이다 (3개월 52클릭 중 30). 그런데 태국어
페이지가 있는 도 중 공급사가 60곳도 안 되는 데가 6곳이다:

| 도 | 공급사 |
|---|---|
| map_ta_phut | 22 |
| mukdahan | 31 |
| khon_kaen | 34 |
| si_racha | 53 |
| sa_kaeo | 54 |
| trat | 57 |

`khon_kaen` 은 "คลังสินค้า ขอนแก่น" 으로 54회 노출된 곳인데 창고가 5곳뿐이다.
태국어 도x업종 페이지는 **공급사 5곳부터** 생성되므로(lib/cityCategory.ts),
이 도들을 채우면 페이지가 바로 생긴다. 1~2곳 구간에 31개 조합이 더 있다.

계정 29 는 공급사가 1~4곳뿐인 도를 훑는다 — trang, satun, phatthalung,
loei, maha_sarakham, nong_bua_lam_phu, ang_thong. 산업 밀도가 낮아 우선순위는
마지막이지만 지금은 그 도 페이지에 보여줄 게 거의 없다.

## 일부러 뺀 것

- **영어 도x업종 3~4곳 구간 100개**: 문턱이 10이라 조합당 6~7곳이 더 필요하다.
  태국어 쪽 문턱이 5라서 같은 돈으로 페이지가 더 많이 생긴다.
- **좌표 미확인 단지 21곳**: IEAT 상세 페이지가 비어 있어(그래서 애초에 도
  정보도 없었다) 좌표 복구가 안 된다.
- **"산단 많은데 공급사 적은 도"**: 그런 축을 만들려다 Chonburi 43곳 /
  Prachinburi 0곳이라는 숫자를 봤는데 슬러그 불일치였다 (공식 "Chonburi" vs
  canonical "chon_buri", 실제 1,448곳 / 173곳). 집계 버그였고 축은 버렸다.

## 돈 안 드는 후속 정리

`pathumthanee`, `suphanburi`, `srisaket`, `"city"` 같은 슬러그 변형이
각각 공급사 1곳씩 들고 따로 서 있다. lib/cityNorm.ts 에 별칭을 더하면
본래 도로 합쳐진다 — 코드 작업이고 비용은 없다.
