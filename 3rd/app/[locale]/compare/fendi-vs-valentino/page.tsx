import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/fendi-vs-valentino'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Fendi vs Valentino: Which Italian Brand for Bangkok Buyers 2025? | ChicPreowned'
      : 'Fendi vs Valentino: แบรนด์อิตาลีไหนดีกว่าสำหรับผู้ซื้อกรุงเทพ 2025? | ChicPreowned',
    description: isEn
      ? 'Fendi vs Valentino 2025 — Baguette vs Rockstud, resale retention, THB prices, Bangkok boutique context. Which Italian house is worth buying pre-owned in Thailand?'
      : 'Fendi vs Valentino 2025 — Baguette vs Rockstud อัตราการรักษามูลค่า ราคาบาท บริบทบูทีคกรุงเทพ แบรนด์อิตาลีไหนคุ้มกว่าในการซื้อมือสองในไทย?',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function FendiVsValentinoTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Founded', fendi: 'Rome, 1925', valen: 'Rome, 1960' },
    { aspect: 'Group', fendi: 'LVMH (since 2001)', valen: 'Mayhoola (Qatari fund, 2012)' },
    { aspect: 'Creative direction', fendi: 'Kim Jones (RTW) + Silvia Fendi (accessories)', valen: 'Alessandro Michele (from Gucci, 2023)' },
    { aspect: 'Signature bag', fendi: 'Baguette (1997), Peekaboo, First', valen: 'Rockstud Alcove, Roman Stud, Locò' },
    { aspect: 'Entry pre-owned', fendi: `$400 (${formatPriceTHB(400)}) canvas Baguette`, valen: `$600 (${formatPriceTHB(600)}) Rockstud accessories` },
    { aspect: 'Mid-range pre-owned', fendi: `$1,000–1,800 (${formatPriceTHB(1000)}–${formatPriceTHB(1800)}) leather Baguette`, valen: `$900–1,500 (${formatPriceTHB(900)}–${formatPriceTHB(1500)}) Rockstud Tote` },
    { aspect: 'Resale retention', fendi: '45–65% (Baguette 50–75%)', valen: '40–60% (Rockstud 45–65%)' },
    { aspect: 'Bangkok boutique', fendi: 'Emporium, Siam Paragon', valen: 'Emporium, ICONSIAM' },
  ] : [
    { aspect: 'ก่อตั้ง', fendi: 'โรม 1925', valen: 'โรม 1960' },
    { aspect: 'กลุ่ม', fendi: 'LVMH (ตั้งแต่ 2001)', valen: 'Mayhoola (กองทุนกาตาร์ 2012)' },
    { aspect: 'ทิศทางสร้างสรรค์', fendi: 'Kim Jones (RTW) + Silvia Fendi (accessories)', valen: 'Alessandro Michele (จาก Gucci 2023)' },
    { aspect: 'กระเป๋าไอคอน', fendi: 'Baguette (1997), Peekaboo, First', valen: 'Rockstud Alcove, Roman Stud, Locò' },
    { aspect: 'มือสองราคาเริ่มต้น', fendi: `$400 (${formatPriceTHB(400)}) Baguette ผ้าใบ`, valen: `$600 (${formatPriceTHB(600)}) Rockstud accessories` },
    { aspect: 'มือสองราคากลาง', fendi: `$1,000–1,800 (${formatPriceTHB(1000)}–${formatPriceTHB(1800)}) Baguette หนัง`, valen: `$900–1,500 (${formatPriceTHB(900)}–${formatPriceTHB(1500)}) Rockstud Tote` },
    { aspect: 'อัตราการรักษามูลค่า', fendi: '45–65% (Baguette 50–75%)', valen: '40–60% (Rockstud 45–65%)' },
    { aspect: 'บูทีคกรุงเทพ', fendi: 'Emporium, Siam Paragon', valen: 'Emporium, ICONSIAM' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Fendi vs Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Fendi vs Valentino (2025)</h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two Italian fashion powerhouses in the same luxury tier. Fendi edges ahead on resale thanks to the Baguette — but both are style buys, not investment plays. Bangkok context and THB prices included.'
          : 'สองแบรนด์แฟชั่นอิตาลีในระดับหรูเดียวกัน Fendi นำหน้าด้านการขายต่อด้วย Baguette แต่ทั้งคู่ซื้อเพื่อสไตล์ ไม่ใช่การลงทุน รวมบริบทกรุงเทพและราคาบาท'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Fendi</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Valentino</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.fendi}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.valen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'Buy Fendi if…' : 'ซื้อ Fendi ถ้า…'}</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            {(isEn ? [
              'You want the Baguette — 25+ year collector history',
              'You prefer LVMH brand stability',
              'Peekaboo\'s double-opening appeals to you',
            ] : [
              'คุณต้องการ Baguette ประวัตินักสะสม 25+ ปี',
              'คุณชอบความมั่นคงของแบรนด์ LVMH',
              'โครงสร้างเปิดคู่ของ Peekaboo ดึงดูดคุณ',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
          <h3 className="font-semibold text-pink-900 mb-2">{isEn ? 'Buy Valentino if…' : 'ซื้อ Valentino ถ้า…'}</h3>
          <ul className="text-sm text-pink-800 space-y-1">
            {(isEn ? [
              'Rockstud studs are your signature aesthetic',
              'You want footwear — Valentino heels outperform its bags',
              'Michele\'s new direction excites you (early pieces = future collector interest)',
            ] : [
              'หมุด Rockstud คือ aesthetic สัญลักษณ์ของคุณ',
              'คุณต้องการรองเท้า รองเท้าส้นสูง Valentino ดีกว่ากระเป๋า',
              'ทิศทางใหม่ของ Michele ตื่นเต้นคุณ (ชิ้นแรก = ความสนใจนักสะสมในอนาคต)',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'The Baguette exception' : 'ข้อยกเว้น Baguette'}</h3>
          <p className="text-sm text-gray-600">
            {isEn
              ? 'The 1997 Baguette is in a different category. SJP\'s Sex and the City connection made it a cultural icon with sustained demand for nearly three decades. Limited editions have genuine investment potential.'
              : 'Baguette ปี 1997 อยู่ในหมวดหมู่ต่างออกไป การเชื่อมโยงของ SJP กับ Sex and the City ทำให้กลายเป็นไอคอนทางวัฒนธรรมที่มีความต้องการต่อเนื่องเกือบสามทศวรรษ Limited editions มีศักยภาพการลงทุนที่แท้จริง'}
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/fendi-vs-valentino" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/fendi-vs-valentino" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/fendi`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi →</Link>
        <Link href={`/${locale}/brands/valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Valentino →</Link>
        <Link href={`/${locale}/compare/fendi-vs-dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Dior →</Link>
        <Link href={`/${locale}/compare/dior-vs-valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Valentino →</Link>
      </div>
    </div>
  )
}
