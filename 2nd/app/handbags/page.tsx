import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByCategory, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Luxury Handbag Prices — Chanel, LV, Hermès | SecondLuxuryItems',
  description: 'Compare pre-owned prices for Chanel, Louis Vuitton, Hermès, Gucci and more. Updated weekly from real listings.',
  alternates: { canonical: `${BASE}/handbags` },
}

export default function HandbagsPage() {
  const items = getItemsByCategory('handbags')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Luxury Handbag Prices',
    url: `${BASE}/handbags`,
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
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Pre-Owned Handbag Prices</h1>
      <p className="text-[#6B6052] mb-4">Current second-hand price ranges for top luxury handbag brands.</p>
      <p className="text-[#6B6052] mb-6">
        Compare authentic pre-owned handbag prices from Chanel, Louis Vuitton, Hermès, Gucci and more.
        Our weekly-updated price index tracks real Vestiaire Collective listings so you always know
        fair market value before buying.
      </p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} handbag models</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const savingsPct = vg && item.retail_price_usd > 0
            ? Math.round(
                ((item.retail_price_usd - (vg.min + vg.max) / 2) /
                  item.retail_price_usd) *
                  100,
              )
            : null
          return (
            <Link key={item.id} href={`/${item.slug}`}
              className="group block p-6 bg-white border border-[#E8E2D9] rounded-sm hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
            >
              <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-2">{item.brand}</p>
              <h3 className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                {item.model}
              </h3>
              {vg && (
                <div className="flex items-baseline gap-3">
                  <span className="text-lg font-medium text-[#1A1A1A]">{formatPrice(vg.min)} – {formatPrice(vg.max)}</span>
                  {savingsPct !== null && savingsPct > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-[#F5F0E8] text-[#8C7355] rounded-full">save {savingsPct}%</span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </>
  )
}
