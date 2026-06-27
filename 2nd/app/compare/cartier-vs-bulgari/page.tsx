import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Cartier vs Bulgari: Pre-Owned Jewelry 2025 | SecondLuxuryItems',
  description: 'Cartier vs Bulgari compared for pre-owned jewelry buyers — Love vs B.zero1, value retention, resale rates, and which brand to buy in 2025.',
  alternates: { canonical: `${BASE}/compare/cartier-vs-bulgari` },
}

const rows = [
  { aspect: 'Founded', cartier: '1847, Paris (Louis-François Cartier)', bvlgari: '1884, Rome (Sotirio Bulgari)' },
  { aspect: 'Iconic pieces', cartier: 'Love Bracelet, Juste un Clou, LOVE Ring, Trinity', bvlgari: 'B.zero1 Ring, Serpenti, Diva Bag, Tubogas' },
  { aspect: 'Entry pre-owned', cartier: '$900 (Love Ring Yellow Gold)', bvlgari: '$700 (B.zero1 Ring 1-band YG)' },
  { aspect: 'Love Bracelet YG 18k', cartier: '$3,500–5,000', bvlgari: 'N/A' },
  { aspect: 'Value retention', cartier: '85–100%+ (Love Bracelet)', bvlgari: '60–75% (B.zero1)' },
  { aspect: 'Global recognition', cartier: 'Universal — #1 recognized fine jewelry brand', bvlgari: 'Very high, especially in Europe/Asia/ME' },
  { aspect: 'Design style', cartier: 'Minimalist, architectural, timeless', bvlgari: 'Bold, Roman, ornate, colorful gemstones' },
  { aspect: 'Parent company', cartier: 'Richemont (LVMH rival)', bvlgari: 'LVMH (since 2011)' },
]

export default function CartierVsBvlgariPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Cartier vs Bulgari</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Cartier vs Bulgari: Pre-Owned Jewelry 2025</h1>
      <p className="text-gray-500 mb-10">Love Bracelet vs B.zero1 — the two most recognizable fine jewelry brands for pre-owned buyers.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cartier</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Love Bracelet: the world's most iconic wearable jewelry</li>
            <li>✓ Highest value retention of any fine jewelry pre-owned (85–100%+)</li>
            <li>✓ Universally recognized — no explanation needed</li>
            <li>✓ Love bracelet holds value across skin tones, ages, genders</li>
            <li>✗ Premium pricing — entry Love Bracelet YG now $7,350 new</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bulgari</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Bolder, more statement-making than Cartier</li>
            <li>✓ B.zero1 is genuinely unique — no direct competitor</li>
            <li>✓ Lower entry price than Cartier equivalent</li>
            <li>✓ Serpenti bag crossover — handbag meets jewelry</li>
            <li>✗ Lower value retention (60–75%) — more pure luxury vs investment</li>
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold">Cartier</th>
                <th className="text-left py-3 px-4 font-semibold">Bulgari</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.cartier}</td>
                  <td className="py-3 px-4 text-gray-600">{row.bvlgari}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pre-Owned Price Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Item</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Pre-owned</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: 'Cartier Love Bracelet YG 18k', retail: '$7,350', preowned: '$5,500–6,800' },
                { item: 'Cartier Love Bracelet WG 18k', retail: '$7,350', preowned: '$5,200–6,500' },
                { item: 'Cartier Juste un Clou Bracelet YG', retail: '$8,000', preowned: '$4,500–6,000' },
                { item: 'Bulgari B.zero1 Ring 1-band YG', retail: '$2,200', preowned: '$1,400–1,900' },
                { item: 'Bulgari B.zero1 Ring 4-band YG', retail: '$5,800', preowned: '$3,500–4,800' },
                { item: 'Bulgari Serpenti Viper Ring WG', retail: '$4,500', preowned: '$2,800–3,800' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">{r.item}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{r.retail}</td>
                  <td className="text-right py-3 px-4 text-green-700 font-medium">{r.preowned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier Guide →</Link>
        <Link href="/compare/cartier-vs-van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Van Cleef →</Link>
        <Link href="/guides/luxury-jewelry-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Jewelry Buying Guide →</Link>
      </div>
    </div>
  )
}
