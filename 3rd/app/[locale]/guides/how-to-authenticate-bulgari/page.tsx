import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-bulgari'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Bulgari in Thailand: Serpenti & B.zero1 Guide | ChicPreowned'
      : 'วิธียืนยันความถูกต้องของ Bulgari ในไทย: คู่มือ Serpenti & B.zero1 | ChicPreowned',
    description: isEn
      ? 'How to spot a fake Bulgari in Thailand — BVLGARI engraving, Serpenti mechanism, B.zero1 weight, hallmarks. 6 checks for Bangkok buyers.'
      : 'วิธีสังเกต Bulgari ปลอมในไทย การแกะสลัก BVLGARI กลไก Serpenti น้ำหนัก B.zero1 ตราประทับ 6 ขั้นตอนสำหรับผู้ซื้อกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthenticateBulgariTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    {
      n: 1, label: 'BVLGARI Engraving — V not U',
      pass: 'All authentic Bulgari uses the ancient Latin "BVLGARI" — U written as V, referencing Roman stone inscriptions.',
      fail: '"BULGARI" with a U is always a fake. This single check eliminates most counterfeits immediately.',
    },
    {
      n: 2, label: 'Hallmark & Gold Purity Stamp',
      pass: 'Authentic: 750 (18k gold) or 585 (14k). Italian pieces carry a government assay mark (star in oval). Location consistent per piece type.',
      fail: 'Missing or illegible hallmarks. Incorrect purity. Counterfeit stamps are usually shallow and poorly defined.',
    },
    {
      n: 3, label: 'Serpenti Spring Mechanism',
      pass: 'Each coil segment individually articulated, smooth movement, substantial spring tension. Head: crisp scale texture, cleanly set stones.',
      fail: 'Stiff or mis-aligned segments. Visible mold seams on head. Flat or glued stone settings. Flimsy spring tension.',
    },
    {
      n: 4, label: 'B.zero1 Spiral Weight & Finish',
      pass: 'Heavy for its size (solid gold). Logo cleanly engraved on barrel. Spiral wings flush and uniformly spaced. No wobble between barrel and wings.',
      fail: 'Lightweight = hollow plated base metal. Blurry or stamped (not engraved) logo. Barrel wobbles. Sharp or uneven spiral edges.',
    },
    {
      n: 5, label: 'Gemstone Setting Quality',
      pass: 'Pave and bezel settings precise. Stones flat and evenly spaced, no glue residue. Colored stones show natural variation under light.',
      fail: 'Uneven stone heights, visible glue, rocking stones. Fakes use glass or low-grade synthetics — uniform color with no depth.',
    },
    {
      n: 6, label: 'Interior Markings & Serial',
      pass: 'Post-2000 fine jewelry includes model number or serial inside (B.zero1 barrel, Serpenti clasp). "BVLGARI ROMA" engraving on higher pieces.',
      fail: 'No interior marking, or wrong position. Counterfeit serials repeated across multiple pieces or wrong format.',
    },
  ] : [
    {
      n: 1, label: 'การแกะสลัก BVLGARI — V ไม่ใช่ U',
      pass: 'Bulgari ของแท้ทุกชิ้นใช้ภาษาละตินโบราณ "BVLGARI" — U เขียนเป็น V อ้างอิงจารึกบนหินโรมัน',
      fail: '"BULGARI" ที่มี U เป็นของปลอมเสมอ การตรวจสอบครั้งเดียวนี้กำจัดของปลอมส่วนใหญ่ได้ทันที',
    },
    {
      n: 2, label: 'ตราประทับทองคำ & ความบริสุทธิ์',
      pass: 'ของแท้: 750 (18k) หรือ 585 (14k) ชิ้นจากอิตาลีมีตราประทับรับรองของรัฐบาล (ดาวในวงรี) ตำแหน่งสอดคล้องกับประเภทชิ้น',
      fail: 'ตราประทับขาดหายหรืออ่านไม่ออก ความบริสุทธิ์ผิด ตราปลอมมักตื้นและกำหนดไม่ดี',
    },
    {
      n: 3, label: 'กลไก Spring ของ Serpenti',
      pass: 'แต่ละส่วน coil มีข้อต่อแยกกัน การเคลื่อนที่ราบรื่น แรงดัน spring มีน้ำหนัก หัว: พื้นผิวเกล็ดคมชัด หินฝังอย่างสะอาด',
      fail: 'ส่วนแข็งหรือไม่ตรงแนว ร่องรอยแม่พิมพ์บนหัว การตั้งหินแบน หรือติดกาว แรงดัน spring อ่อน',
    },
    {
      n: 4, label: 'น้ำหนักและการตกแต่ง B.zero1',
      pass: 'หนักสำหรับขนาด (ทองแท้) โลโก้แกะสลักอย่างสะอาดบน barrel ปีกเกลียวราบและเว้นระยะสม่ำเสมอ ไม่แกว่งระหว่าง barrel และปีก',
      fail: 'เบา = ทองชุบบนโลหะฐาน โลโก้เบลอหรือปั๊ม (ไม่ใช่แกะสลัก) barrel แกว่ง ขอบเกลียวคมหรือไม่สม่ำเสมอ',
    },
    {
      n: 5, label: 'คุณภาพการฝังอัญมณี',
      pass: 'การฝัง pave และ bezel แม่นยำ หินราบและเว้นระยะสม่ำเสมอ ไม่มีร่องรอยกาว หินสีแสดงการเปลี่ยนแปลงตามธรรมชาติภายใต้แสง',
      fail: 'หินไม่ราบเรียบ กาวที่มองเห็นได้ หินแกว่งในที่ยึด ของปลอมใช้กระจกหรือสังเคราะห์ระดับต่ำ สีสม่ำเสมอไม่มีความลึก',
    },
    {
      n: 6, label: 'เครื่องหมายภายในและซีเรียล',
      pass: 'เครื่องประดับหลังปี 2000 มีหมายเลขรุ่นหรือซีเรียลภายใน (barrel B.zero1, ตัวล็อค Serpenti) การแกะสลัก "BVLGARI ROMA" บนชิ้นระดับสูง',
      fail: 'ไม่มีเครื่องหมายภายใน หรือตำแหน่งผิด ซีเรียลปลอมมักซ้ำกันในหลายชิ้นหรือรูปแบบต่างออกไป',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Bulgari' : 'ยืนยัน Bulgari'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Bulgari (BVLGARI)' : 'วิธียืนยันความถูกต้องของ Bulgari (BVLGARI)'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The Roman house founded in 1884 is heavily targeted by counterfeiters — especially the Serpenti coil bracelet and B.zero1 ring. Six checks to protect Bangkok buyers.'
          : 'บ้านโรมันที่ก่อตั้งในปี 1884 เป็นเป้าหมายของนักปลอมแปลงอย่างหนัก โดยเฉพาะสร้อยข้อมือ Serpenti coil และแหวน B.zero1 หกขั้นตอนเพื่อปกป้องผู้ซื้อกรุงเทพ'}
      </p>

      <div className="space-y-5 mb-10">
        {checks.map(c => (
          <div key={c.n} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs bg-gray-900 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold shrink-0">{c.n}</span>
              <h2 className="font-semibold text-gray-900">{c.label}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-800 mb-1">✓ {isEn ? 'Authentic' : 'ของแท้'}</p>
                <p className="text-sm text-green-700">{c.pass}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-800 mb-1">✗ {isEn ? 'Fake indicator' : 'สัญญาณของปลอม'}</p>
                <p className="text-sm text-red-700">{c.fail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'The single fastest check' : 'การตรวจสอบเร็วที่สุด'}</h3>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'Look for "BVLGARI" with V — not "BULGARI" with U. Every authentic piece uses the Roman spelling. This test alone eliminates 90% of counterfeits within 30 seconds.'
            : 'มองหา "BVLGARI" ที่มี V ไม่ใช่ "BULGARI" ที่มี U ทุกชิ้นของแท้ใช้การสะกดภาษาโรมัน การทดสอบนี้เพียงอย่างเดียวกำจัดของปลอม 90% ภายใน 30 วินาที'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-bulgari" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-bulgari" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/bulgari`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bulgari →</Link>
        <Link href={`/${locale}/compare/cartier-vs-bulgari`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Bulgari →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-van-cleef`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Auth Van Cleef →</Link>
      </div>
    </div>
  )
}
