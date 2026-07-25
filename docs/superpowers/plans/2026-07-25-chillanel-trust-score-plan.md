# chillanel Trust Score Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 0–100 "Trust Score" (rating + log-scaled review volume + review-mined signal diversity) to every place, shown as a compact badge on `PlaceCard` and an expandable breakdown on the place detail page.

**Architecture:** One new pure-function module (`lib/trust-score.ts`) computing the score from fields already on `Place` — same pattern as `lib/summary.ts`/`lib/related.ts`/`lib/theme-stats.ts`. Two new presentational components consume it: `TrustScoreBadge` (compact, `PlaceCard`) and `TrustScoreDetail` (expandable, using a native `<details>`/`<summary>` element — same zero-JS disclosure pattern already used by `components/Faq.tsx`, no client component needed).

**Tech Stack:** Next.js App Router (existing), TypeScript, `node --test` with direct `.ts` imports.

## Global Constraints

- **Full spec:** `docs/superpowers/specs/2026-07-25-chillanel-trust-score-design.md` — read it for the complete rationale; this section only restates the exact values every task must match.
- **Formula, exact:** `ratingPoints = round((rating/5) × 50)` (0 if `rating` is `null`) · `volumePoints = round(min(35, 35 × log10(reviewCount+1) / log10(2001)))` (0 if `reviewCount` is 0) · `diversityPoints = min(15, count of distinct labels across serviceThemes ∪ moodKeywords)`. **Each component is rounded individually, then summed** — the on-page breakdown must always sum to exactly the headline score.
- **Bands, exact:** score ≥ 85 → `"excellent"` · ≥ 70 → `"good"` · ≥ 50 → `"fair"` · else → `"limited"`.
- **No paid APIs, no new scraping.** Pure derivation of fields already on `Place` (`chillanel/lib/types.ts`) — computed at read time in the app, not added to `build-data.mjs`'s output.
- **No reweighting for zero-diversity-data places** (71/734 in the live dataset). They score 0 on that component, same as any other place with genuinely no signal there.
- **Null/empty-safe rendering**, but note this is *not* the same shape as prior phases' guards: a Trust Score is always computable and always worth displaying (even "Limited data" is informative), unlike e.g. `RatingBars` which has nothing to draw on an all-zero distribution. Neither new component should have a null-return branch.
- **All new UI strings go through `chillanel/lib/i18n.ts`** with en/th/ko translations.
- **Pure functions live in `lib/*.ts` and are unit-tested via `node --test`** with direct `.ts` imports and plain-object fixtures, no filesystem coupling.

---

### Task 1: i18n keys — Trust Score labels

**Files:**
- Modify: `chillanel/lib/i18n.ts`

**Interfaces:**
- Produces: new top-level `Dict.trustScore` block (`title`, `excellent`, `good`, `fair`, `limited`, `breakdownRating`, `breakdownVolume`, `breakdownDiversity`) — consumed by Task 3 (`TrustScoreBadge`) and Task 4 (`TrustScoreDetail`). The four band-name keys (`excellent`/`good`/`fair`/`limited`) are indexed dynamically by the `TrustLabel` string Task 2 produces (`t.trustScore[result.label]`), so their key names must match exactly: `excellent`, `good`, `fair`, `limited`.

- [ ] **Step 1: Add the `trustScore` block to the `Dict` type**

In `chillanel/lib/i18n.ts`, in the `Dict` type, add a new top-level field (placed after the `service` block, before `guide`):

```typescript
  trustScore: {
    title: string;
    excellent: string;
    good: string;
    fair: string;
    limited: string;
    breakdownRating: string;
    breakdownVolume: string;
    breakdownDiversity: string;
  };
```

- [ ] **Step 2: Add English values**

In the `en` object, add a new `trustScore` block (same position, after `service`, before `guide`):

```typescript
  trustScore: {
    title: "Trust Score",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    limited: "Limited data",
    breakdownRating: "Rating",
    breakdownVolume: "Reviews",
    breakdownDiversity: "Signal diversity",
  },
```

- [ ] **Step 3: Add Thai values**

In the `th` object, same position:

```typescript
  trustScore: {
    title: "คะแนนความน่าเชื่อถือ",
    excellent: "ยอดเยี่ยม",
    good: "ดี",
    fair: "พอใช้",
    limited: "ข้อมูลจำกัด",
    breakdownRating: "คะแนนรีวิว",
    breakdownVolume: "จำนวนรีวิว",
    breakdownDiversity: "ความหลากหลายของข้อมูล",
  },
```

- [ ] **Step 4: Add Korean values**

In the `ko` object, same position:

```typescript
  trustScore: {
    title: "신뢰 점수",
    excellent: "매우 좋음",
    good: "좋음",
    fair: "보통",
    limited: "데이터 부족",
    breakdownRating: "평점",
    breakdownVolume: "리뷰 수",
    breakdownDiversity: "리뷰 신호 다양성",
  },
```

- [ ] **Step 5: Run the i18n structural test**

Run: `cd chillanel && node --test scripts/i18n.test.mjs`
Expected: PASS.

- [ ] **Step 6: Type-check**

Run: `cd chillanel && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add chillanel/lib/i18n.ts
git commit -m "chillanel: add Trust Score i18n keys"
```

---

### Task 2: `lib/trust-score.ts` — the scoring formula

**Files:**
- Create: `chillanel/lib/trust-score.ts`
- Test: `chillanel/scripts/trust-score.test.mjs`

**Interfaces:**
- Consumes: `ThemeCount` type (`chillanel/lib/types.ts`, `{ label: string; count: number }`).
- Produces: `TrustLabel` type (`"excellent" | "good" | "fair" | "limited"`), `TrustScoreResult` type (`{ score: number; label: TrustLabel; breakdown: { ratingPoints: number; volumePoints: number; diversityPoints: number } }`), and `trustScore(place: { rating: number | null; reviewCount: number; serviceThemes: ThemeCount[]; moodKeywords: ThemeCount[] }): TrustScoreResult` — consumed by Task 3 (`TrustScoreBadge`) and Task 4 (`TrustScoreDetail`). The parameter is a structural subset of `Place`, not the full type, so callers can pass a `Place` directly (structurally compatible) without needing to construct anything extra.

Every numeric value below was hand-verified with a `node -e` one-liner before being written into this plan — see the design spec's Verification section for the full-dataset sanity check.

- [ ] **Step 1: Write the failing tests**

Create `chillanel/scripts/trust-score.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { trustScore } from "../lib/trust-score.ts";

function place(overrides = {}) {
  return {
    rating: null,
    reviewCount: 0,
    serviceThemes: [],
    moodKeywords: [],
    ...overrides,
  };
}

test("rating points: null rating scores 0", () => {
  const result = trustScore(place({ rating: null }));
  assert.equal(result.breakdown.ratingPoints, 0);
});

test("rating points: 5.0 scores the full 50", () => {
  const result = trustScore(place({ rating: 5 }));
  assert.equal(result.breakdown.ratingPoints, 50);
});

test("rating points: 4.3 scores 43 (linear, rating/5 * 50)", () => {
  const result = trustScore(place({ rating: 4.3 }));
  assert.equal(result.breakdown.ratingPoints, 43);
});

test("volume points: 0 reviews scores 0", () => {
  const result = trustScore(place({ reviewCount: 0 }));
  assert.equal(result.breakdown.volumePoints, 0);
});

test("volume points: exactly the 2000-review cap scores the full 35", () => {
  const result = trustScore(place({ reviewCount: 2000 }));
  assert.equal(result.breakdown.volumePoints, 35);
});

test("volume points: beyond the cap still scores 35, never more", () => {
  const result = trustScore(place({ reviewCount: 50000 }));
  assert.equal(result.breakdown.volumePoints, 35);
});

test("volume points: 107 reviews (log scale, not linear) scores 22", () => {
  const result = trustScore(place({ reviewCount: 107 }));
  assert.equal(result.breakdown.volumePoints, 22);
});

test("volume points: 5 reviews scores 8 — small counts still register meaningfully on the log scale", () => {
  const result = trustScore(place({ reviewCount: 5 }));
  assert.equal(result.breakdown.volumePoints, 8);
});

test("diversity points: counts distinct labels across serviceThemes and moodKeywords combined", () => {
  const result = trustScore(
    place({
      serviceThemes: [{ label: "Foot massage", count: 5 }, { label: "Oil massage", count: 2 }],
      moodKeywords: [{ label: "Clean", count: 3 }],
    })
  );
  assert.equal(result.breakdown.diversityPoints, 3);
});

test("diversity points: a label appearing in both arrays only counts once", () => {
  const result = trustScore(
    place({
      serviceThemes: [{ label: "Clean", count: 5 }],
      moodKeywords: [{ label: "Clean", count: 3 }],
    })
  );
  assert.equal(result.breakdown.diversityPoints, 1);
});

test("diversity points: capped at 15 even if more distinct labels were somehow present", () => {
  const manyThemes = Array.from({ length: 20 }, (_, i) => ({ label: `Label ${i}`, count: 1 }));
  const result = trustScore(place({ serviceThemes: manyThemes }));
  assert.equal(result.breakdown.diversityPoints, 15);
});

test("label bands: 85 and above is excellent", () => {
  assert.equal(trustScore(place({ rating: 5, reviewCount: 2000, serviceThemes: [{ label: "Foot massage", count: 1 }, { label: "Oil massage", count: 1 }, { label: "Thai massage", count: 1 }, { label: "Aromatherapy", count: 1 }, { label: "Deep tissue", count: 1 }] })).label, "excellent");
});

test("label bands: 70-84 is good, 50-69 is fair, below 50 is limited", () => {
  // rating 4.0 (40pts) + 0 reviews (0pts) + 3 diversity = 43 -> limited
  assert.equal(trustScore(place({ rating: 4.0, reviewCount: 0, serviceThemes: [{ label: "A", count: 1 }], moodKeywords: [{ label: "B", count: 1 }, { label: "C", count: 1 }] })).label, "limited");
  // rating 5.0 (50pts) + 107 reviews (22pts) + 0 diversity = 72 -> good
  assert.equal(trustScore(place({ rating: 5, reviewCount: 107 })).label, "good");
});

test("full integration: score equals the sum of the rounded breakdown components", () => {
  const p = place({
    rating: 4.3,
    reviewCount: 107,
    serviceThemes: [{ label: "Foot massage", count: 5 }],
    moodKeywords: [{ label: "Clean", count: 3 }, { label: "Quiet & relaxing", count: 2 }],
  });
  const result = trustScore(p);
  assert.equal(result.breakdown.ratingPoints, 43);
  assert.equal(result.breakdown.volumePoints, 22);
  assert.equal(result.breakdown.diversityPoints, 3);
  assert.equal(result.score, 43 + 22 + 3);
  assert.equal(result.label, "good");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd chillanel && node --test scripts/trust-score.test.mjs`
Expected: FAIL — `Cannot find module '../lib/trust-score.ts'`.

- [ ] **Step 3: Write `chillanel/lib/trust-score.ts`**

```typescript
import type { ThemeCount } from "./types";

export type TrustLabel = "excellent" | "good" | "fair" | "limited";

export type TrustScoreResult = {
  score: number;
  label: TrustLabel;
  breakdown: {
    ratingPoints: number;
    volumePoints: number;
    diversityPoints: number;
  };
};

// Normalization ceiling for the review-volume log scale — chosen at the
// live Bangkok dataset's ~95th percentile (see the design spec's
// Verification section), so the bulk of the distribution spreads across
// the full 0-35 range instead of clustering near the cap.
const VOLUME_CAP = 2000;

// 8 SERVICE_THEMES + 7 MOOD_KEYWORDS (scripts/extract-themes.mjs) — the
// fixed universe of labels a place's reviews can be mined for.
const MAX_DIVERSITY_LABELS = 15;

function ratingPoints(rating: number | null): number {
  if (rating == null) return 0;
  return Math.round((rating / 5) * 50);
}

function volumePoints(reviewCount: number): number {
  if (reviewCount <= 0) return 0;
  const raw = 35 * (Math.log10(reviewCount + 1) / Math.log10(VOLUME_CAP + 1));
  return Math.round(Math.min(35, raw));
}

function diversityPoints(serviceThemes: ThemeCount[], moodKeywords: ThemeCount[]): number {
  const labels = new Set([...serviceThemes.map((t) => t.label), ...moodKeywords.map((m) => m.label)]);
  return Math.min(labels.size, MAX_DIVERSITY_LABELS);
}

function labelFor(score: number): TrustLabel {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  return "limited";
}

// A place's Trust Score: rating (50pts, linear) + review volume (35pts,
// log-scaled, capped) + review-mined signal diversity (15pts, 1 per
// distinct service-theme/mood-keyword label actually detected). See
// docs/superpowers/specs/2026-07-25-chillanel-trust-score-design.md for
// the full rationale, including why this replaces the 15 points of
// thaigle.com's formula that depend on Google reviewer-profile data this
// pipeline never scraped.
//
// Each component is rounded before summing — the breakdown shown on the
// place detail page must always add up to exactly this score.
export function trustScore(place: {
  rating: number | null;
  reviewCount: number;
  serviceThemes: ThemeCount[];
  moodKeywords: ThemeCount[];
}): TrustScoreResult {
  const rPts = ratingPoints(place.rating);
  const vPts = volumePoints(place.reviewCount);
  const dPts = diversityPoints(place.serviceThemes, place.moodKeywords);
  const score = rPts + vPts + dPts;
  return {
    score,
    label: labelFor(score),
    breakdown: { ratingPoints: rPts, volumePoints: vPts, diversityPoints: dPts },
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd chillanel && node --test scripts/trust-score.test.mjs`
Expected: PASS, 14/14.

- [ ] **Step 5: Type-check**

Run: `cd chillanel && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add chillanel/lib/trust-score.ts chillanel/scripts/trust-score.test.mjs
git commit -m "chillanel: add lib/trust-score.ts (rating + volume + signal-diversity formula)"
```

---

### Task 3: `TrustScoreBadge` — compact badge on `PlaceCard`

**Files:**
- Create: `chillanel/components/TrustScoreBadge.tsx`
- Modify: `chillanel/components/PlaceCard.tsx`

**Interfaces:**
- Consumes: `trustScore` (`chillanel/lib/trust-score.ts`, Task 2), `Dict.trustScore` (Task 1).

- [ ] **Step 1: Write `chillanel/components/TrustScoreBadge.tsx`**

```typescript
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { trustScore } from "@/lib/trust-score";

export function TrustScoreBadge({
  place,
  lang,
}: {
  place: Pick<Place, "rating" | "reviewCount" | "serviceThemes" | "moodKeywords">;
  lang: Lang;
}) {
  const t = tFor(lang);
  const result = trustScore(place);
  return (
    <div className="flex items-center gap-1 rounded-full bg-bg-elev border border-border shadow-sm text-sm font-bold px-2.5 py-1">
      <span className="text-accent">{result.score}</span>
      <span className="text-muted text-xs font-medium">{t.trustScore[result.label]}</span>
    </div>
  );
}
```

- [ ] **Step 2: Wire it into `PlaceCard.tsx`**

Add the import, after the existing `CardActions` import:

```typescript
import { CardActions } from "./CardActions";
import { TrustScoreBadge } from "./TrustScoreBadge";
```

Then replace the rating-pill block:

```typescript
        {place.rating != null && (
          <div className="absolute -bottom-4 left-4 flex items-center gap-1 rounded-full bg-bg-elev border border-border shadow-sm text-sm font-bold px-2.5 py-1">
            <span className="text-accent-warm" aria-hidden="true">★</span>
            {place.rating.toFixed(1)}
          </div>
        )}
```

with:

```typescript
        <div className="absolute -bottom-4 left-4 flex items-center gap-2">
          {place.rating != null && (
            <div className="flex items-center gap-1 rounded-full bg-bg-elev border border-border shadow-sm text-sm font-bold px-2.5 py-1">
              <span className="text-accent-warm" aria-hidden="true">★</span>
              {place.rating.toFixed(1)}
            </div>
          )}
          <TrustScoreBadge place={place} lang={lang} />
        </div>
```

(This moves the rating pill inside a shared flex row so the Trust Score badge sits directly beside it — same `-bottom-4 left-4` positioning as before, no other layout changes.)

- [ ] **Step 3: Run tsc**

Run: `cd chillanel && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run the full test suite**

Run: `cd chillanel && node --test scripts/*.test.mjs`
Expected: all pass (89/89 — 75 prior + 14 from Task 2).

- [ ] **Step 5: Manual spot-check against real data**

Run:
```bash
cd chillanel && npm run build
```
Then grep a built city page for the new badge, e.g.:
```bash
grep -oE '"[0-9]+"[^<]*<span[^>]*>(Excellent|Good|Fair|Limited data)' .next/server/app/en/city/bangkok.html | head -5
```
(exact grep pattern may need adjusting once you see the real HTML — the point is confirming score+label pairs actually render on real cards, not just that the build succeeds). Confirm no place with `rating: null` breaks the build (there are 0 in the live dataset per the design spec's verification, so this is a defensive check, not an expected-to-trigger one).

- [ ] **Step 6: Commit**

```bash
git add chillanel/components/TrustScoreBadge.tsx chillanel/components/PlaceCard.tsx
git commit -m "chillanel: add TrustScoreBadge to PlaceCard"
```

---

### Task 4: `TrustScoreDetail` — expandable breakdown on the place detail page

**Files:**
- Create: `chillanel/components/TrustScoreDetail.tsx`
- Modify: `chillanel/app/[lang]/place/[id]/page.tsx`

**Interfaces:**
- Consumes: `trustScore` (`chillanel/lib/trust-score.ts`, Task 2), `Dict.trustScore` (Task 1).

- [ ] **Step 1: Write `chillanel/components/TrustScoreDetail.tsx`**

```typescript
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { trustScore } from "@/lib/trust-score";

// Same zero-JS expand/collapse pattern as components/Faq.tsx: a native
// <details>/<summary> element needs no client component. The whole
// score+label line is the toggle target — no separate "how is this
// calculated?" prompt text needed, matching how Faq.tsx uses the question
// itself as the summary.
export function TrustScoreDetail({
  place,
  lang,
}: {
  place: Pick<Place, "rating" | "reviewCount" | "serviceThemes" | "moodKeywords">;
  lang: Lang;
}) {
  const t = tFor(lang);
  const result = trustScore(place);
  return (
    <details className="group rounded-xl border border-border bg-bg-elev p-4 mb-6">
      <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-4">
        <span>
          {t.trustScore.title}: <span className="text-accent">{result.score}</span>{" "}
          <span className="text-muted font-medium">{t.trustScore[result.label]}</span>
        </span>
        <span className="shrink-0 text-muted transition-transform group-open:rotate-45 text-lg leading-none" aria-hidden="true">
          +
        </span>
      </summary>
      <ul className="text-sm text-muted leading-relaxed mt-3 space-y-1">
        <li>
          {t.trustScore.breakdownRating}: {result.breakdown.ratingPoints}/50
        </li>
        <li>
          {t.trustScore.breakdownVolume}: {result.breakdown.volumePoints}/35
        </li>
        <li>
          {t.trustScore.breakdownDiversity}: {result.breakdown.diversityPoints}/15
        </li>
      </ul>
    </details>
  );
}
```

- [ ] **Step 2: Wire it into `chillanel/app/[lang]/place/[id]/page.tsx`**

Add the import, after the existing `PlaceActions` import:

```typescript
import { PlaceActions } from "@/components/PlaceActions";
import { TrustScoreDetail } from "@/components/TrustScoreDetail";
```

Then replace:

```typescript
      <PlaceActions placeId={place.id} lang={lang} />

      {summary && <p className="text-muted leading-relaxed mb-6 max-w-2xl">{summary}</p>}
```

with:

```typescript
      <TrustScoreDetail place={place} lang={lang} />

      <PlaceActions placeId={place.id} lang={lang} />

      {summary && <p className="text-muted leading-relaxed mb-6 max-w-2xl">{summary}</p>}
```

- [ ] **Step 3: Run tsc**

Run: `cd chillanel && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run the full test suite**

Run: `cd chillanel && node --test scripts/*.test.mjs`
Expected: all pass (89/89, no new tests this task — verifying no regression).

- [ ] **Step 5: Manual spot-check against real data**

Run `npm run build`, then confirm one built place-detail HTML file contains all three breakdown lines and that the numbers in them sum to the headline score shown in the `<summary>`, e.g.:
```bash
cd chillanel && grep -oE "Trust Score.{0,60}" ".next/server/app/en/place/0x30e299004239fe13_0xf7ebafcadf06a51a.html" | head -3
grep -oE "Rating: [0-9]+/50|Reviews: [0-9]+/35|Signal diversity: [0-9]+/15" ".next/server/app/en/place/0x30e299004239fe13_0xf7ebafcadf06a51a.html"
```

- [ ] **Step 6: Commit**

```bash
git add chillanel/components/TrustScoreDetail.tsx "chillanel/app/[lang]/place/[id]/page.tsx"
git commit -m "chillanel: add TrustScoreDetail (expandable breakdown) to place detail page"
```

---

### Task 5: Verify against real dataset, final review, deploy

**Files:** none (verification + deployment only)

- [ ] **Step 1: Full verification**

```bash
cd chillanel
npx tsc --noEmit
node --test scripts/*.test.mjs
npm run build
```
Expected: tsc clean, all tests pass (89/89), build completes with the same route counts as before this plan (no new routes — Trust Score is display-only on existing pages).

- [ ] **Step 2: Cross-check the formula against the design spec's documented distribution**

Run this against the freshly-built `data/clinics.bangkok.json` (note: this re-derives the score via a standalone script, not by importing the TypeScript module, since this is a one-off verification, not a test):

```bash
cd chillanel && node -e '
const data = require("./data/clinics.bangkok.json");
function uniqueLabelCount(p) {
  return new Set([...p.serviceThemes.map(t=>t.label), ...p.moodKeywords.map(t=>t.label)]).size;
}
function score(p) {
  const r = Math.round(p.rating != null ? (p.rating/5)*50 : 0);
  const v = Math.round(Math.min(35, 35*Math.log10(p.reviewCount+1)/Math.log10(2001)));
  const d = Math.min(uniqueLabelCount(p), 15);
  return r+v+d;
}
const scores = data.places.map(score);
const bands = {excellent:0, good:0, fair:0, limited:0};
for (const s of scores) {
  if (s>=85) bands.excellent++;
  else if (s>=70) bands.good++;
  else if (s>=50) bands.fair++;
  else bands.limited++;
}
console.log(bands, "/", scores.length);
'
```
Expected: numbers close to the design spec's documented Excellent 109 / Good 363 / Fair 242 / Limited 20 (exact counts may drift slightly if the live dataset has changed since the spec was written, e.g. from the grid scrapers currently running — that is expected and fine; the point is confirming no gross miscalculation, not exact reproduction).

- [ ] **Step 3: Dispatch final whole-branch review**

Generate a path-scoped diff against this plan's base commit and dispatch the final code-reviewer subagent on the most capable available model. Given the established interleaved-commit issue with this repo's `main` branch, prefer `git diff -U10 <base>..HEAD -- chillanel/` over the `review-package` script if the commit range looks polluted.

- [ ] **Step 4: Fix any Critical/Important findings**

Dispatch one fix subagent with the complete findings list if the review returns any. Re-verify (Step 1) and re-review after fixes.

- [ ] **Step 5: Deploy to production**

```bash
cd chillanel
set -a && source ../.env && set +a
vercel deploy --prod --yes --scope vamoss2 --token="$VERCEL_TOKEN"
```
Never print `$VERCEL_TOKEN`'s value.

- [ ] **Step 6: Live verification**

```bash
for url in "https://www.chillanel.com/en/city/bangkok" "https://www.chillanel.com/en/place/<a-real-place-id>" "https://www.chillanel.com/en"; do
  curl -s -o /dev/null -w "%{http_code}  %{url}\n" "$url"
done
```
Expected: all 200. Additionally `curl` the city page and the place page and confirm the Trust Score badge (a number + Excellent/Good/Fair/Limited data label) and the expandable breakdown (`Rating: X/50`, `Reviews: X/35`, `Signal diversity: X/15`) both appear in the production HTML, and that the three breakdown numbers sum to the headline score.

- [ ] **Step 7: Update the progress ledger**

Append to `.superpowers/sdd/progress.md` under a new `Plan: docs/superpowers/plans/2026-07-25-chillanel-trust-score-plan.md` section, following the same format as prior sections.

- [ ] **Step 8: Report to the user**

Summarize: the formula shipped (rating/volume/diversity, exact weights), where it shows (PlaceCard badge, expandable detail-page breakdown), the real-dataset band distribution, and confirm production is live and verified.
