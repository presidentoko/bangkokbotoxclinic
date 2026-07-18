import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Hermès Birkin vs Kelly: Which to Buy Pre-Owned 2025 | SecondLuxuryItems',
  description: 'Hermès Birkin vs Kelly — size, structure, value retention, resale. Which Hermès bag holds value better pre-owned? Complete 2025 comparison.',
  alternates: { canonical: `${BASE}/guides/hermes-birkin-vs-kelly` },
}

const priceRows = [
  { model: 'Birkin 25 (Togo/Epsom, PHW)', range: '$18,000–32,000', retail: '$11,400', retention: '160%+' },
  { model: 'Birkin 30 (Togo, GHW)', range: '$20,000–38,000', retail: '$12,900', retention: '155–195%' },
  { model: 'Birkin 35 (Togo)', range: '$18,000–30,000', retail: '$13,600', retention: '130–220%' },
  { model: 'Kelly 25 (Epsom, PHW)', range: '$16,000–26,000', retail: '$10,300', retention: '155–185%' },
  { model: 'Kelly 28 (Sellier, Togo)', range: '$17,000–28,000', retail: '$10,800', retention: '155–160%' },
  { model: 'Kelly 32 (Retourné, GHW)', range: '$15,000–24,000', retail: '$11,600', retention: '130–205%' },
]

export default function BirkinVsKellyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Birkin vs Kelly</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Hermès Birkin vs Kelly: Which to Buy Pre-Owned?</h1>
      <p className="text-gray-500 mb-10">The two most coveted Hermès bags in the world — both selling above retail, both with 10-year waitlists. But they're very different bags. Here's how to choose.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Birkin</h2>
          <p className="text-sm text-gray-600 mb-4">Named for actress Jane Birkin (1984). Open-top tote with two rolled handles and a flap. Designed for practical use — originally created on an airplane napkin sketch.</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Open top — faster to access; more practical for daily use</li>
            <li>✓ Slightly higher resale demand globally</li>
            <li>✓ Available in 25, 30, 35, 40, 45, 50 cm</li>
            <li>✓ Both Sellier (structured) and soft constructions</li>
            <li>✗ More visually "status" — some prefer the Kelly's subtlety</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kelly</h2>
          <p className="text-sm text-gray-600 mb-4">Originally the "Sac à dépêches" (1930s), renamed for Grace Kelly in 1956 after she used it to shield her pregnancy. Trapezoid shape with a single top handle and turn-lock closure.</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ More versatile — crossbody strap converts to shoulder/clutch</li>
            <li>✓ Available Sellier (rigid) or Retourné (soft) construction</li>
            <li>✓ More feminine/elegant aesthetic</li>
            <li>✓ Slightly more accessible pre-owned pricing than Birkin</li>
            <li>✗ Flap closure slower to access (for everyday use)</li>
          </ul>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pre-Owned Prices 2025 (USD)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-left py-3 px-4 font-semibold">Pre-Owned Range</th>
                <th className="text-left py-3 px-4 font-semibold">Retail</th>
                <th className="text-left py-3 px-4 font-semibold text-amber-700">vs Retail</th>
              </tr>
            </thead>
            <tbody>
              {priceRows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                  <td className="py-3 px-4 text-gray-700">{row.range}</td>
                  <td className="py-3 px-4 text-gray-500">{row.retail}</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">{row.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Which to Buy?</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <p><strong className="text-gray-900">Buy Birkin if:</strong> You want maximum resale liquidity, you use your bag daily (open top is more practical), you want the higher-profile piece, or you're buying primarily as an investment.</p>
          <p><strong className="text-gray-900">Buy Kelly if:</strong> You want versatility (shoulder strap converts to crossbody), you prefer a more structured, elegant aesthetic, or you're buying a piece to wear to events and dinners.</p>
          <p><strong className="text-gray-900">For investment:</strong> 25cm Birkin in neutral Togo leather (gold, etoupe, noir) with palladium hardware consistently has the strongest resale per-dollar. The 25 is rarer than 30 and commands a higher price-per-cm than any other size.</p>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>PHW vs GHW:</strong> Palladium (silver-tone) hardware vs Gold hardware is primarily an aesthetic choice. PHW (Palladium Hardware) tends to be slightly more versatile — pairs with more outfits. GHW has stronger resale in some markets (Middle East, Asia). Both hold value equally well.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Pre-Owned →</Link>
        <Link href="/trends/luxury-bags-above-retail" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Above-Retail Guide →</Link>
        <Link href="/compare/hermes-vs-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Hermès →</Link>
      </div>
    </div>
  )
}
