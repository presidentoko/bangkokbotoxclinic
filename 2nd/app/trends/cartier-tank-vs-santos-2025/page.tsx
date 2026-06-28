import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Cartier Tank vs Santos 2025: Which Holds Value Better Pre-Owned? | SecondLuxuryItems',
  description: 'Cartier Tank vs Santos 2025 — resale retention, which models appreciate, pre-owned entry prices, and which Cartier watch is the better investment in 2025.',
  alternates: { canonical: `${BASE}/trends/cartier-tank-vs-santos-2025` },
}

const models = [
  {
    name: 'Cartier Tank Louis (gold)',
    side: 'tank',
    range: '$4,500–12,000 pre-owned',
    trend: '↑ Appreciating',
    note: 'The Tank Louis Cartier in 18k yellow gold is arguably the most iconic dress watch ever made. Pre-owned values have increased steadily — yellow gold specifically benefits from the return-to-classic trend. The 1970s–1990s Tank Louis pieces in excellent condition now command premiums over their original retail prices.',
  },
  {
    name: 'Cartier Tank Must (steel, quartz)',
    side: 'tank',
    range: '$1,800–3,200 pre-owned',
    trend: '↑ Rising fast',
    note: 'The Tank Must relaunch (2021) created significant demand for the steel quartz version. At ~$2,000–3,200 pre-owned, this is the accessible entry into the Tank family. The Must is the volume seller — more liquid market, faster resale. The green alligator strap version commands a significant premium.',
  },
  {
    name: 'Cartier Santos Medium (steel)',
    side: 'santos',
    range: '$3,500–5,500 pre-owned',
    trend: '→ Stable',
    note: 'The Santos is the world\'s first aviator watch (1904) and a true icon. The 2018 relaunch with the ADLC coating and quick-change strap system modernised the line. Pre-owned values are stable and very liquid — the Santos is one of the easiest Cartier watches to resell. The bicolor (steel/gold) commands a premium.',
  },
  {
    name: 'Cartier Santos de Cartier XL (steel)',
    side: 'santos',
    range: '$5,000–8,000 pre-owned',
    trend: '→ Stable',
    note: 'The large-format Santos XL appeals to buyers who want presence. Slightly less liquid than the Medium size but same base market. The Calibre de Cartier automatic movement adds a 15–20% premium over the quartz Santos.',
  },
]

const rows = [
  { aspect: 'Launch', tank: '1917 — Louis Cartier inspired by Renault FT tank', santos: '1904 — for aviator Alberto Santos-Dumont' },
  { aspect: 'Shape', tank: 'Rectangular, parallel sides, thin profile', santos: 'Square/round, visible screws on bezel, sport-influenced' },
  { aspect: 'Best resale', tank: 'Tank Louis Cartier gold (vintage especially)', santos: 'Santos Medium steel with ADLC (2018+)' },
  { aspect: 'Entry pre-owned', tank: 'Tank Must quartz $1,800–3,200', santos: 'Santos Medium quartz $3,500–4,500' },
  { aspect: 'Appreciation', tank: 'Vintage gold Tank: exceptional. Modern quartz: stable', santos: 'Stable. No major appreciation trend.' },
  { aspect: 'Investment tier', tank: 'B to A+ (vintage gold)', santos: 'B (excellent but stable)' },
  { aspect: 'Target buyer', tank: 'Dress watch lover, minimalist, boardroom aesthetic', santos: 'Sport-casual wearer, visible hardware, versatile' },
]

export default function CartierTankVsSantos() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Cartier Tank vs Santos 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Cartier Tank vs Santos 2025: Which Pre-Owned Model Holds Value?</h1>
      <p className="text-gray-500 mb-10">Two of Cartier's most iconic watch lines — both with century-long histories, both genuinely appreciating in the pre-owned market. But they serve different wearers and have different investment trajectories. Here's the detailed breakdown for pre-owned buyers in 2025.</p>

      <div className="space-y-4 mb-10">
        {models.map((m, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.side === 'tank' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-700'}`}>{m.side === 'tank' ? 'Tank' : 'Santos'}</span>
                <h2 className="font-semibold text-gray-900">{m.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.trend.includes('fast') ? 'bg-green-100 text-green-800' : m.trend.includes('↑') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.trend}</span>
              </div>
              <span className="text-xs font-semibold text-amber-700">{m.range}</span>
            </div>
            <p className="text-sm text-gray-600">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-slate-700">Tank</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-700">Santos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.tank}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.santos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-900 mb-2">The vintage Tank opportunity</h3>
        <p className="text-sm text-amber-800">The single best pre-owned Cartier opportunity right now is a 1970s–1990s Tank Louis Cartier in 18k yellow gold, in excellent condition with original papers and box. These pieces have increased 40–60% in value over the past five years as yellow gold has returned to fashion and as the collector market for "real" dress watches has deepened. Look for reference 2442 or 1654 — specific references appreciated by collectors. Budget: $6,000–15,000 depending on condition and provenance.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier Pre-Owned →</Link>
        <Link href="/guides/cartier-love-bracelet-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier Love Bracelet Guide →</Link>
        <Link href="/compare/cartier-vs-bulgari" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Bvlgari →</Link>
        <Link href="/compare/rolex-vs-cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Cartier →</Link>
      </div>
    </div>
  )
}
