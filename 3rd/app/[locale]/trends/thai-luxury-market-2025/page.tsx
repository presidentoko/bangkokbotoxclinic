import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/thai-luxury-market-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Thai Luxury Resale Market 2025 Report | ChicPreowned' : 'รายงานตลาด Luxury มือสองไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Thailand luxury resale market 2025 — what\'s hot, what\'s cooling, and where the best pre-owned deals are in Bangkok right now.'
      : 'ตลาด luxury มือสองไทย 2025 — อะไรกำลังร้อนแรง อะไรที่กำลังเย็นตัว และดีลมือสองที่ดีที่สุดในกรุงเทพตอนนี้',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function ThaiLuxuryMarket2025({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Thai Luxury Market 2025' : 'ตลาด Luxury ไทย 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Thai Luxury Resale Market 2025 Report' : 'รายงานตลาด Luxury มือสองไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'What\'s trending, what\'s cooling, and where the best deals are in Thailand right now.'
          : 'อะไรกำลังเป็นที่นิยม อะไรที่กำลังลดลง และดีลที่ดีที่สุดในไทยตอนนี้คืออะไร'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Hot Categories in Thailand 2025' : 'หมวดหมู่ที่ฮอตในไทย 2025'}
        </h2>
        <div className="space-y-4">
          {(isEn ? [
            { status: 'Very Hot', color: 'bg-red-100 text-red-800', name: 'Rolex Sports (Submariner, GMT, Daytona)', detail: 'Thai grey market remains one of Asia\'s most active. Sports Rolex trade 120–180% of retail — buyers prefer pre-owned to avoid grey market markup.', thbRange: '฿445k–2.5M' },
            { status: 'Hot', color: 'bg-amber-100 text-amber-800', name: 'Chanel Classic Flap (all sizes)', detail: 'Post-hike retail at ฿180–385k makes pre-owned at ฿95–280k the rational choice. Thai collectors dominate the Carousell.th market for Chanel.', thbRange: '฿95k–280k' },
            { status: 'Rising', color: 'bg-blue-100 text-blue-800', name: 'Hermès Evelyne & Picotin', detail: 'Thai buyers seeking Hermès entry points — Birkin is aspirational but these non-waitlisted pieces are booming in the ฿55–120k range.', thbRange: '฿55k–120k' },
            { status: 'Trending', color: 'bg-purple-100 text-purple-800', name: 'Loewe Puzzle (Jonathan Anderson era)', detail: 'Growing Thai fashion sophistication driving Loewe demand. Puzzle Small at ฿78–110k is the sweet spot.', thbRange: '฿78k–110k' },
          ] : [
            { status: 'ฮอตมาก', color: 'bg-red-100 text-red-800', name: 'Rolex สายกีฬา (Submariner, GMT, Daytona)', detail: 'ตลาดเทาของไทยยังคงเป็นหนึ่งในตลาดที่คึกคักที่สุดในเอเชีย สายกีฬา Rolex ซื้อขายที่ 120–180% ของราคาปลีก — ผู้ซื้อนิยมมือสองเพื่อหลีกเลี่ยงราคาตลาดเทา', thbRange: '445,000–2,500,000 บาท' },
            { status: 'ฮอต', color: 'bg-amber-100 text-amber-800', name: 'Chanel Classic Flap (ทุกขนาด)', detail: 'ราคาปลีกหลังขึ้นราคาที่ 180,000–385,000 บาท ทำให้มือสองที่ 95,000–280,000 บาท เป็นตัวเลือกที่สมเหตุสมผล นักสะสมไทยครองตลาด Carousell.th สำหรับ Chanel', thbRange: '95,000–280,000 บาท' },
            { status: 'กำลังขึ้น', color: 'bg-blue-100 text-blue-800', name: 'Hermès Evelyne & Picotin', detail: 'ผู้ซื้อไทยที่ต้องการเริ่มต้นกับ Hermès — Birkin เป็นความฝัน แต่ชิ้นที่ไม่ต้องรอคิวเหล่านี้กำลังบูมในช่วง 55,000–120,000 บาท', thbRange: '55,000–120,000 บาท' },
            { status: 'กำลังมาแรง', color: 'bg-purple-100 text-purple-800', name: 'Loewe Puzzle (ยุค Jonathan Anderson)', detail: 'ความซับซ้อนด้านแฟชั่นของไทยที่เพิ่มขึ้นทำให้ความต้องการ Loewe เติบโต Puzzle Small ที่ 78,000–110,000 บาท เป็นจุดที่พอดี', thbRange: '78,000–110,000 บาท' },
          ]).map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.color}`}>{item.status}</span>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 ml-2 shrink-0">{item.thbRange}</span>
              </div>
              <p className="text-sm text-gray-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'What\'s Cooling in Thailand' : 'สิ่งที่กำลังซาในไทย'}
        </h2>
        <ul className="text-sm text-gray-600 space-y-2">
          {isEn ? <>
            <li><strong>Gucci GG Marmont (canvas):</strong> Thai market saturated — trades 40–50% of retail, slow to sell</li>
            <li><strong>MCM backpacks:</strong> Peaked 2018–2021, now 30–45% of retail</li>
            <li><strong>Coach leather bags (post-2015):</strong> 35–45% of retail unless rare vintage pieces</li>
          </> : <>
            <li><strong>Gucci GG Marmont (ผ้าใบ):</strong> ตลาดไทยอิ่มตัว — ซื้อขายที่ 40–50% ของราคาปลีก ขายช้า</li>
            <li><strong>กระเป๋าเป้ MCM:</strong> พีคช่วง 2018–2021 ปัจจุบัน 30–45% ของราคาปลีก</li>
            <li><strong>Coach หนัง (หลังปี 2015):</strong> 35–45% ของราคาปลีก ยกเว้นชิ้นวินเทจหายาก</li>
          </>}
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/thai-luxury-market-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/thai-luxury-market-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/market-overview`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Market Overview →' : 'ภาพรวมตลาด →'}
        </Link>
        <Link href={`/${locale}/value-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Value Guide →' : 'คู่มือมูลค่า →'}
        </Link>
      </div>
    </div>
  )
}
