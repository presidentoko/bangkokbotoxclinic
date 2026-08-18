import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Rolex vs Audemars Piguet Royal Oak: Pre-Owned Comparison ${PRICE_YEAR}`,
  description: `Rolex vs Audemars Piguet pre-owned price comparison. Submariner vs Royal Oak, investment value, resale liquidity, and which to buy in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/rolex-vs-audemars-piguet` },
}

const comparison = [
  { aspect: 'Brand heritage', rolex: 'Founded 1905, Genevà — now Geneva', ap: 'Founded 1875, Le Brassus (Vallée de Joux)' },
  { aspect: 'Movement type', rolex: 'In-house (Manufacture Rolex), COSC-certified', ap: 'In-house (AP Manufacture), haute horlogerie' },
  { aspect: 'Entry price (pre-owned)', rolex: '$5,000–8,000 (Datejust)', ap: '$18,000–25,000 (Royal Oak 15400)' },
  { aspect: 'Most-traded model', rolex: 'Submariner / Datejust', ap: 'Royal Oak 15202 / Royal Oak Offshore' },
  { aspect: 'Grey market premium', rolex: '20–80% above retail (sports models)', ap: '30–100% above retail (Royal Oak steel)' },
  { aspect: 'Resale liquidity', rolex: 'Highest — easiest to sell in any market', ap: 'Strong but narrower buyer base' },
  { aspect: 'After service value', rolex: 'Well maintained; avoid heavy polishing', ap: 'Critical — AP service costs $1,500–4,000+' },
  { aspect: 'Investment track record', rolex: '8–15% p.a. on sports models over 10 yrs', ap: '10–20% p.a. on Royal Oak steel over 10 yrs' },
]

export default function RolexVsAPPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/watches" className="hover:text-gray-800">Watches</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Rolex vs Audemars Piguet</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Rolex vs Audemars Piguet: Pre-Owned Comparison {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Both command massive grey market premiums — the difference is price tier and collectibility.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border-2 border-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Rolex</h2>
          <p className="text-sm text-gray-500 mb-4">The most recognised watch brand in the world</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Unmatched global resale liquidity</li>
            <li>✓ Wide range of entry price points ($5k–50k+)</li>
            <li>✓ Sports models reliably above retail</li>
            <li>✓ Robust tool watches — daily wearers</li>
            <li>✓ Easiest brand to authenticate (extensive resources)</li>
          </ul>
        </div>
        <div className="border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Audemars Piguet</h2>
          <p className="text-sm text-gray-500 mb-4">The Royal Oak — Gerald Genta's 1972 masterpiece</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Higher price appreciation on rare references</li>
            <li>✓ More complex movements — horological credibility</li>
            <li>✓ Exclusivity signal stronger than Rolex</li>
            <li>✓ Royal Oak iconic status rivals Submariner</li>
            <li>✗ Much higher entry price</li>
            <li>✗ Smaller secondary market — harder to sell quickly</li>
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold">Rolex</th>
                <th className="text-left py-3 px-4 font-semibold">Audemars Piguet</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.rolex}</td>
                  <td className="py-3 px-4 text-gray-600">{row.ap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Choose Rolex if:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Budget is $5,000–20,000 for a pre-owned sports watch</li>
            <li>• You want maximum resale flexibility (easy to sell anywhere)</li>
            <li>• You'll wear it daily and want a robust tool watch</li>
            <li>• You're new to luxury watch investment</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Choose AP Royal Oak if:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Budget is $20,000+ and you want above-retail market exposure</li>
            <li>• You want the strongest exclusivity signal in watchmaking</li>
            <li>• You'll hold long-term (5+ years) for maximum appreciation</li>
            <li>• You appreciate movement complexity and haute horlogerie</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">More Watch Comparisons</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega</Link>
          <Link href="/compare/rolex-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek Philippe</Link>
          <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Rolex Prices</Link>
        </div>
      </section>
    </div>
  )
}
