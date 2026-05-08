# Perf / Lighthouse Playbook

production 사이트 perf 측정 + 개선 사이클.

## 1. 측정

### Quick — Google PageSpeed Insights (브라우저)
즉시 측정, 수치 + opportunity 리포트:
- https://pagespeed.web.dev/?url=https%3A%2F%2Fwww.bangkokbotoxclinic.com
- https://pagespeed.web.dev/?url=https%3A%2F%2Fsnsstopper.com

각 사이트 측정 후 4 점수 (Performance / Accessibility / Best Practices / SEO) 기록.

### CLI baseline (자동, 반복 가능)
```bash
bash scripts/measure_lighthouse.sh
```
→ 3 URL 측정, 콘솔 출력 + `lighthouse_baseline.json`에 timestamped json 저장.

`jq` 필요 (Git Bash 기본 포함). 없으면: `winget install jqlang.jq`.

## 2. 목표 점수 (Phase 1 — 트래픽 시작 단계)

| 카테고리 | 목표 | 현재 알려진 |
|---|---|---|
| Performance | ≥ 90 | 미측정 (예상 80+ — 정적 SSG, system font, 작은 bundle) |
| Accessibility | ≥ 95 | 미측정 |
| Best Practices | 100 | 미측정 (security headers + HTTPS 추가됨) |
| SEO | 100 | 미측정 (sitemap + meta + JSON-LD 다 갖춰짐) |

## 3. 흔한 fix 우선순위

### Performance 떨어지는 경우 흔한 원인
1. **이미지 weight** — 클리닉 site 자체 이미지 거의 없음, OK. 식당 site에 hero_image 있는 경우 next/image 적용 확인.
2. **Render blocking** — Tailwind CSS 큰 경우 → JIT/purge 확인 (next 16 turbopack 자동)
3. **Web font CLS** — system font 쓰니까 N/A. 만약 `next/font` 도입하면 `display: swap` 필수
4. **JS bundle** — 3 사이트 deps minimal (Next + React + Tailwind). 200~250KB First Load JS 예상. 더 줄이려면:
   - `dynamic import` 일부 컴포넌트 (BookingForm 등 처음에 안 보이는 거)
   - Server Component 비중 늘리기 (대부분 이미 Server)

### SEO 떨어지는 경우
1. meta description 누락 페이지 — 이미 모든 동적 페이지에 generateMetadata 있음
2. canonical 누락 — 카테고리/구/clinic 다 추가됨 (commit `9dc817e`)
3. mobile-friendly viewport — `next/metadata` 자동
4. https — 이미 OK

### Accessibility 떨어지는 경우
1. **alt text** — 이미지 거의 없어서 큰 이슈 X. 단 Logo svg에 aria-label 있는지 확인
2. **color contrast** — accent 컬러가 흰 배경에 4.5:1 미만이면 fail. CSS var theme 디자인 시 체크
3. **focus ring** — input 등 focus 표시 (이미 `focus:ring-2 focus:ring-[var(--accent)]`)
4. **heading 계층** — h1 → h2 → h3 일관성

### Best Practices 떨어지는 경우
1. **HTTPS / HSTS** — 이미 추가됨
2. **Console errors / 404s** — 일반적으로 깨끗
3. **outdated libraries** — Next 16 / React 19 최신

## 4. 측정 cadence

- **출시 전**: 각 site 1회, baseline 기록
- **major UI 변경 후**: 1회 (regression 체크)
- **monthly**: 1회 trends 추적
- **traffic 급증 시**: 즉시 (캐시 적중률 체크)

## 5. 측정 후 작업

baseline.json의 `scores` < 목표면:
1. PSI 리포트의 "Opportunities" 섹션에서 가장 시간 절약 큰 거 1개 → 코드 fix
2. 다시 측정, 개선됐나 확인
3. commit message에 score 변화 기록 (`perf: A=92→97 by lazy-loading X`)

## 6. 외부 도구

- [PageSpeed Insights](https://pagespeed.web.dev) — 빠른 1회 체크
- [WebPageTest](https://www.webpagetest.org) — multi-region 시뮬레이션
- [Chrome DevTools Lighthouse](chrome://devtools) — 로컬 build에도
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights) — real user monitoring (RUM). 활성화: dashboard → Project → Speed Insights. 무료
- [Vercel Analytics](https://vercel.com/docs/analytics) — page view RUM. 무료 tier

Vercel Speed Insights 켜는 거 추천 — RUM 데이터 (실 사용자 vitals)는 합성 lighthouse보다 정확.
