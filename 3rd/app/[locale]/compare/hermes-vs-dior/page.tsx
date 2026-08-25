import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/hermes-vs-dior'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Hermès vs Dior Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Hermès vs Dior มือสองในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `Hermès vs Dior for Thai buyers — Birkin vs Lady Dior, THB prices, investment case, which luxury house holds better in Bangkok ${PRICE_YEAR}.`
      : `เปรียบ Hermès กับ Dior สำหรับผู้ซื้อชาวไทย — Birkin vs Lady Dior ราคาบาท กรณีลงทุน อันไหนคงมูลค่าดีกว่าในกรุงเทพ ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function HermesVsDiorTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Icon bag', hermes: `Birkin (${formatPriceTHB(12000)}–${formatPriceTHB(80000)}+)`, dior: `Lady Dior (${formatPriceTHB(2000)}–${formatPriceTHB(5500)})` },
    { metric: 'Entry price', hermes: `${formatPriceTHB(3500)}+ (Evelyne PM)`, dior: `${formatPriceTHB(1800)}+ (Lady Dior Mini)` },
    { metric: 'Resale vs retail', hermes: '100–400%+ (Birkin/Kelly exotic)', dior: '55–75%' },
    { metric: 'Investment case', hermes: 'Strongest in luxury — Birkin consistently beats inflation', dior: 'Moderate — standard Lady Dior holds 55–75%, limited editions better' },
    { metric: 'Availability in Bangkok', hermes: 'Allocation system at Paragon/ICONSIAM — secondary market is easier', dior: 'In stock at boutique. Easy to buy, easier to find pre-owned' },
    { metric: 'Thailand recognition', hermes: 'Among the elite — Birkin signals extreme wealth', dior: 'Very strong — Lady Dior royal associations well known in Thailand' },
    { metric: 'Best for', hermes: 'Investment + store of value — never sells at a loss', dior: 'Fashion buyer wanting haute couture at accessible entry prices' },
  ] : [
    { metric: 'กระเป๋าสัญลักษณ์', hermes: `Birkin (${formatPriceTHB(12000)}–${formatPriceTHB(80000)}+)`, dior: `Lady Dior (${formatPriceTHB(2000)}–${formatPriceTHB(5500)})` },
    { metric: 'ราคาเริ่มต้น', hermes: `${formatPriceTHB(3500)}+ (Evelyne PM)`, dior: `${formatPriceTHB(1800)}+ (Lady Dior Mini)` },
    { metric: 'ขายต่อ vs ราคาร้าน', hermes: '100–400%+ (Birkin/Kelly exotic)', dior: '55–75%' },
    { metric: 'กรณีลงทุน', hermes: 'แข็งแกร่งที่สุดในกลุ่มหรู — Birkin ชนะเงินเฟ้อได้อย่างสม่ำเสมอ', dior: 'ปานกลาง — Lady Dior มาตรฐานคงค่า 55–75% Limited Edition ดีกว่า' },
    { metric: 'ความพร้อมในกรุงเทพ', hermes: 'ระบบการจัดสรรที่พารากอน/ICONSIAM — ตลาดรองง่ายกว่า', dior: 'มีสต็อกที่บูติก ซื้อง่าย หาง่ายกว่ามือสอง' },
    { metric: 'การรับรู้ในไทย', hermes: 'ในกลุ่มชนชั้นสูง — Birkin แสดงถึงความร่ำรวยสูง', dior: 'แข็งแกร่งมาก — เชื่อมโยงราชวงศ์ Lady Dior เป็นที่รู้จักดีในไทย' },
    { metric: 'ดีที่สุดสำหรับ', hermes: 'การลงทุน + เก็บมูลค่า — ไม่ขายขาดทุน', dior: 'ผู้ซื้อแฟชั่นที่ต้องการความเชื่อมโยง haute couture ในราคาเริ่มต้นที่เข้าถึงได้' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Hermès vs Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Hermès vs Dior Pre-Owned' : 'Hermès vs Dior มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Hermès is the investment play — Birkin has never lost value. Dior is the fashion play — Lady Dior gives haute couture association at a fraction of Hermès prices. For Thai buyers: Hermès for wealth preservation, Dior for fashion-first access.'
          : 'Hermès คือการลงทุน — Birkin ไม่เคยขาดทุน Dior คือแฟชั่น — Lady Dior ให้ความเชื่อมโยง haute couture ในราคาเศษเสี้ยวของ Hermès สำหรับผู้ซื้อชาวไทย Hermès สำหรับรักษามูลค่าทรัพย์สิน Dior สำหรับการเข้าถึงแฟชั่น'}
      </p>

      <ThaiPriceCallout
        slugs={['hermes/evelyne-tpm', 'hermes/garden-party-36']}
        locale={locale}
        title={isEn ? 'Hermes at Thai dealer prices right now' : 'ราคา Hermes ที่ร้านไทยตั้งขายตอนนี้'}
      />

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Hermès</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Dior</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.hermes}</td>
                <td className="py-3 px-4 text-gray-700">{r.dior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/hermes-vs-dior" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/hermes-vs-dior" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Hermès Pre-Owned →' : 'Hermès มือสอง →'}</Link>
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Dior Pre-Owned →' : 'Dior มือสอง →'}</Link>
        <Link href={`/${locale}/trends/hermes-birkin-waitlist-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Birkin Waitlist →' : 'Birkin รายชื่อรอ →'}</Link>
      </div>
    </div>
  )
}
