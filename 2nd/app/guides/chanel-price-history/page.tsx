import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Chanel Price History 2019–${PRICE_YEAR}: How Much Have Prices Gone Up? | SecondLuxuryItems`,
  description: `Chanel Classic Flap price hike timeline 2019–${PRICE_YEAR}. From $5,900 to $10,800 — a 83% increase. How it affects pre-owned value and what to buy instead.`,
  alternates: { canonical: `${BASE}/guides/chanel-price-history` },
}

export default function ChanelPriceHistoryPage() {
  const hikes = [
    { date: 'Nov 2019', size: 'M/L Classic Flap', price: '$5,900', change: 'Base' },
    { date: 'May 2020', size: 'M/L Classic Flap', price: '$6,200', change: '+$300 (+5%)' },
    { date: 'Oct 2021', size: 'M/L Classic Flap', price: '$7,300', change: '+$1,100 (+18%)' },
    { date: 'Mar 2022', size: 'M/L Classic Flap', price: '$8,200', change: '+$900 (+12%)' },
    { date: 'Nov 2022', size: 'M/L Classic Flap', price: '$9,500', change: '+$1,300 (+16%)' },
    { date: 'Apr 2024', size: 'M/L Classic Flap', price: '$10,200', change: '+$700 (+7%)' },
    { date: 'Mar 2025', size: 'M/L Classic Flap', price: '$10,800', change: '+$600 (+6%)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Chanel Price History</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel Price History 2019–{PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">The Classic Flap M/L went from $5,900 in 2019 to $10,800 in 2025 — an 83% increase in 6 years. Here's every hike and what it means for pre-owned buyers.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Classic Flap M/L Price Hike Timeline</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-right py-3 px-4 font-semibold">New Price</th>
                <th className="text-right py-3 px-4 font-semibold">Change</th>
              </tr>
            </thead>
            <tbody>
              {hikes.map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i === hikes.length - 1 ? 'bg-red-50' : ''}`}>
                  <td className="py-3 px-4 text-gray-700 font-medium">{row.date}</td>
                  <td className="text-right py-3 px-4 font-mono font-bold text-gray-900">{row.price}</td>
                  <td className="text-right py-3 px-4 text-red-600 text-sm">{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">USD retail. Prices vary by region.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Has Chanel Raised Prices So Aggressively?</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p><strong>1. Exclusivity strategy:</strong> Chanel deliberately limits access to maintain aspirational status. Raising prices is part of this positioning — it's a feature, not a bug.</p>
          <p><strong>2. Global price equalization:</strong> Before 2020, Chanel was 20–30% cheaper in Europe than the US. Price hikes have equalized global markets, reducing arbitrage travel buying.</p>
          <p><strong>3. Raw material costs:</strong> Lambskin and caviar leather costs increased post-COVID, contributing to some hikes.</p>
          <p><strong>4. It works:</strong> Despite the hikes, waitlists remain. Demand hasn't dropped — if anything, higher prices have increased desirability.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What This Means for Pre-Owned Buyers</h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-900 mb-4">
          <strong>The pre-owned advantage:</strong> A 2022-era M/L Classic Flap at retail was $8,200. Today's retail is $10,800. Buy that 2022 bag pre-owned for $6,500–7,500 — and you're getting a bag that cost $8,200 new for $6,500, while retail has gone up another 32% since then.
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="border-l-4 border-blue-400 pl-4">Pre-owned Chanels from 2021–2022 are underpriced relative to current retail</div>
          <div className="border-l-4 border-green-400 pl-4">Even "Very Good" condition bags from 2019–2021 retain 80–90% of their original purchase price</div>
          <div className="border-l-4 border-amber-400 pl-4">The Maxi (discontinued size) is now the biggest value play — retail was lower, pre-owned supply is higher</div>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/chanel-bag-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Size Guide →</Link>
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Chanel Prices →</Link>
        <Link href="/compare/chanel-vs-louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs LV →</Link>
      </div>
    </div>
  )
}
