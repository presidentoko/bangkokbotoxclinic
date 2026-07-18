import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/prada-vs-miu-miu'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Prada vs Miu Miu: Pre-Owned Thailand 2025 | ChicPreowned' : 'Prada vs Miu Miu: มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Prada vs Miu Miu for Thai buyers — Re-Nylon vs Wander Bag, THB prices, which holds value better in Bangkok.'
      : 'Prada vs Miu Miu สำหรับคนไทย — Re-Nylon กับ Wander Bag ราคาบาท อันไหนรักษามูลค่าดีกว่าในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function PradaVsMiuMiuTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { a: 'Aesthetic', prada: 'Intellectual, minimal', miumiu: 'Girly, playful, youthful' },
    { a: 'Entry (THB)', prada: '฿16,500 (Re-Nylon mini)', miumiu: '฿16,500 (mini Matelassé)' },
    { a: 'Mid-range (THB)', prada: '฿35,000–81,000 (Galleria Small)', miumiu: '฿52,000–104,000 (Wander Bag)' },
    { a: 'Value retention', prada: '50–65%', miumiu: '55–75% (Wander: 70–75%)' },
    { a: 'Thai recognition', prada: 'Strong — professional and fashion audiences', miumiu: 'Rising fast — Gen Z and BTS crowd' },
    { a: 'Best pre-owned now', prada: 'Re-Nylon Tote (practical classic)', miumiu: 'Wander Bag (peak demand 2024–25)' },
  ] : [
    { a: 'สไตล์', prada: 'ปัญญาชน มินิมัล', miumiu: 'สาวน้อย ดูเล่น หนุ่มสาว' },
    { a: 'ราคาเริ่มต้น (บาท)', prada: '16,500 บาท (Re-Nylon mini)', miumiu: '16,500 บาท (mini Matelassé)' },
    { a: 'ราคากลาง (บาท)', prada: '35,000–81,000 บาท (Galleria Small)', miumiu: '52,000–104,000 บาท (Wander Bag)' },
    { a: 'อัตราการรักษามูลค่า', prada: '50–65%', miumiu: '55–75% (Wander: 70–75%)' },
    { a: 'การรับรู้ในไทย', prada: 'แข็งแกร่ง — กลุ่มมืออาชีพและแฟชั่น', miumiu: 'โตเร็ว — กลุ่ม Gen Z และ BTS crowd' },
    { a: 'ซื้อมือสองดีที่สุดตอนนี้', prada: 'Re-Nylon Tote (classic ใช้ได้นาน)', miumiu: 'Wander Bag (demand พีคปี 2024–25)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Prada vs Miu Miu</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Prada vs Miu Miu: Pre-Owned Thailand 2025' : 'Prada vs Miu Miu: มือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Same designer, same parent group — but very different audiences. Which is the better pre-owned buy for Thai buyers in 2025?'
          : 'นักออกแบบเดียวกัน กลุ่มบริษัทเดียวกัน แต่ผู้ชมต่างกันมาก อันไหนเป็นการซื้อมือสองที่ดีกว่าสำหรับคนไทยในปี 2025?'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'หัวข้อ'}</th>
              <th className="text-left py-3 px-4 font-semibold">Prada</th>
              <th className="text-left py-3 px-4 font-semibold">Miu Miu</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.a}</td>
                <td className="py-3 px-4 text-gray-600">{row.prada}</td>
                <td className="py-3 px-4 text-gray-600">{row.miumiu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/prada-vs-miu-miu" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/prada-vs-miu-miu" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/prada`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada Guide →</Link>
        <Link href={`/${locale}/brands/miu-miu`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu Guide →</Link>
      </div>
    </div>
  )
}
