import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Jacquemus vs Loewe: Which Design-Forward Brand Holds Value? (2025) | SecondLuxuryItems',
  description: 'Jacquemus vs Loewe 2025 — Le Bambino vs Puzzle, aesthetics, resale retention, and which brand is the better pre-owned investment for younger luxury buyers.',
  alternates: { canonical: `${BASE}/compare/jacquemus-vs-loewe` },
}

const rows = [
  { aspect: 'Founded', j: 'Marseille, France 2009', l: 'Madrid, Spain 1846' },
  { aspect: 'Design direction', j: 'Simon Porte Jacquemus — Mediterranean minimalism, sculptural micro bags', l: 'Jonathan Anderson — intellectual playfulness, craft references, experimental' },
  { aspect: 'Signature bag', j: 'Le Bambino, Le Chiquito (ultra-micro), Le Grand Bambino', l: 'Puzzle Bag, Amazona, Flamenco, Gate Bag' },
  { aspect: 'Price (new)', j: '$350–900 (Le Bambino Long)', l: '$1,800–4,500 (Puzzle Medium)' },
  { aspect: 'Pre-owned entry', j: '$180–350 (Le Chiquito)', l: '$900–1,500 (Puzzle, worn)' },
  { aspect: 'Resale retention', j: '30–50% (very social-media dependent)', l: '55–75% (Puzzle 65–80%)' },
  { aspect: 'Investment tier', j: 'C-Tier: style buy, not investment', l: 'B+: Puzzle has proven resale durability' },
  { aspect: 'Trend sensitivity', j: 'Very high — bags go viral then quiet quickly', l: 'Low — Puzzle has been selling for 10+ years' },
]

export default function JacquemusVsLoewe() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Jacquemus vs Loewe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Jacquemus vs Loewe (2025): The Design-Forward Comparison</h1>
      <p className="text-gray-500 mb-10">Two of the most photographed brands of the last five years — but from very different positions. Jacquemus is a viral sensation built on social media; Loewe is a 180-year-old Spanish house experiencing its greatest commercial moment. The pre-owned market treats them very differently.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700 w-36">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Jacquemus</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Loewe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.j}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.l}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
          <h3 className="font-semibold text-sky-900 mb-2">Buy Jacquemus if…</h3>
          <ul className="text-sm text-sky-800 space-y-1">
            <li>• You want a fashion moment bag at an accessible price</li>
            <li>• Le Chiquito's sculptural handle is your aesthetic</li>
            <li>• You'll wear it for 1–2 seasons (resale expectations should be low)</li>
            <li>• You're not concerned about investment performance</li>
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">Buy Loewe if…</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• You want craft quality — Loewe is one of the best leather workers in luxury</li>
            <li>• The Puzzle's geometric origami structure appeals to you</li>
            <li>• Investment is part of your thinking — the Puzzle is a genuine B+ buy</li>
            <li>• You want something intellectually unusual rather than viral</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">The Loewe craftsmanship difference</h3>
        <p className="text-sm text-gray-600">Loewe began as a leather goods cooperative in Madrid in 1846 — this means 180 years of leather working heritage. The Puzzle Bag's signature feature is the geometric panels cut from a single hide, assembled without any inner lining. A Loewe Puzzle is genuinely hand-crafted at a level Jacquemus doesn't attempt. For buyers who care about materials and making, Loewe is the clear winner.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe Pre-Owned →</Link>
        <Link href="/compare/loewe-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe vs Celine →</Link>
        <Link href="/compare/fendi-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
        <Link href="/compare/bottega-veneta-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega vs Loewe →</Link>
      </div>
    </div>
  )
}
