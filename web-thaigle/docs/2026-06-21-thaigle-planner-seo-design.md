# Thaigle — 방콕 여행 플래너 + SEO/AEO 전략 설계

**날짜:** 2026-06-21  
**사이트:** thaigle.com  
**목표:** 플래너 우선 → 콘텐츠로 유입 (Approach B)

---

## 1. 핵심 방향

**thaigle.com = 방콕 여행 플래너 허브**

- 레스토랑 + 클리닉 + 덴탈 + 무에타이 + 웰니스를 한 플래너에
- 각 버티컬은 기존 사이트(bangkokbotoxclinic.com 등)의 데이터 재활용
- 플래너 링크 공유가 바이럴 채널 겸 SEO 채널

**주 타겟:**
1. 한국인 관광객 — 방콕 방문 목적: 맛집 + 시술 + 마사지
2. 외국인 관광객 전반 — 영어 콘텐츠 + AEO

**성공 지표:** 검색 유입 × 체류시간 × 플래너 공유 수 (풀 퍼널)

---

## 2. 플래너 아키텍처

### 저장 방식 (MVP → 확장)

**Phase 1 (MVP):** URL 기반, 서버리스
```
/plan?d=base64(JSON)
```
- 로그인 없음
- 완전 정적 — 서버 불필요
- URL이 곧 저장소

**Phase 2 (확장):** 단기 링크 + 계정
```
/p/ABC123  →  KV store (Upstash Redis)
계정 → 영구 리스트 저장, 팔로우
```

### 데이터 구조

```typescript
type PlanItem = {
  type: "restaurant" | "clinic" | "dental" | "wellness" | "gym";
  id: string;
  site: "thaigle" | "botox" | "dental" | "wellness"; // 어느 사이트 데이터인지
};

type Plan = {
  title: string;   // 기본값: "내 방콕 트립"
  items: PlanItem[];
};
```

### 멀티사이트 데이터 연결

각 버티컬 사이트에서 JSON export → `web-thaigle/data/` 에 복사:
```
data/restaurants/  ← 현재 master_db.json (3,269개)
data/clinics/      ← bangkokbotoxclinic.com export
data/dental/       ← bangkokbestclinic.com export
data/wellness/     ← 스파/마사지 데이터
data/gyms/         ← 무에타이짐 데이터
```

---

## 3. UI 컴포넌트

### ① 추가 버튼 (`<AddToPlannerButton>`)
- 레스토랑/클리닉/웰니스 카드 우측 하단
- 누르면 localStorage에 저장 + 하단 바 카운트 +1
- 이미 추가된 상태면 "✓ 추가됨" 표시

### ② 하단 고정 플래너 바 (`<PlannerBar>`)
- 저장된 항목 있을 때만 표시
- 항목 수 표시 + "플래너 보기 →" 버튼
- 모바일 fixed bottom, 데스크탑 fixed bottom-right

### ③ 플래너 페이지 (`/plan`)
레이아웃:
```
[제목 편집 가능]

카테고리별 그룹핑:
  🍜 맛집 (N)  — 카드 리스트
  💉 클리닉 (N)
  🦷 치과 (N)
  💆 웰니스 (N)
  🥊 무에타이 (N)

[카카오톡 공유]  [링크 복사]  [새 플래너]
```

### ④ 공유 OG 이미지 (`/plan/opengraph-image`)
동적 생성:
```
내 방콕 5일 플래너
맛집 3 · 클리닉 1 · 웰니스 1
[ thaigle.com ]
```

---

## 4. SEO/AEO 콘텐츠 전략

### 한국어 SEO (최우선)

신규 `/ko/guide/` 페이지 — 데이터 기반으로 블로그와 차별화:

| 페이지 | 타겟 키워드 |
|--------|-------------|
| `/ko/guide/방콕-4박5일-코스` | 방콕 여행 코스, 방콕 4박5일 |
| `/ko/guide/방콕-클리닉` | 방콕 클리닉 추천, 방콕 시술 |
| `/ko/guide/방콕-보톡스-가격` | 방콕 보톡스, 방콕 필러 가격 |
| `/ko/guide/방콕-치과` | 방콕 치과 추천, 방콕 임플란트 |
| `/ko/guide/방콕-마사지` | 방콕 마사지 추천, 방콕 스파 |
| `/ko/plan` | 방콕 여행 플래너 (플래너 소개 랜딩) |

### 영어 AEO

- `llms.txt` 카테고리별 top 10 데이터 추가 (클리닉, 웰니스 포함)
- FAQ 강화: "Is Bangkok good for medical tourism?", "Bangkok clinic vs Korea"
- Structured data: `MedicalClinic`, `HealthAndBeautyBusiness` schema 추가
- `/methodology` 페이지에 클리닉 신뢰도 알고리즘 설명 추가

### 플래너 자체 SEO

- `/plan` 페이지: "방콕 여행 플래너 무료", "Bangkok trip planner" 타겟
- 공유된 `/plan?d=xxx` URL이 SNS에 퍼지면 자연 백링크
- OG 카드 → 카톡 공유 → 수신자 클릭 → 유입

---

## 5. 구현 순서

### Phase 1 — 플래너 MVP (2-3일)
1. `PlannerContext` (localStorage 기반 상태 관리)
2. `AddToPlannerButton` 컴포넌트
3. `PlannerBar` 하단 고정 바
4. `/plan` 페이지 (URL decode + 렌더링)
5. OG 이미지 동적 생성
6. 카카오톡 공유 버튼

### Phase 2 — 멀티카테고리 데이터 (1-2일)
1. 클리닉 JSON export → `data/clinics/`
2. 덴탈 JSON export → `data/dental/`
3. 웰니스/무에타이 데이터 추가
4. 카테고리별 브라우저 페이지 (`/clinics`, `/wellness` 등)

### Phase 3 — 한국어 SEO 콘텐츠 (2-3일)
1. `/ko/guide/` 페이지 6개 신규 작성
2. `/ko/plan` 플래너 랜딩 페이지
3. 한국어 FAQ 추가

### Phase 4 — AEO 강화 (1일)
1. `llms.txt` 멀티카테고리 확장
2. Structured data schema 추가
3. Methodology 페이지 클리닉 섹션 추가

### Phase 5 — 단기 링크 (선택, 나중에)
1. Upstash Redis로 `/p/ABC123` 단축 URL
2. 공유 횟수 트래킹
