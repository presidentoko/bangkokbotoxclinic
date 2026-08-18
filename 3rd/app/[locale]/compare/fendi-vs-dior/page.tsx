import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/fendi-vs-dior'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Fendi vs Dior Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Fendi vs Dior มือสองในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `Fendi vs Dior pre-owned Thailand — Baguette vs Lady Dior, THB prices, investment case, which to buy used in Bangkok ${PRICE_YEAR}.`
      : `เปรียบ Fendi กับ Dior มือสองในไทย — Baguette vs Lady Dior ราคาบาท กรณีลงทุน อันไหนซื้อมือสองในกรุงเทพได้ดีกว่า ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function FendiVsDiorTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Icon bag', fendi: `Baguette (${formatPriceTHB(800)}–${formatPriceTHB(2500)})`, dior: `Lady Dior (${formatPriceTHB(2000)}–${formatPriceTHB(5000)})` },
    { metric: 'Entry price', fendi: `${formatPriceTHB(400)}+ (Mini Baguette)`, dior: `${formatPriceTHB(2000)}+ (Lady Dior Mini)` },
    { metric: 'Resale vs retail', fendi: '40–65% (standard); higher for collaboration pieces', dior: '55–75%' },
    { metric: 'Investment case', fendi: 'Weak on standard — strong only on limited (Karl era, collabs)', dior: 'Moderate — Lady Dior holds value better on secondary market' },
    { metric: 'Creative direction', fendi: 'Kim Jones (since 2020) — more minimalist post-Lagerfeld', dior: 'Maria Grazia Chiuri — feminine, fashion-forward' },
    { metric: 'Thailand recognition', fendi: 'Strong — Baguette popular among Thai celebrities', dior: 'Very strong — Lady Dior royal associations, wide recognition' },
    { metric: 'Best pre-owned buy', fendi: `Baguette niche leather ${formatPriceTHB(800)}–${formatPriceTHB(1200)}`, dior: `Lady Dior M black lambskin ${formatPriceTHB(2000)}–${formatPriceTHB(3500)}` },
  ] : [
    { metric: 'กระเป๋าสัญลักษณ์', fendi: `Baguette (${formatPriceTHB(800)}–${formatPriceTHB(2500)})`, dior: `Lady Dior (${formatPriceTHB(2000)}–${formatPriceTHB(5000)})` },
    { metric: 'ราคาเริ่มต้น', fendi: `${formatPriceTHB(400)}+ (Mini Baguette)`, dior: `${formatPriceTHB(2000)}+ (Lady Dior Mini)` },
    { metric: 'ขายต่อ vs ราคาร้าน', fendi: '40–65% (มาตรฐาน) สูงกว่าสำหรับ collaboration', dior: '55–75%' },
    { metric: 'กรณีลงทุน', fendi: 'อ่อนสำหรับรุ่นมาตรฐาน แข็งเฉพาะ Limited (Karl era, collabs)', dior: 'ปานกลาง — Lady Dior คงมูลค่าได้ดีกว่าในตลาดรอง' },
    { metric: 'ทิศทางสร้างสรรค์', fendi: 'Kim Jones (ตั้งแต่ปี 2020) minimalist มากขึ้นหลัง Lagerfeld', dior: 'Maria Grazia Chiuri — ผู้หญิง แฟชั่น' },
    { metric: 'การรับรู้ในไทย', fendi: 'แข็งแกร่ง — Baguette ยอดนิยมในหมู่ดาราไทย', dior: 'แข็งแกร่งมาก — Lady Dior เชื่อมโยงราชวงศ์ การรับรู้กว้าง' },
    { metric: 'ซื้อมือสองที่ดีที่สุด', fendi: `Baguette หนังพิเศษ ${formatPriceTHB(800)}–${formatPriceTHB(1200)}`, dior: `Lady Dior M หนังแลมบ์สกินดำ ${formatPriceTHB(2000)}–${formatPriceTHB(3500)}` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Fendi vs Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Fendi vs Dior Pre-Owned' : 'Fendi vs Dior มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Fendi and Dior are both LVMH luxury houses. Fendi is playful and icon-driven (Baguette). Dior is fashion-classic and investment-oriented (Lady Dior). For Thai buyers: Dior holds value better, Fendi offers more entry flexibility.'
          : 'Fendi และ Dior ทั้งคู่เป็นเมซองหรูในกลุ่ม LVMH Fendi มีความสนุกและขับเคลื่อนด้วย icon (Baguette) Dior เป็นแฟชั่น classic และเน้นการลงทุน (Lady Dior) สำหรับผู้ซื้อชาวไทย Dior คงมูลค่าได้ดีกว่า Fendi มีความยืดหยุ่นด้านราคาเริ่มต้นมากกว่า'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Fendi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Dior</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.fendi}</td>
                <td className="py-3 px-4 text-gray-700">{r.dior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/fendi-vs-dior" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/fendi-vs-dior" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/fendi`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Fendi Pre-Owned →' : 'Fendi มือสอง →'}</Link>
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Dior Pre-Owned →' : 'Dior มือสอง →'}</Link>
        <Link href={`/${locale}/compare/chanel-vs-dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Dior →</Link>
      </div>
    </div>
  )
}
