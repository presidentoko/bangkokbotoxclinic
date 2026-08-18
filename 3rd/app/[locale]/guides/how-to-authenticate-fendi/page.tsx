import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-fendi'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `How to Authenticate Fendi in Thailand: 7 Checks (${PRICE_YEAR}) | ChicPreowned`
      : `วิธียืนยันความถูกต้องของ Fendi ในไทย: 7 จุดตรวจสอบ (${PRICE_YEAR}) | ChicPreowned`,
    description: isEn
      ? 'Authenticate any Fendi bag in Thailand — FF canvas alignment, serial number, hardware engraving, stitching, leather, lining, and Made in Italy stamp. Baguette, Peekaboo, Kan I covered.'
      : 'ยืนยันความถูกต้องของกระเป๋า Fendi ใดก็ตามในไทย การจัดแนว FF canvas ซีเรียลนัมเบอร์ การแกะสลักฮาร์ดแวร์ การเย็บ หนัง ซับใน และตราประทับ Made in Italy ครอบคลุม Baguette, Peekaboo, Kan I',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthenticateFendiTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    {
      title: 'FF logo and Zucca canvas alignment',
      quick: 'FF logos must be perfectly mirrored and symmetrical — any misalignment at seams = fake',
      detail: 'On any Zucca/FF canvas piece, the pattern continues seamlessly across every seam and corner. On the Baguette: pattern continues across the flap without shifting. On Kan I: FF monogram is woven, not printed. Fakes consistently fail on pattern alignment at corners.',
    },
    {
      title: 'Interior serial number',
      quick: 'Serial on interior leather tab, stamped into leather (not printed)',
      detail: 'Format varies by year. Older pieces: "RU-23 Made in Italy" style. Modern pieces: longer alphanumeric. Must be stamped into leather, not printed. Post-2022 some pieces have NFC chip authentication. Authenticity card serial must match interior stamp.',
    },
    {
      title: 'Hardware quality and "FENDI" engraving',
      quick: '"FENDI" engraved on all hardware (not stamped/printed) — weighty, no tarnish',
      detail: 'All hardware: "FENDI" engraved on zipper pulls, clasps, feet. Peekaboo clasps: "FENDI" on interior face. Baguette FF clasp: smooth-turning. Real gold plating does not tarnish in months. Fakes: lightweight hardware, shallow letters, sticky clasps.',
    },
    {
      title: 'Stitching consistency',
      quick: '8–10 stitches per inch, thread exactly matching leather colour — zero variation',
      detail: 'Consistent 8–10 stitches per inch. Thread colour exactly matches or deliberately contrasts leather. Double stitching on Baguette gusset and base. Saddle-stitch on Peekaboo panels. Fakes: irregular stitch length, bleeding thread, puckering at corners.',
    },
    {
      title: 'Leather quality and smell',
      quick: 'Clean slightly sweet smell — harsh chemical smell = fake',
      detail: 'Fendi uses Roman nappa, satin, calf leather. New leather smells clean and slightly sweet. Genuine lambskin is buttery without being flimsy. Calf leather on Peekaboo has slight grain under light. Fakes use PU leather with strong plastic smell.',
    },
    {
      title: 'Lining and interior finishing',
      quick: 'Satin or quality cotton lining, perfectly sewn with no raw edges or rippling',
      detail: 'Genuine Baguette lining (varies by season): perfectly flat, no puckering. Interior label sewn (not glued), no exposed threads. Peekaboo: full leather interior, consistent grain. Fakes: rippling lining, glued labels, visible glue residue.',
    },
    {
      title: '"FENDI ROMA" and Made in Italy stamp',
      quick: '"FENDI ROMA" on interior label — sans-serif, not bold, not italic, consistent spacing',
      detail: '"FENDI ROMA" interior label: specific sans-serif font. "MADE IN ITALY" on separate leather tab below. Some hardware (Peekaboo clasp interior) has "MADE IN ITALY" engraved. Fakes: wrong font weight, incorrect spacing, or "Made in China" hidden inside.',
    },
  ] : [
    {
      title: 'การจัดแนวโลโก้ FF และผ้า Zucca',
      quick: 'โลโก้ FF ต้องสะท้อนกันสมบูรณ์ ไม่สมมาตรที่รอยตะเข็บ = ของปลอม',
      detail: 'บนชิ้น Zucca/FF canvas ลายดำเนินต่อเนื่องไปทั่วรอยตะเข็บและมุม บน Baguette: ลายต่อเนื่องข้ามฝากระเป๋าโดยไม่เลื่อน บน Kan I: โมโนแกรม FF ถักไม่ใช่พิมพ์ ของปลอมล้มเหลวในการจัดแนวลายที่มุมสม่ำเสมอ',
    },
    {
      title: 'ซีเรียลนัมเบอร์ภายใน',
      quick: 'ซีเรียลบน tab หนังภายใน ประทับลงในหนัง (ไม่ใช่พิมพ์)',
      detail: 'รูปแบบแตกต่างตามปี ชิ้นเก่า: สไตล์ "RU-23 Made in Italy" ชิ้นสมัยใหม่: alphanumeric ยาวกว่า ต้องประทับลงในหนัง ไม่ใช่พิมพ์ หลังปี 2022 บางชิ้นมีการยืนยัน NFC ซีเรียลบัตรยืนยันต้องตรงกับตราประทับภายใน',
    },
    {
      title: 'คุณภาพฮาร์ดแวร์และการแกะสลัก "FENDI"',
      quick: '"FENDI" แกะสลักบนฮาร์ดแวร์ทั้งหมด (ไม่ใช่ประทับ/พิมพ์) — หนัก ไม่เป็นคราบ',
      detail: 'ฮาร์ดแวร์ทั้งหมด: "FENDI" แกะสลักบนหัวซิป ตัวล็อค ขา ตัวล็อค Peekaboo: "FENDI" ด้านในหน้า ตัวล็อค Baguette FF: หมุนราบรื่น ชุบทองจริงไม่เป็นคราบในเดือน ของปลอม: ฮาร์ดแวร์เบา ตัวอักษรตื้น ตัวล็อคติด',
    },
    {
      title: 'ความสม่ำเสมอของการเย็บ',
      quick: '8–10 เข็มต่อนิ้ว ด้ายตรงกับสีหนังพอดี — ไม่มีความผันแปร',
      detail: 'สม่ำเสมอ 8–10 เข็มต่อนิ้ว สีด้ายตรงกันพอดีหรือตัดกันโดยตั้งใจกับหนัง การเย็บคู่บนขอบและฐาน Baguette การเย็บอาน saddle บนแผง Peekaboo ของปลอม: ความยาวเข็มไม่สม่ำเสมอ ด้ายซึมสี ย่นที่มุม',
    },
    {
      title: 'คุณภาพหนังและกลิ่น',
      quick: 'กลิ่นสะอาดหวานเล็กน้อย กลิ่นสารเคมีรุนแรง = ของปลอม',
      detail: 'Fendi ใช้ nappa โรมัน ซาติน หนังลูกวัว หนังใหม่มีกลิ่นสะอาดและหวานเล็กน้อย หนัง lambskin จริงนิ่มเนื้อเนยโดยไม่เบาบาง หนังลูกวัว Peekaboo มีเกรนเล็กน้อยใต้แสง ของปลอมใช้หนัง PU ที่มีกลิ่นพลาสติกแรง',
    },
    {
      title: 'ซับในและการตกแต่งภายใน',
      quick: 'ซับในซาตินหรือผ้าคุณภาพ เย็บสมบูรณ์ไม่มีขอบดิบหรือระลอก',
      detail: 'ซับใน Baguette จริง (แตกต่างตามฤดูกาล): แบนสมบูรณ์ ไม่ระลอก ป้ายภายในเย็บ (ไม่ใช่กาว) ไม่มีด้ายโผล่ Peekaboo: ภายในหนังทั้งหมด เกรนสม่ำเสมอ ของปลอม: ซับในระลอก ป้ายกาว มีรอยกาว',
    },
    {
      title: 'ตราประทับ "FENDI ROMA" และ Made in Italy',
      quick: '"FENDI ROMA" บนป้ายภายใน — sans-serif ไม่หนา ไม่ตัวเอน ระยะห่างสม่ำเสมอ',
      detail: 'ป้ายภายใน "FENDI ROMA": ฟอนต์ sans-serif เฉพาะ "MADE IN ITALY" บน tab หนังแยกด้านล่าง บางฮาร์ดแวร์ (ภายในตัวล็อค Peekaboo) มีการแกะสลัก "MADE IN ITALY" ของปลอม: น้ำหนักฟอนต์ผิด ระยะห่างผิด หรือ "Made in China" ซ่อนอยู่ภายใน',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Fendi' : 'ยืนยัน Fendi'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Fendi: 7 Checks' : 'วิธียืนยันความถูกต้องของ Fendi: 7 จุดตรวจสอบ'}
      </h1>
      <p className="text-gray-500 mb-4">
        {isEn
          ? 'Fendi bags — particularly the Baguette and Peekaboo — are among the most counterfeited luxury items. These seven checks cover the specific details genuine Fendi always gets right and fakes consistently get wrong.'
          : 'กระเป๋า Fendi โดยเฉพาะ Baguette และ Peekaboo อยู่ในกลุ่มสิ่งหรูที่ถูกปลอมมากที่สุด 7 จุดตรวจเหล่านี้ครอบคลุมรายละเอียดเฉพาะที่ Fendi แท้ทำถูกเสมอและของปลอมทำผิดสม่ำเสมอ'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-900 font-medium">{isEn ? 'Fastest check: FF canvas pattern alignment' : 'ตรวจสอบด่วนที่สุด: การจัดแนวลาย FF canvas'}</p>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'On any Zucca/FF canvas piece, the FF logo must continue perfectly across every seam. Hold up to light and look at where front meets side — genuine Fendi aligns precisely. Any misalignment immediately indicates a fake.'
            : 'บนชิ้น Zucca/FF canvas ใดก็ตาม โลโก้ FF ต้องดำเนินต่อเนื่องสมบูรณ์ข้ามรอยตะเข็บทั้งหมด ยกขึ้นรับแสงและมองที่จุดที่ด้านหน้าพบด้านข้าง Fendi แท้จัดแนวอย่างแม่นยำ การไม่ตรงแนวใดก็ตามบ่งชี้ของปลอมทันที'}
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

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold text-green-900 mb-2">{isEn ? 'Model-specific tips' : 'เคล็ดลับเฉพาะรุ่น'}</h3>
          <ul className="text-sm text-green-800 space-y-1">
            {(isEn ? [
              'Baguette: FF clasp turns smoothly — not clicks. Smooth with soft lock.',
              'Peekaboo: Gusset between 2 compartments must be full grain leather.',
              'Kan I: Spiral stud has screw-on mechanism — fakes glue the stud.',
              'Mini Sunshine: Each chain link is 12mm wide on genuine — fakes use narrower.',
            ] : [
              'Baguette: ตัวล็อค FF หมุนราบรื่น ไม่ดังคลิก ราบรื่นพร้อมล็อคอ่อน',
              'Peekaboo: ขอบกั้นระหว่าง 2 ช่องต้องเป็นหนังเกรนเต็ม',
              'Kan I: หมุด spiral มีกลไกเกลียว ของปลอมกาวหมุด',
              'Mini Sunshine: ลิงค์โซ่แต่ละอันกว้าง 12mm ของแท้ ของปลอมใช้แคบกว่า',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">{isEn ? 'Common fake signs' : 'สัญญาณของปลอมทั่วไป'}</h3>
          <ul className="text-sm text-red-800 space-y-1">
            {(isEn ? [
              'FF pattern misalignment at seams or corners',
              'Serial number printed rather than stamped',
              'Hardware that tarnishes quickly',
              'Lining that ripples or has raw edges',
              '"Made in China" stamp hidden inside',
            ] : [
              'ลาย FF ไม่ตรงแนวที่รอยตะเข็บหรือมุม',
              'ซีเรียลนัมเบอร์พิมพ์แทนที่จะประทับ',
              'ฮาร์ดแวร์ที่เป็นคราบเร็ว',
              'ซับในที่ระลอกหรือมีขอบดิบ',
              'ตราประทับ "Made in China" ซ่อนอยู่ภายใน',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-fendi" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-fendi" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/fendi`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi →</Link>
        <Link href={`/${locale}/compare/fendi-vs-loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
        <Link href={`/${locale}/compare/fendi-vs-valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Valentino →</Link>
      </div>
    </div>
  )
}
