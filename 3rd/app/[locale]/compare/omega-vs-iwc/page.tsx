import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/omega-vs-iwc'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Omega vs IWC Thailand 2025: Which Swiss Watch? | ChicPreowned'
      : 'Omega vs IWC ไทย 2025: นาฬิกาสวิสอันไหน? | ChicPreowned',
    description: isEn
      ? 'Omega vs IWC for Bangkok buyers — Seamaster vs Pilot Watch, THB prices, resale value, investment case. Which Swiss watch to buy pre-owned in Thailand 2025?'
      : 'Omega vs IWC สำหรับผู้ซื้อกรุงเทพ Seamaster vs Pilot Watch ราคาบาท มูลค่าขายต่อ คุณค่าการลงทุน ควรซื้อนาฬิกาสวิสอันไหนมือสองในไทย 2025?',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function OmegaVsIWCTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { label: 'Founded', omega: 'La Chaux-de-Fonds, 1848.', iwc: 'Schaffhausen, 1868. The only major Swiss watchmaker in German-speaking Switzerland.' },
    { label: 'Group', omega: 'Swatch Group. ~700,000 watches/year.', iwc: 'Richemont Group. ~170,000 watches/year. More exclusive.' },
    { label: 'Signature collection', omega: 'Seamaster (dive), Speedmaster (space/Moon), Constellation (dress)', iwc: 'Pilot\'s Watch, Portofino (dress), Aquatimer (dive), Ingenieur' },
    { label: 'Entry price (pre-owned)', omega: `Seamaster 300M: $2,800–$4,500 (${formatPriceTHB(2800)}–${formatPriceTHB(4500)})`, iwc: `Pilot's Mark XX: $2,200–$3,500 (${formatPriceTHB(2200)}–${formatPriceTHB(3500)})` },
    { label: 'Resale value', omega: 'Seamaster: 60–80% of retail. Speedmaster (limited): 80–120%+.', iwc: 'Pilot\'s Chrono: 55–70% of retail. Portofino: 45–60%.' },
    { label: 'Investment case', omega: 'Stronger. Moonwatch is a genuine collector icon. Seamaster very liquid.', iwc: 'Moderate. Lacks iconic collector anchors of Omega. More fashion than investment.' },
    { label: 'Bangkok context', omega: `Omega boutiques at Central Chidlom, Siam Paragon. Very liquid on Carousell Thailand. ${formatPriceTHB(2800)}+ entry for pre-owned.`, iwc: `IWC at Gaysorn. Less common in Bangkok secondary market. ${formatPriceTHB(2200)}+ pre-owned entry.` },
  ] : [
    { label: 'ก่อตั้ง', omega: 'La Chaux-de-Fonds 1848', iwc: 'Schaffhausen 1868 ผู้ผลิตนาฬิกาสวิสรายใหญ่เพียงรายเดียวในสวิตเซอร์แลนด์ที่พูดภาษาเยอรมัน' },
    { label: 'กลุ่ม', omega: 'Swatch Group ~700,000 เรือนต่อปี', iwc: 'Richemont Group ~170,000 เรือนต่อปี เฉพาะเจาะจงกว่า' },
    { label: 'คอลเลคชันหลัก', omega: 'Seamaster (ดำน้ำ), Speedmaster (อวกาศ/ดวงจันทร์), Constellation (ทางการ)', iwc: 'Pilot\'s Watch, Portofino (ทางการ), Aquatimer (ดำน้ำ), Ingenieur' },
    { label: 'ราคาเริ่มต้น (มือสอง)', omega: `Seamaster 300M: $2,800–$4,500 (${formatPriceTHB(2800)}–${formatPriceTHB(4500)})`, iwc: `Pilot's Mark XX: $2,200–$3,500 (${formatPriceTHB(2200)}–${formatPriceTHB(3500)})` },
    { label: 'มูลค่าขายต่อ', omega: 'Seamaster: 60–80% ราคาร้าน Speedmaster (limited): 80–120%+', iwc: 'Pilot\'s Chrono: 55–70% ราคาร้าน Portofino: 45–60%' },
    { label: 'คุณค่าการลงทุน', omega: 'แข็งแกร่งกว่า Moonwatch เป็น icon ของนักสะสมที่แท้จริง Seamaster เป็น liquid มาก', iwc: 'ปานกลาง ขาด anchor ของนักสะสม iconic ของ Omega แฟชั่นมากกว่าการลงทุน' },
    { label: 'บริบทกรุงเทพ', omega: `บูทีค Omega ที่ Central Chidlom, Siam Paragon มาก liquid บน Carousell Thailand เริ่มต้น ${formatPriceTHB(2800)}+ มือสอง`, iwc: `IWC ที่ Gaysorn ตลาดรองกรุงเทพน้อยกว่า เริ่มต้น ${formatPriceTHB(2200)}+ มือสอง` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Omega vs IWC</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Omega vs IWC 2025' : 'Omega vs IWC 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two Swiss watch icons with very different identities. Omega is Bond\'s watch and the Moon watch — mass-prestige with genuine collector anchors. IWC is the pilot\'s watch from German-speaking Switzerland — less omnipresent, more of an insider\'s choice. Investment case tilts heavily toward Omega.'
          : 'สองไอคอนนาฬิกาสวิสที่มีเอกลักษณ์แตกต่างกันมาก Omega คือนาฬิกาของ Bond และ Moon watch — prestige ขนาดใหญ่ที่มี anchor ของนักสะสมที่แท้จริง IWC คือนาฬิกานักบินจากสวิตเซอร์แลนด์ที่พูดภาษาเยอรมัน ไม่แพร่หลายมากนัก เป็นทางเลือกของผู้รู้จัก คุณค่าการลงทุนเอียงไปทาง Omega อย่างมาก'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-32 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Omega</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">IWC</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.omega}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.iwc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/omega-vs-iwc" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/omega-vs-iwc" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Omega Pre-Owned →' : 'Omega มือสอง →'}</Link>
        <Link href={`/${locale}/compare/omega-vs-tag-heuer`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs Tag Heuer →</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
