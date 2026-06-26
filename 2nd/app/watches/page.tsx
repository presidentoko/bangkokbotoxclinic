import type { Metadata } from 'next'
import { getItemsByCategory } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

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
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Pre-Owned Watch Prices</h1>
      <p className="text-[#6B6052] mb-4">Current second-hand price ranges for top luxury watch brands.</p>
      <p className="text-[#6B6052] mb-6">
        Real pre-owned watch prices for Rolex, Patek Philippe, Audemars Piguet and Cartier.
        Updated weekly from authenticated marketplace listings.
      </p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} watch models</p>
      <SortableItemGrid items={items} />
    </>
  )
}
