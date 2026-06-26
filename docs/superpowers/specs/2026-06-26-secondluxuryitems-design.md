# secondluxuryitems.com — Design Spec
Date: 2026-06-26

## Overview

SEO price guide site for second-hand luxury goods (handbags + watches).
Static JSON architecture: Python scraper → items_db.json → git push → Vercel build.
Monetization: Google AdSense + affiliate links (Vestiaire Collective, The RealReal).

Sister site: `chicpreowned.com` (Southeast Asia / Thailand focus — separate project).

---

## Architecture

```
scraper/price_sampler.py  (weekly, managed by watchdog)
  → data/items_db.json
  → git push → Vercel auto-build

2nd/                          ← project root
├── app/
│   ├── page.tsx              # Homepage: brand grid + search
│   ├── handbags/page.tsx     # Handbag category listing
│   ├── watches/page.tsx      # Watch category listing
│   ├── [brand]/page.tsx      # /chanel, /louis-vuitton, /rolex …
│   ├── [brand]/[model]/page.tsx  # Core SEO page
│   └── sitemap.ts
├── components/
│   ├── PriceTable.tsx
│   ├── AffiliateCTA.tsx
│   └── BrandCard.tsx
├── data/
│   └── items_db.json
├── lib/
│   └── data.ts
└── scraper/
    └── price_sampler.py
```

---

## Data Model

`data/items_db.json`:

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
      "price_samples": [
        { "price": 6200, "condition": "excellent", "platform": "vestiaire", "date": "2026-06-20" }
      ],
      "affiliate_links": {
        "vestiaire": "https://www.vestiairecollective.com/search/?q=chanel+classic+flap+medium",
        "therealreal": "https://www.therealreal.com/search?query=chanel+classic+flap"
      },
      "last_updated": "2026-06-26"
    }
  ]
}
```

### Initial brand coverage (~80 pages at launch)

**Handbags:** Chanel, Louis Vuitton, Hermès, Gucci, Dior, Prada  
**Watches:** Rolex, Patek Philippe, Audemars Piguet, Cartier

---

## SEO Page Layout (`/[brand]/[model]`)

```
H1: "Used [Brand] [Model] Price Guide (2026)"
Meta description: "How much does a second hand [Model] cost?
                   Current prices: $X–$Y depending on condition."

[AdSense — top]

Price table by condition:
  Excellent / Very Good / Good → price range + % discount vs retail

[Affiliate CTA buttons]
  → "Browse listings on Vestiaire Collective"
  → "Shop on The RealReal"

[AdSense — middle]

FAQ section (FAQ schema markup):
  - Is buying used [model] worth it?
  - Which condition should I buy?
  - How to authenticate a [brand] bag/watch?

[AdSense — bottom]
```

**Target keywords per page:**
- `"used [brand] [model] price"`
- `"second hand [brand] [model]"`
- `"[brand] [model] resale value"`

---

## Scraper

`scraper/price_sampler.py` — weekly cron via watchdog.

**Target:** Vestiaire Collective search API (most scraper-accessible).  
**Method:** Search results only (not individual listings) → low bot-detection risk.

**Flow:**
1. For each item in TARGETS list, call Vestiaire search URL
2. Parse prices from JSON-LD or HTML
3. Keep latest 30 samples per item (drop older ones)
4. Recalculate `price_ranges` min/max from samples
5. Write `data/items_db.json`
6. `git add && git commit && git push`

**Bot risk mitigation:** User-Agent rotation, 1 call per item per day max, random delay between requests.

---

## Monetization

| Source | Expected timing |
|--------|----------------|
| Google AdSense | From day 1 (after approval) |
| Vestiaire affiliate (Awin network) | Apply after 10+ pages live |
| The RealReal affiliate | Apply after launch |

---

## Tech Stack

- Next.js App Router (same as existing sites)
- Tailwind CSS
- Static JSON data (no DB)
- Vercel deployment (new project: `secondluxuryitems`)
- Python scraper with requests + BeautifulSoup
