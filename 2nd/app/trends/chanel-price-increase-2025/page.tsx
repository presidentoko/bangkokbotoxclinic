import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Chanel Price Increases 2025: Classic Flap, Boy Bag History | SecondLuxuryItems',
  description: 'Chanel raised prices 40+ times since 2019. Classic Flap now $10,800 — up from $4,500. How this affects pre-owned Chanel values and what to buy used instead.',
  alternates: { canonical: `${BASE}/trends/chanel-price-increase-2025` },
}

const increases = [
  { year: '2019', classic_flap: '$5,400', boy: '$4,000', woc: '$1,925', note: 'Pre-pandemic baseline' },
  { year: '2020 (COVID)', classic_flap: '$6,100', boy: '$4,500', woc: '$2,150', note: 'Demand surge as borders closed' },
  { year: '2021', classic_flap: '$7,400', boy: '$5,400', woc: '$2,400', note: '+21% — inventory shortage' },
  { year: '2022', classic_flap: '$8,800', boy: '$6,000', woc: '$2,850', note: '+19% — multiple rounds' },
  { year: '2023', classic_flap: '$9,500', boy: '$6,300', woc: '$3,200', note: '+8% — slowdown after rapid rises' },
  { year: '2024', classic_flap: '$10,200', boy: '$6,800', woc: '$3,400', note: '+7% in Feb + Oct' },
  { year: '2025 (current)', classic_flap: '$10,800', boy: '$7,200', woc: '$3,600', note: 'Most recent increase (Q1 2025)' },
]

export default function ChanelPriceIncrease() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Chanel Price Increases 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel Price Increases 2025</h1>
      <p className="text-gray-500 mb-6">Chanel has raised prices more than 40 times since 2019 — outpacing inflation and making pre-owned Chanel one of the best alternative investments in the luxury market. The Classic Flap doubled in 6 years. Here is what that means for buyers.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <p className="text-sm text-amber-800"><span className="font-semibold">The math:</span> Classic Flap in 2019: $5,400. Classic Flap in 2025: $10,800. If you bought pre-owned in 2019 and resold in 2025, you broke even or profited — even after years of use. No other handbag category does this consistently.</p>
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Year</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Classic Flap M</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Boy Bag M</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">WOC</th>
              <th className="text-left py-3 px-4 text-gray-500">Note</th>
            </tr>
          </thead>
          <tbody>
            {increases.map((r, i) => (
              <tr key={i} className={`border-b border-gray-100 ${i === increases.length - 1 ? 'bg-gray-50 font-medium' : ''}`}>
                <td className="py-3 px-4 text-gray-900">{r.year}</td>
                <td className="py-3 px-4 text-gray-700">{r.classic_flap}</td>
                <td className="py-3 px-4 text-gray-700">{r.boy}</td>
                <td className="py-3 px-4 text-gray-700">{r.woc}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">What This Means for Pre-Owned Buyers</h2>
      <div className="space-y-3 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="font-semibold text-gray-900 mb-1">Buy pre-owned Chanel at 65–80% of current retail</p>
          <p className="text-sm text-gray-600">A Very Good condition Classic Flap sells for $7,000–$8,500 pre-owned vs $10,800 retail — but next year retail will likely be $11,500. Your pre-owned bag may appreciate while you carry it.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="font-semibold text-gray-900 mb-1">Focus on timeless pieces, not seasonal</p>
          <p className="text-sm text-gray-600">Classic Flap (caviar, black), Boy Bag (ruthenium hardware), and WOC benefit most from price increases. Seasonal and fashion pieces lose value — they do not follow the same price escalation logic.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="font-semibold text-gray-900 mb-1">Condition grade matters more than year</p>
          <p className="text-sm text-gray-600">A 2018 Classic Flap in Excellent condition is worth more than a 2022 bag in Good condition. Buy the best condition you can afford — scratched hardware and worn corners dramatically reduce resale.</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Pre-Owned →</Link>
        <Link href="/guides/chanel-price-history" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Price History →</Link>
        <Link href="/guides/luxury-bags-as-investments" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bags as Investments →</Link>
      </div>
    </div>
  )
}
