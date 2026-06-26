import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemBySlug, getItemsByBrand, getAllItems, formatPrice, Item } from '@/lib/data'
import { PriceTable } from '@/components/PriceTable'
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

  const faqs = getFAQs(item)

  const vg = item.price_ranges.very_good
  const savingsPct = vg && item.retail_price_usd > 0
    ? Math.round(((item.retail_price_usd - (vg.min + vg.max) / 2) / item.retail_price_usd) * 100)
    : null
  const avgPrice = vg ? Math.round((vg.min + vg.max) / 2) : null
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

      <p className="text-sm text-gray-400 mb-2">
        <Link href="/">Home</Link> ›{' '}
        <Link href={`/${brand}`}>{item.brand}</Link> ›{' '}
        {item.model}
      </p>

      <h1 className="text-3xl font-bold mb-2">
        Used {item.brand} {item.model} Price Guide (2026)
      </h1>

      <div className="mb-4">
        <ShareButton
          title={`Used ${item.brand} ${item.model} Price Guide (2026)`}
          text={metaDescription}
          url={pageUrl}
        />
      </div>

      <div className="flex flex-wrap gap-3 my-4">
        {savingsPct && savingsPct > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="text-green-700 font-bold text-xl">~{savingsPct}%</span>
            <span className="text-green-600 text-sm">below retail</span>
          </div>
        )}
        {savingsPct && savingsPct < 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="text-orange-700 font-bold text-xl">+{Math.abs(savingsPct)}%</span>
            <span className="text-orange-600 text-sm">above retail</span>
          </div>
        )}
        {avgPrice && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
            <span className="text-gray-500 text-xs">Avg market price</span>
            <p className="font-bold text-gray-900">{formatPrice(avgPrice)}</p>
          </div>
        )}
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
          <span className="text-gray-500 text-xs">Retail</span>
          <p className="font-bold text-gray-900">{formatPrice(item.retail_price_usd)}</p>
        </div>
      </div>

      {/* AdSense slot — top */}
      <div className="my-6" />

      <PriceTable item={item} />

      <AffiliateCTA item={item} />

      {/* AdSense slot — middle */}
      <div className="my-6" />

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i}>
              <dt className="font-medium text-gray-900">{faq.q}</dt>
              <dd className="mt-1 text-gray-600">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* AdSense slot — bottom */}
      <div className="my-6" />

      {relatedItems.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">More from {item.brand}</h2>
          <div className="grid grid-cols-2 gap-4">
            {relatedItems.map(related => {
              const relVg = related.price_ranges.very_good
              return (
                <Link
                  key={related.id}
                  href={`/${related.slug}`}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors"
                >
                  <p className="font-medium text-sm">{related.model}</p>
                  {relVg && (
                    <p className="text-xs text-gray-500 mt-1">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 sm:hidden z-50">
        <a
          href={item.affiliate_links.vestiaire}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 bg-black text-white text-sm font-medium rounded py-2.5 text-center"
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
