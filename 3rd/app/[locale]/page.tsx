import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getAllBrands } from '@/lib/data'
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
  const handbagBrands = allBrands.filter(b => b.categories.includes('handbags'))
  const watchBrands   = allBrands.filter(b => b.categories.includes('watches'))
  const clothingBrands = allBrands.filter(b => b.categories.includes('clothing'))

  return (
    <>
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">{t('page_title_home')}</h1>
        <p className="text-gray-600 text-lg">{t('tagline')}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/handbags`} className="hover:underline">{t('nav_handbags')}</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {handbagBrands.map(b => (
            <BrandCard key={b.slug} {...b} locale={locale} modelsLabel={t('models')} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/watches`} className="hover:underline">{t('nav_watches')}</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {watchBrands.map(b => (
            <BrandCard key={b.slug} {...b} locale={locale} modelsLabel={t('models')} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          <a href={`/${locale}/clothing`} className="hover:underline">{t('nav_clothing')}</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {clothingBrands.map(b => (
            <BrandCard key={b.slug} {...b} locale={locale} modelsLabel={t('models')} />
          ))}
        </div>
      </section>
    </>
  )
}
