import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Miu Miu Pre-Owned Bags & Shoes ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Buy pre-owned Miu Miu bags and shoes — Matelassé, Wander, Arqué and more. USD prices, condition ratings, value retention analysis.',
  alternates: { canonical: `${BASE}/brands/miu-miu` },
}

const signature = [
  { model: 'Wander Bag', material: 'Matelassé Nappa', note: 'Prada Group\'s hottest 2023–25 bag; highest resale demand' },
  { model: 'Arqué Bag', material: 'Leather', note: 'Architectural top-handle; strong hold at 65–75%' },
  { model: 'Matelassé Clutch', material: 'Nappa Leather', note: 'Entry quilted piece; accessible pre-owned entry' },
  { model: 'Crystal Mule', material: 'Satin/Crystal', note: 'Viral footwear — condition critical for resale' },
  { model: '5-Pocket Jean (vintage)', material: 'Denim', note: 'Pre-loved Miu Miu skirts+jeans trending; fragile market' },
]

export default function MiuMiuBrandPage() {
  const items = getItemsByBrand('miu miu').filter(i => i.price_ranges?.very_good).slice(0, 6)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Brands</Link>
        <span className="mx-2">/</span>
        <span>Miu Miu</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Miu Miu Pre-Owned</h1>
      <p className="text-gray-500 mb-8">Miuccia Prada's playful younger label — the Wander Bag and crystal mules dominate resale in 2024–25.</p>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">50–75%</div>
          <div className="text-sm text-gray-500 mt-1">Value retention</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">$450+</div>
          <div className="text-sm text-gray-500 mt-1">Entry pre-owned</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">Trending</div>
          <div className="text-sm text-gray-500 mt-1">Gen Z & fashion crowd</div>
        </div>
      </div>

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pre-Owned Miu Miu Listings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map(item => (
              <Link key={item.id} href={`/${item.slug}`} className="border border-gray-200 rounded-xl p-4 hover:border-gray-400 transition-colors">
                <div className="font-medium text-gray-900">{item.model}</div>
                <div className="text-sm text-gray-500 mt-1">{item.category}</div>
                <div className="text-sm font-semibold text-gray-900 mt-2">{formatPrice(item.price_ranges.very_good!.min)} – {formatPrice(item.price_ranges.very_good!.max)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Signature Pieces & Pre-Owned Notes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-left py-3 px-4 font-semibold">Material</th>
                <th className="text-left py-3 px-4 font-semibold">Pre-Owned Note</th>
              </tr>
            </thead>
            <tbody>
              {signature.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                  <td className="py-3 px-4 text-gray-600">{row.material}</td>
                  <td className="py-3 px-4 text-gray-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 mb-8">
        <strong>Wander Bag demand note:</strong> The Wander took off in 2023 and shows above-average resale demand through 2025. Pre-owned prices in excellent condition hold 70–75% of retail — unusually strong for a non-Chanel/Hermès brand.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/prada" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Sister brand: Prada →</Link>
        <Link href="/compare/balenciaga-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga vs Valentino →</Link>
        <Link href="/brands" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Brands →</Link>
      </div>
    </div>
  )
}
