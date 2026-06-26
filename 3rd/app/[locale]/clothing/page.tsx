import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getItemsByCategory, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_clothing'),
    alternates: {
      canonical: `${BASE}/${locale}/clothing`,
      languages: {
        en: `${BASE}/en/clothing`,
        th: `${BASE}/th/clothing`,
      },
    },
  }
}

export default async function ClothingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('clothing')

  return (
    <>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        {t('page_title_clothing')}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const savingsPct = vg && item.retail_price_thb > 0
            ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
            : null
          return (
            <a key={item.id} href={`/${locale}/${item.slug}`}
              className="group block p-6 bg-white border border-[#E8E2D9] rounded-sm hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
            >
              <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-2">{item.brand}</p>
              <h3 className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                {item.model}
              </h3>
              {vg && (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-lg font-medium text-[#1A1A1A]">{formatPriceTHB(vg.min)} – {formatPriceTHB(vg.max)}</span>
                  {savingsPct && savingsPct > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-[#F5F0E8] text-[#8C7355] rounded-full">
                      {locale === 'th' ? `ประหยัด ${savingsPct}%` : `save ${savingsPct}%`}
                    </span>
                  )}
                </div>
              )}
            </a>
          )
        })}
      </div>
    </>
  )
}
