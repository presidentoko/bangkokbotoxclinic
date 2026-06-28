import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Hermès Constance vs Kelly 2025: Investment Tier & Pre-Owned Guide | SecondLuxuryItems',
  description: 'Hermès Constance vs Kelly — H clasp flap vs structured frame, size comparison, resale retention, investment tier, and which Hermès pre-owned bag is the better buy in 2025.',
  alternates: { canonical: `${BASE}/compare/hermes-constance-vs-kelly` },
}

const rows = [
  { aspect: 'Launched', constance: '1959 — designed by Catherine Chaillet for herself', kelly: '1935 — originally "Sac à Dépêches", renamed 1977 after Grace Kelly' },
  { aspect: 'Shape', constance: 'Envelope flap — slim, flat, structured', kelly: 'Structured frame bag — trapezoidal, rigid frame with four feet' },
  { aspect: 'Closure', constance: 'H clasp (signature) — single turn-lock', kelly: 'Stud-and-toggle closure + two belted straps' },
  { aspect: 'Sizes', constance: '14cm, 18cm, 24cm (most sought: 18cm)', kelly: '20, 25, 28, 32, 35, 40cm (most sought: 25, 28)' },
  { aspect: 'Strap', constance: 'Single removable shoulder strap — crossbody or shoulder', kelly: 'Double-carry: top handle + optional shoulder strap (not included)' },
  { aspect: 'New price (Togo, PHW)', constance: '$6,800–9,500 (18–24cm)', kelly: '$9,200–14,500 (25–32cm)' },
  { aspect: 'Pre-owned entry', constance: '$5,200–8,000 (18cm, non-exotic)', kelly: '$7,500–12,000 (25–28cm, non-exotic)' },
  { aspect: 'Resale retention', constance: '85–110%+ (18cm Constance: often above retail)', kelly: '90–130%+ (Kelly 25 Sellier: frequently exceeds retail)' },
  { aspect: 'Investment tier', constance: 'S-Tier (crossbody format drives demand)', kelly: 'S+ Tier (Kelly 25 Sellier: among top 3 most investable bags)' },
  { aspect: 'Wearability', constance: 'More casual — crossbody strap, minimal hardware', kelly: 'Formal and structured — requires two hands to open' },
]

export default function HermesConstanceVsKelly() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Hermès Constance vs Kelly</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Hermès Constance vs Kelly (2025): Which Is the Better Investment?</h1>
      <p className="text-gray-500 mb-10">Both are S-Tier Hermès investments that consistently trade at or above retail pre-owned. The Constance wins on wearability and crossbody freedom; the Kelly 25 Sellier is arguably the single best investment bag in the luxury market, period. Your lifestyle determines which makes more sense.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-700">Constance</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-900">Kelly</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.constance}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.kelly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">Kelly 25 Sellier: the single best investment bag</h3>
        <p className="text-sm text-gray-300">The Kelly 25 Sellier in Togo or Epsom with Palladium Hardware (PHW) in Noir or Étoupe has exceeded retail consistently from 2019–2024. A $9,200 retail Kelly 25 Sellier in Noir Togo PHW has sold pre-owned for $14,000–18,000 — 52–95% above retail. Limited supply (waitlist years) + timeless design + active celebrity placement = sustained demand floor unlike any other bag.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-900 mb-2">Constance advantage: the crossbody problem</h3>
        <p className="text-sm text-amber-800">The Constance 18cm is the most wearable Hermès bag in the collection. Single shoulder strap, H clasp opens in one motion, slim enough to wear under the arm without bulk. The Kelly requires two hands to open its toggle closure. For daily active use — city errands, events, travel — the Constance is significantly more practical. Demand for the 18cm (the most sought size) now regularly exceeds retail pre-owned.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold text-green-900 mb-2">Choose Constance if…</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Crossbody carry is your primary style</li>
            <li>• You want easier daily access (H clasp, one motion)</li>
            <li>• A slimmer silhouette suits your wardrobe</li>
            <li>• The 18cm size fits your carry needs</li>
          </ul>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <h3 className="font-semibold text-green-800 mb-2">Choose Kelly if…</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Investment return is your #1 priority — Kelly 25 Sellier leads</li>
            <li>• You prefer a structured handheld for formal occasions</li>
            <li>• You can carry more (Kelly 25/28 has more interior space)</li>
            <li>• The iconic Grace Kelly heritage matters to you</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/kelly-vs-birkin" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Kelly vs Birkin →</Link>
        <Link href="/guides/hermes-bag-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Size Guide →</Link>
        <Link href="/guides/hermes-birkin-vs-kelly" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Birkin vs Kelly →</Link>
        <Link href="/guides/how-to-authenticate-hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Hermès →</Link>
      </div>
    </div>
  )
}
