import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Pre-Owned vs New Luxury: Is It Worth It? ${PRICE_YEAR} Guide | SecondLuxuryItems`,
  description: 'Pre-owned vs new luxury bags and watches — price difference, condition risks, authentication, savings calculation. When to buy pre-owned and when not to.',
  alternates: { canonical: `${BASE}/guides/pre-owned-vs-new-luxury` },
}

export default function PreOwnedVsNewPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Pre-Owned vs New Luxury</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Pre-Owned vs New Luxury: Is It Worth It?</h1>
      <p className="text-gray-500 mb-10">The average luxury bag loses 20–40% of its value in the first year. But buying pre-owned isn't always the obvious call. Here's when each makes sense.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">The Price Reality</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {[
            { brand: 'Chanel Classic Flap S', retail: '$8,800', preOwned: '$6,500–7,500', saving: '15–26%', note: 'Condition + authentication critical' },
            { brand: 'LV Neverfull MM (Mono)', retail: '$1,710', preOwned: '$950–1,300', saving: '24–44%', note: 'Vachetta handles — check carefully' },
            { brand: 'Rolex Submariner Date', retail: '$9,100', preOwned: '$10,500–14,000', saving: '-15 to -54%', note: 'Above retail — buy new if you can get it' },
            { brand: 'Hermès Birkin 30', retail: '$11,400+', preOwned: '$19,000–45,000', saving: 'N/A (no retail access)', note: 'Pre-owned is the only market available' },
            { brand: 'Bottega Veneta Jodie M', retail: '$3,700', preOwned: '$1,800–2,500', saving: '32–51%', note: 'Strong savings on current-design pieces' },
            { brand: 'Gucci Dionysus Small', retail: '$2,350', preOwned: '$650–1,100', saving: '53–72%', note: 'Trend-dependent; lower demand = bigger discount' },
          ].map((row, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="font-semibold text-gray-900 mb-1">{row.brand}</div>
              <div className="text-xs text-gray-500 mb-2">Retail: {row.retail} → Pre-owned: {row.preOwned}</div>
              <div className={`text-sm font-bold ${row.saving.startsWith('-') ? 'text-red-600' : 'text-green-700'}`}>
                {row.saving.startsWith('-') ? 'Premium: ' : 'Savings: '}{row.saving}
              </div>
              <div className="text-xs text-gray-400 mt-1">{row.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">When Pre-Owned Wins</h2>
        <div className="space-y-3">
          {[
            { title: 'Discontinued designs', detail: 'Items no longer in production (Chanel 2.55 vintage hardware, LV Speedy 25 old monogram) can only be found pre-owned. Often better quality than current production.' },
            { title: 'Budget to access the brand', detail: 'A Very Good condition LV Neverfull at $950 gives you a $1,700 bag for under $1,000. The brand experience and quality is identical — the condition certificate tells you exactly what you\'re getting.' },
            { title: 'Heavily discounted trend items', detail: 'Gucci Dionysus, Givenchy Antigona, Balenciaga City Bags from 5 years ago sell at 50–70% off retail. Great for wearing now; don\'t expect the discount to grow further.' },
            { title: 'Allocation-protected items', detail: 'Hermès Birkin and Rolex Daytona simply are not available at retail to most buyers. The only way to own them is pre-owned — often at a significant premium.' },
          ].map((item, i) => (
            <div key={i} className="border-l-4 border-green-500 pl-4">
              <div className="font-semibold text-gray-900">{item.title}</div>
              <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">When New Wins</h2>
        <div className="space-y-3">
          {[
            { title: 'Minimal price gap on classics', detail: 'Chanel Classic Flap pre-owned is often only 15–20% cheaper than retail, and condition affects both usability and resale. At that gap, some prefer the certainty of new.' },
            { title: 'Sensitive leathers (lambskin)', detail: 'Pre-owned lambskin bags develop corner wear, scratches, and patina that significantly affect condition grades. Unless you find a piece in exceptional condition, new is worth the premium for daily use.' },
            { title: 'Allocation possible at retail', detail: 'For items like Rolex sports models, building a relationship with an AD can yield retail allocation after 1–2 years. If you\'re patient, retail is 20–50% cheaper than grey market.' },
          ].map((item, i) => (
            <div key={i} className="border-l-4 border-red-400 pl-4">
              <div className="font-semibold text-gray-900">{item.title}</div>
              <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 text-sm text-gray-700">
        <strong>The condition grade matters more than the price:</strong> A "Very Good" condition piece at $2,000 is usually better value than a "Fair" piece at $1,200. Condition grades directly predict resale value when you eventually sell.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/luxury-condition-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Condition Grades Guide →</Link>
        <Link href="/guides/luxury-bags-as-investments" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bags as Investments →</Link>
        <Link href="/trends/most-valuable-pre-owned-bags-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Most Valuable Pre-Owned →</Link>
      </div>
    </div>
  )
}
