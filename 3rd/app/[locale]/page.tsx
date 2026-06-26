import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getAllBrands, getAllItems, toBrandSlug } from '@/lib/data'
import { BrandCard } from '@/components/BrandCard'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const otherLocale = locale === 'en' ? 'th' : 'en'
  return {
    title: t('page_title_home'),
    description: t('page_meta_home'),
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: {
        [locale]: `${BASE}/${locale}`,
        [otherLocale]: `${BASE}/${otherLocale}`,
      },
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const allBrands = getAllBrands()
  const allItems = getAllItems()

  // Compute per-brand avg savings % from retail using very_good midpoint
  const brandSavingsMap = new Map<string, number>()
  for (const brand of allBrands) {
    const brandItems = allItems.filter(i => toBrandSlug(i.brand) === brand.slug)
    const pcts: number[] = []
    for (const item of brandItems) {
      if (!item.retail_price_thb) continue
      const range = item.price_ranges.very_good ?? item.price_ranges.excellent ?? item.price_ranges.good
      if (!range) continue
      const mid = (range.min + range.max) / 2
      const pct = ((item.retail_price_thb - mid) / item.retail_price_thb) * 100
      pcts.push(pct)
    }
    if (pcts.length) {
      brandSavingsMap.set(brand.slug, Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length))
    }
  }

  const handbagBrands  = allBrands.filter(b => b.categories.includes('handbags'))
  const watchBrands    = allBrands.filter(b => b.categories.includes('watches'))
  const clothingBrands = allBrands.filter(b => b.categories.includes('clothing'))

  const totalItems = allItems.length

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'th' ? 'ChicPreowned — ราคาของแบรนด์เนมมือสองในไทย' : 'ChicPreowned — Pre-Owned Luxury Price Guide Thailand',
    url: `${BASE}/${locale}`,
    description: locale === 'th'
      ? 'เช็คราคาของแบรนด์เนม Chanel, Louis Vuitton, Rolex มือสองในไทย อัปเดตทุกสัปดาห์'
      : 'Real pre-owned luxury prices in Thailand — Chanel, LV, Rolex and more. Updated weekly.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE}/${locale}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero */}
      <div className="mb-16 pt-4">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-4">
          {locale === 'th' ? 'อัปเดตราคาทุกสัปดาห์' : 'Weekly Updated Price Guide'}
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-[#1A1A1A] leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {t('hero_h1')}
        </h1>
        <p className="text-[#6B6052] text-lg max-w-xl leading-relaxed">
          {t('hero_subtext')}
        </p>
        <div className="flex flex-wrap gap-6 mt-8 text-sm text-[#9C8B7A]">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />{t('trust_updated')}</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />{t('trust_models', { count: totalItems })}</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />{t('trust_prices')}</span>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">{t('nav_handbags')}</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {handbagBrands.map(b => {
            const pct = brandSavingsMap.get(b.slug)
            return (
              <BrandCard
                key={b.slug}
                {...b}
                locale={locale}
                modelsLabel={t('models')}
                savingsBadge={pct !== undefined && pct > 0 ? t('avg_savings', { pct }) : undefined}
              />
            )
          })}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">{t('nav_watches')}</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {watchBrands.map(b => {
            const pct = brandSavingsMap.get(b.slug)
            return (
              <BrandCard
                key={b.slug}
                {...b}
                locale={locale}
                modelsLabel={t('models')}
                savingsBadge={pct !== undefined && pct > 0 ? t('avg_savings', { pct }) : undefined}
              />
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">{t('nav_clothing')}</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {clothingBrands.map(b => {
            const pct = brandSavingsMap.get(b.slug)
            return (
              <BrandCard
                key={b.slug}
                {...b}
                locale={locale}
                modelsLabel={t('models')}
                savingsBadge={pct !== undefined && pct > 0 ? t('avg_savings', { pct }) : undefined}
              />
            )
          })}
        </div>
      </section>
    </>
  )
}
