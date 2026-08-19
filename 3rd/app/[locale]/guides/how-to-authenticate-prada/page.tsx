import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-prada'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `How to Authenticate Prada Bags Thailand ${PRICE_YEAR} | ChicPreowned`
      : `วิธีตรวจสอบกระเป๋า Prada แท้ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `How to spot fake Prada in Thailand — triangle logo, serial tag, zipper, nylon stitching, interior label. Authenticate Prada pre-owned Bangkok ${PRICE_YEAR}.`
      : `วิธีสังเกตกระเป๋า Prada ปลอมในไทย — แผ่นโลโก้สามเหลี่ยม แท็ก serial ซิป การเย็บ nylon ป้ายภายใน ตรวจสอบ Prada มือสองในกรุงเทพ ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthenticatePradaTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { title: 'Triangle logo plate', detail: 'The enamel Prada triangle should have sharp corners and a matte finish. Font is precise — "P" has a round curve, "R" has a diagonal leg. Fakes have rounded triangle corners or blocky lettering. "PRADA" has even letter spacing — never cramped.' },
    { title: 'Serial number interior tag', detail: 'White serial tag sewn inside with "Prada" in a specific font above a serial number. Stitching on the tag is always even. Fakes have the tag glued (not sewn) or use a slightly italic font. The tag should feel flush against lining.' },
    { title: 'Zipper pull and engraving', detail: 'Zippers are YKK or branded "Prada" custom. The pull has slight weight and deep "Prada" text engraving. Fake zippers feel light and plasticky. The pull should slide smoothly without catching.' },
    { title: 'Nylon stitching (Re-Edition)', detail: 'Stitching on authentic nylon bags aligns with the weave pattern. Fakes show diagonal stitching across the nylon weave. Under direct light, authentic Prada nylon has a subtle sheen that fake nylon lacks.' },
    { title: 'Interior label', detail: '"PRADA / Milano / Made in Italy" in clean format. Fakes often have "Made In Italy" (capital I on "In") or incorrect spacing. Authentic lining is suede-like or woven fabric — smooth but never cheap-feeling.' },
    { title: 'Hardware weight', detail: 'Authentic Prada hardware is solid when lifted. "PRADA" engraving on buckles is crisp, never shallow. Fake hardware has a painted shine that wears off at edges. Tap the hardware — authentic rings clearly, fake sounds dull.' },
  ] : [
    { title: 'แผ่นโลโก้สามเหลี่ยม', detail: 'สามเหลี่ยมเคลือบอีนาเมลต้องมีมุมแหลมและพื้นผิว matte ฟอนต์ต้องแม่นยำ — "P" มีเส้นโค้งกลม "R" มีขาเฉียง ของปลอมมีมุมสามเหลี่ยมมน หรือตัวอักษรหนาทึบ "PRADA" มีระยะห่างตัวอักษรสม่ำเสมอ ไม่หนาแน่น' },
    { title: 'แท็ก serial ภายใน', detail: 'แท็กสีขาวเย็บไว้ด้านในพร้อม "Prada" ในฟอนต์เฉพาะเหนือหมายเลข serial การเย็บบนแท็กต้องสม่ำเสมอเสมอ ของปลอมมีแท็กติดกาว (ไม่เย็บ) หรือใช้ฟอนต์เอียงเล็กน้อย แท็กควรรู้สึกแนบสนิทกับซับใน' },
    { title: 'ที่จับซิปและการแกะสลัก', detail: 'ซิปเป็น YKK หรือ "Prada" แบบกำหนดเอง ที่จับมีน้ำหนักเล็กน้อยและข้อความ "Prada" แกะสลักลึก ซิปปลอมรู้สึกเบาและเหมือนพลาสติก ที่จับควรเลื่อนได้ราบรื่นโดยไม่ติด' },
    { title: 'การเย็บ nylon (Re-Edition)', detail: 'การเย็บบนกระเป๋า nylon แท้ต้องเรียงตามลายทอ ของปลอมแสดงการเย็บเฉียงข้ามลาย nylon ภายใต้แสงตรง Prada nylon แท้มีความเงาเล็กน้อยที่ nylon ปลอมขาด' },
    { title: 'ป้ายภายใน', detail: '"PRADA / Milano / Made in Italy" ในรูปแบบสะอาด ของปลอมมักมี "Made In Italy" (I ตัวใหญ่ใน "In") หรือระยะห่างผิด ซับในแท้เป็นแบบ suede-like หรือผ้าทอ — เรียบแต่ไม่รู้สึกถูก' },
    { title: 'น้ำหนัก hardware', detail: 'Hardware Prada แท้มีน้ำหนักเมื่อยก การแกะสลัก "PRADA" บนหัวเข็มขัดคมชัดไม่ตื้น Hardware ปลอมมีความเงาที่ทาสีซึ่งหลุดที่ขอบ เคาะ hardware ของแท้มีเสียงกังวาน ของปลอมเสียงทึบ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'How to Authenticate Prada' : 'วิธีตรวจสอบ Prada แท้'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `How to Authenticate Prada Bags ${PRICE_YEAR}` : `วิธีตรวจสอบกระเป๋า Prada แท้ ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Prada is one of the most counterfeited luxury brands in Southeast Asia, especially on Bangkok resale markets. The Re-Edition 2000 and Galleria are both high-risk. Six checks that identify authentic Prada in under two minutes.'
          : 'Prada คือหนึ่งในแบรนด์หรูที่ถูกปลอมแปลงมากที่สุดในเอเชียตะวันออกเฉียงใต้ โดยเฉพาะในตลาดขายต่อกรุงเทพ Re-Edition 2000 และ Galleria ทั้งสองมีความเสี่ยงสูง หกการตรวจสอบที่ระบุ Prada แท้ในเวลาไม่ถึงสองนาที'}
      </p>

      <div className="space-y-4 mb-10">
        {checks.map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">{i + 1}</div>
              <div>
                <h2 className="font-bold text-gray-900 mb-1">{c.title}</h2>
                <p className="text-sm text-gray-600">{c.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-prada" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-prada" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/prada`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Prada Pre-Owned →' : 'Prada มือสอง →'}</Link>
        <Link href={`/${locale}/compare/prada-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Gucci →</Link>
      </div>
    </div>
  )
}
