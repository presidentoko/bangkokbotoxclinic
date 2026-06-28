import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-omega'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Omega in Thailand: Speedmaster & Seamaster Guide | ChicPreowned'
      : 'วิธียืนยันความถูกต้องของ Omega ในไทย: คู่มือ Speedmaster & Seamaster | ChicPreowned',
    description: isEn
      ? 'How to spot a fake Omega watch in Thailand — Speedmaster Moonwatch, Seamaster 300M. 7 checks for Bangkok buyers with movement verification tips.'
      : 'วิธีสังเกต Omega ปลอมในไทย Speedmaster Moonwatch, Seamaster 300M 7 ขั้นตอนสำหรับผู้ซื้อกรุงเทพพร้อมเคล็ดลับการตรวจสอบเคลื่อนไหว',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthenticateOmegaTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    {
      n: 1, label: 'Caseback Engraving Depth & Quality',
      pass: 'Omega casebacks: seahorse engraving is laser-etched, sharp and consistent. Reference numbers inside caseback (post-2010) are clean and deep. Exhibition backs have clear anti-reflective sapphire with no distortion.',
      fail: 'Shallow, uneven seahorse. Blurry reference text. Exhibition backs with cheap sapphire that distorts the movement view. Tool marks on screwback edge from sloppy opening.',
    },
    {
      n: 2, label: 'Co-Axial Movement Finishing',
      pass: 'Geneva stripes on bridges: even, parallel, and mirror-smooth. Blue screws on balance and escape wheel. COSC or METAS stamp visible. Cal.3861 (modern Speedmaster) shows column wheel at 9 o\'clock.',
      fail: 'Uneven or stamped-looking Geneva stripes. Missing blue screws. Generic movement without Omega-specific architecture. Oscillation that is jerky or stops-and-starts under observation.',
    },
    {
      n: 3, label: 'Dial Logo & Text Sharpness',
      pass: 'Ω logo crisp, no ink bleed. "OMEGA" wordmark has consistent letter spacing. "Swiss Made" at 6 o\'clock small, centered, sharp. Lume plots have depth and 3D texture, not painted flat.',
      fail: 'Blurry or asymmetric Ω. Uneven spacing in "OMEGA". Flat lume (applied paint vs actual luminescent compound). Date wheel text misaligned with magnification lens.',
    },
    {
      n: 4, label: 'Seamaster Ceramic Bezel',
      pass: 'Ceramic bezel (post-2005): matte uniform color. Platinum/gold minute markers inset in ceramic, not painted over. Helium escape valve at 10 o\'clock unscrews smoothly with clear clicks.',
      fail: 'Painted aluminum bezel that looks glossy. Minute markers that scratch off. HEV that is decorative only. Color variations across the bezel ring (ceramic is homogeneous from baking process).',
    },
    {
      n: 5, label: 'Crown & Speedmaster Pushers',
      pass: 'Speedmaster pushers at 2/4 o\'clock: firm positive click, return cleanly. Crown winds with resistance appropriate for movement weight. Seamaster screwdown crown requires 3-4 full turns.',
      fail: 'Spongy pushers with no click. Crown with no resistance on winding. Seamaster crown that seals with minimal torque — indicates non-waterproof construction.',
    },
    {
      n: 6, label: 'Serial Number Match',
      pass: 'Omega serial on caseback or lugs: matches claimed production year in Omega\'s serial database. Post-2010: 8-digit serial laser-engraved inside caseback.',
      fail: 'Serial that doesn\'t match production year. Duplicate serials (known to be reused in counterfeits). Stamping that is inconsistent depth or crooked.',
    },
    {
      n: 7, label: 'Bracelet End Links & Clasp',
      pass: 'Solid end links flush with case. Brushed/polished finish consistent in direction. Clasp clicks firmly with clear audible snap. No play in folded clasp when closed.',
      fail: 'Hollow bracelet (light weight). End links with visible gaps at case. Clasp that opens under moderate force. Uneven brushing marks or inconsistent polish/satin zones.',
    },
  ] : [
    {
      n: 1, label: 'คุณภาพการแกะสลักฝาหลัง',
      pass: 'ฝาหลัง Omega: การแกะสลักปลาม้าน้ำ laser คมชัดสม่ำเสมอ หมายเลขอ้างอิงด้านในฝาหลัง (หลังปี 2010) สะอาดและลึก ฝาหลังแบบ exhibition ใช้แก้ว sapphire anti-reflective ใสไม่บิดเบี้ยว',
      fail: 'ปลาม้าน้ำตื้นไม่สม่ำเสมอ ข้อความอ้างอิงเบลอ ฝา exhibition ที่มีแก้ว sapphire คุณภาพต่ำบิดเบี้ยวภาพเคลื่อนไหว รอยเครื่องมือบนขอบฝา screwback จากการเปิดไม่ระวัง',
    },
    {
      n: 2, label: 'การตกแต่งเคลื่อนไหว Co-Axial',
      pass: 'ลาย Geneva stripes บน bridges: สม่ำเสมอ ขนาน และเรียบแวว สกรูสีน้ำเงินบน balance และ escape wheel ประทับ COSC หรือ METAS มองเห็นได้ Cal.3861 (Speedmaster ใหม่) มี column wheel ที่ 9 นาฬิกา',
      fail: 'ลาย Geneva stripes ไม่สม่ำเสมอหรือดูเหมือนปั๊ม ไม่มีสกรูสีน้ำเงิน เคลื่อนไหวทั่วไปที่ไม่มีสถาปัตยกรรมเฉพาะ Omega การแกว่งที่กระตุกหรือหยุดและเริ่มใหม่ภายใต้การสังเกต',
    },
    {
      n: 3, label: 'ความคมชัดโลโก้และข้อความหน้าปัด',
      pass: 'โลโก้ Ω คมชัด ไม่มีหมึกล้น ตัวอักษร "OMEGA" เว้นระยะสม่ำเสมอ "Swiss Made" ที่ 6 นาฬิกา เล็ก ตรงกลาง คมชัด จุด lume มีความลึกและพื้นผิว 3D ไม่ใช่แบน',
      fail: 'Ω เบลอหรือไม่สมมาตร ระยะห่างไม่สม่ำเสมอใน "OMEGA" Lume แบน (สีทาเทียบกับสาร luminescent จริง) ข้อความ date wheel ไม่ตรงกับเลนส์ขยาย',
    },
    {
      n: 4, label: 'เบเซล Ceramic ของ Seamaster',
      pass: 'เบเซล ceramic (หลังปี 2005): สีสม่ำเสมอแบบ matte ตัวชี้นาทีทองคำ/แพลตตินัม inset ใน ceramic ไม่ใช่ทาทับ วาล์วระบาย helium ที่ 10 นาฬิกาถอดได้อย่างราบรื่นพร้อม click ชัดเจน',
      fail: 'เบเซลอลูมิเนียมทาสีที่ดูเงา ตัวชี้นาทีที่ขูดออกได้ HEV ที่เป็นแค่ตกแต่ง สีต่างกันบนวงแหวนเบเซล (ceramic เป็นเนื้อเดียวกันจากกระบวนการอบ)',
    },
    {
      n: 5, label: 'Crown และ Pushers ของ Speedmaster',
      pass: 'Pushers Speedmaster ที่ 2/4 นาฬิกา: click ชัดเจนแน่นหนา กลับคืนสะอาด Crown ไขลานด้วยความต้านทานเหมาะสมกับน้ำหนักเคลื่อนไหว Crown Seamaster แบบ screwdown ต้องหมุน 3-4 รอบ',
      fail: 'Pushers นุ่มไม่มี click Crown ไม่มีความต้านทานขณะไขลาน Crown Seamaster ที่ปิดผนึกด้วยแรงบิดน้อย แสดงว่าโครงสร้างไม่กันน้ำ',
    },
    {
      n: 6, label: 'การจับคู่หมายเลขซีเรียล',
      pass: 'ซีเรียล Omega บนฝาหลังหรือ lugs ตรงกับปีผลิตที่อ้างในฐานข้อมูลซีเรียลของ Omega หลังปี 2010: ซีเรียล 8 หลัก laser แกะสลักด้านในฝาหลัง',
      fail: 'ซีเรียลที่ไม่ตรงกับปีผลิต ซีเรียลซ้ำกัน (ที่ทราบว่านำมาใช้ซ้ำในของปลอม) การปั๊มที่ไม่สม่ำเสมอหรือคด',
    },
    {
      n: 7, label: 'End Links สายนาฬิกาและตัวล็อค',
      pass: 'End links แบบ solid ราบกับเคส ทิศทาง brushed/polished สม่ำเสมอ ตัวล็อค click แน่นหนาได้ยินชัดเจน ไม่มีการเล่นในตัวล็อคพับเมื่อปิด',
      fail: 'สายนาฬิกาแบบกลวง (น้ำหนักเบา) End links มีช่องว่างที่เคส ตัวล็อคที่เปิดได้ด้วยแรงปานกลาง รอยขัดไม่สม่ำเสมอหรือโซน polish/satin ไม่สอดคล้อง',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Omega' : 'ยืนยัน Omega'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate an Omega Watch' : 'วิธียืนยันความถูกต้องของนาฬิกา Omega'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Omega is the second most counterfeited watch brand after Rolex. The Seamaster 300M and Speedmaster are the most targeted. Seven checks to protect Bangkok pre-owned buyers.'
          : 'Omega เป็นแบรนด์นาฬิกาที่ถูกปลอมแปลงมากที่สุดอันดับสองรองจาก Rolex Seamaster 300M และ Speedmaster เป็นเป้าหมายหลัก เจ็ดขั้นตอนเพื่อปกป้องผู้ซื้อมือสองกรุงเทพ'}
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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-blue-900 mb-2">{isEn ? 'Register for authentication' : 'ลงทะเบียนเพื่อยืนยัน'}</h3>
        <p className="text-sm text-blue-800">
          {isEn
            ? 'Omega offers free serial validation via their website. For any pre-owned Omega over $1,500, check the serial before purchase — it takes 2 minutes and eliminates a major category of fakes.'
            : 'Omega ให้บริการยืนยันซีเรียลฟรีผ่านเว็บไซต์ของพวกเขา สำหรับ Omega มือสองที่มีราคามากกว่า $1,500 ตรวจสอบซีเรียลก่อนซื้อ ใช้เวลา 2 นาทีและกำจัดของปลอมหมวดหมู่สำคัญ'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-omega" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-omega" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega →</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href={`/${locale}/compare/omega-vs-iwc`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs IWC →</Link>
      </div>
    </div>
  )
}
