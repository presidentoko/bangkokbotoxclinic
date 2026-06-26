import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getItemsByCategory, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_watches'),
    alternates: {
      canonical: `${BASE}/${locale}/watches`,
      languages: {
        en: `${BASE}/en/watches`,
        th: `${BASE}/th/watches`,
      },
    },
  }
}

export default async function WatchesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const items = getItemsByCategory('watches')

  return (
    <>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
        {t('page_title_watches')}
      </h1>
      <p className="text-[#6B6052] mb-2">{t('category_intro_watches')}</p>
      <p className="text-sm text-[#9C8B7A] mb-10">{t('tracking_x_models', { count: items.length })}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const savingsPct = vg && item.retail_price_thb > 0
            ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
            : null
          return (
            <a key={item.id} href={`/${locale}/${item.slug}`}
              className="group relative overflow-hidden block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
            >
              <div className="h-0.5 bg-[#E8E2D9] group-hover:bg-[#B8954A] transition-colors duration-300" />
              <div className="p-6">
                <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">{item.brand}</p>
                <h3 className="font-serif text-2xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {item.model}
                </h3>
                {vg ? (
                  <div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-xl font-medium text-[#1A1A1A]">{formatPriceTHB(vg.min)}</span>
                      <span className="text-sm text-[#9C8B7A]">– {formatPriceTHB(vg.max)}</span>
                    </div>
                    {savingsPct && savingsPct > 0 && (
                      <p className="text-xs text-[#4A7A35]">
                        {locale === 'th' ? `ประหยัด ${savingsPct}%` : `Save up to ${savingsPct}%`}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#9C8B7A]">Price on request</p>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </>
  )
}
