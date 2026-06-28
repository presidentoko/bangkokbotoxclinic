import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-tag-heuer'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate TAG Heuer in Thailand: 7 Checks (2025) | ChicPreowned'
      : 'วิธียืนยันความถูกต้องของ TAG Heuer ในไทย: 7 จุดตรวจสอบ (2025) | ChicPreowned',
    description: isEn
      ? 'Authenticate any TAG Heuer watch in Thailand with 7 checks: caseback engraving, dial text, movement, crown, serial, clasp, and crystal. Covers Aquaracer, Carrera, Monaco.'
      : 'ยืนยันความถูกต้องของนาฬิกา TAG Heuer ในไทยด้วย 7 จุดตรวจ: การแกะสลักฝาหลัง, ตัวหน้าปัด, จักรกล, มงกุฎ, ซีเรียล, คลิป และกระจก ครอบคลุม Aquaracer, Carrera, Monaco',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthenticateTagHeuerTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    {
      title: 'Caseback engraving',
      quick: 'Always "SWISS MADE" or "SWISS MADE IN GERMANY" with model name — deep, precise laser engraving',
      detail: 'Genuine TAG Heuer casebacks have deep precise engraving. The "H" of Heuer is larger than surrounding letters. Aquaracer: wave pattern screw-down caseback. Carrera: solid polished caseback. Fakes: shallow engraving, inconsistent font, missing "H" emphasis.',
    },
    {
      title: 'Dial text and logo precision',
      quick: '"TAG Heuer" text should be razor-crisp — any blur or feathering is a red flag',
      detail: 'TAG Heuer uses a specific helvetica-like font. The "H" in "Heuer" has a distinctive cross-bar. Subdial text is printed, not applied. On fakes: fuzzy text edges, incorrect font weight, inconsistent capitalization.',
    },
    {
      title: 'Movement quality',
      quick: 'Many TAG Heuers have solid casebacks — verify by checking serial against TAG Heuer\'s website',
      detail: 'TAG Heuer uses ETA, Sellita movements, and their in-house Calibre 5. The Heuer 02 chronograph has in-house column wheel and vertical clutch. Fakes use cheap Chinese movements with inconsistent rotor weight and poor finishing.',
    },
    {
      title: 'Crown and pushers',
      quick: '"TAG HEUER" circular engraving on crown face — centered, deep, and consistent',
      detail: 'The crown shows "TAG HEUER" in circular pattern on the face. Chronograph pushers should engage with mechanical click. The Aquaracer screw-down crown threads smoothly. Fakes have crowns that are too light or with incorrect engraving depth.',
    },
    {
      title: 'Serial number format',
      quick: '8-character serial on caseback, reference on clasp — must match',
      detail: 'TAG Heuer serial numbers: letters + numbers format (e.g., FV312A00). Post-2014 models: serial is on caseback, not between lugs. Reference on clasp. Verify at support.tagheuer.com. Fakes often have serials that don\'t match the clasp reference.',
    },
    {
      title: 'Bracelet and clasp quality',
      quick: 'Shark mesh (Aquaracer) should lie perfectly flat with no lateral play in any link',
      detail: 'Shark mesh bracelet: dense weave, lies flat. Clasp engraved "TAG HEUER" with additional "H" security closure. Link bracelets: threaded screws (not push-pins). Fakes use push-pin construction or have loose links. Clasp deployment engages firmly.',
    },
    {
      title: 'Crystal anti-reflective coating',
      quick: 'Sapphire crystal shows blue-green tint at angle — no tint usually means mineral glass',
      detail: 'All modern TAG Heuers use sapphire with anti-reflective coating on inside. At angle under light: blue-green iridescent shimmer. Monaco uses flat sapphire. Fakes use mineral glass or thin sapphire without proper coating — wrong color (orange not blue-green) or no shimmer.',
    },
  ] : [
    {
      title: 'การแกะสลักฝาหลัง',
      quick: 'ต้องมี "SWISS MADE" หรือ "SWISS MADE IN GERMANY" พร้อมชื่อรุ่น — แกะสลักเลเซอร์ลึกและแม่นยำ',
      detail: 'TAG Heuer แท้มีการแกะสลักฝาหลังลึกและแม่นยำ "H" ใน Heuer ใหญ่กว่าตัวอักษรรอบข้าง Aquaracer: ฝาหลังเกลียวพร้อมลายคลื่น Carrera: ฝาหลังขัดเงาทึบ ของปลอม: แกะสลักตื้น ฟอนต์ไม่สม่ำเสมอ ไม่มีการเน้น "H"',
    },
    {
      title: 'ความแม่นยำของตัวหน้าปัดและโลโก้',
      quick: 'ข้อความ "TAG Heuer" ต้องคมชัดมาก ถ้ามีขอบฟู่หรือเลอะคือสัญญาณอันตราย',
      detail: 'TAG Heuer ใช้ฟอนต์คล้าย helvetica เฉพาะ "H" ใน Heuer มีคานตัดพิเศษ ข้อความ subdial พิมพ์ ไม่ใช่ติดแล้ว ของปลอม: ขอบตัวอักษรฟู่ น้ำหนักฟอนต์ผิด การเขียนใหญ่ไม่สม่ำเสมอ',
    },
    {
      title: 'คุณภาพจักรกล',
      quick: 'TAG Heuer หลายรุ่นมีฝาหลังทึบ ตรวจสอบโดยเทียบซีเรียลกับเว็บไซต์ TAG Heuer',
      detail: 'TAG Heuer ใช้จักรกล ETA, Sellita และ Calibre 5 ของตัวเอง Heuer 02 chronograph มี column wheel และ vertical clutch ของตัวเอง ของปลอมใช้จักรกลจีนราคาถูกที่มีน้ำหนัก rotor ไม่สม่ำเสมอและการตกแต่งไม่ดี',
    },
    {
      title: 'มงกุฎและปุ่มกด',
      quick: 'การแกะสลัก "TAG HEUER" แบบวงกลมบนหน้ามงกุฎ — ศูนย์กลาง ลึก และสม่ำเสมอ',
      detail: 'มงกุฎแสดงข้อความ "TAG HEUER" แบบวงกลมบนหน้า ปุ่มกด chronograph ควรมีเสียงคลิกทางกล มงกุฎเกลียว Aquaracer เกลียวได้อย่างราบรื่น ของปลอมมีมงกุฎเบาเกินไปหรือแกะสลักลึกไม่พอ',
    },
    {
      title: 'รูปแบบซีเรียลนัมเบอร์',
      quick: 'ซีเรียล 8 ตัวอักษรบนฝาหลัง เลขอ้างอิงบนคลิป ต้องตรงกัน',
      detail: 'ซีเรียล TAG Heuer: รูปแบบตัวอักษร + ตัวเลข (เช่น FV312A00) รุ่นหลังปี 2014: ซีเรียลบนฝาหลัง ไม่ใช่ระหว่างลักส์ เลขอ้างอิงบนคลิป ตรวจสอบที่ support.tagheuer.com ของปลอมมักมีซีเรียลที่ไม่ตรงกับเลขอ้างอิงคลิป',
    },
    {
      title: 'คุณภาพสายและคลิป',
      quick: 'สาย shark mesh (Aquaracer) ควรวางราบสมบูรณ์โดยไม่มีการเล่นด้านข้างในลิงค์ใดๆ',
      detail: 'สาย shark mesh: ถักหนาแน่น วางราบ คลิปแกะสลัก "TAG HEUER" พร้อมล็อคความปลอดภัย "H" เพิ่มเติม สายลิงค์: สกรูเกลียว (ไม่ใช่พินกด) ของปลอมใช้โครงสร้างพินกดหรือมีลิงค์หลวม คลิปจะงอดคง',
    },
    {
      title: 'เคลือบป้องกันแสงบนกระจก',
      quick: 'กระจกแซฟไฟร์แสดงสีน้ำเงินเขียวที่มุม ไม่มีสีมักหมายถึงกระจกแร่',
      detail: 'TAG Heuer สมัยใหม่ทุกรุ่นใช้แซฟไฟร์พร้อมเคลือบป้องกันแสงด้านใน ที่มุมใต้แสง: ประกายรุ้งสีน้ำเงินเขียว Monaco ใช้แซฟไฟร์แบนราบ ของปลอมใช้กระจกแร่หรือแซฟไฟร์บางที่ไม่มีเคลือบ สีผิดหรือไม่มีประกาย',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate TAG Heuer' : 'ยืนยัน TAG Heuer'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate a TAG Heuer: 7 Checks' : 'วิธียืนยันความถูกต้องของ TAG Heuer: 7 จุดตรวจสอบ'}
      </h1>
      <p className="text-gray-500 mb-4">
        {isEn
          ? 'TAG Heuer is one of the most counterfeited Swiss watch brands. Their Aquaracer, Carrera, and Monaco are produced in high-volume fakes. Genuine TAG Heuers have specific manufacturing details that fakes consistently get wrong — here are seven checks.'
          : 'TAG Heuer เป็นหนึ่งในนาฬิกาสวิสที่ถูกปลอมมากที่สุด Aquaracer, Carrera และ Monaco ถูกผลิตปลอมในปริมาณสูง TAG Heuer แท้มีรายละเอียดการผลิตเฉพาะที่ของปลอมทำผิดสม่ำเสมอ นี่คือ 7 จุดตรวจสอบ'}
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-blue-900 font-medium">{isEn ? 'Quick check: The crown engraving' : 'ตรวจสอบด่วน: การแกะสลักมงกุฎ'}</p>
        <p className="text-sm text-blue-800">
          {isEn
            ? 'The fastest single check: look at the crown face under a loupe. "TAG HEUER" in a circular arrangement, perfectly centered, deep and sharp-edged. Blurry, shallow, or off-center = almost always fake.'
            : 'การตรวจสอบเดียวที่เร็วที่สุด: ดูหน้ามงกุฎใต้แว่นขยาย "TAG HEUER" แบบวงกลม ศูนย์กลางสมบูรณ์ ลึกและขอบคม ฟู่ ตื้น หรือไม่ตรงศูนย์ = มักเป็นของปลอมเสมอ'}
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
              'Aquaracer: Rotating bezel must engage with 120 positive clicks. One-way only.',
              'Carrera: Tachymeter bezel (if equipped) has etched, not painted numbers',
              'Monaco: Square case exactly 39mm. Crown is at 9 o\'clock position.',
              'Formula 1: Ceramic bezel on quartz versions should be scratch-free',
            ] : [
              'Aquaracer: วงแหวนหมุนต้องมี 120 คลิกที่ชัดเจน ทิศทางเดียวเท่านั้น',
              'Carrera: วงแหวน tachymeter (ถ้ามี) ต้องแกะสลัก ไม่ใช่ทาสี',
              'Monaco: ตัวเรือนสี่เหลี่ยม 39mm พอดี มงกุฎที่ตำแหน่ง 9 นาฬิกา',
              'Formula 1: วงแหวนเซรามิกบนรุ่น quartz ต้องไม่มีรอยขีดข่วน',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">{isEn ? 'Common fake signs' : 'สัญญาณของปลอมทั่วไป'}</h3>
          <ul className="text-sm text-red-800 space-y-1">
            {(isEn ? [
              '"SWISS MADE" missing from dial at 6 o\'clock',
              'Cyclops lens over date (TAG Heuer doesn\'t use cyclops)',
              'Crown threads without waterproof resistance',
              'Incorrect subdial positions on Carrera chronograph',
              'Pushers that feel hollow or plastic',
            ] : [
              'ขาด "SWISS MADE" จากหน้าปัดที่ตำแหน่ง 6 นาฬิกา',
              'เลนส์ Cyclops บนวันที่ (TAG Heuer ไม่ใช้ cyclops)',
              'มงกุฎเกลียวโดยไม่มีความต้านทานกันน้ำ',
              'ตำแหน่ง subdial ผิดบน Carrera chronograph',
              'ปุ่มกดที่รู้สึกกลวงหรือเป็นพลาสติก',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-tag-heuer" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-tag-heuer" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/tag-heuer`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">TAG Heuer →</Link>
        <Link href={`/${locale}/compare/omega-vs-tag-heuer`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs TAG Heuer →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate Omega' : 'ยืนยัน Omega'} →</Link>
      </div>
    </div>
  )
}
