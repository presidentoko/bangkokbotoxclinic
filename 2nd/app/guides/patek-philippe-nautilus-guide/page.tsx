import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Patek Philippe Nautilus Buying Guide ${PRICE_YEAR} — Pre-Owned Prices | SecondLuxuryItems`,
  description: `Complete Nautilus buying guide — 5711, 5712, 5726, 5740 models. Pre-owned prices, market trends, authentication basics. Should you buy Nautilus in ${PRICE_YEAR}?`,
  alternates: { canonical: `${BASE}/guides/patek-philippe-nautilus-guide` },
}

const models = [
  {
    ref: '5711/1A-010',
    name: 'Nautilus 5711 Steel Blue Dial',
    price: '$120,000–$200,000+',
    retail: '~$34,000 (discontinued)',
    note: 'The grail. Discontinued 2021 after 45 years. Steel + blue dial = most liquid watch in pre-owned market. Prices spiked to $250k+ at peak; normalized. Still holds 3–5× retail.',
  },
  {
    ref: '5712/1A-001',
    name: 'Nautilus 5712 Steel Moon Phase',
    price: '$65,000–$100,000',
    retail: '~$55,000',
    note: 'The Nautilus with complications. Power reserve + moon phase on the dial. Three-hand variant (5712) is more versatile than 5711 was. Holds 1.5–2× retail comfortably.',
  },
  {
    ref: '5726A-001',
    name: 'Nautilus 5726 Annual Calendar',
    price: '$80,000–$130,000',
    retail: '~$65,000',
    note: 'The most utilitarian Nautilus complication. Annual calendar needs one adjustment per year. Strong demand from collectors who want a daily driver with purpose. Steel 5726 holds well.',
  },
  {
    ref: '5740/1G-001',
    name: 'Nautilus 5740 Perpetual Calendar (White Gold)',
    price: '$280,000–$400,000+',
    retail: '~$195,000',
    note: 'The ultra-grail. White gold case, sky-blue dial, perpetual calendar. Extremely limited allocation. Holds 1.5–2× retail even in white gold. The true collector piece.',
  },
]

const authChecks = [
  'Case finishing: alternating polished and brushed surfaces — fake Nautilus almost always look too shiny or too matte',
  'Horizontal embossed dial: real 5711 dials have a subtle horizontal texture that catches light differently at every angle',
  'Lugs: should taper elegantly into the bracelet with no visible gap or misalignment',
  'Movement: Caliber 26-330 SC in 5711, visible through caseback. Decorated bridges, Gyromax balance wheel',
  'Serial on caseback: Patek serial engraved on caseback between lugs, also on certificate',
  'Box and papers: Patek Calatrava box, cream papers with watch serial, purchase date, and retailer stamp',
]

export default function PatekNautilusPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Patek Nautilus Buying Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Patek Philippe Nautilus Buying Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">The Nautilus redefined what a luxury sports watch could be in 1976 — and it still does. Since Patek discontinued the 5711 in 2021, the pre-owned market has been the only source. Here is what to look for, what to pay, and what to avoid.</p>

      <div className="space-y-4 mb-10">
        {models.map((m, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div>
                <span className="text-xs font-mono text-gray-400 block mb-1">Ref. {m.ref}</span>
                <h2 className="font-bold text-gray-900">{m.name}</h2>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-gray-900">{m.price}</div>
                <div className="text-xs text-gray-400">Retail: {m.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{m.note}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">6 Authentication Points</h2>
      <div className="space-y-2 mb-10">
        {authChecks.map((c, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-gray-300 font-bold shrink-0">{i + 1}.</span>
            <p className="text-sm text-gray-600">{c}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/rolex-submariner-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Submariner Guide →</Link>
        <Link href="/guides/omega-seamaster-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Seamaster Guide →</Link>
        <Link href="/compare/rolex-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek →</Link>
      </div>
    </div>
  )
}
