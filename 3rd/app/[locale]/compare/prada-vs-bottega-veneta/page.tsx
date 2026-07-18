import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/prada-vs-bottega-veneta'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Prada vs Bottega Veneta Thailand 2025: Galleria vs Cassette | ChicPreowned'
      : 'Prada vs Bottega Veneta ในไทย 2025: Galleria vs Cassette | ChicPreowned',
    description: isEn
      ? 'Prada vs Bottega Veneta for Thai buyers — Galleria vs Cassette, THB prices, quiet luxury comparison, which Italian house to buy pre-owned in Bangkok 2025.'
      : 'เปรียบ Prada กับ Bottega Veneta สำหรับผู้ซื้อชาวไทย — Galleria vs Cassette ราคาบาท เปรียบ quiet luxury อันไหนควรซื้อมือสองในกรุงเทพ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function PradaVsBVTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Design philosophy', prada: 'Intellectual minimalism with branding. Triangle logo plate on every bag. Nylon and Saffiano are house signatures.', bv: 'Zero visible branding. Intrecciato weave is the only identifier. Defined by texture, not logo.' },
    { metric: 'Icon bags', prada: `Galleria (${formatPriceTHB(1200)}–${formatPriceTHB(2200)}), Re-Edition 2000 (${formatPriceTHB(500)}–${formatPriceTHB(900)}), Cleo (${formatPriceTHB(1000)}–${formatPriceTHB(1800)})`, bv: `Cassette (${formatPriceTHB(1800)}–${formatPriceTHB(3200)}), Jodie (${formatPriceTHB(1200)}–${formatPriceTHB(2400)})` },
    { metric: 'Entry price', prada: `${formatPriceTHB(300)}+ (Re-Nylon small pieces)`, bv: `${formatPriceTHB(800)}+ (Jodie small)` },
    { metric: 'Resale vs retail', prada: '50–70% (Galleria). Re-Edition 2000 holds at 60–75%.', bv: '65–85% (Cassette, Jodie). Stronger resale than most peers.' },
    { metric: 'Investment case', prada: 'Consistent. Saffiano Galleria never goes out of style. Re-Edition mini captured Prada "girly" revival.', bv: 'Strong and growing. Matthieu Blazy era (2022+) has elevated BV into collector territory.' },
    { metric: 'Thailand market', prada: 'Strong. Galleria and Re-Edition are popular in Bangkok. Re-Nylon pieces are common finds.', bv: 'Growing quickly. Cassette and Jodie now increasingly seen in Bangkok boutique and resale context.' },
    { metric: 'Best for', prada: 'Lower entry into Italian luxury, Galleria long-term hold, Re-Edition collectible', bv: 'Investment in quiet luxury gaining recognition, zero-logo confidence, Cassette future-classic position' },
  ] : [
    { metric: 'ปรัชญาการออกแบบ', prada: 'ความ minimalism ทางปัญญาพร้อม branding แผ่นโลโก้รูปสามเหลี่ยมในทุกกระเป๋า Nylon และ Saffiano คือลายเซ็นของบ้าน', bv: 'ไม่มี branding ที่มองเห็นได้ Intrecciato weave คือตัวบ่งชี้เดียว กำหนดโดย texture ไม่ใช่โลโก้' },
    { metric: 'กระเป๋าสัญลักษณ์', prada: `Galleria (${formatPriceTHB(1200)}–${formatPriceTHB(2200)}) Re-Edition 2000 (${formatPriceTHB(500)}–${formatPriceTHB(900)}) Cleo (${formatPriceTHB(1000)}–${formatPriceTHB(1800)})`, bv: `Cassette (${formatPriceTHB(1800)}–${formatPriceTHB(3200)}) Jodie (${formatPriceTHB(1200)}–${formatPriceTHB(2400)})` },
    { metric: 'ราคาเริ่มต้น', prada: `${formatPriceTHB(300)}+ (Re-Nylon ชิ้นเล็ก)`, bv: `${formatPriceTHB(800)}+ (Jodie เล็ก)` },
    { metric: 'ขายต่อ vs ราคาร้าน', prada: '50–70% (Galleria) Re-Edition 2000 อยู่ที่ 60–75%', bv: '65–85% (Cassette, Jodie) ขายต่อแข็งแกร่งกว่าคู่แข่งส่วนใหญ่' },
    { metric: 'กรณีลงทุน', prada: 'สม่ำเสมอ Saffiano Galleria ไม่เคยล้าสมัย Re-Edition mini จับ revival "girly" ของ Prada', bv: 'แข็งแกร่งและเติบโต ยุค Matthieu Blazy (2022+) ยกระดับ BV เข้าสู่ดินแดน collector' },
    { metric: 'ตลาดไทย', prada: 'แข็งแกร่ง Galleria และ Re-Edition ได้รับความนิยมในกรุงเทพ Re-Nylon หาได้ทั่วไปในมือสอง', bv: 'กำลังเติบโตเร็ว Cassette และ Jodie ตอนนี้เห็นบ่อยขึ้นในร้านบูติกและตลาดมือสองกรุงเทพ' },
    { metric: 'ดีที่สุดสำหรับ', prada: 'ราคาเริ่มต้นต่ำกว่าเข้าสู่ luxury อิตาลี การถือ Galleria ระยะยาว Re-Edition ของสะสม', bv: 'การลงทุนใน quiet luxury ที่กำลังได้รับการยอมรับ ความมั่นใจแบบ zero-logo Cassette เป็น future-classic' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Prada vs Bottega Veneta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Prada vs Bottega Veneta Pre-Owned 2025' : 'Prada vs Bottega Veneta มือสอง 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both are Italian houses that champion restraint — but differently. Prada has the triangle logo and intellectual aesthetic. Bottega Veneta has the Intrecciato weave and zero branding. Prada goes lower on entry; BV holds stronger resale. Two of the best pre-owned value plays in Italian luxury for Thai buyers.'
          : 'ทั้งสองเป็นบ้านอิตาลีที่ยึดถือความเรียบง่าย แต่แตกต่างกัน Prada มีโลโก้รูปสามเหลี่ยมและสุนทรียศาสตร์ทางปัญญา Bottega Veneta มีลาย Intrecciato และ zero branding Prada ราคาเริ่มต้นต่ำกว่า BV ขายต่อแข็งแกร่งกว่า สองตัวเลือกมูลค่ามือสองที่ดีที่สุดใน luxury อิตาลีสำหรับผู้ซื้อชาวไทย'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Prada</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Bottega Veneta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.prada}</td>
                <td className="py-3 px-4 text-gray-700">{r.bv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/prada-vs-bottega-veneta" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/prada-vs-bottega-veneta" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/prada`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Prada Pre-Owned →' : 'Prada มือสอง →'}</Link>
        <Link href={`/${locale}/brands/bottega-veneta`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Bottega Veneta Pre-Owned →' : 'Bottega Veneta มือสอง →'}</Link>
        <Link href={`/${locale}/compare/gucci-vs-bottega-veneta`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci vs BV →</Link>
      </div>
    </div>
  )
}
