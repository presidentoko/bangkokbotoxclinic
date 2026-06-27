import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'LV Monogram vs Damier: Which Canvas to Buy Pre-Owned | SecondLuxuryItems',
  description: 'Louis Vuitton Monogram vs Damier Ebène vs Damier Azur — which canvas holds value better, which is more practical, and pre-owned price comparison 2025.',
  alternates: { canonical: `${BASE}/guides/lv-monogram-vs-damier` },
}

export default function LVMonogramVsDamierPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>LV Monogram vs Damier</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">LV Monogram vs Damier: Which Canvas to Buy Pre-Owned?</h1>
      <p className="text-gray-500 mb-10">Three iconic LV canvas patterns compared — value retention, durability, versatility, and pre-owned pricing in 2025.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Canvas Comparison Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Canvas</th>
                <th className="text-left py-3 px-4 font-semibold">Look</th>
                <th className="text-right py-3 px-4 font-semibold">Value Retention</th>
                <th className="text-left py-3 px-4 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                { canvas: 'Monogram', look: 'Brown LV logo on tan', retention: '80–95%', best: 'Classic collectors · high recognition' },
                { canvas: 'Damier Ebène', look: 'Brown/dark brown checks', retention: '70–85%', best: 'Daily carry · understated · professionals' },
                { canvas: 'Damier Azur', look: 'Light grey/cream checks', retention: '65–80%', best: 'Summer · travel · resort wear' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold text-gray-900">{r.canvas}</td>
                  <td className="py-3 px-4 text-gray-500">{r.look}</td>
                  <td className="text-right py-3 px-4 text-green-700 font-medium">{r.retention}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{r.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Deep Dive by Canvas</h2>
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Monogram Canvas</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>
                <div className="font-medium text-gray-800 mb-1">Pros</div>
                <ul className="space-y-1">
                  <li>• Most recognizable LV pattern worldwide</li>
                  <li>• Coated canvas — water resistant, very durable</li>
                  <li>• Highest demand on the resale market</li>
                  <li>• Ages gracefully (patina on vachetta trim)</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">Cons</div>
                <ul className="space-y-1">
                  <li>• Very visible branding — love it or hate it</li>
                  <li>• Vachetta leather darkens with use (deliberate)</li>
                  <li>• Most common on secondary market</li>
                </ul>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              <strong>Speedy 25 pre-owned:</strong> $600–900 (Very Good) vs $1,150 retail
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Damier Ebène Canvas</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>
                <div className="font-medium text-gray-800 mb-1">Pros</div>
                <ul className="space-y-1">
                  <li>• No vachetta — worry-free in rain</li>
                  <li>• Subtle compared to Monogram — more professional</li>
                  <li>• Red lining (alcantara) is luxurious inside</li>
                  <li>• Great for daily office use</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">Cons</div>
                <ul className="space-y-1">
                  <li>• Lower value retention than Monogram</li>
                  <li>• Less classic — introduced 1996 vs Monogram 1896</li>
                  <li>• Slightly darker aesthetic limits outfit pairing</li>
                </ul>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              <strong>Neverfull MM Damier Ebène:</strong> $750–1,100 (Very Good) vs $1,680 retail
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Damier Azur Canvas</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>
                <div className="font-medium text-gray-800 mb-1">Pros</div>
                <ul className="space-y-1">
                  <li>• Light, airy palette — perfect for summer</li>
                  <li>• No vachetta — weather resistant</li>
                  <li>• Beach/resort aesthetic is in demand</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">Cons</div>
                <ul className="space-y-1">
                  <li>• Shows dirt more easily (light canvas)</li>
                  <li>• Seasonal — harder to use in autumn/winter</li>
                  <li>• Lowest value retention of the three</li>
                </ul>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              <strong>Speedy 25 Damier Azur:</strong> $550–800 (Very Good) vs $1,150 retail
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Which Should You Buy Pre-Owned?</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="border-l-4 border-green-400 pl-4"><strong className="text-gray-900">Best investment:</strong> Monogram — highest demand, fastest resale, 80–95% retention</div>
          <div className="border-l-4 border-blue-400 pl-4"><strong className="text-gray-900">Best for daily use:</strong> Damier Ebène — no vachetta worry, understated, professional</div>
          <div className="border-l-4 border-amber-400 pl-4"><strong className="text-gray-900">Best value deal:</strong> Damier Azur — biggest gap from retail, great if you actually use it in summer</div>
          <div className="border-l-4 border-gray-300 pl-4"><strong className="text-gray-900">Buy all three?</strong> Neverfull MM is available in all three canvas — the most popular pre-owned LV, easy to flip</div>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All LV Prices →</Link>
        <Link href="/how-to-authenticate-louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate LV →</Link>
        <Link href="/compare/chanel-vs-louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs LV →</Link>
      </div>
    </div>
  )
}
