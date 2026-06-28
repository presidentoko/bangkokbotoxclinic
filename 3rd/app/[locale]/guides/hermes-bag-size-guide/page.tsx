import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/hermes-bag-size-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Hermès Bag Size Guide Thailand 2025: Birkin, Kelly, Constance | ChicPreowned'
      : 'คู่มือขนาดกระเป๋า Hermès ในไทย 2025: Birkin, Kelly, Constance | ChicPreowned',
    description: isEn
      ? 'Hermès bag size guide for Thai buyers — Birkin 25/30/35, Kelly 25/28/32/35, Constance 14/18/24. Which size holds value best? THB prices.'
      : 'คู่มือขนาดกระเป๋า Hermès สำหรับผู้ซื้อชาวไทย — Birkin 25/30/35 Kelly 25/28/32/35 Constance 14/18/24 ขนาดไหนคงมูลค่าดีที่สุด ราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function HermesSizeTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const birkin = isEn ? [
    { size: 'Birkin 25', dims: '25×20×13 cm', thb: '฿480,000–฿720,000', note: 'Most coveted size. Tiny inside — fits phone, cards, lips. Investment-grade. Hardest to source.' },
    { size: 'Birkin 30', dims: '30×22×16 cm', thb: '฿520,000–฿900,000', note: 'Most balanced Birkin. Daily luxury use. Fits all essentials. Most produced size.' },
    { size: 'Birkin 35', dims: '35×25×18 cm', thb: '฿580,000–฿1,050,000', note: 'The original "working woman" size. Fits A4 folder. Victoria Beckham\'s favorite.' },
    { size: 'Birkin 40', dims: '40×30×20 cm', thb: '฿640,000–฿1,200,000+', note: 'Largest standard Birkin. Rare. More for travel than everyday.' },
  ] : [
    { size: 'Birkin 25', dims: '25×20×13 ซม.', thb: '฿480,000–฿720,000', note: 'ขนาดที่ทุกคนอยากได้มากที่สุด เล็กมาก ใส่ได้แค่โทรศัพท์ บัตร ลิปสติก ระดับลงทุน หาได้ยากที่สุด' },
    { size: 'Birkin 30', dims: '30×22×16 ซม.', thb: '฿520,000–฿900,000', note: 'Birkin ที่สมดุลที่สุด ใช้งานหรูรายวัน ใส่ของจำเป็นได้ทุกอย่าง ผลิตมากที่สุด' },
    { size: 'Birkin 35', dims: '35×25×18 ซม.', thb: '฿580,000–฿1,050,000', note: 'Birkin "ผู้หญิงทำงาน" ต้นฉบับ ใส่แฟ้ม A4 ได้ ของโปรด Victoria Beckham' },
    { size: 'Birkin 40', dims: '40×30×20 ซม.', thb: '฿640,000–฿1,200,000+', note: 'Birkin มาตรฐานที่ใหญ่ที่สุด หายาก ใช้เดินทางมากกว่าใช้ทุกวัน' },
  ]

  const kelly = isEn ? [
    { size: 'Kelly 25', dims: '25×17×14 cm', thb: '฿380,000–฿580,000', note: 'Most wanted Kelly. Evening-appropriate. Single top handle. Very structured.' },
    { size: 'Kelly 28', dims: '28×20×16 cm', thb: '฿420,000–฿650,000', note: 'Between 25 and 32. Popular in Sellier (stiff) and Retourné (soft).' },
    { size: 'Kelly 32', dims: '32×23×14 cm', thb: '฿450,000–฿720,000', note: 'Classic work-to-evening. Elongated profile. Grace Kelly\'s original size.' },
    { size: 'Kelly 35', dims: '35×25×14 cm', thb: '฿500,000–฿850,000', note: 'Largest standard Kelly. Less feminine, more utilitarian. Good for tall buyers.' },
  ] : [
    { size: 'Kelly 25', dims: '25×17×14 ซม.', thb: '฿380,000–฿580,000', note: 'Kelly ที่ต้องการมากที่สุด เหมาะงานเย็น ที่จับด้านบนเดี่ยว แข็งทรงมาก' },
    { size: 'Kelly 28', dims: '28×20×16 ซม.', thb: '฿420,000–฿650,000', note: 'ระหว่าง 25 และ 32 ยอดนิยมทั้งแบบ Sellier (แข็ง) และ Retourné (นิ่ม)' },
    { size: 'Kelly 32', dims: '32×23×14 ซม.', thb: '฿450,000–฿720,000', note: 'คลาสสิกจากงานถึงเย็น โปรไฟล์ยาวขึ้น ขนาดต้นฉบับของ Grace Kelly' },
    { size: 'Kelly 35', dims: '35×25×14 ซม.', thb: '฿500,000–฿850,000', note: 'Kelly มาตรฐานที่ใหญ่ที่สุด ไม่ค่อยเฟมินีน ใช้งานได้จริง เหมาะผู้ซื้อรูปร่างสูง' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Hermès Size Guide' : 'คู่มือขนาด Hermès'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Hermès Bag Size Guide' : 'คู่มือขนาดกระเป๋า Hermès'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Hermès Birkin and Kelly both come in four standard sizes. For Thai buyers: Birkin 30 is the most available, Kelly 28 is the most versatile. Prices below reflect 2025 pre-owned market in Thailand.'
          : 'Hermès Birkin และ Kelly มีสี่ขนาดมาตรฐาน สำหรับผู้ซื้อชาวไทย Birkin 30 หาได้ง่ายที่สุด Kelly 28 เปลี่ยนใช้ได้หลากหลายที่สุด ราคาด้านล่างสะท้อนตลาดมือสองไทย 2025'}
      </p>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Birkin</h2>
      <div className="space-y-3 mb-8">
        {birkin.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-gray-900">{b.size}</span>
                <span className="text-xs text-gray-400 ml-2">{b.dims}</span>
              </div>
              <span className="text-sm font-semibold text-amber-700">{b.thb}</span>
            </div>
            <p className="text-sm text-gray-600">{b.note}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Kelly</h2>
      <div className="space-y-3 mb-10">
        {kelly.map((k, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-gray-900">{k.size}</span>
                <span className="text-xs text-gray-400 ml-2">{k.dims}</span>
              </div>
              <span className="text-sm font-semibold text-amber-700">{k.thb}</span>
            </div>
            <p className="text-sm text-gray-600">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/hermes-bag-size-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/hermes-bag-size-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Hermès Pre-Owned →' : 'Hermès มือสอง →'}</Link>
        <Link href={`/${locale}/guides/hermes-birkin-vs-kelly`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Birkin vs Kelly →</Link>
      </div>
    </div>
  )
}
