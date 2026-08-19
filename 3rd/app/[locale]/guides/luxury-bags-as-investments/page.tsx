import type { Metadata } from 'next'
import { getAllItems, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/luxury-bags-as-investments'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Are Luxury Bags Good Investments in Thailand? ${PRICE_YEAR} | ChicPreowned`
      : `กระเป๋า Luxury เป็นการลงทุนที่ดีไหม? ข้อมูลปี ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Data-driven guide to luxury bag investment value in Thailand. Which brands and models retain value best? Real THB pre-owned prices ranked by value retention.'
      : 'คู่มือการลงทุนกระเป๋า luxury ในไทยจากข้อมูลจริง แบรนด์และรุ่นไหนรักษามูลค่าได้ดีที่สุด? ราคามือสองจริงในไทย',
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
    q: 'Are luxury bags a good investment in Thailand?',
    a: 'Some are. Hermès Birkin and Kelly bags have shown consistent 10–15% annual appreciation and are now widely considered alternative investments. Chanel Classic Flap has more than doubled in price over the last decade. However, most luxury bags depreciate — LV retains 65–75%, Gucci 50–65%, and many fashion-forward pieces can drop to 30–40% of retail within two years.',
  },
  {
    q: 'Which luxury bags have the best investment return in Thailand?',
    a: 'Hermès Birkin (all sizes, standard leathers) and Kelly bags consistently outperform. Chanel Classic Flap and WOC in black caviar leather also show strong appreciation. For watches, Rolex Submariner and Daytona have outperformed most equity indices over the past decade. These are the exception rather than the rule — most luxury goods lose value.',
  },
  {
    q: 'Should I buy luxury bags as investments in Thailand?',
    a: "Only buy investment-grade pieces if you genuinely love them too. Liquidity is lower than stocks — you cannot sell a Birkin instantly. Storage, insurance, and authentication costs reduce your net return. The Thai baht exchange rate also affects USD-denominated resale values. Treat luxury as a store of value, not a guaranteed return.",
  },
  {
    q: 'What is value retention for luxury bags?',
    a: 'Value retention is the percentage of the original retail price you can recover on the secondary market. A bag that retails at ฿100,000 and sells pre-owned for ฿75,000 retains 75% of its value. Items above 100% (Hermès in some cases) trade at a premium above retail due to artificial scarcity.',
  },
]

const faqsTh = [
  {
    q: 'กระเป๋า luxury เป็นการลงทุนที่ดีในไทยไหม?',
    a: 'บางรุ่นดี Hermès Birkin และ Kelly แสดงการแข็งค่าต่อเนื่องที่ 10–15% ต่อปีและปัจจุบันถือเป็นสินทรัพย์ลงทุนทางเลือก Chanel Classic Flap ราคาเพิ่มขึ้นกว่าสองเท่าในทศวรรษที่ผ่านมา อย่างไรก็ตาม กระเป๋า luxury ส่วนใหญ่มูลค่าลดลง — LV รักษาไว้ 65–75%, Gucci 50–65% และรุ่นที่เน้นแฟชั่นอาจลดลงเหลือ 30–40% ของราคาใหม่ภายในสองปี',
  },
  {
    q: 'กระเป๋า luxury รุ่นไหนให้ผลตอบแทนการลงทุนดีที่สุดในไทย?',
    a: 'Hermès Birkin (ทุกขนาด หนังมาตรฐาน) และ Kelly มีประสิทธิภาพเหนือกว่าอย่างสม่ำเสมอ Chanel Classic Flap และ WOC ในหนัง caviar สีดำก็แสดงการแข็งค่าที่แข็งแกร่ง สำหรับนาฬิกา Rolex Submariner และ Daytona มีประสิทธิภาพเหนือกว่าดัชนีหุ้นส่วนใหญ่ในทศวรรษที่ผ่านมา แต่นี่เป็นข้อยกเว้น ไม่ใช่กฎ — สินค้า luxury ส่วนใหญ่มูลค่าลดลง',
  },
  {
    q: 'ควรซื้อกระเป๋า luxury เพื่อลงทุนในไทยไหม?',
    a: 'ซื้อชิ้นงานระดับการลงทุนเฉพาะเมื่อคุณรักมันจริงๆ ด้วย สภาพคล่องต่ำกว่าหุ้น — ขาย Birkin ไม่ได้ทันที ค่าเก็บรักษา ค่าประกัน และค่าตรวจสอบลดผลตอบแทนสุทธิ อัตราแลกเปลี่ยนบาทไทยยังส่งผลต่อมูลค่าการขายต่อที่เป็นสกุลเงิน USD ด้วย มองว่า luxury เป็นที่เก็บมูลค่า ไม่ใช่ผลตอบแทนที่รับประกัน',
  },
  {
    q: 'Value retention ของกระเป๋า luxury คืออะไร?',
    a: 'Value retention คือเปอร์เซ็นต์ของราคาขายเดิมที่คุณสามารถได้คืนในตลาดมือสอง กระเป๋าที่ราคาใหม่ ฿100,000 และขายมือสองได้ ฿75,000 รักษามูลค่าไว้ 75% รายการที่เกิน 100% (Hermès ในบางกรณี) ซื้อขายในราคาพรีเมียมเกินราคาใหม่เนื่องจากการขาดแคลนเทียม',
  },
]

export default async function LuxuryBagsAsInvestmentsPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const allItems = getAllItems()
  const rankedItems = allItems
    .filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
    .map(i => {
      const avg = getAvgPrice(i.price_ranges.very_good!)
      const retainPct = Math.round((avg / i.retail_price_thb) * 100)
      return { ...i, avg, retainPct }
    })
    .sort((a, b) => b.retainPct - a.retainPct)
    .slice(0, 20)

  const faqList = isEn ? faqsEn : faqsTh

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        <a href={`/${locale}/guides`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Guides' : 'คู่มือ'}</a>
        {' › '}
        {isEn ? 'Luxury Bags as Investments' : 'กระเป๋า Luxury เป็นการลงทุน'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? `Are Luxury Bags Good Investments in Thailand? ${PRICE_YEAR}` : `กระเป๋า Luxury เป็นการลงทุนที่ดีไหม? ข้อมูลปี ${PRICE_YEAR}`}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">
        {isEn ? `Based on ${rankedItems.length} tracked models with live price data` : `จากข้อมูล ${rankedItems.length} รุ่นที่ติดตามราคาจริง`}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed max-w-2xl">
          {isEn
            ? "Not all luxury bags appreciate. This guide ranks tracked pre-owned pieces by value retention — the percentage of original retail they recover on the Thai secondary market. Higher retention means less depreciation."
            : 'กระเป๋า luxury ไม่ทุกรุ่นที่ราคาเพิ่มขึ้น คู่มือนี้จัดอันดับชิ้นงานมือสองที่ติดตามตาม value retention — เปอร์เซ็นต์ของราคาใหม่เดิมที่กู้คืนได้ในตลาดมือสองไทย retention สูงหมายความว่าค่าเสื่อมราคาน้อยลง'}
        </p>
      </section>

      <section className="mb-14">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Value Retention Rankings (Pre-Owned THB)' : 'อันดับ Value Retention (มือสอง บาท)'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-2 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs w-8">#</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Brand & Model' : 'แบรนด์ & รุ่น'}</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Retail' : 'ราคาใหม่'}</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Pre-Owned Avg' : 'เฉลี่ยมือสอง'}</th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Retains' : 'รักษามูลค่า'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {rankedItems.map((item, idx) => (
                <tr key={item.id} className={item.retainPct >= 100 ? 'bg-[#FFF8EE]' : ''}>
                  <td className="py-3 pr-2 text-[#9C8B7A] text-xs">{idx + 1}</td>
                  <td className="py-3 pr-4">
                    <a href={`/${locale}/${item.slug}`} className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors">
                      <span className="text-xs text-[#9C8B7A] block">{item.brand}</span>
                      {item.model}
                    </a>
                  </td>
                  <td className="py-3 pr-4 text-[#9C8B7A]">{formatPriceTHB(item.retail_price_thb)}</td>
                  <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPriceTHB(item.avg)}</td>
                  <td className={`py-3 font-semibold text-sm ${item.retainPct >= 100 ? 'text-[#B8954A]' : item.retainPct >= 70 ? 'text-[#4A7A35]' : 'text-[#8C7355]'}`}>
                    {item.retainPct}%
                    {item.retainPct >= 100 && (
                      <span className="ml-1 text-xs font-normal">{isEn ? '▲ above retail' : '▲ เกินของใหม่'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Investment Tiers' : 'ระดับการลงทุน'}
        </h2>
        <div className="space-y-4 text-sm text-[#6B6052]">
          <div>
            <p className="font-medium text-[#B8954A] mb-1">{isEn ? 'Above 100% — Appreciating Assets' : 'เกิน 100% — สินทรัพย์ที่เพิ่มมูลค่า'}</p>
            <p className="leading-relaxed">{isEn ? 'Hermès Birkin and Kelly in standard leathers. These genuinely function as stores of value.' : 'Hermès Birkin และ Kelly ในหนังมาตรฐาน รุ่นเหล่านี้ทำหน้าที่เป็นที่เก็บมูลค่าจริงๆ'}</p>
          </div>
          <div>
            <p className="font-medium text-[#4A7A35] mb-1">{isEn ? '70–100% — Strong Retention' : '70–100% — รักษามูลค่าดี'}</p>
            <p className="leading-relaxed">{isEn ? "Chanel Classic Flap, LV Neverfull. You'll recover most of your investment." : 'Chanel Classic Flap, LV Neverfull คุณจะได้คืนส่วนใหญ่ของการลงทุน'}</p>
          </div>
          <div>
            <p className="font-medium text-[#8C7355] mb-1">{isEn ? '50–70% — Moderate Depreciation' : '50–70% — ค่าเสื่อมราคาปานกลาง'}</p>
            <p className="leading-relaxed">{isEn ? 'Gucci, Prada, most mid-luxury. Buy for love, not investment.' : 'Gucci, Prada, mid-luxury ส่วนใหญ่ ซื้อเพราะรัก ไม่ใช่เพื่อลงทุน'}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-6">
          {faqList.map((faq, i) => (
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
