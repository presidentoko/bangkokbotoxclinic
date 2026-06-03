# bangkokfillers.com Next.js Site Implementation Plan (Plan 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax. For Next.js/Vercel specifics, the implementer may consult the `vercel:nextjs` and `vercel:shadcn` skills.

**Goal:** Ship the AEO-first Thai beauty directory site (MVP: acne + whitening) — a statically-generated Next.js app that reads `cosmetics/web/data/master_db.json` + `ingredient_db.json` and renders 5 page types (home, concern hubs, product detail, ingredient pages, methodology) in Thai + English, with JSON-LD, llms.txt, sortable comparison tables, and affiliate buttons, deployed to Vercel at bangkokfillers.com.

**Architecture:** Next.js App Router (TypeScript), all pages prerendered via `generateStaticParams` from build-time JSON imports. Pure data/format/schema/i18n logic lives in `cosmetics/web/lib/` and is unit-tested with **vitest**; pages/components consume those typed helpers. Locale is a route segment `[locale]` ∈ {`th`,`en`}; `/` redirects to `/th`. The comparison table is the only client component (sorting). Reads Plan 1's output; depends on `master_db.json` existing.

**Tech Stack:** Next.js (latest, App Router) + TypeScript + Tailwind CSS, vitest for unit tests. Deploy: Vercel (separate project, domain bangkokfillers.com). Node 20+, npm.

**Working dir:** `C:/Users/yn/Desktop/Work/0_main/deliverable/deliverable/.claude/worktrees/cosmetics-aeo`, app at `cosmetics/web/`. Branch `worktree-cosmetics-aeo`.

> **Git note:** commit ONLY listed paths (`git add <path>`), never `git add -A` (live repo automation hazard — memory `deliverable-repo-watchdog-git-hazard`). All web code lives under `cosmetics/web/`.

> **Pre-req for full content (not blocking the build):** `llm_summary` is absent until `cosmetics/gen_summaries.py` is run with `ANTHROPIC_API_KEY`. Every renderer MUST fall back to a templated sentence when `llm_summary` is missing (covered in tasks). Running gen_summaries is an ops step, not part of this plan.

---

## File Structure (all under `cosmetics/web/`)

- `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `app/globals.css` — scaffold.
- `data/master_db.json`, `data/ingredient_db.json` — build-time data (master_db from Plan 1; copy ingredient_db from `cosmetics/web/data/` — already same dir).
- `lib/types.ts` — TS types for Product, IngredientEntry, MasterDb.
- `lib/data.ts` — load + typed accessors (products, rankings, ingredients, slugs).
- `lib/format.ts` — number/price/score formatting, `slugify`.
- `lib/i18n.ts` — locales, UI string dictionary, concern labels.
- `lib/affiliate.ts` — build affiliate URL from a product.
- `lib/schema.ts` — JSON-LD builders (ItemList, Product, DefinedTerm, FAQPage, Organization).
- `components/ComparisonTable.tsx` — client, sortable ranking table.
- `components/JsonLd.tsx` — renders a `<script type="application/ld+json">`.
- `components/Header.tsx`, `components/AffiliateButton.tsx`, `components/IngredientDecoder.tsx`.
- `app/layout.tsx` (root, redirect helper), `app/page.tsx` (→ /th), `app/[locale]/layout.tsx`, `app/[locale]/page.tsx` (home), `app/[locale]/[concern]/page.tsx`, `app/[locale]/product/[slug]/page.tsx`, `app/[locale]/ingredient/[slug]/page.tsx`, `app/[locale]/methodology/page.tsx`, `app/llms.txt/route.ts`.
- Tests: `lib/__tests__/*.test.ts`.

Slugs: product = `slugify(brand)-<product_id>`; ingredient = `slugify(inci)`. Concern slugs are literal `acne` / `whitening`.

---

### Task 1: Scaffold the Next.js app + vitest

**Files:** create scaffold under `cosmetics/web/`.

- [ ] **Step 1: Scaffold**

Run (bash, from worktree root):
```bash
cd "C:/Users/yn/Desktop/Work/0_main/deliverable/deliverable/.claude/worktrees/cosmetics-aeo"
npx create-next-app@latest cosmetics/web --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm --yes
```
If `cosmetics/web/data/` would be overwritten, preserve it: move existing `cosmetics/web/data` aside first and restore after scaffold.

- [ ] **Step 2: Add vitest**

```bash
cd "C:/Users/yn/Desktop/Work/0_main/deliverable/deliverable/.claude/worktrees/cosmetics-aeo/cosmetics/web"
npm i -D vitest
```
Create `cosmetics/web/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["lib/**/*.test.ts"], environment: "node" } });
```
Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 3: Verify scaffold builds & test runs**

```bash
npm run build        # expect: compiled successfully (default starter pages)
npm test             # expect: "No test files found" (exit 0) — vitest wired
```

- [ ] **Step 4: Ensure data files present**

Confirm `cosmetics/web/data/master_db.json` and `cosmetics/web/data/ingredient_db.json` exist (master_db from Plan 1's build; ingredient_db from Plan 1 Task 1). If `master_db.json` is missing, run `... -m cosmetics.build_master_db` from the worktree root first.

- [ ] **Step 5: Configure next.config + tsconfig for JSON imports**

In `cosmetics/web/tsconfig.json` ensure `"resolveJsonModule": true` and `"esModuleInterop": true`.
In `next.config.mjs` add (so large JSON imports work and trailing slashes are consistent):
```js
const nextConfig = { trailingSlash: false };
export default nextConfig;
```

- [ ] **Step 6: Commit**

```bash
git add cosmetics/web/package.json cosmetics/web/package-lock.json cosmetics/web/next.config.mjs cosmetics/web/tsconfig.json cosmetics/web/tailwind.config.ts cosmetics/web/postcss.config.mjs cosmetics/web/vitest.config.ts cosmetics/web/app cosmetics/web/.eslintrc.json cosmetics/web/.gitignore cosmetics/web/next-env.d.ts
git commit -m "chore(web): scaffold Next.js + vitest"
```
(Do not commit `node_modules`; the scaffold's `.gitignore` excludes it. Do not commit `data/*.json` build artifacts unless small enough — `ingredient_db.json` SHOULD be committed; `master_db.json` may be regenerated at build, but committing it is fine for Vercel build determinism. Add `cosmetics/web/data/ingredient_db.json` and `cosmetics/web/data/master_db.json` in a later data task.)

---

### Task 2: Types + data accessors (TDD)

**Files:** Create `cosmetics/web/lib/types.ts`, `cosmetics/web/lib/format.ts`, `cosmetics/web/lib/data.ts`, `cosmetics/web/lib/__tests__/data.test.ts`.

- [ ] **Step 1: Write failing test** `cosmetics/web/lib/__tests__/data.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { slugify } from "../format";
import { getRanking, getProduct, productSlug, getIngredient, allProducts } from "../data";

describe("format.slugify", () => {
  it("lowercases, strips, hyphenates", () => {
    expect(slugify("La Roche Posay")).toBe("la-roche-posay");
    expect(slugify("Dr.PONG (Skincare)")).toBe("dr-pong-skincare");
  });
});

describe("data accessors", () => {
  it("ranking is sorted desc and resolves to products", () => {
    const r = getRanking("acne");
    expect(r.length).toBeGreaterThan(0);
    for (let i = 1; i < r.length; i++) {
      expect(r[i - 1].total_score).toBeGreaterThanOrEqual(r[i].total_score);
    }
    const top = getProduct(r[0].product_id);
    expect(top?.name).toBeTruthy();
  });
  it("productSlug round-trips via getProduct", () => {
    const p = allProducts()[0];
    const slug = productSlug(p);
    expect(slug.endsWith(p.product_id)).toBe(true);
  });
  it("getIngredient finds a known ingredient by slug", () => {
    const ing = getIngredient("niacinamide");
    expect(ing?.en_name.toLowerCase()).toContain("niacinamide");
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd cosmetics/web && npm test
```
Expected: FAIL (modules missing).

- [ ] **Step 3: Implement `lib/types.ts`**

```ts
export interface IngredientAnalysis { inci: string; role: string; concern_efficacy: Record<string, number>; safety_flags: string[]; }
export interface ReviewSummary { count: number; avg: number; pos_count: number; neg_count: number; pos_keywords: string[]; neg_keywords: string[]; samples: { rating: number; body: string; author?: string; helpful_count?: number }[]; }
export interface Product {
  product_id: string; url: string; name: string; brand: string;
  price_thb: number; list_price_thb: number; discount_pct: number; volume: string;
  image_url: string; description: string; gtin8: string;
  ingredients: string | string[]; ingredient_analysis: IngredientAnalysis[];
  ingredient_score: Record<string, number>; review_score: number;
  value_score: number; total_score: Record<string, number>;
  review_summary: ReviewSummary; concern_seeds: string | string[];
  konvy_rating: number; konvy_review_count: number; sold_count: number;
  llm_summary?: { th: string; en: string };
}
export interface RankingEntry { product_id: string; total_score: number; }
export interface MasterDb { generated_at: string; products: Record<string, Product>; rankings: Record<string, RankingEntry[]>; }
export interface IngredientEntry { th_name: string; en_name: string; aliases: string[]; role: string; concern_efficacy: Record<string, number>; safety_flags: string[]; mechanism_th: string; mechanism_en: string; typical_pct: string; evidence_note?: string; sources: string[]; }
```

- [ ] **Step 4: Implement `lib/format.ts`**

```ts
export function slugify(s: string): string {
  return (s || "").toLowerCase().trim()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
export const baht = (n: number) => "฿" + Math.round(n).toLocaleString("en-US");
export const score1 = (n: number) => (Math.round(n * 10) / 10).toFixed(1);
```

- [ ] **Step 5: Implement `lib/data.ts`**

```ts
import master from "@/data/master_db.json";
import ingredientDb from "@/data/ingredient_db.json";
import type { MasterDb, Product, RankingEntry, IngredientEntry } from "./types";
import { slugify } from "./format";

const db = master as unknown as MasterDb;
const ingDb = ingredientDb as unknown as Record<string, IngredientEntry>;

export const CONCERNS = ["acne", "whitening"] as const;
export type Concern = (typeof CONCERNS)[number];

export const generatedAt = () => db.generated_at;
export const allProducts = (): Product[] => Object.values(db.products);
export const getProduct = (id: string): Product | undefined => db.products[id];
export const getRanking = (concern: string): RankingEntry[] => db.rankings[concern] ?? [];
export const productSlug = (p: Product) => `${slugify(p.brand)}-${p.product_id}`;
export const productIdFromSlug = (slug: string) => slug.split("-").pop()!;

export const allIngredients = (): [string, IngredientEntry][] => Object.entries(ingDb);
export const ingredientSlug = (inci: string) => slugify(inci);
export function getIngredient(slug: string): (IngredientEntry & { inci: string }) | undefined {
  for (const [inci, e] of Object.entries(ingDb)) {
    if (slugify(inci) === slug) return { inci, ...e };
  }
  return undefined;
}
export function productsWithIngredient(inci: string): Product[] {
  return allProducts().filter((p) => p.ingredient_analysis.some((a) => a.inci === inci));
}
```

- [ ] **Step 6: Run, verify PASS**

```bash
cd cosmetics/web && npm test
```
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add cosmetics/web/lib/types.ts cosmetics/web/lib/format.ts cosmetics/web/lib/data.ts cosmetics/web/lib/__tests__/data.test.ts
git commit -m "feat(web): types + data accessors"
```

---

### Task 3: i18n strings + affiliate URL (TDD)

**Files:** Create `cosmetics/web/lib/i18n.ts`, `cosmetics/web/lib/affiliate.ts`, `cosmetics/web/lib/__tests__/i18n.test.ts`.

- [ ] **Step 1: Failing test** `cosmetics/web/lib/__tests__/i18n.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { t, LOCALES, concernLabel } from "../i18n";
import { affiliateUrl } from "../affiliate";

describe("i18n", () => {
  it("has th + en", () => { expect(LOCALES).toEqual(["th", "en"]); });
  it("translates a key per locale", () => {
    expect(t("th", "buy_now")).not.toBe(t("en", "buy_now"));
    expect(t("en", "buy_now").toLowerCase()).toContain("buy");
  });
  it("concern labels localized", () => {
    expect(concernLabel("th", "acne")).toBeTruthy();
    expect(concernLabel("en", "whitening").toLowerCase()).toContain("bright");
  });
});

describe("affiliate", () => {
  it("wraps the product url and is absolute", () => {
    const u = affiliateUrl({ url: "https://www.konvy.com/x-1.html" } as any);
    expect(u.startsWith("http")).toBe(true);
    expect(u).toContain("konvy.com");
  });
});
```

- [ ] **Step 2: Run, verify FAIL** — `cd cosmetics/web && npm test` → FAIL.

- [ ] **Step 3: Implement `lib/i18n.ts`**

```ts
export const LOCALES = ["th", "en"] as const;
export type Locale = (typeof LOCALES)[number];

const STRINGS: Record<string, Record<Locale, string>> = {
  site_name: { th: "BangkokFillers", en: "BangkokFillers" },
  tagline: { th: "เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์", en: "Trust data, not influencers" },
  buy_now: { th: "ดูราคาล่าสุด", en: "Check latest price" },
  rank: { th: "อันดับ", en: "Rank" }, product: { th: "ผลิตภัณฑ์", en: "Product" },
  score: { th: "คะแนน", en: "Score" }, key_ingredient: { th: "ส่วนผสมเด่น", en: "Key ingredient" },
  price: { th: "ราคา", en: "Price" }, rating: { th: "เรตติ้ง", en: "Rating" },
  reviews: { th: "รีวิว", en: "reviews" }, methodology: { th: "วิธีให้คะแนน", en: "Methodology" },
  ingredients: { th: "ส่วนผสม", en: "Ingredients" }, updated: { th: "อัปเดต", en: "Updated" },
  based_on: { th: "อ้างอิงจากรีวิว", en: "Based on reviews" },
  contains: { th: "ผลิตภัณฑ์ที่มีส่วนผสมนี้", en: "Products with this ingredient" },
};
const CONCERN_LABELS: Record<string, Record<Locale, string>> = {
  acne: { th: "สิว", en: "Acne" },
  whitening: { th: "ฝ้า กระ จุดด่างดำ ผิวกระจ่างใส", en: "Brightening & dark spots" },
};
export const t = (loc: Locale, key: string) => STRINGS[key]?.[loc] ?? key;
export const concernLabel = (loc: Locale, c: string) => CONCERN_LABELS[c]?.[loc] ?? c;
```

- [ ] **Step 4: Implement `lib/affiliate.ts`**

```ts
import type { Product } from "./types";
// Open item: replace with the real Involve Asia deep-link template once the account is set up.
// Until then we link straight to the Konvy product page (still our affiliate destination).
const WRAP = process.env.NEXT_PUBLIC_AFFILIATE_WRAP || ""; // e.g. "https://invol.co/aff?url="
export function affiliateUrl(p: Pick<Product, "url">): string {
  if (!p.url) return "https://www.konvy.com/";
  return WRAP ? WRAP + encodeURIComponent(p.url) : p.url;
}
```

- [ ] **Step 5: Run, verify PASS** — `cd cosmetics/web && npm test` → PASS.

- [ ] **Step 6: Commit**

```bash
git add cosmetics/web/lib/i18n.ts cosmetics/web/lib/affiliate.ts cosmetics/web/lib/__tests__/i18n.test.ts
git commit -m "feat(web): i18n strings + affiliate url"
```

---

### Task 4: JSON-LD schema builders (TDD)

**Files:** Create `cosmetics/web/lib/schema.ts`, `cosmetics/web/lib/__tests__/schema.test.ts`.

- [ ] **Step 1: Failing test** `cosmetics/web/lib/__tests__/schema.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { itemListLd, productLd, ingredientLd, faqLd, orgLd } from "../schema";

const P: any = { product_id:"1", name:"Acne Serum", brand:"X", url:"https://www.konvy.com/x-1.html",
  image_url:"https://img/x.jpg", description:"d", price_thb:300, konvy_rating:4.6, konvy_review_count:200,
  review_summary:{ samples:[{rating:5,body:"good",author:"a"}] } };

describe("schema", () => {
  it("itemList has ordered items", () => {
    const ld = itemListLd("https://site/th/acne", [P], (p)=>`https://site/th/product/${p.product_id}`);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.itemListElement[0].position).toBe(1);
  });
  it("product has AggregateRating + Review", () => {
    const ld = productLd(P, "https://site/th/product/1");
    expect(ld["@type"]).toBe("Product");
    expect(ld.aggregateRating.ratingValue).toBe(4.6);
    expect(ld.review.length).toBeGreaterThan(0);
  });
  it("ingredient is DefinedTerm", () => {
    expect(ingredientLd({inci:"Niacinamide",en_name:"Niacinamide",mechanism_en:"m"} as any,"https://site/th/ingredient/niacinamide")["@type"]).toBe("DefinedTerm");
  });
  it("faq + org typed", () => {
    expect(faqLd([{q:"a",a:"b"}])["@type"]).toBe("FAQPage");
    expect(orgLd("https://site")["@type"]).toBe("Organization");
  });
});
```

- [ ] **Step 2: Run, verify FAIL** — `cd cosmetics/web && npm test` → FAIL.

- [ ] **Step 3: Implement `lib/schema.ts`**

```ts
import type { Product, IngredientEntry } from "./types";

export function itemListLd(pageUrl: string, products: Product[], urlOf: (p: Product) => string) {
  return { "@context": "https://schema.org", "@type": "ItemList", url: pageUrl,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1,
      url: urlOf(p), name: p.name })) };
}
export function productLd(p: Product, pageUrl: string) {
  const ld: any = { "@context": "https://schema.org", "@type": "Product", name: p.name,
    brand: { "@type": "Brand", name: p.brand }, image: p.image_url, description: p.description,
    url: pageUrl, offers: { "@type": "Offer", priceCurrency: "THB", price: String(p.price_thb), url: pageUrl } };
  if (p.konvy_review_count > 0 && p.konvy_rating > 0) {
    ld.aggregateRating = { "@type": "AggregateRating", ratingValue: p.konvy_rating,
      reviewCount: p.konvy_review_count, bestRating: 5, worstRating: 1 };
  }
  ld.review = (p.review_summary?.samples ?? []).slice(0, 3).map((r) => ({ "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    author: { "@type": "Person", name: r.author || "Konvy user" }, reviewBody: r.body }));
  return ld;
}
export function ingredientLd(ing: IngredientEntry & { inci: string }, pageUrl: string) {
  return { "@context": "https://schema.org", "@type": "DefinedTerm", name: ing.en_name || ing.inci,
    alternateName: ing.th_name, description: ing.mechanism_en, url: pageUrl,
    inDefinedTermSet: pageUrl.replace(/\/ingredient\/.*/, "/ingredient") };
}
export function faqLd(qas: { q: string; a: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: qas.map((x) => ({ "@type": "Question", name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a } })) };
}
export function orgLd(siteUrl: string) {
  return { "@context": "https://schema.org", "@type": "Organization", name: "BangkokFillers",
    url: siteUrl };
}
```

- [ ] **Step 4: Run, verify PASS** — `cd cosmetics/web && npm test` → PASS.

- [ ] **Step 5: Commit**

```bash
git add cosmetics/web/lib/schema.ts cosmetics/web/lib/__tests__/schema.test.ts
git commit -m "feat(web): JSON-LD schema builders"
```

---

### Task 5: Shared components

**Files:** Create `cosmetics/web/components/JsonLd.tsx`, `Header.tsx`, `AffiliateButton.tsx`, `ComparisonTable.tsx`, `IngredientDecoder.tsx`.

- [ ] **Step 1: `components/JsonLd.tsx`** (server component)

```tsx
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

- [ ] **Step 2: `components/Header.tsx`**

```tsx
import Link from "next/link";
import { t, concernLabel, type Locale } from "@/lib/i18n";
export function Header({ locale }: { locale: Locale }) {
  const other = locale === "th" ? "en" : "th";
  return (
    <header className="border-b">
      <nav className="mx-auto max-w-5xl flex items-center gap-4 p-4 text-sm">
        <Link href={`/${locale}`} className="font-bold">{t(locale, "site_name")}</Link>
        <Link href={`/${locale}/acne`}>{concernLabel(locale, "acne")}</Link>
        <Link href={`/${locale}/whitening`}>{concernLabel(locale, "whitening")}</Link>
        <Link href={`/${locale}/methodology`} className="ml-auto">{t(locale, "methodology")}</Link>
        <Link href={`/${other}`} className="uppercase">{other}</Link>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: `components/AffiliateButton.tsx`**

```tsx
import { affiliateUrl } from "@/lib/affiliate";
import { t, type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/types";
export function AffiliateButton({ p, locale }: { p: Product; locale: Locale }) {
  return (
    <a href={affiliateUrl(p)} target="_blank" rel="sponsored noopener"
       className="inline-block rounded bg-pink-600 px-4 py-2 text-white font-medium">
      {t(locale, "buy_now")} · ฿{Math.round(p.price_thb).toLocaleString()}
    </a>
  );
}
```

- [ ] **Step 4: `components/IngredientDecoder.tsx`** (server)

```tsx
import type { IngredientAnalysis } from "@/lib/types";
export function IngredientDecoder({ analysis, concern, locale }:
  { analysis: IngredientAnalysis[]; concern: string; locale: "th" | "en" }) {
  if (!analysis.length) return <p className="text-sm text-gray-500">{locale==="th"?"ไม่มีข้อมูลส่วนผสม":"No ingredient data"}</p>;
  return (
    <ul className="space-y-1 text-sm">
      {analysis.map((a) => (
        <li key={a.inci} className="flex flex-wrap gap-2">
          <span className="font-medium">{a.inci}</span>
          {a.concern_efficacy[concern] > 0 && <span className="text-green-700">★{a.concern_efficacy[concern]}</span>}
          {a.safety_flags.map((f) => <span key={f} className="text-amber-700">⚠{f}</span>)}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: `components/ComparisonTable.tsx`** (client, sortable)

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
type Row = { rank: number; id: string; slug: string; name: string; brand: string;
  score: number; keyIngredient: string; price: number; rating: number; reviews: number };
type Key = "score" | "price" | "rating" | "reviews";
export function ComparisonTable({ rows, locale, labels }:
  { rows: Row[]; locale: string; labels: Record<string,string> }) {
  const [sort, setSort] = useState<Key>("score");
  const sorted = [...rows].sort((a, b) => sort === "price" ? a.price - b.price : (b as any)[sort] - (a as any)[sort]);
  const Th = ({ k, children }: { k: Key; children: any }) =>
    <th onClick={() => setSort(k)} className="cursor-pointer px-2 py-1 text-left underline-offset-2 hover:underline">{children}</th>;
  return (
    <table className="w-full text-sm border-collapse">
      <thead><tr className="border-b">
        <th className="px-2 py-1 text-left">{labels.rank}</th>
        <th className="px-2 py-1 text-left">{labels.product}</th>
        <Th k="score">{labels.score}</Th>
        <th className="px-2 py-1 text-left">{labels.key_ingredient}</th>
        <Th k="price">{labels.price}</Th>
        <Th k="rating">{labels.rating}</Th>
      </tr></thead>
      <tbody>
        {sorted.map((r, i) => (
          <tr key={r.id} className="border-b">
            <td className="px-2 py-1">{i + 1}</td>
            <td className="px-2 py-1"><Link href={`/${locale}/product/${r.slug}`} className="text-pink-700">{r.brand} {r.name}</Link></td>
            <td className="px-2 py-1 font-medium">{r.score.toFixed(1)}</td>
            <td className="px-2 py-1">{r.keyIngredient}</td>
            <td className="px-2 py-1">฿{Math.round(r.price).toLocaleString()}</td>
            <td className="px-2 py-1">{r.rating ? `${r.rating}★ (${r.reviews})` : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add cosmetics/web/components
git commit -m "feat(web): shared components (table, header, decoder, affiliate, jsonld)"
```

---

### Task 6: Root redirect + locale layout + home

**Files:** Modify `cosmetics/web/app/layout.tsx`; create `app/page.tsx`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`. Replace the starter `app/page.tsx`.

- [ ] **Step 1: `app/page.tsx`** (root → /th)

```tsx
import { redirect } from "next/navigation";
export default function Root() { redirect("/th"); }
```

- [ ] **Step 2: `app/[locale]/layout.tsx`**

```tsx
import { LOCALES, type Locale } from "@/lib/i18n";
import { Header } from "@/components/Header";
export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }
export default function LocaleLayout({ children, params }:
  { children: React.ReactNode; params: { locale: Locale } }) {
  return (<div lang={params.locale}><Header locale={params.locale} /><main className="mx-auto max-w-5xl p-4">{children}</main></div>);
}
```

- [ ] **Step 3: `app/[locale]/page.tsx`** (home)

```tsx
import Link from "next/link";
import { t, concernLabel, type Locale } from "@/lib/i18n";
import { getRanking } from "@/lib/data";
export default function Home({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t(locale, "site_name")}</h1>
      <p className="text-gray-600">{t(locale, "tagline")}</p>
      <div className="grid grid-cols-2 gap-4">
        {(["acne","whitening"] as const).map((c) => (
          <Link key={c} href={`/${locale}/${c}`} className="rounded border p-6 hover:bg-gray-50">
            <div className="text-lg font-semibold">{concernLabel(locale, c)}</div>
            <div className="text-sm text-gray-500">{getRanking(c).length} {t(locale,"product")}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build check** — `cd cosmetics/web && npm run build`. Expect: success; `/th`, `/en` prerendered; `/` redirects.

- [ ] **Step 5: Commit**

```bash
git add cosmetics/web/app/page.tsx cosmetics/web/app/[locale]
git commit -m "feat(web): root redirect, locale layout, home"
```

---

### Task 7: Concern hub pages (`/[locale]/[concern]`)

**Files:** Create `cosmetics/web/app/[locale]/[concern]/page.tsx`.

- [ ] **Step 1: Implement**

```tsx
import { notFound } from "next/navigation";
import { CONCERNS, getRanking, getProduct, productSlug, type Concern } from "@/lib/data";
import { LOCALES, t, concernLabel, type Locale } from "@/lib/i18n";
import { itemListLd, faqLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { ComparisonTable } from "@/components/ComparisonTable";
import { generatedAt } from "@/lib/data";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => CONCERNS.map((concern) => ({ locale, concern })));
}

export default function ConcernHub({ params }: { params: { locale: Locale; concern: string } }) {
  const { locale, concern } = params;
  if (!CONCERNS.includes(concern as Concern)) notFound();
  const rows = getRanking(concern).map((e, i) => {
    const p = getProduct(e.product_id)!;
    const key = p.ingredient_analysis.find((a) => a.concern_efficacy[concern] > 0)?.inci ?? "—";
    return { rank: i + 1, id: p.product_id, slug: productSlug(p), name: p.name, brand: p.brand,
      score: e.total_score, keyIngredient: key, price: p.price_thb,
      rating: p.konvy_rating, reviews: p.konvy_review_count };
  });
  const top = rows.slice(0, 20);
  const products = getRanking(concern).slice(0, 20).map((e) => getProduct(e.product_id)!);
  const labels = { rank:t(locale,"rank"), product:t(locale,"product"), score:t(locale,"score"),
    key_ingredient:t(locale,"key_ingredient"), price:t(locale,"price"), rating:t(locale,"rating") };
  const title = locale === "th"
    ? `${concernLabel(locale, concern)} : ผลิตภัณฑ์ที่ดีที่สุดจัดอันดับด้วยส่วนผสม + รีวิวจริง`
    : `Best products for ${concernLabel(locale, concern)} — ranked by ingredients + real reviews`;
  const intro = `${title}. ${locale==="th"?"อันดับคำนวณจากคะแนนส่วนผสม 45% รีวิว 45% ความคุ้มค่า 10%":"Ranked by 45% ingredient science, 45% aggregated reviews, 10% value."}`;
  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-700">{intro}</p>
      <p className="text-xs text-gray-400">{t(locale,"updated")}: {generatedAt()?.slice(0,10)}</p>
      <ComparisonTable rows={top} locale={locale} labels={labels} />
      <JsonLd data={itemListLd(`https://bangkokfillers.com/${locale}/${concern}`, products,
        (p) => `https://bangkokfillers.com/${locale}/product/${productSlug(p)}`)} />
      <JsonLd data={faqLd([{ q: title, a: intro }])} />
    </article>
  );
}
```

- [ ] **Step 2: Build check** — `cd cosmetics/web && npm run build`. Expect: `/th/acne`, `/th/whitening`, `/en/acne`, `/en/whitening` prerendered.

- [ ] **Step 3: Commit**

```bash
git add cosmetics/web/app/[locale]/[concern]
git commit -m "feat(web): concern hub pages with comparison table + JSON-LD"
```

---

### Task 8: Product detail pages

**Files:** Create `cosmetics/web/app/[locale]/product/[slug]/page.tsx`.

- [ ] **Step 1: Implement**

```tsx
import { notFound } from "next/navigation";
import { allProducts, getProduct, productSlug, productIdFromSlug } from "@/lib/data";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { productLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { AffiliateButton } from "@/components/AffiliateButton";
import { IngredientDecoder } from "@/components/IngredientDecoder";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => allProducts().map((p) => ({ locale, slug: productSlug(p) })));
}

function fallbackSummary(p: any, locale: Locale, concern: string) {
  const sc = (p.total_score?.[concern] ?? 0).toFixed(0);
  return locale === "th"
    ? `${p.brand} ${p.name} ได้คะแนนรวม ${sc}/100 จากส่วนผสมและรีวิว ${p.konvy_review_count} รายการ`
    : `${p.brand} ${p.name} scores ${sc}/100 from its ingredients and ${p.konvy_review_count} reviews.`;
}

export default function ProductPage({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale, slug } = params;
  const p = getProduct(productIdFromSlug(slug));
  if (!p) notFound();
  const concern = (Array.isArray(p.concern_seeds) ? p.concern_seeds[0] : String(p.concern_seeds).split("|")[0]) || "acne";
  const summary = p.llm_summary?.[locale] || fallbackSummary(p, locale, concern);
  const pageUrl = `https://bangkokfillers.com/${locale}/product/${slug}`;
  return (
    <article className="space-y-4">
      <h1 className="text-xl font-bold">{p.brand} {p.name}</h1>
      <p className="text-lg">{(p.total_score?.[concern] ?? 0).toFixed(0)}/100 · {summary}</p>
      <div className="flex items-center gap-3">
        <AffiliateButton p={p} locale={locale} />
        {p.discount_pct > 0 && <span className="text-sm text-gray-500 line-through">฿{Math.round(p.list_price_thb).toLocaleString()}</span>}
        {p.discount_pct > 0 && <span className="text-sm text-pink-700">-{p.discount_pct}%</span>}
      </div>
      <section><h2 className="font-semibold">{t(locale,"ingredients")}</h2>
        <IngredientDecoder analysis={p.ingredient_analysis} concern={concern} locale={locale} /></section>
      <section><h2 className="font-semibold">{t(locale,"reviews")} ({p.konvy_review_count})</h2>
        <p className="text-sm">★ {p.konvy_rating} · {p.review_summary?.pos_keywords?.slice(0,5).join(", ")}</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          {(p.review_summary?.samples ?? []).slice(0,3).map((r,i)=>(<li key={i}>“{r.body}” — {r.rating}★</li>))}
        </ul></section>
      <JsonLd data={productLd(p, pageUrl)} />
    </article>
  );
}
```

- [ ] **Step 2: Build check** — `cd cosmetics/web && npm run build`. Expect ~415×2 product pages prerendered (may take a minute). If build OOMs on JSON size, set `NODE_OPTIONS=--max-old-space-size=4096`.

- [ ] **Step 3: Commit**

```bash
git add cosmetics/web/app/[locale]/product
git commit -m "feat(web): product detail pages + Product JSON-LD"
```

---

### Task 9: Ingredient pages + methodology

**Files:** Create `cosmetics/web/app/[locale]/ingredient/[slug]/page.tsx`, `cosmetics/web/app/[locale]/methodology/page.tsx`.

- [ ] **Step 1: Ingredient page**

```tsx
import { notFound } from "next/navigation";
import { allIngredients, ingredientSlug, getIngredient, productsWithIngredient, productSlug } from "@/lib/data";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { ingredientLd, faqLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => allIngredients().map(([inci]) => ({ locale, slug: ingredientSlug(inci) })));
}
export default function IngredientPage({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale, slug } = params;
  const ing = getIngredient(slug);
  if (!ing) notFound();
  const name = locale === "th" ? ing.th_name : ing.en_name;
  const mech = locale === "th" ? ing.mechanism_th : ing.mechanism_en;
  const prods = productsWithIngredient(ing.inci);
  const url = `https://bangkokfillers.com/${locale}/ingredient/${slug}`;
  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">{name} <span className="text-base text-gray-400">({ing.inci})</span></h1>
      <p>{mech}</p>
      <p className="text-sm text-gray-600">{locale==="th"?"ความเข้มข้นทั่วไป":"Typical concentration"}: {ing.typical_pct}</p>
      <section><h2 className="font-semibold">{t(locale,"contains")} ({prods.length})</h2>
        <ul className="text-sm">{prods.slice(0,30).map((p)=>(<li key={p.product_id}><Link className="text-pink-700" href={`/${locale}/product/${productSlug(p)}`}>{p.brand} {p.name}</Link></li>))}</ul></section>
      <JsonLd data={ingredientLd(ing, url)} />
      <JsonLd data={faqLd([{ q: `${name} ${locale==="th"?"คืออะไร":"— what is it?"}`, a: mech }])} />
    </article>
  );
}
```

- [ ] **Step 2: Methodology page**

```tsx
import { type Locale } from "@/lib/i18n";
import { generatedAt } from "@/lib/data";
import { LOCALES } from "@/lib/i18n";
export function generateStaticParams() { return LOCALES.map((locale)=>({locale})); }
export default function Methodology({ params }: { params: { locale: Locale } }) {
  const th = params.locale === "th";
  return (
    <article className="space-y-3 prose">
      <h1 className="text-2xl font-bold">{th?"วิธีให้คะแนน":"How we score"}</h1>
      <p>{th?"คะแนนรวม = ส่วนผสม 45% + รีวิว 45% + ความคุ้มค่า 10%":"Total = 45% ingredient science + 45% aggregated reviews + 10% value."}</p>
      <ul className="list-disc pl-5 text-sm">
        <li>{th?"คะแนนส่วนผสม: ให้น้ำหนักตามหลักฐานของสารออกฤทธิ์ต่อปัญหานั้น หักคะแนนสารที่ควรระวัง":"Ingredient: evidence-weighted actives for the concern, minus caution-flag penalties."}</li>
        <li>{th?"คะแนนรีวิว: ค่าเฉลี่ยแบบเบย์ (ปรับตามจำนวนรีวิว)":"Review: Bayesian average adjusted by review count."}</li>
        <li>{th?"ความคุ้มค่า: ราคาต่อมล. เทียบค่ามัธยฐาน":"Value: price-per-ml vs the median."}</li>
      </ul>
      <p className="text-xs text-gray-400">{th?"อัปเดต":"Updated"}: {generatedAt()?.slice(0,10)}. {th?"ข้อมูลรีวิวจาก Konvy":"Review data from Konvy."}</p>
    </article>
  );
}
```

- [ ] **Step 3: Build check** — `cd cosmetics/web && npm run build`. Expect ingredient + methodology pages prerendered for both locales.

- [ ] **Step 4: Commit**

```bash
git add cosmetics/web/app/[locale]/ingredient cosmetics/web/app/[locale]/methodology
git commit -m "feat(web): ingredient pages + methodology"
```

---

### Task 10: llms.txt + sitemap + data commit

**Files:** Create `cosmetics/web/app/llms.txt/route.ts`, `cosmetics/web/app/sitemap.ts`; commit data files.

- [ ] **Step 1: `app/llms.txt/route.ts`**

```ts
import { CONCERNS, allProducts, productSlug } from "@/lib/data";
export const dynamic = "force-static";
export function GET() {
  const base = "https://bangkokfillers.com";
  const lines = [
    "# BangkokFillers — Thai skincare ranked by ingredient science + real reviews",
    "# Trust data, not influencers.", "",
    "## Concern rankings",
    ...CONCERNS.map((c) => `${base}/th/${c}`),
    ...CONCERNS.map((c) => `${base}/en/${c}`),
    "", "## Methodology", `${base}/th/methodology`, "",
    "## Products (Thai)",
    ...allProducts().slice(0, 500).map((p) => `${base}/th/product/${productSlug(p)}`),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
```

- [ ] **Step 2: `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { CONCERNS, allProducts, productSlug, allIngredients, ingredientSlug } from "@/lib/data";
import { LOCALES } from "@/lib/i18n";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bangkokfillers.com";
  const urls: string[] = [];
  for (const l of LOCALES) {
    urls.push(`${base}/${l}`, `${base}/${l}/methodology`);
    CONCERNS.forEach((c) => urls.push(`${base}/${l}/${c}`));
    allProducts().forEach((p) => urls.push(`${base}/${l}/product/${productSlug(p)}`));
    allIngredients().forEach(([inci]) => urls.push(`${base}/${l}/ingredient/${ingredientSlug(inci)}`));
  }
  return urls.map((url) => ({ url, lastModified: new Date() }));
}
```

- [ ] **Step 3: Build + verify**

`cd cosmetics/web && npm run build` then check `.next` built `/llms.txt` and `/sitemap.xml` routes. Run `npm test` (all lib tests still pass).

- [ ] **Step 4: Commit (incl. data files)**

```bash
git add cosmetics/web/app/llms.txt cosmetics/web/app/sitemap.ts cosmetics/web/data/ingredient_db.json cosmetics/web/data/master_db.json
git commit -m "feat(web): llms.txt, sitemap, bundle data"
```

---

### Task 11: Vercel deploy config + production build

**Files:** Create `cosmetics/web/vercel.json` (optional), document deploy.

- [ ] **Step 1: Final production build (memory-safe)**

```bash
cd cosmetics/web && NODE_OPTIONS=--max-old-space-size=4096 npm run build
```
Expected: success; build summary lists prerendered routes for home/concern/product/ingredient/methodology × th+en + llms.txt + sitemap.xml. Fix any type/render errors surfaced.

- [ ] **Step 2: Deploy (separate Vercel project)** — REQUIRED SUB-SKILL: `vercel:deployments-cicd` / `vercel:vercel-cli`. From `cosmetics/web/`: `vercel` (link a NEW project, NOT the clinic one), set the project's root directory to `cosmetics/web`, then `vercel --prod`. Add domain `bangkokfillers.com` to this project (`vercel domains add` / dashboard). Set env `NEXT_PUBLIC_AFFILIATE_WRAP` later once Involve Asia is configured.

- [ ] **Step 3: Smoke the live site** — visit `/th`, `/th/acne` (table sorts), a product page (affiliate button → Konvy, JSON-LD present via view-source), an ingredient page, `/llms.txt`, `/sitemap.xml`. Confirm hreflang/locale toggle works.

- [ ] **Step 4: Commit**

```bash
git add cosmetics/web/vercel.json
git commit -m "chore(web): vercel deploy config"
```

---

## Self-Review checklist (run after writing all tasks)
- Spec coverage: home ✓(T6) concern hub ✓(T7) product ✓(T8) ingredient ✓(T9) methodology ✓(T9); i18n th/en ✓(T3,T6); sortable table ✓(T5,T7); JSON-LD ItemList/Product/DefinedTerm/FAQ/Org ✓(T4,T7,T8,T9); llms.txt ✓(T10); affiliate ✓(T3,T5,T8); SSG ✓(generateStaticParams everywhere); deploy ✓(T11).
- llm_summary fallback present (T8) so build works before gen_summaries.
- Type names consistent (Product/IngredientEntry/RankingEntry across lib + pages).

## Open items
- Run `gen_summaries` (ANTHROPIC_API_KEY) to populate `llm_summary` before/at deploy; otherwise fallback sentences render.
- Expand `ingredient_db.json` beyond the 17 seed (richer ingredient pages).
- Real Involve Asia affiliate link template → set `NEXT_PUBLIC_AFFILIATE_WRAP`.
- shadcn/ui polish (current components are lean Tailwind); optional pass with `vercel:shadcn`.
- Pantip reviews, A/B compare, other concerns/makeup = post-MVP (Plan 3+).
