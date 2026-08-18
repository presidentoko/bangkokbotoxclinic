import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Fendi Pre-Owned Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Pre-owned Fendi Baguette, Peekaboo, First and more. Save 35–55% vs retail. Fendi price guide updated weekly with real market data.',
  alternates: { canonical: `${BASE}/brands/fendi` },
}

export default function FendiBrandPage() {
  const items = getItemsByBrand('fendi').filter(i => i.price_ranges?.very_good || i.price_ranges?.excellent)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/handbags" className="hover:text-gray-800">Handbags</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Fendi</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Fendi Buying Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">{items.length} models tracked · save 35–55% vs retail · Est. Rome 1925</p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 text-sm text-gray-700">
        <strong>Value pick:</strong> The Fendi Baguette is one of the most culturally iconic bags in history — popularised by Sex and the City in the late 1990s. Pre-owned Baguettes in good condition offer excellent value at 40–55% below retail while maintaining strong recognition and desirability.
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Fendi Pre-Owned</h2>
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

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Fendi Collections</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><strong>Baguette:</strong> The original — compact under-arm bag, 1997. Thousands of variations; canvas, leather, sequins</li>
            <li><strong>Peekaboo:</strong> Structured top-handle bag — opens to reveal contrasting interior. Professional and classic</li>
            <li><strong>First:</strong> Crescent-shaped bag — introduced 2021, quickly became a hit</li>
            <li><strong>Sunshine:</strong> Open tote — FF logo, casual and functional</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Buying Tips</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>Baguette authenticity:</strong> Serial number inside — format differs by era (pre-2000 vs modern)</li>
            <li>• <strong>Hardware:</strong> Fendi's double-F logo hardware should be sharp and heavy — fakes are soft</li>
            <li>• <strong>Zucca canvas:</strong> Check the pattern alignment at seams — misaligned = lower quality or fake</li>
            <li>• <strong>Peekaboo interior:</strong> Bi-colour interior is a signature — verify both halves are original</li>
          </ul>
        </div>
      </section>

      <section>
        <Link href="/handbags" className="text-sm text-gray-500 hover:text-gray-800">← All Handbags</Link>
      </section>
    </div>
  )
}
