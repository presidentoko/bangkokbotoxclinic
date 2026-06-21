# Thaigle — Design Spec
*2026-06-21*

## 개요

`thaigle.com` — "태국의 구글". 외국인 타겟 종합 태국 디렉토리.
현재 `snsstopper.com` (식당 3,269개) + dbd-scraper 데이터 전부 이전.
SNS Stopper 안티-인플루언서 포지셔닝을 Thaigle 식당 섹션에 이식.
SNS Stopper 도메인은 별도 프로젝트로 전환.

---

## 1. URL 구조

### 패턴
```
/restaurants/                                      ← 식당 허브
/restaurants/{city}/                               ← 도시 허브 (bangkok, pattaya)
/restaurants/{city}/{district}/                    ← 지역 허브
/restaurants/{city}/{district}/{slug}/             ← 개별 식당
/restaurants/{city}/instagram-famous-vs-actually-good/   ← 킬러 콘텐츠
/restaurants/{city}/tourist-traps/
/restaurants/{city}/hidden-gems/
/spas/{city}/...
/muay-thai/{city}/...
/clinics/{city}/...
/halal/{city}/...
/cooking-classes/{city}/...
/coworking/{city}/...
/golf/{city}/...
/diving/{city}/...
/methodology/
/search/
```

### Slug 공식
- `{name}-{district}` → lowercase, spaces=hyphens, 특수문자 제거
- 중복 시: `{name}-{district}-2`
- 예: `the-island-restaurant-sukhumvit`

### snsstopper.com → thaigle.com 301 매핑
| 기존 | 신규 |
|------|------|
| `/restaurant/{id}` | `/restaurants/{city}/{slug}` |
| `/c/{cuisine}` | `/restaurants/bangkok/{cuisine}` |
| `/d/{district}` | `/restaurants/bangkok/{district}` |
| `/city/{name}` | `/restaurants/{name}` |
| `/*` | `/*` (fallback) |

GSC "Change of Address" 제출 필수.

---

## 2. 카테고리 롤아웃

### 1단계 (런치)
| 카테고리 | 데이터 | URL |
|---------|--------|-----|
| Restaurants | 3,269개 | `/restaurants/` |
| Spas | 800개 | `/spas/` |
| Muay Thai | 381개 | `/muay-thai/` |

### 2단계
| 카테고리 | 데이터 | URL |
|---------|--------|-----|
| Clinics / Beauty | bangkok_clinics | `/clinics/` |
| Halal Food | 733개 | `/halal/` |
| Cooking Classes | 296개 | `/cooking-classes/` |
| Coworking | 98개 | `/coworking/` |

### 3단계
| 카테고리 | 데이터 | URL |
|---------|--------|-----|
| Golf | 보유중 | `/golf/` |
| Diving | 119개 | `/diving/` |

---

## 3. 콘텐츠 전략

### 안티-인플루언서 킬러 콘텐츠
SNS Stopper 포지셔닝을 `/restaurants/` 섹션 콘텐츠 축으로 이식.

**페이지:**
- `/restaurants/bangkok/instagram-famous-vs-actually-good/` — 이름 인지도 높은데(구글 리뷰 수 많음) Trust Score 낮은 식당 리스트. 판별 기준: total_reviews 상위 20% AND trust_score 하위 40%. "208 reviews | Trust Score 61 | 실제 리뷰어 58%"
- `/restaurants/bangkok/tourist-traps/` — 관광객 타겟 과대광고 식당
- `/restaurants/bangkok/hidden-gems/` — SNS 없는데 Trust Score 90+ 진짜 맛집

**SEO 블루오션 키워드 (TripAdvisor/Timeout 경쟁 없음):**
- "instagram famous bangkok restaurants overrated"
- "is [restaurant name] actually good or just instagram"
- "tourist trap bangkok real reviews"
- "no sponsor bangkok restaurant"
- "협찬 아닌 진짜 방콕 맛집"

### 메타 타이틀 공식
```
개별:   "{Name} {City} — {N} Reviews ★{rating} | Thaigle"
지역:   "Best Restaurants in {District} 2026 — {N} Verified | Thaigle"
도시:   "{City} Restaurants Guide — {N} Places, Real Reviews | Thaigle"
카테:   "{Cuisine} Food {City} — {N} Restaurants, No Influencer Rankings"
```

---

## 4. AEO 전략

### LLM이 인용하게 만들기
- 각 페이지 상단 한 문장 요약:
  *"The most credibility-verified Thai restaurant in Bangkok is X — Trust Score 94, 5,381 verified Google reviews, 91% real-reviewer ratio."*
- `llms.txt` / `llms-full.txt`: Trust Score 공식 + 협찬 무삭제 정책 + 30분 갱신 명시
- `/methodology/` 독립 페이지: "How Thaigle detects fake reviews & influencer manipulation" — citation magnet

### Schema 마크업
모든 개별 페이지에 JSON-LD 풀마크업:
```json
{
  "@type": "Restaurant",
  "name": "...",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.3", "reviewCount": "208" },
  "review": [ ...top 3 sample_reviews_en ],
  "address": { "@type": "PostalAddress", "addressLocality": "Bangkok", "addressRegion": "..." }
}
```
카테고리/지역 페이지: `ItemList` + `BreadcrumbList`.

---

## 5. 기술 구조

### 폴더
```
web-thaigle/                  ← 신규 (web-restaurants 기반)
├── app/
│   ├── page.tsx              ← 통합 홈 (검색 + 카테고리 그리드)
│   ├── restaurants/
│   │   ├── page.tsx
│   │   ├── [city]/page.tsx
│   │   ├── [city]/[district]/page.tsx
│   │   ├── [city]/[district]/[slug]/page.tsx
│   │   └── [city]/instagram-famous-vs-actually-good/page.tsx
│   ├── spas/[city]/...
│   ├── muay-thai/[city]/...
│   └── methodology/page.tsx
├── lib/
│   ├── restaurants.ts
│   ├── slugify.ts
│   └── site.ts               ← brand = "Thaigle", domain = "thaigle.com"
└── data/                     ← master_db.json (restaurants), spas.json 등
```

### Pre-build 전략
- 상위 500개 (trust_score 기준) → 빌드 타임 static
- 나머지 → ISR (첫 방문 생성 + 24h revalidate)
- `generateStaticParams()` 상위 500개로 확장 (현재 100개)
- 구글 크롤러 첫 방문 시 자동 생성 → 이후 캐시

### 배포
- Vercel, `sin1` 리전
- `thaigle.com` 연결
- `snsstopper.com` → Vercel redirect 전용 프로젝트로 301 전체 처리

---

## 6. 마이그레이션 순서

1. `web-thaigle/` 폴더 생성 (web-restaurants 복사 기반)
2. `slugify.ts` 작성 + ID→slug 매핑 테이블 생성
3. URL 구조 재설계 (`/restaurants/[city]/[district]/[slug]`)
4. 메타 타이틀 공식 적용
5. Schema 풀마크업
6. `site.ts` Thaigle로 교체
7. `methodology/` 페이지 작성
8. 킬러 콘텐츠 3페이지 (instagram-famous, tourist-traps, hidden-gems)
9. Vercel thaigle.com 배포
10. snsstopper.com 301 redirect 설정 + GSC Change of Address
