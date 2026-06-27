import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Omega vs TAG Heuer: Pre-Owned Watches 2025 | SecondLuxuryItems',
  description: 'Omega vs TAG Heuer pre-owned watches compared. Speedmaster vs Carrera — which brand holds value better and what to buy in 2025.',
  alternates: { canonical: `${BASE}/compare/omega-vs-tag-heuer` },
}

const rows = [
  { aspect: 'Founded', omega: '1848, Louis Brandt (La Chaux-de-Fonds)', tag: '1860, Edouard Heuer (Saint-Imier)' },
  { aspect: 'Iconic watch', omega: 'Speedmaster "Moonwatch" / Seamaster 300M', tag: 'Carrera / Monaco / Formula 1' },
  { aspect: 'Entry pre-owned', omega: '$1,400 (Aqua Terra, well-worn)', tag: '$800 (Formula 1, good condition)' },
  { aspect: 'Mid-range pre-owned', omega: '$2,800–4,500 (Seamaster 300M)', tag: '$1,800–3,200 (Carrera Calibre 16)' },
  { aspect: 'Value retention', omega: '60–80% (Speedmaster: 70–90%)', tag: '45–65% (Carrera: 55–70%)' },
  { aspect: 'Movement quality', omega: 'In-house Co-Axial/Master Chronometer', tag: 'Mix of in-house and ETA-based calibres' },
  { aspect: 'Heritage', omega: 'NASA Moon missions (1969–), James Bond', tag: 'Formula 1 racing history, Le Mans' },
  { aspect: 'Best pre-owned buy', omega: 'Speedmaster Pro or Seamaster 300M', tag: 'Carrera Heuer-01 or Monaco Calibre 12' },
]

export default function OmegaVsTagHPage() {
  const omegaItems = getItemsByBrand('omega').filter(i => i.price_ranges?.very_good).slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Omega vs TAG Heuer</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Omega vs TAG Heuer: Pre-Owned 2025</h1>
      <p className="text-gray-500 mb-10">The two most popular pre-owned Swiss watches under $5,000 — space heritage vs motorsport history.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Omega</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Speedmaster: NASA certified, iconic forever</li>
            <li>✓ Master Chronometer METAS certification — strongest accuracy guarantee</li>
            <li>✓ Better pre-owned value retention (60–80%)</li>
            <li>✓ Co-Axial escapement reduces service intervals</li>
            <li>✗ Higher entry price (~$1,400+) than TAG</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">TAG Heuer</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Cheaper entry — Formula 1 from $800 pre-owned</li>
            <li>✓ Monaco is culturally iconic (Steve McQueen, Le Mans)</li>
            <li>✓ Carrera: classic sports chrono design</li>
            <li>✗ Lower retention (45–65%) — greater depreciation</li>
            <li>✗ More reliance on ETA movements in older models</li>
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold">Omega</th>
                <th className="text-left py-3 px-4 font-semibold">TAG Heuer</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.omega}</td>
                  <td className="py-3 px-4 text-gray-600">{row.tag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {omegaItems.length > 0 && (
        <section className="mb-10">
          <h3 className="font-semibold text-gray-900 mb-3">Omega Pre-Owned Prices</h3>
          <div className="space-y-2">
            {omegaItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
              </div>
            ))}
          </div>
          <Link href="/brands/omega" className="text-sm text-blue-600 hover:underline mt-3 block">All Omega →</Link>
        </section>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Guide →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href="/watches" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Watches →</Link>
      </div>
    </div>
  )
}
