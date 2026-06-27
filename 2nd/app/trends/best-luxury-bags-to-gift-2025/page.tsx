import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Best Luxury Bags to Gift Pre-Owned 2025 | SecondLuxuryItems',
  description: 'The best pre-owned luxury bags to give as gifts in 2025 — by budget ($500, $1k, $2k, $5k+) with value retention, presentation tips, and brands that land well.',
  alternates: { canonical: `${BASE}/trends/best-luxury-bags-to-gift-2025` },
}

export default function BestLuxuryBagsGiftPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Best Luxury Bags to Gift 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Best Pre-Owned Luxury Bags to Gift in 2025</h1>
      <p className="text-gray-500 mb-10">Gifting luxury pre-owned is smarter than buying new — same bag, same presentation, often 20–40% less. Here's what lands best by budget.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">By Budget</h2>
        <div className="space-y-6">
          {[
            {
              budget: 'Under $500',
              color: 'blue',
              picks: [
                { item: 'Louis Vuitton Pochette Accessoires', price: '$300–450', note: 'Instantly recognizable, fits essentials, extremely giftable' },
                { item: 'Gucci GG Canvas Pouch', price: '$280–400', note: 'Stylish and practical — great for any age' },
                { item: 'Coach Tabby Shoulder Bag (vintage)', price: '$200–380', note: 'Rising resale value, hits the quiet luxury trend' },
              ]
            },
            {
              budget: '$500–$1,000',
              color: 'green',
              picks: [
                { item: 'Chanel Mini Wallet on Chain', price: '$600–900', note: 'Entry Chanel — high gifting impact for the price' },
                { item: 'Louis Vuitton Speedy 25 Monogram', price: '$600–850', note: 'Classic, works for every occasion' },
                { item: 'Dior Lady Dior Clutch', price: '$700–950', note: 'Evening occasion — very impactful unboxing' },
              ]
            },
            {
              budget: '$1,000–$2,000',
              color: 'purple',
              picks: [
                { item: 'Chanel 19 Flap Small', price: '$1,200–1,800', note: 'Modern Chanel — very popular with 25–35 age group' },
                { item: 'Saint Laurent Puffer Bag', price: '$1,000–1,500', note: 'Trending 2024–2025, very photogenic' },
                { item: 'Bottega Veneta Cassette', price: '$1,200–1,700', note: 'Quiet luxury at its peak — no visible logo' },
              ]
            },
            {
              budget: '$2,000–$5,000+',
              color: 'amber',
              picks: [
                { item: 'Chanel Classic Flap Small', price: '$5,500–7,500', note: 'The gift that keeps value — 95–100% retention' },
                { item: 'Hermès Picotin 18', price: '$3,500–5,000', note: 'Attainable Hermès, open-top bucket style' },
                { item: 'Cartier Love Bracelet (gold)', price: '$3,800–5,500', note: 'Jewelry crossover — universal wow factor' },
              ]
            },
          ].map((section, i) => (
            <div key={i} className={`border border-gray-200 rounded-xl overflow-hidden`}>
              <div className="bg-gray-50 px-5 py-3 font-semibold text-gray-900 border-b border-gray-200">{section.budget}</div>
              <div className="divide-y divide-gray-100">
                {section.picks.map((pick, j) => (
                  <div key={j} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">{pick.item}</span>
                      <span className="text-green-700 font-medium text-sm">{pick.price}</span>
                    </div>
                    <p className="text-xs text-gray-500">{pick.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Gifting Tips for Pre-Owned</h2>
        <ul className="text-sm text-gray-600 space-y-3">
          <li><strong>Condition is everything:</strong> Gift pre-owned bags rated "Excellent" or "Very Good." Don't go below. The presentation needs to feel special.</li>
          <li><strong>Skip the box, add a bag:</strong> A clean dust bag presentation feels luxurious. A damaged brown box does not. Opt for clean presentation over original packaging.</li>
          <li><strong>Include authenticity certificate:</strong> Use a third-party authentication service (Entrupy, Real Authentication) — gives confidence to the recipient.</li>
          <li><strong>Brand matters over model:</strong> Recipients remember "Chanel" and "Hermès" more than the specific model. Optimize for brand recognition at a given budget.</li>
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/luxury-gift-guide-under-500" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gift Guide Under $500 →</Link>
        <Link href="/guides/luxury-gift-guide-under-1000" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gift Guide Under $1k →</Link>
        <Link href="/trends/most-valuable-pre-owned-bags-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Most Valuable 2025 →</Link>
      </div>
    </div>
  )
}
