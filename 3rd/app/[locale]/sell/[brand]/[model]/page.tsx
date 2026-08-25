import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getItemBySlug, getAllItems, formatPriceTHB, toBrandSlug } from '@/lib/data'
import {
  getThaiEntry,
  getThaiMeta,
  dealerSpread,
  valueRetention,
  marketPrice,
} from '@/lib/thai-market'
import { ThaiMarketPanel } from '@/components/ThaiMarketPanel'
import { SellGuidance } from '@/components/SellGuidance'

const BASE = 'https://www.chicpreowned.com'

interface Props {
  params: Promise<{ locale: string; brand: string; model: string }>
}

/**
 * "How much can I get for my X?" — the question nobody in this market answers.
 *
 * Every competing site in Thai search is a dealer, and a dealer's page for
 * this query says "รับซื้อ, contact us for a quote" and stops, because
 * publishing what they pay would cost them the negotiation. That leaves the
 * highest-intent query in the category — a person holding a bag, ready to
 * transact today — served by nothing but a contact form.
 *
 * This site has no inventory and no margin to protect, so it can simply show
 * what the shops are asking and explain how the spread works. That is the one
 * page here a dealer structurally cannot copy.
 */

/** Only items we have Thai dealer listings for. Elsewhere the honest answer
 *  is "we don't know what this fetches in Bangkok", which is not a page. */
function sellableItems() {
  return getAllItems().filter(item => !!getThaiEntry(item.slug))
}

export function generateStaticParams() {
  return sellableItems().flatMap(item => {
    const [brand, model] = item.slug.split('/')
    return ['en', 'th'].map(locale => ({ locale, brand, model }))
  })
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) return {}
  const th = locale === 'th'
  const entry = getThaiEntry(item.slug)
  const summary = entry?.variant ?? entry?.family
  const title = th
    ? `ขาย ${item.brand} ${item.model} มือสอง ได้เท่าไหร่ในไทย`
    : `Selling a ${item.brand} ${item.model} in Thailand — what it's worth`
  const description = th
    ? summary
      ? `ร้านมือสองในไทยตั้งขาย ${item.model} ที่ ${formatPriceTHB(summary.min)}–${formatPriceTHB(summary.max)} รู้เพดานราคาก่อนไปขอประเมิน`
      : `ราคาตลาดของ ${item.brand} ${item.model} มือสองในไทย และวิธีขายให้ได้ราคาดีที่สุด`
    : summary
      ? `Thai dealers are asking ${formatPriceTHB(summary.min)}–${formatPriceTHB(summary.max)} for a ${item.model}. Know the ceiling before you take a quote.`
      : `What a pre-owned ${item.brand} ${item.model} is worth in Thailand, and how to get the best price for yours.`
  const other = th ? 'en' : 'th'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/sell/${item.slug}`,
      languages: {
        [locale]: `${BASE}/${locale}/sell/${item.slug}`,
        [other]: `${BASE}/${other}/sell/${item.slug}`,
        'x-default': `${BASE}/en/sell/${item.slug}`,
      },
    },
    openGraph: { title, description, type: 'website', url: `${BASE}/${locale}/sell/${item.slug}` },
  }
}

export default async function SellModelPage({ params }: Props) {
  const { locale, brand, model } = await params
  setRequestLocale(locale)
  const item = getItemBySlug(brand, model)
  if (!item || !getThaiEntry(item.slug)) notFound()

  const th = locale === 'th'
  const entry = getThaiEntry(item.slug)!
  const summary = entry.variant ?? entry.family!
  const spread = dealerSpread(item.slug)
  const retention = valueRetention(item)
  const market = marketPrice(item)
  const { generated } = getThaiMeta()
  const isVariant = !!entry.variant

  const faqs = th
    ? [
        {
          q: `ขาย ${item.model} มือสองได้ราคาเท่าไหร่?`,
          a: `ร้านมือสองในไทยกำลังตั้งขาย ${item.model} ที่ ${formatPriceTHB(summary.min)} ถึง ${formatPriceTHB(summary.max)} (กลาง ${formatPriceTHB(summary.median)}) จาก ${summary.n} ประกาศ ราคาที่คุณจะได้รับจะต่ำกว่านี้ เพราะร้านต้องมีกำไรจากการขายต่อ — ตัวเลขนี้คือเพดานที่ใช้วัดข้อเสนอที่ได้รับ`,
        },
        {
          q: 'ทำไมเว็บนี้ไม่บอกราคารับซื้อตรง ๆ?',
          a: 'เพราะไม่มีร้านไหนประกาศราคารับซื้อของตัวเอง นั่นคืออำนาจต่อรองของเขา เราจึงไม่ตั้งตัวเลขขึ้นมาเอง เราแสดงเฉพาะสิ่งที่ตรวจสอบได้จริง คือราคาที่ร้านตั้งขายอยู่ตอนนี้',
        },
        {
          q: 'ขายขาดหรือฝากขายดีกว่ากัน?',
          a: 'ขายขาดได้เงินทันทีแต่ราคาต่ำกว่า ฝากขายมักได้เงินมากกว่าแต่ต้องรอและอาจขายไม่ออก ถ้าต้องใช้เงินเร่งด่วนให้ขายขาด ถ้ารอได้ให้ฝากขาย',
        },
        {
          q: 'ต้องเตรียมอะไรบ้างก่อนไปขาย?',
          a: 'กล่อง ใบเสร็จ บัตรรับรองความแท้ ถุงผ้า และอุปกรณ์ที่มากับสินค้า ของครบชุดขายได้ราคาดีกว่าชิ้นเดียวกันที่ไม่มีอุปกรณ์',
        },
      ]
    : [
        {
          q: `How much can I sell a used ${item.model} for in Thailand?`,
          a: `Thai dealers are currently asking ${formatPriceTHB(summary.min)} to ${formatPriceTHB(summary.max)} for a ${item.model}, with a median of ${formatPriceTHB(summary.median)} across ${summary.n} listings. What you are offered will be less than this, because the shop has to resell it at a margin — treat these figures as the ceiling your offers are measured against.`,
        },
        {
          q: "Why doesn't this page just tell me the buy-back price?",
          a: 'Because no Thai dealer publishes theirs — it is their negotiating position. Rather than invent a percentage, this page shows the one thing that can be verified: what the shops are asking for the same piece right now.',
        },
        {
          q: 'Outright sale or consignment?',
          a: 'An outright sale pays today and pays less. Consignment usually nets more, but you wait, and you carry the risk that it does not sell. If you need the money now, sell outright; if you can wait, consign.',
        },
        {
          q: 'What should I have ready before asking for a quote?',
          a: 'The box, receipt, authentication card, dust bag and any accessories that came with it. A full set is worth meaningfully more than the identical piece without one.',
        },
      ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
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
        name: th ? 'ขายของ' : 'Sell',
        item: `${BASE}/${locale}/sell`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${item.brand} ${item.model}`,
        item: `${BASE}/${locale}/sell/${item.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{th ? 'หน้าแรก' : 'Home'}</Link> ›{' '}
        <Link href={`/${locale}/sell`}>{th ? 'ขายของ' : 'Sell'}</Link> ›{' '}
        {item.brand} {item.model}
      </p>

      <h1
        className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th
          ? `ขาย ${item.brand} ${item.model} มือสอง ได้เท่าไหร่`
          : `What a ${item.brand} ${item.model} is worth in Thailand`}
      </h1>

      <p className="text-[#6B6052] leading-relaxed max-w-2xl">
        {th
          ? `นี่คือราคาที่ร้านมือสองในไทยกำลังตั้งขาย ${item.model} อยู่จริงในตอนนี้ ไม่ใช่ราคาที่คุณจะได้รับ — แต่เป็นเพดานที่ทุกข้อเสนอถูกวัดจากมัน`
          : `These are the prices Thai shops are asking for a ${item.model} right now. They are not what you will be offered — they are the ceiling every offer you get is measured against.`}
      </p>

      {/* Headline: the shelf price */}
      <div className="my-8 p-6 bg-[#1A1A1A] text-white">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
          {th ? 'ราคาที่ร้านไทยตั้งขายตอนนี้' : 'Thai shops are asking'}
        </p>
        <p className="text-4xl font-light">{formatPriceTHB(summary.median)}</p>
        <p className="text-sm text-[#9C8B7A] mt-2">
          {th
            ? `ช่วง ${formatPriceTHB(summary.min)} – ${formatPriceTHB(summary.max)} จาก ${summary.n} ประกาศ · อัปเดต ${generated}`
            : `${formatPriceTHB(summary.min)} – ${formatPriceTHB(summary.max)} across ${summary.n} listings · updated ${generated}`}
        </p>
        {!isVariant && (
          <p className="text-xs text-[#C8A97E] mt-3 leading-relaxed max-w-xl">
            {th
              ? `ร้านไทยมักไม่ระบุขนาดในชื่อสินค้า ตัวเลขนี้จึงครอบคลุม ${entry.family?.label} ทุกขนาด ไม่ใช่ ${item.model} โดยเฉพาะ`
              : `Thai dealers rarely state the size, so this covers every ${entry.family?.label} they listed rather than the ${item.model} specifically.`}
          </p>
        )}
      </div>

      {/* The two numbers a seller actually needs */}
      <div className="grid gap-px bg-[#E8E2D9] border border-[#E8E2D9] sm:grid-cols-2 my-8">
        {spread && spread.ratio > 1 && (
          <div className="bg-white p-5">
            <p className="text-xs tracking-[0.1em] uppercase text-[#9C8B7A] mb-2">
              {th ? 'ร้านต่างกันแค่ไหน' : 'How far apart the shops are'}
            </p>
            <p className="text-2xl font-light text-[#1A1A1A]">{spread.ratio}×</p>
            <p className="text-sm text-[#6B6052] mt-2 leading-relaxed">
              {th
                ? `ถูกสุด ${formatPriceTHB(spread.low)} แพงสุด ${formatPriceTHB(spread.high)} — ถ้าขอประเมินแค่ร้านเดียว คุณไม่มีทางรู้ว่าอยู่ปลายไหน`
                : `${formatPriceTHB(spread.low)} at the low end, ${formatPriceTHB(spread.high)} at the high. Ask one shop and you have no way of knowing which end you are on.`}
            </p>
          </div>
        )}
        {retention !== null && item.retail_price_thb > 0 && (
          <div className="bg-white p-5">
            <p className="text-xs tracking-[0.1em] uppercase text-[#9C8B7A] mb-2">
              {th ? 'รักษามูลค่าได้เท่าไหร่' : 'Value held'}
            </p>
            <p className="text-2xl font-light text-[#1A1A1A]">{retention}%</p>
            <p className="text-sm text-[#6B6052] mt-2 leading-relaxed">
              {th
                ? `เทียบราคาป้าย ${formatPriceTHB(item.retail_price_thb)}${retention >= 100 ? ' — ตลาดมือสองสูงกว่าราคาป้าย' : ''}`
                : `against a ${formatPriceTHB(item.retail_price_thb)} retail price${retention >= 100 ? ' — the secondary market is above retail' : ''}`}
            </p>
          </div>
        )}
      </div>

      {/* Condition, only where the listings actually stated one */}
      {entry.by_condition && Object.keys(entry.by_condition).length > 0 && (
        <section className="my-8">
          <h2
            className="font-serif text-xl text-[#1A1A1A] mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {th ? 'สภาพมีผลแค่ไหน' : 'What condition is worth'}
          </h2>
          <table className="w-full text-sm border-collapse">
            <tbody>
              {(['excellent', 'very_good', 'good'] as const).map(grade => {
                const c = entry.by_condition?.[grade]
                if (!c) return null
                const label = {
                  excellent: th ? 'สภาพดีเยี่ยม' : 'Excellent',
                  very_good: th ? 'สภาพดีมาก' : 'Very Good',
                  good: th ? 'สภาพดี' : 'Good',
                }[grade]
                return (
                  <tr key={grade}>
                    <td className="p-3 border border-[#E8E2D9] font-medium">{label}</td>
                    <td className="p-3 border border-[#E8E2D9]">
                      {formatPriceTHB(c.median)}
                    </td>
                    <td className="p-3 border border-[#E8E2D9] text-[#9C8B7A]">
                      {th ? `${c.n} ประกาศ` : `${c.n} listings`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="text-xs text-[#9C8B7A] mt-2">
            {th
              ? 'เฉพาะประกาศที่ร้านระบุสภาพไว้ในชื่อสินค้า ประกาศที่ไม่ระบุจะไม่ถูกเดาสภาพให้'
              : 'Only listings where the shop stated a condition in the title. Unlabelled listings are left unlabelled rather than guessed.'}
          </p>
        </section>
      )}

      <SellGuidance locale={locale} />

      <div id="thai-market">
        <ThaiMarketPanel item={item} locale={locale} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-[#1A1A1A]">FAQ</h2>
        <dl className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <dt className="font-medium text-[#1A1A1A]">{f.q}</dt>
              <dd className="mt-1 text-[#6B6052] leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10 p-5 bg-[#F5F0E8] border border-[#E8E2D9]">
        <p className="text-sm text-[#6B6052]">
          {th ? 'กำลังคิดจะซื้อแทน? ดู ' : 'Buying rather than selling? See '}
          <Link href={`/${locale}/${item.slug}`} className="underline hover:text-[#8C7355]">
            {th
              ? `ราคา ${item.brand} ${item.model} มือสอง`
              : `${item.brand} ${item.model} pre-owned prices`}
          </Link>
          {market?.basis === 'international' && (
            <>
              {th
                ? ' · หน้านั้นใช้ราคาอ้างอิงต่างประเทศสำหรับรุ่นนี้'
                : ' · that page uses an international reference for this model'}
            </>
          )}
        </p>
      </div>
    </>
  )
}
