import type { Metadata } from 'next'
import { getItemBySlug, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/first-luxury-bag'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Best First Pre-Owned Luxury Bag in Thailand (${PRICE_YEAR} Guide) | ChicPreowned`
      : `กระเป๋า Luxury มือสองใบแรก — คู่มือฉบับสมบูรณ์ (${PRICE_YEAR}) | ChicPreowned`,
    description: isEn
      ? 'Which pre-owned luxury bag should you buy first in Thailand? Expert guide covering LV Neverfull, Gucci Marmont, LV Speedy and Chanel WOC with real THB prices.'
      : 'กระเป๋า Luxury มือสองใบแรกควรซื้ออะไรดี? คู่มือครบถ้วน LV Neverfull, Gucci Marmont, LV Speedy, Chanel WOC พร้อมราคา THB จริง',
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
    q: 'What is the best first luxury bag to buy second-hand in Thailand?',
    a: 'LV Neverfull or Speedy — widely available, easy to authenticate, strong resale value.',
  },
  {
    q: 'Is it safe to buy luxury bags online in Thailand?',
    a: 'Yes, using authenticated platforms like Vestiaire Collective which ships to Thailand.',
  },
  {
    q: 'How much should I spend on my first pre-owned luxury bag?',
    a: '฿15,000–฿60,000 covers most entry-level pieces. LV and Gucci start around ฿20,000–฿35,000 in very good condition.',
  },
  {
    q: 'Which luxury bags hold value best in Thailand?',
    a: 'Chanel Classic Flap and LV Monogram canvas. Both retain 60–80% of retail.',
  },
  {
    q: 'Can I resell a pre-owned luxury bag I bought in Thailand?',
    a: 'Yes, Carousell TH and Facebook Marketplace Thailand have active luxury resale communities.',
  },
]

const faqsTh = [
  {
    q: 'กระเป๋า Luxury มือสองใบแรกที่ดีที่สุดในไทยคืออะไร?',
    a: 'LV Neverfull หรือ Speedy — หาง่าย ตรวจสอบง่าย และมูลค่าคืนดี',
  },
  {
    q: 'ซื้อกระเป๋า Luxury ออนไลน์ในไทยปลอดภัยไหม?',
    a: 'ปลอดภัย เมื่อใช้แพลตฟอร์มที่มีการตรวจสอบ เช่น Vestiaire Collective ที่ส่งถึงไทย',
  },
  {
    q: 'ควรใช้งบเท่าไหร่กับกระเป๋า Luxury มือสองใบแรก?',
    a: '฿15,000–฿60,000 ครอบคลุมไอเทมระดับเริ่มต้นส่วนใหญ่ LV และ Gucci เริ่มต้นที่ประมาณ ฿20,000–฿35,000 ในสภาพดีมาก',
  },
  {
    q: 'กระเป๋า Luxury ยี่ห้อไหนที่รักษามูลค่าได้ดีที่สุดในไทย?',
    a: 'Chanel Classic Flap และ LV Monogram canvas — ทั้งคู่รักษามูลค่าไว้ที่ 60–80% ของราคาใหม่',
  },
  {
    q: 'ขายต่อกระเป๋า Luxury มือสองที่ซื้อในไทยได้ไหม?',
    a: 'ได้ — Carousell TH และ Facebook Marketplace ไทยมีชุมชนขายต่อสินค้า Luxury ที่คึกคัก',
  },
]

export default async function FirstLuxuryBagPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const neverfull = getItemBySlug('louis-vuitton', 'neverfull-mm')
  const speedy = getItemBySlug('louis-vuitton', 'speedy-30')
  const marmont = getItemBySlug('gucci', 'gg-marmont-medium')
  const woc = getItemBySlug('chanel', 'wallet-on-chain')

  const topBags = [
    {
      brand: 'Louis Vuitton',
      model: 'Neverfull MM',
      slug: 'louis-vuitton/neverfull-mm',
      item: neverfull,
      descEn: 'The most recognised tote in Bangkok — spacious, durable, and easy to authenticate.',
      descTh: 'โทตที่โด่งดังที่สุดในกรุงเทพฯ — ใส่ของได้เยอะ แข็งแรง และตรวจสอบง่าย',
    },
    {
      brand: 'Gucci',
      model: 'GG Marmont Medium',
      slug: 'gucci/gg-marmont-medium',
      item: marmont,
      descEn: 'Timeless quilted leather with the iconic double-G hardware. Strong Instagram appeal and solid resale demand.',
      descTh: 'หนังลายตารางคลาสสิกพร้อมฮาร์ดแวร์ GG คู่อันโดดเด่น ยอดนิยมใน Instagram และมีความต้องการขายต่อสูง',
    },
    {
      brand: 'Louis Vuitton',
      model: 'Speedy 30',
      slug: 'louis-vuitton/speedy-30',
      item: speedy,
      descEn: 'An entry-level LV icon. Available in abundance on Vestiaire, easy to find in great condition.',
      descTh: 'ไอคอน LV ระดับเริ่มต้น หาได้ง่ายบน Vestiaire ในสภาพดี',
    },
    {
      brand: 'Chanel',
      model: 'Wallet on Chain (WOC)',
      slug: 'chanel/wallet-on-chain',
      item: woc,
      descEn: 'The most affordable entry into Chanel — crossbody versatility meets evening elegance.',
      descTh: 'ทางเข้าสู่โลก Chanel ที่ราคาถูกที่สุด — ใช้ได้ทั้งกระเป๋าสะพายและกระเป๋าออกงาน',
    },
  ]

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

      <h1
        className="font-serif text-4xl text-[#1A1A1A] mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {isEn
          ? 'Best First Pre-Owned Luxury Bag in Thailand ({PRICE_YEAR} Guide)'
          : 'กระเป๋า Luxury มือสองใบแรก — คู่มือฉบับสมบูรณ์ ({PRICE_YEAR})'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-12">
        {isEn ? 'Updated {PRICE_YEAR}' : 'อัปเดตมิถุนายน 2025'}
      </p>

      {/* Section 1: Why buy pre-owned */}
      <section className="mb-12">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Why Buy Pre-Owned in Thailand?' : 'ทำไมต้องซื้อ Luxury มือสองในไทย?'}
        </h2>
        {isEn ? (
          <div className="text-[#6B6052] leading-relaxed space-y-3">
            <p>
              Bangkok boutiques carry full-price inventory with long waitlists for popular models. The pre-owned market offers 20–40% savings versus boutique retail — on the same authenticated pieces.
            </p>
            <p>
              Vestiaire Collective ships directly to Thailand with buyer protection, making it the safest way to buy internationally authenticated luxury. Local platforms like Carousell Thailand add even more options at competitive prices.
            </p>
          </div>
        ) : (
          <div className="text-[#6B6052] leading-relaxed space-y-3">
            <p>
              บูติคในกรุงเทพฯ มีสินค้าราคาเต็มพร้อมคิวรอนาน สำหรับรุ่นยอดนิยม ตลาดมือสองช่วยประหยัด 20–40% เมื่อเทียบกับราคาบูติค — บนชิ้นงานที่ผ่านการตรวจสอบเหมือนกัน
            </p>
            <p>
              Vestiaire Collective ส่งตรงถึงไทยพร้อมระบบคุ้มครองผู้ซื้อ ทำให้เป็นวิธีที่ปลอดภัยที่สุดในการซื้อ Luxury ระดับสากล Carousell Thailand ยังเพิ่มตัวเลือกในราคาที่แข่งขันได้
            </p>
          </div>
        )}
      </section>

      {/* Section 2: Top 4 bags */}
      <section className="mb-12">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Top 4 First Bags for Beginners' : '4 กระเป๋าแนะนำสำหรับมือใหม่'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topBags.map((bag, i) => {
            const vg = bag.item?.price_ranges?.very_good
            const avgPrice = vg ? getAvgPrice(vg) : null
            return (
              <a
                key={i}
                href={`/${locale}/${bag.slug}`}
                className="group block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
              >
                <div className="h-0.5 bg-[#E8E2D9] group-hover:bg-[#B8954A] transition-colors duration-300" />
                <div className="p-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">{bag.brand}</p>
                  <h3
                    className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3 leading-tight"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {bag.model}
                  </h3>
                  <p className="text-sm text-[#6B6052] mb-4 leading-relaxed">
                    {isEn ? bag.descEn : bag.descTh}
                  </p>
                  {avgPrice !== null ? (
                    <div>
                      <p className="text-xs text-[#9C8B7A] mb-0.5">
                        {isEn ? 'Avg. Very Good' : 'เฉลี่ย สภาพดีมาก'}
                      </p>
                      <p className="text-lg font-medium text-[#B8954A]">{formatPriceTHB(avgPrice)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-[#9C8B7A]">
                      {isEn ? 'Price on request' : 'ติดต่อสอบถามราคา'}
                    </p>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </section>

      {/* Section 3: Where to buy */}
      <section className="mb-12">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Where to Buy in Thailand' : 'ซื้อที่ไหนดีในไทย'}
        </h2>
        {isEn ? (
          <div className="space-y-4 text-[#6B6052]">
            <div className="border-l-2 border-[#B8954A] pl-4">
              <p className="font-medium text-[#1A1A1A] mb-1">Vestiaire Collective</p>
              <p className="text-sm leading-relaxed">
                Ships directly to Thailand. All items pass authentication review. Best for high-value pieces where authentication matters most.
              </p>
            </div>
            <div className="border-l-2 border-[#E8E2D9] pl-4">
              <p className="font-medium text-[#1A1A1A] mb-1">Carousell Thailand</p>
              <p className="text-sm leading-relaxed">
                Largest local marketplace. Widest selection, negotiable prices. Filter for verified sellers and always meet in a safe location.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-[#6B6052]">
            <div className="border-l-2 border-[#B8954A] pl-4">
              <p className="font-medium text-[#1A1A1A] mb-1">Vestiaire Collective</p>
              <p className="text-sm leading-relaxed">
                ส่งตรงถึงไทย ทุกชิ้นผ่านการตรวจสอบ เหมาะที่สุดสำหรับของชิ้นใหญ่ที่ต้องการความมั่นใจในการรับรอง
              </p>
            </div>
            <div className="border-l-2 border-[#E8E2D9] pl-4">
              <p className="font-medium text-[#1A1A1A] mb-1">Carousell Thailand</p>
              <p className="text-sm leading-relaxed">
                ตลาดในประเทศที่ใหญ่ที่สุด มีสินค้าให้เลือกมาก ราคาต่อรองได้ กรองผู้ขายที่ได้รับการยืนยันและนัดรับของในสถานที่ปลอดภัย
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Section 4: Budget guide links */}
      <section className="mb-12 bg-[#F5F0EB] border border-[#E8E2D9] p-6">
        <h2
          className="font-serif text-xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Shop by Budget' : 'เลือกตามงบประมาณ'}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {[
            { slug: 'under-15000', labelEn: 'Under ฿15,000', labelTh: 'ไม่เกิน ฿15,000' },
            { slug: 'under-30000', labelEn: 'Under ฿30,000', labelTh: 'ไม่เกิน ฿30,000' },
            { slug: 'under-60000', labelEn: 'Under ฿60,000', labelTh: 'ไม่เกิน ฿60,000' },
          ].map(b => (
            <a
              key={b.slug}
              href={`/${locale}/${b.slug}`}
              className="flex-1 text-center py-3 px-4 border border-[#B8954A] text-[#B8954A] text-sm hover:bg-[#B8954A] hover:text-white transition-colors"
            >
              {isEn ? b.labelEn : b.labelTh}
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16 border-t border-[#E8E2D9] pt-10">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
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
