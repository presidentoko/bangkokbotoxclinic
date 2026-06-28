import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Rolex vs Tudor: Which Brand Is Better Value? (2025) | SecondLuxuryItems',
  description: 'Rolex vs Tudor comparison 2025 — Black Bay vs Submariner, movements, value retention, and whether Tudor is "just a cheaper Rolex" or a genuine alternative.',
  alternates: { canonical: `${BASE}/compare/rolex-vs-tudor` },
}

const rows = [
  { aspect: 'Ownership', rolex: 'Rolex SA (private)', tudor: 'Rolex SA (sister brand since 1926)' },
  { aspect: 'Price (new)', rolex: '$8,100+ (Submariner, steel)', tudor: '$3,000–4,500 (Black Bay, steel)' },
  { aspect: 'Pre-owned entry', rolex: '$6,500+ (Datejust 36)', tudor: '$1,200–2,000 (Black Bay 41)' },
  { aspect: 'Movements', rolex: 'In-house Calibre 3235 (Perpetual, Chronergy, Parachrom)', tudor: 'In-house MT5402 (Black Bay line, co-axial escapement)' },
  { aspect: 'Case materials', rolex: 'Oystersteel + gold / Rolesor options', tudor: 'Oystersteel (same grade as Rolex steel)' },
  { aspect: 'Water resistance', rolex: '300m (Submariner)', tudor: '200m (Black Bay)' },
  { aspect: 'Resale retention', rolex: '95–130%+ of retail (Submariner); 75–90% (Datejust)', tudor: '50–65% of retail (Black Bay)' },
  { aspect: 'Investment tier', rolex: 'S-Tier: Submariner and GMT-Master at or above retail', tudor: 'B-Tier: Depreciates like a normal luxury watch' },
  { aspect: 'Counterfeit risk', rolex: 'Extremely high — most faked watch brand globally', tudor: 'Low — very few quality Tudor fakes in circulation' },
]

export default function RolexVsTudorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Rolex vs Tudor</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Rolex vs Tudor (2025): Sister Brands Compared</h1>
      <p className="text-gray-500 mb-10">Tudor was created by Rolex's founder Hans Wilsdorf in 1926 as an accessible alternative. Both brands use the same Oystersteel and share manufacturing infrastructure — but the similarities end there in terms of resale value. Tudor is a genuine luxury watch brand, not a budget Rolex replica. But if investment performance matters, the gap is enormous.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700 w-36">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Rolex</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Tudor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.rolex}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.tudor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Rolex if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Investment performance matters — Submariner and GMT at or above retail</li>
            <li>• Resale liquidity is a priority — Rolex is the most liquid pre-owned watch brand globally</li>
            <li>• You have access (allocation or boutique relationship)</li>
            <li>• Long-term hold: 10-year Rolex appreciation beats most asset classes</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">Buy Tudor if…</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Budget is $1,500–4,000 and you want the best watch in that range</li>
            <li>• You want to wear it daily without worry (lower opportunity cost)</li>
            <li>• The Black Bay's vintage-inspired aesthetic suits your style</li>
            <li>• You're not treating it as an investment — buy to enjoy, sell for 50–65% of retail</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <p className="text-sm text-amber-800"><strong>The honest comparison:</strong> Tudor uses the same case material as Rolex and has excellent in-house movements. For someone who wants a quality Swiss watch they'll actually wear daily (not lock in a safe), a Tudor Black Bay pre-owned is one of the best value buys available. If you're thinking about resale or investment, that's a completely different question — and the answer is Rolex by a large margin.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Pre-Owned →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href="/compare/rolex-vs-cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Cartier →</Link>
        <Link href="/guides/best-pre-owned-watches-under-5000" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Watches Under $5k →</Link>
      </div>
    </div>
  )
}
