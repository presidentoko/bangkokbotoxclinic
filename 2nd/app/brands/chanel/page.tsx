import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Chanel Pre-Owned Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Current pre-owned Chanel prices for Classic Flap, Boy Bag, 2.55, Coco Handle and more. Chanel raises prices 2–3× per year — pre-owned often beats retail. Updated weekly.',
  alternates: { canonical: `${BASE}/brands/chanel` },
}

const faqs = [
  {
    q: 'Why does Chanel raise prices so frequently?',
    a: "Chanel has increased retail prices 20–30 times since 2019, with some bags rising over 150% in five years. The brand frames this as a response to inflation and currency fluctuation, but the consistent increases have had a secondary effect: well-maintained pre-owned Chanel bags now frequently match or exceed their original purchase price on the secondary market, making them among the best-performing luxury goods for value retention.",
  },
  {
    q: 'Is the Classic Flap or the 2.55 a better investment?',
    a: "The Classic Flap (introduced by Karl Lagerfeld in 1983) outsells and out-appreciates the 2.55 in most markets due to higher name recognition and broader sizing. The 2.55 is the original 1955 design with a burgundy lining and rectangular clasp — appreciated more by collectors. For pure value retention, the Classic Flap in caviar leather (more scratch-resistant than lambskin) in medium or jumbo size is the strongest choice.",
  },
  {
    q: 'Caviar vs lambskin Chanel — which holds value better?',
    a: "Caviar leather is pebbled and significantly more durable — it resists scratches, moisture, and daily wear far better than lambskin. Pre-owned caviar bags grade higher in condition assessments and command 10–20% premiums over equivalent lambskin bags. If you plan to carry the bag regularly, caviar is the practical and financial choice. Lambskin ages beautifully but requires extreme care.",
  },
  {
    q: 'What is the best entry-level Chanel to buy pre-owned?',
    a: "The Chanel Wallet on Chain (WOC) is the most accessible entry point, available pre-owned from around $1,800–2,500 in very good condition. The Mini Classic Flap is another strong option. Both have performed well relative to their retail price increases. Avoid very worn lambskin pieces — restoration costs can exceed the value recovered.",
  },
]

export default function ChanelBrandPage() {
  const items = getItemsByBrand('chanel').filter(i => i.retail_price_usd > 0)
  const pricedItems = items.filter(i => i.price_ranges.very_good)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Pre-Owned Chanel Buying Guide ${PRICE_YEAR}`,
    url: `${BASE}/brands/chanel`,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${BASE}/${item.slug}`,
      name: `Pre-Owned ${item.brand} ${item.model}`,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/handbags" className="hover:text-gray-800">Handbags</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Chanel</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Chanel Buying Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">
        {pricedItems.length} models tracked · prices updated weekly from Vestiaire Collective &amp; global resale markets
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>Price appreciation alert:</strong> Chanel has raised retail prices 20+ times since 2019. The Classic Flap Medium in lambskin that retailed for $4,500 in 2019 now retails for over $10,000 — meaning bags purchased years ago and sold today often break even or profit at resale.
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Chanel Pre-Owned</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Very Good</th>
                <th className="text-right py-3 px-4 font-semibold">Good</th>
                <th className="text-right py-3 px-4 font-semibold">Retention</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const vg = item.price_ranges?.very_good
                const g = item.price_ranges?.good
                const retail = item.retail_price_usd
                const retention = vg && retail ? Math.round((((vg.min + vg.max) / 2) / retail) * 100) : null
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {item.model}
                      </Link>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">{formatPrice(retail)}</td>
                    <td className="text-right py-3 px-4">
                      {vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : '—'}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">
                      {g ? `${formatPrice(g.min)}–${formatPrice(g.max)}` : '—'}
                    </td>
                    <td className="text-right py-3 px-4">
                      {retention !== null ? (
                        <span className={`font-semibold ${retention >= 90 ? 'text-green-600' : retention >= 70 ? 'text-amber-600' : 'text-red-500'}`}>
                          {retention}%
                        </span>
                      ) : '—'}
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
          <h2 className="font-semibold text-gray-900 mb-3">Classic Flap vs Boy Bag</h2>
          <p className="text-sm text-gray-600">
            The Classic Flap (CC turnlock, quilted caviar or lambskin) is the most recognised Chanel design and the strongest value performer. The Boy Bag has a more structured, rectangular silhouette with a sliding bar clasp — it appeals to a younger buyer and can feel more casual. The Classic Flap retains value more consistently because it has a broader, more universal audience.
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Buying Tips</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>Leather:</strong> Caviar holds up far better than lambskin — worth the premium for daily use</li>
            <li>• <strong>Hardware:</strong> Gold hardware has broader resale appeal than silver (ruthenium) in most markets</li>
            <li>• <strong>Box &amp; card:</strong> Original box adds 5–10% to resale — request it if buying</li>
            <li>• <strong>Authentication:</strong> Check hologram sticker series number matches authenticity card</li>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore All Chanel Items</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map(item => (
            <Link key={item.id} href={`/${item.slug}`}
              className="border border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors text-sm">
              <div className="font-medium text-gray-900">{item.model}</div>
              {item.price_ranges?.very_good && (
                <div className="text-gray-500 mt-1">{formatPrice(item.price_ranges.very_good.min)}+</div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
