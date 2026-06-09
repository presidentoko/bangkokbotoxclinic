# PetBKK 사료 상세 페이지 + 공유 카드 스펙

**날짜:** 2026-06-09
**범위:** 사료 상세 페이지 리디자인 + Canvas 공유 카드 + OG 이미지

---

## 목표

사료 상세 페이지를 "검색하고 나가는 도구"에서 "공유하고 싶은 콘텐츠"로 바꾼다.

바이럴 루프:
```
유저 검색 → 상세 페이지 → 등급 확인 (자랑 or 충격)
→ [카드 저장] → 인스타 공유 → 팔로워 유입 → 반복
```

---

## 타겟 유저

방콕 반려동물 보호자 (기존 펫오너). 공유 트리거:
- **자랑형**: "내 개 A등급 사료 먹어"
- **경고형**: "이 사료 D등급인 줄 몰랐지?"

---

## 1. 사료 상세 페이지 (`/food/[slug]`)

### 1-1. 등급 히어로 (최상단)

```
브랜드명 (text-sm text-gray-500)
사료 이름 (text-2xl font-bold)

    [ A ]       ← 80px 원, 배경색은 등급별
  등급 A / 우수  ← 한 줄 요약 텍스트
"성분 N개 중 M개 우수"

[GradeBar]  ← 기존 컴포넌트 유지

[📸 성적표 카드 저장]  ← sticky, 상단 고정
```

등급 계산: `lib/petfood.ts`에 `getFoodGrade(food)` 신규 함수 추가.
`green/yellow/red/black_count` 필드 기반. 규칙:

| 등급 | 조건 |
|------|------|
| A | black=0, red=0, green≥70% |
| B | black=0, red≤1 |
| C | black=0, red≤3 |
| D | black≤1 |
| F | black≥2 |

등급별 배경색:

| 등급 | 원 배경 | 텍스트 |
|------|---------|--------|
| A | `#16a34a` | white |
| B | `#65a30d` | white |
| C | `#ca8a04` | white |
| D | `#ea580c` | white |
| F | `#dc2626` | white |

### 1-2. 영양 분석 섹션

기존 테이블 유지. 스타일만 `bg-white rounded-xl border p-4`로 통일.

### 1-3. 성분 신호등 섹션 (기존 IngredientList 교체)

성분을 색상별로 그룹핑해서 보여줌:

```
🟢 우수 성분 (12개)
  닭고기, 연어오일, 고구마, ...  (pill 형태, 펼쳐보기)

🟡 주의 성분 (4개)
  옥수수전분, 완두콩단백질, ...

🔴 위험 성분 (2개)
  BHA, 인공색소 적색3호
```

- 기본: 각 그룹 최대 5개 노출 + "더보기" 토글
- 블랙 성분이 있으면 상단에 경고 배너: "⚠️ 사용 금지 성분이 포함되어 있습니다"

### 1-4. 실제 반응 섹션

리뷰 데이터가 있을 때만 렌더링 (`food.reviews?.length > 0`).
현재 petfood.json에 리뷰 없음 → 섹션 숨김. 데이터 추가 시 자동 노출.

```ts
interface FoodReview {
  source: 'pantip' | 'watsons' | 'iherb'
  text: string
  rating?: number
  date?: string
}
```

### 1-5. 비슷한 사료 섹션

같은 `animal` + `life_stage` 조건, 현재 상품 제외, 점수 높은 순 3개.
가로 스크롤 카드 (`flex overflow-x-auto gap-3`).

점수 = `green_count / (green_count + yellow_count + red_count + black_count)` (0~1).

---

## 2. 공유 카드 컴포넌트 (`components/ShareCard.tsx`)

### 스펙

- 600×600px Canvas, PNG 다운로드
- 브라우저에서 생성 (서버 불필요)
- `html2canvas` 라이브러리 사용 (신규 의존성: `npm install html2canvas`)

### 카드 레이아웃

```
┌─────────────────────────────┐  600px
│  🐾 PetBKK          (우상)  │
│                              │
│  {brand}                     │  text-lg
│  {name_th or name_en}        │  text-2xl font-bold
│                              │
│         [ {grade} ]          │  80px 원, 등급색
│       등급 {grade} · {label} │
│                              │
│  🟢🟢🟢🟢🟢🟡🟡🔴           │  성분 도트 (최대 20개)
│  성분 {total}개              │
│                              │
│  단백질 {protein_dm}%         │
│  AAFCO {✅ or ❌}            │
│                              │
│  petbkk.com                  │  text-xs text-gray-400
└─────────────────────────────┘
```

배경 그라데이션 (등급별):
- A: `#f0fdf4` → `#dcfce7`
- B: `#f7fee7` → `#ecfccb`
- C: `#fefce8` → `#fef9c3`
- D: `#fff7ed` → `#ffedd5`
- F: `#fef2f2` → `#fee2e2`

### 다운로드 버튼

```tsx
// 상세 페이지 상단 sticky
<button onClick={downloadCard} className="...">
  📸 성적표 카드 저장
</button>
```

파일명: `petbkk-{slug}-grade-{grade}.png`

---

## 3. OG 이미지 (`/food/[slug]/opengraph-image.tsx`)

Next.js `ImageResponse` 사용 (서버사이드, `@vercel/og`).

사이즈: 1200×630px

```
┌──────────────────────────────────────────┐
│ 🐾                           [ A ]       │
│ Royal Canin                              │
│ อาหารลูกสุนัขพันธุ์เล็ก                  │
│                                          │
│ 성분 18개  🟢×12 🟡×4 🔴×2              │
│ 단백질 32% · AAFCO ✅                    │
│                                          │
│                             petbkk.com  │
└──────────────────────────────────────────┘
```

배경색: 등급별 (카드와 동일 팔레트).

---

## 4. 파일 맵

| 파일 | 작업 |
|------|------|
| `app/food/[slug]/page.tsx` | 전체 리라이트 |
| `app/food/[slug]/opengraph-image.tsx` | 신규 생성 |
| `components/ShareCard.tsx` | 신규 생성 |
| `components/IngredientGroups.tsx` | 신규 생성 (기존 IngredientList 대체) |
| `components/SimilarFoods.tsx` | 신규 생성 |
| `lib/petfood.ts` | `getFoodGrade()`, `getSimilarFoods()` 추가 |

---

## 5. 범위 외

- 병원 상세 페이지 (별도 스펙)
- 리뷰 데이터 수집 (별도 스크래퍼 작업)
- 즐겨찾기/저장 기능
- 사료 비교 기능
