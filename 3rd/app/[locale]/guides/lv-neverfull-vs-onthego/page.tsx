import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/lv-neverfull-vs-onthego'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `LV Neverfull vs OnTheGo Thailand ${PRICE_YEAR}: Which Tote? | ChicPreowned`
      : `LV Neverfull vs OnTheGo ไทย ${PRICE_YEAR}: กระเป๋าโท้ทอันไหน? | ChicPreowned`,
    description: isEn
      ? `Neverfull MM vs OnTheGo MM for Bangkok buyers — THB prices, capacity, strap options, zip vs open top, pre-owned value comparison ${PRICE_YEAR}.`
      : `Neverfull MM vs OnTheGo MM สำหรับผู้ซื้อกรุงเทพ ราคาบาท ความจุ ตัวเลือกสาย ซิปกับปิดบนแบบเปิด เปรียบเทียบมูลค่ามือสอง ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function NeverFullVsOnTheGoTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { label: 'Launched', neverfull: '2007 — LV\'s bestselling bag since launch', onthego: '2020 — elevated tote alternative' },
    { label: 'Straps', neverfull: 'Two short handles only. No crossbody strap.', onthego: 'Two handles + removable longer crossbody strap.' },
    { label: 'Closure', neverfull: 'Open top with side drawstring. Easy access.', onthego: 'Zipper closure. More secure.' },
    { label: 'Interior pouch', neverfull: 'Comes with removable zip pouch (usable as clutch).', onthego: 'No separate pouch. Two interior pockets.' },
    { label: 'Pre-owned price', neverfull: `MM: $1,000–$1,600 (${formatPriceTHB(1000)}–${formatPriceTHB(1600)})`, onthego: `MM: $1,200–$2,000 (${formatPriceTHB(1200)}–${formatPriceTHB(2000)})` },
    { label: 'Retail 2025', neverfull: `~$2,290 (${formatPriceTHB(2290)})`, onthego: `~$2,860 (${formatPriceTHB(2860)}). Empreinte: ~$3,750 (${formatPriceTHB(3750)})` },
    { label: 'Resale %', neverfull: '50–75% of retail', onthego: '55–70% of retail (newer, fewer pre-owned)' },
  ] : [
    { label: 'ปีที่เปิดตัว', neverfull: '2007 กระเป๋าขายดีที่สุดของ LV ตั้งแต่เปิดตัว', onthego: '2020 ทางเลือกโท้ทระดับสูง' },
    { label: 'สาย', neverfull: 'มือจับสั้นสองข้างเท่านั้น ไม่มีสายสะพายไขว้', onthego: 'มือจับสองข้าง + สายยาวถอดได้สำหรับสะพายไขว้' },
    { label: 'ล็อค', neverfull: 'ปิดบนแบบเปิดพร้อมเชือกร้อยด้านข้าง เข้าถึงง่าย', onthego: 'ล็อคซิป ปลอดภัยกว่า' },
    { label: 'ถุงภายใน', neverfull: 'มาพร้อมถุงซิปถอดได้ (ใช้เป็นกระเป๋าคลัทช์ได้)', onthego: 'ไม่มีถุงแยก มีกระเป๋าด้านในสองช่อง' },
    { label: 'ราคามือสอง', neverfull: `MM: $1,000–$1,600 (${formatPriceTHB(1000)}–${formatPriceTHB(1600)})`, onthego: `MM: $1,200–$2,000 (${formatPriceTHB(1200)}–${formatPriceTHB(2000)})` },
    { label: 'ราคาร้านปี 2025', neverfull: `~$2,290 (${formatPriceTHB(2290)})`, onthego: `~$2,860 (${formatPriceTHB(2860)}) Empreinte: ~$3,750 (${formatPriceTHB(3750)})` },
    { label: 'มูลค่าขายต่อ', neverfull: '50–75% ราคาร้าน', onthego: '55–70% ราคาร้าน (ใหม่กว่า มือสองน้อยกว่า)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Neverfull vs OnTheGo' : 'Neverfull vs OnTheGo'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `LV Neverfull vs OnTheGo ${PRICE_YEAR}` : `LV Neverfull vs OnTheGo ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both are large LV Monogram totes. The key difference: Neverfull has an open top and removable pouch; OnTheGo has a zipper and a crossbody strap. For Bangkok daily use, the OnTheGo\'s zip is more practical on the BTS. The Neverfull\'s removable pouch adds versatility.'
          : 'ทั้งคู่เป็นโท้ท Monogram LV ขนาดใหญ่ ความแตกต่างหลัก Neverfull มีด้านบนแบบเปิดและถุงถอดได้ OnTheGo มีซิปและสายสะพายไขว้ สำหรับการใช้งานประจำวันในกรุงเทพ ซิปของ OnTheGo ใช้งานได้จริงกว่าบน BTS ถุงถอดได้ของ Neverfull เพิ่มความหลากหลาย'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-32 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Neverfull MM</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">OnTheGo MM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.neverfull}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.onthego}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/lv-neverfull-vs-onthego" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/lv-neverfull-vs-onthego" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'LV Pre-Owned →' : 'LV มือสอง →'}</Link>
        <Link href={`/${locale}/guides/lv-neverfull-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Neverfull Size Guide →' : 'คู่มือขนาด Neverfull →'}</Link>
        <Link href={`/${locale}/guides/lv-monogram-vs-damier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Monogram vs Damier →' : 'Monogram vs Damier →'}</Link>
      </div>
    </div>
  )
}
