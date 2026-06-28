import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Best Luxury Resale Platforms 2025: Vestiaire vs RealReal vs Fashionphile | SecondLuxuryItems',
  description: 'Vestiaire Collective vs The RealReal vs Fashionphile vs Rebag 2025 — fees, authentication, seller vs buyer experience, which platform to use for pre-owned luxury.',
  alternates: { canonical: `${BASE}/trends/luxury-resale-platforms-2025` },
}

const platforms = [
  {
    name: 'Vestiaire Collective',
    type: 'Peer-to-peer marketplace',
    sellerFee: '12% + €0.80 per sale (seller sets price)',
    buyerFee: '6% + fixed fee by price tier',
    auth: 'Condition/authenticity check on items over €100 (Vestiaire team or partner labs)',
    bestFor: 'European + Asia-Pacific sellers. High-end designer focus. Best reach for Hermès, Chanel, Louis Vuitton.',
    watchOut: 'Authentication can slow delivery (1–3 weeks). Disputes take time. Fees add up for low-value items.',
    verdict: 'Best international reach. If you are in Thailand or Europe, this is your best starting point for premium brands.',
  },
  {
    name: 'The RealReal',
    type: 'Consignment (US-focused)',
    sellerFee: '20–45% commission (tiered by price; you get 55–80% of sale)',
    buyerFee: 'No buyer premium. Free shipping on orders $500+',
    auth: 'In-house gemologists and luxury brand experts. Strong authentication team. US-based.',
    bestFor: 'US sellers. Hands-off consignment — they handle everything including photography. Best for Rolex, Hermès, Chanel.',
    watchOut: 'US-only consignment drop-off. Commission rates are high vs peer-to-peer. Thai buyers face US import/shipping complexity.',
    verdict: 'Best for US-based sellers who want zero effort. High commission but strong authentication trust.',
  },
  {
    name: 'Fashionphile',
    type: 'Consignment (US-focused, luxury accessories only)',
    sellerFee: '30–45% commission (they offer upfront cash buy-out option)',
    buyerFee: 'No buyer premium',
    auth: 'Specializes in handbags and accessories. Strong reputation for Hermès, Chanel, LV accuracy.',
    bestFor: 'Sellers wanting fast cash (instant buy-out). Buyers wanting deeply vetted handbags from top houses.',
    watchOut: 'US-only. Only handbags and accessories (no jewelry, no watches as primary focus). Lower payouts than peer-to-peer if item sells high.',
    verdict: 'Best for US-based sellers who want instant cash for premium handbags. Not relevant for Thai market direct use.',
  },
  {
    name: 'Rebag',
    type: 'Buyer (instant buy-out model)',
    sellerFee: 'No commission — Rebag buys directly from you at quoted price',
    buyerFee: 'Fixed retail-like pricing. No negotiation.',
    auth: 'Strong authentication. They own the item before resale so they have full incentive to verify.',
    bestFor: 'Sellers who want the fastest, most predictable cash-out. Buyers who want simple fixed-price buying with strong auth guarantee.',
    watchOut: 'Their buy prices are lower than peer-to-peer sell prices — they build in margin. Best for speed, not max value.',
    verdict: 'Use Rebag when speed and certainty matter more than maximum return. Best for Hermès, Chanel, LV.',
  },
]

export default function ResalePlatforms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Luxury Resale Platforms 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Best Luxury Resale Platforms 2025</h1>
      <p className="text-gray-500 mb-10">Vestiaire Collective, The RealReal, Fashionphile, and Rebag serve different needs and geographies. The right platform depends on whether you are buying or selling, where you are located, and whether you prioritize maximum price or speed. Four platforms, side by side.</p>

      <div className="space-y-6 mb-10">
        {platforms.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-3">
              <h2 className="font-bold text-gray-900 text-lg">{p.name}</h2>
              <span className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500">{p.type}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div className="text-xs"><span className="font-medium text-gray-700">Seller fee: </span><span className="text-gray-600">{p.sellerFee}</span></div>
              <div className="text-xs"><span className="font-medium text-gray-700">Buyer fee: </span><span className="text-gray-600">{p.buyerFee}</span></div>
            </div>
            <p className="text-xs text-gray-600 mb-2"><span className="font-medium text-gray-700">Authentication: </span>{p.auth}</p>
            <p className="text-xs text-gray-600 mb-2"><span className="font-medium text-gray-700">Best for: </span>{p.bestFor}</p>
            <p className="text-xs text-gray-600 mb-3"><span className="font-medium text-amber-700">Watch out: </span>{p.watchOut}</p>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-900">Our take: <span className="font-normal text-gray-600">{p.verdict}</span></p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-amber-900 mb-2">Quick decision guide</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• <strong>Selling from Thailand/Asia:</strong> Vestiaire Collective</li>
          <li>• <strong>Selling in the US, want hands-off:</strong> The RealReal or Fashionphile</li>
          <li>• <strong>Need cash fast:</strong> Rebag (instant buy-out)</li>
          <li>• <strong>Buying with strong auth guarantee:</strong> Rebag or Fashionphile</li>
          <li>• <strong>Best prices buying:</strong> Vestiaire (peer-to-peer, price competition)</li>
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/where-to-sell-luxury-bags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Where to Sell Guide →</Link>
        <Link href="/guides/how-to-buy-pre-owned-luxury-online" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">How to Buy Pre-Owned Online →</Link>
      </div>
    </div>
  )
}
