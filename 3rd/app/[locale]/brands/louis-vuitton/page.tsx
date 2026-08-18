import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/louis-vuitton'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Louis Vuitton Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Louis Vuitton มือสองในไทย — ราคาและรุ่นที่คุ้มค่าในปี ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Pre-owned Louis Vuitton prices in Thailand (THB). Neverfull, Speedy, Alma and more — compare second-hand values by condition.'
      : 'ราคา Louis Vuitton มือสองในไทย (บาท) Neverfull, Speedy, Alma และอื่นๆ เปรียบเทียบมูลค่ามือสองตามสภาพ',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Which Louis Vuitton bags hold value best in Thailand?',
    a: 'LV Monogram canvas pieces retain value best — Neverfull MM holds 65–75%, Speedy 30 retains 60–70%. Epi leather pieces also hold well. Vernis leather and Damier Azur are popular but depreciate slightly faster. Limited editions and collaborations (Supreme, Yayoi Kusama) often appreciate, but liquidity can be lower.',
  },
  {
    q: 'Is pre-owned LV a good buy in Thailand?',
    a: 'Yes — LV is the most liquid luxury brand in Thailand. Pieces sell quickly on Carousell Thailand and Facebook Marketplace. The wide availability of pre-owned LV also means prices are competitive. The Monogram Neverfull is arguably the best-value pre-owned luxury purchase in Thailand: recognisable, durable, practical, and easy to resell.',
  },
  {
    q: 'How can I tell if a Louis Vuitton bag is real in Thailand?',
    a: "Key authentication markers: the date code (now replaced by RFID microchip on newer pieces) should follow the correct format for the year. Monogram canvas should have even, clean pattern cuts at seams — never cut through a monogram. The interior gold-tone LV heat stamp should be perfectly centred. Stitching is always amber/mustard, not yellow or white. Hardware engraving reads 'LOUIS VUITTON' in all capitals with correct font.",
  },
  {
    q: 'What is the cheapest Louis Vuitton pre-owned in Thailand?',
    a: 'LV card holders and small accessories start from approximately ฿6,000–฿12,000 in very good condition. The Pochette Accessoires is the most affordable pre-owned bag, starting around ฿18,000. The Speedy 25 and 30 start from ฿22,000–฿35,000 depending on condition. All prices reflect Carousell Thailand and Vestiaire listings.',
  },
]

const faqsTh = [
  {
    q: 'กระเป๋า Louis Vuitton รุ่นไหนรักษามูลค่าได้ดีที่สุดในไทย?',
    a: 'รุ่น LV Monogram Canvas รักษามูลค่าได้ดีที่สุด — Neverfull MM รักษาไว้ 65–75%, Speedy 30 รักษาไว้ 60–70% หนัง Epi ก็รักษามูลค่าได้ดี Vernis leather และ Damier Azur เป็นที่นิยมแต่ลดค่าเร็วกว่าเล็กน้อย รุ่น limited edition และ collaboration (Supreme, Yayoi Kusama) มักแข็งค่า แต่สภาพคล่องอาจต่ำกว่า',
  },
  {
    q: 'LV มือสองคุ้มค่าที่จะซื้อในไทยไหม?',
    a: 'คุ้มมาก — LV เป็นแบรนด์ luxury ที่มีสภาพคล่องสูงที่สุดในไทย ชิ้นงานขายได้รวดเร็วบน Carousell Thailand และ Facebook Marketplace ความพร้อมของ LV มือสองที่หลากหลายทำให้ราคาแข่งขันได้ Neverfull Monogram อาจเป็นการซื้อ luxury มือสองที่คุ้มค่าที่สุดในไทย: เป็นที่รู้จัก ทนทาน ใช้งานได้ดี และขายต่อง่าย',
  },
  {
    q: 'วิธีดูกระเป๋า Louis Vuitton ของแท้ในไทย?',
    a: 'จุดตรวจสอบหลัก: date code (ปัจจุบันแทนที่ด้วยไมโครชิป RFID ในรุ่นใหม่) ควรตรงตามรูปแบบของปีนั้น Monogram Canvas ควรมีลายที่ตัดอย่างเท่ากันและสะอาดที่รอยต่อ — ไม่มีการตัดผ่านโมโนแกรม LV heat stamp สีทองภายในควรอยู่ตรงกลางพอดี การเย็บเป็นสีอำพัน/มัสตาร์ดเสมอ ไม่ใช่สีเหลืองหรือขาว การแกะสลักฮาร์ดแวร์ระบุ "LOUIS VUITTON" ตัวพิมพ์ใหญ่ทั้งหมดพร้อมฟอนต์ที่ถูกต้อง',
  },
  {
    q: 'Louis Vuitton มือสองราคาถูกที่สุดในไทยเริ่มที่เท่าไหร่?',
    a: 'Card holder และอุปกรณ์เสริมขนาดเล็กของ LV เริ่มต้นประมาณ ฿6,000–฿12,000 ในสภาพดีมาก Pochette Accessoires เป็นกระเป๋ามือสองที่ราคาเข้าถึงได้มากที่สุด เริ่มต้นประมาณ ฿18,000 Speedy 25 และ 30 เริ่มต้นที่ ฿22,000–฿35,000 ขึ้นอยู่กับสภาพ ราคาทั้งหมดอ้างอิงจากประกาศใน Carousell Thailand และ Vestiaire',
  },
]

export default async function LouisVuittonBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const items = getItemsByBrand('louis-vuitton').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
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

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isEn ? 'Pre-Owned Louis Vuitton Thailand Price Guide 2025' : 'ราคา Louis Vuitton มือสองในไทย 2025',
    url: `${BASE}/${locale}/${SLUG}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${BASE}/${locale}/${item.slug}`,
      name: `${isEn ? 'Pre-Owned' : 'มือสอง'} ${item.brand} ${item.model}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [itemListSchema, faqSchema] }) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        {isEn ? 'Brands' : 'แบรนด์'}
        {' › Louis Vuitton'}
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">{isEn ? 'Brand Price Guide' : 'ราคาแบรนด์'}</p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Pre-Owned Louis Vuitton in Thailand {PRICE_YEAR}' : 'Louis Vuitton มือสองในไทย — ราคาและรุ่นที่คุ้มค่าในปี {PRICE_YEAR}'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">
        {isEn ? `Updated {PRICE_YEAR} · ${items.length} models tracked` : `อัปเดต 2025 · ติดตาม ${items.length} รุ่น`}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {isEn
            ? "Louis Vuitton has the most active pre-owned market in Thailand. Monogram canvas pieces are ubiquitous and well-priced; Epi leather and exotic pieces are harder to find."
            : 'Louis Vuitton มีตลาดมือสองที่คึกคักที่สุดในไทย กระเป๋า Monogram Canvas หาได้ง่ายและราคาดี'}
        </p>
      </section>

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            {isEn ? 'Pre-Owned Louis Vuitton Price Table (THB)' : 'ตารางราคา Louis Vuitton มือสอง (บาท)'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2D9]">
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Model' : 'รุ่น'}</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Category' : 'หมวด'}</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Pre-Owned Avg' : 'เฉลี่ยมือสอง'}</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Retail' : 'ราคาใหม่'}</th>
                  <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Savings' : 'ประหยัด'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {items.map(item => {
                  const vg = item.price_ranges.very_good!
                  const avg = getAvgPrice(vg)
                  const savingsPct = Math.round((1 - avg / item.retail_price_thb) * 100)
                  return (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <a href={`/${locale}/${item.slug}`} className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors">
                          {item.model}
                        </a>
                      </td>
                      <td className="py-3 pr-4 text-[#9C8B7A] text-xs capitalize">{item.category.replace('-', ' ')}</td>
                      <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPriceTHB(avg)}</td>
                      <td className="py-3 pr-4 text-[#9C8B7A]">{formatPriceTHB(item.retail_price_thb)}</td>
                      <td className={`py-3 font-medium text-sm ${savingsPct > 0 ? 'text-[#4A7A35]' : 'text-[#8C7355]'}`}>
                        {savingsPct > 0 ? `-${savingsPct}%` : `+${Math.abs(savingsPct)}%`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2 className="font-serif text-lg text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Key Buying Advice' : 'คำแนะนำสำคัญในการซื้อ'}
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          {isEn
            ? "Buy Monogram canvas for maximum resale liquidity. For first-time buyers, the Neverfull MM or Speedy 30 are the safest choices — both are extremely well documented with extensive authentication resources online. Avoid sellers who cannot provide the date code or show clear interior photos. The Thai LV pre-owned market is generally well-supplied, so never feel pressured to overpay."
            : 'ซื้อ Monogram Canvas เพื่อสภาพคล่องในการขายต่อสูงสุด สำหรับผู้ซื้อครั้งแรก Neverfull MM หรือ Speedy 30 เป็นตัวเลือกที่ปลอดภัยที่สุด — ทั้งคู่มีเอกสารอ้างอิงด้านการตรวจสอบออนไลน์มากมาย หลีกเลี่ยงผู้ขายที่ไม่สามารถระบุ date code หรือแสดงภาพภายในที่ชัดเจน ตลาด LV มือสองในไทยมีสินค้าอย่างเพียงพอ จึงไม่ต้องรีบจ่ายเกินราคา'}
        </p>
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
