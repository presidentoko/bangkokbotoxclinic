import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/dior-saddle-bag-comeback-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Dior Saddle Bag Comeback 2025 Thailand | ChicPreowned'
      : 'กระเป๋า Dior Saddle กลับมาในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Dior Saddle Bag 2025 for Thai buyers — price history, John Galliano vs Maria Grazia Chiuri era, pre-owned THB values, buy or sell now? Bangkok market context.'
      : 'กระเป๋า Dior Saddle 2025 สำหรับผู้ซื้อชาวไทย ประวัติราคา ยุค John Galliano vs Maria Grazia Chiuri มูลค่ามือสองบาท ควรซื้อหรือขายตอนนี้? บริบทตลาดกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function DiorSaddleTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const priceHistory = isEn ? [
    { year: '2002', model: 'Original (John Galliano era)', price: `$900–$1,400 (${formatPriceTHB(900)}–${formatPriceTHB(1400)})`, context: 'Peak popularity, seen on every fashion icon. Discontinued shortly after.' },
    { year: '2018', model: 'Relaunch (Maria Grazia Chiuri)', price: `$3,500–$5,500 retail (${formatPriceTHB(3500)}–${formatPriceTHB(5500)})`, context: 'Kim Kardashian Instagram revival. Pre-owned Galliano originals hit 2x retail immediately.' },
    { year: '2020', model: 'Black canvas pre-owned', price: `$1,800–$2,800 (${formatPriceTHB(1800)}–${formatPriceTHB(2800)})`, context: 'Hype cooled. Good buying window for pre-owned. Strong buying opportunity for Thailand.' },
    { year: '2023', model: 'Oblique canvas + leather', price: `$2,500–$4,200 (${formatPriceTHB(2500)}–${formatPriceTHB(4200)})`, context: 'Second wave. Y2K fashion revival drives demand. Galliano-era originals 2,000–3,500.' },
    { year: '2025', model: 'Current leather (medium)', price: `$3,200–$5,800 (${formatPriceTHB(3200)}–${formatPriceTHB(5800)})`, context: 'Pre-owned 20–35% below current retail. Both eras actively trading in Bangkok.' },
  ] : [
    { year: '2002', model: 'ต้นฉบับ (ยุค John Galliano)', price: `$900–$1,400 (${formatPriceTHB(900)}–${formatPriceTHB(1400)})`, context: 'ความนิยมสูงสุด เห็นกับทุก fashion icon ถูกยกเลิกไม่นานหลังจากนั้น' },
    { year: '2018', model: 'ฟื้นฟู (Maria Grazia Chiuri)', price: `$3,500–$5,500 ราคาร้าน (${formatPriceTHB(3500)}–${formatPriceTHB(5500)})`, context: 'Kim Kardashian Instagram revival ชิ้นต้นฉบับ Galliano มือสองพุ่งสูงถึง 2 เท่าราคาร้านทันที' },
    { year: '2020', model: 'Black canvas มือสอง', price: `$1,800–$2,800 (${formatPriceTHB(1800)}–${formatPriceTHB(2800)})`, context: 'Hype ลดลง โอกาสซื้อมือสองที่ดี โอกาสซื้อที่แข็งแกร่งสำหรับไทย' },
    { year: '2023', model: 'Oblique canvas + หนัง', price: `$2,500–$4,200 (${formatPriceTHB(2500)}–${formatPriceTHB(4200)})`, context: 'คลื่นลูกที่สอง กระแสฟื้นฟู Y2K กระตุ้นความต้องการ ชิ้นยุค Galliano 2,000–3,500' },
    { year: '2025', model: 'หนัง (medium) ปัจจุบัน', price: `$3,200–$5,800 (${formatPriceTHB(3200)}–${formatPriceTHB(5800)})`, context: 'มือสองต่ำกว่าราคาร้านปัจจุบัน 20–35% ทั้งสองยุคซื้อขายกระตือรือร้นในกรุงเทพ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Dior Saddle Bag 2025' : 'Dior Saddle Bag 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Dior Saddle Bag Comeback 2025' : 'กระเป๋า Dior Saddle กลับมาในปี 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The most dramatic comeback in luxury handbag history. John Galliano designed it in 1999. Discontinued. Relaunched in 2018 to instant viral demand. Now in its third wave — pre-owned prices have settled below retail after the 2018 hype, making 2025 a reasonable buying window.'
          : 'การกลับมาที่ดราม่าที่สุดในประวัติศาสตร์กระเป๋าหรู John Galliano ออกแบบในปี 1999 ถูกยกเลิก ฟื้นฟูในปี 2018 สู่ความต้องการไวรัลทันที ตอนนี้อยู่ในคลื่นลูกที่สาม ราคามือสองตกต่ำกว่าราคาร้านหลังจากความฮือฮาปี 2018 ทำให้ปี 2025 เป็นโอกาสซื้อที่สมเหตุสมผล'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">{isEn ? 'Year' : 'ปี'}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">{isEn ? 'Model' : 'รุ่น'}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">{isEn ? 'Price' : 'ราคา'}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">{isEn ? 'Context' : 'บริบท'}</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700 font-medium">{row.year}</td>
                <td className="py-3 px-4 text-gray-700">{row.model}</td>
                <td className="py-3 px-4 text-amber-700 font-medium text-xs">{row.price}</td>
                <td className="py-3 px-4 text-gray-600 text-xs">{row.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Why the Saddle holds value' : 'ทำไม Saddle ถึงรักษามูลค่า'}</h3>
          <p className="text-sm text-gray-600">{isEn ? 'The D-shaped silhouette is completely unique — no other bag has the same form. The distinctiveness that made it divisive in 2002 is exactly what makes it collectible now: you cannot mistake it for anything else.' : 'เส้นซิลูเอตรูปตัว D ไม่เหมือนใคร ไม่มีกระเป๋าอื่นมีรูปทรงเดียวกัน ความโดดเด่นที่ทำให้มันสร้างความแตกแยกในปี 2002 คือสิ่งที่ทำให้เป็น collectible ตอนนี้ คุณไม่สามารถสับสนกับอย่างอื่นได้'}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Buy or sell in 2025?' : 'ซื้อหรือขายในปี 2025?'}</h3>
          <p className="text-sm text-gray-600">{isEn ? 'Pre-owned Saddle at 20–35% below retail is a reasonable buy if Y2K aesthetic continues. For Bangkok buyers: both Galliano-era originals and 2018+ revival pieces have active local buyers at Chatuchak and online platforms.' : 'Saddle มือสองที่ต่ำกว่าราคาร้าน 20–35% เป็นการซื้อที่สมเหตุสมผลหาก Y2K aesthetic ยังคงอยู่ สำหรับผู้ซื้อกรุงเทพ ทั้งชิ้นต้นฉบับยุค Galliano และชิ้นฟื้นฟู 2018+ มีผู้ซื้อท้องถิ่นที่กระตือรือร้นที่จตุจักรและแพลตฟอร์มออนไลน์'}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/dior-saddle-bag-comeback-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/dior-saddle-bag-comeback-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Dior Pre-Owned →' : 'Dior มือสอง →'}</Link>
        <Link href={`/${locale}/trends/y2k-luxury-bags-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Y2K Luxury Bags →' : 'กระเป๋าหรู Y2K →'}</Link>
      </div>
    </div>
  )
}
