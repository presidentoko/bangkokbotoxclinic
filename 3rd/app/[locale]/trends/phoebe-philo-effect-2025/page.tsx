import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/phoebe-philo-effect-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'The Phoebe Philo Effect 2025 Thailand: Celine Bags Rising | ChicPreowned'
      : 'ผลกระทบ Phoebe Philo 2025 ในไทย: กระเป๋า Celine กำลังขึ้นราคา | ChicPreowned',
    description: isEn
      ? 'Philo-era Celine bags for Bangkok buyers — which pieces are rising, how to identify Philo vs Slimane, THB prices, investment case 2025.'
      : 'กระเป๋า Celine ยุค Philo สำหรับผู้ซื้อกรุงเทพ ชิ้นไหนกำลังขึ้นราคา วิธีระบุ Philo vs Slimane ราคาบาท คุณค่าการลงทุน 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function PhoebePhiloEffectTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const philoBags = isEn ? [
    { bag: 'Celine Phantom (Philo era)', price: `$800–$2,000 (${formatPriceTHB(800, 2000)})`, trend: '↑ Rising', note: 'Most sought-after Philo-era silhouette. Structured trapeze shape. Strong collector demand.' },
    { bag: 'Celine Trio Bag', price: `$180–$380 (${formatPriceTHB(180, 380)})`, trend: '→ Stable', note: 'Three-in-one bag system. Extremely practical, now affordable. Good entry piece.' },
    { bag: 'Celine Classic Box', price: `$500–$1,200 (${formatPriceTHB(500, 1200)})`, trend: '↑ Rising', note: 'Box clutch with gold chain. Philo\'s most recognizable design. Medium rising demand.' },
    { bag: 'Celine Cabas Vertical', price: `$400–$800 (${formatPriceTHB(400, 800)})`, trend: '↑ Rising', note: 'Large canvas tote with leather trim. Practical and rising.' },
    { bag: 'Celine Luggage Tote', price: `$600–$1,400 (${formatPriceTHB(600, 1400)})`, trend: '→ Stable', note: 'Iconic face-shaped tote. Widely available. Slimane continued this style.' },
    { bag: 'Celine Sangle Bucket', price: `$700–$1,500 (${formatPriceTHB(700, 1500)})`, trend: '↑ Rising', note: 'Strappy suede bucket bag — collector-tier Philo piece. Very niche, rising steeply.' },
  ] : [
    { bag: 'Celine Phantom (ยุค Philo)', price: `$800–$2,000 (${formatPriceTHB(800, 2000)})`, trend: '↑ ขึ้น', note: 'ซิลูเอตยุค Philo ที่มีความต้องการมากที่สุด รูปทรงสี่เหลี่ยมคางหมูมีโครงสร้าง ความต้องการของนักสะสมแข็งแกร่ง' },
    { bag: 'Celine Trio Bag', price: `$180–$380 (${formatPriceTHB(180, 380)})`, trend: '→ คงที่', note: 'ระบบกระเป๋าสามใบในหนึ่งเดียว ใช้งานได้จริงมาก ราคาเข้าถึงได้แล้ว ชิ้น entry ที่ดี' },
    { bag: 'Celine Classic Box', price: `$500–$1,200 (${formatPriceTHB(500, 1200)})`, trend: '↑ ขึ้น', note: 'กระเป๋าคลัทช์บ็อกซ์พร้อมสายโซ่ทอง การออกแบบที่รู้จักมากที่สุดของ Philo ความต้องการขึ้นระดับกลาง' },
    { bag: 'Celine Cabas Vertical', price: `$400–$800 (${formatPriceTHB(400, 800)})`, trend: '↑ ขึ้น', note: 'โท้ทผ้าใบขนาดใหญ่พร้อมขอบหนัง ใช้งานได้จริงและขึ้น' },
    { bag: 'Celine Luggage Tote', price: `$600–$1,400 (${formatPriceTHB(600, 1400)})`, trend: '→ คงที่', note: 'โท้ทรูปหน้าที่เป็นไอคอน มีให้เลือกอย่างกว้างขวาง Slimane สืบทอดสไตล์นี้' },
    { bag: 'Celine Sangle Bucket', price: `$700–$1,500 (${formatPriceTHB(700, 1500)})`, trend: '↑ ขึ้น', note: 'กระเป๋าบัคเก็ต suede มีสาย ชิ้นระดับนักสะสมยุค Philo ช่องแคบมาก ขึ้นอย่างรวดเร็ว' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Phoebe Philo Effect 2025' : 'ผลกระทบ Phoebe Philo 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'The Phoebe Philo Effect 2025' : 'ผลกระทบ Phoebe Philo 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'When Philo left Celine in 2018, her designs quietly became the most investable Celine ever made. The contrast with Slimane\'s logomania cemented Philo-era as a collector\'s movement. With the new Philo label launching, pre-owned Philo Celine is rising fast — including in Bangkok\'s secondary market.'
          : 'เมื่อ Philo ออกจาก Celine ในปี 2018 การออกแบบของเธอเงียบๆ กลายเป็น Celine ที่ลงทุนได้มากที่สุดเท่าที่เคยมีมา ความแตกต่างกับ logomania ของ Slimane ทำให้ยุค Philo กลายเป็นขบวนการของนักสะสม ด้วยการเปิดตัวแบรนด์ Philo ใหม่ Celine Philo มือสองกำลังขึ้นอย่างรวดเร็ว รวมถึงในตลาดรองกรุงเทพ'}
      </p>

      <div className="space-y-3 mb-10">
        {philoBags.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">{b.bag}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.trend.includes('↑') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.trend}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{b.note}</p>
              <p className="text-xs font-semibold text-amber-700">{b.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'How to identify Philo-era Celine' : 'วิธีระบุ Celine ยุค Philo'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'No accent on "CELINE" (without accent E)',
              'Interior: "CELINE PARIS Made in Italy/France"',
              'Hardware: understated gold or Palladium',
              'Period: 2008–2018',
              'Slimane era (2018+): "CÉLINE" with accent',
            ] : [
              'ไม่มีสำเนียงบน "CELINE" (ไม่มีสำเนียง E)',
              'ภายใน: "CELINE PARIS Made in Italy/France"',
              'ฮาร์ดแวร์: ทองหรือ Palladium แบบเรียบ',
              'ยุคสมัย: 2008–2018',
              'ยุค Slimane (2018+): "CÉLINE" มีสำเนียง',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'The new Philo label halo effect' : 'ผลเชิดชู Philo label ใหม่'}</h3>
          <p className="text-sm text-gray-600">{isEn ? 'Phoebe Philo launched her own label in 2023. This renewed interest is creating a halo effect on Philo-era Celine — buyers who cannot afford the new Philo pieces are turning to pre-owned Philo Celine instead. This dynamic is driving secondary market prices up.' : 'Phoebe Philo เปิดตัวแบรนด์ของตัวเองในปี 2023 ความสนใจที่ฟื้นฟูนี้กำลังสร้างผลเชิดชูบน Celine ยุค Philo ผู้ซื้อที่ไม่สามารถซื้อชิ้น Philo ใหม่ได้กำลังหันมาใช้ Philo Celine มือสองแทน กลไกนี้กำลังขับเคลื่อนราคาตลาดรองขึ้น'}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/phoebe-philo-effect-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/phoebe-philo-effect-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Celine Pre-Owned →' : 'Celine มือสอง →'}</Link>
        <Link href={`/${locale}/compare/loewe-vs-celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe vs Celine →</Link>
        <Link href={`/${locale}/trends/quiet-luxury-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Quiet Luxury 2025 →' : 'Quiet Luxury 2025 →'}</Link>
      </div>
    </div>
  )
}
