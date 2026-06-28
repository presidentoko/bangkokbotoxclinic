import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'AP Royal Oak vs Patek Nautilus 2025: The Ultimate Watch Comparison | SecondLuxuryItems',
  description: 'Audemars Piguet Royal Oak vs Patek Philippe Nautilus — both steel sports luxury icons by Gerald Genta, investment tiers, resale retention, and which is the better pre-owned watch investment.',
  alternates: { canonical: `${BASE}/compare/ap-royal-oak-vs-nautilus` },
}

const rows = [
  { aspect: 'Designed by', ap: 'Gerald Genta — 1972', naut: 'Gerald Genta — 1976 (for Patek)' },
  { aspect: 'Case shape', ap: 'Octagonal bezel with visible screws', naut: 'Round case with integrated "porthole" style' },
  { aspect: 'Signature dial', ap: '"Petite tapisserie" checkerboard hobnail guilloché', naut: 'Horizontal striped "Clous de Paris" guilloché' },
  { aspect: 'Key references', ap: 'Royal Oak 15500 (39mm), 15202 (Jumbo), 26240 Chronograph', naut: '5711/1A (discontinued), 5726A, 5712A (Moonphase)' },
  { aspect: 'New price (entry)', ap: '$23,000–29,000 (Royal Oak 15500 steel)', naut: '$29,000–34,893 (5711/1A, discontinued)' },
  { aspect: 'Pre-owned entry', ap: '$28,000–45,000 (Royal Oak 15500)', naut: '$60,000–90,000 (5711/1A blue)' },
  { aspect: 'Resale retention', ap: '100–180%+ (15500 premium above retail)', naut: '200–630%+ (5711/1A Olive Green extreme)' },
  { aspect: 'Investment tier', ap: 'S-Tier (Royal Oak 15500)', naut: 'S+ Tier (5711/1A discontinued; in a class alone)' },
  { aspect: 'Production status', ap: 'Active — ongoing production, waitlist at AD', naut: '5711 discontinued 2021; current Nautilus 5811 replaces' },
  { aspect: 'Waiting list', ap: '3–7 years at most ADs for steel Royal Oak', naut: '5811 available; 5711/1A secondary market only' },
]

export default function ApRoyalOakVsNautilus() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>AP Royal Oak vs Nautilus</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">AP Royal Oak vs Patek Nautilus (2025): Which Watch to Buy?</h1>
      <p className="text-gray-500 mb-10">Both were designed by the same man (Gerald Genta) and both define the "integrated bracelet steel sports luxury" category. But they serve slightly different buyers — and their investment profiles are different. The Nautilus 5711/1A is arguably the single most valuable production watch of the modern era; the Royal Oak is the category inventor.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-blue-800">AP Royal Oak</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Patek Nautilus</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.ap}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.naut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">Gerald Genta: the man who designed both</h3>
        <p className="text-sm text-gray-300">Gerald Genta designed the Royal Oak for AP in 1972 (reportedly in a single night) and the Nautilus for Patek in 1976. Both were radical for their time — steel sports watches priced like complicated dress watches. Both were initially controversial; both became the most sought-after watches in the world. The shared lineage explains their stylistic similarities: integrated bracelet, sports-heritage movement, guilloché dial.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">Royal Oak is better if…</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You want something obtainable from the secondary market at a defined price</li>
            <li>• The octagonal bezel and tapisserie dial speak to you more</li>
            <li>• You're building an entry to the S-Tier watch category</li>
            <li>• A 39mm modern case (15500) is your preferred size</li>
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">Nautilus is better if…</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Maximum investment return is the priority (5711/1A only)</li>
            <li>• You prefer the rounder case and horizontal-stripe dial</li>
            <li>• You can access the 5811 (new Nautilus) via Patek AD relationship</li>
            <li>• The Patek brand prestige (complications heritage) matters more</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/ap-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP vs Patek →</Link>
        <Link href="/trends/patek-philippe-nautilus-investment-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Nautilus Investment →</Link>
        <Link href="/guides/patek-philippe-nautilus-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Nautilus Guide →</Link>
        <Link href="/compare/rolex-vs-audemars-piguet" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs AP →</Link>
      </div>
    </div>
  )
}
