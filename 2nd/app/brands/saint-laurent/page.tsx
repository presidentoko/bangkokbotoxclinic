import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Saint Laurent Pre-Owned Price Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Pre-owned Saint Laurent prices for Loulou, Kate, Jamie, Sunset and more. Save 30–50% vs retail on pre-owned YSL. Updated weekly.',
  alternates: { canonical: `${BASE}/brands/saint-laurent` },
}

const faqs = [
  {
    q: 'Is Saint Laurent or YSL the correct name?',
    a: "The brand was rebranded from Yves Saint Laurent to Saint Laurent Paris in 2012 under creative director Hedi Slimane. The fashion house is now simply 'Saint Laurent,' though the YSL initials remain on bags and the parent brand (Kering) still references Yves Saint Laurent. On the resale market, both names are used interchangeably. Pre-2012 pieces may carry additional collector interest as 'vintage YSL.'",
  },
  {
    q: 'Which Saint Laurent bags hold their value best?',
    a: "The Loulou, Kate Tassel, and Sunset consistently show the strongest resale performance. The Kate 99 (medium envelope flap) is the closest YSL equivalent to a Chanel Classic Flap in positioning. The Jamie camera bag has grown significantly in resale demand since 2022. Chevron quilting (diagonal pattern) tends to command a slight premium over grid quilting for the same model.",
  },
  {
    q: 'How much can I save buying Saint Laurent pre-owned?',
    a: "Pre-owned Saint Laurent bags typically trade at 35–55% below current retail in very good condition. For context: a Loulou Small that retails for $1,690 can be found pre-owned in excellent condition for $800–1,100. Condition significantly impacts price — bags with worn corners or faded hardware can drop to 25% of retail, while near-mint examples with dust bags hold 60–70%.",
  },
  {
    q: 'What should I check when buying pre-owned Saint Laurent?',
    a: "Inspect the bottom corners first — this is where Saint Laurent bags wear fastest. Check the lining (crossgrain leather lining on most YSL bags shows wear around the zipper). Hardware patina is normal but should be even. The date code stamp (inside pocket or back panel) format changed over years — research the specific format for your model and year to verify authenticity.",
  },
]

export default function SaintLaurentBrandPage() {
  const items = getItemsByBrand('saint-laurent').filter(i => i.retail_price_usd > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Pre-Owned Saint Laurent Price Guide ${PRICE_YEAR}`,
          url: `${BASE}/brands/saint-laurent`,
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
        <Link href="/handbags" className="hover:text-gray-800">Handbags</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Saint Laurent</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Saint Laurent Price Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">{items.length} models · save 35–55% vs retail</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Table — Saint Laurent Pre-Owned</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Excellent</th>
                <th className="text-right py-3 px-4 font-semibold">Very Good</th>
                <th className="text-right py-3 px-4 font-semibold">Good</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const ex = item.price_ranges?.excellent
                const vg = item.price_ranges?.very_good
                const g = item.price_ranges?.good
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{item.model}</Link>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">{formatPrice(item.retail_price_usd)}</td>
                    <td className="text-right py-3 px-4">{ex ? `${formatPrice(ex.min)}–${formatPrice(ex.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4 text-gray-500">{g ? `${formatPrice(g.min)}–${formatPrice(g.max)}` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Best Sellers Pre-Owned</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><strong>Loulou Small/Medium:</strong> Signature YSL, very liquid on resale</li>
            <li><strong>Kate Tassel:</strong> Classic envelope clutch/crossbody, evergreen style</li>
            <li><strong>Jamie:</strong> Camera bag silhouette, trending strongly since 2022</li>
            <li><strong>Sunset:</strong> Chain strap satchel, versatile carry, good value retention</li>
            <li><strong>College:</strong> Quilted tote, practical size, lower resale but great value pre-owned</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Authentication Tips</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Date code stamp format changed by era — research your specific model</li>
            <li>• Hardware should have clean, sharp engravings — not blurry or shallow</li>
            <li>• Lining is typically soft grained leather, not fabric — fabric lining is a red flag</li>
            <li>• Stitching should be tight and even; 8–10 stitches per cm on body panels</li>
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
    </div>
  )
}
