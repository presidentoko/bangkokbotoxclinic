import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/lv-monogram-vs-damier'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `LV Monogram vs Damier Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : `LV Monogram vs Damier มือสองในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Louis Vuitton Monogram vs Damier Ebene vs Azur — which canvas holds value better? Pre-owned price comparison and guide for Thai buyers.'
      : 'Louis Vuitton Monogram vs Damier Ebene vs Azur — ผ้าไหนคงมูลค่าดีกว่า? เปรียบราคามือสองและคู่มือสำหรับผู้ซื้อชาวไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function LVMonogramVsDamierTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Print type', mono: 'Brown LV monogram on tan canvas (1896)', ebene: 'Brown/black checkerboard (2000)', azur: 'Light grey/cream checkerboard (2006)' },
    { metric: 'Lining', mono: 'Tan microfiber or alcantra', ebene: 'Red or beige microfiber', azur: 'Dark red microfiber' },
    { metric: 'Logo visibility', mono: 'High — classic LV pattern everyone recognizes', ebene: 'Medium — subtle, understated', azur: 'Seasonal — fresh/casual feel' },
    { metric: 'Resale (Neverfull MM)', mono: '฿68,000–90,000', ebene: '฿70,000–92,000', azur: '฿65,000–85,000' },
    { metric: 'Hold value', mono: 'Strong — most requested, deepest pool', ebene: 'Slightly stronger — appeals to understated buyers', azur: 'Slightly weaker — seasonal/summer associations' },
    { metric: 'Care', mono: 'Vachetta trim darkens over time (patinas)', ebene: 'Cowhide trim — more durable than vachetta', azur: 'Light trim shows dirt — requires more care' },
    { metric: 'Aging characteristics', mono: 'Beautiful honey patina on vachetta', ebene: 'Darkens at leather parts; looks sophisticated', azur: 'Light canvas can show stains — condition matters' },
    { metric: 'Who chooses it', mono: 'Classic LV enthusiasts + first-time buyers', ebene: 'Understated luxury seekers', azur: 'Resort/vacation aesthetic buyers' },
  ] : [
    { metric: 'ประเภทลาย', mono: 'โมโนแกรม LV สีน้ำตาลบนผ้าสีแทน (1896)', ebene: 'ตาหมากรุกน้ำตาล/ดำ (2000)', azur: 'ตาหมากรุกเทาอ่อน/ครีม (2006)' },
    { metric: 'บุด้านใน', mono: 'ไมโครไฟเบอร์สีแทนหรือ alcantra', ebene: 'ไมโครไฟเบอร์สีแดงหรือเบจ', azur: 'ไมโครไฟเบอร์สีแดงเข้ม' },
    { metric: 'ความชัดเจนของโลโก้', mono: 'สูง — ลาย LV คลาสสิกที่ทุกคนรู้จัก', ebene: 'ปานกลาง — เรียบ ไม่โอ้อวด', azur: 'ตามฤดูกาล — ให้ความรู้สึกสดใส/สบายๆ' },
    { metric: 'ราคาขายต่อ (Neverfull MM)', mono: '฿68,000–90,000', ebene: '฿70,000–92,000', azur: '฿65,000–85,000' },
    { metric: 'คงมูลค่า', mono: 'แข็งแกร่ง — ขอมากที่สุด ตลาดลึก', ebene: 'แข็งแกร่งกว่าเล็กน้อย — ดึงดูดผู้ซื้อที่ไม่ชอบโอ้อวด', azur: 'อ่อนแอกว่าเล็กน้อย — ดูเป็นฤดูกาล/ฤดูร้อน' },
    { metric: 'การดูแล', mono: 'ขอบ vachetta เปลี่ยนสีตามเวลา (patina)', ebene: 'ขอบหนังวัว — ทนทานกว่า vachetta', azur: 'ขอบอ่อนดูดสิ่งสกปรก — ต้องดูแลมากขึ้น' },
    { metric: 'ลักษณะการเก่า', mono: 'Patina สีน้ำผึ้งสวยงามบน vachetta', ebene: 'ส่วนหนังเข้มขึ้น ดูมีสไตล์', azur: 'ผ้าอ่อนเห็นคราบ — สภาพสำคัญมาก' },
    { metric: 'ใครเลือกซื้อ', mono: 'ผู้ชื่นชอบ LV คลาสสิก + ผู้ซื้อครั้งแรก', ebene: 'ผู้ต้องการความหรูแบบเรียบๆ', azur: 'ผู้ชื่นชอบความรู้สึก Resort/vacation' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>LV Monogram vs Damier</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'LV Monogram vs Damier Ebene vs Azur' : 'LV Monogram vs Damier Ebene vs Azur'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Louis Vuitton has three main canvas patterns. All use coated canvas — the specific pattern affects resale demand, care requirements, and who the bag appeals to.'
          : 'Louis Vuitton มีลายผ้าหลักสามแบบ ทั้งหมดใช้ผ้าเคลือบ — ลายเฉพาะส่งผลต่อความต้องการมือสอง การดูแล และใครที่กระเป๋าดึงดูด'}
      </p>

      <ThaiPriceCallout
        slugs={['louis-vuitton/neverfull-mm', 'louis-vuitton/speedy-25']}
        locale={locale}
      />

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/4"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Monogram</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Damier Ebene</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Damier Azur</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.mono}</td>
                <td className="py-3 px-4 text-gray-700">{r.ebene}</td>
                <td className="py-3 px-4 text-gray-700">{r.azur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 mb-8">
        <strong>{isEn ? 'Verdict:' : 'สรุป:'}</strong>{' '}
        {isEn
          ? 'Damier Ebene holds value marginally better than Monogram in most markets. Azur is the riskiest for resale. But Monogram\'s market depth (more buyers, faster sell) often compensates.'
          : 'Damier Ebene คงมูลค่าดีกว่า Monogram เล็กน้อยในตลาดส่วนใหญ่ Azur เสี่ยงที่สุดสำหรับการขายต่อ แต่ความลึกของตลาด Monogram (ผู้ซื้อมากกว่า ขายเร็วกว่า) มักชดเชยได้'}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/lv-monogram-vs-damier" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/lv-monogram-vs-damier" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'LV Pre-Owned →' : 'LV มือสอง →'}</Link>
        <Link href={`/${locale}/guides/lv-neverfull-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Neverfull Size Guide →</Link>
      </div>
    </div>
  )
}
