import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-valentino'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Valentino in Thailand: 7 Checks (2025) | ChicPreowned'
      : 'วิธียืนยันความถูกต้องของ Valentino ในไทย: 7 จุดตรวจสอบ (2025) | ChicPreowned',
    description: isEn
      ? 'Authenticate any Valentino bag in Thailand — Rockstud pyramid attachment, VALENTINO GARAVANI hardware engraving, serial number, leather quality, stitching, lining, and Made in Italy stamp.'
      : 'ยืนยันความถูกต้องของกระเป๋า Valentino ใดก็ตามในไทย การยึดหมุด Rockstud การแกะสลักฮาร์ดแวร์ VALENTINO GARAVANI ซีเรียลนัมเบอร์ คุณภาพหนัง การเย็บ ซับใน และตราประทับ Made in Italy',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthenticateValentinoTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { title: 'Rockstud pyramid dimensions and attachment', quick: 'Pyramids are 4mm base, brushed finish, screwed on — not glued', detail: 'Genuine pyramids: exactly 4mm base, matte-brushed (not shiny), separate piece screwed into leather. Tilt under light — uniform satin sheen. Fakes: plastic or lightweight metal, glue traces at base, too shiny or uneven finish.' },
    { title: '"VALENTINO GARAVANI" hardware engraving', quick: 'Always full "VALENTINO GARAVANI" — never "VALENTINO" alone on any hardware', detail: 'V-lock clasp interior reads "VALENTINO GARAVANI" in sans-serif, consistent spacing. Zipper pulls same. Fakes use "VALENTINO" only, wrong font weight, or uneven spacing.' },
    { title: 'Interior serial and date code', quick: 'Style code + season code, stamped into leather — not printed', detail: 'Valentino interior stamp: style + season code, pressed into leather. Post-2015: longer alphanumeric serial. Must not be heat-printed or inkjet. Authenticity card serial matches interior stamp.' },
    { title: 'Leather quality — Italian nappa', quick: 'Buttery soft, even grain, matte — not rubbery, not overly shiny', detail: 'Valentino uses Italian nappa lambskin. Buttery-soft with very subtle even grain, slight matte finish. Roman Stud quilting: perfectly uniform diamonds. Fakes: rubbery PU, artificial grain pattern, excessive shine.' },
    { title: 'Stitching consistency', quick: '8–10 stitches per inch, thread exactly matching leather', detail: '8–10 stitches/inch on main panels, 10–12 on handle seams. Thread exactly matches leather colour. Saddle-stitch visible on Rockstud gusset. Fakes: irregular stitch length, bleeding thread, gaps at corners.' },
    { title: 'Lining and interior finishing', quick: 'Satin or quality suede lining, sewn flat — no rippling, no glued labels', detail: 'Rockstud flap: smooth satin. Larger totes: quality cotton or suede. Lining sewn perfectly flat. "VALENTINO" label embossed on leather tab, sewn in. Fakes: rippling, glued labels, wrong font, raw fabric edges.' },
    { title: '"MADE IN ITALY" country of origin', quick: '"MADE IN ITALY" on interior leather tab and back of hardware — always', detail: 'Interior tab reads "VALENTINO GARAVANI / MADE IN ITALY" in specific sans-serif font. Same on hardware backs. Fakes: "MADE IN CHINA" hidden inside or label glued over original country marking.' },
  ] : [
    { title: 'ขนาดและการยึดหมุด Rockstud', quick: 'หมุดขนาด 4mm ฐาน ผิวแปรง ยึดเกลียว ไม่ใช่กาว', detail: 'หมุดจริง: ฐาน 4mm พอดี ผิวแปรงด้าน (ไม่มันวาว) ชิ้นแยก ยึดเกลียวในหนัง เอียงใต้แสง — ประกายซาตินสม่ำเสมอ ของปลอม: พลาสติกหรือโลหะเบา รอยกาวที่ฐาน มันวาวเกินหรือผิวไม่สม่ำเสมอ' },
    { title: 'การแกะสลักฮาร์ดแวร์ "VALENTINO GARAVANI"', quick: 'เสมอ "VALENTINO GARAVANI" เต็ม ไม่ใช่ "VALENTINO" อย่างเดียวบนฮาร์ดแวร์ใด', detail: 'ด้านในตัวล็อค V อ่านว่า "VALENTINO GARAVANI" sans-serif ระยะห่างสม่ำเสมอ หัวซิปเหมือนกัน ของปลอมใช้ "VALENTINO" เท่านั้น น้ำหนักฟอนต์ผิด หรือระยะห่างไม่สม่ำเสมอ' },
    { title: 'ซีเรียลและรหัสวันที่ภายใน', quick: 'รหัสสไตล์ + รหัสซีซัน ประทับในหนัง ไม่ใช่พิมพ์', detail: 'ตราประทับภายใน Valentino: รหัสสไตล์ + ซีซัน กดลงในหนัง หลังปี 2015: ซีเรียล alphanumeric ยาวกว่า ต้องไม่ใช่การพิมพ์ด้วยความร้อนหรืออิงค์เจ็ต ซีเรียลบัตรยืนยันตรงกับตราประทับภายใน' },
    { title: 'คุณภาพหนัง — nappa อิตาลี', quick: 'นุ่มเนื้อเนย เกรนสม่ำเสมอ ด้าน ไม่ยางยืด ไม่มันวาวเกิน', detail: 'Valentino ใช้ nappa lambskin อิตาลี นุ่มเนื้อเนยพร้อมเกรนละเอียดสม่ำเสมอ ผิวด้านเล็กน้อย Roman Stud: ลายตาราง diamond สม่ำเสมอสมบูรณ์ ของปลอม: หนัง PU ยางยืด ลายเกรนประดิษฐ์ มันวาวเกิน' },
    { title: 'ความสม่ำเสมอของการเย็บ', quick: '8–10 เข็มต่อนิ้ว ด้ายตรงกับสีหนังพอดี', detail: '8–10 เข็ม/นิ้วบนแผงหลัก 10–12 บนรอยตะเข็บหูหิ้ว สีด้ายตรงกับสีหนังพอดี การเย็บ saddle เห็นได้บนขอบ Rockstud ของปลอม: ความยาวเข็มไม่สม่ำเสมอ ด้ายซึมสี ช่องว่างที่มุม' },
    { title: 'ซับในและการตกแต่งภายใน', quick: 'ซับในซาตินหรือผ้าคุณภาพ เย็บแบน ไม่ระลอก ไม่มีป้ายกาว', detail: 'Rockstud flap: ซาตินเรียบ กระเป๋าใหญ่กว่า: ผ้าคอตตอนหรือ suede คุณภาพ ซับในเย็บแบนสมบูรณ์ ป้าย "VALENTINO" นูนบน tab หนัง เย็บใน ของปลอม: ระลอก กาวป้าย ฟอนต์ผิด ขอบผ้าดิบ' },
    { title: 'ประเทศต้นกำเนิด "MADE IN ITALY"', quick: '"MADE IN ITALY" บน tab หนังภายในและด้านหลังฮาร์ดแวร์ เสมอ', detail: 'Tab ภายในอ่านว่า "VALENTINO GARAVANI / MADE IN ITALY" ในฟอนต์ sans-serif เฉพาะ เหมือนกันบนด้านหลังฮาร์ดแวร์ ของปลอม: "MADE IN CHINA" ซ่อนอยู่ภายใน หรือป้ายกาวทับเครื่องหมายประเทศดั้งเดิม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Valentino' : 'ยืนยัน Valentino'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Valentino: 7 Checks' : 'วิธียืนยันความถูกต้องของ Valentino: 7 จุดตรวจสอบ'}
      </h1>
      <p className="text-gray-500 mb-4">
        {isEn
          ? 'Valentino fakes have become increasingly sophisticated, particularly for the Rockstud — the most faked Valentino bag globally. Seven checks that separate genuine from counterfeit.'
          : 'ของปลอม Valentino มีความซับซ้อนเพิ่มขึ้นโดยเฉพาะ Rockstud ซึ่งเป็นกระเป๋า Valentino ที่ถูกปลอมมากที่สุดในโลก 7 จุดตรวจที่แยกของแท้จากของปลอม'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-900 font-medium">{isEn ? 'Fastest check: Rockstud pyramid attachment' : 'ตรวจสอบด่วนที่สุด: การยึดหมุด Rockstud'}</p>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'Gently try to twist a pyramid stud. Genuine: screwed tight, does not move at all. Fake: glued studs have slight give or rotate. At the stud base: genuine shows clean circular contact point, no glue traces.'
            : 'ลองบิดหมุด pyramid เบาๆ ของแท้: ยึดเกลียวแน่น ไม่เคลื่อนเลย ของปลอม: หมุดที่กาวมีความยืดหยุ่นเล็กน้อยหรือหมุน ที่ฐานหมุด: ของแท้แสดงจุดสัมผัสวงกลมสะอาด ไม่มีรอยกาว'}
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
          ? <Link href="/th/guides/how-to-authenticate-valentino" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-valentino" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Valentino →</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL vs Valentino →</Link>
        <Link href={`/${locale}/compare/fendi-vs-valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Valentino →</Link>
      </div>
    </div>
  )
}
