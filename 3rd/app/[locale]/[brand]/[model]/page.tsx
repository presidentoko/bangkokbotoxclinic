import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  getItemBySlug,
  getAllItems,
  formatPriceTHB,
  getPriceVsRetail,
  getItemsByBrand,
  Item,
  PriceRange,
} from '@/lib/data'
import { PriceTable } from '@/components/PriceTable'
import { AffiliateCTA } from '@/components/AffiliateCTA'
import { ShareButton } from '@/components/ShareButton'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import { TrackPageView } from '@/components/TrackPageView'

const BASE = 'https://www.chicpreowned.com'
const YEAR = 2026

interface Props { params: Promise<{ locale: string; brand: string; model: string }> }

export function generateStaticParams() {
  const locales = ['en', 'th']
  return getAllItems().flatMap(item => {
    const [brand, model] = item.slug.split('/')
    return locales.map(locale => ({ locale, brand, model }))
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) return {}
  const t = await getTranslations({ locale, namespace: 'common' })
  const vg = item.price_ranges.very_good
  const otherLocale = locale === 'en' ? 'th' : 'en'
  const title = t('page_title_model', { brand: item.brand, model: item.model, year: YEAR })
  const description = t('page_meta_model', {
    brand: item.brand,
    model: item.model,
    min: vg ? formatPriceTHB(vg.min) : '฿–',
    max: vg ? formatPriceTHB(vg.max) : '฿–',
  })
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/${item.slug}`,
      languages: {
        [locale]: `${BASE}/${locale}/${item.slug}`,
        [otherLocale]: `${BASE}/${otherLocale}/${item.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE}/${locale}/${item.slug}`,
    },
  }
}

function getFAQs(item: Item, t: (key: string, values?: Record<string, string | number>) => string) {
  const vg = item.price_ranges.very_good
  const savingsPct = vg && item.retail_price_thb > 0
    ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
    : null
  const pct = savingsPct && savingsPct > 0 ? `${savingsPct}%` : '20%'

  if (item.category === 'handbags') {
    return [
      {
        q: t('handbag_worth_it_q', { model: item.model }),
        a: savingsPct && savingsPct > 0
          ? t('handbag_worth_it_a_savings', { brand: item.brand, model: item.model, pct })
          : t('handbag_worth_it_a_premium', { model: item.model }),
      },
      { q: t('handbag_condition_q'), a: t('handbag_condition_a') },
      {
        q: t('handbag_where_q', { brand: item.brand }),
        a: t('handbag_where_a'),
      },
    ]
  }
  if (item.category === 'watches') {
    const isAboveRetail = vg && (vg.min + vg.max) / 2 > item.retail_price_thb
    return [
      {
        q: t('watch_value_q', { model: item.model }),
        a: isAboveRetail
          ? t('watch_value_a_premium', { model: item.model })
          : t('watch_value_a_normal', { brand: item.brand }),
      },
      { q: t('watch_check_q', { model: item.model }), a: t('watch_check_a') },
      { q: t('watch_risk_q', { model: item.model }), a: t('watch_risk_a') },
    ]
  }
  return [
    {
      q: t('clothing_worth_it_q', { model: item.model }),
      a: t('clothing_worth_it_a', { brand: item.brand, model: item.model, pct }),
    },
    {
      q: t('clothing_auth_q', { brand: item.brand }),
      a: t('clothing_auth_a'),
    },
    {
      q: t('clothing_where_q', { brand: item.brand }),
      a: t('clothing_where_a'),
    },
  ]
}

export default async function ModelPage({ params }: Props) {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) notFound()

  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tFaq = await getTranslations({ locale, namespace: 'faq' })

  const faqs = getFAQs(item, tFaq)

  // FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  // Product + AggregateOffer schema
  const allPrices = Object.values(item.price_ranges).filter(Boolean) as PriceRange[]
  const lowPrice = allPrices.length ? Math.min(...allPrices.map(r => r.min)) : 0
  const highPrice = allPrices.length ? Math.max(...allPrices.map(r => r.max)) : 0

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Used ${item.brand} ${item.model}`,
    brand: { '@type': 'Brand', name: item.brand },
    description: `Pre-owned ${item.brand} ${item.model} — second-hand prices in Thailand`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'THB',
      lowPrice,
      highPrice,
      offerCount: item.price_samples.length,
      availability: 'https://schema.org/InStock',
      url: `${BASE}/${locale}/${item.slug}`,
    },
  }

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: item.brand, item: `${BASE}/${locale}/${brand}` },
      { '@type': 'ListItem', position: 3, name: item.model, item: `${BASE}/${locale}/${item.slug}` },
    ],
  }

  // Related items from same brand
  const relatedItems = getItemsByBrand(brand).filter(i => i.id !== item.id)

  // Share data
  const pageUrl = `${BASE}/${locale}/${item.slug}`
  const vg = item.price_ranges.very_good
  const savingsPct = vg && item.retail_price_thb > 0
    ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
    : null
  const avgPrice = vg ? Math.round((vg.min + vg.max) / 2) : null
  const shareTitle = `Used ${item.brand} ${item.model} — Price in Thailand`
  const shareText = vg
    ? `Pre-owned ${item.brand} ${item.model}: ${formatPriceTHB(vg.min)}–${formatPriceTHB(vg.max)} on Carousell TH`
    : `Pre-owned ${item.brand} ${item.model} prices in Thailand`

  return (
    <>
      <TrackPageView
        slug={item.slug}
        brand={item.brand}
        model={item.model}
        priceText={vg ? `${formatPriceTHB(vg.min)}–${formatPriceTHB(vg.max)}` : '–'}
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
        <Link href={`/${locale}`}>{tCommon('home')}</Link> ›{' '}
        <Link href={`/${locale}/${brand}`}>{item.brand}</Link> ›{' '}
        {item.model}
      </p>

      <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        {tCommon('page_title_model', { brand: item.brand, model: item.model, year: YEAR })}
        <span className="block text-xl text-[#9C8B7A] mt-1 font-sans font-normal" style={{ fontFamily: 'var(--font-inter, sans-serif)' }}>
          {locale === 'th' ? 'ราคาตลาดมือสอง' : 'Pre-Owned Market Price'}
        </span>
      </h1>

      <ShareButton title={shareTitle} text={shareText} url={pageUrl} />

      <div className="flex flex-wrap gap-3 my-4">
        {savingsPct && savingsPct > 0 && (
          <div className="bg-[#F0F5EC] border border-[#C5D9B7] rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="text-[#4A7A35] font-bold text-xl">~{savingsPct}%</span>
            <span className="text-[#4A7A35] text-sm">{locale === 'th' ? 'ต่ำกว่าราคาปกติ' : 'below retail'}</span>
          </div>
        )}
        {savingsPct && savingsPct < 0 && (
          <div className="bg-[#FDF5EC] border border-[#E8C99A] rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="text-[#8C5A1A] font-bold text-xl">+{Math.abs(savingsPct)}%</span>
            <span className="text-[#8C5A1A] text-sm">{locale === 'th' ? 'สูงกว่าราคาปกติ' : 'above retail'}</span>
          </div>
        )}
        {avgPrice && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg px-4 py-2.5">
            <span className="text-[#9C8B7A] text-xs">{locale === 'th' ? 'ราคาตลาดเฉลี่ย' : 'Avg market price'}</span>
            <p className="font-bold text-[#1A1A1A]">{formatPriceTHB(avgPrice)}</p>
          </div>
        )}
        <div className="bg-white border border-[#E8E2D9] rounded-lg px-4 py-2.5">
          <span className="text-[#9C8B7A] text-xs">{locale === 'th' ? 'ราคาปกติ' : 'Retail'}</span>
          <p className="font-bold text-[#1A1A1A]">{formatPriceTHB(item.retail_price_thb)}</p>
        </div>
      </div>

      {/* AdSense slot — top */}
      <div className="my-6" />

      <PriceTable
        item={item}
        sampleCount={item.price_samples.length}
        labels={{
          condition: tCommon('condition_label'),
          priceRange: tCommon('price_range_label'),
          excellent: tCommon('condition_excellent'),
          very_good: tCommon('condition_very_good'),
          good: tCommon('condition_good'),
          vsRetail: tCommon('vs_retail', { retail: formatPriceTHB(item.retail_price_thb) }),
          lastUpdated: tCommon('last_updated', { date: item.last_updated }),
        }}
      />

      <AffiliateCTA item={item} ctaLabel={tCommon('cta_carousell')} />

      {/* AdSense slot — middle */}
      <div className="my-6" />

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1A1A1A]">FAQ</h2>
        <dl className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i}>
              <dt className="font-medium text-[#1A1A1A]">{faq.q}</dt>
              <dd className="mt-1 text-[#6B6052]">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Related items from same brand */}
      {relatedItems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            {locale === 'th' ? `จาก ${item.brand}` : `More from ${item.brand}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedItems.map(ri => {
              const rvg = ri.price_ranges.very_good
              return (
                <a
                  key={ri.id}
                  href={`/${locale}/${ri.slug}`}
                  className="group block p-6 bg-white border border-[#E8E2D9] rounded-sm hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
                >
                  <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-2">{ri.brand}</p>
                  <h3 className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {ri.model}
                  </h3>
                  {rvg && (
                    <p className="text-sm text-[#6B6052]">
                      {formatPriceTHB(rvg.min)} – {formatPriceTHB(rvg.max)}
                    </p>
                  )}
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* AdSense slot — bottom */}
      <div className="my-6" />

      <RecentlyViewed currentSlug={item.slug} locale={locale} />

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2D9] p-3 flex gap-2 sm:hidden z-50">
        <a
          href={item.affiliate_links.carousell}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 bg-[#1A1A1A] text-white text-sm font-medium rounded py-2.5 text-center"
        >
          {tCommon('cta_carousell')}
        </a>
      </div>
    </>
  )
}
