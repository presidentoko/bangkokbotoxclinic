import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/chanel-vs-lv'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel vs Louis Vuitton Pre-Owned in Thailand | ChicPreowned'
      : 'Chanel กับ LV มือสอง ในไทย — ซื้ออันไหนดี? | ChicPreowned',
    description: isEn
      ? 'Chanel retains 80–95% of retail, LV 65–75%. Compare pre-owned Chanel and LV prices in Thailand to find which brand suits your budget and goals.'
      : 'Chanel รักษามูลค่า 80–95% ของราคาใหม่ LV 65–75% เปรียบเทียบราคา Chanel และ LV มือสองในไทย',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: {
        en: `${BASE}/en/${SLUG}`,
        th: `${BASE}/th/${SLUG}`,
      },
    },
  }
}

const faqsEn = [
  {
    q: 'Which holds value better — Chanel or LV?',
    a: 'Chanel is in a class of its own: Classic Flap and Boy Bag retain 80–95% of retail, and some pieces trade above retail. LV retains 65–75%, which is still excellent but below Chanel\'s exceptional performance.',
  },
  {
    q: 'Is Chanel harder to find pre-owned in Thailand?',
    a: 'Yes. Chanel pre-owned supply in Thailand is limited compared to LV. Expect narrower selection and higher asking prices. Vestiaire Collective is the most reliable source for authenticated Chanel shipped to Thailand.',
  },
  {
    q: 'What is the entry price for pre-owned Chanel vs LV in Thailand?',
    a: 'Pre-owned LV starts from around ฿6,000 (card holders) and ฿20,000–฿35,000 for entry bags. Pre-owned Chanel starts from around ฿25,000 for small leather goods, with bags beginning at ฿70,000–฿100,000 for WOC and small flaps.',
  },
]

const faqsTh = [
  {
    q: 'Chanel หรือ LV อันไหนรักษามูลค่าได้ดีกว่า?',
    a: 'Chanel อยู่ในระดับที่แตกต่างออกไป: Classic Flap และ Boy Bag รักษามูลค่าไว้ 80–95% ของราคาใหม่ และบางชิ้นซื้อขายสูงกว่าราคาใหม่ LV รักษาไว้ 65–75% ซึ่งยังถือว่าดีมาก แต่ต่ำกว่า Chanel',
  },
  {
    q: 'Chanel มือสองหายากกว่าใน ไทยไหม?',
    a: 'ใช่ ซัพพลาย Chanel มือสองในไทยมีน้อยกว่า LV มาก คาดว่าจะมีตัวเลือกน้อยกว่าและราคาสูงกว่า Vestiaire Collective เป็นแหล่งที่น่าเชื่อถือที่สุดสำหรับ Chanel ที่ผ่านการรับรองและส่งถึงไทย',
  },
  {
    q: 'ราคาเริ่มต้นของ Chanel กับ LV มือสองในไทยต่างกันแค่ไหน?',
    a: 'LV มือสองเริ่มที่ประมาณ ฿6,000 (card holder) และ ฿20,000–฿35,000 สำหรับกระเป๋าเริ่มต้น Chanel มือสองเริ่มที่ประมาณ ฿25,000 สำหรับ SLG และกระเป๋าเริ่มที่ ฿70,000–฿100,000 สำหรับ WOC และ Small Flap',
  },
]

export default async function ChanelVsLvPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const chanelItems = getItemsByBrand('chanel').filter(i => i.price_ranges?.very_good)
  const lvItems = getItemsByBrand('louis-vuitton').filter(i => i.price_ranges?.very_good)

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
        {' › Chanel vs LV'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn
          ? 'Chanel vs Louis Vuitton Pre-Owned in Thailand'
          : 'Chanel กับ LV มือสอง ในไทย — ซื้ออันไหนดี?'}
      </h1>

      <p className="text-[#6B6052] mb-10 leading-relaxed max-w-2xl">
        {isEn
          ? 'Chanel and LV dominate Bangkok\'s pre-owned luxury market. Chanel\'s exceptional value retention (80–95%) comes at a price — higher entry costs and limited supply. LV offers easier access at 65–75% retention. Here\'s how to decide.'
          : 'Chanel และ LV ครองตลาด luxury มือสองในกรุงเทพฯ การรักษามูลค่าที่ยอดเยี่ยมของ Chanel (80–95%) มาพร้อมกับราคาเริ่มต้นที่สูงกว่าและซัพพลายที่จำกัด LV เข้าถึงได้ง่ายกว่าที่ 65–75% มาดูวิธีตัดสินใจ'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {renderItems(chanelItems, 'Chanel', isEn ? '80–95% retained' : 'รักษามูลค่า 80–95%')}
        {renderItems(lvItems, 'Louis Vuitton', isEn ? '65–75% retained' : 'รักษามูลค่า 65–75%')}
      </div>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Key Differences' : 'ความแตกต่างหลัก'}
        </h2>
        <div className="space-y-4 text-sm text-[#6B6052]">
          <div className="border-l-2 border-[#B8954A] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Value Retention' : 'การรักษามูลค่า'}</p>
            <p>{isEn ? 'Chanel Classic Flap has appreciated in retail price every year since 2021, pulling secondary market prices up with it. LV Monogram is stable but not appreciating.' : 'ราคาขายปลีก Chanel Classic Flap เพิ่มขึ้นทุกปีตั้งแต่ปี 2021 ดึงราคาตลาดมือสองขึ้นตาม LV Monogram มีเสถียรภาพแต่ไม่ได้เพิ่มขึ้น'}</p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Availability' : 'ความพร้อมจำหน่าย'}</p>
            <p>{isEn ? 'LV has far greater supply on Carousell TH and Vestiaire. Chanel requires more patience and often sells within hours of listing.' : 'LV มีซัพพลายมากกว่ามากใน Carousell TH และ Vestiaire Chanel ต้องใช้ความอดทนมากกว่าและมักขายหมดภายในไม่กี่ชั่วโมงหลังลงประกาศ'}</p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Entry Price' : 'ราคาเริ่มต้น'}</p>
            <p>{isEn ? 'LV: from ฿6,000 (card holders). Chanel: from ฿25,000 (SLG), ฿70,000+ (bags).' : 'LV: เริ่มจาก ฿6,000 (card holder) Chanel: ฿25,000 (SLG), ฿70,000+ (กระเป๋า)'}</p>
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
