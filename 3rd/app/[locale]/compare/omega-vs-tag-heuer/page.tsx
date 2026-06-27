import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/omega-vs-tag-heuer'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Omega vs TAG Heuer: Pre-Owned Watches Thailand 2025 | ChicPreowned' : 'Omega vs TAG Heuer: นาฬิกามือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Omega vs TAG Heuer for Thai buyers — Speedmaster vs Carrera in THB prices, value retention, and where to buy in Bangkok.'
      : 'Omega vs TAG Heuer สำหรับคนไทย — Speedmaster vs Carrera ราคาบาท อัตราการรักษามูลค่า และที่ซื้อในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function OmegaVsTagTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const omegaItems = getItemsByBrand('omega').filter(i => i.price_ranges?.very_good).slice(0, 3)

  const rows = isEn ? [
    { aspect: 'Iconic watch', omega: 'Speedmaster "Moonwatch" / Seamaster 300M', tag: 'Carrera / Monaco / Formula 1' },
    { aspect: 'Entry (THB pre-owned)', omega: '฿52,000 (Aqua Terra, worn)', tag: '฿30,000 (Formula 1, good)' },
    { aspect: 'Mid-range (THB)', omega: '฿104,000–167,000 (Seamaster 300M)', tag: '฿67,000–119,000 (Carrera Cal.16)' },
    { aspect: 'Value retention', omega: '60–80% (Speedmaster: 70–90%)', tag: '45–65% (Carrera: 55–70%)' },
    { aspect: 'Thailand grey market', omega: 'Available Siam Paragon / Icon', tag: 'Available, more common than Omega' },
    { aspect: 'Buy advice', omega: 'Speedmaster Pro or Seamaster 300M', tag: 'Carrera Heuer-01 or Monaco Cal.12' },
  ] : [
    { aspect: 'นาฬิกาไอคอนิก', omega: 'Speedmaster "Moonwatch" / Seamaster 300M', tag: 'Carrera / Monaco / Formula 1' },
    { aspect: 'ราคาเริ่มต้น (บาทมือสอง)', omega: '52,000 บาท (Aqua Terra)', tag: '30,000 บาท (Formula 1)' },
    { aspect: 'ราคากลาง (บาท)', omega: '104,000–167,000 บาท (Seamaster)', tag: '67,000–119,000 บาท (Carrera)' },
    { aspect: 'อัตราการรักษามูลค่า', omega: '60–80% (Speedmaster: 70–90%)', tag: '45–65% (Carrera: 55–70%)' },
    { aspect: 'ตลาดเทาในไทย', omega: 'มีที่สยามพารากอน / ไอคอน', tag: 'มีทั่วไป พบบ่อยกว่า Omega' },
    { aspect: 'แนะนำให้ซื้อ', omega: 'Speedmaster Pro หรือ Seamaster 300M', tag: 'Carrera Heuer-01 หรือ Monaco Cal.12' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Omega vs TAG Heuer</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Omega vs TAG Heuer: Pre-Owned Watches in Thailand 2025' : 'Omega vs TAG Heuer: นาฬิกามือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Moon heritage vs motorsport history — which Swiss brand is the better pre-owned buy in Thailand?'
          : 'มรดกจากดวงจันทร์ vs ประวัติศาสตร์มอเตอร์สปอร์ต — แบรนด์สวิสไหนดีกว่าสำหรับมือสองในไทย?'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'หัวข้อ'}</th>
              <th className="text-left py-3 px-4 font-semibold">Omega</th>
              <th className="text-left py-3 px-4 font-semibold">TAG Heuer</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.omega}</td>
                <td className="py-3 px-4 text-gray-600">{row.tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {omegaItems.length > 0 && (
        <section className="mb-10">
          <h3 className="font-semibold text-gray-900 mb-3">Omega {isEn ? 'Pre-Owned (THB)' : 'มือสอง (บาท)'}</h3>
          {omegaItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
              <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
              <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
            </div>
          ))}
        </section>
      )}

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/omega-vs-tag-heuer" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/omega-vs-tag-heuer" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Guide →</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
