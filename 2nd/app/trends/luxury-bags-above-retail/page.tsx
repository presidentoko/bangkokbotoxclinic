import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Luxury Bags Selling Above Retail Pre-Owned 2025 | SecondLuxuryItems',
  description: 'Pre-owned luxury bags that cost MORE than retail: Rolex sports, Hermès Birkin, Chanel Classic, AP Royal Oak. Why waitlists drive above-retail pre-owned prices.',
  alternates: { canonical: `${BASE}/trends/luxury-bags-above-retail` },
}

const aboveRetail = [
  { brand: 'Hermès', model: 'Birkin 25 (Togo, PHW)', retail: '$11,400', preOwned: '$18,000–30,000+', premium: '+60–160%', reason: 'Allocated only — waitlist 2–5 years, no public sale' },
  { brand: 'Hermès', model: 'Kelly 25 (Epsom, GHW)', retail: '$10,300', preOwned: '$16,000–24,000', premium: '+55–130%', reason: 'Same allocation scarcity as Birkin' },
  { brand: 'Chanel', model: 'Classic Flap Small (Caviar, GHW)', retail: '$8,800', preOwned: '$9,200–11,500', premium: '+5–30%', reason: 'After 5 hikes in 6 years; demand exceeds supply' },
  { brand: 'Rolex', model: 'Submariner 126610LN', retail: '$9,100', preOwned: '$11,000–14,000', premium: '+20–55%', reason: 'AD allocation only; grey market premium standard' },
  { brand: 'Rolex', model: 'Daytona 116500LN', retail: '$13,150', preOwned: '$22,000–30,000', premium: '+70–130%', reason: 'Most-waitlisted sports Rolex worldwide' },
  { brand: 'Audemars Piguet', model: 'Royal Oak 15500ST', retail: '$24,100', preOwned: '$28,000–38,000', premium: '+15–60%', reason: 'AP stopped grey market — AD pre-approval required' },
]

export default function AboveRetailPage() {
  const allItems = getAllItems()
  const rolexItems = allItems.filter(i => i.brand?.toLowerCase() === 'rolex' && i.price_ranges?.excellent).slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Above-Retail Pre-Owned</span>
      </nav>

      <div className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">Market Trend</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Luxury Items Selling Above Retail Pre-Owned 2025</h1>
      <p className="text-gray-500 mb-10">A small group of watches and bags consistently command premiums over their brand-new retail price. Here's why — and what to watch for.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>Why above-retail exists:</strong> When brands allocate supply artificially (waitlists, purchase history requirements, AD relationships), buyers who cannot access retail pay a premium in the secondary market. This is most pronounced for Hermès leather goods and Rolex sports models.
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Above-Retail Pre-Owned Prices (2025)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Item</th>
                <th className="text-left py-3 px-4 font-semibold">Retail</th>
                <th className="text-left py-3 px-4 font-semibold">Pre-Owned</th>
                <th className="text-left py-3 px-4 font-semibold text-amber-700">Premium</th>
                <th className="text-left py-3 px-4 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {aboveRetail.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{row.brand}</div>
                    <div className="text-xs text-gray-500">{row.model}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{row.retail}</td>
                  <td className="py-3 px-4 text-gray-700">{row.preOwned}</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">{row.premium}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Is It Worth Paying Above Retail?</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p><strong className="text-gray-900">If you want it now:</strong> Yes — paying 20–30% above retail for a Submariner or small Chanel CF to have it immediately is rational when the waitlist is 1–3 years. Time value of enjoyment matters.</p>
          <p><strong className="text-gray-900">For investment purposes:</strong> Be careful. The premium compresses when brands increase allocations or the macro environment softens. The Daytona premium fell from +200% in 2022 to +100% in 2024. Never buy above retail expecting to flip for more.</p>
          <p><strong className="text-gray-900">Hermès exception:</strong> Birkin prices have held or grown consistently for 30 years. The allocation model shows no signs of changing. Above-retail pre-owned Birkins remain defensible as store-of-value purchases.</p>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/rolex-reference-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Reference Guide →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Pre-Owned →</Link>
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Pre-Owned →</Link>
      </div>
    </div>
  )
}
