import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/chanel-vs-dior'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Chanel vs Dior: Pre-Owned Bags in Thailand 2025 | ChicPreowned' : 'Chanel vs Dior: กระเป๋ามือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? `Chanel vs Dior pre-owned in Thailand — Classic Flap vs Lady Dior. Price in THB, value retention, which to buy in ${PRICE_YEAR}.`
      : 'Chanel vs Dior มือสองในไทย — Classic Flap vs Lady Dior ราคาเป็นบาท การรักษามูลค่า และอะไรน่าซื้อในปี 2568',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function ChanelVsDiorPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Iconic bag', chanel: 'Classic Flap / 2.55', dior: 'Lady Dior / Saddle Bag' },
    { aspect: 'Entry pre-owned (THB)', chanel: '฿80,000 (Mini Classic Flap)', dior: '฿50,000 (Lady Dior Small)' },
    { aspect: 'Value retention', chanel: '75–100%+ (price hike driven)', dior: '55–70%' },
    { aspect: 'Price hike since 2019', chanel: '+80–100%', dior: '+40–60%' },
    { aspect: 'Resale speed in Thailand', chanel: 'Fast — high demand', dior: 'Moderate — Lady Dior most popular' },
    { aspect: 'Logo visibility', chanel: 'CC clasp', dior: '"DIOR" Roman letters on Lady Dior' },
    { aspect: 'Durability', chanel: 'Caviar excellent · Lambskin delicate', dior: 'Calfskin good · Cannage quilting shows edge wear' },
  ] : [
    { aspect: 'กระเป๋าที่โด่งดัง', chanel: 'Classic Flap / 2.55', dior: 'Lady Dior / Saddle Bag' },
    { aspect: 'ราคาเริ่มต้นมือสอง (บาท)', chanel: '80,000 บาท (Mini Classic Flap)', dior: '50,000 บาท (Lady Dior Small)' },
    { aspect: 'การรักษามูลค่า', chanel: '75–100%+ (ขึ้นราคาบ่อย)', dior: '55–70%' },
    { aspect: 'ขึ้นราคาตั้งแต่ 2019', chanel: '+80–100%', dior: '+40–60%' },
    { aspect: 'ความเร็วขายต่อในไทย', chanel: 'เร็ว — ความต้องการสูง', dior: 'ปานกลาง — Lady Dior นิยมมากที่สุด' },
    { aspect: 'ความชัดเจนของโลโก้', chanel: 'ตัวล็อค CC', dior: 'อักษร "DIOR" บน Lady Dior' },
    { aspect: 'ความทนทาน', chanel: 'Caviar ดีมาก · Lambskin บอบบาง', dior: 'Calfskin ดี · ขอบรอยตะเข็บแสดงร่องรอยการใช้งาน' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <span>Chanel vs Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Chanel vs Dior: Pre-Owned Bags in Thailand ${PRICE_YEAR}` : `Chanel vs Dior: กระเป๋ามือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Two pillars of French fashion — Chanel\'s investment-grade pricing vs Dior\'s accessible luxury.'
          : 'สองเสาหลักของแฟชั่นฝรั่งเศส — ราคาระดับการลงทุนของ Chanel vs ความหรูหราที่เข้าถึงได้ของ Dior'}
      </p>

      <ThaiPriceCallout
        slugs={['chanel/classic-flap-medium', 'chanel/boy-bag-medium']}
        locale={locale}
        title={isEn ? 'Chanel at Thai dealer prices right now' : 'ราคา Chanel ที่ร้านไทยตั้งขายตอนนี้'}
      />

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chanel</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Classic Flap retains 75–100%+ — investment-grade</li>
              <li>✓ Massive price hikes make pre-owned a genuine saving</li>
              <li>✓ Most recognised luxury bag in Thailand</li>
              <li>✗ Entry pre-owned from ฿80,000 (much higher than Dior)</li>
            </> : <>
              <li>✓ Classic Flap รักษา 75–100%+ — ระดับการลงทุน</li>
              <li>✓ ขึ้นราคาบ่อยทำให้มือสองประหยัดได้จริง</li>
              <li>✓ กระเป๋า luxury ที่เป็นที่รู้จักมากที่สุดในไทย</li>
              <li>✗ มือสองราคาเริ่มต้น 80,000 บาท (สูงกว่า Dior มาก)</li>
            </>}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dior</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ More accessible — entry from ฿50,000</li>
              <li>✓ Lady Dior endorsed by Princess Diana — iconic status</li>
              <li>✓ Saddle Bag: one of world's most recognisable silhouettes</li>
              <li>✗ Lower retention: 55–70% vs Chanel's 75–100%</li>
            </> : <>
              <li>✓ เข้าถึงได้มากกว่า — ราคาเริ่มต้น 50,000 บาท</li>
              <li>✓ Lady Dior ได้รับการรับรองจาก Princess Diana — สถานะอันเป็นสัญลักษณ์</li>
              <li>✓ Saddle Bag: หนึ่งในรูปทรงที่เป็นที่รู้จักมากที่สุดในโลก</li>
              <li>✗ การรักษามูลค่าต่ำกว่า: 55–70% vs Chanel 75–100%</li>
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
                <th className="text-left py-3 px-4 font-semibold">Chanel</th>
                <th className="text-left py-3 px-4 font-semibold">Dior</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.chanel}</td>
                  <td className="py-3 px-4 text-gray-600">{row.dior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/chanel-vs-dior" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/chanel-vs-dior" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Chanel Prices →' : 'ราคา Chanel →'}
        </Link>
        <Link href={`/${locale}/compare/chanel-vs-hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          Chanel vs Hermès →
        </Link>
      </div>
    </div>
  )
}
