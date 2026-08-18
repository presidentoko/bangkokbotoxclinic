import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/dior'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Dior Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `ไดออร์มือสองในไทย: ราคากระเป๋าและสินค้า ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Current pre-owned Dior prices in Thailand (THB). Lady Dior, Saddle Bag, Book Tote — compare second-hand prices by condition.'
      : 'ราคา Dior มือสองในไทย (บาท) Lady Dior, Saddle Bag, Book Tote เปรียบเทียบราคาตามสภาพ',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Where can I buy pre-owned Dior in Thailand?',
    a: 'The most reliable platforms for authenticated pre-owned Dior in Thailand are Vestiaire Collective (ships internationally with authentication), Carousell Thailand (local, more affordable, less authentication), and dedicated luxury resellers in Bangkok such as those in Emporium and Central Embassy. Always request an authenticity card or certificate.',
  },
  {
    q: 'How do I authenticate a Lady Dior bought in Thailand?',
    a: "The Lady Dior's serial number is on a small oval plate inside the bag. The cannage quilting should be perfectly uniform — uneven stitch depth is a common fake tell. The Dior charm letters should be heavy metal with no flaking. In Thailand, LUXE Authentics and Re-bag offer paid authentication services.",
  },
  {
    q: 'Are pre-owned Dior prices cheaper in Thailand than abroad?',
    a: 'Pre-owned Dior prices in Thailand (THB) often track closely with international USD prices converted at current exchange rates. Local Carousell listings can be 10–20% cheaper than Vestiaire due to lower overhead, but authentication risk is higher. Japanese pre-owned platforms (Mercari JP, brand resellers) sometimes offer better value including shipping.',
  },
  {
    q: 'Which Dior bag is most popular in the Thai pre-owned market?',
    a: 'The Lady Dior in black and blush pink are consistently the most searched Dior bags in Thailand. The Saddle Bag also has strong demand. The Book Tote is popular but its wide price variation (depending on print) makes it trickier to value. For budget-conscious buyers, the 30 Montaigne offers strong Dior design at lower pre-owned prices.',
  },
]

const faqsTh = [
  {
    q: 'ซื้อ Dior มือสองในไทยได้ที่ไหน?',
    a: 'แพลตฟอร์มที่น่าเชื่อถือที่สุดสำหรับ Dior มือสองในไทยคือ Vestiaire Collective (ส่งระหว่างประเทศพร้อมการตรวจสอบความแท้), Carousell ไทย (ในประเทศ ราคาถูกกว่า แต่การตรวจสอบน้อยกว่า) และร้านค้า luxury reseller ในกรุงเทพฯ เช่น ในเอ็มโพเรียมและเซ็นทรัล เอ็มบาสซี ควรขอใบรับรองความแท้ทุกครั้ง',
  },
  {
    q: 'วิธีตรวจสอบ Lady Dior ที่ซื้อในไทยว่าของแท้ไหม?',
    a: 'เลขซีเรียลของ Lady Dior อยู่บนแผ่นโลหะรูปไข่ภายในกระเป๋า การเย็บ cannage quilting ควรสม่ำเสมอ — ความลึกของตะเข็บที่ไม่เท่ากันเป็นสัญญาณของของปลอม อักษร Dior charm ควรเป็นโลหะหนักที่ไม่หลุดร่อน ในไทย LUXE Authentics และ Re-bag มีบริการตรวจสอบแบบชำระเงิน',
  },
  {
    q: 'ราคา Dior มือสองในไทยถูกกว่าต่างประเทศไหม?',
    a: 'ราคา Dior มือสองในไทย (บาท) มักใกล้เคียงกับราคา USD ระหว่างประเทศที่แปลงตามอัตราแลกเปลี่ยนปัจจุบัน ประกาศใน Carousell ในประเทศอาจถูกกว่า Vestiaire 10–20% เนื่องจากต้นทุนต่ำกว่า แต่ความเสี่ยงด้านการตรวจสอบสูงกว่า แพลตฟอร์มมือสองของญี่ปุ่นบางครั้งให้ราคาที่ดีกว่ารวมค่าส่ง',
  },
  {
    q: 'กระเป๋า Dior รุ่นไหนขายดีที่สุดในตลาดมือสองไทย?',
    a: 'Lady Dior สีดำและสีชมพูบลัชเป็นกระเป๋า Dior ที่ค้นหามากที่สุดในไทย Saddle Bag ก็มีความต้องการสูง Book Tote เป็นที่นิยมแต่ราคามีความผันผวนสูงตามลาย สำหรับผู้ซื้อที่มีงบจำกัด 30 Montaigne มีดีไซน์ Dior ที่โดดเด่นในราคามือสองที่เข้าถึงได้มากกว่า',
  },
]

export default async function DiorBrandThPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const items = getItemsByBrand('dior').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
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
    name: isEn ? 'Pre-Owned Dior Thailand Price Guide 2025' : 'ราคา Dior มือสองในไทย 2025',
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
        {' › Dior'}
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">{isEn ? 'Brand Price Guide' : 'ราคาแบรนด์'}</p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Pre-Owned Dior in Thailand: Price Guide {PRICE_YEAR}' : 'ไดออร์มือสองในไทย: ราคากระเป๋าและสินค้า {PRICE_YEAR}'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">
        {isEn ? `Updated {PRICE_YEAR} · ${items.length} models tracked` : `อัปเดต 2025 · ติดตาม ${items.length} รุ่น`}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {isEn
            ? "Christian Dior's pre-owned market is one of the most stable in luxury. The Lady Dior holds value exceptionally well while the Saddle Bag has seen explosive resurgence. In Thailand, pre-owned Dior is increasingly accessible through both local platforms and international authenticated sellers shipping to Bangkok."
            : "ตลาดมือสองของ Christian Dior เป็นหนึ่งในตลาดที่มีเสถียรภาพมากที่สุดในวงการ luxury Lady Dior ยังคงมูลค่าได้ดีเยี่ยม ในขณะที่ Saddle Bag กลับมาได้รับความนิยมอย่างรวดเร็ว ในไทย Dior มือสองเข้าถึงได้มากขึ้นทั้งผ่านแพลตฟอร์มในประเทศและผู้ขายระหว่างประเทศที่ผ่านการตรวจสอบที่ส่งถึงกรุงเทพฯ"}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Pre-Owned Dior Price Table (THB)' : 'ตารางราคา Dior มือสอง (บาท)'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Model' : 'รุ่น'}</th>
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

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2 className="font-serif text-lg text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Key Buying Advice' : 'คำแนะนำสำคัญในการซื้อ'}
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          {isEn
            ? "Lady Dior in cannage lambskin is the most counterfeited Dior bag — buy only from authenticated platforms. Saddle Bag in Oblique canvas is the safer buy: the woven canvas is harder to fake convincingly. In Thailand, always request an authentication certificate and compare serial number format against verified Dior databases."
            : "Lady Dior ในหนังแกะ cannage เป็นกระเป๋า Dior ที่ถูกปลอมแปลงมากที่สุด ซื้อจากแพลตฟอร์มที่ผ่านการตรวจสอบเท่านั้น Saddle Bag ใน Oblique canvas เป็นตัวเลือกที่ปลอดภัยกว่า เนื้อผ้าทอยากต่อการปลอมแปลงอย่างสมจริง ในไทย ควรขอใบรับรองการตรวจสอบและเปรียบเทียบรูปแบบหมายเลขซีเรียลกับฐานข้อมูล Dior ที่ได้รับการยืนยัน"}
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
