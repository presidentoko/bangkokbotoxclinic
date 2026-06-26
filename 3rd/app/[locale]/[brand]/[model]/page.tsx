import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemBySlug, getAllItems, formatPriceTHB, getPriceVsRetail, Item } from '@/lib/data'
import { PriceTable } from '@/components/PriceTable'
import { AffiliateCTA } from '@/components/AffiliateCTA'

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
  return {
    title: t('page_title_model', { brand: item.brand, model: item.model, year: YEAR }),
    description: t('page_meta_model', {
      brand: item.brand,
      model: item.model,
      min: vg ? formatPriceTHB(vg.min) : '฿–',
      max: vg ? formatPriceTHB(vg.max) : '฿–',
    }),
    alternates: {
      canonical: `${BASE}/${locale}/${item.slug}`,
      languages: {
        [locale]: `${BASE}/${locale}/${item.slug}`,
        [otherLocale]: `${BASE}/${otherLocale}/${item.slug}`,
      },
    },
  }
}

function getFAQs(item: Item, t: (key: string, values?: Record<string, string | number>) => string) {
  const vg = item.price_ranges.very_good
  const savingsPct = vg
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
        <Link href={`/${locale}`}>{tCommon('home')}</Link> ›{' '}
        <Link href={`/${locale}/${brand}`}>{item.brand}</Link> ›{' '}
        {item.model}
      </p>

      <h1 className="text-3xl font-bold mb-2">
        {tCommon('page_title_model', { brand: item.brand, model: item.model, year: YEAR })}
      </h1>
      <p className="text-gray-600 mb-6">
        {tCommon('retail_label')}: {formatPriceTHB(item.retail_price_thb)}
      </p>

      {/* AdSense slot — top */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense top]</div>

      <PriceTable item={item} labels={{
        condition: tCommon('condition_label'),
        priceRange: tCommon('price_range_label'),
        excellent: tCommon('condition_excellent'),
        very_good: tCommon('condition_very_good'),
        good: tCommon('condition_good'),
        vsRetail: tCommon('vs_retail', { retail: formatPriceTHB(item.retail_price_thb) }),
        lastUpdated: tCommon('last_updated', { date: item.last_updated }),
      }} />

      <AffiliateCTA item={item} ctaLabel={tCommon('cta_carousell')} />

      {/* AdSense slot — middle */}
      <div className="my-6 bg-gray-50 rounded p-4 text-center text-xs text-gray-300">[AdSense middle]</div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">FAQ</h2>
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
