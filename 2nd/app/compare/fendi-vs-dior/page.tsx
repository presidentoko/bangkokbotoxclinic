import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Fendi vs Dior Pre-Owned 2025: Baguette vs Lady Dior | SecondLuxuryItems',
  description: 'Fendi vs Dior pre-owned comparison — Baguette vs Lady Dior, price ranges, investment case, which to buy used in 2025.',
  alternates: { canonical: `${BASE}/compare/fendi-vs-dior` },
}

const rows = [
  { metric: 'Icon bag', fendi: 'Baguette ($800–$2,500)', dior: 'Lady Dior ($2,000–$5,000)' },
  { metric: 'Entry price', fendi: '$400+ (Mini Baguette)', dior: '$2,000+ (Lady Dior Mini)' },
  { metric: 'Resale vs retail', fendi: '40–65% (standard); higher for collaboration', dior: '55–75%' },
  { metric: 'Investment case', fendi: 'Weak on standard — strong only on limited (Karl Lagerfeld era, collabs)', dior: 'Moderate — Lady Dior holds better than Fendi on secondary market' },
  { metric: 'Creative direction', fendi: 'Kim Jones (since 2020) — more minimalist post-Lagerfeld', dior: 'Maria Grazia Chiuri — feminine, "We Should All Be Feminists" era' },
  { metric: 'Brand trajectory', fendi: 'Repositioning upward — Fendi Couture since 2021', dior: 'Consistent luxury positioning — strong celebrity association' },
  { metric: 'Best buy pre-owned', fendi: 'Baguette in niche leather (cuoio, selleria) or logo-free silks', dior: 'Classic Lady Dior in black lambskin, medium size' },
]

export default function FendiVsDior() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Fendi vs Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Fendi vs Dior Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Fendi and Dior are both Italian-French luxury houses under LVMH ownership, but they serve different buyers. Fendi is playful and icon-driven (the Baguette). Dior is more fashion-classic and investment-oriented (Lady Dior). The pre-owned calculus is clear: Dior holds value better, Fendi offers more entry price flexibility.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Fendi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Dior</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.fendi}</td>
                <td className="py-3 px-4 text-gray-700">{r.dior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/fendi" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi Pre-Owned →</Link>
        <Link href="/brands/dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior Pre-Owned →</Link>
        <Link href="/compare/chanel-vs-dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Dior →</Link>
      </div>
    </div>
  )
}
