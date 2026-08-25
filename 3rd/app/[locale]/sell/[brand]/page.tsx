import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getAllItems, formatPriceTHB, toBrandSlug, Item } from '@/lib/data'
import { getThaiEntry, getThaiBrand, getThaiMeta } from '@/lib/thai-market'
import { SellGuidance } from '@/components/SellGuidance'

const BASE = 'https://www.chicpreowned.com'

interface Props {
  params: Promise<{ locale: string; brand: string }>
}

function sellableByBrand(brandSlug: string) {
  return getAllItems()
    .filter(item => toBrandSlug(item.brand) === brandSlug)
    .map(item => ({ item, entry: getThaiEntry(item.slug) }))
    .filter((x): x is { item: Item; entry: NonNullable<(typeof x)['entry']> } => !!x.entry)
}

function brandSlugsWithData(): string[] {
  const slugs = new Set<string>()
  for (const item of getAllItems()) {
    if (getThaiEntry(item.slug)) slugs.add(toBrandSlug(item.brand))
  }
  return Array.from(slugs)
}

export function generateStaticParams() {
  return brandSlugsWithData().flatMap(brand =>
    ['en', 'th'].map(locale => ({ locale, brand }))
  )
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand } = await params
  const rows = sellableByBrand(brand)
  if (!rows.length) return {}
  const name = rows[0].item.brand
  const th = locale === 'th'
  const title = th
    ? `ขาย ${name} มือสอง ได้เท่าไหร่ในไทย`
    : `Selling ${name} in Thailand — what yours is worth`
  const description = th
    ? `ราคาที่ร้านมือสองในไทยตั้งขาย ${name} ตอนนี้ ${rows.length} รุ่น ใช้เป็นเพดานก่อนไปขอประเมินราคา`
    : `What Thai dealers are asking for ${name} right now, across ${rows.length} models. Know the ceiling before you take a quote.`
  const other = th ? 'en' : 'th'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/sell/${brand}`,
      languages: {
        [locale]: `${BASE}/${locale}/sell/${brand}`,
        [other]: `${BASE}/${other}/sell/${brand}`,
        'x-default': `${BASE}/en/sell/${brand}`,
      },
    },
    openGraph: { title, description, type: 'website', url: `${BASE}/${locale}/sell/${brand}` },
  }
}

export default async function SellBrandPage({ params }: Props) {
  const { locale, brand } = await params
  setRequestLocale(locale)
  const rows = sellableByBrand(brand)
  if (!rows.length) notFound()

  const th = locale === 'th'
  const name = rows[0].item.brand
  const brandStats = getThaiBrand(brand)
  const { generated } = getThaiMeta()

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: th ? 'ขายของ' : 'Sell', item: `${BASE}/${locale}/sell` },
      { '@type': 'ListItem', position: 3, name, item: `${BASE}/${locale}/sell/${brand}` },
    ],
  }
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: th ? `ขาย ${name} มือสองในไทย` : `Selling pre-owned ${name} in Thailand`,
    numberOfItems: rows.length,
    itemListElement: rows.map(({ item }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${item.brand} ${item.model}`,
      url: `${BASE}/${locale}/sell/${item.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{th ? 'หน้าแรก' : 'Home'}</Link> ›{' '}
        <Link href={`/${locale}/sell`}>{th ? 'ขายของ' : 'Sell'}</Link> › {name}
      </p>

      <h1
        className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th ? `ขาย ${name} มือสอง ได้เท่าไหร่` : `What your ${name} is worth in Thailand`}
      </h1>

      {brandStats && (
        <p className="text-[#6B6052] leading-relaxed max-w-2xl">
          {th
            ? `ร้านมือสองในไทยที่เราติดตามมีสินค้า ${name} รวม ${brandStats.n} ประกาศ ราคาส่วนใหญ่อยู่ระหว่าง ${formatPriceTHB(brandStats.p25)} ถึง ${formatPriceTHB(brandStats.p75)} (ครอบคลุมทุกประเภทสินค้าของแบรนด์ ตั้งแต่กระเป๋าสตางค์ถึงกระเป๋าใบใหญ่)`
            : `The Thai shops we track are carrying ${brandStats.n} ${name} listings, most of them between ${formatPriceTHB(brandStats.p25)} and ${formatPriceTHB(brandStats.p75)} — that spans everything they stock under the name, from card holders to the largest bags.`}
        </p>
      )}

      <p className="text-xs text-[#9C8B7A] mt-3">
        {th ? `อัปเดต ${generated}` : `Updated ${generated}`}
      </p>

      <ul className="grid gap-px bg-[#E8E2D9] border border-[#E8E2D9] sm:grid-cols-2 mt-8">
        {rows.map(({ item, entry }) => {
          const summary = entry.variant ?? entry.family!
          return (
            <li key={item.id} className="bg-white">
              <Link
                href={`/${locale}/sell/${item.slug}`}
                className="block p-5 hover:bg-[#FAFAF9] transition-colors"
              >
                <p className="font-serif text-lg text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {item.model}
                </p>
                <p className="text-sm text-[#6B6052] mt-1">
                  {formatPriceTHB(summary.min)} – {formatPriceTHB(summary.max)}
                </p>
                <p className="text-xs text-[#9C8B7A] mt-1">
                  {th ? `${summary.n} ประกาศ` : `${summary.n} listings`}
                  {!entry.variant && (th ? ' · ทุกขนาด' : ' · all sizes')}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>

      <SellGuidance locale={locale} />

      <p className="mt-8 text-sm text-[#6B6052]">
        {th ? 'กำลังคิดจะซื้อแทน? ดู ' : 'Buying instead? See '}
        <Link href={`/${locale}/${brand}`} className="underline hover:text-[#8C7355]">
          {th ? `ราคา ${name} มือสอง` : `${name} pre-owned prices`}
        </Link>
      </p>
    </>
  )
}
