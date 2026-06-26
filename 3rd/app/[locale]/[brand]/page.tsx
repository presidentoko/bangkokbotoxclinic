import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getItemsByBrand, getAllBrands } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

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
      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{t('home')}</Link> › {brandName}
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
        {t('page_title_brand', { brand: brandName })}
      </h1>
      <p className="text-[#6B6052] mb-10">{t('page_meta_brand', { brand: brandName, count: items.length })}</p>
      {(() => {
        const itemsWithSavings = items.filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
        if (!itemsWithSavings.length) return null
        const avgSav = Math.round(
          itemsWithSavings.reduce((sum, i) => {
            const vg = i.price_ranges.very_good!
            const avg = (vg.min + vg.max) / 2
            return sum + ((i.retail_price_thb - avg) / i.retail_price_thb * 100)
          }, 0) / itemsWithSavings.length
        )
        if (avgSav <= 0) return null
        return (
          <div className="flex items-center gap-3 mb-6 p-4 bg-[#F5F0E8] border-l-2 border-[#B8954A]">
            <span className="text-2xl font-bold text-[#4A7A35]">{avgSav}%</span>
            <span className="text-sm text-[#6B6052]">
              {locale === 'th'
                ? `ประหยัดเฉลี่ยเทียบราคาใหม่ สำหรับทุกรุ่น ${brandName}`
                : `average savings vs retail across all ${brandName} models`}
            </span>
          </div>
        )
      })()}
      <SortableItemGrid items={items} locale={locale} />
    </>
  )
}
