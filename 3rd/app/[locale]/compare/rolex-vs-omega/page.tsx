import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/rolex-vs-omega'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Rolex vs Omega Pre-Owned Prices in Thailand ${PRICE_YEAR} | ChicPreowned`
      : 'Rolex กับ Omega มือสอง ในไทย — ราคาและความคุ้มค่า | ChicPreowned',
    description: isEn
      ? 'Rolex often trades above retail in Thailand. Omega offers 40–60% savings pre-owned. Compare both brands and decide which watch to buy first.'
      : 'Rolex มักซื้อขายสูงกว่าราคาใหม่ในไทย Omega ประหยัด 40–60% เมื่อซื้อมือสอง เปรียบเทียบทั้งสองแบรนด์',
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
    q: 'Is Rolex or Omega a better investment pre-owned?',
    a: 'Rolex is the better investment — sports models like Submariner and Daytona consistently trade 30–80% above retail on the secondary market. Omega pre-owned trades below retail, making it better value for buyers but weaker for resellers.',
  },
  {
    q: 'How much can I save buying a pre-owned Omega in Thailand?',
    a: 'Pre-owned Omega Seamaster and Speedmaster typically sell at 40–60% below official retail price in Thailand. On a ฿120,000 watch, that\'s a saving of ฿48,000–฿72,000 versus buying new from an authorised dealer.',
  },
  {
    q: 'Which pre-owned watch should I buy first — Rolex or Omega?',
    a: 'Buy Omega first if you want maximum value for money and everyday wearability. Choose Rolex if you want a piece that appreciates and is globally recognised as a status symbol. Budget-wise, Omega is more accessible: pre-owned Seamasters start under ฿80,000.',
  },
]

const faqsTh = [
  {
    q: 'Rolex หรือ Omega อันไหนลงทุนดีกว่าในตลาดมือสอง?',
    a: 'Rolex ลงทุนได้ดีกว่า — รุ่น sport อย่าง Submariner และ Daytona ซื้อขายสูงกว่าราคาใหม่ 30–80% อย่างสม่ำเสมอ Omega มือสองซื้อขายต่ำกว่าราคาใหม่ ทำให้คุ้มค่าสำหรับผู้ซื้อแต่อ่อนกว่าสำหรับผู้ขายต่อ',
  },
  {
    q: 'ซื้อ Omega มือสองในไทยประหยัดได้เท่าไหร่?',
    a: 'Omega Seamaster และ Speedmaster มือสองมักขายที่ราคาต่ำกว่าราคาขายปลีกอย่างเป็นทางการ 40–60% ในไทย สำหรับนาฬิการาคา ฿120,000 นั่นหมายถึงการประหยัด ฿48,000–฿72,000 เมื่อเทียบกับการซื้อใหม่จากตัวแทนจำหน่าย',
  },
  {
    q: 'ควรซื้อนาฬิกามือสองอันไหนก่อน — Rolex หรือ Omega?',
    a: 'ซื้อ Omega ก่อนหากต้องการความคุ้มค่าสูงสุดและใส่ได้ทุกวัน เลือก Rolex หากต้องการชิ้นที่มูลค่าเพิ่มขึ้นและเป็นที่รู้จักทั่วโลกในฐานะสัญลักษณ์สถานะ ในแง่งบประมาณ Omega เข้าถึงได้ง่ายกว่า: Seamaster มือสองเริ่มต้นไม่ถึง ฿80,000',
  },
]

export default async function RolexVsOmegaPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rolexItems = getItemsByBrand('rolex').filter(i => i.price_ranges?.very_good)
  const omegaItems = getItemsByBrand('omega').filter(i => i.price_ranges?.very_good)

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

  const renderItems = (items: ReturnType<typeof getItemsByBrand>, brandName: string, tagLine: string) => (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
          {brandName}
        </h2>
        <span className="text-sm text-[#B8954A] font-medium">{tagLine}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[#9C8B7A]">{isEn ? 'Price data loading…' : 'กำลังโหลดข้อมูลราคา…'}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map(item => {
            const vg = item.price_ranges.very_good!
            const avg = getAvgPrice(vg)
            const isAboveRetail = item.retail_price_thb > 0 && avg > item.retail_price_thb
            return (
              <a
                key={item.id}
                href={`/${locale}/${item.slug}`}
                className="group flex items-center justify-between p-4 border border-[#E8E2D9] bg-white hover:border-[#B8954A] transition-colors"
              >
                <div>
                  <p className="text-xs text-[#9C8B7A] uppercase tracking-wider">{item.brand}</p>
                  <p className="text-[#1A1A1A] font-medium group-hover:text-[#8C7355] transition-colors">{item.model}</p>
                  {isAboveRetail && (
                    <p className="text-xs text-[#B8954A] mt-0.5">{isEn ? 'Above retail' : 'สูงกว่าราคาใหม่'}</p>
                  )}
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
        {' › Rolex vs Omega'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn
          ? `Rolex vs Omega Pre-Owned Prices in Thailand ${PRICE_YEAR}`
          : 'Rolex กับ Omega มือสอง ในไทย — ราคาและความคุ้มค่า'}
      </h1>

      <p className="text-[#6B6052] mb-10 leading-relaxed max-w-2xl">
        {isEn
          ? 'Two legendary Swiss watch brands — very different pre-owned stories. Rolex often commands prices above retail; Omega offers genuine savings of 40–60%. Understanding the difference helps you decide based on your goals.'
          : 'สองแบรนด์นาฬิกาสวิสระดับตำนาน — แต่เรื่องราวมือสองต่างกันมาก Rolex มักมีราคาสูงกว่าราคาใหม่ Omega ให้ส่วนลดจริง 40–60% การเข้าใจความแตกต่างนี้ช่วยให้คุณตัดสินใจตามเป้าหมายของตัวเอง'}
      </p>

      <ThaiPriceCallout
        slugs={['rolex/submariner', 'rolex/datejust-36', 'rolex/daytona']}
        locale={locale}
        title={isEn ? 'Rolex at Thai dealer prices right now' : 'ราคา Rolex ที่ร้านไทยตั้งขายตอนนี้'}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {renderItems(rolexItems, 'Rolex', isEn ? 'Often above retail' : 'มักสูงกว่าราคาใหม่')}
        {renderItems(omegaItems, 'Omega', isEn ? '40–60% savings' : 'ประหยัด 40–60%')}
      </div>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Key Differences at a Glance' : 'ความแตกต่างหลักโดยสรุป'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[#6B6052]">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-2 pr-6 text-xs uppercase tracking-wider text-[#9C8B7A]">{isEn ? 'Factor' : 'ปัจจัย'}</th>
                <th className="text-left py-2 pr-6 text-xs uppercase tracking-wider text-[#9C8B7A]">Rolex</th>
                <th className="text-left py-2 text-xs uppercase tracking-wider text-[#9C8B7A]">Omega</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#1A1A1A] font-medium">{isEn ? 'Resale value' : 'มูลค่าขายต่อ'}</td>
                <td className="py-3 pr-6 text-[#B8954A]">{isEn ? 'Above retail' : 'สูงกว่าราคาใหม่'}</td>
                <td className="py-3 text-[#4A7A35]">{isEn ? 'Below retail' : 'ต่ำกว่าราคาใหม่'}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#1A1A1A] font-medium">{isEn ? 'Buyer savings' : 'ส่วนลดสำหรับผู้ซื้อ'}</td>
                <td className="py-3 pr-6">{isEn ? 'None (premium)' : 'ไม่มี (ราคาสูงกว่า)'}</td>
                <td className="py-3 text-[#4A7A35]">40–60%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#1A1A1A] font-medium">{isEn ? 'Availability' : 'ความพร้อมจำหน่าย'}</td>
                <td className="py-3 pr-6">{isEn ? 'Limited (waitlists)' : 'จำกัด (มีคิวรอ)'}</td>
                <td className="py-3">{isEn ? 'Good selection' : 'มีให้เลือกดี'}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#1A1A1A] font-medium">{isEn ? 'Best for' : 'เหมาะสำหรับ'}</td>
                <td className="py-3 pr-6">{isEn ? 'Investment, status' : 'การลงทุน, สถานะ'}</td>
                <td className="py-3">{isEn ? 'Everyday wear, value' : 'ใส่ประจำ, ความคุ้มค่า'}</td>
              </tr>
            </tbody>
          </table>
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
