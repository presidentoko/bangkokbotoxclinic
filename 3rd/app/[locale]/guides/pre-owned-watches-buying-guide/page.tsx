import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/pre-owned-watches-buying-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Pre-Owned Luxury Watches Buying Guide Thailand 2025 | ChicPreowned' : 'คู่มือซื้อนาฬิกา Luxury มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'How to buy pre-owned Rolex, Omega, Patek Philippe in Thailand. THB prices, authentication tips, where to buy in Bangkok.'
      : 'คู่มือซื้อนาฬิกา Rolex, Omega, Patek Philippe มือสองในไทย ราคาบาท วิธีตรวจสอบความแท้ และที่ซื้อในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function WatchGuideThailandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Pre-Owned Watches Guide' : 'คู่มือนาฬิกามือสอง'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Pre-Owned Luxury Watches in Thailand 2025' : 'นาฬิกา Luxury มือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Complete buying guide — authentication, pricing in THB, and where to find good deals in Bangkok.'
          : 'คู่มือซื้อฉบับสมบูรณ์ — การตรวจสอบความแท้ ราคาเป็นบาท และที่หาดีลดีๆ ในกรุงเทพ'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Best Watches to Buy Pre-Owned in Thailand' : 'นาฬิกาที่ซื้อมือสองคุ้มค่าที่สุดในไทย'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Watch' : 'นาฬิกา'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'New (THB)' : 'ราคาใหม่ (บาท)'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Pre-owned (THB)' : 'มือสอง (บาท)'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Verdict' : 'คำแนะนำ'}</th>
              </tr>
            </thead>
            <tbody>
              {(isEn ? [
                { name: 'Rolex Datejust 36', newPrice: '฿290,000', preowned: '฿195,000–250,000', verdict: 'Best entry Rolex' },
                { name: 'Omega Speedmaster Pro', newPrice: '฿265,000', preowned: '฿145,000–200,000', verdict: 'Iconic, great value' },
                { name: 'Omega Seamaster 300M', newPrice: '฿260,000', preowned: '฿130,000–185,000', verdict: 'James Bond, water-safe' },
                { name: 'TAG Heuer Carrera Heuer-01', newPrice: '฿128,000', preowned: '฿68,000–95,000', verdict: 'Best <100k THB chrono' },
                { name: 'Rolex Submariner 126610LN', newPrice: '฿370,000', preowned: '฿445,000–580,000', verdict: 'Above retail — buy used' },
              ] : [
                { name: 'Rolex Datejust 36', newPrice: '290,000 บาท', preowned: '195,000–250,000 บาท', verdict: 'Rolex เริ่มต้นที่ดีที่สุด' },
                { name: 'Omega Speedmaster Pro', newPrice: '265,000 บาท', preowned: '145,000–200,000 บาท', verdict: 'คุ้มค่ามาก' },
                { name: 'Omega Seamaster 300M', newPrice: '260,000 บาท', preowned: '130,000–185,000 บาท', verdict: 'ทนน้ำ เหมาะกับไทย' },
                { name: 'TAG Heuer Carrera Heuer-01', newPrice: '128,000 บาท', preowned: '68,000–95,000 บาท', verdict: 'โครโนที่ดีที่สุดใต้ 100k' },
                { name: 'Rolex Submariner 126610LN', newPrice: '370,000 บาท', preowned: '445,000–580,000 บาท', verdict: 'เหนือราคาปลีก — ซื้อมือสอง' },
              ]).map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{r.name}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{r.newPrice}</td>
                  <td className="text-right py-3 px-4 text-green-700 font-medium">{r.preowned}</td>
                  <td className="text-right py-3 px-4 text-xs text-gray-500">{r.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Thailand-Specific Tips' : 'เคล็ดลับเฉพาะสำหรับไทย'}
        </h2>
        <ul className="text-sm text-gray-600 space-y-3">
          {isEn ? <>
            <li><strong>Humidity:</strong> Thailand's humidity is tough on leather straps. Opt for bracelets or rubber straps on watches you wear daily.</li>
            <li><strong>Grey market:</strong> Bangkok has one of Asia's most active grey markets — King Power, Paragon, and MBK all have grey dealers with genuine pieces at 5–20% below AD price.</li>
            <li><strong>Import duty:</strong> Watches imported to Thailand incur 30% import duty + 7% VAT. Pre-owned eliminates this — a 40% total cost advantage.</li>
            <li><strong>Service in Bangkok:</strong> Official Rolex, Omega, and AP service centres are at Central World (Rolex) and Gaysorn (Omega). Service costs are similar to Europe.</li>
            <li><strong>Papers matter more in Thailand:</strong> Thai collectors strongly prefer watches with original box and papers. Budget $200–400 premium for pappered pieces.</li>
          </> : <>
            <li><strong>ความชื้น:</strong> ความชื้นในไทยทำร้ายสายหนัง เลือกสายสแตนเลสหรือยางสำหรับนาฬิกาที่ใส่ทุกวัน</li>
            <li><strong>ตลาดเทา:</strong> กรุงเทพมีตลาดเทาที่คึกคักที่สุดแห่งหนึ่งในเอเชีย — King Power, สยามพารากอน และ MBK มีนาฬิกาแท้จากดีลเลอร์เทาในราคา 5–20% ต่ำกว่า AD</li>
            <li><strong>ภาษีนำเข้า:</strong> นาฬิกานำเข้ามาไทยเสียภาษีนำเข้า 30% + VAT 7% การซื้อมือสองหลีกเลี่ยงสิ่งนี้ได้ — ประหยัดรวม 40%</li>
            <li><strong>ศูนย์บริการในกรุงเทพ:</strong> ศูนย์บริการ Rolex, Omega และ AP อย่างเป็นทางการอยู่ที่ Central World (Rolex) และ Gaysorn (Omega) ค่าบริการใกล้เคียงยุโรป</li>
            <li><strong>กล่องและการ์ดสำคัญกว่าในไทย:</strong> นักสะสมไทยชอบนาฬิกาที่มีกล่องและการ์ดดั้งเดิมมาก คิดราคาเพิ่ม 200–400 ดอลลาร์สำหรับชิ้นที่มีเอกสาร</li>
          </>}
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/pre-owned-watches-buying-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/pre-owned-watches-buying-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex Guide →' : 'คู่มือ Rolex →'}
        </Link>
        <Link href={`/${locale}/watches`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Browse Watches →' : 'ดูนาฬิกาทั้งหมด →'}
        </Link>
      </div>
    </div>
  )
}
