import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/chanel-vs-saint-laurent'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Chanel vs Saint Laurent Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Chanel vs Saint Laurent มือสองในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Chanel vs Saint Laurent for Thai buyers — Classic Flap vs Lou Lou, THB prices, resale values. Which is the better buy pre-owned in Bangkok?'
      : 'เปรียบ Chanel กับ Saint Laurent สำหรับผู้ซื้อชาวไทย — Classic Flap vs Lou Lou ราคาบาท มูลค่าขายต่อ อันไหนซื้อมือสองได้ดีกว่าในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function ChanelVsSLTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Price tier', chanel: '฿90,000–฿380,000+', ysl: '฿24,000–฿88,000' },
    { metric: 'Best pre-owned bag', chanel: 'Classic Flap Medium (฿150,000–฿280,000)', ysl: 'Sac de Jour (฿56,000–฿88,000)' },
    { metric: 'Entry bag', chanel: 'Mini Classic (฿90,000–฿140,000)', ysl: 'Lou Lou Small (฿24,000–฿36,000)' },
    { metric: 'Investment case', chanel: 'Best in luxury — often at or above retail. Annual appreciation.', ysl: 'Stable and solid — 65–85% of retail, no sudden drops' },
    { metric: 'Thailand recognition', chanel: 'Maximum luxury status symbol — universally known', ysl: 'High — strong with fashion-forward Thai buyers' },
    { metric: 'Best for', chanel: 'Investment-minded buyers with ฿100,000+ budget', ysl: 'Style-first buyers who want French luxury under ฿80,000' },
  ] : [
    { metric: 'ระดับราคา', chanel: '฿90,000–฿380,000+', ysl: '฿24,000–฿88,000' },
    { metric: 'กระเป๋ามือสองที่ดีที่สุด', chanel: 'Classic Flap Medium (฿150,000–฿280,000)', ysl: 'Sac de Jour (฿56,000–฿88,000)' },
    { metric: 'กระเป๋าเริ่มต้น', chanel: 'Mini Classic (฿90,000–฿140,000)', ysl: 'Lou Lou Small (฿24,000–฿36,000)' },
    { metric: 'กรณีการลงทุน', chanel: 'ดีที่สุดในหมวดหรู — มักเท่าหรือเกินราคาร้าน เพิ่มขึ้นทุกปี', ysl: 'คงที่และมั่นคง — 65–85% ของราคาร้าน ไม่มีการตกกะทันหัน' },
    { metric: 'การรับรู้ในไทย', chanel: 'สัญลักษณ์สถานะสูงสุด — เป็นที่รู้จักทั่วไป', ysl: 'สูง — แข็งแกร่งกับผู้ซื้อชาวไทยที่เน้นแฟชั่น' },
    { metric: 'เหมาะสำหรับ', chanel: 'ผู้ซื้อที่เน้นการลงทุนงบประมาณ ฿100,000+', ysl: 'ผู้ซื้อที่เน้นสไตล์ต้องการหรูฝรั่งเศสต่ำกว่า ฿80,000' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Chanel vs Saint Laurent</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel vs Saint Laurent Pre-Owned' : 'Chanel vs Saint Laurent มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both are Parisian. Both hold value. But they are for different buyers. Chanel is the investment — you may actually make money. Saint Laurent is the style play — you get French luxury at a fraction of the price. For Thai buyers, the choice is budget and intent.'
          : 'ทั้งคู่มาจากปารีส ทั้งคู่คงมูลค่า แต่เหมาะกับผู้ซื้อต่างกัน Chanel คือการลงทุน — คุณอาจทำกำไรจริงๆ Saint Laurent คือตัวเลือกสไตล์ — คุณได้ความหรูฝรั่งเศสในราคาเพียงเสี้ยว สำหรับผู้ซื้อชาวไทย ขึ้นอยู่กับงบประมาณและเจตนา'}
      </p>

      <ThaiPriceCallout
        slugs={['chanel/classic-flap-medium', 'chanel/boy-bag-medium']}
        locale={locale}
        title={isEn ? 'Chanel at Thai dealer prices right now' : 'ราคา Chanel ที่ร้านไทยตั้งขายตอนนี้'}
      />

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Chanel</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Saint Laurent</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.chanel}</td>
                <td className="py-3 px-4 text-gray-700">{r.ysl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/chanel-vs-saint-laurent" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/chanel-vs-saint-laurent" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel →' : 'Chanel →'}</Link>
        <Link href={`/${locale}/brands/saint-laurent`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Saint Laurent →' : 'Saint Laurent →'}</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">SL vs Gucci →</Link>
      </div>
    </div>
  )
}
