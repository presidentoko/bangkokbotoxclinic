import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/hermes'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Hermès Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Hermès มือสองในไทย ${PRICE_YEAR} — คู่มือซื้อ — ราคา Birkin Kelly และอื่นๆ | ChicPreowned`,
    description: isEn
      ? 'Pre-owned Hermès prices in Thailand (THB). Birkin, Kelly, Constance — many trade above retail. Compare by condition on the Thai secondary market.'
      : 'ราคา Hermès มือสองในไทย (บาท) Birkin, Kelly, Constance — หลายรุ่นราคาเกินของใหม่ เปรียบเทียบตามสภาพ',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Why are Hermès bags more expensive pre-owned than retail in Thailand?',
    a: 'Hermès restricts sales at retail — new customers typically cannot walk in and buy a Birkin or Kelly. The boutique requires a purchase history and relationship with an SA (sales associate). This artificial scarcity pushes secondary market prices above retail, with Birkins trading 20–80% above their original price depending on leather, colour, and hardware.',
  },
  {
    q: 'Which Hermès bags trade above retail in Thailand?',
    a: 'Birkin 25, Birkin 30, Kelly 25, and Kelly 28 in exotic leathers (crocodile, ostrich) or rare colours like Rose Shocking or Vert Bosphore trade significantly above retail. Even standard Togo and Clemence Birkins command premiums. The Constance and Mini Kelly also hold value exceptionally well.',
  },
  {
    q: 'Where can I buy authentic Hermès pre-owned in Thailand?',
    a: 'Vestiaire Collective is the most secure platform for authenticated Hermès shipping to Thailand. Certified local dealers in Bangkok (Emporium, Central Embassy area) also stock authenticated pieces. Be extremely cautious on Carousell Thailand — Hermès is the most counterfeited brand in Thailand and fakes are sophisticated.',
  },
  {
    q: 'Is it worth buying Hermès pre-owned if prices are above retail?',
    a: "For buyers who cannot access the boutique allocation system, pre-owned is the only realistic path to ownership. For investment, Hermès in standard colours and Togo/Clemence leather has shown consistent appreciation of 5–15% per year over the last decade. It's the only luxury brand that functions as a genuine alternative investment asset.",
  },
]

const faqsTh = [
  {
    q: 'ทำไมกระเป๋า Hermès มือสองถึงแพงกว่าของใหม่ในไทย?',
    a: 'Hermès จำกัดการขายในบูติค — ลูกค้าใหม่ไม่สามารถเดินเข้าไปซื้อ Birkin หรือ Kelly ได้ทันที บูติคต้องการประวัติการซื้อและความสัมพันธ์กับ SA (พนักงานขาย) การขาดแคลนเทียมนี้ทำให้ราคาตลาดมือสองสูงกว่าราคาใหม่ โดย Birkin ซื้อขายเหนือราคาเดิม 20–80% ขึ้นอยู่กับหนัง สี และฮาร์ดแวร์',
  },
  {
    q: 'กระเป๋า Hermès รุ่นไหนที่ราคาเกินของใหม่ในไทย?',
    a: 'Birkin 25, Birkin 30, Kelly 25 และ Kelly 28 ในหนังเอ็กโซติก (จระเข้, นกกระจอกเทศ) หรือสีหายาก เช่น Rose Shocking หรือ Vert Bosphore มีราคาสูงกว่าของใหม่มาก แม้แต่ Birkin ใน Togo และ Clemence มาตรฐานก็ยังมีราคาพรีเมียม Constance และ Mini Kelly ก็รักษามูลค่าได้ดีมาก',
  },
  {
    q: 'ซื้อ Hermès มือสองแท้ได้ที่ไหนในไทย?',
    a: 'Vestiaire Collective เป็นแพลตฟอร์มที่ปลอดภัยที่สุดสำหรับ Hermès ที่ผ่านการตรวจสอบและส่งถึงไทย ดีลเลอร์ในกรุงเทพฯ (แถวเอ็มโพเรียม, เซ็นทรัล เอ็มบาสซี) ก็มีชิ้นที่ผ่านการตรวจสอบ ระวังมากบน Carousell Thailand — Hermès เป็นแบรนด์ที่ถูกปลอมแปลงมากที่สุดในไทยและของปลอมมีความซับซ้อนสูง',
  },
  {
    q: 'คุ้มไหมที่จะซื้อ Hermès มือสองในราคาที่เกินของใหม่?',
    a: 'สำหรับผู้ซื้อที่ไม่สามารถเข้าถึงระบบการจัดสรรของบูติค มือสองเป็นเส้นทางที่ใช้ได้จริงเพียงทางเดียว สำหรับการลงทุน Hermès ในสีมาตรฐานและหนัง Togo/Clemence แสดงการแข็งค่าอย่างต่อเนื่อง 5–15% ต่อปีในทศวรรษที่ผ่านมา เป็นแบรนด์ luxury เพียงยี่ห้อเดียวที่ทำงานเป็นสินทรัพย์ลงทุนทางเลือกที่แท้จริง',
  },
]

export default async function HermesBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const allItems = getItemsByBrand('hermes').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
  const aboveRetail = allItems.filter(i => {
    const avg = getAvgPrice(i.price_ranges.very_good!)
    return avg > i.retail_price_thb
  })
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
    name: isEn ? 'Pre-Owned Hermès Thailand Price Guide 2025' : 'ราคา Hermès มือสองในไทย 2025',
    url: `${BASE}/${locale}/${SLUG}`,
    numberOfItems: allItems.length,
    itemListElement: allItems.map((item, idx) => ({
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
        {' › Hermès'}
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">{isEn ? 'Brand Price Guide' : 'ราคาแบรนด์'}</p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Pre-Owned Hermès in Thailand {PRICE_YEAR}' : 'Hermès มือสองในไทย {PRICE_YEAR} — ราคา Birkin Kelly และอื่นๆ'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">
        {isEn ? `Updated {PRICE_YEAR} · ${allItems.length} models tracked` : `อัปเดต 2025 · ติดตาม ${allItems.length} รุ่น`}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {isEn
            ? "Hermès is the only luxury brand where pre-owned prices regularly exceed retail. In Thailand, Birkin and Kelly bags trade at 20-80% above retail on the secondary market."
            : 'Hermès เป็นแบรนด์เดียวที่ราคามือสองสูงกว่าของใหม่ ในไทย Birkin และ Kelly ซื้อขายในราคาสูงกว่าของใหม่ 20-80%'}
        </p>
      </section>

      {aboveRetail.length > 0 && (
        <section className="mb-6 p-4 bg-[#FFF8EE] border border-[#B8954A]">
          <p className="text-sm font-medium text-[#B8954A]">
            {isEn
              ? `${aboveRetail.length} of ${allItems.length} tracked models currently trade above retail`
              : `${allItems.length} รุ่นที่ติดตาม พบ ${aboveRetail.length} รุ่นที่ซื้อขายเกินราคาใหม่`}
          </p>
        </section>
      )}

      {allItems.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            {isEn ? 'Pre-Owned Hermès Price Table (THB)' : 'ตารางราคา Hermès มือสอง (บาท)'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2D9]">
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Model' : 'รุ่น'}</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Pre-Owned Avg' : 'เฉลี่ยมือสอง'}</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Retail' : 'ราคาใหม่'}</th>
                  <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'vs Retail' : 'เทียบของใหม่'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {allItems.map(item => {
                  const vg = item.price_ranges.very_good!
                  const avg = getAvgPrice(vg)
                  const pct = Math.round(((avg - item.retail_price_thb) / item.retail_price_thb) * 100)
                  const isAbove = pct > 0
                  return (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <a href={`/${locale}/${item.slug}`} className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors">
                          {item.model}
                        </a>
                        {isAbove && (
                          <span className="ml-2 text-xs bg-[#B8954A] text-white px-1.5 py-0.5">
                            {isEn ? 'Above Retail' : 'เกินของใหม่'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPriceTHB(avg)}</td>
                      <td className="py-3 pr-4 text-[#9C8B7A]">{formatPriceTHB(item.retail_price_thb)}</td>
                      <td className={`py-3 font-medium text-sm ${isAbove ? 'text-[#B8954A]' : 'text-[#4A7A35]'}`}>
                        {isAbove ? `+${pct}%` : `-${Math.abs(pct)}%`}
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
          {isEn ? 'Buying Advice' : 'คำแนะนำในการซื้อ'}
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          {isEn
            ? "Never buy Hermès from an unverified seller in Thailand. The brand is the most counterfeited in the luxury market and fakes are increasingly sophisticated. For pieces above ฿200,000, always use Vestiaire Collective or a certified reseller. Request the full provenance history — original receipt, dust bag, and box significantly affect both authenticity confidence and resale value."
            : 'อย่าซื้อ Hermès จากผู้ขายที่ไม่ได้รับการยืนยันในไทย แบรนด์นี้เป็นที่ถูกปลอมแปลงมากที่สุดในตลาด luxury และของปลอมมีความซับซ้อนมากขึ้น สำหรับชิ้นงานเกิน ฿200,000 ควรใช้ Vestiaire Collective หรือ reseller ที่ได้รับการรับรองเสมอ ขอประวัติแหล่งที่มาครบถ้วน — ใบเสร็จเดิม, ถุงผ้า และกล่องส่งผลต่อความเชื่อมั่นในความแท้และมูลค่าขายต่ออย่างมีนัยสำคัญ'}
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
