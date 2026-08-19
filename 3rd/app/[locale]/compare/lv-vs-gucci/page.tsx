import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/lv-vs-gucci'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Louis Vuitton vs Gucci Pre-Owned Value in Thailand ${PRICE_YEAR} | ChicPreowned`
      : 'Louis Vuitton กับ Gucci มือสอง — อันไหนคุ้มกว่า? | ChicPreowned',
    description: isEn
      ? 'LV retains 65–75% of retail value, Gucci 50–65%. Compare pre-owned prices for both brands in Thailand and decide which is worth buying first.'
      : 'LV รักษามูลค่า 65–75% ของราคาใหม่ Gucci 50–65% เปรียบเทียบราคามือสองทั้งสองแบรนด์ในไทย',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: {
        en: `${BASE}/en/${SLUG}`,
        th: `${BASE}/th/${SLUG}`,
        'x-default': `${BASE}/en/${SLUG}`,
      },
    },
  }
}

const faqsEn = [
  {
    q: 'LV vs Gucci — which holds its value better?',
    a: 'Louis Vuitton holds value better, retaining 65–75% of retail versus Gucci\'s 50–65%. LV Monogram canvas is especially stable due to timeless demand and limited seasonal variation.',
  },
  {
    q: 'Which is cheaper pre-owned — LV or Gucci?',
    a: 'Gucci entry pieces are more affordable: belts and wallets from ฿7,000, versus LV card holders from ฿6,000. For bags, Gucci Marmont starts lower than most LV bags in similar condition.',
  },
  {
    q: 'Should I buy LV or Gucci first?',
    a: 'Buy LV first if investment value matters — higher retention and easier to resell. Choose Gucci first if style variety is the priority: more colourways and seasonal designs at accessible pre-owned prices.',
  },
]

const faqsTh = [
  {
    q: 'LV กับ Gucci อันไหนคุ้มกว่าในแง่การรักษามูลค่า?',
    a: 'Louis Vuitton รักษามูลค่าได้ดีกว่า โดยเก็บมูลค่าไว้ 65–75% ของราคาใหม่ เทียบกับ Gucci ที่ 50–65% ผ้า Monogram Canvas ของ LV มีเสถียรภาพสูงเพราะดีมานด์ที่ไม่ขึ้นกับฤดูกาล',
  },
  {
    q: 'อันไหนถูกกว่ามือสอง — LV หรือ Gucci?',
    a: 'Gucci ราคาเริ่มต้นถูกกว่า: เข็มขัดและกระเป๋าสตางค์เริ่มที่ ฿7,000 ส่วน LV Card Holder เริ่มที่ ฿6,000 สำหรับกระเป๋า Gucci Marmont มักราคาต่ำกว่ากระเป๋า LV ในสภาพเดียวกัน',
  },
  {
    q: 'ควรซื้ออันไหนก่อน — LV หรือ Gucci?',
    a: 'ซื้อ LV ก่อนหากต้องการลงทุน — รักษามูลค่าดีกว่าและขายต่อง่ายกว่า เลือก Gucci ก่อนหากต้องการความหลากหลายทางสไตล์: มีให้เลือกหลายสีและดีไซน์ในราคามือสองที่เข้าถึงได้',
  },
]

export default async function LvVsGucciPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const lvItems = getItemsByBrand('louis-vuitton').filter(i => i.price_ranges?.very_good)
  const gucciItems = getItemsByBrand('gucci').filter(i => i.price_ranges?.very_good)

  const faqs = isEn ? faqsEn : faqsTh

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const renderItems = (items: ReturnType<typeof getItemsByBrand>, brandName: string, retainRange: string) => (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
          {brandName}
        </h2>
        <span className="text-sm text-[#B8954A] font-medium">{retainRange}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[#9C8B7A]">{isEn ? 'Price data loading…' : 'กำลังโหลดข้อมูลราคา…'}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map(item => {
            const vg = item.price_ranges.very_good!
            const avg = getAvgPrice(vg)
            return (
              <a
                key={item.id}
                href={`/${locale}/${item.slug}`}
                className="group flex items-center justify-between p-4 border border-[#E8E2D9] bg-white hover:border-[#B8954A] transition-colors"
              >
                <div>
                  <p className="text-xs text-[#9C8B7A] uppercase tracking-wider">{item.brand}</p>
                  <p className="text-[#1A1A1A] font-medium group-hover:text-[#8C7355] transition-colors">{item.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#B8954A] font-medium">{formatPriceTHB(avg)}</p>
                  <p className="text-xs text-[#9C8B7A]">{isEn ? 'Very Good avg' : 'เฉลี่ย VG'}</p>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        {isEn ? 'Compare' : 'เปรียบเทียบ'}
        {' › LV vs Gucci'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn
          ? `Louis Vuitton vs Gucci Pre-Owned Value in Thailand ${PRICE_YEAR}`
          : 'Louis Vuitton กับ Gucci มือสอง — อันไหนคุ้มกว่า?'}
      </h1>

      <p className="text-[#6B6052] mb-10 leading-relaxed max-w-2xl">
        {isEn
          ? 'Two of the most sought-after luxury brands in Bangkok — but which gives better value pre-owned? LV retains 65–75% of its retail price; Gucci typically 50–65%. Here\'s how they compare item by item.'
          : 'สองแบรนด์ที่ต้องการมากที่สุดในกรุงเทพฯ — แต่อันไหนคุ้มกว่าเมื่อซื้อมือสอง? LV รักษามูลค่าไว้ 65–75% ของราคาใหม่ Gucci ประมาณ 50–65% มาดูการเปรียบเทียบรายไอเทม'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {renderItems(lvItems, 'Louis Vuitton', isEn ? '65–75% retained' : 'รักษามูลค่า 65–75%')}
        {renderItems(gucciItems, 'Gucci', isEn ? '50–65% retained' : 'รักษามูลค่า 50–65%')}
      </div>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Buy Decision Guide' : 'คู่มือการตัดสินใจซื้อ'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#6B6052]">
          <div>
            <p className="font-medium text-[#1A1A1A] mb-2">{isEn ? 'Buy LV if…' : 'ซื้อ LV ถ้า…'}</p>
            <ul className="space-y-1.5">
              <li>{'→ '}{isEn ? 'You want to resell in 2–3 years' : 'ต้องการขายต่อใน 2–3 ปี'}</li>
              <li>{'→ '}{isEn ? 'Classic Monogram canvas appeals to you' : 'ชอบผ้า Monogram Canvas คลาสสิก'}</li>
              <li>{'→ '}{isEn ? 'Practicality and durability are priorities' : 'ให้ความสำคัญกับความทนทาน'}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-[#1A1A1A] mb-2">{isEn ? 'Buy Gucci if…' : 'ซื้อ Gucci ถ้า…'}</p>
            <ul className="space-y-1.5">
              <li>{'→ '}{isEn ? 'Budget is tighter and style variety matters' : 'งบจำกัดและต้องการความหลากหลายทางสไตล์'}</li>
              <li>{'→ '}{isEn ? 'You love seasonal colourways and patterns' : 'ชอบสีและลายตามฤดูกาล'}</li>
              <li>{'→ '}{isEn ? 'Entry-level belts or accessories appeal' : 'สนใจเข็มขัดหรืออุปกรณ์เสริมระดับเริ่มต้น'}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#E8E2D9] pb-6">
              <h3 className="text-[#1A1A1A] font-medium mb-2">{faq.q}</h3>
              <p className="text-[#6B6052] text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
