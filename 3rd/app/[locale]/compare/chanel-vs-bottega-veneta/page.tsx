import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/chanel-vs-bottega-veneta'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Chanel vs Bottega Veneta: Pre-Owned Thailand 2025 | ChicPreowned' : 'Chanel vs Bottega Veneta: มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Chanel Classic Flap vs Bottega Veneta Jodie — which holds value better in Thailand? THB prices and Thai market insights.'
      : 'Chanel Classic Flap vs Bottega Veneta Jodie — อันไหนรักษามูลค่าดีกว่าในไทย? ราคาบาทและข้อมูลตลาดไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function ChanelVsBVTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { a: 'Aesthetic', chanel: 'Quilted, chain, iconic logo', bv: 'No logo — intrecciato weave only' },
    { a: 'Entry (THB)', chanel: '฿44,000 (mini items)', bv: '฿20,000 (mini Jodie)' },
    { a: 'Mid-range (THB)', chanel: '฿129,000–295,000 (Classic Flap S/M)', bv: '฿66,000–129,000 (medium Jodie)' },
    { a: 'Value retention', chanel: '70–90% (Classic Flap: 80–95%)', bv: '55–70% (Jodie: 60–70%)' },
    { a: 'Thai recognition', chanel: 'Maximum — every buyer knows Chanel', bv: 'Fashion-audience only; less known among mainstream Thai buyers' },
    { a: 'Resale ease (TH)', chanel: 'Fast — high demand on all platforms', bv: 'Moderate — smaller but growing audience' },
  ] : [
    { a: 'สไตล์', chanel: 'ลายตาราง โซ่ โลโก้ iconic', bv: 'ไม่มีโลโก้ — ถักลาย intrecciato เท่านั้น' },
    { a: 'ราคาเริ่มต้น (บาท)', chanel: '44,000 บาท (ชิ้นเล็ก)', bv: '20,000 บาท (mini Jodie)' },
    { a: 'ราคากลาง (บาท)', chanel: '129,000–295,000 บาท (Classic Flap S/M)', bv: '66,000–129,000 บาท (Jodie กลาง)' },
    { a: 'อัตราการรักษามูลค่า', chanel: '70–90% (Classic Flap: 80–95%)', bv: '55–70% (Jodie: 60–70%)' },
    { a: 'การรับรู้ในไทย', chanel: 'สูงสุด — ทุกคนรู้จัก Chanel', bv: 'เฉพาะกลุ่มแฟชั่น; ไม่เป็นที่รู้จักในกลุ่มกระแสหลัก' },
    { a: 'ขายต่อง่ายในไทย', chanel: 'เร็ว — demand สูงทุกแพลตฟอร์ม', bv: 'ปานกลาง — กลุ่มเล็กแต่โตขึ้น' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Chanel vs Bottega Veneta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel vs Bottega Veneta: Pre-Owned Thailand 2025' : 'Chanel vs Bottega Veneta: มือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Loud vs quiet luxury — maximum recognition vs no-logo intrecciato weave. Which is the better pre-owned buy for Thai buyers?'
          : 'Luxury ดัง vs หรูเงียบ — การรับรู้สูงสุด vs ถักลายไม่มีโลโก้ อันไหนเป็นการซื้อมือสองที่ดีกว่าสำหรับคนไทย?'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'หัวข้อ'}</th>
              <th className="text-left py-3 px-4 font-semibold">Chanel</th>
              <th className="text-left py-3 px-4 font-semibold">Bottega Veneta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.a}</td>
                <td className="py-3 px-4 text-gray-600">{row.chanel}</td>
                <td className="py-3 px-4 text-gray-600">{row.bv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/chanel-vs-bottega-veneta" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/chanel-vs-bottega-veneta" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Guide →</Link>
        <Link href={`/${locale}/brands/bottega-veneta`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega Guide →</Link>
        <Link href={`/${locale}/compare/chanel-vs-hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Hermès →</Link>
      </div>
    </div>
  )
}
