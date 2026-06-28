import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/hermes-birkin-price-increase-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Hermès Birkin Price Increase 2025 Thailand: History & Pre-Owned Impact | ChicPreowned'
      : 'การขึ้นราคา Hermès Birkin ปี 2025 ในไทย: ประวัติและผลกระทบมือสอง | ChicPreowned',
    description: isEn
      ? 'Hermès Birkin price history 2015–2025 in THB for Thai buyers. Annual increases ~5–8%, pre-owned trading at or above retail. Bangkok market context.'
      : 'ประวัติราคา Hermès Birkin 2015–2025 เป็นบาทสำหรับผู้ซื้อชาวไทย การขึ้นราคาประจำปี ~5–8% มือสองซื้อขายที่หรือเกินราคาร้าน บริบทตลาดกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function HermesBirkinPriceTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const priceHistory = [
    { year: '2015', b25usd: 8500, b30usd: 9600, b35usd: 10600, note: isEn ? 'Global price harmonization' : 'การกำหนดราคาโลกเป็นมาตรฐาน' },
    { year: '2017', b25usd: 9600, b30usd: 10800, b35usd: 11900, note: isEn ? '~12% increase over 2 years' : 'เพิ่มขึ้น ~12% ใน 2 ปี' },
    { year: '2019', b25usd: 10800, b30usd: 12100, b35usd: 13200, note: isEn ? 'Annual ~5–8% increases' : 'การเพิ่มขึ้นประจำปี ~5–8%' },
    { year: '2021', b25usd: 11400, b30usd: 12900, b35usd: 14100, note: isEn ? 'Post-COVID luxury demand surge' : 'ความต้องการสินค้าหรูพุ่งสูงหลัง COVID' },
    { year: '2023', b25usd: 12600, b30usd: 14200, b35usd: 15600, note: isEn ? 'Currency adjustments + annual rise' : 'การปรับค่าเงิน + การขึ้นราคาประจำปี' },
    { year: '2025 (est.)', b25usd: 14000, b30usd: 15800, b35usd: 17400, note: isEn ? 'Expected Q1 2025 increase' : 'คาดการณ์การขึ้นราคา Q1 2025' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Birkin Price 2025' : 'ราคา Birkin 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Hermès Birkin Price Increase 2025' : 'การขึ้นราคา Hermès Birkin 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Hermès increases Birkin prices approximately once per year, typically in January or February. Usually 5–8% annually. The result over a decade: Birkin 30 has risen ~60% since 2015. For Bangkok buyers: Thai retail prices are typically 10–20% above US retail due to import duties.'
          : 'Hermès ขึ้นราคา Birkin ประมาณปีละครั้ง มักเป็นมกราคมหรือกุมภาพันธ์ โดยปกติ 5–8% ต่อปี ผลใน 10 ปี Birkin 30 ขึ้นราคา ~60% ตั้งแต่ปี 2015 สำหรับผู้ซื้อกรุงเทพ ราคาร้านไทยมักสูงกว่า US retail 10–20% เนื่องจากอากรนำเข้า'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs">{isEn ? 'Year' : 'ปี'}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Birkin 25</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Birkin 30</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Birkin 35</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((row, i) => (
              <tr key={i} className={`border-b border-gray-100 ${row.year.includes('est') ? 'bg-amber-50' : ''}`}>
                <td className="py-3 px-4 text-gray-700 font-medium">{row.year}</td>
                <td className="py-3 px-4 text-gray-700">${row.b25usd.toLocaleString()} ({formatPriceTHB(row.b25usd)})</td>
                <td className="py-3 px-4 text-gray-700">${row.b30usd.toLocaleString()} ({formatPriceTHB(row.b30usd)})</td>
                <td className="py-3 px-4 text-gray-700">${row.b35usd.toLocaleString()} ({formatPriceTHB(row.b35usd)})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Why Hermès increases prices' : 'ทำไม Hermès ถึงขึ้นราคา'}</h3>
          <p className="text-sm text-gray-600">{isEn ? 'Price increases are a demand management tool, not just cost recovery. By raising retail, Hermès keeps waitlists long and maintains exclusivity. In Bangkok, Thai retail is typically 10–20% above US retail due to import duties and VAT.' : 'การขึ้นราคาเป็นเครื่องมือจัดการความต้องการ ไม่ใช่แค่การชดเชยต้นทุน โดยการขึ้นราคาร้าน Hermès รักษารายชื่อรอให้ยาวและรักษาความพิเศษ ในกรุงเทพ ราคาร้านไทยมักสูงกว่า US retail 10–20% เนื่องจากอากรนำเข้าและ VAT'}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Pre-owned impact' : 'ผลกระทบต่อมือสอง'}</h3>
          <p className="text-sm text-gray-600">{isEn ? 'Pre-owned Birkin prices move with retail but lag 3–6 months. After each retail increase, secondary prices typically rise. Pre-owned Birkin 30 standard Epsom currently trades at 90–120% of 2024 retail — often at or above retail.' : 'ราคา Birkin มือสองเคลื่อนไหวตามร้านแต่ล่าช้า 3–6 เดือน หลังจากการขึ้นราคาร้านแต่ละครั้ง ราคาตลาดรองมักจะขึ้น Birkin 30 Epsom มาตรฐานมือสองปัจจุบันซื้อขายที่ 90–120% ของราคาร้านปี 2024 มักเท่ากับหรือเกินราคาร้าน'}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/hermes-birkin-price-increase-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/hermes-birkin-price-increase-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Hermès Pre-Owned →' : 'Hermès มือสอง →'}</Link>
        <Link href={`/${locale}/compare/kelly-vs-birkin`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Kelly vs Birkin →</Link>
        <Link href={`/${locale}/trends/chanel-price-increase-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Price Increases →' : 'การขึ้นราคา Chanel →'}</Link>
      </div>
    </div>
  )
}
