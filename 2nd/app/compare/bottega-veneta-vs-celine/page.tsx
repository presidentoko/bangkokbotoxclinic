import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Bottega Veneta vs Celine ${PRICE_YEAR}: Which Quiet Luxury Brand Holds Value? | SecondLuxuryItems`,
  description: 'Bottega Veneta vs Celine — Jodie vs Triomphe, intrecciato weave vs structured leather, resale retention, and which quiet luxury brand is the better pre-owned investment.',
  alternates: { canonical: `${BASE}/compare/bottega-veneta-vs-celine` },
}

const rows = [
  { aspect: 'Founded', bv: 'Vicenza, Italy 1966', ce: 'Paris, France 1945' },
  { aspect: 'Creative direction', bv: 'Matthieu Blazy (since 2021)', ce: 'Hedi Slimane (since 2018)' },
  { aspect: 'Group', bv: 'Kering (Gucci, YSL, Balenciaga)', ce: 'LVMH (LV, Dior, Givenchy)' },
  { aspect: 'Signature bag', bv: 'Jodie, Andiamo, Sardine, Cassette', ce: 'Triomphe, Box Bag, 16 Bag, Tabou' },
  { aspect: 'Design language', bv: 'Intrecciato weave leather, tactile, craft-focused', ce: 'Structured minimalism, Arc de Triomphe clasp' },
  { aspect: 'Entry pre-owned', bv: '$900–1,600 (Jodie small)', ce: '$800–1,400 (Mini Triomphe)' },
  { aspect: 'Resale retention', bv: '55–70% (Jodie 60–75%)', ce: '50–70% (Triomphe 60–80%)' },
  { aspect: 'Investment tier', bv: 'B+ (Jodie is exceptional)', ce: 'B+ (Triomphe is exceptional)' },
  { aspect: 'Trend risk', bv: 'Medium: intrecciato is timeless but Daniel Lee era is fading', ce: 'Medium: Slimane era polarises buyers' },
]

export default function BottegaVenataVsCeline() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Bottega Veneta vs Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Bottega Veneta vs Celine ({PRICE_YEAR}): The Quiet Luxury Showdown</h1>
      <p className="text-gray-500 mb-10">Both Bottega Veneta and Celine became synonymous with the "quiet luxury" movement — no visible logos, high craft, understated status. Both have exceptional resale performance on their hero pieces. The question is which brand's pre-owned market is stronger and which fits your aesthetic.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-green-800">Bottega Veneta</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-slate-800">Celine</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.bv}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.ce}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold text-green-900 mb-2">Buy Bottega Veneta if…</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• The tactile intrecciato weave is your primary draw</li>
            <li>• You want a bag that's identifiable to those who know, invisible to those who don't</li>
            <li>• The Jodie's crescent shape and ease of wear appeals</li>
            <li>• You're buying the Jodie specifically — strong investment choice</li>
          </ul>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-2">Buy Celine if…</h3>
          <ul className="text-sm text-slate-800 space-y-1">
            <li>• The Triomphe clasp is a must-have detail for you</li>
            <li>• You prefer structured bags (Box Bag, 16 Bag)</li>
            <li>• You want more organized interior functionality</li>
            <li>• Phoebe Philo-era Celine vintage is your target</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">The Daniel Lee shadow</h3>
        <p className="text-sm text-gray-600">Daniel Lee's tenure at Bottega Veneta (2018–2021) created the modern BV boom — the Pouch, Jodie, and Cassette all date from this period. Lee left to lead Burberry in 2022. Matthieu Blazy has done excellent creative work since, but the "Lee-era" pieces carry collector premiums. Pre-owned buyers specifically seeking Lee-era Bottega should look for pieces pre-2022 — they carry an extra 10–15% premium over Blazy-era equivalents.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega Veneta →</Link>
        <Link href="/brands/celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Celine →</Link>
        <Link href="/compare/chanel-vs-bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Bottega →</Link>
        <Link href="/compare/loewe-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe vs Celine →</Link>
        <Link href="/guides/how-to-authenticate-bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Bottega →</Link>
      </div>
    </div>
  )
}
