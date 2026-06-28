import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Hermès Kelly vs Birkin 2025: Price, Investment, Differences | SecondLuxuryItems',
  description: 'Kelly vs Birkin compared: price ranges, size options, investment value, resale %, waitlist reality, which to buy first. Pre-owned Hermès guide 2025.',
  alternates: { canonical: `${BASE}/compare/kelly-vs-birkin` },
}

const rows = [
  { label: 'Founded / Designed', kelly: 'Introduced 1935, renamed after Grace Kelly in 1956', birkin: 'Created 1984 after chance meeting with Jane Birkin on a plane' },
  { label: 'Entry size', kelly: 'Kelly 20 (Sellier) — smallest, $4,500–$7,000 pre-owned', birkin: 'Birkin 25 — smallest standard size, $7,000–$12,000 pre-owned' },
  { label: 'Most popular size', kelly: 'Kelly 25 and Kelly 28', birkin: 'Birkin 30 and Birkin 35' },
  { label: 'Structure', kelly: 'Rigid — holds its shape when empty. Structured top flap with twist-lock clasp.', birkin: 'Open-top (no flap). More casual access, less ceremony.' },
  { label: 'Closure', kelly: 'Single top flap with a "T" turn-lock. More formal, slower to open.', birkin: 'Two front straps with palladium/gold hardware. Faster access.' },
  { label: 'Carry options', kelly: 'Two options: Sellier (structured, rigid) vs Retourné (softer, inside-stitched). One handle + optional strap.', birkin: 'Single structure. Two rolled handles. No shoulder strap option on standard Birkin.' },
  { label: 'Retail price (2025)', kelly: 'Kelly 25 Epsom: ~$9,800. Kelly 32 Togo: ~$11,200', birkin: 'Birkin 25 Epsom: ~$10,600. Birkin 30 Togo: ~$11,400' },
  { label: 'Pre-owned resale', kelly: 'Kelly 25–35 leather: 100–150%+ of retail. Exotic leathers: 200–400%+', birkin: 'Birkin 25–35 leather: 110–170%+ of retail. Exotics: 300–600%+' },
  { label: 'Which is more "investable"', kelly: 'Kelly has slightly lower floors. More accessible entry. Also appreciates, but Birkin has outpaced it.', birkin: 'Birkin consistently outperforms on resale. Birkin 25 Ghillies or exotic = strongest asset.' },
  { label: 'Waitlist reality', kelly: 'Slightly shorter waitlist at Hermès boutiques. Kelly 28/32 often more accessible than equivalent Birkin.', birkin: 'Famously waitlist-only. Some boutiques require significant purchase history ("quota bags").', },
]

export default function KellyVsBirkin() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Kelly vs Birkin</span>
      </nav>

      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Hermès Kelly vs Birkin 2025</h1>
      </div>
      <p className="text-gray-500 mb-10">Two Hermès icons, one decision. The Kelly and Birkin dominate the secondary luxury market and both appreciate far above retail. The difference: structure vs openness, formality vs casual, and slightly different waitlist dynamics at the boutique. Here is how to choose.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-36 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Kelly</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Birkin</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.kelly}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.birkin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Kelly if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You prefer a more formal bag that holds its shape</li>
            <li>• You want a strap option (Sellier variant)</li>
            <li>• Entry budget under $10k pre-owned</li>
            <li>• You like the classic top-handle look</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Birkin if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Maximum investment potential is the goal</li>
            <li>• You want faster access (no flap)</li>
            <li>• More casual everyday luxury</li>
            <li>• You can wait for the right pre-owned piece</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Pre-owned verdict</h3>
          <p className="text-sm text-gray-600">Both outperform nearly every other luxury brand on resale. Birkin has a slightly higher ceiling. Kelly has slightly more accessible entry prices. Either is a sound pre-owned buy.</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Pre-Owned →</Link>
        <Link href="/compare/chanel-vs-hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Hermès →</Link>
        <Link href="/compare/hermes-vs-dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès vs Dior →</Link>
      </div>
    </div>
  )
}
