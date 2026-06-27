import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Cartier vs Van Cleef & Arpels: Pre-Owned Price Comparison 2025',
  description: 'Compare pre-owned Cartier vs Van Cleef & Arpels jewelry prices. Love Bracelet vs Alhambra, Trinity vs Perlée — value, resale, and investment compared.',
  alternates: { canonical: `${BASE}/compare/cartier-vs-van-cleef` },
}

export default function CartierVsVanCleefPage() {
  const cartierItems = getItemsByBrand('cartier').filter(i => i.category === 'jewelry')
  const vcaItems = getItemsByBrand('van cleef & arpels').filter(i => i.price_ranges.very_good)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/jewelry" className="hover:text-gray-800">Jewelry</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Cartier vs Van Cleef</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Cartier vs Van Cleef & Arpels: Pre-Owned Comparison</h1>
      <p className="text-gray-500 mb-10">Two of Paris's most prestigious jewelry maisons — very different identities on the secondary market.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cartier</h2>
          <p className="text-sm text-gray-600 mb-4">Founded 1847 · LVMH-owned (until 1963), now Richemont · "Jeweler of Kings"</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Highest name recognition globally</li>
            <li>✓ Love Bracelet among most recognised jewelry pieces in the world</li>
            <li>✓ Strong resale liquidity — easy to sell anywhere in the world</li>
            <li>✓ Wide price range from entry ($1,000+) to ultra-luxury</li>
            <li>✓ Iconic collections (Love, Juste un Clou, Trinity) very stable on resale</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Van Cleef & Arpels</h2>
          <p className="text-sm text-gray-600 mb-4">Founded 1896 · Richemont-owned · "Poet of Jewels"</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Higher perceived exclusivity — fewer stores, lower production</li>
            <li>✓ Alhambra motif is instantly recognisable among collectors</li>
            <li>✓ Stronger appreciation potential on rare/vintage pieces</li>
            <li>✓ Whimsical, artistic designs with fairy-tale aesthetic</li>
            <li>✗ Less liquid on resale — smaller buyer pool than Cartier</li>
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Head-to-Head: Flagship Pieces</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4">Cartier</th>
                <th className="text-left py-3 px-4">Van Cleef</th>
                <th className="text-right py-3 px-4">Cartier Retail</th>
                <th className="text-right py-3 px-4">VCA Retail</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Love Bracelet (18k YG)</td>
                <td className="py-3 px-4 font-medium">Vintage Alhambra Bracelet</td>
                <td className="text-right py-3 px-4">~$6,900</td>
                <td className="text-right py-3 px-4">~$5,400</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Juste un Clou Bracelet</td>
                <td className="py-3 px-4 font-medium">Perlée Bracelet</td>
                <td className="text-right py-3 px-4">~$5,500</td>
                <td className="text-right py-3 px-4">~$7,700</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Trinity Ring</td>
                <td className="py-3 px-4 font-medium">Alhambra Pendant</td>
                <td className="text-right py-3 px-4">~$1,500</td>
                <td className="text-right py-3 px-4">~$3,800</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Who should buy Cartier pre-owned?</h3>
          <p className="text-sm text-gray-600">
            Buyers who prioritise <strong>resale liquidity</strong> and <strong>broad recognition</strong>. Cartier sells easily on every platform worldwide. The Love Bracelet and Juste un Clou are among the most searched luxury jewelry pieces globally, meaning faster sale times and stronger buyer competition. Also ideal for entry-level fine jewelry buyers — Cartier's Trinity ring offers genuine brand cachet at accessible price points.
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Who should buy Van Cleef & Arpels pre-owned?</h3>
          <p className="text-sm text-gray-600">
            Buyers who want <strong>rarity and collector appeal</strong>. VCA produces fewer pieces than Cartier, and the Alhambra motif has a dedicated, passionate collector base. Vintage VCA from the 1960s–80s (the "Sweet Alhambra" era) can appreciate significantly. Best for buyers with a longer hold horizon who won't need to liquidate quickly.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse Jewelry</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/brands/cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Cartier →</Link>
          <Link href="/jewelry" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Jewelry →</Link>
          <Link href="/compare/cartier-vs-tiffany" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Tiffany →</Link>
        </div>
      </section>
    </div>
  )
}
