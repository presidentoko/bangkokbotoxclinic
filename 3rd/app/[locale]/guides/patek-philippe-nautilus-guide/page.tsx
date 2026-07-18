import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/patek-philippe-nautilus-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Patek Philippe Nautilus Buying Guide Thailand 2025 | ChicPreowned'
      : 'คู่มือซื้อ Patek Philippe Nautilus ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Nautilus buying guide for Thai buyers — 5711, 5712, 5726. THB prices, market trends, authentication. Pre-owned Patek in Thailand 2025.'
      : 'คู่มือซื้อ Nautilus สำหรับผู้ซื้อชาวไทย — 5711 5712 5726 ราคาบาท แนวโน้มตลาด การตรวจสอบ Patek มือสองในไทย 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function NautilusTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const models = isEn ? [
    { ref: '5711/1A-010', name: 'Nautilus 5711 Steel Blue Dial', thb: `${formatPriceTHB(120000)}–${formatPriceTHB(200000)}`, note: 'Discontinued 2021. The pre-owned grail. 3–5× original retail. Most liquid watch in all of secondary market Thailand.' },
    { ref: '5712/1A-001', name: 'Nautilus 5712 Moon Phase', thb: `${formatPriceTHB(65000)}–${formatPriceTHB(100000)}`, note: 'Best active Nautilus buy. Power reserve + moon phase. 1.5–2× retail. Better value than 5711 equivalent right now.' },
    { ref: '5726A-001', name: 'Nautilus 5726 Annual Calendar', thb: `${formatPriceTHB(80000)}–${formatPriceTHB(130000)}`, note: 'Most practical Nautilus complication. Annual calendar adjusts once per year. Strong collector demand.' },
  ] : [
    { ref: '5711/1A-010', name: 'Nautilus 5711 สายสีฟ้า', thb: `${formatPriceTHB(120000)}–${formatPriceTHB(200000)}`, note: 'ยุติการผลิตปี 2021 Grail มือสอง 3–5× ราคาร้านดั้งเดิม นาฬิกาที่มีสภาพคล่องสูงสุดในตลาดรองของไทย' },
    { ref: '5712/1A-001', name: 'Nautilus 5712 Moon Phase', thb: `${formatPriceTHB(65000)}–${formatPriceTHB(100000)}`, note: 'Nautilus ที่ยังผลิตอยู่ที่ดีที่สุดที่จะซื้อ Power reserve + moon phase 1.5–2× ราคาร้าน คุ้มค่ากว่า 5711 ตอนนี้' },
    { ref: '5726A-001', name: 'Nautilus 5726 Annual Calendar', thb: `${formatPriceTHB(80000)}–${formatPriceTHB(130000)}`, note: 'ฟังก์ชันที่ใช้งานได้จริงที่สุดของ Nautilus ปฏิทินประจำปีปรับปีละครั้ง ความต้องการจากนักสะสมแข็งแกร่ง' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Patek Nautilus Guide' : 'คู่มือ Patek Nautilus'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Patek Philippe Nautilus Buying Guide 2025' : 'คู่มือซื้อ Patek Philippe Nautilus 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The Nautilus 5711 was discontinued in 2021. Today all Nautilus pieces come from the pre-owned market. Thai buyers: the 5712 is the best value active model. THB prices below.'
          : 'Nautilus 5711 ยุติการผลิตปี 2021 วันนี้ชิ้น Nautilus ทั้งหมดมาจากตลาดมือสอง สำหรับผู้ซื้อชาวไทย 5712 คือรุ่นที่คุ้มค่าที่สุดที่ยังผลิตอยู่ ราคาบาทด้านล่าง'}
      </p>

      <div className="space-y-4 mb-10">
        {models.map((m, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div>
                <span className="text-xs font-mono text-gray-400 block mb-1">Ref. {m.ref}</span>
                <h2 className="font-bold text-gray-900">{m.name}</h2>
              </div>
              <span className="font-semibold text-amber-700 shrink-0">{m.thb}</span>
            </div>
            <p className="text-sm text-gray-600">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/patek-philippe-nautilus-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/patek-philippe-nautilus-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/trends/quiet-luxury-watch-brands-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Watch Brands →' : 'แบรนด์นาฬิกา →'}</Link>
        <Link href={`/${locale}/compare/rolex-vs-patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek →</Link>
      </div>
    </div>
  )
}
