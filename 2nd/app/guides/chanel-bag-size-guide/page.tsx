import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Chanel Classic Flap Size Guide 2025 | SecondLuxuryItems',
  description: 'Chanel Classic Flap size guide — Mini, Small, Medium/Large, Maxi. Dimensions, capacity, pre-owned prices, and which size to buy in 2025.',
  alternates: { canonical: `${BASE}/guides/chanel-bag-size-guide` },
}

export default function ChanelSizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Chanel Size Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel Classic Flap Size Guide 2025</h1>
      <p className="text-gray-500 mb-10">Mini vs Small vs Medium/Large vs Maxi — dimensions, capacity, and pre-owned prices compared.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Classic Flap Size Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Size</th>
                <th className="text-left py-3 px-4 font-semibold">Dimensions</th>
                <th className="text-right py-3 px-4 font-semibold">Retail 2025</th>
                <th className="text-right py-3 px-4 font-semibold">Pre-owned</th>
                <th className="text-left py-3 px-4 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: 'Mini (Square)', dim: '17 × 12 × 6cm', retail: '$4,950', preowned: '$3,500–5,200', best: 'Evening out · crossbody wear' },
                { size: 'Mini (Rectangular)', dim: '20 × 12 × 6cm', retail: '$5,500', preowned: '$4,200–6,000', best: 'Day/evening · phone fits easily' },
                { size: 'Small (Old: Small C)', dim: '23 × 15 × 6cm', retail: '$7,800', preowned: '$5,500–7,800', best: 'Date nights · light daily' },
                { size: 'Medium/Large (M/L)', dim: '25.5 × 15.5 × 6.5cm', retail: '$9,500', preowned: '$6,200–9,500', best: 'Most versatile, most popular' },
                { size: 'Maxi', dim: '33 × 22 × 10cm', retail: '$12,200', preowned: '$7,000–10,000', best: 'Travel · fits more, less liquid' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold text-gray-900">{r.size}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">{r.dim}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{r.retail}</td>
                  <td className="text-right py-3 px-4 text-green-700 font-medium">{r.preowned}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{r.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">Pre-owned prices: Caviar leather, Very Good condition, with no box/card premium.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Caviar vs Lambskin: Which Leather?</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="font-semibold text-gray-900 mb-2">Caviar (Pebbled Leather)</div>
            <ul className="text-gray-600 space-y-1.5">
              <li>• Scratch-resistant — ideal for daily use</li>
              <li>• Holds its shape better over time</li>
              <li>• Pre-owned: 95–110% of original retail</li>
              <li>• Easier to authenticate</li>
              <li>• Heavier than lambskin</li>
            </ul>
          </div>
          <div className="bg-amber-50 rounded-xl p-5">
            <div className="font-semibold text-gray-900 mb-2">Lambskin (Smooth Leather)</div>
            <ul className="text-gray-600 space-y-1.5">
              <li>• Ultra-soft, luxurious feel</li>
              <li>• Scratches and scuffs easily</li>
              <li>• Pre-owned: 75–90% of retail (condition matters more)</li>
              <li>• Not ideal for daily carry</li>
              <li>• Lighter weight</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Which Size to Buy Pre-Owned?</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="border-l-4 border-green-400 pl-4">
            <strong className="text-gray-900">Best investment:</strong> Medium/Large in Caviar — most liquid, highest demand, holds value 95–105%
          </div>
          <div className="border-l-4 border-blue-400 pl-4">
            <strong className="text-gray-900">Best value deal:</strong> Maxi — trades 65–80% of retail despite being a full-size bag. Under-demand creates opportunity.
          </div>
          <div className="border-l-4 border-purple-400 pl-4">
            <strong className="text-gray-900">Rising demand:</strong> Mini Rectangular — celebrity carry boom 2023–2024. Now holds 90–100% of original retail.
          </div>
          <div className="border-l-4 border-gray-300 pl-4">
            <strong className="text-gray-900">Most affordable entry:</strong> Mini Square Lambskin — enter Chanel pre-owned from $2,800 in fair condition.
          </div>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Prices →</Link>
        <Link href="/guides/how-to-authenticate-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Chanel →</Link>
        <Link href="/compare/chanel-vs-dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Dior →</Link>
      </div>
    </div>
  )
}
