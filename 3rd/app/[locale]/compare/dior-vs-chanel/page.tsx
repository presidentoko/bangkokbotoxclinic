import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/dior-vs-chanel'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Dior vs Chanel Pre-Owned in Thailand ${PRICE_YEAR} | ChicPreowned`
      : 'ไดออร์ vs ชาแนล มือสองในไทย: อันไหนคุ้มค่ากว่า? | ChicPreowned',
    description: isEn
      ? `Dior vs Chanel pre-owned in Thailand: price comparison, value retention, and which brand suits your budget in ${PRICE_YEAR}.`
      : `Dior vs Chanel มือสองในไทย: เปรียบเทียบราคา การรักษามูลค่า และแบรนด์ไหนเหมาะกับงบของคุณในปี ${PRICE_YEAR}`,
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Does Chanel or Dior hold value better in Thailand?',
    a: 'Chanel holds value better globally and in Thailand. Classic Flap and Boy Bag typically retain 80–95% of retail. Pre-owned Dior retains 50–70% on classic models (Lady Dior, Saddle). In the Thai market, Chanel supply is more limited which can push prices higher at Thai resale dealers.',
  },
  {
    q: 'Is pre-owned Dior more affordable than Chanel in Thailand?',
    a: 'Yes. Pre-owned Lady Dior in Very Good condition averages ฿80,000–฿150,000 in Thailand. A Chanel Classic Flap in equivalent condition starts from ฿150,000–฿280,000. For buyers on a ฿100,000 budget, Dior offers significantly more choice.',
  },
  {
    q: 'Which is better for a first luxury bag purchase in Thailand — Dior or Chanel?',
    a: "Dior is the more accessible first luxury bag. The 30 Montaigne and Saddle Bag provide strong design recognition at lower price points. Chanel is the better investment — if your budget allows the Classic Flap, it historically appreciates. For most Thai buyers entering luxury pre-owned for the first time, Dior's ฿60,000–฿120,000 range is more approachable.",
  },
  {
    q: 'Lady Dior vs Chanel Classic Flap — which is better to buy pre-owned in Thailand?',
    a: "The Lady Dior gives you more bag for your money — comparable international prestige at roughly half the pre-owned price of a Classic Flap. The Classic Flap is the stronger investment and more liquid resale in Thailand. If you plan to keep the bag long-term, Lady Dior is excellent value. If you may want to resell within 2–3 years, Classic Flap is safer.",
  },
]

const faqsTh = [
  {
    q: 'Chanel หรือ Dior รักษามูลค่าได้ดีกว่าในไทย?',
    a: 'Chanel รักษามูลค่าได้ดีกว่าทั้งในระดับโลกและในไทย Classic Flap และ Boy Bag มักรักษาไว้ 80–95% ของราคาใหม่ Dior มือสองรักษาไว้ 50–70% สำหรับรุ่นคลาสสิก (Lady Dior, Saddle) ในตลาดไทย ซัพพลาย Chanel มีจำกัดกว่าซึ่งอาจดันราคาที่ร้านมือสองในไทยให้สูงขึ้น',
  },
  {
    q: 'Dior มือสองถูกกว่า Chanel ในไทยไหม?',
    a: 'ใช่ Lady Dior มือสองสภาพ Very Good มีราคาเฉลี่ย ฿80,000–฿150,000 ในไทย Chanel Classic Flap สภาพเทียบเท่าเริ่มต้นที่ ฿150,000–฿280,000 สำหรับผู้ซื้อที่มีงบ ฿100,000 Dior มีตัวเลือกให้เลือกมากกว่าอย่างมีนัยสำคัญ',
  },
  {
    q: 'ซื้อกระเป๋า luxury ใบแรกในไทยควรเลือก Dior หรือ Chanel?',
    a: 'Dior เข้าถึงได้ง่ายกว่าสำหรับกระเป๋า luxury ใบแรก 30 Montaigne และ Saddle Bag ให้การยอมรับดีไซน์ที่แข็งแกร่งในราคาที่ต่ำกว่า Chanel เป็นการลงทุนที่ดีกว่า หากงบเอื้ออำนวย Classic Flap มีแนวโน้มมูลค่าเพิ่มขึ้นตลอดมา สำหรับผู้ซื้อชาวไทยส่วนใหญ่ที่เริ่มต้นกับ luxury มือสองครั้งแรก ช่วงราคา ฿60,000–฿120,000 ของ Dior เข้าถึงได้ง่ายกว่า',
  },
  {
    q: 'Lady Dior vs Chanel Classic Flap — อันไหนควรซื้อมือสองในไทย?',
    a: 'Lady Dior ให้คุณค่าต่อเงินมากกว่า — ชื่อเสียงระดับสากลที่เทียบเคียงได้ในราคาประมาณครึ่งหนึ่งของ Classic Flap มือสอง Classic Flap เป็นการลงทุนที่แข็งแกร่งกว่าและขายต่อได้คล่องกว่าในไทย หากวางแผนเก็บกระเป๋าระยะยาว Lady Dior มีคุณค่าที่ยอดเยี่ยม หากอาจต้องการขายต่อภายใน 2–3 ปี Classic Flap ปลอดภัยกว่า',
  },
]

export default async function DiorVsChanelThPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const faqs = isEn ? faqsEn : faqsTh

  const diorItems = getItemsByBrand('dior').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
  const chanelItems = getItemsByBrand('chanel').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)

  function getStats(items: typeof diorItems) {
    if (!items.length) return { count: 0, avgRetentionPct: 0 }
    const count = items.length
    const avgRetentionPct = Math.round(
      items.reduce((sum, i) => sum + (getAvgPrice(i.price_ranges.very_good!) / i.retail_price_thb) * 100, 0) / count
    )
    return { count, avgRetentionPct }
  }

  const diorStats = getStats(diorItems)
  const chanelStats = getStats(chanelItems)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  function renderItems(items: typeof diorItems, brandSlug: string, retainLabel: string) {
    const top5 = [...items].sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!)).slice(0, 5)
    return (
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif text-2xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {top5[0]?.brand ?? brandSlug}
          </h2>
          <span className="text-sm text-[#B8954A] font-medium">{retainLabel}</span>
        </div>
        {top5.length === 0 ? (
          <p className="text-sm text-[#9C8B7A]">{isEn ? 'Price data loading…' : 'กำลังโหลดข้อมูลราคา…'}</p>
        ) : (
          <div className="space-y-3">
            {top5.map(item => {
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
        <div className="mt-4">
          <a href={`/${locale}/${brandSlug}`} className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
            {isEn ? `View all ${top5[0]?.brand ?? ''} →` : `ดูทั้งหมด ${top5[0]?.brand ?? ''} →`}
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        {isEn ? 'Compare' : 'เปรียบเทียบ'}
        {' › Dior vs Chanel'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? `Dior vs Chanel Pre-Owned in Thailand ${PRICE_YEAR}` : 'ไดออร์ vs ชาแนล: อันไหนคุ้มค่ากว่า?'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">{isEn ? `Updated ${PRICE_YEAR} · Thailand market` : 'อัปเดต 2025 · ตลาดไทย'}</p>

      <p className="text-[#6B6052] mb-10 leading-relaxed max-w-2xl">
        {isEn
          ? "Chanel retains value better (80–95%) but costs significantly more. Dior offers iconic luxury design at 50–70% retention and a much lower entry price. In Thailand, both brands are well-represented in Bangkok's pre-owned market."
          : 'Chanel รักษามูลค่าได้ดีกว่า (80–95%) แต่ราคาสูงกว่ามาก Dior นำเสนอดีไซน์ luxury อันเป็นเอกลักษณ์ที่การรักษามูลค่า 50–70% และราคาเริ่มต้นที่ต่ำกว่ามาก ในไทย ทั้งสองแบรนด์มีตัวแทนที่ดีในตลาดมือสองของกรุงเทพฯ'}
      </p>

      <ThaiPriceCallout
        slugs={['chanel/classic-flap-medium', 'chanel/boy-bag-medium']}
        locale={locale}
        title={isEn ? 'Chanel at Thai dealer prices right now' : 'ราคา Chanel ที่ร้านไทยตั้งขายตอนนี้'}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {renderItems(diorItems, 'dior', isEn ? `${diorStats.avgRetentionPct}% retained` : `รักษามูลค่า ${diorStats.avgRetentionPct}%`)}
        {renderItems(chanelItems, 'chanel', isEn ? `${chanelStats.avgRetentionPct}% retained` : `รักษามูลค่า ${chanelStats.avgRetentionPct}%`)}
      </div>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Key Differences' : 'ความแตกต่างหลัก'}
        </h2>
        <div className="space-y-4 text-sm text-[#6B6052]">
          <div className="border-l-2 border-[#B8954A] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Value Retention' : 'การรักษามูลค่า'}</p>
            <p>{isEn ? 'Chanel raises retail prices every year, pulling secondary market up. Dior is stable but not appreciating in the same way.' : 'Chanel ขึ้นราคาขายปลีกทุกปี ดึงตลาดมือสองขึ้นตาม Dior มีเสถียรภาพแต่ไม่ได้เพิ่มขึ้นในลักษณะเดียวกัน'}</p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Price Point in Thailand' : 'ช่วงราคาในไทย'}</p>
            <p>{isEn ? 'Pre-owned Dior from ฿40,000. Pre-owned Chanel from ฿80,000+ for small leather goods, ฿150,000+ for bags.' : 'Dior มือสองตั้งแต่ ฿40,000 Chanel มือสองตั้งแต่ ฿80,000+ สำหรับ SLG และ ฿150,000+ สำหรับกระเป๋า'}</p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Thai Market Availability' : 'ความพร้อมจำหน่ายในตลาดไทย'}</p>
            <p>{isEn ? 'Both available at Thai resale dealers. Dior has wider local selection. Chanel is more sought-after and sells faster.' : 'ทั้งสองหาซื้อได้ที่ร้านมือสองในไทย Dior มีตัวเลือกในประเทศที่กว้างกว่า Chanel เป็นที่ต้องการมากกว่าและขายได้เร็วกว่า'}</p>
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
