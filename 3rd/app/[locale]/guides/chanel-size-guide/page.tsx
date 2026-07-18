import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/chanel-size-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Chanel Classic Flap Size Guide for Thailand 2025 | ChicPreowned' : 'คู่มือขนาด Chanel Classic Flap ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Chanel Classic Flap size guide for Thai buyers — Mini, Small, Medium/Large, Maxi compared in THB prices with climate tips for Bangkok.'
      : 'คู่มือขนาด Chanel Classic Flap สำหรับคนไทย — Mini, Small, Medium/Large, Maxi เปรียบเทียบราคาบาทพร้อมเคล็ดลับสำหรับอากาศในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function ChanelSizeGuideThailand({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const sizes = isEn ? [
    { size: 'Mini Square', dim: '17×12×6cm', newPrice: '฿195,000', preowned: '฿130,000–175,000', best: 'Evening, crossbody, events' },
    { size: 'Mini Rectangular', dim: '20×12×6cm', newPrice: '฿215,000', preowned: '฿155,000–205,000', best: 'Day/evening hybrid, phone fits' },
    { size: 'Small', dim: '23×15×6cm', newPrice: '฿290,000', preowned: '฿205,000–285,000', best: 'Compact daily, date nights' },
    { size: 'Medium/Large (M/L)', dim: '25.5×15.5×6.5cm', newPrice: '฿350,000', preowned: '฿230,000–345,000', best: 'Most popular, best resale' },
    { size: 'Maxi', dim: '33×22×10cm', newPrice: '฿450,000', preowned: '฿260,000–370,000', best: 'Travel, daily carry, best value' },
  ] : [
    { size: 'Mini Square', dim: '17×12×6cm', newPrice: '195,000 บาท', preowned: '130,000–175,000 บาท', best: 'งานราตรี, สะพายไหล่, งานเลี้ยง' },
    { size: 'Mini Rectangular', dim: '20×12×6cm', newPrice: '215,000 บาท', preowned: '155,000–205,000 บาท', best: 'กลางวัน/ราตรี โทรศัพท์ใส่ได้' },
    { size: 'Small', dim: '23×15×6cm', newPrice: '290,000 บาท', preowned: '205,000–285,000 บาท', best: 'ใช้รายวันแบบกะทัดรัด นัดเดต' },
    { size: 'Medium/Large (M/L)', dim: '25.5×15.5×6.5cm', newPrice: '350,000 บาท', preowned: '230,000–345,000 บาท', best: 'นิยมมากที่สุด ขายต่อดีที่สุด' },
    { size: 'Maxi', dim: '33×22×10cm', newPrice: '450,000 บาท', preowned: '260,000–370,000 บาท', best: 'เดินทาง ใช้รายวัน คุ้มค่าที่สุด' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Chanel Size Guide' : 'คู่มือขนาด Chanel'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel Classic Flap Size Guide for Thailand 2025' : 'คู่มือขนาด Chanel Classic Flap ในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Mini vs Small vs M/L vs Maxi — THB prices, dimensions, and which size works best in Bangkok\'s heat.'
          : 'Mini vs Small vs M/L vs Maxi — ราคาบาท ขนาด และขนาดไหนที่ใช้งานได้ดีที่สุดในความร้อนของกรุงเทพ'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Classic Flap Sizes & THB Prices' : 'ขนาด Classic Flap และราคาบาท'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Size' : 'ขนาด'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Dimensions' : 'มิติ'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'New (Thai boutique)' : 'ราคาใหม่ (บูติกไทย)'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Pre-owned (THB)' : 'มือสอง (บาท)'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Best for' : 'เหมาะสำหรับ'}</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((s, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold text-gray-900">{s.size}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{s.dim}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{s.newPrice}</td>
                  <td className="text-right py-3 px-4 text-green-700 font-medium">{s.preowned}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{s.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Bangkok Climate Tip: Caviar vs Lambskin' : 'เคล็ดลับสภาพอากาศกรุงเทพ: Caviar vs Lambskin'}
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-900">
          {isEn
            ? 'Bangkok\'s heat and humidity are hard on leather. Caviar leather is far more resistant to humidity damage, scratches from BTS/MRT, and heat-related softening. Lambskin shows hand oils and scuffs much faster in tropical conditions. For daily use in Bangkok, always choose Caviar.'
            : 'ความร้อนและความชื้นของกรุงเทพทำร้ายหนัง หนัง Caviar ต้านทานความเสียหายจากความชื้น รอยขีดข่วนจาก BTS/MRT และการอ่อนตัวจากความร้อนได้ดีกว่ามาก Lambskin แสดงน้ำมันจากมือและรอยขีดข่วนเร็วกว่ามากในสภาพอากาศเขตร้อน สำหรับการใช้งานรายวันในกรุงเทพ เลือก Caviar เสมอ'}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/chanel-size-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/chanel-size-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Chanel Prices →' : 'ราคา Chanel →'}
        </Link>
        <Link href={`/${locale}/compare/chanel-vs-hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          Chanel vs Hermès →
        </Link>
      </div>
    </div>
  )
}
