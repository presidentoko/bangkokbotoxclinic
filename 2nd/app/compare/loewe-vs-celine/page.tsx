import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Loewe vs Celine 2025: Puzzle vs Triomphe, Quiet Luxury | SecondLuxuryItems',
  description: 'Loewe vs Celine compared — Puzzle vs Triomphe, leather quality, quiet luxury appeal, resale value, investment case. Which to buy pre-owned in 2025?',
  alternates: { canonical: `${BASE}/compare/loewe-vs-celine` },
}

const rows = [
  { label: 'Founded', loewe: 'Madrid, 1846. Originally a leather goods cooperative. LVMH since 1996.', celine: 'Paris, 1945. Founded by Céline Vipiana. LVMH since 1987.' },
  { label: 'Creative direction', loewe: 'Jonathan Anderson (2013–present). Elevated craft, art-world positioning.', celine: 'Phoebe Philo era (2008–2018) — most collectible. Hedi Slimane (2018–present).', },
  { label: 'Signature bags', loewe: 'Puzzle Bag (2015), Flamenco, Hammock, Gate, Amazona', celine: 'Belt Bag, Triomphe (canvas + leather), Classic Box (Philo era), Luggage Nano' },
  { label: 'Entry price (pre-owned)', loewe: 'Flamenco small: $400–$700. Gate mini: $350–$600.', celine: 'Triomphe canvas mini: $300–$550. Classic Box small (Philo): $500–$900.' },
  { label: 'Most iconic piece', loewe: 'Puzzle Bag — unique geometry. Medium pre-owned: $1,200–$1,800.', celine: 'Phoebe Philo-era bags (Phantom, Trio, Classic Box) — collector tier, $700–$2,500+.' },
  { label: 'Leather quality', loewe: 'Exceptional. Loewe uses proprietary nappa and calfskin — the leather is notably supple and buttery.', celine: 'Strong under Philo. More mixed under Slimane — some leather criticized as thinner.' },
  { label: 'Resale value', loewe: 'Puzzle: 55–75% of retail. Philo-era Loewe pieces: niche but stable.', celine: 'Philo-era: 60–100%+ of retail (some Phantom and Trio above retail). Slimane-era: 40–60%.' },
  { label: 'Quiet luxury case', loewe: 'Strong craft narrative, art-world cachet, no visible branding required (Puzzle is self-evident).', celine: 'The Philo aesthetic IS quiet luxury — effortless minimalism. Slimane repositioned to logomania.' },
]

export default function LoeweVsCeline() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Loewe vs Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Loewe vs Celine 2025</h1>
      <p className="text-gray-500 mb-10">Two quiet luxury powerhouses — both LVMH, both minimal, both more interesting to know about than to wear loudly. Loewe under Jonathan Anderson has become the brand for people who care about craft. Celine under Phoebe Philo (2008–2018) defined effortless minimalism; the Slimane era shifted it toward logomania. Era matters enormously when buying Celine pre-owned.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-36 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Loewe</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Celine</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.loewe}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.celine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-blue-900 mb-2">Celine era note: Philo vs Slimane</h3>
        <p className="text-sm text-blue-800">When buying Celine pre-owned, the era is everything. Phoebe Philo's designs (2008–2018) — including the Phantom, Trio bag, Classic Box, and Cabas — command a collector premium. Hedi Slimane's designs (2018–present) added the accent to "Céline" and shifted to a rockier aesthetic. Philo-era pieces consistently outperform Slimane-era on resale.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe Pre-Owned →</Link>
        <Link href="/brands/celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Celine Pre-Owned →</Link>
        <Link href="/compare/fendi-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
        <Link href="/trends/quiet-luxury-bags-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Quiet Luxury Bags 2025 →</Link>
      </div>
    </div>
  )
}
