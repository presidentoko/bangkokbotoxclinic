import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemBySlug, getItemsByBrand, getAllItems, formatPrice, Item } from '@/lib/data'
import { PriceTable } from '@/components/PriceTable'
import { ConditionGuide } from '@/components/ConditionGuide'
import { AffiliateCTA } from '@/components/AffiliateCTA'
import { ShareButton } from '@/components/ShareButton'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import { TrackPageView } from '@/components/TrackPageView'

const BASE = 'https://www.secondluxuryitems.com'

interface Props { params: Promise<{ brand: string; model: string }> }

export async function generateStaticParams() {
  return getAllItems().map(item => {
    const [brand, model] = item.slug.split('/')
    return { brand, model }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) return {}
  const vg = item.price_ranges.very_good
  const priceHint = vg ? ` Current prices: ${formatPrice(vg.min)}–${formatPrice(vg.max)}.` : ''
  const description = `How much does a second hand ${item.brand} ${item.model} cost?${priceHint} Updated ${item.last_updated}.`
  return {
    title: `Used ${item.brand} ${item.model} Price Guide (2026)`,
    description,
    alternates: { canonical: `${BASE}/${item.slug}` },
    openGraph: {
      title: `Used ${item.brand} ${item.model} Price (2026)`,
      description,
      type: 'website',
      url: `${BASE}/${item.slug}`,
    },
  }
}

function getFAQs(item: Item) {
  const name = `${item.brand} ${item.model}`
  const vg = item.price_ranges.very_good
  const savingsPct = vg && item.retail_price_usd > 0
    ? Math.round(((item.retail_price_usd - (vg.min + vg.max) / 2) / item.retail_price_usd) * 100)
    : null

  if (item.category === 'handbags') {
    return [
      {
        q: `Is buying a used ${name} worth it?`,
        a: savingsPct && savingsPct > 0
          ? `Yes — a pre-owned ${item.model} typically costs around ${savingsPct}% less than retail while maintaining strong resale value. ${item.brand} bags are well known for holding their value.`
          : `The ${item.model} often sells above retail on the secondary market due to high demand. Buying pre-owned can offer immediate availability without waitlists.`,
      },
      {
        q: 'Which condition should I buy?',
        a: '"Very Good" is the sweet spot — significant savings over "Excellent" while still looking great. Only go "Good" if you plan heavy everyday use.',
      },
      {
        q: `How do I authenticate a pre-owned ${item.brand} bag?`,
        a: `Buy from reputable platforms like Vestiaire Collective or The RealReal that authenticate every item. Check serial numbers, hardware quality, and stitching consistency. For high-value pieces, consider a third-party authenticator.`,
      },
    ]
  }
  return [
    {
      q: `Does a pre-owned ${name} hold its value?`,
      a: savingsPct && savingsPct < 0
        ? `The ${item.model} consistently sells above retail on the secondary market. It is one of the strongest value-holding timepieces available.`
        : `${item.brand} watches are among the strongest value-holders in the pre-owned market, making the ${item.model} a sound purchase.`,
    },
    {
      q: `What should I check when buying a used ${item.model}?`,
      a: 'Verify the serial number, look for a full set (box and papers), inspect the case and bracelet for wear, and confirm service history. Always buy from authenticated platforms.',
    },
    {
      q: `Is buying a pre-owned ${item.model} risky?`,
      a: 'Not when buying from reputable platforms. Vestiaire Collective and The RealReal authenticate all timepieces before listing. Avoid private sales without independent expert verification.',
    },
  ]
}

export default async function ModelPage({ params }: Props) {
  const { brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) notFound()

  const YEAR = new Date().getFullYear()
  const faqs = getFAQs(item)

  const vg = item.price_ranges.very_good
  const priceHint = vg ? ` Current prices: ${formatPrice(vg.min)}–${formatPrice(vg.max)}.` : ''
  const metaDescription = `How much does a second hand ${item.brand} ${item.model} cost?${priceHint} Updated ${item.last_updated}.`
  const pageUrl = `${BASE}/${item.slug}`

  // Compute price bounds across all conditions for Product schema
  const allRanges = Object.values(item.price_ranges).filter((r): r is { min: number; max: number } => !!r)
  const lowPrice = allRanges.length > 0 ? Math.min(...allRanges.map(r => r.min)) : 0
  const highPrice = allRanges.length > 0 ? Math.max(...allRanges.map(r => r.max)) : 0

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Used ${item.brand} ${item.model}`,
    brand: { '@type': 'Brand', name: item.brand },
    category: item.category,
    description: `Pre-owned ${item.brand} ${item.model} — current second-hand market prices`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice,
      highPrice,
      offerCount: item.price_samples.length,
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: item.brand, item: `${BASE}/${brand}` },
      { '@type': 'ListItem', position: 3, name: item.model, item: pageUrl },
    ],
  }

  // Related items from same brand, excluding current model
  const relatedItems = getItemsByBrand(brand).filter(i => i.slug !== item.slug)

  return (
    <>
      <TrackPageView
        slug={item.slug}
        brand={item.brand}
        model={item.model}
        priceText={vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : 'See prices'}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link> ›{' '}
        <Link href={`/${brand}`} className="hover:text-[#1A1A1A] transition-colors">{item.brand}</Link> ›{' '}
        {item.model}
      </p>

      <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Used {item.brand} {item.model}
        <span className="block text-2xl text-[#9C8B7A] mt-1 font-normal">Price Guide {YEAR}</span>
      </h1>

      <div className="mb-4">
        <ShareButton
          title={`Used ${item.brand} ${item.model} Price Guide (2026)`}
          text={metaDescription}
          url={pageUrl}
        />
      </div>

      {/* Price Hero */}
      {(() => {
        const vg = item.price_ranges.very_good
        const savingsPct = vg && item.retail_price_usd > 0
          ? Math.round(((item.retail_price_usd - (vg.min + vg.max) / 2) / item.retail_price_usd) * 100)
          : null
        const vestiaire = `https://www.vestiairecollective.com/search/?q=${encodeURIComponent(item.brand + ' ' + item.model)}`
        const ebay = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.brand + ' ' + item.model)}`

        return (
          <div className="my-8 p-6 bg-[#1A1A1A] text-white">
            <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
              Current Market Price — Very Good Condition
            </p>
            {vg ? (
              <>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-light">{formatPrice(vg.min)}</span>
                  <span className="text-xl text-[#9C8B7A]">– {formatPrice(vg.max)}</span>
                </div>
                {savingsPct !== null && savingsPct > 0 && (
                  <p className="text-[#6EBF8B] text-sm mb-1">
                    ~{savingsPct}% below retail ({formatPrice(item.retail_price_usd)} new)
                  </p>
                )}
                {savingsPct !== null && (
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={
                      savingsPct >= 40 ? { background: '#1A2E1A', color: '#6EBF8B', border: '1px solid #2D4A2D' } :
                      savingsPct >= 20 ? { background: '#1A2412', color: '#9CB87A', border: '1px solid #2A3A1A' } :
                      savingsPct >= 5  ? { background: '#2A2218', color: '#C8A97E', border: '1px solid #3A3020' } :
                                        { background: '#2A1818', color: '#C88878', border: '1px solid #3A2020' }
                    }
                  >
                    {savingsPct >= 40 ? '🔥 Exceptional Deal' :
                     savingsPct >= 20 ? '✓ Good Value' :
                     savingsPct >= 5  ? '◎ Fair Market Price' :
                                       '↑ Premium Demand'}
                  </div>
                )}
                {savingsPct !== null && (
                  <p className="text-xs text-[#9C8B7A] mt-2 italic">
                    {savingsPct >= 40
                      ? '↓ High supply — favorable time to buy'
                      : savingsPct >= 20
                      ? '→ Stable market — fair listings available'
                      : savingsPct >= 5
                      ? '↑ Strong demand — verify condition carefully'
                      : '↑ High demand — limited supply, prices elevated'}
                  </p>
                )}
                {/* Savings bar */}
                {savingsPct !== null && savingsPct > 0 && savingsPct < 100 && (
                  <div className="mt-4 mb-6">
                    <div className="flex justify-between text-xs text-[#6B6052] mb-1">
                      <span>Pre-owned avg</span>
                      <span>Retail</span>
                    </div>
                    <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B8954A] rounded-full"
                        style={{ width: `${Math.max(5, 100 - savingsPct)}%` }}
                      />
                    </div>
                  </div>
                )}
                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={vestiaire}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8954A] text-white text-sm tracking-wide hover:bg-[#A07B38] transition-colors"
                  >
                    Shop on Vestiaire →
                  </a>
                  <a
                    href={ebay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[#444] text-[#9C8B7A] text-sm tracking-wide hover:border-[#B8954A] hover:text-[#B8954A] transition-colors"
                  >
                    Search eBay
                  </a>
                </div>
              </>
            ) : (
              <p className="text-[#9C8B7A]">Price data not available for this model yet.</p>
            )}
          </div>
        )
      })()}

      {/* Price Alert CTA */}
      <div className="my-4 flex items-center justify-between p-4 bg-[#F5F0E8] border border-[#E8E2D9]">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">Want price alerts?</p>
          <p className="text-xs text-[#6B6052] mt-0.5">Follow us for weekly price updates</p>
        </div>
        <a
          href={`https://twitter.com/intent/follow?screen_name=secondluxury`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-4 px-4 py-2 bg-[#1A1A1A] text-white text-xs tracking-wide hover:bg-[#333] transition-colors"
        >
          Follow Updates
        </a>
      </div>

      {/* AdSense slot — top */}
      <div className="my-6" />

      <PriceTable item={item} />
      <ConditionGuide />

      <AffiliateCTA item={item} />

      {/* AdSense slot — middle */}
      <div className="my-6" />

      <section className="mt-8">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i}>
              <dt className="font-medium text-[#1A1A1A]">{faq.q}</dt>
              <dd className="mt-1 text-[#6B6052]">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* AdSense slot — bottom */}
      <div className="my-6" />

      {relatedItems.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>More from {item.brand}</h2>
          <div className="grid grid-cols-2 gap-4">
            {relatedItems.map(related => {
              const relVg = related.price_ranges.very_good
              return (
                <Link
                  key={related.id}
                  href={`/${related.slug}`}
                  className="group block p-5 border border-[#E8E2D9] rounded-sm bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
                >
                  <p className="font-serif text-base text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>{related.model}</p>
                  {relVg && (
                    <p className="text-xs text-[#9C8B7A] mt-1">
                      {formatPrice(relVg.min)} – {formatPrice(relVg.max)}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <RecentlyViewed currentSlug={item.slug} />

      {/* Mobile sticky share + buy bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2D9] p-3 flex gap-2 sm:hidden z-50">
        <a
          href={item.affiliate_links.vestiaire}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 bg-[#1A1A1A] text-white text-sm font-medium rounded py-2.5 text-center hover:bg-[#8C7355] transition-colors"
        >
          Browse Listings
        </a>
        <ShareButton
          title={`Used ${item.brand} ${item.model} Price Guide (2026)`}
          text={metaDescription}
          url={pageUrl}
        />
      </div>
    </>
  )
}
