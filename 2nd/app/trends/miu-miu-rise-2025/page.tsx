import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Miu Miu Rise 2025: Which Bags Are Worth Buying Pre-Owned? | SecondLuxuryItems',
  description: 'Miu Miu named Brand of the Year 2022–2024. Which Miu Miu bags are rising in pre-owned value? Wander, Arcadie, and vintage pieces ranked.',
  alternates: { canonical: `${BASE}/trends/miu-miu-rise-2025` },
}

const bags = [
  {
    bag: 'Miu Miu Wander Bag',
    range: '$800–1,400 pre-owned',
    trend: '↑ Rising fast',
    note: 'The Wander is Miu Miu\'s breakout hit — sheepskin fur trim, slouchy silhouette, instantly recognisable. Limited production makes pre-owned scarce. Expect continued appreciation.',
  },
  {
    bag: 'Miu Miu Arcadie (Crystal)',
    range: '$1,200–2,200 pre-owned',
    trend: '↑ Rising',
    note: 'The crystal-embellished Arcadie bag became a celebrity staple. The crystal version commands 2× the price of the plain leather. Condition is critical — crystal bags show wear quickly.',
  },
  {
    bag: 'Miu Miu Mini Hobo',
    range: '$500–900 pre-owned',
    trend: '→ Stable',
    note: 'Entry point into the Miu Miu pre-owned market. Canvas and nappa versions both available. Less unique than the Wander but more practical and easier to authenticate.',
  },
  {
    bag: 'Miu Miu Vintage (1990s–2000s)',
    range: '$300–1,200 pre-owned',
    trend: '↑ Rising steeply',
    note: 'Miuccia\'s early Miu Miu designs are being rediscovered. 1990s drawstring bucket bags, logo mania pieces, and patent leather structured bags from the early 2000s are all increasing. Very niche but strong collector base.',
  },
  {
    bag: 'Miu Miu Matelassé (Leather)',
    range: '$600–1,000 pre-owned',
    trend: '→ Stable',
    note: 'Miu Miu\'s answer to the quilted handbag. Slightly lower prestige than Chanel quilted but at 40–50% of the price. Good for buyers who want the quilted aesthetic without the Chanel price.',
  },
]

export default function MiuMiuRise2025() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Miu Miu Rise 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">The Miu Miu Rise: Which Pre-Owned Pieces Are Worth Buying?</h1>
      <p className="text-gray-500 mb-10">Miu Miu was named Brand of the Year by Lyst for three consecutive years (2022–2024) — an almost unprecedented streak for any fashion label. Miuccia Prada's sister brand has moved from niche cult following to mainstream collector status. The pre-owned market for Miu Miu is early, which means opportunity — but also uncertainty. Here's what the data shows.</p>

      <div className="space-y-4 mb-10">
        {bags.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900">{b.bag}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.trend === '↑ Rising fast' ? 'bg-green-100 text-green-800' : b.trend === '↑ Rising' ? 'bg-green-50 text-green-700' : b.trend === '↑ Rising steeply' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>{b.trend}</span>
              </div>
              <span className="text-xs font-semibold text-amber-700">{b.range}</span>
            </div>
            <p className="text-sm text-gray-600">{b.note}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Miu Miu vs Prada pre-owned</h3>
          <p className="text-sm text-gray-600">Miu Miu and Prada share ownership but serve different markets. Prada pre-owned is more established and liquid. Miu Miu is higher risk, higher reward — if the brand momentum continues, early buyers in the pre-owned market will benefit significantly. If the trend reverses, Miu Miu pre-owned will underperform Prada.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Authentication tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• "MIU MIU" embossed on interior tab (no decorative stitching around it on originals)</li>
            <li>• Hardware: Miu Miu engraved on clasp, lock, and zipper pull</li>
            <li>• Serial number format: 2 letters + 4 digits (e.g., FP1234)</li>
            <li>• Made in Italy on leather tab — consistent font, no italics</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/miu-miu" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu Pre-Owned →</Link>
        <Link href="/compare/prada-vs-miu-miu" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Miu Miu →</Link>
        <Link href="/trends/best-luxury-bags-to-invest-2026" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Best Bags to Invest →</Link>
      </div>
    </div>
  )
}
