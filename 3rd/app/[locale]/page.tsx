import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllBrands, getAllItems, toBrandSlug, formatPriceTHB, getAvgPrice } from '@/lib/data'
import { BrandCard } from '@/components/BrandCard'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  const otherLocale = locale === 'en' ? 'th' : 'en'
  return {
    title: t('page_title_home'),
    description: t('page_meta_home'),
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: {
        [locale]: `${BASE}/${locale}`,
        [otherLocale]: `${BASE}/${otherLocale}`,
      },
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
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

  const totalItems = allItems.length

  const topDeals = allItems
    .filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
    .map(i => {
      const vg = i.price_ranges.very_good!
      const avg = (vg.min + vg.max) / 2
      const pct = Math.round(((i.retail_price_thb - avg) / i.retail_price_thb) * 100)
      return { ...i, savingsPct: pct }
    })
    .filter(i => i.savingsPct > 5)
    .sort((a, b) => b.savingsPct - a.savingsPct)
    .slice(0, 6)

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ChicPreowned.com',
    url: 'https://www.chicpreowned.com',
    description: 'Pre-owned luxury price guide for Thailand market — Chanel, Louis Vuitton, Hermès in Thai Baht',
    sameAs: ['https://twitter.com/chicpreowned'],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'th' ? 'ChicPreowned — ราคาของแบรนด์เนมมือสองในไทย' : 'ChicPreowned — Pre-Owned Luxury Price Guide Thailand',
    url: `${BASE}/${locale}`,
    description: locale === 'th'
      ? 'เช็คราคาของแบรนด์เนม Chanel, Louis Vuitton, Rolex มือสองในไทย อัปเดตทุกสัปดาห์'
      : 'Real pre-owned luxury prices in Thailand — Chanel, LV, Rolex and more. Updated weekly.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE}/${locale}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Dark hero */}
      <div className="-mx-6 -mt-10 mb-20 bg-[#1A1A1A] px-6 py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#B8954A] mb-6">
            {locale === 'th' ? 'อัปเดตราคาทุกสัปดาห์' : 'Weekly Updated Price Guide'}
          </p>
          <h1 className="font-serif leading-none mb-8" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#FFFFFF' }}>
            {t('hero_h1')}
          </h1>
          <p style={{ color: '#9C8B7A' }} className="text-lg max-w-lg leading-relaxed mb-10">
            {t('hero_subtext')}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={`/${locale}/handbags`} className="inline-block px-8 py-3.5 bg-[#B8954A] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#A07B38] transition-all duration-200">
              {t('nav_handbags')}
            </a>
            <a href={`/${locale}/watches`} className="inline-block px-8 py-3.5 border border-[#6B6052] text-[#9C8B7A] text-sm tracking-[0.15em] uppercase hover:border-[#B8954A] hover:text-[#B8954A] transition-all duration-200">
              {t('nav_watches')}
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mb-12 text-sm text-[#9C8B7A]">
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />{t('trust_updated')}</span>
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />{t('trust_models', { count: totalItems })}</span>
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />{t('trust_prices')}</span>
      </div>

      <section className="mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(locale === 'th' ? [
            { stat: `${totalItems}+`, label: 'รายการที่ติดตาม' },
            { stat: `${allBrands.length}+`, label: 'แบรนด์' },
            { stat: 'ราคาจริง', label: 'ตลาดในไทย' },
            { stat: 'ทุกสัปดาห์', label: 'อัปเดตราคา' },
          ] : [
            { stat: `${totalItems}+`, label: 'Items Tracked' },
            { stat: `${allBrands.length}+`, label: 'Brands' },
            { stat: 'Real Thai', label: 'Prices' },
            { stat: 'Weekly', label: 'Updates' },
          ]).map((s, i) => (
            <div key={i} className="border border-[#B8954A] p-5">
              <p className="font-serif text-2xl text-[#B8954A] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>{s.stat}</p>
              <p className="text-xs text-[#8C7355] tracking-[0.1em] uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best Deals */}
      {topDeals.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[#E8E2D9]" />
            <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">
              {locale === 'th' ? 'ดีลดีที่สุดสัปดาห์นี้' : 'Best Savings This Week'}
            </span>
            <div className="flex-1 h-px bg-[#E8E2D9]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {topDeals.map(item => {
              const vg = item.price_ranges.very_good!
              return (
                <a key={item.id} href={`/${locale}/${item.slug}`}
                  className="group relative overflow-hidden block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
                >
                  <div className="h-0.5 bg-[#B8954A]" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs tracking-[0.1em] uppercase text-[#9C8B7A] mb-0.5">{item.brand}</p>
                        <h3 className="font-serif text-base text-[#1A1A1A] leading-snug group-hover:text-[#8C7355] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                          {item.model}
                        </h3>
                      </div>
                      <span className="shrink-0 ml-2 text-lg font-bold text-[#4A7A35]">-{item.savingsPct}%</span>
                    </div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{formatPriceTHB(getAvgPrice(vg))}</p>
                    <p className="text-xs text-[#9C8B7A] mt-0.5 line-through">{formatPriceTHB(item.retail_price_thb)} {locale === 'th' ? 'ราคาใหม่' : 'retail'}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      )}

      <section className="mb-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">{t('nav_handbags')}</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
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
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">{t('nav_watches')}</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
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
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">{t('nav_clothing')}</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
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

      <section className="mb-8 mt-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">
            {locale === 'th' ? 'ราคาของเรามาจากไหน' : 'How Our Prices Work'}
          </span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {(locale === 'th' ? [
            { n: '01', title: 'ราคาจริงจากตลาด', desc: 'ดึงข้อมูลราคาทุกสัปดาห์จาก Vestiaire Collective, C2C Thailand และแพลตฟอร์มขายต่อชั้นนำ' },
            { n: '02', title: 'แยกตามสภาพสินค้า', desc: 'ราคาแยกตามเกรดสภาพ — ดีมาก, ดีเยี่ยม, ดี ให้คุณเปรียบเทียบได้อย่างตรงไปตรงมา' },
            { n: '03', title: 'ฟรี ไม่มีผลประโยชน์', desc: 'ไม่มีสัญญา affiliate ที่กระทบข้อมูล เราแค่ติดตามราคาตลาดจริง' },
          ] : [
            { n: '01', title: 'Real Listings', desc: 'Prices tracked weekly from Vestiaire Collective, eBay, and major Thai resale platforms.' },
            { n: '02', title: 'Condition-Matched', desc: 'Prices separated by condition so you compare like-for-like — Very Good, Excellent, Good.' },
            { n: '03', title: 'Free & Independent', desc: 'No affiliate deals affecting our data. We just track what the Thai market is actually paying.' },
          ]).map(s => (
            <div key={s.n} className="flex gap-4">
              <span className="font-serif text-2xl text-[#E8E2D9] shrink-0" style={{ fontFamily: 'var(--font-playfair)' }}>{s.n}</span>
              <div>
                <p className="font-medium text-[#1A1A1A] text-sm mb-1">{s.title}</p>
                <p className="text-xs text-[#6B6052] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
