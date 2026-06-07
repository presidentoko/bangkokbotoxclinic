# Golf Killer Features — Design Spec
**Date:** 2026-06-07  
**Project:** web-golf (thailandgolfguide.com)  
**Status:** Approved

---

## 1. 목표

Thailand Golf Guide에 세 가지 킬러 기능을 추가한다:

1. **① All-Inclusive 가격 비교** — 그린피+캐디+카트 찐 총액 기준 정렬
2. **② 실시간 잔여 티타임** — 방콕 권역 주말 모닝 슬롯 모아보기
3. **③ 날씨/배수 현황 알림** — 우기 대응, 코스별 라운딩 가능 여부 신호등

---

## 2. 플랫폼 전환

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 호스팅 | Cloudflare Pages (정적) | Vercel (ISR 지원) |
| next.config.ts | `output: "export"` | 해당 줄 제거 |
| vercel.json | 이미 존재 (`regions: sin1`) | 그대로 사용 |

`output: "export"` 한 줄 제거만으로 ISR 활성화. vercel.json은 이미 web-golf/에 구성됨.

---

## 3. 전체 아키텍처

```
[GitHub Actions Cron]
  ├── 매 6시간  → price_scraper.py   → data/price_matrix.json 커밋
  ├── 매 30분   → tee_scraper.py     → public/tee_times.json 커밋 (변경 시만)
  └── 매일 03:00 → drainage_nlp.py  → data/master_db.json drainage_score 업데이트

[Vercel]
  ├── JSON 커밋 감지 → 자동 재배포 (2~3분)
  ├── /price-compare  → price_matrix.json 빌드타임 베이크인 (정적)
  ├── /tee-times      → public/tee_times.json 정적 서빙
  └── /conditions     → ISR revalidate=3600, OpenWeatherMap API 호출

[OpenWeatherMap API]
  └── 코스 lat/lng 기준 최근 7일 강수량 → 배수 위험도 계산
```

**갱신 주기:**
- 가격: 6시간
- 티타임: 30분
- 날씨/배수: 1시간 (ISR)
- 배수 점수: 1일 1회 (리뷰 NLP)

---

## 4. 데이터 스키마

### 4-1. `data/price_matrix.json`
```json
[
  {
    "course_id": "ChIJ...",
    "scraped_at": "2026-06-07T10:00:00Z",
    "source_agency": "ThailandGolfCentre",
    "source_url": "https://...",
    "weekday": {
      "morning":  { "greenfee": 1500, "caddy": 400, "cart": 900 },
      "twilight": { "greenfee": 800,  "caddy": 400, "cart": 900 }
    },
    "weekend": {
      "morning":  { "greenfee": 2200, "caddy": 400, "cart": 900 },
      "twilight": { "greenfee": 1200, "caddy": 400, "cart": 900 }
    },
    "notes": "Caddy mandatory. Cart optional on weekdays."
  }
]
```

### 4-2. `public/tee_times.json`
```json
{
  "updated_at": "2026-06-07T10:30:00Z",
  "slots": [
    {
      "course_id": "ChIJ...",
      "course_name": "Alpine Golf Club",
      "date": "2026-06-08",
      "time": "07:12",
      "agency": "ThailandGolfCentre",
      "booking_url": "https://...",
      "total_baht": 3200,
      "available": true
    }
  ]
}
```

### 4-3. `data/master_db.json` 추가 필드 (코스당)
```json
{
  "drainage_score": 72,
  "drainage_keywords": ["waterlogged", "น้ำท่วม", "수중전"],
  "drainage_mentions": 3
}
```

---

## 5. 스크래퍼 설계

### 5-1. `scripts/price_scraper.py`
- **타겟:** ThailandGolfCentre.com, GolfAsian.com, MonkeyTravel.com
- **매칭:** 에이전시 코스명 ↔ master_db 코스명 rapidfuzz 퍼지 매칭 (85% threshold)
- **렌더링:** requests + BeautifulSoup 기본, JS 필요 시 Playwright 폴백
- **출력:** `data/price_matrix.json` 덮어쓰기
- **미매칭:** `data/unmatched_prices.json` 에 별도 저장

### 5-2. `scripts/tee_scraper.py`
- **타겟:** 동일 에이전시 3곳의 예약 캘린더 엔드포인트
- **범위:** 오늘 + 앞 7일치 슬롯
- **최적화:** 이전 결과와 diff, 변경 없으면 커밋 스킵
- **직영 시스템:** 1차에서는 딥링크 URL만, 2차에 API 연동
- **출력:** `public/tee_times.json` 덮어쓰기

### 5-3. `scripts/drainage_nlp.py`
- **입력:** `master_db.json` 의 `scraped_reviews` 필드
- **키워드:**
  ```python
  DRAINAGE_BAD  = ["waterlogged","flooded","น้ำท่วม","수중전","물 고임","배수 안","ระบายน้ำ"]
  DRAINAGE_GOOD = ["drains well","fast drainage","배수 좋","ระบายน้ำดี"]
  score = clamp(100 - bad_count*15 + good_count*10, 0, 100)
  ```
- **출력:** master_db.json 내 `drainage_score`, `drainage_keywords`, `drainage_mentions` 업데이트

---

## 6. UI 페이지

### 6-1. `/price-compare`
- **필터:** 주중/주말 · 모닝/트와일라잇 · 지역
- **정렬 기본값:** 찐 총액 (그린피+캐디+카트) 오름차순
- **테이블 컬럼:** 코스명 · 그린피 · 캐디 · 카트 · **찐 총액** · 예약 링크
- **가격 없는 코스:** "가격 미확인" 뱃지, 리스트 하단 배치

### 6-2. `/tee-times`
- **필터:** 오늘/이번 주말/다음 주말 · 06:00~10:00 모닝 · 지역
- **레이아웃:** 날짜별 그룹 → 시간순 슬롯 타임라인
- **슬롯 카드:** 시간 · 코스명 · 에이전시 뱃지 · 총액 · "예약→" CTA
- **타임스탬프:** "Updated N분 전" 우측 상단

### 6-3. `/conditions` + 코스 상세 페이지 뱃지
- **신호등 기준:**
  - 🟢 정상: drainage_score ≥ 70 AND 최근 7일 강수 < 30mm
  - 🟡 주의: drainage_score 40~69 OR 강수 30~60mm
  - 🔴 위험: drainage_score < 40 OR 강수 > 60mm
- **`/conditions` 페이지:** 방콕 권역 코스를 신호등 기준 정렬
- **코스 상세 페이지:** 신호등 뱃지 + "최근 7일 강수량 Xmm" 텍스트 추가

---

## 7. GitHub Actions 워크플로우

### `.github/workflows/scrape-prices.yml`
```yaml
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install requests beautifulsoup4 rapidfuzz playwright
      - run: python scripts/price_scraper.py
      - run: |
          git config user.email "actions@github.com"
          git config user.name "GitHub Actions"
          git diff --quiet || (git add data/price_matrix.json && git commit -m "data: price_matrix update" && git push)
```

### `.github/workflows/scrape-teetimes.yml`
```yaml
on:
  schedule:
    - cron: '*/30 * * * *'
  workflow_dispatch:
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install requests beautifulsoup4 playwright
      - run: python scripts/tee_scraper.py
      - run: |
          git config user.email "actions@github.com"
          git config user.name "GitHub Actions"
          git diff --quiet || (git add public/tee_times.json && git commit -m "data: tee_times update" && git push)
```

### `.github/workflows/drainage-nlp.yml`
```yaml
on:
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:
jobs:
  nlp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install rapidfuzz
      - run: python scripts/drainage_nlp.py
      - run: |
          git config user.email "actions@github.com"
          git config user.name "GitHub Actions"
          git diff --quiet || (git add data/master_db.json && git commit -m "data: drainage scores update" && git push)
```

---

## 8. 환경변수 / Secrets

| 키 | 위치 | 용도 |
|----|------|------|
| `OPENWEATHERMAP_API_KEY` | Vercel 환경변수 | /conditions ISR 날씨 호출 |
| `GITHUB_TOKEN` | GH Actions 기본 제공 | Actions에서 push |

---

## 9. 구현 순서 (권장)

1. `next.config.ts` — `output: "export"` 제거, Vercel 배포 확인
2. `drainage_nlp.py` — 기존 DB 데이터로 즉시 실행 가능
3. `/conditions` 페이지 — 배수 점수 + 날씨 ISR
4. `price_scraper.py` + `/price-compare` 페이지
5. `tee_scraper.py` + `/tee-times` 페이지
6. GitHub Actions 워크플로우 3개 등록
7. 코스 상세 페이지에 신호등 뱃지 통합
