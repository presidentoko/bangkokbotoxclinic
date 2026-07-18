import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/cartier-love-bracelet-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Cartier Love Bracelet Buying Guide Thailand 2025 | ChicPreowned'
      : 'คู่มือซื้อกำไล Cartier Love ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Cartier Love Bracelet guide for Thai buyers — sizes, metals, THB prices, authentication. How much to pay for pre-owned Cartier Love in Bangkok 2025.'
      : 'คู่มือกำไล Cartier Love สำหรับผู้ซื้อชาวไทย — ไซส์ โลหะ ราคาบาท การตรวจสอบ ซื้อ Cartier Love มือสองในกรุงเทพราคาเท่าไหร่ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function CartierLoveTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const variants = isEn ? [
    { name: 'Love Bracelet Yellow Gold (Size 17–19)', thb: `${formatPriceTHB(4500)}–${formatPriceTHB(7000)}`, retail: `~${formatPriceTHB(10000)}`, note: 'Best investment choice. Yellow gold holds value best in Asian markets. Condition is critical — inspect screws carefully. Scratched screws = ฿18,000 lower value.' },
    { name: 'Love Bracelet Rose Gold (Size 17–19)', thb: `${formatPriceTHB(4000)}–${formatPriceTHB(6500)}`, retail: `~${formatPriceTHB(9400)}`, note: 'Most popular in Thailand among 25–40 buyers. Rose gold resale is 10–15% lower than yellow gold — still excellent hold.' },
    { name: 'Love Bracelet White Gold (Size 17–19)', thb: `${formatPriceTHB(4200)}–${formatPriceTHB(7000)}`, retail: `~${formatPriceTHB(10700)}`, note: 'Least common Love variant. Clean, minimalist look. Strong East Asian market demand. Authentic white gold appears slightly grey vs. fake rhodium coating.' },
    { name: 'Love Bracelet with Diamonds (4 diamonds, YG)', thb: `${formatPriceTHB(6000)}–${formatPriceTHB(10000)}`, retail: `~${formatPriceTHB(14500)}`, note: 'Diamonds add appeal but harder to resell — specialized buyer pool. Know your exit market before buying diamond Love.' },
    { name: 'Love Bracelet Ceramic (Black)', thb: `${formatPriceTHB(2500)}–${formatPriceTHB(4500)}`, retail: `~${formatPriceTHB(8200)}`, note: 'Most affordable Love variant. Titanium core, ceramic coating. Lighter for daily wear — popular choice in Thailand. Can chip over time; inspect carefully.' },
  ] : [
    { name: 'Love Bracelet ทองเหลือง (ไซส์ 17–19)', thb: `${formatPriceTHB(4500)}–${formatPriceTHB(7000)}`, retail: `~${formatPriceTHB(10000)}`, note: 'ตัวเลือกลงทุนที่ดีที่สุด ทองเหลืองคงมูลค่าดีที่สุดในตลาดเอเชีย สภาพสำคัญมาก ตรวจสกรูอย่างระมัดระวัง สกรูขูด = มูลค่าต่ำกว่า ฿18,000' },
    { name: 'Love Bracelet โรสโกลด์ (ไซส์ 17–19)', thb: `${formatPriceTHB(4000)}–${formatPriceTHB(6500)}`, retail: `~${formatPriceTHB(9400)}`, note: 'ยอดนิยมที่สุดในไทยสำหรับกลุ่มอายุ 25–40 ปี โรสโกลด์ขายต่อต่ำกว่าทองเหลือง 10–15% แต่ยังคงมูลค่าได้ดีเยี่ยม' },
    { name: 'Love Bracelet ไวท์โกลด์ (ไซส์ 17–19)', thb: `${formatPriceTHB(4200)}–${formatPriceTHB(7000)}`, retail: `~${formatPriceTHB(10700)}`, note: 'รุ่น Love ที่พบน้อยที่สุด ดูสะอาด minimalist ความต้องการจากตลาดเอเชียตะวันออกแข็งแกร่ง ไวท์โกลด์แท้ดูเทาเล็กน้อยเมื่อเทียบกับการเคลือบ rhodium ของปลอม' },
    { name: 'Love Bracelet with Diamonds (4 เพชร ทองเหลือง)', thb: `${formatPriceTHB(6000)}–${formatPriceTHB(10000)}`, retail: `~${formatPriceTHB(14500)}`, note: 'เพชรเพิ่มความน่าสนใจแต่ขายต่อยากกว่า กลุ่มผู้ซื้อเฉพาะทาง รู้จักตลาดออกก่อนซื้อ Love เพชร' },
    { name: 'Love Bracelet เซรามิก (ดำ)', thb: `${formatPriceTHB(2500)}–${formatPriceTHB(4500)}`, retail: `~${formatPriceTHB(8200)}`, note: 'รุ่น Love ที่เข้าถึงได้มากที่สุด แกน titanium เคลือบเซรามิก เบากว่าสำหรับการใช้งานทุกวัน ยอดนิยมในไทย สามารถแตกได้เมื่อเวลาผ่าน ตรวจสอบอย่างระมัดระวัง' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Cartier Love Bracelet Guide' : 'คู่มือกำไล Cartier Love'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Cartier Love Bracelet Buying Guide 2025' : 'คู่มือซื้อกำไล Cartier Love 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The Cartier Love Bracelet is the most recognized luxury jewelry piece in Thailand. Yellow gold holds value best. Rose gold is the most popular choice for Thai buyers. Understand sizes and metals before paying pre-owned prices in Bangkok.'
          : 'กำไล Cartier Love คือเครื่องประดับหรูที่เป็นที่รู้จักมากที่สุดในไทย ทองเหลืองคงมูลค่าได้ดีที่สุด โรสโกลด์คือตัวเลือกยอดนิยมสำหรับผู้ซื้อชาวไทย เข้าใจไซส์และโลหะก่อนจ่ายราคามือสองในกรุงเทพ'}
      </p>

      <div className="space-y-4 mb-10">
        {variants.map((v, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900">{v.name}</h2>
              <div className="text-right shrink-0">
                <div className="font-semibold text-amber-700">{v.thb}</div>
                <div className="text-xs text-gray-400">{isEn ? 'Retail' : 'ราคาร้าน'}: {v.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{v.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/cartier-love-bracelet-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/cartier-love-bracelet-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/how-to-authenticate-cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate Cartier →' : 'ตรวจสอบ Cartier →'}</Link>
        <Link href={`/${locale}/compare/cartier-vs-tiffany`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Tiffany →</Link>
      </div>
    </div>
  )
}
