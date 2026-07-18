import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/saint-laurent-vs-valentino'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Saint Laurent vs Valentino Thailand 2025: Which Holds Value? | ChicPreowned'
      : 'Saint Laurent vs Valentino ในไทย 2025: อันไหนรักษามูลค่าได้ดีกว่า? | ChicPreowned',
    description: isEn
      ? 'Saint Laurent vs Valentino for Thailand buyers 2025 — Parisian cool vs Roman romance, resale retention, THB prices, Rockstud caution, and investment tier comparison.'
      : 'Saint Laurent vs Valentino สำหรับผู้ซื้อในไทย 2025 ความเก๋แบบปารีส vs โรแมนติกแบบโรมัน อัตราการรักษามูลค่า ราคาบาท คำเตือน Rockstud และการเปรียบเทียบระดับการลงทุน',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function SaintLaurentVsValentinoTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Founded', ysl: 'Paris, 1961 (renamed Saint Laurent 2012)', val: 'Rome, 1960' },
    { aspect: 'Design direction', ysl: 'Parisian cool — structured black, gold hardware', val: 'Roman romance — floral, stud, sweeping silhouettes' },
    { aspect: 'New price', ysl: `$800–3,500 (${formatPriceTHB(800, 3500)})`, val: `$1,100–4,200 (${formatPriceTHB(1100, 4200)})` },
    { aspect: 'Pre-owned entry', ysl: `$450–800 (${formatPriceTHB(450, 800)}) Lou Camera, worn`, val: `$550–900 (${formatPriceTHB(550, 900)}) Rockstud, worn` },
    { aspect: 'Resale retention', ysl: '45–65% (Sac de Jour: 55–70%)', val: '35–55% (Rockstud fading)' },
    { aspect: 'Investment tier', ysl: 'B (stable, limited upside)', val: 'C+ (trend-dependent)' },
    { aspect: 'Trend sensitivity', ysl: 'Low — Parisian minimalism is perennial', val: 'Medium-high — stud trend peaked ~2015–2022' },
    { aspect: 'Bangkok boutique', ysl: 'YSL at EmSphere, Siam Paragon', val: 'Valentino at Emporium, CentralWorld' },
  ] : [
    { aspect: 'ก่อตั้ง', ysl: 'ปารีส 1961 (เปลี่ยนชื่อเป็น Saint Laurent 2012)', val: 'โรม 1960' },
    { aspect: 'ทิศทางดีไซน์', ysl: 'ความเก๋ปารีเซียง สีดำมีโครงสร้าง ฮาร์ดแวร์ทอง', val: 'ความโรแมนติกแบบโรมัน ดอกไม้ หมุด ซิลูเอตกว้าง' },
    { aspect: 'ราคาใหม่', ysl: `$800–3,500 (${formatPriceTHB(800, 3500)})`, val: `$1,100–4,200 (${formatPriceTHB(1100, 4200)})` },
    { aspect: 'มือสองเริ่มต้น', ysl: `$450–800 (${formatPriceTHB(450, 800)}) Lou Camera สภาพใช้`, val: `$550–900 (${formatPriceTHB(550, 900)}) Rockstud สภาพใช้` },
    { aspect: 'อัตราการรักษามูลค่า', ysl: '45–65% (Sac de Jour: 55–70%)', val: '35–55% (Rockstud ลดลง)' },
    { aspect: 'ระดับการลงทุน', ysl: 'B (คงที่ ศักยภาพสูงขึ้นจำกัด)', val: 'C+ (ขึ้นอยู่กับเทรนด์)' },
    { aspect: 'ความไวต่อเทรนด์', ysl: 'ต่ำ — มินิมอลลิสม์ปารีเซียงคงทน', val: 'ปานกลาง-สูง เทรนด์หมุดพุ่งสูง ~2015–2022' },
    { aspect: 'บูทีคกรุงเทพ', ysl: 'YSL ที่ EmSphere, Siam Paragon', val: 'Valentino ที่ Emporium, CentralWorld' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Saint Laurent vs Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Saint Laurent vs Valentino (2025): Which Holds Value Better?' : 'Saint Laurent vs Valentino (2025): อันไหนรักษามูลค่าได้ดีกว่า?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both serve different aesthetics — and have very different resale trajectories. Saint Laurent\'s Parisian minimalism ages gracefully; Valentino\'s Rockstud era peaked ~2019 and is softening in pre-owned markets.'
          : 'ทั้งสองรับใช้สุนทรียศาสตร์ที่แตกต่างและมีวิถีการขายต่อที่แตกต่างมาก มินิมอลลิสม์ปารีเซียงของ Saint Laurent อายุสวยงาม ยุค Rockstud ของ Valentino พุ่งสูงสุด ~2019 และกำลังอ่อนตัวในตลาดมือสอง'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Saint Laurent</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-red-700">Valentino</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.ysl}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'Sac de Jour: the Saint Laurent exception' : 'Sac de Jour: ข้อยกเว้นของ Saint Laurent'}</h3>
        <p className="text-sm text-amber-800">
          {isEn
            ? `The Sac de Jour is YSL's most investment-worthy bag — structured, understated, professional. Pre-owned entry: $600–1,000 (${formatPriceTHB(600, 1000)}) worn, $900–1,400 (${formatPriceTHB(900, 1400)}) excellent. Retention: 55–70%. The Nano has particularly consistent pre-owned demand.`
            : `Sac de Jour คือกระเป๋าที่ควรค่าแก่การลงทุนที่สุดของ YSL มีโครงสร้าง ไม่โอ้อวด เป็นมืออาชีพ มือสองเริ่มต้น: $600–1,000 (${formatPriceTHB(600, 1000)}) สภาพใช้, $900–1,400 (${formatPriceTHB(900, 1400)}) สภาพดีเยี่ยม อัตราการรักษา: 55–70% Nano มีความต้องการมือสองสม่ำเสมอเป็นพิเศษ`}
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-red-900 mb-2">{isEn ? 'Rockstud caution: a trend in decline' : 'คำเตือน Rockstud: เทรนด์ที่กำลังลดลง'}</h3>
        <p className="text-sm text-red-800">
          {isEn
            ? 'The Valentino Rockstud hit peak ~2015-2019. Pre-owned prices have softened significantly. A $1,500 Rockstud from 2018 now sells for $400–600 pre-owned — under 40% of retail. If buying Valentino pre-owned, the Roman Stud (softer, 2020s) and Loco bag have better trajectories.'
            : 'Valentino Rockstud พุ่งสูงสุด ~2015-2019 ราคามือสองอ่อนตัวอย่างมีนัยสำคัญ Rockstud ราคา $1,500 จากปี 2018 ตอนนี้ขายมือสองได้ $400–600 — ต่ำกว่า 40% ของราคาขาย ถ้าซื้อ Valentino มือสอง Roman Stud (นุ่มกว่า ยุค 2020) และกระเป๋า Loco มีวิถีที่ดีกว่า'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/saint-laurent-vs-valentino" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/saint-laurent-vs-valentino" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/saint-laurent`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent →</Link>
        <Link href={`/${locale}/brands/valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Valentino →</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL vs Celine →</Link>
      </div>
    </div>
  )
}
