# chillanel Phase 1 (UI Rebuild) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Phase 0's review-mining data (service themes, mood keywords, rating distribution, price mentions, city-wide aggregates) into visible UI — the "review data visualization instead of photos" differentiator the user chose. Replace flat metadata cards with data-driven ones, add a trending tag cloud, and add browsable service pages ("Foot massage in Bangkok").

**Architecture:** Two new presentational components (`RatingBars`, `TagCloud`) plus one new lib module (`lib/theme-labels.ts` — translates the 15 fixed English theme/mood labels to th/ko and provides URL-safe slugs) get wired into the existing `PlaceCard`, place detail page, home page, and city page. One new route (`/[lang]/service/[theme]`) is added, fully static (`generateStaticParams`/`dynamicParams = false`, matching every other leaf route in this app).

**Tech Stack:** Same as the rest of chillanel — Next.js App Router Server Components, Tailwind, no new runtime dependencies, no client JS added (every new component is a plain Server Component).

## Global Constraints

- **District clustering is NOT part of this phase.** Phase 0 verification found `district` is `null` for 100% of the live 734-place dataset (upstream scraper never captured lat/lng for this vertical) — do not build any district-browsing route or UI that assumes `place.district` is usually populated. The field exists in the type/data and MAY be read opportunistically if non-null (e.g. shown as a small text label if present), but no route, filter, or generateStaticParams call may depend on it.
- **Scope of browsable pages: `serviceThemes` only, not `moodKeywords`.** Service themes ("Foot massage", "Thai massage") get their own routes; mood keywords ("Clean", "Quiet & relaxing") are display-only (tag clouds, badges) with no dedicated pages. This matches the roadmap's original scope ("카테고리 페이지 — 발마사지/오일/타이/아로마별") and avoids doubling the static-page surface for a use case (browsing by "quiet" vs "clean") that isn't the site's differentiator.
- **English theme/mood labels in data must be translated for display**, not shown raw on th/ko pages — reviews are 99.8% English (Phase 0 finding), so the *data* labels (`place.serviceThemes[].label`) are always English strings like `"Foot massage"`; `lib/theme-labels.ts` is the single translation point, covering all 15 known labels (8 service + 7 mood) — every consumer must go through it, never render `.label` raw in JSX.
- **Payload-size discipline** (established bug, already fixed once — see `chillanel/app/[lang]/city/[city]/page.tsx`'s `MAX_SHOWN = 90` comment): the new `/[lang]/service/[theme]` route must apply the same cap pattern. Do not render an unbounded place list on any route.
- **All new components are Server Components** — no `"use client"`, no new client-side JS. `TagCloud`'s links use `next/link` exactly like the rest of the app; no interactivity (filtering, sorting) is in scope for this phase.
- **Must not break existing tests or build.** Pre-Phase-1 baseline (end of Phase 0): 29/29 `node --test scripts/*.test.mjs` passing, `tsc --noEmit` clean, `npm run build` succeeds with every existing route.
- Standing chillanel constraints (unchanged): `vercel --prod` must never run with `--archive=tgz`; never add `cache: "no-store"` to a Server Component render path (breaks SSG).

---

### Task 1: i18n keys for Phase 1 copy

**Files:**
- Modify: `chillanel/lib/i18n.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: new `Dict` fields every later task reads: `home.trendingTitle`, `city.trendingTitle`, `place.serviceThemesTitle`, `place.moodKeywordsTitle`, `place.ratingBreakdownTitle`, `place.priceRangeLabel` (template with `{price}`), and a new top-level `service: { listTitle, intro, backToCity }` section (all three templated with `{theme}` and/or `{city}`).

- [ ] **Step 1: Extend the `Dict` type**

In `chillanel/lib/i18n.ts`, add `trendingTitle: string;` to the end of the `home` type block (after `faq: FaqItem[];`, before the closing `};`), add `trendingTitle: string;` to the end of the `city` type block (same position), add four fields to the end of the `place` type block (after `anonymousReviewer: string;`):

```typescript
    serviceThemesTitle: string;
    moodKeywordsTitle: string;
    ratingBreakdownTitle: string;
    /** Template with a "{price}" placeholder. */
    priceRangeLabel: string;
```

and add a new top-level `service` field to `Dict`, right after the `city` block and before `guide`:

```typescript
  /** listTitle/intro use "{theme}" and "{city}" placeholders; backToCity uses "{city}". */
  service: {
    listTitle: string;
    intro: string;
    backToCity: string;
  };
```

- [ ] **Step 2: Add the English values**

In the `en` object, add `trendingTitle: "What Bangkok reviewers say most",` as the last field of `home` (after `faq: [...]`, before the closing `},`).

Add `trendingTitle: "What reviewers say most in {city}",` as the last field of `city`.

Add these four fields as the last fields of `place` (after `anonymousReviewer: "Anonymous",`):

```typescript
    serviceThemesTitle: "Services mentioned in reviews",
    moodKeywordsTitle: "How reviewers describe it",
    ratingBreakdownTitle: "Rating breakdown",
    priceRangeLabel: "~{price}฿ per session, based on reviewer mentions",
```

Add a new top-level `service` object to `en`, right after the `city` object closes and before `guide`:

```typescript
  service: {
    listTitle: "{theme} in {city}",
    intro: "Real Google reviews mentioning {theme} in {city}.",
    backToCity: "← All places in {city}",
  },
```

- [ ] **Step 3: Add the Thai values**

Same four insertion points in the `th` object:

`home.trendingTitle`: `"รีวิวในกรุงเทพฯ พูดถึงอะไรมากที่สุด",`

`city.trendingTitle`: `"รีวิวใน{city}พูดถึงอะไรมากที่สุด",`

`place` additions:
```typescript
    serviceThemesTitle: "บริการที่ถูกพูดถึงในรีวิว",
    moodKeywordsTitle: "รีวิวบอกว่าร้านนี้เป็นยังไง",
    ratingBreakdownTitle: "สัดส่วนคะแนนรีวิว",
    priceRangeLabel: "ประมาณ ~{price}฿ ต่อครั้ง (จากรีวิว)",
```

New `service` object in `th`, same position as `en`:
```typescript
  service: {
    listTitle: "{theme}ใน{city}",
    intro: "รีวิว Google จริงที่พูดถึง{theme}ใน{city}",
    backToCity: "← ร้านทั้งหมดใน{city}",
  },
```

- [ ] **Step 4: Add the Korean values**

Same four insertion points in the `ko` object:

`home.trendingTitle`: `"방콕 리뷰에서 가장 많이 언급된 것",`

`city.trendingTitle`: `"{city} 리뷰에서 가장 많이 언급된 것",`

`place` additions:
```typescript
    serviceThemesTitle: "리뷰에서 언급된 서비스",
    moodKeywordsTitle: "리뷰어들이 말하는 이곳의 분위기",
    ratingBreakdownTitle: "평점 분포",
    priceRangeLabel: "리뷰 기준 회당 약 ~{price}฿",
```

New `service` object in `ko`, same position as `en`:
```typescript
  service: {
    listTitle: "{city} {theme}",
    intro: "{city}에서 {theme}를 언급한 실제 구글 리뷰입니다.",
    backToCity: "← {city} 전체 업체 보기",
  },
```

- [ ] **Step 5: Verify**

```bash
cd chillanel && node --test scripts/i18n.test.mjs && npx tsc --noEmit
```

Expected: `i18n.test.mjs`'s "same top-level keys across locales" test still passes (all three locales gained the same new fields), `tsc` clean.

- [ ] **Step 6: Commit**

```bash
git add chillanel/lib/i18n.ts
git commit -m "chillanel: add Phase 1 i18n keys (trending, service themes, rating breakdown, price range)"
```

---

### Task 2: theme-label translation + slug module

**Files:**
- Create: `chillanel/lib/theme-labels.ts`
- Test: `chillanel/scripts/theme-labels.test.mjs`

**Interfaces:**
- Consumes: `Lang` from `./site`, and raw English label strings that always come from `place.serviceThemes[].label` / `place.moodKeywords[].label` / `CityData.themeAggregate[].label` / `CityData.moodAggregate[].label` (all produced by Phase 0's `extract-themes.mjs`, whose 15 possible label strings are fixed: 8 in `SERVICE_THEMES`, 7 in `MOOD_KEYWORDS`).
- Produces: `themeLabel(rawLabel: string, lang: Lang): string` (translated display label, falls back to the raw string if somehow given an unknown label — defensive, not expected to trigger against real data) and `slugifyTheme(rawLabel: string): string` (URL-safe slug, e.g. `"Quiet & relaxing"` → `"quiet-and-relaxing"`). Tasks 4, 5, 6, 7, 8 all import from this module.

Note: this module lives in `chillanel/lib/` (app runtime code) and is tested via a `.mjs` file in `chillanel/scripts/` (matching how `chillanel/scripts/i18n.test.mjs` already tests `chillanel/lib/i18n.ts` — Next.js's TypeScript compiles `.ts` at build time, but `node --test` can still exercise the same file directly since it has no JSX/Next-specific syntax, only plain TypeScript type annotations that Node's newer versions strip automatically. If a step below produces an "unexpected token" error under plain `node`, add `.js`-compatible syntax is NOT needed — just confirm the runner used elsewhere in this repo's test suite (check `chillanel/scripts/i18n.test.mjs`'s import path for the exact pattern to copy).

- [ ] **Step 1: Check how the existing i18n test imports a `.ts` lib file**

```bash
head -5 chillanel/scripts/i18n.test.mjs
```

Copy that exact import-path style (relative path with or without extension) for Step 3 below — do not guess.

- [ ] **Step 2: Write the failing tests**

Create `chillanel/scripts/theme-labels.test.mjs` (import path adjusted per Step 1's finding — if `i18n.test.mjs` imports `../lib/i18n.ts` directly, do the same here for `../lib/theme-labels.ts`):

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { themeLabel, slugifyTheme } from "../lib/theme-labels.ts";

test("translates a known service theme label into Thai and Korean", () => {
  assert.equal(themeLabel("Foot massage", "en"), "Foot massage");
  assert.equal(themeLabel("Foot massage", "th"), "นวดเท้า");
  assert.equal(themeLabel("Foot massage", "ko"), "발마사지");
});

test("translates a known mood keyword label into Thai and Korean", () => {
  assert.equal(themeLabel("Quiet & relaxing", "en"), "Quiet & relaxing");
  assert.equal(themeLabel("Quiet & relaxing", "th"), "เงียบสงบ ผ่อนคลาย");
  assert.equal(themeLabel("Quiet & relaxing", "ko"), "조용하고 편안함");
});

test("falls back to the raw label for an unrecognized string", () => {
  assert.equal(themeLabel("Something Unmapped", "th"), "Something Unmapped");
});

test("slugifyTheme produces a URL-safe slug, including for labels with '&'", () => {
  assert.equal(slugifyTheme("Foot massage"), "foot-massage");
  assert.equal(slugifyTheme("Quiet & relaxing"), "quiet-and-relaxing");
  assert.equal(slugifyTheme("Hot stone"), "hot-stone");
});

test("all 8 SERVICE_THEMES and 7 MOOD_KEYWORDS labels have th/ko translations (no silent fallback for real data)", () => {
  const allLabels = [
    "Foot massage", "Oil massage", "Thai massage", "Aromatherapy",
    "Deep tissue", "Hot stone", "Facial", "Body scrub",
    "Clean", "Quiet & relaxing", "Strong pressure", "Gentle",
    "Friendly staff", "Good value", "Walk-in friendly",
  ];
  for (const label of allLabels) {
    assert.notEqual(themeLabel(label, "th"), label, `"${label}" has no Thai translation`);
    assert.notEqual(themeLabel(label, "ko"), label, `"${label}" has no Korean translation`);
  }
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
cd chillanel && node --test scripts/theme-labels.test.mjs
```

Expected: FAIL — `Cannot find module '../lib/theme-labels.ts'` (or similar).

- [ ] **Step 4: Write the implementation**

Create `chillanel/lib/theme-labels.ts`:

```typescript
import type { Lang } from "./site";

// Translates the 15 fixed English labels that scripts/extract-themes.mjs
// (Phase 0) can produce — 8 SERVICE_THEMES + 7 MOOD_KEYWORDS keys, verbatim
// strings, not derived — into th/ko for display. Reviews are 99.8% English
// (Phase 0 finding), so the underlying extraction stays English-only; this
// is the single translation point every UI consumer must go through instead
// of rendering a raw `.label` from the data.
const LABELS: Record<string, Record<Lang, string>> = {
  "Foot massage": { en: "Foot massage", th: "นวดเท้า", ko: "발마사지" },
  "Oil massage": { en: "Oil massage", th: "นวดน้ำมัน", ko: "오일 마사지" },
  "Thai massage": { en: "Thai massage", th: "นวดไทย", ko: "타이 마사지" },
  Aromatherapy: { en: "Aromatherapy", th: "อโรมาเทอราพี", ko: "아로마테라피" },
  "Deep tissue": { en: "Deep tissue", th: "นวดลึก", ko: "딥티슈 마사지" },
  "Hot stone": { en: "Hot stone", th: "หินร้อน", ko: "핫스톤 마사지" },
  Facial: { en: "Facial", th: "ทรีทเมนต์หน้า", ko: "페이셜" },
  "Body scrub": { en: "Body scrub", th: "สครับผิว", ko: "바디 스크럽" },
  Clean: { en: "Clean", th: "สะอาด", ko: "청결함" },
  "Quiet & relaxing": { en: "Quiet & relaxing", th: "เงียบสงบ ผ่อนคลาย", ko: "조용하고 편안함" },
  "Strong pressure": { en: "Strong pressure", th: "นวดแรง", ko: "강한 압력" },
  Gentle: { en: "Gentle", th: "นวดเบามือ", ko: "부드러운 손길" },
  "Friendly staff": { en: "Friendly staff", th: "พนักงานเป็นกันเอง", ko: "친절한 직원" },
  "Good value": { en: "Good value", th: "คุ้มค่า", ko: "가성비 좋음" },
  "Walk-in friendly": { en: "Walk-in friendly", th: "walk-in ได้", ko: "워크인 가능" },
};

export function themeLabel(rawLabel: string, lang: Lang): string {
  return LABELS[rawLabel]?.[lang] ?? rawLabel;
}

export function slugifyTheme(rawLabel: string): string {
  return rawLabel
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd chillanel && node --test scripts/theme-labels.test.mjs
```

Expected: `# pass 5`, `# fail 0`.

- [ ] **Step 6: Commit**

```bash
git add chillanel/lib/theme-labels.ts chillanel/scripts/theme-labels.test.mjs
git commit -m "chillanel: add theme/mood label translation + slug module"
```

---

### Task 3: RatingBars component

**Files:**
- Create: `chillanel/components/RatingBars.tsx`

**Interfaces:**
- Consumes: `RatingDistribution` from `@/lib/types` (already exists, Phase 0).
- Produces: `<RatingBars distribution={place.ratingDistribution} size="compact" | "default" />` — Tasks 5 and 6 render this.

- [ ] **Step 1: Write the component**

Create `chillanel/components/RatingBars.tsx`:

```tsx
import type { RatingDistribution } from "@/lib/types";

const STARS = [5, 4, 3, 2, 1] as const;

export function RatingBars({
  distribution,
  size = "default",
}: {
  distribution: RatingDistribution;
  size?: "compact" | "default";
}) {
  const total = STARS.reduce((sum, star) => sum + distribution[star], 0);
  if (total === 0) return null;
  const compact = size === "compact";

  return (
    <div className={`flex flex-col gap-1 ${compact ? "w-28" : "w-full max-w-xs"}`}>
      {STARS.map((star) => {
        const count = distribution[star];
        const pct = (count / total) * 100;
        return (
          <div key={star} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2 text-muted tabular-nums shrink-0">{star}</span>
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-accent-warm rounded-full" style={{ width: `${pct}%` }} />
            </div>
            {!compact && <span className="w-6 text-right text-muted tabular-nums shrink-0">{count}</span>}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
cd chillanel && npx tsc --noEmit
```

Expected: clean (this component isn't imported anywhere yet, so there's nothing to exercise beyond syntax/type validity — Tasks 5-6 will wire it in and give it real coverage via the build).

- [ ] **Step 3: Commit**

```bash
git add chillanel/components/RatingBars.tsx
git commit -m "chillanel: add RatingBars component"
```

---

### Task 4: TagCloud component

**Files:**
- Create: `chillanel/components/TagCloud.tsx`

**Interfaces:**
- Consumes: `ThemeCount[]` from `@/lib/types`, `themeLabel`/`slugifyTheme` from `@/lib/theme-labels` (Task 2), `Lang` from `@/lib/site`.
- Produces: `<TagCloud items={...} lang={lang} linkToService={boolean} max={number} />` — Task 6 uses it non-linked (per-place mood keywords), Task 7 uses it linked (site-wide/city-wide service-theme trending).

- [ ] **Step 1: Write the component**

Create `chillanel/components/TagCloud.tsx`:

```tsx
import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { ThemeCount } from "@/lib/types";
import { themeLabel, slugifyTheme } from "@/lib/theme-labels";

export function TagCloud({
  items,
  lang,
  max = 12,
  linkToService = false,
}: {
  items: ThemeCount[];
  lang: Lang;
  max?: number;
  linkToService?: boolean;
}) {
  const top = items.slice(0, max);
  if (top.length === 0) return null;
  const maxCount = top[0]?.count ?? 1;

  return (
    <div className="flex flex-wrap gap-2">
      {top.map((item) => {
        const ratio = maxCount > 0 ? item.count / maxCount : 0;
        const scale = 0.85 + ratio * 0.5;
        const label = themeLabel(item.label, lang);
        const pillClass =
          "inline-block rounded-full border border-border px-3 py-1 text-muted font-medium transition-colors" +
          (linkToService ? " hover:border-accent-warm hover:text-accent-warm" : "");
        const content = (
          <span className={pillClass} style={{ fontSize: `${scale * 0.8125}rem` }}>
            {label} <span className="text-accent-warm font-semibold">{item.count}</span>
          </span>
        );
        return linkToService ? (
          <Link key={item.label} href={`/${lang}/service/${slugifyTheme(item.label)}`}>
            {content}
          </Link>
        ) : (
          <span key={item.label}>{content}</span>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
cd chillanel && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add chillanel/components/TagCloud.tsx
git commit -m "chillanel: add TagCloud component"
```

---

### Task 5: PlaceCard v3 — integrate RatingBars + top service theme

**Files:**
- Modify: `chillanel/components/PlaceCard.tsx`

**Interfaces:**
- Consumes: `RatingBars` (Task 3), `themeLabel` (Task 2).
- Produces: no new exports — same `PlaceCard` component signature as before (`place`, `lang`, `editorsPick`, `size`), unchanged by callers in Tasks 7/8.

- [ ] **Step 1: Add the imports**

In `chillanel/components/PlaceCard.tsx`, add after the existing `categoryBadgeLabel` import:

```typescript
import { RatingBars } from "./RatingBars";
import { themeLabel } from "@/lib/theme-labels";
```

- [ ] **Step 2: Add a top-service-theme badge to the existing badge row**

Replace the badge row (the `<div className="flex items-center flex-wrap gap-2 text-xs">...</div>` block, currently containing the `primaryType` badge and review count) with:

```tsx
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {badge && (
            <span className="rounded-full border border-border px-2.5 py-1 text-muted font-medium">
              {badge}
            </span>
          )}
          {place.serviceThemes.length > 0 && (
            <span className="rounded-full border border-accent-warm/30 bg-accent-warm/10 px-2.5 py-1 text-accent-warm font-medium">
              {themeLabel(place.serviceThemes[0].label, lang)}
            </span>
          )}
          <span className="text-muted">
            {place.reviewCount} {t.place.reviewCountLabel}
          </span>
        </div>
```

- [ ] **Step 3: Add compact RatingBars, large-card variant only**

Immediately after the therapist-mention-count block (the `{mentionCount > 0 && (...)}` block) and before the existing `{large && mentionCount > 0 && ...quote...}` block, add:

```tsx
        {large && (
          <div className="mt-4 border-t border-border pt-4">
            <RatingBars distribution={place.ratingDistribution} size="compact" />
          </div>
        )}
```

(Small/default cards stay visually light — the bento spotlight card is where the data-viz differentiator shows up most; regular cards get the new service-theme pill only.)

- [ ] **Step 4: Verify**

```bash
cd chillanel && npx tsc --noEmit
```

Expected: clean. (Full visual/build verification happens in Task 9 once real data flows through every touched page.)

- [ ] **Step 5: Commit**

```bash
git add chillanel/components/PlaceCard.tsx
git commit -m "chillanel: PlaceCard v3 — top service-theme badge + compact rating bars on featured card"
```

---

### Task 6: Place detail page v2 — rating breakdown, service themes, mood tags, price range

**Files:**
- Modify: `chillanel/app/[lang]/place/[id]/page.tsx`

**Interfaces:**
- Consumes: `RatingBars` (Task 3), `TagCloud` (Task 4), `themeLabel` (Task 2), the four new `t.place.*` i18n keys (Task 1).
- Produces: no new exports.

- [ ] **Step 1: Add the imports**

In `chillanel/app/[lang]/place/[id]/page.tsx`, add after the existing `Breadcrumbs` import:

```typescript
import { RatingBars } from "@/components/RatingBars";
import { TagCloud } from "@/components/TagCloud";
import { themeLabel } from "@/lib/theme-labels";
```

- [ ] **Step 2: Compute a price-range summary**

Inside the `PlacePage` component function, after the existing `const badge = categoryBadgeLabel(place.primaryType, lang);` line, add:

```typescript
  const priceMedian = (() => {
    const prices = place.priceMentions;
    if (prices.length === 0) return null;
    const mid = Math.floor(prices.length / 2);
    return prices.length % 2 !== 0 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2);
  })();
```

- [ ] **Step 3: Show the price line in the address card**

In the existing address card (the `<div className="rounded-2xl border border-border bg-bg-elev p-5 mb-8">...</div>` block), add a price line right after the `{place.mapsUrl && (...)}` block, still inside the same wrapping `<div>`:

```tsx
        {priceMedian != null && (
          <p className="text-sm text-muted mt-4 pt-4 border-t border-border">
            {t.place.priceRangeLabel.replace("{price}", priceMedian.toLocaleString())}
          </p>
        )}
```

- [ ] **Step 4: Add a rating breakdown section**

Right after the existing address card's closing `</div>` and before the `<section className="mb-10">` (therapist mentions section), add a new section:

```tsx
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-3">{t.place.ratingBreakdownTitle}</h2>
        <RatingBars distribution={place.ratingDistribution} />
      </section>
```

- [ ] **Step 5: Add service themes and mood keywords sections**

Right after the therapist mentions `</section>` (the one containing `<TherapistMentions ... />`) and before the reviews `<section>`, add:

```tsx
      {place.serviceThemes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3">{t.place.serviceThemesTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {place.serviceThemes.map((theme) => (
              <span
                key={theme.label}
                className="rounded-full border border-accent-warm/30 bg-accent-warm/10 px-3 py-1.5 text-sm text-accent-warm font-medium"
              >
                {themeLabel(theme.label, lang)} <span className="font-semibold">{theme.count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {place.moodKeywords.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3">{t.place.moodKeywordsTitle}</h2>
          <TagCloud items={place.moodKeywords} lang={lang} />
        </section>
      )}
```

- [ ] **Step 6: Verify**

```bash
cd chillanel && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add "chillanel/app/[lang]/place/[id]/page.tsx"
git commit -m "chillanel: place detail v2 — rating breakdown, service themes, mood tag cloud, price range"
```

---

### Task 7: Home + city page — trending tag cloud sections

**Files:**
- Modify: `chillanel/app/[lang]/page.tsx`
- Modify: `chillanel/app/[lang]/city/[city]/page.tsx`

**Interfaces:**
- Consumes: `TagCloud` (Task 4), `t.home.trendingTitle` / `t.city.trendingTitle` (Task 1), `bangkok.themeAggregate` / `data.themeAggregate` (already exist, Phase 0).
- Produces: no new exports.

- [ ] **Step 1: Add the import to the home page**

In `chillanel/app/[lang]/page.tsx`, add after the existing `ReviewQuotes` import:

```typescript
import { TagCloud } from "@/components/TagCloud";
```

- [ ] **Step 2: Add the trending section to the home page**

Right after the `<ReviewQuotes .../>` line and before `<Faq .../>`, add:

```tsx
        {bangkok.themeAggregate.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display italic text-2xl sm:text-3xl mb-6">{t.home.trendingTitle}</h2>
            <TagCloud items={bangkok.themeAggregate} lang={lang} linkToService max={15} />
          </section>
        )}
```

- [ ] **Step 3: Add the import to the city page**

In `chillanel/app/[lang]/city/[city]/page.tsx`, add after the existing `Faq` import:

```typescript
import { TagCloud } from "@/components/TagCloud";
```

- [ ] **Step 4: Add the trending section to the city page**

Right after the closing `</div>` of the featured-places grid (the `<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:auto-rows-[1fr] gap-5 mb-14">...</div>` block) and before `<Faq .../>`, add:

```tsx
        {data.themeAggregate.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display italic text-2xl sm:text-3xl mb-6">
              {t.city.trendingTitle.replace("{city}", label)}
            </h2>
            <TagCloud items={data.themeAggregate} lang={lang} linkToService max={15} />
          </section>
        )}
```

- [ ] **Step 5: Verify**

```bash
cd chillanel && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add "chillanel/app/[lang]/page.tsx" "chillanel/app/[lang]/city/[city]/page.tsx"
git commit -m "chillanel: add trending service-theme tag cloud to home and city pages"
```

---

### Task 8: Service theme pages (`/[lang]/service/[theme]`) + sitemap

**Files:**
- Create: `chillanel/app/[lang]/service/[theme]/page.tsx`
- Modify: `chillanel/app/sitemap.ts`

**Interfaces:**
- Consumes: `themeLabel`/`slugifyTheme` (Task 2), `PlaceCard` (Task 5's updated version), `Breadcrumbs`, `t.service.*` (Task 1).
- Produces: the `/[lang]/service/[theme]` route that `TagCloud`'s `linkToService` links (Tasks 4, 7) point to — the slug generation here MUST use the same `slugifyTheme` function those links use, which it does (both import from the same Task 2 module).

- [ ] **Step 1: Write the page**

Create `chillanel/app/[lang]/service/[theme]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { themeLabel, slugifyTheme } from "@/lib/theme-labels";
import { PlaceCard } from "@/components/PlaceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const MAX_SHOWN = 90; // same payload-size discipline as the city page

function allServiceThemeLabels(): string[] {
  const labels = new Set<string>();
  for (const city of listCities()) {
    for (const place of loadCity(city).places) {
      for (const theme of place.serviceThemes) labels.add(theme.label);
    }
  }
  return [...labels];
}

function findLabelForSlug(slug: string): string | null {
  return allServiceThemeLabels().find((label) => slugifyTheme(label) === slug) ?? null;
}

export function generateStaticParams() {
  return allServiceThemeLabels().map((label) => ({ theme: slugifyTheme(label) }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; theme: string }>;
}): Promise<Metadata> {
  const { lang, theme } = await params;
  if (!isLang(lang)) return {};
  const rawLabel = findLabelForSlug(theme);
  if (!rawLabel) return {};
  const t = tFor(lang);
  const label = themeLabel(rawLabel, lang);
  const cities = listCities();
  const cityDisplayLabel = cities.length > 0 ? cityLabel(cities[0]) : "";
  return {
    title: `${t.service.listTitle.replace("{theme}", label).replace("{city}", cityDisplayLabel)} — ${SITE.name}`,
    description: t.service.intro.replace("{theme}", label).replace("{city}", cityDisplayLabel),
    alternates: {
      canonical: `/${lang}/service/${theme}`,
      languages: hreflangAlternates((l) => `/${l}/service/${theme}`),
    },
  };
}

export default async function ServiceThemePage({
  params,
}: {
  params: Promise<{ lang: string; theme: string }>;
}) {
  const { lang, theme } = await params;
  if (!isLang(lang)) notFound();
  const rawLabel = findLabelForSlug(theme);
  if (!rawLabel) notFound();
  const t = tFor(lang);
  const cities = listCities();
  if (cities.length === 0) notFound();
  const cityCode = cities[0];
  const cityData = loadCity(cityCode);
  const label = themeLabel(rawLabel, lang);
  const cityDisplayLabel = cityLabel(cityCode);

  const allMatching = cityData.places
    .filter((p) => p.serviceThemes.some((s) => s.label === rawLabel))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
  if (allMatching.length === 0) notFound();
  const places = allMatching.slice(0, MAX_SHOWN);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-on-ink sm:mx-[calc(50%-50vw)] px-6 sm:px-0 pb-20 sm:pb-28">
        <div className="spa-glow bg-accent-warm w-[300px] h-[300px] -top-28 -left-20" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-0 sm:px-6 pt-14 sm:pt-20">
          <Breadcrumbs
            variant="ink"
            items={[
              { name: t.nav.home, href: `/${lang}` },
              { name: cityDisplayLabel, href: `/${lang}/city/${cityCode}` },
              { name: label, href: `/${lang}/service/${theme}` },
            ]}
          />
          <h1 className="font-display italic font-semibold text-3xl sm:text-5xl tracking-tight mb-3">
            {t.service.listTitle.replace("{theme}", label).replace("{city}", cityDisplayLabel)}
          </h1>
          <p className="text-on-ink-muted max-w-2xl leading-relaxed">
            {t.service.intro.replace("{theme}", label).replace("{city}", cityDisplayLabel)}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-14">
        <Link
          href={`/${lang}/city/${cityCode}`}
          className="inline-block text-sm text-accent font-semibold mb-6 hover:underline"
        >
          {t.service.backToCity.replace("{city}", cityDisplayLabel)}
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add service pages to the sitemap**

In `chillanel/app/sitemap.ts`, add imports for the theme-label helpers and city/place data already imported:

```typescript
import { slugifyTheme } from "@/lib/theme-labels";
```

Inside the `for (const lang of SUPPORTED_LANGS) { ... }` loop, right after the `for (const city of listCities()) { ... }` block closes, add a new loop building the service-page URLs (derive labels the same way the page itself does, to guarantee the sitemap never lists a URL the page can't statically generate):

```typescript
    const serviceLabels = new Set<string>();
    for (const city of listCities()) {
      for (const { place } of getAllPlaces()) {
        for (const theme of place.serviceThemes) serviceLabels.add(theme.label);
      }
    }
    for (const label of serviceLabels) {
      entries.push({
        url: `${SITE.origin}/${lang}/service/${slugifyTheme(label)}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
```

(This duplicates work across cities since `getAllPlaces()` already flattens every city — the inner `for (const city of listCities())` loop here is redundant with `getAllPlaces()`. Remove the outer `for (const city of listCities())` line and its closing brace, keeping only the `for (const { place } of getAllPlaces())` loop, so the final block is:)

```typescript
    const serviceLabels = new Set<string>();
    for (const { place } of getAllPlaces()) {
      for (const theme of place.serviceThemes) serviceLabels.add(theme.label);
    }
    for (const label of serviceLabels) {
      entries.push({
        url: `${SITE.origin}/${lang}/service/${slugifyTheme(label)}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
```

- [ ] **Step 3: Verify types and a scoped build**

```bash
cd chillanel && npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add "chillanel/app/[lang]/service" chillanel/app/sitemap.ts
git commit -m "chillanel: add /service/[theme] browsable pages + sitemap entries"
```

---

### Task 9: Full verification, real-data spot-check, deploy

**Files:** none created/modified — verification and deployment only.

**Interfaces:**
- Consumes: everything from Tasks 1-8.
- Produces: a live deployment.

- [ ] **Step 1: Full test suite and typecheck**

```bash
cd chillanel && node --test scripts/*.test.mjs && npx tsc --noEmit
```

Expected: all tests pass (should be 29 + 5 new from Task 2 = 34), `tsc` clean.

- [ ] **Step 2: Production build**

```bash
cd chillanel && npm run build 2>&1 | tail -40
```

Expected: `Compiled successfully`, every existing route still present, plus new `/[lang]/service/[theme]` routes listed (multiple slugs × 3 langs). Note the total static page count for the report — compare against the pre-Phase-1 baseline and explain any change (new service pages are expected growth; anything else is worth flagging).

- [ ] **Step 3: Spot-check the new pages render real content**

```bash
cd chillanel
(npx next start -p 3501 &)
sleep 4
curl -s -o /dev/null -w "home: %{http_code}\n" http://localhost:3501/en
curl -s -o /dev/null -w "city: %{http_code}\n" http://localhost:3501/en/city/bangkok
node -e "
const data = JSON.parse(require('fs').readFileSync('data/clinics.bangkok.json', 'utf-8'));
const slug = require('./lib/theme-labels.ts') // if this require fails because it's TS, instead read the first themeAggregate label and manually slugify: lowercase, replace & with 'and', replace non-alnum with '-', trim dashes
console.log(data.themeAggregate[0]);
"
```

(The inline `require` of a `.ts` file will likely fail under plain Node — if so, just manually compute the slug for `data.themeAggregate[0].label` by hand using the same rule as `slugifyTheme`, and curl that URL directly instead.)

```bash
curl -s -o /dev/null -w "service page: %{http_code}\n" http://localhost:3501/en/service/<slug-computed-above>
curl -s http://localhost:3501/en/service/<slug-computed-above> | grep -o 'font-display[^<]*<' | head -3
curl -s http://localhost:3501/en/city/bangkok | grep -c 'hover:border-accent-warm'
```

Expected: all routes 200, the service page's title renders the translated theme label, and the city page's trending tag cloud produces multiple linked pills (the grep count should be > 0).

Stop the server afterward with a scoped `taskkill` on the launched PID — **never** a blanket `taskkill /IM node.exe`.

- [ ] **Step 4: Deploy**

```bash
cd chillanel
export VERCEL_TOKEN="<read from repo root .env, VERCEL_TOKEN= line — do not print the value>"
vercel deploy --prod --yes --scope vamoss2 --token="$VERCEL_TOKEN"
```

(Never add `--archive=tgz` — bypasses `.vercelignore`, established gotcha.)

- [ ] **Step 5: Verify the live deployment**

```bash
for p in en th ko; do curl -s -o /dev/null -w "$p: %{http_code}\n" https://chillanel-alpha.vercel.app/$p; done
curl -s -o /dev/null -w "city: %{http_code}\n" https://chillanel-alpha.vercel.app/en/city/bangkok
```

Expected: all 200.

- [ ] **Step 6: Report**

No code changes in this step — report the real build page count, the full list of generated service-theme slugs (so it's clear exactly which `/service/*` pages exist), and confirmation the live deployment is serving the new sections.

---

## Self-Review Notes

- **Spec coverage:** roadmap's Phase 1 bullets — mapped: PlaceCard v3 (data instead of photos) → Tasks 3, 5; place detail rating/theme/mood/price sections → Task 6; site-wide trending → Task 7; category/service pages → Task 8. District pages, filter/sort bar, and client-side search from the original roadmap sketch are explicitly **not** in this plan (district: blocked on the Phase 0 finding, documented in Global Constraints; filter/sort/search: deferred as a separate later pass to keep this plan's scope achievable — flagged here rather than silently dropped).
- **Global constraints check:** no district dependency anywhere in Tasks 1-8 (verified while writing each task — `district` field is never read). No new client JS (every new component is a Server Component, `next/link` only). Payload-size cap applied to the new service route (Task 8's `MAX_SHOWN = 90`, same pattern as the city page). English-labels-must-be-translated constraint enforced by routing every label through `themeLabel()` (Task 2) — checked every JSX spot that renders a `.label` in Tasks 5, 6, 7, 8.
- **Type consistency check:** `themeLabel`/`slugifyTheme` (Task 2) have one signature used identically by `TagCloud` (Task 4), `PlaceCard` (Task 5), the place detail page (Task 6), and the service page (Task 8) — no drift. `RatingBars`' `distribution` prop type (`RatingDistribution`) matches `Place.ratingDistribution`'s type exactly (both defined in Phase 0's `lib/types.ts`, unchanged by this plan).
- **Known scope boundary, not silently dropped:** Task 2's test file imports a `.ts` file directly from a `.mjs` test — Step 1 of Task 2 explicitly tells the implementer to verify this pattern against the already-working `i18n.test.mjs` before assuming it works, rather than the plan asserting untested confidence.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-25-chillanel-phase1-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
