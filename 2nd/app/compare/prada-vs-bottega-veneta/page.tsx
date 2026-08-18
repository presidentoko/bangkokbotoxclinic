import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Prada vs Bottega Veneta Pre-Owned ${PRICE_YEAR}: Galleria vs Cassette | SecondLuxuryItems`,
  description: `Prada vs Bottega Veneta pre-owned — Galleria vs Cassette, Re-Edition vs Jodie, investment case, logo vs no-logo. Which Italian quiet luxury house to buy ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/prada-vs-bottega-veneta` },
}

const rows = [
  { metric: 'Design philosophy', prada: 'Intellectual minimalism with clear branding. Triangle logo plate on every bag. Nylon and Saffiano leather are house signatures.', bv: 'Zero visible branding. Intrecciato weave is the only identifier. Defined by texture, not logo.' },
  { metric: 'Icon bags', prada: 'Galleria ($1,200–$2,200), Re-Edition 2000 ($500–$900), Cleo ($1,000–$1,800)', bv: 'Cassette ($1,800–$3,200), Jodie ($1,200–$2,400), Andiamo ($1,400–$2,200)' },
  { metric: 'Entry price', prada: '$300+ (Re-Nylon small pieces)', bv: '$800+ (Jodie small)' },
  { metric: 'Resale vs retail', prada: '50–70% (Galleria); Re-Edition 2000 holds well at 60–75%', bv: '65–85% (Cassette, Jodie under Daniel Lee/Matthieu Blazy era). Stronger resale than most peers.' },
  { metric: 'Investment case', prada: 'Consistent. Saffiano Galleria never goes out of style. Re-Edition 2000 mini has captured the Prada "girly" revival.', bv: 'Strong and growing. Matthieu Blazy era (2022+) has elevated BV beyond quiet luxury into collector territory. Cassette holdback on waitlist.' },
  { metric: 'Who wears it', prada: 'Fashion-knowledgeable. Prada logo is instantly read by anyone. Cross-generational appeal.', bv: 'Fashion industry insiders. Zero-logo philosophy means recognition only by those who know Intrecciato.' },
  { metric: 'Authentication difficulty', prada: 'Medium. Triangle logo plate depth, zipper quality, interior stamp. Re-Nylon seam stitching on the Re-Edition.', bv: 'Hard. Intrecciato weave must be hand-checked — each leather strip should be consistent width, tight and even. Cassette fakes are improving.' },
  { metric: 'Best for', prada: 'Lower entry into Italian luxury, Re-Edition collectible nostalgia, Galleria long-term hold', bv: 'Investment in quiet luxury that is gaining recognition, zero-logo confidence, Cassette and Jodie future-classic position' },
]

export default function PradaVsBV() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Prada vs Bottega Veneta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Prada vs Bottega Veneta Pre-Owned {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Both are Italian luxury houses that champion restraint over logos — but in completely different ways. Prada has the triangle plate and intellectual reputation. Bottega Veneta has the Intrecciato weave and zero branding. Prada goes lower on entry price; Bottega Veneta holds stronger resale value. Two of the best pre-owned value plays in Italian luxury.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Prada</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Bottega Veneta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.prada}</td>
                <td className="py-3 px-4 text-gray-700">{r.bv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/prada" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada Pre-Owned →</Link>
        <Link href="/brands/bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega Veneta Pre-Owned →</Link>
        <Link href="/compare/gucci-vs-bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci vs BV →</Link>
        <Link href="/compare/lv-vs-prada" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV vs Prada →</Link>
      </div>
    </div>
  )
}
