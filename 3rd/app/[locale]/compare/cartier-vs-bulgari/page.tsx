import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/cartier-vs-bulgari'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Cartier vs Bulgari: Pre-Owned Jewelry Thailand 2025 | ChicPreowned' : 'Cartier vs Bulgari: เครื่องประดับมือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Cartier vs Bulgari for Thai buyers — Love Bracelet vs B.zero1, THB prices, value retention, and where to buy in Bangkok.'
      : 'Cartier vs Bulgari สำหรับคนไทย — Love Bracelet vs B.zero1 ราคาบาท อัตราการรักษามูลค่า และที่ซื้อในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function CartierVsBvlgariTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const items = isEn ? [
    { item: 'Cartier Love Bracelet YG 18k', retail: '฿270,000', preowned: '฿202,000–250,000' },
    { item: 'Cartier Love Bracelet WG 18k', retail: '฿270,000', preowned: '฿191,000–239,000' },
    { item: 'Cartier Juste un Clou Bracelet YG', retail: '฿294,000', preowned: '฿165,000–220,000' },
    { item: 'Bulgari B.zero1 Ring 1-band YG', retail: '฿81,000', preowned: '฿51,000–70,000' },
    { item: 'Bulgari B.zero1 Ring 4-band YG', retail: '฿213,000', preowned: '฿129,000–176,000' },
    { item: 'Bulgari Serpenti Viper Ring WG', retail: '฿165,000', preowned: '฿103,000–140,000' },
  ] : [
    { item: 'Cartier Love Bracelet ทองคำ 18k', retail: '270,000 บาท', preowned: '202,000–250,000 บาท' },
    { item: 'Cartier Love Bracelet ทองขาว 18k', retail: '270,000 บาท', preowned: '191,000–239,000 บาท' },
    { item: 'Cartier Juste un Clou ทองคำ', retail: '294,000 บาท', preowned: '165,000–220,000 บาท' },
    { item: 'Bulgari B.zero1 Ring 1-แถบ ทองคำ', retail: '81,000 บาท', preowned: '51,000–70,000 บาท' },
    { item: 'Bulgari B.zero1 Ring 4-แถบ ทองคำ', retail: '213,000 บาท', preowned: '129,000–176,000 บาท' },
    { item: 'Bulgari Serpenti Viper Ring ทองขาว', retail: '165,000 บาท', preowned: '103,000–140,000 บาท' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Cartier vs Bulgari</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Cartier vs Bulgari: Pre-Owned Jewelry in Thailand ${PRICE_YEAR}` : `Cartier vs Bulgari: เครื่องประดับมือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Love Bracelet vs B.zero1 — which fine jewelry brand is the better pre-owned buy for Thai buyers?'
          : 'Love Bracelet vs B.zero1 — แบรนด์เครื่องประดับชั้นเลิศไหนที่ดีกว่าสำหรับผู้ซื้อมือสองชาวไทย?'}
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-10 text-sm text-gray-600">
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="font-bold text-gray-900 mb-2">Cartier</div>
          <ul className="space-y-1.5">
            <li>✓ {isEn ? 'Love Bracelet: highest pre-owned retention (85–100%)' : 'Love Bracelet: retention สูงสุด (85–100%)'}</li>
            <li>✓ {isEn ? 'Universal recognition — Bangkok Thais know it' : 'จดจำได้ทั่วโลก — คนกรุงเทพรู้จัก'}</li>
            <li>✓ {isEn ? 'Investment + daily wear' : 'ลงทุน + ใส่รายวัน'}</li>
            <li>✗ {isEn ? 'Higher entry price' : 'ราคาเริ่มต้นสูงกว่า'}</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="font-bold text-gray-900 mb-2">Bulgari</div>
          <ul className="space-y-1.5">
            <li>✓ {isEn ? 'Bold Roman aesthetic — more statement-making' : 'สไตล์โรมันโดดเด่น — ดึงดูดความสนใจกว่า'}</li>
            <li>✓ {isEn ? 'Lower entry price than Cartier' : 'ราคาเริ่มต้นต่ำกว่า Cartier'}</li>
            <li>✓ {isEn ? 'B.zero1 is unique — no direct lookalike' : 'B.zero1 ไม่มีของลอกเลียน'}</li>
            <li>✗ {isEn ? 'Lower retention (60–75%)' : 'Retention ต่ำกว่า (60–75%)'}</li>
          </ul>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'THB Price Comparison' : 'เปรียบเทียบราคาบาท'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Item' : 'ชิ้นงาน'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Boutique' : 'บูติก'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Pre-owned' : 'มือสอง'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">{r.item}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{r.retail}</td>
                  <td className="text-right py-3 px-4 text-green-700 font-medium">{r.preowned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/cartier-vs-bulgari" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/cartier-vs-bulgari" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier Guide →</Link>
        <Link href={`/${locale}/compare/cartier-vs-van-cleef`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs VCA →</Link>
      </div>
    </div>
  )
}
