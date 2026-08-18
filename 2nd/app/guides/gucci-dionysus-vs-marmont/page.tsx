import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Gucci Dionysus vs GG Marmont: Which to Buy Pre-Owned ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Gucci Dionysus vs GG Marmont — value retention comparison, which holds resale better. Complete ${PRICE_YEAR} guide for pre-owned buyers.`,
  alternates: { canonical: `${BASE}/guides/gucci-dionysus-vs-marmont` },
}

const rows = [
  { aspect: 'Design era', dionysus: '2015 — Tom Ford-era aesthetic, tiger-head closure', marmont: '2016 — Alessandro Michele. Chevron-quilted with GG hardware' },
  { aspect: 'Shape', dionysus: 'Trapeze body. Chain strap + textile shoulder strap. Distinctive tiger buckle', marmont: 'Oval quilted body. Gold-tone interlocked GG hardware. Runs from nano to large' },
  { aspect: 'Sizes', dionysus: 'Super Mini, Mini, Small, Medium', marmont: 'Super Mini, Mini, Small, Medium; Shoulder, Top-handle, Backpack, Belt bag variations' },
  { aspect: 'Best size pre-owned', dionysus: 'Small ($750–1,100) — best proportions; Super Mini if budget', marmont: 'Small ($400–700) — most wearable; Mini if need compact' },
  { aspect: 'Value retention', dionysus: '40–65% — held better than Marmont due to unique hardware', marmont: '30–50% — peak 2019–2021, now moderating. Logo saturation risk' },
  { aspect: 'Resale trend', dionysus: 'Stable — less trend-sensitive than Marmont. Classic mythology theme', marmont: 'Declining slowly — logo visibility is double-edged. Less versatile for ageing' },
  { aspect: 'Best for', dionysus: 'Buyer who wants Gucci with distinctiveness over logo play. Slightly better hold', marmont: 'Entry Gucci buyer; occasions; more size variety. Expect lower resale' },
]

const priceRows = [
  { model: 'Dionysus Super Mini', range: '$450–750', retail: '~$1,200' },
  { model: 'Dionysus Small', range: '$750–1,100', retail: '~$1,800' },
  { model: 'Dionysus Medium', range: '$850–1,300', retail: '~$2,400' },
  { model: 'GG Marmont Mini', range: '$380–600', retail: '~$1,100' },
  { model: 'GG Marmont Small', range: '$400–700', retail: '~$1,300' },
  { model: 'GG Marmont Medium', range: '$450–780', retail: '~$1,500' },
]

export default function DionysuVsMarmontPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Dionysus vs Marmont</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Gucci Dionysus vs GG Marmont: Which to Buy Pre-Owned?</h1>
      <p className="text-gray-500 mb-10">Two iconic Gucci bags from the Alessandro Michele era — different aesthetics, different resale trajectories. The Dionysus holds slightly better; the Marmont offers more size variety but is showing logo fatigue.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Aspect</th>
              <th className="text-left py-3 px-4 font-semibold">Dionysus</th>
              <th className="text-left py-3 px-4 font-semibold">GG Marmont</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.dionysus}</td>
                <td className="py-3 px-4 text-gray-600">{row.marmont}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pre-Owned Prices 2025 (USD)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-left py-3 px-4 font-semibold">Pre-Owned</th>
                <th className="text-left py-3 px-4 font-semibold">Retail</th>
              </tr>
            </thead>
            <tbody>
              {priceRows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                  <td className="py-3 px-4 text-gray-700">{row.range}</td>
                  <td className="py-3 px-4 text-gray-400">{row.retail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci Pre-Owned →</Link>
        <Link href="/trends/resale-value-drops-to-avoid" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Value Drops to Avoid →</Link>
        <Link href="/compare/chanel-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Gucci →</Link>
      </div>
    </div>
  )
}
