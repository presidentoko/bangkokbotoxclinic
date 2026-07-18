# snsstopper.com 종합 감사 보고서 — 2026-07-18

4개 트랙 병렬 감사 결과: **① 서버 최적화(hobby 플랜 생존)** · **② 버그** · **③ 트래픽/SEO** · **④ UI/UX(체류시간)**.
전 항목 코드 레벨에서 검증됨 (file:line 근거 포함).

---

## 요약 (Executive Summary)

| 트랙 | 최대 발견 |
|------|-----------|
| 서버 | 허브 페이지 HTML 최대 **1.7MB** + middleware가 **전 요청의 ~100%에서 실행** + OG PNG 3,633장(470MB)이 배포마다 ISR Writes 68K 유발 |
| 버그 | `/best` 3개 페이지 **영구 빈 페이지**(soft-404인데 사이트맵 priority 0.85), famous-vs-good 대표 시드 5개 증발, 로케일 리다이렉트가 **쿼리스트링(UTM) 전부 유실** |
| SEO | **데이터 파이프라인 7/2부터 정지** → 사이트 전체 "실시간 갱신" 문구가 거짓, th/ko 허브 6개에 `dynamicParams=false` 누락(ISR 폭탄 구멍 잔존) |
| UX | 내부 링크 전부 `<a>`(풀 리로드), **사진 0장**, 검색이 홈 3페이지에만 존재, 모바일 하단 고정바가 100% 이탈 링크 |

---

## ① 서버 최적화 — Hobby 플랜에서 살아남기

현황: ISR Reads 1M/1M(소진), FOT 8.89/10GB, Fluid CPU 2h15m/4h, ISR Writes 68K/200K.
`dynamicParams=false` 픽스(배포 완료)로 봇 프로빙발 무한 생성은 막았고, 아래가 **남은 소모원**.

### S1. [절감 HIGH / 공수 S] 허브 페이지 HTML 다이어트 — Reads/FOT 최대 레버
- 실측: district 페이지 평균 **851KB** (bang-rak.html **1.67MB**), c/thai.html 1.21MB, 홈 699KB. 전체 프리렌더 산출물 **1.77GB** → 봇 1회 풀 크롤 ≈ 0.9GB FOT + ~11만 ISR read units. robots.ts가 GPTBot/Claude/Perplexity까지 초대 중.
- 원인: `app/d/[district]/page.tsx:117,124` 카드 200장, `app/c/[cuisine]/page.tsx:137,146` 100장, `app/c/[cuisine]/[district]/page.tsx:84,91`는 **무제한** slice.
- 처방: 전 리스트 24~36장으로 캡 + RestaurantCard 슬림화(카드당 ~2KB). 예상 효과: 허브 HTML **−70~85%** ≈ 전체 Reads/FOT **−40~50%**.
- 주의: vercel.json 헤더로는 ISR HTML의 Cache-Control을 못 덮어씀 → "엣지 캐시로 밀기"는 불가, **무게 감량이 유일한 레버**.

### S2. [절감 HIGH / 공수 S] middleware matcher 축소 — Fluid CPU 최대 레버
- `middleware.ts:98` matcher가 8,063개 전 라우트 + OG PNG + API까지 전부 실행. 실제 로직은 (a) non-www→www, (b) `/th`,`/ko` 쿠키 스탬프, (c) `/` 로케일 리다이렉트뿐.
- 처방: matcher를 `["/", "/th", "/th/:path*", "/ko", "/ko/:path*"]`로 축소 + www 리다이렉트는 Vercel Domains 설정(도메인 레벨 308, 컴퓨트 0)으로 이전 → **요청량의 ~97%에서 middleware 제거**. 현재 CPU 2h15m의 대부분이 이것.

### S3. [절감 HIGH / 공수 S] sitemap.xml 캐시 — 매 폴링마다 840KB
- `app/sitemap.ts`가 4,281 URL / **840KB**를 `max-age=0, must-revalidate`로 서빙. changeFrequency "daily" 선언 → 봇이 하루 수회 폴링, 매번 ~105 read units + 840KB FOT.
- 처방: feed.xml처럼 route handler로 전환 + `s-maxage=86400, stale-while-revalidate=604800`, changeFrequency weekly로 하향, lastModified는 실제 변경시만 갱신.

### S4. [절감 HIGH / 공수 M] OG PNG 3,633장 → public/ 정적 자산화 — ISR Writes 주범
- 빌드타임 프리렌더 확인(요청당 write는 없음, good). 단 개당 120~135KB × 3,633 = **470MB**가 ISR 캐시에 상주 → **매 배포마다 8,063 라우트 전체 re-seed = ISR Writes 68K의 정체**.
- 처방: 빌드 스크립트로 `public/og/<id>.png` 생성 후 metadata가 그걸 가리키게 → ISR 완전 우회(reads/writes 0, immutable 캐시), 배포당 write 비용 ~45% 제거. 픽스 전까지는 **배포 월 2~3회로 제한** 권장.

### S5. [절감 MED / 공수 S] /api/search-index — 735KB JSON이 홈 마운트마다
- 실측 **735KB**. `LazySearch.tsx:23`가 마운트 즉시 fetch, EN 홈은 `LazyPersonalized.tsx:22`와 **중복 2회** fetch.
- 처방: 검색창 포커스/idle 시로 지연 + 두 컴포넌트가 promise 공유 + `max-age=86400` 또는 빌드타임 `public/search-index.json` 정적화.

### S6. [절감 MED / 공수 S] /api/community — 페이지뷰마다 force-dynamic 호출 + Redis 3×N
- 모든 카드에 CommunityButtons → 페이지뷰당 1회 호출은 배칭돼 있으나 `route.ts:56-60`이 **id당 3개 Redis GET 순차 fan** (50장 페이지 = 150 커맨드). Googlebot도 JS 실행하므로 크롤 시에도 발화.
- 처방: MGET/pipeline 1회로 통합 + `s-maxage=60, swr=300` + 뷰포트 진입 시로 지연 + 봇이면 skip. leaderboard 브랜치의 11MB master_db 파싱은 소형 id→name 맵으로 대체.

### S7. 기타
- `revalidate` 사용처 0곳 확인(good) — **앞으로도 절대 추가 금지** (8k 페이지에 시간 revalidate 붙이면 writes 폭발).
- feed.xml/llms*.txt s-maxage 1800~3600 → 86400으로 상향.
- next/image 사용 0, MapEmbed는 외부 iframe — 비용 무관 확인.
- **장기 옵션**: `output: "export"` 풀 정적 export 시 ISR reads/writes 구조적으로 0. API 3개만 분리하면 됨. 단 위 S1~S6만으로도 60~80% 여유 확보 가능.

**실행 순서**: S2(10분, CPU 최대 절감) → S1(30분, Reads/FOT 최대 절감) → S3(30분) → S5(1h) → S4(반나절, Writes 최대 절감) → S6(1h).

---

## ② 버그 (심각도순)

### B1. [HIGH] /best 3개 페이지가 영구 빈 페이지 (soft-404)
`lib/bestFor.ts:158,185,283` — `outdoor-seating`/`pet-friendly`/`late-night`가 필터링하는 topic(`outdoor_seating`, `pet_friendly`, `open_late`)이 master_db topic 어휘(24종)에 **아예 존재하지 않음** → 매칭 0/0/0. 그런데 사이트맵 priority 0.85 + 홈 그리드 + 전 /best 페이지에서 크로스링크 중.
→ topic 폴백 추가(date-night의 `good_atmosphere` 방식) 또는 스크래퍼가 해당 topic 낼 때까지 제거. 사이트맵은 매칭 수 기준으로 게이트.

### B2. [HIGH] famous-vs-good 대표 시드 5개 증발 + "hidden gem" 역전 노출
`lib/famous-vs-good.ts:60-84` — 시드 5개가 `place_id: null`이라 이름 exact-match로 폴백하는데 전부 실패: "After You Dessert Cafe Thonglor" ≠ DB "After You Dessert Cafe", "Rocket Coffeebar S.12" ≠ "Rocket Coffeebar at Lumphini", Ristr8to Lab은 치앙마이 브랜드(시드 district "Bang Rak"부터 오류), Gram/Audrey는 DB에 없음.
효과: (a) 헤드라인이 "20 venues"가 아닌 "15 venues", 기획의 핵심 사례(After You 허니토스트 등)가 안 나옴. (b) `loadHiddenGems`(165-167행)가 place_id로만 제외해서 **IG 유명 매장이 "피드가 모르는 숨은 맛집"으로 나올 수 있음** — 기획 정반대. (c) 76-82행 name+district 폴백은 죽은 코드(같은 exact-match 재시도).
→ place_id 백필 + normalized startsWith/token 매칭 폴백 + hidden gem 제외를 매칭된 restaurant id 기준으로.

### B3. [HIGH] 로케일 리다이렉트가 쿼리스트링 유실 — UTM 전멸
`middleware.ts:75,84` — `NextResponse.redirect(new URL('/'+locale, req.url))`이 search params를 버림. th/ko 쿠키/Accept-Language 사용자가 `/?utm_...`로 들어오면 `/th`로 302되며 **캠페인 어트리뷰션 전부 소실**.
→ `req.nextUrl.clone()` 후 pathname만 교체.

### B4. [HIGH] 51번째 카드부터 커뮤니티 카운트 영구 0
`lib/communityCounts.ts:14-18` vs `app/api/community/route.ts:50` — 클라이언트는 200장 전부 배칭하는데 API가 첫 50개 id로 슬라이스. 51~200번 카드는 데이터가 있어도 항상 0 표시.
→ 50개 단위 청크 요청 또는 POST + 캡 상향.

### B5. [MED] th/ko 페이지의 모든 크롬 내비가 로케일 이탈
BottomNav/헤더/MobileMenu/ClientFooter의 href가 전부 EN 경로 — 태국 유저가 "สำรวจ" 누르면 영어 페이지로. (UX 트랙 D6과 동일 뿌리)
→ `/c` `/d` `/city` 홈 href에 현재 로케일 prefix (LangSwitcher.localePath 방식 재사용).

### B6. [MED] JSON-LD `<` 미이스케이프 — 스크래핑 데이터발 stored XSS 경로
`components/JsonLd.tsx:9-16` — master_db에 이미 `>Family Restaurant<` 같은 이름 존재. `</script>` 포함 상호명이면 스크립트 태그 종료 + 마크업 주입.
→ `JSON.stringify(data).replace(/</g, "\\u003c")`.

### B7. [MED] "Updated 2h ago"가 빌드 시점에 고정
`StatsBar.tsx:19,47-59`, `Badges.tsx:45-64` — 서버 컴포넌트가 프리렌더 시각 기준으로 상대시간을 구움 → 8k 페이지 전부 다음 배포까지 거짓 표시. → 클라이언트 마운트 시 계산 또는 절대 날짜로.

### B8. [MED] AdSense 슬롯이 렌더 불가능
`AffiliateSlot.tsx:82-95` — `<ins class="adsbygoogle">`만 있고 로더 스크립트/`push({})`가 레포 전체에 없음 → env 설정돼도 영구 빈 박스. → layout에 스크립트 로드 + per-slot push, 아니면 슬롯 제거.

### B9. [MED] famous-vs-good 탭 숫자가 자기 헤드라인과 모순
`GapList.tsx:94-96` vs page.tsx:60-69 — "Biggest gaps" 탭은 big_gap∪decent, 히어로 스탯은 threshold 미만만 카운트 → "2곳이 78 미만"인데 탭엔 "(9)". 빈 상태 문구에 `npm run fvg:ingest` 개발 명령 노출(GapList.tsx:138)도 수정.

### B10. [LOW] 기타
- ShareButton: 공유 취소(AbortError)가 "Copied!"로 폴스루 + clipboard 권한 거부 시 unhandled rejection (`ShareButton.tsx:20-32`)
- 어필리에이트 UI에 raw 키 노출: "Reserve **street_food** restaurants…" (`restaurant/[id]/page.tsx:403` → CUISINE_LABELS 필요)
- /saved 100개 초과분 무통보 잘림 (`api/restaurants/route.ts:14`)
- localStorage prefs 무검증 파싱 → 손상 시 홈 개인화 섹션 크래시 (`PersonalizedSection.tsx:19-26`)
- famous-vs-good OG 이미지에 ASCII 필터 없음 → Thai/CJK 매장명이면 Satori 폰트 실패 (잠재)
- district slug 로직 8곳 중복·인코딩 불일치, `slugify()` 미사용 — 특수문자 district 나오는 순간 404 (잠재)
- `<html lang="en">`이 th/ko 페이지에도 고정 (`layout.tsx:101`)

---

## ③ 트래픽 / SEO

### T1. [HIGH] 데이터 파이프라인 사망 — 신선도 신호 전체가 거짓
master_db `generated_at` = **2026-07-02** (16일 정지). 그런데 sitemap "daily", feed.xml "30분마다 갱신", llms.txt "5분마다 리빌드" 하드코딩. Google이 lastmod 거짓말을 학습하면 사이트 전체 lastmod 무시.
→ `scripts/watch_and_build.py`/`auto_push_loop.py` 부활 + 신선도 문구를 `generated_at`에서 파생.

### T2. [HIGH] th/ko 허브 6개 `dynamicParams=false` 누락 — ISR 폭탄 잔여 구멍
`app/th|ko/c/[cuisine]`, `d/[district]`, `city/[name]` 6개 파일. EN 쪽과 동일한 한 줄 픽스. **(즉시 배포 권장)**

### T3. [HIGH] 시그니처 콘텐츠 "Famous vs Good"이 단 1페이지
ig-seed.json에 카테고리 1개(bangkok-cafes, 20시드)뿐. 사이트 차별점이자 최고 공유 포맷인데 확장 0. → 브런치/루프탑/차이나타운/틱톡바이럴/한인맛집(ko 시너지)/지구별 에디션 — 카테고리당 시드 ~20행이면 `fvg:ingest`로 생성 가능.

### T4. [HIGH] 이미 스크래핑한 데이터로 만들 수 있는 프로그래매틱 페이지 방치
master_db에 이미 있는 것: `rating_trend`(뜨는/지는 집), `language_breakdown`(로컬 vs 관광객 — "Loved by locals, ignored by Instagram" 브랜드 완벽 부합), `mentioned_topics`(음식별: "best pad thai"), lat/lng(**BTS역 주변** — 방콕 검색 최대 패턴). 전부 랜딩페이지 0개. "open now"/가격대 페이지는 데이터 부족(opening_hours 미수집, price_level 217/3,630) → 스크래퍼 확장 과제.

### T5. [HIGH] 레스토랑 타이틀 ~95자 + 이중 브랜딩
`restaurant/[id]/page.tsx:45` + layout 템플릿이 파이프 2개 중첩 → 머니페이지 3,630개 전부 SERP 잘림. "| Menu, Reviews & Trust Score" 제거.

### T6. [MED] 롱테일 고아 페이지
district 없는 레스토랑 1,271 / cuisine 없는 곳 614 / 둘 다 없는 곳 256 — 인바운드 링크가 similar 4슬롯뿐. → 페이지네이션(`/c/[cuisine]/p/2`) 또는 A-Z 전체 색인.

### T7. [MED] 로케일 간 크롤 가능 링크 0
LangSwitcher가 button+router.push — `<a>` 없음 → th/ko 허브 ~200페이지 내부링크 0. → 실제 `<a hrefLang>` 렌더 + 푸터 로케일 링크.

### T8. [MED] Restaurant JSON-LD에 `image` 없음 → 리치리절트 자격 미달
OG PNG URL이라도 넣으면 됨. `servesCuisine`에 raw slug 대신 라벨. ※ `aggregateRating`이 Google 자체 평점 재게시인 점은 정책 리스크로 인지 필요.

### T9. [MED] robots.ts가 `/_next/` 차단 — Googlebot 렌더 리소스 차단
`app/robots.ts:13` — CSS/JS 차단은 모바일 친화성 평가 저하. `/api/`만 남기고 `/_next/` 제거.

### T10. [MED] 그로스 루프 반제품
IndexNow 키 파일만 있고 핑 코드 없음(Bing+**Naver** — ko 타겟에 중요) · feed.xml `rel=alternate` 미선언·푸터 미노출 · 공유 URL에 UTM 없음(바이럴 측정 불가) · 오너용 "Trust Score 배지" 임베드(백링크 루프) 부재.

### T11. 기타
- combo 페이지(~460) thin/doorway 프로필 — 이웃 지구/동일 지구 타 cuisine 크로스링크 추가
- SearchAction이 존재하지 않는 `/?q=` 지목 (B와 중복) — 구현 또는 제거
- Organization schema에 logo/sameAs 없음 — SNS 테마 사이트인데 소셜 프로필 0
- 허브 OG 이미지 전부 루트 공용 카드 — 레스토랑 카드 스타일 복제 시 소셜 CTR 상승
- OG 카드 ASCII 필터 때문에 태국어/한국어 상호가 카드에서 사라짐 — Noto Thai/KR 서브셋 폰트 번들 고려
- famous-vs-good 타이틀 "(2026)" 하드코딩, 홈 "1.3M reviews" 하드코딩 — 드리프트

---

## ④ UI/UX — 체류시간 극대화

### D1. [HIGH/S] `next/link` 사용 0 — 클릭마다 풀 리로드
레포 전체 grep 결과 next/link 0건. 모든 내비가 `<a>` → 클릭마다 흰 화면 + layout 재다운로드 + 카운트 재fetch. 클릭 모멘텀 사망.
→ **단, 서버 감사와 조율 필요**: 200장 허브 리스트에 무분별한 Link 프리페치는 RSC 전송량 폭증. 권장안: 헤더/BottomNav/브레드크럼/similar 등 **핵심 내비만 Link(prefetch 기본)**, 허브 카드 리스트는 `prefetch={false}` Link → 전환은 빨라지고 전송량은 안 늚.

### D2. [HIGH/M] 맛집 사이트에 사진 0장
Restaurant 타입에 image 필드 자체가 없음. → 이미 Maps 스크래핑 중이니 빌드타임에 Places 사진 1~3장 백필 + cuisine 아이콘 폴백. 디테일 히어로 1장 + 카드 썸네일만으로도 체류/공유 최대 레버.

### D3. [HIGH/S] 검색이 홈 3페이지에만 존재
SEO 유입 대부분이 레스토랑 페이지로 랜딩하는데 검색하려면 홈으로 가야 함. → 헤더 🔍 + BottomNav 검색 탭 → 풀스크린 오버레이(기존 SearchBar+search-index 재사용).

### D4. [HIGH/S] 디테일 페이지의 유일한 재순환 링크가 모바일 ~8스크린 아래
similar 4개가 aside 최하단(광고·이메일박스 아래). → "More like this" 카드 6~8장을 리뷰 발췌 직후 본문에 + `/c/[cuisine]/[district]` 링크(존재하는데 디테일에서 안 씀).

### D5. [HIGH/S] 모바일 고정 CTA바가 100% 이탈 링크
Directions+Call뿐 — 최고 요지가 세션 종료 버튼. → Save(하트)+Share 추가.

### D6. [HIGH/S] th/ko 이용자 이류 취급
로케일 전환 시 컨텍스트 버리고 홈으로 덤핑(LangSwitcher:20-23), th/ko 홈은 EN 대비 콘텐츠 절반(Famous-vs-Good/Best-of/가이드 없음), 카드 UI 문구 영어 고정(`lib/strings.ts` 있는데 미사용). Thai 유저가 핵심 타겟인데.

### D7. [HIGH/S] "최근 본 맛집" 부재 — 최저비용 재방문 장치
savedRestaurants 패턴 + `/api/restaurants?ids=` 이미 있음 → ~1시간 작업.

### D8. [HIGH/S] "Surprise me" 🎲 부재
search-index 이미 클라이언트에 있음 → 백엔드 0으로 랜덤 픽 가능. "random hidden gem"(trust≥80, 리뷰<500) 변형도.

### D9. [MED] 기타
- 홈 히어로 CTA "Get personalized picks"가 **기존 프리퍼런스 무조건 삭제** 후 리로드 (ResetPrefsButton) → prefs 있으면 "Your picks ↓" 스크롤로
- 허브 페이지 100~200장 무필터 덤프 — 정렬(Trust/★/리뷰수)+가격 필터 툴바 (Show more 청킹은 S1 카드 캡과 함께 설계)
- LINE 공유 없음(WhatsApp만) — 태국 1위 메신저
- 검색 빈 결과가 데드엔드 + cuisine 검색 불가(인덱스에 있는데 SearchBar가 안 씀)
- loading.tsx/스켈레톤 0개, 저장 목록 공유 불가(URL 인코딩으로 "my Bangkok list" 바이럴 루프 가능), 비교 기능 부재(사이트 기획 자체가 비교인데)
- 가이드→레스토랑 링크 0, 헤더 "Best of"가 /best/halal로 (인덱스 페이지 신설 필요)
- 이메일 가입 인센티브 없음 → 컨텍스트형("{district} 새 히든젬 알림")으로

---

## 실행 로드맵

### Phase 1 — 즉시 (오늘, 서버 생존 + 치명 버그) ~2시간
1. th/ko 허브 6개 `dynamicParams=false` (T2)
2. middleware matcher 축소 + www→Vercel Domains (S2)
3. 허브 카드 수 캡 24~36 (S1)
4. sitemap route handler + 캐시 (S3)
5. 로케일 리다이렉트 쿼리 보존 (B3)
6. /best 빈 페이지 3개 처리 (B1)
7. JSON-LD `<` 이스케이프 (B6)
→ 한 번에 배포 (배포 자체가 writes 비용이므로 묶어서 1회)

### Phase 2 — 이번 주 (트래픽 기반 + 남은 HIGH 버그)
- famous-vs-good 매칭 픽스 (B2) + 커뮤니티 50개 캡 (B4) + 크롬 내비 로케일 (B5)
- 타이틀 다이어트 (T5), robots `/_next/` 해제 (T9), search-index 정적화/지연 (S5), community MGET (S6)
- OG PNG → public/ 이전 (S4)
- 데이터 파이프라인 부활 (T1) — **스크래퍼 쪽 작업 필요**

### Phase 3 — 다음 2주 (성장)
- next/link 선별 도입 (D1) + 검색 전역화 (D3) + 디테일 재순환 (D4, D5)
- 최근 본/Surprise me (D7, D8), th/ko 동등화 (D6)
- Famous vs Good 카테고리 5개+ 확장 (T3), BTS역/로컬픽 프로그래매틱 페이지 (T4)
- 사진 백필 (D2) — 스크래퍼 확장과 함께

### 건드리지 말 것 (검증된 강점)
hreflang 상호성, JSON-LD 구성 다양성, llms.txt 체계, 44px 탭 타겟, 커뮤니티 카운트 배칭 구조, `revalidate` 무사용 원칙.
