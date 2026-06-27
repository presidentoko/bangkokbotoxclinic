import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Balenciaga vs Valentino: Pre-Owned Bags 2025 | SecondLuxuryItems',
  description: 'Balenciaga vs Valentino pre-owned compared — City vs Rockstud, retention rates, and which brand is the better buy in 2025.',
  alternates: { canonical: `${BASE}/compare/balenciaga-vs-valentino` },
}

const rows = [
  { aspect: 'Design identity', balen: 'Deconstructed streetwear-meets-couture', valen: 'Roman glamour — studs, silk, structured shapes' },
  { aspect: 'Iconic bag', balen: 'City Bag / Le Cagole', valen: 'Rockstud Crossbody / Locò' },
  { aspect: 'Entry pre-owned', balen: '$800 (City Bag RH, well-worn)', valen: '$600 (Rockstud accessories)' },
  { aspect: 'Mid-range pre-owned', balen: '$1,100–1,600 (Le Cagole Medium)', valen: '$900–1,450 (VLogo Medium)' },
  { aspect: 'Value retention', balen: '40–55% (trend-sensitive)', valen: '40–55% (similar range)' },
  { aspect: 'Best era to buy pre-owned', balen: '2015–2020 (Demna early era City Bags)', valen: '2016–2022 (Piccioli Roman Stud era)' },
  { aspect: 'Brand trajectory 2025', balen: 'Stabilising after 2022 controversy', valen: 'New direction under Michele — uncertain' },
]

export default function BalenciagaVsValentinoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Balenciaga vs Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Balenciaga vs Valentino: Pre-Owned 2025</h1>
      <p className="text-gray-500 mb-10">Two fashion powerhouses at similar price points — deconstruction vs Roman glamour.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Balenciaga</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ City Bag: cult status, instantly recognisable silhouette</li>
            <li>✓ Le Cagole drove massive celebrity coverage 2021–2023</li>
            <li>✓ Distressed leather ages gracefully</li>
            <li>✗ 2022 controversy depressed prices — still recovering</li>
            <li>✗ Trend-dependent — less timeless than Valentino Rockstud</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Valentino</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Rockstud studding is recognisable without a logo</li>
            <li>✓ Bold colour (PP era) holds collector interest</li>
            <li>✓ Good quality calfskin and nappa leather</li>
            <li>✗ Alessandro Michele era direction still uncertain</li>
            <li>✗ Similar retention to Balenciaga — neither is an investment play</li>
          </ul>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold">Balenciaga</th>
                <th className="text-left py-3 px-4 font-semibold">Valentino</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.balen}</td>
                  <td className="py-3 px-4 text-gray-600">{row.valen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-900">
        <strong>Bottom line:</strong> Both brands offer similar pre-owned value (40–55% of retail). If you want a fashion statement bag, buy the one you'll actually wear — style matters more than investment potential here. For investment, look at Chanel, Hermès, or Cartier instead.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/balenciaga" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga Guide →</Link>
        <Link href="/brands/valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Valentino Guide →</Link>
        <Link href="/handbags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Handbags →</Link>
      </div>
    </div>
  )
}
