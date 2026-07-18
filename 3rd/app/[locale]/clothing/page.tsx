import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getItemsByCategory } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_clothing'),
    alternates: {
      canonical: `${BASE}/${locale}/clothing`,
      languages: {
        en: `${BASE}/en/clothing`,
        th: `${BASE}/th/clothing`,
        'x-default': `${BASE}/en/clothing`,
      },
    },
  }
}

export default async function ClothingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('clothing')

  return (
    <>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        {t('page_title_clothing')}
      </h1>
      <SortableItemGrid items={items} locale={locale} />
    </>
  )
}
