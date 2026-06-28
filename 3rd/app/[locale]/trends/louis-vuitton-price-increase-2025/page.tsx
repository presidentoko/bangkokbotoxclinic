import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/louis-vuitton-price-increase-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Louis Vuitton Price Increases Thailand 2025: Neverfull, Speedy | ChicPreowned'
      : 'ประวัติราคา Louis Vuitton ในไทย 2025: Neverfull, Speedy | ChicPreowned',
    description: isEn
      ? 'Louis Vuitton price increases 2019–2025 in THB — Neverfull MM, Speedy 30, Alma BB. How LV price hikes affect pre-owned value in Thailand and when to buy.'
      : 'การขึ้นราคา Louis Vuitton 2019–2025 เป็นบาท — Neverfull MM, Speedy 30, Alma BB การขึ้นราคา LV ส่งผลต่อมูลค่ามือสองในไทยอย่างไรและควรซื้อเมื่อไหร่',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function toTHB(usd: number) {
  return `฿${Math.round(usd * 36 / 500) * 500 / 1000}k`
}

export default async function LVPriceIncreaseTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const priceHistory = [
    { year: '2019', neverfull: `$1,500 (${toTHB(1500)})`, speedy30: `$970 (${toTHB(970)})`, almaBb: `$1,250 (${toTHB(1250)})` },
    { year: '2020', neverfull: `$1,560 (${toTHB(1560)})`, speedy30: `$1,000 (${toTHB(1000)})`, almaBb: `$1,290 (${toTHB(1290)})` },
    { year: '2021', neverfull: `$1,650 (${toTHB(1650)})`, speedy30: `$1,060 (${toTHB(1060)})`, almaBb: `$1,360 (${toTHB(1360)})` },
    { year: '2022', neverfull: `$1,820 (${toTHB(1820)})`, speedy30: `$1,160 (${toTHB(1160)})`, almaBb: `$1,490 (${toTHB(1490)})` },
    { year: '2023', neverfull: `$1,980 (${toTHB(1980)})`, speedy30: `$1,250 (${toTHB(1250)})`, almaBb: `$1,620 (${toTHB(1620)})` },
    { year: '2024', neverfull: `$2,130 (${toTHB(2130)})`, speedy30: `$1,350 (${toTHB(1350)})`, almaBb: `$1,760 (${toTHB(1760)})` },
    { year: '2025', neverfull: `$2,290 (${toTHB(2290)})`, speedy30: `$1,470 (${toTHB(1470)})`, almaBb: `$1,900 (${toTHB(1900)})` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'LV Price Increases 2025' : 'ราคา LV 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Louis Vuitton Price Increases 2019–2025' : 'ประวัติการขึ้นราคา Louis Vuitton 2019–2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Louis Vuitton has raised prices consistently since 2019. The Neverfull MM is up 53% in six years. Unlike Chanel, LV increases are more gradual — this means LV pre-owned still offers meaningful savings vs retail, making it the better value buy of the two in 2025.'
          : 'Louis Vuitton ขึ้นราคาอย่างสม่ำเสมอตั้งแต่ปี 2019 Neverfull MM ขึ้น 53% ใน 6 ปี ต่างจาก Chanel การขึ้นราคา LV ค่อยเป็นค่อยไปกว่า ทำให้มือสอง LV ยังให้ส่วนลดที่มีความหมายเทียบกับราคาร้าน ทำให้เป็นตัวเลือกซื้อที่คุ้มค่ากว่าในปี 2025'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">{isEn ? 'Year' : 'ปี'}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Neverfull MM</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Speedy 30</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Alma BB</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((row, i) => (
              <tr key={i} className={`border-b border-gray-100 ${row.year === '2025' ? 'bg-amber-50' : ''}`}>
                <td className="py-3 px-4 text-gray-700 font-medium">{row.year}{row.year === '2025' ? ' ★' : ''}</td>
                <td className="py-3 px-4 text-gray-700 text-xs">{row.neverfull}</td>
                <td className="py-3 px-4 text-gray-700 text-xs">{row.speedy30}</td>
                <td className="py-3 px-4 text-gray-700 text-xs">{row.almaBb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-900 mb-2">
          {isEn ? 'The math: Neverfull MM over 6 years' : 'คำนวณ: Neverfull MM ใน 6 ปี'}
        </h3>
        <p className="text-sm text-amber-800">
          {isEn
            ? '2019: $1,500 (฿54,000) → 2025: $2,290 (฿82,440) = +53% total. Pre-owned Neverfull in excellent condition: $1,100–$1,600 (฿39,600–฿57,600) — 30–50% below current retail. For Thai buyers: the spread makes pre-owned LV one of the best-value luxury buys in Bangkok.'
            : '2019: $1,500 (฿54,000) → 2025: $2,290 (฿82,440) = +53% รวม มือสอง Neverfull สภาพดีเยี่ยม: $1,100–$1,600 (฿39,600–฿57,600) — ต่ำกว่าราคาร้านปัจจุบัน 30–50% สำหรับผู้ซื้อชาวไทย: ช่องว่างนี้ทำให้มือสอง LV เป็นหนึ่งในการซื้อหรูที่คุ้มค่าที่สุดในกรุงเทพ'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/louis-vuitton-price-increase-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/louis-vuitton-price-increase-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Louis Vuitton Pre-Owned →' : 'Louis Vuitton มือสอง →'}</Link>
        <Link href={`/${locale}/trends/chanel-price-increase-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Price History →' : 'ประวัติราคา Chanel →'}</Link>
        <Link href={`/${locale}/guides/lv-neverfull-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Neverfull Size Guide →</Link>
      </div>
    </div>
  )
}
