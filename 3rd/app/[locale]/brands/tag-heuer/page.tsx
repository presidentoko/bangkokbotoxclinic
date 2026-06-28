import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/tag-heuer'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Tag Heuer Pre-Owned Thailand 2025: Carrera, Monaco | ChicPreowned'
      : 'Tag Heuer มือสองในไทย 2025: Carrera Monaco | ChicPreowned',
    description: isEn
      ? 'Tag Heuer pre-owned watches Thailand — Carrera, Aquaracer, Monaco. THB prices, which model to buy used in Bangkok 2025.'
      : 'Tag Heuer มือสองในไทย — Carrera Aquaracer Monaco ราคาบาท รุ่นไหนควรซื้อมือสองในกรุงเทพ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function TagHeuerTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const watches = isEn ? [
    { name: 'Carrera Calibre 5 (39mm, Steel)', thb: `${formatPriceTHB(800)}–${formatPriceTHB(1400)}`, retail: `~${formatPriceTHB(2100)}`, note: 'The sportsman Carrera. Clean dial, motorsport heritage from 1963. Entry Swiss chronograph. Strong everyday resale in Bangkok.' },
    { name: 'Aquaracer Professional 300 (43mm)', thb: `${formatPriceTHB(600)}–${formatPriceTHB(1200)}`, retail: `~${formatPriceTHB(1800)}`, note: '300m water resistance. Most popular entry dive watch pre-owned. Great buy for casual luxury in Thailand — durable, legible.' },
    { name: 'Monaco Calibre 11 (Blue)', thb: `${formatPriceTHB(2500)}–${formatPriceTHB(5000)}+`, retail: `~${formatPriceTHB(6100)}`, note: 'Steve McQueen Le Mans watch. Square case, blue dial. The only truly collectible Tag Heuer reference. Limited editions command a premium.' },
    { name: 'Formula 1 Quartz (41mm)', thb: `${formatPriceTHB(250)}–${formatPriceTHB(500)}`, retail: `~${formatPriceTHB(1000)}`, note: 'Best entry price for Swiss luxury watches. Quartz movement. Not an investment — but a genuine Tag Heuer at the most accessible price.' },
  ] : [
    { name: 'Carrera Calibre 5 (39mm สเตนเลส)', thb: `${formatPriceTHB(800)}–${formatPriceTHB(1400)}`, retail: `~${formatPriceTHB(2100)}`, note: 'Carrera สำหรับนักกีฬา หน้าปัดสะอาด มรดกมอเตอร์สปอร์ตตั้งแต่ปี 1963 โครโนกราฟสวิสระดับเริ่มต้น ขายต่อได้ดีในกรุงเทพ' },
    { name: 'Aquaracer Professional 300 (43mm)', thb: `${formatPriceTHB(600)}–${formatPriceTHB(1200)}`, retail: `~${formatPriceTHB(1800)}`, note: 'กันน้ำ 300 เมตร นาฬิกาดำน้ำเริ่มต้นยอดนิยมมือสอง ซื้อดีสำหรับความหรูรายวันในไทย — ทนทาน อ่านง่าย' },
    { name: 'Monaco Calibre 11 (สีน้ำเงิน)', thb: `${formatPriceTHB(2500)}–${formatPriceTHB(5000)}+`, retail: `~${formatPriceTHB(6100)}`, note: 'นาฬิกา Le Mans ของ Steve McQueen เคสสี่เหลี่ยม หน้าปัดน้ำเงิน รุ่น Tag Heuer ที่นักสะสมให้ความสนใจแท้จริงเพียงรุ่นเดียว Limited editions ราคาสูงขึ้น' },
    { name: 'Formula 1 Quartz (41mm)', thb: `${formatPriceTHB(250)}–${formatPriceTHB(500)}`, retail: `~${formatPriceTHB(1000)}`, note: 'ราคาเริ่มต้นดีที่สุดสำหรับนาฬิกาหรูสวิส กลไก quartz ไม่ใช่การลงทุน แต่เป็น Tag Heuer แท้ที่ราคาเข้าถึงได้สูงสุด' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Tag Heuer</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Tag Heuer Pre-Owned Watches' : 'Tag Heuer มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Tag Heuer is the entry to Swiss luxury sports watches. The Monaco is a genuine collectible — Steve McQueen\'s watch. The Carrera and Aquaracer are practical everyday buys at 30–65% of retail. Good starting point for a Thai watch collection.'
          : 'Tag Heuer คือจุดเริ่มต้นสู่นาฬิกาสปอร์ตหรูสวิส Monaco เป็นนาฬิกาสะสมแท้จริง นาฬิกา Steve McQueen Carrera และ Aquaracer เป็นการซื้อประจำวันที่ใช้งานได้จริง 30–65% ของราคาร้าน จุดเริ่มต้นที่ดีสำหรับคอลเลกชันนาฬิกาไทย'}
      </p>

      <div className="space-y-4 mb-10">
        {watches.map((w, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900">{w.name}</h2>
              <div className="text-right shrink-0">
                <div className="font-semibold text-amber-700">{w.thb}</div>
                <div className="text-xs text-gray-400">{isEn ? 'Retail' : 'ราคาร้าน'}: {w.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{w.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/tag-heuer" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/tag-heuer" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/omega-vs-tag-heuer`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs Tag Heuer →</Link>
        <Link href={`/${locale}/brands/omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Omega →' : 'Omega →'}</Link>
      </div>
    </div>
  )
}
