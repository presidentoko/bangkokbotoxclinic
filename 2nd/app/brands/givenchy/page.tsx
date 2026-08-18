import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Givenchy Pre-Owned: Antigona, Pandora, 4G ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Buy pre-owned Givenchy — Antigona tote, Pandora satchel, 4G logo bags. USD prices, resale values, and best eras to buy. ${PRICE_YEAR} guide.`,
  alternates: { canonical: `${BASE}/brands/givenchy` },
}

const pieces = [
  {
    name: 'Antigona Medium',
    era: '2011 — present (Ricardo Tisci era peak)',
    range: '$600–1,100',
    retail: '~$1,950',
    retention: '31–56%',
    note: 'Structured trapezoid shape. Corner zip detail. Best in black calfskin. 2011–2018 Tisci pieces hold best.',
  },
  {
    name: 'Antigona Small',
    era: 'Tisci / Matthew Williams',
    range: '$500–900',
    retail: '~$1,750',
    retention: '29–51%',
    note: 'Crossbody versatility. More popular than medium for daily use.',
  },
  {
    name: 'Pandora Satchel',
    era: '2011–2018 (Tisci)',
    range: '$400–750',
    retail: '~$1,400 (discontinued)',
    retention: '29–54%',
    note: 'Chain-link detail. Softer than Antigona. Discontinued — collector interest growing.',
  },
  {
    name: '4G Crossbody',
    era: 'Matthew Williams era (2020+)',
    range: '$550–950',
    retail: '~$1,695',
    retention: '32–56%',
    note: 'Logo-forward design. 4G hardware detail. More logo-visible than Tisci era.',
  },
]

export default function GivenchyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Brands</Link>
        <span className="mx-2">/</span>
        <span>Givenchy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Givenchy Pre-Owned</h1>
      <p className="text-gray-600 text-sm mb-3">Founded 1952 by Hubert de Givenchy. The brand has had three major design eras: the founder&apos;s couture era, Ricardo Tisci&apos;s dark-luxury streetwear era (2005–2017), and the current Matthew Williams era. For pre-owned buyers, the Tisci-era pieces (Antigona, Pandora) represent the best combination of design legacy and value.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 mb-8">
        <strong>Pre-owned note:</strong> Givenchy holds 30–56% of retail — lower than Chanel or LV, but pieces can be found at significant discount from original retail. The Antigona remains the most recognizable and liquid Givenchy bag.
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Pieces & Pre-Owned Prices (USD)</h2>
        <div className="space-y-3">
          {pieces.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-semibold text-gray-900">{p.name}</span>
                  <span className="text-xs text-gray-400 ml-2">({p.era})</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-amber-700">{p.range}</div>
                  <div className="text-xs text-gray-400">{p.retention} of retail</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/dior-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Céline →</Link>
        <Link href="/brands/celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Céline Pre-Owned →</Link>
        <Link href="/trends/resale-value-drops-to-avoid" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Value Traps to Avoid →</Link>
      </div>
    </div>
  )
}
