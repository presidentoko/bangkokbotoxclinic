import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/dior-vs-louis-vuitton'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Dior vs Louis Vuitton Pre-Owned Thailand 2025 | ChicPreowned'
      : 'Dior vs Louis Vuitton มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Dior vs Louis Vuitton for Thai buyers — Lady Dior vs Neverfull, resale values, which is the better pre-owned buy. THB prices 2025.'
      : 'เปรียบ Dior กับ Louis Vuitton สำหรับผู้ซื้อชาวไทย — Lady Dior vs Neverfull มูลค่าขายต่อ อันไหนซื้อมือสองได้ดีกว่า ราคาบาท 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function DiorVsLVTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Best-seller', dior: 'Lady Dior (฿72,000–฿120,000)', lv: 'Neverfull MM (฿28,000–฿44,000)' },
    { metric: 'Entry price', dior: '฿48,000+ (Lady Dior Mini)', lv: '฿14,000+ (Speedy 25)' },
    { metric: 'Resale vs retail', dior: '55–75%', lv: '65–80% (canvas); lower in leather' },
    { metric: 'Investment case', dior: 'Good for limited editions — weaker on standard Lady Dior', lv: 'Canvas icons (Neverfull, Speedy) are the most liquid bags on earth' },
    { metric: 'Counterfeit risk', dior: 'High — cannage stitching widely copied', lv: 'Extreme — most faked bag in Asia by volume' },
    { metric: 'Recognition', dior: 'Paris fashion house — royal associations (Diana)', lv: 'Widest global recognition of any luxury brand' },
    { metric: 'Thailand presence', dior: 'Strong boutiques at Paragon, ICONSIAM', lv: 'Strongest presence — 3+ Bangkok boutiques' },
  ] : [
    { metric: 'สินค้าขายดี', dior: 'Lady Dior (฿72,000–฿120,000)', lv: 'Neverfull MM (฿28,000–฿44,000)' },
    { metric: 'ราคาเริ่มต้น', dior: '฿48,000+ (Lady Dior Mini)', lv: '฿14,000+ (Speedy 25)' },
    { metric: 'ขายต่อ vs ราคาร้าน', dior: '55–75%', lv: '65–80% (canvas) ต่ำกว่าในหนัง' },
    { metric: 'กรณีการลงทุน', dior: 'ดีสำหรับ Limited Edition อ่อนกว่าสำหรับ Lady Dior มาตรฐาน', lv: 'Canvas icons (Neverfull, Speedy) คือกระเป๋าที่มีสภาพคล่องสูงสุดในโลก' },
    { metric: 'ความเสี่ยงของปลอม', dior: 'สูง — การเย็บ cannage ถูกลอกเลียนแบบอย่างกว้างขวาง', lv: 'สูงมาก — กระเป๋าที่ถูกปลอมแปลงมากที่สุดในเอเชียโดยปริมาณ' },
    { metric: 'การรับรู้', dior: 'เมซองแฟชั่นปารีส — เชื่อมโยงราชวงศ์ (Diana)', lv: 'การรับรู้ทั่วโลกกว้างที่สุดของแบรนด์หรูใดๆ' },
    { metric: 'สถานะในไทย', dior: 'บูติกแข็งแกร่งที่พารากอน ICONSIAM', lv: 'สถานะแข็งแกร่งที่สุด บูติกกรุงเทพ 3+ แห่ง' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Dior vs Louis Vuitton</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Dior vs Louis Vuitton Pre-Owned' : 'Dior vs Louis Vuitton มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'LV and Dior are both LVMH houses. LV has the wider reach and more liquid pre-owned market. Dior has stronger fashion credibility and royal associations. For Thai buyers: LV is easier to buy and sell; Dior is for fashion-first shoppers.'
          : 'LV และ Dior ทั้งคู่เป็นเมซองในกลุ่ม LVMH LV มีการเข้าถึงที่กว้างกว่าและตลาดมือสองที่มีสภาพคล่องมากกว่า Dior มีความน่าเชื่อถือด้านแฟชั่นที่แข็งแกร่งกว่าและเชื่อมโยงราชวงศ์ สำหรับผู้ซื้อชาวไทย LV ซื้อและขายง่ายกว่า Dior เหมาะสำหรับนักช้อปที่เน้นแฟชั่น'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Dior</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Louis Vuitton</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.dior}</td>
                <td className="py-3 px-4 text-gray-700">{r.lv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/dior-vs-louis-vuitton" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/dior-vs-louis-vuitton" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Dior Pre-Owned →' : 'Dior มือสอง →'}</Link>
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'LV Pre-Owned →' : 'LV มือสอง →'}</Link>
        <Link href={`/${locale}/compare/chanel-vs-dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Dior →</Link>
      </div>
    </div>
  )
}
