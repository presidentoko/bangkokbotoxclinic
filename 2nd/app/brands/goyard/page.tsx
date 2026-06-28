import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Goyard Pre-Owned: Saint-Louis, Anjou, Artois 2025 | SecondLuxuryItems',
  description: 'Buy pre-owned Goyard — Saint-Louis Tote, Anjou reversible, Artois. USD prices, value retention, and why Goyard resale is strong despite limited availability.',
  alternates: { canonical: `${BASE}/brands/goyard` },
}

const pieces = [
  { name: 'Saint-Louis PM', range: '$1,200–1,800', retail: '~$1,595', retention: '75–113%', note: 'Most accessible Goyard. Canvas/leather combo. Classic with strap.' },
  { name: 'Saint-Louis GM', range: '$1,500–2,200', retail: '~$1,850', retention: '81–119%', note: 'Larger version — same retention strength' },
  { name: 'Anjou PM (reversible)', range: '$1,600–2,400', retail: '~$2,095', retention: '76–115%', note: 'Two-color reversible tote; slightly firmer structure than Saint-Louis' },
  { name: 'Artois PM', range: '$1,800–2,800', retail: '~$2,350', retention: '77–119%', note: 'Top-handle tote. More structured. Very limited availability.' },
  { name: 'Cap Vert PM', range: '$2,200–3,500', retail: '~$3,100', retention: '71–113%', note: 'Doctor bag shape. Sought by collectors.' },
  { name: 'Bellechasse PM', range: '$1,400–2,000', retail: '~$1,875', retention: '75–107%', note: 'Tote with zipper top. More secure than Saint-Louis.' },
]

export default function GoyardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Brands</Link>
        <span className="mx-2">/</span>
        <span>Goyard</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Goyard Pre-Owned</h1>
      <p className="text-gray-600 text-sm mb-3">Founded 1853, Paris. Goyardine canvas (hand-printed, not woven) is among the most counterfeited luxury materials. Goyard has no official online store, minimal advertising, and no social media — by design. Demand consistently exceeds supply, making pre-owned pricing strong.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 mb-8">
        <strong>Why Goyard holds value:</strong> No e-commerce, minimal boutiques globally, zero influencer marketing. The scarcity is intentional. Pre-owned Goyard frequently sells at or above retail.
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Pieces & Pre-Owned Prices (USD)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Piece</th>
                <th className="text-left py-3 px-4 font-semibold">Pre-Owned</th>
                <th className="text-left py-3 px-4 font-semibold">Retail</th>
                <th className="text-left py-3 px-4 font-semibold text-amber-700">vs Retail</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((p, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                  <td className="py-3 px-4 text-gray-700">{p.range}</td>
                  <td className="py-3 px-4 text-gray-400">{p.retail}</td>
                  <td className="py-3 px-4 text-amber-700 font-semibold">{p.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/lv-vs-goyard" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV vs Goyard →</Link>
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Louis Vuitton Pre-Owned →</Link>
        <Link href="/trends/luxury-bags-above-retail" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Above-Retail Guide →</Link>
      </div>
    </div>
  )
}
