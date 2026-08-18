import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Rolex vs Cartier Pre-Owned ${PRICE_YEAR}: Submariner vs Santos | SecondLuxuryItems`,
  description: `Rolex vs Cartier pre-owned comparison — Submariner vs Santos, investment case, resale values, movement quality, which Swiss watchmaker to buy ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/rolex-vs-cartier` },
}

const rows = [
  { metric: 'Founded', rolex: 'London 1905, Geneva movement. Sports/professional tool watch DNA.', cartier: 'Paris 1847. Jewelry house first, watches second. Santos (1904) was the first aviator wristwatch.' },
  { metric: 'Icon watches', rolex: 'Submariner ($8,500–$20,000 pre-owned), Datejust ($5,000–$12,000), GMT-Master II ($11,000–$25,000)', cartier: 'Santos ($3,500–$7,000), Tank ($2,500–$6,000), Ballon Bleu ($3,000–$6,000), Panthère ($3,000–$5,500)' },
  { metric: 'Entry price pre-owned', rolex: '$3,500+ (Oyster Perpetual)', cartier: '$1,800+ (Tank Solo steel)' },
  { metric: 'Movement', rolex: 'In-house manufacture (4000, 3230 calibres). COSC-certified chronometer. ±2 sec/day accuracy.', cartier: 'Mix of manufacture (in-house 1847 MC) and ETA/Sellita. Jewelry-grade accuracy. Not a tool-watch movement focus.' },
  { metric: 'Resale vs retail', rolex: '80–150%+ for sports models (Submariner, GMT, Daytona). Datejust and OP: 70–90%.', cartier: '65–85% (Santos, Ballon Bleu). Tank holds well. Tank Américaine and vintage Tank: 80–100%+.' },
  { metric: 'Investment case', rolex: 'Best in class for watches. Submariner and Daytona regularly exceed retail on secondary market. Steel sports models consistently over retail.', cartier: 'Solid and improving. Santos has gained significantly. Vintage Tank Louis Cartier is a collector\'s market.' },
  { metric: 'Audience', rolex: 'Status + precision. Worn by collectors, divers, executives, athletes. Global recognition regardless of watch knowledge.', cartier: 'Fashion + heritage. Jewelry house appeal. Cartier attracts buyers who want jewelry-adjacent wristwear and Parisian heritage.' },
  { metric: 'Best for', rolex: 'Maximum resale value, global recognition, tool watch functionality, sports watch collecting', cartier: 'Entry price, jewelry-house heritage, dress watch elegance, Santos as sports watch alternative' },
]

export default function RolexVsCartier() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Rolex vs Cartier</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Rolex vs Cartier Pre-Owned {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Rolex is the world's most recognized watch brand — precision, status, and investment-grade resale. Cartier is a jewelry house that invented the wristwatch — elegance, heritage, and jewelry-adjacent prestige. Both are Swiss. Both have extraordinary resale. The choice comes down to whether you prioritize sports watch utility (Rolex) or dress watch heritage (Cartier).</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Rolex</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Cartier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.rolex}</td>
                <td className="py-3 px-4 text-gray-700">{r.cartier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Pre-Owned →</Link>
        <Link href="/brands/cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier Pre-Owned →</Link>
        <Link href="/guides/rolex-submariner-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Sub Guide →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
