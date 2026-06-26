# SNS Stopper App-First Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform snsstopper.com from a static data display into an interactive, app-like experience with warm editorial design, personalized onboarding, and community anti-influencer features.

**Architecture:** Next.js App Router static site — server components render all data at build time, client components layered on top for interactivity (localStorage preferences, community buttons). Community votes/flags persist to Upstash Redis via a single API route. Design tokens live in `globals.css`; all pages inherit the new look automatically.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, TypeScript, Upstash Redis (`@upstash/redis`), `next/font/google` (DM Serif Display)

## Global Constraints

- Working directory: `web-restaurants/` — all paths below are relative to it
- Static export (`force-static`) on most pages — do NOT make pages dynamic unless noted
- `HeroSearch.tsx` and `SearchBar.tsx` are auto-generated — do NOT edit them directly
- Tailwind v4: config lives in `globals.css` via `@theme` block, not `tailwind.config.*`
- No test framework installed — verification is visual (run `npm run dev`, check in browser)
- Keep existing sponsored/affiliate slots untouched
- Accent color: `#e8604c` (coral), background: `#f5f0ea` (cream)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/globals.css` | Modify | Color tokens, DM Serif Display font load |
| `app/layout.tsx` | Modify | Header/footer warm style, font class on `<html>` |
| `app/api/community/route.ts` | **Create** | Flag / vote / report Redis API |
| `components/CommunityButtons.tsx` | **Create** | 🚩👍📨 button group (client) |
| `components/ReportModal.tsx` | **Create** | Slide-up report form (client) |
| `components/OnboardingFlow.tsx` | **Create** | 3-step preference wizard (client) |
| `components/PersonalizedSection.tsx` | **Create** | Client component: reads localStorage, renders "For You" row |
| `components/RestaurantCard.tsx` | Modify | Rounded-3xl warm style + CommunityButtons |
| `app/page.tsx` | Modify | New hero, onboarding trigger, community activity section, PersonalizedSection |
| `.env.example` | Modify | Add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN |
| `package.json` | Modify | Add `@upstash/redis` dependency |

---

## Task 1: Design System — Colors, Font, Layout Shell

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: CSS variables `--bg`, `--card`, `--fg`, `--muted`, `--accent`, `--accent-light`, `--border` consumed by all components; `font-serif` class available globally

---

- [ ] **Step 1: Install DM Serif Display via next/font in layout.tsx**

Replace the top of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { OrgJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});
```

Then update the `<html>` tag:
```tsx
<html lang="en" className={dmSerif.variable}>
```

- [ ] **Step 2: Update globals.css color tokens and add font utility**

Replace the `:root` block and add serif utility in `app/globals.css`:

```css
@import "tailwindcss";

:root {
  --bg: #f5f0ea;
  --card: #ffffff;
  --fg: #1a1209;
  --muted: #7a6f62;
  --accent: #e8604c;
  --accent-light: #fdf1ef;
  --border: #e8e0d5;
  --score-good: #16a34a;
  --score-mid: #ca8a04;
  --score-bad: #dc2626;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans Thai", sans-serif;
  font-feature-settings: "ss01", "ss02", "tnum";
}

.font-serif-display {
  font-family: var(--font-serif), Georgia, "Times New Roman", serif;
}

.score, [data-score] {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  letter-spacing: -0.02em;
}

.receipt-rule {
  border: none;
  border-top: 1px dashed var(--border);
  margin: 0;
}
```

- [ ] **Step 3: Update header in layout.tsx**

Replace the `<header>` block:

```tsx
<header className="border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-10 backdrop-blur-sm bg-white/95">
  <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
    <a href="/" className="flex items-center hover:opacity-80 transition">
      <Logo accent={cfg.themeAccent} />
    </a>
    <nav className="text-sm flex gap-4 md:gap-5 text-[var(--muted)] items-center">
      <a href="/famous-vs-good" className="hover:text-[var(--fg)] font-medium text-[var(--accent)] hidden sm:inline">SNS Check</a>
      <a href="/c/thai" className="hover:text-[var(--fg)] hidden md:inline">Thai</a>
      <a href="/best/halal" className="hover:text-[var(--fg)] hidden md:inline">Best of</a>
      <a href="/guide" className="hover:text-[var(--fg)] hidden lg:inline">Guides</a>
      <a href="/about" className="hover:text-[var(--fg)] hidden md:inline">About</a>
      <a
        href="/for-restaurants"
        className="px-3 py-1.5 rounded-full bg-[var(--fg)] text-white hover:opacity-80 text-xs font-bold hidden sm:inline-flex transition"
      >
        For owners →
      </a>
      <span className="text-xs text-[var(--muted)] flex items-center gap-2">
        <a href="/" className="hover:text-[var(--fg)]">EN</a>
        <span aria-hidden="true">·</span>
        <a href="/th" className="hover:text-[var(--fg)]">TH</a>
        <span aria-hidden="true">·</span>
        <a href="/ko" className="hover:text-[var(--fg)]">KO</a>
      </span>
    </nav>
  </div>
</header>
```

- [ ] **Step 4: Update footer in layout.tsx**

Replace the `<footer>` block:

```tsx
<footer className="border-t border-[var(--border)] mt-16 bg-[var(--card)]">
  <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
    <p className="font-serif-display text-xl text-[var(--fg)] mb-1">
      No filter. Just numbers.
    </p>
    <p className="text-xs text-[var(--muted)] mb-5 max-w-xl">
      Your feed is a paid ad pretending to be a friend's opinion. We ended it with data.{" "}
      <a href="/famous-vs-good" className="text-[var(--accent)] hover:underline font-medium">
        See the SNS lie detector →
      </a>
    </p>
    <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
      <a href="/famous-vs-good" className="hover:text-[var(--fg)] font-medium">SNS Check</a>
      <a href="/about" className="hover:text-[var(--fg)]">About</a>
      <a href="/contact" className="hover:text-[var(--fg)]">Contact</a>
      <a href="/for-restaurants" className="hover:text-[var(--fg)]">For Restaurants</a>
      <a href="/sitemap.xml" className="hover:text-[var(--fg)]">Sitemap</a>
      <a href="/llms.txt" className="hover:text-[var(--fg)]">llms.txt</a>
    </div>
    <p className="text-xs leading-relaxed max-w-2xl">
      Independent restaurant data analysis. Not affiliated with any restaurant. Rankings derived from public Google Maps review data — no human curation, no editorial intervention. Sponsored slots are clearly labelled and never displace organic results.
    </p>
    <p className="text-xs mt-3">© {new Date().getFullYear()} {cfg.brand} · No filter. Just numbers.</p>
  </div>
</footer>
```

- [ ] **Step 5: Visual verify**

```bash
cd web-restaurants && npm run dev
```

Open http://localhost:3000. Check:
- Background is warm cream (not white)
- Footer headline uses serif font
- Header/footer borders are warm beige (not gray)
- All pages still load (spot-check /c/thai and /best/highly-recommended)

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: warm cream design system + DM Serif Display font"
```

---

## Task 2: Community API Route (Upstash Redis)

**Files:**
- Modify: `package.json`
- Modify: `.env.example`
- Create: `app/api/community/route.ts`

**Interfaces:**
- Produces: `POST /api/community` accepting `{ action: "flag"|"vote"|"report", restaurantId: string, value?: "up"|"down", category?: string, text?: string }`
- Returns: `{ ok: true, count?: number, up?: number, down?: number }`

---

- [ ] **Step 1: Install @upstash/redis**

```bash
cd web-restaurants && npm install @upstash/redis
```

Expected: package added to `node_modules`, `package-lock.json` updated.

- [ ] **Step 2: Add env vars to .env.example**

Append to `.env.example`:

```
# ── Upstash Redis (커뮤니티 투표/신고) ─────────────────────────
# https://console.upstash.com → 새 Redis DB → REST API 탭에서 복사
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 3: Create app/api/community/route.ts**

```ts
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, restaurantId, value, category, text } = body as {
    action: "flag" | "vote" | "report";
    restaurantId: string;
    value?: "up" | "down";
    category?: string;
    text?: string;
  };

  if (!restaurantId || !action) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const ip = getIp(req);

  if (action === "flag") {
    const rateLimitKey = `ratelimit:flag:${ip}:${restaurantId}`;
    const already = await redis.get(rateLimitKey);
    if (already) return NextResponse.json({ ok: false, error: "already flagged" }, { status: 429 });
    await redis.set(rateLimitKey, 1, { ex: 86400 });
    const count = await redis.incr(`flag:${restaurantId}`);
    return NextResponse.json({ ok: true, count });
  }

  if (action === "vote") {
    if (!value || !["up", "down"].includes(value)) {
      return NextResponse.json({ ok: false, error: "invalid value" }, { status: 400 });
    }
    const rateLimitKey = `ratelimit:vote:${ip}:${restaurantId}`;
    const already = await redis.get(rateLimitKey);
    if (already) return NextResponse.json({ ok: false, error: "already voted" }, { status: 429 });
    await redis.set(rateLimitKey, 1);
    const up = await redis.incr(`vote:${restaurantId}:up`) as number;
    const down = value === "down" ? await redis.incr(`vote:${restaurantId}:down`) as number : (await redis.get<number>(`vote:${restaurantId}:down`)) ?? 0;
    // Only increment the chosen side
    if (value === "up") {
      const downVal = (await redis.get<number>(`vote:${restaurantId}:down`)) ?? 0;
      return NextResponse.json({ ok: true, up, down: downVal });
    }
    return NextResponse.json({ ok: true, up: up - 1, down });
  }

  if (action === "report") {
    const entry = JSON.stringify({ category, text, ts: Date.now(), ip });
    await redis.rpush(`report:${restaurantId}`, entry);
    await redis.ltrim(`report:${restaurantId}`, -100, -1);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}
```

- [ ] **Step 4: Fix the vote logic (the above has a bug — rewrite cleanly)**

The vote route should increment only the chosen side, not both. Replace the `action === "vote"` block:

```ts
  if (action === "vote") {
    if (!value || !["up", "down"].includes(value)) {
      return NextResponse.json({ ok: false, error: "invalid value" }, { status: 400 });
    }
    const rateLimitKey = `ratelimit:vote:${ip}:${restaurantId}`;
    const already = await redis.get(rateLimitKey);
    if (already) return NextResponse.json({ ok: false, error: "already voted" }, { status: 429 });
    await redis.set(rateLimitKey, 1);
    await redis.incr(`vote:${restaurantId}:${value}`);
    const [up, down] = await Promise.all([
      redis.get<number>(`vote:${restaurantId}:up`),
      redis.get<number>(`vote:${restaurantId}:down`),
    ]);
    return NextResponse.json({ ok: true, up: up ?? 0, down: down ?? 0 });
  }
```

Write the full clean file combining both corrections:

```ts
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, restaurantId, value, category, text } = body as {
    action: "flag" | "vote" | "report";
    restaurantId: string;
    value?: "up" | "down";
    category?: string;
    text?: string;
  };

  if (!restaurantId || !action) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const ip = getIp(req);

  if (action === "flag") {
    const rateLimitKey = `ratelimit:flag:${ip}:${restaurantId}`;
    const already = await redis.get(rateLimitKey);
    if (already) return NextResponse.json({ ok: false, error: "already flagged" }, { status: 429 });
    await redis.set(rateLimitKey, 1, { ex: 86400 });
    const count = await redis.incr(`flag:${restaurantId}`);
    return NextResponse.json({ ok: true, count });
  }

  if (action === "vote") {
    if (!value || !["up", "down"].includes(value)) {
      return NextResponse.json({ ok: false, error: "invalid value" }, { status: 400 });
    }
    const rateLimitKey = `ratelimit:vote:${ip}:${restaurantId}`;
    const already = await redis.get(rateLimitKey);
    if (already) return NextResponse.json({ ok: false, error: "already voted" }, { status: 429 });
    await redis.set(rateLimitKey, 1);
    await redis.incr(`vote:${restaurantId}:${value}`);
    const [up, down] = await Promise.all([
      redis.get<number>(`vote:${restaurantId}:up`),
      redis.get<number>(`vote:${restaurantId}:down`),
    ]);
    return NextResponse.json({ ok: true, up: up ?? 0, down: down ?? 0 });
  }

  if (action === "report") {
    const entry = JSON.stringify({ category, text: text?.slice(0, 500), ts: Date.now() });
    await redis.rpush(`report:${restaurantId}`, entry);
    await redis.ltrim(`report:${restaurantId}`, -100, -1);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}
```

- [ ] **Step 5: Set up local env vars**

Copy `.env.example` to `.env.local` if not exists, then add real Upstash credentials from https://console.upstash.com

- [ ] **Step 6: Verify API works**

```bash
npm run dev
```

In a new terminal:
```bash
curl -X POST http://localhost:3000/api/community \
  -H "Content-Type: application/json" \
  -d '{"action":"flag","restaurantId":"test-123"}'
```

Expected response: `{"ok":true,"count":1}`

- [ ] **Step 7: Commit**

```bash
git add app/api/community/route.ts .env.example package.json package-lock.json
git commit -m "feat: community API — flag/vote/report via Upstash Redis"
```

---

## Task 3: Community Components (Buttons + Report Modal)

**Files:**
- Create: `components/CommunityButtons.tsx`
- Create: `components/ReportModal.tsx`

**Interfaces:**
- Consumes: `POST /api/community` from Task 2
- Produces: `<CommunityButtons restaurantId={string} initialFlags={number} initialUp={number} initialDown={number} />` — imported by RestaurantCard in Task 4

---

- [ ] **Step 1: Create components/ReportModal.tsx**

```tsx
"use client";
import { useState } from "react";

const CATEGORIES = [
  { value: "paid", label: "광고비 받은 거 알아요" },
  { value: "disappointing", label: "실제 가보니 별로였어요" },
  { value: "fake_reviews", label: "리뷰 조작 의심돼요" },
  { value: "other", label: "기타" },
];

export function ReportModal({
  restaurantId,
  onClose,
}: {
  restaurantId: string;
  onClose: () => void;
}) {
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!category) return;
    setLoading(true);
    await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "report", restaurantId, category, text }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[var(--card)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
        {sent ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">📨</div>
            <p className="font-bold text-[var(--fg)]">제보 감사해요!</p>
            <p className="text-sm text-[var(--muted)] mt-1">검토 후 반영할게요.</p>
            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-serif-display text-xl text-[var(--fg)] mb-4">어떤 제보인가요?</h3>
            <div className="space-y-2 mb-4">
              {CATEGORIES.map((c) => (
                <label key={c.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={c.value}
                    checked={category === c.value}
                    onChange={() => setCategory(c.value)}
                    className="accent-[var(--accent)]"
                  />
                  <span className="text-sm text-[var(--fg)]">{c.label}</span>
                </label>
              ))}
            </div>
            <textarea
              placeholder="추가 내용 (선택)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-[var(--accent)] bg-[var(--bg)]"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted)] font-medium"
              >
                취소
              </button>
              <button
                onClick={submit}
                disabled={!category || loading}
                className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40"
              >
                {loading ? "전송 중..." : "제보 보내기"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create components/CommunityButtons.tsx**

```tsx
"use client";
import { useState } from "react";
import { ReportModal } from "./ReportModal";

export function CommunityButtons({
  restaurantId,
  initialFlags = 0,
  initialUp = 0,
  initialDown = 0,
}: {
  restaurantId: string;
  initialFlags?: number;
  initialUp?: number;
  initialDown?: number;
}) {
  const [flags, setFlags] = useState(initialFlags);
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [flagged, setFlagged] = useState(false);
  const [voted, setVoted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const total = up + down;
  const agreePct = total > 0 ? Math.round((up / total) * 100) : null;

  async function handleFlag() {
    if (flagged) return;
    setFlagged(true);
    setFlags((f) => f + 1);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "flag", restaurantId }),
    });
    if (!res.ok) {
      setFlagged(false);
      setFlags((f) => f - 1);
    }
  }

  async function handleVote(value: "up" | "down") {
    if (voted) return;
    setVoted(true);
    if (value === "up") setUp((v) => v + 1);
    else setDown((v) => v + 1);
    await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "vote", restaurantId, value }),
    });
  }

  return (
    <>
      <div className="flex gap-1.5 pt-2 border-t border-[var(--border)] mt-2">
        <button
          onClick={handleFlag}
          disabled={flagged}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
            flagged
              ? "bg-red-50 border-red-200 text-red-500"
              : "border-[var(--border)] text-[var(--muted)] hover:border-red-300 hover:text-red-500 hover:bg-red-50"
          }`}
          title="인플루언서 낚시 신고"
        >
          🚩 {flags > 0 && <span>{flags}</span>}
        </button>

        <button
          onClick={() => handleVote("up")}
          disabled={voted}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
            voted
              ? "bg-green-50 border-green-200 text-green-600"
              : "border-[var(--border)] text-[var(--muted)] hover:border-green-300 hover:text-green-600 hover:bg-green-50"
          }`}
          title="Trust Score 맞아요"
        >
          👍 {agreePct !== null ? <span>{agreePct}% 동의</span> : <span>맞아요</span>}
        </button>

        <button
          onClick={() => handleVote("down")}
          disabled={voted}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
            voted
              ? "bg-orange-50 border-orange-200 text-orange-500"
              : "border-[var(--border)] text-[var(--muted)] hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50"
          }`}
          title="실제랑 달라요"
        >
          👎
        </button>

        <button
          onClick={() => setShowReport(true)}
          className="ml-auto flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition font-medium"
          title="제보하기"
        >
          📨 제보
        </button>
      </div>

      {showReport && (
        <ReportModal restaurantId={restaurantId} onClose={() => setShowReport(false)} />
      )}
    </>
  );
}
```

- [ ] **Step 3: Visual verify components exist**

```bash
npm run build 2>&1 | head -30
```

Expected: no TypeScript errors on the new files (build may fail on missing redis env — that's ok for now, just check no syntax errors).

- [ ] **Step 4: Commit**

```bash
git add components/CommunityButtons.tsx components/ReportModal.tsx
git commit -m "feat: community buttons — flag, vote, report modal"
```

---

## Task 4: Restaurant Card Redesign

**Files:**
- Modify: `components/RestaurantCard.tsx`

**Interfaces:**
- Consumes: `<CommunityButtons>` from Task 3 (initialFlags/up/down default to 0 since we don't fetch per-card at build time)
- Produces: Updated card used on homepage and all listing pages

---

- [ ] **Step 1: Rewrite RestaurantCard.tsx**

```tsx
import type { Restaurant } from "@/lib/types";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { TrustBadge } from "./TrustBadge";
import { AIVerifiedBadge } from "./Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { CommunityButtons } from "./CommunityButtons";

export function RestaurantCard({ r, rank }: { r: Restaurant; rank?: number }) {
  const trend = r.rating_trend.trend;
  const trending = trend === "improving";
  const tier = sponsoredTier(r.id);

  const tierStyles = tier === "editors_pick"
    ? { wrapper: "ring-2 ring-amber-300 shadow-lg shadow-amber-100", corner: "from-amber-400 to-yellow-600" }
    : tier === "recommended"
    ? { wrapper: "ring-2 ring-sky-300 shadow-lg shadow-sky-100", corner: "from-sky-500 to-blue-600" }
    : tier === "featured"
    ? { wrapper: "ring-2 ring-fuchsia-300 shadow-lg shadow-fuchsia-100", corner: "from-fuchsia-500 to-purple-600" }
    : { wrapper: "", corner: "" };

  return (
    <div
      className={`group border border-[var(--border)] rounded-3xl bg-[var(--card)] hover:shadow-md hover:border-[var(--accent)] transition relative overflow-hidden ${tierStyles.wrapper}`}
    >
      {tier && (
        <div className={`absolute top-0 right-0 z-10 bg-gradient-to-r ${tierStyles.corner} text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-2xl shadow-md`}>
          {tier === "editors_pick" ? "★ Editor's Pick" : tier === "recommended" ? "✓ Recommended" : "◆ Featured"}
        </div>
      )}

      <a href={`/restaurant/${r.id}`} className="block p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-1 flex-wrap">
              {rank !== undefined && (
                <span className="font-bold text-[var(--fg)] tabular-nums">#{rank}</span>
              )}
              {r.district && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>📍</span>
                  {r.district}
                </span>
              )}
              {r.city_label && (
                <span className="text-[var(--muted)]">{r.city_label}</span>
              )}
              {r.business_status === "Open" && (
                <span className="flex items-center gap-1 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Open
                </span>
              )}
              {trending && (
                <span className="flex items-center gap-0.5 text-green-700 font-medium">
                  ↗ Trending
                </span>
              )}
              {r.price_symbol && (
                <span className="text-[var(--muted)]">{r.price_symbol}</span>
              )}
            </div>
            <h3 className="font-semibold text-base group-hover:text-[var(--accent)] transition truncate">
              {r.name}
            </h3>
            <p className="text-sm text-[var(--muted)] truncate mt-0.5">
              {r.primary_type}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="bg-[var(--accent-light)] text-[var(--accent)] px-2.5 py-1 rounded-xl text-sm font-bold whitespace-nowrap">
              ★ {r.rating.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
              {r.total_reviews.toLocaleString()} reviews
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
          <TrustBadge score={r.trust_score} size="md" />
          <div className="flex flex-wrap gap-1.5 text-xs justify-end items-center">
            <AIVerifiedBadge r={r} size="sm" />
            {r.cuisines.slice(0, 3).map((c) => (
              <span key={c} className="bg-[var(--accent-light)] text-[var(--accent)] px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
                <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
                {CUISINE_LABELS[c] ?? c}
              </span>
            ))}
          </div>
        </div>
      </a>

      <div className="px-5 pb-3 flex gap-2">
        <a
          href={`/restaurant/${r.id}`}
          className="flex-1 text-center py-2 px-3 rounded-xl bg-[var(--fg)] text-white text-xs font-bold hover:opacity-80 transition"
        >
          자세히 보기 →
        </a>
        <a
          href={r.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs font-bold hover:border-[var(--accent)] transition flex items-center"
          title="View on Google Maps"
          aria-label="View on Google Maps"
        >
          📍
        </a>
        {r.phone && (
          <a
            href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}
            className="py-2 px-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs font-bold hover:border-[var(--accent)] transition flex items-center"
            title={`Call ${r.phone}`}
            aria-label="Call restaurant"
          >
            📞
          </a>
        )}
        {r.menu_url && (
          <a
            href={r.menu_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="py-2 px-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs font-bold hover:border-[var(--accent)] transition flex items-center"
            title="Menu"
            aria-label="Menu"
          >
            📋
          </a>
        )}
      </div>

      <div className="px-5 pb-4">
        <CommunityButtons restaurantId={r.id} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Visual verify**

```bash
npm run dev
```

Open http://localhost:3000. Check:
- Cards are rounder (`rounded-3xl`)
- Rating badge is coral tinted (not yellow)
- Cuisine tags are coral tinted (not gray)
- Community buttons appear at bottom of each card
- Flag/vote/report all clickable (report opens modal)

- [ ] **Step 3: Commit**

```bash
git add components/RestaurantCard.tsx
git commit -m "feat: restaurant card redesign — rounded, warm, community buttons"
```

---

## Task 5: Onboarding Flow Component

**Files:**
- Create: `components/OnboardingFlow.tsx`

**Interfaces:**
- Produces: `<OnboardingFlow onComplete={() => void} onSkip={() => void} />` — fullscreen overlay, 3-step wizard
- localStorage key: `snsstopper_prefs` → `{ cuisines: string[], atmosphere: string[], dietary: string[], completedAt: number }`

---

- [ ] **Step 1: Create components/OnboardingFlow.tsx**

```tsx
"use client";
import { useState } from "react";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";

export type UserPrefs = {
  cuisines: string[];
  atmosphere: string[];
  dietary: string[];
  completedAt: number;
};

const CUISINE_OPTIONS = Object.entries(CUISINE_LABELS).filter(([key]) =>
  ["thai", "japanese", "korean", "chinese", "italian", "western", "seafood", "vegetarian", "cafe", "street_food"].includes(key)
);

const ATMOSPHERE_OPTIONS = [
  { value: "casual_local", label: "캐주얼 로컬", emoji: "🏪" },
  { value: "fine_dining", label: "파인다이닝", emoji: "🍷" },
  { value: "rooftop", label: "루프탑 / 뷰", emoji: "🌆" },
  { value: "family", label: "가족 식사", emoji: "👨‍👩‍👧" },
  { value: "date", label: "데이트", emoji: "🕯️" },
  { value: "group", label: "단체 / 회식", emoji: "🥂" },
];

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "채식주의" },
  { value: "vegan", label: "비건" },
  { value: "halal", label: "할랄" },
  { value: "gluten_free", label: "글루텐프리" },
  { value: "dairy_free", label: "유제품X" },
];

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition ${i === step ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}
        />
      ))}
    </div>
  );
}

export function OnboardingFlow({
  onComplete,
  onSkip,
}: {
  onComplete: (prefs: UserPrefs) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [atmosphere, setAtmosphere] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  function finish() {
    const prefs: UserPrefs = { cuisines, atmosphere, dietary, completedAt: Date.now() };
    localStorage.setItem("snsstopper_prefs", JSON.stringify(prefs));
    onComplete(prefs);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-lg mx-auto px-4">
        <ProgressDots step={step} />

        {step === 0 && (
          <>
            <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">어떤 음식 좋아해요?</h2>
            <p className="text-sm text-[var(--muted)] text-center mb-6">취향에 맞는 맛집만 보여드릴게요</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {CUISINE_OPTIONS.map(([key, label]) => {
                const selected = cuisines.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => setCuisines(toggle(cuisines, key))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--accent)]"
                    }`}
                  >
                    <span className="text-2xl">{CUISINE_ICONS[key] ?? "🍴"}</span>
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={onSkip} className="flex-1 py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                건너뛰기
              </button>
              <button
                onClick={() => setStep(1)}
                disabled={cuisines.length === 0}
                className="flex-1 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40"
              >
                다음 →
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">어떤 분위기 선호해요?</h2>
            <p className="text-sm text-[var(--muted)] text-center mb-6">복수 선택 가능</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {ATMOSPHERE_OPTIONS.map((opt) => {
                const selected = atmosphere.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAtmosphere(toggle(atmosphere, opt.value))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--accent)]"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                ← 이전
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
              >
                다음 →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-serif-display text-3xl text-center text-[var(--fg)] mb-2">식이제한 있어요?</h2>
            <p className="text-sm text-[var(--muted)] text-center mb-6">선택 사항이에요</p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {DIETARY_OPTIONS.map((opt) => {
                const selected = dietary.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDietary(toggle(dietary, opt.value))}
                    className={`px-5 py-2.5 rounded-2xl border-2 text-sm font-medium transition ${
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--muted)]">
                ← 이전
              </button>
              <button
                onClick={finish}
                className="flex-1 py-3 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
              >
                맞춤 추천 보기 →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/OnboardingFlow.tsx
git commit -m "feat: 3-step onboarding flow with localStorage persistence"
```

---

## Task 6: Personalized Section Client Component

**Files:**
- Create: `components/PersonalizedSection.tsx`

**Interfaces:**
- Consumes: `restaurants: Array<{ id: string; name: string; district: string; city_label: string; rating: number; trust_score: number; cuisines: string[] }>` passed as prop from server
- Reads: `localStorage.snsstopper_prefs`
- Produces: `<PersonalizedSection restaurants={...} />` — renders "For You" top-6 grid or null if no prefs

---

- [ ] **Step 1: Create components/PersonalizedSection.tsx**

```tsx
"use client";
import { useEffect, useState } from "react";
import type { UserPrefs } from "./OnboardingFlow";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";

type SlimRestaurant = {
  id: string;
  name: string;
  district: string;
  city_label: string;
  rating: number;
  trust_score: number;
  cuisines: string[];
};

export function PersonalizedSection({ restaurants }: { restaurants: SlimRestaurant[] }) {
  const [prefs, setPrefs] = useState<UserPrefs | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("snsstopper_prefs");
      if (raw) setPrefs(JSON.parse(raw));
    } catch {}
  }, []);

  if (!prefs || prefs.cuisines.length === 0) return null;

  const filtered = restaurants
    .filter((r) => r.cuisines.some((c) => prefs.cuisines.includes(c)))
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 6);

  if (filtered.length === 0) return null;

  const cuisineLabel = prefs.cuisines
    .slice(0, 2)
    .map((c) => CUISINE_LABELS[c] ?? c)
    .join(", ");

  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <div>
          <h2 className="font-serif-display text-2xl md:text-3xl text-[var(--fg)]">
            취향 맞춤 추천
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1">{cuisineLabel} 기반</p>
        </div>
        <button
          onClick={() => { localStorage.removeItem("snsstopper_prefs"); setPrefs(null); window.location.reload(); }}
          className="text-xs text-[var(--muted)] hover:text-[var(--accent)] underline"
        >
          취향 다시 설정
        </button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <a
            key={r.id}
            href={`/restaurant/${r.id}`}
            className="group block border border-[var(--border)] rounded-3xl p-5 bg-[var(--card)] hover:shadow-md hover:border-[var(--accent)] transition"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="text-2xl font-bold tabular-nums text-[var(--accent)]">
                {r.trust_score.toFixed(0)}
              </div>
              <div className="text-sm font-bold text-yellow-700">★ {r.rating.toFixed(1)}</div>
            </div>
            <h3 className="font-bold text-base group-hover:text-[var(--accent)] transition leading-tight mb-1">
              {r.name}
            </h3>
            <p className="text-sm text-[var(--muted)]">{r.district || r.city_label}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {r.cuisines.slice(0, 2).map((c) => (
                <span key={c} className="bg-[var(--accent-light)] text-[var(--accent)] text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
                  <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
                  {CUISINE_LABELS[c] ?? c}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PersonalizedSection.tsx
git commit -m "feat: personalized restaurant section reads localStorage prefs"
```

---

## Task 7: Homepage Redesign — Hero, Onboarding Trigger, Community Activity

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `<OnboardingFlow>` from Task 5, `<PersonalizedSection>` from Task 6
- Note: `page.tsx` is a server component; `OnboardingFlow` and `PersonalizedSection` are `"use client"` — import them and wrap with `<Suspense>` if needed

---

- [ ] **Step 1: Create components/OnboardingTrigger.tsx and ResetPrefsButton.tsx**

`page.tsx` is a server component — `onClick` won't work there. Create two client components:

First, `components/ResetPrefsButton.tsx` (used for the hero CTA):

```tsx
"use client";
export function ResetPrefsButton() {
  return (
    <button
      onClick={() => { localStorage.removeItem("snsstopper_prefs"); window.location.reload(); }}
      className="px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-white font-bold text-base hover:opacity-90 transition"
    >
      맞춤 추천 받기 →
    </button>
  );
}
```

Then, `components/OnboardingTrigger.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { OnboardingFlow, type UserPrefs } from "./OnboardingFlow";

export function OnboardingTrigger({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("snsstopper_prefs");
    if (!raw) setShowOnboarding(true);
  }, []);

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => { setShowOnboarding(false); window.location.reload(); }}
        onSkip={() => {
          localStorage.setItem("snsstopper_prefs", JSON.stringify({ cuisines: [], atmosphere: [], dietary: [], completedAt: Date.now() }));
          setShowOnboarding(false);
        }}
      />
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Rewrite app/page.tsx hero section**

Replace the top-level return in `HomePage` with a new hero. Keep all existing data fetching (`db`, `top`, `totalReviews`, etc.) unchanged. Only replace JSX.

New hero section (replaces the `<section className="relative border-b-4...">` block):

```tsx
{/* HERO */}
<section className="bg-[var(--bg)] border-b border-[var(--border)]">
  <div className="max-w-3xl mx-auto px-4 pt-16 md:pt-24 pb-12 text-center">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-8">
      <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
      {totalReviews.toLocaleString()}개 실제 리뷰 기반
    </div>
    <h1 className="font-serif-display text-5xl md:text-7xl text-[var(--fg)] leading-tight mb-6">
      방콕 맛집,<br />
      인플루언서 말고<br />
      <span className="text-[var(--accent)]">데이터로</span> 찾으세요.
    </h1>
    <p className="text-base text-[var(--muted)] mb-10 max-w-xl mx-auto">
      광고비 한 푼 없는 Trust Score로{" "}
      <span className="font-bold text-[var(--fg)]">{db.total_restaurants.toLocaleString()}곳</span>{" "}
      랭킹. 인플루언서 피드 말고 130만 명의 실제 후기.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <ResetPrefsButton />
      <a
        href="#top-list"
        className="px-8 py-3.5 rounded-2xl border-2 border-[var(--border)] text-[var(--fg)] font-bold text-base hover:border-[var(--accent)] transition"
      >
        전체 랭킹 보기
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add stats bar with warm styling**

Replace the dark stats bar:

```tsx
{/* STATS BAR */}
<section className="border-b border-[var(--border)] bg-[var(--card)]">
  <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-3 gap-4 text-center">
    <Stat big={db.total_restaurants.toLocaleString()} label="맛집 추적 중" />
    <Stat big={`${(totalReviews / 1_000_000).toFixed(1)}M`} label="리뷰 교차검증" />
    <Stat big={withScraped.toLocaleString()} label="심층 분석 완료" />
  </div>
</section>
```

Update the `Stat` component at bottom of file:

```tsx
function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div className="font-serif-display text-3xl md:text-4xl text-[var(--accent)] leading-none">{big}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--muted)] mt-1.5 font-bold">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4: Add OnboardingTrigger and PersonalizedSection to page.tsx**

At the top of the main content div (after stats bar), add:

```tsx
import { OnboardingTrigger } from "@/components/OnboardingTrigger";
import { PersonalizedSection } from "@/components/PersonalizedSection";

// Inside the JSX, at the top of the <div className="max-w-5xl ..."> block:
<OnboardingTrigger>
  <PersonalizedSection
    restaurants={db.restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      district: r.district,
      city_label: r.city_label,
      rating: r.rating,
      trust_score: r.trust_score,
      cuisines: r.cuisines,
    }))}
  />
</OnboardingTrigger>
```

- [ ] **Step 5: Add Community Activity section**

Add after the personalized section, before the manifesto:

```tsx
{/* COMMUNITY ACTIVITY */}
<section className="mb-12 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
  <h2 className="font-serif-display text-xl text-[var(--fg)] mb-1">🔥 요즘 핫한 신고</h2>
  <p className="text-xs text-[var(--muted)] mb-4">커뮤니티가 과대광고 의심 중인 곳들</p>
  <p className="text-sm text-[var(--muted)]">
    아직 신고 데이터가 쌓이는 중이에요. 카드에서 🚩 눌러서 참여해주세요!
  </p>
</section>
```

(This section will show real data once enough community flags accumulate. Keep it simple for launch.)

- [ ] **Step 6: Update Manifesto component styling**

Replace `Manifesto` function at bottom of file:

```tsx
function Manifesto({ icon: _icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] transition group">
      <div className="w-8 h-0.5 bg-[var(--accent)] mb-5" />
      <h3 className="font-serif-display text-lg text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
```

- [ ] **Step 7: Add id="top-list" to the top 50 section**

Find the `<section>` containing "Top {Math.min...} by Trust Score" and add `id="top-list"`:

```tsx
<section id="top-list">
```

- [ ] **Step 8: Visual verify full homepage**

```bash
npm run dev
```

Open http://localhost:3000. Check:
- Hero: serif font, cream bg, coral accent, "맞춤 추천 받기" button
- First visit (clear localStorage): onboarding flow appears as fullscreen overlay
- Complete onboarding: redirects back to homepage with personalized section at top
- Stats bar: coral serif numbers
- Community activity section: visible
- Restaurant cards: rounded, warm, community buttons working
- "전체 랭킹 보기" scrolls to #top-list

- [ ] **Step 9: Commit**

```bash
git add app/page.tsx components/OnboardingTrigger.tsx components/ResetPrefsButton.tsx
git commit -m "feat: homepage redesign — warm hero, onboarding trigger, community section, personalized feed"
```

---

## Task 8: Final Polish + Build Verification

**Files:**
- Modify: `app/page.tsx` (minor styling on browse sections)

---

- [ ] **Step 1: Update cuisine/district pill styling in page.tsx**

Find all `.rounded-full border border-[var(--border)]` pill links in the browse sections and update hover states to coral:

For cuisine/district/city pills, ensure they have:
```
className="... hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] ..."
```

- [ ] **Step 2: Update FAQ section styling**

Find the `<details>` FAQ block and update:
```tsx
<details className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 group">
```

- [ ] **Step 3: Run full build**

```bash
npm run build
```

Expected: build completes without errors. If env vars missing for Redis, build will fail — add dummy values to `.env.local`:
```
UPSTASH_REDIS_REST_URL=https://placeholder.upstash.io
UPSTASH_REDIS_REST_TOKEN=placeholder
```

- [ ] **Step 4: Final visual check**

```bash
npm run dev
```

Spot-check these pages:
- `/` — homepage
- `/c/thai` — category page (cream bg auto-applied)
- `/best/highly-recommended` — best page
- `/restaurant/[any-id]` — detail page

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: SNS Stopper app-first redesign — warm design, onboarding, community features complete"
```
