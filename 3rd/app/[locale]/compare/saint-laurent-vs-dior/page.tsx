import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/saint-laurent-vs-dior'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Saint Laurent vs Dior: Pre-Owned Bags Thailand 2025 | ChicPreowned' : 'Saint Laurent vs Dior: กระเป๋ามือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Saint Laurent vs Dior for Thai buyers — Sac de Jour vs Lady Dior, THB prices, value retention, and which to buy in Bangkok.'
      : 'Saint Laurent vs Dior สำหรับคนไทย — Sac de Jour vs Lady Dior ราคาบาท อัตราการรักษามูลค่า และซื้ออะไรดีในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function YSLvsDiorTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Iconic bags', ysl: 'Sac de Jour, Loulou, Lou Camera Bag', dior: 'Lady Dior, Saddle, Book Tote' },
    { aspect: 'Entry (THB pre-owned)', ysl: '฿24,000 (Lou Camera Bag)', dior: '฿26,000 (small charm/pouch)' },
    { aspect: 'Mid-range (THB)', ysl: '฿55,000–92,000 (Sac de Jour Small)', dior: '฿74,000–129,000 (Lady Dior Small)' },
    { aspect: 'Value retention', ysl: '55–70% (Sac de Jour: 60–75%)', dior: '60–80% (Lady Dior: 70–85%)' },
    { aspect: 'Thailand recognition', ysl: 'High (BTS crowd, fashion-aware)', dior: 'Very high (mainstream luxury awareness)' },
    { aspect: 'Best pre-owned buy', ysl: 'Sac de Jour (structured, versatile)', dior: 'Lady Dior Small (neutral lambskin)' },
  ] : [
    { aspect: 'กระเป๋าไอคอนิก', ysl: 'Sac de Jour, Loulou, Lou Camera Bag', dior: 'Lady Dior, Saddle, Book Tote' },
    { aspect: 'ราคาเริ่มต้น (บาทมือสอง)', ysl: '24,000 บาท (Lou Camera Bag)', dior: '26,000 บาท (small charm)' },
    { aspect: 'ราคากลาง (บาท)', ysl: '55,000–92,000 บาท (Sac de Jour Small)', dior: '74,000–129,000 บาท (Lady Dior Small)' },
    { aspect: 'อัตราการรักษามูลค่า', ysl: '55–70% (Sac de Jour: 60–75%)', dior: '60–80% (Lady Dior: 70–85%)' },
    { aspect: 'การจดจำในไทย', ysl: 'สูง (กลุ่ม BTS รักแฟชั่น)', dior: 'สูงมาก (กระแสหลัก luxury)' },
    { aspect: 'ซื้อมือสองดีที่สุด', ysl: 'Sac de Jour (ทรงโครงสร้าง หลากหลาย)', dior: 'Lady Dior Small (lambskin สีกลาง)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Saint Laurent vs Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Saint Laurent vs Dior: Pre-Owned in Thailand 2025' : 'Saint Laurent vs Dior: มือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Two iconic Parisian houses — rock-chic vs romantic elegance. Which is the better pre-owned choice for Thai buyers?'
          : 'สองแบรนด์ปารีสระดับตำนาน — ร็อคชิคกับความหรูหราโรแมนติก อันไหนดีกว่าสำหรับผู้ซื้อมือสองชาวไทย?'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'หัวข้อ'}</th>
              <th className="text-left py-3 px-4 font-semibold">Saint Laurent</th>
              <th className="text-left py-3 px-4 font-semibold">Dior</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.ysl}</td>
                <td className="py-3 px-4 text-gray-600">{row.dior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/saint-laurent-vs-dior" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/saint-laurent-vs-dior" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/saint-laurent`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL Guide →</Link>
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior Guide →</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL vs Céline →</Link>
      </div>
    </div>
  )
}
