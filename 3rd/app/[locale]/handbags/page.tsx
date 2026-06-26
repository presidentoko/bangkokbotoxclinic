import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemsByCategory, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return { title: t('page_title_handbags') }
}

export default async function HandbagsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('handbags')

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">{t('page_title_handbags')}</h1>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const [brand, model] = item.slug.split('/')
          return (
            <Link key={item.id} href={`/${locale}/${brand}/${model}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.brand} {item.model}</span>
              <span className="text-sm text-gray-500">
                {vg ? `${formatPriceTHB(vg.min)} – ${formatPriceTHB(vg.max)}` : t('see_guide')}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
