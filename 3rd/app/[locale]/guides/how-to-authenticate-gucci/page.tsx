import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-gucci'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Gucci Bags Thailand 2025 | ChicPreowned'
      : 'วิธีตรวจสอบความแท้กระเป๋า Gucci ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Gucci authentication guide for Thailand buyers — GG logo alignment, hardware, serial, stitching. Spot fakes before you buy.'
      : 'คู่มือตรวจสอบ Gucci สำหรับผู้ซื้อในไทย — โลโก้ GG hardware serial การเย็บ หาของปลอมก่อนซื้อ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthGucciTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { n: '1', title: 'GG Logo Pattern Alignment', body: 'On GG Supreme canvas, the interlocking G pattern must align perfectly at every seam. Real Gucci cuts the canvas so the pattern continues across corners. Fakes show misaligned or mirrored GG at seams and corners.' },
    { n: '2', title: 'Hardware Quality', body: 'Gucci hardware is heavy brass with uniform gold or silver plating. No pitting, bubbling, or uneven color. Press the logo plate on clasps — it should be precisely engraved, not stamped. Cheap fakes use lightweight zinc with bright, uneven finish.' },
    { n: '3', title: 'Serial Number Tag', body: 'Inside every Gucci bag is a leather tag with serial number format: two rows of numbers (e.g. 123456 654321). The top row is the style number, bottom is the supplier code. No barcode, no sticker — just embossed or heat-stamped numbers on leather.' },
    { n: '4', title: 'Stitching Count and Color', body: 'Gucci uses tight, even stitching at consistent counts per inch. On GG Supreme bags, the thread matches the trim color. Uneven stitch lengths, loose ends, or color mismatch are fake indicators.' },
    { n: '5', title: '"GUCCI" Text on Lining', body: 'Most Gucci bags have woven or printed "GUCCI MADE IN ITALY" text in the lining. The font should be clean, evenly spaced, and consistently sized. Fakes often show blurry, uneven, or faded text.' },
    { n: '6', title: 'Made in Italy Label', body: 'Every authentic Gucci bag has "MADE IN ITALY" stamped or embossed on the interior leather panel. Real bags show clean, deep stamping. Fakes often add this as an afterthought — shallow, crooked, or on a sticker.' },
  ] : [
    { n: '1', title: 'การจัดเรียงลาย GG Logo', body: 'บนผ้า GG Supreme ลาย G ที่ประสานกันต้องจัดแนวสมบูรณ์ที่รอยต่อทุกจุด Gucci แท้ตัดผ้าให้ลายต่อเนื่องข้ามมุม ของปลอมจะเห็นลาย GG เยื้องหรือกลับกันที่รอยต่อ' },
    { n: '2', title: 'คุณภาพ Hardware', body: 'Hardware Gucci เป็นทองเหลืองหนักชุบทองหรือเงินสม่ำเสมอ ไม่มีรู ฟอง หรือสีไม่สม่ำเสมอ กดแผ่นโลโก้บนตัวล็อค — ต้องแกะสลักแม่นยำ ไม่ใช่ปั๊ม ของปลอมใช้สังกะสีเบาเคลือบสีสว่างไม่สม่ำเสมอ' },
    { n: '3', title: 'ป้ายหมายเลขซีเรียล', body: 'ภายในกระเป๋า Gucci ทุกใบมีป้ายหนังพร้อมหมายเลขซีเรียลสองแถว (เช่น 123456 654321) แถวบนเป็นหมายเลขสไตล์ แถวล่างเป็นรหัสซัพพลายเออร์ ไม่มีบาร์โค้ด ไม่มีสติกเกอร์ — เพียงตัวเลขที่ประทับบนหนัง' },
    { n: '4', title: 'จำนวนและสีการเย็บ', body: 'Gucci ใช้การเย็บแน่น สม่ำเสมอ จำนวนต่อนิ้วสม่ำเสมอ บนกระเป๋า GG Supreme เส้นด้ายตรงกับสีขอบ ความยาวเย็บไม่สม่ำเสมอ ปลายหลวม หรือสีไม่ตรงกันเป็นสัญญาณของปลอม' },
    { n: '5', title: 'ข้อความ "GUCCI" บนซับใน', body: 'กระเป๋า Gucci ส่วนใหญ่มีข้อความ "GUCCI MADE IN ITALY" ทอหรือพิมพ์บนซับใน ตัวอักษรต้องสะอาด เว้นระยะสม่ำเสมอ ขนาดสม่ำเสมอ ของปลอมมักแสดงข้อความเบลอ ไม่สม่ำเสมอ หรือซีด' },
    { n: '6', title: 'ป้าย Made in Italy', body: 'กระเป๋า Gucci แท้ทุกใบมี "MADE IN ITALY" ประทับหรือนูนบนแผงหนังภายใน ของแท้แสดงการประทับสะอาด ลึก ของปลอมมักเพิ่มสิ่งนี้ภายหลัง — ตื้น เอียง หรือเป็นสติกเกอร์' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Gucci' : 'ตรวจสอบ Gucci'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Gucci Bags' : 'วิธีตรวจสอบความแท้กระเป๋า Gucci'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Gucci is one of the most counterfeited luxury brands. The GG logo pattern, hardware, and interior tag are the first places to check. Six-point authentication guide below.'
          : 'Gucci เป็นแบรนด์หรูที่ถูกปลอมแปลงมากที่สุดแบรนด์หนึ่ง ลาย GG logo hardware และป้ายภายในคือจุดแรกที่ต้องตรวจสอบ คู่มือตรวจสอบ 6 ขั้นตอนด้านล่าง'}
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
          ? <Link href="/th/guides/how-to-authenticate-gucci" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-gucci" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Gucci Pre-Owned →' : 'Gucci มือสอง →'}</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">SL vs Gucci →</Link>
      </div>
    </div>
  )
}
