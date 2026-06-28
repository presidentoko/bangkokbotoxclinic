import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Chanel vs Saint Laurent Pre-Owned 2025 | SecondLuxuryItems',
  description: 'Chanel vs Saint Laurent comparison — Classic Flap vs Lou Lou, resale retention, investment case. Which pre-owned bag is better value in 2025?',
  alternates: { canonical: `${BASE}/compare/chanel-vs-saint-laurent` },
}

const rows = [
  { metric: 'Price tier', chanel: '$3,500–$10,000+ (pre-owned)', ysl: '$600–$2,200 (pre-owned)' },
  { metric: 'Flagship bag', chanel: 'Classic Flap Medium ($5,500–$8,000)', ysl: 'Sac de Jour ($1,500–$2,200)' },
  { metric: 'Entry bag', chanel: 'Mini Classic Flap ($3,500–$5,000)', ysl: 'Lou Lou Small ($600–$900)' },
  { metric: 'Investment case', chanel: 'Strongest in luxury — 90–130% of retail, appreciates annually', ysl: 'Solid for common pieces — 65–85% of retail; stable' },
  { metric: 'Resale liquidity', chanel: 'Maximum — sells globally in hours', ysl: 'Very good — consistent demand at every price point' },
  { metric: 'Creative direction', chanel: 'Virginie Viard — consistent Chanel DNA', ysl: 'Hedi Slimane — French cool, edgier aesthetic' },
  { metric: 'Buyer demographic', chanel: 'Broad luxury market — aspirational and established', ysl: 'Fashion-forward buyers, 25–40 demographic' },
  { metric: 'Recommendation', chanel: 'Buy if investment matters — Chanel always holds', ysl: 'Buy if budget is under $1,500 — excellent value play' },
]

export default function ChanelVsSLPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Chanel vs Saint Laurent</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel vs Saint Laurent Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Two Parisian houses, very different price points. Chanel is the ultimate pre-owned investment — it rarely depreciates. Saint Laurent offers a genuinely cool aesthetic at a fraction of Chanel prices with surprisingly good resale. Your choice depends on budget and goals.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Chanel</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Saint Laurent</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.chanel}</td>
                <td className="py-3 px-4 text-gray-700">{r.ysl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Pre-Owned →</Link>
        <Link href="/brands/saint-laurent" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent Pre-Owned →</Link>
        <Link href="/compare/saint-laurent-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent vs Gucci →</Link>
      </div>
    </div>
  )
}
