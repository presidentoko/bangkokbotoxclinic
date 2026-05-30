# 클러스터 A — District SEO 데이터/콘텐츠 수정 (설계)

- 날짜: 2026-05-30
- 프로젝트: `web-factory` (Thai Supply Hub, 정적 export / Cloudflare Pages)
- 범위: 중복 district 페이지 통합, thin-content 처리, footer 링크 검증

## 배경 / 제약

- `next.config.ts`에 `output: "export"` — **백엔드/API 없음**. 모든 처리는 빌드 타임 또는 브라우저에서만 가능.
- `master_db.json`은 야간 Python 파이프라인이 재생성 → 웹 측 수정은 **멱등**해야 재생성에도 살아남음.
- district slug은 현재 즉석에서 `name.toLowerCase().replace(/\s+/g,"-")`로 생성되고, `filterByDistrict`는 raw `supplier.district` 문자열로 매칭 → 모든 철자/스크립트 변형이 별도 페이지가 됨 (근본 원인).

## 문제의 실제 규모 (데이터 근거)

126개 district 키에 4종류의 노이즈가 섞여 있음:

1. **철자/공백 변형**: `Si Racha District` ← `Sriracha`, `Sri Racha`, `Srira`; `Bang Lamung District` ← `Banglamung`; `Phan Thong District` ← `Panthong`/`Phanthong`/`Phantong`/`PANTHONG`/`Pantong District`
2. **태국어/행정 접두어**: `อำเภอเมือง`, `อเมือง`, `เมือง`, `Amphoe`, `Amphur Muangsamutsakorn`, `Mueng`, `Muang` → `Mueang … District`
3. **하위지명이 district로 오기입**: `Pattaya`/`pattaya` → `Bang Lamung District`
4. **완전 쓰레기값**: `61`, `89`, `25`, `172 หมู่8 ซอยสุขสวัสดิ์72`, `Khlong Toei Nuea Subdistrict`, 도로명 등 → district 없음
5. **city 자체 오기입**: `rayong/Si Racha District`(실제 chon_buri), `chonburi/Sriracha`(slug 불일치), `samut_prakan/Bangkok`, `bangkok/Krathum Baen` 등

## 의사결정 (확정)

- **Dedup 방식**: canonical 맵 + 로드 시 정규화 (+ 구 alias slug 301). 옵션으로 Python 생성기도 동일 정규화 적용.
- **Thin content**: 임계값 5. `<5`이면 페이지는 렌더하되 `noindex,follow` + city로 canonical; sitemap에서 제외.
- **Footer**: 기존 링크 검증 및 수정 (새 섹션 추가 없음).
- **city 오기입 교정**: canonical 맵이 정답 city를 아는 안전한 경우만 포함.
- **redirect 생성**: build에 prebuild로 자동 연결.

## 컴포넌트 설계

### 1. `lib/districts.ts` — 정규화 단일 소스
- `export type CanonicalDistrict = { name: string; slug: string; citySlug: string }`
- `export function normalizeDistrict(rawCity: string, rawDistrict: string): CanonicalDistrict | null`
- 구현 3단계:
  - (a) **큐레이션 alias 테이블**: 위 실제 변형값 → 정식 district(+정답 citySlug) 매핑.
  - (b) **휴리스틱**: 행정 접두어(`อำเภอ`, `อ.`, `เมือง`, `Amphoe`, `Amphur`, `Mueang`, `Muang`, `Mueng`)와 `District` 접미어 제거 → 소문자/공백 정규화 후 비교. 미래 변형 흡수.
  - (c) **쓰레기값 필터**: 숫자로 시작 / 도로·subdistrict 키워드(`ซอย`, `หมู่`, `Road`, `Subdistrict`, `Sub-district`, `Tower`) 포함 / 길이 미달 → `null`.
- `null`이면 supplier는 city에는 속하되 district 페이지 생성 안 함.
- city 교정은 alias 테이블이 정답 city를 명시한 경우에만 (예: Si Racha → 항상 chon_buri).
- 도우미: `allCanonicalDistricts(db)` — 정규화 후 고유 canonical 목록 + 카운트 반환.

### 2. `lib/data.ts` — 로드 시 정규화 (빌드 타임)
- `loadMasterDb()` 파싱 직후: 각 supplier에 대해 `normalizeDistrict(s.city, s.district)` 적용 → `s.district = canonical?.name ?? ""`, `s.district_slug = canonical?.slug`, 필요 시 `s.city`/citySlug 교정.
- `db.district_counts`를 정규화 값으로 **재집계** (키 `${citySlug}/${name}`).
- 멱등 — 두 번 돌려도 동일 결과.

### 3. `lib/types.ts`
- `Supplier`에 `district_slug?: string` 추가.

### 4. slug 일원화
- `app/d/[district]/page.tsx`의 `generateStaticParams` / `districtFromSlug`, `app/sitemap.ts`, 카테고리×district 링크(`/c/{cat}/{slug}`)가 전부 `lib/districts.ts`의 canonical slug 사용.

### 5. Thin content (임계값 5)
- `app/d/[district]/page.tsx` `generateMetadata`: `filtered.length < 5`이면 `robots: { index:false, follow:true }` + `alternates.canonical = /city/{citySlug}`. 페이지 본문은 계속 렌더.
- `app/sitemap.ts`: `<5` district는 `/d/{slug}`에서 제외.

### 6. 구 alias slug → canonical 301 (`public/_redirects`)
- `scripts/gen_district_redirects.mjs`: 정규화 전 데이터에서 구 slug → 정식 slug 라인 생성. `_redirects` 안 `# BEGIN district-redirects` / `# END district-redirects` 마커 블록으로 관리(수동 항목 보존).
- `package.json` `build`를 `node scripts/gen_district_redirects.mjs && next build`로 연결.

### 7. Footer 링크 검증/수정
- `scripts/check_footer_links.mjs`: EN(`app/layout.tsx`) / KO / TH footer의 모든 href 추출 → 실제 생성 라우트 집합과 대조 → 깨진/누락 링크 리포트. 발견된 항목 수정.

## 테스트 / 검증

- `scripts/test_districts.mjs` (node `assert`):
  - 알려진 alias가 기대 canonical로 정규화되는지 (각 city별 대표 케이스).
  - 쓰레기값 → `null`.
  - 카운트 병합 정확성 (예: Si Racha 계열 합산).
  - 정규화 후 slug 중복 없음.
- `next build` 성공 + `out/d/*` 생성 페이지 수가 유의미하게 감소.
- `check_footer_links.mjs`가 깨진 링크 0 보고.

## 영향 파일

- **신규**: `lib/districts.ts`, `scripts/gen_district_redirects.mjs`, `scripts/check_footer_links.mjs`, `scripts/test_districts.mjs`
- **수정**: `lib/data.ts`, `lib/types.ts`, `app/d/[district]/page.tsx`, `app/sitemap.ts`, `public/_redirects`, `package.json`, 그리고 slug 일관성을 위한 카테고리×district 라우트 / city 페이지 일부.

## 범위 밖 (명시)

- 클러스터 B~F (Trust Score 설명, 모바일 카드, 검색/필터, 지도, 대량 문의, AI 추천)는 별도 spec.
- district 페이지에 신규 생성 콘텐츠 추가(enrich)는 이번 범위 밖 — thin은 noindex로만 처리.
