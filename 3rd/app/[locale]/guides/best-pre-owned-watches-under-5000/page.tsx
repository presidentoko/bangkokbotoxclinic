import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/best-pre-owned-watches-under-5000'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Best Pre-Owned Luxury Watches Under $5,000 Thailand ${PRICE_YEAR} | ChicPreowned`
      : `นาฬิกาหรูมือสองที่ดีที่สุดต่ำกว่า $5,000 ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Best pre-owned luxury watches under $5,000 for Bangkok buyers — Rolex Datejust, Omega Speedmaster, TAG Heuer, IWC, Cartier Santos. THB prices included.'
      : 'นาฬิกาหรูมือสองที่ดีที่สุดต่ำกว่า $5,000 สำหรับผู้ซื้อกรุงเทพ Rolex Datejust, Omega Speedmaster, TAG Heuer, IWC, Cartier Santos รวมราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function WatchesUnder5kTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const picks = isEn ? [
    { rank: 1, brand: 'Rolex', model: 'Datejust 36 (116200)', budget: `$2,800–4,200 (${formatPriceTHB(2800)}–${formatPriceTHB(4200)})`, why: 'Most liquid pre-owned watch in the world. Iconic design, bulletproof movement, huge availability. Papers add $400–600.', condition: 'Smooth bezel, no redial, original dial.' },
    { rank: 2, brand: 'Omega', model: 'Speedmaster Professional Moonwatch', budget: `$3,200–4,800 (${formatPriceTHB(3200)}–${formatPriceTHB(4800)})`, why: 'NASA-certified, hand-wound, culturally iconic. Most respected watch under $5k in collector circles.', condition: 'Check crystal (sapphlex chips), lume plots, Hesalite replacement history.' },
    { rank: 3, brand: 'TAG Heuer', model: 'Carrera Calibre 16', budget: `$1,800–3,200 (${formatPriceTHB(1800)}–${formatPriceTHB(3200)})`, why: 'Best entry into Swiss chronograph under $3k. Great value, strong heritage, easy to service.', condition: 'Inspect pushers, crown threads, caseback gasket.' },
    { rank: 4, brand: 'IWC', model: 'Portofino 40mm (IW356502)', budget: `$3,500–5,000 (${formatPriceTHB(3500)}–${formatPriceTHB(5000)})`, why: 'Dress watch credibility without the Patek premium. Clean dial, in-house movement.', condition: 'Check date wheel alignment, case sharpness.' },
    { rank: 5, brand: 'Cartier', model: 'Santos 100 Medium', budget: `$3,000–4,500 (${formatPriceTHB(3000)}–${formatPriceTHB(4500)})`, why: 'Works perfectly on wrist AND with a suit. Dual strap system is practical. Bangkok boutique price: significantly higher.', condition: 'Scratches on integrated bracelet common — polish cost ~฿5,000.' },
  ] : [
    { rank: 1, brand: 'Rolex', model: 'Datejust 36 (116200)', budget: `$2,800–4,200 (${formatPriceTHB(2800)}–${formatPriceTHB(4200)})`, why: 'นาฬิกามือสองที่เป็น liquid มากที่สุดในโลก การออกแบบที่เป็นไอคอน เคลื่อนไหวทนทาน มีให้เลือกมาก กระดาษเพิ่ม $400–600', condition: 'bezel เรียบ ไม่ redial หน้าปัดต้นฉบับ' },
    { rank: 2, brand: 'Omega', model: 'Speedmaster Professional Moonwatch', budget: `$3,200–4,800 (${formatPriceTHB(3200)}–${formatPriceTHB(4800)})`, why: 'ได้รับการรับรองจาก NASA ไขลานมือ เป็นไอคอนทางวัฒนธรรม นาฬิกาที่ได้รับการเคารพมากที่สุดต่ำกว่า $5k ในแวดวงนักสะสม', condition: 'ตรวจสอบคริสตัล (รอยแตก sapphlex) จุด lume ประวัติการเปลี่ยน Hesalite' },
    { rank: 3, brand: 'TAG Heuer', model: 'Carrera Calibre 16', budget: `$1,800–3,200 (${formatPriceTHB(1800)}–${formatPriceTHB(3200)})`, why: 'ทางเข้าสู่ Swiss chronograph ที่ดีที่สุดต่ำกว่า $3k มูลค่าที่ดี มรดกแข็งแกร่ง ง่ายต่อการบริการ', condition: 'ตรวจสอบ pushers เกลียว crown ปะเก็น caseback' },
    { rank: 4, brand: 'IWC', model: 'Portofino 40mm (IW356502)', budget: `$3,500–5,000 (${formatPriceTHB(3500)}–${formatPriceTHB(5000)})`, why: 'ความน่าเชื่อถือของนาฬิกาทางการโดยไม่มีพรีเมียม Patek หน้าปัดสะอาด เคลื่อนไหว in-house', condition: 'ตรวจสอบการจัดตำแหน่งวันที่ ความคมของเคส' },
    { rank: 5, brand: 'Cartier', model: 'Santos 100 Medium', budget: `$3,000–4,500 (${formatPriceTHB(3000)}–${formatPriceTHB(4500)})`, why: 'ทำงานสมบูรณ์แบบทั้งบนข้อมือและกับสูท ระบบสายแบบ dual ใช้งานได้จริง ราคาบูทีคกรุงเทพสูงกว่าอย่างมีนัยสำคัญ', condition: 'รอยขีดข่วนบนสายรัดแบบ integrated เป็นเรื่องปกติ ค่าขัด ~฿5,000' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Watches Under $5,000' : 'นาฬิกาต่ำกว่า $5,000'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Best Pre-Owned Luxury Watches Under $5,000 (${PRICE_YEAR})` : `นาฬิกาหรูมือสองที่ดีที่สุดต่ำกว่า $5,000 (${PRICE_YEAR})`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The sweet spot for pre-owned — significant retail savings, accessible prices, proven movements. All five picks include Bangkok market context and THB pricing.'
          : 'จุดที่ดีที่สุดสำหรับมือสอง การประหยัดราคาร้านอย่างมีนัยสำคัญ ราคาเข้าถึงได้ เคลื่อนไหวที่ได้รับการพิสูจน์แล้ว ทั้งห้าตัวเลือกรวมบริบทตลาดกรุงเทพและราคาบาท'}
      </p>

      <ThaiPriceCallout
        slugs={['rolex/datejust-36', 'cartier/santos-medium']}
        locale={locale}
      />

      <div className="space-y-6 mb-12">
        {picks.map(p => (
          <div key={p.rank} className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
              <div>
                <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full mr-2">#{p.rank}</span>
                <span className="font-bold text-gray-900 text-lg">{p.brand} {p.model}</span>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">{p.budget}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{p.why}</p>
            <p className="text-xs text-gray-400"><strong>{isEn ? 'Condition check:' : 'ตรวจสอบสภาพ:'}</strong> {p.condition}</p>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-red-900 mb-2">{isEn ? 'What to avoid' : 'สิ่งที่ควรหลีกเลี่ยง'}</h3>
        <ul className="text-sm text-red-800 space-y-1">
          {(isEn ? [
            'Repolished cases — sharp case edges should be crisp, buffed cases lose value',
            'Redialed watches — any non-original dial is a major deduction',
            'Missing service records — for movements over 10 years old, budget ฿10,000–20,000 for service',
            'Too-good-to-be-true pricing — a Rolex Submariner for ฿150,000 is a red flag',
          ] : [
            'เคส repolished เส้นขอบเคสควรคมชัด เคสที่ขัดแล้วสูญเสียมูลค่า',
            'นาฬิกาที่ redial หน้าปัดที่ไม่ต้นฉบับเป็นการหักมูลค่าอย่างมาก',
            'ไม่มีบันทึกการบริการ สำหรับเคลื่อนไหวที่อายุมากกว่า 10 ปี งบ ฿10,000–20,000 สำหรับการบริการ',
            'ราคาที่ดีเกินจริง Rolex Submariner ที่ ฿150,000 เป็น red flag',
          ]).map((item, i) => <li key={i}>• {item}</li>)}
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/best-pre-owned-watches-under-5000" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/best-pre-owned-watches-under-5000" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href={`/${locale}/compare/omega-vs-iwc`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs IWC →</Link>
        <Link href={`/${locale}/compare/omega-vs-tag-heuer`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs TAG →</Link>
      </div>
    </div>
  )
}
