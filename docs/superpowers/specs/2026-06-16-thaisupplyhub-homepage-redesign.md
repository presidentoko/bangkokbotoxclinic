# ThaiSupplyHub Homepage Redesign Spec

**Date:** 2026-06-16  
**Goal:** 공장을 찾는 사업가가 홈에서 바로 원하는 섹터를 발견하고 공급사 리스트까지 빠르게 도달할 수 있도록 UI 개선.

---

## 배경

현재 홈페이지는 검색바 + 작은 카테고리 필 + Top 50 리스트 나열 구조. "그냥 나열"로 느껴지며 사업가가 자신의 섹터를 빠르게 찾기 어려움. 주요 사용 패턴: 검색 또는 카테고리 탐색.

---

## 변경 범위

`web-factory/app/page.tsx` 홈페이지만. 개별 공급사 페이지·카테고리 페이지는 이번 스코프 밖.

---

## 섹션 구조 (위→아래)

### 1. Hero — 현재 유지
- 검색바, stats바 그대로
- 변경 없음

### 2. 섹터 카드 그리드 (신규)
현재 소형 카테고리 필 (`By Type` 섹션) 을 교체.

**레이아웃:** `grid-cols-2 md:grid-cols-3`, 카드 6~8개

**카드 1개 구성:**
```
[아이콘]  [섹터명]
[N] suppliers
[N] DBD-verified
📍 [Top city]
```

**표시 카테고리 (master_db category_counts 기준 상위):**
- Manufacturers 🏭
- Auto Parts 🚗
- Warehouses 📦
- Industrial Estates 🏘️
- Logistics 🚚
- Food Manufacturers 🍱
- (나머지는 기존 필 방식으로 "More categories →" 링크)

**카드 데이터 계산 (빌드 타임):**
- `supplier count` — `category_counts[cat]`
- `dbd count` — suppliers where `categories.includes(cat) && dbd !== null`
- `top city` — 해당 카테고리 suppliers 중 city_label 최빈값

**클릭:** `/c/[category]` 이동

### 3. Manifesto 3-card — 현재 유지
변경 없음 (위치만 섹터 카드 아래로 이동)

### 4. Featured 6 / Industrial estates spotlight — 제거
섹터 카드가 이 역할을 흡수함. 페이지 길이 단축.

### 5. Top 10 리스트 (축소)
현재 Top 50 → **Top 10**으로 줄임.

**Sticky 필터바** (리스트 바로 위, 스크롤 시 상단 고정):
```
[Category ▼]  [Province ▼]  [☐ DBD Verified only]
```
- 필터는 클라이언트 사이드 JS (정적 사이트, 서버 없음)
- `Category` — master_db 카테고리 목록 드롭다운
- `Province` — city_counts 기준 드롭다운
- `DBD Verified only` — 체크박스 토글

필터 적용 시 10개 리스트를 실시간 재정렬/필터. 검색 인덱스는 빌드 타임에 `searchIndex` 배열로 page.tsx에서 client component에 prop으로 전달.

리스트 하단: **"View all 5,263 suppliers →"** → `/best/highly-recommended` (전체 신뢰점수 랭킹 페이지)

### 6. Blog / Guides / Best of / District — 현재 유지
크기 변경 없음, 순서 유지

### 7. FAQ — 현재 유지

---

## 구현 파일

| 파일 | 변경 |
|------|------|
| `app/page.tsx` | 섹터 카드 섹션 추가, Featured 6·Industrial estates 제거, Top 50→10 |
| `components/SectorCard.tsx` | 신규 — 섹터 카드 컴포넌트 |
| `components/SupplierListWithFilter.tsx` | 신규 — sticky 필터바 + 리스트 client component |

---

## 데이터 흐름

```
page.tsx (server, build-time)
  └─ loadMasterDb()
  └─ 카테고리별 집계 (supplier count, dbd count, top city) 계산
  └─ searchIndex 배열 생성 (id, name, city, categories, dbd)
  └─ SectorCard[] 렌더 (static)
  └─ SupplierListWithFilter에 top 10 + searchIndex prop 전달
       └─ "use client" — 필터 상태 관리, 실시간 필터링
```

---

## 스코프 밖

- 개별 공급사 페이지 CTA (별도 스펙)
- 모바일 필터 모달 (데스크톱 우선)
- URL 파라미터 연동 필터 (정적 사이트 제약)
