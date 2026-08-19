import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/prada-vs-gucci'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Prada vs Gucci Pre-Owned in Thailand ${PRICE_YEAR} | ChicPreowned`
      : 'Prada vs Gucci: ซื้อมือสองอันไหนดีกว่า? | ChicPreowned',
    description: isEn
      ? `Prada vs Gucci pre-owned in Thailand: durability, resale value and best models compared for ${PRICE_YEAR}.`
      : `Prada vs Gucci มือสองในไทย: ความทนทาน มูลค่าการขายต่อ และรุ่นที่ดีที่สุด เปรียบเทียบสำหรับปี ${PRICE_YEAR}`,
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Does Prada or Gucci hold value better pre-owned in Thailand?',
    a: 'Prada holds value slightly better on classic Saffiano pieces, typically 40–60% of retail. Gucci Michele-era pieces retain 40–55%. In Thailand, Gucci has wider name recognition which can help resale speed, but Prada\'s Saffiano durability is a strong draw for pre-owned buyers.',
  },
  {
    q: 'Which brand has better pre-owned availability in Thailand?',
    a: 'Gucci has slightly better supply in Thailand — it\'s more frequently listed on Carousell Thailand and in Bangkok luxury resale shops. Prada is well-represented but with fewer listings. Both are available through Vestiaire Collective shipping to Thailand.',
  },
  {
    q: 'Is Prada nylon worth buying pre-owned in Thailand\'s climate?',
    a: 'Absolutely — Prada nylon (Re-Nylon) is ideal for Thailand\'s heat and humidity. It\'s lightweight, easy to clean, and resists moisture far better than leather. Pre-owned Re-Edition 2000 in nylon is one of the best value luxury purchases available in the Thai market.',
  },
  {
    q: 'Prada Galleria vs Gucci Marmont — which is better to buy pre-owned?',
    a: 'The Galleria is the more durable choice with better aging — Saffiano leather maintains structure over years. The Marmont\'s matelassé leather can show wear on corners more quickly. For long-term ownership, Galleria. For style variety and lower entry price, Marmont wins.',
  },
]

const faqsTh = [
  {
    q: 'Prada หรือ Gucci รักษามูลค่าได้ดีกว่าในตลาดมือสองไทย?',
    a: 'Prada รักษามูลค่าได้ดีกว่าเล็กน้อยในชิ้นงาน Saffiano คลาสสิก มักอยู่ที่ 40–60% ของราคาใหม่ ชิ้นงานยุค Michele ของ Gucci รักษาไว้ 40–55% ในไทย Gucci มีชื่อเสียงกว้างขวางกว่าซึ่งช่วยให้ขายได้เร็วกว่า แต่ความทนทานของ Saffiano ของ Prada ดึงดูดผู้ซื้อมือสองได้ดี',
  },
  {
    q: 'แบรนด์ไหนมีสินค้ามือสองพร้อมจำหน่ายมากกว่าในไทย?',
    a: 'Gucci มีซัพพลายในไทยมากกว่าเล็กน้อย มีประกาศบน Carousell ไทยและร้านค้า luxury resale ในกรุงเทพฯ บ่อยกว่า Prada มีตัวแทนที่ดีแต่ประกาศน้อยกว่า ทั้งสองมีจำหน่ายผ่าน Vestiaire Collective ที่ส่งถึงไทย',
  },
  {
    q: 'ไนลอนของ Prada คุ้มค่ากับการซื้อมือสองในสภาพอากาศไทยไหม?',
    a: 'คุ้มมาก — ไนลอน Prada (Re-Nylon) เหมาะสำหรับความร้อนและความชื้นของไทย น้ำหนักเบา ทำความสะอาดง่าย และทนต่อความชื้นได้ดีกว่าหนังมาก Re-Edition 2000 มือสองในไนลอนเป็นหนึ่งในการซื้อ luxury ที่คุ้มค่าที่สุดในตลาดไทย',
  },
  {
    q: 'Prada Galleria vs Gucci Marmont — อันไหนควรซื้อมือสอง?',
    a: 'Galleria เป็นตัวเลือกที่ทนทานกว่าและเสื่อมสภาพได้ดีกว่า — หนัง Saffiano รักษาโครงสร้างได้หลายปี หนัง matelassé ของ Marmont อาจแสดงรอยสึกที่มุมได้เร็วกว่า สำหรับการเป็นเจ้าของระยะยาว Galleria ชนะ สำหรับความหลากหลายของสไตล์และราคาเริ่มต้นที่ต่ำกว่า Marmont ชนะ',
  },
]

export default async function PradaVsGucciThPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const faqs = isEn ? faqsEn : faqsTh

  const pradaItems = getItemsByBrand('prada').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
  const gucciItems = getItemsByBrand('gucci').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)

  function getStats(items: typeof pradaItems) {
    if (!items.length) return { count: 0, avgRetentionPct: 0 }
    const count = items.length
    const avgRetentionPct = Math.round(
      items.reduce((sum, i) => sum + (getAvgPrice(i.price_ranges.very_good!) / i.retail_price_thb) * 100, 0) / count
    )
    return { count, avgRetentionPct }
  }

  const pradaStats = getStats(pradaItems)
  const gucciStats = getStats(gucciItems)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  function renderItems(items: typeof pradaItems, brandSlug: string, retainLabel: string) {
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
        {' › Prada vs Gucci'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? `Prada vs Gucci Pre-Owned in Thailand ${PRICE_YEAR}` : 'Prada vs Gucci: ซื้อมือสองอันไหนดีกว่า?'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">{isEn ? `Updated ${PRICE_YEAR} · Thailand market` : 'อัปเดต 2025 · ตลาดไทย'}</p>

      <p className="text-[#6B6052] mb-10 leading-relaxed max-w-2xl">
        {isEn
          ? "Prada excels on durability — Saffiano leather is nearly indestructible. Gucci offers more variety and a stronger streetwear crossover. In Thailand, both brands have established pre-owned markets with good supply on Carousell Thailand."
          : "Prada โดดเด่นด้านความทนทาน — หนัง Saffiano แทบไม่สึกหรอ Gucci มีความหลากหลายมากกว่าและครอสโอเวอร์สู่โลก streetwear ได้แข็งแกร่งกว่า ในไทย ทั้งสองแบรนด์มีตลาดมือสองที่มั่นคงพร้อมซัพพลายที่ดีบน Carousell ไทย"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {renderItems(pradaItems, 'prada', isEn ? `${pradaStats.avgRetentionPct}% retained` : `รักษามูลค่า ${pradaStats.avgRetentionPct}%`)}
        {renderItems(gucciItems, 'gucci', isEn ? `${gucciStats.avgRetentionPct}% retained` : `รักษามูลค่า ${gucciStats.avgRetentionPct}%`)}
      </div>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Key Differences' : 'ความแตกต่างหลัก'}
        </h2>
        <div className="space-y-4 text-sm text-[#6B6052]">
          <div className="border-l-2 border-[#B8954A] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Value Retention' : 'การรักษามูลค่า'}</p>
            <p>{isEn ? 'Both retain 40–60% of retail. Prada edges out slightly on Saffiano due to exceptional durability.' : 'ทั้งสองรักษาไว้ 40–60% ของราคาใหม่ Prada ได้เปรียบเล็กน้อยใน Saffiano เนื่องจากความทนทานที่โดดเด่น'}</p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Availability in Thailand' : 'ความพร้อมจำหน่ายในไทย'}</p>
            <p>{isEn ? 'Gucci has slightly more supply locally. Both well-served by international platforms.' : 'Gucci มีซัพพลายในประเทศมากกว่าเล็กน้อย ทั้งสองให้บริการดีโดยแพลตฟอร์มระหว่างประเทศ'}</p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Style' : 'สไตล์'}</p>
            <p>{isEn ? 'Prada: minimalist, professional. Gucci: bold, logo-forward, streetwear crossover.' : 'Prada: มินิมัล เป็นทางการ Gucci: กล้าหาญ โลโก้โดดเด่น ครอสโอเวอร์ streetwear'}</p>
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
