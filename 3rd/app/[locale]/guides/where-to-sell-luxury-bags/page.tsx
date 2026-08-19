import type { Metadata } from 'next'
import { PRICE_YEAR } from '@/lib/site'

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
      ? 'Platform comparison for Thai luxury sellers: Carousell TH, LINE Shopping, Shopee, Vestiaire Collective, LuxeStreet TH — fees, reach, and payout compared.'
      : 'เปรียบเทียบแพลตฟอร์มสำหรับผู้ขาย luxury ในไทย: Carousell, LINE Shopping, Shopee, Vestiaire, LuxeStreet TH — ค่าธรรมเนียม, การเข้าถึง และรายได้',
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
    name: 'Carousell Thailand',
    feeEn: 'Free listing, ~3–5% for promoted',
    feeTh: 'ลงประกาศฟรี ~3–5% สำหรับโปรโมต',
    reachEn: 'Largest local reach in Thailand',
    reachTh: 'การเข้าถึงในประเทศมากที่สุดในไทย',
    payoutEn: 'Negotiated directly with buyer',
    payoutTh: 'ต่อรองตรงกับผู้ซื้อ',
    prosEn: 'No seller fees on standard listings. Large local audience. Fast transactions.',
    prosTh: 'ไม่มีค่าธรรมเนียมผู้ขายในประกาศมาตรฐาน ผู้ชมในประเทศจำนวนมาก ธุรกรรมรวดเร็ว',
    consEn: 'No authentication. Counterfeit risk for buyers reduces trust.',
    consTh: 'ไม่มีการตรวจสอบ ความเสี่ยงของสินค้าปลอมทำให้ความน่าเชื่อถือลดลง',
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
  {
    name: 'LuxeStreet TH',
    feeEn: '10–12% consignment commission',
    feeTh: 'ค่าคอมมิชชัน consignment 10–12%',
    reachEn: 'Local Thai luxury buyers',
    reachTh: 'ผู้ซื้อ luxury ไทยในประเทศ',
    payoutEn: 'Bank transfer after sale',
    payoutTh: 'โอนธนาคารหลังขาย',
    prosEn: 'Local expertise. Physical showroom in Bangkok. Authentication included.',
    prosTh: 'ความเชี่ยวชาญในประเทศ ห้องแสดงสินค้าในกรุงเทพฯ รวมการตรวจสอบ',
    consEn: 'Smaller buyer pool than Vestiaire. May take longer to sell.',
    consTh: 'กลุ่มผู้ซื้อเล็กกว่า Vestiaire อาจใช้เวลานานกว่าในการขาย',
    best: 'best-local-auth',
  },
]

const faqsEn = [
  {
    q: 'What is the best platform to sell luxury bags in Thailand?',
    a: "It depends on the bag's value. For high-value pieces (Chanel, Hermès above ฿100,000), Vestiaire Collective or LuxeStreet TH gives better prices despite higher commission. For mid-range bags and accessories under ฿50,000, Carousell Thailand offers the fastest sales with no fees. Shopee is best for small accessories where volume matters.",
  },
  {
    q: 'How much commission does Carousell Thailand charge for luxury bags?',
    a: 'Standard listings on Carousell Thailand are free. Promoted listings cost ฿50–฿200 per boost. There is no success fee on standard listings — you keep 100% of the sale price. Buyers pay what you list, and payment is typically via PromptPay or cash on meetup.',
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
    a: 'ขึ้นอยู่กับมูลค่ากระเป๋า สำหรับชิ้นมูลค่าสูง (Chanel, Hermès เกิน ฿100,000) Vestiaire Collective หรือ LuxeStreet TH ให้ราคาดีกว่าแม้ค่าคอมมิชชันจะสูงกว่า สำหรับกระเป๋าราคากลางและอุปกรณ์เสริมต่ำกว่า ฿50,000 Carousell Thailand ขายได้เร็วที่สุดโดยไม่มีค่าธรรมเนียม Shopee เหมาะที่สุดสำหรับอุปกรณ์เสริมขนาดเล็กที่ต้องการปริมาณ',
  },
  {
    q: 'Carousell Thailand เก็บค่าคอมมิชชันเท่าไหร่สำหรับกระเป๋า luxury?',
    a: 'ประกาศมาตรฐานบน Carousell Thailand ฟรี ประกาศโปรโมตราคา ฿50–฿200 ต่อการบูสต์ ไม่มีค่าธรรมเนียมความสำเร็จในประกาศมาตรฐาน — คุณได้รับ 100% ของราคาขาย ผู้ซื้อจ่ายตามที่คุณตั้งราคา และการชำระเงินมักผ่าน PromptPay หรือเงินสดเมื่อนัดพบ',
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
          <p>{'→ '}{isEn ? 'LV / Gucci ฿20k–฿80k: Carousell Thailand for speed, or Vestiaire for price.' : 'LV / Gucci ฿20k–฿80k: Carousell Thailand เพื่อความเร็ว หรือ Vestiaire เพื่อราคา'}</p>
          <p>{'→ '}{isEn ? 'Accessories and SLGs under ฿20k: Shopee or Carousell Thailand.' : 'อุปกรณ์เสริมและ SLG ต่ำกว่า ฿20k: Shopee หรือ Carousell Thailand'}</p>
          <p>{'→ '}{isEn ? 'Want local Bangkok buyers only: LuxeStreet TH for in-person consignment.' : 'ต้องการผู้ซื้อในกรุงเทพฯ เท่านั้น: LuxeStreet TH สำหรับ consignment แบบพบตัว'}</p>
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
