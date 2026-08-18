import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-chanel'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `How to Authenticate Chanel Bag Thailand ${PRICE_YEAR} | ChicPreowned`
      : `วิธีตรวจสอบกระเป๋า Chanel แท้ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `Authenticate Chanel bags in Thailand — serial numbers, CC hardware alignment, stitching, dust bag. ${PRICE_YEAR} guide with Thai market tips.`
      : `ตรวจสอบกระเป๋า Chanel แท้ในไทย — เลขซีเรียล โลโก้ CC การเย็บ ถุงผ้า คู่มือ ${PRICE_YEAR} พร้อมเคล็ดลับตลาดไทย`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthChanelTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { step: 1, title: 'Serial Number / Microchip', detail: 'Pre-2021: 8-digit serial sticker inside bag (matches authenticity card). Post-2021: Chanel switched to embedded microchip — no visible sticker. Missing sticker on newer bags is NOT a red flag. Sticker that peels easily or sits raised = fake.' },
    { step: 2, title: 'CC Hardware Alignment', detail: 'The double-C logo has a specific overlap: the right C crosses OVER the left C at the top. At the bottom, left C crosses over right. Fakes often reverse this or make the overlap equal. This single check eliminates ~80% of fakes.' },
    { step: 3, title: 'Stitching Density', detail: 'Authentic Chanel: 10–12 stitches per diamond of the quilting. Stitches are even, same tension, same color throughout. Fakes: uneven spacing, slight color variation, loose ends at corners.' },
    { step: 4, title: 'Hardware Weight & Finish', detail: 'Gold hardware should feel heavy and solid — tap it. A hollow sound suggests plating over lightweight metal. Authentic GHW is warm yellow-gold, not brassy. Authentic SHW is bright but not mirror-like.' },
    { step: 5, title: 'Dust Bag', detail: 'Authentic Chanel dust bag is white jersey/fleece with "CHANEL" in black. The font spacing and weight are specific — counterfeit bags often have slightly wrong letter proportions or lighter fabric.' },
    { step: 6, title: 'Hologram & Authenticity Card', detail: 'Hologram sticker (pre-2021 pieces) has a rainbow sheen and a series number that matches the sticker inside. The authenticity card has embossed text on firm cardstock — thin, flexible cards are fake.' },
  ] : [
    { step: 1, title: 'เลขซีเรียล / ไมโครชิป', detail: 'ก่อน 2021: สติกเกอร์ 8 หลักภายในกระเป๋า (ตรงกับ authenticity card) หลัง 2021: Chanel เปลี่ยนเป็น microchip — ไม่มีสติกเกอร์ให้เห็น ไม่มีสติกเกอร์ในรุ่นใหม่ ไม่ใช่สัญญาณของปลอม สติกเกอร์ลอกง่ายหรือนูนขึ้น = ปลอม' },
    { step: 2, title: 'การทับซ้อนโลโก้ CC', detail: 'โลโก้ CC มีการทับซ้อนเฉพาะ: C ขวาทับ C ซ้ายด้านบน C ซ้ายทับ C ขวาด้านล่าง ของปลอมมักสลับทิศทางหรือทับเท่ากัน การตรวจนี้กำจัดของปลอมได้ ~80%' },
    { step: 3, title: 'ความหนาแน่นการเย็บ', detail: 'Chanel แท้: 10–12 เข็มต่อเพชรของลาย ตะเข็บสม่ำเสมอ แรงดึงเท่ากัน สีเดียวตลอด ของปลอม: ช่องว่างไม่สม่ำเสมอ สีเล็กน้อยต่าง ปลายหลวมที่มุม' },
    { step: 4, title: 'น้ำหนักและผิวทาง Hardware', detail: 'Hardware สีทองควรรู้สึกหนักและแน่น เคาะดู เสียงกลวง = ชุบบนโลหะเบา GHW แท้เป็นสีทองเหลือง ไม่เป็นสีทองเหลืองหัวรุนแรง SHW แท้สว่างแต่ไม่เหมือนกระจก' },
    { step: 5, title: 'ถุงผ้า', detail: 'ถุงผ้า Chanel แท้เป็นผ้าขาว jersey/fleece มีตัวอักษร "CHANEL" สีดำ ขนาดและน้ำหนักตัวอักษรเฉพาะ ของปลอมมักมีสัดส่วนตัวอักษรผิด หรือผ้าบางกว่า' },
    { step: 6, title: 'โฮโลแกรมและ Authenticity Card', detail: 'สติกเกอร์โฮโลแกรม (ชิ้นก่อน 2021) มีประกายสีรุ้งและเลขซีเรียลตรงกับสติกเกอร์ภายใน authenticity card มีตัวอักษรนูนบนกระดาษแข็ง การ์ดบางยืดหยุ่น = ปลอม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Chanel' : 'ตรวจสอบ Chanel'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate a Chanel Bag' : 'วิธีตรวจสอบกระเป๋า Chanel แท้'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Chanel is the most counterfeited luxury handbag brand in Thailand. Six checks that separate authentic from fake — starting with the most reliable.'
          : 'Chanel คือแบรนด์กระเป๋าหรูที่ถูกปลอมมากที่สุดในไทย หกการตรวจสอบที่แยกของแท้จากของปลอม เริ่มจากที่เชื่อถือได้มากที่สุด'}
      </p>

      <div className="space-y-4 mb-10">
        {checks.map(c => (
          <div key={c.step} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{c.step}</span>
              <h2 className="font-semibold text-gray-900">{c.title}</h2>
            </div>
            <p className="text-sm text-gray-600 ml-10">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-chanel" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-chanel" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Pre-Owned →' : 'Chanel มือสอง →'}</Link>
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Auth Basics →' : 'พื้นฐานการตรวจสอบ →'}</Link>
      </div>
    </div>
  )
}
