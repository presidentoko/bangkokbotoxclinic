import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Van Cleef & Arpels Pre-Owned: Alhambra, Perlee 2025 | SecondLuxuryItems',
  description: 'Buy pre-owned Van Cleef & Arpels — Alhambra, Perlee, Vintage Alhambra. USD prices, value retention, best VCA pieces to buy used in 2025.',
  alternates: { canonical: `${BASE}/brands/van-cleef` },
}

const pieces = [
  { name: 'Vintage Alhambra Pendant (1 motif)', range: '$1,800–3,200', retail: '~$3,500', note: 'Entry VCA. Clover motif; most accessible price point' },
  { name: 'Magic Alhambra (1 motif)', range: '$1,400–2,600', retail: '~$2,800', note: 'Smaller motif; good for layering' },
  { name: 'Alhambra Vintage Long Necklace (20)', range: '$6,500–11,000', retail: '~$12,500', note: 'Statement piece; yellow gold most liquid' },
  { name: 'Alhambra Bracelet (5 motifs)', range: '$4,500–8,000', retail: '~$9,500', note: 'Classic 5-motif bracelet — strongest resale' },
  { name: 'Perlee Bracelet (small)', range: '$2,400–4,500', retail: '~$5,200', note: 'Bead-textured gold; second most recognizable VCA line' },
  { name: 'Sweet Alhambra Earstuds', range: '$1,200–2,100', retail: '~$2,400', note: 'Pair; popular gifting piece' },
]

export default function VanCleefPage() {
  const items = getItemsByBrand('van cleef').filter(i => i.price_ranges?.very_good)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Brands</Link>
        <span className="mx-2">/</span>
        <span>Van Cleef & Arpels</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Van Cleef & Arpels Pre-Owned</h1>
      <p className="text-gray-600 text-sm mb-10">Founded 1896, Paris. Known for Alhambra (clover motif), Mystery Setting, and the Perlee collection. Now part of Richemont. Entry price significantly below Cartier fine jewelry.</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Pieces & Pre-Owned Prices (USD)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Piece</th>
                <th className="text-left py-3 px-4 font-semibold">Pre-Owned</th>
                <th className="text-left py-3 px-4 font-semibold">Retail</th>
                <th className="text-left py-3 px-4 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((p, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                  <td className="py-3 px-4 text-gray-700">{p.range}</td>
                  <td className="py-3 px-4 text-gray-400">{p.retail}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>Alhambra motif materials:</strong> Pieces come in yellow gold, white gold, rose gold, and with shell (mother-of-pearl, onyx, turquoise, carnelian) or diamond motifs. Yellow gold + mother-of-pearl is the classic — most recognizable and most liquid on the secondary market. Diamond motifs command significant premiums.
      </div>

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.slice(0, 6).map(item => (
              <Link key={item.id} href={`/${item.slug}`} className="border border-gray-200 rounded-xl p-3 hover:border-gray-400 transition-colors">
                <p className="font-medium text-gray-900 text-sm mb-1">{item.model}</p>
                <p className="text-gray-500 text-xs">{formatPrice(item.price_ranges.very_good!.min)}+</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/cartier-vs-van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs VCA →</Link>
        <Link href="/brands/cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier Pre-Owned →</Link>
        <Link href="/guides/luxury-jewelry-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Jewelry Guide →</Link>
      </div>
    </div>
  )
}
