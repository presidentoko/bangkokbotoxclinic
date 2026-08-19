import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/rolex-vs-audemars-piguet'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Rolex vs Audemars Piguet: Pre-Owned Watches in Thailand ${PRICE_YEAR}`
      : `Rolex vs Audemars Piguet: นาฬิกามือสองในไทย ${PRICE_YEAR}`,
    description: isEn
      ? 'Compare Rolex vs Audemars Piguet pre-owned in Thailand. Royal Oak vs Submariner — price, investment potential, resale value and which to buy.'
      : 'เปรียบเทียบ Rolex vs Audemars Piguet มือสองในไทย Royal Oak vs Submariner — ราคา การลงทุน และอะไรน่าซื้อกว่า',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

export default async function RolexVsAPPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Founded', rolex: '1905', ap: '1875 — the oldest luxury watch brand' },
    { aspect: 'Annual production', rolex: '~1,000,000 watches', ap: '~40,000 watches' },
    { aspect: 'Iconic piece', rolex: 'Submariner, GMT-Master, Daytona', ap: 'Royal Oak 15500ST' },
    { aspect: 'Entry pre-owned (THB)', rolex: '฿185,000 (Oyster Perpetual 36)', ap: '฿600,000 (Royal Oak 15400)' },
    { aspect: 'Sports flagship vs retail', rolex: '120–180% (Submariner / GMT)', ap: '150–300% (Royal Oak 15500ST)' },
    { aspect: 'Resale liquidity', rolex: 'Highest of any watch brand', ap: 'Very strong — Royal Oak top-tier' },
    { aspect: 'Movement finishing', rolex: 'Industrial excellence, COSC certified', ap: 'Hand-bevelled edges (côtes de Genève), finest production finishing' },
    { aspect: 'Case material', rolex: 'Oystersteel, gold, Rolesor', ap: 'Steel, gold, bi-metal, titanium' },
  ] : [
    { aspect: 'ก่อตั้ง', rolex: '1905', ap: '1875 — แบรนด์นาฬิกาลักซ์ชูรีที่เก่าแก่ที่สุด' },
    { aspect: 'ยอดผลิตต่อปี', rolex: '~1,000,000 เรือน', ap: '~40,000 เรือน' },
    { aspect: 'รุ่นที่โด่งดัง', rolex: 'Submariner, GMT-Master, Daytona', ap: 'Royal Oak 15500ST' },
    { aspect: 'ราคาเริ่มต้นมือสอง (บาท)', rolex: '185,000 บาท (Oyster Perpetual 36)', ap: '600,000 บาท (Royal Oak 15400)' },
    { aspect: 'รุ่นกีฬาเรือธงเทียบราคาปลีก', rolex: '120–180% (Submariner / GMT)', ap: '150–300% (Royal Oak 15500ST)' },
    { aspect: 'สภาพคล่องขายต่อ', rolex: 'สูงสุดของแบรนด์นาฬิกาใดๆ', ap: 'แข็งแกร่งมาก — Royal Oak ระดับสูง' },
    { aspect: 'การตกแต่งกลไก', rolex: 'ความเป็นเลิศทางอุตสาหกรรม รับรอง COSC', ap: 'ขอบตกแต่งด้วยมือ (côtes de Genève) การตกแต่งระดับสูงสุด' },
    { aspect: 'วัสดุตัวเรือน', rolex: 'Oystersteel, ทอง, Rolesor', ap: 'สแตนเลส, ทอง, ไบเมทัล, ไทเทเนียม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/watches`} className="hover:text-gray-800">{isEn ? 'Watches' : 'นาฬิกา'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Rolex vs Audemars Piguet</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Rolex vs Audemars Piguet: Pre-Owned in Thailand ${PRICE_YEAR}` : `Rolex vs Audemars Piguet: มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The world\'s most liquid watch vs the Royal Oak — both trade above retail, but very different in price, character, and buyer pool.'
          : 'นาฬิกาที่สภาพคล่องสูงที่สุดในโลก vs Royal Oak — ทั้งคู่ซื้อขายเหนือราคาปลีก แต่แตกต่างกันมากในด้านราคา บุคลิก และกลุ่มผู้ซื้อ'}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rolex</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Most liquid watch brand globally — easiest to sell anywhere</li>
              <li>✓ Entry pre-owned from ฿185,000 (Oyster Perpetual)</li>
              <li>✓ Sports models trade 120–180% of retail</li>
              <li>✓ Widest international buyer pool</li>
              <li>✗ Less exclusive than AP in collector circles</li>
            </> : <>
              <li>✓ แบรนด์นาฬิกาที่มีสภาพคล่องสูงที่สุดทั่วโลก — ขายได้ง่ายที่สุดทุกที่</li>
              <li>✓ มือสองราคาเริ่มต้น 185,000 บาท (Oyster Perpetual)</li>
              <li>✓ รุ่นกีฬาซื้อขายที่ 120–180% ของราคาปลีก</li>
              <li>✓ กลุ่มผู้ซื้อนานาชาติที่กว้างที่สุด</li>
              <li>✗ ความ exclusive น้อยกว่า AP ในวงการนักสะสม</li>
            </>}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Audemars Piguet</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Royal Oak invented the luxury sports watch category (1972)</li>
              <li>✓ 15500ST trades 150–300% of retail</li>
              <li>✓ Finest hand-finishing of any production watch</li>
              <li>✓ Lower production = stronger scarcity premium</li>
              <li>✗ Entry pre-owned ฿600,000+ (much higher than Rolex)</li>
              <li>✗ Smaller resale market in Thailand</li>
            </> : <>
              <li>✓ Royal Oak คิดค้นหมวดนาฬิกากีฬา luxury (ปี 1972)</li>
              <li>✓ 15500ST ซื้อขายที่ 150–300% ของราคาปลีก</li>
              <li>✓ การตกแต่งด้วยมือที่ดีที่สุดของนาฬิกาสายการผลิตใดๆ</li>
              <li>✓ ผลิตน้อยกว่า = ความหายากและพรีเมียมสูงกว่า</li>
              <li>✗ มือสองราคาเริ่มต้น 600,000 บาท+ (สูงกว่า Rolex มาก)</li>
              <li>✗ ตลาดขายต่อในไทยเล็กกว่า</li>
            </>}
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Comparison Table' : 'ตารางเปรียบเทียบ'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'ด้าน'}</th>
                <th className="text-left py-3 px-4 font-semibold">Rolex</th>
                <th className="text-left py-3 px-4 font-semibold">Audemars Piguet</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.rolex}</td>
                  <td className="py-3 px-4 text-gray-600">{row.ap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/rolex-vs-audemars-piguet" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/rolex-vs-audemars-piguet" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex Prices →' : 'ราคา Rolex →'}
        </Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex vs Omega →' : 'Rolex vs Omega →'}
        </Link>
      </div>
    </div>
  )
}
