import type { Metadata } from 'next'
import { getItemsUnderBudget, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/luxury-gift-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Best Pre-Owned Luxury Gifts in Thailand ${PRICE_YEAR} | ChicPreowned`
      : `ของขวัญ Luxury มือสองที่ดีที่สุดในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Authenticated luxury gifts at 30–50% below boutique prices. Scarves, belts, small leather goods and more — delivered across Thailand.'
      : 'ของขวัญ Luxury ที่ผ่านการตรวจสอบแล้ว ราคาต่ำกว่าบูติค 30–50% ผ้าพันคอ เข็มขัด ของ leather goods ขนาดเล็ก และอีกมาก ส่งทั่วไทย',
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
    q: 'Is it appropriate to give pre-owned luxury as a gift in Thailand?',
    a: 'Absolutely. Pre-owned luxury gifting is well-established in Thailand, especially among those who understand value. When the item is authenticated and beautifully presented, recipients appreciate the thought and the brand — not the origin.',
  },
  {
    q: 'How do I know the gift is authentic?',
    a: 'Buy from platforms with authentication guarantees such as Vestiaire Collective. Each item passes expert review before listing. Request the authentication certificate and original accessories for a complete gift presentation.',
  },
  {
    q: 'Can I get the item gift-wrapped?',
    a: 'Vestiaire Collective offers premium gift packaging for Thailand orders. Alternatively, purchase a luxury gift box from a local specialist — Chanel-style ribbon-tied boxes are widely available in Bangkok malls.',
  },
  {
    q: 'What is the best luxury gift under ฿15,000?',
    a: 'Hermès Twilly silk scarves (from ฿4,500 pre-owned) are universally loved and portable. Gucci GG Marmont belt (from ฿7,000) is a strong statement piece. LV Card Holder (from ฿6,000) is a practical everyday gift with brand prestige.',
  },
]

const faqsTh = [
  {
    q: 'การให้ของขวัญ Luxury มือสองในไทยเป็นเรื่องที่เหมาะสมไหม?',
    a: 'เหมาะสมอย่างแน่นอน การให้ของขวัญ Luxury มือสองเป็นที่ยอมรับในไทย โดยเฉพาะในหมู่ผู้ที่เข้าใจคุณค่า เมื่อสินค้าผ่านการรับรองและนำเสนออย่างสวยงาม ผู้รับจะซาบซึ้งในความใส่ใจและแบรนด์ ไม่ใช่แหล่งที่มา',
  },
  {
    q: 'จะรู้ได้อย่างไรว่าของขวัญเป็นของแท้?',
    a: 'ซื้อจากแพลตฟอร์มที่มีการรับประกันความแท้ เช่น Vestiaire Collective ทุกชิ้นผ่านการตรวจสอบจากผู้เชี่ยวชาญก่อนลงประกาศ ขอใบรับรองความแท้และอุปกรณ์ดั้งเดิมเพื่อการนำเสนอของขวัญที่ครบถ้วน',
  },
  {
    q: 'สามารถห่อของขวัญได้ไหม?',
    a: 'Vestiaire Collective มีบริการห่อของขวัญระดับพรีเมียมสำหรับคำสั่งซื้อในไทย หรือซื้อกล่องของขวัญระดับ Luxury จากร้านในพื้นที่ — กล่องผูกริบบิ้นสไตล์ Chanel มีขายทั่วไปในห้างสรรพสินค้าในกรุงเทพฯ',
  },
  {
    q: 'ของขวัญ Luxury ที่ดีที่สุดในราคาไม่เกิน ฿15,000 คืออะไร?',
    a: 'ผ้าพันคอ Hermès Twilly (มือสองเริ่มที่ ฿4,500) เป็นที่ชื่นชอบอย่างกว้างขวางและพกพาง่าย เข็มขัด Gucci GG Marmont (เริ่มที่ ฿7,000) เป็นของขวัญที่โดดเด่น LV Card Holder (เริ่มที่ ฿6,000) เป็นของขวัญที่ใช้งานได้จริงทุกวันพร้อมชื่อเสียงของแบรนด์',
  },
]

export default async function LuxuryGiftGuidePage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const allUnder30k = getItemsUnderBudget(30000)

  const tier1 = allUnder30k.filter(i => {
    const vg = i.price_ranges.very_good!
    const avg = getAvgPrice(vg)
    return avg >= 5000 && avg <= 15000
  })

  const tier2 = allUnder30k.filter(i => {
    const vg = i.price_ranges.very_good!
    const avg = getAvgPrice(vg)
    return avg > 15000 && avg <= 30000
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

  const GiftCard = ({ item }: { item: (typeof allUnder30k)[number] }) => {
    const vg = item.price_ranges.very_good!
    const avg = getAvgPrice(vg)
    return (
      <a
        href={`/${locale}/${item.slug}`}
        className="group block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
      >
        <div className="h-0.5 bg-[#B8954A]" />
        <div className="p-5">
          <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">{item.brand}</p>
          <h3
            className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-2 leading-snug"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {item.model}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <p className="text-[#B8954A] font-medium">{formatPriceTHB(avg)}</p>
            <p className="text-xs text-[#9C8B7A]">{isEn ? 'Very Good avg' : 'เฉลี่ย VG'}</p>
          </div>
        </div>
      </a>
    )
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
        {isEn ? 'Guides' : 'คู่มือ'}
        {' › '}
        {isEn ? 'Luxury Gift Guide' : 'คู่มือของขวัญ Luxury'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn
          ? `Best Pre-Owned Luxury Gifts in Thailand ${PRICE_YEAR}`
          : `ของขวัญ Luxury มือสองที่ดีที่สุดในไทย ${PRICE_YEAR}`}
      </h1>

      <p className="text-[#6B6052] mb-2 leading-relaxed max-w-2xl">
        {isEn
          ? 'Authenticated luxury gifts at 30–50% below boutique prices. Same item, same quality, delivered across Thailand.'
          : 'ของขวัญ Luxury ที่ผ่านการตรวจสอบแล้ว ราคาต่ำกว่าบูติคในกรุงเทพฯ 30–50% สินค้าเหมือนกัน คุณภาพเหมือนกัน'}
      </p>
      <p className="text-sm text-[#8C7355] mb-12">
        {isEn ? `Updated ${PRICE_YEAR}` : 'อัปเดตมิถุนายน 2025'}
      </p>

      {tier1.length > 0 && (
        <section className="mb-14">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="font-serif text-2xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
              {isEn ? '฿5,000–฿15,000' : '฿5,000–฿15,000'}
            </h2>
          </div>
          <p className="text-sm text-[#8C7355] mb-6">
            {isEn
              ? 'Scarves, small leather goods — thoughtful entry into luxury'
              : 'ผ้าพันคอ ของ Leather Goods ขนาดเล็ก — ของขวัญที่ใส่ใจระดับเริ่มต้น Luxury'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tier1.map(item => <GiftCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {tier2.length > 0 && (
        <section className="mb-14">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="font-serif text-2xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
              {isEn ? '฿15,000–฿30,000' : '฿15,000–฿30,000'}
            </h2>
          </div>
          <p className="text-sm text-[#8C7355] mb-6">
            {isEn
              ? 'Belts, shoes, jewelry — statement luxury gifts'
              : 'เข็มขัด รองเท้า เครื่องประดับ — ของขวัญ Luxury ที่สร้างความประทับใจ'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tier2.map(item => <GiftCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {tier1.length === 0 && tier2.length === 0 && (
        <div className="py-12 text-center text-[#9C8B7A]">
          <p>{isEn ? 'Gift picks loading — check back soon.' : 'กำลังโหลดรายการของขวัญ โปรดกลับมาใหม่เร็วๆ นี้'}</p>
        </div>
      )}

      <div className="mb-14 p-6 bg-[#1A1A1A] text-white">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
          {isEn ? 'Where to Buy' : 'ซื้อที่ไหน'}
        </p>
        <p className="text-sm text-[#E8E2D9] mb-4 leading-relaxed">
          {isEn
            ? 'All items above are trackable on Vestiaire Collective, which ships to Thailand with full buyer protection and authentication guarantees.'
            : 'ทุกรายการข้างต้นหาซื้อได้จาก Vestiaire Collective ซึ่งส่งถึงไทยพร้อมการคุ้มครองผู้ซื้อและการรับประกันความแท้'}
        </p>
        <a
          href="https://www.vestiairecollective.com/?utm_source=chicpreowned.com&utm_medium=referral&utm_campaign=gift-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8954A] text-white text-sm tracking-wide hover:bg-[#A07B38] transition-colors"
        >
          {isEn ? 'Shop Authenticated Gifts →' : 'ช้อปของขวัญที่ผ่านการรับรอง →'}
        </a>
      </div>

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
