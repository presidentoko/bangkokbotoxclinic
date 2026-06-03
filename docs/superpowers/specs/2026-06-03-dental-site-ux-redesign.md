# bangkokbestclinic.com UX Redesign — Design Spec

- **Date:** 2026-06-03
- **Status:** Approved design (pre-implementation)
- **Site:** `bangkokbestclinic.com` (`web/` with `NEXT_PUBLIC_SITE_FOCUS=dental`)
- **Goal:** Maximize in-site lead capture (user contacts clinic via our booking form, not Google Maps)

## 1. Problem

Three simultaneous blockers prevent conversion:
- **A: CTA 위치** — 예약폼이 스크롤 한참 아래 숨어있음
- **B: 신뢰 부족** — Trust Score는 있지만 가격 불확실성이 행동을 막음
- **C: 가격 정보 없음** — 의료관광객은 얼마인지 모르면 연락 안 함

## 2. Solution: "Trust → Price → CTA" Flow

의료관광객 결정 심리에 맞춘 3단계 흐름:
페이지 구조를 신뢰 확인 → 가격 확인 → 연락 행동 순으로 재배치.

---

## 3. Clinic Profile Page (`/clinic/[id]`)

### 3a. Sticky Contact Bar (NEW)
페이지 상단 고정 바. 스크롤 위치 무관하게 항상 보임.

```
[Clinic Name]              [📞 Call]  [💬 LINE]  [Book Free Consultation →]
```

- 클리닉 이름 truncate (max 30자)
- 전화번호 있으면 `tel:` 링크
- LINE 있으면 LINE 딥링크
- "Book" 버튼 → 아래 CTA 카드로 스크롤
- 구현: `web/components/StickyClinicBar.tsx` (신규)

### 3b. Hero Block (수정)
```
[Clinic Name]
★ 4.8  ·  210 reviews  ·  Bangkok
Trust Score 84  ████████░░  "Top 5% of Bangkok dental clinics"
```

- Trust Score 바는 현재 TrustDonut에서 인라인 바 형태로 변경
- "Top N% of Bangkok dental clinics" 퍼센타일 문구 추가
  - 계산: `applySiteFilter` 결과 내 Trust Score 순위
  - 표시 조건: Trust Score ≥ 60 이상 클리닉만 표시

### 3c. Price Transparency Block (NEW)
리뷰 `spent_amount` 데이터에서 절차별 가격 범위 자동 추출.

```
💰 Typical prices at this clinic
──────────────────────────────────
Implants        ฿45,000 – 75,000
Veneers         ฿15,000 – 28,000
Whitening        ฿6,000 – 10,000
──────────────────────────────────
Sourced from 12 patient reviews · Prices are estimates
```

- `spent_amount` 필드에서 `฿XX,XXX` 패턴 파싱
- 리뷰 텍스트 키워드로 절차 분류 (implant/veneer/whitening/crown)
- 데이터 없으면 블록 숨김 (빈 상태 노출 금지)
- 면책 문구: "Prices are estimates from patient reviews, not clinic quotes"
- 구현: `web/lib/priceEstimates.ts` (신규) + `web/components/ClinicPriceBlock.tsx` (신규)

### 3d. CTA Card (폴드 안으로 이동)
```
┌────────────────────────────────────────┐
│  Get a Free Dental Consultation        │
│  ✓ No obligation  ✓ English-speaking   │
│  ⏱ Usually responds within 2 hours    │
│                                         │
│  [Book Consultation →]                  │
│  ─── or ───                            │
│  [📞 Call directly]  [💬 LINE / WhatsApp] │
└────────────────────────────────────────┘
```

- Trust Score 블록 바로 아래 배치 (폴드 안)
- "Book Consultation" → 기존 `BookingForm` 모달 트리거
- "2 hours" 응답 시간: 고정 문구 (나중에 실제 데이터로 교체 가능)
- 구현: `web/components/ClinicCtaCard.tsx` (신규)

### 3e. Google Maps 링크 하단 이동
- 현재 상단에 노출되는 maps_url 링크를 페이지 하단 "Directions" 섹션으로 이동
- 이탈 방지

---

## 4. Homepage (`/`)

### 4a. 제거 항목
- ClinicSpinWheel
- TrustScoreGame
- RecentBookingsTicker
- PartnerLogosWall
- ClinicLeaderboard
- CostCalculator (가이드 페이지로 링크로 대체)

### 4b. 새 구조 (위→아래)

**Hero**
```
Bangkok Best Dental Clinic
Find trusted dental clinics in Bangkok — real prices, real reviews.
[🔍 Search clinics or procedures...]
```

**Top Clinics (6개)**
- Trust Score 순 정렬
- 카드: 이름 + 별점 + 리뷰수 + 가격범위 한 줄 (implants부터)
- "View all →" 링크

**Procedure Cards**
```
🦷 Implants  💎 Veneers  ✨ Whitening  📐 Orthodontics  🩺 Root Canal
```
각 카드 → `/implants/bangkok` 등 procedure×city 페이지

**Why Bangkok (숫자로)**
```
1,608 dental clinics   ·   50–70% cheaper than US/UK   ·   English-speaking staff
```

**Guide Links (3개)**
Implants Cost Guide · Veneers Price Guide · Whitening Guide

**City Browse**
Bangkok · Pattaya · Phuket · Chiang Mai

---

## 5. For-Clinics Page (`/for-clinics`)

### 5a. Traffic Banner (NEW, 상단 추가)
```
📊 This month: 12,400+ dental visitors to Bangkok searched on this site
Most common intent: "dental implant clinic Bangkok", "veneers Bangkok price"
```
- 숫자: master_db `total_clinics` 기반으로 정적 계산 (실제 GA 연결 전까지 추정치)
- 추후 Vercel Analytics 연결 시 실데이터로 교체

### 5b. ROI Calculator Widget (NEW)
```
How many leads could you get?

City:      [ Bangkok ▼ ]
Procedure: [ Implants ▼ ]

Estimated leads/month:    ~18
Your cost per lead:        ฿50
Monthly investment:        ฿900

vs. Google Ads:  ฿3,000–8,000/month for same keywords

[Get Started Free →]
```

- 추정 리드 수: `master_db` dental 클리닉 수 + 절차별 가중치로 계산한 정적 룩업 테이블
- 실데이터 아님을 `*` 주석으로 명시 ("Based on site traffic estimates")
- 구현: `web/components/RoiCalculator.tsx` (신규)

---

## 6. Data Requirements

| 기능 | 데이터 소스 | 비고 |
|------|------------|------|
| 가격 범위 블록 | `clinic.reviews[].spent_amount` | 파싱 로직 `priceEstimates.ts` |
| Trust Score 퍼센타일 | `master_db.clinics` + `applySiteFilter` | 빌드 타임 계산 |
| ROI 계산기 | 정적 룩업 테이블 | 추정치, GA 데이터 아님 |
| 트래픽 배너 | 정적 문구 | 추후 Vercel Analytics 연결 |

---

## 7. New Components Summary

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| StickyClinicBar | `web/components/StickyClinicBar.tsx` | 스크롤 고정 연락 바 |
| ClinicPriceBlock | `web/components/ClinicPriceBlock.tsx` | 절차별 가격 범위 표시 |
| ClinicCtaCard | `web/components/ClinicCtaCard.tsx` | 폴드 안 예약 CTA |
| RoiCalculator | `web/components/RoiCalculator.tsx` | For-Clinics ROI 위젯 |
| priceEstimates.ts | `web/lib/priceEstimates.ts` | spent_amount 파싱 유틸 |

기존 컴포넌트 수정:
- `web/app/clinic/[id]/page.tsx` — 새 컴포넌트 배치 + maps_url 하단 이동
- `web/app/page.tsx` — 불필요 위젯 제거 + 새 구조 적용
- `web/app/for-clinics/page.tsx` — 트래픽 배너 + ROI 위젯 추가

---

## 8. Out of Scope (이번 구현 제외)

- 대시보드 클리닉 오너용 리드 현황 (별도 플랜)
- GA/Vercel Analytics 실데이터 연동
- A/B 테스트 인프라
- 모바일 앱
- bangkokbotoxclinic.com 적용 (치과 사이트 검증 후)

---

## 9. Success Metrics

- 클리닉 프로필에서 BookingForm 제출수 증가
- For-Clinics 페이지 "Get Started" 클릭률 증가
- 홈페이지 이탈률 감소 (게임/위젯 제거 효과)
