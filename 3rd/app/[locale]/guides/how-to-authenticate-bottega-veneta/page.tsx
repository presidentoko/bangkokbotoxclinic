import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-bottega-veneta'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Bottega Veneta Thailand 2025 | ChicPreowned'
      : 'วิธีตรวจสอบ Bottega Veneta มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Authenticate Bottega Veneta bags in Thailand — check the intrecciato weave, leather, hardware. 6-step guide with Thai authentication options.'
      : 'ตรวจสอบ Bottega Veneta ในไทย — เช็คการถัก intrecciato หนัง hardware คู่มือ 6 ขั้นตอน พร้อมตัวเลือกตรวจสอบในไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthBottegaTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { step: 1, title: 'Intrecciato Weave Consistency', detail: 'Each strip ~5–8mm, uniform diagonal spacing, smooth flush when running finger across. Fakes: uneven gaps, fraying edges, inconsistent angles.' },
    { step: 2, title: 'Leather Quality & Feel', detail: 'Lambskin: impossibly soft. Calfskin: firm fine pebble. Authentic BV has warmth and yield on first touch. Fake leather = plasticky, stiff, uniform.' },
    { step: 3, title: 'Hardware (Minimal)', detail: 'BV uses almost no visible hardware. What exists is matte/brushed, heavy, smooth-turning. Gritty zippers or wobbling hardware = fake.' },
    { step: 4, title: 'Interior Stitching', detail: 'Suede or calf interior, never nylon. 8–10 stitches per cm, no glue residue. Jodie knot perfectly formed.' },
    { step: 5, title: 'Interior Stamp', detail: 'Pre-2021: "Bottega Veneta" stamped in gold inside. Post-2022 varies. Blurry or off-center = fake.' },
    { step: 6, title: 'Made in Italy', detail: 'All BV made in Italy (Vicenza). No serial numbers — BV does not use serial codes on most pieces.' },
  ] : [
    { step: 1, title: 'ความสม่ำเสมอของการถัก Intrecciato', detail: 'แต่ละแถบ ~5–8mm ช่องว่างสม่ำเสมอแนวทแยง ลื่นเมื่อนิ้วไปทาบ ของปลอม: ช่องไม่สม่ำเสมอ ขอบหลุดลุ่ย มุมไม่สม่ำเสมอ' },
    { step: 2, title: 'คุณภาพและสัมผัสหนัง', detail: 'หนังแกะ: นุ่มอย่างไม่น่าเชื่อ หนังวัว: แน่นมีเนื้อสัมผัสเม็ดละเอียด BV แท้มีความอบอุ่นและยืดหยุ่นเมื่อแตะครั้งแรก หนังปลอม = พลาสติก แข็ง สม่ำเสมอเกินไป' },
    { step: 3, title: 'Hardware (น้อยมาก)', detail: 'BV ตั้งใจใช้ hardware น้อยมาก สิ่งที่มีเป็น matte/brushed หนัก เคลื่อนได้ลื่น ซิปฝืดหรือ hardware โยกคือของปลอม' },
    { step: 4, title: 'การเย็บภายใน', detail: 'บุด้วยซวดหรือหนังวัว ไม่ใช่ไนลอน 8–10 เข็มต่อซม. ไม่มีรอยกาว ปมที่จับ Jodie สมบูรณ์แบบ' },
    { step: 5, title: 'ตราประทับภายใน', detail: 'ก่อน 2021: "Bottega Veneta" ประทับทองภายใน หลัง 2022 อาจต่างออกไป พร่ามัวหรือเยื้อง = ของปลอม' },
    { step: 6, title: 'Made in Italy', detail: 'BV ทุกชิ้นผลิตในอิตาลี (Vicenza) ไม่มีเลขซีเรียล — BV ไม่ใช้ serial codes กับชิ้นส่วนใหญ่' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Bottega Veneta' : 'ตรวจสอบ Bottega Veneta'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Bottega Veneta' : 'วิธีตรวจสอบ Bottega Veneta มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'BV is among the most counterfeited brands — because the intrecciato weave is both iconic and difficult to fake well. Six checks to separate real from fake.'
          : 'BV เป็นหนึ่งในแบรนด์ที่ถูกปลอมมากที่สุด เพราะการถัก intrecciato ทั้งเป็นไอคอนและยากที่จะปลอมได้ดี หกการตรวจสอบเพื่อแยกแท้จากปลอม'}
      </p>

      <div className="space-y-4 mb-10">
        {checks.map(check => (
          <div key={check.step} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{check.step}</span>
              <h2 className="font-semibold text-gray-900">{check.title}</h2>
            </div>
            <p className="text-sm text-gray-600 ml-10">{check.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-bottega-veneta" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-bottega-veneta" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/bottega-veneta`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">BV {isEn ? 'Pre-Owned' : 'มือสอง'} →</Link>
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authentication Guide →' : 'คู่มือตรวจสอบ →'}</Link>
      </div>
    </div>
  )
}
