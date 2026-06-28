import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/gucci-dionysus-vs-marmont'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Gucci Dionysus vs GG Marmont Thailand 2025 | ChicPreowned'
      : 'Gucci Dionysus vs GG Marmont ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Gucci Dionysus vs GG Marmont for Thai buyers — THB prices, which holds value better, tiger vs chevron quilting, Bangkok resale tips.'
      : 'Gucci Dionysus vs GG Marmont สำหรับคนไทย — ราคาบาท อันไหน resale ดีกว่า tiger vs chevron quilting เคล็ดลับ resale กรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function DionysusMarmontTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const priceRows = isEn ? [
    { model: 'Dionysus Small', thb: '฿30,000–44,000', hold: '40–65%' },
    { model: 'Dionysus Super Mini', thb: '฿18,000–30,000', hold: '37–62%' },
    { model: 'GG Marmont Small', thb: '฿16,000–28,000', hold: '30–54%' },
    { model: 'GG Marmont Medium', thb: '฿18,000–31,000', hold: '30–50%' },
  ] : [
    { model: 'Dionysus Small', thb: '30,000–44,000 บาท', hold: '40–65%' },
    { model: 'Dionysus Super Mini', thb: '18,000–30,000 บาท', hold: '37–62%' },
    { model: 'GG Marmont Small', thb: '16,000–28,000 บาท', hold: '30–54%' },
    { model: 'GG Marmont Medium', thb: '18,000–31,000 บาท', hold: '30–50%' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>Dionysus vs GG Marmont</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Gucci Dionysus vs GG Marmont: Which to Buy?' : 'Gucci Dionysus vs GG Marmont: ซื้ออะไรดี?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two Alessandro Michele-era Gucci icons. Dionysus retains value slightly better; Marmont has more size options but is showing logo fatigue in the resale market.'
          : 'สองไอคอน Gucci ยุค Alessandro Michele Dionysus รักษามูลค่าได้ดีกว่าเล็กน้อย Marmont มีตัวเลือกขนาดมากกว่าแต่กำลังเบื่อโลโก้ในตลาด resale'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Pre-Owned (THB)' : 'มือสอง (บาท)'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Holds Value' : 'รักษามูลค่า'}</th>
            </tr>
          </thead>
          <tbody>
            {priceRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">{row.thb}</td>
                <td className="py-3 px-4 text-gray-500">{row.hold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 mb-8">
        <strong>{isEn ? 'Bottom line:' : 'สรุป:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'If you\'re buying for aesthetics and plan to keep it — either works. If you\'re buying with resale in mind, the Dionysus is the safer choice. Both are entry-level Gucci; for stronger resale at Gucci, look at vintage pieces or crossbody bag classics.'
            : 'หากซื้อเพื่อความสวยงามและวางแผนจะเก็บไว้ — ทั้งคู่ใช้ได้ หากซื้อโดยคิดถึง resale Dionysus ปลอดภัยกว่า ทั้งคู่เป็น Gucci ระดับเริ่มต้น สำหรับ resale ที่แข็งแกร่งกว่าที่ Gucci ให้มองที่ vintage pieces หรือ crossbody bag คลาสสิก'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/gucci-dionysus-vs-marmont" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/gucci-dionysus-vs-marmont" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci {isEn ? 'Pre-Owned' : 'มือสอง'} →</Link>
        <Link href={`/${locale}/trends/resale-value-drops-to-avoid`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Value Drops →' : 'ราคาตก →'}</Link>
      </div>
    </div>
  )
}
