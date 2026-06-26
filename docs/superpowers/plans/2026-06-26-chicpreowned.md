# chicpreowned.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `chicpreowned.com` — a bilingual (EN + TH) SEO price guide for second-hand luxury goods in Thailand, backed by Carousell Thailand + C2C.in.th price data.

**Architecture:** Next.js App Router with next-intl for `/en/` and `/th/` URL prefixes, static JSON data (items_db.json with THB prices), Python scraper → git push → Vercel auto-build pipeline. Sister site to `secondluxuryitems.com` (already live at `2nd/`).

**Tech Stack:** Next.js 16.2.9, React 19.2.4, next-intl ^3, Tailwind CSS 4, Vitest, Python requests + BeautifulSoup + Playwright (scraper)

## Global Constraints

- Project root: `3rd/` (sibling to `2nd/` — do NOT put files inside `2nd/`)
- Next.js version: exactly `16.2.9` (match `2nd/package.json`)
- `params` is always `Promise<{...}>` in Next.js 16 — always `await params`
- Currency: THB throughout — field is `retail_price_thb` (NOT `retail_price_usd`)
- Locale prefixes: `/en/` and `/th/` — no bare `/brand/model` routes
- Platform values in price_samples: `carousell_th` or `c2c_th` only
- `affiliate_links` shape: `{ carousell: string }` (NOT vestiaire/therealreal)
- Category type: `'handbags' | 'watches' | 'clothing'`
- Tailwind 4 syntax: `@import "tailwindcss"` (one line, no config file needed)
- `@/` alias maps to `3rd/` project root (same as `2nd/`)
- Vercel project name: `chicpreowned`, scope: `yunmin`
- **AGENTS.md warning:** Next.js 16 has breaking changes vs prior versions. Before writing any page or component code, read `3rd/node_modules/next/dist/docs/` for current APIs.

---

## File Map

```
3rd/
├── package.json
├── tsconfig.json
├── next.config.ts
├── i18n.ts                               # next-intl routing config
├── middleware.ts                          # locale detection + redirect
├── vitest.config.ts
├── vercel.json
├── app/
│   ├── globals.css                        # @import "tailwindcss"
│   ├── page.tsx                           # root → redirect /en/
│   ├── sitemap.ts                         # all EN+TH URLs
│   ├── robots.ts
│   └── [locale]/
│       ├── layout.tsx                     # NextIntlClientProvider + header/footer
│       ├── page.tsx                       # homepage: 3 category brand grids
│       ├── handbags/page.tsx
│       ├── watches/page.tsx
│       ├── clothing/page.tsx
│       ├── [brand]/page.tsx               # model list for a brand
│       └── [brand]/[model]/page.tsx       # core SEO page
├── messages/
│   ├── en.json
│   └── th.json
├── components/
│   ├── PriceTable.tsx                     # receives conditionLabels as props
│   ├── AffiliateCTA.tsx                   # Carousell CTA
│   └── BrandCard.tsx                      # locale-aware href
├── data/
│   └── items_db.json                      # 22 items, THB prices
├── lib/
│   ├── data.ts
│   └── __tests__/
│       └── data.test.ts
└── scraper/
    ├── price_sampler.py
    └── test_price_sampler.py
```

---

### Task 1: Project Scaffold + next-intl Config

**Files:**
- Create: `3rd/package.json`
- Create: `3rd/tsconfig.json`
- Create: `3rd/next.config.ts`
- Create: `3rd/i18n.ts`
- Create: `3rd/middleware.ts`
- Create: `3rd/vitest.config.ts`
- Create: `3rd/vercel.json`
- Create: `3rd/app/globals.css`
- Create: `3rd/app/page.tsx` (root redirect)

**Interfaces:**
- Produces: working Next.js 16 + next-intl project that redirects `/` → `/en/` and `/th/` routes are enabled

- [ ] **Step 1: Create `3rd/package.json`**

```json
{
  "name": "chicpreowned",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "16.2.9",
    "next-intl": "^3.26.0",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6.0.3",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^4.1.9"
  }
}
```

- [ ] **Step 2: Create `3rd/tsconfig.json`**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `3rd/next.config.ts`**

```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const config: NextConfig = {}

export default withNextIntl(config)
```

- [ ] **Step 4: Create `3rd/i18n.ts`**

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'th'],
  defaultLocale: 'en',
})
```

- [ ] **Step 5: Create `3rd/middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
```

- [ ] **Step 6: Create `3rd/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: { environment: 'node' },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
})
```

- [ ] **Step 7: Create `3rd/vercel.json`**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

- [ ] **Step 8: Create `3rd/app/globals.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 9: Create `3rd/app/page.tsx`** (root redirect — middleware handles `/` → `/en/` but this prevents a 404 during static generation)

```tsx
import { redirect } from 'next/navigation'

export default function Root() {
  redirect('/en')
}
```

- [ ] **Step 10: Install dependencies**

Run from `3rd/`:
```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 11: Verify next-intl types**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors (or only "cannot find module next-env.d.ts" which resolves after first build).

- [ ] **Step 12: Commit**

```bash
git add 3rd/
git commit -m "feat(chic): scaffold project + next-intl config"
```

---

### Task 2: Data Layer

**Files:**
- Create: `3rd/data/items_db.json`
- Create: `3rd/lib/data.ts`
- Create: `3rd/lib/__tests__/data.test.ts`

**Interfaces:**
- Produces:
  - `getAllItems(): Item[]` — 22 items
  - `getItemsByCategory(cat: Category): Item[]` — filters handbags/watches/clothing
  - `getItemsByBrand(brandSlug: string): Item[]`
  - `getItemBySlug(brandSlug, modelSlug): Item | undefined`
  - `getAllBrands(): BrandSummary[]`
  - `toBrandSlug(brand: string): string`
  - `formatPriceTHB(price: number): string` — returns `฿195,000`
  - `getPriceVsRetail(range: PriceRange, retail: number): string` — returns `-48%` or `+121%`
  - `Item`, `BrandSummary`, `Category`, `Condition`, `PriceRange`, `PriceSample` types

- [ ] **Step 1: Write failing tests**

Create `3rd/lib/__tests__/data.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  getAllItems,
  getItemsByCategory,
  getItemsByBrand,
  getItemBySlug,
  getAllBrands,
  toBrandSlug,
  formatPriceTHB,
  getPriceVsRetail,
} from '../data'

describe('toBrandSlug', () => {
  it('lowercases and hyphenates', () => {
    expect(toBrandSlug('Louis Vuitton')).toBe('louis-vuitton')
    expect(toBrandSlug('Audemars Piguet')).toBe('audemars-piguet')
    expect(toBrandSlug('Hermès')).toBe('hermes')
    expect(toBrandSlug('Adidas')).toBe('adidas')
  })
})

describe('formatPriceTHB', () => {
  it('formats with baht sign and commas', () => {
    expect(formatPriceTHB(195000)).toBe('฿195,000')
    expect(formatPriceTHB(9500)).toBe('฿9,500')
  })
})

describe('getPriceVsRetail', () => {
  it('shows savings when resale < retail', () => {
    const result = getPriceVsRetail({ min: 140000, max: 200000 }, 385000)
    expect(result).toMatch(/-\d+%/)
  })
  it('shows premium when resale > retail', () => {
    const result = getPriceVsRetail({ min: 5000000, max: 8000000 }, 3000000)
    expect(result).toMatch(/\+\d+%/)
  })
})

describe('getAllItems', () => {
  it('returns all 22 items', () => {
    expect(getAllItems()).toHaveLength(22)
  })
})

describe('getItemsByCategory', () => {
  it('filters handbags', () => {
    const bags = getItemsByCategory('handbags')
    expect(bags.length).toBe(9)
    bags.forEach(i => expect(i.category).toBe('handbags'))
  })
  it('filters watches', () => {
    const watches = getItemsByCategory('watches')
    expect(watches.length).toBe(5)
    watches.forEach(i => expect(i.category).toBe('watches'))
  })
  it('filters clothing', () => {
    const clothing = getItemsByCategory('clothing')
    expect(clothing.length).toBe(8)
    clothing.forEach(i => expect(i.category).toBe('clothing'))
  })
})

describe('getItemsByBrand', () => {
  it('returns Chanel items (3 items: 2 bags + 1 belt + espadrilles)', () => {
    const items = getItemsByBrand('chanel')
    expect(items.length).toBeGreaterThanOrEqual(2)
    items.forEach(i => expect(i.brand).toBe('Chanel'))
  })
  it('returns Gucci items (2 bags + 2 clothing)', () => {
    const items = getItemsByBrand('gucci')
    expect(items.length).toBeGreaterThanOrEqual(2)
  })
})

describe('getItemBySlug', () => {
  it('finds item by brand + model slug', () => {
    const item = getItemBySlug('chanel', 'classic-flap-medium')
    expect(item?.id).toBe('chanel-classic-flap-medium')
  })
  it('finds clothing item', () => {
    const item = getItemBySlug('nike', 'air-jordan-1-retro-high')
    expect(item?.category).toBe('clothing')
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
  it('counts Chanel models correctly', () => {
    const chanel = getAllBrands().find(b => b.slug === 'chanel')
    expect(chanel?.count).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd 3rd && npm test
```

Expected: FAIL — "Cannot find module '../data'"

- [ ] **Step 3: Create `3rd/data/items_db.json`**

```json
{
  "items": [
    {
      "id": "chanel-classic-flap-medium",
      "brand": "Chanel",
      "model": "Classic Flap Medium",
      "category": "handbags",
      "slug": "chanel/classic-flap-medium",
      "retail_price_thb": 385000,
      "price_ranges": {
        "excellent": { "min": 200000, "max": 280000 },
        "very_good": { "min": 140000, "max": 200000 },
        "good": { "min": 100000, "max": 140000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=chanel+classic+flap+medium" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "chanel-boy-bag-medium",
      "brand": "Chanel",
      "model": "Boy Bag Medium",
      "category": "handbags",
      "slug": "chanel/boy-bag-medium",
      "retail_price_thb": 305000,
      "price_ranges": {
        "excellent": { "min": 160000, "max": 230000 },
        "very_good": { "min": 110000, "max": 160000 },
        "good": { "min": 80000, "max": 110000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=chanel+boy+bag+medium" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "louis-vuitton-neverfull-mm",
      "brand": "Louis Vuitton",
      "model": "Neverfull MM",
      "category": "handbags",
      "slug": "louis-vuitton/neverfull-mm",
      "retail_price_thb": 62000,
      "price_ranges": {
        "excellent": { "min": 35000, "max": 48000 },
        "very_good": { "min": 25000, "max": 35000 },
        "good": { "min": 18000, "max": 25000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=louis+vuitton+neverfull+mm" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "louis-vuitton-speedy-30",
      "brand": "Louis Vuitton",
      "model": "Speedy 30",
      "category": "handbags",
      "slug": "louis-vuitton/speedy-30",
      "retail_price_thb": 42000,
      "price_ranges": {
        "excellent": { "min": 22000, "max": 32000 },
        "very_good": { "min": 15000, "max": 22000 },
        "good": { "min": 10000, "max": 15000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=louis+vuitton+speedy+30" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "hermes-birkin-30",
      "brand": "Hermès",
      "model": "Birkin 30",
      "category": "handbags",
      "slug": "hermes/birkin-30",
      "retail_price_thb": 580000,
      "price_ranges": {
        "excellent": { "min": 580000, "max": 900000 },
        "very_good": { "min": 500000, "max": 620000 },
        "good": { "min": 380000, "max": 500000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=hermes+birkin+30" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "hermes-kelly-28",
      "brand": "Hermès",
      "model": "Kelly 28",
      "category": "handbags",
      "slug": "hermes/kelly-28",
      "retail_price_thb": 550000,
      "price_ranges": {
        "excellent": { "min": 550000, "max": 800000 },
        "very_good": { "min": 450000, "max": 580000 },
        "good": { "min": 350000, "max": 450000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=hermes+kelly+28" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "gucci-gg-marmont-medium",
      "brand": "Gucci",
      "model": "GG Marmont Medium",
      "category": "handbags",
      "slug": "gucci/gg-marmont-medium",
      "retail_price_thb": 95000,
      "price_ranges": {
        "excellent": { "min": 45000, "max": 65000 },
        "very_good": { "min": 30000, "max": 45000 },
        "good": { "min": 20000, "max": 30000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=gucci+gg+marmont" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "dior-lady-dior-medium",
      "brand": "Dior",
      "model": "Lady Dior Medium",
      "category": "handbags",
      "slug": "dior/lady-dior-medium",
      "retail_price_thb": 195000,
      "price_ranges": {
        "excellent": { "min": 90000, "max": 130000 },
        "very_good": { "min": 65000, "max": 90000 },
        "good": { "min": 45000, "max": 65000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=dior+lady+dior+medium" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "prada-re-edition-2005",
      "brand": "Prada",
      "model": "Re-Edition 2005",
      "category": "handbags",
      "slug": "prada/re-edition-2005",
      "retail_price_thb": 75000,
      "price_ranges": {
        "excellent": { "min": 30000, "max": 45000 },
        "very_good": { "min": 20000, "max": 30000 },
        "good": { "min": 14000, "max": 20000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=prada+re-edition+2005" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "rolex-submariner",
      "brand": "Rolex",
      "model": "Submariner",
      "category": "watches",
      "slug": "rolex/submariner",
      "retail_price_thb": 360000,
      "price_ranges": {
        "excellent": { "min": 380000, "max": 500000 },
        "very_good": { "min": 330000, "max": 400000 },
        "good": { "min": 280000, "max": 340000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=rolex+submariner" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "rolex-datejust-41",
      "brand": "Rolex",
      "model": "Datejust 41",
      "category": "watches",
      "slug": "rolex/datejust-41",
      "retail_price_thb": 275000,
      "price_ranges": {
        "excellent": { "min": 260000, "max": 360000 },
        "very_good": { "min": 220000, "max": 280000 },
        "good": { "min": 180000, "max": 230000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=rolex+datejust+41" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "patek-philippe-nautilus-5711",
      "brand": "Patek Philippe",
      "model": "Nautilus 5711",
      "category": "watches",
      "slug": "patek-philippe/nautilus-5711",
      "retail_price_thb": 3000000,
      "price_ranges": {
        "excellent": { "min": 5000000, "max": 8000000 },
        "very_good": { "min": 4500000, "max": 6000000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=patek+philippe+nautilus+5711" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "audemars-piguet-royal-oak-15500",
      "brand": "Audemars Piguet",
      "model": "Royal Oak 15500",
      "category": "watches",
      "slug": "audemars-piguet/royal-oak-15500",
      "retail_price_thb": 1200000,
      "price_ranges": {
        "excellent": { "min": 1400000, "max": 2200000 },
        "very_good": { "min": 1200000, "max": 1600000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=audemars+piguet+royal+oak+15500" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "cartier-tank-solo",
      "brand": "Cartier",
      "model": "Tank Solo",
      "category": "watches",
      "slug": "cartier/tank-solo",
      "retail_price_thb": 90000,
      "price_ranges": {
        "excellent": { "min": 55000, "max": 75000 },
        "very_good": { "min": 40000, "max": 55000 },
        "good": { "min": 28000, "max": 40000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=cartier+tank+solo" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "nike-air-jordan-1-retro-high",
      "brand": "Nike",
      "model": "Air Jordan 1 Retro High",
      "category": "clothing",
      "slug": "nike/air-jordan-1-retro-high",
      "retail_price_thb": 9500,
      "price_ranges": {
        "excellent": { "min": 10000, "max": 20000 },
        "very_good": { "min": 7500, "max": 12000 },
        "good": { "min": 5000, "max": 8000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=nike+air+jordan+1" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "adidas-yeezy-boost-350-v2",
      "brand": "Adidas",
      "model": "Yeezy Boost 350 V2",
      "category": "clothing",
      "slug": "adidas/yeezy-boost-350-v2",
      "retail_price_thb": 12000,
      "price_ranges": {
        "excellent": { "min": 15000, "max": 35000 },
        "very_good": { "min": 10000, "max": 18000 },
        "good": { "min": 7000, "max": 12000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=adidas+yeezy+boost+350" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "gucci-ace-sneakers",
      "brand": "Gucci",
      "model": "Ace Sneakers",
      "category": "clothing",
      "slug": "gucci/ace-sneakers",
      "retail_price_thb": 22000,
      "price_ranges": {
        "excellent": { "min": 12000, "max": 18000 },
        "very_good": { "min": 8500, "max": 13000 },
        "good": { "min": 6000, "max": 9000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=gucci+ace+sneakers" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "gucci-gg-supreme-belt",
      "brand": "Gucci",
      "model": "GG Supreme Belt",
      "category": "clothing",
      "slug": "gucci/gg-supreme-belt",
      "retail_price_thb": 18000,
      "price_ranges": {
        "excellent": { "min": 8500, "max": 13000 },
        "very_good": { "min": 6000, "max": 9000 },
        "good": { "min": 4000, "max": 6500 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=gucci+gg+supreme+belt" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "louis-vuitton-lv-trainer-sneakers",
      "brand": "Louis Vuitton",
      "model": "LV Trainer Sneakers",
      "category": "clothing",
      "slug": "louis-vuitton/lv-trainer-sneakers",
      "retail_price_thb": 38000,
      "price_ranges": {
        "excellent": { "min": 20000, "max": 30000 },
        "very_good": { "min": 14000, "max": 22000 },
        "good": { "min": 10000, "max": 15000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=louis+vuitton+lv+trainer" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "louis-vuitton-monogram-scarf",
      "brand": "Louis Vuitton",
      "model": "Monogram Scarf",
      "category": "clothing",
      "slug": "louis-vuitton/monogram-scarf",
      "retail_price_thb": 22000,
      "price_ranges": {
        "excellent": { "min": 10000, "max": 16000 },
        "very_good": { "min": 7000, "max": 11000 },
        "good": { "min": 5000, "max": 8000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=louis+vuitton+monogram+scarf" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "chanel-classic-belt",
      "brand": "Chanel",
      "model": "Classic Belt",
      "category": "clothing",
      "slug": "chanel/classic-belt",
      "retail_price_thb": 32000,
      "price_ranges": {
        "excellent": { "min": 15000, "max": 22000 },
        "very_good": { "min": 10000, "max": 15000 },
        "good": { "min": 7000, "max": 11000 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=chanel+classic+belt" },
      "last_updated": "2026-06-26"
    },
    {
      "id": "chanel-espadrilles",
      "brand": "Chanel",
      "model": "Espadrilles",
      "category": "clothing",
      "slug": "chanel/espadrilles",
      "retail_price_thb": 28000,
      "price_ranges": {
        "excellent": { "min": 12000, "max": 18000 },
        "very_good": { "min": 8500, "max": 13000 },
        "good": { "min": 6000, "max": 9500 }
      },
      "price_samples": [],
      "affiliate_links": { "carousell": "https://th.carousell.com/search/#query=chanel+espadrilles" },
      "last_updated": "2026-06-26"
    }
  ]
}
```

- [ ] **Step 4: Create `3rd/lib/data.ts`**

```ts
import db from '@/data/items_db.json'

export type Condition = 'excellent' | 'very_good' | 'good'
export type Category = 'handbags' | 'watches' | 'clothing'

export interface PriceRange {
  min: number
  max: number
}

export interface PriceSample {
  price: number
  condition: Condition
  platform: 'carousell_th' | 'c2c_th'
  date: string
}

export interface Item {
  id: string
  brand: string
  model: string
  category: Category
  slug: string
  retail_price_thb: number
  price_ranges: Partial<Record<Condition, PriceRange>>
  price_samples: PriceSample[]
  affiliate_links: { carousell: string }
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
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export function formatPriceTHB(price: number): string {
  return '฿' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(price)
}

export function getPriceVsRetail(range: PriceRange, retail: number): string {
  if (retail === 0) return 'N/A'
  const midpoint = (range.min + range.max) / 2
  const pct = Math.round(((midpoint - retail) / retail) * 100)
  return pct > 0 ? `+${pct}%` : `${pct}%`
}
```

- [ ] **Step 5: Run tests**

```bash
cd 3rd && npm test
```

Expected: All tests PASS. 12 tests passing.

- [ ] **Step 6: Commit**

```bash
git add 3rd/data/ 3rd/lib/
git commit -m "feat(chic): data layer + 22 items (THB)"
```

---

### Task 3: i18n Messages

**Files:**
- Create: `3rd/messages/en.json`
- Create: `3rd/messages/th.json`

**Interfaces:**
- Produces: Translation namespaces `common` and `faq` for all UI strings used in pages/components

- [ ] **Step 1: Create `3rd/messages/en.json`**

```json
{
  "common": {
    "site_name": "Chic Preowned",
    "tagline": "Pre-owned luxury prices in Thailand — updated weekly",
    "nav_handbags": "Handbags",
    "nav_watches": "Watches",
    "nav_clothing": "Clothing & Shoes",
    "footer_disclaimer": "Prices are estimates based on recent Carousell Thailand and C2C.in.th listings. Always verify current listings before purchasing.",
    "footer_copyright": "© {year} ChicPreowned.com",
    "condition_excellent": "Excellent",
    "condition_very_good": "Very Good",
    "condition_good": "Good",
    "vs_retail": "vs Retail ({retail})",
    "price_range": "{min} – {max}",
    "last_updated": "Last updated: {date} · Prices from Carousell Thailand & C2C.in.th",
    "cta_carousell": "Browse on Carousell Thailand →",
    "browse_all": "Browse all",
    "models": "models",
    "see_guide": "See guide",
    "home": "Home",
    "page_title_model": "Used {brand} {model} Price in Thailand ({year})",
    "page_meta_model": "How much does a pre-owned {brand} {model} cost in Thailand? Current Carousell prices: {min}–{max} depending on condition.",
    "page_title_brand": "Used {brand} Prices in Thailand — Pre-Owned Guide",
    "page_meta_brand": "Current second-hand prices for {brand} in Thailand. Compare {count} models with price ranges by condition.",
    "page_title_handbags": "Second Hand Handbag Prices in Thailand (2026)",
    "page_title_watches": "Second Hand Watch Prices in Thailand (2026)",
    "page_title_clothing": "Second Hand Clothing & Shoes Prices in Thailand (2026)",
    "page_title_home": "Pre-Owned Luxury Price Guide Thailand | ChicPreowned",
    "page_meta_home": "Real second-hand prices for Chanel, Louis Vuitton, Rolex and more in Thailand — updated weekly from Carousell.",
    "retail_label": "Retail"
  },
  "faq": {
    "handbag_worth_it_q": "Is buying a used {model} worth it in Thailand?",
    "handbag_worth_it_a_savings": "Yes — a pre-owned {brand} {model} in Thailand typically costs around {pct}% less than retail while maintaining strong resale value. {brand} bags are well known for holding their value on Carousell Thailand.",
    "handbag_worth_it_a_premium": "The {model} often sells above retail on the Thai secondary market due to high demand. Buying pre-owned offers immediate availability without waitlists.",
    "handbag_condition_q": "Which condition should I buy?",
    "handbag_condition_a": "\"Very Good\" is the sweet spot — significant savings over \"Excellent\" while still looking great. Only go \"Good\" if you plan heavy everyday use.",
    "handbag_where_q": "Where can I buy second-hand {brand} bags in Thailand?",
    "handbag_where_a": "Carousell Thailand is the most active platform for pre-owned luxury bags in Thailand. Always ask for authentication certificates and check seller ratings.",
    "watch_value_q": "Does a pre-owned {model} hold its value?",
    "watch_value_a_premium": "The {model} consistently sells above retail on the Thai secondary market. It is one of the strongest value-holding timepieces available.",
    "watch_value_a_normal": "{brand} watches are among the strongest value-holders in the pre-owned market in Thailand.",
    "watch_check_q": "What should I check when buying a used {model}?",
    "watch_check_a": "Verify the serial number, look for a full set (box and papers), inspect the case and bracelet for wear, and confirm service history. Buy from verified Carousell sellers.",
    "watch_risk_q": "Is buying a pre-owned {model} risky in Thailand?",
    "watch_risk_a": "Not when buying from reputable Carousell Thailand sellers with strong ratings and positive reviews. Always request authentication documentation for watches above ฿100,000.",
    "clothing_worth_it_q": "Is buying a used {model} worth it?",
    "clothing_worth_it_a": "Pre-owned {brand} {model} in Thailand often sells for {pct}% less than retail. For sneakers and accessories, condition grading is critical — inspect photos carefully.",
    "clothing_auth_q": "How do I authenticate a second-hand {brand} item in Thailand?",
    "clothing_auth_a": "Check for serial numbers, authenticity cards, and original packaging. Use Carousell's buyer protection. For high-value items, consider a third-party authentication service in Bangkok.",
    "clothing_where_q": "Where to buy pre-owned {brand} in Thailand?",
    "clothing_where_a": "Carousell Thailand has the widest selection of pre-owned designer clothing and shoes. Filter by \"Verified\" sellers and check return policies before purchasing."
  }
}
```

- [ ] **Step 2: Create `3rd/messages/th.json`**

```json
{
  "common": {
    "site_name": "Chic Preowned",
    "tagline": "ราคาของแบรนด์เนมมือสองในไทย — อัปเดตทุกสัปดาห์",
    "nav_handbags": "กระเป๋า",
    "nav_watches": "นาฬิกา",
    "nav_clothing": "เสื้อผ้า & รองเท้า",
    "footer_disclaimer": "ราคาเป็นการประมาณจากรายการใน Carousell Thailand และ C2C.in.th กรุณาตรวจสอบราคาปัจจุบันก่อนตัดสินใจซื้อ",
    "footer_copyright": "© {year} ChicPreowned.com",
    "condition_excellent": "สภาพดีมาก",
    "condition_very_good": "สภาพดี",
    "condition_good": "สภาพพอใช้",
    "vs_retail": "เทียบราคาใหม่ ({retail})",
    "price_range": "{min} – {max}",
    "last_updated": "อัปเดตล่าสุด: {date} · ราคาจาก Carousell Thailand & C2C.in.th",
    "cta_carousell": "ดูสินค้าใน Carousell Thailand →",
    "browse_all": "ดูทั้งหมด",
    "models": "รุ่น",
    "see_guide": "ดูราคา",
    "home": "หน้าแรก",
    "page_title_model": "{brand} {model} มือสอง ราคา ({year})",
    "page_meta_model": "{brand} {model} มือสองราคาเท่าไหร่? ราคาล่าสุดจาก Carousell: {min}–{max} ขึ้นอยู่กับสภาพสินค้า",
    "page_title_brand": "{brand} มือสอง ราคา ในไทย",
    "page_meta_brand": "ราคา {brand} มือสองในไทย เปรียบเทียบ {count} รุ่น พร้อมช่วงราคาตามสภาพสินค้า",
    "page_title_handbags": "ราคากระเป๋าแบรนด์เนมมือสองในไทย (2026)",
    "page_title_watches": "ราคานาฬิกาแบรนด์เนมมือสองในไทย (2026)",
    "page_title_clothing": "ราคาเสื้อผ้าและรองเท้าแบรนด์เนมมือสองในไทย (2026)",
    "page_title_home": "ราคาของแบรนด์เนมมือสองในไทย | ChicPreowned",
    "page_meta_home": "ราคา Chanel, Louis Vuitton, Rolex มือสองในไทย — อัปเดตทุกสัปดาห์จาก Carousell Thailand",
    "retail_label": "ราคาใหม่"
  },
  "faq": {
    "handbag_worth_it_q": "ซื้อ {model} มือสองในไทยคุ้มไหม?",
    "handbag_worth_it_a_savings": "คุ้มมาก — {brand} {model} มือสองในไทยราคาถูกกว่าของใหม่ {pct}% ในขณะที่มูลค่ายังคงสูง กระเป๋า {brand} ขึ้นชื่อเรื่องการรักษามูลค่าใน Carousell Thailand",
    "handbag_worth_it_a_premium": "{model} มักขายเกินราคาใหม่ในตลาดมือสองไทยเนื่องจากความต้องการสูง การซื้อมือสองช่วยให้ได้สินค้าทันทีโดยไม่ต้องรอคิว",
    "handbag_condition_q": "ควรเลือกซื้อสภาพไหนดี?",
    "handbag_condition_a": "\"สภาพดี\" (Very Good) คือตัวเลือกที่คุ้มค่าที่สุด — ราคาประหยัดกว่า \"สภาพดีมาก\" แต่ยังดูสวยงาม เลือก \"สภาพพอใช้\" เฉพาะถ้าต้องการใช้งานหนักประจำวัน",
    "handbag_where_q": "ซื้อกระเป๋า {brand} มือสองได้ที่ไหนในไทย?",
    "handbag_where_a": "Carousell Thailand คือแพลตฟอร์มที่ใหญ่ที่สุดสำหรับกระเป๋าแบรนด์เนมมือสองในไทย ควรขอใบรับรองความแท้และตรวจสอบคะแนนผู้ขายก่อนซื้อ",
    "watch_value_q": "นาฬิกา {model} มือสองรักษามูลค่าได้ไหม?",
    "watch_value_a_premium": "{model} มักขายเกินราคาใหม่ในตลาดไทยอย่างสม่ำเสมอ เป็นนาฬิกาที่รักษามูลค่าได้ดีที่สุดชิ้นหนึ่ง",
    "watch_value_a_normal": "นาฬิกา {brand} เป็นหนึ่งในแบรนด์ที่รักษามูลค่าได้ดีที่สุดในตลาดมือสองไทย",
    "watch_check_q": "ควรตรวจสอบอะไรเมื่อซื้อ {model} มือสอง?",
    "watch_check_a": "ตรวจสอบหมายเลขซีเรียล, กล่องและบัตรรับประกัน, ตัวเรือนและสายนาฬิกา และประวัติการซ่อมบำรุง ควรซื้อจากผู้ขายที่ผ่านการยืนยันใน Carousell Thailand",
    "watch_risk_q": "การซื้อ {model} มือสองในไทยมีความเสี่ยงไหม?",
    "watch_risk_a": "ไม่เสี่ยงถ้าซื้อจากผู้ขายที่มีคะแนนสูงและรีวิวดีใน Carousell Thailand ควรขอเอกสารรับรองความแท้สำหรับนาฬิการาคาเกิน ฿100,000",
    "clothing_worth_it_q": "ซื้อ {model} มือสองคุ้มไหม?",
    "clothing_worth_it_a": "{brand} {model} มือสองในไทยมักราคาถูกกว่าของใหม่ {pct}% สำหรับรองเท้าและอุปกรณ์เสริม การประเมินสภาพสินค้าสำคัญมาก — ควรตรวจสอบภาพถ่ายอย่างละเอียด",
    "clothing_auth_q": "วิธีตรวจสอบความแท้ของ {brand} มือสองในไทย?",
    "clothing_auth_a": "ตรวจสอบหมายเลขซีเรียล, บัตรรับรอง และบรรจุภัณฑ์ดั้งเดิม ใช้ระบบคุ้มครองผู้ซื้อของ Carousell สำหรับสินค้าราคาสูงควรใช้บริการตรวจสอบของแท้ในกรุงเทพฯ",
    "clothing_where_q": "ซื้อ {brand} มือสองได้ที่ไหนในไทย?",
    "clothing_where_a": "Carousell Thailand มีสินค้าเสื้อผ้าและรองเท้าดีไซเนอร์มือสองให้เลือกมากที่สุด กรองผู้ขายที่ \"ผ่านการยืนยัน\" และตรวจสอบนโยบายคืนสินค้าก่อนซื้อ"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add 3rd/messages/
git commit -m "feat(chic): EN + TH i18n messages"
```

---

### Task 4: Layout

**Files:**
- Create: `3rd/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `routing` from `@/i18n`, `next-intl/server` getMessages, messages/en.json + th.json
- Produces: locale-wrapped layout with Inter font, header nav (lang switcher + category links), footer with disclaimer

- [ ] **Step 1: Create `3rd/app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n'
import '../globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_home'),
    description: t('page_meta_home'),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'th')) notFound()
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'common' })
  const otherLocale = locale === 'en' ? 'th' : 'en'

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-white text-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <header className="border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href={`/${locale}`} className="font-semibold text-lg tracking-tight">
                {t('site_name')}
              </a>
              <nav className="flex gap-4 text-sm text-gray-600 items-center">
                <a href={`/${locale}/handbags`} className="hover:text-gray-900">{t('nav_handbags')}</a>
                <a href={`/${locale}/watches`} className="hover:text-gray-900">{t('nav_watches')}</a>
                <a href={`/${locale}/clothing`} className="hover:text-gray-900">{t('nav_clothing')}</a>
                <a
                  href={`/${otherLocale}`}
                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                >
                  {otherLocale === 'th' ? 'ภาษาไทย' : 'English'}
                </a>
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-gray-100 mt-16">
            <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-400">
              <p>{t('footer_disclaimer')}</p>
              <p className="mt-1">{t('footer_copyright', { year: new Date().getFullYear() })}</p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify types compile**

```bash
cd 3rd && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add 3rd/app/
git commit -m "feat(chic): locale layout with NextIntlClientProvider"
```

---

### Task 5: Components

**Files:**
- Create: `3rd/components/PriceTable.tsx`
- Create: `3rd/components/AffiliateCTA.tsx`
- Create: `3rd/components/BrandCard.tsx`

**Interfaces:**
- Consumes: `Item`, `PriceRange`, `Condition`, `formatPriceTHB`, `getPriceVsRetail` from `@/lib/data`
- Produces:
  - `PriceTable({ item, labels })` — price table with THB formatting
  - `AffiliateCTA({ item, ctaLabel })` — Carousell CTA button
  - `BrandCard({ brand, slug, count, category, locale })` — locale-aware link card

- [ ] **Step 1: Create `3rd/components/PriceTable.tsx`**

```tsx
import { Item, Condition, formatPriceTHB, getPriceVsRetail } from '@/lib/data'

interface ConditionLabels {
  excellent: string
  very_good: string
  good: string
  vsRetail: string
  lastUpdated: string
}

const CONDITIONS: { key: Condition }[] = [
  { key: 'excellent' },
  { key: 'very_good' },
  { key: 'good' },
]

export function PriceTable({ item, labels }: { item: Item; labels: ConditionLabels }) {
  const condLabel = (key: Condition) => ({
    excellent: labels.excellent,
    very_good: labels.very_good,
    good: labels.good,
  }[key])

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-3 border border-gray-200 font-semibold">Condition</th>
            <th className="p-3 border border-gray-200 font-semibold">Price Range</th>
            <th className="p-3 border border-gray-200 font-semibold">
              {labels.vsRetail.replace('{retail}', formatPriceTHB(item.retail_price_thb))}
            </th>
          </tr>
        </thead>
        <tbody>
          {CONDITIONS.map(({ key }) => {
            const range = item.price_ranges[key]
            if (!range) return null
            const diff = getPriceVsRetail(range, item.retail_price_thb)
            const isAboveRetail = diff.startsWith('+')
            return (
              <tr key={key} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200 font-medium">{condLabel(key)}</td>
                <td className="p-3 border border-gray-200">
                  {formatPriceTHB(range.min)} – {formatPriceTHB(range.max)}
                </td>
                <td className={`p-3 border border-gray-200 font-medium ${isAboveRetail ? 'text-orange-600' : 'text-green-700'}`}>
                  {diff}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2">{labels.lastUpdated.replace('{date}', item.last_updated)}</p>
    </div>
  )
}
```

- [ ] **Step 2: Create `3rd/components/AffiliateCTA.tsx`**

```tsx
import { Item } from '@/lib/data'

export function AffiliateCTA({ item, ctaLabel }: { item: Item; ctaLabel: string }) {
  return (
    <div className="my-8">
      <a
        href={item.affiliate_links.carousell}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-black text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        {ctaLabel}
      </a>
    </div>
  )
}
```

- [ ] **Step 3: Create `3rd/components/BrandCard.tsx`**

```tsx
import Link from 'next/link'
import { BrandSummary } from '@/lib/data'

interface Props extends BrandSummary {
  locale: string
  modelsLabel: string
}

export function BrandCard({ brand, slug, count, locale, modelsLabel }: Props) {
  return (
    <Link
      href={`/${locale}/${slug}`}
      className="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <p className="font-semibold text-gray-900">{brand}</p>
      <p className="text-sm text-gray-500 mt-1">{count} {modelsLabel}</p>
    </Link>
  )
}
```

- [ ] **Step 4: Verify types compile**

```bash
cd 3rd && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add 3rd/components/
git commit -m "feat(chic): PriceTable + AffiliateCTA + BrandCard components"
```

---

### Task 6: Listing Pages

**Files:**
- Create: `3rd/app/[locale]/page.tsx`
- Create: `3rd/app/[locale]/handbags/page.tsx`
- Create: `3rd/app/[locale]/watches/page.tsx`
- Create: `3rd/app/[locale]/clothing/page.tsx`
- Create: `3rd/app/[locale]/[brand]/page.tsx`

**Interfaces:**
- Consumes: `getAllItems`, `getAllBrands`, `getItemsByBrand`, `formatPriceTHB` from `@/lib/data`; `BrandCard` from `@/components/BrandCard`; `getTranslations` from `next-intl/server`

- [ ] **Step 1: Create `3rd/app/[locale]/page.tsx`** (homepage)

```tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getAllBrands } from '@/lib/data'
import { BrandCard } from '@/components/BrandCard'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return { title: t('page_title_home'), description: t('page_meta_home') }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const allBrands = getAllBrands()
  const handbagBrands = allBrands.filter(b => b.category === 'handbags')
  const watchBrands   = allBrands.filter(b => b.category === 'watches')
  const clothingBrands = allBrands.filter(b => b.category === 'clothing')

  return (
    <>
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">{t('page_title_home')}</h1>
        <p className="text-gray-600 text-lg">{t('tagline')}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/handbags`} className="hover:underline">{t('nav_handbags')}</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {handbagBrands.map(b => (
            <BrandCard key={b.slug} {...b} locale={locale} modelsLabel={t('models')} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/watches`} className="hover:underline">{t('nav_watches')}</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {watchBrands.map(b => (
            <BrandCard key={b.slug} {...b} locale={locale} modelsLabel={t('models')} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/clothing`} className="hover:underline">{t('nav_clothing')}</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {clothingBrands.map(b => (
            <BrandCard key={b.slug} {...b} locale={locale} modelsLabel={t('models')} />
          ))}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Create `3rd/app/[locale]/handbags/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemsByCategory, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return { title: t('page_title_handbags') }
}

export default async function HandbagsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('handbags')

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">{t('page_title_handbags')}</h1>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const [brand, model] = item.slug.split('/')
          return (
            <Link key={item.id} href={`/${locale}/${brand}/${model}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.brand} {item.model}</span>
              <span className="text-sm text-gray-500">
                {vg ? `${formatPriceTHB(vg.min)} – ${formatPriceTHB(vg.max)}` : t('see_guide')}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Create `3rd/app/[locale]/watches/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemsByCategory, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return { title: t('page_title_watches') }
}

export default async function WatchesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('watches')

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">{t('page_title_watches')}</h1>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const [brand, model] = item.slug.split('/')
          return (
            <Link key={item.id} href={`/${locale}/${brand}/${model}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.brand} {item.model}</span>
              <span className="text-sm text-gray-500">
                {vg ? `${formatPriceTHB(vg.min)} – ${formatPriceTHB(vg.max)}` : t('see_guide')}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 4: Create `3rd/app/[locale]/clothing/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemsByCategory, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return { title: t('page_title_clothing') }
}

export default async function ClothingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('clothing')

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">{t('page_title_clothing')}</h1>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const [brand, model] = item.slug.split('/')
          return (
            <Link key={item.id} href={`/${locale}/${brand}/${model}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.brand} {item.model}</span>
              <span className="text-sm text-gray-500">
                {vg ? `${formatPriceTHB(vg.min)} – ${formatPriceTHB(vg.max)}` : t('see_guide')}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 5: Create `3rd/app/[locale]/[brand]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemsByBrand, getAllBrands, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string; brand: string }> }

export function generateStaticParams() {
  const locales = ['en', 'th']
  return getAllBrands().flatMap(b => locales.map(locale => ({ locale, brand: b.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) return {}
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_brand', { brand: items[0].brand }),
    description: t('page_meta_brand', { brand: items[0].brand, count: items.length }),
  }
}

export default async function BrandPage({ params }: Props) {
  const { locale, brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) notFound()
  const t = await getTranslations({ locale, namespace: 'common' })
  const brandName = items[0].brand

  return (
    <>
      <p className="text-sm text-gray-400 mb-2">
        <Link href={`/${locale}`}>{t('home')}</Link> › {brandName}
      </p>
      <h1 className="text-3xl font-bold mb-2">{t('page_title_brand', { brand: brandName })}</h1>
      <p className="text-gray-600 mb-8">{t('page_meta_brand', { brand: brandName, count: items.length })}</p>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const [, model] = item.slug.split('/')
          return (
            <Link key={item.id} href={`/${locale}/${brand}/${model}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.model}</span>
              <span className="text-sm text-gray-500">
                {vg ? `${formatPriceTHB(vg.min)} – ${formatPriceTHB(vg.max)}` : t('see_guide')}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 6: Run build to verify pages compile**

```bash
cd 3rd && npm run build
```

Expected: Build succeeds. Pages generate for both `/en/` and `/th/` locales.

- [ ] **Step 7: Commit**

```bash
git add 3rd/app/
git commit -m "feat(chic): homepage + category + brand listing pages"
```

---

### Task 7: Model Page (Core SEO)

**Files:**
- Create: `3rd/app/[locale]/[brand]/[model]/page.tsx`

**Interfaces:**
- Consumes: `getItemBySlug`, `getAllItems`, `formatPriceTHB`, `getPriceVsRetail`, `Item` from `@/lib/data`; `PriceTable` from `@/components/PriceTable`; `AffiliateCTA` from `@/components/AffiliateCTA`; `getTranslations` from `next-intl/server`
- Produces: `/en/chanel/classic-flap-medium` and `/th/chanel/classic-flap-medium` — static pages with hreflang, FAQ JSON-LD, price table, AdSense placeholders

- [ ] **Step 1: Create `3rd/app/[locale]/[brand]/[model]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemBySlug, getAllItems, formatPriceTHB, getPriceVsRetail, Item } from '@/lib/data'
import { PriceTable } from '@/components/PriceTable'
import { AffiliateCTA } from '@/components/AffiliateCTA'

const BASE = 'https://www.chicpreowned.com'
const YEAR = 2026

interface Props { params: Promise<{ locale: string; brand: string; model: string }> }

export function generateStaticParams() {
  const locales = ['en', 'th']
  return getAllItems().flatMap(item => {
    const [brand, model] = item.slug.split('/')
    return locales.map(locale => ({ locale, brand, model }))
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) return {}
  const t = await getTranslations({ locale, namespace: 'common' })
  const vg = item.price_ranges.very_good
  const otherLocale = locale === 'en' ? 'th' : 'en'
  return {
    title: t('page_title_model', { brand: item.brand, model: item.model, year: YEAR }),
    description: t('page_meta_model', {
      brand: item.brand,
      model: item.model,
      min: vg ? formatPriceTHB(vg.min) : '฿–',
      max: vg ? formatPriceTHB(vg.max) : '฿–',
    }),
    alternates: {
      canonical: `${BASE}/${locale}/${item.slug}`,
      languages: {
        [locale]: `${BASE}/${locale}/${item.slug}`,
        [otherLocale]: `${BASE}/${otherLocale}/${item.slug}`,
      },
    },
  }
}

function getFAQs(item: Item, t: (key: string, values?: Record<string, string | number>) => string) {
  const vg = item.price_ranges.very_good
  const savingsPct = vg
    ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
    : null
  const pct = savingsPct && savingsPct > 0 ? `${savingsPct}%` : '20%'

  if (item.category === 'handbags') {
    return [
      {
        q: t('faq.handbag_worth_it_q', { model: item.model }),
        a: savingsPct && savingsPct > 0
          ? t('faq.handbag_worth_it_a_savings', { brand: item.brand, model: item.model, pct })
          : t('faq.handbag_worth_it_a_premium', { model: item.model }),
      },
      { q: t('faq.handbag_condition_q'), a: t('faq.handbag_condition_a') },
      {
        q: t('faq.handbag_where_q', { brand: item.brand }),
        a: t('faq.handbag_where_a'),
      },
    ]
  }
  if (item.category === 'watches') {
    const isAboveRetail = vg && (vg.min + vg.max) / 2 > item.retail_price_thb
    return [
      {
        q: t('faq.watch_value_q', { model: item.model }),
        a: isAboveRetail
          ? t('faq.watch_value_a_premium', { model: item.model })
          : t('faq.watch_value_a_normal', { brand: item.brand }),
      },
      { q: t('faq.watch_check_q', { model: item.model }), a: t('faq.watch_check_a') },
      { q: t('faq.watch_risk_q', { model: item.model }), a: t('faq.watch_risk_a') },
    ]
  }
  return [
    {
      q: t('faq.clothing_worth_it_q', { model: item.model }),
      a: t('faq.clothing_worth_it_a', { brand: item.brand, model: item.model, pct }),
    },
    {
      q: t('faq.clothing_auth_q', { brand: item.brand }),
      a: t('faq.clothing_auth_a'),
    },
    {
      q: t('faq.clothing_where_q', { brand: item.brand }),
      a: t('faq.clothing_where_a'),
    },
  ]
}

export default async function ModelPage({ params }: Props) {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) notFound()

  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tFaq = await getTranslations({ locale, namespace: 'faq' })

  const faqs = getFAQs(item, tFaq)

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
        <Link href={`/${locale}`}>{tCommon('home')}</Link> ›{' '}
        <Link href={`/${locale}/${brand}`}>{item.brand}</Link> ›{' '}
        {item.model}
      </p>

      <h1 className="text-3xl font-bold mb-2">
        {tCommon('page_title_model', { brand: item.brand, model: item.model, year: YEAR })}
      </h1>
      <p className="text-gray-600 mb-6">
        {tCommon('retail_label')}: {formatPriceTHB(item.retail_price_thb)}
      </p>

      {/* AdSense slot — top */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense top]</div>

      <PriceTable item={item} labels={{
        excellent: tCommon('condition_excellent'),
        very_good: tCommon('condition_very_good'),
        good: tCommon('condition_good'),
        vsRetail: tCommon('vs_retail'),
        lastUpdated: tCommon('last_updated'),
      }} />

      <AffiliateCTA item={item} ctaLabel={tCommon('cta_carousell')} />

      {/* AdSense slot — middle */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense middle]</div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">FAQ</h2>
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

- [ ] **Step 2: Run build**

```bash
cd 3rd && npm run build
```

Expected: Build succeeds. Static params generate 44 model pages (22 items × 2 locales).

- [ ] **Step 3: Spot-check Thai page**

Run dev server and open `http://localhost:3000/th/chanel/classic-flap-medium`:
```bash
cd 3rd && npm run dev
```

Expected:
- H1 in Thai: "Chanel Classic Flap Medium มือสอง ราคา (2026)"
- Price table shows ฿ values
- CTA says "ดูสินค้าใน Carousell Thailand →"
- FAQ questions in Thai

- [ ] **Step 4: Spot-check English page**

Open `http://localhost:3000/en/chanel/classic-flap-medium`.

Expected:
- H1: "Used Chanel Classic Flap Medium Price in Thailand (2026)"
- Price table shows ฿ values
- CTA says "Browse on Carousell Thailand →"

- [ ] **Step 5: Commit**

```bash
git add 3rd/app/
git commit -m "feat(chic): model page with hreflang + FAQ JSON-LD"
```

---

### Task 8: Sitemap + Robots

**Files:**
- Create: `3rd/app/sitemap.ts`
- Create: `3rd/app/robots.ts`

**Interfaces:**
- Consumes: `getAllItems`, `getAllBrands` from `@/lib/data`
- Produces: `https://www.chicpreowned.com/sitemap.xml` — all EN + TH URLs with language alternates

- [ ] **Step 1: Create `3rd/app/sitemap.ts`**

```ts
import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands } from '@/lib/data'

const BASE = 'https://www.chicpreowned.com'
const LOCALES = ['en', 'th'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()
  const entries: MetadataRoute.Sitemap = []

  // Root + locale homepages
  entries.push({ url: BASE, lastModified: new Date(), priority: 1.0 })
  for (const locale of LOCALES) {
    entries.push({ url: `${BASE}/${locale}`, lastModified: new Date(), priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/handbags`, lastModified: new Date(), priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/watches`, lastModified: new Date(), priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/clothing`, lastModified: new Date(), priority: 0.8 })
  }

  // Brand pages
  for (const brand of brands) {
    for (const locale of LOCALES) {
      entries.push({ url: `${BASE}/${locale}/${brand.slug}`, lastModified: new Date(), priority: 0.7 })
    }
  }

  // Model pages
  for (const item of items) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/${item.slug}`,
        lastModified: new Date(item.last_updated),
        priority: 0.9,
      })
    }
  }

  return entries
}
```

- [ ] **Step 2: Create `3rd/app/robots.ts`**

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.chicpreowned.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verify sitemap in dev**

```bash
cd 3rd && npm run dev
```

Open `http://localhost:3000/sitemap.xml`. Expected: XML with EN and TH URLs for all 22 items (44 model URLs + brand + category + home = ~100 total URLs).

- [ ] **Step 4: Commit**

```bash
git add 3rd/app/sitemap.ts 3rd/app/robots.ts
git commit -m "feat(chic): sitemap (EN+TH) + robots.txt"
```

---

### Task 9: Scraper

**Files:**
- Create: `3rd/scraper/price_sampler.py`
- Create: `3rd/scraper/test_price_sampler.py`

**Interfaces:**
- Produces: weekly update of `3rd/data/items_db.json` with real THB price samples from Carousell TH + C2C.in.th, then `git push`
- Watchdog PID file: `run/price_sampler_chic.pid`

> **Note on Carousell TH API:** Before implementing `fetch_carousell_prices()`, run the discovery script in Step 1 to find the actual API endpoint. The implementation in Step 3 shows the expected pattern (similar to Vestiaire in `2nd/scraper/price_sampler.py`) but the exact endpoint URL and POST body must be confirmed from Step 1 output.

- [ ] **Step 1: Discover Carousell TH API endpoint**

Save this as a temporary script and run it:

```python
# Run: python discover_carousell.py
from playwright.sync_api import sync_playwright
import json

hits = []

def on_response(response):
    if response.status == 200 and 'json' in response.headers.get('content-type', ''):
        try:
            body = response.json()
            def has_items(obj, depth=0):
                if depth > 4: return None
                if isinstance(obj, dict):
                    for k in ('items', 'listings', 'data', 'results'):
                        if k in obj and isinstance(obj[k], list) and obj[k]:
                            first = obj[k][0]
                            if isinstance(first, dict) and any(p in first for p in ('price', 'listing')):
                                return {'url': response.url[:120], 'key': k, 'count': len(obj[k]), 'sample': list(first.keys())[:8]}
                    for v in obj.values():
                        r = has_items(v, depth+1)
                        if r: return r
                return None
            hit = has_items(body)
            if hit: hits.append(hit)
        except Exception:
            pass

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36')
    page.on('response', on_response)
    page.goto('https://th.carousell.com/search/?query=chanel+classic+flap', wait_until='domcontentloaded', timeout=30000)
    page.wait_for_timeout(6000)
    browser.close()

print(json.dumps(hits[:5], indent=2))
```

Run:
```bash
python discover_carousell.py
```

Expected output: JSON showing the API URL and response structure (e.g. `https://api.carousell.com/...` or `https://th.carousell.com/api/...`). Note the URL, HTTP method (GET vs POST), and the field names for price and condition.

- [ ] **Step 2: Write pure-logic tests (no HTTP)**

Create `3rd/scraper/test_price_sampler.py`:

```python
import pytest
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from price_sampler import normalize_condition, recalculate_ranges, trim_samples

def test_normalize_condition_thai():
    assert normalize_condition('สภาพดีมาก') == 'excellent'
    assert normalize_condition('like new') == 'excellent'
    assert normalize_condition('very good') == 'very_good'
    assert normalize_condition('good') == 'good'
    assert normalize_condition('fair') == 'good'

def test_recalculate_ranges():
    samples = [
        {'price': 100000, 'condition': 'excellent', 'platform': 'carousell_th', 'date': '2026-06-26'},
        {'price': 120000, 'condition': 'excellent', 'platform': 'carousell_th', 'date': '2026-06-26'},
        {'price': 70000, 'condition': 'very_good', 'platform': 'c2c_th', 'date': '2026-06-26'},
    ]
    ranges = recalculate_ranges(samples)
    assert ranges['excellent'] == {'min': 100000, 'max': 120000}
    assert ranges['very_good'] == {'min': 70000, 'max': 70000}

def test_trim_samples():
    samples = [{'price': i, 'condition': 'good', 'platform': 'carousell_th', 'date': f'2026-01-{i:02d}'} for i in range(1, 41)]
    trimmed = trim_samples(samples, keep=30)
    assert len(trimmed) == 30
    assert trimmed[0]['date'] == '2026-01-11'  # keeps most recent 30
```

Run:
```bash
pytest 3rd/scraper/test_price_sampler.py -v
```

Expected: FAIL — "cannot import 'normalize_condition'"

- [ ] **Step 3: Create `3rd/scraper/price_sampler.py`**

> **After Step 1:** Replace `CAROUSELL_API_URL`, `build_carousell_payload(query)`, and the response parsing in `fetch_carousell_prices()` with the actual values discovered. The pattern below assumes a POST endpoint similar to Vestiaire; adjust if Carousell uses GET with query params.

```python
#!/usr/bin/env python3
"""
Weekly scraper: Carousell Thailand + C2C.in.th → items_db.json (THB prices).
Run from repo root: python 3rd/scraper/price_sampler.py
"""
import json
import time
import random
import subprocess
import uuid
from datetime import datetime
from pathlib import Path

import requests
try:
    from bs4 import BeautifulSoup
except ImportError:
    raise ImportError('Run: pip install beautifulsoup4')

DB_PATH = Path(__file__).parent.parent / 'data' / 'items_db.json'
INTERVAL_HOURS = 168  # weekly

# --- FILL IN AFTER RUNNING discover_carousell.py (Step 1) ---
# Replace with actual endpoint discovered via Playwright
CAROUSELL_API_URL = 'https://api.carousell.com/flow/2.0/listings/'

CAROUSELL_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Referer': 'https://th.carousell.com/',
    'Origin': 'https://th.carousell.com',
}

C2C_BASE = 'https://www.c2c.in.th'


def normalize_condition(raw: str) -> str:
    raw = str(raw).lower()
    # Thai condition strings
    if any(k in raw for k in ('ดีมาก', 'like new', 'never', 'mint', 'excellent', 'brand new')):
        return 'excellent'
    if any(k in raw for k in ('สภาพดี', 'very good', 'great', 'near mint')):
        return 'very_good'
    return 'good'


def recalculate_ranges(samples: list[dict]) -> dict:
    by_cond: dict[str, list[float]] = {}
    for s in samples:
        by_cond.setdefault(s['condition'], []).append(s['price'])
    return {
        cond: {'min': int(min(prices)), 'max': int(max(prices))}
        for cond, prices in by_cond.items()
        if prices
    }


def trim_samples(samples: list[dict], keep: int = 30) -> list[dict]:
    return sorted(samples, key=lambda s: s['date'])[-keep:]


def fetch_carousell_prices(query: str) -> list[dict]:
    """
    Fetch prices from Carousell Thailand.
    UPDATE this function after running discover_carousell.py to use
    the actual API endpoint and payload structure.
    """
    params = {
        'query': query,
        'count': 20,
        'countryCode': 'TH',
    }
    headers = {**CAROUSELL_HEADERS, 'x-request-id': str(uuid.uuid4())}
    today = datetime.now().strftime('%Y-%m-%d')
    try:
        resp = requests.get(CAROUSELL_API_URL, headers=headers, params=params, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        # Adjust key path based on actual API response structure from Step 1
        listings = data.get('data', {}).get('results', []) or data.get('listings', []) or data.get('items', [])
    except Exception as e:
        print(f'  [carousell warn] {e}')
        return []

    results = []
    today = datetime.now().strftime('%Y-%m-%d')
    for listing in listings[:20]:
        price_raw = listing.get('price', {})
        price_thb = None
        if isinstance(price_raw, dict):
            price_thb = price_raw.get('amount') or price_raw.get('value') or price_raw.get('cents')
            if price_thb and price_thb > 10000:  # cents vs units heuristic
                price_thb = price_thb / 100
        elif isinstance(price_raw, (int, float)):
            price_thb = price_raw
        if not price_thb or price_thb < 100:
            continue
        condition_raw = listing.get('condition', '') or listing.get('status', '')
        results.append({
            'price': round(float(price_thb), 0),
            'condition': normalize_condition(condition_raw),
            'platform': 'carousell_th',
            'date': today,
        })
    return results


def fetch_c2c_prices(query: str) -> list[dict]:
    url = f'{C2C_BASE}/search'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
    }
    today = datetime.now().strftime('%Y-%m-%d')
    try:
        resp = requests.get(url, params={'keyword': query}, headers=headers, timeout=20)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
    except Exception as e:
        print(f'  [c2c warn] {e}')
        return []

    results = []
    # C2C.in.th product cards — inspect actual HTML and update selectors if different
    for card in soup.select('.product-item, .item-card, [class*="product"], [class*="listing"]')[:15]:
        price_el = card.select_one('[class*="price"], .price, [itemprop="price"]')
        if not price_el:
            continue
        price_text = price_el.get_text(strip=True).replace(',', '').replace('฿', '').replace('บาท', '').strip()
        try:
            price_thb = float(''.join(c for c in price_text if c.isdigit() or c == '.'))
        except ValueError:
            continue
        if price_thb < 100:
            continue
        condition_el = card.select_one('[class*="condition"], [class*="status"]')
        condition_raw = condition_el.get_text(strip=True) if condition_el else ''
        results.append({
            'price': round(price_thb, 0),
            'condition': normalize_condition(condition_raw),
            'platform': 'c2c_th',
            'date': today,
        })
    return results


def run():
    with open(DB_PATH) as f:
        db = json.load(f)

    for item in db['items']:
        query = f'{item["brand"]} {item["model"]}'
        print(f'Fetching: {query}')

        carousell_samples = fetch_carousell_prices(query)
        c2c_samples = fetch_c2c_prices(query)
        new_samples = carousell_samples + c2c_samples
        print(f'  Carousell: {len(carousell_samples)}, C2C: {len(c2c_samples)}')

        if new_samples:
            item['price_samples'] = trim_samples(
                item.get('price_samples', []) + new_samples
            )
            item['price_ranges'] = recalculate_ranges(item['price_samples'])
            item['last_updated'] = datetime.now().strftime('%Y-%m-%d')

        time.sleep(random.uniform(2, 5))

    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print('items_db.json updated')

    subprocess.run(['git', 'add', str(DB_PATH)], check=True)
    subprocess.run(['git', 'commit', '-m', f'chore(data): chic price update {datetime.now():%Y-%m-%d}'], check=True)
    subprocess.run(['git', 'push'], check=True)
    print('Pushed.')


if __name__ == '__main__':
    while True:
        print(f'[price_sampler_chic] run start {datetime.now():%Y-%m-%d %H:%M:%S}')
        run()
        print(f'[price_sampler_chic] sleeping {INTERVAL_HOURS}h')
        time.sleep(INTERVAL_HOURS * 3600)
```

- [ ] **Step 4: Run pure-logic tests**

```bash
pytest 3rd/scraper/test_price_sampler.py -v
```

Expected: All 3 tests PASS.

- [ ] **Step 5: Run scraper once to test (dry run)**

```bash
cd deliverable && python 3rd/scraper/price_sampler.py
```

Check output — if Carousell returns 0 samples, the API endpoint needs adjustment based on Step 1 discovery. Update `CAROUSELL_API_URL` and the response parsing accordingly.

- [ ] **Step 6: Commit**

```bash
git add 3rd/scraper/
git commit -m "feat(chic): scraper (Carousell TH + C2C.in.th)"
```

---

### Task 10: Build + Deploy to Vercel

**Files:** No new files — deploy existing `3rd/` to Vercel

**Interfaces:**
- Produces: `chicpreowned.com` live at Vercel, project `chicpreowned` under scope `yunmin`

- [ ] **Step 1: Final build check**

```bash
cd 3rd && npm run build
```

Expected: Build succeeds. Output includes:
```
Route (app)                     Size
├ ○ /                          ...
├ ○ /[locale]                  (44+ model pages generated)
```

- [ ] **Step 2: Run all tests one final time**

```bash
cd 3rd && npm test
```

Expected: All tests pass.

- [ ] **Step 3: Deploy to Vercel**

From `3rd/` directory:

```bash
vercel --prod --archive=tgz --scope yunmin
```

When prompted "Set up and deploy?": Yes  
Project name: `chicpreowned`  
Framework: Next.js (auto-detected)

Expected: Deployment URL returned (e.g. `https://chicpreowned.vercel.app`)

- [ ] **Step 4: Verify live deployment**

Open the Vercel URL and check:
- `/en/chanel/classic-flap-medium` — English page loads
- `/th/chanel/classic-flap-medium` — Thai page loads with Thai text
- `/en/` → homepage shows 3 category sections
- Language switcher in header works

- [ ] **Step 5: Add custom domain** (user handles in Vercel dashboard)

In Vercel dashboard → chicpreowned project → Settings → Domains:
- Add `chicpreowned.com`
- Add `www.chicpreowned.com`
- Set `www.chicpreowned.com` as primary (canonical)

- [ ] **Step 6: Final commit**

```bash
git add 3rd/
git commit -m "feat(chic): initial deployment to Vercel"
git push
```
