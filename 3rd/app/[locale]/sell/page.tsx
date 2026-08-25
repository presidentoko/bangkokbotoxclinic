import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getAllItems, formatPriceTHB, toBrandSlug } from '@/lib/data'
import { getThaiEntry, getThaiMeta, getThaiSources } from '@/lib/thai-market'
import { SellGuidance } from '@/components/SellGuidance'

const BASE = 'https://www.chicpreowned.com'

interface Props {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'th' }]
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const th = locale === 'th'
  const title = th
    ? 'ขายกระเป๋าและนาฬิกาแบรนด์เนมมือสอง ได้เท่าไหร่ในไทย'
    : 'Selling Pre-Owned Luxury in Thailand — What Yours Is Worth'
  const description = th
    ? 'ดูราคาที่ร้านมือสองในไทยตั้งขายจริง ก่อนไปขอประเมินราคา รู้เพดานราคาแล้วต่อรองได้ดีขึ้น'
    : 'See what Thai dealers are actually asking for your model before you accept a quote. Know the ceiling, negotiate from it.'
  const other = th ? 'en' : 'th'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/sell`,
      languages: {
        [locale]: `${BASE}/${locale}/sell`,
        [other]: `${BASE}/${other}/sell`,
        'x-default': `${BASE}/en/sell`,
      },
    },
    openGraph: { title, description, type: 'website', url: `${BASE}/${locale}/sell` },
  }
}

export default async function SellHubPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const th = locale === 'th'

  const items = getAllItems()
    .map(item => ({ item, entry: getThaiEntry(item.slug) }))
    .filter((x): x is { item: (typeof x)['item']; entry: NonNullable<(typeof x)['entry']> } => !!x.entry)

  const byBrand = new Map<string, typeof items>()
  for (const row of items) {
    const slug = toBrandSlug(row.item.brand)
    byBrand.set(slug, [...(byBrand.get(slug) ?? []), row])
  }
  const brands = Array.from(byBrand.entries()).sort((a, b) => b[1].length - a[1].length)

  const { generated } = getThaiMeta()
  const buyers = getThaiSources().filter(s => s.buys).length

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: th ? 'ขายของ' : 'Sell', item: `${BASE}/${locale}/sell` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{th ? 'หน้าแรก' : 'Home'}</Link> › {th ? 'ขายของ' : 'Sell'}
      </p>

      <h1
        className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th ? 'ของคุณขายได้เท่าไหร่' : 'What is yours worth?'}
      </h1>

      <p className="text-[#6B6052] leading-relaxed max-w-2xl">
        {th
          ? `ทุกร้านมือสองในไทยประกาศว่า "รับซื้อ" แต่ไม่มีร้านไหนบอกว่าให้ราคาเท่าไหร่ — จนกว่าคุณจะเดินเข้าไป เราจึงแสดงสิ่งที่ตรวจสอบได้แทน คือราคาที่ร้าน ${buyers} ร้านกำลังตั้งขายรุ่นเดียวกับของคุณอยู่ตอนนี้`
          : `Every Thai shop advertises that it buys. None of them says what it pays — not until you are standing in front of them. So this shows the thing that can be checked instead: what ${buyers} shops are asking for the same model right now.`}
      </p>

      <p className="text-xs text-[#9C8B7A] mt-3">
        {th
          ? `${items.length} รุ่นมีข้อมูลราคาไทย · อัปเดต ${generated}`
          : `${items.length} models with Thai market data · updated ${generated}`}
      </p>

      {brands.map(([brandSlug, rows]) => (
        <section key={brandSlug} className="mt-10">
          <h2
            className="font-serif text-2xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <Link href={`/${locale}/sell/${brandSlug}`} className="hover:text-[#8C7355]">
              {rows[0].item.brand}
            </Link>
          </h2>
          <ul className="grid gap-px bg-[#E8E2D9] border border-[#E8E2D9] sm:grid-cols-2">
            {rows.map(({ item, entry }) => {
              const summary = entry.variant ?? entry.family!
              return (
                <li key={item.id} className="bg-white">
                  <Link
                    href={`/${locale}/sell/${item.slug}`}
                    className="block p-4 hover:bg-[#FAFAF9] transition-colors"
                  >
                    <p className="text-sm font-medium text-[#1A1A1A]">{item.model}</p>
                    <p className="text-sm text-[#6B6052] mt-1">
                      {formatPriceTHB(summary.min)} – {formatPriceTHB(summary.max)}
                      <span className="text-xs text-[#9C8B7A]">
                        {' '}
                        · {th ? `${summary.n} ประกาศ` : `${summary.n} listings`}
                        {!entry.variant && (th ? ' · ทุกขนาด' : ' · all sizes')}
                      </span>
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <SellGuidance locale={locale} />
    </>
  )
}
