import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-miu-miu'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Miu Miu in Thailand: 7 Checks (2025) | ChicPreowned'
      : 'วิธียืนยันความถูกต้องของ Miu Miu ในไทย: 7 จุดตรวจสอบ (2025) | ChicPreowned',
    description: isEn
      ? 'Authenticate any Miu Miu bag in Thailand — MIU MIU interior emboss, serial format (2 letters + 4 digits), washed nappa texture, matelassé quilting, bow clasp weight, stitching, and Made in Italy stamp.'
      : 'ยืนยันความถูกต้องของกระเป๋า Miu Miu ในไทย การนูน MIU MIU ภายใน รูปแบบซีเรียล (2 ตัวอักษร + 4 หลัก) เนื้อสัมผัส nappa ที่ถูกล้าง การเย็บ matelassé น้ำหนักตัวล็อคโบว์ การเย็บ และตราประทับ Made in Italy',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthenticateMiuMiuTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { title: '"MIU MIU" interior leather tab emboss', quick: 'Two equal "MIU" words, same size, specific spacing, quality leather tab', detail: 'Interior tab: "MIU MIU" in clean uppercase sans-serif, both words same size and weight, even gap between them. Below: "MADE IN ITALY." Fakes: wrong font (too bold), uneven spacing, or "MiuMiu" without space.' },
    { title: 'Serial number format: 2 letters + 4 digits', quick: 'Format: 2 uppercase letters + 4 digits (e.g., FP1234) — stamped not printed', detail: 'Miu Miu serial: 2 uppercase letters + 4 digits, stamped into leather tab. Fakes often copy Prada\'s longer serial format by mistake — Miu Miu and Prada are sister brands with different serial conventions. Any all-numeric, 7+ character, or lowercase serial is fake.' },
    { title: 'Washed nappa leather texture', quick: 'Matte, slightly crinkled, soft micro-wrinkle — not smooth or shiny', detail: 'Wander signature washed nappa: tumbled to create soft crinkled texture, matte finish. Slight resistance when running finger across. Genuine has natural tonal variation — lighter at folds, darker at crinkle base. Fakes: too flat/shiny (smooth PU) or too regular (textured PU with no variation).' },
    { title: 'Matelassé quilting precision', quick: 'Perfectly uniform diamonds — same size edge-to-edge, no puckering at corners', detail: 'Quilted pieces: every diamond identical size, consistent depth. Four-diamond junctions: clean four-pointed meeting, no puckering. Stitching channel even. Fakes: irregular diamond sizes, puckering at corners, or stitching too deep (bunching) or too shallow (flat).' },
    { title: '"MIU MIU" hardware and bow clasp', quick: 'Bow clasp: cast metal, weighty, arms do not flex — "MIU MIU" engraved clearly', detail: 'Wander bow: cast metal, substantial weight, bow arms rigid under light pressure. Arcadie clasp: "MIU MIU" on interior face. Engraving: consistent depth, correct spacing. Fakes: lightweight hollow hardware that bends, shallow engraving, wrong character spacing.' },
    { title: 'Stitching consistency', quick: '8–10 stitches per inch, thread exactly matching leather, double stitching at stress points', detail: '8-10/inch, consistent tension, exact colour match. Double-stitching at handle attachment and base corners. Wander ruching: even gathers. Arcadie: single stitch on main panels. Fakes: irregular stitch length, non-matching thread colour, uneven gathers.' },
    { title: 'Lining and interior finishing', quick: 'Quality woven or suede lining, flat and sewn — "MIU MIU" tab always sewn both ends, never glued', detail: 'Lining: quality woven nylon or fabric, sewn flat, no rippling. Pockets with finished edges. "MIU MIU" label tab sewn at both ends (not glued). Suede interiors: fine, consistent, no pilling. Fakes: rippling linings, one-end-glued labels, raw pocket edges.' },
  ] : [
    { title: 'การนูน tab หนังภายใน "MIU MIU"', quick: 'คำ "MIU" สองคำเท่ากัน ขนาดเดียวกัน ระยะห่างเฉพาะ tab หนังคุณภาพ', detail: 'Tab ภายใน: "MIU MIU" ใน uppercase sans-serif สะอาด ทั้งสองคำขนาดและน้ำหนักเดียวกัน ช่องว่างระหว่างทั้งสองคำสม่ำเสมอ ด้านล่าง: "MADE IN ITALY" ของปลอม: ฟอนต์ผิด (หนาเกินไป) ระยะห่างไม่สม่ำเสมอ หรือ "MiuMiu" ไม่มีช่องว่าง' },
    { title: 'รูปแบบซีเรียล: 2 ตัวอักษร + 4 หลัก', quick: 'รูปแบบ: 2 ตัวอักษรพิมพ์ใหญ่ + 4 หลัก (เช่น FP1234) ประทับไม่ใช่พิมพ์', detail: 'ซีเรียล Miu Miu: 2 ตัวอักษรพิมพ์ใหญ่ + 4 หลัก ประทับใน tab หนัง ของปลอมมักคัดลอกรูปแบบซีเรียลยาวกว่าของ Prada ผิดพลาด เนื่องจาก Miu Miu และ Prada เป็นแบรนด์น้องสาวที่มีรูปแบบซีเรียลต่างกัน ซีเรียลตัวเลขล้วน มากกว่า 7 ตัว หรือตัวพิมพ์เล็ก คือของปลอม' },
    { title: 'เนื้อสัมผัสหนัง nappa ที่ถูกล้าง', quick: 'ด้าน ย่นเล็กน้อย micro-wrinkle นุ่ม ไม่เรียบหรือมันวาว', detail: 'Nappa ที่ถูกล้างเป็นเอกลักษณ์ Wander: tumbled เพื่อสร้างเนื้อสัมผัสย่นนุ่ม ผิวด้าน มีแรงต้านเล็กน้อยเมื่อลากนิ้วข้าม ของแท้มีความผันแปรโทนสีธรรมชาติ สว่างกว่าที่รอยพับ เข้มกว่าที่ฐานรอยย่น ของปลอม: เรียบ/มันวาวเกินไป (PU เรียบ) หรือสม่ำเสมอเกิน (PU ที่มีเนื้อสัมผัสแต่ไม่มีความผันแปร)' },
    { title: 'ความแม่นยำของลาย Matelassé', quick: 'เพชรสม่ำเสมอสมบูรณ์ ขนาดเดียวกันทุกขอบ ไม่ย่นที่มุม', detail: 'ชิ้นที่มีลาย: ทุก diamond ขนาดเดียวกัน ความลึกสม่ำเสมอ จุดเชื่อมสี่ diamond: การพบกันสี่จุดสะอาด ไม่ย่น ช่องการเย็บสม่ำเสมอ ของปลอม: ขนาด diamond ไม่สม่ำเสมอ ย่นที่มุม หรือการเย็บลึกเกิน (พอง) หรือตื้นเกิน (แบน)' },
    { title: 'ฮาร์ดแวร์และตัวล็อคโบว์ "MIU MIU"', quick: 'ตัวล็อคโบว์: โลหะหล่อ หนัก แขนไม่โค้งงอ "MIU MIU" แกะสลักชัดเจน', detail: 'โบว์ Wander: โลหะหล่อ น้ำหนักจริงจัง แขนโบว์แข็งภายใต้แรงกดเบา ตัวล็อค Arcadie: "MIU MIU" ด้านในหน้า การแกะสลัก: ความลึกสม่ำเสมอ ระยะห่างถูกต้อง ของปลอม: ฮาร์ดแวร์เบากลวงที่โค้งงอ การแกะสลักตื้น ระยะห่างตัวอักษรผิด' },
    { title: 'ความสม่ำเสมอของการเย็บ', quick: '8–10 เข็มต่อนิ้ว ด้ายตรงกับสีหนังพอดี การเย็บคู่ที่จุดรับแรง', detail: '8-10/นิ้ว แรงตึงสม่ำเสมอ ตรงกับสีพอดี การเย็บคู่ที่การติดหูหิ้วและมุมฐาน การรวบ Wander: รวบสม่ำเสมอ Arcadie: การเย็บเดี่ยวบนแผงหลัก ของปลอม: ความยาวเข็มไม่สม่ำเสมอ สีด้ายไม่ตรง รวบไม่สม่ำเสมอ' },
    { title: 'ซับในและการตกแต่งภายใน', quick: 'ซับในเนื้อทอหรือ suede คุณภาพ แบนและเย็บ tab "MIU MIU" เย็บทั้งสองด้านเสมอ ไม่กาว', detail: 'ซับใน: เนื้อทอ nylon หรือผ้าคุณภาพ เย็บแบน ไม่ระลอก กระเป๋าพร้อมขอบที่เสร็จสมบูรณ์ tab ป้าย "MIU MIU" เย็บทั้งสองด้าน (ไม่กาว) ซับใน suede: ละเอียด สม่ำเสมอ ไม่ lint ของปลอม: ซับในระลอก ป้ายกาวด้านเดียว ขอบกระเป๋าดิบ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Miu Miu' : 'ยืนยัน Miu Miu'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Miu Miu: 7 Checks' : 'วิธียืนยันความถูกต้องของ Miu Miu: 7 จุดตรวจสอบ'}
      </h1>
      <p className="text-gray-500 mb-4">
        {isEn
          ? 'Miu Miu fakes have surged alongside the brand\'s Gen Z resurgence — particularly for the Wander bag. Seven checks focused on specific construction details that distinguish genuine Miu Miu from high-quality counterfeits.'
          : 'ของปลอม Miu Miu พุ่งสูงพร้อมกับการฟื้นคืนชีพของแบรนด์ในกลุ่ม Gen Z โดยเฉพาะกระเป๋า Wander 7 จุดตรวจที่เน้นรายละเอียดโครงสร้างเฉพาะที่แยกของแท้ออกจากของปลอมคุณภาพสูง'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-900 font-medium">{isEn ? 'Fastest check: serial number format' : 'ตรวจสอบด่วนที่สุด: รูปแบบซีเรียลนัมเบอร์'}</p>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'Genuine Miu Miu serial: 2 uppercase letters + 4 digits (e.g., FP1234, RL5678). If the serial is all-numeric, has more than 6 characters, or uses lowercase letters — it is not a genuine Miu Miu serial. This eliminates a large portion of fakes immediately.'
            : 'ซีเรียล Miu Miu จริง: 2 ตัวอักษรพิมพ์ใหญ่ + 4 หลัก (เช่น FP1234, RL5678) ถ้าซีเรียลเป็นตัวเลขล้วน มากกว่า 6 ตัว หรือใช้ตัวพิมพ์เล็ก ไม่ใช่ซีเรียล Miu Miu จริง สิ่งนี้กำจัดของปลอมจำนวนมากทันที'}
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {checks.map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-1">{i + 1}. {c.title}</h2>
            <p className="text-xs text-amber-700 font-medium mb-2">{c.quick}</p>
            <p className="text-sm text-gray-600">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-miu-miu" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-miu-miu" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/miu-miu`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu →</Link>
        <Link href={`/${locale}/compare/prada-vs-miu-miu`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Miu Miu →</Link>
        <Link href={`/${locale}/trends/miu-miu-rise-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Miu Miu Rise 2025' : 'เทรนด์ Miu Miu 2025'} →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-prada`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate Prada' : 'ยืนยัน Prada'} →</Link>
      </div>
    </div>
  )
}
