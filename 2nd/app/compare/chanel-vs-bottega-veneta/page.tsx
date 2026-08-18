import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Chanel vs Bottega Veneta: Which Pre-Owned Bag ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Chanel vs Bottega Veneta compared — Classic Flap vs Jodie, value retention, investment potential. Which should you buy pre-owned?',
  alternates: { canonical: `${BASE}/compare/chanel-vs-bottega-veneta` },
}

const rows = [
  { aspect: 'Founded', chanel: '1910 (Gabrielle Chanel)', bv: '1966, Vicenza, Italy' },
  { aspect: 'Aesthetic', chanel: 'Timeless classic — quilted, chain, logo', bv: 'Quiet luxury — intrecciato weave, no logo' },
  { aspect: 'Iconic bags', chanel: 'Classic Flap, Boy Bag, 19', bv: 'Jodie, Cassette, Pouch, Andiamo' },
  { aspect: 'Entry pre-owned', chanel: '$1,200 (mini 19/wallet)', bv: '$550 (mini Jodie)' },
  { aspect: 'Main pre-owned', chanel: '$3,500–8,000 (Classic Flap S/M)', bv: '$1,800–3,500 (medium Jodie)' },
  { aspect: 'Value retention', chanel: '70–90% (Classic Flap: 80–95%)', bv: '55–70% (Jodie: 60–70%)' },
  { aspect: 'Trend sensitivity', chanel: 'Low — classic never goes out', bv: 'Moderate — Blazy era very strong; future uncertain' },
  { aspect: 'Recognition', chanel: 'Universal (any market)', bv: 'Fashion-crowd only; office/street different audiences' },
  { aspect: 'Best for resale', chanel: 'Classic Flap Caviar (neutral color)', bv: 'Jodie (black or tan — hold best)' },
]

export default function ChanelVsBottegaPage() {
  const chanelItems = getItemsByBrand('chanel').filter(i => i.price_ranges?.very_good).slice(0, 3)
  const bvItems = getItemsByBrand('bottega veneta').filter(i => i.price_ranges?.very_good).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Chanel vs Bottega Veneta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel vs Bottega Veneta: Pre-Owned {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Maximum recognition vs quiet luxury with no logo. Two very different approaches — which pre-owned buy makes more sense?</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chanel</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Classic Flap: 80–95% value retention — best of any mass-market bag</li>
            <li>✓ Universal recognition — every market, every audience</li>
            <li>✓ 83% price increase since 2019 — pre-owned near retail</li>
            <li>✓ Lambskin quilting is timeless; not trend-driven</li>
            <li>✗ Entry cost significantly higher</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bottega Veneta</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Lower entry — excellent BV pieces under $1,000</li>
            <li>✓ Daniel Lee/Matthieu Blazy era has strong resale demand</li>
            <li>✓ Intrecciato weave is brand-recognizable without a visible logo</li>
            <li>✓ "Quiet luxury" audience values the no-logo positioning</li>
            <li>✗ More designer-director dependent than Chanel</li>
          </ul>
        </div>
      </div>

      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Aspect</th>
              <th className="text-left py-3 px-4 font-semibold">Chanel</th>
              <th className="text-left py-3 px-4 font-semibold">Bottega Veneta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.chanel}</td>
                <td className="py-3 px-4 text-gray-600">{row.bv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(chanelItems.length > 0 || bvItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {chanelItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Chanel Pre-Owned</h3>
              {chanelItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
              <Link href="/brands/chanel" className="text-sm text-blue-600 hover:underline mt-3 block">All Chanel →</Link>
            </div>
          )}
          {bvItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Bottega Veneta Pre-Owned</h3>
              {bvItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
              <Link href="/brands/bottega-veneta" className="text-sm text-blue-600 hover:underline mt-3 block">All Bottega →</Link>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/hermes-vs-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Hermès →</Link>
        <Link href="/compare/bottega-veneta-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega vs Loewe →</Link>
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Guide →</Link>
      </div>
    </div>
  )
}
