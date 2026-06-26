import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemsByCategory, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_handbags'),
    alternates: {
      canonical: `${BASE}/${locale}/handbags`,
      languages: {
        en: `${BASE}/en/handbags`,
        th: `${BASE}/th/handbags`,
      },
    },
  }
}

export default async function HandbagsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('handbags')

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{t('page_title_handbags')}</h1>
      <p className="text-gray-600 mb-2">{t('category_intro_handbags')}</p>
      <p className="text-sm text-gray-400 mb-8">{t('tracking_x_models', { count: items.length })}</p>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const [brand, model] = item.slug.split('/')
          const savingsPct = item.retail_price_thb && vg
            ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
            : null
          return (
            <Link key={item.id} href={`/${locale}/${brand}/${model}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.brand} {item.model}</span>
              <span className="flex items-center gap-2 text-sm">
                {savingsPct !== null && savingsPct > 0 && (
                  <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {t('savings_badge', { pct: savingsPct })}
                  </span>
                )}
                <span className="text-gray-500">
                  {vg ? `${formatPriceTHB(vg.min)} – ${formatPriceTHB(vg.max)}` : t('see_guide')}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
