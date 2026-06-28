import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/resale-value-drops-to-avoid'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Luxury Bags That Drop in Value: What to Avoid in Thailand 2025 | ChicPreowned'
      : 'กระเป๋าแบรนด์ที่ราคาตก: อะไรที่ควรหลีกเลี่ยงในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Which luxury bags lose value fastest in Thailand? Avoid paying too much for trendy pieces with weak resale. Data on drops + what holds value instead.'
      : 'กระเป๋าแบรนด์ไหนราคาตกเร็วที่สุดในไทย? หลีกเลี่ยงการจ่ายแพงเกินไปสำหรับสินค้าเทรนด์ที่ขายต่อยาก',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function ResaleValueDropsTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const drops = isEn ? [
    { item: 'Gucci GG Marmont (top-handle)', drop: '60–70% from peak', note: 'Logo-heavy, fast trend cycle — avoid' },
    { item: 'Balenciaga City Bag', drop: '50–65%', note: 'Brand controversy + cycle. Basic styles more recoverable.' },
    { item: 'Prada Nylon Backpack', drop: '50–70% from revival', note: 'Nostalgia wave ended. Nylon resells badly vs leather.' },
    { item: 'Fendi Baguette (embellished)', drop: '40–55%', note: 'Trend-driven revival cooled. Classic leather holds better.' },
    { item: 'LV Pochette Métis (seasonal)', drop: '25–35%', note: 'Seasonal canvas depreciates; Monogram/DE holds better.' },
  ] : [
    { item: 'Gucci GG Marmont (top-handle)', drop: 'ลด 60–70% จากจุดสูงสุด', note: 'โลโก้หนัก วัฏจักรแฟชั่นเร็ว — หลีกเลี่ยง' },
    { item: 'Balenciaga City Bag', drop: 'ลด 50–65%', note: 'ข้อถกเถียงแบรนด์ + วัฏจักร รุ่น basic ฟื้นตัวได้บ้าง' },
    { item: 'Prada Nylon Backpack', drop: 'ลด 50–70% จากการฟื้นตัว', note: 'กระแสโนสตัลเจียสิ้นสุด ไนลอนขายต่อได้แย่กว่าหนัง' },
    { item: 'Fendi Baguette (ประดับ)', drop: 'ลด 40–55%', note: 'กระแสฟื้นตัวเย็นลง หนังคลาสสิกดีกว่า' },
    { item: 'LV Pochette Métis (seasonal)', drop: 'ลด 25–35%', note: 'ผ้า seasonal เสื่อมค่า; Monogram/DE ดีกว่า' },
  ]

  const holds = isEn ? [
    { item: 'Chanel Classic Flap (SM/M)', why: 'Prices rise annually, timeless, constant demand' },
    { item: 'LV Neverfull MM (Monogram)', why: 'Evergreen, huge secondary market, 70–90% retention' },
    { item: 'Hermès Birkin/Kelly (Togo, neutral)', why: 'Sells above retail — not possible to over-buy' },
    { item: 'Cartier Love / Juste un Clou', why: 'Jewelry doesn\'t date like bags' },
  ] : [
    { item: 'Chanel Classic Flap (SM/M)', why: 'ราคาขึ้นทุกปี timeless ความต้องการคงที่' },
    { item: 'LV Neverfull MM (Monogram)', why: 'Evergreen ตลาดมือสองใหญ่ รักษา 70–90%' },
    { item: 'Hermès Birkin/Kelly (Togo, กลาง)', why: 'ขายเกิน retail — ซื้อได้ไม่มีผิดพลาด' },
    { item: 'Cartier Love / Juste un Clou', why: 'เครื่องประดับไม่ล้าสมัยเหมือนกระเป๋า' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Value Drops' : 'ราคาตก'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Luxury Bags That Drop in Resale Value: Avoid These' : 'กระเป๋าแบรนด์ที่ราคาตก: หลีกเลี่ยงสิ่งเหล่านี้'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Not all luxury bags hold value. Logo-heavy trend pieces can lose 50–70% from peak. Here\'s what to avoid in the Thai market — and what holds instead.'
          : 'ไม่ใช่กระเป๋าแบรนด์ทุกใบที่รักษามูลค่า สินค้าเทรนด์ที่เน้นโลโก้อาจสูญเสีย 50–70% จากจุดสูงสุด นี่คือสิ่งที่ควรหลีกเลี่ยงในตลาดไทย และอะไรที่ดีกว่า'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEn ? 'Pieces That Have Dropped' : 'สินค้าที่ราคาตก'}</h2>
        <div className="space-y-3">
          {drops.map((d, i) => (
            <div key={i} className="border border-red-100 bg-red-50/30 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{d.item}</h3>
                  <p className="text-xs text-red-600 font-medium mt-1">{d.drop}</p>
                  <p className="text-sm text-gray-600 mt-1">{d.note}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded ml-4 shrink-0">{isEn ? 'Caution' : 'ระวัง'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEn ? 'What Holds Value Instead' : 'อะไรรักษามูลค่าได้ดีกว่า'}</h2>
        {holds.map((h, i) => (
          <div key={i} className="flex gap-3 text-sm py-2 border-b border-gray-100">
            <span className="text-green-600 font-bold">✓</span>
            <div>
              <span className="font-medium text-gray-900">{h.item}</span>
              <span className="text-gray-500 ml-2">— {h.why}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/resale-value-drops-to-avoid" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/resale-value-drops-to-avoid" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/trends/luxury-above-retail`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Above-Retail →' : 'เกิน Retail →'}</Link>
        <Link href={`/${locale}/guides/pre-owned-vs-new-luxury`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Pre-Owned vs New →' : 'มือสอง vs ใหม่ →'}</Link>
      </div>
    </div>
  )
}
