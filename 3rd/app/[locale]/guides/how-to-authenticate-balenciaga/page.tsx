import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-balenciaga'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Balenciaga in Thailand 2025: Triple S, City Bag | ChicPreowned'
      : 'วิธีตรวจสอบ Balenciaga ของแท้ในไทย 2025: Triple S, City Bag | ChicPreowned',
    description: isEn
      ? 'Authenticate Balenciaga in Thailand — City bag hardware engraving, Triple S sole layers, Cagole weight, interior stamp, arena leather texture. Bangkok buyers guide 2025.'
      : 'ตรวจสอบ Balenciaga ในไทย — การแกะสลัก hardware กระเป๋า City ชั้น sole ของ Triple S น้ำหนัก Cagole ตราประทับภายใน ผิว arena leather คู่มือผู้ซื้อกรุงเทพ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthenticateBalenciagaTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { title: 'City bag hardware: "Balenciaga Paris" engraving', detail: 'Buckle and zip pull engraved "BALENCIAGA PARIS" in crisp, deep lettering with specific font weight. Fakes have blurry or shallow engraving, or uneven letter spacing. Run your fingernail across the engraving — it should be clearly recessed. Very common point of failure for Bangkok fake City bags.' },
    { title: 'Triple S sole: three-layer construction', detail: 'Authentic Triple S has three visibly distinct layers on the side profile with even height and clean seams. The "Balenciaga" text on the tongue is stitched, not stamped. Fakes have mismatched layer heights or the sole "S" wavy texture is too uniform — authentic varies slightly across the pattern.' },
    { title: 'Cagole: zip and hardware weight', detail: 'Heavy YKK zipper with "BALENCIAGA" engraved pull tab. All hardware — studs, chain, buckles — should feel genuinely substantial when held. Fakes have lightweight hollow hardware. Tap studs on a hard surface: authentic sounds solid, fake sounds hollow. Pyramid studs should be consistent profile across all studs.' },
    { title: '"Balenciaga" interior stamp', detail: 'Interior: "BALENCIAGA / MADE IN SPAIN" or ITALY in clean uppercase. Fakes have the stamp slightly off-center or in wrong font weight. Key check: City bags made 2015+ should say SPAIN or ITALY — never FRANCE. "MADE IN FRANCE" is only authentic on pre-2012 Ghesquière-era bags.' },
    { title: 'Arena leather texture (City, Cagole)', detail: 'Authentic Balenciaga arena leather has a mottled, distressed texture that is soft but not floppy, with slight color depth variation. Fakes are either too uniform or too stiff. Run your finger across the surface — authentic arena leather feels almost like paper-thin glove leather with micro-variations.' },
    { title: 'Serial number tag', detail: 'Leather serial number tag stitched into interior seam, not glued. Thread should match bag interior color and tension. Fakes often glue the tag or use different thread color.' },
  ] : [
    { title: 'Hardware กระเป๋า City: การแกะสลัก "Balenciaga Paris"', detail: 'หัวเข็มขัดและที่ดึงซิปแกะสลัก "BALENCIAGA PARIS" ในตัวอักษรชัดเจนและลึกพร้อมน้ำหนักฟอนต์เฉพาะ ของปลอมมีการแกะสลักเบลอหรือตื้น หรือระยะห่างตัวอักษรไม่เท่ากัน ลากเล็บผ่านการแกะสลัก ควรรู้สึกชัดว่าเป็นร่องลึก พบบ่อยมากในกระเป๋า City ปลอมกรุงเทพ' },
    { title: 'พื้นรองเท้า Triple S: โครงสร้างสามชั้น', detail: 'Triple S ของแท้มีสามชั้นที่มองเห็นได้ชัดจากด้านข้างพร้อมความสูงเท่ากันและตะเข็บสะอาด ข้อความ "Balenciaga" บนลิ้นรองเท้าเย็บ ไม่ใช่ปั๊ม ของปลอมมีความสูงชั้นไม่เท่ากันหรือพื้น texture "S" สม่ำเสมอเกินไป ของแท้มีความหลากหลายเล็กน้อยตลอดลาย' },
    { title: 'Cagole: น้ำหนักซิปและ hardware', detail: 'ซิป YKK หนักพร้อมที่ดึงแกะสลัก "BALENCIAGA" hardware ทั้งหมด ตะปู โซ่ หัวเข็มขัด ควรรู้สึกหนักแน่นจริงๆ เมื่อถือ ของปลอมมี hardware เบาและกลวง เคาะตะปูบนพื้นแข็ง ของแท้ฟังดูทึบ ของปลอมฟังดูกลวง ตะปูรูปปิรามิดควรเป็นโปรไฟล์สม่ำเสมอทุกตัว' },
    { title: 'ตราประทับภายใน "Balenciaga"', detail: 'ภายใน: "BALENCIAGA / MADE IN SPAIN" หรือ ITALY ตัวพิมพ์ใหญ่สะอาด ของปลอมมีตราประทับออกนอกศูนย์หรือน้ำหนักฟอนต์ผิด จุดตรวจสำคัญ: กระเป๋าที่ผลิต 2015+ ควรพูดถึง SPAIN หรือ ITALY ไม่ใช่ FRANCE "MADE IN FRANCE" เป็นของแท้เฉพาะกระเป๋าก่อนปี 2012 ยุค Ghesquière' },
    { title: 'Arena leather texture (City, Cagole)', detail: 'หนัง arena Balenciaga ของแท้มีพื้นผิวด่างและเก่าที่นุ่มแต่ไม่หย่อน พร้อมความลึกสีที่แตกต่างกันเล็กน้อย ของปลอมสม่ำเสมอเกินไปหรือแข็งเกินไป ลูบนิ้วผ่านพื้นผิว หนัง arena ของแท้รู้สึกเกือบเหมือนถุงมือหนังบางกระดาษที่มีความหลากหลายขนาดเล็ก' },
    { title: 'แผ่นหมายเลขซีเรียล', detail: 'แผ่นหมายเลขซีเรียลหนังเย็บเข้าตะเข็บภายใน ไม่ใช่ติดกาว ด้ายควรตรงกับสีภายในกระเป๋าและแรงตึง ของปลอมมักติดกาวแผ่นหรือใช้สีด้ายที่แตกต่าง' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Balenciaga' : 'ตรวจสอบ Balenciaga'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Balenciaga 2025' : 'วิธีตรวจสอบ Balenciaga ของแท้ 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Balenciaga is one of the most counterfeited brands in Thailand, particularly the Triple S and City bag. Triple S is one of the most counterfeited sneakers globally, with Bangkok markets having countless replicas at all quality tiers. Six checks for bags and footwear.'
          : 'Balenciaga เป็นหนึ่งในแบรนด์ที่ถูกปลอมมากที่สุดในไทย โดยเฉพาะ Triple S และกระเป๋า City Triple S เป็นรองเท้าผ้าใบที่ถูกปลอมมากที่สุดในโลก ตลาดกรุงเทพมีของปลอมในทุกระดับคุณภาพมากมาย หกจุดตรวจสอบสำหรับกระเป๋าและรองเท้า'}
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

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'City bag era guide' : 'คู่มือยุคกระเป๋า City'}</h3>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'Ghesquière era (2001–2012): "MADE IN FRANCE," most sought-after. Demna era (2015+): "MADE IN SPAIN" or "MADE IN ITALY." A post-2015 City claiming "MADE IN FRANCE" is always a fake.'
            : 'ยุค Ghesquière (2001–2012): "MADE IN FRANCE" เป็นที่ต้องการมากที่สุด ยุค Demna (2015+): "MADE IN SPAIN" หรือ "MADE IN ITALY" กระเป๋า City หลังปี 2015 ที่อ้าง "MADE IN FRANCE" เป็นของปลอมเสมอ'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-balenciaga" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-balenciaga" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/balenciaga`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Balenciaga Pre-Owned →' : 'Balenciaga มือสอง →'}</Link>
        <Link href={`/${locale}/compare/balenciaga-vs-valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga vs Valentino →</Link>
      </div>
    </div>
  )
}
