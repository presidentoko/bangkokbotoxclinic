import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/chanel-vs-gucci'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel vs Gucci Pre-Owned Thailand 2025 | ChicPreowned'
      : 'Chanel vs Gucci มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Chanel vs Gucci comparison for Thai buyers — Classic Flap vs Dionysus, investment value, resale retention. THB prices and buying guide.'
      : 'เปรียบ Chanel กับ Gucci สำหรับผู้ซื้อชาวไทย — Classic Flap vs Dionysus มูลค่าการลงทุน การคงมูลค่าขายต่อ ราคาบาทและคู่มือซื้อ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function ChanelVsGucciTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Investment case', chanel: 'Strongest in handbags — 90–130% resale vs retail', gucci: 'Moderate — 55–80% Michele era, weaker now' },
    { metric: 'Iconic pre-owned bag', chanel: 'Classic Flap Medium (฿150,000–฿280,000)', gucci: 'Dionysus Small (฿20,000–฿34,000)' },
    { metric: 'Entry price', chanel: '฿90,000+ (Mini)', gucci: '฿16,000+ (compact wallet)' },
    { metric: 'Logo visibility', chanel: 'CC logo — understated but recognized everywhere', gucci: 'GG pattern / horsebit — widely visible, streetwear crossover' },
    { metric: 'Creative direction', chanel: 'Virginie Viard — conservative, consistent, safe', gucci: 'Sabato De Sarno — still finding direction after Michele' },
    { metric: 'Thailand market demand', chanel: 'Strongest luxury brand in Thailand by recognition', gucci: 'Very high — widely distributed, large presence' },
    { metric: 'Best buy (value)', chanel: 'Chanel Classic Flap in black caviar — appreciates', gucci: 'Michele-era Dionysus — iconic, won\'t get cheaper' },
  ] : [
    { metric: 'กรณีการลงทุน', chanel: 'แข็งแกร่งที่สุดในกระเป๋า — ขายต่อ 90–130% ของราคาร้าน', gucci: 'ปานกลาง — 55–80% ยุค Michele ต่ำกว่าตอนนี้' },
    { metric: 'กระเป๋าไอคอนมือสอง', chanel: 'Classic Flap Medium (฿150,000–฿280,000)', gucci: 'Dionysus Small (฿20,000–฿34,000)' },
    { metric: 'ราคาเข้าถึง', chanel: '฿90,000+ (Mini)', gucci: '฿16,000+ (กระเป๋าสตางค์ขนาดกระทัดรัด)' },
    { metric: 'ความชัดเจนของโลโก้', chanel: 'โลโก้ CC — สงบแต่เป็นที่รู้จักทุกที่', gucci: 'ลาย GG / horsebit — มองเห็นชัด ข้ามไปยัง streetwear' },
    { metric: 'ทิศทางสร้างสรรค์', chanel: 'Virginie Viard — อนุรักษ์นิยม สม่ำเสมอ ปลอดภัย', gucci: 'Sabato De Sarno — ยังหาทิศทางหลัง Michele' },
    { metric: 'ความต้องการตลาดไทย', chanel: 'แบรนด์หรูที่แข็งแกร่งที่สุดในไทยตามการรับรู้', gucci: 'สูงมาก — กระจายอย่างกว้างขวาง มีสถานะใหญ่' },
    { metric: 'ซื้อที่ดีที่สุด (คุ้มค่า)', chanel: 'Chanel Classic Flap หนัง caviar ดำ — เพิ่มมูลค่า', gucci: 'Dionysus ยุค Michele — ไอคอนิก ไม่ถูกลงอีก' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Chanel vs Gucci</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel vs Gucci Pre-Owned' : 'Chanel vs Gucci มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two of the most recognized luxury brands in Thailand. Chanel is the stronger investment and holds value at or above retail. Gucci is far more accessible with strong brand recognition — ideal if you want the luxury look at a lower entry price.'
          : 'สองแบรนด์หรูที่เป็นที่รู้จักมากที่สุดในไทย Chanel เป็นการลงทุนที่แข็งแกร่งกว่าและคงมูลค่าได้เท่าหรือเกินราคาร้าน Gucci เข้าถึงได้มากกว่ามากพร้อมการรับรู้แบรนด์แข็งแกร่ง เหมาะถ้าต้องการความหรูในราคาเริ่มต้นต่ำกว่า'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Chanel</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Gucci</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.chanel}</td>
                <td className="py-3 px-4 text-gray-700">{r.gucci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/chanel-vs-gucci" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/chanel-vs-gucci" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Pre-Owned →' : 'Chanel มือสอง →'}</Link>
        <Link href={`/${locale}/brands/gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Gucci Pre-Owned →' : 'Gucci มือสอง →'}</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">SL vs Gucci →</Link>
      </div>
    </div>
  )
}
