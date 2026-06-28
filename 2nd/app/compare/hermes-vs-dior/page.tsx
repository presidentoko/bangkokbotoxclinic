import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Hermès vs Dior Pre-Owned 2025: Investment vs Fashion | SecondLuxuryItems',
  description: 'Hermès vs Dior pre-owned comparison — Birkin vs Lady Dior investment case, resale values, price tiers, which to buy used in 2025.',
  alternates: { canonical: `${BASE}/compare/hermes-vs-dior` },
}

const rows = [
  { metric: 'Icon bag', hermes: 'Birkin ($12,000–$80,000+)', dior: 'Lady Dior ($2,000–$5,500)' },
  { metric: 'Entry price', hermes: '$3,500+ (Evelyne PM)', dior: '$1,800+ (Lady Dior Mini)' },
  { metric: 'Resale vs retail', hermes: '100–400%+ (Birkin/Kelly exotic)', dior: '55–75%' },
  { metric: 'Investment case', hermes: 'The strongest in luxury — Birkin consistently beats inflation', dior: 'Moderate — Lady Dior standard holds 55–75%, limited editions better' },
  { metric: 'Availability', hermes: 'Extremely limited at boutique — secondary market only realistic option', dior: 'In stock at boutique — easy to buy, easier to find pre-owned' },
  { metric: 'Creative direction', hermes: 'Nadège Vanhee — classic equestrian, no trend-following', dior: 'Maria Grazia Chiuri — fashion-forward, feminist messaging' },
  { metric: 'Craftsmanship', hermes: 'Each bag 15–25 hours, single artisan — unmatched in industry', dior: 'High quality — Lady Dior cannage quilting is labor-intensive' },
  { metric: 'Best for', hermes: 'Investment store of value, never needing to sell at a loss', dior: 'Fashion-first buyer who wants haute couture association' },
]

export default function HermesVsDior() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Hermès vs Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Hermès vs Dior Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Hermès and Dior represent two very different luxury propositions. Hermès is the investment play — the Birkin has never lost value and consistently appreciates. Dior is the fashion play — Lady Dior gives you haute couture association and strong style recognition at a fraction of Hermès prices. Both are correct answers depending on what you want.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Hermès</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Dior</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.hermes}</td>
                <td className="py-3 px-4 text-gray-700">{r.dior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Pre-Owned →</Link>
        <Link href="/brands/dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior Pre-Owned →</Link>
        <Link href="/compare/hermes-vs-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès vs Chanel →</Link>
      </div>
    </div>
  )
}
