import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-dior'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Dior Bags Thailand 2025 | ChicPreowned'
      : 'วิธีตรวจสอบความแท้กระเป๋า Dior ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Dior bag authentication guide for Thai buyers — Lady Dior charms, saddle stitching, serial codes, CD logo, cannage stitching. Spot fakes.'
      : 'คู่มือตรวจสอบ Dior สำหรับผู้ซื้อชาวไทย — จี้ Lady Dior การเย็บ saddle รหัสซีเรียล โลโก้ CD การเย็บ cannage',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthDiorTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { n: '1', title: 'Lady Dior Letter Charms (DIOR)', body: 'On Lady Dior bags, the five charm letters spell D-I-O-R. Each letter is a separate piece and should hang freely and evenly. Letters must be identical in finish — if one charm looks different, it may be a replacement. The chain connecting each charm should feel heavy and substantial.' },
    { n: '2', title: 'Cannage Quilting Alignment', body: 'Dior cannage stitching forms a diamond pattern inspired by Napoleon III chairs. Lines must be perfectly straight and evenly spaced. At corners and edges, the diamonds must continue cleanly. Fakes distort the grid at edges or show inconsistent diamond sizes.' },
    { n: '3', title: '"Christian Dior" Interior Stamp', body: 'Inside every authentic Dior bag is a "Christian Dior" stamp — typically gold embossed on a leather panel. The font is specific: fine serifs, evenly spaced. Look also for "Made in Italy" or "Made in France" stamped nearby.' },
    { n: '4', title: 'Hardware CD Logo', body: 'Clasp hardware on Dior bags displays the CD monogram in clean, sharp relief. The C and D should overlap elegantly. Hardware is heavy — hold it in your palm. Cheap fakes use lightweight hardware with blurry or shallow engraving.' },
    { n: '5', title: 'Serial Number Location', body: 'Dior uses a serial number system found on a white label inside a pocket or sewn into the lining. Format: letters followed by numbers (e.g., S0856CBAA_M900). Some models use a microchip (post-2021). Absence of any serial = high risk.' },
    { n: '6', title: 'Stitching Quality', body: 'Dior uses tight, consistent hand-saddle stitching on leather trim and straps. Stitch count per centimeter is high. Thread color matches the leather. Loose, uneven, or machine-only stitching on trim areas is a red flag.' },
  ] : [
    { n: '1', title: 'จี้ตัวอักษร Lady Dior (DIOR)', body: 'บน Lady Dior จี้ตัวอักษรห้าตัวสะกด D-I-O-R แต่ละตัวเป็นชิ้นแยกและควรห้อยอย่างอิสระสม่ำเสมอ ตัวอักษรต้องเหมือนกันในเรื่องผิวเสร็จ ถ้าจี้ตัวหนึ่งดูต่างออกไปอาจเป็นของทดแทน โซ่เชื่อมแต่ละจี้ควรรู้สึกหนักและมีน้ำหนัก' },
    { n: '2', title: 'การจัดเรียงลาย Cannage Quilting', body: 'การเย็บ cannage ของ Dior สร้างลายเพชรได้รับแรงบันดาลใจจากเก้าอี้ Napoleon III เส้นต้องตรงสมบูรณ์และเว้นระยะสม่ำเสมอ ที่มุมและขอบ เพชรต้องต่อเนื่องสะอาด ของปลอมบิดเบือนตารางที่ขอบหรือแสดงขนาดเพชรไม่สม่ำเสมอ' },
    { n: '3', title: 'ตราประทับ "Christian Dior" ภายใน', body: 'ภายในกระเป๋า Dior แท้ทุกใบมีตราประทับ "Christian Dior" — มักเป็นทองนูนบนแผงหนัง ตัวอักษรเฉพาะ: เซอริฟบาง เว้นระยะสม่ำเสมอ มองหา "Made in Italy" หรือ "Made in France" ประทับใกล้กัน' },
    { n: '4', title: 'โลโก้ CD บน Hardware', body: 'Hardware ตัวล็อคบนกระเป๋า Dior แสดงโมโนแกรม CD นูนชัดเจน C และ D ควรทับซ้อนกันอย่างสง่างาม Hardware หนัก — ถือในฝ่ามือ ของปลอมราคาถูกใช้ hardware เบาพร้อมแกะสลักเบลอหรือตื้น' },
    { n: '5', title: 'ตำแหน่งหมายเลขซีเรียล', body: 'Dior ใช้ระบบหมายเลขซีเรียลบนป้ายสีขาวภายในกระเป๋าหรือเย็บบนซับใน รูปแบบ: ตัวอักษรตามด้วยตัวเลข (เช่น S0856CBAA_M900) บางรุ่นใช้ไมโครชิป (หลังปี 2021) ไม่มีซีเรียลเลย = ความเสี่ยงสูง' },
    { n: '6', title: 'คุณภาพการเย็บ', body: 'Dior ใช้การเย็บ saddle มืออย่างแน่น สม่ำเสมอบนขอบหนังและสายสะพาย จำนวนเย็บต่อเซนติเมตรสูง สีด้ายตรงกับหนัง การเย็บหลวม ไม่สม่ำเสมอ หรือเครื่องจักรอย่างเดียวบนบริเวณขอบเป็นสัญญาณเตือน' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Dior' : 'ตรวจสอบ Dior'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Dior Bags' : 'วิธีตรวจสอบความแท้กระเป๋า Dior'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Lady Dior and Saddle bags are heavily counterfeited. The cannage quilting alignment and CD hardware are the fastest tells. Six checks to verify authenticity before buying pre-owned Dior in Thailand.'
          : 'Lady Dior และ Saddle ถูกปลอมแปลงอย่างหนัก การจัดเรียงลาย cannage quilting และ hardware CD คือสิ่งที่บอกได้เร็วที่สุด หกขั้นตอนตรวจสอบความแท้ก่อนซื้อ Dior มือสองในไทย'}
      </p>

      <div className="space-y-5 mb-10">
        {checks.map((c) => (
          <div key={c.n} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-gray-200 leading-none">{c.n}</span>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">{c.title}</h2>
                <p className="text-sm text-gray-600">{c.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-dior" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-dior" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Dior Pre-Owned →' : 'Dior มือสอง →'}</Link>
        <Link href={`/${locale}/compare/chanel-vs-dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Dior →</Link>
      </div>
    </div>
  )
}
