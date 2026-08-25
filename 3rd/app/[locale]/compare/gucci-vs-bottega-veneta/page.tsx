import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/gucci-vs-bottega-veneta'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Gucci vs Bottega Veneta Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Gucci vs Bottega Veneta มือสองในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `Gucci vs Bottega Veneta for Thai buyers — logo vs no-logo, investment case, THB resale prices, which Italian luxury holds better in Bangkok ${PRICE_YEAR}.`
      : `เปรียบ Gucci กับ Bottega Veneta สำหรับผู้ซื้อชาวไทย — โลโก้ vs ไม่มีโลโก้ กรณีลงทุน ราคาขายต่อบาท อันไหนคงมูลค่าดีกว่าในกรุงเทพ ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function GucciVsBVTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Design philosophy', gucci: 'Maximum logo — GG canvas, bee, web stripe everywhere', bv: 'Zero visible branding — intrecciato weave is the signature' },
    { metric: 'Icon bag', gucci: `Dionysus (${formatPriceTHB(900)}–${formatPriceTHB(2000)}), Marmont (${formatPriceTHB(700)}–${formatPriceTHB(1400)})`, bv: `Cassette (${formatPriceTHB(1500)}–${formatPriceTHB(2800)}), Jodie (${formatPriceTHB(800)}–${formatPriceTHB(1400)})` },
    { metric: 'Entry price', gucci: `${formatPriceTHB(500)}+ (small GG Marmont)`, bv: `${formatPriceTHB(700)}+ (small Jodie hobo)` },
    { metric: 'Resale vs retail', gucci: '35–60% (canvas); 50–75% (leather)', bv: '55–80% (higher for Cassette and Pouch)' },
    { metric: 'Investment case', gucci: 'Weak — Sabato De Sarno era uncertain in SEA market', bv: 'Strong — Intrecciato timeless, Matthieu Blazy era well received' },
    { metric: 'Thailand recognition', gucci: 'Very high — most GG canvas is recognized by general public', bv: 'Moderate — recognized by fashion-aware buyers, not mass market' },
    { metric: 'Best pre-owned buy', gucci: `Leather Marmont: ${formatPriceTHB(700)}–${formatPriceTHB(1000)}`, bv: `Jodie hobo: ${formatPriceTHB(800)}–${formatPriceTHB(1200)}` },
  ] : [
    { metric: 'ปรัชญาการออกแบบ', gucci: 'โลโก้สูงสุด — GG canvas ผึ้ง แถบเว็บทุกที่', bv: 'ไม่มีตราสินค้าที่มองเห็นได้ — ลายทอ intrecciato คือสัญลักษณ์' },
    { metric: 'กระเป๋าสัญลักษณ์', gucci: `Dionysus (${formatPriceTHB(900)}–${formatPriceTHB(2000)}) Marmont (${formatPriceTHB(700)}–${formatPriceTHB(1400)})`, bv: `Cassette (${formatPriceTHB(1500)}–${formatPriceTHB(2800)}) Jodie (${formatPriceTHB(800)}–${formatPriceTHB(1400)})` },
    { metric: 'ราคาเริ่มต้น', gucci: `${formatPriceTHB(500)}+ (GG Marmont ขนาดเล็ก)`, bv: `${formatPriceTHB(700)}+ (Jodie hobo ขนาดเล็ก)` },
    { metric: 'ขายต่อ vs ราคาร้าน', gucci: '35–60% (canvas); 50–75% (หนัง)', bv: '55–80% (สูงกว่าสำหรับ Cassette และ Pouch)' },
    { metric: 'กรณีลงทุน', gucci: 'อ่อน — ยุค Sabato De Sarno ยังไม่แน่นอนในตลาดเอเชียตะวันออกเฉียงใต้', bv: 'แข็งแกร่ง — Intrecciato timeless ยุค Matthieu Blazy ได้รับการตอบรับดี' },
    { metric: 'การรับรู้ในไทย', gucci: 'สูงมาก — GG canvas ส่วนใหญ่เป็นที่รู้จักโดยประชาชนทั่วไป', bv: 'ปานกลาง — เป็นที่รู้จักโดยผู้ซื้อที่ตระหนักด้านแฟชั่น ไม่ใช่ตลาดมวลชน' },
    { metric: 'ซื้อมือสองที่ดีที่สุด', gucci: `Marmont หนัง: ${formatPriceTHB(700)}–${formatPriceTHB(1000)}`, bv: `Jodie hobo: ${formatPriceTHB(800)}–${formatPriceTHB(1200)}` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Gucci vs Bottega Veneta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Gucci vs Bottega Veneta Pre-Owned' : 'Gucci vs Bottega Veneta มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two Italian houses with opposite philosophies. Gucci maximizes logo visibility. Bottega has zero visible branding — the intrecciato weave is the statement. Bottega holds value better; Gucci offers more entry-price variety for Thai buyers.'
          : 'สองเมซองอิตาเลียนที่มีปรัชญาตรงกันข้าม Gucci เน้นโลโก้สูงสุด Bottega ไม่มีตราสินค้าที่มองเห็น — ลายทอ intrecciato คือความโดดเด่น Bottega คงมูลค่าได้ดีกว่า Gucci มีความหลากหลายด้านราคาเริ่มต้นสำหรับผู้ซื้อชาวไทย'}
      </p>

      <ThaiPriceCallout
        slugs={['gucci/horsebit-1955-small-bag', 'gucci/jackie-1961-small', 'bottega-veneta/cassette-bag', 'bottega-veneta/mini-pouch']}
        locale={locale}
      />

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Gucci</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Bottega Veneta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.gucci}</td>
                <td className="py-3 px-4 text-gray-700">{r.bv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/gucci-vs-bottega-veneta" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/gucci-vs-bottega-veneta" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Gucci Pre-Owned →' : 'Gucci มือสอง →'}</Link>
        <Link href={`/${locale}/brands/bottega-veneta`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Bottega Pre-Owned →' : 'Bottega มือสอง →'}</Link>
      </div>
    </div>
  )
}
