import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/hermes-birkin-waitlist-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Hermès Birkin Waitlist Thailand 2025 | ChicPreowned'
      : 'รายชื่อรอ Hermès Birkin ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Hermès Birkin waitlist Thailand 2025 — how long the Bangkok wait is, pre-owned Birkin prices in THB, why Thai buyers choose pre-owned.'
      : 'รายชื่อรอ Hermès Birkin ในไทย 2025 — รอนานแค่ไหนในกรุงเทพ ราคา Birkin มือสองเป็นบาท ทำไมผู้ซื้อชาวไทยเลือกมือสอง',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function HermesBirkinWaitlistTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const waitRows = isEn ? [
    { profile: 'First-time buyer, no history', wait: '5–10 years (if ever)' },
    { profile: 'Active buyer, ฿180k–฿360k/year at boutique', wait: '2–4 years at same store' },
    { profile: 'VIP, ฿720k+/year at Paragon or ICONSIAM', wait: '1–2 years, black/gold first' },
    { profile: 'Private client / top-tier Thailand', wait: '6–12 months — limited colors' },
  ] : [
    { profile: 'ผู้ซื้อครั้งแรก ไม่มีประวัติ', wait: '5–10 ปี (ถ้าจะได้เลย)' },
    { profile: 'ผู้ซื้อประจำ ฿180k–฿360k/ปี ที่บูติก', wait: '2–4 ปีที่ร้านเดิม' },
    { profile: 'VIP ฿720k+/ปีที่พารากอนหรือ ICONSIAM', wait: '1–2 ปี ได้สีดำ/ทองก่อน' },
    { profile: 'ลูกค้าส่วนตัว/ระดับสูงสุดในไทย', wait: '6–12 เดือน — สีจำกัด' },
  ]

  const birkinPrices = [
    { item: isEn ? 'Birkin 25, Togo, Black, GHW' : 'Birkin 25 Togo ดำ GHW', thb: `${formatPriceTHB(15000)}–${formatPriceTHB(22000)}` },
    { item: isEn ? 'Birkin 25, Togo, Black, PHW' : 'Birkin 25 Togo ดำ PHW', thb: `${formatPriceTHB(16000)}–${formatPriceTHB(24000)}` },
    { item: isEn ? 'Birkin 30, Togo, Black, GHW' : 'Birkin 30 Togo ดำ GHW', thb: `${formatPriceTHB(13000)}–${formatPriceTHB(19000)}` },
    { item: isEn ? 'Birkin 35, Togo, Black, GHW' : 'Birkin 35 Togo ดำ GHW', thb: `${formatPriceTHB(11000)}–${formatPriceTHB(17000)}` },
    { item: isEn ? 'Birkin 25, Exotic (croc/ostrich)' : 'Birkin 25 Exotic (จระเข้/นกกระจอกเทศ)', thb: `${formatPriceTHB(25000)}–${formatPriceTHB(80000)}+` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Hermès Birkin Waitlist 2025' : 'รายชื่อรอ Hermès Birkin 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Hermès Birkin Waitlist 2025: The Truth' : 'รายชื่อรอ Hermès Birkin 2025: ความจริง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Hermès does not have an official waitlist — it runs on purchase history. Understanding how the allocation system works in Bangkok boutiques (Paragon and ICONSIAM) and why most Thai buyers choose pre-owned instead.'
          : 'Hermès ไม่มีรายชื่อรอแบบเป็นทางการ แต่ทำงานบนประวัติการซื้อ ทำความเข้าใจว่าระบบการจัดสรรทำงานอย่างไรในบูติกกรุงเทพ (พารากอนและ ICONSIAM) และทำไมผู้ซื้อชาวไทยส่วนใหญ่จึงเลือกมือสองแทน'}
      </p>

      <div className="space-y-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-3">
            {isEn ? 'How long does the wait take?' : 'ต้องรอนานแค่ไหน?'}
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500">{isEn ? 'Profile' : 'ประเภทลูกค้า'}</th>
                <th className="text-left py-2 px-3 text-gray-500">{isEn ? 'Wait time' : 'ระยะเวลารอ'}</th>
              </tr>
            </thead>
            <tbody>
              {waitRows.map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 px-3 text-gray-700">{r.profile}</td>
                  <td className="py-2 px-3 text-gray-700 font-medium">{r.wait}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-amber-100 bg-amber-50 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">
            {isEn ? 'Why pre-owned is the smarter choice for Thailand' : 'ทำไมมือสองจึงเป็นตัวเลือกที่ดีกว่าสำหรับไทย'}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            {isEn
              ? 'A pre-owned Birkin 25 in Togo sells for ฿540,000–฿792,000 — at or above retail. But you get it today, not in 5 years. The premium over retail is smaller than the cost of spending ฿540k–฿1.08M at boutique to earn allocation eligibility.'
              : 'Birkin 25 Togo มือสองขายที่ ฿540,000–฿792,000 ที่หรือสูงกว่าราคาร้าน แต่คุณได้วันนี้ ไม่ใช่ใน 5 ปี premium เหนือราคาร้านน้อยกว่าค่าใช้จ่าย ฿540k–฿1.08M ที่บูติกเพื่อให้มีสิทธิ์ได้รับการจัดสรร'}
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-3">
            {isEn ? 'Pre-owned Birkin prices in Thailand 2025' : 'ราคา Birkin มือสองในไทย 2025'}
          </h2>
          <div className="space-y-2">
            {birkinPrices.map((r, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{r.item}</span>
                <span className="font-semibold text-amber-700">{r.thb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/hermes-birkin-waitlist-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/hermes-birkin-waitlist-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Hermès Pre-Owned →' : 'Hermès มือสอง →'}</Link>
        <Link href={`/${locale}/guides/hermes-birkin-vs-kelly`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Birkin vs Kelly →</Link>
      </div>
    </div>
  )
}
