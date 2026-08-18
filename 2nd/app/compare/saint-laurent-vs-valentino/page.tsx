import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Saint Laurent vs Valentino ${PRICE_YEAR}: Pre-Owned Bags & Investment Tier | SecondLuxuryItems`,
  description: `Saint Laurent vs Valentino — Parisian cool vs Roman romance. Compare resale retention, investment tier, signature bags, and which brand holds value better pre-owned in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/saint-laurent-vs-valentino` },
}

const rows = [
  { aspect: 'Founded', ysl: 'Paris, 1961 (renamed Saint Laurent 2012)', val: 'Rome, 1960' },
  { aspect: 'Parent group', ysl: 'Kering', val: 'Mayhoola (formerly, now Permira consortium)' },
  { aspect: 'Design direction', ysl: 'Parisian cool — structured black, gold hardware, rock edge', val: 'Roman romance — floral, stud, sweeping silhouettes' },
  { aspect: 'Signature bags', ysl: 'Lou Camera Bag, Loulou, Sac de Jour, Sunset', val: 'Rockstud, Roman Stud, Loco, Garavani' },
  { aspect: 'New price range', ysl: '$800–3,500 (most popular $1,200–2,000)', val: '$1,100–4,200 (most popular $1,500–2,500)' },
  { aspect: 'Pre-owned entry', ysl: '$450–800 (Lou Camera, worn)', val: '$550–900 (Rockstud, worn)' },
  { aspect: 'Resale retention', ysl: '45–65% (Sac de Jour: 55–70%)', val: '35–55% (Rockstud peak era pieces: 40–60%)' },
  { aspect: 'Investment tier', ysl: 'B (solid daily, limited upside)', val: 'C+ (trend-dependent, Rockstud fading)' },
  { aspect: 'Trend sensitivity', ysl: 'Low — Parisian minimalism is perennial', val: 'Medium-high — stud trend peaked ~2015-2022' },
  { aspect: 'Hardware longevity', ysl: 'Gold YSL logo hardware — timeless', val: 'Rockstud pyramids — iconic but dated to some' },
]

export default function SaintLaurentVsValentino() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Saint Laurent vs Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Saint Laurent vs Valentino ({PRICE_YEAR}): Which Holds Value Better?</h1>
      <p className="text-gray-500 mb-10">Both are Kering/European luxury with global recognition, but they serve very different aesthetics — and have very different resale trajectories. Saint Laurent's Parisian minimalism ages gracefully; Valentino's Rockstud era peaked around 2019 and is slowly declining in pre-owned markets.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Saint Laurent</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-red-700">Valentino</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.ysl}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-amber-900 mb-2">Sac de Jour: the Saint Laurent exception</h3>
        <p className="text-sm text-amber-800">The Sac de Jour is Saint Laurent's most investment-worthy bag — structured, understated, and used professionally across sectors. Pre-owned entry: $600–1,000 (worn), $900–1,400 (excellent). Retention: 55–70%, among the best for non-Hermès/Chanel bags. The Nano ($800 new) pre-owned market is particularly liquid — very consistent demand.</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-red-900 mb-2">Rockstud caution: a trend in decline</h3>
        <p className="text-sm text-red-800">The Valentino Rockstud's pyramid stud detail hit its peak around 2015-2019, and pre-owned prices have softened significantly since. A Rockstud bag bought at $1,500 new in 2018 now sells pre-owned for $400-600 — well below 40% of retail. If you're buying Valentino pre-owned, the Roman Stud (softer, 2020s) and the Loco bag have better near-term trajectories.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Choose Saint Laurent if…</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Parisian minimalism resonates with your aesthetic</li>
            <li>• You want a professional bag that holds value (Sac de Jour)</li>
            <li>• Resale in 3–5 years is a consideration</li>
            <li>• Black leather and gold hardware is your palette</li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Choose Valentino if…</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• You love the Roman Stud or floral Valentino aesthetic</li>
            <li>• You're buying to wear, not to resell</li>
            <li>• You find a Rockstud piece at deep pre-owned discount — for personal use only</li>
            <li>• The Loco or newer silhouettes appeal to you</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/saint-laurent" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent Pre-Owned →</Link>
        <Link href="/brands/valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Valentino Pre-Owned →</Link>
        <Link href="/compare/saint-laurent-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent vs Celine →</Link>
        <Link href="/compare/dior-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Valentino vs Dior →</Link>
      </div>
    </div>
  )
}
