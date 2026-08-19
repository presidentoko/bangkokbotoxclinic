import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/dior-vs-gucci'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Dior vs Gucci Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Dior vs Gucci มือสองในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `Dior vs Gucci for Thai buyers — Lady Dior vs Marmont, THB prices, investment case, which French-Italian house to buy pre-owned in Bangkok ${PRICE_YEAR}.`
      : `เปรียบ Dior กับ Gucci สำหรับผู้ซื้อชาวไทย — Lady Dior vs Marmont ราคาบาท กรณีลงทุน อันไหนควรซื้อมือสองในกรุงเทพ ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function DiorVsGucciTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Heritage', dior: 'Founded Paris 1946. New Look revolution. 80 years of couture DNA.', gucci: 'Founded Florence 1921. Leather goods and equestrian roots. 100+ years of Italian craftsmanship.' },
    { metric: 'Icon bag', dior: `Lady Dior (${formatPriceTHB(2000)}–${formatPriceTHB(5000)}). Named for Princess Diana, 1994.`, gucci: `Dionysus (${formatPriceTHB(600)}–${formatPriceTHB(1200)}) or Marmont (${formatPriceTHB(700)}–${formatPriceTHB(1400)}).` },
    { metric: 'Entry price', dior: `${formatPriceTHB(700)}+ (Book Tote canvas)`, gucci: `${formatPriceTHB(300)}+ (canvas/nylon entry pieces)` },
    { metric: 'Resale vs retail', dior: '55–75% (Lady Dior). Saddle Bag reaches 80–90%+ in some references.', gucci: '40–65%. Director exit weakens some pieces. Bamboo and Jackie hold well.' },
    { metric: 'Investment case', dior: 'Solid. Lady Dior and Saddle hold value reliably. Kim Jones menswear collector-tier.', gucci: 'Mixed. Alessandro Michele era pieces (Dionysus, Marmont) now collector-tier. Sabato De Sarno era unclear.' },
    { metric: 'Thailand market', dior: 'Strong. Lady Dior and Book Tote are top pre-owned searches in Bangkok.', gucci: 'Very strong. Marmont, Dionysus, Ophidia, and Bamboo all popular in Thai resale market.' },
    { metric: 'Best for', dior: 'Investment, feminine couture aesthetics, stronger resale', gucci: 'Design history, lower entry, creative diversity, Italian leather' },
  ] : [
    { metric: 'มรดก', dior: 'ก่อตั้งปารีส 1946 การปฏิวัติ New Look 80 ปีของ DNA couture', gucci: 'ก่อตั้งฟลอเรนซ์ 1921 รากฐานสินค้าหนังและขี่ม้า 100+ ปีของงานฝีมืออิตาลี' },
    { metric: 'กระเป๋าสัญลักษณ์', dior: `Lady Dior (${formatPriceTHB(2000)}–${formatPriceTHB(5000)}) ตั้งชื่อตามเจ้าหญิงไดอาน่า ปี 1994`, gucci: `Dionysus (${formatPriceTHB(600)}–${formatPriceTHB(1200)}) หรือ Marmont (${formatPriceTHB(700)}–${formatPriceTHB(1400)})` },
    { metric: 'ราคาเริ่มต้น', dior: `${formatPriceTHB(700)}+ (Book Tote canvas)`, gucci: `${formatPriceTHB(300)}+ (canvas/nylon entry pieces)` },
    { metric: 'ขายต่อ vs ราคาร้าน', dior: '55–75% (Lady Dior) Saddle Bag ถึง 80–90%+ ในบางอ้างอิง', gucci: '40–65% การออกของผู้กำกับทำให้บางชิ้นอ่อนแอ Bamboo และ Jackie ยังดี' },
    { metric: 'กรณีลงทุน', dior: 'มั่นคง Lady Dior และ Saddle รักษามูลค่าได้ดี ชิ้น Kim Jones menswear collector-tier', gucci: 'ผสม ชิ้นยุค Alessandro Michele (Dionysus, Marmont) ตอนนี้ collector-tier ยุค Sabato De Sarno ไม่แน่ชัด' },
    { metric: 'ตลาดไทย', dior: 'แข็งแกร่ง Lady Dior และ Book Tote คือการค้นหามือสองอันดับต้นในกรุงเทพ', gucci: 'แข็งแกร่งมาก Marmont, Dionysus, Ophidia และ Bamboo ล้วนได้รับความนิยมในตลาดมือสองไทย' },
    { metric: 'ดีที่สุดสำหรับ', dior: 'การลงทุน สุนทรียศาสตร์ couture ความหวานอ่อน การขายต่อที่แข็งแกร่งกว่า', gucci: 'ประวัติศาสตร์การออกแบบ ราคาเริ่มต้นต่ำ ความหลากหลายสร้างสรรค์ หนังอิตาลี' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Dior vs Gucci</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Dior vs Gucci Pre-Owned ${PRICE_YEAR}` : `Dior vs Gucci มือสอง ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Dior is Parisian couture — the Lady Dior carries 80 years of New Look DNA. Gucci is Florentine creative maximalism with the longest Italian luxury history of any handbag house. For Thai buyers: Dior edges Gucci on consistent resale; Gucci wins on entry price flexibility and creative range.'
          : 'Dior คือ couture ปารีส Lady Dior มี DNA New Look 80 ปี Gucci คือความสร้างสรรค์แบบฟลอเรนซ์พร้อมประวัติศาสตร์หรูอิตาลียาวนานที่สุดของบ้านกระเป๋าใด สำหรับผู้ซื้อชาวไทย Dior เหนือกว่า Gucci ในการขายต่อที่สม่ำเสมอ Gucci ชนะด้านความยืดหยุ่นราคาเริ่มต้นและขอบเขตสร้างสรรค์'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Dior</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Gucci</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.dior}</td>
                <td className="py-3 px-4 text-gray-700">{r.gucci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/dior-vs-gucci" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/dior-vs-gucci" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Dior Pre-Owned →' : 'Dior มือสอง →'}</Link>
        <Link href={`/${locale}/brands/gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Gucci Pre-Owned →' : 'Gucci มือสอง →'}</Link>
        <Link href={`/${locale}/compare/chanel-vs-dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Dior →</Link>
      </div>
    </div>
  )
}
