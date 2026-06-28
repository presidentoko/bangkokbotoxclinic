import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/chanel-vs-celine'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel vs Celine Pre-Owned Thailand 2025 | ChicPreowned'
      : 'Chanel vs Celine มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Chanel vs Celine for Thai buyers — Classic Flap vs Luggage, THB prices, investment case, which French house to buy pre-owned in Bangkok 2025.'
      : 'เปรียบ Chanel กับ Celine สำหรับผู้ซื้อชาวไทย — Classic Flap vs Luggage ราคาบาท กรณีลงทุน อันไหนควรซื้อมือสองในกรุงเทพ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function ChanelVsCelineTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Design identity', chanel: 'Logo-first — CC clasp, chain, quilted leather unmistakable', celine: 'Logo-minimal — Triomphe canvas or clean leather, quiet recognition' },
    { metric: 'Icon bag', chanel: `Classic Flap Small (${formatPriceTHB(4500)}–${formatPriceTHB(7500)})`, celine: `Luggage Nano (${formatPriceTHB(900)}–${formatPriceTHB(1500)}), Triomphe Tote (${formatPriceTHB(600)}–${formatPriceTHB(1000)})` },
    { metric: 'Entry price', chanel: `${formatPriceTHB(2200)}+ (Mini Flap)`, celine: `${formatPriceTHB(500)}+ (Triomphe canvas tote)` },
    { metric: 'Resale vs retail', chanel: '70–110%+ (Classic/Boy icons)', celine: '45–65% (current era); higher for Phoebe Philo pieces' },
    { metric: 'Investment case', chanel: 'Best in class — price increases guarantee appreciation', celine: 'Weak (Hedi Slimane era). Phoebe Philo pieces (pre-2018) gaining fast.' },
    { metric: 'Thailand recognition', chanel: 'Maximum — Chanel CC is the most recognized bag clasp in Thailand', celine: 'Growing with "quiet luxury" trend — Luggage well-known to fashion buyers' },
    { metric: 'Best for', chanel: 'Investment, maximum resale flexibility, status statement', celine: 'Parisian minimalism, design credibility at much lower entry price' },
  ] : [
    { metric: 'เอกลักษณ์การออกแบบ', chanel: 'โลโก้-first — CC clasp โซ่ หนังเย็บตาราง ไม่มีทางเข้าใจผิด', celine: 'โลโก้น้อยที่สุด — Triomphe canvas หรือหนังสะอาด การรับรู้เงียบ' },
    { metric: 'กระเป๋าสัญลักษณ์', chanel: `Classic Flap Small (${formatPriceTHB(4500)}–${formatPriceTHB(7500)})`, celine: `Luggage Nano (${formatPriceTHB(900)}–${formatPriceTHB(1500)}) Triomphe Tote (${formatPriceTHB(600)}–${formatPriceTHB(1000)})` },
    { metric: 'ราคาเริ่มต้น', chanel: `${formatPriceTHB(2200)}+ (Mini Flap)`, celine: `${formatPriceTHB(500)}+ (Triomphe canvas tote)` },
    { metric: 'ขายต่อ vs ราคาร้าน', chanel: '70–110%+ (Classic/Boy icons)', celine: '45–65% (ยุคปัจจุบัน) สูงกว่าสำหรับชิ้น Phoebe Philo' },
    { metric: 'กรณีลงทุน', chanel: 'ดีที่สุดในประเภท — การขึ้นราคาการันตีการเพิ่มมูลค่า', celine: 'อ่อน (ยุค Hedi Slimane) ชิ้น Phoebe Philo (ก่อน 2018) กำลังได้รับความนิยม' },
    { metric: 'การรับรู้ในไทย', chanel: 'สูงสุด — Chanel CC คือหัวกระเป๋าที่เป็นที่รู้จักมากที่สุดในไทย', celine: 'กำลังเติบโตกับเทรนด์ "quiet luxury" Luggage เป็นที่รู้จักในหมู่ผู้ซื้อแฟชั่น' },
    { metric: 'ดีที่สุดสำหรับ', chanel: 'การลงทุน สภาพคล่องมือสองสูงสุด การแสดงถึงสถานะ', celine: 'ความ minimalism แบบปารีส ความน่าเชื่อถือด้านการออกแบบในราคาเริ่มต้นต่ำกว่ามาก' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Chanel vs Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel vs Celine Pre-Owned' : 'Chanel vs Celine มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both French luxury houses — completely opposite design philosophies. Chanel is maximum logo. Celine is maximum understatement. For Thai buyers: Chanel wins on investment and resale; Celine wins on design credibility and entry price.'
          : 'ทั้งสองเมซองหรูฝรั่งเศส ปรัชญาการออกแบบตรงกันข้ามโดยสิ้นเชิง Chanel โลโก้สูงสุด Celine ความเรียบง่ายสูงสุด สำหรับผู้ซื้อชาวไทย Chanel ชนะด้านการลงทุนและมือสอง Celine ชนะด้านความน่าเชื่อถือด้านการออกแบบและราคาเริ่มต้น'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Chanel</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Celine</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.chanel}</td>
                <td className="py-3 px-4 text-gray-700">{r.celine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/chanel-vs-celine" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/chanel-vs-celine" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Pre-Owned →' : 'Chanel มือสอง →'}</Link>
        <Link href={`/${locale}/brands/celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Celine Pre-Owned →' : 'Celine มือสอง →'}</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL vs Celine →</Link>
      </div>
    </div>
  )
}
