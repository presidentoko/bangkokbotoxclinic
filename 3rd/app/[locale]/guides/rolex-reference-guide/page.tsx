import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/rolex-reference-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Rolex Reference Number Guide Thailand 2025 | ChicPreowned' : 'คู่มือเลขอ้างอิง Rolex ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'How to read Rolex reference numbers and what each trades for in Thailand. THB prices for Sub, GMT, Daytona and Datejust in 2025.'
      : 'วิธีอ่านเลขอ้างอิง Rolex และราคาซื้อขายในไทย ราคาบาทสำหรับ Sub, GMT, Daytona และ Datejust ปี 2568',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function RolexRefGuideThailand({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const refs = isEn ? [
    { ref: '126610LN', model: 'Submariner Date (black)', retail: '฿370,000', preowned: '฿445,000–540,000', above: true },
    { ref: '126610LV', model: 'Submariner Date (green)', retail: '฿370,000', preowned: '฿520,000–660,000', above: true },
    { ref: '126500LN', model: 'Daytona (black ceramic)', retail: '฿555,000', preowned: '฿1,050,000–1,700,000', above: true },
    { ref: '126334', model: 'Datejust 41 (blue)', retail: '฿336,000', preowned: '฿295,000–390,000', above: false },
    { ref: '126234', model: 'Datejust 36 (silver)', retail: '฿261,000', preowned: '฿230,000–315,000', above: false },
    { ref: '126710BLRO', model: 'GMT-Master II "Pepsi"', retail: '฿393,000', preowned: '฿595,000–830,000', above: true },
  ] : [
    { ref: '126610LN', model: 'Submariner Date (หน้าปัดดำ)', retail: '370,000 บาท', preowned: '445,000–540,000 บาท', above: true },
    { ref: '126610LV', model: 'Submariner Date (หน้าปัดเขียว)', retail: '370,000 บาท', preowned: '520,000–660,000 บาท', above: true },
    { ref: '126500LN', model: 'Daytona (เซรามิกดำ)', retail: '555,000 บาท', preowned: '1,050,000–1,700,000 บาท', above: true },
    { ref: '126334', model: 'Datejust 41 (หน้าปัดน้ำเงิน)', retail: '336,000 บาท', preowned: '295,000–390,000 บาท', above: false },
    { ref: '126234', model: 'Datejust 36 (เงิน)', retail: '261,000 บาท', preowned: '230,000–315,000 บาท', above: false },
    { ref: '126710BLRO', model: 'GMT-Master II "Pepsi"', retail: '393,000 บาท', preowned: '595,000–830,000 บาท', above: true },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Rolex Reference Guide' : 'คู่มือเลขอ้างอิง Rolex'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Rolex Reference Guide for Thai Buyers 2025' : 'คู่มือเลขอ้างอิง Rolex สำหรับผู้ซื้อชาวไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Decode any Rolex reference and find the current THB market price for each.'
          : 'ถอดรหัสเลขอ้างอิง Rolex และหาราคาตลาดปัจจุบันเป็นบาทสำหรับแต่ละรุ่น'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Key References & THB Prices 2025' : 'เลขอ้างอิงสำคัญและราคาบาท 2025'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Ref.' : 'เลขอ้างอิง'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'AD Price' : 'ราคา AD'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Pre-owned (THB)' : 'มือสอง (บาท)'}</th>
              </tr>
            </thead>
            <tbody>
              {refs.map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-mono text-xs font-bold text-gray-700">{r.ref}</td>
                  <td className="py-3 px-4 text-gray-700">{r.model}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{r.retail}</td>
                  <td className="text-right py-3 px-4">
                    <span className={r.above ? 'text-amber-600 font-medium' : 'text-green-700 font-medium'}>{r.preowned}</span>
                    {r.above && <div className="text-xs text-amber-500">{isEn ? 'above retail' : 'เหนือราคาปลีก'}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>{isEn ? 'Thailand note:' : 'หมายเหตุสำหรับไทย:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Rolex AD allocation in Thailand is extremely tight. Most ADs require purchase history + personal relationship for sports models. Pre-owned is the only realistic path to Submariner, GMT, or Daytona in the short term.'
            : 'การจัดสรร Rolex ผ่าน AD ในไทยตึงมาก AD ส่วนใหญ่ต้องการประวัติการซื้อ + ความสัมพันธ์ส่วนตัวสำหรับรุ่นสายกีฬา มือสองเป็นทางเดียวที่เป็นจริงสำหรับ Submariner, GMT หรือ Daytona ในระยะสั้น'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/rolex-reference-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/rolex-reference-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex Prices →' : 'ราคา Rolex →'}
        </Link>
        <Link href={`/${locale}/compare/rolex-vs-patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          Rolex vs Patek →
        </Link>
      </div>
    </div>
  )
}
