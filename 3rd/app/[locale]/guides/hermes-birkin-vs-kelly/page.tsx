import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/hermes-birkin-vs-kelly'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Hermès Birkin vs Kelly: Which to Buy in Thailand 2025 | ChicPreowned' : 'Hermès Birkin vs Kelly: ซื้ออะไรในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Hermès Birkin vs Kelly for Thai buyers — which holds value better, THB prices, where to find in Bangkok, practical differences.'
      : 'Hermès Birkin vs Kelly สำหรับคนไทย — อันไหนรักษามูลค่าดีกว่า ราคาบาท หาซื้อที่ไหนในกรุงเทพ ความแตกต่างในทางปฏิบัติ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function BirkinVsKellyTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const priceRows = isEn ? [
    { model: 'Birkin 25 (Togo/Epsom, PHW)', thb: '฿720,000–1,290,000', retail: '฿460,000', note: 'Rarest size = highest per-cm premium' },
    { model: 'Birkin 30 (Togo, GHW)', thb: '฿810,000–1,540,000', retail: '฿522,000', note: 'Most sought globally' },
    { model: 'Kelly 25 (Epsom, PHW)', thb: '฿648,000–1,052,000', retail: '฿417,000', note: 'Entry Hermès iconic; strong resale' },
    { model: 'Kelly 28 (Sellier, Togo)', thb: '฿689,000–1,134,000', retail: '฿437,000', note: 'Most versatile Kelly size' },
  ] : [
    { model: 'Birkin 25 (Togo/Epsom, PHW)', thb: '720,000–1,290,000 บาท', retail: '460,000 บาท', note: 'ขนาดหายากที่สุด = premium ต่อซม.สูงสุด' },
    { model: 'Birkin 30 (Togo, GHW)', thb: '810,000–1,540,000 บาท', retail: '522,000 บาท', note: 'ที่ต้องการมากที่สุดทั่วโลก' },
    { model: 'Kelly 25 (Epsom, PHW)', thb: '648,000–1,052,000 บาท', retail: '417,000 บาท', note: 'เริ่มต้น Hermès iconic; resale แข็งแกร่ง' },
    { model: 'Kelly 28 (Sellier, Togo)', thb: '689,000–1,134,000 บาท', retail: '437,000 บาท', note: 'Kelly ที่ versatile ที่สุด' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>Hermès Birkin vs Kelly</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Hermès Birkin vs Kelly: Which to Buy in Thailand?' : 'Hermès Birkin vs Kelly: ซื้ออะไรในไทย?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Both sell far above retail. Both are impossible to buy new. But they\'re very different bags — here\'s how to choose for the Thai market.'
          : 'ทั้งคู่ขายแพงกว่า retail มาก ทั้งคู่ซื้อใหม่ไม่ได้ แต่เป็นกระเป๋าต่างชนิด — นี่คือวิธีเลือกสำหรับตลาดไทย'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Pre-Owned (THB)' : 'มือสอง (บาท)'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Retail (TH)' : 'Retail (ไทย)'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Note' : 'หมายเหตุ'}</th>
            </tr>
          </thead>
          <tbody>
            {priceRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">{row.thb}</td>
                <td className="py-3 px-4 text-gray-500">{row.retail}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 mb-8">
        <strong>{isEn ? 'Thai market context:' : 'บริบทตลาดไทย:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Hermès Central Chidlom Bangkok requires established purchase history before offering Birkin/Kelly allocations. The pre-owned market in Thailand is active — Facebook Groups ("กระเป๋าแบรนด์มือสอง") and Line Market have the most listings. Always authenticate with a Hermès service centre or 3rd-party authenticator before buying.'
            : 'Hermès สาขา Central Chidlom กรุงเทพต้องมีประวัติซื้อมาก่อนจึงจะได้ Birkin/Kelly ตลาดมือสองในไทยคึกคัก — Facebook Groups ("กระเป๋าแบรนด์มือสอง") และ Line Market มี listing มากที่สุด ควรตรวจสอบความถูกต้องกับ Hermès service centre หรือ 3rd-party ก่อนซื้อเสมอ'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/hermes-birkin-vs-kelly" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/hermes-birkin-vs-kelly" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Guide →</Link>
        <Link href={`/${locale}/trends/luxury-above-retail`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Above-Retail Guide →' : 'สินค้าเกิน Retail →'}</Link>
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authentication Guide →' : 'คู่มือตรวจสอบ →'}</Link>
      </div>
    </div>
  )
}
