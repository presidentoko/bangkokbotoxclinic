import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Chanel vs Celine Pre-Owned ${PRICE_YEAR}: Classic vs Quiet Luxury | SecondLuxuryItems`,
  description: `Chanel vs Celine pre-owned comparison — Classic Flap vs Luggage, investment case, resale values, which French house to buy pre-owned in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/chanel-vs-celine` },
}

const rows = [
  { metric: 'Design identity', chanel: 'Logo-first — CC clasp, chain, quilted leather unmistakable', celine: 'Logo-minimal — Triomphe canvas or clean leather, quiet recognition' },
  { metric: 'Icon bag', chanel: 'Classic Flap Small ($4,500–$7,500)', celine: 'Luggage Nano ($900–$1,500), Triomphe Canvas Tote ($600–$1,000)' },
  { metric: 'Entry price', chanel: '$2,200+ (Mini Flap)', celine: '$500+ (Triomphe canvas tote)' },
  { metric: 'Resale vs retail', chanel: '70–110%+ (Classic/Boy icons)', celine: '45–65% (standard); higher for Philo-era pieces' },
  { metric: 'Investment case', chanel: 'Best in category — price increases guarantee appreciation', celine: 'Weak on current pieces — Hedi Slimane era resale mixed. Phoebe Philo pieces (pre-2018) are gaining fast.' },
  { metric: 'Customer profile', chanel: 'Status-conscious, investment-minded, any age', celine: 'Quiet luxury, Parisian minimalist, fashion-educated' },
  { metric: 'Thailand market', chanel: 'Strongest pre-owned demand in Thailand — any condition sells', celine: 'Growing — Phoebe Philo revival and "quiet luxury" trend driving demand' },
  { metric: 'Best for', chanel: 'Investment or maximum resale flexibility', celine: 'Understatement and design credibility at lower entry price' },
]

export default function ChanelVsCeline() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Chanel vs Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel vs Celine Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Chanel and Celine are both French luxury houses, but they could not be more different. Chanel is maximum logo recognition — the CC clasp reads from across the room. Celine is Parisian minimalism — the Luggage bag has no visible branding. Chanel wins on investment and resale; Celine wins on quiet sophistication and entry price flexibility.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Chanel</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Celine</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.chanel}</td>
                <td className="py-3 px-4 text-gray-700">{r.celine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Pre-Owned →</Link>
        <Link href="/brands/celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Celine Pre-Owned →</Link>
        <Link href="/compare/chanel-vs-saint-laurent" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs YSL →</Link>
      </div>
    </div>
  )
}
