import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemsByBrand, getAllBrands, toGridItems } from '@/lib/data'
import { hasBrandGuide } from '@/lib/brand-guides'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

interface Editorial { body: string; facts?: string[] }

function getBrandEditorial(slug: string, brandName: string): Editorial {
  const map: Record<string, Editorial> = {
    'chanel': {
      body: "Chanel bags are among the strongest-appreciating luxury assets of the past decade. Retail prices have increased over 70% since 2019, meaning even 'Well Used' condition pieces can exceed older retail prices. The Classic Flap and Boy Bag drive the most secondary-market volume.",
      facts: [
        "Retail price up ~12% annually since 2015",
        "Waitlists of 1-2 years for popular colorways",
        "Black caviar leather holds value best",
        "Authentication: check CC turn-lock alignment",
      ],
    },
    'louis-vuitton': {
      body: "Louis Vuitton is the most liquid luxury brand on the secondary market — any model sells within days on Vestiaire. The Monogram and Damier canvas pieces resist condition wear better than leather, making them ideal for first-time pre-owned buyers.",
      facts: [
        "Most-searched brand on resale platforms",
        "Neverfull discontinued, now commands premium",
        "Date code format changed: post-2021 has no date code",
        "Speedies and Neverfull fastest-selling models",
      ],
    },
    'hermes': {
      body: "Hermès is the only luxury brand that consistently sells above retail on the secondary market. Birkins and Kellys are investment-grade assets — limited supply, no e-commerce, strict boutique allocation. Even hardware and leather type significantly affect price.",
      facts: [
        "Birkin 25 appreciation: ~14% annually (2015-2024)",
        "Togo and Epsom leather most durable",
        "Palladium hardware more common, Gold hardware commands 5-10% premium",
        "Full set (box, dustbag, receipt) adds 15-20%",
      ],
    },
    'gucci': {
      body: "Gucci's resale market has cooled since the peak Alessandro Michele era (2015-2021). Current prices reflect a brand in transition — creative direction change means older pieces have less designer cachet, but iconic shapes like the Marmont and Dionysus remain in demand.",
      facts: [
        "Marmont and Dionysus most searched models",
        "GG Matelassé leather shows wear on corners",
        "Ophidia canvas more durable than leather styles",
        "New Sabato De Sarno era pieces: resale TBD",
      ],
    },
    'dior': {
      body: "Dior has aggressively raised retail prices, opening a wider gap for pre-owned buyers. The Lady Dior and Saddle Bag have 25+ year design legacies — classic silhouettes that don't date. Book Tote is the most customizable piece in the luxury market.",
      facts: [
        "Book Tote values vary widely by print/design",
        "Cannage quilting is Dior's signature — check integrity",
        "Lady Dior: serial number on hardware under flap",
        "D-Jour and newer models harder to resell currently",
      ],
    },
    'prada': {
      body: "Prada's minimalist aesthetic has made a strong comeback, with the Re-Edition 2000 and Cleo becoming Gen-Z status symbols. Pre-owned Prada trades at 40-55% off retail — one of the best value propositions in accessible luxury.",
      facts: [
        "Re-Edition 2000 best value on resale market",
        "Saffiano leather nearly indestructible — look for cross-hatch pattern",
        "Triangle logo: post-2019 reads 'Prada Milano Est.1913'",
        "Nylon bags have lower resale but exceptional durability",
      ],
    },
    'saint-laurent': {
      body: "Saint Laurent occupies the entry point to serious luxury — the Loulou and Kate are among the most-gifted designer bags. Pre-owned YSL trades at 35-50% discount to retail, making it one of the more accessible luxury brands on the secondary market.",
      facts: [
        "Kate and Loulou: highest resale velocity",
        "Grain leather scratches easily — check corners",
        "Hardware: gold tarnishes faster than silver",
        "Cassandre monogram: key authentication point",
      ],
    },
    'bottega-veneta': {
      body: "Bottega Veneta's Intrecciato weave requires specialized repair, which affects long-term value. The Daniel Lee-era 'new Bottega' pieces (Pouch, Jodie, Cassette) command premiums even pre-owned. Matthieu Blazy has continued the elevation.",
      facts: [
        "Intrecciato weave: check for loose strands",
        "Nappa leather very soft but marks easily",
        "Jodie and Cassette: strongest resale velocity",
        "Original Pouch (Lee era) commands collector premium",
      ],
    },
    'celine': {
      body: "Celine's pre-owned market splits between the Phoebe Philo era (2008-2018) and the Hedi Slimane era (2018-present). Philo-era pieces — especially the Luggage and Belt — trade at or above original retail among devoted collectors.",
      facts: [
        "Philo-era pieces: Luggage, Belt, Phantom now collectible",
        "Slimane-era: strong new pieces, different aesthetic",
        "C logo vs no logo: generational collector divide",
        "Saddle-stitching quality declined post-2018 per collectors",
      ],
    },
    'fendi': {
      body: "Fendi's Baguette has become a cultural icon — featured in Sex and the City reboot, it sparked a renewed wave of demand. The Peekaboo is the brand's flagship investment piece, with artisanal construction that holds value well.",
      facts: [
        "Baguette: over 1,000 iterations since 1997",
        "Peekaboo: fully handmade, 12+ hours construction",
        "FF logo: check embossing quality",
        "Limited editions (Baguette 1997) command collector premiums",
      ],
    },
    'rolex': {
      body: "Rolex is the gold standard of watch investment. Every steel sports model (Submariner, Daytona, GMT-Master II) has traded above retail for years. The brand's deliberate supply restriction creates artificial scarcity that drives pre-owned premiums.",
      facts: [
        "Steel sports models: 20-200% above retail typically",
        "'Full set' (box + papers) adds ~15% to value",
        "Service history: major service every 5-7 years",
        "COSC chronometer certified to +/-2 sec/day",
      ],
    },
    'patek-philippe': {
      body: "Patek Philippe has the most storied auction history of any watchmaker. The Nautilus 5711 — discontinued in 2021 — immediately tripled in value. Even entry-level Calatrava pieces hold value exceptionally well versus comparable Swiss watches.",
      facts: [
        "Nautilus 5711: retail CHF 29,800, secondary market CHF 80,000+",
        "Annual Calibre movements: hand-finished to Patek standards",
        "Seal of Geneva quality mark on all movements",
        "Women's pieces often overlooked but appreciate well",
      ],
    },
    'omega': {
      body: "Omega is the best value-for-money Swiss luxury watch. Speedmaster and Seamaster trade at modest premiums on the secondary market but offer exceptional craftsmanship at 20-35% discounts to retail. Strong collector community for Speedy Tuesday editions.",
      facts: [
        "Moonwatch: worn on Apollo 11, still in production since 1969",
        "Aqua Terra and Seamaster: most liquid pre-owned Omega",
        "Co-Axial escapement: reduces friction, extends service intervals",
        "Full service every 8-10 years recommended",
      ],
    },
    'cartier': {
      body: "Cartier watches and jewelry occupy a unique position — simultaneously luxury timepieces and fashion accessories. The Santos and Tank have 100+ year design histories. Pre-owned Cartier typically trades at 30-45% below retail.",
      facts: [
        "Santos: first men's wristwatch ever made (1904)",
        "Tank: worn by Princess Diana, Andy Warhol, Jackie Kennedy",
        "Interchangeable strap system on Santos: adds versatility",
        "Cartier authentication: movement quality secondary to brand",
      ],
    },
  }

  return map[slug] ?? {
    body: `Pre-owned ${brandName} items typically sell at significant discounts to retail while maintaining quality and craftsmanship. All prices verified from authenticated listings updated weekly.`,
  }
}

interface Props { params: Promise<{ brand: string }> }

export async function generateStaticParams() {
  return getAllBrands().map(b => ({ brand: b.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) return {}
  const brandName = items[0].brand
  return {
    title: `Used ${brandName} Prices — Pre-Owned Price Guide | SecondLuxuryItems`,
    description: `Current second-hand prices for ${brandName}. Compare ${items.length} models with price ranges by condition.`,
    alternates: { canonical: `${BASE}/${brand}` },
  }
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) notFound()
  const brandName = items[0].brand

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Used ${brandName} Price Guide`,
    url: `${BASE}/${brand}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/${item.slug}`,
      name: `Used ${item.brand} ${item.model}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link> › {brandName}
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
        Used {brandName} Prices
      </h1>
      <p className="text-[#6B6052] mb-2">
        Pre-owned {brandName} prices by condition. All prices from authenticated listings, updated weekly.
      </p>
      <p className="text-[#6B6052] mb-8">Pre-owned price guide for {items.length} {brandName} model{items.length !== 1 ? 's' : ''}.</p>
      {(() => {
        const itemsWithSavings = items.filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
        if (!itemsWithSavings.length) return null
        const avgSav = Math.round(
          itemsWithSavings.reduce((sum, i) => {
            const vg = i.price_ranges.very_good!
            const avg = (vg.min + vg.max) / 2
            return sum + ((i.retail_price_usd - avg) / i.retail_price_usd * 100)
          }, 0) / itemsWithSavings.length
        )
        if (avgSav <= 0) return null
        return (
          <div className="flex items-center gap-3 mb-6 p-4 bg-[#F5F0E8] border-l-2 border-[#B8954A]">
            <span className="text-2xl font-bold text-[#4A7A35]">{avgSav}%</span>
            <span className="text-sm text-[#6B6052]">average savings vs retail across all {brandName} models</span>
          </div>
        )
      })()}
      {(() => {
        const editorial = getBrandEditorial(brand, brandName)
        return (
          <div className="my-6 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
            <p className="text-[#4A3F35] text-sm leading-relaxed">{editorial.body}</p>
            {editorial.facts && (
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {editorial.facts.map((fact, i) => (
                  <li key={i} className="text-xs text-[#8C7355]">· {fact}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })()}
      {hasBrandGuide(brand) && (
        <Link
          href={`/brands/${brand}`}
          className="block mb-6 p-4 border border-[#E8E2D9] bg-white hover:border-[#B8954A] transition-colors"
        >
          <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-1">Buying guide</p>
          <p className="text-sm text-[#4A3F35]">
            How to authenticate {brandName}, which era holds value, and what to check before you buy →
          </p>
        </Link>
      )}
      <SortableItemGrid items={toGridItems(items)} />
    </>
  )
}
