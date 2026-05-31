# 클러스터 B — Trust Score 일원화 + 설명 + 모바일 카드 (설계)

- 날짜: 2026-05-31
- 프로젝트: `web-factory` (Thai Supply Hub, 정적 export / Cloudflare Pages)
- 범위: Trust Score를 단일 0–100 composite로 통일, 툴팁 + 방법론 페이지, 모바일 카드 일관성

## 배경 / 문제 (코드 근거)

현재 Trust Score가 **두 개로 분열**되어 있고 카드 쪽은 사실상 깨져 있음:

1. **목록 카드** (`components/SupplierCard.tsx` → `TrustBadge`): `r.trust_score`를 렌더. 하지만 현재 데이터에서 `trust_score === b2b_score`이고 **스케일이 0–18** (master_db: min 0.42 / max 17.71 / avg 6.2, 3305개 전부 b2b_score 보유). `TrustBadge`(shared 자동생성)는 0–100 가정(tier 임계값 40/60/75) → **모든 supplier가 "Limited" + 회색 거의 빈 바**로 표시됨. 실질적 버그.
2. **상세 페이지** (`app/supplier/[id]/page.tsx` → `OverallScore` "Trust Index"): 별도의 0–100 composite를 인라인 계산. 5개 sub-score 평균. 건전하고 설명 가능하지만 카드 badge와 입력이 완전히 다름.

→ "Trust Score에 설명이 없다"는 더 깊은 문제(카드 점수 스케일 오류 + 두 점수 불일치) 위에 있음. 설명을 쓰려면 먼저 점수의 정의를 통일해야 함.

`TrustBadge.tsx`는 **자동 생성 파일**임 (헤더: "AUTO-GENERATED from shared/components/TrustBadge.tsx ... run `python scripts/sync_shared.py`"). 직접 편집 금지 — `shared/components/TrustBadge.tsx`를 수정 후 sync.

## 의사결정 (확정)

- **점수 통일**: 상세 페이지의 5-part 0–100 composite를 `lib/trustScore.ts`로 추출, 카드+상세 **둘 다** 사용. 카드 badge는 `computeTrustScore(r).overall` 표시.
- **설명 UI**: 툴팁(badge 옆) + 신규 `/trust-score` 방법론 페이지. badge에서 링크.
- **정렬도 통일**: `sortWithSponsored`/`topByTrust` 등 목록 정렬 기준도 composite `overall`로 변경(표시·정렬 완전 일치). 상위 노출 순서 변경되나 SEO 영향 경미.
- **언어**: `/trust-score`는 EN 우선. KO/TH는 범위 밖(추후).

## 컴포넌트 설계

### 1. `lib/trustScore.ts` — 단일 점수 소스
```ts
export type TrustSub = { key: string; label: string; score: number; weight: string };
export type TrustResult = { overall: number; subs: TrustSub[]; tier: string; color: string };
export function computeTrustScore(s: Supplier): TrustResult;
export function trustTier(overall: number): { tier: string; color: string };
```
sub-score 공식 (각 0–100, 상세 페이지에서 그대로 이전):
- **Capital**: `min(100, max(0, (log10(capital_thb)−5)*25))` (cap≤0 → 0)
- **Longevity**: `years ? min(100, years*4) : 0`
- **Reviews**: `min(100, log10(max(1, total_reviews))*25 + rating*10)`
- **Verifications**: `(verified + halal_certified + estate_name + dbd.tsic_code 중 truthy 개수)/4 * 100`
- **Photos**: `min(100, (photos?.length||0)*12.5)`
- **overall** = `round((capital+longevity+reviews+verifications+photos)/5)`

tier/color (TrustBadge와 동일 임계값): ≥75 Excellent #16a34a / ≥60 Strong #059669 / ≥40 Fair #ca8a04 / else Limited #94a3b8.

### 2. `TrustBadge` 수정 (shared 소스 경유)
- `shared/components/TrustBadge.tsx`에서 수정 후 `python scripts/sync_shared.py` 실행 → `components/TrustBadge.tsx` 재생성.
- 컴포넌트 시그니처(`score` 0–100)는 그대로. `SupplierCard`가 `score={computeTrustScore(r).overall}` 전달하도록 변경(기존 `r.trust_score` 제거).

### 3. 툴팁 + `/trust-score` 페이지
- **툴팁 컴포넌트** `components/TrustScoreInfo.tsx`: 정적 export 친화 — 클라이언트 JS 최소화 위해 네이티브 `<details><summary>` 또는 CSS `group-hover` 팝오버. 모바일은 탭으로 펼침. 내용: 5개 sub-score 한 줄 요약 + "How is this calculated? →" `/trust-score` 링크. 접근성: `<summary>`에 aria-label, 키보드 포커스 가능.
- **`app/trust-score/page.tsx`**: 각 구성요소 공식·가중치·데이터 출처(공개 Google 리뷰 + DBD 등록) 설명. `generateMetadata`로 title/description/canonical. SEO 콘텐츠.
- 푸터 "Site" 컬럼 + 상세 페이지 Trust Index 섹션에서 `/trust-score` 링크.
- sitemap에 `/trust-score` 추가(priority ~0.5).

### 4. 모바일 카드 일관성 (`components/SupplierCard.tsx`)
- 루트 래퍼에 `h-full flex flex-col`; 하단 액션 버튼 줄을 `mt-auto`로 고정 → 그리드(`sm:grid-cols-2`)에서 행 높이 정렬.
- 이름 `h3`: `truncate` → `line-clamp-2` + `min-h-[2.5rem]`(2줄 예약)로 1줄/2줄 카드 정렬.
- 상단 우측 rating 블록 + TrustBadge 줄: 좁은 화면 겹침 방지 위해 `gap`/`flex-wrap` 정리.
- 카테고리 칩: 기존 `slice(0,3)` 유지, 오버플로 시 줄바꿈.
- 본문 영역(`<a>` 내부)을 `flex-1`로 채워 버튼이 항상 바닥.

### 5. 정렬 통일
- `lib/sponsored.ts`의 `sortWithSponsored`, `lib/data.ts`의 `topByTrust`가 비교에 사용하는 `trust_score`/`b2b_score`를 `computeTrustScore(s).overall`로 교체.
- 성능: composite는 supplier당 O(1). 목록 정렬 시 supplier별 1회 계산(필요 시 메모이즈) — 페이지당 수백~수천개라 무시 가능.

## 테스트 / 검증
- `scripts/test_trust_score.mts` (node assert):
  - 알려진 입력 → 기대 sub-score (capital/longevity/reviews/verifications/photos 각각 경계 포함).
  - overall 클램프(0/100) 및 빈 데이터(전부 0) → overall 0.
  - tier 임계값 경계(39→Limited, 40→Fair, 75→Excellent).
  - 결과가 더 이상 `b2b_score`(0–18)에 의존하지 않음(같은 supplier가 0–100 반환).
- `npm run build` 통과, `/trust-score` 생성, 카드 badge가 0–100·정상 tier 표시.
- 상세 페이지 "Trust Index" 값이 카드 badge 값과 동일(동일 함수).

## 영향 파일
- **신규**: `lib/trustScore.ts`, `app/trust-score/page.tsx`, `components/TrustScoreInfo.tsx`, `scripts/test_trust_score.mts`
- **수정**: `shared/components/TrustBadge.tsx`(+ `python scripts/sync_shared.py`), `components/SupplierCard.tsx`, `app/supplier/[id]/page.tsx`(인라인 계산 → `computeTrustScore` 사용), `lib/sponsored.ts`(sort), `lib/data.ts`(`topByTrust`), `app/layout.tsx`(푸터 링크), `app/sitemap.ts`(`/trust-score`).

## 범위 밖 (명시)
- 클러스터 C~F (검색/필터, 지도, 대량 문의, AI 추천)는 별도 spec.
- `/trust-score`의 KO/TH 번역(추후).
- 업스트림 `b2b_score` 공식 자체 변경(우리 repo 밖 CSV) — 표시/정렬에서 사용 중단만 함.
