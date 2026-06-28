import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/miu-miu-rise-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Miu Miu Rise 2025 Thailand: Best Pre-Owned Bags to Buy Now | ChicPreowned'
      : 'การเพิ่มขึ้นของ Miu Miu 2025 ในไทย: กระเป๋ามือสองที่ดีที่สุดในการซื้อตอนนี้ | ChicPreowned',
    description: isEn
      ? 'Miu Miu Brand of the Year 2022–2024 — which Miu Miu bags are rising in pre-owned value for Thai buyers? Wander, Arcadie, vintage pieces ranked with THB prices.'
      : 'Miu Miu แบรนด์แห่งปี 2022–2024 กระเป๋า Miu Miu ไหนกำลังขึ้นมูลค่ามือสองสำหรับผู้ซื้อชาวไทย? Wander, Arcadie, ชิ้น vintage จัดอันดับพร้อมราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function MiuMiuRiseTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const bags = isEn ? [
    {
      bag: 'Miu Miu Wander Bag', range: `$800–1,400 (${formatPriceTHB(800, 1400)})`, trend: '↑ Rising fast',
      note: 'Miu Miu\'s breakout hit — sheepskin fur trim, slouchy silhouette, instantly recognisable. Limited production makes pre-owned scarce. Strong appreciation expected.',
    },
    {
      bag: 'Miu Miu Arcadie (Crystal)', range: `$1,200–2,200 (${formatPriceTHB(1200, 2200)})`, trend: '↑ Rising',
      note: 'Crystal-embellished version became a celebrity staple. Commands 2× the plain leather price. Condition critical — crystal bags show wear quickly.',
    },
    {
      bag: 'Miu Miu Mini Hobo', range: `$500–900 (${formatPriceTHB(500, 900)})`, trend: '→ Stable',
      note: 'Entry point into the Miu Miu pre-owned market. Canvas and nappa versions available. More practical and easier to authenticate than the Wander.',
    },
    {
      bag: 'Miu Miu Vintage (1990s–2000s)', range: `$300–1,200 (${formatPriceTHB(300, 1200)})`, trend: '↑ Rising steeply',
      note: 'Miuccia\'s early designs are being rediscovered. 1990s drawstring bucket bags and 2000s patent leather structured pieces all increasing. Strong niche collector base in Bangkok.',
    },
    {
      bag: 'Miu Miu Matelassé Leather', range: `$600–1,000 (${formatPriceTHB(600, 1000)})`, trend: '→ Stable',
      note: 'Miu Miu\'s answer to the quilted handbag at 40–50% of Chanel prices. Popular for Thai buyers who want the quilted aesthetic without the Chanel premium.',
    },
  ] : [
    {
      bag: 'Miu Miu Wander Bag', range: `$800–1,400 (${formatPriceTHB(800, 1400)})`, trend: '↑ ขึ้นเร็ว',
      note: 'กระเป๋าฮิตของ Miu Miu ขนสัตว์ sheepskin ซิลูเอตหย่อน รู้จักได้ทันที การผลิตจำกัดทำให้มือสองหายาก คาดว่าราคาจะขึ้นต่อเนื่อง',
    },
    {
      bag: 'Miu Miu Arcadie (คริสตัล)', range: `$1,200–2,200 (${formatPriceTHB(1200, 2200)})`, trend: '↑ ขึ้น',
      note: 'รุ่น crystal กลายเป็นของขวัญดาราที่ต้องการ ราคา 2× รุ่นหนังธรรมดา สภาพสำคัญมาก กระเป๋าคริสตัลแสดงการสวมใส่ได้เร็ว',
    },
    {
      bag: 'Miu Miu Mini Hobo', range: `$500–900 (${formatPriceTHB(500, 900)})`, trend: '→ คงที่',
      note: 'จุดเข้าสู่ตลาดมือสอง Miu Miu มีทั้งผ้าใบและหนัง nappa ใช้งานได้จริงและยืนยันความถูกต้องง่ายกว่า Wander',
    },
    {
      bag: 'Miu Miu Vintage (ทศวรรษ 1990–2000)', range: `$300–1,200 (${formatPriceTHB(300, 1200)})`, trend: '↑ ขึ้นชัน',
      note: 'การออกแบบยุคแรกของ Miuccia กำลังถูกค้นพบใหม่ กระเป๋าบัคเก็ต drawstring ทศวรรษ 1990 และหนังแก้ว 2000 ล้วนขึ้น ฐานนักสะสม niche ที่แข็งแกร่งในกรุงเทพ',
    },
    {
      bag: 'Miu Miu Matelassé หนัง', range: `$600–1,000 (${formatPriceTHB(600, 1000)})`, trend: '→ คงที่',
      note: 'คำตอบของ Miu Miu ต่อกระเป๋าลายตาราง 40–50% ของราคา Chanel ยอดนิยมสำหรับผู้ซื้อไทยที่ต้องการ aesthetic ลายตารางโดยไม่มีพรีเมียม Chanel',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Miu Miu Rise 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'The Miu Miu Rise: Which Pre-Owned Pieces Are Worth Buying?' : 'การเพิ่มขึ้นของ Miu Miu: ชิ้นมือสองไหนน่าซื้อ?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Miu Miu was named Brand of the Year by Lyst for three consecutive years (2022–2024). Miuccia Prada\'s sister brand has moved from niche cult to mainstream collector status. The pre-owned market is early — Bangkok buyers who move now are in a strong position.'
          : 'Miu Miu ได้รับการตั้งชื่อเป็นแบรนด์แห่งปีจาก Lyst สามปีติดต่อกัน (2022–2024) แบรนด์น้องสาวของ Miuccia Prada เปลี่ยนจาก niche cult เป็นสถานะนักสะสมกระแสหลัก ตลาดมือสองยังเร็วอยู่ ผู้ซื้อกรุงเทพที่ลงมือตอนนี้อยู่ในตำแหน่งที่ดี'}
      </p>

      <div className="space-y-4 mb-10">
        {bags.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-gray-900">{b.bag}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.trend.includes('เร็ว') || b.trend.includes('fast') ? 'bg-green-100 text-green-800' : b.trend.includes('ชัน') || b.trend.includes('steeply') ? 'bg-emerald-100 text-emerald-800' : b.trend.includes('↑') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.trend}</span>
              </div>
              <span className="text-xs font-semibold text-amber-700">{b.range}</span>
            </div>
            <p className="text-sm text-gray-600">{b.note}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Miu Miu vs Prada pre-owned' : 'Miu Miu vs Prada มือสอง'}</h3>
          <p className="text-sm text-gray-600">
            {isEn
              ? 'Prada pre-owned is more established and liquid. Miu Miu is higher risk, higher reward. If the brand momentum continues, early buyers will benefit significantly. If the trend reverses, Miu Miu will underperform Prada.'
              : 'Prada มือสองมีฐานที่มั่นคงกว่าและ liquid กว่า Miu Miu มีความเสี่ยงสูงกว่าผลตอบแทนสูงกว่า ถ้า momentum แบรนด์ดำเนินต่อ ผู้ซื้อแรกจะได้รับประโยชน์มาก ถ้าเทรนด์กลับ Miu Miu จะด้อยกว่า Prada'}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Authentication tips' : 'เคล็ดลับยืนยันความถูกต้อง'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              '"MIU MIU" embossed on interior tab — no decorative stitching',
              'Hardware: Miu Miu engraved on clasp, lock, zipper pull',
              'Serial format: 2 letters + 4 digits (e.g., FP1234)',
              'Made in Italy on leather tab — consistent font, no italics',
            ] : [
              '"MIU MIU" นูนบน tab ภายใน ไม่มีการเย็บตกแต่ง',
              'ฮาร์ดแวร์: Miu Miu แกะสลักบนตัวล็อค, กุญแจ, หัวซิป',
              'รูปแบบซีเรียล: 2 ตัวอักษร + 4 หลัก (เช่น FP1234)',
              'Made in Italy บน tab หนัง ฟอนต์สม่ำเสมอ ไม่ตัวเอน',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/miu-miu-rise-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/miu-miu-rise-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/miu-miu`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu →</Link>
        <Link href={`/${locale}/compare/prada-vs-miu-miu`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Miu Miu →</Link>
        <Link href={`/${locale}/trends/best-luxury-bags-to-invest-2026`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Best Bags to Invest' : 'กระเป๋าลงทุนดีที่สุด'} →</Link>
      </div>
    </div>
  )
}
