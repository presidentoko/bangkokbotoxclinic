import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/best-pre-owned-watches-for-beginners'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Best Pre-Owned Luxury Watches for Beginners Thailand ${PRICE_YEAR} | ChicPreowned`
      : `นาฬิกาหรูมือสองที่ดีที่สุดสำหรับมือใหม่ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Best first luxury watch to buy pre-owned in Thailand — Omega Seamaster, Cartier Tank, Rolex Datejust. Entry prices in USD and THB, what to check, Bangkok boutique context.'
      : 'นาฬิกาหรูมือสองที่ดีที่สุดสำหรับมือใหม่ในไทย Omega Seamaster, Cartier Tank, Rolex Datejust ราคาเป็น USD และบาท สิ่งที่ต้องตรวจสอบ บริบทบูทีคกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function WatchesForBeginnersTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const picks = isEn ? [
    {
      tier: 'Best Entry Point',
      brand: 'TAG Heuer', model: 'Carrera Calibre 16',
      budget: `$1,800–3,200 pre-owned (${formatPriceTHB(1800)}–${formatPriceTHB(3200)})`,
      detail: 'Most accessible serious Swiss watch for beginners. Legitimate Swiss chronograph movement at a price that won\'t sting. The Carrera has motorsport heritage and sports-elegant design. Less retention than Omega or Rolex, but the lowest barrier to enter quality Swiss watchmaking.',
      check: 'Pushers, crown threads, caseback gasket.',
    },
    {
      tier: 'Best All-Around Beginner Watch',
      brand: 'Omega', model: 'Seamaster 300M',
      budget: `$1,500–2,500 pre-owned (${formatPriceTHB(1500)}–${formatPriceTHB(2500)})`,
      detail: 'The James Bond watch. Versatile, robust, excellent value retention. Water-resistant to 300m, co-axial movement, and it transitions from office to beach without looking out of place. Bangkok boutique retail is ~฿85,000–95,000 new. Pre-owned saves 35–45%.',
      check: 'Blue ceramic bezel ring (no chips), helium valve, lume on hands.',
    },
    {
      tier: 'Best History',
      brand: 'Omega', model: 'Speedmaster Moonwatch Professional',
      budget: `$3,200–4,800 pre-owned (${formatPriceTHB(3200)}–${formatPriceTHB(4800)})`,
      detail: 'NASA-certified for the Apollo missions. Hand-wound, culturally iconic, and the only watch worn on the Moon. Pre-owned values are stable because this is a genuine historical artifact. The reference 3570.50 is the classic to look for.',
      check: 'Crystal (sapphlex chips), lume plots colour consistency, Hesalite crystal if original.',
    },
    {
      tier: 'Most Elegant Entry',
      brand: 'Cartier', model: 'Tank Solo',
      budget: `$1,800–3,500 pre-owned (${formatPriceTHB(1800)}–${formatPriceTHB(3500)})`,
      detail: 'Designed in 1917, worn by Jackie Kennedy, Andy Warhol, and Michelle Obama. The rectangular case and Roman numeral dial define dress watch design. Perfect for formal occasions. Bangkok Cartier boutique at Gaysorn and CentralWorld — new retail ~฿75,000–95,000.',
      check: 'Crown (sapphire cabochon intact), bracelet clasp, case scratches acceptable (Cartier laser-engraves inside).',
    },
    {
      tier: 'Best Value Retention',
      brand: 'Rolex', model: 'Datejust 41',
      budget: `$6,000–9,000 pre-owned (${formatPriceTHB(6000)}–${formatPriceTHB(9000)})`,
      detail: 'The most produced Swiss watch in history. Most recommended first Rolex — lower barrier than a Submariner or GMT, strong value retention regardless of configuration, and immediate recognizability. Papers add ฿15,000–20,000 to resale.',
      check: 'Dial authenticity (redials are common — check lume uniformity under UV), bezel condition, bracelet stretch.',
    },
  ] : [
    {
      tier: 'จุดเริ่มต้นที่ดีที่สุด',
      brand: 'TAG Heuer', model: 'Carrera Calibre 16',
      budget: `$1,800–3,200 มือสอง (${formatPriceTHB(1800)}–${formatPriceTHB(3200)})`,
      detail: 'นาฬิกาสวิสที่เข้าถึงได้มากที่สุดสำหรับมือใหม่ เคลื่อนไหว Swiss chronograph จริงในราคาที่ไม่เจ็บปวด Carrera มีมรดกจากกีฬามอเตอร์สปอร์ตและการออกแบบ sports-elegant การรักษามูลค่าน้อยกว่า Omega หรือ Rolex แต่เป็นจุดเริ่มต้นที่ดีที่สุด',
      check: 'Pushers เกลียว crown ปะเก็น caseback',
    },
    {
      tier: 'นาฬิกาเริ่มต้นที่ดีที่สุดรอบด้าน',
      brand: 'Omega', model: 'Seamaster 300M',
      budget: `$1,500–2,500 มือสอง (${formatPriceTHB(1500)}–${formatPriceTHB(2500)})`,
      detail: 'นาฬิกา James Bond อเนกประสงค์ ทนทาน การรักษามูลค่าดีเยี่ยม กันน้ำ 300m เคลื่อนไหว co-axial และเปลี่ยนจากออฟฟิศสู่ชายหาดได้อย่างสบาย ราคาบูทีคกรุงเทพใหม่ ~฿85,000–95,000 มือสองประหยัด 35–45%',
      check: 'แหวนเบเซล ceramic สีน้ำเงิน (ไม่มีรอยแตก) วาล์ว helium ลูมบนเข็ม',
    },
    {
      tier: 'ประวัติศาสตร์ที่ดีที่สุด',
      brand: 'Omega', model: 'Speedmaster Moonwatch Professional',
      budget: `$3,200–4,800 มือสอง (${formatPriceTHB(3200)}–${formatPriceTHB(4800)})`,
      detail: 'ได้รับการรับรองจาก NASA สำหรับภารกิจ Apollo ไขลานมือ เป็นไอคอนทางวัฒนธรรม และเป็นนาฬิกาเดียวที่สวมบนดวงจันทร์ มูลค่ามือสองมั่นคงเพราะนี่คือของจริงทางประวัติศาสตร์',
      check: 'คริสตัล (รอยแตก sapphlex) ความสม่ำเสมอสีจุด lume คริสตัล Hesalite ถ้าต้นฉบับ',
    },
    {
      tier: 'ความสง่างามที่ดีที่สุด',
      brand: 'Cartier', model: 'Tank Solo',
      budget: `$1,800–3,500 มือสอง (${formatPriceTHB(1800)}–${formatPriceTHB(3500)})`,
      detail: 'ออกแบบในปี 1917 สวมใส่โดย Jackie Kennedy, Andy Warhol และ Michelle Obama เคสสี่เหลี่ยมและหน้าปัดตัวเลขโรมันกำหนดการออกแบบนาฬิกา dress watch บูทีค Cartier กรุงเทพที่ Gaysorn และ CentralWorld ราคาใหม่ ~฿75,000–95,000',
      check: 'Crown (หัวล้อ sapphire ครบ) ตัวล็อคสายนาฬิกา รอยขีดข่วนเคสรับได้',
    },
    {
      tier: 'การรักษามูลค่าดีที่สุด',
      brand: 'Rolex', model: 'Datejust 41',
      budget: `$6,000–9,000 มือสอง (${formatPriceTHB(6000)}–${formatPriceTHB(9000)})`,
      detail: 'นาฬิกาสวิสที่ผลิตมากที่สุดในประวัติศาสตร์ Rolex แรกที่แนะนำมากที่สุด ต่ำกว่า Submariner หรือ GMT การรักษามูลค่าแข็งแกร่ง กระดาษเพิ่ม ฿15,000–20,000 ต่อการขายต่อ',
      check: 'ความถูกต้องหน้าปัด (redial พบบ่อย ตรวจสอบ lume ใต้ UV) สภาพเบเซล การยืดสาย',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Watches for Beginners' : 'นาฬิกาสำหรับมือใหม่'}</span>
      </nav>

      <p className="text-xs tracking-widest uppercase text-amber-600 mb-2">{isEn ? "Buyer's Guide" : 'คู่มือผู้ซื้อ'}</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Best Pre-Owned Luxury Watches for Beginners ${PRICE_YEAR}` : `นาฬิกาหรูมือสองที่ดีที่สุดสำหรับมือใหม่ ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Five watches sorted from most accessible to strongest investment, with Bangkok boutique context and THB pricing. All have robust pre-owned markets — you can sell later without significant loss.'
          : 'ห้านาฬิกาเรียงจากที่เข้าถึงได้มากที่สุดไปสู่การลงทุนที่แข็งแกร่งที่สุด พร้อมบริบทบูทีคกรุงเทพและราคาบาท ทั้งหมดมีตลาดมือสองที่แข็งแกร่ง สามารถขายต่อในภายหลังโดยไม่ขาดทุนมาก'}
      </p>

      <ThaiPriceCallout
        slugs={['cartier/tank-must', 'rolex/datejust-36']}
        locale={locale}
      />

      <div className="space-y-6 mb-12">
        {picks.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-6">
            <p className="text-xs tracking-widest uppercase text-amber-600 mb-1">{p.tier}</p>
            <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{p.brand}</p>
                <h2 className="text-lg font-bold text-gray-900">{p.model}</h2>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">{p.budget}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{p.detail}</p>
            <p className="text-xs text-gray-400"><strong>{isEn ? 'Check:' : 'ตรวจสอบ:'}</strong> {p.check}</p>
          </div>
        ))}
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}</h2>
        <div className="space-y-4">
          {(isEn ? [
            { q: 'What is the best first luxury watch to buy pre-owned?', a: 'The Omega Seamaster 300M — strong brand prestige, genuine tool watch capability, reasonable pre-owned prices (฿54,000–90,000), and reliable value retention. For a dress watch, the Cartier Tank Solo is the classic choice.' },
            { q: 'Do luxury watches hold their value in Thailand?', a: 'Rolex holds best, often at or above retail. Omega holds 60–75%. Cartier holds 50–65%. TAG Heuer holds 40–55%. Buying pre-owned means you start at secondary market price — further depreciation is far less severe than buying new.' },
            { q: 'What should a beginner check when buying a pre-owned watch?', a: 'Condition of the dial (no moisture, fading, or scratches), movement service history, bracelet stretch, and whether the case has been polished. Original box and papers add 10–20% to resale value.' },
          ] : [
            { q: 'นาฬิกาหรูมือสองเรือนแรกที่ดีที่สุดคืออะไร?', a: 'Omega Seamaster 300M — ชื่อเสียงแบรนด์ที่แข็งแกร่ง ความสามารถของ tool watch จริง ราคามือสองที่สมเหตุสมผล (฿54,000–90,000) และการรักษามูลค่าที่เชื่อถือได้ สำหรับ dress watch Cartier Tank Solo เป็นตัวเลือกคลาสสิก' },
            { q: 'นาฬิกาหรูรักษามูลค่าในไทยได้ไหม?', a: 'Rolex รักษาได้ดีที่สุด มักอยู่ที่หรือสูงกว่าราคาร้าน Omega 60–75% Cartier 50–65% TAG Heuer 40–55% การซื้อมือสองหมายความว่าคุณเริ่มต้นที่ราคาตลาดรอง การเสื่อมมูลค่าต่อไปน้อยกว่าการซื้อใหม่มาก' },
            { q: 'มือใหม่ควรตรวจสอบอะไรเมื่อซื้อนาฬิกามือสอง?', a: 'สภาพหน้าปัด (ไม่มีความชื้น การซีดจาง หรือรอยขีดข่วน) ประวัติการบริการเคลื่อนไหว การยืดสายนาฬิกา และว่าเคสได้รับการขัดหรือไม่ กล่องและกระดาษต้นฉบับเพิ่ม 10–20% ต่อมูลค่าการขายต่อ' },
          ]).map((faq, i) => (
            <div key={i}>
              <h3 className="font-medium text-gray-900 mb-1 text-sm">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/best-pre-owned-watches-for-beginners" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/best-pre-owned-watches-for-beginners" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/best-pre-owned-watches-under-5000`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Watches Under $5k →' : 'นาฬิกาต่ำกว่า $5k →'}</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href={`/${locale}/compare/omega-vs-iwc`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs IWC →</Link>
      </div>
    </div>
  )
}
