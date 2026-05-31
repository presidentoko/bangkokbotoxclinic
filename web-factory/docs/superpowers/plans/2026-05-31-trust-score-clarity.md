# Trust Score Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Trust Score a single, consistent, explainable 0–100 composite used on cards, in sorting, and on the detail page, with a tooltip and a `/trust-score` methodology page; and make supplier cards layout-consistent on mobile.

**Architecture:** Extract the detail page's inline 5-part composite into a pure `lib/trustScore.ts` (`computeTrustScore`). Cards, list sorting, and the detail page all call it, replacing the broken 0–18 `b2b_score` display. A native `<details>`-based `TrustScoreInfo` tooltip (no client JS) shows the breakdown and links to a new static `/trust-score` page. `SupplierCard` is restructured so the interactive tooltip is not nested inside the card's anchor, and uses flex/`line-clamp` for uniform mobile height.

**Tech Stack:** Next.js 16 (App Router, `output: "export"`), TypeScript, Tailwind v4, Node test scripts via `npx tsx` (confirmed available: tsx v4.22.3).

---

## Conventions

- **Run commands from** `C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\web-factory` (PowerShell).
- **Tests** are plain Node scripts run with `npx tsx <path>`; they use `node:assert` and exit non-zero on failure.
- **No `shared/components/TrustBadge.tsx` edit needed.** The badge already renders a 0–100 `score`; the bug was the *input*. We change what `SupplierCard` passes, not the badge. (This is a deliberate simplification of the spec, which over-scoped a shared-component edit.)

---

## Task 1: `lib/trustScore.ts` pure composite

**Files:**
- Create: `lib/trustScore.ts`
- Test: `scripts/test_trust_score.mts`

- [ ] **Step 1: Write the failing test**

Create `scripts/test_trust_score.mts`:

```ts
import assert from "node:assert";
import { computeTrustScore, trustTier } from "../lib/trustScore.ts";
import type { Supplier } from "../lib/types.ts";

// Minimal supplier factory — only fields the score reads.
function mk(over: Partial<Supplier>): Supplier {
  return {
    id: "x", place_id: "", name: "", primary_type: "", address: "", city: "", city_label: "",
    district: "", phone: "", website: "", menu_url: "", lat: null, lng: null,
    rating: 0, total_reviews: 0, trust_score: 0, categories: [], raw_categories: [],
    price_level: "", price_symbol: "", scraped_review_count: 0, local_guide_count: 0,
    avg_author_review_count: 0,
    language_breakdown: { th: 0, en: 0, ko: 0, ja: 0, other: 0 },
    cuisine_mentions: {}, mentioned_topics: [],
    rating_trend: { recent: { count: 0, avg: null }, midterm: { count: 0, avg: null }, old: { count: 0, avg: null }, trend: "insufficient_data" },
    sample_reviews_th: [], sample_reviews_en: [], sample_reviews_ko: [],
    business_status: "", maps_url: "",
    ...over,
  } as Supplier;
}

// 1. Empty supplier -> all zero -> overall 0, tier Limited.
const empty = computeTrustScore(mk({}), 2026);
assert.equal(empty.overall, 0, "empty overall");
assert.equal(empty.tier, "Limited", "empty tier");
assert.equal(empty.subs.length, 5, "5 subs");

// 2. Capital sub: 100M THB -> 80.
const capOnly = computeTrustScore(mk({ dbd: { reg_no: "", legal_name: null, capital_thb: 100_000_000, registered_date: null, tsic_code: null, purpose: null, address: null, match_score: 0 } }), 2026);
const capSub = capOnly.subs.find((s) => s.key === "capital")!;
assert.equal(Math.round(capSub.score), 80, "100M capital -> 80");

// 3. Longevity sub: 10 years -> 40.
const lon = computeTrustScore(mk({ years_in_business: 10 }), 2026);
assert.equal(lon.subs.find((s) => s.key === "longevity")!.score, 40, "10y -> 40");

// 4. Longevity from registered_date + currentYear.
const lon2 = computeTrustScore(mk({ dbd: { reg_no: "", legal_name: null, capital_thb: null, registered_date: "2016-01-01", tsic_code: null, purpose: null, address: null, match_score: 0 } }), 2026);
assert.equal(lon2.subs.find((s) => s.key === "longevity")!.score, 40, "2016->2026 = 10y -> 40");

// 5. Reviews sub: 100 reviews, rating 4.5 -> min(100, 2*25 + 45) = 95.
const rev = computeTrustScore(mk({ total_reviews: 100, rating: 4.5 }), 2026);
assert.equal(rev.subs.find((s) => s.key === "reviews")!.score, 95, "reviews 95");

// 6. Verifications: 2 of 4 -> 50.
const ver = computeTrustScore(mk({ verified: true, halal_certified: true }), 2026);
assert.equal(ver.subs.find((s) => s.key === "verifications")!.score, 50, "2/4 -> 50");

// 7. Photos: 4 photos -> 50.
const ph = computeTrustScore(mk({ photos: ["a", "b", "c", "d"] }), 2026);
assert.equal(ph.subs.find((s) => s.key === "photos")!.score, 50, "4 photos -> 50");

// 8. tier thresholds.
assert.equal(trustTier(39).tier, "Limited");
assert.equal(trustTier(40).tier, "Fair");
assert.equal(trustTier(60).tier, "Strong");
assert.equal(trustTier(75).tier, "Excellent");

// 9. overall does NOT depend on b2b_score / trust_score field.
const a = computeTrustScore(mk({ trust_score: 0, b2b_score: 0, rating: 4.5, total_reviews: 100 }), 2026);
const b = computeTrustScore(mk({ trust_score: 18, b2b_score: 18, rating: 4.5, total_reviews: 100 }), 2026);
assert.equal(a.overall, b.overall, "overall independent of b2b_score");

console.log("test_trust_score: OK");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scripts/test_trust_score.mts`
Expected: FAIL — `Cannot find module '../lib/trustScore.ts'`.

- [ ] **Step 3: Create `lib/trustScore.ts`**

```ts
// Single source of truth for the supplier Trust Score (0–100 composite).
// Extracted from app/supplier/[id]/page.tsx so cards, list sorting, and the detail
// page all produce the SAME number. Pure + deterministic (pass currentYear in tests).

import type { Supplier } from "./types";

export type TrustSub = { key: string; label: string; score: number; weight: string };
export type TrustResult = { overall: number; subs: TrustSub[]; tier: string; color: string };

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function trustTier(overall: number): { tier: string; color: string } {
  if (overall >= 75) return { tier: "Excellent", color: "#16a34a" };
  if (overall >= 60) return { tier: "Strong", color: "#059669" };
  if (overall >= 40) return { tier: "Fair", color: "#ca8a04" };
  return { tier: "Limited", color: "#94a3b8" };
}

export function computeTrustScore(
  s: Supplier,
  currentYear: number = new Date().getFullYear(),
): TrustResult {
  const cap = s.dbd?.capital_thb || 0;
  const capital = cap > 0 ? clamp((Math.log10(cap) - 5) * 25) : 0;

  const foundedYear = s.dbd?.registered_date ? parseInt(s.dbd.registered_date.slice(0, 4)) : null;
  const years = s.years_in_business || (foundedYear ? currentYear - foundedYear : 0);
  const longevity = years ? clamp(years * 4) : 0;

  const reviews = clamp(Math.log10(Math.max(1, s.total_reviews || 0)) * 25 + (s.rating || 0) * 10);

  const verifyCount =
    (s.verified ? 1 : 0) +
    (s.halal_certified ? 1 : 0) +
    (s.estate_name ? 1 : 0) +
    (s.dbd?.tsic_code ? 1 : 0);
  const verifications = (verifyCount / 4) * 100;

  const photos = clamp((s.photos?.length || 0) * 12.5);

  const subs: TrustSub[] = [
    { key: "capital", label: "Capital", score: capital, weight: "Registered capital (DBD)" },
    { key: "longevity", label: "Longevity", score: longevity, weight: "Years in business" },
    { key: "reviews", label: "Reviews", score: reviews, weight: "Google review volume × rating" },
    { key: "verifications", label: "Verifications", score: verifications, weight: "DBD / Halal / Estate / TSIC" },
    { key: "photos", label: "Photos", score: photos, weight: "Site-evidence photos" },
  ];

  const overall = Math.round((capital + longevity + reviews + verifications + photos) / 5);
  const { tier, color } = trustTier(overall);
  return { overall, subs, tier, color };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scripts/test_trust_score.mts`
Expected: PASS — `test_trust_score: OK`.

- [ ] **Step 5: Commit**

```bash
git add lib/trustScore.ts scripts/test_trust_score.mts
git commit -m "feat(trust): extract computeTrustScore 0-100 composite"
```

---

## Task 2: Detail page uses `computeTrustScore`

**Files:**
- Modify: `app/supplier/[id]/page.tsx`

- [ ] **Step 1: Import the lib and replace inline sub-score math**

In `app/supplier/[id]/page.tsx`, add to the imports (near line 16 where `OverallScore` is imported):

```ts
import { computeTrustScore } from "@/lib/trustScore";
```

Replace the inline sub-score block (the `capScore`, `longevityScore`, `reviewScore`, `verifyCount`, `verifyScore`, `photoScore` definitions — currently lines ~112–131) with:

```ts
  // 5 trust sub-scores (single source of truth — same as cards + sorting).
  const trust = computeTrustScore(r);
  const subBy = (k: string) => trust.subs.find((s) => s.key === k)!.score;
  const capScore = subBy("capital");
  const longevityScore = subBy("longevity");
  const reviewScore = subBy("reviews");
  const photoScore = subBy("photos");
  const verifyScore = subBy("verifications");
  const verifyCount = Math.round(verifyScore / 25); // 0..4, for the "{n}/4" display
```

The existing `gauges` array and `OverallScore` usage reference these same variable names, so they keep working.

- [ ] **Step 2: Use the composite for the `overall` prop**

Replace the `overall={Math.round((capScore + longevityScore + reviewScore + verifyScore + photoScore) / 5)}` line (~324) with:

```ts
            overall={trust.overall}
```

- [ ] **Step 3: Verify build compiles this route**

Run: `npm run build`
Expected: build SUCCEEDS. The supplier detail "Trust Index" still renders.

- [ ] **Step 4: Commit**

```bash
git add app/supplier/[id]/page.tsx
git commit -m "refactor(supplier): detail Trust Index uses computeTrustScore"
```

---

## Task 3: `TrustScoreInfo` tooltip component

**Files:**
- Create: `components/TrustScoreInfo.tsx`

- [ ] **Step 1: Create the component**

Native `<details>` popover — no client JS, works on mobile tap and keyboard. Must NOT be placed inside an `<a>` (Task 4 handles that).

Create `components/TrustScoreInfo.tsx`:

```tsx
import type { TrustSub } from "@/lib/trustScore";

// Accessible, JS-free Trust Score explainer. Renders an ⓘ that expands a small
// panel with the 5 sub-scores and a link to the methodology page.
export function TrustScoreInfo({ subs }: { subs: TrustSub[] }) {
  return (
    <details className="relative inline-block group/ts">
      <summary
        className="list-none cursor-pointer inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold hover:bg-gray-200 select-none"
        aria-label="How is the Trust Score calculated?"
        title="How is the Trust Score calculated?"
      >
        i
      </summary>
      <div
        className="absolute z-20 left-0 top-6 w-60 p-3 rounded-lg border border-[var(--border)] bg-white shadow-lg text-xs text-[var(--fg)]"
        role="group"
      >
        <div className="font-bold mb-1.5">Trust Score = average of 5 signals</div>
        <ul className="space-y-1">
          {subs.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-2">
              <span className="text-[var(--muted)]">{s.label}</span>
              <span className="tabular-nums font-medium">{Math.round(s.score)}</span>
            </li>
          ))}
        </ul>
        <a href="/trust-score" className="block mt-2 text-emerald-700 font-semibold hover:underline">
          How is this calculated? →
        </a>
      </div>
    </details>
  );
}
```

- [ ] **Step 2: Verify it type-checks via build (after Task 4 uses it).**

No standalone test; covered by the Task 4 build.

- [ ] **Step 3: Commit**

```bash
git add components/TrustScoreInfo.tsx
git commit -m "feat(trust): JS-free TrustScoreInfo tooltip component"
```

---

## Task 4: `SupplierCard` — composite badge, tooltip, mobile layout

**Files:**
- Modify: `components/SupplierCard.tsx`

- [ ] **Step 1: Update imports**

In `components/SupplierCard.tsx`, add after the existing imports (after line 7):

```ts
import { computeTrustScore } from "@/lib/trustScore";
import { TrustScoreInfo } from "./TrustScoreInfo";
```

- [ ] **Step 2: Compute the composite at the top of the component**

Immediately after `const photo = r.hero_image;` (line 13), add:

```ts
  const trust = computeTrustScore(r);
```

- [ ] **Step 3: Make the root card a flex column for equal height**

Change the root wrapper `className` (line 25) from:

```tsx
      className={`group block border border-[var(--border)] rounded-xl bg-white hover:shadow-md hover:border-gray-300 transition relative overflow-hidden ${tierStyles.wrapper}`}
```

to:

```tsx
      className={`group flex flex-col h-full border border-[var(--border)] rounded-xl bg-white hover:shadow-md hover:border-gray-300 transition relative overflow-hidden ${tierStyles.wrapper}`}
```

- [ ] **Step 4: Close the anchor after the name/meta block and move the trust+category row out**

Currently the trust+category row (lines 117–128) sits INSIDE the `<a>` and inside the `p-5 pb-3` div. Replace the block from the name `<h3>` wrapper through the end of the anchor and the trust row so the anchor closes after the meta, and the trust row + tooltip render as a non-link sibling.

Replace this exact region — from `<h3 className="font-semibold text-base ...>` (line 81) down through the closing `</a>` (line 130) — with:

```tsx
              <h3 className="font-semibold text-base group-hover:text-emerald-700 transition flex items-start gap-1.5">
                <span className="line-clamp-2">{r.name}</span>
                {verifiedConf && (
                  <span
                    title={verifiedConf.description}
                    aria-label={verifiedConf.label}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums shrink-0 mt-0.5"
                    style={{ background: verifiedConf.bg, color: verifiedConf.fg }}
                  >
                    {verifiedConf.icon} {verifiedConf.shortLabel}
                  </span>
                )}
              </h3>
              <p className="text-sm text-[var(--muted)] truncate mt-0.5">
                {r.primary_type}
              </p>
              {(r.dbd?.capital_thb || r.years_in_business || r.dbd?.registered_date) && (
                <p className="text-xs text-stone-600 truncate mt-1 flex items-center gap-2 flex-wrap">
                  {r.dbd?.registered_date && <span>📅 Est. {r.dbd.registered_date.slice(0, 4)}</span>}
                  {r.years_in_business ? <span>· {r.years_in_business}y</span> : null}
                  {r.dbd?.capital_thb ? (
                    <span>· 💰 ฿{r.dbd.capital_thb >= 1_000_000 ? `${(r.dbd.capital_thb / 1_000_000).toFixed(1)}M` : `${(r.dbd.capital_thb / 1000).toFixed(0)}K`}</span>
                  ) : null}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-bold whitespace-nowrap">
                ★ {r.rating.toFixed(1)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
                {r.total_reviews.toLocaleString()} reviews
              </div>
            </div>
          </div>
        </div>
      </a>

      {/* Trust + categories — OUTSIDE the anchor so the tooltip <details> is valid */}
      <div className="px-5 pb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <TrustBadge score={trust.overall} size="md" />
          <TrustScoreInfo subs={trust.subs} />
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs justify-end items-center">
          <AIVerifiedBadge r={r} size="sm" />
          {r.categories.slice(0, 3).map((c) => (
            <span key={c} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
              <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
              {CATEGORY_LABELS[c] ?? c}
            </span>
          ))}
        </div>
      </div>
```

> NOTE: This removes the old `<div className="flex items-center justify-between gap-3 mt-3 flex-wrap">…</div>` trust row that was inside the anchor and the now-duplicate `</div>` that closed `p-5 pb-3`. After this edit, confirm the structure is: root → (optional tier ribbon) → `<a>`(photo + `p-5 pb-2` name/meta) → trust/category div → action buttons div.

- [ ] **Step 5: Adjust the inner padding div and pin buttons to the bottom**

Change the name/meta container `<div className="p-5 pb-3">` (line 58) to `<div className="p-5 pb-2">`.

Change the action-buttons container (line 132) from:

```tsx
      <div className="px-5 pb-4 flex gap-2">
```

to:

```tsx
      <div className="px-5 pb-4 flex gap-2 mt-auto">
```

- [ ] **Step 6: Build + visually sanity-check**

Run: `npm run build`
Expected: build SUCCEEDS, no hydration/nesting type errors. Cards now show a 0–100 Trust Score with a proper tier color, an ⓘ tooltip, and equal-height layout.

- [ ] **Step 7: Commit**

```bash
git add components/SupplierCard.tsx
git commit -m "feat(card): composite Trust Score + tooltip + uniform mobile layout"
```

---

## Task 5: `/trust-score` methodology page

**Files:**
- Create: `app/trust-score/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/trust-score/page.tsx`:

```tsx
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How the Trust Score Works — Methodology",
  description:
    "Our supplier Trust Score is a 0–100 composite of five signals: registered capital, years in business, Google review strength, active verifications, and site-evidence photos. Here's the exact formula.",
  alternates: { canonical: "/trust-score" },
};

const SIGNALS = [
  {
    label: "Registered Capital",
    weight: "1/5",
    detail: "Registered capital from Thailand's DBD, log-scaled: ฿100K scores 0, ฿100M scores 80, ฿1B+ scores 100. Higher registered capital signals a more substantial operation.",
  },
  {
    label: "Years in Business",
    weight: "1/5",
    detail: "Company age from the DBD registration date (4 points per year, capped at 100 = 25+ years). Longevity is a strong proxy for reliability.",
  },
  {
    label: "Google Review Strength",
    weight: "1/5",
    detail: "Review volume (log-scaled) combined with average star rating, from public Google Maps listings. Many consistent reviews score highest.",
  },
  {
    label: "Active Verifications",
    weight: "1/5",
    detail: "How many of four credentials are present: DBD registration, Halal certification, industrial-estate membership, and an official TSIC industry code. 4 of 4 scores 100.",
  },
  {
    label: "Site-Evidence Photos",
    weight: "1/5",
    detail: "Number of facility/product photos available (12.5 points each, capped at 100 = 8+ photos). More visual evidence of a real operation scores higher.",
  },
];

export default function TrustScorePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Trust Score</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">How the Trust Score works</h1>
      <p className="text-[var(--muted)] leading-relaxed mb-8">
        Every supplier gets a <strong>Trust Score from 0 to 100</strong> — the average of five
        independent signals. It is computed automatically from public data (Google Maps and
        Thailand&apos;s Department of Business Development). It is not a paid rating and cannot be
        bought. Tiers: <strong>Excellent</strong> 75+, <strong>Strong</strong> 60+,
        {" "}<strong>Fair</strong> 40+, <strong>Limited</strong> below 40.
      </p>

      <div className="space-y-4">
        {SIGNALS.map((s) => (
          <section key={s.label} className="bg-white border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-lg">{s.label}</h2>
              <span className="text-xs font-semibold text-[var(--muted)] tabular-nums">weight {s.weight}</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{s.detail}</p>
          </section>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] mt-8 leading-relaxed">
        The Trust Score is informational and based on public data; always perform your own due
        diligence (sample orders, factory audits, contracts) before committing to a supplier.
      </p>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Trust Score", url: "/trust-score" },
      ]} />
    </div>
  );
}
```

- [ ] **Step 2: Verify `BreadcrumbJsonLd` import path**

Run: `npx tsx -e "import('./components/JsonLd.tsx').then(m => console.log('BreadcrumbJsonLd' in m ? 'ok' : 'MISSING'))"`
Expected: prints `ok`. (It is already used by `app/d/[district]/page.tsx`.)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build SUCCEEDS; `out/trust-score/index.html` (or `out/trust-score.html`) is emitted.

- [ ] **Step 4: Commit**

```bash
git add app/trust-score/page.tsx
git commit -m "feat(trust): /trust-score methodology page"
```

---

## Task 6: Unify list sorting + city avg on the composite

**Files:**
- Modify: `lib/sponsored.ts:37-51`
- Modify: `lib/data.ts:47-49` (`topByTrust`)
- Modify: `app/city/[name]/page.tsx:121-124` (`avgTrust`)

- [ ] **Step 1: `sortWithSponsored` tiebreaker uses the composite (memoized)**

In `lib/sponsored.ts`, add imports at the top (after line 7's type or near the top):

```ts
import type { Supplier } from "./types";
import { computeTrustScore } from "./trustScore";
```

Replace the whole `sortWithSponsored` function (lines 37–51) with:

```ts
// 페이지 상단 노출 정렬: editors_pick → recommended → featured → Trust Score(composite) 내림차순.
export function sortWithSponsored(items: Supplier[]): Supplier[] {
  const overall = new Map<string, number>();
  for (const t of items) overall.set(t.id, computeTrustScore(t).overall);
  const slot = (t: Supplier) => {
    const tier = sponsoredTier(t.id);
    if (tier === "editors_pick") return 1_000_000;
    if (tier === "recommended") return 500_000;
    if (tier === "featured") return 100_000;
    return 0;
  };
  return [...items].sort((a, b) => {
    const sa = slot(a);
    const sb = slot(b);
    if (sa !== sb) return sb - sa;
    return (overall.get(b.id) ?? 0) - (overall.get(a.id) ?? 0);
  });
}
```

- [ ] **Step 2: `topByTrust` uses the composite**

In `lib/data.ts`, add the import near the top (after the `./districts` import added by the district work, or after the type import on a fresh branch — place it after `import type { MasterDb, Supplier } from "./types";`):

```ts
import { computeTrustScore } from "./trustScore";
```

Replace `topByTrust` (lines 47–49) with:

```ts
export function topByTrust(suppliers: Supplier[], n: number): Supplier[] {
  return [...suppliers]
    .sort((a, b) => computeTrustScore(b).overall - computeTrustScore(a).overall)
    .slice(0, n);
}
```

- [ ] **Step 3: City page `avgTrust` uses the composite**

In `app/city/[name]/page.tsx`, add the import after line 6:

```ts
import { computeTrustScore } from "@/lib/trustScore";
```

Replace the `avgTrust` block (lines 121–124) with:

```ts
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + computeTrustScore(c).overall, 0) / filtered.length)
      : 0;
```

- [ ] **Step 4: Catch any remaining raw `trust_score` displays**

Run: `npx tsx -e "0" ; ` then search:

Run: `Select-String -Path app\**\*.tsx,components\**\*.tsx -Pattern "trust_score|b2b_score" `
Expected: review each hit. Acceptable remaining uses: `lib/types.ts` (field defs), `app/sitemap.ts` (priority calc may use `b2b_score` — leave, it only affects sitemap priority, not user-facing). Any **user-facing numeric display** of `trust_score`/`b2b_score` outside sorting must be switched to `computeTrustScore(...).overall`. If none found beyond sitemap/types, proceed.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build SUCCEEDS. Listing order now matches displayed Trust Scores.

- [ ] **Step 6: Commit**

```bash
git add lib/sponsored.ts lib/data.ts app/city/[name]/page.tsx
git commit -m "feat(trust): sort + city avg use composite Trust Score"
```

---

## Task 7: Footer link + sitemap entry

**Files:**
- Modify: `app/layout.tsx` (footer "Site" column)
- Modify: `app/sitemap.ts` (static items list)

- [ ] **Step 1: Add `/trust-score` to the footer "Site" column**

In `app/layout.tsx`, in the "Site" `<ul>`, add after the `For Suppliers` `<li>` (the line `<li><a href="/for-suppliers" ...>For Suppliers</a></li>`):

```tsx
                  <li><a href="/trust-score" className="hover:text-black">Trust Score Methodology</a></li>
```

- [ ] **Step 2: Add `/trust-score` to the sitemap**

In `app/sitemap.ts`, in the initial `items` array, add after the `/about` entry:

```ts
    { url: `${SITE}/trust-score`, lastModified: updated, changeFrequency: "monthly", priority: 0.55 },
```

- [ ] **Step 3: Build + footer validation**

Run: `npm run build` then `node scripts/check_footer_links.mjs`

> NOTE: `scripts/check_footer_links.mjs` is created by the district-SEO branch. If working on a fresh branch without it, instead verify manually: `Test-Path out/trust-score/index.html` returns True.

Expected: build SUCCEEDS; `/trust-score` route exists; footer check (if present) reports OK including the new link.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/sitemap.ts
git commit -m "feat(trust): footer link + sitemap entry for /trust-score"
```

---

## Task 8: Final verification

**Files:** none

- [ ] **Step 1: Unit test**

Run: `npx tsx scripts/test_trust_score.mts`
Expected: `test_trust_score: OK`.

- [ ] **Step 2: Clean build**

Run: `npm run build`
Expected: build SUCCEEDS (static export, ~490+ pages incl. `/trust-score`).

- [ ] **Step 3: Spot-check consistency**

Run: `npx tsx -e "import('./lib/data.ts').then(async m=>{const d=await m.loadMasterDb();const t=await import('./lib/trustScore.ts');const s=d.suppliers.slice(0,3);for(const x of s)console.log(x.name.slice(0,24), 'overall', t.computeTrustScore(x).overall, 'tier', t.computeTrustScore(x).tier);})"`
Expected: prints 0–100 overalls with sensible tiers (NOT all "Limited"/single-digit). Confirms the card/detail/sort now share a real 0–100 score.

- [ ] **Step 4: Report**

Report the sample overalls and confirm cards no longer display the broken 0–18 value.

---

## Self-Review Notes (author)

- **Spec coverage:** lib/trustScore (T1), detail page uses it (T2), tooltip (T3), card badge+tooltip+mobile (T4), /trust-score page (T5), sort+avg unification — spec §5 (T6), footer+sitemap (T7), tests (T1, T8). The spec's `shared/components/TrustBadge.tsx` edit is intentionally dropped (badge already takes 0–100; only the input was wrong) — noted in Conventions.
- **Type consistency:** `computeTrustScore(s, currentYear?) → { overall, subs: TrustSub[], tier, color }`, `TrustSub = { key,label,score,weight }`, `trustTier(n) → {tier,color}` used identically in T1–T6. `TrustScoreInfo({subs})` matches `trust.subs`.
- **Known risks:** (a) SupplierCard restructure (T4) moves the trust row OUT of the anchor to keep `<details>` valid — verify the JSX braces balance after the edit (the build will catch nesting/TS errors). (b) `verifyCount = round(verifyScore/25)` reconstructs the 0..4 count for the "{n}/4" gauge display; exact because verifyScore ∈ {0,25,50,75,100}. (c) On a branch without the district-SEO work, `scripts/check_footer_links.mjs` may be absent — T7 Step 3 gives a manual fallback.
```
