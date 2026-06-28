import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/chanel-19-vs-classic-flap'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel 19 vs Classic Flap Thailand 2025: Which Pre-Owned to Buy? | ChicPreowned'
      : 'Chanel 19 vs Classic Flap ในไทย 2025: มือสองอันไหนน่าซื้อ? | ChicPreowned',
    description: isEn
      ? 'Chanel 19 vs Classic Flap for Bangkok buyers — resale retention, THB prices, which holds value better, and which Chanel is the better pre-owned investment in Thailand 2025.'
      : 'Chanel 19 vs Classic Flap สำหรับผู้ซื้อกรุงเทพ อัตราการรักษามูลค่า ราคาบาท อันไหนรักษามูลค่าได้ดีกว่า และ Chanel ไหนลงทุนมือสองได้ดีกว่าในไทย 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function Chanel19VsClassicFlapTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Launched', c19: '2019 (Karl Lagerfeld\'s last major design)', cf: '1955, CC clasp added by Lagerfeld 1983' },
    { aspect: 'Chain', c19: 'Mixed leather+chain, extra long for crossbody', cf: 'Flat gold or silver, shorter and structured' },
    { aspect: 'Closure', c19: 'Magnets + tuck-in flap, easy access', cf: 'Interlocking CC turnlock (two hands)' },
    { aspect: 'New price (2025)', c19: `$5,800–7,500 (${formatPriceTHB(5800, 7500)}) Small–Medium`, cf: `$7,400–10,100 (${formatPriceTHB(7400, 10100)}) Small–M/L` },
    { aspect: 'Pre-owned entry', c19: `$3,200–5,000 (${formatPriceTHB(3200, 5000)}) small worn`, cf: `$4,500–8,000 (${formatPriceTHB(4500, 8000)}) small–medium worn` },
    { aspect: 'Resale retention', c19: '75–90%', cf: '85–110%+ (appreciates in some sizes)' },
    { aspect: 'Investment tier', c19: 'A-Tier (exceptional for 6-year-old design)', cf: 'S-Tier (best-retaining luxury bag globally)' },
    { aspect: 'Bangkok boutique', c19: 'Chanel at Siam Paragon, EmSphere, CentralWorld', cf: 'Same boutiques — Classic Flap is the flagship' },
  ] : [
    { aspect: 'เปิดตัว', c19: '2019 (การออกแบบหลักครั้งสุดท้ายของ Karl Lagerfeld)', cf: '1955, เพิ่มตัวล็อค CC โดย Lagerfeld ปี 1983' },
    { aspect: 'สายโซ่', c19: 'ผสมหนัง+โซ่, ยาวพิเศษสำหรับ crossbody', cf: 'แบนทอง/เงิน สั้นและมีโครงสร้าง' },
    { aspect: 'การล็อค', c19: 'แม่เหล็ก + พับเข้า เข้าถึงง่าย', cf: 'ตัวล็อค CC ที่ขัดกัน (ต้องใช้สองมือ)' },
    { aspect: 'ราคาใหม่ (2025)', c19: `$5,800–7,500 (${formatPriceTHB(5800, 7500)}) Small–Medium`, cf: `$7,400–10,100 (${formatPriceTHB(7400, 10100)}) Small–M/L` },
    { aspect: 'มือสองเริ่มต้น', c19: `$3,200–5,000 (${formatPriceTHB(3200, 5000)}) เล็กสภาพใช้`, cf: `$4,500–8,000 (${formatPriceTHB(4500, 8000)}) เล็ก-กลางสภาพใช้` },
    { aspect: 'อัตราการรักษามูลค่า', c19: '75–90%', cf: '85–110%+ (ขึ้นราคาในบางขนาด)' },
    { aspect: 'ระดับการลงทุน', c19: 'A-Tier (ยอดเยี่ยมสำหรับการออกแบบ 6 ปี)', cf: 'S-Tier (กระเป๋าที่รักษามูลค่าได้ดีที่สุดในโลก)' },
    { aspect: 'บูทีคกรุงเทพ', c19: 'Chanel ที่ Siam Paragon, EmSphere, CentralWorld', cf: 'บูทีคเดียวกัน Classic Flap คือ flagship' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>Chanel 19 vs Classic Flap</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel 19 vs Classic Flap (2025): Which Pre-Owned to Buy?' : 'Chanel 19 vs Classic Flap (2025): มือสองอันไหนน่าซื้อ?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both are extraordinary investments — but with very different market dynamics. The Classic Flap is the established S-Tier investment; the Chanel 19 is a newer design with exceptional early-stage retention and better everyday wearability. Bangkok context and THB prices included.'
          : 'ทั้งสองเป็นการลงทุนที่ยอดเยี่ยม แต่มีพลวัตตลาดต่างกันมาก Classic Flap คือการลงทุน S-Tier ที่มั่นคง Chanel 19 คือการออกแบบใหม่กว่าที่มีอัตราการรักษามูลค่าในช่วงต้นที่ยอดเยี่ยมและความสะดวกในการสวมใส่ประจำวันที่ดีกว่า รวมบริบทกรุงเทพและราคาบาท'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-black">Chanel 19</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-black">Classic Flap</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.c19}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.cf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Choose Chanel 19 if…' : 'เลือก Chanel 19 ถ้า…'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'You want a modern, relaxed Chanel silhouette',
              'Easy magnetic closure is important',
              'Extra-long chain for crossbody carry is your preference',
              'Budget matters — entry pre-owned is ~$1,000+ cheaper',
            ] : [
              'ต้องการซิลูเอต Chanel สมัยใหม่และผ่อนคลาย',
              'การล็อคแม่เหล็กที่ใช้งานง่ายสำคัญ',
              'โซ่ยาวพิเศษสำหรับ crossbody คือความชอบของคุณ',
              'งบประมาณสำคัญ มือสองเริ่มต้นถูกกว่า ~$1,000+',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Choose Classic Flap if…' : 'เลือก Classic Flap ถ้า…'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'Maximum investment performance is your priority',
              'The iconic CC turnlock is non-negotiable',
              'You want caviar leather (more durable than 19\'s lambskin)',
              'You want the most liquid Chanel to resell in Thailand',
            ] : [
              'ผลการลงทุนสูงสุดคือลำดับความสำคัญของคุณ',
              'ตัวล็อค CC ที่เป็นไอคอนเป็นสิ่งที่ขาดไม่ได้',
              'ต้องการหนัง caviar (ทนทานกว่าหนัง lambskin ของ 19)',
              'ต้องการ Chanel ที่มีสภาพคล่องสูงสุดในการขายต่อในไทย',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">{isEn ? 'The S-Tier exception' : 'ข้อยกเว้น S-Tier'}</h3>
        <p className="text-sm text-gray-300">
          {isEn
            ? 'The Chanel Classic Flap M/L in caviar with gold hardware is the single best-performing handbag investment globally — exceeding 100% of retail in resale value 2021–2024. The Chanel 19 is A-Tier but cannot match this. For pure investment return: Classic Flap wins. For wearability balance: the 19 is the better all-round choice.'
            : 'Chanel Classic Flap M/L ใน caviar พร้อมฮาร์ดแวร์ทองคือการลงทุนกระเป๋าที่ทำงานได้ดีที่สุดในโลก เกิน 100% ของราคาขายในมูลค่าขายต่อปี 2021–2024 Chanel 19 คือ A-Tier แต่ไม่สามารถทัดเทียมได้ สำหรับผลตอบแทนการลงทุนบริสุทธิ์: Classic Flap ชนะ สำหรับความสมดุลความสะดวกในการสวมใส่: 19 เป็นตัวเลือกรอบด้านที่ดีกว่า'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/chanel-19-vs-classic-flap" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/chanel-19-vs-classic-flap" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel →</Link>
        <Link href={`/${locale}/guides/chanel-classic-vs-boy`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Classic vs Boy →</Link>
        <Link href={`/${locale}/guides/chanel-mini-vs-small-flap`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Mini vs Small Flap →</Link>
      </div>
    </div>
  )
}
