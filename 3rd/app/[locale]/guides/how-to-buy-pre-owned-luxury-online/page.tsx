import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-buy-pre-owned-luxury-online'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Buy Pre-Owned Luxury Online Thailand 2025 | ChicPreowned'
      : 'วิธีซื้อของหรูมือสองออนไลน์อย่างปลอดภัยในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Complete guide to buying pre-owned luxury bags and watches online safely in Thailand — authentication, payment, condition grades, red flags 2025.'
      : 'คู่มือซื้อกระเป๋าและนาฬิกาหรูมือสองออนไลน์อย่างปลอดภัยในไทย — การตรวจสอบ การชำระเงิน เกรดสภาพ สัญญาณเตือน 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function HowToBuyPreOwnedOnlineTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const steps = isEn ? [
    { n: '1', title: 'Know the retail price first', body: 'Before shopping pre-owned, check the current retail price in Thailand (boutique or brand website). Pre-owned should be 30–80% of retail. A Chanel Classic Flap listed at ฿420,000 pre-owned vs ฿388,800 retail? Walk away.' },
    { n: '2', title: 'Understand condition grades', body: 'Excellent = minimal signs of use. Very Good = light wear. Good = visible wear. Never pay Excellent prices for Good condition. Request photos of corners, hardware, interior, datecode, and hologram/serial card.' },
    { n: '3', title: 'Request serial and datecodes', body: 'Chanel: white authenticity chip card (newer) or black hologram sticker (older). LV: date code stamped inside (e.g., TH0062). Hermès: blind stamp inside flap. Rolex: reference and serial engraved on case. No code = no buy.' },
    { n: '4', title: 'Verify the seller on Thai platforms', body: 'On Carousell Thailand, LINE OA shops, or Facebook Marketplace: check account age, review count, response speed. For unknown sellers request video call + real-time photos. Scammers reuse the same set of 5 stock photos across listings.' },
    { n: '5', title: 'Use protected payment methods', body: 'Bank transfer with seller\'s ID attached (Thai law requires ID for high-value sales). Credit card through Lazada/Shopee luxury section has 15-day protection. Avoid PromptPay to unknown accounts — no recourse after transfer.' },
    { n: '6', title: 'Authenticate immediately on arrival', body: 'Authentication services in Bangkok: Authenticate First (สยามพารากอน), or ship to international authenticators. Budget ฿700–฿1,800. If the seller refuses authentication requests before purchase, assume counterfeit.' },
  ] : [
    { n: '1', title: 'รู้ราคาร้านก่อน', body: 'ก่อนช้อปมือสอง ตรวจสอบราคาร้านปัจจุบันในไทย (บูติกหรือเว็บไซต์แบรนด์) มือสองควรอยู่ที่ 30–80% ของราคาร้าน Chanel Classic Flap ที่ลงราคา ฿420,000 มือสองเมื่อเทียบกับ ฿388,800 ราคาร้าน? หนีได้เลย' },
    { n: '2', title: 'เข้าใจเกรดสภาพ', body: 'Excellent = ร่องรอยการใช้งานน้อยมาก Very Good = รอยสึกเล็กน้อย Good = รอยสึกที่มองเห็นได้ อย่าจ่ายราคา Excellent สำหรับสภาพ Good ขอภาพมุม hardware ด้านใน datecode และการ์ด/สติกเกอร์ hologram' },
    { n: '3', title: 'ขอ serial และ datecode', body: 'Chanel: บัตรตรวจสอบความถูกต้องสีขาว (รุ่นใหม่) หรือสติกเกอร์ hologram สีดำ (รุ่นเก่า) LV: date code ประทับในตัว (เช่น TH0062) Hermès: ตราประทับอยู่ด้านในฝา Rolex: reference และ serial แกะสลักที่เคส ไม่มีรหัส = ไม่ซื้อ' },
    { n: '4', title: 'ตรวจสอบผู้ขายบนแพลตฟอร์มไทย', body: 'บน Carousell ไทย LINE OA shops หรือ Facebook Marketplace ตรวจสอบอายุบัญชี จำนวนรีวิว ความเร็วในการตอบ สำหรับผู้ขายที่ไม่รู้จัก ขอวิดีโอคอล + ภาพถ่ายเรียลไทม์ มิจฉาชีพใช้ชุดรูปภาพ stock 5 ใบเดียวกันในหลายลิสต์' },
    { n: '5', title: 'ใช้วิธีชำระเงินที่ได้รับการคุ้มครอง', body: 'โอนเงินผ่านธนาคารพร้อมแนบบัตรประชาชนของผู้ขาย (กฎหมายไทยกำหนดให้แสดง ID สำหรับการขายมูลค่าสูง) บัตรเครดิตผ่าน Lazada/Shopee มีการคุ้มครอง 15 วัน หลีกเลี่ยง PromptPay ให้บัญชีที่ไม่รู้จัก ไม่มีทางแก้ไขหลังโอน' },
    { n: '6', title: 'ตรวจสอบความถูกต้องทันทีเมื่อได้รับ', body: 'บริการตรวจสอบในกรุงเทพ: ร้านตรวจสอบที่สยามพารากอน หรือส่งให้ผู้ตรวจสอบนานาชาติ งบประมาณ ฿700–฿1,800 หากผู้ขายปฏิเสธการตรวจสอบก่อนซื้อ ให้สันนิษฐานว่าเป็นของปลอม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'How to Buy Pre-Owned Luxury Online' : 'วิธีซื้อของหรูมือสองออนไลน์'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Buy Pre-Owned Luxury Online Safely' : 'วิธีซื้อของหรูมือสองออนไลน์อย่างปลอดภัย'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The pre-owned luxury market in Thailand is growing 25% per year — but counterfeits are everywhere. Six rules that eliminate 95% of the risk and help you buy safely on Carousell, LINE shops, Facebook Marketplace, and pre-owned boutiques in Bangkok.'
          : 'ตลาดของหรูมือสองในไทยเติบโต 25% ต่อปี แต่ของปลอมมีอยู่ทุกที่ หกกฎที่ช่วยลดความเสี่ยง 95% และช่วยให้คุณซื้อได้อย่างปลอดภัยบน Carousell ร้าน LINE Facebook Marketplace และร้านมือสองในกรุงเทพ'}
      </p>

      <div className="space-y-4 mb-10">
        {steps.map((s) => (
          <div key={s.n} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">{s.n}</div>
              <div>
                <h2 className="font-bold text-gray-900 mb-1">{s.title}</h2>
                <p className="text-sm text-gray-600">{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-red-900 mb-3">
          {isEn ? 'Red flags — walk away immediately' : 'สัญญาณเตือน — หยุดซื้อทันที'}
        </h3>
        <ul className="space-y-1 text-sm text-red-800">
          {(isEn ? [
            'Price is 85–100%+ of retail (not a deal — likely counterfeit)',
            'Seller refuses video call or additional real-time photos',
            'No serial, no datecode, no hologram card',
            '"Just got it as a gift" from account with no sales history',
            'Requests PromptPay, wire, or crypto only — no protected payment',
            'Stock photos with white background, no personal context photos',
          ] : [
            'ราคา 85–100%+ ของราคาร้าน (ไม่ใช่ดีล — น่าจะเป็นของปลอม)',
            'ผู้ขายปฏิเสธวิดีโอคอลหรือภาพถ่ายเรียลไทม์เพิ่มเติม',
            'ไม่มี serial ไม่มี datecode ไม่มีบัตร hologram',
            '"เพิ่งได้รับเป็นของขวัญ" จากบัญชีที่ไม่มีประวัติการขาย',
            'ขอเฉพาะ PromptPay โอนเงิน หรือ crypto เท่านั้น ไม่มีการชำระเงินที่ได้รับการคุ้มครอง',
            'รูปภาพ stock พื้นหลังขาว ไม่มีรูปภาพส่วนตัว',
          ]).map((f, i) => <li key={i}>• {f}</li>)}
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-buy-pre-owned-luxury-online" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-buy-pre-owned-luxury-online" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/luxury-condition-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Condition Guide →' : 'เกรดสภาพ →'}</Link>
        <Link href={`/${locale}/guides/how-to-spot-fake-luxury-bags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Spot Fakes →' : 'สังเกตของปลอม →'}</Link>
      </div>
    </div>
  )
}
