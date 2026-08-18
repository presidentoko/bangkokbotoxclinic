import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Audemars Piguet Pre-Owned Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Pre-owned Audemars Piguet prices. Royal Oak 15500ST trades 150–300% above retail. AP Offshore, Royal Oak Concept and more — updated weekly.',
  alternates: { canonical: `${BASE}/brands/audemars-piguet` },
}

const faqs = [
  {
    q: 'Why is the Audemars Piguet Royal Oak so expensive pre-owned?',
    a: "The Royal Oak 15500ST is one of the most coveted watches in the world for two reasons: historical significance and extreme scarcity. Designed by Gérald Genta in 1972, it was the world's first luxury sports watch in stainless steel — a category now worth billions. AP produces only ~40,000 watches annually, and the Royal Oak accounts for a fraction of that. Waitlists at authorised dealers run 5–8 years. Pre-owned supply is naturally limited, and demand — especially from Asian collectors — continues to outpace it.",
  },
  {
    q: 'How much does a pre-owned Royal Oak 15500ST cost?',
    a: "The Royal Oak 15500ST (the current 41mm reference with white, blue, or silver dial) trades pre-owned for $65,000–120,000 depending on condition, dial colour, and whether box and papers are included. Blue dial commands the highest premium. The earlier 15400ST trades for $45,000–80,000. The iconic 39mm 15202ST (Jumbo) can reach $150,000+. All are significantly above their retail prices of $23,000–32,000.",
  },
  {
    q: 'Is Audemars Piguet a good investment watch?',
    a: "AP Royal Oak and Offshore in stainless steel have been among the strongest-performing alternative assets over the past decade. The 15500ST has appreciated 3–4× its retail value since release. However, the collector market is smaller and more specialised than Rolex — resale can take longer in markets outside major financial centres. For investment, prioritise: stainless steel over precious metals, full box and papers, unworn or near-unworn condition, original bracelet.",
  },
  {
    q: 'What is the difference between Royal Oak and Royal Oak Offshore?',
    a: "The Royal Oak (launched 1972) is the original — slim, integrated bracelet, octagonal bezel with exposed screws. The Offshore (launched 1993) is a larger, bolder interpretation — bigger case (42–44mm), more robust crown protectors, sportier aesthetic. The Offshore is associated with hip-hop culture and sports ambassadors; the Royal Oak is the purist's choice. Pre-owned, the Offshore is more accessible ($20,000–60,000 for steel references) while the Royal Oak commands higher premiums.",
  },
]

export default function AudemarsPiguetBrandPage() {
  const items = getItemsByBrand('audemars piguet').filter(i => i.retail_price_usd > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Pre-Owned Audemars Piguet Buying Guide ${PRICE_YEAR}`,
          url: `${BASE}/brands/audemars-piguet`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${item.slug}`,
            name: `Pre-Owned Audemars Piguet ${item.model}`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/watches" className="hover:text-gray-800">Watches</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Audemars Piguet</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Audemars Piguet Buying Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">{items.length} references tracked · Royal Oak 15500ST trades 3–5× retail · Est. 1875</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>Above retail:</strong> The Royal Oak 15500ST and Offshore in stainless steel consistently trade far above retail. Even entry-level AP (Royal Oak Offshore steel) holds 90%+ of its retail value pre-owned. AP is one of the three watches (alongside Rolex and Patek Philippe) that reliably trade at or above retail price.
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Audemars Piguet Pre-Owned</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Excellent</th>
                <th className="text-right py-3 px-4 font-semibold">Very Good</th>
                <th className="text-right py-3 px-4 font-semibold">vs Retail</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const ex = item.price_ranges?.excellent
                const vg = item.price_ranges?.very_good
                const avg = ex ? (ex.min + ex.max) / 2 : vg ? (vg.min + vg.max) / 2 : null
                const pct = avg && item.retail_price_usd ? Math.round((avg / item.retail_price_usd) * 100) : null
                const aboveRetail = pct !== null && pct > 105
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{item.model}</Link>
                      {aboveRetail && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Above Retail</span>}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">{formatPrice(item.retail_price_usd)}</td>
                    <td className="text-right py-3 px-4">{ex ? `${formatPrice(ex.min)}–${formatPrice(ex.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">
                      {pct !== null && (
                        <span className={`font-semibold ${aboveRetail ? 'text-amber-600' : pct >= 85 ? 'text-green-600' : 'text-gray-500'}`}>
                          {pct}%
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
          <h2 className="font-semibold text-gray-900 mb-3">AP Collections</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><strong>Royal Oak:</strong> The original luxury sports watch (1972) — integrated bracelet, octagonal bezel, "tapisserie" dial</li>
            <li><strong>Royal Oak Offshore:</strong> Larger, bolder Royal Oak — sporty, popular with collectors and athletes</li>
            <li><strong>Royal Oak Concept:</strong> Haute horlogerie complications — flying tourbillon, chronograph</li>
            <li><strong>Millenary:</strong> Oval case with off-centred dial — AP's dress watch offering</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Buying Tips</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>Bracelet condition:</strong> AP bracelets are extremely expensive to replace — check every link for stretch</li>
            <li>• <strong>Dial originality:</strong> Royal Oak dials should never be refinished or polished</li>
            <li>• <strong>AP Extract:</strong> Official service document — essential for any piece above $30,000</li>
            <li>• <strong>Case finishing:</strong> AP alternates brushed and polished surfaces — improper polishing destroys value</li>
          </ul>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compare</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/compare/rolex-vs-audemars-piguet" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs AP →</Link>
          <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Prices →</Link>
          <Link href="/brands/patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Patek Philippe Prices →</Link>
        </div>
      </section>
    </div>
  )
}
