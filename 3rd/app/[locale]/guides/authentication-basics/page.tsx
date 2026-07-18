import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/authentication-basics'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'How to Authenticate Luxury Goods: Beginner Guide Thailand 2025 | ChicPreowned' : 'วิธีตรวจสอบสินค้า Luxury: คู่มือสำหรับมือใหม่ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Beginner guide to authenticating luxury bags and watches before buying pre-owned in Thailand — hardware, stitching, date codes, dust bags explained.'
      : 'คู่มือสำหรับมือใหม่ในการตรวจสอบกระเป๋าและนาฬิกา luxury ก่อนซื้อมือสองในไทย — hardware เย็บ date codes ถุงผ้า อธิบายหมด',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthenticationBasicsTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authentication Basics' : 'พื้นฐานการตรวจสอบ'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Luxury Goods: Beginner Guide' : 'วิธีตรวจสอบสินค้า Luxury: คู่มือสำหรับมือใหม่'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Before buying pre-owned luxury in Thailand, these are the 6 universal checks that apply to every brand.'
          : 'ก่อนซื้อสินค้า luxury มือสองในไทย นี่คือ 6 การตรวจสอบสากลที่ใช้ได้กับทุกแบรนด์'}
      </p>

      <div className="space-y-6 mb-12">
        {(isEn ? [
          {
            num: '1', title: 'Hardware Weight & Finish',
            detail: 'Authentic luxury hardware is heavy — gold-plated brass or solid metal. Hold the zipper pull, closure, or chain and feel it. Real hardware has a satisfying, cold weight. Fakes use thin, light zinc alloy that warms quickly in your hand. Check the finish: real plating is even, matte-not-reflective-shiny, and doesn\'t chip at corners.',
          },
          {
            num: '2', title: 'Stitching Quality',
            detail: 'Count the stitches per cm. Luxury bags use 8–12 stitches per cm depending on the brand. All stitches must be even in size and spacing. No thread ends should be visible — ends are burned, not cut. Fake bags often have inconsistent stitch spacing, visible thread ends, and irregular tension.',
          },
          {
            num: '3', title: 'Smell & Material Feel',
            detail: 'Real leather smells like leather — earthy, natural. Fakes smell like plastic or chemicals (the manufacturing solvent smell). The leather itself should feel supple but structured — not stiff plastic-like or paper-thin. Run your finger across the surface: real calfskin has fine, consistent pores. PU leather feels uniform and slightly sticky.',
          },
          {
            num: '4', title: 'Serial Numbers & Date Codes',
            detail: 'Every major brand embeds a serial number or date code. Location varies by brand: Chanel uses a round sticker inside a pocket, LV uses a heat-stamp on the vachetta or interior leather tab, Hermès stamps on the hardware plate. The key test: is it embossed or stamped INTO the material? Fakes often print date codes rather than embossing them.',
          },
          {
            num: '5', title: 'Logo Placement & Typography',
            detail: 'Logos must be centered, perfectly symmetrical, and the correct weight (thickness). The most common fake failure: the font weight is slightly wrong — letters are too thick or too thin. Compare against reference photos from the brand\'s official site or a trusted database. Pay attention to the dot over "i" and the tail on "g" — these are commonly wrong on fakes.',
          },
          {
            num: '6', title: 'Interior & Lining',
            detail: 'Interior lining quality matches exterior quality in authentic pieces. Loose threads, rough seams, or poor-quality lining fabric indicates fake. The interior pocket should have clean edges with no raw fabric visible. Alcantara (suede-like) linings in brands like Dior should feel consistent — not patchy or peeling.',
          },
        ] : [
          {
            num: '1', title: 'น้ำหนักและการเคลือบ Hardware',
            detail: 'Hardware luxury แท้หนัก — ทองแดงชุบทองหรือโลหะแข็ง จับหัวซิป หัวล็อก หรือโซ่แล้วรู้สึก Hardware แท้มีน้ำหนักที่น่าพอใจและเย็นในมือ ของปลอมใช้โลหะสังกะสีบางและเบาที่อุ่นขึ้นเร็ว ตรวจการเคลือบ: การชุบจริงสม่ำเสมอ ด้านไม่เงา และไม่แตกที่มุม',
          },
          {
            num: '2', title: 'คุณภาพการเย็บ',
            detail: 'นับจำนวนตะเข็บต่อซม กระเป๋า luxury ใช้ 8–12 ตะเข็บต่อซม ขึ้นอยู่กับแบรนด์ ตะเข็บทั้งหมดต้องมีขนาดและระยะห่างสม่ำเสมอ ปลายด้ายต้องไม่มองเห็น — เผาไม่ใช่ตัด กระเป๋าปลอมมักมีระยะห่างตะเข็บไม่สม่ำเสมอ ปลายด้ายมองเห็น และแรงตึงไม่สม่ำเสมอ',
          },
          {
            num: '3', title: 'กลิ่นและความรู้สึกของวัสดุ',
            detail: 'หนังแท้มีกลิ่นหนัง — ดินและธรรมชาติ ของปลอมมีกลิ่นพลาสติกหรือเคมี หนังควรนุ่มแต่มีโครงสร้าง ไม่แข็งแบบพลาสติกหรือบางเหมือนกระดาษ ลูบพื้นผิว: calfskin แท้มีรูขนาดเล็กสม่ำเสมอ หนัง PU รู้สึกสม่ำเสมอและเหนียวเล็กน้อย',
          },
          {
            num: '4', title: 'หมายเลขซีเรียลและ Date Code',
            detail: 'ทุกแบรนด์ใหญ่ฝัง serial number หรือ date code ตำแหน่งต่างกันตามแบรนด์: Chanel ใช้สติ๊กเกอร์กลมในช่องเก็บของ, LV ใช้การปั๊มร้อนบนแผ่นหนัง, Hermès ปั๊มบนแผ่น hardware การทดสอบหลัก: ปั๊มหรือกดลงในวัสดุหรือเปล่า ของปลอมมักพิมพ์ date code แทนการปั๊ม',
          },
          {
            num: '5', title: 'ตำแหน่งโลโก้และตัวพิมพ์',
            detail: 'โลโก้ต้องอยู่ตรงกลาง สมมาตรสมบูรณ์ และน้ำหนักถูกต้อง (ความหนา) ความผิดพลาดที่พบบ่อยในของปลอม: น้ำหนักตัวอักษรไม่ถูกต้อง — ตัวหนาหรือบางเกินไป เปรียบเทียบกับรูปอ้างอิงจากเว็บไซต์ทางการ สังเกตจุดบน "i" และหางของ "g" — มักผิดในของปลอม',
          },
          {
            num: '6', title: 'ภายในและ Lining',
            detail: 'คุณภาพ lining ภายในตรงกับคุณภาพภายนอกในชิ้นแท้ ด้ายหลวม ตะเข็บหยาบ หรือผ้า lining คุณภาพต่ำบ่งชี้ของปลอม ช่องกระเป๋าภายในควรมีขอบสะอาดไม่มีผ้าดิบมองเห็น Alcantara lining ในแบรนด์อย่าง Dior ควรรู้สึกสม่ำเสมอ ไม่เป็นหย่อมหรือลอก',
          },
        ]).map((item) => (
          <div key={item.num} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{item.num}</div>
              <div>
                <div className="font-semibold text-gray-900 mb-2">{item.title}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>{isEn ? 'When in doubt, use a service:' : 'เมื่อไม่แน่ใจ ใช้บริการ:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Real Authentication, Entrupy, or Authenticate First offer remote photo-based checks from ฿400–600 per item. Worth it for any purchase over ฿15,000.'
            : 'Real Authentication, Entrupy หรือ Authenticate First มีบริการตรวจสอบทางรูปถ่ายจากระยะไกลราคา 400–600 บาทต่อชิ้น คุ้มค่าสำหรับการซื้อเกิน 15,000 บาท'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/authentication-basics" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/authentication-basics" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/how-to-spot-fake-luxury-bags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Spot Fakes Guide →' : 'คู่มือจับของปลอม →'}
        </Link>
        <Link href={`/${locale}/guides/bangkok-luxury-shopping-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Bangkok Shopping Guide →' : 'คู่มือช้อปกรุงเทพ →'}
        </Link>
      </div>
    </div>
  )
}
