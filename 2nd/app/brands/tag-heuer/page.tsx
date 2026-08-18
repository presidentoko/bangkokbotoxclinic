import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Tag Heuer Pre-Owned ${PRICE_YEAR}: Carrera, Aquaracer, Monaco | SecondLuxuryItems`,
  description: `Tag Heuer pre-owned watches — Carrera, Aquaracer, Monaco, Formula 1. Prices, resale values, which model to buy used in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/brands/tag-heuer` },
}

const watches = [
  { name: 'Carrera Calibre 5 (39mm, Steel)', price: '$800–$1,400', retail: '~$2,100', pct: '38–67%', note: 'The sportsman Carrera. Clean dial, bracelet or strap. Motorsport heritage from 1963. Entry-level Swiss chronograph territory. Strong everyday demand.' },
  { name: 'Aquaracer Professional 300 (43mm)', price: '$600–$1,200', retail: '~$1,800', pct: '33–67%', note: 'Tag Heuer dive watch. 300m water resistance, rotating bezel. Most popular entry-level dive watch in pre-owned. Competes with Seiko Prospex but at a luxury tier.' },
  { name: 'Monaco Calibre 11 (39mm, Blue)', price: '$2,500–$5,000+', retail: '~$6,100', pct: '41–82%', note: 'The Le Mans watch. Square case, blue dial — iconic design from Steve McQueen. Limited editions spike higher. The most collectible Tag Heuer reference.' },
  { name: 'Formula 1 Quartz (41mm)', price: '$250–$500', retail: '~$1,000', pct: '25–50%', note: 'Best entry point for pre-owned watches. Quartz movement, sporty case. Not an investment — but a genuine Swiss watch at an accessible price. Great gift.' },
]

export default function TagHeuerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Brands</Link>
        <span className="mx-2">/</span>
        <span>Tag Heuer</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Tag Heuer Pre-Owned Watches</h1>
      <p className="text-gray-500 mb-10">Tag Heuer is the entry point for Swiss luxury sports watches. The Monaco is a genuine collectible; the Carrera and Aquaracer offer excellent value pre-owned. Resale sits at 30–65% of retail — less than Rolex or Omega, but at lower entry prices.</p>

      <div className="space-y-4 mb-10">
        {watches.map((w, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900">{w.name}</h2>
              <div className="text-right shrink-0">
                <div className="font-semibold text-gray-900">{w.price}</div>
                <div className="text-xs text-gray-400">Retail: {w.retail}</div>
                <div className="text-xs text-gray-500">{w.pct} of retail</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{w.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/omega-vs-tag-heuer" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs Tag Heuer →</Link>
        <Link href="/brands/omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Pre-Owned →</Link>
        <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Pre-Owned →</Link>
      </div>
    </div>
  )
}
