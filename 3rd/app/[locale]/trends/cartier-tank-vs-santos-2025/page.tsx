import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/cartier-tank-vs-santos-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Cartier Tank vs Santos Thailand 2025: Which Holds Value? | ChicPreowned'
      : 'Cartier Tank vs Santos ในไทย 2025: อันไหนรักษามูลค่าได้ดีกว่า? | ChicPreowned',
    description: isEn
      ? 'Cartier Tank vs Santos for Bangkok buyers 2025 — resale retention, THB prices, which models appreciate, and which is the better pre-owned investment in Thailand.'
      : 'Cartier Tank vs Santos สำหรับผู้ซื้อกรุงเทพ 2025 การรักษามูลค่าขายต่อ ราคาบาท รุ่นไหนขึ้นราคา และอันไหนลงทุนมือสองได้ดีกว่าในไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function CartierTankVsSantosTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const models = isEn ? [
    {
      name: 'Cartier Tank Louis (18k gold)', side: 'tank', range: `$4,500–12,000 (${formatPriceTHB(4500, 12000)})`, trend: '↑ Appreciating',
      note: 'The Tank Louis in 18k yellow gold is among the most iconic dress watches ever made. Pre-owned values have increased steadily. The 1970s–1990s Tank Louis in excellent condition now commands premiums over original retail. Yellow gold specifically benefits from the return-to-classic trend in Bangkok.',
    },
    {
      name: 'Cartier Tank Must (steel, quartz)', side: 'tank', range: `$1,800–3,200 (${formatPriceTHB(1800, 3200)})`, trend: '↑ Rising fast',
      note: 'The Tank Must relaunch (2021) created significant demand for the steel quartz version. Accessible entry into the Tank family. The Must is more liquid — faster resale. The green alligator strap version commands a significant premium in the Bangkok secondary market.',
    },
    {
      name: 'Cartier Santos Medium (steel)', side: 'santos', range: `$3,500–5,500 (${formatPriceTHB(3500, 5500)})`, trend: '→ Stable',
      note: 'The world\'s first aviator watch (1904). The 2018 relaunch with ADLC coating and quick-change strap system modernised the line. Pre-owned values stable and very liquid — among the easiest Cartier watches to resell in Thailand. Bicolor (steel/gold) commands a premium.',
    },
    {
      name: 'Cartier Santos XL (steel)', side: 'santos', range: `$5,000–8,000 (${formatPriceTHB(5000, 8000)})`, trend: '→ Stable',
      note: 'Slightly less liquid than the Medium but same base market. The Calibre de Cartier automatic movement adds a 15–20% premium over the quartz Santos. Excellent choice for Bangkok buyers who want a sport-elegant watch that works across occasions.',
    },
  ] : [
    {
      name: 'Cartier Tank Louis (ทอง 18k)', side: 'tank', range: `$4,500–12,000 (${formatPriceTHB(4500, 12000)})`, trend: '↑ ขึ้น',
      note: 'Tank Louis ทอง 18k คือหนึ่งในนาฬิกาชุดที่มีไอคอนมากที่สุดในประวัติศาสตร์ มูลค่ามือสองขึ้นสม่ำเสมอ ชิ้นปี 1970–1990 ในสภาพดีเยี่ยมตอนนี้ราคาสูงกว่าราคาขายปลีกเดิม ทองคำเหลืองได้รับประโยชน์จากเทรนด์กลับสู่คลาสสิกในกรุงเทพ',
    },
    {
      name: 'Cartier Tank Must (เหล็ก, quartz)', side: 'tank', range: `$1,800–3,200 (${formatPriceTHB(1800, 3200)})`, trend: '↑ ขึ้นเร็ว',
      note: 'การเปิดตัวใหม่ Tank Must (2021) สร้างความต้องการสำหรับรุ่น quartz เหล็กอย่างมาก จุดเข้าสู่ตระกูล Tank ที่เข้าถึงได้ Must มีสภาพคล่องสูงกว่า ขายต่อได้เร็วกว่า รุ่นสาย alligator สีเขียวมีพรีเมียมในตลาดมือสองกรุงเทพ',
    },
    {
      name: 'Cartier Santos Medium (เหล็ก)', side: 'santos', range: `$3,500–5,500 (${formatPriceTHB(3500, 5500)})`, trend: '→ คงที่',
      note: 'นาฬิกาสำหรับนักบินเรือนแรกของโลก (1904) การเปิดตัวใหม่ปี 2018 พร้อม ADLC coating และระบบเปลี่ยนสายด่วน มูลค่ามือสองคงที่และสภาพคล่องสูงมาก เป็นหนึ่งในนาฬิกา Cartier ที่ขายต่อได้ง่ายที่สุดในไทย Bicolor (เหล็ก/ทอง) มีพรีเมียม',
    },
    {
      name: 'Cartier Santos XL (เหล็ก)', side: 'santos', range: `$5,000–8,000 (${formatPriceTHB(5000, 8000)})`, trend: '→ คงที่',
      note: 'สภาพคล่องต่ำกว่า Medium เล็กน้อย แต่ฐานตลาดเดียวกัน จักรกล Calibre de Cartier automatic มีพรีเมียม 15–20% เหนือ Santos quartz เหมาะสำหรับผู้ซื้อกรุงเทพที่ต้องการนาฬิกา sport-elegant ที่ใช้งานได้หลายโอกาส',
    },
  ]

  const rows = isEn ? [
    { aspect: 'Launch', tank: '1917 — Louis Cartier inspired by Renault FT tank', santos: '1904 — for aviator Alberto Santos-Dumont' },
    { aspect: 'Shape', tank: 'Rectangular, parallel sides, thin profile', santos: 'Square/round, visible screws on bezel, sport-influenced' },
    { aspect: 'Best resale', tank: 'Tank Louis Cartier gold (vintage)', santos: 'Santos Medium steel ADLC (2018+)' },
    { aspect: 'Entry pre-owned', tank: `Tank Must quartz $1,800–3,200 (${formatPriceTHB(1800, 3200)})`, santos: `Santos Medium quartz $3,500–4,500 (${formatPriceTHB(3500, 4500)})` },
    { aspect: 'Investment tier', tank: 'B to A+ (vintage gold)', santos: 'B (excellent but stable)' },
    { aspect: 'Bangkok boutique', tank: 'Cartier at Central Embassy, Siam Paragon', santos: 'Same boutiques — bicolor on display always' },
  ] : [
    { aspect: 'เปิดตัว', tank: '1917 — Louis Cartier ได้รับแรงบันดาลใจจากรถถัง Renault FT', santos: '1904 — สำหรับนักบิน Alberto Santos-Dumont' },
    { aspect: 'รูปทรง', tank: 'สี่เหลี่ยมผืนผ้า ด้านขนาน บางเฉียบ', santos: 'สี่เหลี่ยม/กลม สกรูบนวงแหวนมองเห็นได้ ดูกีฬา' },
    { aspect: 'ขายต่อดีที่สุด', tank: 'Tank Louis Cartier ทอง (vintage)', santos: 'Santos Medium เหล็ก ADLC (2018+)' },
    { aspect: 'ราคาเข้าถึงมือสอง', tank: `Tank Must quartz $1,800–3,200 (${formatPriceTHB(1800, 3200)})`, santos: `Santos Medium quartz $3,500–4,500 (${formatPriceTHB(3500, 4500)})` },
    { aspect: 'ระดับการลงทุน', tank: 'B ถึง A+ (vintage ทอง)', santos: 'B (ยอดเยี่ยมแต่คงที่)' },
    { aspect: 'บูทีคกรุงเทพ', tank: 'Cartier ที่ Central Embassy, Siam Paragon', santos: 'บูทีคเดียวกัน bicolor วางจำหน่ายเสมอ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Cartier Tank vs Santos 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Cartier Tank vs Santos 2025: Which Holds Value Pre-Owned?' : 'Cartier Tank vs Santos 2025: อันไหนรักษามูลค่ามือสองได้ดีกว่า?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two of Cartier\'s most iconic lines — both with century-long histories, both genuinely appreciating pre-owned. But they serve different wearers and have different investment trajectories. Bangkok context and THB prices included.'
          : 'สองไลน์ที่เป็นไอคอนที่สุดของ Cartier ทั้งสองมีประวัติยาวนานหนึ่งศตวรรษ ทั้งสองมีมูลค่าเพิ่มขึ้นในตลาดมือสองจริงๆ แต่ตอบสนองผู้สวมใส่ต่างกันและมีเส้นทางการลงทุนต่างกัน รวมบริบทกรุงเทพและราคาบาท'}
      </p>

      <div className="space-y-4 mb-10">
        {models.map((m, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.side === 'tank' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-700'}`}>{m.side === 'tank' ? 'Tank' : 'Santos'}</span>
                <h2 className="font-semibold text-gray-900">{m.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.trend.includes('fast') || m.trend.includes('เร็ว') ? 'bg-green-100 text-green-800' : m.trend.includes('↑') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.trend}</span>
              </div>
              <span className="text-xs font-semibold text-amber-700">{m.range}</span>
            </div>
            <p className="text-sm text-gray-600">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-slate-700">Tank</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-700">Santos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.tank}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.santos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'The vintage Tank opportunity' : 'โอกาส Tank vintage'}</h3>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'The best pre-owned Cartier opportunity right now: a 1970s–1990s Tank Louis Cartier in 18k yellow gold, excellent condition, original papers. These have increased 40–60% in the past five years. Look for reference 2442 or 1654. Budget: $6,000–15,000 (฿216,000–540,000) depending on condition and provenance.'
            : 'โอกาส Cartier มือสองที่ดีที่สุดตอนนี้: Tank Louis Cartier ปี 1970–1990 ใน 18k ทองคำเหลือง สภาพดีเยี่ยม กล่องและบัตรเดิม สิ่งเหล่านี้เพิ่มขึ้น 40–60% ในห้าปีที่ผ่านมา ค้นหาเลขอ้างอิง 2442 หรือ 1654 งบประมาณ $6,000–15,000 (฿216,000–540,000) ขึ้นกับสภาพและต้นกำเนิด'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/cartier-tank-vs-santos-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/cartier-tank-vs-santos-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier →</Link>
        <Link href={`/${locale}/compare/cartier-vs-bulgari`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Bvlgari →</Link>
        <Link href={`/${locale}/compare/rolex-vs-cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Cartier →</Link>
      </div>
    </div>
  )
}
