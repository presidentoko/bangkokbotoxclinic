import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/balenciaga-vs-valentino'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Balenciaga vs Valentino Pre-Owned Thailand 2025 | ChicPreowned'
      : 'Balenciaga vs Valentino มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Balenciaga vs Valentino comparison — resale value, City Bag vs Rockstud, Thailand pre-owned market. THB prices.'
      : 'เปรียบ Balenciaga กับ Valentino — มูลค่าขายต่อ City Bag vs Rockstud ตลาดมือสองไทย ราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function BalenciagaVsValentinoTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Peak era', bal: 'Nicolas Ghesquière era (2001–2012) — City Bag', val: 'Valentino Garavani era (1960–2008) — couture dresses' },
    { metric: 'Current creative', bal: 'Demna Gvasalia (irony + streetwear)', val: 'Alessandro Michele (2024) + prior Pierpaolo Piccioli' },
    { metric: 'Iconic bag', bal: 'City Bag ฿48,000–75,000 pre-owned', val: 'Rockstud Bag ฿36,000–58,000 pre-owned' },
    { metric: 'Pre-owned trend', bal: 'Declining — Demna-era streetwear dates fast', val: 'Stable — Rockstud design timeless enough' },
    { metric: 'Best pre-owned pick', bal: 'Ghesquière-era City Bag (agneau leather)', val: 'Classic Rockstud (neutral colors)' },
    { metric: 'Resale vs retail', bal: '50–70% for recent; 80–110% for classic City', val: '55–75% for Rockstud' },
    { metric: 'Leather quality', bal: 'Ghesquière era: exceptional. Post-2015: variable.', val: 'Consistent — nappa leather quality maintained' },
    { metric: 'Trend sensitivity', bal: 'High — very trend-dependent resale', val: 'Medium — Rockstud stud is distinctive but not edgy' },
  ] : [
    { metric: 'ยุคพีค', bal: 'ยุค Nicolas Ghesquière (2001–2012) — City Bag', val: 'ยุค Valentino Garavani (1960–2008) — ชุดโอต์กูตูร์' },
    { metric: 'Creative ปัจจุบัน', bal: 'Demna Gvasalia (ความประชด + streetwear)', val: 'Alessandro Michele (2024) + Pierpaolo Piccioli ก่อนหน้า' },
    { metric: 'กระเป๋าเด่น', bal: 'City Bag ฿48,000–75,000 มือสอง', val: 'Rockstud Bag ฿36,000–58,000 มือสอง' },
    { metric: 'เทรนด์มือสอง', bal: 'ลดลง — streetwear ยุค Demna เก่าเร็ว', val: 'คงที่ — ดีไซน์ Rockstud คลาสสิกพอ' },
    { metric: 'ชิ้นมือสองที่ดีที่สุด', bal: 'City Bag ยุค Ghesquière (หนัง agneau)', val: 'Rockstud คลาสสิก (สีนิวทรัล)' },
    { metric: 'ขายต่อ vs ราคาร้าน', bal: '50–70% ใหม่ 80–110% City คลาสสิก', val: '55–75% สำหรับ Rockstud' },
    { metric: 'คุณภาพหนัง', bal: 'ยุค Ghesquière: ยอดเยี่ยม หลัง 2015: แตกต่างกัน', val: 'สม่ำเสมอ — คุณภาพหนัง nappa คงที่' },
    { metric: 'ความไวต่อเทรนด์', bal: 'สูง — ขึ้นกับเทรนด์มาก', val: 'ปานกลาง — หมุดเด่นแต่ไม่ดูล้ำหน้า' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Balenciaga vs Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Balenciaga vs Valentino Pre-Owned' : 'Balenciaga vs Valentino มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both have loyal followings. But for pre-owned buyers, the vintage era matters enormously. Balenciaga\'s Ghesquière era and Valentino\'s Rockstud era are where the value lies.'
          : 'ทั้งคู่มีแฟนพันธุ์แท้ แต่สำหรับผู้ซื้อมือสอง ยุคผลิตมีความสำคัญมาก ยุค Ghesquière ของ Balenciaga และยุค Rockstud ของ Valentino คือที่ที่มูลค่าอยู่'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Balenciaga</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Valentino</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.bal}</td>
                <td className="py-3 px-4 text-gray-700">{r.val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/balenciaga-vs-valentino" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/balenciaga-vs-valentino" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/balenciaga`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Balenciaga Pre-Owned →' : 'Balenciaga มือสอง →'}</Link>
        <Link href={`/${locale}/brands/valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Valentino Pre-Owned →' : 'Valentino มือสอง →'}</Link>
      </div>
    </div>
  )
}
