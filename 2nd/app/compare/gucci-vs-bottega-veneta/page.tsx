import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Gucci vs Bottega Veneta Pre-Owned ${PRICE_YEAR}: Logo vs No-Logo | SecondLuxuryItems`,
  description: `Gucci vs Bottega Veneta pre-owned comparison — logo visibility, investment case, resale values, which Italian luxury house holds value better in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/gucci-vs-bottega-veneta` },
}

const rows = [
  { metric: 'Design philosophy', gucci: 'Maximum logo — GG canvas, bee, web stripe', bv: 'Zero visible branding — intrecciato weave is the signature' },
  { metric: 'Icon bag', gucci: 'Dionysus ($900–$2,000), Marmont ($700–$1,400)', bv: 'Cassette ($1,500–$2,800), Jodie ($800–$1,400)' },
  { metric: 'Entry price', gucci: '$500+ (small GG Marmont)', bv: '$700+ (small Jodie hobo)' },
  { metric: 'Resale vs retail', gucci: '35–60% (canvas); 50–75% (leather)', bv: '55–80% (higher for Cassette and Pouch)' },
  { metric: 'Investment case', gucci: 'Weak — creative leadership change (Sabato De Sarno era uncertain)', bv: 'Strong — Intrecciato is timeless, Matthieu Blazy era performing well' },
  { metric: 'Counterfeit risk', gucci: 'Very high — GG canvas most faked Italian pattern after LV', bv: 'High — intrecciato pattern commonly copied but easier to spot' },
  { metric: 'Customer demographic', gucci: 'Fashion-forward, logo-positive, wider age range', bv: 'Style-conscious minimalists — "quiet luxury" core audience' },
  { metric: 'Best pre-owned buy', gucci: 'Leather Marmont or Dionysus (avoid older canvas)', bv: 'Jodie hobo or Cassette — consistent resale performance' },
]

export default function GucciVsBV() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Gucci vs Bottega Veneta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Gucci vs Bottega Veneta Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Two Italian luxury houses with opposite design philosophies. Gucci maximizes logo visibility — GG canvas everywhere. Bottega Veneta has no visible branding — the intrecciato leather weave is the statement. For pre-owned buyers: Bottega holds value better and appreciates more consistently. Gucci offers more entry-price variety.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Gucci</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Bottega Veneta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.gucci}</td>
                <td className="py-3 px-4 text-gray-700">{r.bv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci Pre-Owned →</Link>
        <Link href="/brands/bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega Pre-Owned →</Link>
        <Link href="/compare/prada-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Gucci →</Link>
      </div>
    </div>
  )
}
