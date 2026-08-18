import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/omega-seamaster-vs-constellation'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Omega Seamaster vs Constellation Thailand ${PRICE_YEAR}: Which Pre-Owned? | ChicPreowned`
      : `Omega Seamaster vs Constellation ในไทย ${PRICE_YEAR}: มือสองอันไหนดีกว่า? | ChicPreowned`,
    description: isEn
      ? `Omega Seamaster vs Constellation for Bangkok buyers ${PRICE_YEAR} — resale retention, THB prices, dive watch vs dress watch, and which Omega is the better pre-owned buy.`
      : `Omega Seamaster vs Constellation สำหรับผู้ซื้อกรุงเทพ ${PRICE_YEAR} การรักษามูลค่า ราคาบาท นาฬิกาดำน้ำ vs นาฬิกาชุด และ Omega ไหนลงทุนมือสองได้ดีกว่า`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function OmegaSeamasterVsConstellationTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Launched', sm: '1948 — military diving heritage', con: '1952 — precision horology, observatory wins' },
    { aspect: 'DNA', sm: 'Professional sport/dive watch', con: 'Dress/refined sport watch' },
    { aspect: 'Water resistance', sm: '300M standard. Planet Ocean: 600M+', con: '120M (not a dive watch)' },
    { aspect: 'New price', sm: `$5,500–9,500 (${formatPriceTHB(5500, 9500)}) Steel 300M`, con: `$4,800–8,200 (${formatPriceTHB(4800, 8200)}) Steel 38mm` },
    { aspect: 'Pre-owned entry', sm: `$2,800–4,500 (${formatPriceTHB(2800, 4500)}) worn`, con: `$2,200–3,800 (${formatPriceTHB(2200, 3800)}) worn` },
    { aspect: 'Resale retention', sm: '65–80% (most liquid Omega)', con: '55–70% (solid but slower)' },
    { aspect: 'Investment tier', sm: 'B+ (strongest pre-owned Omega)', con: 'B (good but slower market)' },
    { aspect: 'Bangkok boutique', sm: 'Omega at Central Embassy, ICON Siam, CentralWorld', con: 'Same boutiques — less prominent display' },
  ] : [
    { aspect: 'เปิดตัว', sm: '1948 — มรดกดำน้ำทางทหาร', con: '1952 — ความแม่นยำ horology ชนะรางวัล observatory' },
    { aspect: 'DNA', sm: 'นาฬิกากีฬา/ดำน้ำมืออาชีพ', con: 'นาฬิกาชุด/กีฬาสุภาพ' },
    { aspect: 'กันน้ำ', sm: '300M มาตรฐาน Planet Ocean: 600M+', con: '120M (ไม่ใช่นาฬิกาดำน้ำ)' },
    { aspect: 'ราคาใหม่', sm: `$5,500–9,500 (${formatPriceTHB(5500, 9500)}) เหล็ก 300M`, con: `$4,800–8,200 (${formatPriceTHB(4800, 8200)}) เหล็ก 38mm` },
    { aspect: 'มือสองเริ่มต้น', sm: `$2,800–4,500 (${formatPriceTHB(2800, 4500)}) สภาพใช้`, con: `$2,200–3,800 (${formatPriceTHB(2200, 3800)}) สภาพใช้` },
    { aspect: 'อัตราการรักษามูลค่า', sm: '65–80% (Omega ที่สภาพคล่องสูงสุด)', con: '55–70% (ดีแต่ตลาดช้ากว่า)' },
    { aspect: 'ระดับการลงทุน', sm: 'B+ (Omega มือสองที่แข็งแกร่งที่สุด)', con: 'B (ดีแต่ตลาดช้า)' },
    { aspect: 'บูทีคกรุงเทพ', sm: 'Omega ที่ Central Embassy, ICON Siam, CentralWorld', con: 'บูทีคเดียวกัน แสดงสินค้าน้อยกว่า' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Omega Seamaster vs Constellation</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Omega Seamaster vs Constellation ({PRICE_YEAR}): Which Pre-Owned?' : 'Omega Seamaster vs Constellation ({PRICE_YEAR}): มือสองอันไหนดีกว่า?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two of Omega\'s flagship lines — both with 70+ year histories, both using co-axial movements, but serving very different buyers. The Seamaster dominates pre-owned liquidity; the Constellation is the refined under-the-radar choice. Bangkok context and THB prices included.'
          : 'สองไลน์หลักของ Omega ทั้งสองมีประวัติมากกว่า 70 ปี ทั้งสองใช้จักรกล co-axial แต่ตอบสนองผู้ซื้อต่างกันมาก Seamaster ครองสภาพคล่องมือสอง Constellation คือทางเลือกสุภาพที่ไม่ค่อยเป็นที่รู้จัก รวมบริบทกรุงเทพและราคาบาท'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-blue-700">Seamaster</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-700">Constellation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.sm}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.con}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">{isEn ? 'Buy Seamaster if…' : 'ซื้อ Seamaster ถ้า…'}</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            {(isEn ? [
              'You want the most liquid Omega to resell',
              'You need actual dive capability (300M+)',
              'The Bond association appeals to you',
              'You want the broadest pre-owned selection in Bangkok',
            ] : [
              'ต้องการ Omega ที่มีสภาพคล่องสูงสุดในการขายต่อ',
              'ต้องความสามารถดำน้ำจริง (300M+)',
              'การเชื่อมโยงกับ Bond ดึงดูดคุณ',
              'ต้องการตัวเลือกมือสองที่กว้างที่สุดในกรุงเทพ',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'Buy Constellation if…' : 'ซื้อ Constellation ถ้า…'}</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            {(isEn ? [
              'You want something less common at work',
              'The "claw" bezel and cat-paw dial feet appeal to you',
              'You prefer a dress watch that\'s not a Rolex Datejust',
              'Ladies sizes (28–36mm) — Constellation has the broadest range',
              'Same movement, lower price than Seamaster',
            ] : [
              'ต้องการสิ่งที่ไม่ธรรมดาในที่ทำงาน',
              'วงแหวน "claw" และขาหน้าปัดรูปเท้าแมวดึงดูดคุณ',
              'ชอบนาฬิกาชุดที่ไม่ใช่ Rolex Datejust',
              'ไซส์สุภาพสตรี (28–36mm) Constellation มีให้เลือกกว้างที่สุด',
              'จักรกลเดียวกัน ราคาต่ำกว่า Seamaster',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">{isEn ? 'The James Bond premium' : 'พรีเมียม James Bond'}</h3>
        <p className="text-sm text-blue-800">
          {isEn
            ? 'Since GoldenEye (1995), James Bond has worn an Omega Seamaster in every film. This creates a floor for Seamaster values that Constellation doesn\'t have — demand consistently outstrips supply for the steel 300M variant. Thai collectors are not immune to this effect.'
            : 'ตั้งแต่ GoldenEye (1995) James Bond สวม Omega Seamaster ในทุกภาพยนตร์ สิ่งนี้สร้างพื้นราคาสำหรับมูลค่า Seamaster ที่ Constellation ไม่มี ความต้องการเกินอุปทานสม่ำเสมอสำหรับรุ่นเหล็ก 300M นักสะสมไทยไม่ได้ภูมิต้านทานต่อผลกระทบนี้'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/omega-seamaster-vs-constellation" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/omega-seamaster-vs-constellation" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate Omega' : 'ยืนยัน Omega'} →</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
