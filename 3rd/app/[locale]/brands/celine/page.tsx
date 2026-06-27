import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/celine'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Pre-Owned Celine in Thailand 2025 | ChicPreowned'
      : 'Celine มือสองในไทย 2025 — ราคาและรุ่นยอดนิยม | ChicPreowned',
    description: isEn
      ? "Pre-owned Celine prices in Thailand (THB). Luggage, Classic Box, Phantom — compare Philo-era vs Slimane-era values on the Thai secondary market."
      : 'ราคา Celine มือสองในไทย (บาท) เปรียบเทียบยุค Philo กับยุค Slimane Luggage, Classic Box, Phantom',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Which Celine era is more valuable pre-owned — Philo or Slimane?',
    a: 'Phoebe Philo-era pieces (Luggage, Classic Box, Phantom, Trio) consistently command 10–30% premiums above their original retail prices on the secondary market. Hedi Slimane-era bags typically sell at 50–70% of retail. If investment value matters, Philo-era pieces are the clear winner.',
  },
  {
    q: 'Where can I buy pre-owned Celine in Thailand?',
    a: 'Vestiaire Collective is the most reliable source for authenticated Philo-era Celine shipping to Thailand. Carousell Thailand has local listings at more competitive prices but with higher authentication risk. Dedicated luxury resellers in Emporium and Icon Siam occasionally stock Celine.',
  },
  {
    q: 'Is the Celine Luggage Tote a good investment in Thailand?',
    a: 'The Philo-era Luggage Tote in leather is one of the most coveted pre-owned pieces in Thailand. Mini Luggage bags in rare colours trade above original retail. Nano Luggage bags are the most accessible entry point, starting from approximately ฿45,000 in very good condition.',
  },
  {
    q: 'How do I authenticate a pre-owned Celine bag in Thailand?',
    a: 'Philo-era Celine bags have a distinctive oval debossed logo inside the bag. Hardware should feel heavy with no tarnishing. Stitching on the Luggage Tote trapeze shape should be perfectly even. In Bangkok, LUXE Authentics and Rebagged offer paid authentication services for Celine.',
  },
]

const faqsTh = [
  {
    q: 'Celine ยุคไหนมีมูลค่ามือสองสูงกว่า — Philo หรือ Slimane?',
    a: 'รุ่นยุค Phoebe Philo (Luggage, Classic Box, Phantom, Trio) มีราคาในตลาดมือสองสูงกว่าราคาขายตอนนั้น 10–30% อย่างสม่ำเสมอ รุ่นยุค Hedi Slimane มักขายที่ 50–70% ของราคาใหม่ หากต้องการลงทุน รุ่นยุค Philo ชนะชัดเจน',
  },
  {
    q: 'ซื้อ Celine มือสองในไทยได้ที่ไหน?',
    a: 'Vestiaire Collective เป็นแหล่งที่น่าเชื่อถือที่สุดสำหรับ Celine ยุค Philo ที่ผ่านการตรวจสอบและส่งถึงไทย Carousell Thailand มีประกาศในประเทศในราคาที่แข่งขันได้แต่ความเสี่ยงในการตรวจสอบสูงกว่า ร้าน luxury reseller ในเอ็มโพเรียมและไอคอนสยามบางครั้งมี Celine ด้วย',
  },
  {
    q: 'Celine Luggage Tote คุ้มแก่การลงทุนในไทยไหม?',
    a: 'Luggage Tote ยุค Philo ในหนังแท้เป็นหนึ่งในสินค้ามือสองที่ต้องการมากที่สุดในไทย Mini Luggage สีหายากซื้อขายเหนือราคาขายเดิม Nano Luggage เป็นจุดเข้าที่เข้าถึงได้มากที่สุด เริ่มต้นประมาณ ฿45,000 ในสภาพดีมาก',
  },
  {
    q: 'วิธีตรวจสอบกระเป๋า Celine มือสองในไทย?',
    a: 'กระเป๋า Celine ยุค Philo มีโลโก้นูนรูปไข่ที่ชัดเจนด้านในกระเป๋า ฮาร์ดแวร์ควรรู้สึกหนักและไม่มีคราบสนิม การเย็บบน Luggage Tote ควรเท่ากันอย่างสมบูรณ์ ในกรุงเทพฯ LUXE Authentics และ Rebagged มีบริการตรวจสอบ Celine แบบชำระเงิน',
  },
]

export default async function CelineBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const items = getItemsByBrand('celine').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
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
    name: isEn ? 'Pre-Owned Celine Thailand Price Guide 2025' : 'ราคา Celine มือสองในไทย 2025',
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
        {' › Celine'}
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">{isEn ? 'Brand Price Guide' : 'ราคาแบรนด์'}</p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Pre-Owned Celine in Thailand 2025' : 'Celine มือสองในไทย 2025 — ราคาและรุ่นยอดนิยม'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">
        {isEn ? `Updated 2025 · ${items.length} models tracked` : `อัปเดต 2025 · ติดตาม ${items.length} รุ่น`}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {isEn
            ? "Celine's pre-owned market splits sharply: Phoebe Philo-era pieces (Luggage, Classic Box, Phantom) command strong premiums. Hedi Slimane's era sells closer to retail."
            : 'ตลาด Celine มือสองแบ่งชัดเจน: รุ่นยุค Phoebe Philo ราคาสูงกว่า รุ่นยุค Hedi Slimane ราคาใกล้เคียงของใหม่'}
        </p>
      </section>

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            {isEn ? 'Pre-Owned Celine Price Table (THB)' : 'ตารางราคา Celine มือสอง (บาท)'}
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
      )}

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2 className="font-serif text-lg text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Philo vs Slimane Era Buying Guide' : 'คู่มือซื้อ: ยุค Philo vs ยุค Slimane'}
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          {isEn
            ? "If resale value matters, prioritise Philo-era pieces — especially the Luggage Tote in leather, the Classic Box, and the Trio clutch. These hold value exceptionally well and are increasingly scarce in good condition. Slimane-era pieces offer stronger aesthetics for fashion-forward buyers and trade at accessible pre-owned discounts."
            : 'หากมูลค่าการขายต่อสำคัญ ให้ให้ความสำคัญกับรุ่นยุค Philo — โดยเฉพาะ Luggage Tote หนัง, Classic Box และ Trio clutch รุ่นเหล่านี้รักษามูลค่าได้ดีมากและหายากขึ้นในสภาพดี รุ่นยุค Slimane เหมาะสำหรับผู้ซื้อที่ชื่นชอบแฟชั่นและซื้อขายในราคามือสองที่เข้าถึงได้'}
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
