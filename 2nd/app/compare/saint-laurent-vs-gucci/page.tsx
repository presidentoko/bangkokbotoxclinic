import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Saint Laurent vs Gucci Pre-Owned 2025 | SecondLuxuryItems',
  description: 'Saint Laurent vs Gucci comparison — Sac de Jour vs Dionysus, resale values, brand trajectory. Which holds value better pre-owned?',
  alternates: { canonical: `${BASE}/compare/saint-laurent-vs-gucci` },
}

const rows = [
  { metric: 'Creative direction', ysl: 'Hedi Slimane (2018–present) — French cool', gucci: 'Sabato De Sarno (2024) after Alessandro Michele era' },
  { metric: 'Pre-owned sweet spot', ysl: 'Hedi Slimane era pieces (2018+)', gucci: 'Alessandro Michele era (2015–2022) — Dionysus, Marmont' },
  { metric: 'Most liquid bag', ysl: 'Lou Lou YSL ($700–1,100)', gucci: 'Gucci Dionysus Small ($500–850)' },
  { metric: 'Status bag', ysl: 'Sac de Jour ($1,400–2,200)', gucci: 'Gucci Horsebit 1955 ($800–1,400)' },
  { metric: 'Price vs retail', ysl: '65–85% for common; 80–110% for rare', gucci: '55–80% for Michele-era; 45–70% newer' },
  { metric: 'Brand trajectory', ysl: 'Stable-to-rising — Slimane maintained cool factor', gucci: 'In transition — Michele magic hard to replicate' },
  { metric: 'Logo visibility', ysl: 'Medium — interlocked YSL visible but clean', gucci: 'High — GG pattern, Web stripe, horsebit clearly Gucci' },
  { metric: 'Leather quality', ysl: 'Very good — grained calfskin consistent', gucci: 'Good — varies by line; leather bags generally good' },
  { metric: 'Best buy (investment)', ysl: 'Hedi Slimane Sac de Jour (classic + liquid)', gucci: 'Alessandro Michele Dionysus (iconic, widely recognized)' },
]

export default function SLVsGucciPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Saint Laurent vs Gucci</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Saint Laurent vs Gucci Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Two brands at different stages of their resale arc. Saint Laurent is stable and cool; Gucci is transitioning post-Alessandro Michele. For pre-owned buyers, the choice comes down to brand stability vs. iconic era hunting.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Saint Laurent</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Gucci</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.ysl}</td>
                <td className="py-3 px-4 text-gray-700">{r.gucci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/saint-laurent" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent Pre-Owned →</Link>
        <Link href="/brands/gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci Pre-Owned →</Link>
        <Link href="/compare/saint-laurent-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent vs Céline →</Link>
        <Link href="/guides/gucci-dionysus-vs-marmont" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dionysus vs Marmont →</Link>
      </div>
    </div>
  )
}
