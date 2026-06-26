import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemBySlug, getAllItems, formatPrice, Item } from '@/lib/data'
import { PriceTable } from '@/components/PriceTable'
import { AffiliateCTA } from '@/components/AffiliateCTA'

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
  return {
    title: `Used ${item.brand} ${item.model} Price Guide (2026)`,
    description: `How much does a second hand ${item.brand} ${item.model} cost?${priceHint} Updated ${item.last_updated}.`,
  }
}

function getFAQs(item: Item) {
  const name = `${item.brand} ${item.model}`
  const vg = item.price_ranges.very_good
  const savingsPct = vg
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p className="text-sm text-gray-400 mb-2">
        <Link href="/">Home</Link> ›{' '}
        <Link href={`/${brand}`}>{item.brand}</Link> ›{' '}
        {item.model}
      </p>

      <h1 className="text-3xl font-bold mb-2">
        Used {item.brand} {item.model} Price Guide (2026)
      </h1>
      <p className="text-gray-600 mb-6">
        Current pre-owned market prices for the {item.model} by condition. Retail: {formatPrice(item.retail_price_usd)}.
      </p>

      {/* AdSense slot — top */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense top]</div>

      <PriceTable item={item} />

      <AffiliateCTA item={item} />

      {/* AdSense slot — middle */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense middle]</div>

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
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense bottom]</div>
    </>
  )
}
