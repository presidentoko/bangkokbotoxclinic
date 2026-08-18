import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Patek Philippe Pre-Owned Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Pre-owned Patek Philippe prices for Nautilus, Aquanaut, Calatrava and more. Nautilus 5711 trades 3–4× above retail. Updated weekly.',
  alternates: { canonical: `${BASE}/brands/patek-philippe` },
}

const faqs = [
  {
    q: 'Why are Patek Philippe watches so expensive?',
    a: "Patek Philippe is the most prestigious independent watch manufacturer in the world, producing approximately 60,000 watches per year — a fraction of Rolex's output. Each watch is hand-finished by master craftsmen over months. The brand's tagline, 'You never actually own a Patek Philippe, you merely look after it for the next generation,' encapsulates its positioning as a multi-generational heirloom asset. The Nautilus and Aquanaut are the most sought-after models and command extraordinary premiums due to extreme supply restriction.",
  },
  {
    q: 'How much is a Patek Philippe Nautilus pre-owned?',
    a: "The Nautilus 5711/1A (the iconic stainless steel blue dial, now discontinued) trades pre-owned for $100,000–170,000+ — approximately 3–5× its retail price of around $35,000. The newer Nautilus 5726A with annual calendar trades at similar premiums. The Aquanaut 5167A is more accessible pre-owned at $25,000–50,000. Entry-level Patek (Calatrava) can be found from $12,000 pre-owned.",
  },
  {
    q: 'Is pre-owned Patek Philippe a good investment?',
    a: "Patek Philippe, particularly the Nautilus and Aquanaut in stainless steel, has shown some of the strongest appreciation of any collectible asset over the past 20 years. The 5711/1A rose from a retail of ~$24,000 in 2015 to pre-owned values of $150,000+ in 2021–2022. Values have corrected since the 2021–22 peak but remain significantly above retail. For investment, focus on stainless steel sports references with original dial — no refinishing, no repairs, original bracelet.",
  },
  {
    q: 'What should I check when buying pre-owned Patek Philippe?',
    a: "1. Dial originality: Patek dials should never be restored or refinished — even expert restoration destroys collector value. 2. Extract the movement and inspect finishing under magnification if possible. 3. Verify the reference and serial number against Patek's database. 4. Original bracelet and clasp are essential — aftermarket parts significantly reduce value. 5. Patek extract (official service record) is the gold standard for provenance. 6. For any purchase above $20,000, budget for independent authentication by an established watch specialist.",
  },
]

export default function PatekPhilippeBrandPage() {
  const items = getItemsByBrand('patek philippe').filter(i => i.retail_price_usd > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Pre-Owned Patek Philippe Buying Guide ${PRICE_YEAR}`,
          url: `${BASE}/brands/patek-philippe`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${item.slug}`,
            name: `Pre-Owned Patek Philippe ${item.model}`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/watches" className="hover:text-gray-800">Watches</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Patek Philippe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Patek Philippe Buying Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">{items.length} references tracked · sports models trade 3–5× above retail</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>Premium alert:</strong> Patek Philippe Nautilus 5711 and Aquanaut 5167 in stainless steel consistently trade 3–5× their retail price on the secondary market — among the highest premiums of any collectible. Even the entry-level Calatrava retains 85%+ of current retail pre-owned.
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Patek Philippe Pre-Owned</h2>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Related</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/compare/rolex-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek Philippe</Link>
          <Link href="/compare/rolex-vs-audemars-piguet" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Audemars Piguet</Link>
          <Link href="/watches" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">← All Watches</Link>
        </div>
      </section>
    </div>
  )
}
