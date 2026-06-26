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
import { ConditionGuide } from '@/components/ConditionGuide'
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

      {/* Price Hero */}
      {(() => {
        const vg = item.price_ranges.very_good
        const savingsPct = vg && item.retail_price_thb > 0
          ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
          : null
        const vestiaire = `https://www.vestiairecollective.com/search/?q=${encodeURIComponent(item.brand + ' ' + item.model)}`
        const ebay = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.brand + ' ' + item.model)}`
        const priceLabel = locale === 'th' ? 'ราคาตลาดปัจจุบัน — สภาพดีมาก' : 'Current Market Price — Very Good Condition'
        const shopLabel = locale === 'th' ? 'ช้อปบน Vestiaire →' : 'Shop on Vestiaire →'
        const searchLabel = locale === 'th' ? 'ค้นหาบน eBay' : 'Search eBay'
        const savingsLabel = (pct: number) => locale === 'th' ? `ประหยัด ~${pct}% จากราคาใหม่` : `~${pct}% below retail`

        return (
          <div className="my-8 p-6 bg-[#1A1A1A] text-white">
            <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
              {priceLabel}
            </p>
            {vg ? (
              <>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-light">{formatPriceTHB(vg.min)}</span>
                  <span className="text-xl text-[#9C8B7A]">– {formatPriceTHB(vg.max)}</span>
                </div>
                {savingsPct !== null && savingsPct > 0 && (
                  <p className="text-[#6EBF8B] text-sm mb-1">
                    {savingsLabel(savingsPct)} ({formatPriceTHB(item.retail_price_thb)} {locale === 'th' ? 'ราคาใหม่' : 'new'})
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
                    {savingsPct >= 40 ? (locale === 'th' ? '🔥 ดีลสุดคุ้ม' : '🔥 Exceptional Deal') :
                     savingsPct >= 20 ? (locale === 'th' ? '✓ ราคาดี' : '✓ Good Value') :
                     savingsPct >= 5  ? (locale === 'th' ? '◎ ราคาตลาด' : '◎ Fair Market Price') :
                                       (locale === 'th' ? '↑ ตลาดแข็ง' : '↑ Premium Demand')}
                  </div>
                )}
                {savingsPct !== null && (
                  <p className="text-xs text-[#9C8B7A] mt-2 italic">
                    {locale === 'th'
                      ? (savingsPct >= 40 ? '↓ ซัพพลายสูง — เวลาเหมาะสมในการซื้อ'
                        : savingsPct >= 20 ? '→ ตลาดคงที่ — ราคาสมเหตุสมผล'
                        : savingsPct >= 5  ? '↑ ดีมานด์สูง — ตรวจสภาพสินค้าให้ดี'
                        : '↑ ดีมานด์สูงมาก — ของหายาก ราคาสูง')
                      : (savingsPct >= 40 ? '↓ High supply — favorable time to buy'
                        : savingsPct >= 20 ? '→ Stable market — fair listings available'
                        : savingsPct >= 5  ? '↑ Strong demand — verify condition carefully'
                        : '↑ High demand — limited supply, prices elevated')}
                  </p>
                )}
                {/* Savings bar */}
                {savingsPct !== null && savingsPct > 0 && savingsPct < 100 && (
                  <div className="mt-4 mb-6">
                    <div className="flex justify-between text-xs text-[#6B6052] mb-1">
                      <span>{locale === 'th' ? 'ราคามือสองเฉลี่ย' : 'Pre-owned avg'}</span>
                      <span>{locale === 'th' ? 'ราคาปกติ' : 'Retail'}</span>
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
                    {shopLabel}
                  </a>
                  <a
                    href={ebay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[#444] text-[#9C8B7A] text-sm tracking-wide hover:border-[#B8954A] hover:text-[#B8954A] transition-colors"
                  >
                    {searchLabel}
                  </a>
                </div>
              </>
            ) : (
              <p className="text-[#9C8B7A]">{locale === 'th' ? 'ยังไม่มีข้อมูลราคาสำหรับรุ่นนี้' : 'Price data not available for this model yet.'}</p>
            )}
          </div>
        )
      })()}

      <div className="my-4 flex items-center justify-between p-4 bg-[#F5F0E8] border border-[#E8E2D9]">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">
            {locale === 'th' ? 'ต้องการแจ้งเตือนราคา?' : 'Want price alerts?'}
          </p>
          <p className="text-xs text-[#6B6052] mt-0.5">
            {locale === 'th' ? 'ติดตามอัปเดตราคาทุกสัปดาห์' : 'Follow us for weekly price updates'}
          </p>
        </div>
        <a
          href="https://twitter.com/intent/follow?screen_name=chicpreowned"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-4 px-4 py-2 bg-[#1A1A1A] text-white text-xs tracking-wide hover:bg-[#333] transition-colors"
        >
          {locale === 'th' ? 'ติดตาม' : 'Follow Updates'}
        </a>
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
      <ConditionGuide locale={locale} />

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
