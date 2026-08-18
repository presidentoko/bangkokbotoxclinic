import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Cartier Pre-Owned Price Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Pre-owned Cartier prices for Love Bracelet, Juste un Clou, Trinity, Panthère watch, Tank and more. Strong resale market for Cartier fine jewelry and watches. Updated weekly.',
  alternates: { canonical: `${BASE}/brands/cartier` },
}

const faqs = [
  {
    q: 'Does Cartier jewelry hold its value pre-owned?',
    a: "Cartier jewelry is among the best-performing for resale in the luxury goods category. The Love Bracelet, Juste un Clou, and Trinity ring typically sell pre-owned at 70–90% of current retail — significantly better than most fashion jewelry. The Love Bracelet in particular has shown consistent appreciation: a piece purchased five years ago for $4,000 (when retail was lower) may sell today for more than its original cost due to Cartier's consistent retail price increases.",
  },
  {
    q: 'Which Cartier pieces are best to buy pre-owned?',
    a: "The Love Bracelet (especially in 18k yellow or rose gold) offers the best combination of resale liquidity and value retention. The Juste un Clou bracelet is a close second. For watches, the Tank Américaine and Panthère de Cartier have dedicated collector followings. The Santos watch is seeing renewed demand following its redesign. Avoid very old pieces with missing stones unless buying specifically for restoration.",
  },
  {
    q: 'What is the price difference between Cartier metals?',
    a: "Pre-owned Cartier in 18k yellow gold commands the highest prices per gram and highest resale demand. Rose gold is similarly strong. White gold trades at a modest discount to yellow and rose (5–10%), partly due to rhodium plating that can wear away. Two-tone and tri-colour pieces (like the Trinity) hold well due to their iconic status. Always verify karat stamp — Cartier pieces are marked 750 (18k) on closures.",
  },
  {
    q: 'How do I authenticate pre-owned Cartier jewelry?',
    a: "Genuine Cartier pieces have a serial number engraved on the inside surface, a 750 (18k) gold hallmark, and the brand's laser-engraved logo. The Love Bracelet has a serial on the inner band near the screw mechanism. Screws on Love Bracelets should have 6-point (star) heads, not Phillips. Weight is also a key indicator — genuine Cartier gold pieces are noticeably heavy. Request an official Cartier receipt or have the piece verified at a Cartier service centre.",
  },
]

export default function CartierBrandPage() {
  const items = getItemsByBrand('cartier').filter(i => i.retail_price_usd > 0)

  const categories = {
    jewelry: items.filter(i => (i.category as string) === 'jewelry' || (i.category as string) === 'bracelets'),
    watches: items.filter(i => i.category === 'watches'),
    other: items.filter(i => !(['jewelry', 'bracelets', 'watches'] as string[]).includes(i.category)),
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Pre-Owned Cartier Price Guide ${PRICE_YEAR}`,
          url: `${BASE}/brands/cartier`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${item.slug}`,
            name: `Pre-Owned ${item.brand} ${item.model}`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/jewelry" className="hover:text-gray-800">Jewelry</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Cartier</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Cartier Price Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">{items.length} models · jewelry, watches & accessories</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-900">
        <strong>Investment-grade resale:</strong> Cartier Love Bracelet and Juste un Clou consistently retain 75–90% of current retail pre-owned — among the highest retention rates in fine jewelry.
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Cartier Pre-Owned</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Very Good</th>
                <th className="text-right py-3 px-4 font-semibold">Good</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const vg = item.price_ranges?.very_good
                const g = item.price_ranges?.good
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{item.model}</Link>
                    </td>
                    <td className="py-3 px-4 text-gray-500 capitalize">{item.category?.replace(/_/g, ' ')}</td>
                    <td className="text-right py-3 px-4 text-gray-500">{formatPrice(item.retail_price_usd)}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4 text-gray-500">{g ? `${formatPrice(g.min)}–${formatPrice(g.max)}` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compare Cartier</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/compare/cartier-vs-tiffany" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Tiffany</Link>
          <Link href="/compare/cartier-vs-van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Van Cleef</Link>
        </div>
      </section>
    </div>
  )
}
