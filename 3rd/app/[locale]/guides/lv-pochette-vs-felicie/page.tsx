import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/lv-pochette-vs-felicie'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'LV Pochette Métis vs Félicie Thailand 2025: Which Pre-Owned to Buy? | ChicPreowned'
      : 'LV Pochette Métis vs Félicie ในไทย 2025: มือสองอันไหนน่าซื้อ? | ChicPreowned',
    description: isEn
      ? 'Louis Vuitton Pochette Métis vs Félicie for Bangkok buyers — size, structure, resale retention, THB prices, and which LV pochette is the better pre-owned buy in Thailand 2025.'
      : 'Louis Vuitton Pochette Métis vs Félicie สำหรับผู้ซื้อกรุงเทพ ขนาด โครงสร้าง อัตราการรักษามูลค่า ราคาบาท และ LV pochette ไหนน่าซื้อมือสองในไทย 2025 มากกว่า',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function LvPochetteVsFelicieTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Launched', pm: '1985 (original), 2014 relaunch', fp: '2013' },
    { aspect: 'Size', pm: '25 x 19 x 7cm (structured, medium)', fp: '21 x 12 x 3cm (slim, compact)' },
    { aspect: 'Structure', pm: 'Rigid semi-structured, organised interior', fp: 'Soft flat pochette, minimal structure' },
    { aspect: 'Strap', pm: 'Two-way: top handle or shoulder strap', fp: 'Chain strap only' },
    { aspect: 'New price', pm: `$1,580–2,500 (${formatPriceTHB(1580, 2500)}) Monogram`, fp: `$1,150–1,650 (${formatPriceTHB(1150, 1650)}) Monogram` },
    { aspect: 'Pre-owned entry', pm: `$800–1,200 (${formatPriceTHB(800, 1200)}) Monogram worn`, fp: `$550–900 (${formatPriceTHB(550, 900)}) Monogram worn` },
    { aspect: 'Resale retention', pm: '70–85% (exceptional for LV)', fp: '60–75% (strong)' },
    { aspect: 'Investment tier', pm: 'A-Tier (one of strongest LV resale items)', fp: 'B+ (solid, especially Empreinte)' },
    { aspect: 'Bangkok boutique', pm: 'LV at Siam Paragon, EmSphere, Central Embassy', fp: 'Same — generally in stock vs PM waitlisted' },
  ] : [
    { aspect: 'เปิดตัว', pm: '1985 (ดั้งเดิม), เปิดตัวใหม่ 2014', fp: '2013' },
    { aspect: 'ขนาด', pm: '25 x 19 x 7cm (มีโครงสร้าง ขนาดกลาง)', fp: '21 x 12 x 3cm (บาง กะทัดรัด)' },
    { aspect: 'โครงสร้าง', pm: 'กึ่งแข็งแบบมีโครงสร้าง ภายในจัดระเบียบ', fp: 'Pochette แบนนิ่ม โครงสร้างน้อยที่สุด' },
    { aspect: 'สาย', pm: 'สองทาง: หูหิ้วบนหรือสายสะพาย', fp: 'สายโซ่เท่านั้น' },
    { aspect: 'ราคาใหม่', pm: `$1,580–2,500 (${formatPriceTHB(1580, 2500)}) Monogram`, fp: `$1,150–1,650 (${formatPriceTHB(1150, 1650)}) Monogram` },
    { aspect: 'มือสองเริ่มต้น', pm: `$800–1,200 (${formatPriceTHB(800, 1200)}) Monogram สภาพใช้`, fp: `$550–900 (${formatPriceTHB(550, 900)}) Monogram สภาพใช้` },
    { aspect: 'อัตราการรักษามูลค่า', pm: '70–85% (ยอดเยี่ยมสำหรับ LV)', fp: '60–75% (แข็งแกร่ง)' },
    { aspect: 'ระดับการลงทุน', pm: 'A-Tier (หนึ่งในรายการขายต่อ LV ที่แข็งแกร่งที่สุด)', fp: 'B+ (ดี โดยเฉพาะ Empreinte)' },
    { aspect: 'บูทีคกรุงเทพ', pm: 'LV ที่ Siam Paragon, EmSphere, Central Embassy', fp: 'เหมือนกัน มีสต็อกทั่วไป vs PM รายชื่อรอ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>LV Pochette vs Félicie</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'LV Pochette Métis vs Félicie Pochette: Which Pre-Owned to Buy?' : 'LV Pochette Métis vs Félicie Pochette: มือสองอันไหนน่าซื้อ?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two of LV\'s most in-demand crossbody styles — both in Monogram canvas, both excellent resellers. The Pochette Métis is structured and organised; the Félicie is sleek and minimal. Bangkok retail access and THB prices included.'
          : 'สองสไตล์ crossbody ที่มีความต้องการสูงสุดของ LV ทั้งสองมีผ้า Monogram ทั้งสองขายต่อได้ดีเยี่ยม Pochette Métis มีโครงสร้างและจัดระเบียบ Félicie คือความสุภาพและความเรียบง่าย รวมการเข้าถึงร้านค้ากรุงเทพและราคาบาท'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Pochette Métis</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-600">Félicie Pochette</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.pm}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.fp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'Choose Pochette Métis if…' : 'เลือก Pochette Métis ถ้า…'}</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            {(isEn ? [
              'You need to carry phone, wallet, keys, make-up comfortably',
              'You want a day-to-night bag (top handle + shoulder)',
              'Investment is part of your decision — PM has stronger resale',
              'You can wait — PM is waitlisted at retail in Bangkok',
            ] : [
              'ต้องพกโทรศัพท์ กระเป๋าสตางค์ กุญแจ และเครื่องสำอางสบายๆ',
              'ต้องการกระเป๋ากลางวัน-กลางคืน (หูหิ้วบน + สะพาย)',
              'การลงทุนเป็นส่วนหนึ่งของการตัดสินใจ PM มีการขายต่อที่แข็งแกร่งกว่า',
              'รอได้ PM อยู่ในรายชื่อรอที่ร้านค้ากรุงเทพ',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <h3 className="font-semibold text-orange-900 mb-2">{isEn ? 'Choose Félicie if…' : 'เลือก Félicie ถ้า…'}</h3>
          <ul className="text-sm text-orange-800 space-y-1">
            {(isEn ? [
              'You want a lightweight evening/night-out bag',
              'Chain strap is your preferred carrying style',
              'Immediate availability at lower entry price',
              'Empreinte leather Félicie is a particular sweet spot',
            ] : [
              'ต้องการกระเป๋าเบาสำหรับงานเย็น/กลางคืน',
              'สายโซ่คือสไตล์การพกที่คุณชอบ',
              'มีพร้อมทันทีในราคาเริ่มต้นที่ต่ำกว่า',
              'Félicie หนัง Empreinte คือจุดหวานพิเศษ',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'The Bangkok waitlist situation' : 'สถานการณ์รายชื่อรอในกรุงเทพ'}</h3>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'The Pochette Métis is one of the most waitlisted LV bags in Bangkok LV boutiques (Siam Paragon, EmSphere). Pre-owned Métis in good condition (฿29,000–43,000) often represents better value than waiting 6–18 months at retail. The Félicie is generally available at retail — less premium, but immediate.'
            : 'Pochette Métis เป็นหนึ่งในกระเป๋า LV ที่อยู่ในรายชื่อรอมากที่สุดในบูทีค LV กรุงเทพ (Siam Paragon, EmSphere) Métis มือสองในสภาพดี (฿29,000–43,000) มักเป็นมูลค่าที่ดีกว่าการรอ 6–18 เดือนที่ร้านค้า Félicie มีในร้านค้าทั่วไป ไม่มีพรีเมียมแต่ได้ทันที'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/lv-pochette-vs-felicie" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/lv-pochette-vs-felicie" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV →</Link>
        <Link href={`/${locale}/guides/lv-neverfull-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Neverfull Size →</Link>
        <Link href={`/${locale}/guides/lv-monogram-vs-damier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Monogram vs Damier →</Link>
      </div>
    </div>
  )
}
