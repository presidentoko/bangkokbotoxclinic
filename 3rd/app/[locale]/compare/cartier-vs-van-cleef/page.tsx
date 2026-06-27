import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/cartier-vs-van-cleef'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Cartier vs Van Cleef & Arpels: Which to Buy Pre-Owned in Thailand?'
      : 'Cartier vs Van Cleef & Arpels: ซื้อมือสองอันไหนดีในไทย?',
    description: isEn
      ? 'Compare pre-owned Cartier vs Van Cleef & Arpels jewelry in Thailand. Love Bracelet vs Alhambra — value retention, resale, and which is right for you.'
      : 'เปรียบเทียบ Cartier vs Van Cleef & Arpels มือสองในไทย Love Bracelet vs Alhambra — มูลค่า ราคาขายต่อ และอะไรเหมาะกับคุณ',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` },
    },
  }
}

export default async function CartierVsVanCleefPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Founded', cartier: '1847, Paris', vca: '1896, Paris' },
    { aspect: 'Most iconic piece', cartier: 'Love Bracelet', vca: 'Alhambra necklace/bracelet' },
    { aspect: 'Global recognition', cartier: 'Highest (mass luxury)', vca: 'Very high (collector niche)' },
    { aspect: 'Resale liquidity', cartier: 'Fastest in Thailand', vca: 'Strong, smaller buyer pool' },
    { aspect: 'Value retention (Love/Alhambra)', cartier: '75–90% of current retail', vca: '70–85% of current retail' },
    { aspect: 'Entry price pre-owned (THB)', cartier: '฿45,000+ (Trinity ring)', vca: '฿65,000+ (Alhambra pendant)' },
    { aspect: 'Design aesthetic', cartier: 'Bold, geometric, architectural', vca: 'Whimsical, nature-inspired, delicate' },
    { aspect: 'Authentication difficulty', cartier: 'Moderate (well-documented fakes)', vca: 'High (fewer fake resources in Thailand)' },
  ] : [
    { aspect: 'ก่อตั้ง', cartier: '1847 กรุงปารีส', vca: '1896 กรุงปารีส' },
    { aspect: 'ชิ้นที่โด่งดังที่สุด', cartier: 'Love Bracelet', vca: 'สร้อยคอ/กำไล Alhambra' },
    { aspect: 'การรับรู้ทั่วโลก', cartier: 'สูงสุด (luxury ระดับมวลชน)', vca: 'สูงมาก (กลุ่มนักสะสม)' },
    { aspect: 'สภาพคล่องในการขายต่อ', cartier: 'เร็วที่สุดในไทย', vca: 'แข็งแกร่ง กลุ่มผู้ซื้อเล็กกว่า' },
    { aspect: 'การรักษามูลค่า', cartier: '75–90% ของราคาปลีกปัจจุบัน', vca: '70–85% ของราคาปลีกปัจจุบัน' },
    { aspect: 'ราคาเริ่มต้นมือสอง (บาท)', cartier: '45,000+ บาท (Trinity ring)', vca: '65,000+ บาท (จี้ Alhambra)' },
    { aspect: 'สไตล์การออกแบบ', cartier: 'หนักแน่น เรขาคณิต ดูทันสมัย', vca: 'เพ้อฝัน ได้แรงบันดาลใจจากธรรมชาติ ละเอียดอ่อน' },
    { aspect: 'ความยากในการตรวจสอบ', cartier: 'ปานกลาง (ของปลอมมีเอกสาร)', vca: 'สูง (ข้อมูลของปลอมในไทยน้อย)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/jewelry`} className="hover:text-gray-800">{isEn ? 'Jewelry' : 'เครื่องประดับ'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Cartier vs Van Cleef</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Cartier vs Van Cleef & Arpels: Pre-Owned in Thailand' : 'Cartier vs Van Cleef & Arpels: มือสองในไทย'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two Parisian jewelry maisons — very different identities on the Thai secondary market.'
          : 'บ้านเครื่องประดับชาวปารีสสองแห่ง — อัตลักษณ์ที่แตกต่างกันมากในตลาดมือสองไทย'}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cartier</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Highest global name recognition</li>
              <li>✓ Love Bracelet among world's most recognisable jewelry</li>
              <li>✓ Fastest resale on Thai market</li>
              <li>✓ Wide price range — accessible entry points</li>
              <li>✓ Stable, consistent value retention</li>
            </> : <>
              <li>✓ ชื่อเสียงระดับโลกสูงที่สุด</li>
              <li>✓ Love Bracelet อยู่ในกลุ่มเครื่องประดับที่รู้จักมากที่สุดในโลก</li>
              <li>✓ ขายต่อได้เร็วที่สุดในตลาดไทย</li>
              <li>✓ ช่วงราคากว้าง — จุดเริ่มต้นที่เข้าถึงได้</li>
              <li>✓ การรักษามูลค่าที่มั่นคงและสม่ำเสมอ</li>
            </>}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Van Cleef & Arpels</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Higher perceived exclusivity in collector circles</li>
              <li>✓ Alhambra motif deeply recognised among luxury buyers</li>
              <li>✓ Whimsical, artistic designs — stronger gifting appeal</li>
              <li>✓ Greater appreciation potential on rare vintage pieces</li>
              <li>✗ Less liquid — smaller buyer pool in Thailand</li>
            </> : <>
              <li>✓ ความพิเศษที่รับรู้ได้สูงกว่าในหมู่นักสะสม</li>
              <li>✓ ลวดลาย Alhambra เป็นที่รู้จักอย่างลึกซึ้งในหมู่ผู้ซื้อ luxury</li>
              <li>✓ การออกแบบที่เพ้อฝันและเป็นศิลปะ — เหมาะสำหรับของขวัญมากกว่า</li>
              <li>✓ ศักยภาพในการแข็งค่าสูงกว่าบนชิ้นวินเทจหายาก</li>
              <li>✗ สภาพคล่องน้อยกว่า — กลุ่มผู้ซื้อในไทยเล็กกว่า</li>
            </>}
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Comparison Table' : 'ตารางเปรียบเทียบ'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'ด้าน'}</th>
                <th className="text-left py-3 px-4 font-semibold">Cartier</th>
                <th className="text-left py-3 px-4 font-semibold">Van Cleef & Arpels</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.cartier}</td>
                  <td className="py-3 px-4 text-gray-600">{row.vca}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isEn ? 'Choose Cartier if:' : 'เลือก Cartier ถ้า:'}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>• You want maximum resale flexibility in Thailand</li>
              <li>• Budget is ฿45,000–200,000</li>
              <li>• You want a universally recognised gift piece</li>
              <li>• You're a first-time fine jewelry buyer</li>
            </> : <>
              <li>• ต้องการความยืดหยุ่นในการขายต่อสูงสุดในไทย</li>
              <li>• งบประมาณ 45,000–200,000 บาท</li>
              <li>• ต้องการของขวัญที่รู้จักกันทั่วไป</li>
              <li>• เป็นผู้ซื้อ fine jewelry ครั้งแรก</li>
            </>}
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isEn ? 'Choose Van Cleef & Arpels if:' : 'เลือก Van Cleef & Arpels ถ้า:'}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>• You value exclusivity and collector appeal over liquidity</li>
              <li>• You have a longer hold horizon (3+ years)</li>
              <li>• The whimsical, fairy-tale aesthetic resonates with you</li>
              <li>• You're buying pre-owned vintage (1970s–80s Alhambra)</li>
            </> : <>
              <li>• คุณให้คุณค่ากับความพิเศษและเสน่ห์ของนักสะสมมากกว่าสภาพคล่อง</li>
              <li>• มีระยะเวลาถือครองที่ยาวนานกว่า (3+ ปี)</li>
              <li>• สไตล์เพ้อฝันและเทพนิยายตรงกับตัวคุณ</li>
              <li>• กำลังซื้อมือสอง vintage (Alhambra ยุค 1970–80)</li>
            </>}
          </ul>
        </div>
      </section>

      <div className="flex gap-4 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/cartier-vs-van-cleef" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/cartier-vs-van-cleef" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/cartier`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? 'All Cartier Prices →' : 'ราคา Cartier ทั้งหมด →'}
        </Link>
        <Link href={`/${locale}/jewelry`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? '← All Jewelry' : '← เครื่องประดับทั้งหมด'}
        </Link>
      </div>
    </div>
  )
}
