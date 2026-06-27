import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/miu-miu'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Miu Miu Pre-Owned Thailand 2025: Wander Bag & More | ChicPreowned' : 'Miu Miu มือสองในไทย 2025: Wander Bag และอื่นๆ | ChicPreowned',
    description: isEn
      ? 'Buy pre-owned Miu Miu in Thailand — Wander Bag, Arqué, Matelassé. THB prices, value retention, where to find in Bangkok.'
      : 'ซื้อ Miu Miu มือสองในไทย — Wander Bag, Arqué, Matelassé ราคาบาท อัตราการรักษามูลค่า หาซื้อที่ไหนในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function MiuMiuTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const pieces = isEn ? [
    { model: 'Wander Bag', thb: '฿42,000–78,000', retention: '70–75%', note: 'Hottest Miu Miu resale item 2023–25' },
    { model: 'Arqué Bag', thb: '฿38,000–65,000', retention: '65–75%', note: 'Architectural top-handle; fashion crowd buy' },
    { model: 'Matelassé Clutch', thb: '฿24,000–42,000', retention: '55–65%', note: 'Entry piece; accessible for Thai market' },
    { model: 'Crystal Mule', thb: '฿19,000–35,000', retention: '45–60%', note: 'Condition-sensitive; check crystals carefully' },
  ] : [
    { model: 'Wander Bag', thb: '42,000–78,000 บาท', retention: '70–75%', note: 'สินค้า Miu Miu มือสองที่ขายดีที่สุด 2023–25' },
    { model: 'Arqué Bag', thb: '38,000–65,000 บาท', retention: '65–75%', note: 'ทรงสวยมีเอกลักษณ์; กลุ่มแฟชั่นชอบ' },
    { model: 'Matelassé Clutch', thb: '24,000–42,000 บาท', retention: '55–65%', note: 'ราคาเริ่มต้น; เข้าถึงได้สำหรับตลาดไทย' },
    { model: 'Crystal Mule', thb: '19,000–35,000 บาท', retention: '45–60%', note: 'ขึ้นอยู่กับสภาพ; ตรวจคริสตัลให้ดี' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Miu Miu</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? 'Miu Miu Pre-Owned in Thailand' : 'Miu Miu มือสองในไทย'}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? 'Miuccia Prada\'s playful sister brand — the Wander Bag is the most-searched pre-owned item in Southeast Asia 2024–25.'
          : 'แบรนด์พี่น้องจาก Miuccia Prada — Wander Bag คือสินค้ามือสองที่ถูกค้นหามากที่สุดในเอเชียตะวันออกเฉียงใต้ 2024–25'}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">50–75%</div>
          <div className="text-sm text-gray-500 mt-1">{isEn ? 'Value retention' : 'รักษามูลค่า'}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">฿19,000+</div>
          <div className="text-sm text-gray-500 mt-1">{isEn ? 'Entry pre-owned' : 'ราคาเริ่มต้น'}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">Gen Z</div>
          <div className="text-sm text-gray-500 mt-1">{isEn ? 'Key buyer' : 'ผู้ซื้อหลัก'}</div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{isEn ? 'Pre-Owned Prices (THB)' : 'ราคามือสอง (บาท)'}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Price (Very Good)' : 'ราคา (สภาพดีมาก)'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Retention' : 'รักษามูลค่า'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Note' : 'หมายเหตุ'}</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                  <td className="py-3 px-4 text-gray-700">{row.thb}</td>
                  <td className="py-3 px-4 text-gray-600">{row.retention}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 mb-8">
        <strong>{isEn ? 'Where to find in Bangkok:' : 'หาซื้อที่ไหนในกรุงเทพ:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Miu Miu Wander is well-known in Thailand. Look on Facebook Group "กระเป๋าแบรนด์มือสอง", Line Market, and Carousell TH. Authenticate hardware logo and interior date code before buying.'
            : 'Wander เป็นที่รู้จักในไทย หาได้จาก Facebook Group "กระเป๋าแบรนด์มือสอง", Line Market และ Carousell TH ตรวจโลโก้ hardware และ date code ภายในก่อนซื้อเสมอ'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/miu-miu" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/miu-miu" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/prada`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Sister brand: Prada →' : 'แบรนด์พี่น้อง: Prada →'}</Link>
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authentication Guide →' : 'คู่มือตรวจสอบ →'}</Link>
      </div>
    </div>
  )
}
