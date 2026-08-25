import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/rolex-vs-patek-philippe'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Rolex vs Patek Philippe: Pre-Owned Watches in Thailand ${PRICE_YEAR}`
      : `Rolex vs Patek Philippe: นาฬิกามือสองในไทย ${PRICE_YEAR}`,
    description: isEn
      ? `Rolex vs Patek Philippe investment comparison. Submariner vs Nautilus — which is the better pre-owned watch buy in Thailand in ${PRICE_YEAR}?`
      : 'เปรียบเทียบ Rolex vs Patek Philippe เพื่อการลงทุน Submariner vs Nautilus — อะไรน่าซื้อมือสองในไทยปี 2568?',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

export default async function RolexVsPatekPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Annual production', rolex: '~1,000,000 watches', patek: '~60,000 watches' },
    { aspect: 'Entry pre-owned (THB)', rolex: '฿185,000 (Oyster Perpetual 36)', patek: '฿450,000+ (Calatrava)' },
    { aspect: 'Iconic sports model', rolex: 'Submariner, GMT-Master II', patek: 'Nautilus 5711, Aquanaut 5167' },
    { aspect: 'Sports model vs retail', rolex: '120–180%', patek: '300–500%' },
    { aspect: 'Resale liquidity in Thailand', rolex: 'Very high — widest market', patek: 'Moderate — specialist buyers only' },
    { aspect: 'Value retention (dress models)', rolex: '85–95%', patek: '90–100%' },
    { aspect: 'Movement finishing', rolex: 'Industrial precision, COSC', patek: 'Hand-bevelled, finest production finishing' },
    { aspect: 'Price ceiling', rolex: '฿3,000,000 (platinum Daytona)', patek: 'No ceiling — grand complications reach ฿50M+' },
  ] : [
    { aspect: 'ยอดผลิตต่อปี', rolex: '~1,000,000 เรือน', patek: '~60,000 เรือน' },
    { aspect: 'ราคาเริ่มต้นมือสอง (บาท)', rolex: '185,000 บาท (Oyster Perpetual 36)', patek: '450,000 บาท+ (Calatrava)' },
    { aspect: 'รุ่นกีฬาที่โด่งดัง', rolex: 'Submariner, GMT-Master II', patek: 'Nautilus 5711, Aquanaut 5167' },
    { aspect: 'รุ่นกีฬาเทียบราคาปลีก', rolex: '120–180%', patek: '300–500%' },
    { aspect: 'สภาพคล่องขายต่อในไทย', rolex: 'สูงมาก — ตลาดกว้างที่สุด', patek: 'ปานกลาง — ผู้ซื้อเฉพาะทางเท่านั้น' },
    { aspect: 'การรักษามูลค่า (รุ่นชุด)', rolex: '85–95%', patek: '90–100%' },
    { aspect: 'การตกแต่งกลไก', rolex: 'ความแม่นยำเชิงอุตสาหกรรม รับรอง COSC', patek: 'ตกแต่งด้วยมือ การตกแต่งสายการผลิตที่ดีที่สุด' },
    { aspect: 'ราคาสูงสุด', rolex: '3,000,000 บาท (platinum Daytona)', patek: 'ไม่มีเพดาน — grand complication ถึง 50 ล้านบาท+' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/watches`} className="hover:text-gray-800">{isEn ? 'Watches' : 'นาฬิกา'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Rolex vs Patek Philippe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Rolex vs Patek Philippe: Which to Buy Pre-Owned in Thailand ${PRICE_YEAR}?` : 'Rolex vs Patek Philippe: ซื้อมือสองอะไรดีในไทย 2568?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both trade above retail on sports models — but Patek commands 3–5× vs Rolex\'s 1.2–1.8×. The right choice depends on your budget and goals.'
          : 'ทั้งคู่ซื้อขายเหนือราคาปลีกในรุ่นกีฬา — แต่ Patek ได้ 3–5 เท่า vs Rolex 1.2–1.8 เท่า การเลือกที่ถูกต้องขึ้นอยู่กับงบประมาณและเป้าหมายของคุณ'}
      </p>

      <ThaiPriceCallout
        slugs={['rolex/daytona', 'rolex/submariner', 'patek-philippe/nautilus-5711']}
        locale={locale}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>{isEn ? 'Investment note:' : 'หมายเหตุการลงทุน:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Patek Nautilus and Aquanaut in stainless steel produce the highest secondary market premiums of any watch brand. Rolex is far more liquid — easier to sell quickly in Thailand at a fair price.'
            : 'Patek Nautilus และ Aquanaut ในสแตนเลสให้พรีเมียมตลาดรองสูงสุดของแบรนด์นาฬิกาใดๆ Rolex มีสภาพคล่องมากกว่า — ขายได้ง่ายและเร็วกว่าในไทยในราคาที่ยุติธรรม'}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rolex</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Most liquid watch brand in the world</li>
              <li>✓ Entry from ฿185,000 (Oyster Perpetual)</li>
              <li>✓ Sports models trade 120–180% of retail</li>
              <li>✓ Large Thai and international buyer pool</li>
              <li>✗ Lower prestige ceiling than Patek in collector circles</li>
            </> : <>
              <li>✓ แบรนด์นาฬิกาที่มีสภาพคล่องสูงสุดในโลก</li>
              <li>✓ ราคาเริ่มต้นจาก 185,000 บาท (Oyster Perpetual)</li>
              <li>✓ รุ่นกีฬาซื้อขายที่ 120–180% ของราคาปลีก</li>
              <li>✓ กลุ่มผู้ซื้อไทยและนานาชาติขนาดใหญ่</li>
              <li>✗ ความ prestige สูงสุดต่ำกว่า Patek ในวงนักสะสม</li>
            </>}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Patek Philippe</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Nautilus/Aquanaut trade 300–500% of retail</li>
              <li>✓ Pinnacle of watch prestige — globally recognised</li>
              <li>✓ Multi-generational appeal as a family heirloom</li>
              <li>✓ Finest hand-finishing of any production watch</li>
              <li>✗ Much smaller Thai buyer pool — harder to sell fast</li>
              <li>✗ Entry from ฿450,000+ (much higher than Rolex)</li>
            </> : <>
              <li>✓ Nautilus/Aquanaut ซื้อขายที่ 300–500% ของราคาปลีก</li>
              <li>✓ ยอด prestige ของนาฬิกา — เป็นที่ยอมรับทั่วโลก</li>
              <li>✓ เหมาะสำหรับหลายชั่วอายุในฐานะมรดกของครอบครัว</li>
              <li>✓ การตกแต่งด้วยมือที่ดีที่สุดของนาฬิกาสายการผลิต</li>
              <li>✗ กลุ่มผู้ซื้อไทยเล็กกว่ามาก — ขายเร็วได้ยากกว่า</li>
              <li>✗ ราคาเริ่มต้นจาก 450,000 บาท+ (สูงกว่า Rolex มาก)</li>
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
                <th className="text-left py-3 px-4 font-semibold">Rolex</th>
                <th className="text-left py-3 px-4 font-semibold">Patek Philippe</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.rolex}</td>
                  <td className="py-3 px-4 text-gray-600">{row.patek}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isEn ? 'Choose Rolex if:' : 'เลือก Rolex ถ้า:'}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>• You want the most liquid pre-owned investment</li>
              <li>• Budget is ฿185,000–800,000</li>
              <li>• You want a daily-wear sports watch</li>
              <li>• You may need to sell it quickly in Thailand</li>
            </> : <>
              <li>• ต้องการการลงทุนมือสองที่มีสภาพคล่องสูงสุด</li>
              <li>• งบประมาณ 185,000–800,000 บาท</li>
              <li>• ต้องการนาฬิกากีฬาสำหรับใส่ทุกวัน</li>
              <li>• อาจต้องขายเร็วในไทย</li>
            </>}
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isEn ? 'Choose Patek if:' : 'เลือก Patek ถ้า:'}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>• You want the highest prestige watch available</li>
              <li>• Budget is ฿450,000+ (Calatrava) or ฿3M+ (Nautilus)</li>
              <li>• You are buying for multi-decade appreciation</li>
              <li>• You have access to international buyers</li>
            </> : <>
              <li>• ต้องการนาฬิกาที่มี prestige สูงสุดที่มี</li>
              <li>• งบประมาณ 450,000 บาท+ (Calatrava) หรือ 3 ล้าน+ (Nautilus)</li>
              <li>• ซื้อเพื่อมูลค่าเพิ่มในหลายทศวรรษ</li>
              <li>• มีช่องทางเข้าถึงผู้ซื้อนานาชาติ</li>
            </>}
          </ul>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/rolex-vs-patek-philippe" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/rolex-vs-patek-philippe" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex Prices →' : 'ราคา Rolex →'}
        </Link>
        <Link href={`/${locale}/brands/patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Patek Philippe Prices →' : 'ราคา Patek Philippe →'}
        </Link>
        <Link href={`/${locale}/compare/rolex-vs-audemars-piguet`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex vs AP →' : 'Rolex vs AP →'}
        </Link>
      </div>
    </div>
  )
}
