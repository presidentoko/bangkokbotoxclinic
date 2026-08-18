import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Fendi vs Valentino: Which Italian Brand Holds Value? (${PRICE_YEAR}) | SecondLuxuryItems`,
  description: `Fendi vs Valentino ${PRICE_YEAR} comparison — Baguette vs Rockstud, resale retention, investment case, and which Italian house is worth buying pre-owned.`,
  alternates: { canonical: `${BASE}/compare/fendi-vs-valentino` },
}

const rows = [
  { aspect: 'Founded', fendi: 'Rome, 1925', valen: 'Rome, 1960' },
  { aspect: 'Group', fendi: 'LVMH (since 2001)', valen: 'Mayhoola (Qatari fund, since 2012)' },
  { aspect: 'Creative direction 2025', fendi: 'Kim Jones (ready-to-wear) + Silvia Fendi (accessories)', valen: 'Alessandro Michele (from Gucci, since 2023)' },
  { aspect: 'Signature bag', fendi: 'Baguette (1997), Peekaboo, First', valen: 'Rockstud Alcove, Roman Stud, Locò' },
  { aspect: 'Entry pre-owned', fendi: '$400 (small canvas Baguette)', valen: '$600 (Rockstud clutch/accessories)' },
  { aspect: 'Mid-range pre-owned', fendi: '$1,000–1,800 (Baguette leather)', valen: '$900–1,500 (Rockstud Tote)' },
  { aspect: 'Resale retention', fendi: '45–65% (Baguette 50–75%)', valen: '40–60% (Rockstud 45–65%)' },
  { aspect: 'Investment tier', fendi: 'B+: Baguette has proven staying power, but most Fendi is fashion, not investment', valen: 'B: Fashion-first brand — buy for style, not investment' },
]

export default function FendiVsValentinoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Fendi vs Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Fendi vs Valentino ({PRICE_YEAR})</h1>
      <p className="text-gray-500 mb-10">Two Italian fashion powerhouses in the same luxury tier. Fendi edges ahead on resale thanks to the Baguette, but neither brand is an investment buy — you're here for Italian craftsmanship and style.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700 w-36">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Fendi</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Valentino</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.fendi}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.valen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">Buy Fendi if…</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• You want the Baguette — a bag with proven 25+ year collector history</li>
            <li>• You prefer LVMH's brand stability over independent ownership</li>
            <li>• The Peekaboo's double-opening structure appeals to you</li>
          </ul>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
          <h3 className="font-semibold text-pink-900 mb-2">Buy Valentino if…</h3>
          <ul className="text-sm text-pink-800 space-y-1">
            <li>• The Rockstud aesthetic is your signature style</li>
            <li>• You want footwear — Valentino heels outperform the bags</li>
            <li>• Michele's new direction excites you (early pieces = future collector interest)</li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">The Baguette exception</h3>
          <p className="text-sm text-gray-600">The Fendi Baguette (1997) is in a different category from everything else Fendi makes. SJP's Sex and the City connection made it a cultural icon, and it has sustained pre-owned demand for nearly three decades. The limited editions (Leiber, artist collabs) have genuine investment potential.</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/fendi" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi Pre-Owned →</Link>
        <Link href="/brands/valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Valentino Pre-Owned →</Link>
        <Link href="/compare/fendi-vs-dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Dior →</Link>
        <Link href="/compare/dior-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Valentino →</Link>
      </div>
    </div>
  )
}
