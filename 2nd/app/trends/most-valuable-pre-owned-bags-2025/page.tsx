import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Most Valuable Pre-Owned Bags to Buy in 2025 | SecondLuxuryItems',
  description: 'The most valuable pre-owned luxury bags in 2025 — what\'s appreciating, what\'s declining, and where the best value lies right now.',
  alternates: { canonical: `${BASE}/trends/most-valuable-pre-owned-bags-2025` },
}

export default function MostValuableBags2025() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Most Valuable Pre-Owned Bags 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Most Valuable Pre-Owned Bags to Buy in 2025</h1>
      <p className="text-gray-500 mb-10">Where the market is moving — what's appreciating, what's declining, and the smartest buys right now.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Appreciating Pieces in 2025</h2>
        <div className="space-y-4">
          {[
            { rank: 1, badge: 'Appreciating', badgeColor: 'bg-green-100 text-green-800', name: 'Hermès Birkin 25cm Togo', detail: 'All Birkin 25s have outperformed retail. Current pre-owned: 150–250% of retail. Demand exceeds supply despite retail price hikes.', price: '$14,000–28,000' },
            { rank: 2, badge: 'Above Retail', badgeColor: 'bg-amber-100 text-amber-800', name: 'Chanel Classic Flap Medium (Caviar)', detail: 'Post-2023 price hikes make new retail nearly inaccessible. Pre-owned now trades at 100–120% of original retail. Best buy under $6,000.', price: '$5,800–7,200' },
            { rank: 3, badge: 'Collectible', badgeColor: 'bg-blue-100 text-blue-800', name: 'Bottega Veneta Cassette (Daniel Lee era)', detail: 'Lee left BV in 2021. His Cassette bags are now considered collector\'s pieces — demand growing, supply limited.', price: '$2,100–3,200' },
            { rank: 4, badge: 'Rising', badgeColor: 'bg-purple-100 text-purple-800', name: 'Dior Saddle Bag (vintage 1999–2004)', detail: 'Original Galliano-era Saddle bags are finally getting collector recognition. Condition is key — pristine pieces up 40% YoY.', price: '$1,800–4,500' },
            { rank: 5, badge: 'Strong Hold', badgeColor: 'bg-gray-100 text-gray-800', name: 'Louis Vuitton Neverfull MM (Monogram)', detail: 'The most liquid luxury bag in the world. Holds 85–100% of value. Best for buyers who may want to resell quickly.', price: '$900–1,400' },
          ].map((item) => (
            <div key={item.rank} className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400 text-lg">#{item.rank}</span>
                  <span className="font-bold text-gray-900">{item.name}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badgeColor}`}>{item.badge}</span>
                  <span className="text-sm font-semibold text-gray-700">{item.price}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Declining in 2025</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><strong>Supreme collaborations (2017–2020):</strong> Streetwear hype cooled; LV x Supreme pieces now trade 30–40% below peak</li>
          <li><strong>Gucci Dionysus/Marmont (non-GG canvas):</strong> Trend-driven designs losing 40–50% of retail — brand reset underway</li>
          <li><strong>Balenciaga "statement" pieces (2022):</strong> Controversy-era pieces trading at 40–55% of retail</li>
          <li><strong>Coach (non-vintage):</strong> Contemporary Coach holds 30–45% — wait for vintage 1990s pieces instead</li>
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/value-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Full Value Guide →</Link>
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Prices →</Link>
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Prices →</Link>
      </div>
    </div>
  )
}
