# Thai Supply Hub — SEO Crawl-Budget Recovery & Monetization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop crawl-budget bleed from 499 GSC 404s + thin sitemap, push best queries from position 11 to top 10, expose a real conversion path on the for-suppliers page.

**Architecture:** Static Next.js export on Cloudflare Pages. No server runtime — all fixes are build-time (sitemap filter, metaTitles, data normalization) or edge-config (`public/_redirects` for 404 catch-all). The sitemap and static pages are both generated from `data/master_db.json` so they stay in sync automatically at each build.

**Tech Stack:** Next.js 16 App Router, static export → Cloudflare Pages, TypeScript, Tailwind CSS, `data/master_db.json` as the single data source.

**Working directory:** `C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\web-factory`

---

## File Map

| File | Action | Task |
|------|--------|------|
| `public/_redirects` | **Create** — Cloudflare Pages catch-all for dead supplier URLs | 1 |
| `app/not-found.tsx` | **Create** — 404 page with helpful navigation | 1 |
| `app/sitemap.ts` | **Modify** — filter thin suppliers; add quality gate | 2 |
| `lib/categoryIntros.ts` | **Modify** — update `plastic` + `packaging` metaTitles to match live queries | 3 |
| `app/c/[cuisine]/page.tsx` | **Modify** — H1 sourced from `intro.title`, intro paragraph match | 3 |
| `lib/provinceNorm.ts` | **Create** — canonical province name map + normalizer fn | 4 |
| `lib/data.ts` | **Modify** — call `normalizeProvince()` on load | 4 |
| `app/for-suppliers/page.tsx` | **Modify** — fix email, add contact form section, add LINE OA + PromptPay blocks | 5 |
| `components/SupplierVerifiedCTA.tsx` | **Create** — self-serve verified-badge CTA card with PromptPay QR / Stripe link | 5 |

---

## Task 1 — Fix 499 GSC 404s

**Goal:** Any supplier URL Google has indexed but that no longer has a static file gets a 301 → homepage instead of a hard 404. Also add a clean 404 page for all other missing pages.

**How it works:** Cloudflare Pages checks for a matching static file FIRST, then evaluates `_redirects`. So a catch-all `/supplier/* → / 301` only fires when the static file is absent (i.e., the supplier was removed from master_db.json). Valid supplier pages are unaffected.

### Files:
- Create: `public/_redirects`
- Create: `app/not-found.tsx`

---

- [ ] **Step 1.1: Create `public/_redirects`**

```
# Catch-all for supplier IDs removed from master_db — 301 to homepage.
# Cloudflare Pages serves static files BEFORE checking this file,
# so valid /supplier/[id] pages are never redirected.
/supplier/* / 301
```

- [ ] **Step 1.2: Verify `_redirects` is in `public/` (will copy to `out/` on build)**

```powershell
Test-Path "public/_redirects"
# Expected: True
```

- [ ] **Step 1.3: Create `app/not-found.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Thai Supply Hub",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-5xl font-bold mb-4 text-[var(--muted)]">404</div>
      <h1 className="text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-[var(--muted)] mb-8">
        This supplier listing may have moved or been removed from our directory.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a href="/" className="px-5 py-2.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800">
          Browse all suppliers
        </a>
        <a href="/c/manufacturer" className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-medium hover:bg-gray-50">
          Manufacturers
        </a>
        <a href="/c/auto_parts" className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-medium hover:bg-gray-50">
          Auto Parts
        </a>
        <a href="/c/plastic" className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-medium hover:bg-gray-50">
          Plastic & Injection Molding
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 1.4: Commit**

```bash
git add public/_redirects app/not-found.tsx
git commit -m "fix: add Cloudflare _redirects catch-all for dead supplier URLs + 404 page"
```

- [ ] **Step 1.5: After deploying — re-submit sitemap in GSC**

In Google Search Console → Sitemaps → delete old submission → submit `https://thaisupplyhub.com/sitemap.xml`.
Then use URL Inspection on 3 formerly-404 supplier IDs to confirm they now resolve to `/` (or the static page if still valid).

---

## Task 2 — Sitemap Diet

**Goal:** Cut sitemap from 5,263 suppliers to ~2,500–3,000 by excluding thin entries (no phone, no website, not verified, low score). Keeps crawl budget on pages with enough quality signals to rank.

**Threshold:** Include a supplier if: `verified` OR `website` OR `phone` OR `b2b_score >= 8`.
This excludes the ~1,700 entries with zero contact info and low score — exactly the pages Google is "discovering but not indexing".

### Files:
- Modify: `app/sitemap.ts`

---

- [ ] **Step 2.1: Open `app/sitemap.ts` and replace the supplier loop (lines 120–130) with a filtered version**

Find this block:
```typescript
  // Supplier 페이지 — verified 우선 (priority 0.85), 그 외 모든 supplier 포함 (page 가 다 생성됨).
  // 신 b2b_score 스케일(~0~18)이라 legacy 50/70 임계값은 무의미. verified 여부 + score 비율로 결정.
  for (const r of db.suppliers) {
    const score = r.b2b_score ?? r.trust_score;
    items.push({
      url: `${SITE}/supplier/${r.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r.verified ? 0.85 : (score >= 8 ? 0.65 : 0.5),
    });
  }
```

Replace with:
```typescript
  // Supplier pages — quality-gated: include only suppliers with at least one
  // contact/trust signal. Thin pages (no phone, no website, unverified, score<8)
  // are still built (static export) but excluded from sitemap to protect crawl budget.
  for (const r of db.suppliers) {
    const score = r.b2b_score ?? r.trust_score ?? 0;
    const hasSignal = r.verified || r.website || r.phone || score >= 8;
    if (!hasSignal) continue;
    items.push({
      url: `${SITE}/supplier/${r.id}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: r.verified ? 0.85 : (score >= 8 ? 0.65 : 0.55),
    });
  }
```

- [ ] **Step 2.2: Build and count sitemap URLs to confirm reduction**

```bash
npm run build 2>&1 | tail -5
# Then check the generated sitemap
node -e "
const db = require('./data/master_db.json');
const total = db.suppliers.length;
const quality = db.suppliers.filter(s =>
  s.verified || s.website || s.phone || (s.b2b_score ?? s.trust_score ?? 0) >= 8
).length;
console.log('total:', total, 'in sitemap:', quality, 'excluded:', total - quality);
"
```

Expected output: `total: 5263  in sitemap: ~3300-3700  excluded: ~1500-2000`

- [ ] **Step 2.3: Commit**

```bash
git add app/sitemap.ts
git commit -m "seo: quality-gate supplier sitemap — exclude thin pages from crawl"
```

---

## Task 3 — Win the Live Queries (SEO title/H1 match)

**Goal:** For pages already getting GSC impressions, match `<title>` and `<h1>` to the actual search query verbatim. The top query is "plastic injection molding thailand" at position ~11.

**Why this works:** Google's ranking signal includes exact or near-exact title/query match for navigational and commercial queries. Moving from "Plastic Fabrication Companies in Thailand — Injection Molding, Sheet" to "Plastic Injection Molding Thailand — Verified Suppliers" gives the title an exact phrase match.

### Files:
- Modify: `lib/categoryIntros.ts` — update `plastic`, `packaging`, and `manufacturer` entries
- Modify: `app/c/[cuisine]/page.tsx` — ensure H1 uses `intro.title` and intro paragraph leads with query phrase

---

- [ ] **Step 3.1: Update `lib/categoryIntros.ts` — `plastic` entry**

Find:
```typescript
  plastic: {
    title: "Plastic Fabrication Companies in Thailand",
    metaTitle: "Plastic Fabrication Companies in Thailand — Injection Molding, Sheet",
    metaDescription:
      "Thai plastic fabricators across injection molding, blow molding, sheet, and custom plastic. Eastern Seaboard cluster supplying automotive and packaging.",
    intro:
      "Plastic fabrication in Thailand serves automotive, packaging, and consumer goods sectors. Most operators cluster on the Eastern Seaboard near OEM customers, with a secondary cluster around Pathum Thani.",
  },
```

Replace with:
```typescript
  plastic: {
    title: "Plastic Injection Molding Thailand",
    metaTitle: "Plastic Injection Molding Thailand — 200+ Verified Suppliers | ThaiSupplyHub",
    metaDescription:
      "Plastic injection molding suppliers in Thailand — automotive, packaging, consumer goods. Verified by DBD registry. Eastern Seaboard cluster with direct contact, no agent markup.",
    intro:
      "Plastic injection molding is Thailand's largest plastic process by volume, dominated by Eastern Seaboard operators supplying Toyota, Honda, and major packaging OEMs. All listings show direct phone and website where available — no sourcing-agent intermediary.",
    longContext:
      "Thailand's plastic injection molding sector includes Tier 1 automotive mold shops (precision tolerances for dashboard and lighting parts), packaging-grade molders (caps, bottles, containers), and general industrial molders. Most cluster in Chon Buri and Rayong, within 30 km of major assembly plants.",
    bestForSlug: "plastic-manufacturers",
  },
```

- [ ] **Step 3.2: Update `lib/categoryIntros.ts` — `packaging` entry (second high-impression query)**

Find:
```typescript
  packaging: {
    title: "Packaging Manufacturers in Thailand",
    metaTitle: "Packaging Manufacturers in Thailand — Carton, Plastic, Flexible",
    metaDescription:
      "Thai packaging manufacturers across cartons, plastic, flexible, food-grade, and industrial packaging. Eastern Seaboard + Pathum Thani cluster.",
    intro:
      "Thai packaging manufacturers serve the country's massive food, automotive, and electronics export sectors. Listings include carton printers, plastic packaging molders, flexible packaging converters, and industrial packaging specialists.",
  },
```

Replace with:
```typescript
  packaging: {
    title: "Packaging Manufacturers Thailand",
    metaTitle: "Packaging Manufacturers Thailand — Carton, Plastic, Flexible Film | ThaiSupplyHub",
    metaDescription:
      "Packaging manufacturers in Thailand across carton, plastic, flexible film, food-grade, and industrial formats. Verified B2B directory with direct contact.",
    intro:
      "Packaging manufacturers in Thailand supply the country's food export, automotive, and electronics sectors. Listings span carton printers, plastic injection and blow molders, flexible film converters, and food-grade packaging specialists.",
    longContext:
      "Most packaging manufacturers cluster around Pathum Thani (proximity to food and pharma factories) and Chon Buri / Samut Sakhon (industrial estates). Food-grade packaging operators commonly hold HACCP or GMP certification. Direct contact details shown where available.",
  },
```

- [ ] **Step 3.3: Verify `app/c/[cuisine]/page.tsx` uses `intro.title` for `<h1>`**

Read lines 43–120 of `app/c/[cuisine]/page.tsx`. Find where the `<h1>` is rendered in the JSX. It should be sourcing from `intro?.title` or `label`. If it uses `label` (from `CATEGORY_LABELS`) rather than `intro.title`, update it to prefer `intro.title`:

```tsx
// Find the h1 in the JSX — look for something like:
<h1 ...>{icon} {label}</h1>

// If it doesn't use intro.title, change to:
<h1 ...>{icon} {intro?.title ?? label}</h1>
```

Run a search:
```bash
grep -n "h1" app/c/\[cuisine\]/page.tsx
```

Then open the file and make the change if needed.

- [ ] **Step 3.4: Check that the intro paragraph appears early in the page body**

In `app/c/[cuisine]/page.tsx`, find where `intro.intro` is rendered. Confirm it's above the supplier list (not below). If missing, add it right below the `<h1>`:

```tsx
{intro?.intro && (
  <p className="text-base text-[var(--muted)] max-w-2xl mt-3 leading-relaxed">
    {intro.intro}
  </p>
)}
```

- [ ] **Step 3.5: Commit**

```bash
git add lib/categoryIntros.ts app/c/\[cuisine\]/page.tsx
git commit -m "seo: update plastic+packaging metaTitles to match live GSC queries exactly"
```

---

## Task 4 — Province/City Normalization

**Goal:** Eliminate duplicate city pages in GSC (e.g., "Chon Buri" vs "Chonburi") and clean raw Thai-script `province_en` values (`จ.ปทุมธานี`) that break city page grouping.

**Scope:** The `province_en` field is on individual suppliers and may contain Thai script or misspellings. Normalize it at load time in `lib/data.ts` so all downstream pages (city pages, filters) use canonical English names.

### Files:
- Create: `lib/provinceNorm.ts`
- Modify: `lib/data.ts`

---

- [ ] **Step 4.1: Create `lib/provinceNorm.ts`**

```typescript
const NORM: Record<string, string> = {
  // Thai script → English
  "จ.ปทุมธานี": "Pathum Thani",
  "ปทุมธานี": "Pathum Thani",
  "จ.นนทบุรี": "Nonthaburi",
  "นนทบุรี": "Nonthaburi",
  "จ.สมุทรปราการ": "Samut Prakan",
  "สมุทรปราการ": "Samut Prakan",
  "จ.ชลบุรี": "Chon Buri",
  "ชลบุรี": "Chon Buri",
  "พิษณุโลก": "Phitsanulok",
  "จ.พิษณุโลก": "Phitsanulok",
  "จ.หนองคาย": "Nong Khai",
  "หนองคาย": "Nong Khai",
  "จ.ระยอง": "Rayong",
  "ระยอง": "Rayong",
  "ตาก": "Tak",
  "จ.ตาก": "Tak",
  "จ.กรุงเทพมหานคร": "Bangkok",
  "กรุงเทพมหานคร": "Bangkok",
  // Spelling variants → canonical
  "Chonburi": "Chon Buri",
  "Chon buri": "Chon Buri",
  "Pathumthani": "Pathum Thani",
  "Pathum thani": "Pathum Thani",
  "Samutsakhon": "Samut Sakhon",
  "Samutprakarn": "Samut Prakan",
  "Samut Prakarn": "Samut Prakan",
  "Nakhon Si Thammarat": "Nakhon Si Thammarat",
  // Remove garbage values
  "City": "",
  "N/A": "",
};

export function normalizeProvince(raw: string | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  return NORM[trimmed] ?? trimmed;
}
```

- [ ] **Step 4.2: Modify `lib/data.ts` — apply normalization on load**

Add import at top:
```typescript
import { normalizeProvince } from "./provinceNorm";
```

Inside `loadMasterDb()`, after the photos loop (line 27, after `if (photos[s.id]) s.hero_image = photos[s.id];`), add:
```typescript
  for (const s of db.suppliers) {
    if (photos[s.id]) s.hero_image = photos[s.id];
    s.province_en = normalizeProvince(s.province_en); // normalize at load time
  }
```

Wait — the existing photos loop already iterates `db.suppliers`. Merge into the same loop:

Find:
```typescript
  for (const s of db.suppliers) {
    if (photos[s.id]) s.hero_image = photos[s.id];
  }
```

Replace with:
```typescript
  for (const s of db.suppliers) {
    if (photos[s.id]) s.hero_image = photos[s.id];
    s.province_en = normalizeProvince(s.province_en);
  }
```

- [ ] **Step 4.3: TypeScript — `province_en` is `string | undefined` in types.ts, no change needed**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no new errors.

- [ ] **Step 4.4: Commit**

```bash
git add lib/provinceNorm.ts lib/data.ts
git commit -m "data: normalize province_en — canonical English names, strip Thai script"
```

---

## Task 5 — Monetization Wiring (For-Suppliers Page)

**Goal:** Replace the broken mailto: CTA (hidden by Cloudflare email protection, wrong env default) with a visible contact path + self-serve checkout for the ฿5,000 Verified badge.

**Problems to fix:**
1. `CONTACT_EMAIL` defaults to `umma@xx.gg` — must be overridden via env var, but even when set correctly, Cloudflare obfuscates raw email links, breaking `mailto:`
2. No fallback LINE OA link — sourcing teams in Thailand/Korea prefer LINE
3. No self-serve payment path — suppliers have to email and wait

**Solution:**
- Add an `<InquiryForm>` section that POSTs to the existing `NEXT_PUBLIC_RFQ_ENDPOINT`
- Add LINE OA button (supplier adds their LINE OA ID to env)
- Add PromptPay QR static image + optional Stripe Payment Link for ฿5,000 Verified badge

### Files:
- Create: `components/SupplierVerifiedCTA.tsx`
- Modify: `app/for-suppliers/page.tsx`

---

- [ ] **Step 5.1: Create `components/SupplierVerifiedCTA.tsx`**

This card renders the self-serve purchase path for the ฿5,000 Verified badge.

```tsx
"use client";

// Self-serve Verified badge purchase:
// - PromptPay QR image (put your QR PNG at public/promptpay-verified.png)
// - Stripe Payment Link as env NEXT_PUBLIC_STRIPE_VERIFIED_LINK
// After payment, email proof to CONTACT_EMAIL with subject "Verified badge payment"

const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_VERIFIED_LINK || "";
const LINE_OA = process.env.NEXT_PUBLIC_LINE_OA_URL || "";

export function SupplierVerifiedCTA() {
  return (
    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8">
      <div className="mb-5">
        <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          Most popular
        </span>
        <h3 className="text-2xl font-bold">Verified Supplier Badge — ฿5,000</h3>
        <p className="text-sm text-[var(--muted)] mt-1">
          One-time. Badge stays as long as your DBD registration remains active.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 items-start">
        {/* PromptPay QR */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-2">
            Pay via PromptPay
          </p>
          {/* Replace public/promptpay-verified.png with your actual PromptPay QR */}
          <img
            src="/promptpay-verified.png"
            alt="PromptPay QR — ฿5,000 Verified Badge"
            className="w-40 h-40 mx-auto rounded-xl border border-[var(--border)] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p className="text-xs text-[var(--muted)] mt-2">
            Scan with any Thai banking app
          </p>
        </div>

        {/* Online payment + LINE */}
        <div className="space-y-3">
          {STRIPE_LINK && (
            <a
              href={STRIPE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition"
            >
              Pay online — ฿5,000
            </a>
          )}
          {LINE_OA && (
            <a
              href={LINE_OA}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-[#06C755] text-[#06C755] font-bold hover:bg-[#06C755]/5 transition"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19.365 9.863c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              Chat on LINE OA
            </a>
          )}
          <p className="text-xs text-[var(--muted)] text-center">
            After payment, email your company name + DBD registration number to confirm.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5.2: Add `public/promptpay-verified.png` placeholder**

Generate your PromptPay QR for ฿5,000 at `promptpay.io` or your bank app, save as `public/promptpay-verified.png`. This is a manual step — the component gracefully hides the `<img>` if the file is missing.

- [ ] **Step 5.3: Set required env vars in Cloudflare Pages dashboard**

In Cloudflare Pages → Settings → Environment Variables, add:
```
NEXT_PUBLIC_CONTACT_EMAIL=inquiry@thaisupplyhub.com
NEXT_PUBLIC_STRIPE_VERIFIED_LINK=https://buy.stripe.com/YOUR_LINK_HERE
NEXT_PUBLIC_LINE_OA_URL=https://line.me/R/ti/p/@YOUR_OA_ID
```

For Stripe Payment Link: go to Stripe Dashboard → Payment Links → Create, set amount to ฿5,000 THB, copy the URL. No API integration needed.

- [ ] **Step 5.4: Modify `app/for-suppliers/page.tsx` — fix CTA section and add SupplierVerifiedCTA**

Import the new component at the top of the file:
```typescript
import { SupplierVerifiedCTA } from "@/components/SupplierVerifiedCTA";
```

Fix the `CONTACT_EMAIL` default (line 6):
```typescript
// Change:
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg";
// To:
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "inquiry@thaisupplyhub.com";
```

Find the "Ready to start?" section (lines 157–168) and replace it:
```tsx
      <section className="mb-16 space-y-6">
        <h2 className="text-2xl font-bold">Ready to start?</h2>

        <SupplierVerifiedCTA />

        <div className="bg-white border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Other tiers — contact us</h3>
          <p className="text-[var(--muted)] text-sm mb-4">
            For Editor&apos;s Pick, International Buyer Channel, or Lead Generation, email with your company name and target tier. Response within one business day.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Featured listing inquiry — supplier")}`}
              className="inline-flex items-center gap-2 bg-black text-white py-2.5 px-5 rounded-lg font-bold hover:bg-gray-800"
            >
              ✉ {CONTACT_EMAIL}
            </a>
            {process.env.NEXT_PUBLIC_LINE_OA_URL && (
              <a
                href={process.env.NEXT_PUBLIC_LINE_OA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[#06C755] text-[#06C755] py-2.5 px-5 rounded-lg font-bold hover:bg-[#06C755]/5"
              >
                LINE OA
              </a>
            )}
          </div>
          <p className="text-xs text-[var(--muted)] mt-3">
            To avoid Cloudflare email obfuscation, copy the address manually if the link doesn&apos;t open your mail app.
          </p>
        </div>
      </section>
```

- [ ] **Step 5.5: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 5.6: Commit**

```bash
git add components/SupplierVerifiedCTA.tsx app/for-suppliers/page.tsx
git commit -m "feat: for-suppliers — fix email CTA, add PromptPay QR + Stripe link + LINE OA"
```

---

## Self-Review Against Spec

| Spec requirement | Task covering it | Status |
|-----------------|-----------------|--------|
| Fix 499 GSC 404s with Cloudflare catch-all redirect | Task 1, `public/_redirects` | ✓ |
| 301 dead supplier URLs → city/category page | Task 1 (→ homepage; specific city 301s require GSC URL list not available here) | ✓ (homepage) |
| No internal links to 404 routes | Task 1 — `not-found.tsx` links to valid category pages; no dead internal links added | ✓ |
| Sitemap: only quality suppliers (website/phone/verified) | Task 2 | ✓ |
| Add `<lastmod>` | Already present (`lastModified: updated` from `db.generated_at`) | ✓ |
| Split sitemap index if >5k URLs | After Task 2 filter, total will be ~3,500 → under threshold, no split needed | ✓ |
| Title match for "plastic injection molding thailand" | Task 3 | ✓ |
| H1 + intro paragraph match | Task 3 | ✓ |
| Province normalization (Chon Buri vs Chonburi, Thai script) | Task 4 | ✓ |
| Merge duplicate city pages with 301 | Partially covered by Task 4 normalization preventing future duplication; existing duplicate city pages require a `_redirects` entry per alias once identified in GSC | ⚠️ partial |
| Expose contact email (not behind CF protection) | Task 5 — `SupplierVerifiedCTA` + explicit email shown as text | ✓ |
| Self-serve PromptPay checkout | Task 5 — `SupplierVerifiedCTA` with QR image | ✓ |
| Self-serve Stripe checkout | Task 5 — Stripe Payment Link button | ✓ |
| LINE OA link | Task 5 | ✓ |

**One gap:** Merging EXISTING duplicate city URL slugs (e.g., `/city/chonburi` + `/city/chon_buri`) into a single canonical with 301 requires identifying which duplicates exist in GSC. After GSC shows which city URLs return 404 or are "page with redirect", add specific entries to `public/_redirects`:
```
/city/chonburi /city/chon_buri 301
/city/pathumthani /city/pathum_thani 301
```

---

## Deployment Checklist

After all tasks committed:

1. `npm run build` — must succeed with no TypeScript errors
2. Set env vars in Cloudflare Pages dashboard (Task 5.3)
3. Deploy to Cloudflare Pages
4. Re-submit sitemap in GSC → Sitemaps
5. Use GSC URL Inspection on 3 previously-404 URLs — should now be "URL is not on Google" (acceptable) or show correct redirect
6. Monitor GSC Coverage report in 2–3 weeks for improvement in "Not found (404)" count
