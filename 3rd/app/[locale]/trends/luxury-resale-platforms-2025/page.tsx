import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/luxury-resale-platforms-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Best Luxury Resale Platforms for Thai Buyers 2025 | ChicPreowned'
      : 'แพลตฟอร์มขายของหรูมือสองที่ดีที่สุดสำหรับผู้ซื้อชาวไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Vestiaire Collective vs The RealReal vs Fashionphile vs Rebag 2025 — fees, authentication, which platform works for Thai buyers and sellers of pre-owned luxury.'
      : 'Vestiaire Collective vs The RealReal vs Fashionphile vs Rebag 2025 — ค่าธรรมเนียม การรับรองความถูกต้อง แพลตฟอร์มไหนเหมาะสำหรับผู้ซื้อและผู้ขายชาวไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function ResalePlatformsTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const platforms = isEn ? [
    {
      name: 'Vestiaire Collective',
      type: 'Peer-to-peer marketplace',
      sellerFee: '12% + €0.80 per sale',
      buyerFee: '6% + fixed fee by price tier',
      auth: 'Condition/authenticity check on items over €100. Partner labs in Asia.',
      bestFor: 'European + Asia-Pacific sellers. Best reach for Hermès, Chanel, Louis Vuitton. Has Thai-facing interface.',
      watchOut: 'Authentication slows delivery (1–3 weeks). Disputes take time.',
      verdict: 'Best for Thai buyers and sellers. Strongest Asia-Pacific reach. Start here for premium brands.',
    },
    {
      name: 'The RealReal',
      type: 'US consignment',
      sellerFee: '20–45% commission (you keep 55–80%)',
      buyerFee: 'No buyer premium. Free US shipping $500+',
      auth: 'In-house gemologists and luxury brand experts. Strong reputation.',
      bestFor: 'US-based sellers. Hands-off consignment — they photograph and sell everything.',
      watchOut: 'US-only consignment. Thai buyers face US import complexity and shipping cost.',
      verdict: 'Good for Thai buyers wanting US market prices. Not useful for Thai sellers.',
    },
    {
      name: 'Fashionphile',
      type: 'US consignment (handbags only)',
      sellerFee: '30–45% commission or instant buy-out',
      buyerFee: 'No buyer premium',
      auth: 'Strong specialist authentication for Hermès, Chanel, LV handbags.',
      bestFor: 'US sellers wanting fast cash for premium handbags. Buyers wanting vetted pieces.',
      watchOut: 'US-only. Handbags and accessories only. Not relevant for Thai direct selling.',
      verdict: 'Good source for Thai buyers who shop internationally. Not a Thai seller platform.',
    },
    {
      name: 'Rebag',
      type: 'Instant buy-out (US)',
      sellerFee: 'No commission — they buy directly at a quoted price',
      buyerFee: 'Fixed pricing. No negotiation.',
      auth: 'Strong authentication — they own the item so have full incentive to verify.',
      bestFor: 'Sellers wanting the fastest, most predictable cash-out.',
      watchOut: 'Buy prices lower than peer-to-peer. Speed over maximum value.',
      verdict: 'Use Rebag for speed and certainty. Not accessible from Thailand for selling.',
    },
  ] : [
    {
      name: 'Vestiaire Collective',
      type: 'Peer-to-peer marketplace',
      sellerFee: '12% + €0.80 ต่อการขาย',
      buyerFee: '6% + ค่าธรรมเนียมคงที่ตามช่วงราคา',
      auth: 'ตรวจสอบสภาพ/ความถูกต้องสำหรับสินค้าเกิน €100 มีพาร์ทเนอร์แล็บในเอเชีย',
      bestFor: 'ผู้ขายในยุโรป + เอเชียแปซิฟิก การเข้าถึงที่ดีที่สุดสำหรับ Hermès, Chanel, Louis Vuitton มีอินเตอร์เฟสไทย',
      watchOut: 'การรับรองความถูกต้องทำให้การส่งช้า (1–3 สัปดาห์) ข้อพิพาทใช้เวลา',
      verdict: 'ดีที่สุดสำหรับผู้ซื้อและผู้ขายชาวไทย การเข้าถึงเอเชียแปซิฟิกที่แข็งแกร่งที่สุด เริ่มที่นี่สำหรับแบรนด์พรีเมียม',
    },
    {
      name: 'The RealReal',
      type: 'Consignment สหรัฐฯ',
      sellerFee: 'ค่าคอมมิชชั่น 20–45% (คุณได้รับ 55–80%)',
      buyerFee: 'ไม่มีค่าธรรมเนียมผู้ซื้อ ส่งฟรีในสหรัฐฯ $500+',
      auth: 'ผู้เชี่ยวชาญด้านอัญมณีและแบรนด์หรูภายในบริษัท ชื่อเสียงแข็งแกร่ง',
      bestFor: 'ผู้ขายในสหรัฐฯ Consignment ไม่ต้องทำอะไรเลย พวกเขาถ่ายรูปและขายทุกอย่าง',
      watchOut: 'Consignment เฉพาะในสหรัฐฯ ผู้ซื้อชาวไทยต้องเผชิญความซับซ้อนในการนำเข้าและค่าขนส่ง',
      verdict: 'ดีสำหรับผู้ซื้อชาวไทยที่ต้องการราคาตลาดสหรัฐฯ ไม่มีประโยชน์สำหรับผู้ขายชาวไทย',
    },
    {
      name: 'Fashionphile',
      type: 'Consignment สหรัฐฯ (กระเป๋าเท่านั้น)',
      sellerFee: 'ค่าคอมมิชชั่น 30–45% หรือรับเงินสดทันที',
      buyerFee: 'ไม่มีค่าธรรมเนียมผู้ซื้อ',
      auth: 'การรับรองผู้เชี่ยวชาญที่แข็งแกร่งสำหรับกระเป๋า Hermès, Chanel, LV',
      bestFor: 'ผู้ขายในสหรัฐฯ ที่ต้องการเงินสดเร็วสำหรับกระเป๋าพรีเมียม ผู้ซื้อที่ต้องการชิ้นที่ตรวจสอบแล้ว',
      watchOut: 'เฉพาะสหรัฐฯ กระเป๋าและเครื่องประดับเท่านั้น ไม่เกี่ยวข้องกับการขายตรงจากไทย',
      verdict: 'แหล่งที่ดีสำหรับผู้ซื้อชาวไทยที่ช้อปปิ้งระหว่างประเทศ ไม่ใช่แพลตฟอร์มสำหรับผู้ขายชาวไทย',
    },
    {
      name: 'Rebag',
      type: 'รับซื้อทันที (สหรัฐฯ)',
      sellerFee: 'ไม่มีค่าคอมมิชชั่น พวกเขาซื้อตรงในราคาที่เสนอ',
      buyerFee: 'ราคาคงที่ ไม่มีการต่อรอง',
      auth: 'การรับรองที่แข็งแกร่ง พวกเขาเป็นเจ้าของสินค้าจึงมีแรงจูงใจเต็มที่ในการตรวจสอบ',
      bestFor: 'ผู้ขายที่ต้องการเงินสดที่เร็วและคาดเดาได้มากที่สุด',
      watchOut: 'ราคาซื้อต่ำกว่า peer-to-peer ความเร็วเหนือมูลค่าสูงสุด',
      verdict: 'ใช้ Rebag สำหรับความเร็วและความแน่นอน ไม่สามารถเข้าถึงได้จากไทยสำหรับการขาย',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Luxury Resale Platforms 2025' : 'แพลตฟอร์มขายหรูมือสอง 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Best Luxury Resale Platforms for Thai Buyers 2025' : 'แพลตฟอร์มขายของหรูมือสองที่ดีที่สุดสำหรับผู้ซื้อชาวไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Vestiaire Collective, The RealReal, Fashionphile, and Rebag each serve different geographies and needs. For Thai buyers and sellers, geography matters: US-focused platforms require workarounds. Here is what actually works from Thailand.'
          : 'Vestiaire Collective, The RealReal, Fashionphile และ Rebag ต่างให้บริการภูมิศาสตร์และความต้องการที่แตกต่างกัน สำหรับผู้ซื้อและผู้ขายชาวไทย ภูมิศาสตร์มีความสำคัญ: แพลตฟอร์มที่เน้นสหรัฐฯ ต้องการวิธีแก้ปัญหา นี่คือสิ่งที่ใช้ได้จริงจากไทย'}
      </p>

      <div className="space-y-6 mb-10">
        {platforms.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-3">
              <h2 className="font-bold text-gray-900 text-lg">{p.name}</h2>
              <span className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500">{p.type}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div className="text-xs"><span className="font-medium text-gray-700">{isEn ? 'Seller fee' : 'ค่าธรรมเนียมผู้ขาย'}: </span><span className="text-gray-600">{p.sellerFee}</span></div>
              <div className="text-xs"><span className="font-medium text-gray-700">{isEn ? 'Buyer fee' : 'ค่าธรรมเนียมผู้ซื้อ'}: </span><span className="text-gray-600">{p.buyerFee}</span></div>
            </div>
            <p className="text-xs text-gray-600 mb-2"><span className="font-medium text-gray-700">{isEn ? 'Authentication' : 'การรับรอง'}: </span>{p.auth}</p>
            <p className="text-xs text-gray-600 mb-2"><span className="font-medium text-gray-700">{isEn ? 'Best for' : 'ดีที่สุดสำหรับ'}: </span>{p.bestFor}</p>
            <p className="text-xs text-gray-600 mb-3"><span className="font-medium text-amber-700">{isEn ? 'Watch out' : 'ระวัง'}: </span>{p.watchOut}</p>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-900">{isEn ? 'Our take' : 'ความเห็นเรา'}: <span className="font-normal text-gray-600">{p.verdict}</span></p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'Quick guide for Thai buyers' : 'คู่มือด่วนสำหรับผู้ซื้อชาวไทย'}</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          {(isEn ? [
            'Selling from Thailand: Vestiaire Collective is your best choice',
            'Buying internationally: Vestiaire (best prices) or The RealReal (strong auth)',
            'Need fast cash from Thailand: Vestiaire "Direct selling" option',
            'Worried about authenticity: Vestiaire authentication guarantee or Rebag',
          ] : [
            'ขายจากไทย: Vestiaire Collective คือตัวเลือกที่ดีที่สุดของคุณ',
            'ซื้อจากต่างประเทศ: Vestiaire (ราคาดีที่สุด) หรือ The RealReal (การรับรองแข็งแกร่ง)',
            'ต้องการเงินสดเร็วจากไทย: ตัวเลือก "Direct selling" ของ Vestiaire',
            'กังวลเรื่องความถูกต้อง: การรับประกันการรับรองของ Vestiaire หรือ Rebag',
          ]).map((item, i) => <li key={i}>• {item}</li>)}
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/luxury-resale-platforms-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/luxury-resale-platforms-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/where-to-sell-luxury-bags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Where to Sell Guide →' : 'คู่มือที่ไหนขาย →'}</Link>
        <Link href={`/${locale}/guides/how-to-buy-pre-owned-luxury-online`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'How to Buy Online →' : 'วิธีซื้อออนไลน์ →'}</Link>
      </div>
    </div>
  )
}
