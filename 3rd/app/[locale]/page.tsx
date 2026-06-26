import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getAllBrands, getAllItems, toBrandSlug } from '@/lib/data'
import { BrandCard } from '@/components/BrandCard'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return { title: t('page_title_home'), description: t('page_meta_home') }
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

  const totalItems  = allItems.length
  const totalBrands = allBrands.length

  return (
    <>
      {/* Hero */}
      <div className="mb-10 pb-10 border-b border-gray-100">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">{t('hero_h1')}</h1>
        <p className="text-gray-600 text-lg max-w-2xl">{t('hero_subtext')}</p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mt-6">
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">
            <span className="text-green-600">✓</span> {t('trust_updated')}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">
            <span className="text-green-600">✓</span> {t('trust_models', { count: totalItems })}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">
            <span className="text-green-600">✓</span> {t('trust_prices')}
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          {t('tracking_stats', { items: totalItems, brands: totalBrands })}
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/handbags`} className="hover:underline">{t('nav_handbags')}</a>
        </h2>
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
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/watches`} className="hover:underline">{t('nav_watches')}</a>
        </h2>
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
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/clothing`} className="hover:underline">{t('nav_clothing')}</a>
        </h2>
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
