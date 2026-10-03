# Apify 5차 배치 — $5 x 5 계정 ($25)

⚠️ **4차와 달리 액터가 두 종류다.** 파일마다 맞는 액터를 쓸 것.

| # | 파일 | 액터 | 내용 |
|---|------|------|------|
| 21 | `acct_21_email.json` | `vdrmota/contact-info-scraper` | 이메일·연락처 추출 — 도메인 553개 |
| 22 | `acct_22_email.json` | `vdrmota/contact-info-scraper` | 이메일·연락처 추출 — 도메인 553개 |
| 23 | `acct_23_email.json` | `vdrmota/contact-info-scraper` | 이메일·연락처 추출 — 도메인 552개 |
| 24 | `acct_24_cosmetics_medical.json` | `compass/crawler-google-places` | 얇은 버티컬 보강: cosmetics_medical — 검색 36건 |
| 25 | `acct_25_furniture_wood.json` | `compass/crawler-google-places` | 얇은 버티컬 보강: furniture_wood — 검색 30건 |

## 실행 방법

1. 표의 액터를 Apify 콘솔에서 연다
2. Input 탭 → 오른쪽 위에서 **JSON** 모드로 전환
3. 파일 내용을 그대로 붙여넣고 Start
4. 끝나면 Dataset → Export → **JSON**
5. 받은 파일을 `data/apify_raw/2026-10-03/` 에 넣는다 (파일명 그대로 유지)
6. 전부 끝나면 알려줄 것 — 병합·리빌드·배포는 내가 한다

## 이번 배치가 노리는 것

- **이메일 (계정 21~23)**: 자사 도메인이 있는데 이메일이 없는 공급사가
  1,898곳이다. 현재 이메일 보유는 1,191곳 — 전체의 13%. 커미션 모델에서
  파트너 공장을 모으려면 먼저 연락할 방법이 필요한데, 전화는 태국어 통화라
  장벽이 있고 이메일이 영문 제안서를 보낼 수 있는 유일한 채널이다.
  verified·리뷰 많은 순으로 정렬해 뒀다 — 크레딧이 떨어져도 값어치 큰
  쪽부터 확보된다.
- **버티컬 (계정 24~25)**: `/oem/medical-devices` 16곳, `/oem/cosmetics`
  33곳, `/oem/furniture` 38곳. 이미 만들어 검색 노출 준비가 끝난 페이지인데
  목록이 빈약하다. 신규 페이지를 더 만드는 것보다 이쪽이 효율이 낫다.

## 일부러 뺀 것

- 리뷰 5~9건 구간 929곳: 4차에서 1,115곳을 돌렸고 결과를 아직 못 봤다.
  리뷰가 순위를 움직이는지 확인한 뒤에 쓴다.
- 좌표 미확인 단지 21곳: 이름만 검색하면 오매칭이 많다. 좌표를 다시 받는
  코드 작업이 먼저다.

## 주의

- `python scripts/rebuild_master_db.py` 는 **`--skip-apify` 없이** 돌릴 것.
  2026-10-02 에 그 플래그로 master_db 가 8,977 → 2,963 으로 떨어졌다.
- 이메일 병합은 `scripts/merge_contact_emails.py` 가 website 호스트로 매칭한다.
  리빌드가 자동으로 호출하므로 따로 돌릴 필요는 없다.
