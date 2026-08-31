import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getThaiVocabulary, getThaiMeta, getThaiSources } from '@/lib/thai-market'

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
    ? 'คำย่อในประกาศขายแบรนด์เนมมือสอง แปลว่าอะไร — Full Set, GHW, Holo, WOC'
    : 'Thai Resale Listing Jargon Explained — Full Set, GHW, Holo, WOC'
  const description = th
    ? 'Full Set, No Receipt, GHW, SHW, Microchip, Holo, Caviar, WOC, Classic 10 — คำย่อที่ร้านแบรนด์เนมมือสองในไทยใช้ในประกาศขาย อธิบายเป็นภาษาไทย พร้อมจำนวนประกาศที่พบจริง'
    : 'Full Set, No Receipt, GHW, Microchip, Holo, Caviar, WOC, Classic 10 — the shorthand Thai pre-owned dealers write their listings in, defined, with how often each actually appears.'
  const other = th ? 'en' : 'th'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/dealer-terms`,
      languages: {
        [locale]: `${BASE}/${locale}/dealer-terms`,
        [other]: `${BASE}/${other}/dealer-terms`,
        'x-default': `${BASE}/en/dealer-terms`,
      },
    },
    openGraph: { title, description, type: 'website', url: `${BASE}/${locale}/dealer-terms` },
  }
}

/**
 * The bridge between the words on a reseller's post and the person reading it.
 *
 * Every one of the 2,882 listings behind this site is titled in English —
 * "Used Like New Chanel Classic 10" Caviar GHW Microchip Full Set no receipt" —
 * and the people searching for those bags type Thai. Someone sees a bag on
 * Instagram or TikTok, copies a word out of the caption into Google, and until
 * this page there was nothing in Thai that told them what they had just read.
 *
 * The terms are curated; whether each one is published is not. A definition
 * only appears if the latest sweep actually saw the term on a listing, and the
 * count comes with it — so this is a description of how these shops write,
 * evidenced, rather than a glossary of what we imagine they say.
 */
export default async function DealerTermsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const th = locale === 'th'

  const terms = getThaiVocabulary()
  const { generated, listingCount } = getThaiMeta()
  const dealers = getThaiSources()

  // DefinedTermSet is the vocabulary type schema.org actually has for this.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: th
      ? 'คำย่อในประกาศขายแบรนด์เนมมือสองของร้านไทย'
      : 'Thai pre-owned luxury listing terminology',
    hasDefinedTerm: terms.map(t => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: th ? t.th : t.en,
    })),
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: terms.map(t => ({
      '@type': 'Question',
      name: th ? `${t.term} คืออะไร?` : `What does ${t.term} mean?`,
      acceptedAnswer: { '@type': 'Answer', text: th ? t.th : t.en },
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
        name: th ? 'คำย่อในประกาศขาย' : 'Listing jargon',
        item: `${BASE}/${locale}/dealer-terms`,
      },
    ],
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-xs text-[#9C8B7A] mb-6">
        <Link href={`/${locale}`} className="hover:text-[#8C7355]">
          {th ? 'หน้าแรก' : 'Home'}
        </Link>
        <span className="mx-2">/</span>
        <span>{th ? 'คำย่อในประกาศขาย' : 'Listing jargon'}</span>
      </nav>

      <h1
        className="font-serif text-3xl md:text-4xl text-[#1A1A1A] leading-tight"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th
          ? 'คำย่อในประกาศขายแบรนด์เนมมือสอง แปลว่าอะไร'
          : 'What the words in a Thai resale listing mean'}
      </h1>

      <p className="mt-4 text-[#4A4238] leading-relaxed">
        {th
          ? `ร้านแบรนด์เนมมือสองในไทยเขียนประกาศขายเป็นภาษาอังกฤษเกือบทั้งหมด และเขียนแบบย่อ — “Used Like New Chanel Classic 10” Caviar GHW Microchip Full Set no receipt” คือชื่อสินค้าจริงหนึ่งชิ้น คำเหล่านี้มีผลต่อราคาโดยตรง แต่แทบไม่มีที่ไหนอธิบายเป็นภาษาไทย`
          : `Thai pre-owned dealers write their listings in English, and in shorthand — “Used Like New Chanel Classic 10” Caviar GHW Microchip Full Set no receipt” is one real product title. Each of those words moves the price, and almost nothing explains them in Thai.`}
      </p>

      <p className="mt-3 text-sm text-[#6B6052] leading-relaxed">
        {th
          ? `คำที่แสดงด้านล่างคือคำที่พบจริงในประกาศ ${listingCount.toLocaleString()} รายการจากร้าน ${dealers.length} ร้าน เมื่อ ${generated} ตัวเลขข้างแต่ละคำคือจำนวนประกาศที่ใช้คำนั้น — คำที่ไม่พบในรอบล่าสุดจะไม่ถูกแสดง`
          : `Every term below was found in the ${listingCount.toLocaleString()} listings read from ${dealers.length} dealers on ${generated}. The number beside each is how many listings used it — a term the latest sweep did not see is not listed at all.`}
      </p>

      <dl className="mt-8 divide-y divide-[#E8E2D9] border-t border-[#E8E2D9]">
        {terms.map(t => (
          <div key={t.term} className="py-5">
            <dt className="flex items-baseline gap-3 flex-wrap">
              <span className="font-medium text-lg text-[#1A1A1A]">{t.term}</span>
              <span className="text-xs text-[#9C8B7A] tabular-nums">
                {th ? `พบใน ${t.count} ประกาศ` : `${t.count} listings`}
              </span>
            </dt>
            <dd className="mt-2 text-[#4A4238] leading-relaxed">{th ? t.th : t.en}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 p-5 border border-[#B8954A]/40 bg-[#FDFBF7]">
        <p className="text-sm text-[#4A4238] leading-relaxed">
          {th
            ? 'รู้คำศัพท์แล้ว ขั้นต่อไปคือรู้ราคา — เราอ่านราคาตั้งขายจริงจากร้านเหล่านี้ทุกสัปดาห์'
            : 'Knowing the words is half of it. We read these shops’ asking prices every week.'}
        </p>
        <div className="mt-3 flex gap-4 text-sm">
          <Link href={`/${locale}/handbags`} className="text-[#8C7355] underline underline-offset-2">
            {th ? 'ราคากระเป๋ามือสอง' : 'Handbag prices'}
          </Link>
          <Link href={`/${locale}/watches`} className="text-[#8C7355] underline underline-offset-2">
            {th ? 'ราคานาฬิกามือสอง' : 'Watch prices'}
          </Link>
          <Link href={`/${locale}/dealers`} className="text-[#8C7355] underline underline-offset-2">
            {th ? 'ร้านที่เราติดตาม' : 'The dealers we read'}
          </Link>
        </div>
      </div>
    </main>
  )
}
