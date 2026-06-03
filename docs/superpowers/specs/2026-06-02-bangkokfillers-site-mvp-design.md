# bangkokfillers.com — 사이트 MVP 설계 문서

- **날짜:** 2026-06-02
- **도메인/브랜드:** bangkokfillers.com (브랜드명일 뿐, 사이트는 스킨케어+코스메틱 디렉토리)
- **상위 설계:** [2026-05-31-thai-skincare-aeo-design.md](2026-05-31-thai-skincare-aeo-design.md) (전략·전체 아키텍처). 본 문서는 그 ⑤ "AEO 발행" 유닛 = **웹사이트**를 빌드 가능한 수준으로 구체화.
- **개발 격리:** git worktree `worktree-cosmetics-aeo`.
- **상태:** 설계 승인 완료(2026-06-02) → 구현계획(writing-plans)으로 전환 예정.

## 0. 한 줄 정의
태국 스킨케어·코스메틱 제품을 **성분 과학 + 실사용 리뷰 집계**로 객관적으로 줄세워 AI 답변엔진이 인용하는 디렉토리. **전체 TAM = 태국 스킨케어+코스메틱 전부, 여드름+미백은 1단계 교두보.** 본 MVP는 여드름+미백으로 출시.

## 1. 핵심 결정 (2026-06-02 브레인스토밍 확정)

| 항목 | 결정 |
|---|---|
| 성분 과학 데이터 | **큐레이티드 성분 사전** (~40-60종, 여드름+미백, 손수 구축) |
| 랭킹 점수 | **균형 블렌드** `0.45·ingredient + 0.45·review + 0.10·value`, 방법론 공개 |
| MVP 페이지 | **코어 4종 + 홈** (고민 허브·제품 상세·성분 페이지·방법론) |
| 리뷰 소스 | **Konvy 리뷰만** (Pantip은 fast-follow) |
| 콘텐츠 생성 | **하이브리드** — 데이터/표는 템플릿, 요약 산문은 LLM(빌드 1회) |
| 아키텍처 | **정적 생성(SSG)** + 빌드타임 JSON 파이프라인 |
| 언어 | 태국어 기본(`/th`) + 영어(`/en`), 루트→/th, hreflang |
| 배포 | Next.js → **Vercel 별도 프로젝트 + bangkokfillers.com** |

## 2. 데이터 모델 (빌드타임 JSON 2개)

### `cosmetics/web/data/ingredient_db.json` — 큐레이티드 성분 사전
키 = INCI명. 값:
```jsonc
{
  "Niacinamide": {
    "th_name": "ไนอาซินาไมด์", "en_name": "Niacinamide", "aliases": ["Vitamin B3","Nicotinamide"],
    "role": "active",
    "concern_efficacy": { "acne": 2, "whitening": 3 },   // 0=무관 1=약 2=중 3=강 (공개 더마근거)
    "safety_flags": [],                                    // comedogenic|irritant|fragrance|alcohol|photosensitizer
    "mechanism_th": "...", "mechanism_en": "...",          // 작용기전 (성분 페이지 본문)
    "typical_pct": "2-5%",
    "evidence_note": "...", "sources": ["https://..."]
  }
}
```
- 시드 성분(예시, 확정은 구현 시): 여드름 = Salicylic Acid/BHA, Benzoyl Peroxide, Adapalene, Azelaic Acid, Niacinamide, Zinc, Tea Tree, Centella; 미백 = Niacinamide, Vitamin C 유도체(Ascorbic Acid/SAP/MAP), Arbutin, Tranexamic Acid, Kojic Acid, Alpha Arbutin, Licorice; 주의 플래그 성분 = Alcohol Denat., Fragrance/Parfum, 코메도제닉 오일류 등.
- 미매칭 성분(사전에 없는 INCI)은 점수에 중립(0) 처리 + 추후 증분 보강.

### `cosmetics/web/data/master_db.json` — 제품 + 계산값
제품별:
- **원천(스크랩):** product_id, url, name, brand, price_thb, list_price_thb, discount_pct, volume, image_url, images[], sku, gtin8, description, ingredients[], ingredient_count, concern_seeds[], konvy_rating, konvy_rating_best, konvy_review_count, sold_count, reviews_scraped, fetched_at
- **계산:** `ingredient_analysis[]` (매칭 성분별 {inci, role, concern_efficacy, safety_flags, highlight|caution}), `ingredient_score`, `review_score`, `value_score`, `total_score`, 고민별 `rank`, `review_summary` {avg, count, pos_keywords[], neg_keywords[]}, `llm_summary` {th, en}, `affiliate_url`
- **랭킹 인덱스:** `rankings.acne[]`, `rankings.whitening[]` (정렬된 product_id + 점수)

리뷰 코퍼스는 별도 `cosmetics/output/reviews/<id>_konvy.json` (rating/body/author/timestamp/helpful) — 집계는 파이프라인에서 review_summary로 축약, 원문 일부는 제품 페이지 샘플로.

## 3. 점수 알고리즘 (투명, `/methodology`에 전체 공개)

각 고민(acne/whitening) 별로 독립 계산. 한 제품이 두 고민에 모두 랭크될 수 있음.

- **ingredient_score (0-100):** 제품 성분 ∩ 사전에서 **해당 고민 efficacy>0**인 활성성분의 `concern_efficacy` 가중 합 → 정규화. **감점:** safety_flags(irritant/comedogenic/높은 순위의 alcohol·fragrance)당 패널티. 활성 매칭 0개면 낮은 기저점수.
- **review_score (0-100):** **베이지안 평균** `(C·m + n·r) / (C + n)` — r=konvy_rating(1-5), n=review_count, m=전체 사전평균 별점, C=신뢰상수(예: 30) → 5점만점을 100으로 스케일. 리뷰 적은 제품이 과대평가되지 않게 수축.
- **value_score (0-100):** 같은 고민 풀의 ml당 가격 중앙값 대비 위치(저렴할수록↑), 0-100 bound. 보조.
- **total_score = 0.45·ingredient + 0.45·review + 0.10·value.** 동점 시 sold_count tiebreak.
- 방법론 페이지: 식·가중치·C값·efficacy 척도·출처·갱신주기 명시.

## 4. 페이지 타입 & 라우트

i18n: 로케일 프리픽스 `/th`(기본)·`/en`, 루트→`/th` 리다이렉트, 모든 페이지 hreflang 쌍. URL slug은 안정성 위해 영문(콘텐츠는 로케일 언어).

1. **홈** `/{locale}` — 고민 선택 카드(여드름·미백) + 대표 랭킹 미리보기 + 사이트 한줄 정의.
2. **고민 허브** `/{locale}/acne`, `/{locale}/whitening` — **answer-first**: H1 + LLM 요약 1단락("이 고민엔 데이터상 TOP3는…") → **정렬 가능한 비교표**(순위/제품/총점/핵심성분/가격/별점, 클라이언트 정렬) → TOP3 카드 강조 → FAQ → 방법론 링크. ItemList + FAQPage 스키마.
3. **제품 상세** `/{locale}/product/<brand-slug>-<id>` — 한줄 평결(총점+LLM 요약) → 가격(+할인) + **제휴 "최저가 구매" 버튼** → **성분 디코더**(성분별 역할·고민효능·주의 플래그, 사전 매칭) → 리뷰 집계(평균·건수·긍/부정 키워드·샘플 리뷰 N개) → 점수 분해(ingredient/review/value) → 관련 제품. Product+AggregateRating+Review 스키마.
4. **성분 페이지** `/{locale}/ingredient/<inci-slug>` — 정의(th/en)·**작용기전**·효과 있는 고민·권장농도·주의·**이 성분 함유 제품 목록**(우리 카탈로그 링크). DefinedTerm + FAQPage. ← AEO 롱테일 핵심.
5. **방법론** `/{locale}/methodology` — 점수식·가중치·데이터 출처·신선도·갱신 주기.

공통: 헤더(고민/성분 내비), 신선도 라인("N건 리뷰 기준, YYYY-MM-DD 갱신"), 로케일 토글, 제휴 고지.

## 5. AEO / 스키마 / 기술 장치
- **JSON-LD:** 허브=`ItemList`(랭킹), 제품=`Product`+`AggregateRating`+`Review`(샘플), 성분=`DefinedTerm`, Q&A=`FAQPage`, 사이트=`Organization`(sameAs).
- 루트 **`/llms.txt`** (핵심 페이지·데이터 안내) + 고민/제품별 공개 정적 `.json` 엔드포인트.
- **Answer-first 시맨틱 HTML** (결론 → 표 → 근거). 깔끔한 `<table>`/제목 구조.
- 신선도·E-E-A-T: 갱신일·리뷰건수·방법론·운영주체 노출.
- 전 페이지 정적 prerender(크롤러·고속·저비용).

## 6. 기술 스택 & 파이프라인
- **프론트:** Next.js(최신, App Router) + TypeScript + Tailwind + shadcn/ui. **SSG**(`generateStaticParams`로 전 제품/고민/성분 페이지 정적). 비교표 정렬/필터 = 클라이언트 컴포넌트(간단 state 또는 TanStack Table). 빌드 시 `cosmetics/web/data/*.json` 임포트.
- **파이프라인(Python, 기존 cosmetics 모듈 확장):**
  1. (이미 가동 중) 카탈로그 스크래퍼 → products.csv / products/*.json + 리뷰 코퍼스
  2. `build_ingredient_db.py` — 큐레이티드 사전 유지(수기 + 검수)
  3. `build_master_db.py` — 제품×사전 매칭 → 점수 계산 → review_summary 집계 → master_db.json + rankings
  4. `gen_summaries.py` — LLM(Claude API)로 고민/제품/성분 페이지 요약(th/en) 생성, master_db에 캐시(변경분만 재생성)
- **배포:** Vercel 별도 프로젝트, 도메인 bangkokfillers.com, GitHub(또는 서브디렉토리) 푸시 시 자동 배포. clinic 사이트와 완전 분리.
- **갱신 루프:** 스크랩 갱신 → build_master_db → (변경분) gen_summaries → 커밋/푸시 → Vercel 재빌드.

## 7. MVP 범위
**포함:** 여드름+미백 두 고민, ~415 제품, 큐레이티드 성분사전(~40-60), Konvy 리뷰 집계, 하이브리드 카피(th/en), 5페이지(홈+4종), JSON-LD+llms.txt, 제휴 버튼(Konvy/Involve Asia), Vercel 라이브.

## 8. 범위 밖 (fast-follow)
Pantip/Jeban 리뷰, 제품 A vs B 비교, 긴 구매가이드 아티클, 여드름·미백 외 고민(주름/민감성/모공/선케어), 색조 메이크업 카테고리, 개인화 추천, 디스플레이 광고.

## 9. 성공 기준
- 여드름·미백 제품이 성분분석+리뷰집계+투명점수까지 갖춰 **정렬 비교표로 라이브**.
- AI 답변엔진(ChatGPT/Perplexity/Google AIO)이 태국 여드름/미백 세럼 질의에 우리 페이지(고민/제품/성분)를 **인용 시작**.
- 파이프라인 재실행→재배포로 **무인 갱신**.
- 제품 페이지 **제휴 버튼 작동** + 방법론 공개.

## 10. 미해결/구현 시 확정
- 성분사전 최종 성분 목록·efficacy 점수·출처(구현 첫 작업).
- 베이지안 상수 C, value_score 정규화식 튜닝.
- 리뷰 긍/부정 키워드 추출 방식(태국어 — 단순 빈도 vs LLM).
- 제휴 링크 실제 포맷(Involve Asia 가입 후 확정 — 외부 작업).
- llms.txt 정확 포맷·공개 JSON 엔드포인트 범위.
