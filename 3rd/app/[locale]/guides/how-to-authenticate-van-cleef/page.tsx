import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-van-cleef'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `How to Authenticate Van Cleef & Arpels in Thailand ${PRICE_YEAR}: Alhambra | ChicPreowned`
      : `วิธีตรวจสอบ Van Cleef & Arpels ของแท้ในไทย ${PRICE_YEAR}: Alhambra | ChicPreowned`,
    description: isEn
      ? `Authenticate Van Cleef & Arpels in Thailand — Alhambra size, VCA clasp engraving (not "VCA"), milled petal edge, MOP quality, hallmarks. Bangkok buyers guide ${PRICE_YEAR}.`
      : `ตรวจสอบ Van Cleef & Arpels ในไทย — ขนาด Alhambra การแกะสลัก VCA clasp (ไม่ใช่ "VCA") ขอบกลีบดอก ไม้ MOP hallmarks คู่มือผู้ซื้อกรุงเทพ ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthenticateVCATH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { title: 'Alhambra motif: 1.5cm × 1.5cm precision', detail: 'Each four-leaf clover is precisely 1.5cm × 1.5cm. Fakes are often 1.6–1.8cm — slightly too large. Hold against a ruler: outside 1.4–1.6cm range is suspicious. Petals must be perfectly round, not oval or pointed.' },
    { title: '"Van Cleef & Arpels" clasp engraving (NOT "VCA")', detail: 'The clasp interior is engraved "Van Cleef & Arpels" in full — a specific fine font. The ampersand (&) is distinctive and balanced. Any clasp engraved "VCA" as shorthand is fake — this abbreviation does NOT appear on authentic pieces. Use a 10x loupe: should be crisp and sharp.' },
    { title: 'Hallmarks: 750 for 18k', detail: '18k gold: "750" stamped inside the clasp or on a connecting link. French pieces also carry an owl or eagle head guarantee mark. No hallmark = immediately suspect. Use 10x magnification to find the stamp.' },
    { title: 'Milled edge on petal bezels', detail: 'The gold bezel around each petal has a milled (cogwheel-textured) edge. This milling is even and precise across all petals. Fakes have a smooth rim or irregular milling that varies by petal. This is the hardest detail to fake and one of the most reliable authentication points.' },
    { title: 'Mother-of-pearl iridescence', detail: 'Authentic VCA MOP has a luminous color shift: white, cream, faint pink-green depending on angle. Fake MOP (often plastic or resin) looks static and flat in direct light — no color shift. Tilt the piece under a light source and watch for shifting iridescence.' },
    { title: 'Certificate and box', detail: 'VCA certificate: white booklet with unique ID. Box: white square with black VCA branding, white leather interior. A missing certificate does not mean fake. An incorrect clasp engraving does. Focus authentication on the physical piece.' },
  ] : [
    { title: 'ลาย Alhambra: ความแม่นยำ 1.5 × 1.5 ซม.', detail: 'แต่ละ four-leaf clover มีขนาดแม่นยำ 1.5 × 1.5 ซม. ของปลอมมักใหญ่กว่า 1.6–1.8 ซม. ใช้ไม้บรรทัดวัด นอกช่วง 1.4–1.6 ซม. น่าสงสัย กลีบดอกต้องกลมสมบูรณ์ ไม่ใช่รูปรีหรือแหลม' },
    { title: 'การแกะสลัก clasp "Van Cleef & Arpels" (ไม่ใช่ "VCA")', detail: 'ด้านในหัวเข็มขัดแกะสลัก "Van Cleef & Arpels" เต็มในฟอนต์บางเฉพาะ เครื่องหมาย & มีเอกลักษณ์และสมดุล หัวเข็มขัดที่แกะสลัก "VCA" เป็นตัวย่อคือของปลอม ตัวย่อนี้ไม่ปรากฏบนชิ้นของแท้ ใช้แว่นขยาย 10x ควรคมและชัดเจน' },
    { title: 'Hallmarks: 750 สำหรับ 18k', detail: 'ทอง 18k: "750" ปั๊มด้านในหัวเข็มขัดหรือบนข้อต่อ ชิ้นฝรั่งเศสมีเครื่องหมายรับประกันนกเค้าแมวหรือหัวนกอินทรีด้วย ไม่มี hallmark = น่าสงสัยทันที ใช้กำลังขยาย 10x เพื่อหาตราประทับ' },
    { title: 'ขอบโค้ง milled บน petal bezel', detail: 'กรอบทองรอบแต่ละกลีบมีขอบ milled (ลวดลายล้อฟัน) สม่ำเสมอและแม่นยำตลอดทุกกลีบ ของปลอมมีขอบเรียบหรือการ milling ไม่สม่ำเสมอที่แตกต่างกันตามกลีบ นี่คือจุดรายละเอียดที่ยากที่สุดในการปลอมและเป็นหนึ่งในจุดรับรองความถูกต้องที่เชื่อถือได้มากที่สุด' },
    { title: 'ความเปล่งประกายของ Mother-of-Pearl', detail: 'MOP ของ VCA ของแท้มีการเปลี่ยนสีที่เปล่งประกาย ขาว ครีม ชมพูเขียวอ่อนขึ้นอยู่กับมุม MOP ปลอม (มักเป็นพลาสติกหรือเรซิน) ดูนิ่งและแบนในแสงตรง ไม่มีการเปลี่ยนสี เอียงชิ้นส่วนใต้แหล่งแสงและดูความเปล่งประกายที่เปลี่ยนไป' },
    { title: 'ใบรับรองและกล่อง', detail: 'ใบรับรอง VCA: สมุดสีขาวพร้อม ID เฉพาะ กล่อง: สี่เหลี่ยมสีขาวพร้อม branding VCA สีดำ ภายในหนังสีขาว ใบรับรองหายไปไม่ได้หมายความว่าปลอม การแกะสลัก clasp ผิดหมายถึงปลอม เน้นการรับรองความถูกต้องบนตัวชิ้นส่วน' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Van Cleef' : 'ตรวจสอบ Van Cleef'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Van Cleef & Arpels {PRICE_YEAR}' : 'วิธีตรวจสอบ Van Cleef & Arpels ของแท้ {PRICE_YEAR}'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Van Cleef & Arpels Alhambra is one of the most counterfeited jewelry pieces in Bangkok. The simple four-leaf clover motif has been replicated at every quality tier. Six checks for the Alhambra necklace and bracelet.'
          : 'Van Cleef & Arpels Alhambra เป็นหนึ่งในเครื่องประดับที่ถูกปลอมมากที่สุดในกรุงเทพ ลาย four-leaf clover ง่ายๆ ถูกลอกเลียนในทุกระดับคุณภาพ หกจุดตรวจสอบสำหรับ Alhambra necklace และ bracelet'}
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

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-red-900 mb-2">{isEn ? 'Immediate red flags' : 'Red flag ทันที'}</h3>
        <ul className="text-sm text-red-800 space-y-1">
          {(isEn ? [
            'Clasp engraved "VCA" (authentic says "Van Cleef & Arpels" in full)',
            'Motif significantly larger or smaller than 1.5cm',
            'No hallmark inside clasp',
            'Milled edge on petals is smooth or irregular',
            'MOP that looks flat/static — no color shift under light',
          ] : [
            'หัวเข็มขัดแกะสลัก "VCA" (ของแท้พูดว่า "Van Cleef & Arpels" เต็ม)',
            'ลายใหญ่หรือเล็กกว่า 1.5 ซม. อย่างมีนัยสำคัญ',
            'ไม่มี hallmark ด้านในหัวเข็มขัด',
            'ขอบ milled บนกลีบเรียบหรือไม่สม่ำเสมอ',
            'MOP ที่ดูแบนหรือนิ่ง ไม่มีการเปลี่ยนสีในแสง',
          ]).map((item, i) => <li key={i}>• {item}</li>)}
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-van-cleef" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-van-cleef" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/van-cleef`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Van Cleef Pre-Owned →' : 'Van Cleef มือสอง →'}</Link>
        <Link href={`/${locale}/compare/cartier-vs-van-cleef`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Van Cleef →</Link>
      </div>
    </div>
  )
}
