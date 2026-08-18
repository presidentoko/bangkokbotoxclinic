import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/rolex-submariner-buying-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Rolex Submariner Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `คู่มือซื้อ Rolex Submariner ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `Rolex Submariner pre-owned guide Thailand — 124060, 126610LN, 126610LV references, THB prices, authentication ${PRICE_YEAR}.`
      : `คู่มือ Rolex Submariner มือสองในไทย — อ้างอิง 124060 126610LN 126610LV ราคาบาท การตรวจสอบ ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function RolexSubTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const references = isEn ? [
    { ref: '124060 (No-Date, 2020–present)', thb: `${formatPriceTHB(8500)}–${formatPriceTHB(12000)}`, retail: `~${formatPriceTHB(10100)}`, note: 'Current 41mm no-date. Cerachrom ceramic bezel. Most available pre-owned reference. The purist choice — no date magnifier for clean dial symmetry.' },
    { ref: '126610LN (Date, 2020–present)', thb: `${formatPriceTHB(11000)}–${formatPriceTHB(15000)}`, retail: `~${formatPriceTHB(11200)}`, note: 'Current 41mm black bezel + date. Over retail due to demand everywhere including Bangkok. The most recognized sports watch ever made. Strong investment hold.' },
    { ref: '126610LV ("Kermit", green bezel)', thb: `${formatPriceTHB(13000)}–${formatPriceTHB(20000)}`, retail: `~${formatPriceTHB(13150)}`, note: 'Green bezel, black dial. New generation since 2020. Significant premium over retail. Buy for love, not as a quick flip — market corrections happen.' },
    { ref: '114060 (2012–2020, no-date)', thb: `${formatPriceTHB(7500)}–${formatPriceTHB(10000)}`, retail: 'Discontinued', note: 'Excellent pre-owned entry point. Ceramic bezel, 40mm. Discontinued = no future retail competition. Clean choice for budget-conscious Sub buyers.' },
    { ref: '16610 (1988–2010)', thb: `${formatPriceTHB(5500)}–${formatPriceTHB(9000)}`, retail: 'Discontinued', note: 'Last aluminum bezel generation. 40mm. Vintage appeal at near-modern prices. In Bangkok strong demand from collectors — aluminum bezel patina is desirable.' },
  ] : [
    { ref: '124060 (No-Date, 2020–ปัจจุบัน)', thb: `${formatPriceTHB(8500)}–${formatPriceTHB(12000)}`, retail: `~${formatPriceTHB(10100)}`, note: 'รุ่น 41mm ไม่มีวันที่ปัจจุบัน เบเซลเซรามิก Cerachrom รุ่นที่หาได้มากที่สุดมือสอง ตัวเลือกนักสะสมแท้ — ไม่มี magnifier วันที่ ดูสมมาตรสะอาด' },
    { ref: '126610LN (Date, 2020–ปัจจุบัน)', thb: `${formatPriceTHB(11000)}–${formatPriceTHB(15000)}`, retail: `~${formatPriceTHB(11200)}`, note: 'รุ่น 41mm เบเซลดำ + วันที่ปัจจุบัน สูงกว่าราคาร้านเพราะความต้องการสูงรวมทั้งในกรุงเทพ นาฬิกาสปอร์ตที่เป็นที่รู้จักมากที่สุดในโลก คงมูลค่าดีมาก' },
    { ref: '126610LV ("Kermit" เบเซลเขียว)', thb: `${formatPriceTHB(13000)}–${formatPriceTHB(20000)}`, retail: `~${formatPriceTHB(13150)}`, note: 'เบเซลเขียว หน้าปัดดำ รุ่นใหม่ตั้งแต่ปี 2020 Premium สูงกว่าราคาร้านมาก ซื้อด้วยใจรัก ไม่ใช่เพื่อพลิกกำไรด่วน' },
    { ref: '114060 (2012–2020, ไม่มีวันที่)', thb: `${formatPriceTHB(7500)}–${formatPriceTHB(10000)}`, retail: 'หยุดผลิต', note: 'จุดเริ่มต้น Sub มือสองที่ยอดเยี่ยม เบเซลเซรามิก 40mm หยุดผลิต = ไม่มีการแข่งขันราคาร้านในอนาคต ตัวเลือกที่ดีสำหรับผู้ซื้อที่คำนึงถึงงบ' },
    { ref: '16610 (1988–2010)', thb: `${formatPriceTHB(5500)}–${formatPriceTHB(9000)}`, retail: 'หยุดผลิต', note: 'รุ่นเบเซลอะลูมิเนียมรุ่นสุดท้าย 40mm เสน่ห์ vintage ในราคาใกล้เคียงรุ่นสมัยใหม่ ในกรุงเทพมีความต้องการจากนักสะสม patina เบเซลอะลูมิเนียมเป็นที่ต้องการ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Rolex Submariner Buying Guide' : 'คู่มือซื้อ Rolex Submariner'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Rolex Submariner Buying Guide {PRICE_YEAR}' : 'คู่มือซื้อ Rolex Submariner {PRICE_YEAR}'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The Rolex Submariner is the most traded luxury watch on the secondary market globally — and in Bangkok. Five references dominate 90% of pre-owned Sub transactions. Understanding each saves you thousands.'
          : 'Rolex Submariner คือนาฬิกาหรูที่มีการซื้อขายมือสองมากที่สุดในโลก รวมถึงในกรุงเทพ ห้ารุ่นอ้างอิงครอบคลุม 90% ของธุรกรรม Sub มือสอง การเข้าใจแต่ละรุ่นช่วยประหยัดเงินได้มาก'}
      </p>

      <div className="space-y-4 mb-10">
        {references.map((r, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900">Submariner {r.ref}</h2>
              <div className="text-right shrink-0">
                <div className="font-semibold text-amber-700">{r.thb}</div>
                <div className="text-xs text-gray-400">{isEn ? 'Retail' : 'ราคาร้าน'}: {r.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{r.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/rolex-submariner-buying-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/rolex-submariner-buying-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Rolex Pre-Owned →' : 'Rolex มือสอง →'}</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate Rolex →' : 'ตรวจสอบ Rolex →'}</Link>
      </div>
    </div>
  )
}
