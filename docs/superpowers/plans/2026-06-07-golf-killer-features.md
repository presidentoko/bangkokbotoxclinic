# Golf Killer Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 태국 골프 사이트에 ① All-Inclusive 가격 비교, ② 티타임 모아보기, ③ 날씨/배수 알림 추가 + Cloudflare Pages → Vercel ISR 전환.

**Architecture:** GitHub Actions Cron(Python 스크래퍼) → JSON 파일 커밋 → Vercel 자동 재배포. 날씨는 Vercel ISR revalidate=3600 으로 OpenWeatherMap API 호출. 배수 점수는 기존 리뷰 텍스트 NLP로 빌드타임 계산.

**Tech Stack:** Next.js 15 App Router, Vercel ISR, Python 3 (requests + BeautifulSoup4 + rapidfuzz), OpenWeatherMap API, GitHub Actions

---

## File Map

| 파일 | 작업 | 역할 |
|------|------|------|
| `web-golf/next.config.ts` | 수정 | `output: "export"` 제거 → ISR 활성화 |
| `web-golf/lib/types.ts` | 수정 | Course에 drainage 필드 추가, PriceEntry/TeeSlot 타입 추가 |
| `web-golf/lib/priceMatrix.ts` | 신규 | price_matrix.json 로더 + 총액 계산 헬퍼 |
| `web-golf/lib/weather.ts` | 신규 | OpenWeatherMap API 호출 + 배수 위험도 계산 |
| `web-golf/data/price_matrix.json` | 신규 | 스크래퍼 출력 (초기: 빈 배열) |
| `web-golf/public/tee_times.json` | 신규 | 스크래퍼 출력 (초기: 빈 슬롯) |
| `web-golf/app/price-compare/page.tsx` | 신규 | All-Inclusive 가격 비교 정적 페이지 |
| `web-golf/app/tee-times/page.tsx` | 신규 | 잔여 티타임 타임라인 정적 페이지 |
| `web-golf/app/conditions/page.tsx` | 신규 | 날씨/배수 현황 ISR 페이지 |
| `web-golf/app/course/[id]/page.tsx` | 수정 | 코스 상세에 배수 신호등 뱃지 추가 |
| `scripts/drainage_nlp.py` | 신규 | 리뷰 NLP → drainage_score 계산 |
| `scripts/price_scraper.py` | 신규 | 에이전시 3곳 가격 스크래핑 |
| `scripts/tee_scraper.py` | 신규 | 에이전시 3곳 티타임 스크래핑 |
| `.github/workflows/drainage-nlp.yml` | 신규 | 매일 03:00 drainage NLP 실행 |
| `.github/workflows/scrape-prices.yml` | 신규 | 매 6시간 가격 스크래핑 |
| `.github/workflows/scrape-teetimes.yml` | 신규 | 매 30분 티타임 스크래핑 |

---

## Task 1: Vercel ISR 전환 (플랫폼 마이그레이션)

**Files:**
- Modify: `web-golf/next.config.ts`

- [ ] **Step 1: next.config.ts 수정**

```typescript
// web-golf/next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: false,
  images: { unoptimized: true },
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
};

export default config;
```

- [ ] **Step 2: 빌드 확인**

```bash
cd web-golf
npm run build
```

Expected: 빌드 성공. `output: export` 관련 에러 없음.  
주의: `export const dynamic = "force-static"` 선언된 페이지들은 그대로 정적으로 빌드됨 — 수정 불필요.

- [ ] **Step 3: 커밋**

```bash
git add web-golf/next.config.ts
git commit -m "feat(web-golf): drop output:export → enable Vercel ISR"
```

---

## Task 2: 타입 확장 (Course + 새 타입 추가)

**Files:**
- Modify: `web-golf/lib/types.ts`

- [ ] **Step 1: Course 타입에 drainage 필드 추가**

`web-golf/lib/types.ts` 의 `Course` 타입 끝 (`website_phone_secondary` 아래)에 추가:

```typescript
  // ── Drainage & condition scores (drainage_nlp.py) ─────────
  drainage_score?: number;          // 0–100, 높을수록 배수 양호
  drainage_keywords?: string[];     // 발견된 키워드 목록
  drainage_mentions?: number;       // 부정 키워드 발견 횟수
```

- [ ] **Step 2: PriceEntry 타입 추가**

`web-golf/lib/types.ts` 파일 맨 끝에 추가:

```typescript
export type PriceSlot = {
  greenfee: number;
  caddy: number;
  cart: number;
};

export type PriceEntry = {
  course_id: string;
  scraped_at: string;
  source_agency: string;
  source_url: string;
  weekday: {
    morning?: PriceSlot;
    twilight?: PriceSlot;
  };
  weekend: {
    morning?: PriceSlot;
    twilight?: PriceSlot;
  };
  notes?: string;
};

export type TeeSlot = {
  course_id: string;
  course_name: string;
  date: string;          // "YYYY-MM-DD"
  time: string;          // "HH:MM"
  agency: string;
  booking_url: string;
  total_baht: number;
  available: boolean;
};

export type TeeTimesJson = {
  updated_at: string;
  slots: TeeSlot[];
};
```

- [ ] **Step 3: 커밋**

```bash
git add web-golf/lib/types.ts
git commit -m "feat(web-golf): add drainage/price/tee types"
```

---

## Task 3: drainage_nlp.py — 리뷰 NLP 배수 점수 계산

**Files:**
- Create: `scripts/drainage_nlp.py`

- [ ] **Step 1: 스크립트 작성**

`deliverable/` 루트 기준 `scripts/drainage_nlp.py` 생성 (web-golf 스크래퍼 파이프라인과 동일 위치):

```python
#!/usr/bin/env python3
"""drainage_nlp.py — master_db.json 의 리뷰 텍스트에서 배수 점수를 계산한다."""

import json
from pathlib import Path

DRAINAGE_BAD = [
    "waterlogged", "flooded", "water logged", "soggy", "swampy",
    "น้ำท่วม", "ระบายน้ำไม่ดี", "น้ำขัง",
    "수중전", "물 고임", "배수 안", "침수", "물난리",
]
DRAINAGE_GOOD = [
    "drains well", "fast drainage", "good drainage", "well drained",
    "ระบายน้ำดี", "ระบายน้ำได้ดี",
    "배수 좋", "배수 잘", "배수 양호",
]

def compute_drainage(reviews: list[str]) -> dict:
    text = " ".join(r.lower() for r in reviews if r)
    bad = [kw for kw in DRAINAGE_BAD if kw in text]
    good_count = sum(1 for kw in DRAINAGE_GOOD if kw in text)
    score = max(0, min(100, 100 - len(bad) * 15 + good_count * 10))
    return {
        "drainage_score": score,
        "drainage_keywords": bad,
        "drainage_mentions": len(bad),
    }

def extract_review_texts(course: dict) -> list[str]:
    texts = []
    for field in ("sample_reviews_en", "sample_reviews_th", "sample_reviews_ko"):
        for r in course.get(field) or []:
            if isinstance(r, dict) and r.get("text"):
                texts.append(r["text"])
    for r in course.get("scraped_reviews") or []:
        if isinstance(r, dict) and r.get("text"):
            texts.append(r["text"])
    return texts

def main():
    db_path = Path(__file__).parent.parent / "web-golf" / "data" / "master_db.json"
    db = json.loads(db_path.read_text(encoding="utf-8"))
    updated = 0
    for course in db["courses"]:
        texts = extract_review_texts(course)
        if texts:
            result = compute_drainage(texts)
            course.update(result)
            updated += 1
        else:
            course.setdefault("drainage_score", 50)
            course.setdefault("drainage_keywords", [])
            course.setdefault("drainage_mentions", 0)
    db_path.write_text(
        json.dumps(db, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"drainage_nlp: updated {updated}/{len(db['courses'])} courses")

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: 실행 및 결과 확인**

```bash
cd C:/Users/yn/Desktop/Work/0_main/deliverable/deliverable
python scripts/drainage_nlp.py
```

Expected 출력: `drainage_nlp: updated NNN/639 courses`

```bash
python -c "
import json
db = json.load(open('web-golf/data/master_db.json'))
scored = [c for c in db['courses'] if c.get('drainage_score') is not None]
print('Scored:', len(scored))
low = sorted(scored, key=lambda c: c['drainage_score'])[:3]
for c in low:
    print(c['name'], c['drainage_score'], c['drainage_keywords'])
"
```

Expected: 적어도 한 코스 이상 drainage_keywords 존재, 점수 0~100 범위 내.

- [ ] **Step 3: 커밋**

```bash
git add scripts/drainage_nlp.py web-golf/data/master_db.json
git commit -m "feat: drainage_nlp — compute drainage_score from review NLP"
```

---

## Task 4: lib/weather.ts — OpenWeatherMap 헬퍼

**Files:**
- Create: `web-golf/lib/weather.ts`

- [ ] **Step 1: weather.ts 작성**

```typescript
// web-golf/lib/weather.ts
// OpenWeatherMap One Call API 3.0 — 최근 7일 강수량 합산

const OWM_KEY = process.env.OPENWEATHERMAP_API_KEY ?? "";

export type WeatherResult = {
  rainfall7d_mm: number;    // 최근 7일 누적 강수량
  fetched_at: string;
};

export async function fetchRainfall(lat: number, lng: number): Promise<WeatherResult> {
  if (!OWM_KEY) return { rainfall7d_mm: 0, fetched_at: new Date().toISOString() };

  // Free tier: current + forecast only. We use 5-day forecast daily rain sum as proxy.
  const url =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}` +
    `&appid=${OWM_KEY}&units=metric&cnt=40`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return { rainfall7d_mm: 0, fetched_at: new Date().toISOString() };

  const data = await res.json();
  // 3-hour slots — sum rain.3h for last 56 slots (~7 days)
  const total = (data.list ?? []).slice(0, 56).reduce(
    (sum: number, slot: { rain?: { "3h"?: number } }) => sum + (slot.rain?.["3h"] ?? 0),
    0
  );

  return {
    rainfall7d_mm: Math.round(total * 10) / 10,
    fetched_at: new Date().toISOString(),
  };
}

export type DrainageStatus = "safe" | "caution" | "danger";

export function drainageStatus(
  drainageScore: number,
  rainfall7d: number
): DrainageStatus {
  if (drainageScore < 40 || rainfall7d > 60) return "danger";
  if (drainageScore < 70 || rainfall7d > 30) return "caution";
  return "safe";
}

export const STATUS_EMOJI: Record<DrainageStatus, string> = {
  safe: "🟢",
  caution: "🟡",
  danger: "🔴",
};

export const STATUS_LABEL: Record<DrainageStatus, string> = {
  safe: "정상 — 라운딩 가능",
  caution: "주의 — 일부 구간 습함",
  danger: "위험 — 침수 가능성",
};
```

- [ ] **Step 2: Vercel 환경변수 등록**

Vercel 대시보드 → web-golf 프로젝트 → Settings → Environment Variables:
- Key: `OPENWEATHERMAP_API_KEY`
- Value: OWM API 키 (https://openweathermap.org/api 무료 가입)
- 환경: Production + Preview + Development

또는 로컬 개발용:
```bash
echo "OPENWEATHERMAP_API_KEY=your_key_here" >> web-golf/.env.local
```

- [ ] **Step 3: 커밋**

```bash
git add web-golf/lib/weather.ts
git commit -m "feat(web-golf): add OpenWeatherMap weather helper"
```

---

## Task 5: /conditions 페이지 — 날씨/배수 현황

**Files:**
- Create: `web-golf/app/conditions/page.tsx`

- [ ] **Step 1: /conditions 페이지 작성**

```typescript
// web-golf/app/conditions/page.tsx
import { loadMasterDb } from "@/lib/data";
import { fetchRainfall, drainageStatus, STATUS_EMOJI, STATUS_LABEL } from "@/lib/weather";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const revalidate = 3600; // 1시간 ISR

export const metadata: Metadata = {
  title: "Golf Course Conditions — Bangkok Drainage & Weather Alert",
  description:
    "실시간 배수 현황 및 최근 강수량 기준 방콕 골프장 라운딩 가능 여부. 우기 대응 필수 정보.",
  alternates: { canonical: "/conditions" },
};

// 방콕 권역만 필터 (lat 13.0~14.5, lng 99.5~101.5)
function isBangkokArea(lat: number | null, lng: number | null) {
  if (!lat || !lng) return false;
  return lat >= 13.0 && lat <= 14.5 && lng >= 99.5 && lng <= 101.5;
}

export default async function ConditionsPage() {
  const db = await loadMasterDb();

  // 방콕 권역 코스만, drainage_score 있는 것 우선
  const courses = db.restaurants
    .filter((c) => isBangkokArea(c.lat, c.lng))
    .filter((c) => c.is_golf_filtered !== false)
    .slice(0, 60); // 최대 60개 — OWM API 절약

  // 날씨 병렬 fetch (최대 10개만 실제 API 호출, 나머지 캐시)
  const weatherData = await Promise.all(
    courses.slice(0, 10).map((c) =>
      c.lat && c.lng
        ? fetchRainfall(c.lat, c.lng)
        : Promise.resolve({ rainfall7d_mm: 0, fetched_at: "" })
    )
  );

  // 10개 대표값 평균으로 나머지 코스 채움 (방콕은 날씨 거의 동일)
  const avgRainfall =
    weatherData.reduce((s, w) => s + w.rainfall7d_mm, 0) / (weatherData.length || 1);

  const enriched = courses.map((c, i) => {
    const rain = i < 10 ? weatherData[i].rainfall7d_mm : avgRainfall;
    const score = c.drainage_score ?? 50;
    const status = drainageStatus(score, rain);
    return { ...c, rain, status };
  });

  // 위험 → 주의 → 정상 순 정렬
  const sorted = [...enriched].sort((a, b) => {
    const order = { danger: 0, caution: 1, safe: 2 };
    return order[a.status] - order[b.status];
  });

  const dangerCount = sorted.filter((c) => c.status === "danger").length;
  const cautionCount = sorted.filter((c) => c.status === "caution").length;
  const safeCount = sorted.filter((c) => c.status === "safe").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Conditions</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          골프장 날씨 & 배수 현황
        </h1>
        <p className="text-base text-[var(--muted)] max-w-2xl">
          방콕 권역 {courses.length}개 코스 · 최근 강수량 + 배수 평점 기반 라운딩 가능 여부.
          매 1시간 자동 갱신.
        </p>
        <div className="flex gap-4 mt-4 text-sm font-medium">
          <span className="text-red-600">🔴 위험 {dangerCount}</span>
          <span className="text-yellow-600">🟡 주의 {cautionCount}</span>
          <span className="text-green-600">🟢 정상 {safeCount}</span>
        </div>
      </header>

      <div className="grid gap-3">
        {sorted.map((c) => (
          <a
            key={c.id}
            href={`/course/${c.id}`}
            className="flex items-center justify-between gap-4 p-4 border border-[var(--border)] rounded-xl bg-white hover:border-emerald-400 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">{STATUS_EMOJI[c.status]}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{c.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  {c.district || c.city_label} · 배수 점수 {c.drainage_score ?? 50}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-[var(--fg)]">
                {STATUS_LABEL[c.status]}
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5">
                최근 7일 강수 {c.rain.toFixed(0)}mm
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] mt-6">
        배수 점수: 구글 리뷰 텍스트에서 침수/배수 관련 키워드 자동 추출. 날씨: OpenWeatherMap 5일 예보 기반.
      </p>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Conditions", url: "/conditions" },
      ]} />
    </div>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
cd web-golf && npm run build 2>&1 | grep -E "conditions|error|Error" | head -20
```

Expected: `conditions` 페이지 빌드 성공, 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add web-golf/app/conditions/page.tsx
git commit -m "feat(web-golf): /conditions page — weather + drainage ISR"
```

---

## Task 6: 코스 상세 페이지 — 배수 신호등 뱃지

**Files:**
- Modify: `web-golf/app/course/[id]/page.tsx`

- [ ] **Step 1: import 추가**

`web-golf/app/course/[id]/page.tsx` 상단 import 목록에 추가:

```typescript
import { drainageStatus, STATUS_EMOJI, STATUS_LABEL } from "@/lib/weather";
```

- [ ] **Step 2: 배수 뱃지 JSX 삽입**

코스 상세 페이지의 `<TrustDonut ... />` 직후(또는 Manifesto 섹션 상단)에 아래 JSX 삽입.  
`r` 은 이미 페이지에서 로드된 Course 객체:

```typescript
{/* 배수 신호등 뱃지 — drainage_score 있는 코스만 */}
{r.drainage_score !== undefined && (
  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-sm">
    <span>{STATUS_EMOJI[drainageStatus(r.drainage_score, 0)]}</span>
    <span className="font-medium">배수 점수 {r.drainage_score}</span>
    <a href="/conditions" className="text-xs text-emerald-700 hover:underline ml-1">
      전체 현황 →
    </a>
  </div>
)}
```

Note: 날씨(강수량)는 코스 상세에서는 0으로 고정 — 실시간 fetch는 /conditions 전용.

- [ ] **Step 3: 빌드 + 코스 페이지 확인**

```bash
cd web-golf && npm run build 2>&1 | grep -E "course|error|Error" | head -10
```

- [ ] **Step 4: 커밋**

```bash
git add web-golf/app/course/[id]/page.tsx
git commit -m "feat(web-golf): add drainage badge to course detail page"
```

---

## Task 7: price_scraper.py — 에이전시 가격 스크래핑

**Files:**
- Create: `scripts/price_scraper.py`
- Create: `web-golf/data/price_matrix.json` (초기 빈 배열)

- [ ] **Step 1: 초기 빈 JSON 생성**

```bash
echo "[]" > web-golf/data/price_matrix.json
```

- [ ] **Step 2: 사이트 HTML 구조 확인 (필수 선행 작업)**

브라우저에서 아래 각 사이트의 코스 목록/가격 페이지를 열고 DevTools → Elements로 확인:

- `https://www.thailandgolfcentre.com/golf-courses/` — 코스별 가격 컨테이너 CSS 클래스 확인
- `https://www.golfasian.com/golf-courses/thailand/bangkok/` — 동일
- `https://www.monkeytravel.com/golf-in-thailand/` — 동일

각 사이트의 확인 결과를 아래 `SITES` 딕셔너리에 채워넣음.

- [ ] **Step 3: price_scraper.py 작성**

```python
#!/usr/bin/env python3
"""price_scraper.py — 에이전시 3곳에서 방콕 골프장 가격 스크래핑."""

import json, time, re
from pathlib import Path
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup
from rapidfuzz import process, fuzz

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

# ── 사이트별 설정: 브라우저 DevTools 로 확인 후 채울 것 ──────────────────
# selector 예시: "div.course-price", "td.green-fee", "span[data-fee]"
SITES = [
    {
        "agency": "ThailandGolfCentre",
        "listing_url": "https://www.thailandgolfcentre.com/golf-courses/",
        "course_link_selector": "a.course-title",        # 코스 링크 선택자
        "name_selector": "h1.course-name",               # 코스명 선택자
        "greenfee_selector": "td.green-fee",             # 그린피 셀
        "caddy_selector": "td.caddy-fee",                # 캐디피 셀
        "cart_selector": "td.cart-fee",                  # 카트비 셀
        "max_pages": 5,
    },
    {
        "agency": "GolfAsian",
        "listing_url": "https://www.golfasian.com/golf-courses/thailand/bangkok/",
        "course_link_selector": "a.course-name",
        "name_selector": "h1",
        "greenfee_selector": ".green-fee",
        "caddy_selector": ".caddy-fee",
        "cart_selector": ".cart-fee",
        "max_pages": 3,
    },
    {
        "agency": "MonkeyTravel",
        "listing_url": "https://www.monkeytravel.com/golf-in-thailand/",
        "course_link_selector": "a.course-link",
        "name_selector": "h1.title",
        "greenfee_selector": ".fee-greenfee",
        "caddy_selector": ".fee-caddy",
        "cart_selector": ".fee-cart",
        "max_pages": 3,
    },
]
# ─────────────────────────────────────────────────────────────────────────────

MATCH_THRESHOLD = 85  # rapidfuzz 점수 기준

def fetch_html(url: str) -> BeautifulSoup | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"  SKIP {url}: {e}")
        return None

def parse_baht(text: str) -> int | None:
    """'1,500 THB' → 1500, 숫자 없으면 None."""
    m = re.search(r"[\d,]+", text.replace(",", ""))
    if not m:
        return None
    try:
        return int(m.group().replace(",", ""))
    except ValueError:
        return None

def scrape_site(site: dict, master_names: list[str]) -> list[dict]:
    results = []
    soup = fetch_html(site["listing_url"])
    if not soup:
        return []

    links = [a["href"] for a in soup.select(site["course_link_selector"]) if a.get("href")]
    print(f"  {site['agency']}: {len(links)} course links found")

    for url in links[:50]:  # 최대 50개
        if not url.startswith("http"):
            url = "https://" + url.lstrip("/")

        time.sleep(1)  # 서버 부하 방지
        page = fetch_html(url)
        if not page:
            continue

        name_el = page.select_one(site["name_selector"])
        if not name_el:
            continue
        agency_name = name_el.get_text(strip=True)

        # rapidfuzz 매칭
        match = process.extractOne(agency_name, master_names, scorer=fuzz.WRatio)
        if not match or match[1] < MATCH_THRESHOLD:
            print(f"  NO MATCH: '{agency_name}' (best: {match})")
            continue

        def get_fee(sel: str) -> int | None:
            el = page.select_one(sel)
            return parse_baht(el.get_text()) if el else None

        gf = get_fee(site["greenfee_selector"])
        caddy = get_fee(site["caddy_selector"])
        cart = get_fee(site["cart_selector"])

        if gf is None:
            continue  # 가격 없으면 스킵

        # 주중/주말 구분 없이 단일 가격이면 둘 다 동일하게 저장
        slot = {"greenfee": gf, "caddy": caddy or 400, "cart": cart or 900}
        results.append({
            "agency_name": agency_name,
            "matched_name": match[0],
            "source_url": url,
            "agency": site["agency"],
            "weekday": {"morning": slot},
            "weekend": {"morning": slot},
        })
        print(f"  MATCH: '{agency_name}' → '{match[0]}' ({match[1]:.0f}%) | {gf}+{caddy}+{cart}")

    return results


def main():
    db_path = Path(__file__).parent.parent / "web-golf" / "data" / "master_db.json"
    out_path = Path(__file__).parent.parent / "web-golf" / "data" / "price_matrix.json"
    unmatched_path = Path(__file__).parent.parent / "web-golf" / "data" / "unmatched_prices.json"

    db = json.loads(db_path.read_text(encoding="utf-8"))
    master_names = [c["name"] for c in db["courses"]]
    name_to_id = {c["name"]: c["id"] for c in db["courses"]}

    all_results: list[dict] = []
    unmatched: list[dict] = []

    for site in SITES:
        print(f"\nScraping {site['agency']}...")
        scraped = scrape_site(site, master_names)
        for r in scraped:
            course_id = name_to_id.get(r["matched_name"])
            if course_id:
                all_results.append({
                    "course_id": course_id,
                    "scraped_at": datetime.now(timezone.utc).isoformat(),
                    "source_agency": r["agency"],
                    "source_url": r["source_url"],
                    "weekday": r["weekday"],
                    "weekend": r["weekend"],
                })
            else:
                unmatched.append(r)

    out_path.write_text(json.dumps(all_results, ensure_ascii=False, indent=2), encoding="utf-8")
    unmatched_path.write_text(json.dumps(unmatched, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nDone: {len(all_results)} prices saved, {len(unmatched)} unmatched")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: 의존성 설치 및 테스트 실행**

```bash
pip install requests beautifulsoup4 rapidfuzz
python scripts/price_scraper.py
```

Expected: `Done: N prices saved, M unmatched`
첫 실행에서 N=0이 나오면 Step 2 의 CSS 선택자를 재확인.

- [ ] **Step 5: 커밋**

```bash
git add scripts/price_scraper.py web-golf/data/price_matrix.json web-golf/data/unmatched_prices.json
git commit -m "feat: price_scraper — scrape agency greenfee+caddy+cart prices"
```

---

## Task 8: lib/priceMatrix.ts + /price-compare 페이지

**Files:**
- Create: `web-golf/lib/priceMatrix.ts`
- Create: `web-golf/app/price-compare/page.tsx`

- [ ] **Step 1: priceMatrix.ts 작성**

```typescript
// web-golf/lib/priceMatrix.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PriceEntry, PriceSlot } from "./types";

const PRICE_PATH = path.join(process.cwd(), "data", "price_matrix.json");

export async function loadPriceMatrix(): Promise<PriceEntry[]> {
  try {
    const raw = await fs.readFile(PRICE_PATH, "utf-8");
    return JSON.parse(raw) as PriceEntry[];
  } catch {
    return [];
  }
}

export function totalBaht(slot: PriceSlot): number {
  return slot.greenfee + slot.caddy + slot.cart;
}

export type PriceRow = {
  course_id: string;
  source_agency: string;
  source_url: string;
  weekday_morning_total: number | null;
  weekday_morning_slot: PriceSlot | null;
  weekend_morning_total: number | null;
  weekend_morning_slot: PriceSlot | null;
  scraped_at: string;
};

export function toPriceRows(matrix: PriceEntry[]): PriceRow[] {
  return matrix.map((e) => ({
    course_id: e.course_id,
    source_agency: e.source_agency,
    source_url: e.source_url,
    scraped_at: e.scraped_at,
    weekday_morning_slot: e.weekday.morning ?? null,
    weekday_morning_total: e.weekday.morning ? totalBaht(e.weekday.morning) : null,
    weekend_morning_slot: e.weekend.morning ?? null,
    weekend_morning_total: e.weekend.morning ? totalBaht(e.weekend.morning) : null,
  }));
}
```

- [ ] **Step 2: /price-compare 페이지 작성**

```typescript
// web-golf/app/price-compare/page.tsx
import { loadMasterDb, getCourseById } from "@/lib/data";
import { loadPriceMatrix, toPriceRows } from "@/lib/priceMatrix";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Thailand Golf Price Compare — 찐 총액 그린피+캐디+카트",
  description:
    "방콕 골프장 그린피+캐디피+카트비 찐 총액 비교. 에이전시 마크업 빼고 진짜 내 지갑에서 나가는 금액 기준 정렬.",
  alternates: { canonical: "/price-compare" },
};

export default async function PriceComparePage() {
  const [db, matrix] = await Promise.all([loadMasterDb(), loadPriceMatrix()]);
  const rows = toPriceRows(matrix);

  // 주말 모닝 총액 기준 정렬, 없으면 주중 모닝, 없으면 하단
  const sorted = [...rows].sort((a, b) => {
    const ta = a.weekend_morning_total ?? a.weekday_morning_total ?? Infinity;
    const tb = b.weekend_morning_total ?? b.weekday_morning_total ?? Infinity;
    return ta - tb;
  });

  const hasPrices = sorted.filter((r) => r.weekend_morning_total !== null);
  const noPrices = sorted.filter((r) => r.weekend_morning_total === null);
  const scraped_at = matrix[0]?.scraped_at
    ? new Date(matrix[0].scraped_at).toLocaleString("ko-KR", { timeZone: "Asia/Bangkok" })
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Price Compare</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          찐 총액 가격 비교
        </h1>
        <p className="text-base text-[var(--muted)] max-w-2xl">
          그린피 + 캐디피 + 카트비 합산 기준 정렬. 에이전시 광고 가격 아닌 최종 결제 금액.
        </p>
        {scraped_at && (
          <p className="text-xs text-[var(--muted)] mt-2">마지막 업데이트: {scraped_at}</p>
        )}
      </header>

      {hasPrices.length === 0 && (
        <div className="p-8 text-center border border-[var(--border)] rounded-2xl text-[var(--muted)]">
          가격 데이터 수집 중입니다. 스크래퍼 첫 실행 후 표시됩니다.
        </div>
      )}

      {hasPrices.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-50 text-left">
                <th className="px-4 py-3 font-bold">#</th>
                <th className="px-4 py-3 font-bold">코스</th>
                <th className="px-4 py-3 font-bold text-right">그린피</th>
                <th className="px-4 py-3 font-bold text-right">캐디</th>
                <th className="px-4 py-3 font-bold text-right">카트</th>
                <th className="px-4 py-3 font-bold text-right bg-emerald-100">찐 총액 ฿</th>
                <th className="px-4 py-3 font-bold">에이전시</th>
              </tr>
            </thead>
            <tbody>
              {hasPrices.map((row, i) => {
                const course = getCourseById(db.restaurants, row.course_id);
                const slot = row.weekend_morning_slot ?? row.weekday_morning_slot!;
                const total = row.weekend_morning_total ?? row.weekday_morning_total!;
                return (
                  <tr key={row.course_id} className="border-t border-[var(--border)] hover:bg-emerald-50/30 transition">
                    <td className="px-4 py-3 text-[var(--muted)] tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a href={`/course/${row.course_id}`} className="font-medium hover:text-emerald-700 hover:underline">
                        {course?.name ?? row.course_id}
                      </a>
                      <div className="text-xs text-[var(--muted)]">{course?.district || course?.city_label}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{slot.greenfee.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{slot.caddy.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{slot.cart.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-black text-emerald-700 bg-emerald-50">
                      {total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={row.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-700 hover:underline font-medium"
                      >
                        {row.source_agency} →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {noPrices.length > 0 && (
        <div className="mt-6 text-sm text-[var(--muted)]">
          가격 미확인: {noPrices.length}개 코스
        </div>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Price Compare", url: "/price-compare" },
      ]} />
    </div>
  );
}
```

- [ ] **Step 3: 빌드 확인**

```bash
cd web-golf && npm run build 2>&1 | grep -E "price-compare|error|Error" | head -10
```

- [ ] **Step 4: 커밋**

```bash
git add web-golf/lib/priceMatrix.ts web-golf/app/price-compare/page.tsx
git commit -m "feat(web-golf): /price-compare page + priceMatrix loader"
```

---

## Task 9: tee_scraper.py — 잔여 티타임 스크래핑

**Files:**
- Create: `scripts/tee_scraper.py`
- Create: `web-golf/public/tee_times.json` (초기 빈 슬롯)

- [ ] **Step 1: 초기 빈 JSON 생성**

```bash
echo '{"updated_at":"","slots":[]}' > web-golf/public/tee_times.json
```

- [ ] **Step 2: tee_scraper.py 작성**

```python
#!/usr/bin/env python3
"""tee_scraper.py — 에이전시 3곳에서 잔여 티타임 스크래핑 (오늘~7일)."""

import json, time, re
from pathlib import Path
from datetime import datetime, timezone, timedelta

import requests
from bs4 import BeautifulSoup
from rapidfuzz import process, fuzz

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

# ── 사이트별 설정: 브라우저 DevTools 로 확인 후 채울 것 ──────────────────
# 각 에이전시의 예약 캘린더 URL 패턴과 슬롯 선택자
# 예: "https://www.agencysite.com/book/{course_slug}?date={date}"
AGENCIES = [
    {
        "agency": "ThailandGolfCentre",
        "search_url": "https://www.thailandgolfcentre.com/tee-times/?date={date}",
        "slot_selector": "div.tee-time-slot",           # 슬롯 컨테이너
        "time_selector": "span.slot-time",              # 시간 "07:12"
        "course_selector": "span.course-name",          # 코스명
        "price_selector": "span.total-price",           # 총액
        "book_link_selector": "a.book-now",             # 예약 링크
    },
    {
        "agency": "GolfAsian",
        "search_url": "https://www.golfasian.com/book/?date={date}&region=bangkok",
        "slot_selector": ".tee-slot",
        "time_selector": ".tee-time",
        "course_selector": ".course-title",
        "price_selector": ".price-total",
        "book_link_selector": "a.btn-book",
    },
    {
        "agency": "MonkeyTravel",
        "search_url": "https://www.monkeytravel.com/golf/?date={date}",
        "slot_selector": ".slot-item",
        "time_selector": ".time",
        "course_selector": ".course",
        "price_selector": ".price",
        "book_link_selector": "a.book",
    },
]
# ─────────────────────────────────────────────────────────────────────────────

MATCH_THRESHOLD = 80

def fetch_html(url: str) -> BeautifulSoup | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"  SKIP {url}: {e}")
        return None

def parse_baht(text: str) -> int:
    m = re.search(r"[\d,]+", text.replace(",", ""))
    try:
        return int(m.group()) if m else 0
    except ValueError:
        return 0

def parse_time(text: str) -> str | None:
    m = re.search(r"\d{1,2}:\d{2}", text)
    return m.group() if m else None

def scrape_agency(agency: dict, date_str: str, master_names: list[str], name_to_id: dict) -> list[dict]:
    url = agency["search_url"].format(date=date_str)
    soup = fetch_html(url)
    if not soup:
        return []

    slots_found = []
    for slot_el in soup.select(agency["slot_selector"]):
        time_el = slot_el.select_one(agency["time_selector"])
        course_el = slot_el.select_one(agency["course_selector"])
        price_el = slot_el.select_one(agency["price_selector"])
        link_el = slot_el.select_one(agency["book_link_selector"])

        if not (time_el and course_el):
            continue

        tee_time = parse_time(time_el.get_text(strip=True))
        if not tee_time:
            continue

        agency_course_name = course_el.get_text(strip=True)
        match = process.extractOne(agency_course_name, master_names, scorer=fuzz.WRatio)
        if not match or match[1] < MATCH_THRESHOLD:
            continue

        course_id = name_to_id.get(match[0], "")
        if not course_id:
            continue

        href = link_el["href"] if link_el and link_el.get("href") else url
        if not href.startswith("http"):
            href = "https://" + href.lstrip("/")

        slots_found.append({
            "course_id": course_id,
            "course_name": match[0],
            "date": date_str,
            "time": tee_time,
            "agency": agency["agency"],
            "booking_url": href,
            "total_baht": parse_baht(price_el.get_text()) if price_el else 0,
            "available": True,
        })

    print(f"  {agency['agency']} / {date_str}: {len(slots_found)} slots")
    return slots_found


def main():
    db_path = Path(__file__).parent.parent / "web-golf" / "data" / "master_db.json"
    out_path = Path(__file__).parent.parent / "web-golf" / "public" / "tee_times.json"

    db = json.loads(db_path.read_text(encoding="utf-8"))
    master_names = [c["name"] for c in db["courses"]]
    name_to_id = {c["name"]: c["id"] for c in db["courses"]}

    # 오늘 + 앞 7일
    today = datetime.now(timezone(timedelta(hours=7)))  # Bangkok UTC+7
    dates = [(today + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(8)]

    all_slots: list[dict] = []
    for agency in AGENCIES:
        for date_str in dates:
            slots = scrape_agency(agency, date_str, master_names, name_to_id)
            all_slots.extend(slots)
            time.sleep(0.5)

    # 날짜→시간 정렬
    all_slots.sort(key=lambda s: (s["date"], s["time"]))

    result = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "slots": all_slots,
    }
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nDone: {len(all_slots)} slots saved to {out_path}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: 테스트 실행**

```bash
python scripts/tee_scraper.py
```

Expected: `Done: N slots saved`
N=0이면 CSS 선택자 재확인 필요.

- [ ] **Step 4: 커밋**

```bash
git add scripts/tee_scraper.py web-golf/public/tee_times.json
git commit -m "feat: tee_scraper — scrape available tee time slots"
```

---

## Task 10: /tee-times 페이지

**Files:**
- Create: `web-golf/app/tee-times/page.tsx`

- [ ] **Step 1: /tee-times 페이지 작성**

```typescript
// web-golf/app/tee-times/page.tsx
import { promises as fs } from "node:fs";
import path from "node:path";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { TeeTimesJson, TeeSlot } from "@/lib/types";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Golf Tee Times — 오늘/이번 주말 잔여 슬롯",
  description:
    "방콕 골프장 실시간 잔여 티타임. 주말 모닝 슬롯 땡처리 모아보기. ThailandGolfCentre, GolfAsian, MonkeyTravel 통합.",
  alternates: { canonical: "/tee-times" },
};

async function loadTeeTimes(): Promise<TeeTimesJson> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "tee_times.json"),
      "utf-8"
    );
    return JSON.parse(raw) as TeeTimesJson;
  } catch {
    return { updated_at: "", slots: [] };
  }
}

function groupByDate(slots: TeeSlot[]): Map<string, TeeSlot[]> {
  const map = new Map<string, TeeSlot[]>();
  for (const s of slots) {
    if (!map.has(s.date)) map.set(s.date, []);
    map.get(s.date)!.push(s);
  }
  return map;
}

function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr);
  return d.getDay() === 0 || d.getDay() === 6;
}

function isMorning(time: string): boolean {
  const h = parseInt(time.split(":")[0], 10);
  return h >= 6 && h < 10;
}

const AGENCY_COLORS: Record<string, string> = {
  ThailandGolfCentre: "bg-blue-100 text-blue-800",
  GolfAsian: "bg-purple-100 text-purple-800",
  MonkeyTravel: "bg-orange-100 text-orange-800",
};

export default async function TeeTimesPage() {
  const data = await loadTeeTimes();
  const morningSlots = data.slots.filter((s) => isMorning(s.time));
  const byDate = groupByDate(morningSlots);

  const updatedAt = data.updated_at
    ? new Date(data.updated_at).toLocaleString("ko-KR", { timeZone: "Asia/Bangkok" })
    : null;

  const weekendDates = [...byDate.keys()].filter(isWeekend);
  const allDates = [...byDate.keys()];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Tee Times</span>
      </nav>

      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">잔여 티타임</h1>
            <p className="text-base text-[var(--muted)]">
              모닝 (06:00–10:00) 슬롯 · {morningSlots.length}개 잔여 · {allDates.length}일치
            </p>
          </div>
          {updatedAt && (
            <div className="text-xs text-[var(--muted)] text-right shrink-0">
              Updated<br />
              <span className="font-medium text-[var(--fg)]">{updatedAt}</span>
            </div>
          )}
        </div>
      </header>

      {morningSlots.length === 0 && (
        <div className="p-8 text-center border border-[var(--border)] rounded-2xl text-[var(--muted)]">
          티타임 데이터 수집 중입니다. 스크래퍼 첫 실행 후 표시됩니다.
        </div>
      )}

      <div className="space-y-8">
        {allDates.map((date) => {
          const slots = byDate.get(date)!;
          const weekend = isWeekend(date);
          const label = new Date(date).toLocaleDateString("ko-KR", {
            month: "long", day: "numeric", weekday: "short",
          });
          return (
            <section key={date}>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                {label}
                {weekend && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    주말
                  </span>
                )}
                <span className="text-xs text-[var(--muted)] font-normal">
                  {slots.length}개 슬롯
                </span>
              </h2>
              <div className="grid gap-2">
                {slots.map((s, i) => (
                  <div
                    key={`${s.course_id}-${s.time}-${i}`}
                    className="flex items-center justify-between gap-3 p-3 border border-[var(--border)] rounded-xl bg-white hover:border-emerald-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black tabular-nums text-emerald-700 w-12 shrink-0">
                        {s.time}
                      </span>
                      <div>
                        <a href={`/course/${s.course_id}`} className="font-medium text-sm hover:text-emerald-700 hover:underline">
                          {s.course_name}
                        </a>
                        <div className="mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${AGENCY_COLORS[s.agency] ?? "bg-gray-100 text-gray-700"}`}>
                            {s.agency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {s.total_baht > 0 && (
                        <span className="text-sm font-bold tabular-nums">
                          {s.total_baht.toLocaleString()}฿
                        </span>
                      )}
                      <a
                        href={s.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
                      >
                        예약 →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Tee Times", url: "/tee-times" },
      ]} />
    </div>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
cd web-golf && npm run build 2>&1 | grep -E "tee-times|error|Error" | head -10
```

- [ ] **Step 3: 커밋**

```bash
git add web-golf/app/tee-times/page.tsx
git commit -m "feat(web-golf): /tee-times page — morning slot timeline"
```

---

## Task 11: GitHub Actions 워크플로우 3개

**Files:**
- Create: `.github/workflows/drainage-nlp.yml`
- Create: `.github/workflows/scrape-prices.yml`
- Create: `.github/workflows/scrape-teetimes.yml`

- [ ] **Step 1: drainage-nlp.yml 작성**

`.github/workflows/drainage-nlp.yml` (deliverable 루트 기준):

```yaml
name: Drainage NLP

on:
  schedule:
    - cron: '0 3 * * *'   # 매일 03:00 UTC (Bangkok 10:00)
  workflow_dispatch:

jobs:
  nlp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install deps
        run: pip install rapidfuzz

      - name: Run NLP
        run: python scripts/drainage_nlp.py

      - name: Commit if changed
        run: |
          git config user.email "actions@github.com"
          git config user.name "GitHub Actions"
          git diff --quiet || (
            git add web-golf/data/master_db.json &&
            git commit -m "data: drainage scores update [skip ci]" &&
            git push
          )
```

- [ ] **Step 2: scrape-prices.yml 작성**

```yaml
name: Scrape Prices

on:
  schedule:
    - cron: '0 */6 * * *'   # 매 6시간
  workflow_dispatch:

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install deps
        run: pip install requests beautifulsoup4 rapidfuzz playwright && python -m playwright install chromium

      - name: Run scraper
        run: python scripts/price_scraper.py

      - name: Commit if changed
        run: |
          git config user.email "actions@github.com"
          git config user.name "GitHub Actions"
          git diff --quiet || (
            git add web-golf/data/price_matrix.json web-golf/data/unmatched_prices.json &&
            git commit -m "data: price_matrix update [skip ci]" &&
            git push
          )
```

- [ ] **Step 3: scrape-teetimes.yml 작성**

```yaml
name: Scrape Tee Times

on:
  schedule:
    - cron: '*/30 * * * *'   # 매 30분
  workflow_dispatch:

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install deps
        run: pip install requests beautifulsoup4 rapidfuzz

      - name: Run scraper
        run: python scripts/tee_scraper.py

      - name: Commit if changed
        run: |
          git config user.email "actions@github.com"
          git config user.name "GitHub Actions"
          git diff --quiet || (
            git add web-golf/public/tee_times.json &&
            git commit -m "data: tee_times update [skip ci]" &&
            git push
          )
```

- [ ] **Step 4: 워크플로우 등록 확인**

```bash
git add .github/workflows/drainage-nlp.yml .github/workflows/scrape-prices.yml .github/workflows/scrape-teetimes.yml
git commit -m "ci: add golf data scraper workflows (prices + tee-times + drainage)"
git push
```

GitHub 리포 → Actions 탭에서 세 워크플로우 표시 확인.  
각 워크플로우 → "Run workflow" 버튼으로 수동 트리거 테스트.

---

## Task 12: 네비게이션 링크 추가

**Files:**
- Modify: `web-golf/app/layout.tsx`

- [ ] **Step 1: layout.tsx 에서 nav 링크 확인 후 추가**

`web-golf/app/layout.tsx` 에서 기존 내비게이션 링크 목록을 찾아 아래 세 항목 추가:

```typescript
{ href: "/price-compare", label: "가격 비교" },
{ href: "/tee-times",     label: "티타임" },
{ href: "/conditions",    label: "날씨/배수" },
```

기존 nav 구조에 맞춰 삽입. layout.tsx 의 `<nav>` 혹은 헤더 링크 배열에 추가.

- [ ] **Step 2: 빌드 + 전체 확인**

```bash
cd web-golf && npm run build
```

Expected: 에러 없음. `/price-compare`, `/tee-times`, `/conditions` 세 페이지 모두 빌드 출력에 표시됨.

- [ ] **Step 3: 최종 커밋**

```bash
git add web-golf/app/layout.tsx
git commit -m "feat(web-golf): add nav links for price-compare, tee-times, conditions"
```

---

## 완료 체크리스트

- [ ] `next.config.ts` — `output: "export"` 제거, Vercel 빌드 정상
- [ ] `lib/types.ts` — PriceEntry, TeeSlot, TeeTimesJson, drainage 필드 추가
- [ ] `scripts/drainage_nlp.py` — 실행 후 drainage_score 639개 코스에 반영
- [ ] `lib/weather.ts` — OpenWeatherMap 헬퍼, Vercel 환경변수 등록
- [ ] `app/conditions/page.tsx` — ISR revalidate=3600, 신호등 표시
- [ ] `app/course/[id]/page.tsx` — 배수 뱃지 삽입
- [ ] `scripts/price_scraper.py` — CSS 선택자 확인 후 실행, price_matrix.json 생성
- [ ] `lib/priceMatrix.ts` — 로더 + 총액 계산
- [ ] `app/price-compare/page.tsx` — 찐 총액 기준 정렬 테이블
- [ ] `scripts/tee_scraper.py` — CSS 선택자 확인 후 실행, tee_times.json 생성
- [ ] `app/tee-times/page.tsx` — 모닝 슬롯 타임라인
- [ ] GH Actions 3개 — drainage / prices / teetimes 워크플로우
- [ ] `app/layout.tsx` — 네비게이션 링크 3개 추가
