import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/watch-buying-guide-thailand'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Pre-Owned Watch Buying Guide Thailand 2025 | ChicPreowned' : 'คู่มือซื้อนาฬิกามือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Complete guide to buying pre-owned luxury watches in Thailand — Rolex, AP, Patek, Omega. Where to buy in Bangkok, grey market tips, duty on imported watches.'
      : 'คู่มือครบถ้วนการซื้อนาฬิกา luxury มือสองในไทย — Rolex, AP, Patek, Omega. ซื้อที่ไหนในกรุงเทพ ตลาด grey market ภาษีนำเข้า',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function WatchBuyingGuideTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Trends' : 'เทรนด์'}</span>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Watch Buying Guide Thailand' : 'คู่มือซื้อนาฬิกาในไทย'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Pre-Owned Watch Buying Guide Thailand 2025' : 'คู่มือซื้อนาฬิกามือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Thailand\'s watch market is uniquely positioned — strong grey market, lower duty than Japan, and a thriving collector community in Bangkok.'
          : 'ตลาดนาฬิกาในไทยมีตำแหน่งที่ไม่เหมือนใคร — Grey market แข็งแกร่ง ภาษีต่ำกว่าญี่ปุ่น และชุมชนนักสะสมในกรุงเทพที่คึกคัก'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEn ? 'Budget Guide (THB)' : 'คู่มืองบประมาณ (บาท)'}</h2>
        <div className="space-y-4">
          {(isEn ? [
            { budget: 'Under ฿50,000', watches: 'Tissot PRX, Longines HydroConquest, Orient Bambino — quality Swiss at entry price', verdict: 'Good value; not luxury resale assets' },
            { budget: '฿50,000–150,000', watches: 'Omega Seamaster 300M, TAG Heuer Carrera, Tudor Black Bay — serious sports watches', verdict: 'Strong entry to collector territory' },
            { budget: '฿150,000–500,000', watches: 'Rolex Datejust/Oyster, AP Code 11:59, Patek Calatrava — investment grade begins here', verdict: 'Buy carefully; condition matters enormously' },
            { budget: '฿500,000+', watches: 'Rolex Submariner/Daytona, AP Royal Oak, Patek Aquanaut — above-retail allocation watches', verdict: 'Grey market only; authenticate every piece' },
          ] : [
            { budget: 'ต่ำกว่า 50,000 บาท', watches: 'Tissot PRX, Longines HydroConquest, Orient Bambino — Swiss คุณภาพดีราคาเริ่มต้น', verdict: 'คุ้มค่าดี แต่ไม่ใช่สินทรัพย์ resale' },
            { budget: '50,000–150,000 บาท', watches: 'Omega Seamaster 300M, TAG Heuer Carrera, Tudor Black Bay — sports watches จริงจัง', verdict: 'เข้าถึงระดับนักสะสมได้ดี' },
            { budget: '150,000–500,000 บาท', watches: 'Rolex Datejust/Oyster, AP Code 11:59, Patek Calatrava — เริ่มต้น investment grade', verdict: 'ซื้อระวัง สภาพสำคัญมาก' },
            { budget: '500,000+ บาท', watches: 'Rolex Submariner/Daytona, AP Royal Oak, Patek Aquanaut — นาฬิกา above-retail', verdict: 'Grey market เท่านั้น ตรวจสอบทุกชิ้น' },
          ]).map((tier, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5">
              <div className="font-semibold text-gray-900 mb-1">{tier.budget}</div>
              <div className="text-sm text-gray-600 mb-2">{tier.watches}</div>
              <div className="text-xs text-gray-400">{tier.verdict}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEn ? 'Where to Buy in Bangkok' : 'ซื้อที่ไหนในกรุงเทพ'}</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {(isEn ? [
            { name: 'MBK Floor 4', type: 'Grey market', desc: 'Bangkok\'s famous grey market — many vendors, varied quality. Bring a watchmaker or use someone you trust. Prices can be negotiated.' },
            { name: 'Icon Siam / Central Embassy', type: 'Authorized Dealers', desc: 'Official ADs for Rolex (King Power), AP (AP House), Patek. Retail only — but building the AD relationship for future allocation.' },
            { name: 'Facebook / Line Watch Groups', type: 'P2P Thai sellers', desc: '"นาฬิกามือสอง" Facebook groups with active community. Better prices than shops but requires more diligence on authentication.' },
            { name: 'Watchbox / Chrono24', type: 'International platforms', desc: 'Price reference for fair market value. Not Thailand-specific but useful for setting your ceiling price.' },
          ] : [
            { name: 'MBK ชั้น 4', type: 'Grey market', desc: 'Grey market ชื่อดังกรุงเทพ — ผู้ขายหลายเจ้า คุณภาพต่างกัน พาช่างนาฬิกาไปด้วยหรือใช้คนที่ไว้ใจได้ ต่อราคาได้' },
            { name: 'Icon Siam / Central Embassy', type: 'ตัวแทนจำหน่ายอย่างเป็นทางการ', desc: 'AD อย่างเป็นทางการของ Rolex (King Power), AP (AP House), Patek ราคา retail เท่านั้น แต่สร้างความสัมพันธ์กับ AD สำหรับการจัดสรรในอนาคต' },
            { name: 'Facebook / Line กลุ่มนาฬิกา', type: 'P2P คนไทย', desc: 'กลุ่ม Facebook "นาฬิกามือสอง" ชุมชนคึกคัก ราคาดีกว่าร้าน แต่ต้องตรวจสอบมากขึ้น' },
            { name: 'Watchbox / Chrono24', type: 'แพลตฟอร์มต่างประเทศ', desc: 'ดูราคาอ้างอิงตลาดที่ยุติธรรม ไม่ใช่ของไทยโดยเฉพาะ แต่ดีสำหรับตั้งราคาสูงสุด' },
          ]).map((place, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="font-semibold text-gray-900">{place.name}</div>
              <div className="text-xs text-gray-400 mb-2">{place.type}</div>
              <div className="text-sm text-gray-600">{place.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 mb-8">
        <strong>{isEn ? 'Import duty note:' : 'หมายเหตุภาษีนำเข้า:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Thailand levies 30% import duty on watches (HS 9102). When buying from abroad, factor this in — a ฿200,000 Rolex from Japan has ฿60,000 in theoretical duty (rarely enforced for personal use, but relevant for parallel importers).'
            : 'ไทยเก็บภาษีนำเข้านาฬิกา 30% (HS 9102) เมื่อซื้อจากต่างประเทศ คำนวณด้วย — Rolex 200,000 บาทจากญี่ปุ่นมีภาษีทางทฤษฎี 60,000 บาท (มักไม่ถูกตรวจสำหรับใช้ส่วนตัว แต่สำคัญสำหรับ parallel importers)'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/watch-buying-guide-thailand" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/watch-buying-guide-thailand" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Guide →</Link>
        <Link href={`/${locale}/brands/omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Guide →</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
