import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/omega'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Omega Prices Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `ราคา Omega มือสองในไทย ${PRICE_YEAR} — คู่มือซื้อ | ChicPreowned`,
    description: isEn
      ? 'Pre-owned Omega Speedmaster, Seamaster and Constellation prices in Thailand. Save 25–35% vs retail. Updated weekly.'
      : 'ราคา Omega Speedmaster, Seamaster, Constellation มือสองในไทย ประหยัด 25–35% จากราคาปลีก อัปเดตรายสัปดาห์',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

export default async function OmegaBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const models = isEn ? [
    { name: 'Speedmaster Moonwatch Professional (Cal. 3861)', retail: '$7,400', preowned: '฿170,000–220,000', note: 'NASA Moon watch heritage' },
    { name: 'Seamaster 300M', retail: '$5,800', preowned: '฿130,000–180,000', note: 'James Bond watch' },
    { name: 'Seamaster Aqua Terra 38.5mm', retail: '$5,500', preowned: '฿110,000–155,000', note: 'Dress-sport hybrid' },
    { name: 'Constellation 39mm', retail: '$4,800', preowned: '฿90,000–125,000', note: 'Distinctive claw lugs' },
    { name: 'De Ville Trésor', retail: '$5,000', preowned: '฿85,000–120,000', note: 'Ultra-slim dress watch' },
  ] : [
    { name: 'Speedmaster Moonwatch Professional (Cal. 3861)', retail: '7,400 USD', preowned: '170,000–220,000 บาท', note: 'นาฬิกา NASA สำหรับภารกิจบนดวงจันทร์' },
    { name: 'Seamaster 300M', retail: '5,800 USD', preowned: '130,000–180,000 บาท', note: 'นาฬิกาของ James Bond' },
    { name: 'Seamaster Aqua Terra 38.5mm', retail: '5,500 USD', preowned: '110,000–155,000 บาท', note: 'ผสม sporty และ dressy' },
    { name: 'Constellation 39mm', retail: '4,800 USD', preowned: '90,000–125,000 บาท', note: 'ขาล็อคที่โดดเด่น' },
    { name: 'De Ville Trésor', retail: '5,000 USD', preowned: '85,000–120,000 บาท', note: 'นาฬิกาชุดสลิมสุดหรู' },
  ]

  const faqs = isEn ? [
    {
      q: 'Is Omega a good investment watch in Thailand?',
      a: 'Omega retains 70–85% of retail value pre-owned — strong for a Swiss brand. In Thailand, the Seamaster 300M is highly popular (driven by James Bond association) and the Speedmaster is sought after by collectors. Neither usually appreciates above retail like Rolex, but both are excellent value buys: you get Swiss mechanical quality at 25–35% off retail with minimal depreciation risk going forward.'
    },
    {
      q: 'Speedmaster vs Seamaster — which to buy pre-owned in Thailand?',
      a: 'If you want a conversation piece and collector\'s icon, the Speedmaster Moonwatch is irreplaceable — it is literally the watch worn on the Moon. If you want versatility (casual + formal, waterproof), the Seamaster 300M is the better daily watch. For Thai climate, the Seamaster\'s 300m water resistance is more practical.'
    },
    {
      q: 'Where can I buy or sell pre-owned Omega in Thailand?',
      a: 'Bangkok has several reputable pre-owned watch dealers on Sukhumvit and in the Central Embassy mall area. Online, Facebook Marketplace Thailand has a large second-hand watch community. Always request service records and verify the movement calibre before buying.'
    },
  ] : [
    {
      q: 'Omega เป็นนาฬิกาลงทุนที่ดีในไทยหรือไม่?',
      a: 'Omega รักษามูลค่า 70–85% ของราคาปลีกเมื่อขายมือสอง — แข็งแกร่งสำหรับแบรนด์สวิส ในไทย Seamaster 300M นิยมมาก (เป็นนาฬิกาของ James Bond) และ Speedmaster เป็นที่ต้องการโดยนักสะสม ทั้งสองไม่ขึ้นสูงกว่าราคาปลีกเหมือน Rolex แต่เป็นการซื้อที่คุ้มค่า: คุณภาพสวิสในราคาถูกกว่า 25–35%'
    },
    {
      q: 'Speedmaster vs Seamaster — ควรซื้อมือสองอะไรในไทย?',
      a: 'ถ้าต้องการของสะสมและนาฬิกาที่มีประวัติศาสตร์ Speedmaster Moonwatch ไม่มีตัวไหนเทียบได้ ถ้าต้องการความหลากหลาย (ลำลองและงานฉลอง กันน้ำด้วย) Seamaster 300M เหมาะเป็นนาฬิกาใส่ทุกวันกว่า สำหรับสภาพอากาศไทย การกันน้ำ 300 ม. ของ Seamaster ใช้งานได้จริงกว่า'
    },
    {
      q: 'ซื้อหรือขาย Omega มือสองในไทยได้ที่ไหน?',
      a: 'กรุงเทพมีร้านนาฬิกามือสองที่มีชื่อเสียงหลายร้านบนสุขุมวิทและในห้าง Central Embassy ออนไลน์ Facebook Marketplace ไทยมีชุมชนนาฬิกามือสองขนาดใหญ่ ควรขอใบรับรองการเซอร์วิสและตรวจสอบหมายเลขรุ่นของกลไกก่อนซื้อ'
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/watches`} className="hover:text-gray-800">{isEn ? 'Watches' : 'นาฬิกา'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Omega</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? 'Pre-Owned Omega Prices in Thailand {PRICE_YEAR}' : 'ราคา Omega มือสองในไทย {PRICE_YEAR}'}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? 'Save 25–35% vs retail · Swiss-made precision · strong value retention'
          : 'ประหยัด 25–35% จากราคาปลีก · สวิสแมนูแฟคเจอร์ · รักษามูลค่าดี'}
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-900">
        <strong>{isEn ? 'Value note:' : 'หมายเหตุคุณค่า:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Unlike Rolex, pre-owned Omega is typically available below retail — making it one of the best entry points for Swiss luxury watches. The Speedmaster Moonwatch was worn on every NASA crewed Moon mission.'
            : 'ต่างจาก Rolex นาฬิกา Omega มือสองมักมีราคาต่ำกว่าราคาปลีก ทำให้เป็นจุดเริ่มต้นที่ดีสำหรับนาฬิกา Swiss luxury Speedmaster Moonwatch ถูกสวมใส่ในทุกภารกิจ NASA บนดวงจันทร์'}
        </span>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Omega Pre-Owned Prices' : 'ราคา Omega มือสอง'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Retail' : 'ราคาใหม่'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Pre-owned (THB)' : 'มือสอง (บาท)'}</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{m.note}</div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-500">{m.retail}</td>
                  <td className="text-right py-3 px-4 font-medium">{m.preowned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/omega" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/omega" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex vs Omega →' : 'Rolex vs Omega →'}
        </Link>
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex Prices →' : 'ราคา Rolex →'}
        </Link>
      </div>
    </div>
  )
}
