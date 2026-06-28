import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'The Phoebe Philo Effect 2025: Which Celine Bags to Buy Now | SecondLuxuryItems',
  description: 'Phoebe Philo\'s impact on pre-owned Celine 2025 — which Philo-era bags are rising in value, the new Philo label, and why collectors are rushing back to quiet luxury.',
  alternates: { canonical: `${BASE}/trends/phoebe-philo-effect-2025` },
}

const philoBags = [
  { bag: 'Celine Phantom (Philo era)', priceRange: '$800–$2,000 pre-owned', trend: '↑ Rising', note: 'The Phantom is the most sought-after Philo-era silhouette. Structured trapeze shape. Strong collector demand.' },
  { bag: 'Celine Trio Bag', priceRange: '$180–$380 pre-owned', trend: '→ Stable', note: 'Three-in-one bag system. Extremely practical, now affordable. Good gift or entry piece.' },
  { bag: 'Celine Classic Box', priceRange: '$500–$1,200 pre-owned', trend: '↑ Rising', note: 'The box clutch with a gold chain. Philo\'s most recognizable design. Medium rising demand.' },
  { bag: 'Celine Cabas Vertical', priceRange: '$400–$800 pre-owned', trend: '↑ Rising', note: 'Large canvas tote with leather trim. Practical and rising. Less counterfeited than other Philo pieces.' },
  { bag: 'Celine Luggage Tote (Philo)', priceRange: '$600–$1,400 pre-owned', trend: '→ Stable', note: 'The iconic face-shaped tote. Still widely recognized and available. Slimane continued this style.' },
  { bag: 'Celine Sangle Bucket (Philo)', priceRange: '$700–$1,500 pre-owned', trend: '↑ Rising', note: 'Strappy suede bucket bag — a collector-tier Philo piece. Very niche, rising steeply.' },
]

export default function PhoebePhiloEffect() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Phoebe Philo Effect 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">The Phoebe Philo Effect 2025</h1>
      <p className="text-gray-500 mb-10">When Phoebe Philo left Celine in 2018, she left a legacy that took a few years to become clear: her designs had quietly become the most investable Celine pieces ever made. The contrast with Hedi Slimane's logomania cemented the Philo-era aesthetic as a collector's movement. Now, with the new Philo label launching, the hype has returned — and pre-owned Philo-era Celine is rising fast.</p>

      <div className="space-y-3 mb-10">
        {philoBags.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 text-sm">{b.bag}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.trend === '↑ Rising' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.trend}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{b.note}</p>
              <p className="text-xs font-semibold text-amber-700">{b.priceRange}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">How to identify Philo-era Celine</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Accent-free "CELINE" on bags (no accent on the first E)</li>
            <li>• Interior stamp: "CELINE PARIS Made in Italy/France"</li>
            <li>• Hardware: gold or Palladium, usually understated</li>
            <li>• Period: 2008–2018</li>
            <li>• Slimane era (2018+): "CÉLINE" with accent on E</li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">The new Philo label</h3>
          <p className="text-sm text-gray-600">Phoebe Philo launched her eponymous label in 2023. Unlike the pre-owned Celine market, the new Philo pieces (priced $500–$4,000+) target an existing luxury customer who already knows her aesthetic. The new Philo label is creating a renewed halo effect on all her Celine pieces.</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Celine Pre-Owned →</Link>
        <Link href="/compare/loewe-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe vs Celine →</Link>
        <Link href="/trends/quiet-luxury-bags-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Quiet Luxury 2025 →</Link>
      </div>
    </div>
  )
}
