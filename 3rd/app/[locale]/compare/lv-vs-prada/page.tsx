import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/lv-vs-prada'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Louis Vuitton vs Prada Pre-Owned Thailand 2025 | ChicPreowned'
      : 'Louis Vuitton vs Prada มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'LV vs Prada for Thai buyers — Neverfull vs Galleria, THB resale prices, investment case, which to buy pre-owned in Bangkok 2025.'
      : 'เปรียบ LV กับ Prada สำหรับผู้ซื้อชาวไทย — Neverfull vs Galleria ราคาขายต่อบาท กรณีลงทุน อันไหนควรซื้อมือสองในกรุงเทพ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function LVVsPradaTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Icon bag', lv: `Neverfull MM (${formatPriceTHB(900)}–${formatPriceTHB(1400)}), Speedy 25 (${formatPriceTHB(500)}–${formatPriceTHB(900)})`, prada: `Galleria (${formatPriceTHB(1200)}–${formatPriceTHB(2200)}), Re-Edition 2000 (${formatPriceTHB(500)}–${formatPriceTHB(900)})` },
    { metric: 'Entry price', lv: `${formatPriceTHB(500)}+ (Speedy 25 canvas)`, prada: `${formatPriceTHB(500)}+ (Re-Edition 2000 nylon)` },
    { metric: 'Resale vs retail', lv: '65–80% (canvas icons), 50–70% (leather)', prada: '45–70% (standard); higher for limited editions' },
    { metric: 'Investment case', lv: 'Very strong — Neverfull and Speedy most liquid bags in Asia', prada: 'Moderate — Galleria holds well, Re-Edition above retail in some sizes' },
    { metric: 'Counterfeit risk', lv: 'Extreme — most counterfeited bag globally, very prevalent in Thailand', prada: 'Very high — Prada nylon and triangle widely copied in Bangkok markets' },
    { metric: 'Thailand presence', lv: 'Strongest — 3+ boutiques in Bangkok, resale market everywhere', prada: 'Strong — 2 boutiques in Bangkok, growing resale demand' },
    { metric: 'Best pre-owned buy', lv: `Neverfull MM Monogram: ${formatPriceTHB(900)}–${formatPriceTHB(1200)}`, prada: `Galleria medium saffiano: ${formatPriceTHB(1200)}–${formatPriceTHB(1600)}` },
  ] : [
    { metric: 'กระเป๋าสัญลักษณ์', lv: `Neverfull MM (${formatPriceTHB(900)}–${formatPriceTHB(1400)}) Speedy 25 (${formatPriceTHB(500)}–${formatPriceTHB(900)})`, prada: `Galleria (${formatPriceTHB(1200)}–${formatPriceTHB(2200)}) Re-Edition 2000 (${formatPriceTHB(500)}–${formatPriceTHB(900)})` },
    { metric: 'ราคาเริ่มต้น', lv: `${formatPriceTHB(500)}+ (Speedy 25 canvas)`, prada: `${formatPriceTHB(500)}+ (Re-Edition 2000 nylon)` },
    { metric: 'ขายต่อ vs ราคาร้าน', lv: '65–80% (canvas icons) 50–70% (หนัง)', prada: '45–70% (มาตรฐาน) สูงกว่าสำหรับ Limited Edition' },
    { metric: 'กรณีลงทุน', lv: 'แข็งแกร่งมาก — Neverfull และ Speedy เป็นกระเป๋าที่มีสภาพคล่องสูงสุดในเอเชีย', prada: 'ปานกลาง — Galleria คงค่าดี Re-Edition สูงกว่าราคาร้านในบางขนาด' },
    { metric: 'ความเสี่ยงของปลอม', lv: 'สูงมาก — ปลอมมากที่สุดในโลก แพร่หลายมากในไทย', prada: 'สูงมาก — Prada nylon และสามเหลี่ยม ถูกลอกเลียนแบบมากในตลาดกรุงเทพ' },
    { metric: 'สถานะในไทย', lv: 'แข็งแกร่งที่สุด — บูติกกรุงเทพ 3+ แห่ง ตลาดมือสองทุกที่', prada: 'แข็งแกร่ง — บูติกกรุงเทพ 2 แห่ง ความต้องการมือสองเพิ่มขึ้น' },
    { metric: 'ซื้อมือสองที่ดีที่สุด', lv: `Neverfull MM Monogram: ${formatPriceTHB(900)}–${formatPriceTHB(1200)}`, prada: `Galleria กลาง saffiano: ${formatPriceTHB(1200)}–${formatPriceTHB(1600)}` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>LV vs Prada</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Louis Vuitton vs Prada Pre-Owned' : 'Louis Vuitton vs Prada มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'LV and Prada are both top luxury purchases in Thailand. LV wins on resale liquidity — Neverfull and Speedy are the most liquid bags in Asia. Prada wins on fashion distinction — Saffiano leather and triangle logo have design credibility LV canvas cannot match.'
          : 'LV และ Prada ทั้งคู่เป็นการซื้อของหรูอันดับต้นๆ ในไทย LV ชนะด้านสภาพคล่องมือสอง Neverfull และ Speedy เป็นกระเป๋าที่มีสภาพคล่องสูงสุดในเอเชีย Prada ชนะด้านความโดดเด่นทางแฟชั่น Saffiano และสามเหลี่ยมมีความน่าเชื่อถือด้านการออกแบบที่ canvas LV ทำไม่ได้'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Louis Vuitton</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Prada</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.lv}</td>
                <td className="py-3 px-4 text-gray-700">{r.prada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/lv-vs-prada" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/lv-vs-prada" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'LV Pre-Owned →' : 'LV มือสอง →'}</Link>
        <Link href={`/${locale}/brands/prada`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Prada Pre-Owned →' : 'Prada มือสอง →'}</Link>
        <Link href={`/${locale}/compare/prada-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Gucci →</Link>
      </div>
    </div>
  )
}
