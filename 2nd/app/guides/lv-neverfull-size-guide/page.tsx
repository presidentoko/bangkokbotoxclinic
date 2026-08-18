import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `LV Neverfull Size Guide: PM vs MM vs GM Pre-Owned ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Louis Vuitton Neverfull PM vs MM vs GM — dimensions, what fits, pre-owned prices, which size to buy. The complete buying guide for used Neverfull.',
  alternates: { canonical: `${BASE}/guides/lv-neverfull-size-guide` },
}

const sizes = [
  {
    name: 'PM (Petite Modèle)',
    dimensions: '28 x 22 x 14 cm',
    liters: '~11L',
    fits: 'Tablet (up to 10"), wallet, phone, small essentials',
    bestFor: 'City bag, evenings, light carry',
    price: '$800–1,100',
    retail: '~$1,700',
    note: 'Least common → harder to find, premium pre-owned price-per-size',
  },
  {
    name: 'MM (Moyen Modèle) ★',
    dimensions: '31 x 28 x 17 cm',
    liters: '~17L',
    fits: 'A4 documents, 13" laptop (tight), gym clothes, small umbrella',
    bestFor: 'Work, daily use, travel day bag',
    price: '$1,000–1,400',
    retail: '~$2,000',
    note: 'Most popular size — best liquidity on resale, widest availability',
  },
  {
    name: 'GM (Grande Modèle)',
    dimensions: '39 x 32 x 19 cm',
    liters: '~28L',
    fits: '15" laptop, A4 folders, gym kit, weekend essentials',
    bestFor: 'Beach, gym, weekend travel, mommy bag',
    price: '$1,100–1,500',
    retail: '~$2,150',
    note: 'Largest — best value-per-litre pre-owned; sometimes overlooked',
  },
]

export default function NeverfullSizeGuidePage() {
  const lvItems = getItemsByBrand('louis vuitton')
    .filter(i => i.model?.toLowerCase().includes('neverfull') && i.price_ranges?.very_good)
    .slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Neverfull Size Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">LV Neverfull Size Guide: PM vs MM vs GM</h1>
      <p className="text-gray-500 mb-10">The Neverfull is Louis Vuitton's bestselling tote and one of the most-traded bags on the pre-owned market. Three sizes, very different use cases. Here's which to buy.</p>

      <div className="space-y-6 mb-12">
        {sizes.map((size, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">{size.name}</h2>
              <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">{size.price}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
              <div><span className="font-medium text-gray-700">Dimensions:</span> {size.dimensions}</div>
              <div><span className="font-medium text-gray-700">Volume:</span> {size.liters}</div>
              <div><span className="font-medium text-gray-700">Fits:</span> {size.fits}</div>
              <div><span className="font-medium text-gray-700">Best for:</span> {size.bestFor}</div>
            </div>
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">{size.note} · Retail: {size.retail}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>Which to buy?</strong> The MM is the right choice for 80% of buyers — it fits daily needs and has the best resale liquidity. Buy the PM only if you carry very light. Buy the GM if you need a gym/travel bag and don't mind the size. For investment: the MM holds value best.
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pre-Owned Neverfull Picks</h2>
        {lvItems.length > 0 ? (
          <div className="space-y-2">
            {lvItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
                <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Browse <Link href="/brands/louis-vuitton" className="text-blue-600 hover:underline">Louis Vuitton pre-owned →</Link></p>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Pre-Owned →</Link>
        <Link href="/compare/chanel-vs-louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs LV →</Link>
        <Link href="/guides/lv-monogram-vs-damier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Monogram vs Damier →</Link>
      </div>
    </div>
  )
}
