import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Louis Vuitton Price Increase History 2025: Neverfull, Speedy, Alma | SecondLuxuryItems',
  description: 'Louis Vuitton price increases 2019–2025 — Neverfull MM, Speedy 30, Alma BB price history. How LV price hikes affect pre-owned value and when to buy.',
  alternates: { canonical: `${BASE}/trends/louis-vuitton-price-increase-2025` },
}

const priceHistory = [
  { year: '2019', neverfull: '$1,500', speedy30: '$970', almaBb: '$1,250' },
  { year: '2020', neverfull: '$1,560', speedy30: '$1,000', almaBb: '$1,290' },
  { year: '2021', neverfull: '$1,650', speedy30: '$1,060', almaBb: '$1,360' },
  { year: '2022', neverfull: '$1,820', speedy30: '$1,160', almaBb: '$1,490' },
  { year: '2023', neverfull: '$1,980', speedy30: '$1,250', almaBb: '$1,620' },
  { year: '2024', neverfull: '$2,130', speedy30: '$1,350', almaBb: '$1,760' },
  { year: '2025', neverfull: '$2,290', speedy30: '$1,470', almaBb: '$1,900' },
]

export default function LVPriceIncrease() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Louis Vuitton Price Increases 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Louis Vuitton Price Increases 2019–2025</h1>
      <p className="text-gray-500 mb-10">Louis Vuitton has increased prices consistently since 2019, accelerating through 2021–2022 alongside Chanel and Hermès. The Neverfull MM is up 53% in six years. Unlike Chanel, LV increases have been more gradual (averaging ~8% per year vs Chanel's 12%+). This matters for pre-owned buyers: LV pre-owned prices still provide meaningful savings vs retail.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Year</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Neverfull MM</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Speedy 30</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Alma BB</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((row, i) => (
              <tr key={i} className={`border-b border-gray-100 ${row.year === '2025' ? 'bg-amber-50' : ''}`}>
                <td className="py-3 px-4 text-gray-700 font-medium">{row.year}{row.year === '2025' ? ' ★' : ''}</td>
                <td className="py-3 px-4 text-gray-700">{row.neverfull}</td>
                <td className="py-3 px-4 text-gray-700">{row.speedy30}</td>
                <td className="py-3 px-4 text-gray-700">{row.almaBb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-900 mb-2">The math: Neverfull MM over 6 years</h3>
        <p className="text-sm text-amber-800">2019: $1,500 → 2025: $2,290 = <strong>+53% total</strong> (+7.5% average per year). Pre-owned Neverfull in excellent condition: $1,100–$1,600 — still 30–50% below current retail. Good pre-owned bags in the LV monogram line retain this spread as retail prices keep rising.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Best time to buy pre-owned LV</h3>
          <p className="text-sm text-gray-600">After a price increase (Jan/Feb and July/Aug are typical LV increase windows). Pre-owned sellers take time to reprice — the spread between retail and pre-owned temporarily widens.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">LV vs Chanel pre-owned math</h3>
          <p className="text-sm text-gray-600">LV pre-owned provides greater savings vs retail (30–50% below) than Chanel (20–35% below). This is because LV produces more volume. If pure price efficiency matters most, LV pre-owned wins over Chanel pre-owned.</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Louis Vuitton Pre-Owned →</Link>
        <Link href="/trends/chanel-price-increase-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Price History →</Link>
        <Link href="/guides/lv-neverfull-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Neverfull Size Guide →</Link>
      </div>
    </div>
  )
}
