import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/bangkok-luxury-shopping-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Bangkok Luxury Pre-Owned Shopping Guide 2025 | ChicPreowned' : 'คู่มือช้อปปิ้ง Luxury มือสองในกรุงเทพ 2025 | ChicPreowned',
    description: isEn
      ? 'Where to buy pre-owned luxury bags and watches in Bangkok 2025 — Carousell, Line Market, Chatuchak, Siam, and trusted dealers.'
      : 'ที่ซื้อกระเป๋าและนาฬิกา luxury มือสองในกรุงเทพ 2025 — Carousell, Line Market, จตุจักร, สยาม และดีลเลอร์ที่น่าเชื่อถือ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function BangkokLuxuryShoppingGuide({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Bangkok Shopping Guide' : 'คู่มือช้อปปิ้งกรุงเทพ'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Bangkok Luxury Pre-Owned Shopping Guide 2025' : 'คู่มือช้อปปิ้ง Luxury มือสองในกรุงเทพ 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Where to find authentic pre-owned luxury in Bangkok — online platforms, physical markets, and trusted dealers.'
          : 'ที่หา luxury มือสองแท้ๆ ในกรุงเทพ — แพลตฟอร์มออนไลน์ ตลาด และดีลเลอร์ที่น่าเชื่อถือ'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Online Platforms (Best for Price Comparison)' : 'แพลตฟอร์มออนไลน์ (ดีที่สุดสำหรับเปรียบเทียบราคา)'}
        </h2>
        <div className="space-y-4">
          {(isEn ? [
            { name: 'Carousell Thailand', url: 'carousell.com/th', desc: 'Largest C2C platform for pre-owned luxury in Thailand. Active sellers, wide selection. Buyer beware: no authentication service — inspect carefully or meet in person.', rating: '★★★★☆' },
            { name: 'Line Market / Line Shopping', url: 'shop.line.me', desc: 'Heavily used by Thai resellers for luxury goods. Many professional dealers operate here. Chat-based negotiation is standard.', rating: '★★★★☆' },
            { name: 'Facebook Marketplace Groups', url: 'facebook.com', desc: '"กระเป๋าแบรนด์เนมมือสอง" groups. Huge volume, active community. Many reputable dealers post here first. Group admins sometimes verify sellers.', rating: '★★★☆☆' },
            { name: 'Vestiaire Collective TH', url: 'vestiairecollective.com', desc: 'Authentication service included. More expensive than local platforms (10–15% premium) but lower fraud risk. Best for international brands.', rating: '★★★★★' },
          ] : [
            { name: 'Carousell Thailand', url: 'carousell.com/th', desc: 'แพลตฟอร์ม C2C ที่ใหญ่ที่สุดสำหรับ luxury มือสองในไทย ผู้ขายหลากหลาย ระวัง: ไม่มีบริการตรวจสอบความแท้ — ตรวจสอบอย่างละเอียดหรือนัดพบตัวต่อตัว', rating: '★★★★☆' },
            { name: 'Line Market / Line Shopping', url: 'shop.line.me', desc: 'ดีลเลอร์ไทยใช้มากสำหรับสินค้า luxury ดีลเลอร์มืออาชีพจำนวนมากดำเนินงานที่นี่ การเจรจาผ่านแชทเป็นเรื่องปกติ', rating: '★★★★☆' },
            { name: 'กลุ่ม Facebook Marketplace', url: 'facebook.com', desc: 'กลุ่ม "กระเป๋าแบรนด์เนมมือสอง" มีปริมาณมาก ชุมชนที่กระตือรือร้น ดีลเลอร์ที่มีชื่อเสียงหลายรายโพสต์ที่นี่ก่อน แอดมินกลุ่มบางครั้งตรวจสอบผู้ขาย', rating: '★★★☆☆' },
            { name: 'Vestiaire Collective TH', url: 'vestiairecollective.com', desc: 'รวมบริการตรวจสอบความแท้ แพงกว่าแพลตฟอร์มในประเทศ (เพิ่ม 10–15%) แต่ความเสี่ยงการฉ้อโกงต่ำกว่า ดีที่สุดสำหรับแบรนด์ระดับนานาชาติ', rating: '★★★★★' },
          ]).map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-900">{p.name}</span>
                <span className="text-amber-500">{p.rating}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{p.url}</p>
              <p className="text-sm text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Physical Locations in Bangkok' : 'ที่ตั้งทางกายภาพในกรุงเทพ'}
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          {isEn ? <>
            <div className="border-b border-gray-100 pb-3">
              <strong className="text-gray-900">Chatuchak Weekend Market (JJ Market):</strong> Section 2–3 has used luxury goods stalls. Prices are negotiable; authentication is buyer's responsibility. Best for vintage pieces and rare finds.
            </div>
            <div className="border-b border-gray-100 pb-3">
              <strong className="text-gray-900">Siam Paragon / Central World — B floor:</strong> Some consignment shops operate in the lower levels. Prices are higher but sellers are more accountable.
            </div>
            <div className="border-b border-gray-100 pb-3">
              <strong className="text-gray-900">MBK Center (4th floor):</strong> Mix of new grey market and pre-owned watches. Known for Rolex and Omega. Negotiate — initial prices are always high.
            </div>
            <div className="pb-3">
              <strong className="text-gray-900">Yaowarat (Chinatown):</strong> Gold and pre-owned jewelry specialists. Cartier Love bracelets and Van Cleef Alhambra available from reputable goldsmiths.
            </div>
          </> : <>
            <div className="border-b border-gray-100 pb-3">
              <strong className="text-gray-900">ตลาดนัดจตุจักร (JJ Market):</strong> ส่วนที่ 2–3 มีแผงของเก่าและ luxury มือสอง ราคาต่อรองได้ การตรวจสอบความแท้เป็นหน้าที่ผู้ซื้อ ดีที่สุดสำหรับของวินเทจและของหายาก
            </div>
            <div className="border-b border-gray-100 pb-3">
              <strong className="text-gray-900">สยามพารากอน / เซ็นทรัลเวิลด์ — ชั้น B:</strong> ร้านฝากขายบางแห่งดำเนินงานในชั้นล่าง ราคาสูงกว่าแต่ผู้ขายรับผิดชอบมากกว่า
            </div>
            <div className="border-b border-gray-100 pb-3">
              <strong className="text-gray-900">MBK Center (ชั้น 4):</strong> ผสมระหว่างตลาดเทาใหม่และนาฬิกามือสอง เป็นที่รู้จักสำหรับ Rolex และ Omega ต่อรองราคา — ราคาเริ่มต้นสูงเสมอ
            </div>
            <div className="pb-3">
              <strong className="text-gray-900">เยาวราช (ไชน่าทาวน์):</strong> ผู้เชี่ยวชาญทองคำและเครื่องประดับมือสอง มี Cartier Love และ Van Cleef Alhambra จากช่างทองที่มีชื่อเสียง
            </div>
          </>}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Safety Tips for Bangkok Buyers' : 'เคล็ดลับความปลอดภัยสำหรับผู้ซื้อในกรุงเทพ'}
        </h2>
        <ul className="text-sm text-gray-600 space-y-2">
          {isEn ? <>
            <li><strong>Meet in person:</strong> For purchases over ฿50,000, always inspect in person — Siam Paragon lobby is a popular safe meeting spot</li>
            <li><strong>Bring a torch/UV light:</strong> Check serial numbers, dust bags, and authenticity cards under UV — fake dust bags and cards are common</li>
            <li><strong>Escrow for large transactions:</strong> For ฿100,000+, use Line Pay Escrow or a trusted authentication service to hold funds</li>
            <li><strong>Thai consumer protection:</strong> Keep all receipts and LINE chat logs — the OCPB (Office of the Consumer Protection Board) handles disputes</li>
          </> : <>
            <li><strong>นัดพบตัวต่อตัว:</strong> สำหรับการซื้อเกิน 50,000 บาท ตรวจสอบตัวต่อตัวเสมอ — ล็อบบี้สยามพารากอนเป็นจุดนัดพบที่ปลอดภัยนิยม</li>
            <li><strong>นำไฟฉาย/UV:</strong> ตรวจหมายเลขซีเรียล ถุงผ้า และบัตรความแท้ใต้ UV — ถุงผ้าและบัตรปลอมเป็นเรื่องปกติ</li>
            <li><strong>Escrow สำหรับธุรกรรมขนาดใหญ่:</strong> สำหรับ 100,000 บาท+ ใช้ Line Pay Escrow หรือบริการตรวจสอบที่เชื่อถือได้เพื่อถือเงิน</li>
            <li><strong>การคุ้มครองผู้บริโภคไทย:</strong> เก็บใบเสร็จและประวัติ LINE ทั้งหมด — สคบ. (สำนักงานคณะกรรมการคุ้มครองผู้บริโภค) จัดการข้อพิพาท</li>
          </>}
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/bangkok-luxury-shopping-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/bangkok-luxury-shopping-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/how-to-spot-fake-luxury-bags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Spot Fakes Guide →' : 'คู่มือจับของปลอม →'}
        </Link>
        <Link href={`/${locale}/handbags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Browse Bags →' : 'ดูกระเป๋า →'}
        </Link>
      </div>
    </div>
  )
}
