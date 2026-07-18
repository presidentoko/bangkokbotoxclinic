import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/luxury-condition-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Luxury Pre-Owned Condition Guide: Excellent to Fair | ChicPreowned Thailand'
      : 'คู่มือสภาพกระเป๋าหรูมือสอง: Excellent ถึง Fair | ChicPreowned ไทย',
    description: isEn
      ? 'Understand pre-owned luxury condition grades — Excellent, Very Good, Good, Fair. How each grade affects price. Guide for Thai buyers.'
      : 'เข้าใจระดับสภาพกระเป๋าหรูมือสอง — Excellent Very Good Good Fair แต่ละระดับส่งผลต่อราคาอย่างไร คู่มือสำหรับผู้ซื้อชาวไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function LuxuryConditionTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const grades = isEn ? [
    {
      grade: 'Excellent / Like New (9–10/10)',
      discount: '90–110% of retail',
      description: 'Looks unused or near-unused. No visible wear, no scratches on hardware, no transfer stains. Original vachetta trim is still pale (not patinated). Original dust bag, box, and authenticity card present.',
      good: 'Perfect investment pieces. Maximum resale value. Buy if the price premium is small.',
    },
    {
      grade: 'Very Good (7–8/10)',
      discount: '70–90% of retail',
      description: 'Light signs of use — slight corner wear, minor hardware scratches visible up close. Vachetta trim has a light honey patina. Interior clean with no pen marks or stains. The best "buy and use" grade.',
      good: 'Best value for daily users. Small discount, looks great in person. Most common grade on resale platforms.',
    },
    {
      grade: 'Good (5–6/10)',
      discount: '50–70% of retail',
      description: 'Noticeable wear at corners and handles. Hardware has surface-level scratches. Vachetta is darker honey or light caramel. May have minor transfer stains inside or small pen marks. Structure mostly intact.',
      good: 'Best for buyers who want the design at maximum discount. Functional and wearable, but visible use.',
    },
    {
      grade: 'Fair (3–4/10)',
      discount: '30–50% of retail',
      description: 'Heavy use signs — stains on canvas or leather, deep hardware scratches, faded or dark vachetta, lining wear, possible odor. May need professional cleaning or hardware polishing.',
      good: 'Buy only if you plan to refurbish, or if you truly love the design regardless of condition. Resale will be very difficult.',
    },
  ] : [
    {
      grade: 'Excellent / Like New (9–10/10)',
      discount: '90–110% ของราคาร้าน',
      description: 'ดูเหมือนไม่ได้ใช้หรือเกือบไม่ได้ใช้ ไม่มีรอยสึก ไม่มีรอยขูด hardware ไม่มีคราบสี ขอบ vachetta ยังอ่อน (ยังไม่ patina) มีถุงผ้า กล่อง และ authenticity card ครบ',
      good: 'ชิ้นลงทุนที่สมบูรณ์แบบ มูลค่าขายต่อสูงสุด ซื้อถ้าราคาพรีเมียมเล็กน้อย',
    },
    {
      grade: 'Very Good (7–8/10)',
      discount: '70–90% ของราคาร้าน',
      description: 'สัญญาณใช้งานเล็กน้อย — มุมสึกเล็กน้อย รอยขูด hardware มองเห็นใกล้ๆ ขอบ vachetta patina สีน้ำผึ้งอ่อน ด้านในสะอาดไม่มีรอยปากกาหรือคราบ เกรดที่ดีที่สุดสำหรับ "ซื้อและใช้"',
      good: 'คุ้มค่าที่สุดสำหรับผู้ใช้งานทุกวัน ราคาลดเล็กน้อย ดูดีในชีวิตจริง เกรดที่พบมากที่สุดบนแพลตฟอร์มมือสอง',
    },
    {
      grade: 'Good (5–6/10)',
      discount: '50–70% ของราคาร้าน',
      description: 'รอยสึกเห็นได้ที่มุมและที่จับ Hardware มีรอยขูดพื้นผิว vachetta เป็นสีน้ำผึ้งเข้มหรือคาราเมลอ่อน อาจมีคราบสีเล็กน้อยภายในหรือรอยปากกาเล็กน้อย โครงสร้างยังดี',
      good: 'ดีที่สุดสำหรับผู้ที่ต้องการดีไซน์ในราคาลดสูงสุด ใช้งานได้และสวมใส่ได้แต่เห็นร่องรอยการใช้งาน',
    },
    {
      grade: 'Fair (3–4/10)',
      discount: '30–50% ของราคาร้าน',
      description: 'รอยใช้งานหนัก — คราบบนผ้าหรือหนัง รอยขูด hardware ลึก vachetta เข้มหรือซีด บุด้านในสึก อาจมีกลิ่น อาจต้องทำความสะอาดหรือขัด hardware',
      good: 'ซื้อเฉพาะถ้าวางแผนซ่อมแซม หรือถ้าชอบดีไซน์จริงๆ โดยไม่สนใจสภาพ การขายต่อจะยากมาก',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Condition Guide' : 'คู่มือสภาพ'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Luxury Pre-Owned Condition Guide' : 'คู่มือสภาพกระเป๋าหรูมือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Pre-owned luxury uses four standard condition grades. Understanding them helps you buy at the right price and set expectations about what you\'ll receive. Very Good is the sweet spot for most buyers.'
          : 'กระเป๋าหรูมือสองใช้สี่ระดับสภาพมาตรฐาน การเข้าใจช่วยให้ซื้อในราคาที่เหมาะสมและตั้งความคาดหวังถูก "Very Good" คือจุดหวานสำหรับผู้ซื้อส่วนใหญ่'}
      </p>

      <div className="space-y-6 mb-10">
        {grades.map((g, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-2 text-lg">{g.grade}</h2>
            <p className="text-sm font-semibold text-amber-700 mb-3">{g.discount}</p>
            <p className="text-sm text-gray-600 mb-3">{g.description}</p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
              <strong>{isEn ? 'When to buy:' : 'ควรซื้อเมื่อ:'}</strong> {g.good}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/luxury-condition-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/luxury-condition-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Auth Guide →' : 'คู่มือตรวจสอบ →'}</Link>
        <Link href={`/${locale}/guides/where-to-sell-luxury-bags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Where to Sell →' : 'ที่ขายกระเป๋า →'}</Link>
      </div>
    </div>
  )
}
