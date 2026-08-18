import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Hermès Birkin & Kelly Size Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Complete Hermès Birkin and Kelly size guide — 25 vs 30 vs 35, which size to buy pre-owned, and how size affects resale value.',
  alternates: { canonical: `${BASE}/guides/hermes-bag-size-guide` },
}

export default function HermesSizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Hermès Size Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Hermès Birkin & Kelly Size Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Which size to buy, how size affects price, and what resells best pre-owned.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Birkin Size Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Size</th>
                <th className="text-left py-3 px-4 font-semibold">Dimensions</th>
                <th className="text-right py-3 px-4 font-semibold">Retail (USD)</th>
                <th className="text-right py-3 px-4 font-semibold">Pre-owned Range</th>
                <th className="text-left py-3 px-4 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: 'Birkin 25', dim: '25 × 20 × 13cm', retail: '$9,850', preowned: '$14,000–28,000', best: 'Collectible, most sought-after' },
                { size: 'Birkin 30', dim: '30 × 22 × 16cm', retail: '$10,900', preowned: '$11,500–22,000', best: 'Most versatile everyday size' },
                { size: 'Birkin 35', dim: '35 × 25 × 18cm', retail: '$12,200', preowned: '$10,500–19,000', best: 'Work bag, fits A4 documents' },
                { size: 'Birkin 40', dim: '40 × 30 × 21cm', retail: '$14,500', preowned: '$10,000–17,000', best: 'Travel/weekend — less liquid' },
                { size: 'Birkin 50/55', dim: '50+ cm', retail: '$18,000+', preowned: '$9,500–14,000', best: 'Travel only — very niche market' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{r.size}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">{r.dim}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{r.retail}</td>
                  <td className="text-right py-3 px-4 text-green-700 font-medium">{r.preowned}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{r.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">Pre-owned prices for Togo leather, very good condition, with no box/card premium.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kelly Size Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Size</th>
                <th className="text-left py-3 px-4 font-semibold">Sellier vs Retourné</th>
                <th className="text-right py-3 px-4 font-semibold">Retail (USD)</th>
                <th className="text-right py-3 px-4 font-semibold">Pre-owned</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: 'Mini Kelly II (20cm)', style: 'Sellier only', retail: '$8,700', preowned: '$15,000–28,000' },
                { size: 'Kelly 25', style: 'Sellier or Retourné', retail: '$8,900', preowned: '$11,000–20,000' },
                { size: 'Kelly 28', style: 'Sellier or Retourné', retail: '$9,400', preowned: '$10,500–18,000' },
                { size: 'Kelly 32', style: 'Sellier or Retourné', retail: '$10,600', preowned: '$10,000–17,000' },
                { size: 'Kelly 35/40', style: 'Retourné primarily', retail: '$11,500+', preowned: '$9,500–15,500' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{r.size}</td>
                  <td className="py-3 px-4 text-gray-500">{r.style}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{r.retail}</td>
                  <td className="text-right py-3 px-4 text-green-700 font-medium">{r.preowned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Size-for-Investment Guide</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <div className="font-semibold text-green-800 mb-2">Best investment sizes</div>
            <ul className="text-green-700 space-y-1.5">
              <li>• Birkin 25: highest demand/supply ratio</li>
              <li>• Birkin 30: most liquid, sells fastest</li>
              <li>• Kelly 25: crossbody carry = broader market</li>
              <li>• Mini Kelly II: tiny float, prices only go up</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="font-semibold text-gray-800 mb-2">Sizes to avoid for investment</div>
            <ul className="text-gray-600 space-y-1.5">
              <li>• Birkin 40, 50, 55: niche buyer pool</li>
              <li>• Kelly 40: too large for most, slow to sell</li>
              <li>• Any size in exotic leather without papers</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Prices →</Link>
        <Link href="/compare/hermes-vs-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès vs Chanel →</Link>
        <Link href="/guides/how-to-authenticate-hermes" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Hermès →</Link>
      </div>
    </div>
  )
}
