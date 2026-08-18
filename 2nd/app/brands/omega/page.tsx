import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Omega Pre-Owned Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Pre-owned Omega prices for Speedmaster Moonwatch, Seamaster 300M, Constellation, De Ville and more. Save 25–40% vs retail on pre-owned Omega watches.',
  alternates: { canonical: `${BASE}/brands/omega` },
}

const faqs = [
  {
    q: 'Is Omega a good investment watch to buy pre-owned?',
    a: "Omega is a strong choice for pre-owned buyers but approaches value retention differently from Rolex. The Speedmaster Moonwatch holds its value exceptionally well due to its Apollo 11 heritage and NASA certification. The Seamaster 300M (the James Bond watch) is highly liquid on the secondary market. Neither appreciates as dramatically as steel sports Rolex, but both offer strong resale combined with high wearability.",
  },
  {
    q: 'Omega Seamaster vs Speedmaster pre-owned — which is better?',
    a: "The Seamaster 300M is the more versatile daily wearer — water-resistant to 300m, sporty but dressy enough for work. The Speedmaster Moonwatch is a collector's icon — the only watch worn on the Moon. Pre-owned, they are priced similarly ($2,000–4,500 in very good condition). The Speedmaster has stronger collector demand; the Seamaster has broader general appeal.",
  },
  {
    q: 'How much does a pre-owned Omega Speedmaster cost?',
    a: "A pre-owned Omega Speedmaster Professional Moonwatch (cal. 3861 movement) in very good condition with box and papers typically trades for $3,500–5,000. Without box and papers, expect $2,800–3,800. The Co-Axial versions (introduced 2021) command a premium. Older hand-wind versions (pre-1997) with 321 or 861 calibres can range from $2,500 to well over $10,000 for rare references.",
  },
  {
    q: 'Does Omega hold value vs Rolex?',
    a: "Omega typically retains 70–85% of current retail value pre-owned, compared to Rolex which can exceed 100% on sports models. However, Omega offers better value for money — you get Swiss-made mechanical excellence, METAS certification (Master Chronometer standard), and strong brand recognition at a lower price point. For buyers who want a quality luxury watch without the grey market premium, Omega is an excellent choice.",
  },
]

export default function OmegaBrandPage() {
  const items = getItemsByBrand('omega').filter(i => i.retail_price_usd > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Pre-Owned Omega Buying Guide ${PRICE_YEAR}`,
          url: `${BASE}/brands/omega`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${item.slug}`,
            name: `Pre-Owned Omega ${item.model}`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/watches" className="hover:text-gray-800">Watches</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Omega</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Omega Buying Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">{items.length} references · save 25–40% vs retail · strong value retention</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-900">
        <strong>Value note:</strong> Unlike Rolex sports models, pre-owned Omega is typically available below retail — making it one of the best-value entry points for Swiss mechanical watches. The Speedmaster Moonwatch is one of history's most significant watches, worn on every NASA crewed Moon mission.
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Omega Pre-Owned</h2>
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
                    <td className="text-right py-3 px-4 text-gray-500">{formatPrice(item.retail_price_usd)}</td>
                    <td className="text-right py-3 px-4">{ex ? `${formatPrice(ex.min)}–${formatPrice(ex.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">
                      {retention !== null && (
                        <span className={`font-semibold ${retention >= 80 ? 'text-green-600' : retention >= 65 ? 'text-amber-600' : 'text-gray-500'}`}>
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
          <h2 className="font-semibold text-gray-900 mb-3">Omega Collections</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><strong>Speedmaster:</strong> Moonwatch heritage — NASA Moon missions, manual-wind classic</li>
            <li><strong>Seamaster:</strong> Dive watch line — 300M (James Bond), Planet Ocean, Aqua Terra</li>
            <li><strong>Constellation:</strong> Dress watch — distinctive claws and integrated bracelet</li>
            <li><strong>De Ville:</strong> Elegant slim dress watches — Tresor, Tourbillon, Hour Vision</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Buying Tips</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>Movement generation matters:</strong> Co-Axial (post-1999) and Master Chronometer (post-2015) are more service-efficient</li>
            <li>• <strong>Speedmaster:</strong> Verify it's a genuine Moonwatch (cal. 3861 or 1861) not a cheaper Reduced</li>
            <li>• <strong>Bracelet:</strong> Omega bracelets are expensive to replace — check stretch and clasp condition</li>
            <li>• <strong>Service:</strong> Ask for last service date; Omega recommends every 5–8 years</li>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compare Watches</h2>
        <div className="flex gap-3 flex-wrap">
          <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega</Link>
          <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Rolex Prices</Link>
          <Link href="/watches" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">← All Watches</Link>
        </div>
      </section>
    </div>
  )
}
