import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByCategory, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Luxury Watch Prices — Rolex, Patek, AP | SecondLuxuryItems',
  description: 'Compare pre-owned prices for Rolex, Patek Philippe, Audemars Piguet and Cartier. Updated weekly from real listings.',
  alternates: { canonical: `${BASE}/watches` },
}

export default function WatchesPage() {
  const items = getItemsByCategory('watches')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Luxury Watch Prices',
    url: `${BASE}/watches`,
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
      <h1 className="text-3xl font-bold mb-2">Pre-Owned Watch Prices</h1>
      <p className="text-gray-600 mb-4">Current second-hand price ranges for top luxury watch brands.</p>
      <p className="text-gray-600 mb-6">
        Real pre-owned watch prices for Rolex, Patek Philippe, Audemars Piguet and Cartier.
        Updated weekly from authenticated marketplace listings.
      </p>
      <p className="text-sm text-gray-400 mb-6">Tracking {items.length} watch models</p>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const savings =
            vg && item.retail_price_usd > 0
              ? Math.round(
                  ((item.retail_price_usd - (vg.min + vg.max) / 2) /
                    item.retail_price_usd) *
                    100,
                )
              : null
          return (
            <Link
              key={item.id}
              href={`/${item.slug}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded"
            >
              <div>
                <span className="font-medium">{item.brand} {item.model}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {savings !== null && (
                  <span
                    className={savings > 0 ? 'text-green-600 font-medium' : 'text-orange-500 font-medium'}
                  >
                    {savings > 0 ? `Save ~${savings}%` : `~${Math.abs(savings)}% above retail`}
                  </span>
                )}
                <span className="text-gray-500">
                  {vg ? `${formatPrice(vg.min)} – ${formatPrice(vg.max)}` : 'See guide'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
