import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Hermès vs Goyard Pre-Owned ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Hermès vs Goyard pre-owned comparison — resale values, canvas vs leather, investment performance, who each brand is for.',
  alternates: { canonical: `${BASE}/compare/hermes-vs-goyard` },
}

const rows = [
  { metric: 'Founded', hermes: '1837, Paris (saddler)', goyard: '1853, Paris (trunk maker)' },
  { metric: 'Heritage clientele', hermes: 'Royalty, fashion editors, investment buyers', goyard: 'Czar Nicholas II, Picasso, Coco Chanel, Vuitton family' },
  { metric: 'Material', hermes: 'Luxury leather (Togo, Epsom, Clemence, Box calf)', goyard: 'Goyardine canvas (hand-painted on cotton-linen)' },
  { metric: 'Entry pre-owned', hermes: '$3,000+ (Herbag, Picotin)', goyard: '$1,200–1,800 (Saint-Louis PM)' },
  { metric: 'Flagship piece', hermes: 'Birkin 25/30/35 ($12,000–$60,000+ pre-owned)', goyard: 'Saint-Louis Tote PM/GM ($1,200–2,200)' },
  { metric: 'Resale vs retail', hermes: '+200–500% (Birkin peak). Others: 80–120%', goyard: '75–120% — often at or above retail' },
  { metric: 'Market depth (liquidity)', hermes: 'Deep — Birkin is most liquid luxury bag globally', goyard: 'Medium — growing but smaller buyer pool' },
  { metric: 'Online availability', hermes: 'Everywhere — The RealReal, Vestiaire, 1stDibs', goyard: 'Limited — fewer platforms carry quality inventory' },
  { metric: 'Counterfeit risk', hermes: 'Extremely high (especially Birkin/Kelly)', goyard: 'High — Goyardine canvas widely faked' },
  { metric: 'Investment case', hermes: 'Strongest of any luxury bag — 20yr appreciation', goyard: 'Strong store-of-value; less dramatic upside' },
]

export default function HermesVsGoyardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Hermès vs Goyard</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Hermès vs Goyard Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Two Paris maisons founded within 16 years of each other. Both serve ultra-discerning buyers who avoid Instagram-obvious branding. But the buyer profile, investment case, and resale dynamics are fundamentally different.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Hermès</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Goyard</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.hermes}</td>
                <td className="py-3 px-4 text-gray-700">{r.goyard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h2 className="font-bold text-gray-900 mb-2">Buy Hermès pre-owned if:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>→ Investment-grade resale is your goal</li>
            <li>→ You want maximum prestige signal</li>
            <li>→ Budget $3,000+</li>
            <li>→ You understand the authentication complexity</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h2 className="font-bold text-gray-900 mb-2">Buy Goyard pre-owned if:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>→ You want quiet luxury at below-Hermès price</li>
            <li>→ Budget $1,200–3,000</li>
            <li>→ You appreciate insider recognition</li>
            <li>→ The Goyardine canvas fits your aesthetic</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Pre-Owned →</Link>
        <Link href="/brands/goyard" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Goyard Pre-Owned →</Link>
        <Link href="/guides/hermes-birkin-vs-kelly" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Birkin vs Kelly →</Link>
        <Link href="/compare/lv-vs-goyard" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV vs Goyard →</Link>
      </div>
    </div>
  )
}
