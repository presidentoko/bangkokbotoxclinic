import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-saint-laurent'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `How to Authenticate Saint Laurent Bags Thailand ${PRICE_YEAR} | ChicPreowned`
      : `วิธีตรวจสอบกระเป๋า Saint Laurent ของแท้ ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `Authenticate Saint Laurent bags before buying in Thailand — YSL clasp engraving, era stamp (YSL vs Saint Laurent), chain finish, lining, serial patch. Bangkok buyers guide ${PRICE_YEAR}.`
      : `ตรวจสอบกระเป๋า Saint Laurent ก่อนซื้อในไทย — การแกะสลัก YSL clasp ตราประทับยุค (YSL vs Saint Laurent) ผิวสาย ผ้าซับใน แผ่นซีเรียล คู่มือผู้ซื้อกรุงเทพ ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthenticateYSLTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { title: 'YSL logo clasp (Lou Lou and Loulou)', detail: 'The "YSL" monogram clasp should be deeply engraved — press your fingernail into the letters and feel the depth. Authentic clasps have clean, even letter spacing. The "Y" has straight arms at equal angles. Fakes often have shallow engraving that looks printed rather than stamped — very common in Bangkok counterfeit markets.' },
    { title: '"Saint Laurent Paris" interior stamp', detail: 'Authentic bags stamped: "SAINT LAURENT / PARIS / MADE IN ITALY" in clean uppercase. Post-2012 (Hedi Slimane rebrand): "SAINT LAURENT" without "Yves." Any current-design bag (Lou Lou, Loulou) stamped "YVES SAINT LAURENT" is a fake exploiting brand confusion. Vintage pieces pre-2012 legitimately say "YVES SAINT LAURENT." Know which era you are buying.' },
    { title: 'Loulou chain finish', detail: 'The chain on Loulou and Lou Lou has a specific antiqued gold — not bright fashion yellow gold. Each link joins cleanly. Fakes show rough joins or a too-bright finish that resembles costume jewelry. The chain should feel substantial, not light and hollow.' },
    { title: 'Quilted leather quality', detail: 'Saint Laurent quilted leather (Lou Lou) has an even, tight diamond pattern with consistent stitch tension. Fakes have uneven diamonds or diagonal stitching that drifts. The leather itself should be soft but structured — not floppy and not stiff.' },
    { title: 'Interior suede lining', detail: 'Authentic YSL bags have a dark suede-like lining (usually black or dark grey). The "SAINT LAURENT" stamp inside is clean and never crooked. Fake linings often feel synthetic or plasticky with the stamp off-center. Compare by running your finger across the lining — authentic feels like brushed microsuede.' },
    { title: 'Serial number patch', detail: 'Authentic Saint Laurent has a serial number on a leather patch inside. The patch should be cleanly stitched — not glued. Feel the back of the patch through the lining; you should feel it as a slightly raised layer. Fakes often have a glued-on sticker or the patch sewn too close to the corner.' },
  ] : [
    { title: 'YSL logo clasp (Lou Lou และ Loulou)', detail: 'โมโนแกรม "YSL" ควรแกะสลักลึก กดเล็บลงในตัวอักษรแล้วรู้สึกถึงความลึก clasps ของแท้มีระยะห่างตัวอักษรสม่ำเสมอ "Y" มีแขนตรงในมุมเท่ากัน ของปลอมมักมีการแกะสลักตื้นที่ดูเหมือนพิมพ์มากกว่าปั๊ม พบบ่อยมากในตลาดปลอมกรุงเทพ' },
    { title: 'ตราประทับภายใน "Saint Laurent Paris"', detail: 'กระเป๋าของแท้ประทับว่า "SAINT LAURENT / PARIS / MADE IN ITALY" ตัวพิมพ์ใหญ่สะอาด หลังปี 2012 (rebranding โดย Hedi Slimane): "SAINT LAURENT" ไม่มี "Yves" กระเป๋าดีไซน์ปัจจุบัน (Lou Lou, Loulou) ที่ประทับว่า "YVES SAINT LAURENT" คือของปลอมที่ใช้ความสับสนของแบรนด์ ชิ้นวินเทจก่อนปี 2012 ที่พูดถึง "YVES SAINT LAURENT" ถูกต้อง รู้ว่าคุณซื้อยุคไหน' },
    { title: 'ผิวโซ่ Loulou', detail: 'โซ่บน Loulou และ Lou Lou มีสีทองเก่าเฉพาะ ไม่ใช่สีทองเหลืองสดใส แต่ละข้อต่อเชื่อมอย่างสะอาด ของปลอมมีรอยต่อหยาบหรือผิวสว่างเกินไปคล้ายเครื่องประดับทั่วไป โซ่ควรมีน้ำหนักที่จริงจัง ไม่เบาและกลวง' },
    { title: 'คุณภาพหนังเย็บตาราง', detail: 'หนังเย็บตาราง Saint Laurent (Lou Lou) มีลายเพชรสม่ำเสมอและแน่นพร้อมแรงดึงด้ายสม่ำเสมอ ของปลอมมีรูปเพชรไม่เท่ากันหรือการเย็บทแยงที่เบี้ยว หนังควรนุ่มแต่มีโครงสร้าง ไม่อ่อนเกินไปและไม่แข็งเกินไป' },
    { title: 'ผ้าซับในกำมะหยี่', detail: 'กระเป๋า YSL ของแท้มีผ้าซับในคล้ายกำมะหยี่สีเข้ม (ดำหรือเทาเข้มส่วนใหญ่) ตราประทับ "SAINT LAURENT" ข้างในสะอาดและไม่เอียง ผ้าซับในปลอมมักรู้สึกเป็นพลาสติกหรือสังเคราะห์และตราประทับอยู่นอกศูนย์ ลองลูบนิ้วผ่านผ้าซับใน ของแท้รู้สึกเหมือน microsuede แปรง' },
    { title: 'แผ่นหมายเลขซีเรียล', detail: 'Saint Laurent ของแท้มีหมายเลขซีเรียลบนแผ่นหนังข้างใน แผ่นควรเย็บสะอาด ไม่ใช่กาว รู้สึกถึงด้านหลังของแผ่นผ่านผ้าซับใน ควรรู้สึกเป็นชั้นหนังยกขึ้นเล็กน้อย ของปลอมมักมีสติกเกอร์ติดกาวหรือแผ่นเย็บใกล้มุมเกินไป' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Saint Laurent' : 'ตรวจสอบ Saint Laurent'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `How to Authenticate Saint Laurent Bags ${PRICE_YEAR}` : `วิธีตรวจสอบกระเป๋า Saint Laurent ของแท้ ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Saint Laurent is one of the most faked luxury brands in Bangkok. The Lou Lou and Loulou both have high counterfeit risk. The 2012 rebrand from "Yves Saint Laurent" to "Saint Laurent" is the most exploited confusion in Thai resale markets. Six checks.'
          : 'Saint Laurent เป็นหนึ่งในแบรนด์หรูที่ถูกปลอมมากที่สุดในกรุงเทพ Lou Lou และ Loulou ทั้งสองมีความเสี่ยงสูง การ rebrand ปี 2012 จาก "Yves Saint Laurent" เป็น "Saint Laurent" คือความสับสนที่ถูกใช้ประโยชน์มากที่สุดในตลาดมือสองไทย หกจุดตรวจสอบ'}
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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-blue-900 mb-2">{isEn ? 'Era check: YSL vs Saint Laurent' : 'ตรวจสอบยุค: YSL vs Saint Laurent'}</h3>
        <p className="text-sm text-blue-800">
          {isEn
            ? 'Before 2012: "YVES SAINT LAURENT" stamp. After 2012: "SAINT LAURENT PARIS." A fake Lou Lou (2016+ design) with "YVES SAINT LAURENT" stamp is trying to confuse both eras — a major red flag.'
            : 'ก่อนปี 2012: ตราประทับ "YVES SAINT LAURENT" หลังปี 2012: "SAINT LAURENT PARIS" กระเป๋า Lou Lou ปลอม (ดีไซน์ปี 2016+) ที่มีตราประทับ "YVES SAINT LAURENT" กำลังพยายามสับสนทั้งสองยุค ถือเป็น red flag สำคัญ'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-saint-laurent" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-saint-laurent" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/saint-laurent`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Saint Laurent Pre-Owned →' : 'Saint Laurent มือสอง →'}</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL vs Gucci →</Link>
      </div>
    </div>
  )
}
