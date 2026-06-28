import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Dior Saddle Bag Comeback 2025: Why It Is Back | SecondLuxuryItems',
  description: 'The Dior Saddle Bag in 2025 — price history, why it staged a massive comeback under Kim Jones, pre-owned value, collector vs fashion case. Buy or sell now?',
  alternates: { canonical: `${BASE}/trends/dior-saddle-bag-comeback-2025` },
}

const priceHistory = [
  { year: '2002', model: 'Original (John Galliano era)', price: '$900–$1,400', context: 'Peak popularity, seen on every fashion icon. Discontinued shortly after.' },
  { year: '2018', model: 'Relaunch (Maria Grazia Chiuri)', price: '$3,500–$5,500 retail', context: 'Kim Kardashian-driven revival via Instagram. Pre-owned originals 2x retail immediately.' },
  { year: '2020', model: 'Black canvas pre-owned', price: '$1,800–$2,800', context: 'Hype cooled. Good buying window for pre-owned. Retail remained elevated.' },
  { year: '2023', model: 'Oblique canvas + leather', price: '$2,500–$4,200', context: 'Second wave. Y2K fashion revival drives demand. Galliano-era originals now $2,000–$3,500.' },
  { year: '2025', model: 'Current leather (medium)', price: '$3,200–$5,800', context: 'Pre-owned remains 20–35% below current retail. Both eras actively trading.' },
]

export default function DiorSaddle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Dior Saddle Bag 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dior Saddle Bag Comeback 2025</h1>
      <p className="text-gray-500 mb-10">The Dior Saddle is one of the most dramatic comeback stories in luxury handbag history. Originally designed by John Galliano in 1999, it was everywhere in the early 2000s. Discontinued. Then relaunched in 2018 by Maria Grazia Chiuri to immediate viral demand — the Kim Kardashian Instagram post that reignited interest is now considered the biggest single social-media luxury event of the decade.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Year</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Model</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Pre-Owned Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Context</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700 font-medium">{row.year}</td>
                <td className="py-3 px-4 text-gray-700">{row.model}</td>
                <td className="py-3 px-4 text-gray-700">{row.price}</td>
                <td className="py-3 px-4 text-gray-600 text-xs">{row.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Why the Saddle holds value</h3>
          <p className="text-sm text-gray-600">The D-shaped silhouette is completely unique — no other bag has the same form. It cannot be confused with anything else. The distinctiveness that made it divisive in 2002 is exactly what makes it collectible now: the shape is unmistakable.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy or sell in 2025?</h3>
          <p className="text-sm text-gray-600">Pre-owned Saddle bags at 20–35% below retail are reasonable buys if the Y2K aesthetic continues. If you already own one, the current market is solid for selling. Both original Galliano-era and 2018+ revival era have active buyers.</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior Pre-Owned →</Link>
        <Link href="/trends/y2k-luxury-bags-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Y2K Luxury Bags →</Link>
        <Link href="/compare/chanel-vs-dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Dior →</Link>
      </div>
    </div>
  )
}
