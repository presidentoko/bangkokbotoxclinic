import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-louis-vuitton'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Louis Vuitton in Thailand 2025 | ChicPreowned'
      : 'วิธีตรวจสอบ Louis Vuitton แท้ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Authenticate Louis Vuitton bags in Thailand — date codes, monogram alignment, heat stamps, stitching. Full 2025 guide.'
      : 'ตรวจสอบ Louis Vuitton ในไทย — date codes การเรียงลาย โมโนแกรม heat stamp การเย็บ คู่มือ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthLVTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { step: 1, title: 'Date Code Format', detail: 'LV uses 2-letter factory code + 4-digit date code (e.g. "SD0056" = France, May 2006 or 2056th week... actually: first/third digits = week, second/fourth = year). Format changed over decades — pre-1980: 3 digits, 1980–1982: 6 digits, 1982+: letter+number format. No date code = likely fake for pieces made before 2021.' },
    { step: 2, title: 'Monogram Canvas Alignment', detail: 'On the Speedy, Neverfull, and Alma, the LV monogram should be symmetrical: the "LV" in the center of the front panel should be the same distance from each side. The canvas should not have an "upside down" monogram on the back (on pre-owned Speedys, back panel monogram flips — this is NORMAL and authentic).' },
    { step: 3, title: 'Heat Stamp Quality', detail: '"Louis Vuitton Paris" and "Made in France/Spain/Italy/USA" are heat-stamped into the leather tab or interior. The stamp should be even-depth, crisp, centered. Uneven or blurry stamps indicate fake.' },
    { step: 4, title: 'Stitching Color & Density', detail: 'Thread color is a muted yellow — not bright orange or gold. Authentic LV uses 5 stitches per centimeter. The thread is linen, not polyester. Check stitching at handles and D-rings — stress points reveal quality.' },
    { step: 5, title: 'Vachetta Leather (Untreated Cowhide)', detail: 'New LV handles/trim are pale beige (vachetta leather). With age and handling, they patina to a rich honey/caramel — this is normal and desirable. Fakes use dyed leather that does not patina, or plastic trim that looks plastic.' },
    { step: 6, title: 'Hardware & Zipper', detail: 'LV hardware is brass or palladium — heavy, engraved with "LOUIS VUITTON". Zippers on Speedy and Keepall are "Eclair" brand, engraved on the pull. Cheap zippers with no branding = fake.' },
  ] : [
    { step: 1, title: 'รูปแบบ Date Code', detail: 'LV ใช้รหัสโรงงาน 2 ตัวอักษร + date code 4 หลัก (เช่น "SD0056" = ฝรั่งเศส) เลข 1/3 = สัปดาห์ เลข 2/4 = ปี รูปแบบเปลี่ยนตามยุค ไม่มี date code = น่าจะปลอม (สำหรับชิ้นก่อน 2021)' },
    { step: 2, title: 'การเรียงลาย Monogram Canvas', detail: 'บน Speedy, Neverfull, Alma ลาย LV ควรสมมาตร: "LV" ตรงกลางหน้าห่างจากแต่ละด้านเท่ากัน แผงหลัง Speedy ของแท้มีลายพลิก — นี่เป็นเรื่องปกติและแท้' },
    { step: 3, title: 'คุณภาพ Heat Stamp', detail: '"Louis Vuitton Paris" และ "Made in France/Spain/Italy/USA" ประทับในหนัง ควรลึกสม่ำเสมอ คมชัด อยู่ตรงกลาง ประทับไม่เท่าหรือพร่ามัว = ปลอม' },
    { step: 4, title: 'สีและความหนาแน่นการเย็บ', detail: 'สีด้ายเป็นสีเหลืองหม่น ไม่ใช่สีส้มสด หรือสีทอง LV แท้ใช้ 5 เข็มต่อซม. ด้ายเป็นลินิน ไม่ใช่โพลีเอสเตอร์ ตรวจที่ที่จับและ D-ring จุดรับแรงเผยคุณภาพ' },
    { step: 5, title: 'หนัง Vachetta (หนังวัวไม่แต่ง)', detail: 'ที่จับ/ขอบ LV ใหม่เป็นสีเบจอ่อน (vachetta) เมื่อใช้ไปจะเปลี่ยนเป็นสีน้ำผึ้ง/คาราเมล — ปกติและน่าต้องการ ของปลอมใช้หนังย้อมสีที่ไม่เปลี่ยนสี หรือพลาสติก' },
    { step: 6, title: 'Hardware และซิป', detail: 'Hardware LV เป็นทองเหลืองหรือพัลลาเดียม หนัก มีตัวอักษร "LOUIS VUITTON" ซิปบน Speedy และ Keepall เป็นแบรนด์ "Eclair" แกะสลักที่ที่จับ ซิปถูกๆ ไม่มีตราประทับ = ปลอม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Louis Vuitton' : 'ตรวจสอบ Louis Vuitton'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Louis Vuitton' : 'วิธีตรวจสอบ Louis Vuitton แท้'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'LV is the most counterfeited luxury brand globally. The Monogram canvas has been copied for 130 years. Six checks for 2025.'
          : 'LV คือแบรนด์หรูที่ถูกปลอมมากที่สุดในโลก Monogram canvas ถูกลอกเลียนมา 130 ปี หกการตรวจสอบสำหรับ 2025'}
      </p>

      <div className="space-y-4 mb-10">
        {checks.map(c => (
          <div key={c.step} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{c.step}</span>
              <h2 className="font-semibold text-gray-900">{c.title}</h2>
            </div>
            <p className="text-sm text-gray-600 ml-10">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-louis-vuitton" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-louis-vuitton" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'LV Pre-Owned →' : 'LV มือสอง →'}</Link>
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Auth Basics →' : 'พื้นฐานการตรวจสอบ →'}</Link>
        <Link href={`/${locale}/compare/chanel-vs-lv`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs LV →</Link>
      </div>
    </div>
  )
}
