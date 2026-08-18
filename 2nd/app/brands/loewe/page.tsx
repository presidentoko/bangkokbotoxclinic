import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Loewe Pre-Owned Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Pre-owned Loewe Puzzle, Hammock, Flamenco and Basket prices. Save 35–50% vs retail. Jonathan Anderson era designs hold strong resale value.',
  alternates: { canonical: `${BASE}/brands/loewe` },
}

export default function LoeweBrandPage() {
  const items = getItemsByBrand('loewe').filter(i => i.price_ranges?.very_good || i.price_ranges?.excellent)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/handbags" className="hover:text-gray-800">Handbags</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Loewe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Loewe Buying Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">{items.length} models tracked · save 35–50% vs retail · Spain's finest leather house since 1846</p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 text-sm text-gray-700">
        <strong>Jonathan Anderson era:</strong> Since JW Anderson became creative director in 2013, Loewe has transformed from a niche Spanish brand into one of the most sought-after names in contemporary luxury. The Puzzle Bag is now a cultural icon — and pre-owned versions offer 35–50% savings vs retail while retaining strong collector demand.
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Loewe Pre-Owned</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Excellent</th>
                <th className="text-right py-3 px-4 font-semibold">Very Good</th>
                <th className="text-right py-3 px-4 font-semibold">Retention</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const ex = item.price_ranges?.excellent
                const vg = item.price_ranges?.very_good
                const avg = vg ? (vg.min + vg.max) / 2 : ex ? (ex.min + ex.max) / 2 : null
                const retention = avg && item.retail_price_usd ? Math.round((avg / item.retail_price_usd) * 100) : null
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{item.model}</Link>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">{item.retail_price_usd ? formatPrice(item.retail_price_usd) : '—'}</td>
                    <td className="text-right py-3 px-4">{ex ? `${formatPrice(ex.min)}–${formatPrice(ex.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">
                      {retention !== null && (
                        <span className={`font-semibold ${retention >= 70 ? 'text-green-600' : retention >= 55 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {retention}%
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Loewe Collections</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><strong>Puzzle Bag:</strong> The defining Anderson-era piece — geometric folded leather, many colourways and sizes</li>
            <li><strong>Hammock:</strong> Soft slouchy bag — hand-held, shoulder, or crossbody. Extremely versatile</li>
            <li><strong>Flamenco:</strong> Drawstring tote — bohemian, relaxed, Spanish heritage</li>
            <li><strong>Gate:</strong> Double-strap bag — recognisable ring closure, practical and elegant</li>
            <li><strong>Basket:</strong> Woven palm leaf + leather — Loewe's viral summer bag</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Why Buy Loewe Pre-Owned?</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Loewe uses some of the finest full-grain leather of any luxury brand</li>
            <li>• Puzzle Bag saves 35–50% vs current retail pre-owned</li>
            <li>• Still very much in-season — strong resale demand ongoing</li>
            <li>• Spanish craftsmanship tradition since 1846 — built to last</li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex gap-3 flex-wrap">
          <Link href="/compare/bottega-veneta-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega Veneta vs Loewe →</Link>
          <Link href="/handbags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">← All Handbags</Link>
        </div>
      </section>
    </div>
  )
}
