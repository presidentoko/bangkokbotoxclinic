import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Chanel vs Dior: Pre-Owned Comparison 2025 | SecondLuxuryItems',
  description: 'Chanel vs Dior pre-owned bags compared. Classic Flap vs Lady Dior, price, value retention, resale — which is the better buy in 2025?',
  alternates: { canonical: `${BASE}/compare/chanel-vs-dior` },
}

const rows = [
  { aspect: 'Founded', chanel: '1910, Gabrielle "Coco" Chanel', dior: '1946, Christian Dior' },
  { aspect: 'Iconic bag', chanel: 'Classic Flap / 2.55', dior: 'Lady Dior / Saddle Bag' },
  { aspect: 'Pre-owned entry price', chanel: '$2,200 (Mini Classic Flap)', dior: '$1,400 (Lady Dior Small)' },
  { aspect: 'Value retention', chanel: '75–100%+ (price hike driven)', dior: '55–70%' },
  { aspect: 'Price hike history', chanel: '+80–100% since 2019', dior: '+40–60% since 2019' },
  { aspect: 'Most resale-liquid model', chanel: 'Classic Flap (all sizes)', dior: 'Lady Dior / Saddle Bag' },
  { aspect: 'Logo visibility', chanel: 'CC clasp on Classic Flap', dior: '"DIOR" in Roman letters on Lady Dior' },
  { aspect: 'Leather options', chanel: 'Caviar, lambskin, tweed, denim', dior: 'Cannage quilting, calfskin, oblique canvas' },
]

export default function ChanelVsDiorPage() {
  const chanelItems = getItemsByBrand('chanel').filter(i => i.price_ranges?.very_good).slice(0, 5)
  const diorItems = getItemsByBrand('dior').filter(i => i.price_ranges?.very_good).slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/handbags" className="hover:text-gray-800">Handbags</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Chanel vs Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel vs Dior: Pre-Owned Comparison 2025</h1>
      <p className="text-gray-500 mb-10">Two pillars of French fashion — Chanel's investment-grade price hikes vs Dior's accessible luxury.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chanel</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Classic Flap retains 75–100%+ of current retail — investment-grade</li>
            <li>✓ Aggressive price hikes make pre-owned a genuine saving</li>
            <li>✓ Most recognised luxury bag in the world</li>
            <li>✓ Caviar leather extremely durable for everyday use</li>
            <li>✗ Entry pre-owned price much higher than Dior</li>
            <li>✗ Lambskin shows wear quickly — requires careful handling</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dior</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ More accessible entry pre-owned from $1,400</li>
            <li>✓ Lady Dior is royally endorsed — Princess Diana's signature bag</li>
            <li>✓ Saddle Bag is one of the most recognisable silhouettes globally</li>
            <li>✓ Wide range from casual (Book Tote) to formal (Lady Dior)</li>
            <li>✗ Lower value retention than Chanel (55–70% vs 75–100%)</li>
            <li>✗ Dior embossed "cannage" stitching can show wear on edges</li>
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Head-to-Head Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold">Chanel</th>
                <th className="text-left py-3 px-4 font-semibold">Dior</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.chanel}</td>
                  <td className="py-3 px-4 text-gray-600">{row.dior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Chanel Pre-Owned Prices</h3>
          <div className="space-y-2">
            {chanelItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
              </div>
            ))}
          </div>
          <Link href="/brands/chanel" className="text-sm text-blue-600 hover:underline mt-3 block">All Chanel →</Link>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Dior Pre-Owned Prices</h3>
          <div className="space-y-2">
            {diorItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
              </div>
            ))}
          </div>
          <Link href="/brands/dior" className="text-sm text-blue-600 hover:underline mt-3 block">All Dior →</Link>
        </div>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Choose Chanel if:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• You want the strongest value retention on the market</li>
            <li>• Budget is $2,500+ and you want a lifetime investment piece</li>
            <li>• You want caviar leather — the most durable option</li>
            <li>• The Classic Flap or 2.55 fits your lifestyle</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Choose Dior if:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Budget is $1,400–2,500 and you want maximum brand recognition</li>
            <li>• You love the Lady Dior or Saddle Bag silhouette</li>
            <li>• You want variety — Dior offers more distinct bag shapes</li>
            <li>• You prefer a less formal bag (Book Tote for everyday)</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
