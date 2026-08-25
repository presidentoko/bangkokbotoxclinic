import type { Metadata } from 'next'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/where-to-sell-luxury-bags'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Where to Sell Pre-Owned Luxury Bags in Thailand ${PRICE_YEAR} | ChicPreowned`
      : `ขายกระเป๋า Luxury มือสองที่ไหนดีในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Platform comparison for Thai luxury sellers: Thai resale dealers, LINE Shopping, Shopee and Vestiaire Collective — fees, reach, and payout compared.'
      : 'เปรียบเทียบช่องทางสำหรับผู้ขาย luxury ในไทย: ร้านมือสองในไทย, LINE Shopping, Shopee และ Vestiaire — ค่าธรรมเนียม, การเข้าถึง และรายได้',
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

const platforms = [
  {
    name: 'Thai resale dealers',
    feeEn: 'No listing fee — they buy outright or take consignment',
    feeTh: 'ไม่มีค่าลงประกาศ — รับซื้อขาดหรือรับฝากขาย',
    reachEn: 'Walk-in and online-catalogue buyers in Thailand',
    reachTh: 'ลูกค้าหน้าร้านและลูกค้าที่ดูแคตตาล็อกออนไลน์ในไทย',
    payoutEn: 'On the spot if they buy outright; after the sale on consignment',
    payoutTh: 'รับเงินทันทีถ้าขายขาด หรือรับหลังขายได้ถ้าฝากขาย',
    prosEn: 'Fastest way to turn a bag into cash. The shop inspects it and carries the authentication risk itself. Dealers such as UsedBrand88 and Brandname Voyage publish their asking prices, so you can see what your bag resells for before you walk in.',
    prosTh: 'เป็นวิธีเปลี่ยนกระเป๋าเป็นเงินสดที่เร็วที่สุด ร้านตรวจสภาพและรับความเสี่ยงเรื่องของแท้เอง ร้านอย่าง UsedBrand88 และ Brandname Voyage เปิดราคาขายไว้ให้ดู จึงพอเทียบได้ก่อนเดินเข้าร้านว่ากระเป๋าของคุณขายต่อได้เท่าไร',
    consEn: 'An outright buy-back price sits well below what the shop then asks. Terms differ from shop to shop, so compare a few.',
    consTh: 'ราคารับซื้อขาดต่ำกว่าราคาที่ร้านนำไปตั้งขายพอสมควร เงื่อนไขต่างกันไปในแต่ละร้าน ควรเทียบหลายร้าน',
    best: 'best-local',
  },
  {
    name: 'LINE Shopping',
    feeEn: '2–3% commission',
    feeTh: 'ค่าคอมมิชชัน 2–3%',
    reachEn: 'Strong reach via LINE ecosystem',
    reachTh: 'การเข้าถึงที่แข็งแกร่งผ่านระบบนิเวศ LINE',
    payoutEn: 'Via LINE Pay or bank transfer',
    payoutTh: 'ผ่าน LINE Pay หรือโอนธนาคาร',
    prosEn: 'Familiar to Thai buyers. Easy setup via LINE OA. Low commission.',
    prosTh: 'คุ้นเคยสำหรับผู้ซื้อไทย ตั้งค่าง่ายผ่าน LINE OA ค่าคอมมิชชันต่ำ',
    consEn: 'Limited international reach. No authentication service.',
    consTh: 'การเข้าถึงต่างประเทศจำกัด ไม่มีบริการตรวจสอบ',
    best: 'best-casual',
  },
  {
    name: 'Shopee Thailand',
    feeEn: '2–5% commission + payment fee',
    feeTh: 'ค่าคอมมิชชัน 2–5% + ค่าชำระเงิน',
    reachEn: 'Highest volume, price-sensitive buyers',
    reachTh: 'ปริมาณสูงสุด ผู้ซื้อที่เน้นราคา',
    payoutEn: 'ShopeePay or bank transfer',
    payoutTh: 'ShopeePay หรือโอนธนาคาร',
    prosEn: 'Massive buyer base. Integrated shipping. Good for accessories and SLGs.',
    prosTh: 'ฐานผู้ซื้อขนาดใหญ่มาก การจัดส่งรวมอยู่ในระบบ ดีสำหรับอุปกรณ์เสริมและ SLG',
    consEn: 'Price competition is fierce. Buyers expect discounts. Not ideal for high-value pieces.',
    consTh: 'การแข่งขันด้านราคาสูงมาก ผู้ซื้อคาดหวังส่วนลด ไม่เหมาะสำหรับชิ้นงานมูลค่าสูง',
    best: 'best-volume',
  },
  {
    name: 'Vestiaire Collective',
    feeEn: '12–15% seller commission',
    feeTh: 'ค่าคอมมิชชันผู้ขาย 12–15%',
    reachEn: 'Global reach, luxury-focused buyers',
    reachTh: 'การเข้าถึงระดับโลก ผู้ซื้อที่มุ่งเน้น luxury',
    payoutEn: 'Bank transfer or PayPal (5–14 business days)',
    payoutTh: 'โอนธนาคาร หรือ PayPal (5–14 วันทำการ)',
    prosEn: 'Authentication service builds buyer trust. Higher prices for authenticated items. Best for Chanel and Hermès.',
    prosTh: 'บริการตรวจสอบสร้างความน่าเชื่อถือผู้ซื้อ ราคาสูงกว่าสำหรับชิ้นที่ผ่านการตรวจสอบ ดีที่สุดสำหรับ Chanel และ Hermès',
    consEn: 'High commission. Slower payout. Items must be shipped for authentication.',
    consTh: 'ค่าคอมมิชชันสูง รอรับเงินนานกว่า ชิ้นงานต้องส่งเพื่อตรวจสอบ',
    best: 'best-value',
  },
]

const faqsEn = [
  {
    q: 'What is the best platform to sell luxury bags in Thailand?',
    a: "It depends on the bag's value. For high-value pieces (Chanel, Hermès above ฿100,000), Vestiaire Collective often reaches a wider pool of buyers despite its higher commission. For mid-range bags and accessories under ฿50,000, a Thai resale dealer who buys outright is the fastest way to get paid. Shopee is best for small accessories where volume matters.",
  },
  {
    q: 'Is it safe to sell luxury bags on LINE Shopping in Thailand?',
    a: "LINE Shopping is safe for established sellers with a LINE Official Account. Buyers are typically familiar with the platform and trust LINE Pay. However, for high-value pieces, always insist on in-person handover or insured shipping. LINE's built-in messaging makes negotiation and customer service seamless.",
  },
  {
    q: 'How long does it take to sell a luxury bag on Vestiaire in Thailand?',
    a: 'Average time to sell on Vestiaire Collective is 2–8 weeks depending on the brand and price. Chanel and LV sell fastest. Hermès pieces authenticated by Vestiaire often sell within days. Once sold, authentication and shipping to the buyer takes 5–10 business days, after which you receive your payout.',
  },
]

const faqsTh = [
  {
    q: 'แพลตฟอร์มไหนดีที่สุดสำหรับขายกระเป๋า luxury ในไทย?',
    a: 'ขึ้นอยู่กับมูลค่ากระเป๋า สำหรับชิ้นมูลค่าสูง (Chanel, Hermès เกิน ฿100,000) Vestiaire Collective เข้าถึงผู้ซื้อได้กว้างกว่าแม้ค่าคอมมิชชันจะสูงกว่า สำหรับกระเป๋าราคากลางและอุปกรณ์เสริมต่ำกว่า ฿50,000 การขายขาดให้ร้านมือสองในไทยได้เงินเร็วที่สุด Shopee เหมาะที่สุดสำหรับอุปกรณ์เสริมขนาดเล็กที่ต้องการปริมาณ',
  },
  {
    q: 'ขายกระเป๋า luxury บน LINE Shopping ในไทยปลอดภัยไหม?',
    a: 'LINE Shopping ปลอดภัยสำหรับผู้ขายที่มี LINE Official Account ผู้ซื้อมักคุ้นเคยกับแพลตฟอร์มและเชื่อถือ LINE Pay อย่างไรก็ตาม สำหรับชิ้นมูลค่าสูง ควรยืนกรานให้มีการส่งมอบด้วยตัวเองหรือส่งพร้อมประกัน การส่งข้อความในตัวของ LINE ทำให้การต่อรองและบริการลูกค้าสะดวก',
  },
  {
    q: 'ใช้เวลานานแค่ไหนในการขายกระเป๋า luxury บน Vestiaire จากไทย?',
    a: 'เวลาเฉลี่ยในการขายบน Vestiaire Collective คือ 2–8 สัปดาห์ขึ้นอยู่กับแบรนด์และราคา Chanel และ LV ขายได้เร็วที่สุด ชิ้น Hermès ที่ผ่านการตรวจสอบโดย Vestiaire มักขายได้ภายในไม่กี่วัน เมื่อขายแล้ว การตรวจสอบและจัดส่งถึงผู้ซื้อใช้เวลา 5–10 วันทำการ จากนั้นคุณจะได้รับเงิน',
  },
]

export default async function WhereToSellPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
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

  const bestLabels: Record<string, { en: string; th: string }> = {
    'best-local': { en: 'Best local reach', th: 'การเข้าถึงในประเทศดีที่สุด' },
    'best-casual': { en: 'Best for casual sellers', th: 'ดีที่สุดสำหรับผู้ขายทั่วไป' },
    'best-volume': { en: 'Best for volume', th: 'ดีที่สุดสำหรับปริมาณ' },
    'best-value': { en: 'Best for high-value pieces', th: 'ดีที่สุดสำหรับชิ้นมูลค่าสูง' },
    'best-local-auth': { en: 'Best local authenticated', th: 'ดีที่สุดในประเทศแบบตรวจสอบ' },
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
        {isEn ? 'Where to Sell' : 'ขายที่ไหนดี'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? `Where to Sell Pre-Owned Luxury Bags in Thailand ${PRICE_YEAR}` : `ขายกระเป๋า Luxury มือสองที่ไหนดีในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">
        {isEn ? 'Platform comparison for Thai sellers — fees, reach, and payout' : 'เปรียบเทียบแพลตฟอร์มสำหรับผู้ขายในไทย — ค่าธรรมเนียม การเข้าถึง และรายได้'}
      </p>

      <ThaiPriceCallout
        slugs={['chanel/classic-flap-medium', 'hermes/evelyne-tpm', 'gucci/ophidia-gg-medium']}
        locale={locale}
        title={isEn ? 'What Thai shops resell these for' : 'ราคาที่ร้านไทยขายต่อตอนนี้'}
      />

      <section className="mb-14">
        <div className="space-y-6">
          {platforms.map(p => (
            <div key={p.name} className="border border-[#E8E2D9] bg-white">
              <div className="p-5 border-b border-[#E8E2D9] flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>{p.name}</h2>
                  <p className="text-xs text-[#9C8B7A] mt-1">{isEn ? p.reachEn : p.reachTh}</p>
                </div>
                <span className="text-xs bg-[#B8954A] text-white px-2 py-1 shrink-0 ml-3">
                  {isEn ? bestLabels[p.best].en : bestLabels[p.best].th}
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#9C8B7A] uppercase tracking-wider mb-1">{isEn ? 'Fee' : 'ค่าธรรมเนียม'}</p>
                  <p className="text-[#1A1A1A]">{isEn ? p.feeEn : p.feeTh}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9C8B7A] uppercase tracking-wider mb-1">{isEn ? 'Payout' : 'การรับเงิน'}</p>
                  <p className="text-[#1A1A1A]">{isEn ? p.payoutEn : p.payoutTh}</p>
                </div>
                <div>
                  <p className="text-xs text-[#4A7A35] uppercase tracking-wider mb-1">{isEn ? 'Pros' : 'ข้อดี'}</p>
                  <p className="text-[#6B6052]">{isEn ? p.prosEn : p.prosTh}</p>
                  <p className="text-xs text-[#8C7355] uppercase tracking-wider mb-1 mt-2">{isEn ? 'Cons' : 'ข้อเสีย'}</p>
                  <p className="text-[#6B6052]">{isEn ? p.consEn : p.consTh}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Quick Decision Guide' : 'คู่มือการตัดสินใจเร็ว'}
        </h2>
        <div className="space-y-3 text-sm text-[#6B6052]">
          <p>{'→ '}{isEn ? 'Hermès / Chanel above ฿100k: Vestiaire Collective for authentication premium.' : 'Hermès / Chanel เกิน ฿100k: Vestiaire Collective เพื่อ premium จากการตรวจสอบ'}</p>
          <p>{'→ '}{isEn ? 'LV / Gucci ฿20k–฿80k: a Thai resale dealer for speed, or Vestiaire for price.' : 'LV / Gucci ฿20k–฿80k: ร้านมือสองในไทยเพื่อความเร็ว หรือ Vestiaire เพื่อราคา'}</p>
          <p>{'→ '}{isEn ? 'Accessories and SLGs under ฿20k: Shopee or LINE Shopping.' : 'อุปกรณ์เสริมและ SLG ต่ำกว่า ฿20k: Shopee หรือ LINE Shopping'}</p>
          <p>{'→ '}{isEn ? 'Want to hand it over in person in Bangkok: consign with a Thai resale dealer.' : 'อยากส่งมอบด้วยตัวเองในกรุงเทพฯ: ฝากขายกับร้านมือสองในไทย'}</p>
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
