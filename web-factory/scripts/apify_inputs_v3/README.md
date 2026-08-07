# Apify 3차 배치 — $5 x 20 계정

3차는 신규 공급사 수집이 **아니라** 기존 8,379곳을 두껍게 만드는 데 쓴다.
이유와 근거는 `scripts/gen_apify_inputs_v3.py` 상단 주석 참고.

액터가 두 종류다. 파일마다 붙여넣을 액터가 다르니 표를 보고 맞춰서 실행할 것.

| # | 파일 | 액터 | 내용 |
|---|------|------|------|
| 01 | `acct_01_email.json` | `vdrmota/contact-info-scraper` | 웹사이트 871곳에서 이메일·전화·SNS 추출 |
| 02 | `acct_02_email.json` | `vdrmota/contact-info-scraper` | 웹사이트 871곳에서 이메일·전화·SNS 추출 |
| 03 | `acct_03_email.json` | `vdrmota/contact-info-scraper` | 웹사이트 871곳에서 이메일·전화·SNS 추출 |
| 04 | `acct_04_reviews.json` | `compass/crawler-google-places` | 업체 365곳 리뷰 본문 최대 15건씩 |
| 05 | `acct_05_reviews.json` | `compass/crawler-google-places` | 업체 365곳 리뷰 본문 최대 15건씩 |
| 06 | `acct_06_reviews.json` | `compass/crawler-google-places` | 업체 365곳 리뷰 본문 최대 15건씩 |
| 07 | `acct_07_reviews.json` | `compass/crawler-google-places` | 업체 365곳 리뷰 본문 최대 15건씩 |
| 08 | `acct_08_reviews.json` | `compass/crawler-google-places` | 업체 365곳 리뷰 본문 최대 15건씩 |
| 09 | `acct_09_reviews.json` | `compass/crawler-google-places` | 업체 365곳 리뷰 본문 최대 15건씩 |
| 10 | `acct_10_reviews.json` | `compass/crawler-google-places` | 업체 365곳 리뷰 본문 최대 15건씩 |
| 11 | `acct_11_reviews.json` | `compass/crawler-google-places` | 업체 365곳 리뷰 본문 최대 15건씩 |
| 12 | `acct_12_reviews.json` | `compass/crawler-google-places` | 업체 364곳 리뷰 본문 최대 15건씩 |
| 13 | `acct_13_reviews.json` | `compass/crawler-google-places` | 업체 364곳 리뷰 본문 최대 15건씩 |
| 14 | `acct_14_reviews.json` | `compass/crawler-google-places` | 업체 364곳 리뷰 본문 최대 15건씩 |
| 15 | `acct_15_reviews.json` | `compass/crawler-google-places` | 업체 364곳 리뷰 본문 최대 15건씩 |
| 16 | `acct_16_reviews.json` | `compass/crawler-google-places` | 업체 364곳 리뷰 본문 최대 15건씩 |
| 17 | `acct_17_reviews.json` | `compass/crawler-google-places` | 업체 364곳 리뷰 본문 최대 15건씩 |
| 18 | `acct_18_chemical_electronics_deep.json` | `compass/crawler-google-places` | 태국어 4개 용어 x 산단 4곳 신규 수집 |
| 19 | `acct_19_machining_metal_deep.json` | `compass/crawler-google-places` | 태국어 5개 용어 x 산단 4곳 신규 수집 |
| 20 | `acct_20_rubber_textile_deep.json` | `compass/crawler-google-places` | 태국어 5개 용어 x 산단 4곳 신규 수집 |

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
