import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Bulgari Pre-Owned: Serpenti, B.zero1, Diva 2025 | SecondLuxuryItems',
  description: 'Buy pre-owned Bulgari jewelry and bags — Serpenti, B.zero1, Diva\'s Dream. USD prices, value retention, best pieces to buy used in 2025.',
  alternates: { canonical: `${BASE}/brands/bulgari` },
}

const pieces = [
  { name: 'Serpenti Forever Crossbody', category: 'Handbag', range: '$1,400–3,200', retail: '~$3,800', retention: '37–84%', note: 'Snake head clasp; best in black/elaphe' },
  { name: 'Serpenti Turbogas Bracelet', category: 'Jewelry', range: '$2,800–6,500', retail: '~$7,000', retention: '40–93%', note: 'Spring-coil gold — iconic design, strong demand' },
  { name: 'B.zero1 Ring (yellow gold)', category: 'Jewelry', range: '$1,200–2,800', retail: '~$3,200', retention: '37–87%', note: 'Most recognizable BV piece; 1-3-4 band variations' },
  { name: 'Diva\'s Dream Necklace', category: 'Fine jewelry', range: '$4,500–18,000', retail: '$12,000–45,000', retention: '37–40%', note: 'Fan-shaped, pearl options; best pre-owned value' },
  { name: 'Octo Roma Watch', category: 'Watch', range: '$5,500–12,000', retail: '~$12,000', retention: '46–100%', note: 'Octagonal case — Bulgari's key watch reference' },
  { name: 'Serpenti Watch (thin)', category: 'Watch', range: '$3,500–9,000', retail: '~$9,000–14,000', retention: '39–64%', note: 'Snake-form watch — theatrical, niche market' },
]

export default function BulgariPage() {
  const items = getItemsByBrand('bulgari').filter(i => i.price_ranges?.very_good)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Brands</Link>
        <span className="mx-2">/</span>
        <span>Bulgari</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Bulgari Pre-Owned</h1>
      <p className="text-gray-600 mb-10 text-sm">Founded 1884, Rome. Known for bold, colorful jewelry with ancient Roman inspiration. Now owned by LVMH. Key references: Serpenti, B.zero1, Diva's Dream, Octo.</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Pieces & Pre-Owned Prices</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Piece</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-left py-3 px-4 font-semibold">Pre-Owned</th>
                <th className="text-left py-3 px-4 font-semibold">Retail</th>
                <th className="text-left py-3 px-4 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((p, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                  <td className="py-3 px-4 text-gray-500">{p.category}</td>
                  <td className="py-3 px-4 text-gray-700">{p.range}</td>
                  <td className="py-3 px-4 text-gray-400">{p.retail}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
        <Link href="/compare/cartier-vs-bulgari" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Bulgari →</Link>
        <Link href="/brands/cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier Pre-Owned →</Link>
        <Link href="/guides/luxury-jewelry-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Jewelry Guide →</Link>
      </div>
    </div>
  )
}
