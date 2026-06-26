# chicpreowned.com — Design Spec
Date: 2026-06-26

## Overview

Bilingual (English + Thai) SEO price guide for second-hand luxury goods in the Thai market.
Data sourced from Carousell Thailand + C2C.in.th — Thai-market prices in THB.
Monetization: Google AdSense + Carousell affiliate CTA.

Sister site: `secondluxuryitems.com` (global English, Vestiaire data, USD — already live).

---

## Architecture

```
scraper/price_sampler.py  (weekly, managed by watchdog)
  → data/items_db.json    (THB prices, carousell_th / c2c_th platforms)
  → git push → Vercel auto-build

3rd/                              ← project root (separate from 2nd/)
├── app/
│   └── [locale]/                 ← next-intl (/en/, /th/)
│       ├── page.tsx               # Homepage: brand grid
│       ├── handbags/page.tsx      # Handbag category listing
│       ├── watches/page.tsx       # Watch category listing
│       ├── clothing/page.tsx      # Clothing/shoes category listing
│       ├── [brand]/page.tsx       # Brand page: /en/chanel, /th/chanel
│       └── [brand]/[model]/page.tsx  # Core SEO page
├── messages/
│   ├── en.json                   # English UI strings
│   └── th.json                   # Thai UI strings
├── data/
│   └── items_db.json
├── lib/
│   └── data.ts                   # Type definitions + data helpers
├── components/
│   ├── PriceTable.tsx
│   ├── AffiliateCTA.tsx
│   └── BrandCard.tsx
├── scraper/
│   └── price_sampler.py
├── i18n.ts                       # next-intl config
└── middleware.ts                 # next-intl locale detection + redirect
```

**URL structure:**
- `/` → redirect to `/en/`
- `/en/chanel/classic-flap-medium` — English SEO page
- `/th/chanel/classic-flap-medium` — Thai SEO page
- `hreflang` tags on every page linking EN ↔ TH variants
- Default locale: `en`

---

## Data Model

`data/items_db.json` — same structure as secondluxuryitems.com with three changes:
1. `clothing` category added
2. Prices in **THB** (Thai Baht)
3. Platform values: `carousell_th` or `c2c_th`

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
        "excellent": { "min": 180000, "max": 240000 },
        "very_good": { "min": 130000, "max": 180000 },
        "good":      { "min": 90000,  "max": 130000 }
      },
      "price_samples": [
        {
          "price": 195000,
          "condition": "excellent",
          "platform": "carousell_th",
          "date": "2026-06-26"
        }
      ],
      "affiliate_links": {
        "carousell": "https://th.carousell.com/search/#query=chanel+classic+flap"
      },
      "last_updated": "2026-06-26"
    }
  ]
}
```

### Launch item coverage (~90 items × 2 locales = ~180 URLs)

**Handbags:** Chanel (Classic Flap Medium, Boy Bag Medium), Louis Vuitton (Neverfull MM, Speedy 30), Hermès (Birkin 30, Kelly 28), Gucci (GG Marmont Medium), Dior (Lady Dior Medium), Prada (Re-Edition 2005)

**Watches:** Rolex (Submariner, Datejust 41), Patek Philippe (Nautilus 5711), Audemars Piguet (Royal Oak 15500), Cartier (Tank Solo)

**Clothing/Shoes:** Gucci (GG Supreme Belt, Ace Sneakers), Louis Vuitton (LV Trainer Sneakers, Monogram Scarf), Chanel (Classic Belt, Espadrilles), Nike (Air Jordan 1 Retro High), Adidas (Yeezy Boost 350 V2)

---

## i18n Strings

**`messages/en.json`:**
```json
{
  "page.title": "Used {brand} {model} Price in Thailand ({year})",
  "page.meta": "How much does a pre-owned {model} cost in Thailand? Current Carousell prices: ฿{min}–฿{max} depending on condition.",
  "condition.excellent": "Excellent",
  "condition.very_good": "Very Good",
  "condition.good": "Good",
  "price.vs_retail": "vs retail",
  "faq.worth_it.q": "Is buying a used {model} worth it in Thailand?",
  "faq.worth_it.a": "Yes — pre-owned {brand} items in Thailand typically sell for {discount}% below retail, making them a strong value especially in excellent condition.",
  "faq.condition.q": "Which condition should I buy?",
  "faq.condition.a": "Very Good condition offers the best balance of price and quality. Excellent condition items look near-new but cost 20–30% more.",
  "faq.where.q": "Where can I buy second-hand {brand} in Thailand?",
  "faq.where.a": "Carousell Thailand is the most active platform for pre-owned luxury in Thailand, with thousands of verified listings.",
  "cta.carousell": "Browse listings on Carousell Thailand",
  "nav.handbags": "Handbags",
  "nav.watches": "Watches",
  "nav.clothing": "Clothing & Shoes"
}
```

**`messages/th.json`:**
```json
{
  "page.title": "{brand} {model} มือสอง ราคา ({year})",
  "page.meta": "{brand} {model} มือสองราคาเท่าไหร่? ราคาล่าสุดจาก Carousell: ฿{min}–฿{max} ขึ้นอยู่กับสภาพสินค้า",
  "condition.excellent": "สภาพดีมาก",
  "condition.very_good": "สภาพดี",
  "condition.good": "สภาพพอใช้",
  "price.vs_retail": "เทียบราคาใหม่",
  "faq.worth_it.q": "ซื้อ {model} มือสองในไทยคุ้มไหม?",
  "faq.worth_it.a": "คุ้มมาก — {brand} มือสองในไทยมักราคาถูกกว่าของใหม่ {discount}% โดยเฉพาะสภาพดีมากถือว่าคุ้มค่าที่สุด",
  "faq.condition.q": "ควรเลือกซื้อสภาพไหนดี?",
  "faq.condition.a": "สภาพดี (Very Good) คือตัวเลือกที่ดีที่สุด ราคาประหยัดกว่าสภาพดีมาก 20–30% แต่ยังดูสวยงามมาก",
  "faq.where.q": "ซื้อ {brand} มือสองในไทยได้ที่ไหน?",
  "faq.where.a": "Carousell Thailand คือแพลตฟอร์มซื้อขายของมือสองที่ใหญ่ที่สุดในไทย มีสินค้าแบรนด์เนมให้เลือกหลายพันรายการ",
  "cta.carousell": "ดูสินค้าใน Carousell Thailand",
  "nav.handbags": "กระเป๋า",
  "nav.watches": "นาฬิกา",
  "nav.clothing": "เสื้อผ้า & รองเท้า"
}
```

---

## SEO Page Layout (`/[locale]/[brand]/[model]`)

```
H1: (from messages page.title)
Meta description: (from messages page.meta)

hreflang: EN ↔ TH alternate URLs

[AdSense — top]

Price table by condition:
  Excellent / Very Good / Good → price range (฿) + % vs retail

[CTA: Browse on Carousell Thailand]

[AdSense — middle]

FAQ section (FAQ JSON-LD schema)
  3 questions from messages (worth_it / condition / where)

[AdSense — bottom]
```

**Target keywords per page:**

English: `"buy [brand] [model] Thailand"`, `"pre-owned [brand] Bangkok"`, `"second hand [brand] price Thailand"`

Thai: `"[brand] [model] มือสอง"`, `"กระเป๋า [brand] ราคา"`, `"ซื้อ [brand] มือสอง"`

---

## Scraper

`scraper/price_sampler.py` — weekly via watchdog.

### Carousell Thailand
- Approach: Playwright to discover internal search API endpoint (same technique as Vestiaire), then `requests` POST directly.
- Expected endpoint: `th.carousell.com` internal search API (to be confirmed during implementation).
- Fields to extract: price (THB), condition, listing URL.

### C2C.in.th
- Approach: `requests` + BeautifulSoup HTML scraping (small platform, low bot risk).
- URL pattern: `https://www.c2c.in.th/search?keyword={query}`
- Fields to extract: price (THB), condition text → normalize to excellent/very_good/good.

### Flow
```
For each item in items_db.json:
  1. Query Carousell TH → collect up to 20 samples
  2. Query C2C.in.th → collect up to 10 samples
  3. Merge + trim to latest 30 samples total
  4. Recalculate price_ranges (THB)
  5. Update last_updated

Write items_db.json → git add → git commit → git push
```

**Watchdog:** `run/price_sampler_chic.pid`
**Cadence:** 168h (weekly)
**Risk:** Carousell TH API structure must be verified via Playwright before implementation.

---

## Monetization

| Source | Implementation | Timing |
|--------|----------------|--------|
| Google AdSense | 3 slots per page (top/mid/bottom), same as secondluxuryitems.com | Apply at launch |
| Carousell affiliate | CTA button → Carousell Partner Program | Apply after 10+ pages live |
| Thai page AdSense | `/th/` URLs generate independent traffic → double AdSense exposure | Automatic |

---

## Tech Stack

- Next.js App Router (same as existing sites in repo)
- next-intl for i18n routing and string translation
- Tailwind CSS 4
- Static JSON data (no DB)
- Vercel deployment — new project `chicpreowned`, scope `yunmin`
- Python scraper: requests + BeautifulSoup + Playwright (for API discovery)

## Global Constraints

- Next.js version: same as `2nd/` (check `2nd/package.json` and match exactly)
- Project root: `3rd/` (sibling to `2nd/`)
- Currency: THB throughout (no USD conversion on pages)
- Locale prefixes: `/en/` and `/th/` — no bare `/` routes except root redirect
- `retail_price_thb` field (not `retail_price_usd`)
- Platform values in price_samples: `carousell_th` or `c2c_th` only
- Vercel project name: `chicpreowned`, team scope: `yunmin`
