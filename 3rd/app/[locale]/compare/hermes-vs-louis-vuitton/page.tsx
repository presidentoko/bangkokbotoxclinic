import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/hermes-vs-louis-vuitton'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Hermès vs Louis Vuitton: Pre-Owned in Thailand 2025 | ChicPreowned' : 'Hermès vs Louis Vuitton: มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Hermès vs Louis Vuitton pre-owned in Thailand — Birkin vs Neverfull. THB prices, value retention, which to buy in Bangkok.'
      : 'Hermès vs Louis Vuitton มือสองในไทย — Birkin vs Neverfull ราคาบาท การรักษามูลค่า อะไรน่าซื้อในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function HermesVsLVPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Founded', hermes: '1837 (saddle maker)', lv: '1854 (trunk maker)' },
    { aspect: 'Iconic bag', hermes: 'Birkin / Kelly', lv: 'Neverfull / Speedy / Capucines' },
    { aspect: 'Entry pre-owned (THB)', hermes: '฿55,000 (Evelyne / Picotin)', lv: '฿22,000 (Speedy 25 / Pochette)' },
    { aspect: 'Flagship vs retail', hermes: 'Birkin 25: 150–250%+ above retail', lv: 'Neverfull MM: 85–100% of retail' },
    { aspect: 'Value retention', hermes: 'Birkin/Kelly: 100–200%+; others: 80–95%', lv: 'Mono canvas: 85–100%; leather: 60–80%' },
    { aspect: 'Wait list in Bangkok', hermes: '1–5+ years for Birkin at AD', lv: 'No wait — available at CentralWorld, Siam Paragon' },
    { aspect: 'Resale speed in Thailand', hermes: 'Birkin/Kelly: very fast. Others: moderate', lv: 'Mono canvas: fastest of any brand' },
    { aspect: 'Material durability', hermes: 'Togo/Clemence lasts decades', lv: 'Mono canvas extremely durable; Vachetta requires care' },
  ] : [
    { aspect: 'ก่อตั้ง', hermes: '1837 (ช่างทำอาน)', lv: '1854 (ช่างทำหีบ)' },
    { aspect: 'กระเป๋าที่โด่งดัง', hermes: 'Birkin / Kelly', lv: 'Neverfull / Speedy / Capucines' },
    { aspect: 'ราคาเริ่มต้นมือสอง (บาท)', hermes: '55,000 บาท (Evelyne / Picotin)', lv: '22,000 บาท (Speedy 25 / Pochette)' },
    { aspect: 'กระเป๋าหลัก vs ราคาปลีก', hermes: 'Birkin 25: สูงกว่าราคาปลีก 150–250%+', lv: 'Neverfull MM: 85–100% ของราคาปลีก' },
    { aspect: 'การรักษามูลค่า', hermes: 'Birkin/Kelly: 100–200%+; อื่นๆ: 80–95%', lv: 'Mono canvas: 85–100%; หนัง: 60–80%' },
    { aspect: 'คิวรอในกรุงเทพ', hermes: '1–5+ ปีสำหรับ Birkin ที่ AD', lv: 'ไม่มีคิว — มีที่ CentralWorld, Siam Paragon' },
    { aspect: 'ความเร็วขายต่อในไทย', hermes: 'Birkin/Kelly: เร็วมาก อื่นๆ: ปานกลาง', lv: 'Mono canvas: เร็วที่สุดในทุกแบรนด์' },
    { aspect: 'ความทนทานของวัสดุ', hermes: 'Togo/Clemence อยู่ได้หลายทศวรรษ', lv: 'Mono canvas ทนทานมาก; Vachetta ต้องดูแล' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <span>Hermès vs Louis Vuitton</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Hermès vs Louis Vuitton: Pre-Owned in Thailand ${PRICE_YEAR}` : `Hermès vs Louis Vuitton: มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? "The world's most exclusive bag vs the world's most recognisable — two entirely different markets."
          : 'กระเป๋าที่เอกสิทธิ์ที่สุดในโลก vs ที่รู้จักมากที่สุดในโลก — สองตลาดที่แตกต่างกันโดยสิ้นเชิง'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10 text-sm text-amber-900">
        <strong>{isEn ? 'Investment note:' : 'หมายเหตุการลงทุน:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Hermès Birkin has outperformed the S&P 500 over the past 35 years. Louis Vuitton Monogram is the most liquid pre-owned luxury item in the world — fastest to sell in Bangkok. These serve different buyer profiles.'
            : 'Hermès Birkin ให้ผลตอบแทนเหนือกว่า S&P 500 ตลอด 35 ปีที่ผ่านมา Louis Vuitton Monogram เป็นสินค้า luxury มือสองที่ขายคล่องที่สุดในโลก — ขายได้เร็วที่สุดในกรุงเทพ สองแบรนด์นี้เหมาะกับผู้ซื้อต่างประเภท'}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hermès</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Birkin/Kelly: best long-term value retention of any bag globally</li>
              <li>✓ Hand-crafted by a single artisan — unmatched quality</li>
              <li>✓ Quiet prestige — no visible logos, recognised by those who know</li>
              <li>✗ Entry-level from ฿55,000 — much higher than LV</li>
              <li>✗ Birkin/Kelly new only through AD waitlist + spending history</li>
            </> : <>
              <li>✓ Birkin/Kelly: รักษามูลค่าได้ดีที่สุดในระยะยาวของกระเป๋าทั้งโลก</li>
              <li>✓ ทำด้วยมือโดยช่างคนเดียว — คุณภาพที่ไม่มีใครเทียบ</li>
              <li>✓ ความหรูหราแบบเงียบ — ไม่มีโลโก้ที่เห็นชัด แต่ผู้รู้จะรู้</li>
              <li>✗ ราคาเริ่มต้น 55,000 บาท — สูงกว่า LV มาก</li>
              <li>✗ Birkin/Kelly ใหม่ต้องมีประวัติการซื้อที่ AD + รายการรอคิว</li>
            </>}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Louis Vuitton</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Most recognisable luxury brand in Thailand</li>
              <li>✓ Entry from ฿22,000 pre-owned — most accessible</li>
              <li>✓ Mono canvas: extremely durable, easy to authenticate</li>
              <li>✓ Fastest resale in Bangkok — sells in days</li>
              <li>✗ Over-saturated — Monogram seen everywhere</li>
              <li>✗ Leather models depreciate significantly</li>
            </> : <>
              <li>✓ แบรนด์ luxury ที่เป็นที่รู้จักมากที่สุดในไทย</li>
              <li>✓ ราคาเริ่มต้น 22,000 บาท มือสอง — เข้าถึงได้มากที่สุด</li>
              <li>✓ Mono canvas: ทนทานมาก ตรวจสอบความแท้ง่าย</li>
              <li>✓ ขายต่อได้เร็วที่สุดในกรุงเทพ — ขายได้ภายในไม่กี่วัน</li>
              <li>✗ อิ่มตัวเกินไป — Monogram พบเห็นทุกที่</li>
              <li>✗ รุ่นหนังเสื่อมราคามาก</li>
            </>}
          </ul>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEn ? 'Comparison Table' : 'ตารางเปรียบเทียบ'}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'ด้าน'}</th>
                <th className="text-left py-3 px-4 font-semibold">Hermès</th>
                <th className="text-left py-3 px-4 font-semibold">Louis Vuitton</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.hermes}</td>
                  <td className="py-3 px-4 text-gray-600">{row.lv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/hermes-vs-louis-vuitton" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/hermes-vs-louis-vuitton" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Hermès Prices →' : 'ราคา Hermès →'}
        </Link>
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'LV Prices →' : 'ราคา LV →'}
        </Link>
      </div>
    </div>
  )
}
