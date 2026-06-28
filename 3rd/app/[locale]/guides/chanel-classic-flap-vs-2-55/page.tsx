import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/chanel-classic-flap-vs-2-55'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel Classic Flap vs 2.55 Reissue: Differences & Prices Thailand 2025 | ChicPreowned'
      : 'Chanel Classic Flap vs 2.55 Reissue: ความแตกต่างและราคาในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Classic Flap vs 2.55 Reissue differences for Bangkok buyers — CC lock vs Mademoiselle lock, THB prices, resale value, which to buy 2025.'
      : 'ความแตกต่าง Classic Flap vs 2.55 Reissue สำหรับผู้ซื้อกรุงเทพ ล็อค CC vs ล็อค Mademoiselle ราคาบาท มูลค่าขายต่อ ควรซื้ออันไหน 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function ChanelClassicVs255TH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const differences = isEn ? [
    { aspect: 'Year introduced', classic: '1983 by Karl Lagerfeld (rework of Coco\'s original)', reissue: '1955 by Coco Chanel. Reissued 2005 for the 50th anniversary.' },
    { aspect: 'Closure (fastest tell)', classic: 'CC turn-lock — the interlocking CC logo clasp. Lagerfeld\'s addition.', reissue: 'Mademoiselle lock — rectangular, non-logo clasp. Coco\'s original hardware.' },
    { aspect: 'Chain type', classic: 'Gold or silver chain interwoven with leather. Softer drape.', reissue: 'Distressed metal chain — aged gold or ruthenium. All-metal, no leather weave.' },
    { aspect: 'Interior', classic: 'Large compartment, back zip pocket, multiple card slots, lipstick holder.', reissue: 'Compartmentalized: flat pockets, zip coin pocket, red interior (Coco\'s original signature).' },
    { aspect: 'Retail price 2025', classic: `Small: ~$7,500 (${formatPriceTHB(7500)}). Medium: ~$8,600 (${formatPriceTHB(8600)})`, reissue: `226 (≈ Medium): ~$9,200 (${formatPriceTHB(9200)}). 227 (≈ Jumbo): ~$9,800 (${formatPriceTHB(9800)})` },
    { aspect: 'Pre-owned resale', classic: 'Caviar: 80–120% of retail. Well-maintained Lambskin: 70–95%.', reissue: 'Aged calfskin: 70–100% of retail. More niche market than Classic Flap.' },
    { aspect: 'Who chooses it', classic: 'The "standard" Chanel. More widely recognized globally and in Bangkok.', reissue: 'The Chanel insider choice — connoisseurs who know the 1955 history.' },
  ] : [
    { aspect: 'ปีที่แนะนำ', classic: '1983 โดย Karl Lagerfeld (แก้ไขชิ้นต้นฉบับของ Coco)', reissue: '1955 โดย Coco Chanel ออกใหม่อีกครั้งในปี 2005 ฉลองครบรอบ 50 ปี' },
    { aspect: 'ล็อค (บอกได้เร็วที่สุด)', classic: 'CC turn-lock — ล็อคโลโก้ CC แบบสอดประสาน เพิ่มโดย Lagerfeld', reissue: 'ล็อค Mademoiselle — ล็อคสี่เหลี่ยม ไม่มีโลโก้ ฮาร์ดแวร์ต้นฉบับของ Coco' },
    { aspect: 'ประเภทสายโซ่', classic: 'สายโซ่ทองหรือเงินสอดด้วยหนัง ห้อยแบบนุ่มนวล', reissue: 'สายโซ่โลหะ distressed ทองเก่าหรือ ruthenium โลหะทั้งหมด ไม่มีหนังสอด' },
    { aspect: 'ภายใน', classic: 'ช่องใหญ่ กระเป๋าซิปด้านหลัง ช่องการ์ดหลายช่อง ช่องลิปสติก', reissue: 'แบ่งช่อง: ช่องแบน กระเป๋าเหรียญซิป ภายในสีแดง (ลายเซ็นต้นฉบับของ Coco)' },
    { aspect: 'ราคาร้านปี 2025', classic: `Small: ~$7,500 (${formatPriceTHB(7500)}) Medium: ~$8,600 (${formatPriceTHB(8600)})`, reissue: `226 (≈ Medium): ~$9,200 (${formatPriceTHB(9200)}) 227 (≈ Jumbo): ~$9,800 (${formatPriceTHB(9800)})` },
    { aspect: 'การขายต่อมือสอง', classic: 'Caviar: 80–120% ราคาร้าน Lambskin ดูแลดี: 70–95%', reissue: 'Aged calfskin: 70–100% ราคาร้าน ตลาดเฉพาะกลุ่มกว่า Classic Flap' },
    { aspect: 'ใครเลือก', classic: 'Chanel "มาตรฐาน" เป็นที่รู้จักทั่วโลกและในกรุงเทพมากกว่า', reissue: 'ทางเลือกของผู้รู้จัก Chanel ผู้เชี่ยวชาญที่รู้ประวัติปี 1955' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Classic Flap vs 2.55' : 'Classic Flap vs 2.55'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel Classic Flap vs 2.55 Reissue' : 'Chanel Classic Flap vs 2.55 Reissue'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'They look nearly identical to outsiders. The closure, chain, interior, and history are completely different. The Classic Flap is Lagerfeld\'s 1983 rework; the 2.55 Reissue is Coco\'s 1955 original. The fastest tell: look at the clasp.'
          : 'ดูเกือบเหมือนกันสำหรับคนภายนอก แต่ล็อค สายโซ่ ภายใน และประวัติแตกต่างกันโดยสิ้นเชิง Classic Flap คือการแก้ไขของ Lagerfeld ในปี 1983 2.55 Reissue คือต้นฉบับของ Coco ปี 1955 วิธีบอกเร็วที่สุด ดูที่ล็อค'}
      </p>

      <div className="space-y-4 mb-10">
        {differences.map((d, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{d.aspect}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Classic Flap</p>
                <p className="text-sm text-gray-600">{d.classic}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">2.55 Reissue</p>
                <p className="text-sm text-gray-600">{d.reissue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Quick tell: one-second identification' : 'บอกเร็ว: การระบุหนึ่งวินาที'}</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          {(isEn ? [
            'CC interlocking logo clasp = Classic Flap (Lagerfeld, 1983+)',
            'Rectangular "Mademoiselle" lock = 2.55 Reissue (Coco\'s original)',
            'Leather-woven chain = Classic Flap',
            'All-metal distressed chain = 2.55 Reissue',
            'Red interior with small compartments = 2.55 Reissue',
          ] : [
            'ล็อคโลโก้ CC สอดประสาน = Classic Flap (Lagerfeld, 1983+)',
            'ล็อคสี่เหลี่ยม "Mademoiselle" = 2.55 Reissue (ต้นฉบับ Coco)',
            'สายโซ่สอดด้วยหนัง = Classic Flap',
            'สายโซ่โลหะ distressed ทั้งหมด = 2.55 Reissue',
            'ภายในสีแดงพร้อมช่องเล็ก = 2.55 Reissue',
          ]).map((item, i) => <li key={i}>• <strong>{item.split(' = ')[0]}</strong> = {item.split(' = ')[1]}</li>)}
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/chanel-classic-flap-vs-2-55" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/chanel-classic-flap-vs-2-55" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Pre-Owned →' : 'Chanel มือสอง →'}</Link>
        <Link href={`/${locale}/guides/chanel-classic-vs-boy`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Classic vs Boy Bag →' : 'Classic vs Boy Bag →'}</Link>
        <Link href={`/${locale}/guides/chanel-price-history`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Price History →' : 'ประวัติราคา Chanel →'}</Link>
      </div>
    </div>
  )
}
