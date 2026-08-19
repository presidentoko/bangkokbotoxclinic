import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/omega-seamaster-buying-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Omega Seamaster Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `คู่มือซื้อ Omega Seamaster ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Omega Seamaster pre-owned guide for Thai buyers — 300M, Planet Ocean, Aqua Terra. THB prices, which model holds value, authentication basics.'
      : 'คู่มือ Omega Seamaster มือสองสำหรับผู้ซื้อชาวไทย — 300M Planet Ocean Aqua Terra ราคาบาท รุ่นไหนคงมูลค่า พื้นฐานการตรวจสอบ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function OmegaSeamasterTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const models = isEn ? [
    { name: 'Seamaster 300M (42mm, Blue Dial)', thb: `${formatPriceTHB(2800)}–${formatPriceTHB(4200)}`, retail: `~${formatPriceTHB(6500)}`, note: 'The James Bond Seamaster. Blue wave dial, helium escape valve, ceramic bezel (post-2018). Most recognized Omega model in Thailand. Strong pre-owned demand.' },
    { name: 'Seamaster Planet Ocean 600M (43.5mm)', thb: `${formatPriceTHB(3500)}–${formatPriceTHB(5500)}`, retail: `~${formatPriceTHB(9000)}`, note: 'The deeper-dive Seamaster. Co-Axial escapement, Master Chronometer. Larger case appeals to buyers who find 300M too subtle. Better water resistance.' },
    { name: 'Seamaster Aqua Terra (41mm, Green)', thb: `${formatPriceTHB(2500)}–${formatPriceTHB(4000)}`, retail: `~${formatPriceTHB(7200)}`, note: 'The dressy Seamaster. Teak-pattern dial, no crown guards. Golf-edition green dial (Daniel Craig era) is particularly liquid. Office-appropriate size.' },
    { name: 'Seamaster 300 Heritage (41mm)', thb: `${formatPriceTHB(3000)}–${formatPriceTHB(4800)}`, retail: `~${formatPriceTHB(8500)}`, note: 'The 1957 reissue. Broad arrow hands, vintage lume. Appreciated collectors model — less common than 300M so slightly harder to resell, but gaining value.' },
  ] : [
    { name: 'Seamaster 300M (42mm หน้าปัดน้ำเงิน)', thb: `${formatPriceTHB(2800)}–${formatPriceTHB(4200)}`, retail: `~${formatPriceTHB(6500)}`, note: 'Seamaster ของ James Bond หน้าปัดลูกคลื่นสีน้ำเงิน helium escape valve ขอบเซรามิก (หลังปี 2018) Omega ที่เป็นที่รู้จักมากที่สุดในไทย ความต้องการมือสองแข็งแกร่ง' },
    { name: 'Seamaster Planet Ocean 600M (43.5mm)', thb: `${formatPriceTHB(3500)}–${formatPriceTHB(5500)}`, retail: `~${formatPriceTHB(9000)}`, note: 'Seamaster ดำน้ำลึกกว่า กลไก Co-Axial escapement Master Chronometer เคสใหญ่กว่าดึงดูดผู้ซื้อที่รู้สึกว่า 300M เบาเกินไป ทนน้ำได้ดีกว่า' },
    { name: 'Seamaster Aqua Terra (41mm สีเขียว)', thb: `${formatPriceTHB(2500)}–${formatPriceTHB(4000)}`, retail: `~${formatPriceTHB(7200)}`, note: 'Seamaster แบบชุดเครื่องแต่งกาย ลาย teak pattern หน้าปัดไม่มี crown guards รุ่นหน้าปัดเขียว Golf edition (ยุค Daniel Craig) มีสภาพคล่องสูงเป็นพิเศษ ขนาดเหมาะออฟฟิศ' },
    { name: 'Seamaster 300 Heritage (41mm)', thb: `${formatPriceTHB(3000)}–${formatPriceTHB(4800)}`, retail: `~${formatPriceTHB(8500)}`, note: 'รุ่นออกใหม่ปี 1957 เข็ม broad arrow lume วินเทจ รุ่นนักสะสมที่ได้รับความนิยม — พบน้อยกว่า 300M ขายต่อยากกว่าเล็กน้อย แต่มูลค่ากำลังเพิ่ม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Omega Seamaster Guide' : 'คู่มือ Omega Seamaster'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Omega Seamaster Buying Guide ${PRICE_YEAR}` : `คู่มือซื้อ Omega Seamaster ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Omega Seamaster is the most accessible entry point for serious pre-owned watches. The 300M is James Bond\'s watch and the most recognized Omega in Thailand. THB prices below for pre-owned 2025 market.'
          : 'Omega Seamaster คือจุดเริ่มต้นที่เข้าถึงได้มากที่สุดสำหรับนาฬิกามือสองจริงจัง 300M คือนาฬิกาของ James Bond และ Omega ที่เป็นที่รู้จักมากที่สุดในไทย ราคาบาทด้านล่างสำหรับตลาดมือสอง 2025'}
      </p>

      <div className="space-y-4 mb-10">
        {models.map((m, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900">{m.name}</h2>
              <div className="text-right shrink-0">
                <div className="font-semibold text-amber-700">{m.thb}</div>
                <div className="text-xs text-gray-400">{isEn ? 'Retail' : 'ราคาร้าน'}: {m.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/omega-seamaster-buying-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/omega-seamaster-buying-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Omega Pre-Owned →' : 'Omega มือสอง →'}</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href={`/${locale}/guides/patek-philippe-nautilus-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Patek Nautilus Guide →' : 'คู่มือ Patek Nautilus →'}</Link>
      </div>
    </div>
  )
}
