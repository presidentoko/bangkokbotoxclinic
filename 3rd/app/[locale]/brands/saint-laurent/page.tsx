import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'
import { BrandSchema } from '@/components/BrandSchema'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/saint-laurent'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Saint Laurent Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Saint Laurent มือสองในไทย ${PRICE_YEAR} — คู่มือซื้อ — Loulou, Kate, Sunset | ChicPreowned`,
    description: isEn
      ? 'Pre-owned Saint Laurent (YSL) prices in Thailand (THB). Loulou, Kate Tassel, Sunset, Jamie — save 35–50% vs retail. Compare by condition.'
      : 'ราคา Saint Laurent (YSL) มือสองในไทย (บาท) Loulou, Kate Tassel, Sunset, Jamie — ประหยัดได้ 35–50%',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Is YSL or Saint Laurent the correct name for the brand?',
    a: 'The brand was officially renamed from Yves Saint Laurent to Saint Laurent Paris in 2012 under Hedi Slimane. Both names appear on products and in common usage. On the Thai pre-owned market, "YSL" and "Saint Laurent" are used interchangeably. Pre-2012 pieces carry vintage YSL status and can attract collector premiums.',
  },
  {
    q: 'How much can I save buying Saint Laurent pre-owned in Thailand?',
    a: 'Pre-owned Saint Laurent bags in very good condition typically sell for 35–50% below current Thai retail. A Loulou Small that retails for approximately ฿58,000 in Bangkok can be found pre-owned for ฿28,000–38,000 in very good condition.',
  },
  {
    q: 'Which Saint Laurent bags sell best on the Thai pre-owned market?',
    a: 'The Loulou and Kate Tassel are the most liquid — fastest to sell and easiest to price. The Sunset bag has strong demand from Thai buyers who prefer the structured satchel shape. The Jamie camera bag has grown significantly in resale demand since 2022 and often commands higher prices than older models.',
  },
  {
    q: 'What should I check when buying Saint Laurent pre-owned in Thailand?',
    a: 'Inspect bottom corners first — this is where YSL bags wear fastest. Check the stitching (should be tight and even, 8–10 per cm). Hardware engravings should be sharp and clear. The lining should be leather (not fabric). Authentic pieces have a date code stamp inside — research the format specific to your model.',
  },
]

const faqsTh = [
  {
    q: 'ชื่อ YSL หรือ Saint Laurent ชื่อไหนถูกต้อง?',
    a: 'แบรนด์เปลี่ยนชื่ออย่างเป็นทางการจาก Yves Saint Laurent เป็น Saint Laurent Paris ในปี 2555 ภายใต้ Hedi Slimane ทั้งสองชื่อปรากฏบนผลิตภัณฑ์และใช้ทั่วไป ในตลาดมือสองไทย "YSL" และ "Saint Laurent" ใช้แทนกันได้ ชิ้นก่อนปี 2555 ถือเป็น YSL vintage และอาจมีราคาพรีเมียมสำหรับนักสะสม',
  },
  {
    q: 'ซื้อ Saint Laurent มือสองในไทยประหยัดได้เท่าไหร่?',
    a: 'กระเป๋า Saint Laurent มือสองสภาพดีมากมักขายต่ำกว่าราคาปลีกไทยปัจจุบัน 35–50% Loulou Small ที่ราคาใหม่ประมาณ 58,000 บาทในกรุงเทพฯ สามารถหาซื้อมือสองได้ในราคา 28,000–38,000 บาทสภาพดีมาก',
  },
  {
    q: 'กระเป๋า Saint Laurent รุ่นไหนขายได้ดีในตลาดมือสองไทย?',
    a: 'Loulou และ Kate Tassel คือรุ่นที่ขายได้คล่องที่สุด — ขายเร็วสุดและตั้งราคาง่ายที่สุด Sunset bag มีความต้องการสูงจากผู้ซื้อชาวไทยที่ชอบทรง satchel แบบ structured Jamie camera bag มีความต้องการเพิ่มขึ้นอย่างมากในตลาดมือสองตั้งแต่ปี 2565 และมักมีราคาสูงกว่ารุ่นเก่า',
  },
  {
    q: 'ควรเช็คอะไรเมื่อซื้อ Saint Laurent มือสองในไทย?',
    a: 'ตรวจมุมล่างก่อนเลย — เป็นจุดที่กระเป๋า YSL สึกหรอเร็วที่สุด ตรวจด้ายเย็บ (ควรแน่นและสม่ำเสมอ 8–10 เข็มต่อ ซม.) การแกะสลักฮาร์ดแวร์ควรคมชัด ซับในควรเป็นหนัง (ไม่ใช่ผ้า) ชิ้นแท้มีรหัสวันที่ประทับอยู่ข้างใน — ควรค้นหารูปแบบที่ตรงกับรุ่นที่ต้องการ',
  },
]

export default async function SaintLaurentBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const faqs = isEn ? faqsEn : faqsTh

  const items = getItemsByBrand('saint-laurent').filter(i => i.retail_price_thb > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <BrandSchema brandSlug="saint-laurent" locale={locale} path={`brands/saint-laurent`} faqs={faqs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: isEn ? 'Pre-Owned Saint Laurent Price Guide Thailand 2025' : 'ราคา Saint Laurent มือสองในไทย 2025',
          url: `${BASE}/${locale}/${SLUG}`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${locale}/${item.slug}`,
            name: isEn ? `Pre-Owned ${item.brand} ${item.model}` : `${item.brand} ${item.model} มือสอง`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Saint Laurent</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? `Pre-Owned Saint Laurent in Thailand ${PRICE_YEAR}` : `Saint Laurent มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? `${items.length} models · save 35–50% vs retail` : `${items.length} รุ่น · ประหยัดได้ 35–50%`}
      </p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Price Table — Saint Laurent Pre-Owned (THB)' : 'ตารางราคา Saint Laurent มือสอง (บาท)'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Retail (THB)' : 'ราคาใหม่ (บาท)'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Excellent' : 'สภาพดีเยี่ยม'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Very Good' : 'สภาพดีมาก'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Good' : 'สภาพดี'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const ex = item.price_ranges?.excellent
                const vg = item.price_ranges?.very_good
                const g = item.price_ranges?.good
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${locale}/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{item.model}</Link>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">{formatPriceTHB(item.retail_price_thb)}</td>
                    <td className="text-right py-3 px-4">{ex ? `${formatPriceTHB(ex.min)}–${formatPriceTHB(ex.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPriceTHB(vg.min)}–${formatPriceTHB(vg.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4 text-gray-500">{g ? `${formatPriceTHB(g.min)}–${formatPriceTHB(g.max)}` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-4 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/saint-laurent" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/saint-laurent" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? '← All Brands' : '← แบรนด์ทั้งหมด'}
        </Link>
      </div>
    </div>
  )
}
