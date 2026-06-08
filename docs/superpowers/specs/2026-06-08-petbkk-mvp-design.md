# PetBKK MVP Design Spec
_Date: 2026-06-08_

## Overview

방콕 반려동물 보호자를 위한 태국어 웹앱. 두 엔진을 라이트 MVP로 동시 런칭.

1. **펫푸드 성분 저격 엔진** — 사료 성분 신호등 + 어필리에이트 구매 링크
2. **동물병원 팩트체크 엔진** — 방콕 동물병원 지도 + 가격 정보

**타겟:** 태국 로컬 반려동물 보호자 (태국어 UI)
**수익화:** Shopee/Lazada 어필리에이트 링크 (MVP), 병원 예약 중개 (후속)

---

## Architecture

```
[스크래퍼]                  [데이터]                   [웹앱]
petfood/scraper.py    →  data/petfood.json   ─┐
                                               ├→  web-petbkk/  →  Vercel
petvet/scraper_grid.py →  data/hospitals.json ─┘
```

- **스택:** Next.js 16 + Tailwind CSS + TypeScript
- **데이터:** Static JSON (빌드타임 읽기) — DB 없음
- **배포:** Vercel (기존 패턴 동일)
- **데이터 갱신:** GitHub Actions cron (1일 1회) → Vercel rebuild trigger
- **폴더:** 기존 모노레포에 `web-petbkk/`, `petfood/`, `petvet/` 추가

---

## Data Schemas

### 펫푸드 (`data/petfood.json`)

```typescript
interface PetFood {
  id: string                    // "royal-canin-adult-maxi-10kg"
  brand: string                 // "Royal Canin"
  name_en: string
  name_th: string
  animal: "dog" | "cat"
  life_stage: "puppy" | "adult" | "senior"
  weight_kg: number
  price_thb: number
  price_per_kg: number          // 자동 계산
  buy_url: string               // Shopee/Lazada 어필리에이트 링크
  source_url: string            // 스크래핑 원본 URL

  // 영양성분 (보증분석치)
  protein_pct: number
  fat_pct: number
  fiber_pct: number
  moisture_pct: number

  // 건물 기준 자동 환산
  protein_dm: number            // protein_pct / (1 - moisture_pct/100)
  fat_dm: number
  aafco_meets: boolean          // 성견 18% / 자견 22% 기준

  // 성분 파싱
  ingredients: Ingredient[]
  green_count: number
  yellow_count: number
  red_count: number
  black_count: number

  updated_at: string
}

interface Ingredient {
  name: string
  grade: "green" | "yellow" | "red" | "black"
  position: number              // 성분표 내 순서 (1 = 첫 번째 = 가장 많음)
}
```

### 동물병원 (`data/hospitals.json`)

```typescript
interface Hospital {
  id: string                    // "animal-hospital-thonglor"
  name_th: string
  name_en: string
  address: string
  lat: number
  lng: number
  phone: string
  is_24h: boolean
  has_emergency: boolean
  has_surgery: boolean

  // 가격 (수집 가능한 경우만, 없으면 null)
  price_consult: number | null
  price_emergency_surcharge: number | null
  price_neuter_male: number | null
  price_neuter_female: number | null
  price_vaccine: number | null

  google_rating: number | null
  google_review_count: number | null
  google_place_id: string
  updated_at: string
}
```

---

## Frontend Pages

### `/` 홈
- 브랜드명 + 태국어 카피
- 중앙 검색창 (사료명/브랜드 검색)
- 카드 2개: [🐾 ตรวจสอบอาหารสัตว์เลี้ยง] [🏥 หาโรงพยาบาลสัตว์]

### `/food` 사료 목록
- 필터: 동물(개/고양이) | 연령(자견/성견/시니어) | 정렬(초록많은순/가격순)
- 카드 그리드: 브랜드, 제품명, `[🟢14 🟡3 🔴1 ⚫0]` 스코어 배지, kg당 가격

### `/food/[slug]` 사료 상세
- 성분 신호등 배지 (대형)
- 성분 전체 리스트 — 각 항목에 색상 뱃지, RED/BLACK은 강조 표시
- 영양 테이블: 원물 기준 / 건물 기준 탭 전환 + AAFCO 충족 여부 ✓/✗
- CTA: `[🛒 ซื้อราคาถูกสุด]` → 어필리에이트 링크

### `/hospital` 병원 목록
- 상단 토글: 지도 보기 / 목록 보기
- 지도: Google Maps embed, 24시 = 빨간 핀, 일반 = 파란 핀
- 필터: 24시간 | 응급 | 수술 가능
- 카드: 병원명, GPS 거리, 24h 뱃지, 구글 평점, 기본 진료비

### `/hospital/[slug]` 병원 상세
- 기본 정보: 이름, 주소, 전화, 영업시간
- 가격표: 수집 항목만 표시, 없으면 `ไม่ระบุ`
- 구글 평점 + 리뷰 수
- 버튼: `[📞 โทรเลย]` `[🗺️ นำทาง]`

---

## Scrapers

### 펫푸드 스크래퍼 (`petfood/scraper.py`)

**타겟 소스 (우선순위):**
1. `royalcanin.com/th` — 구조화된 성분 데이터
2. `hillspet.com/th`
3. `petnme.com` — 로컬 최대 펫샵
4. `makro.pro` — 가격 신뢰도 높음

**파이프라인:**
```
사이트 크롤링 (Playwright)
→ 제품 페이지 성분 텍스트 추출
→ 쉼표 기준 파싱
→ ingredient_grades.py 테이블 매칭 → GREEN/YELLOW/RED/BLACK
→ 영양수치 파싱 → 건물기준 환산 → AAFCO 체크
→ petfood.json 출력
```

**성분 등급 테이블 (`petfood/ingredient_grades.py`):**
- GREEN: Salmon, Chicken, Beef, Sweet Potato 등 명확한 원물
- YELLOW: Rice, Pea, Corn, Wheat 등 알레르기 가능성
- RED: Poultry by-product meal, Animal fat (출처 불명)
- BLACK: BHA, BHT, Ethoxyquin, 인공착색료

**OCR fallback:** 성분이 이미지인 경우 `pytesseract` → Google Vision API

### 동물병원 스크래퍼 (`petvet/scraper_grid.py`)

기존 `bangkok_clinics/scraper_grid.py` 재활용. 변경 사항만:

```python
SEARCH_QUERIES = [
    ("โรงพยาบาลสัตว์", "th_vet"),
    ("animal hospital", "en_vet"),
    ("คลินิกสัตว์เลี้ยง", "th_clinic"),
]
GRID_CENTER_LAT = 13.7462890
GRID_CENTER_LNG = 100.5346890
CITY_OUTPUT_DIR = "../petvet_output"
```

가격 데이터: 구글맵 리뷰 텍스트 마이닝 + 병원 웹사이트 크롤링. MVP에서 없으면 null.

---

## Monetization (MVP)

- 사료 상세 페이지 CTA → Shopee/Lazada 어필리에이트 트래킹 URL
- 수수료: 결제 금액의 5~10%
- 병원 예약 중개는 MVP 이후 (트래픽 확보 후)

---

## Out of Scope (MVP 이후)

- 알레르기 프로필 필터 ("내 새끼" 맞춤)
- 1일 급여량 가성비 계산기
- 실시간 병원 대기 상태
- 영수증 인증 리뷰 피드
- 유저 계정/로그인
- PB 사료 기획
