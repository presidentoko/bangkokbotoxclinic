import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Rolex Pre-Owned Price Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Current pre-owned Rolex prices for Submariner, Datejust, Day-Date, GMT-Master II, Daytona and more. Sports Rolex often trade above retail. Updated weekly.',
  alternates: { canonical: `${BASE}/brands/rolex` },
}

const faqs = [
  {
    q: 'Do Rolex watches hold their value?',
    a: "Rolex has one of the strongest resale track records of any luxury brand. The Submariner, GMT-Master II, and Daytona consistently trade above retail — the 'sports Rolex' segment. The Datejust and Oyster Perpetual trade closer to retail (85–100%). Key drivers: Rolex restricts production, authorised dealer waitlists stretch years, and the brand has maintained pricing discipline without overproducing. Well-maintained Rolex watches from the 1980s–2000s have appreciated dramatically.",
  },
  {
    q: 'Which Rolex models trade above retail?',
    a: "Submariner Date (black and blue 'Bluesy'), GMT-Master II Pepsi (red-blue bezel) and Batman (black-blue bezel), Daytona in steel, and Day-Date in Everose or platinum. The Submariner No-Date is slightly below Date on the secondary market. Precious metal versions of most models trade closer to (or below) retail as their production is not limited in the same way.",
  },
  {
    q: 'What reference year matters for Rolex?',
    a: "Rolex updates references periodically (example: Submariner 116610LN was replaced by 126610LN in 2020). Newer references with ceramic bezels (Cerachrom) and larger lugs generally command premiums over older references. However, certain vintage references from the 1960s–80s are valuable in their own right. When buying pre-owned, check the reference number (engraved between lugs at 12 o'clock) against known production dates.",
  },
  {
    q: 'Papers vs no papers — does it matter for Rolex resale?',
    a: "Yes, significantly. A Rolex with original box and papers (warranty card with the specific watch's serial number) commands a 10–20% premium over the same watch without documentation. The papers verify the watch's production date and authenticate it as an original sale from an authorised dealer. For sports models above retail, the premium for full set (box + papers) is often $1,000–3,000+ on the secondary market.",
  },
]

export default function RolexBrandPage() {
  const items = getItemsByBrand('rolex').filter(i => i.retail_price_usd > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Pre-Owned Rolex Price Guide ${PRICE_YEAR}`,
          url: `${BASE}/brands/rolex`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${item.slug}`,
            name: `Pre-Owned Rolex ${item.model}`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/watches" className="hover:text-gray-800">Watches</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Rolex</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Rolex Price Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">{items.length} references tracked · sports models often above retail</p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 text-sm text-green-900">
        <strong>Above-retail alert:</strong> Rolex Submariner, GMT-Master II, and Daytona in stainless steel currently trade 20–80% above retail on the grey market due to production restrictions and multi-year authorized dealer waitlists.
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Rolex Pre-Owned</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Excellent</th>
                <th className="text-right py-3 px-4 font-semibold">Very Good</th>
                <th className="text-right py-3 px-4 font-semibold">Market</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const ex = item.price_ranges?.excellent
                const vg = item.price_ranges?.very_good
                const retail = item.retail_price_usd
                const avg = vg ? (vg.min + vg.max) / 2 : (ex ? (ex.min + ex.max) / 2 : null)
                const pct = avg && retail ? Math.round((avg / retail) * 100) : null
                const aboveRetail = pct !== null && pct > 100
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{item.model}</Link>
                      {aboveRetail && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Above Retail</span>}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">{formatPrice(retail)}</td>
                    <td className="text-right py-3 px-4">{ex ? `${formatPrice(ex.min)}–${formatPrice(ex.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">
                      {pct !== null && (
                        <span className={`font-semibold ${aboveRetail ? 'text-amber-600' : pct >= 80 ? 'text-green-600' : 'text-gray-600'}`}>
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
          <h2 className="font-semibold text-gray-900 mb-3">Sports vs Dress Rolex</h2>
          <p className="text-sm text-gray-600">
            <strong>Sports models</strong> (Submariner, GMT-Master II, Daytona, Explorer, Milgauss) are in permanent short supply at retail and trade well above retail pre-owned. <strong>Dress models</strong> (Datejust, Day-Date, Oyster Perpetual) are more readily available at ADs and trade around retail. The sports premium is driven entirely by supply restriction, not intrinsic quality differences.
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Buying Pre-Owned Rolex</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>Full set:</strong> Box + papers adds 10–20% to value</li>
            <li>• <strong>Service history:</strong> Ask when last serviced; Rolex recommends every 10 years</li>
            <li>• <strong>Original bracelet:</strong> Replacement bracelets (even genuine) reduce value</li>
            <li>• <strong>Dial condition:</strong> Refinished dials significantly reduce collector value</li>
            <li>• <strong>Case polishing:</strong> Unpolished cases (original brushing) preferred by collectors</li>
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
          <Link href="/compare/rolex-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek Philippe</Link>
          <Link href="/compare/rolex-vs-audemars-piguet" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs AP Royal Oak</Link>
        </div>
      </section>
    </div>
  )
}
