import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/rolex-vs-tudor'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Rolex vs Tudor in Thailand 2025: Sister Brands Compared | ChicPreowned'
      : 'Rolex vs Tudor ในไทย 2025: เปรียบเทียบแบรนด์พี่น้อง | ChicPreowned',
    description: isEn
      ? 'Rolex vs Tudor comparison for Bangkok buyers — Black Bay vs Submariner, THB prices, resale retention, and whether Tudor is worth it at Bangkok boutique prices.'
      : 'เปรียบเทียบ Rolex vs Tudor สำหรับผู้ซื้อกรุงเทพ Black Bay vs Submariner ราคาบาท อัตราการรักษามูลค่า และ Tudor คุ้มค่าที่ราคาบูทีคกรุงเทพหรือไม่',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function RolexVsTudorTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Ownership', rolex: 'Rolex SA (private)', tudor: 'Rolex SA (sister brand, 1926)' },
    { aspect: 'Price (new)', rolex: `$8,100+ (${formatPriceTHB(8100)}+) Submariner steel`, tudor: `$3,000–4,500 (${formatPriceTHB(3000)}–${formatPriceTHB(4500)}) Black Bay` },
    { aspect: 'Pre-owned entry', rolex: `$6,500+ (${formatPriceTHB(6500)}+) Datejust 36`, tudor: `$1,200–2,000 (${formatPriceTHB(1200)}–${formatPriceTHB(2000)}) Black Bay 41` },
    { aspect: 'Movements', rolex: 'In-house Cal. 3235 (Perpetual, Chronergy, Parachrom)', tudor: 'In-house MT5402 (co-axial escapement)' },
    { aspect: 'Steel grade', rolex: 'Oystersteel (904L)', tudor: 'Oystersteel (same grade as Rolex)' },
    { aspect: 'Resale retention', rolex: '95–130%+ (Submariner); 75–90% (Datejust)', tudor: '50–65% of retail' },
    { aspect: 'Investment tier', rolex: 'S-Tier: Sub & GMT at or above retail', tudor: 'B-Tier: Depreciates like a normal luxury watch' },
    { aspect: 'Bangkok boutique', rolex: 'Central Embassy, Siam Paragon (allocation-only)', tudor: 'Central Chidlom, Emporium (walk-in available)' },
  ] : [
    { aspect: 'เจ้าของ', rolex: 'Rolex SA (เอกชน)', tudor: 'Rolex SA (แบรนด์พี่น้อง 1926)' },
    { aspect: 'ราคา (ใหม่)', rolex: `$8,100+ (${formatPriceTHB(8100)}+) Submariner เหล็ก`, tudor: `$3,000–4,500 (${formatPriceTHB(3000)}–${formatPriceTHB(4500)}) Black Bay` },
    { aspect: 'มือสองเริ่มต้น', rolex: `$6,500+ (${formatPriceTHB(6500)}+) Datejust 36`, tudor: `$1,200–2,000 (${formatPriceTHB(1200)}–${formatPriceTHB(2000)}) Black Bay 41` },
    { aspect: 'เคลื่อนไหว', rolex: 'In-house Cal. 3235 (Perpetual, Chronergy, Parachrom)', tudor: 'In-house MT5402 (co-axial escapement)' },
    { aspect: 'เกรดเหล็ก', rolex: 'Oystersteel (904L)', tudor: 'Oystersteel (เกรดเดียวกับ Rolex)' },
    { aspect: 'อัตราการรักษามูลค่า', rolex: '95–130%+ (Submariner); 75–90% (Datejust)', tudor: '50–65% ของราคาร้าน' },
    { aspect: 'ระดับการลงทุน', rolex: 'S-Tier: Sub & GMT เท่าหรือสูงกว่าราคาร้าน', tudor: 'B-Tier: เสื่อมมูลค่าเหมือนนาฬิกาหรูปกติ' },
    { aspect: 'บูทีคกรุงเทพ', rolex: 'Central Embassy, Siam Paragon (allocation เท่านั้น)', tudor: 'Central Chidlom, Emporium (walk-in ได้)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Rolex vs Tudor</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Rolex vs Tudor (2025): Sister Brands Compared' : 'Rolex vs Tudor (2025): เปรียบเทียบแบรนด์พี่น้อง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Tudor was created by Rolex\'s founder in 1926 as an accessible alternative. Both use the same Oystersteel — but resale performance is dramatically different. Bangkok boutique context and THB pricing included.'
          : 'Tudor ถูกสร้างโดยผู้ก่อตั้ง Rolex ในปี 1926 เป็นทางเลือกที่เข้าถึงได้มากกว่า ทั้งคู่ใช้ Oystersteel เดียวกัน แต่ผลการขายต่อแตกต่างกันอย่างมาก รวมบริบทบูทีคกรุงเทพและราคาบาท'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Rolex</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Tudor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.rolex}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.tudor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Buy Rolex if…' : 'ซื้อ Rolex ถ้า…'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'Investment performance matters — Sub and GMT at or above retail',
              'Resale liquidity is a priority — Rolex is globally most liquid',
              'Long-term hold: 10-year Rolex appreciation beats most asset classes',
            ] : [
              'ผลการลงทุนสำคัญ — Sub และ GMT เท่าหรือสูงกว่าราคาร้าน',
              'สภาพคล่องการขายต่อเป็นสิ่งสำคัญ Rolex เป็น liquid ที่สุดทั่วโลก',
              'ถือระยะยาว: การเพิ่มขึ้นของ Rolex 10 ปีดีกว่าสินทรัพย์ส่วนใหญ่',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">{isEn ? 'Buy Tudor if…' : 'ซื้อ Tudor ถ้า…'}</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            {(isEn ? [
              'Budget is $1,500–4,000 (฿54k–144k) and you want the best watch in that range',
              'You want to wear it daily without worry (lower opportunity cost)',
              'Black Bay vintage-inspired aesthetic suits your style',
              'Not treating it as investment — buy to enjoy',
            ] : [
              'งบ $1,500–4,000 (฿54k–144k) และต้องการนาฬิกาที่ดีที่สุดในช่วงนั้น',
              'อยากใส่ทุกวันโดยไม่ต้องกังวล (opportunity cost ต่ำกว่า)',
              'aesthetic แบบวินเทจของ Black Bay เข้ากับสไตล์คุณ',
              'ไม่ได้ถือเป็นการลงทุน ซื้อเพื่อสนุก',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <p className="text-sm text-amber-800">
          <strong>{isEn ? 'The honest verdict:' : 'คำตัดสินที่ตรงไปตรงมา:'}</strong>{' '}
          {isEn
            ? 'Tudor uses the same case steel as Rolex and has excellent in-house movements. For daily wear at Bangkok boutique prices — Tudor is one of the best value buys available. If resale or investment is the priority, Rolex wins by a large margin. Both are genuine quality watches; the question is what you\'re optimizing for.'
            : 'Tudor ใช้เหล็กเคสเดียวกับ Rolex และมีเคลื่อนไหว in-house ที่ยอดเยี่ยม สำหรับการสวมใส่รายวันในราคาบูทีคกรุงเทพ Tudor เป็นหนึ่งในการซื้อที่คุ้มค่าที่สุดที่มีให้ ถ้าการขายต่อหรือการลงทุนเป็นสิ่งสำคัญ Rolex ชนะอย่างชัดเจน ทั้งคู่เป็นนาฬิกาคุณภาพจริง คำถามคือคุณ optimize สำหรับอะไร'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/rolex-vs-tudor" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/rolex-vs-tudor" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex →</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href={`/${locale}/guides/best-pre-owned-watches-under-5000`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Watches Under $5k' : 'นาฬิกาต่ำกว่า $5k'} →</Link>
      </div>
    </div>
  )
}
