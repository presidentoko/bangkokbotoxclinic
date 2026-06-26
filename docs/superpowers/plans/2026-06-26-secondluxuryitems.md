# secondluxuryitems.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build secondluxuryitems.com — a static SEO price guide for pre-owned luxury handbags and watches, auto-updated weekly by a Python scraper.

**Architecture:** Next.js 15 App Router, fully static (no runtime DB). Python scraper writes `data/items_db.json` → git push → Vercel rebuilds. All pages generated at build time via `generateStaticParams`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, Vitest (data layer tests), Python 3 + requests + BeautifulSoup4 (scraper), Vercel.

## Global Constraints

- Project root is `deliverable/2nd/` — all file paths below are relative to it
- All prices USD, formatted as `$X,XXX` (no decimals)
- Next.js App Router only — no Pages Router, no `use client` unless required for interactivity
- All pages statically rendered — `generateStaticParams` for dynamic routes
- Affiliate links: `target="_blank" rel="noopener noreferrer"` always
- Brand slugs: `brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')`
- `data/items_db.json` is the single source of truth — never hardcode prices in components
- `params` in Next.js 15 is `Promise<{...}>` — always `await params`

---

## File Map

```
2nd/
├── app/
│   ├── layout.tsx                    # Global layout, nav, AdSense script
│   ├── globals.css                   # Tailwind base only
│   ├── page.tsx                      # Homepage: hero + brand grid by category
│   ├── handbags/page.tsx             # Handbag category: all handbag items grouped by brand
│   ├── watches/page.tsx              # Watch category: all watch items grouped by brand
│   ├── [brand]/page.tsx              # Brand page: all models for this brand
│   ├── [brand]/[model]/page.tsx      # Model page: core SEO page (price table + CTAs + FAQ)
│   ├── sitemap.ts                    # All static + dynamic URLs
│   └── robots.ts                     # Allow all, sitemap pointer
├── components/
│   ├── PriceTable.tsx                # Condition → price range table
│   ├── AffiliateCTA.tsx              # Vestiaire + RealReal buttons
│   └── BrandCard.tsx                 # Brand link card with model count
├── data/
│   └── items_db.json                 # Scraper output + seed data
├── lib/
│   ├── data.ts                       # Typed getters over items_db.json
│   └── __tests__/
│       └── data.test.ts              # Vitest unit tests for data.ts
├── scraper/
│   ├── price_sampler.py              # Weekly Vestiaire scraper
│   └── test_price_sampler.py         # pytest unit tests for pure logic
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `vitest.config.ts`, `app/globals.css`

**Interfaces:**
- Produces: runnable dev server at `localhost:3000`, `npm test` runs Vitest

- [ ] **Step 1: Scaffold Next.js project**

From `deliverable/` parent, run inside `2nd/`:

```bash
cd 2nd
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-import-alias --yes
```

- [ ] **Step 2: Install Vitest**

```bash
npm install -D vitest @vitejs/plugin-react
```

- [ ] **Step 3: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: { environment: 'node' },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
})
```

- [ ] **Step 4: Add test script to `package.json`**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run"
```

- [ ] **Step 5: Verify scaffold**

```bash
npm run dev
```
Expected: server starts, `localhost:3000` returns default Next.js page.

```bash
npm test
```
Expected: "No test files found" (not an error).

- [ ] **Step 6: Commit**

```bash
git add 2nd/
git commit -m "feat: scaffold secondluxuryitems Next.js project"
```

---

### Task 2: Seed Data

**Files:**
- Create: `data/items_db.json`

**Interfaces:**
- Produces: `data/items_db.json` with 13 items across 10 brands — consumed by `lib/data.ts`

- [ ] **Step 1: Create `data/items_db.json`**

```json
{
  "items": [
    {
      "id": "chanel-classic-flap-medium",
      "brand": "Chanel",
      "model": "Classic Flap Medium",
      "category": "handbags",
      "slug": "chanel/classic-flap-medium",
      "retail_price_usd": 10800,
      "price_ranges": {
        "excellent": { "min": 5500, "max": 7500 },
        "very_good": { "min": 4000, "max": 5800 },
        "good":      { "min": 2800, "max": 4200 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=chanel+classic+flap+medium",
        "therealreal": "https://www.therealreal.com/search?query=chanel+classic+flap+medium"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "chanel-boy-medium",
      "brand": "Chanel",
      "model": "Boy Bag Medium",
      "category": "handbags",
      "slug": "chanel/boy-bag-medium",
      "retail_price_usd": 7700,
      "price_ranges": {
        "excellent": { "min": 3800, "max": 5500 },
        "very_good": { "min": 2800, "max": 4000 },
        "good":      { "min": 1800, "max": 2800 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=chanel+boy+bag+medium",
        "therealreal": "https://www.therealreal.com/search?query=chanel+boy+bag+medium"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "louis-vuitton-neverfull-mm",
      "brand": "Louis Vuitton",
      "model": "Neverfull MM",
      "category": "handbags",
      "slug": "louis-vuitton/neverfull-mm",
      "retail_price_usd": 1790,
      "price_ranges": {
        "excellent": { "min": 900, "max": 1300 },
        "very_good": { "min": 650, "max": 950 },
        "good":      { "min": 400, "max": 680 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=louis+vuitton+neverfull+mm",
        "therealreal": "https://www.therealreal.com/search?query=louis+vuitton+neverfull+mm"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "louis-vuitton-speedy-30",
      "brand": "Louis Vuitton",
      "model": "Speedy 30",
      "category": "handbags",
      "slug": "louis-vuitton/speedy-30",
      "retail_price_usd": 1330,
      "price_ranges": {
        "excellent": { "min": 600, "max": 900 },
        "very_good": { "min": 420, "max": 680 },
        "good":      { "min": 260, "max": 460 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=louis+vuitton+speedy+30",
        "therealreal": "https://www.therealreal.com/search?query=louis+vuitton+speedy+30"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "hermes-birkin-30",
      "brand": "Hermès",
      "model": "Birkin 30",
      "category": "handbags",
      "slug": "hermes/birkin-30",
      "retail_price_usd": 12000,
      "price_ranges": {
        "excellent": { "min": 18000, "max": 35000 },
        "very_good": { "min": 14000, "max": 22000 },
        "good":      { "min": 9000,  "max": 15000 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=hermes+birkin+30",
        "therealreal": "https://www.therealreal.com/search?query=hermes+birkin+30"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "hermes-kelly-28",
      "brand": "Hermès",
      "model": "Kelly 28",
      "category": "handbags",
      "slug": "hermes/kelly-28",
      "retail_price_usd": 11000,
      "price_ranges": {
        "excellent": { "min": 15000, "max": 28000 },
        "very_good": { "min": 12000, "max": 18000 },
        "good":      { "min": 8000,  "max": 13000 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=hermes+kelly+28",
        "therealreal": "https://www.therealreal.com/search?query=hermes+kelly+28"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "gucci-gg-marmont-medium",
      "brand": "Gucci",
      "model": "GG Marmont Medium",
      "category": "handbags",
      "slug": "gucci/gg-marmont-medium",
      "retail_price_usd": 1650,
      "price_ranges": {
        "excellent": { "min": 700, "max": 1050 },
        "very_good": { "min": 500, "max": 780 },
        "good":      { "min": 300, "max": 550 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=gucci+gg+marmont+medium",
        "therealreal": "https://www.therealreal.com/search?query=gucci+gg+marmont+medium"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "dior-lady-dior-medium",
      "brand": "Dior",
      "model": "Lady Dior Medium",
      "category": "handbags",
      "slug": "dior/lady-dior-medium",
      "retail_price_usd": 5900,
      "price_ranges": {
        "excellent": { "min": 2800, "max": 4200 },
        "very_good": { "min": 2000, "max": 3100 },
        "good":      { "min": 1200, "max": 2100 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=dior+lady+dior+medium",
        "therealreal": "https://www.therealreal.com/search?query=dior+lady+dior+medium"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "rolex-submariner",
      "brand": "Rolex",
      "model": "Submariner",
      "category": "watches",
      "slug": "rolex/submariner",
      "retail_price_usd": 9100,
      "price_ranges": {
        "excellent": { "min": 13000, "max": 16500 },
        "very_good": { "min": 11000, "max": 14000 },
        "good":      { "min": 8500,  "max": 12000 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=rolex+submariner",
        "therealreal": "https://www.therealreal.com/search?query=rolex+submariner"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "rolex-datejust-41",
      "brand": "Rolex",
      "model": "Datejust 41",
      "category": "watches",
      "slug": "rolex/datejust-41",
      "retail_price_usd": 7100,
      "price_ranges": {
        "excellent": { "min": 7500, "max": 9800 },
        "very_good": { "min": 6500, "max": 8200 },
        "good":      { "min": 5200, "max": 7000 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=rolex+datejust+41",
        "therealreal": "https://www.therealreal.com/search?query=rolex+datejust+41"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "patek-philippe-nautilus-5711",
      "brand": "Patek Philippe",
      "model": "Nautilus 5711",
      "category": "watches",
      "slug": "patek-philippe/nautilus-5711",
      "retail_price_usd": 35000,
      "price_ranges": {
        "excellent": { "min": 100000, "max": 160000 },
        "very_good": { "min": 85000,  "max": 120000 },
        "good":      { "min": 70000,  "max": 95000 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=patek+philippe+nautilus+5711",
        "therealreal": "https://www.therealreal.com/search?query=patek+philippe+nautilus+5711"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "audemars-piguet-royal-oak-15500",
      "brand": "Audemars Piguet",
      "model": "Royal Oak 15500",
      "category": "watches",
      "slug": "audemars-piguet/royal-oak-15500",
      "retail_price_usd": 24800,
      "price_ranges": {
        "excellent": { "min": 28000, "max": 45000 },
        "very_good": { "min": 24000, "max": 36000 },
        "good":      { "min": 18000, "max": 27000 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=audemars+piguet+royal+oak+15500",
        "therealreal": "https://www.therealreal.com/search?query=audemars+piguet+royal+oak"
      },
      "last_updated": "2026-06-26"
    },
    {
      "id": "cartier-tank-solo",
      "brand": "Cartier",
      "model": "Tank Solo",
      "category": "watches",
      "slug": "cartier/tank-solo",
      "retail_price_usd": 3200,
      "price_ranges": {
        "excellent": { "min": 1800, "max": 2800 },
        "very_good": { "min": 1400, "max": 2200 },
        "good":      { "min": 900,  "max": 1600 }
      },
      "price_samples": [],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=cartier+tank+solo",
        "therealreal": "https://www.therealreal.com/search?query=cartier+tank+solo"
      },
      "last_updated": "2026-06-26"
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add 2nd/data/items_db.json
git commit -m "feat: add seed items_db.json with 13 luxury items"
```

---

### Task 3: Data Layer

**Files:**
- Create: `lib/data.ts`
- Create: `lib/__tests__/data.test.ts`

**Interfaces:**
- Consumes: `data/items_db.json`
- Produces:
  - `getAllItems(): Item[]`
  - `getItemsByCategory(category: Category): Item[]`
  - `getItemsByBrand(brandSlug: string): Item[]`
  - `getItemBySlug(brandSlug: string, modelSlug: string): Item | undefined`
  - `getAllBrands(): BrandSummary[]`
  - `toBrandSlug(brand: string): string`
  - `formatPrice(price: number): string`
  - `getPriceVsRetail(range: PriceRange, retail: number): string`

- [ ] **Step 1: Write failing tests**

Create `lib/__tests__/data.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  getAllItems,
  getItemsByCategory,
  getItemsByBrand,
  getItemBySlug,
  getAllBrands,
  toBrandSlug,
  formatPrice,
  getPriceVsRetail,
} from '../data'

describe('toBrandSlug', () => {
  it('lowercases and hyphenates', () => {
    expect(toBrandSlug('Louis Vuitton')).toBe('louis-vuitton')
    expect(toBrandSlug('Audemars Piguet')).toBe('audemars-piguet')
    expect(toBrandSlug('Hermès')).toBe('hermes')
  })
})

describe('formatPrice', () => {
  it('formats with dollar sign and commas', () => {
    expect(formatPrice(10800)).toBe('$10,800')
    expect(formatPrice(500)).toBe('$500')
  })
})

describe('getPriceVsRetail', () => {
  it('shows savings when resale < retail', () => {
    const result = getPriceVsRetail({ min: 4000, max: 5800 }, 10800)
    expect(result).toMatch(/-\d+%/)
  })
  it('shows premium when resale > retail', () => {
    const result = getPriceVsRetail({ min: 18000, max: 35000 }, 12000)
    expect(result).toMatch(/\+\d+%/)
  })
})

describe('getAllItems', () => {
  it('returns all 13 items', () => {
    expect(getAllItems()).toHaveLength(13)
  })
})

describe('getItemsByCategory', () => {
  it('filters handbags', () => {
    const bags = getItemsByCategory('handbags')
    expect(bags.length).toBeGreaterThan(0)
    bags.forEach(i => expect(i.category).toBe('handbags'))
  })
  it('filters watches', () => {
    const watches = getItemsByCategory('watches')
    expect(watches.length).toBeGreaterThan(0)
    watches.forEach(i => expect(i.category).toBe('watches'))
  })
})

describe('getItemsByBrand', () => {
  it('returns Chanel items by slug', () => {
    const items = getItemsByBrand('chanel')
    expect(items.length).toBe(2)
    items.forEach(i => expect(i.brand).toBe('Chanel'))
  })
})

describe('getItemBySlug', () => {
  it('finds item by brand + model slug', () => {
    const item = getItemBySlug('chanel', 'classic-flap-medium')
    expect(item?.id).toBe('chanel-classic-flap-medium')
  })
  it('returns undefined for unknown slug', () => {
    expect(getItemBySlug('unknown', 'nope')).toBeUndefined()
  })
})

describe('getAllBrands', () => {
  it('deduplicates brands', () => {
    const brands = getAllBrands()
    const slugs = brands.map(b => b.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('counts models correctly for Chanel', () => {
    const chanel = getAllBrands().find(b => b.slug === 'chanel')
    expect(chanel?.count).toBe(2)
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npm test
```
Expected: FAIL — `Cannot find module '../data'`

- [ ] **Step 3: Create `lib/data.ts`**

```typescript
import db from '@/data/items_db.json'

export type Condition = 'excellent' | 'very_good' | 'good'
export type Category = 'handbags' | 'watches'

export interface PriceRange {
  min: number
  max: number
}

export interface PriceSample {
  price: number
  condition: Condition
  platform: string
  date: string
}

export interface Item {
  id: string
  brand: string
  model: string
  category: Category
  slug: string
  retail_price_usd: number
  price_ranges: Partial<Record<Condition, PriceRange>>
  price_samples: PriceSample[]
  affiliate_links: { vestiaire: string; therealreal: string }
  last_updated: string
}

export interface BrandSummary {
  brand: string
  slug: string
  count: number
  category: Category
}

const items = (db as { items: Item[] }).items

export function getAllItems(): Item[] { return items }

export function getItemsByCategory(category: Category): Item[] {
  return items.filter(i => i.category === category)
}

export function getItemsByBrand(brandSlug: string): Item[] {
  return items.filter(i => toBrandSlug(i.brand) === brandSlug)
}

export function getItemBySlug(brandSlug: string, modelSlug: string): Item | undefined {
  return items.find(i => i.slug === `${brandSlug}/${modelSlug}`)
}

export function getAllBrands(): BrandSummary[] {
  const map = new Map<string, BrandSummary>()
  for (const item of items) {
    const slug = toBrandSlug(item.brand)
    const existing = map.get(slug)
    if (existing) {
      existing.count++
    } else {
      map.set(slug, { brand: item.brand, slug, count: 1, category: item.category })
    }
  }
  return Array.from(map.values())
}

export function toBrandSlug(brand: string): string {
  return brand
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // strip diacritics: Hermès → Hermes
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function getPriceVsRetail(range: PriceRange, retail: number): string {
  if (retail === 0) return 'N/A'
  const midpoint = (range.min + range.max) / 2
  const pct = Math.round(((midpoint - retail) / retail) * 100)
  return pct > 0 ? `+${pct}%` : `${pct}%`
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```
Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add 2nd/lib/
git commit -m "feat: add data layer with typed getters and tests"
```

---

### Task 4: Shared Components

**Files:**
- Create: `components/PriceTable.tsx`
- Create: `components/AffiliateCTA.tsx`
- Create: `components/BrandCard.tsx`

**Interfaces:**
- Consumes: `Item`, `BrandSummary`, `formatPrice`, `getPriceVsRetail` from `@/lib/data`
- Produces: React components used in Tasks 5–7

- [ ] **Step 1: Create `components/PriceTable.tsx`**

```tsx
import { Item, Condition, PriceRange, formatPrice, getPriceVsRetail } from '@/lib/data'

const CONDITIONS: { key: Condition; label: string }[] = [
  { key: 'excellent', label: 'Excellent' },
  { key: 'very_good', label: 'Very Good' },
  { key: 'good',      label: 'Good' },
]

export function PriceTable({ item }: { item: Item }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-3 border border-gray-200 font-semibold">Condition</th>
            <th className="p-3 border border-gray-200 font-semibold">Price Range</th>
            <th className="p-3 border border-gray-200 font-semibold">vs Retail ({formatPrice(item.retail_price_usd)})</th>
          </tr>
        </thead>
        <tbody>
          {CONDITIONS.map(({ key, label }) => {
            const range = item.price_ranges[key]
            if (!range) return null
            const diff = getPriceVsRetail(range, item.retail_price_usd)
            const isAboveRetail = diff.startsWith('+')
            return (
              <tr key={key} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200 font-medium">{label}</td>
                <td className="p-3 border border-gray-200">
                  {formatPrice(range.min)} – {formatPrice(range.max)}
                </td>
                <td className={`p-3 border border-gray-200 font-medium ${isAboveRetail ? 'text-orange-600' : 'text-green-700'}`}>
                  {diff}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2">
        Last updated: {item.last_updated} · Prices vary by seller and provenance
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/AffiliateCTA.tsx`**

```tsx
import { Item } from '@/lib/data'

export function AffiliateCTA({ item }: { item: Item }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 my-8">
      <a
        href={item.affiliate_links.vestiaire}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-black text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Browse on Vestiaire Collective →
      </a>
      <a
        href={item.affiliate_links.therealreal}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 border-2 border-black text-black text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        Shop on The RealReal →
      </a>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/BrandCard.tsx`**

```tsx
import Link from 'next/link'
import { BrandSummary } from '@/lib/data'

export function BrandCard({ brand, slug, count }: BrandSummary) {
  return (
    <Link
      href={`/${slug}`}
      className="block p-5 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <h2 className="font-semibold text-lg">{brand}</h2>
      <p className="text-sm text-gray-500 mt-1">{count} model{count !== 1 ? 's' : ''} tracked</p>
    </Link>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add 2nd/components/
git commit -m "feat: add PriceTable, AffiliateCTA, BrandCard components"
```

---

### Task 5: Layout and Homepage

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getAllBrands`, `getItemsByCategory` from `@/lib/data`; `BrandCard` from `@/components/BrandCard`

- [ ] **Step 1: Update `app/globals.css`**

Replace contents with:

```css
@import "tailwindcss";
```

- [ ] **Step 2: Update `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Second Luxury Items — Pre-Owned Luxury Price Guide',
  description: 'Find the real price of pre-owned Chanel, Louis Vuitton, Rolex and more. Compare second-hand luxury prices updated weekly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <header className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg tracking-tight">
              Second Luxury Items
            </a>
            <nav className="flex gap-6 text-sm text-gray-600">
              <a href="/handbags" className="hover:text-gray-900">Handbags</a>
              <a href="/watches" className="hover:text-gray-900">Watches</a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-100 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-400">
            <p>Prices are estimates based on recent market data. Always verify current listings before purchasing.</p>
            <p className="mt-1">© {new Date().getFullYear()} SecondLuxuryItems.com</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Update `app/page.tsx`**

```tsx
import { getAllBrands, getItemsByCategory } from '@/lib/data'
import { BrandCard } from '@/components/BrandCard'

export default function HomePage() {
  const handbagBrands = getAllBrands().filter(b => b.category === 'handbags')
  const watchBrands   = getAllBrands().filter(b => b.category === 'watches')

  return (
    <>
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Pre-Owned Luxury Price Guide</h1>
        <p className="text-gray-600 text-lg">
          Real second-hand prices for Chanel, Louis Vuitton, Rolex and more — updated weekly from live listings.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href="/handbags" className="hover:underline">Handbags</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {handbagBrands.map(b => <BrandCard key={b.slug} {...b} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          <a href="/watches" className="hover:underline">Watches</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {watchBrands.map(b => <BrandCard key={b.slug} {...b} />)}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 4: Check dev server**

```bash
npm run dev
```
Visit `localhost:3000` — expect homepage with two brand grids.

- [ ] **Step 5: Commit**

```bash
git add 2nd/app/layout.tsx 2nd/app/globals.css 2nd/app/page.tsx
git commit -m "feat: homepage with brand grids"
```

---

### Task 6: Category and Brand Pages

**Files:**
- Create: `app/handbags/page.tsx`
- Create: `app/watches/page.tsx`
- Create: `app/[brand]/page.tsx`

**Interfaces:**
- Consumes: `getItemsByCategory`, `getItemsByBrand`, `getAllBrands`, `getAllItems`, `toBrandSlug` from `@/lib/data`

- [ ] **Step 1: Create `app/handbags/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByCategory, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Used Luxury Handbag Prices — Chanel, LV, Hermès | SecondLuxuryItems',
  description: 'Compare pre-owned prices for Chanel, Louis Vuitton, Hermès, Gucci and more. Updated weekly from real listings.',
}

export default function HandbagsPage() {
  const items = getItemsByCategory('handbags')
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Pre-Owned Handbag Prices</h1>
      <p className="text-gray-600 mb-8">Current second-hand price ranges for top luxury handbag brands.</p>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const [brand, model] = item.slug.split('/')
          const vg = item.price_ranges.very_good
          return (
            <Link key={item.id} href={`/${item.slug}`} className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <div>
                <span className="font-medium">{item.brand} {item.model}</span>
              </div>
              <div className="text-right text-sm text-gray-500">
                {vg ? `${formatPrice(vg.min)} – ${formatPrice(vg.max)}` : 'See guide'}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create `app/watches/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByCategory, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Used Luxury Watch Prices — Rolex, Patek, AP | SecondLuxuryItems',
  description: 'Compare pre-owned prices for Rolex, Patek Philippe, Audemars Piguet and Cartier. Updated weekly from real listings.',
}

export default function WatchesPage() {
  const items = getItemsByCategory('watches')
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Pre-Owned Watch Prices</h1>
      <p className="text-gray-600 mb-8">Current second-hand price ranges for top luxury watch brands.</p>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          return (
            <Link key={item.id} href={`/${item.slug}`} className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <div>
                <span className="font-medium">{item.brand} {item.model}</span>
              </div>
              <div className="text-right text-sm text-gray-500">
                {vg ? `${formatPrice(vg.min)} – ${formatPrice(vg.max)}` : 'See guide'}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Create `app/[brand]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemsByBrand, getAllBrands, formatPrice } from '@/lib/data'

interface Props { params: Promise<{ brand: string }> }

export async function generateStaticParams() {
  return getAllBrands().map(b => ({ brand: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) return {}
  const brandName = items[0].brand
  return {
    title: `Used ${brandName} Prices — Pre-Owned Price Guide | SecondLuxuryItems`,
    description: `Current second-hand prices for ${brandName}. Compare ${items.length} models with price ranges by condition.`,
  }
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) notFound()
  const brandName = items[0].brand

  return (
    <>
      <p className="text-sm text-gray-400 mb-2">
        <Link href="/">Home</Link> › {brandName}
      </p>
      <h1 className="text-3xl font-bold mb-2">Used {brandName} Prices</h1>
      <p className="text-gray-600 mb-8">Pre-owned price guide for {items.length} {brandName} model{items.length !== 1 ? 's' : ''}.</p>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          return (
            <Link key={item.id} href={`/${item.slug}`} className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.model}</span>
              <span className="text-sm text-gray-500">
                {vg ? `${formatPrice(vg.min)} – ${formatPrice(vg.max)}` : 'See guide'}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 4: Verify pages**

```bash
npm run dev
```
Visit: `localhost:3000/handbags`, `localhost:3000/watches`, `localhost:3000/chanel`
Expected: pages render with item lists.

- [ ] **Step 5: Commit**

```bash
git add 2nd/app/handbags 2nd/app/watches 2nd/app/[brand]
git commit -m "feat: category and brand pages"
```

---

### Task 7: Model Page (Core SEO Page)

**Files:**
- Create: `app/[brand]/[model]/page.tsx`

**Interfaces:**
- Consumes: `getItemBySlug`, `getAllItems`, `formatPrice`, `getPriceVsRetail` from `@/lib/data`; `PriceTable`, `AffiliateCTA` from components

- [ ] **Step 1: Create `app/[brand]/[model]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemBySlug, getAllItems, formatPrice, Item } from '@/lib/data'
import { PriceTable } from '@/components/PriceTable'
import { AffiliateCTA } from '@/components/AffiliateCTA'

interface Props { params: Promise<{ brand: string; model: string }> }

export async function generateStaticParams() {
  return getAllItems().map(item => {
    const [brand, model] = item.slug.split('/')
    return { brand, model }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) return {}
  const vg = item.price_ranges.very_good
  const priceHint = vg ? ` Current prices: ${formatPrice(vg.min)}–${formatPrice(vg.max)}.` : ''
  return {
    title: `Used ${item.brand} ${item.model} Price Guide (2026)`,
    description: `How much does a second hand ${item.brand} ${item.model} cost?${priceHint} Updated ${item.last_updated}.`,
  }
}

function getFAQs(item: Item) {
  const name = `${item.brand} ${item.model}`
  const vg = item.price_ranges.very_good
  const savingsPct = vg
    ? Math.round(((item.retail_price_usd - (vg.min + vg.max) / 2) / item.retail_price_usd) * 100)
    : null

  if (item.category === 'handbags') {
    return [
      {
        q: `Is buying a used ${name} worth it?`,
        a: savingsPct && savingsPct > 0
          ? `Yes — a pre-owned ${item.model} typically costs around ${savingsPct}% less than retail while maintaining strong resale value. ${item.brand} bags are well known for holding their value.`
          : `The ${item.model} often sells above retail on the secondary market due to high demand. Buying pre-owned can offer immediate availability without waitlists.`,
      },
      {
        q: 'Which condition should I buy?',
        a: '"Very Good" is the sweet spot — significant savings over "Excellent" while still looking great. Only go "Good" if you plan heavy everyday use.',
      },
      {
        q: `How do I authenticate a pre-owned ${item.brand} bag?`,
        a: `Buy from reputable platforms like Vestiaire Collective or The RealReal that authenticate every item. Check serial numbers, hardware quality, and stitching consistency. For high-value pieces, consider a third-party authenticator.`,
      },
    ]
  }
  return [
    {
      q: `Does a pre-owned ${name} hold its value?`,
      a: savingsPct && savingsPct < 0
        ? `The ${item.model} consistently sells above retail on the secondary market. It is one of the strongest value-holding timepieces available.`
        : `${item.brand} watches are among the strongest value-holders in the pre-owned market, making the ${item.model} a sound purchase.`,
    },
    {
      q: `What should I check when buying a used ${item.model}?`,
      a: 'Verify the serial number, look for a full set (box and papers), inspect the case and bracelet for wear, and confirm service history. Always buy from authenticated platforms.',
    },
    {
      q: `Is buying a pre-owned ${item.model} risky?`,
      a: 'Not when buying from reputable platforms. Vestiaire Collective and The RealReal authenticate all timepieces before listing. Avoid private sales without independent expert verification.',
    },
  ]
}

export default async function ModelPage({ params }: Props) {
  const { brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) notFound()

  const faqs = getFAQs(item)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p className="text-sm text-gray-400 mb-2">
        <Link href="/">Home</Link> ›{' '}
        <Link href={`/${brand}`}>{item.brand}</Link> ›{' '}
        {item.model}
      </p>

      <h1 className="text-3xl font-bold mb-2">
        Used {item.brand} {item.model} Price Guide (2026)
      </h1>
      <p className="text-gray-600 mb-6">
        Current pre-owned market prices for the {item.model} by condition. Retail: {formatPrice(item.retail_price_usd)}.
      </p>

      {/* AdSense slot — top */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense top]</div>

      <PriceTable item={item} />

      <AffiliateCTA item={item} />

      {/* AdSense slot — middle */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense middle]</div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i}>
              <dt className="font-medium text-gray-900">{faq.q}</dt>
              <dd className="mt-1 text-gray-600">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* AdSense slot — bottom */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense bottom]</div>
    </>
  )
}
```

- [ ] **Step 2: Verify model page**

```bash
npm run dev
```
Visit: `localhost:3000/chanel/classic-flap-medium`
Expected: price table, two CTA buttons, FAQ section with structured data.

- [ ] **Step 3: Commit**

```bash
git add "2nd/app/[brand]/[model]/"
git commit -m "feat: model page with price table, CTAs, FAQ schema"
```

---

### Task 8: SEO — Sitemap and Robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `getAllItems`, `getAllBrands` from `@/lib/data`

- [ ] **Step 1: Create `app/sitemap.ts`**

```typescript
import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE}/handbags`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/watches`,  lastModified: new Date(), priority: 0.8 },
  ]

  const brandRoutes: MetadataRoute.Sitemap = brands.map(b => ({
    url: `${BASE}/${b.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }))

  const modelRoutes: MetadataRoute.Sitemap = items.map(item => ({
    url: `${BASE}/${item.slug}`,
    lastModified: new Date(item.last_updated),
    priority: 0.9,
  }))

  return [...staticRoutes, ...brandRoutes, ...modelRoutes]
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.secondluxuryitems.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verify sitemap**

```bash
npm run build && npm run start
```
Visit: `localhost:3000/sitemap.xml` — expect XML with all URLs.
Visit: `localhost:3000/robots.txt` — expect allow all + sitemap pointer.

- [ ] **Step 4: Commit**

```bash
git add 2nd/app/sitemap.ts 2nd/app/robots.ts
git commit -m "feat: sitemap and robots.txt"
```

---

### Task 9: Python Scraper

**Files:**
- Create: `scraper/price_sampler.py`
- Create: `scraper/test_price_sampler.py`

**Interfaces:**
- Consumes: `data/items_db.json`
- Produces: updated `data/items_db.json` with fresh `price_samples` + recalculated `price_ranges`; git commit + push

- [ ] **Step 1: Write failing tests**

Create `scraper/test_price_sampler.py`:

```python
import pytest
from price_sampler import normalize_condition, recalculate_ranges, trim_samples

def test_normalize_condition_excellent():
    assert normalize_condition('Excellent condition') == 'excellent'
    assert normalize_condition('Like new') == 'excellent'
    assert normalize_condition('Never worn') == 'excellent'

def test_normalize_condition_very_good():
    assert normalize_condition('Very good') == 'very_good'
    assert normalize_condition('Great') == 'very_good'

def test_normalize_condition_fallback():
    assert normalize_condition('Good') == 'good'
    assert normalize_condition('Fair') == 'good'
    assert normalize_condition('') == 'good'

def test_recalculate_ranges_basic():
    samples = [
        {'price': 5000, 'condition': 'excellent'},
        {'price': 6000, 'condition': 'excellent'},
        {'price': 3500, 'condition': 'good'},
    ]
    result = recalculate_ranges(samples)
    assert result['excellent'] == {'min': 5000, 'max': 6000}
    assert result['good'] == {'min': 3500, 'max': 3500}

def test_recalculate_ranges_empty():
    assert recalculate_ranges([]) == {}

def test_trim_samples_keeps_latest_30():
    samples = [{'price': i, 'condition': 'excellent', 'date': f'2026-01-{i:02d}', 'platform': 'vestiaire'} for i in range(1, 41)]
    result = trim_samples(samples)
    assert len(result) == 30
    assert result[0]['price'] == 11  # oldest 10 dropped
```

- [ ] **Step 2: Run tests — expect failures**

```bash
cd 2nd/scraper
python -m pytest test_price_sampler.py -v
```
Expected: ImportError / FAIL

- [ ] **Step 3: Create `scraper/price_sampler.py`**

```python
#!/usr/bin/env python3
"""
Weekly scraper: Vestiaire Collective search → items_db.json price update.
Run from repo root: python 2nd/scraper/price_sampler.py
"""
import json
import re
import time
import random
import subprocess
from datetime import datetime
from pathlib import Path
import requests
from bs4 import BeautifulSoup

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
]


def normalize_condition(raw: str) -> str:
    raw = raw.lower()
    if any(k in raw for k in ('excellent', 'like new', 'never worn', 'mint', 'pristine')):
        return 'excellent'
    if any(k in raw for k in ('very good', 'great', 'near mint')):
        return 'very_good'
    return 'good'


def recalculate_ranges(samples: list[dict]) -> dict:
    by_cond: dict[str, list[float]] = {}
    for s in samples:
        cond = s['condition']
        by_cond.setdefault(cond, []).append(s['price'])
    return {
        cond: {'min': int(min(prices)), 'max': int(max(prices))}
        for cond, prices in by_cond.items()
        if prices
    }


def trim_samples(samples: list[dict], keep: int = 30) -> list[dict]:
    return sorted(samples, key=lambda s: s['date'])[-keep:]


def fetch_vestiaire_prices(query: str) -> list[dict]:
    url = f"https://www.vestiairecollective.com/search/?q={query.replace(' ', '+')}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    try:
        resp = requests.get(url, headers=headers, timeout=20)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f'  [warn] request failed: {e}')
        return []

    match = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        resp.text, re.DOTALL
    )
    if not match:
        print('  [warn] __NEXT_DATA__ not found')
        return []

    try:
        data = json.loads(match.group(1))
        products = (
            data.get('props', {})
                .get('pageProps', {})
                .get('products', {})
                .get('items', [])
        )
    except (json.JSONDecodeError, AttributeError):
        return []

    today = datetime.now().strftime('%Y-%m-%d')
    results = []
    for p in products[:30]:
        price_data = p.get('price', {})
        cents = price_data.get('cents') or price_data.get('amount')
        if not cents:
            continue
        results.append({
            'price': round(cents / 100, 2),
            'condition': normalize_condition(p.get('condition', '')),
            'platform': 'vestiaire',
            'date': today,
        })
    return results


def run():
    with open(DB_PATH) as f:
        db = json.load(f)

    for item in db['items']:
        query = f"{item['brand']} {item['model']}"
        print(f'Fetching: {query}')
        new_samples = fetch_vestiaire_prices(query)
        print(f'  Got {len(new_samples)} samples')

        if new_samples:
            item['price_samples'] = trim_samples(
                item.get('price_samples', []) + new_samples
            )
            item['price_ranges'] = recalculate_ranges(item['price_samples'])
            item['last_updated'] = datetime.now().strftime('%Y-%m-%d')

        time.sleep(random.uniform(3, 8))

    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print('items_db.json updated')

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    subprocess.run(['git', 'commit', '-m', f'chore(data): price update {datetime.now():%Y-%m-%d}'], check=True)
    subprocess.run(['git', 'push'], check=True)
    print('Pushed.')


if __name__ == '__main__':
    run()
```

- [ ] **Step 4: Run tests — expect pass**

```bash
cd 2nd/scraper
pip install requests beautifulsoup4
python -m pytest test_price_sampler.py -v
```
Expected: all tests PASS

- [ ] **Step 5: Register in watchdog**

In `scripts/watchdog.py`, add to the process list:

```python
{
    'name': 'secondluxury_scraper',
    'cmd': ['python', '2nd/scraper/price_sampler.py'],
    'cwd': ROOT,
    'interval_hours': 168,  # weekly
},
```

- [ ] **Step 6: Commit**

```bash
git add 2nd/scraper/
git commit -m "feat: price_sampler.py weekly scraper with tests"
```

---

### Task 10: Vercel Deploy

**Files:**
- Create: `2nd/vercel.json`

**Interfaces:**
- Produces: live site at `secondluxuryitems.com`

- [ ] **Step 1: Create `2nd/vercel.json`**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

- [ ] **Step 2: Build locally to confirm zero errors**

```bash
cd 2nd
npm run build
```
Expected: build completes, pages generated count ≥ 18 (1 home + 2 category + 10 brand + 13 model + sitemap + robots).

- [ ] **Step 3: Deploy to Vercel (preview)**

```bash
cd 2nd
vercel --scope chillanel22-6095s-projects
```
Expected: preview URL returned, pages load correctly.

- [ ] **Step 4: Add custom domain and deploy to production**

In Vercel dashboard: add `secondluxuryitems.com` domain to the project, then:

```bash
vercel --prod --scope chillanel22-6095s-projects
```

- [ ] **Step 5: Replace AdSense placeholders**

Once AdSense is approved, replace the three `[AdSense top/middle/bottom]` placeholder `<div>`s in `app/[brand]/[model]/page.tsx` with actual `<ins class="adsbygoogle">` tags and add the AdSense script to `app/layout.tsx`.

- [ ] **Step 6: Final commit**

```bash
git add 2nd/vercel.json
git commit -m "feat: vercel config for secondluxuryitems"
```
