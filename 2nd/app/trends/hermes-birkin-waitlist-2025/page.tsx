import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Hermès Birkin Waitlist 2025: How Long, How to Get One | SecondLuxuryItems',
  description: 'Hermès Birkin waitlist 2025 — how long the wait is, why pre-owned is faster, Birkin 25 vs 30 prices, and how Thai buyers get Birkins without the wait.',
  alternates: { canonical: `${BASE}/trends/hermes-birkin-waitlist-2025` },
}

export default function HermesBirkinWaitlist() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Hermès Birkin Waitlist 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Hermès Birkin Waitlist 2025: The Truth</h1>
      <p className="text-gray-500 mb-10">Hermès does not officially have a "waitlist." The reality is more complex and more frustrating. Here is how the allocation system actually works, how long buyers wait, and why most serious buyers now go pre-owned instead.</p>

      <div className="space-y-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">How the Hermès allocation system works</h2>
          <p className="text-sm text-gray-600 mb-2">Hermès uses a "purchase history" system, not a traditional waitlist. To be offered a Birkin, you typically need to have bought $5,000–$30,000+ in other Hermès products first. The ratio varies by store and location. Bangkok Hermès boutiques at Paragon and ICONSIAM each have their own allocation behavior.</p>
          <p className="text-sm text-gray-600">A "VIP" at one store means nothing at another. The system resets if you stop buying. Many Southeast Asian buyers who collect Hermès jewelry and silk report first Birkin offers after 12–36 months of purchase history.</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">How long does the wait actually take?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-2">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500">Profile</th>
                  <th className="text-left py-2 px-3 text-gray-500">Wait time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { profile: 'First-time buyer, no history', wait: '5–10 years (if ever)' },
                  { profile: 'Active buyer, $5k–$10k/year', wait: '2–4 years at primary boutique' },
                  { profile: 'VIP, $20k+/year at same store', wait: '1–2 years, usually black/gold first offer' },
                  { profile: 'Private client / top tier', wait: '6–12 months — limited color choice' },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-gray-700">{r.profile}</td>
                    <td className="py-2 px-3 text-gray-700 font-medium">{r.wait}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-amber-100 bg-amber-50 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">Why pre-owned is the smarter move</h2>
          <p className="text-sm text-gray-600 mb-2">A pre-owned Birkin 25 in Togo leather sells for $15,000–$25,000 — at or above retail. But you can buy it today, not in 5 years. The premium you pay over retail is less than the opportunity cost of waiting. For exotic leathers (crocodile, ostrich), pre-owned is the only realistic market.</p>
          <p className="text-sm text-gray-600">The mathematics: If you spend $15,000–$30,000 at boutique to "earn" a $12,000 Birkin, you may lose money versus simply buying pre-owned at $17,000 with immediate delivery.</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">Pre-owned Birkin price reference 2025</h2>
          <div className="space-y-2 mt-2">
            {[
              { item: 'Birkin 25, Togo, Black, GHW', price: '$15,000–$22,000' },
              { item: 'Birkin 25, Togo, Black, PHW', price: '$16,000–$24,000' },
              { item: 'Birkin 30, Togo, Black, GHW', price: '$13,000–$19,000' },
              { item: 'Birkin 35, Togo, Black, GHW', price: '$11,000–$17,000' },
              { item: 'Birkin 25, Exotic (croc/ostrich)', price: '$25,000–$80,000+' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{r.item}</span>
                <span className="font-semibold text-gray-900">{r.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Pre-Owned →</Link>
        <Link href="/guides/hermes-birkin-vs-kelly" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Birkin vs Kelly →</Link>
        <Link href="/guides/hermes-bag-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Size Guide →</Link>
      </div>
    </div>
  )
}
