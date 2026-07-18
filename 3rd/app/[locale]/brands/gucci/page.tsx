import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/gucci'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Pre-Owned Gucci in Thailand 2025 | ChicPreowned'
      : 'Gucci มือสองในไทย — ราคาและรุ่นที่น่าซื้อในตลาดไทย | ChicPreowned',
    description: isEn
      ? 'Pre-owned Gucci prices in Thailand (THB). GG Marmont, Horsebit 1955, Ophidia — compare second-hand values by condition.'
      : 'ราคา Gucci มือสองในไทย (บาท) GG Marmont, Horsebit 1955, Ophidia เปรียบเทียบมูลค่ามือสองตามสภาพ',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Which Gucci bags hold their value best in Thailand?',
    a: 'The GG Marmont in black matelassé leather has the strongest resale value in Thailand, retaining 60–70% of retail. The Horsebit 1955 and Dionysus also hold relatively well. Limited edition and collaboration pieces can appreciate, but core collection bags depreciate to 50–60% of retail within 2–3 years.',
  },
  {
    q: 'Is pre-owned Gucci worth buying in Thailand?',
    a: 'Yes — Gucci pre-owned offers excellent value, especially for buyers who prefer the aesthetic over strict investment return. Entry pieces like the GG Marmont Mini and Gucci belts can be found from ฿7,000–฿15,000. Full-size bags in very good condition typically range from ฿20,000 to ฿60,000.',
  },
  {
    q: 'How do I spot a fake Gucci bag in Thailand?',
    a: 'Key authentication tells: the double-G logo should be perfectly symmetrical with both Gs touching at a single point. On GG canvas, the pattern should align perfectly at seams. Hardware engravings on authentic Gucci are deep and sharp. The interior lining should feel smooth and smell of leather — not plasticky or chemical.',
  },
  {
    q: 'Where is the best place to buy pre-owned Gucci in Bangkok?',
    a: 'Carousell Thailand has the largest local selection of Gucci pre-owned at negotiable prices. Vestiaire Collective offers internationally authenticated pieces shipping to Thailand. For in-person browsing, luxury resellers in Emporium Shopping Centre and Siam Paragon basement often carry authenticated Gucci.',
  },
]

const faqsTh = [
  {
    q: 'กระเป๋า Gucci รุ่นไหนรักษามูลค่าได้ดีที่สุดในไทย?',
    a: 'GG Marmont ในหนัง matelassé สีดำมีมูลค่าขายต่อที่แข็งแกร่งที่สุดในไทย รักษามูลค่าไว้ 60–70% ของราคาใหม่ Horsebit 1955 และ Dionysus ก็รักษามูลค่าได้ดีพอสมควร รุ่น limited edition อาจมีมูลค่าเพิ่มขึ้น แต่กระเป๋า core collection มักลดลงเหลือ 50–60% ของราคาใหม่ภายใน 2–3 ปี',
  },
  {
    q: 'คุ้มไหมที่จะซื้อ Gucci มือสองในไทย?',
    a: 'คุ้มมาก — Gucci มือสองให้คุณค่าที่ดีเยี่ยม โดยเฉพาะสำหรับผู้ซื้อที่ชื่นชอบสไตล์มากกว่าผลตอบแทนการลงทุน ไอเทมเริ่มต้นอย่าง GG Marmont Mini และเข็มขัด Gucci หาได้จาก ฿7,000–฿15,000 กระเป๋าขนาดเต็มในสภาพดีมากมักอยู่ที่ ฿20,000–฿60,000',
  },
  {
    q: 'วิธีดูกระเป๋า Gucci ปลอมในไทย?',
    a: 'จุดตรวจสอบหลัก: โลโก้ GG คู่ต้องสมมาตรอย่างสมบูรณ์โดยทั้งสอง G แตะกันที่จุดเดียว บน GG canvas ลายต้องตรงกันอย่างสมบูรณ์ที่รอยต่อ การแกะสลักฮาร์ดแวร์ของแท้ลึกและคมชัด ซับในต้องรู้สึกเรียบและมีกลิ่นหนัง ไม่ใช่กลิ่นพลาสติกหรือสารเคมี',
  },
  {
    q: 'ซื้อ Gucci มือสองที่ไหนดีในกรุงเทพฯ?',
    a: 'Carousell Thailand มีสินค้า Gucci มือสองในประเทศมากที่สุดในราคาที่ต่อรองได้ Vestiaire Collective มีชิ้นที่ผ่านการตรวจสอบระดับนานาชาติและส่งถึงไทย สำหรับการดูสินค้าด้วยตัวเอง ร้าน luxury reseller ในเอ็มโพเรียมและชั้นใต้ดินสยามพารากอนมักมี Gucci ที่ผ่านการรับรอง',
  },
]

export default async function GucciBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const items = getItemsByBrand('gucci').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
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
    name: isEn ? 'Pre-Owned Gucci Thailand Price Guide 2025' : 'ราคา Gucci มือสองในไทย 2025',
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
        {' › Gucci'}
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">{isEn ? 'Brand Price Guide' : 'ราคาแบรนด์'}</p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Pre-Owned Gucci in Thailand 2025' : 'Gucci มือสองในไทย — ราคาและรุ่นที่น่าซื้อในตลาดไทย'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">
        {isEn ? `Updated 2025 · ${items.length} models tracked` : `อัปเดต 2025 · ติดตาม ${items.length} รุ่น`}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {isEn
            ? "Gucci's pre-owned market in Thailand is highly active. The GG Marmont remains the top seller, while Gucci Horsebit 1955 and Ophidia have strong local followings."
            : 'ตลาด Gucci มือสองในไทยคึกคักมาก GG Marmont ขายดีที่สุด ส่วน Horsebit 1955 และ Ophidia ก็เป็นที่นิยม'}
        </p>
      </section>

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            {isEn ? 'Pre-Owned Gucci Price Table (THB)' : 'ตารางราคา Gucci มือสอง (บาท)'}
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
            ? "The GG Marmont Medium in black is the safest first Gucci purchase — highly liquid in the Thai resale market and easy to authenticate. For belts, buy only from authenticated sellers as fake Gucci belts are extremely common in Thailand. The Ophidia series in GG Supreme canvas is durable and ages well."
            : 'GG Marmont Medium สีดำเป็นการซื้อ Gucci ครั้งแรกที่ปลอดภัยที่สุด — มีสภาพคล่องสูงในตลาดขายต่อของไทยและตรวจสอบง่าย สำหรับเข็มขัด ซื้อจากผู้ขายที่ผ่านการรับรองเท่านั้นเนื่องจากเข็มขัด Gucci ปลอมพบเห็นได้ทั่วไปในไทย ซีรีส์ Ophidia ใน GG Supreme Canvas ทนทานและมีอายุการใช้งานยาวนาน'}
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
