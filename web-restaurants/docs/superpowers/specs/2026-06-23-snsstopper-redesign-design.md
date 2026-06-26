# SNS Stopper — App-First Redesign Spec
Date: 2026-06-23

## Core Message
"인플루언서 믿지 말자. 데이터 믿자."
Every design decision reinforces this: the UX itself is the anti-influencer statement.

---

## 1. Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f5f0ea` | Warm cream page background |
| `--card` | `#ffffff` | Card surfaces (float above bg) |
| `--fg` | `#1a1209` | Primary text (warm near-black) |
| `--muted` | `#7a6f62` | Secondary text (warm gray) |
| `--accent` | `#e8604c` | Coral/salmon — CTAs, badges, active states |
| `--accent-light` | `#fdf1ef` | Light coral tint for hover/selected states |
| `--border` | `#e8e0d5` | Warm beige borders |

### Typography
- **Headings**: `DM Serif Display` (Google Fonts) — editorial, warm serif
- **Body/UI**: System sans-serif stack (or `DM Sans` for consistency)
- Numeric scores: `tabular-nums` maintained

### Component Language
- Card radius: `rounded-3xl` (24px) — rounder than current `rounded-2xl`
- Shadows: `shadow-sm` on cards, `shadow-md` on hover
- Borders: thin warm beige, accent coral on selected/active
- Buttons: coral fill for primary, coral outline for secondary

---

## 2. Homepage

### Hero (First Visit)
Replaces current text-heavy hero with clean centered layout:
- Small coral badge: "130만 개 실제 리뷰 기반"
- DM Serif Display h1: "방콕 맛집, / 인플루언서 말고 / 데이터로 찾으세요."
- Subtext: "광고비 한 푼 없는 Trust Score로 3,314곳 랭킹"
- Primary CTA: `맞춤 추천 받기 →` (coral button → triggers onboarding)
- Secondary CTA: `검색하기` (outline button)

### Hero (Returning — After Onboarding)
- Personalized header: "회원님 취향 기반 추천"
- Top 6 restaurants filtered client-side from full list: `db.restaurants` sorted by Trust Score, then filtered to match any selected cuisine. Atmosphere preference shown as label only (no data field to filter on yet). Falls back to top Trust Score if no matches.
- Preference edit link: "취향 수정하기"
- Remainder: full Trust Score ranking as before

### Community Activity Section (New)
Added between hero and main listing:
```
🔥 요즘 많이 신고된 곳
1. [Restaurant Name] — 인플루언서 낚시 신고 N건
2. [Restaurant Name] — 광고 의심 제보 N건
3. [Restaurant Name] — Trust Score vs 실제 괴리 큼
```
Fetched from Redis at build time (ISR, 30min revalidation).

---

## 3. Onboarding Flow

Triggered by "맞춤 추천 받기" CTA. Full-screen overlay with 3 steps.

### Step 1 — 어떤 음식 좋아해요?
- Grid of icon cards (4 columns): 태국, 일식, 양식, 한식, 중식, 채식, 해산물, 기타
- Multi-select. Selected = coral border + `--accent-light` bg
- "N selected" badge top-right (coral pill)

### Step 2 — 어떤 분위기 선호해요?
- 2-column photo cards: 캐주얼로컬, 파인다이닝, 루프탑/뷰, 가족식사
- Multi-select with photo overlay on select

### Step 3 — 식이제한 있어요? (Optional)
- Pill buttons: 채식주의, 할랄, 글루텐프리, 유제품X, 견과류X
- "Skip for now" link bottom-left
- "저장하기 →" button bottom-right

### Persistence
- Stored in `localStorage` key: `snsstopper_prefs`
- Shape: `{ cuisines: string[], atmosphere: string[], dietary: string[], completedAt: number }`
- No server-side storage, no login required

---

## 4. Community Features

### Components on Each Restaurant Card
Three action buttons rendered below card content:

| Button | Label | Action |
|--------|-------|--------|
| 🚩 | 인플루 낚시 신고 + count | POST `/api/community/flag` |
| 👍 | 데이터 맞아 + % agree | POST `/api/community/vote` |
| 📨 | 제보 | Opens slide-up form |

### Flag (신고)
- Redis key: `flag:{restaurantId}` — INCR on each click
- IP-based rate limit: Redis key `ratelimit:flag:{ip}:{restaurantId}`, TTL 86400s (24h), skip INCR if key exists
- Card badge when flags ≥ 10: `⚠️ 인플루언서 광고 의심 N건`

### Vote (투표)
- Redis keys: `vote:{restaurantId}:up`, `vote:{restaurantId}:down`
- Rate limit: 1 vote per restaurant per IP (permanent)
- Card displays: `실제랑 비슷 89%` (up / total)

### Report Form (제보)
Slide-up modal with:
- Radio: 광고비 받은 거 알아요 / 실제 가보니 별로 / 리뷰 조작 의심 / 기타
- Textarea: 내용 (optional)
- Submit → POST `/api/community/report`
- Redis: `report:{restaurantId}` list (RPUSH + LTRIM to keep latest 100)
- No email/auth required

### API Route
`app/api/community/route.ts`
- Single route handling `action: flag | vote | report`
- Upstash Redis via existing `UPSTASH_REDIS_REST_URL` env var
- Returns updated counts for optimistic UI update

---

## 5. Restaurant Detail Page (`/restaurant/[id]`)

Visual changes:
- Warm cream background, serif restaurant name heading
- Trust Score displayed as large prominent number with warm color
- Community vote summary: "실제 리뷰어 N%가 점수 맞다고 투표"
- Community buttons (flag + report) prominent below hero
- Sample reviews in rounded cards
- Trust Score methodology expandable section

---

## 6. Other Pages

`/c/[cuisine]`, `/d/[district]`, `/best/[slug]`, `/city/[city]`:
- Color/font system auto-applied via `globals.css` changes
- Page-level headers get DM Serif Display
- No structural changes needed

---

## 7. Files to Create / Modify

| File | Action | Description |
|------|--------|-------------|
| `app/globals.css` | Modify | New color tokens, DM Serif Display import |
| `app/layout.tsx` | Modify | Nav redesign, warm bg |
| `app/page.tsx` | Modify | Hero rewrite, community section, personalized feed logic |
| `components/RestaurantCard.tsx` | Modify | Rounded cards, community buttons |
| `components/HeroSearch.tsx` | Modify | Coral/cream style |
| `components/OnboardingFlow.tsx` | **Create** | 3-step onboarding overlay |
| `components/CommunityButtons.tsx` | **Create** | Flag/vote/report button group |
| `components/ReportModal.tsx` | **Create** | Slide-up report form |
| `app/api/community/route.ts` | **Create** | Redis API for flag/vote/report |

---

## 8. Out of Scope
- User accounts / authentication
- Admin dashboard for reviewing reports (manual Redis inspection for now)
- Mobile app
- Push notifications
- Changing scraper or data pipeline
