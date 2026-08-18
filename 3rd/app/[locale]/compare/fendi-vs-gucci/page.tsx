import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/fendi-vs-gucci'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Fendi vs Gucci Thailand ${PRICE_YEAR}: Which Italian House Holds Value? | ChicPreowned`
      : `Fendi vs Gucci ในไทย ${PRICE_YEAR}: บ้านอิตาลีไหนรักษามูลค่าได้ดีกว่า? | ChicPreowned`,
    description: isEn
      ? `Fendi vs Gucci for Thailand buyers ${PRICE_YEAR} — Roman architecture vs Florentine eclecticism, resale retention, THB prices, Gucci creative director volatility, and which Italian luxury brand to buy pre-owned.`
      : `Fendi vs Gucci สำหรับผู้ซื้อในไทย ${PRICE_YEAR} สถาปัตยกรรมโรมัน vs ผสมผสานฟลอเรนซ์ อัตราการรักษามูลค่า ราคาบาท ความผันผวนของผู้อำนวยการสร้างสรรค์ Gucci และควรซื้อแบรนด์หรูอิตาลีไหนมือสอง`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function FendiVsGucciTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Founded', fendi: 'Rome, 1925', gucci: 'Florence, 1921' },
    { aspect: 'Parent group', fendi: 'LVMH', gucci: 'Kering' },
    { aspect: 'Design identity', fendi: 'Roman edge — FF logo, structured Baguette', gucci: 'Florentine eclecticism — GG monogram, horsebit, maximalism' },
    { aspect: 'New price', fendi: `$1,400–5,500 (${formatPriceTHB(1400, 5500)})`, gucci: `$1,100–4,800 (${formatPriceTHB(1100, 4800)})` },
    { aspect: 'Pre-owned entry', fendi: `$600–900 (${formatPriceTHB(600, 900)}) Baguette worn`, gucci: `$450–750 (${formatPriceTHB(450, 750)}) Marmont small worn` },
    { aspect: 'Resale retention', fendi: '45–65% (Baguette Zucca: up to 70%)', gucci: '35–55% (GG Marmont softening; vintage: 60-80%)' },
    { aspect: 'Investment tier', fendi: 'B (broad market, consistent)', gucci: 'C+/B (creative director churn hurts; vintage stronger)' },
    { aspect: 'Bangkok boutique', fendi: 'Fendi at CentralWorld, Siam Paragon', gucci: 'Gucci at Siam Paragon, EmSphere, ICON Siam' },
  ] : [
    { aspect: 'ก่อตั้ง', fendi: 'โรม 1925', gucci: 'ฟลอเรนซ์ 1921' },
    { aspect: 'กลุ่มบริษัทแม่', fendi: 'LVMH', gucci: 'Kering' },
    { aspect: 'เอกลักษณ์ดีไซน์', fendi: 'ขอบโรมัน โลโก้ FF Baguette มีโครงสร้าง', gucci: 'ผสมผสานฟลอเรนซ์ โมโนแกรม GG horsebit แม็กซิมอลลิสม์' },
    { aspect: 'ราคาใหม่', fendi: `$1,400–5,500 (${formatPriceTHB(1400, 5500)})`, gucci: `$1,100–4,800 (${formatPriceTHB(1100, 4800)})` },
    { aspect: 'มือสองเริ่มต้น', fendi: `$600–900 (${formatPriceTHB(600, 900)}) Baguette สภาพใช้`, gucci: `$450–750 (${formatPriceTHB(450, 750)}) Marmont small สภาพใช้` },
    { aspect: 'อัตราการรักษามูลค่า', fendi: '45–65% (Baguette Zucca: สูงถึง 70%)', gucci: '35–55% (GG Marmont อ่อนตัว; วินเทจ: 60-80%)' },
    { aspect: 'ระดับการลงทุน', fendi: 'B (ตลาดกว้าง สม่ำเสมอ)', gucci: 'C+/B (การเปลี่ยนผู้อำนวยการสร้างสรรค์กระทบ; วินเทจแข็งแกร่งกว่า)' },
    { aspect: 'บูทีคกรุงเทพ', fendi: 'Fendi ที่ CentralWorld, Siam Paragon', gucci: 'Gucci ที่ Siam Paragon, EmSphere, ICON Siam' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Fendi vs Gucci</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Fendi vs Gucci ({PRICE_YEAR}): Which Italian House Holds Value Better?' : 'Fendi vs Gucci ({PRICE_YEAR}): บ้านอิตาลีไหนรักษามูลค่าได้ดีกว่า?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both Italian luxury giants with century-long histories. In the pre-owned market, Fendi\'s consistent LVMH-era positioning gives it a slight edge over Gucci, which has been volatile through creative director changes since 2019.'
          : 'ทั้งสองยักษ์ใหญ่หรูอิตาลีที่มีประวัติศาสตร์นานหนึ่งศตวรรษ ในตลาดมือสอง การวางตำแหน่งที่สม่ำเสมอในยุค LVMH ของ Fendi ให้ข้อได้เปรียบเล็กน้อยเหนือ Gucci ที่ผันผวนผ่านการเปลี่ยนผู้อำนวยการสร้างสรรค์ตั้งแต่ปี 2019'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Fendi</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-green-700">Gucci</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.fendi}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.gucci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-red-900 mb-2">{isEn ? 'Gucci\'s creative director problem' : 'ปัญหาผู้อำนวยการสร้างสรรค์ของ Gucci'}</h3>
        <p className="text-sm text-red-800">
          {isEn
            ? 'Alessandro Michele\'s maximalist era (2015-2022) created a very specific aesthetic that now reads as dated. Sabato De Sarno\'s quieter era (2023+) hasn\'t produced iconic new pieces yet. GG Marmont has softened significantly pre-owned. Vintage Gucci (1950s-80s bamboo, horsebit) has genuine collector demand and is the stronger investment play.'
            : 'ยุค maximalist ของ Alessandro Michele (2015-2022) สร้างสุนทรียศาสตร์เฉพาะที่ตอนนี้ดูเก่า ยุคที่เงียบกว่าของ Sabato De Sarno (2023+) ยังไม่ได้ผลิตชิ้นสัญลักษณ์ใหม่ GG Marmont อ่อนตัวอย่างมีนัยสำคัญมือสอง Gucci วินเทจ (ไม้ไผ่ 1950s-80s, horsebit) มีความต้องการจากนักสะสมจริงและเป็นการเล่นลงทุนที่แข็งแกร่งกว่า'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/fendi-vs-gucci" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/fendi-vs-gucci" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/fendi`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi →</Link>
        <Link href={`/${locale}/brands/gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci →</Link>
        <Link href={`/${locale}/compare/fendi-vs-loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
        <Link href={`/${locale}/compare/prada-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Gucci →</Link>
      </div>
    </div>
  )
}
