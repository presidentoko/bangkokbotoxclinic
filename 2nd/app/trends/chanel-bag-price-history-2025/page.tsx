import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Chanel Bag Price History 2025: How Much Prices Have Risen & What to Do Now | SecondLuxuryItems',
  description: 'Chanel bag price history 2025 — Classic Flap rose from $3,900 (2008) to $10,100 (2024). Analysis of 7 price increases, pre-owned vs retail, and whether Chanel is still a good investment.',
  alternates: { canonical: `${BASE}/trends/chanel-bag-price-history-2025` },
}

const timeline = [
  { year: '2008', price: '$2,100 / €1,450', note: 'Classic Flap M/L before global luxury price harmonisation' },
  { year: '2013', price: '$3,900', note: 'First major post-crisis increase. Pre-owned M/L still $2,200-2,800' },
  { year: '2018', price: '$4,900', note: '~$1,000 increase in 5 years. Pre-owned now $3,200-3,800' },
  { year: '2020', price: '$5,800', note: 'Covid-year increase — counterintuitive but demand surged' },
  { year: '2021', price: '$7,400', note: 'Two increases in same year. Pre-owned briefly exceeded retail for Mini' },
  { year: '2022', price: '$8,800', note: 'Two increases. Classic Flap M/L caviar gold: pre-owned $9,000-11,000' },
  { year: '2023', price: '$10,100', note: '+157% from 2018 in 5 years. "Price parity" policy with Chanel official' },
  { year: '2024', price: '$10,100', note: 'First year with no increase since 2019 — pause or end of run?' },
]

export default function ChanelBagPriceHistory2025() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Chanel Price History 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel Bag Price History 2025: 157% in 5 Years</h1>
      <p className="text-gray-500 mb-6">The Classic Flap M/L in caviar leather cost $4,900 in 2018. In 2023, the same bag retails for $10,100 — a 106% increase in five years. Over 15 years since 2008, the increase is 381%. No stock, bond, or real estate market outside of a few urban property bubbles has matched this trajectory.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm font-medium text-amber-900">Why Chanel keeps raising prices</p>
        <p className="text-sm text-amber-800">Chanel's stated goal is "global price harmonisation" — bringing prices in line across all markets to eliminate grey-market arbitrage. But the real driver is simple supply/demand: with no increase in production volume, every price increase has been absorbed by the market with continued strong demand. Each increase has also driven pre-owned prices up correspondingly. The 2024 pause (no increase) may indicate Chanel has found a temporary ceiling — or is setting up for larger future increases.</p>
      </div>

      <div className="space-y-3 mb-10">
        <h2 className="font-semibold text-gray-900">Classic Flap M/L price timeline (Caviar, Gold Hardware)</h2>
        {timeline.map((t, i) => (
          <div key={i} className="flex gap-4 items-start border-l-2 border-amber-200 pl-4 py-2">
            <div className="w-12 text-xs font-bold text-amber-800 shrink-0">{t.year}</div>
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-900">{t.price}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold text-green-900 mb-2">Pre-owned vs retail: the arbitrage opportunity</h3>
          <p className="text-sm text-green-800">During 2021-2022, the Classic Flap pre-owned market briefly exceeded retail — particularly for the M/L in caviar gold. A $8,800 retail bag was selling pre-owned for $9,500-11,000. This anomaly has partially corrected, but excellent-condition pre-owned Chanels from 2018-2020 remain viable "catch-up" plays as retail continues to push higher.</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">Is Chanel still a good investment?</h3>
          <p className="text-sm text-blue-800">The Classic Flap and Boy Bag have genuinely outperformed most financial assets over 10+ year horizons. The risk now: retail is at $10,100 for a bag that costs $3,900 of materials — there is a ceiling somewhere. The 2024 no-increase pause is the first meaningful market signal that Chanel may be approaching that ceiling. Best pre-owned bet: 2019-2021 pieces in like-new condition.</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/chanel-price-history" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Price History Guide →</Link>
        <Link href="/guides/chanel-19-vs-classic-flap" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">C19 vs Classic Flap →</Link>
        <Link href="/guides/how-to-authenticate-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Chanel →</Link>
        <Link href="/trends/chanel-price-increase-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">2025 Price Increase →</Link>
      </div>
    </div>
  )
}
