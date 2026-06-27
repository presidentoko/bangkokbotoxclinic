import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getItemsByCategory } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_shoes'),
    alternates: {
      canonical: `${BASE}/${locale}/shoes`,
      languages: {
        en: `${BASE}/en/shoes`,
        th: `${BASE}/th/shoes`,
      },
    },
  }
}

export default async function ShoesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('shoes')

  return (
    <>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
        {t('page_title_shoes')}
      </h1>
      <p className="text-[#6B6052] mb-2">{t('category_intro_shoes')}</p>
      <p className="text-sm text-[#9C8B7A] mb-10">{t('tracking_x_models', { count: items.length })}</p>
      <SortableItemGrid items={items} locale={locale} />
    </>
  )
}
