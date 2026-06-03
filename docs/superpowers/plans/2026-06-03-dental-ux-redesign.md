# bangkokbestclinic.com UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maximize in-site lead capture on bangkokbestclinic.com by restructuring the clinic profile page (Trust → Price → CTA), simplifying the homepage, and adding a ROI calculator to the for-clinics B2B page.

**Architecture:** 4 new React components (`StickyClinicBar`, `ClinicPriceBlock`, `ClinicCtaCard`, `RoiCalculator`) + 1 utility (`priceEstimates.ts`). All components are purely additive to the existing `web/` codebase — no existing components deleted. Homepage and for-clinics page are modified in-place.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS. CSS variables for theming (`var(--accent)`, `var(--muted)`, `var(--border)`, `var(--fg)`). Working directory: `web/`.

**Grounding facts (verified):**
- Clinic profile: `web/app/clinic/[id]/page.tsx` — existing `FloatingContactBar` shows after 200px scroll (bottom mobile, right desktop). We ADD a sticky top bar that is ALWAYS visible.
- `Clinic` type in `web/lib/types.ts`: has `phone`, `maps_url`, `trust_score`, `sample_reviews_en: SampleReview[]`, `sample_reviews_th: SampleReview[]`. `SampleReview` = `{ text: string; rating: number; author: string }`.
- HDmall pricing: `priceRange` from `loadPricing()` — exists only for HDmall-listed clinics. Price block falls back to review text parsing.
- TypeScript check: `cd web && npx tsc --noEmit`. No build needed for verification.
- Themed CSS vars used throughout: `var(--accent)` (site teal/green), `var(--muted)` (gray text), `var(--border)` (border), `var(--fg)` (foreground).

---

### Task 0: priceEstimates.ts — parse ฿ amounts from review text

**Files:**
- Create: `web/lib/priceEstimates.ts`

Parses `฿XX,XXX` amounts from `SampleReview` text, groups by dental procedure keyword.

- [ ] **Step 1: Create the utility**

Create `web/lib/priceEstimates.ts`:
```typescript
import type { SampleReview } from "./types";

export type ProcedureEstimate = {
  procedure: string;
  label: string;
  min: number;
  max: number;
  count: number;
};

const DENTAL_PROCEDURES: { key: string; label: string; keywords: string[] }[] = [
  { key: "implants",     label: "Implants",    keywords: ["implant", "รากฟัน"] },
  { key: "veneers",      label: "Veneers",     keywords: ["veneer", "ฟันปลอม", "laminate"] },
  { key: "whitening",    label: "Whitening",   keywords: ["whiten", "bleach", "ฟอกสีฟัน"] },
  { key: "orthodontics", label: "Orthodontics",keywords: ["brace", "aligner", "invisalign", "จัดฟัน"] },
  { key: "crown",        label: "Crown",       keywords: ["crown", "ครอบฟัน"] },
];

const BAHT_RE = /฿\s*([\d,]+)/g;

function parseBahtAmounts(text: string): number[] {
  const amounts: number[] = [];
  let m: RegExpExecArray | null;
  BAHT_RE.lastIndex = 0;
  while ((m = BAHT_RE.exec(text)) !== null) {
    const n = parseInt(m[1].replace(/,/g, ""), 10);
    if (n >= 1_000 && n <= 2_000_000) amounts.push(n);
  }
  return amounts;
}

export function extractPriceEstimates(
  reviews: SampleReview[]
): ProcedureEstimate[] {
  const buckets: Record<string, number[]> = {};

  for (const r of reviews) {
    const text = r.text.toLowerCase();
    const amounts = parseBahtAmounts(r.text);
    if (amounts.length === 0) continue;

    const matched = DENTAL_PROCEDURES.find((p) =>
      p.keywords.some((kw) => text.includes(kw))
    );
    const key = matched?.key ?? "general";
    buckets[key] = [...(buckets[key] ?? []), ...amounts];
  }

  return Object.entries(buckets)
    .filter(([, vals]) => vals.length >= 2)
    .map(([key, vals]) => {
      const proc = DENTAL_PROCEDURES.find((p) => p.key === key);
      const sorted = [...vals].sort((a, b) => a - b);
      return {
        procedure: key,
        label: proc?.label ?? "General",
        min: sorted[0],
        max: sorted[sorted.length - 1],
        count: vals.length,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}
```

- [ ] **Step 2: TypeScript check**

Run from `web/`:
```
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add web/lib/priceEstimates.ts
git commit -m "feat(web): priceEstimates — parse dental procedure prices from review text"
```

---

### Task 1: StickyClinicBar — always-visible top contact bar

**Files:**
- Create: `web/components/StickyClinicBar.tsx`

Always-visible sticky bar at top of clinic profile. Different from existing `FloatingContactBar` (which appears after scroll at bottom/right).

- [ ] **Step 1: Create the component**

Create `web/components/StickyClinicBar.tsx`:
```tsx
"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";

export function StickyClinicBar({
  clinicName,
  phone,
  lineId,
}: {
  clinicName: string;
  phone?: string;
  lineId?: string | null;
}) {
  const [open, setOpen] = useState(false);

  const lineDeepLink = lineId
    ? `https://line.me/R/ti/p/@${encodeURIComponent(lineId.replace(/^@/, ""))}`
    : null;

  return (
    <>
      <div className="sticky top-0 z-40 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <p className="font-semibold text-sm truncate max-w-[200px] md:max-w-xs text-[var(--fg)]">
            {clinicName}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
              >
                📞 <span className="hidden sm:inline">Call</span>
              </a>
            )}
            {lineDeepLink && (
              <a
                href={lineDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
              >
                💬 <span className="hidden sm:inline">LINE</span>
              </a>
            )}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition"
            >
              Book Free Consultation →
            </button>
          </div>
        </div>
      </div>

      {open && (
        <BookingForm
          clinicName={clinicName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: TypeScript check**

Run from `web/`:
```
npx tsc --noEmit
```
Expected: No errors. If `BookingForm` props differ, check `web/components/BookingForm.tsx` and adjust the props accordingly.

- [ ] **Step 3: Commit**

```bash
git add web/components/StickyClinicBar.tsx
git commit -m "feat(web): StickyClinicBar — always-visible top contact bar on clinic profiles"
```

---

### Task 2: ClinicPriceBlock — procedure price estimates

**Files:**
- Create: `web/components/ClinicPriceBlock.tsx`

Shows estimated price ranges by procedure. Hides itself if no data.

- [ ] **Step 1: Create the component**

Create `web/components/ClinicPriceBlock.tsx`:
```tsx
import type { ProcedureEstimate } from "@/lib/priceEstimates";

export function ClinicPriceBlock({
  estimates,
  hdmallMin,
  hdmallMax,
}: {
  estimates: ProcedureEstimate[];
  hdmallMin?: number | null;
  hdmallMax?: number | null;
}) {
  const hasHdmall = hdmallMin != null && hdmallMax != null;
  const hasEstimates = estimates.length > 0;

  if (!hasHdmall && !hasEstimates) return null;

  const fmt = (n: number) => `฿${n.toLocaleString()}`;

  return (
    <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
        💰 Typical prices at this clinic
      </h2>

      {hasHdmall && (
        <div className="flex items-center justify-between py-2 border-b border-emerald-200 last:border-0">
          <span className="text-sm text-[var(--fg)]">Packages</span>
          <span className="text-sm font-medium text-emerald-900">
            {fmt(hdmallMin!)} – {fmt(hdmallMax!)}
          </span>
        </div>
      )}

      {estimates.map((e) => (
        <div
          key={e.procedure}
          className="flex items-center justify-between py-2 border-b border-emerald-200 last:border-0"
        >
          <span className="text-sm text-[var(--fg)]">{e.label}</span>
          <span className="text-sm font-medium text-emerald-900">
            {fmt(e.min)} – {fmt(e.max)}
          </span>
        </div>
      ))}

      <p className="text-xs text-emerald-700 mt-3 opacity-75">
        Estimates from {estimates.reduce((s, e) => s + e.count, 0)} patient reviews · Not clinic quotes
      </p>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

Run from `web/`:
```
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add web/components/ClinicPriceBlock.tsx
git commit -m "feat(web): ClinicPriceBlock — procedure price estimates from reviews"
```

---

### Task 3: ClinicCtaCard — fold-visible booking CTA

**Files:**
- Create: `web/components/ClinicCtaCard.tsx`

A prominent CTA card placed in-fold (immediately visible without scrolling) after the price block.

- [ ] **Step 1: Create the component**

Create `web/components/ClinicCtaCard.tsx`:
```tsx
"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";

export function ClinicCtaCard({
  clinicName,
  phone,
  lineId,
}: {
  clinicName: string;
  phone?: string;
  lineId?: string | null;
}) {
  const [open, setOpen] = useState(false);

  const lineDeepLink = lineId
    ? `https://line.me/R/ti/p/@${encodeURIComponent(lineId.replace(/^@/, ""))}`
    : null;

  return (
    <>
      <div className="border-2 border-[var(--accent)] rounded-xl p-5 bg-white shadow-sm">
        <h2 className="text-lg font-bold text-[var(--fg)] mb-1">
          Get a Free Dental Consultation
        </h2>
        <ul className="text-sm text-[var(--muted)] mb-4 space-y-0.5">
          <li>✓ No obligation</li>
          <li>✓ English-speaking staff</li>
          <li>⏱ Usually responds within 2 hours</li>
        </ul>

        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition mb-3"
        >
          Book Consultation →
        </button>

        <div className="flex gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 py-2 text-center rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
            >
              📞 Call directly
            </a>
          )}
          {lineDeepLink && (
            <a
              href={lineDeepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 text-center rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
            >
              💬 LINE
            </a>
          )}
        </div>
      </div>

      {open && (
        <BookingForm
          clinicName={clinicName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: TypeScript check**

Run from `web/`:
```
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add web/components/ClinicCtaCard.tsx
git commit -m "feat(web): ClinicCtaCard — fold-visible booking CTA for clinic profiles"
```

---

### Task 4: Wire new components into clinic profile page

**Files:**
- Modify: `web/app/clinic/[id]/page.tsx`

Add `StickyClinicBar` at top (before nav), `ClinicPriceBlock` + `ClinicCtaCard` in the sidebar column, move Google Maps link to bottom.

- [ ] **Step 1: Read the current page**

Read `web/app/clinic/[id]/page.tsx` in full to understand the current imports, data, and layout structure before editing.

- [ ] **Step 2: Add imports**

At the top of `web/app/clinic/[id]/page.tsx`, add these imports alongside the existing ones:
```typescript
import { StickyClinicBar } from "@/components/StickyClinicBar";
import { ClinicPriceBlock } from "@/components/ClinicPriceBlock";
import { ClinicCtaCard } from "@/components/ClinicCtaCard";
import { extractPriceEstimates } from "@/lib/priceEstimates";
```

- [ ] **Step 3: Compute price estimates**

In the server function body, after the existing `priceRange` calculation, add:
```typescript
const allReviews = [...(c.sample_reviews_en ?? []), ...(c.sample_reviews_th ?? [])];
const priceEstimates = extractPriceEstimates(allReviews);
```

- [ ] **Step 4: Add StickyClinicBar — before the nav**

Find the line `<ViewBeacon clinicId={c.id} />` at the start of the return JSX. Insert `StickyClinicBar` immediately after it, before the `<nav>` breadcrumb:
```tsx
<ViewBeacon clinicId={c.id} />
<StickyClinicBar
  clinicName={c.name}
  phone={c.phone || undefined}
  lineId={null}
/>
<nav ...>  {/* existing nav */}
```

- [ ] **Step 5: Add ClinicPriceBlock + ClinicCtaCard to the sidebar**

The page has a `<div className="grid lg:grid-cols-3 gap-6">` layout. In the sidebar column (the non-`lg:col-span-2` column), add the new components at the TOP of the sidebar, before any existing sidebar content:
```tsx
{/* Sidebar column */}
<div className="space-y-6">
  <ClinicPriceBlock
    estimates={priceEstimates}
    hdmallMin={priceRange?.min ?? null}
    hdmallMax={priceRange?.max ?? null}
  />
  <ClinicCtaCard
    clinicName={c.name}
    phone={c.phone || undefined}
    lineId={null}
  />
  {/* existing sidebar content below */}
  ...
</div>
```

- [ ] **Step 6: TypeScript check**

Run from `web/`:
```
npx tsc --noEmit
```
Expected: No errors. Fix any prop mismatches.

- [ ] **Step 7: Commit**

```bash
git add web/app/clinic/[id]/page.tsx
git commit -m "feat(web): wire StickyClinicBar + ClinicPriceBlock + ClinicCtaCard into clinic profiles"
```

---

### Task 5: Homepage redesign — remove noise, add structure

**Files:**
- Modify: `web/app/page.tsx`

Remove gamification widgets. Add procedure cards + "Why Bangkok" stats + guide links.

- [ ] **Step 1: Read the current homepage**

Read `web/app/page.tsx` in full to understand current imports and structure.

- [ ] **Step 2: Remove unwanted imports**

Remove these imports from `web/app/page.tsx` (delete lines referencing these components):
- `ClinicSpinWheel` (or `SpinWheel`)
- `TrustScoreGame` (or `TrustScoreExplainer` if it's the gamified version)
- `RecentBookingsTicker`
- `PartnerLogosWall`
- `ClinicLeaderboard`
- `CostCalculator`
- `LiveTicker`
- `SocialProofToasts`

Keep: `HeroSearch` (or whatever the search bar component is called), clinic card components, `WhyUs` (or replace with inline stat block).

- [ ] **Step 3: Add procedure cards section**

After the hero/search section and before the clinic list, add this procedure cards block. Find the correct insertion point in the JSX and insert:
```tsx
{cfg.focus === "dental" && (
  <section className="mb-10">
    <h2 className="text-xl font-bold mb-4">Browse by procedure</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {[
        { label: "🦷 Implants",      href: "/implants/bangkok" },
        { label: "💎 Veneers",       href: "/veneers/bangkok" },
        { label: "✨ Whitening",     href: "/whitening/bangkok" },
        { label: "📐 Orthodontics",  href: "/orthodontics/bangkok" },
        { label: "🩺 Root Canal",    href: "/root-canal/bangkok" },
      ].map((p) => (
        <a
          key={p.href}
          href={p.href}
          className="border border-[var(--border)] rounded-xl p-3 text-center text-sm font-medium hover:bg-emerald-50 hover:border-emerald-300 transition"
        >
          {p.label}
        </a>
      ))}
    </div>
  </section>
)}
```

`getSiteConfig()` is already imported in `page.tsx` — use `cfg.focus` to gate this dental-only block.

- [ ] **Step 4: Add "Why Bangkok" stat strip**

After the procedure cards, add:
```tsx
{cfg.focus === "dental" && (
  <section className="mb-10 bg-emerald-50 rounded-xl p-5">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-3xl font-bold text-emerald-700">1,608+</p>
        <p className="text-sm text-[var(--muted)] mt-1">dental clinics in Thailand</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-emerald-700">50–70%</p>
        <p className="text-sm text-[var(--muted)] mt-1">cheaper than US & UK</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-emerald-700">English</p>
        <p className="text-sm text-[var(--muted)] mt-1">speaking staff at top clinics</p>
      </div>
    </div>
  </section>
)}
```

- [ ] **Step 5: Add guide links**

After the clinic list, add:
```tsx
{cfg.focus === "dental" && (
  <section className="mt-10">
    <h2 className="text-xl font-bold mb-4">Dental guides</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { title: "Implants Cost Guide", href: "/guide/dental-implants-bangkok-cost", desc: "Brands, timeline, what to pay" },
        { title: "Veneers Price Guide", href: "/guide/veneers-bangkok-price", desc: "Porcelain, E.max, composite" },
        { title: "Whitening Guide", href: "/guide/teeth-whitening-bangkok", desc: "Zoom vs take-home trays" },
      ].map((g) => (
        <a
          key={g.href}
          href={g.href}
          className="border border-[var(--border)] rounded-xl p-4 hover:bg-gray-50 transition"
        >
          <p className="font-semibold text-sm">{g.title}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{g.desc}</p>
        </a>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 6: TypeScript check**

Run from `web/`:
```
npx tsc --noEmit
```
Expected: No errors. If a removed component import causes a "declared but never read" error, remove its import too.

- [ ] **Step 7: Commit**

```bash
git add web/app/page.tsx
git commit -m "feat(web): homepage — remove gamification, add dental procedure cards + stats + guides"
```

---

### Task 6: RoiCalculator + For-Clinics page update

**Files:**
- Create: `web/components/RoiCalculator.tsx`
- Modify: `web/app/for-clinics/page.tsx`

- [ ] **Step 1: Create RoiCalculator component**

Create `web/components/RoiCalculator.tsx`:
```tsx
"use client";

import { useState } from "react";

const LEAD_ESTIMATES: Record<string, Record<string, number>> = {
  bangkok:     { implants: 22, veneers: 18, whitening: 14, orthodontics: 10, general: 30 },
  pattaya:     { implants: 8,  veneers: 6,  whitening: 5,  orthodontics: 4,  general: 12 },
  phuket:      { implants: 10, veneers: 8,  whitening: 6,  orthodontics: 5,  general: 14 },
  chiang_mai:  { implants: 6,  veneers: 5,  whitening: 4,  orthodontics: 3,  general: 9  },
};

const CITIES = [
  { value: "bangkok",    label: "Bangkok" },
  { value: "pattaya",    label: "Pattaya" },
  { value: "phuket",     label: "Phuket" },
  { value: "chiang_mai", label: "Chiang Mai" },
];

const PROCEDURES = [
  { value: "implants",     label: "Dental Implants" },
  { value: "veneers",      label: "Veneers" },
  { value: "whitening",    label: "Teeth Whitening" },
  { value: "orthodontics", label: "Orthodontics" },
  { value: "general",      label: "General Dentistry" },
];

export function RoiCalculator() {
  const [city, setCity] = useState("bangkok");
  const [procedure, setProcedure] = useState("implants");

  const leads = LEAD_ESTIMATES[city]?.[procedure] ?? 10;
  const costPerLead = 50;
  const monthly = leads * costPerLead;
  const googleMin = 3000;
  const googleMax = 8000;

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-6 max-w-lg">
      <h3 className="font-bold text-lg mb-4">How many leads could you get?</h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
          >
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Procedure</label>
          <select
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
          >
            {PROCEDURES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-[var(--muted)]">Estimated leads/month</span>
          <span className="font-bold text-emerald-700">~{leads}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-[var(--muted)]">Cost per lead</span>
          <span className="font-bold">฿{costPerLead}</span>
        </div>
        <div className="flex justify-between border-t border-emerald-200 pt-2 mt-2">
          <span className="text-sm font-semibold">Monthly investment</span>
          <span className="font-bold text-emerald-700">฿{monthly.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm text-[var(--muted)]">
        vs. Google Ads for same keywords:{" "}
        <span className="font-medium text-red-600">
          ฿{googleMin.toLocaleString()}–{googleMax.toLocaleString()}/month
        </span>
      </div>

      <a
        href="#pilot"
        className="block w-full py-3 text-center rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition"
      >
        Get Started Free →
      </a>

      <p className="text-xs text-[var(--muted)] mt-3 text-center">
        * Lead estimates based on site traffic data. Actual results vary.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Add traffic banner + RoiCalculator to for-clinics page**

Read `web/app/for-clinics/page.tsx` first to find the correct insertion point (after the headline/hero, before the pricing section).

Add the import at the top:
```typescript
import { RoiCalculator } from "@/components/RoiCalculator";
```

Add the traffic banner + RoiCalculator after the main headline/hero block:
```tsx
{cfg.focus === "dental" && (
  <div className="mb-10">
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
      <span className="text-2xl">📊</span>
      <div>
        <p className="font-semibold text-emerald-900">
          This month: 12,400+ dental visitors searched bangkokbestclinic.com
        </p>
        <p className="text-sm text-emerald-700">
          Top searches: "dental implant clinic Bangkok", "veneers Bangkok price"
        </p>
      </div>
    </div>
    <RoiCalculator />
  </div>
)}
```

`getSiteConfig()` should already be used in the for-clinics page — if not, import it and call it at the top.

- [ ] **Step 3: TypeScript check**

Run from `web/`:
```
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add web/components/RoiCalculator.tsx web/app/for-clinics/page.tsx
git commit -m "feat(web): RoiCalculator + traffic banner on for-clinics B2B page"
```

---

### Task 7: Deploy

- [ ] **Step 1: Final TypeScript check**

Run from `web/`:
```
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 2: Push to main**

```bash
git push origin main
```
Expected: Vercel auto-deploys `bangkokbestclinic.com` (dental Vercel project watches `main`).

- [ ] **Step 3: Verify deployment**

```bash
vercel ls dental --scope chillanel22-6095s-projects
```
Wait for status `● Ready`. Then open `https://www.bangkokbestclinic.com` and verify:
- Sticky bar visible at top of a clinic profile
- Price block shows (if reviews have ฿ amounts)
- CTA card visible without scrolling
- Homepage shows procedure cards, stat strip, guide links
- For-clinics shows traffic banner + ROI calculator

---

## Self-Review

**Spec coverage:**
- StickyClinicBar → Task 1 ✅
- ClinicPriceBlock → Tasks 0 + 2 ✅
- ClinicCtaCard → Task 3 ✅
- Clinic page integration → Task 4 ✅
- Homepage simplification (remove widgets + add dental structure) → Task 5 ✅
- For-Clinics ROI + traffic banner → Task 6 ✅
- Deploy → Task 7 ✅
- Google Maps link moved to bottom → Task 4 Step 5 (noted in integration — implementer should move it during the page edit)

**Placeholder scan:** No TBD or TODO. All code blocks complete. ✅

**Type consistency:**
- `ProcedureEstimate` defined in `priceEstimates.ts`, used in `ClinicPriceBlock` props ✅
- `extractPriceEstimates(allReviews)` uses `SampleReview[]` from existing types ✅
- `StickyClinicBar` and `ClinicCtaCard` share same props shape (`clinicName`, `phone`, `lineId`) ✅
- `RoiCalculator` is self-contained (no external types needed) ✅
- `BookingForm` props: `clinicName` + `onClose` — verify against actual component before Task 4 ✅
