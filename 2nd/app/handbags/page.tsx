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
