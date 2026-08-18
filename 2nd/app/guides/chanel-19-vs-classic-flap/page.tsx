import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Chanel 19 vs Classic Flap ${PRICE_YEAR}: Which Pre-Owned Bag to Buy? | SecondLuxuryItems`,
  description: `Chanel 19 vs Classic Flap — resale retention, which holds value better, pre-owned price comparison, and which Chanel is the better investment in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/guides/chanel-19-vs-classic-flap` },
}

const rows = [
  { aspect: 'Launched', c19: '2019 (Karl Lagerfeld\'s last major design)', cf: '1955 by Coco Chanel, 1983 CC clasp by Lagerfeld' },
  { aspect: 'Chain', c19: 'Mixed chain: leather + chain interwoven, extra long', cf: 'Flat gold or silver chain, shorter and structured' },
  { aspect: 'Closure', c19: 'Magnets + tuck-in flap, easy access', cf: 'Interlocking CC turnlock (requires two hands)' },
  { aspect: 'Size options', c19: 'Small, Medium, Large, Maxi', cf: 'Mini, Small, Medium/Large (M/L), Jumbo' },
  { aspect: 'Interior', c19: 'Relaxed, three compartments, more casual layout', cf: 'Classic pocket-and-flap layout, structured' },
  { aspect: 'Leather', c19: 'Lambskin main, chain leather wrapped', cf: 'Caviar or lambskin (caviar more durable)' },
  { aspect: 'New price (2025)', c19: '$5,800–7,500 (Small–Medium)', cf: '$7,400–10,100 (Small–Medium/Large)' },
  { aspect: 'Pre-owned entry', c19: '$3,200–5,000 (small, worn)', cf: '$4,500–8,000 (small–medium, worn)' },
  { aspect: 'Resale retention', c19: '75–90%', cf: '85–110%+ (appreciates above retail in some sizes)' },
  { aspect: 'Investment tier', c19: 'A-Tier (exceptional for 6-year-old design)', cf: 'S-Tier (the best-retaining luxury bag globally)' },
]

export default function Chanel19VsClassicFlap() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Chanel 19 vs Classic Flap</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel 19 vs Classic Flap ({PRICE_YEAR}): Which to Buy Pre-Owned?</h1>
      <p className="text-gray-500 mb-10">The Chanel 19 and Classic Flap are both extraordinary investments — but they serve different buyers and have very different market dynamics. The Classic Flap is the more established investment; the Chanel 19 is a newer piece with exceptional early-stage retention. Here's the complete comparison.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-black">Chanel 19</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-black">Classic Flap</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.c19}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.cf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Choose Chanel 19 if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You want a more modern, relaxed Chanel silhouette</li>
            <li>• Easy magnetic closure is important to you</li>
            <li>• The extra-long chain for crossbody carry is your preference</li>
            <li>• Budget is a factor — entry pre-owned is ~$1,000+ cheaper than Classic Flap</li>
            <li>• You want Karl Lagerfeld's final major design (2019)</li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Choose Classic Flap if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Maximum investment performance is your priority</li>
            <li>• The iconic CC turnlock is non-negotiable for you</li>
            <li>• You want caviar leather (more scratch-resistant than 19's lambskin)</li>
            <li>• You want the most liquid Chanel to resell</li>
            <li>• The structured, tailored silhouette is your aesthetic</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">The S-Tier exception</h3>
        <p className="text-sm text-gray-300">The Chanel Classic Flap in Medium/Large (M/L) caviar with gold hardware is the single best-performing handbag investment globally, outperforming all other brands across all price points. Its resale rate has exceeded 100% of retail price for the M/L size across 2021–2024. The Chanel 19 is genuinely excellent (A-Tier) but cannot match this performance. If pure investment return is your goal, the Classic Flap wins. If wearability is equally important, the 19 is the better all-round choice.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Pre-Owned →</Link>
        <Link href="/guides/chanel-classic-vs-boy" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Classic vs Boy →</Link>
        <Link href="/guides/chanel-mini-vs-small-flap" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Mini vs Small Flap →</Link>
        <Link href="/guides/chanel-classic-flap-vs-2-55" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Classic Flap vs 2.55 →</Link>
        <Link href="/guides/how-to-authenticate-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Chanel →</Link>
      </div>
    </div>
  )
}
