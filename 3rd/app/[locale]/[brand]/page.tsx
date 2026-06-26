import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemsByBrand, getAllBrands, formatPriceTHB } from '@/lib/data'

const BASE = 'https://www.chicpreowned.com'

interface Props { params: Promise<{ locale: string; brand: string }> }

export function generateStaticParams() {
  const locales = ['en', 'th']
  return getAllBrands().flatMap(b => locales.map(locale => ({ locale, brand: b.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) return {}
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_brand', { brand: items[0].brand }),
    description: t('page_meta_brand', { brand: items[0].brand, count: items.length }),
    alternates: {
      canonical: `${BASE}/${locale}/${brand}`,
      languages: {
        en: `${BASE}/en/${brand}`,
        th: `${BASE}/th/${brand}`,
      },
    },
  }
}

export default async function BrandPage({ params }: Props) {
  const { locale, brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) notFound()
  const t = await getTranslations({ locale, namespace: 'common' })
  const brandName = items[0].brand

  return (
    <>
      <p className="text-sm text-gray-400 mb-2">
        <Link href={`/${locale}`}>{t('home')}</Link> › {brandName}
      </p>
      <h1 className="text-3xl font-bold mb-2">{t('page_title_brand', { brand: brandName })}</h1>
      <p className="text-gray-600 mb-8">{t('page_meta_brand', { brand: brandName, count: items.length })}</p>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const [, model] = item.slug.split('/')
          return (
            <Link key={item.id} href={`/${locale}/${brand}/${model}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.model}</span>
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
