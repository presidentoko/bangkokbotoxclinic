import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/chanel-price-history'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Chanel Price History 2019–2025 Thailand | ChicPreowned' : 'ประวัติราคา Chanel 2019–2568 ในไทย | ChicPreowned',
    description: isEn
      ? `Chanel Classic Flap price hike history 2019–${PRICE_YEAR} in Thailand. From ฿195,000 to ฿350,000 — and why pre-owned is now the smarter buy.`
      : 'ประวัติการขึ้นราคา Chanel Classic Flap 2562–2568 ในไทย จาก 195,000 บาท เป็น 350,000 บาท — และทำไมมือสองถึงเป็นทางเลือกที่ฉลาดกว่า',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function ChanelPriceHistoryTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const hikes = isEn ? [
    { date: 'Nov 2019', price: '฿195,000', change: 'Base' },
    { date: 'May 2020', price: '฿205,000', change: '+฿10,000 (+5%)' },
    { date: 'Oct 2021', price: '฿242,000', change: '+฿37,000 (+18%)' },
    { date: 'Mar 2022', price: '฿271,000', change: '+฿29,000 (+12%)' },
    { date: 'Nov 2022', price: '฿314,000', change: '+฿43,000 (+16%)' },
    { date: 'Apr 2024', price: '฿337,000', change: '+฿23,000 (+7%)' },
    { date: 'Mar 2025', price: '฿357,000', change: '+฿20,000 (+6%)' },
  ] : [
    { date: 'พ.ย. 2562', price: '195,000 บาท', change: 'ราคาเริ่มต้น' },
    { date: 'พ.ค. 2563', price: '205,000 บาท', change: '+10,000 บาท (+5%)' },
    { date: 'ต.ค. 2564', price: '242,000 บาท', change: '+37,000 บาท (+18%)' },
    { date: 'มี.ค. 2565', price: '271,000 บาท', change: '+29,000 บาท (+12%)' },
    { date: 'พ.ย. 2565', price: '314,000 บาท', change: '+43,000 บาท (+16%)' },
    { date: 'เม.ย. 2567', price: '337,000 บาท', change: '+23,000 บาท (+7%)' },
    { date: 'มี.ค. 2568', price: '357,000 บาท', change: '+20,000 บาท (+6%)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Chanel Price History' : 'ประวัติราคา Chanel'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Chanel Price History 2019–${PRICE_YEAR} in Thailand` : 'ประวัติราคา Chanel ในไทย 2562–2568'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Classic Flap M/L rose from ฿195,000 in 2019 to ฿357,000 in 2025 — a 83% increase. Here\'s every hike and what it means for Thai pre-owned buyers.'
          : 'Classic Flap M/L เพิ่มจาก 195,000 บาท ในปี 2562 เป็น 357,000 บาท ในปี 2568 — ขึ้น 83% นี่คือการขึ้นราคาทุกครั้งและความหมายสำหรับผู้ซื้อมือสองชาวไทย'}
      </p>

      <ThaiPriceCallout
        slugs={['chanel/classic-flap-medium', 'chanel/classic-flap-mini', 'chanel/boy-bag-medium', 'chanel/19-bag-small']}
        locale={locale}
        title={isEn ? 'Where the Thai resale market sits today' : 'ตลาดมือสองไทยอยู่ตรงไหนวันนี้'}
      />

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Classic Flap M/L Price Timeline (Thailand)' : 'ไทม์ไลน์ราคา Classic Flap M/L (ประเทศไทย)'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Date' : 'วันที่'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Boutique Price' : 'ราคาบูติก'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Change' : 'การเปลี่ยนแปลง'}</th>
              </tr>
            </thead>
            <tbody>
              {hikes.map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i === hikes.length - 1 ? 'bg-red-50' : ''}`}>
                  <td className="py-3 px-4 text-gray-700 font-medium">{row.date}</td>
                  <td className="text-right py-3 px-4 font-bold text-gray-900">{row.price}</td>
                  <td className="text-right py-3 px-4 text-red-600 text-sm">{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'The Pre-Owned Advantage in Thailand' : 'ข้อได้เปรียบมือสองในไทย'}
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-900">
          {isEn
            ? 'A 2022 Classic Flap M/L that retailed at ฿271,000 can be found pre-owned for ฿215,000–250,000 today — while the new price has climbed to ฿357,000. You\'re saving ฿107,000–142,000 vs boutique.'
            : 'Classic Flap M/L ปี 2565 ที่ราคาบูติก 271,000 บาท สามารถหาซื้อมือสองได้ในราคา 215,000–250,000 บาทวันนี้ — ในขณะที่ราคาใหม่เพิ่มเป็น 357,000 บาท ประหยัดได้ 107,000–142,000 บาทเทียบกับบูติก'}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/chanel-price-history" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/chanel-price-history" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/chanel-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Chanel Size Guide →' : 'คู่มือขนาด Chanel →'}
        </Link>
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'All Chanel Prices →' : 'ราคา Chanel ทั้งหมด →'}
        </Link>
      </div>
    </div>
  )
}
