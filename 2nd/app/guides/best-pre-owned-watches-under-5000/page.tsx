import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Best Pre-Owned Luxury Watches Under $5,000 (${PRICE_YEAR}) | SecondLuxuryItems`,
  description: `Best pre-owned luxury watches under $5,000. Rolex Datejust, Omega Speedmaster, Tag Heuer Carrera — top picks and what to avoid in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/guides/best-pre-owned-watches-under-5000` },
}

const picks = [
  {
    rank: 1,
    brand: 'Rolex',
    model: 'Datejust 36 (116200)',
    budget: '$2,800–4,200',
    why: 'Most liquid pre-owned watch in the world. Iconic design, bulletproof movement, huge availability. Papers add $400–600.',
    condition: 'Look for smooth bezel, no redial, original dial.',
  },
  {
    rank: 2,
    brand: 'Omega',
    model: 'Speedmaster Professional "Moonwatch" (3570.50)',
    budget: '$3,200–4,800',
    why: 'NASA-certified, hand-wound, culturally iconic. The most respected watch under $5k in collector circles.',
    condition: 'Check crystal (sapphlex chips), lume plots, Hesalite replacement history.',
  },
  {
    rank: 3,
    brand: 'TAG Heuer',
    model: 'Carrera Calibre 16',
    budget: '$1,800–3,200',
    why: 'Best entry into Swiss chronograph under $3k. Great value, strong heritage, easy to service.',
    condition: 'Inspect pushers, crown threads, caseback gasket.',
  },
  {
    rank: 4,
    brand: 'IWC',
    model: 'Portofino 40mm (IW356502)',
    budget: '$3,500–5,000',
    why: 'Dress watch credibility without the Patek premium. Clean dial, in-house movement.',
    condition: 'Check date wheel alignment, case sharpness.',
  },
  {
    rank: 5,
    brand: 'Cartier',
    model: 'Santos 100 Medium',
    budget: '$3,000–4,500',
    why: 'One of the few watches that works perfectly on wrist AND with a suit. Dual strap system is practical.',
    condition: 'Scratches on the integrated bracelet are common — polish cost ~$150.',
  },
]

export default function WatchesUnder5kPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Best Pre-Owned Watches Under $5,000</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Best Pre-Owned Luxury Watches Under $5,000 ({PRICE_YEAR})</h1>
      <p className="text-gray-500 mb-10">The sweet spot for pre-owned — significant retail savings, accessible prices, proven movements.</p>

      <div className="space-y-8">
        {picks.map(p => (
          <div key={p.rank} className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full mr-2">#{p.rank}</span>
                <span className="font-bold text-gray-900 text-lg">{p.brand} {p.model}</span>
              </div>
              <span className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">{p.budget}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{p.why}</p>
            <p className="text-xs text-gray-400"><strong>Condition check:</strong> {p.condition}</p>
          </div>
        ))}
      </div>

      <section className="mt-12 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What to Avoid</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><strong>Repolished cases:</strong> Sharp case edges should be crisp — buffed/polished cases lose value significantly</li>
          <li><strong>Redialed watches:</strong> Any non-original dial is a major deduction — check with UV light for mismatched luminous plots</li>
          <li><strong>Missing service records:</strong> For movements over 10 years old, ask when it was last serviced. Budget $300–600 if unknown.</li>
          <li><strong>Too-good-to-be-true pricing:</strong> A Rolex Submariner for $4,500 is a red flag. Know market prices before buying.</li>
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/watches" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Browse Watches →</Link>
        <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Guide →</Link>
        <Link href="/brands/omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Guide →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
