import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/chanel-classic-vs-boy'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel Classic Flap vs Boy Bag Thailand 2025 | ChicPreowned'
      : 'Chanel Classic Flap vs Boy Bag ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Chanel Classic Flap vs Boy Bag for Thai buyers — which holds value better, THB prices, caviar vs lambskin, Bangkok buying tips.'
      : 'Chanel Classic Flap vs Boy Bag สำหรับคนไทย — อันไหนรักษามูลค่าดีกว่า ราคาบาท caviar vs lambskin เคล็ดลับซื้อในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function ChanelClassicVsBoyTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const priceRows = isEn ? [
    { model: 'Classic Flap Small (lambskin, GHW)', thb: '฿232,000–340,000', retention: '95–115%' },
    { model: 'Classic Flap Medium (caviar, CHW)', thb: '฿260,000–400,000', retention: '85–105%' },
    { model: 'Boy Bag Small (lambskin, GHW)', thb: '฿140,000–220,000', retention: '65–80%' },
    { model: 'Boy Bag Old Medium (caviar)', thb: '฿200,000–320,000', retention: '75–90%' },
  ] : [
    { model: 'Classic Flap Small (lambskin, GHW)', thb: '232,000–340,000 บาท', retention: '95–115%' },
    { model: 'Classic Flap Medium (caviar, CHW)', thb: '260,000–400,000 บาท', retention: '85–105%' },
    { model: 'Boy Bag Small (lambskin, GHW)', thb: '140,000–220,000 บาท', retention: '65–80%' },
    { model: 'Boy Bag Old Medium (caviar)', thb: '200,000–320,000 บาท', retention: '75–90%' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>Chanel CF vs Boy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel Classic Flap vs Boy Bag in Thailand' : 'Chanel Classic Flap vs Boy Bag ในไทย'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The two most important Chanel bags. Classic Flap is timeless and has stronger resale; Boy is a statement piece with slightly more edge. Here\'s how they compare for Thai buyers.'
          : 'สองกระเป๋า Chanel ที่สำคัญที่สุด Classic Flap ยั่งยืนและ resale แข็งแกร่งกว่า Boy คือ statement piece ที่โดดเด่น นี่คือการเปรียบสำหรับคนไทย'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Pre-Owned (THB)' : 'มือสอง (บาท)'}</th>
              <th className="text-left py-3 px-4 font-semibold text-amber-700">{isEn ? 'vs Retail' : 'เทียบ Retail'}</th>
            </tr>
          </thead>
          <tbody>
            {priceRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                <td className="py-3 px-4 text-gray-700">{row.thb}</td>
                <td className="py-3 px-4 font-semibold text-amber-700">{row.retention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 mb-8">
        <strong>{isEn ? 'Thai market tip:' : 'เคล็ดลับตลาดไทย:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Chanel prices at Central Embassy and Siam Paragon Bangkok track global increases annually. Pre-owned Classic Flap prices in Thailand often sell at or above retail for popular colorways (black/beige caviar). Facebook Groups and C2C platforms have the most active Thai Chanel market.'
            : 'ราคา Chanel ที่ Central Embassy และ Siam Paragon กรุงเทพขึ้นราคาทุกปีตาม global ราคา Classic Flap มือสองในไทยมักขายเท่า retail หรือมากกว่าสำหรับสี popular (ดำ/เบจ caviar) Facebook Groups และแพลตฟอร์ม C2C มีตลาด Chanel ไทยที่คึกคักที่สุด'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/chanel-classic-vs-boy" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/chanel-classic-vs-boy" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel {isEn ? 'Pre-Owned' : 'มือสอง'} →</Link>
        <Link href={`/${locale}/guides/chanel-price-history`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Price History →' : 'ประวัติราคา →'}</Link>
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authentication →' : 'ตรวจของแท้ →'}</Link>
      </div>
    </div>
  )
}
