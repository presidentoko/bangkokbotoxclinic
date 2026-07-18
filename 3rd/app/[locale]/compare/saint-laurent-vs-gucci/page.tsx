import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/saint-laurent-vs-gucci'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Saint Laurent vs Gucci Pre-Owned Thailand 2025 | ChicPreowned'
      : 'Saint Laurent vs Gucci มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Saint Laurent vs Gucci comparison for Thai buyers — Lou Lou vs Dionysus, Sac de Jour vs Marmont. THB prices and resale values.'
      : 'เปรียบ Saint Laurent กับ Gucci สำหรับผู้ซื้อชาวไทย — Lou Lou vs Dionysus Sac de Jour vs Marmont ราคาบาทและมูลค่าขายต่อ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function SLVsGucciTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Most popular bag', ysl: 'Lou Lou YSL — ฿28,000–44,000', gucci: 'Dionysus Small — ฿20,000–34,000' },
    { metric: 'Status bag', ysl: 'Sac de Jour — ฿56,000–88,000', gucci: 'Horsebit 1955 — ฿32,000–56,000' },
    { metric: 'Resale vs retail', ysl: '65–85% (stable)', gucci: '55–75% Michele era; 45–65% new' },
    { metric: 'Brand moment', ysl: 'Slimane era is consistent — cool Parisian', gucci: 'Post-Michele transition — De Sarno finding direction' },
    { metric: 'Pre-owned appeal', ysl: 'Timeless: structured, minimal-logo pieces hold', gucci: 'Michele era: maximalist icons (Dionysus, Marmont)' },
    { metric: 'Thailand market', ysl: 'Strong at Paragon, ICONSIAM, Siam Center', gucci: 'Strong at Paragon, Central Ladprao' },
  ] : [
    { metric: 'กระเป๋ายอดนิยม', ysl: 'Lou Lou YSL — ฿28,000–44,000', gucci: 'Dionysus Small — ฿20,000–34,000' },
    { metric: 'กระเป๋าสถานะ', ysl: 'Sac de Jour — ฿56,000–88,000', gucci: 'Horsebit 1955 — ฿32,000–56,000' },
    { metric: 'ขายต่อ vs ราคาร้าน', ysl: '65–85% (คงที่)', gucci: '55–75% ยุค Michele 45–65% ใหม่' },
    { metric: 'ช่วงเวลาของแบรนด์', ysl: 'ยุค Slimane สม่ำเสมอ — ความเย็นสไตล์ปารีส', gucci: 'หลังยุค Michele เปลี่ยนผ่าน — De Sarno กำลังหาทิศทาง' },
    { metric: 'ความน่าสนใจมือสอง', ysl: 'ไม่มีวันล้าสมัย: ชิ้นแข็งทรงโลโก้น้อยคงมูลค่า', gucci: 'ยุค Michele: ไอคอนสไตล์ maximalist (Dionysus, Marmont)' },
    { metric: 'ตลาดไทย', ysl: 'แข็งแกร่งที่พารากอน ICONSIAM สยามเซ็นเตอร์', gucci: 'แข็งแกร่งที่พารากอน เซ็นทรัลลาดพร้าว' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Saint Laurent vs Gucci</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Saint Laurent vs Gucci Pre-Owned' : 'Saint Laurent vs Gucci มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both are iconic European houses. SL is currently in a stable, cool phase; Gucci is in creative transition. For pre-owned value, SL is safer; for iconic pieces, Gucci\'s Michele era wins.'
          : 'ทั้งคู่เป็นเมซองยุโรปที่มีชื่อเสียง SL อยู่ในช่วงคงที่และเย็น Gucci อยู่ในช่วงเปลี่ยนผ่านด้านความคิดสร้างสรรค์ สำหรับมูลค่ามือสอง SL ปลอดภัยกว่า สำหรับชิ้นไอคอน ยุค Michele ของ Gucci ชนะ'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Saint Laurent</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Gucci</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.ysl}</td>
                <td className="py-3 px-4 text-gray-700">{r.gucci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/saint-laurent-vs-gucci" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/saint-laurent-vs-gucci" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/saint-laurent`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'SL Pre-Owned →' : 'SL มือสอง →'}</Link>
        <Link href={`/${locale}/brands/gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Gucci Pre-Owned →' : 'Gucci มือสอง →'}</Link>
        <Link href={`/${locale}/guides/gucci-dionysus-vs-marmont`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dionysus vs Marmont →</Link>
      </div>
    </div>
  )
}
