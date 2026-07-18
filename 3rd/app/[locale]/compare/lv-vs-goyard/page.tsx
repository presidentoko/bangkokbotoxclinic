import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/lv-vs-goyard'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Louis Vuitton vs Goyard Pre-Owned Thailand 2025 | ChicPreowned'
      : 'Louis Vuitton vs Goyard มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'LV vs Goyard comparison — canvas bags, resale value, availability in Thailand. THB prices and which is the better buy.'
      : 'เปรียบ LV กับ Goyard — กระเป๋าผ้า มูลค่าขายต่อ หาง่ายแค่ไหนในไทย ราคาบาทและอันไหนคุ้มกว่า',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function LVvsGoyardTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Canvas type', lv: 'Monogram (coated canvas on cotton), Damier', goyard: 'Goyardine (hand-painted on linen-cotton)' },
    { metric: 'Signature piece', lv: 'Neverfull MM ฿68,000–90,000', goyard: 'Saint-Louis PM ฿48,000–72,000' },
    { metric: 'Logo visibility', lv: 'High — LV initials everywhere', goyard: 'Subtle — small "Y" chevron pattern' },
    { metric: 'Resale vs retail', lv: '70–95% for Neverfull, 80–110% for rare pieces', goyard: '75–120% — often trades at or above retail' },
    { metric: 'Availability in Thailand', lv: 'Wide — Siam Paragon, ICONSIAM, CentralWorld', goyard: 'Limited — one boutique (Emporium)' },
    { metric: 'Pre-owned market depth', lv: 'Deepest — most listed on resale platforms', goyard: 'Thinner — fewer listings, faster sell-through' },
    { metric: 'Counterfeit risk', lv: 'Extremely high', goyard: 'High' },
    { metric: 'Social recognition', lv: 'Universal', goyard: 'Insider / connoisseur' },
    { metric: 'Durability', lv: 'Canvas very durable, vachetta trim requires care', goyard: 'Canvas durable, canvas scratches more visible' },
    { metric: 'Price at retail (THB)', lv: 'Neverfull MM: ฿58,000 (Thai boutique)', goyard: 'Saint-Louis PM: ฿57,000 approx' },
  ] : [
    { metric: 'ประเภทผ้า', lv: 'Monogram (ผ้าเคลือบบนฝ้าย), Damier', goyard: 'Goyardine (วาดลายมือบนลินิน-ฝ้าย)' },
    { metric: 'ชิ้นเด่น', lv: 'Neverfull MM ฿68,000–90,000', goyard: 'Saint-Louis PM ฿48,000–72,000' },
    { metric: 'ความชัดเจนของโลโก้', lv: 'สูง — อักษร LV ทั่วชิ้น', goyard: 'เรียบ — ลาย "Y" เล็กๆ' },
    { metric: 'ขายต่อ vs ราคาร้าน', lv: '70–95% สำหรับ Neverfull 80–110% ชิ้นหายาก', goyard: '75–120% — มักซื้อขายที่หรือสูงกว่าราคาร้าน' },
    { metric: 'หาได้ในไทย', lv: 'แพร่หลาย — สยามพารากอน ICONSIAM เซ็นทรัลเวิลด์', goyard: 'จำกัด — บูติกเดียว (เอ็มโพเรียม)' },
    { metric: 'ความลึกตลาดมือสอง', lv: 'ลึกที่สุด — ลิสต์มากที่สุดบนแพลตฟอร์มมือสอง', goyard: 'บางกว่า — ลิสต์น้อยกว่า ขายเร็วกว่า' },
    { metric: 'ความเสี่ยงของปลอม', lv: 'สูงมาก', goyard: 'สูง' },
    { metric: 'การรับรู้ทางสังคม', lv: 'สากล', goyard: 'Insider / ผู้เชี่ยวชาญ' },
    { metric: 'ความทนทาน', lv: 'ผ้าทนมาก ขอบ vachetta ต้องดูแล', goyard: 'ผ้าทน รอยขูดบนผ้าเห็นได้ชัดกว่า' },
    { metric: 'ราคาร้าน (บาท)', lv: 'Neverfull MM: ฿58,000 (บูติกไทย)', goyard: 'Saint-Louis PM: ประมาณ ฿57,000' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>LV vs Goyard</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Louis Vuitton vs Goyard Pre-Owned' : 'Louis Vuitton vs Goyard มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both use printed canvas as their signature material. Both are Paris houses. But LV is the most recognized luxury brand on earth; Goyard is the intentionally obscure alternative. The choice reveals your relationship with visibility.'
          : 'ทั้งคู่ใช้ผ้าพิมพ์เป็นวัสดุเด่น ทั้งคู่เป็นเมซองปารีส แต่ LV คือแบรนด์หรูที่มีคนรู้จักมากที่สุดในโลก Goyard คือทางเลือกที่ตั้งใจไม่เป็นที่รู้จัก การเลือกเผยถึงความสัมพันธ์ของคุณกับการมองเห็น'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Louis Vuitton</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Goyard</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.lv}</td>
                <td className="py-3 px-4 text-gray-700">{r.goyard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/lv-vs-goyard" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/lv-vs-goyard" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'LV Pre-Owned →' : 'LV มือสอง →'}</Link>
        <Link href={`/${locale}/brands/goyard`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Goyard Pre-Owned →' : 'Goyard มือสอง →'}</Link>
        <Link href={`/${locale}/compare/hermes-vs-goyard`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès vs Goyard →</Link>
      </div>
    </div>
  )
}
