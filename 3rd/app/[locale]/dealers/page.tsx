import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { formatPriceTHB } from '@/lib/data'
import { getThaiSources, getThaiMeta, getThaiCoveredSlugs, getThaiEntry } from '@/lib/thai-market'

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
    ? 'ร้านมือสองในไทยที่เราติดตามราคา — แหล่งข้อมูล'
    : 'Where Our Thai Prices Come From — Dealer Sources'
  const description = th
    ? 'รายชื่อร้านแบรนด์เนมมือสองในไทยที่เราอ่านราคาจริงทุกสัปดาห์ พร้อมวิธีคำนวณราคาและข้อจำกัดของข้อมูล'
    : 'The Thai resale dealers whose live listings this site reads every week, how the prices are calculated, and what the data cannot tell you.'
  const other = th ? 'en' : 'th'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/dealers`,
      languages: {
        [locale]: `${BASE}/${locale}/dealers`,
        [other]: `${BASE}/${other}/dealers`,
        'x-default': `${BASE}/en/dealers`,
      },
    },
    openGraph: { title, description, type: 'website', url: `${BASE}/${locale}/dealers` },
  }
}

/**
 * The page that makes every price on this site checkable.
 *
 * A price guide with no stated provenance is an opinion. This one previously
 * had a stated provenance that was false — the footer credited "Carousell
 * Thailand and C2C.in.th", two domains that do not resolve, for numbers that
 * actually came from a US marketplace. Naming the real shops, saying how many
 * listings each contributed and linking to them is the correction, and it is
 * also the strongest thing the site can show a reader deciding whether to
 * trust it.
 */
export default async function DealersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const th = locale === 'th'

  const sources = getThaiSources()
  const { generated, listingCount } = getThaiMeta()
  const covered = getThaiCoveredSlugs()
  const withVariant = covered.filter(slug => getThaiEntry(slug)?.variant).length

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: th ? 'ร้านแบรนด์เนมมือสองในไทยที่เราติดตาม' : 'Thai pre-owned luxury dealers we track',
    numberOfItems: sources.length,
    itemListElement: sources.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Organization', name: s.label, url: s.url },
    })),
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: th ? 'แหล่งข้อมูลราคา' : 'Price sources',
        item: `${BASE}/${locale}/dealers`,
      },
    ],
  }

  const stats = [
    {
      value: sources.length.toString(),
      label: th ? 'ร้านที่อ่านราคา' : 'dealers read',
    },
    {
      value: listingCount.toLocaleString('en-US'),
      label: th ? 'ประกาศขายที่สแกน' : 'listings scanned',
    },
    {
      value: `${withVariant}`,
      label: th ? 'รุ่นที่มีราคาไทยเฉพาะรุ่น' : 'models priced exactly',
    },
    {
      value: generated,
      label: th ? 'อัปเดตล่าสุด' : 'last updated',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{th ? 'หน้าแรก' : 'Home'}</Link> ›{' '}
        {th ? 'แหล่งข้อมูลราคา' : 'Price sources'}
      </p>

      <h1
        className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th ? 'ราคาบนเว็บนี้มาจากไหน' : 'Where these prices come from'}
      </h1>

      <p className="text-[#6B6052] leading-relaxed max-w-2xl">
        {th
          ? 'เราไม่ได้ขายสินค้า ไม่รับฝากขาย และไม่รับค่าคอมมิชชันจากลิงก์ใด ๆ สิ่งเดียวที่เราทำคืออ่านประกาศขายจริงจากร้านมือสองในไทยทุกสัปดาห์ แล้วคำนวณว่าราคาตลาดอยู่ตรงไหน'
          : 'We sell nothing, take nothing on consignment, and earn no commission on any link here. The only thing this site does is read Thai dealers’ live listings every week and work out where the market actually sits.'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#E8E2D9] border border-[#E8E2D9] my-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-4">
            <p className="text-2xl font-light text-[#1A1A1A]">{s.value}</p>
            <p className="text-xs text-[#9C8B7A] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <h2
        className="font-serif text-2xl text-[#1A1A1A] mt-10 mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th ? 'ร้านที่เราอ่านราคา' : 'The dealers'}
      </h2>

      <ul className="space-y-px bg-[#E8E2D9] border border-[#E8E2D9]">
        {sources.map(s => (
          <li key={s.id} className="bg-white p-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-serif text-lg text-[#1A1A1A] hover:text-[#8C7355]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {s.label}
            </a>
            <span className="text-xs tracking-[0.1em] uppercase text-[#9C8B7A]">
              {s.focus === 'watches'
                ? th ? 'นาฬิกา' : 'watches'
                : th ? 'กระเป๋า' : 'handbags'}
            </span>
            <span className="text-sm text-[#6B6052] ml-auto">
              {th
                ? `${s.listings.toLocaleString('en-US')} ประกาศ`
                : `${s.listings.toLocaleString('en-US')} listings`}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-[#9C8B7A] mt-3 leading-relaxed">
        {th
          ? 'เราไม่มีความสัมพันธ์ทางธุรกิจกับร้านเหล่านี้ และไม่ได้รับอนุญาตหรือค่าตอบแทนจากพวกเขา เราอ่านเฉพาะราคาและชื่อสินค้าจากหน้าร้านออนไลน์สาธารณะ ไม่ได้คัดลอกรูปภาพหรือคำบรรยายสินค้า'
          : 'We have no business relationship with these shops and receive nothing from them. We read only the price and product name from their public storefronts — never their photography or descriptions.'}
      </p>

      <h2
        className="font-serif text-2xl text-[#1A1A1A] mt-12 mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th ? 'วิธีคำนวณราคา' : 'How a price is worked out'}
      </h2>

      <ol className="space-y-4 text-[#6B6052] leading-relaxed max-w-2xl list-decimal pl-5">
        <li>
          {th
            ? 'จับคู่ประกาศกับรุ่นสินค้า โดยต้องตรงทุกคำในชื่อรุ่น — "Birkin 25" จะไม่จับคู่กับประกาศที่เขียนแค่ "BIRKIN" เพราะ Birkin 25 กับ Birkin 35 เป็นคนละราคา'
            : 'Match a listing to a model only when every word of the model name is present. "Birkin 25" will not match a listing that says only "BIRKIN" — a Birkin 25 and a Birkin 35 are different prices, and presenting one as the other would be a lie.'}
        </li>
        <li>
          {th
            ? 'ตัดประกาศที่ไม่ใช่สินค้าประเภทเดียวกันออก — "Classic Flap Card Holder" ราคา ฿15,900 ไม่ใช่ราคาของกระเป๋า Classic Flap'
            : 'Drop listings that are a different kind of object. A "Classic Flap Card Holder" at ฿15,900 is not the price of a Classic Flap bag, even though the words match.'}
        </li>
        <li>
          {th
            ? 'ตัดราคาที่อยู่นอกกรอบเทียบกับราคาป้ายของแท้ แล้วรายงานค่ากลาง (median) พร้อมช่วงราคาต่ำสุด–สูงสุด'
            : 'Drop anything outside a sane window around the item’s retail price, then report the median with the full low–high range beside it.'}
        </li>
        <li>
          {th
            ? 'ต้องมีอย่างน้อย 3 ประกาศจึงจะเผยแพร่ราคา — ถ้าน้อยกว่านั้นเราไม่แสดงตัวเลข ไม่แสดงดีกว่าแสดงผิด'
            : 'Publish nothing built on fewer than three listings. A missing price is recoverable; a wrong one is what this site exists to prevent.'}
        </li>
      </ol>

      <h2
        className="font-serif text-2xl text-[#1A1A1A] mt-12 mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th ? 'ข้อจำกัดของข้อมูล' : 'What this data cannot tell you'}
      </h2>

      <ul className="space-y-3 text-[#6B6052] leading-relaxed max-w-2xl list-disc pl-5">
        <li>
          {th
            ? 'นี่คือ "ราคาตั้งขาย" ไม่ใช่ราคาที่ซื้อขายจริง ราคาปิดมักต่ำกว่าราคาตั้งเล็กน้อยหลังการต่อรอง'
            : 'These are asking prices, not closing prices. What a bag actually changes hands for is usually somewhat less, after negotiation.'}
        </li>
        <li>
          {th
            ? 'ร้านไทยมักไม่ระบุขนาดในชื่อสินค้า บางรุ่นเราจึงแสดงได้แค่ช่วงราคาของทั้งตระกูล และหน้านั้นจะบอกไว้ชัดเจน'
            : 'Thai dealers often omit the size from the title. Where that happens we can only show the family’s range across all sizes, and the page says so rather than pretending otherwise.'}
        </li>
        <li>
          {th
            ? 'ร้านที่เราอ่านมี 5 ร้าน ซึ่งไม่ใช่ตลาดทั้งหมดของไทย ราคาจากกลุ่ม LINE และ Facebook มักถูกกว่าแต่ตรวจสอบได้ยากกว่า'
            : 'Five dealers are not the whole Thai market. Private sales through LINE groups and Facebook typically run cheaper, and are correspondingly harder to verify.'}
        </li>
        <li>
          {th
            ? `รุ่นที่มีราคาไทยเฉพาะรุ่นมี ${withVariant} รุ่น ส่วนที่เหลือยังใช้ราคาอ้างอิงต่างประเทศ ซึ่งหน้านั้นจะระบุไว้`
            : `Only ${withVariant} models have a Thai figure precise to the reference. The rest still show an international reference price, clearly labelled as one.`}
        </li>
      </ul>

      <div className="mt-12 p-6 bg-[#F5F0E8] border border-[#E8E2D9]">
        <p className="text-sm text-[#1A1A1A] font-medium mb-1">
          {th ? 'เจอราคาที่ดูผิด?' : 'Spotted a price that looks wrong?'}
        </p>
        <p className="text-sm text-[#6B6052]">
          {th ? 'บอกเราได้ที่ ' : 'Tell us at '}
          <Link href={`/${locale}/contact`} className="underline hover:text-[#8C7355]">
            {th ? 'หน้าติดต่อ' : 'the contact page'}
          </Link>
          {th
            ? ' — ราคาที่ผิดคือปัญหาที่ร้ายแรงที่สุดของเว็บนี้ และเราแก้ทันที'
            : ' — a wrong price is the worst failure this site can have, and we fix those first.'}
        </p>
      </div>
    </>
  )
}
