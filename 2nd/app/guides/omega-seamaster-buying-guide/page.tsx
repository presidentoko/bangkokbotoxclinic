import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Omega Seamaster Pre-Owned Buying Guide 2025 | SecondLuxuryItems',
  description: 'Buy Omega Seamaster pre-owned — 300M vs Planet Ocean vs Aqua Terra. USD prices, reference numbers, what to check. 2025 guide.',
  alternates: { canonical: `${BASE}/guides/omega-seamaster-buying-guide` },
}

const models = [
  {
    name: 'Seamaster Diver 300M',
    refs: '210.30.42.20.01.001 (2018+), 2254.50 (vintage)',
    preowned: '$2,500–4,500',
    retail: '$6,100',
    note: 'The James Bond watch since GoldenEye (1995). Co-axial escapement from 2007+. NATO strap-compatible. Most liquid Omega.',
  },
  {
    name: 'Seamaster Planet Ocean 600M',
    refs: '215.30.44.21.01.001 (43.5mm)',
    preowned: '$3,500–5,500',
    retail: '$7,600',
    note: 'Larger, more rugged dive watch. Helium escape valve. Master Chronometer certified from 2015+. Less recognizable than Diver but respected.',
  },
  {
    name: 'Seamaster Aqua Terra',
    refs: '231.10.42.21.01.001',
    preowned: '$2,200–3,500',
    retail: '$5,600',
    note: 'Dress-diver hybrid. "Teak" vertical pattern dial. Elegant enough for business, water-resistant to 150m. More understated than Diver.',
  },
  {
    name: 'Seamaster 300 (Heritage)',
    refs: '234.10.39.20.01.001',
    preowned: '$2,800–4,200',
    retail: '$6,750',
    note: 'Homage to the original 1957 Seamaster 300. Heritage-correct lollipop seconds hand, beehive crown. Collectors\' favorite.',
  },
]

const checks = [
  'Verify Omega Hologram: Omega seahorse logo should be clearly visible, not faded or peeling.',
  'Co-axial escapement check: Look inside the caseback (display or spec sheet) — "Co-Axial" marking confirms genuine movement.',
  'Serial number: On the lug at 12 o\'clock. Run on Omega\'s website to verify production year.',
  'Lume color: SMP300M uses white/blue superluminova. Yellowish lume on newer pieces = service issue or fake.',
  'Bracelet end links: Authentic Omega bracelets have hollow end links pre-2010, solid after. Feel the weight — cheap bracelet = red flag.',
  'Crown signed "Ω": Both stem crown and crown under caseback should have the Omega Ω embossed.',
]

export default function OmegaSeamasterGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Omega Seamaster Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Omega Seamaster Pre-Owned Buying Guide</h1>
      <p className="text-gray-500 mb-10">The Seamaster family has been in production since 1948. James Bond&apos;s watch since 1995. Pre-owned Seamasters hold 40–65% of retail — strong value relative to peers, with the best Co-Axial movements from 2007 onward.</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Seamaster Family — Pre-Owned Prices (USD)</h2>
        <div className="space-y-4">
          {models.map((m, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{m.name}</h3>
                <div className="text-right">
                  <div className="text-sm font-semibold text-amber-700">{m.preowned} pre-owned</div>
                  <div className="text-xs text-gray-400">retail {m.retail}</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-1">Key refs: {m.refs}</p>
              <p className="text-sm text-gray-600">{m.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication Checklist</h2>
        <ol className="space-y-2">
          {checks.map((c, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-600">
              <span className="font-bold text-gray-400 shrink-0">{i + 1}.</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Pre-Owned →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href="/compare/omega-vs-tag-heuer" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs TAG Heuer →</Link>
        <Link href="/guides/best-pre-owned-watches-for-beginners" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Watch Buyer&apos;s Guide →</Link>
      </div>
    </div>
  )
}
