import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Hermès Birkin Price Increase 2025: History & Why It Keeps Rising | SecondLuxuryItems',
  description: 'Hermès Birkin price increases 2015–2025 — how much the Birkin 25/30/35 has risen in retail, why Hermès increases prices annually, and what it means for pre-owned buyers.',
  alternates: { canonical: `${BASE}/trends/hermes-birkin-price-increase-2025` },
}

const priceHistory = [
  { year: '2015', b25: '$8,500', b30: '$9,600', b35: '$10,600', note: 'Hermès announces global price harmonization' },
  { year: '2017', b25: '$9,600', b30: '$10,800', b35: '$11,900', note: '~12% increase over 2 years' },
  { year: '2019', b25: '$10,800', b30: '$12,100', b35: '$13,200', note: 'Consistent annual ~5–8% increases' },
  { year: '2021', b25: '$11,400', b30: '$12,900', b35: '$14,100', note: 'Post-COVID luxury demand surge' },
  { year: '2022', b25: '$11,900', b30: '$13,400', b35: '$14,800', note: 'Inflation adjustment' },
  { year: '2023', b25: '$12,600', b30: '$14,200', b35: '$15,600', note: 'Currency adjustments + annual rise' },
  { year: '2024', b25: '$13,200', b30: '$14,900', b35: '$16,400', note: '~5% increase' },
  { year: '2025 (est.)', b25: '$13,800–$14,200', b30: '$15,500–$16,100', b35: '$17,000–$17,800', note: 'Expected Q1 2025 increase' },
]

export default function HermesBirkinPriceIncrease() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Hermès Birkin Price Increase 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Hermès Birkin Price Increase 2025</h1>
      <p className="text-gray-500 mb-10">Hermès increases Birkin prices approximately once per year, typically in January or February. Unlike Chanel (which does multiple increases per year), Hermès is more measured — usually 5–8% annually. The result over a decade: the Birkin 30 has gone from $9,600 to over $15,000, a 56% increase since 2015.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide">Year</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Birkin 25</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Birkin 30</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Birkin 35</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Note</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((row, i) => (
              <tr key={i} className={`border-b border-gray-100 ${row.year.includes('est') ? 'bg-amber-50' : ''}`}>
                <td className="py-3 px-4 text-gray-700 font-medium">{row.year}</td>
                <td className="py-3 px-4 text-gray-700">{row.b25}</td>
                <td className="py-3 px-4 text-gray-700">{row.b30}</td>
                <td className="py-3 px-4 text-gray-700">{row.b35}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Why Hermès increases prices</h3>
          <p className="text-sm text-gray-600">Hermès uses price increases as a demand management tool, not just cost recovery. By raising retail, they keep waitlists long and maintain exclusivity. Unlike Chanel, Hermès adjusts regionally — prices in Asia-Pacific are typically 10–20% higher than US retail to account for local duties and boutique costs.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">What this means for pre-owned</h3>
          <p className="text-sm text-gray-600">Pre-owned Birkin prices move with retail but with a lag. After each retail increase, secondary market prices typically rise within 3–6 months. Pre-owned Birkin 30 in standard Epsom leather currently sits at 90–120% of the 2024 retail price — meaning it often trades at or above retail.</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-gray-900 mb-2">Birkin 30 Togo: a decade in numbers</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 2015: $9,600</li>
          <li>• 2025 (est.): $15,500–$16,100</li>
          <li>• Total increase: ~60% in 10 years</li>
          <li>• Average annual increase: ~5% (higher than S&P 500 average returns on a per-year basis in some periods)</li>
          <li>• Pre-owned price premium: often 100–150% of current retail for standard leathers</li>
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Pre-Owned →</Link>
        <Link href="/compare/kelly-vs-birkin" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Kelly vs Birkin →</Link>
        <Link href="/trends/chanel-price-increase-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Price Increases →</Link>
      </div>
    </div>
  )
}
