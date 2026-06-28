import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Louis Vuitton vs Prada Pre-Owned 2025 | SecondLuxuryItems',
  description: 'LV vs Prada pre-owned comparison — Neverfull vs Galleria, canvas vs leather, resale values, which is the better investment in 2025.',
  alternates: { canonical: `${BASE}/compare/lv-vs-prada` },
}

const rows = [
  { metric: 'Icon bag', lv: 'Neverfull MM ($900–$1,400), Speedy 25 ($500–$900)', prada: 'Galleria ($1,200–$2,200), Re-Edition 2000 ($500–$900)' },
  { metric: 'Entry price', lv: '$500+ (Speedy 25 canvas)', prada: '$500+ (Re-Edition 2000 nylon)' },
  { metric: 'Resale vs retail', lv: '65–80% (canvas icons), 50–70% (leather)', prada: '45–70% (standard), higher for limited editions' },
  { metric: 'Investment case', lv: 'Very strong — Neverfull and Speedy are the most liquid bags on earth', prada: 'Moderate — Galleria holds well, Re-Edition above retail in some sizes' },
  { metric: 'Counterfeit risk', lv: 'Extreme — most counterfeited bag globally', prada: 'Very high — Prada nylon and triangle are widely copied' },
  { metric: 'Brand positioning', lv: 'LVMH crown jewel — widest global recognition', prada: 'Milan fashion house — intellectual, design-forward identity' },
  { metric: 'Thailand market', lv: 'Strongest presence — 3+ boutiques, resale everywhere', prada: 'Strong — 2 boutiques in Bangkok, growing resale demand' },
  { metric: 'Best pre-owned buy', lv: 'Neverfull MM Monogram or Damier ($900–$1,200)', prada: 'Galleria medium saffiano ($1,200–$1,600)' },
]

export default function LVVsPrada() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>LV vs Prada</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Louis Vuitton vs Prada Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Louis Vuitton and Prada are both top-5 luxury purchases in Southeast Asia, but they serve different buyers. LV is the most recognized brand in the world — pure resale liquidity. Prada is more fashion-intellectual — Saffiano leather, triangle logo, design credibility. For investment: LV wins clearly. For fashion distinction: Prada is the stronger statement.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Louis Vuitton</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Prada</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.lv}</td>
                <td className="py-3 px-4 text-gray-700">{r.prada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Pre-Owned →</Link>
        <Link href="/brands/prada" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada Pre-Owned →</Link>
        <Link href="/compare/prada-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Gucci →</Link>
      </div>
    </div>
  )
}
