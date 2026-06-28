import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/gen-z-luxury-trends-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Gen Z Luxury Trends Thailand 2025: What Pre-Owned Pieces Are They Buying? | ChicPreowned'
      : 'เทรนด์หรู Gen Z ในไทย 2025: กระเป๋ามือสองอะไรที่พวกเขาซื้อ? | ChicPreowned',
    description: isEn
      ? 'Gen Z is reshaping Bangkok\'s pre-owned luxury market — Miu Miu, Loewe, vintage LV, Y2K jewellery. THB prices and Bangkok shopping context for the Gen Z luxury buyer.'
      : 'Gen Z กำลังปรับรูปแบบตลาดหรูมือสองกรุงเทพ Miu Miu, Loewe, LV vintage, เครื่องประดับ Y2K ราคาบาทและบริบทการช้อปปิ้งกรุงเทพสำหรับผู้ซื้อหรู Gen Z',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function GenZLuxuryTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const picks = isEn ? [
    {
      item: 'Miu Miu Wander Bag', brand: 'Miu Miu', range: `$800–1,400 (${formatPriceTHB(800, 1400)})`,
      why: 'The #1 Gen Z luxury bag 2023–2025 by Lyst search volume. The Wander\'s sheepskin fur trim signals "I know fashion" rather than "I have money" — exactly Gen Z\'s preference. Strong at Chatuchak and Bangkok secondary market.',
    },
    {
      item: 'Louis Vuitton Speedy (vintage, 1990s–2005)', brand: 'Louis Vuitton', range: `$400–900 (${formatPriceTHB(400, 900)})`,
      why: 'Vintage Speedy is the most searched LV by Gen Z. They buy pre-owned and unrestored — patina is desirable. Monogram canvas in dark honey patina is most valued. Widely available in Bangkok\'s pre-owned market.',
    },
    {
      item: 'Loewe Puzzle Bag (small)', brand: 'Loewe', range: `$900–1,400 (${formatPriceTHB(900, 1400)})`,
      why: 'Loewe at EmSphere. The small Puzzle in calfskin is the most accessible entry point and best resale. Gen Z\'s version of quiet luxury — intellectually interesting, not merely expensive.',
    },
    {
      item: 'Cartier Trinity / Love Ring', brand: 'Cartier', range: `$500–1,200 (${formatPriceTHB(500, 1200)})`,
      why: 'Gen Z jewellery buying dominated by "forever pieces." Pre-owned makes Trinity and Love rings accessible at 20–30% below retail. Worn as everyday stacks, not occasions. Cartier Central Embassy is the primary Bangkok retailer.',
    },
    {
      item: 'Y2K Dior Saddle Bag (vintage Galliano)', brand: 'Dior', range: `$700–2,200 (${formatPriceTHB(700, 2200)})`,
      why: 'The 2000–2005 Galliano-era Saddle has been the Y2K trophy for Gen Z since 2022. Pre-owned values up 40–60% from 2019 lows. Vintage pieces feel more culturally meaningful than the 2018 reissue.',
    },
    {
      item: 'Acne Studios / Nanushka (crossover)', brand: 'Contemporary', range: `$200–600 (${formatPriceTHB(200, 600)})`,
      why: 'Entry luxury tier growing in Bangkok pre-owned market. Acne Studios leather jackets, Nanushka vegan leather, and Staud bags — less cachet but genuine craft at accessible prices. Gen Z sustainable luxury gateway.',
    },
  ] : [
    {
      item: 'Miu Miu Wander Bag', brand: 'Miu Miu', range: `$800–1,400 (${formatPriceTHB(800, 1400)})`,
      why: 'กระเป๋าหรู Gen Z อันดับ 1 ปี 2023–2025 ตามปริมาณการค้นหา Lyst ขนสัตว์ sheepskin ของ Wander บอกว่า "ฉันรู้เรื่องแฟชั่น" ไม่ใช่ "ฉันมีเงิน" ตรงกับความชอบ Gen Z แข็งแกร่งที่จตุจักรและตลาดมือสองกรุงเทพ',
    },
    {
      item: 'Louis Vuitton Speedy (vintage ปี 1990–2005)', brand: 'Louis Vuitton', range: `$400–900 (${formatPriceTHB(400, 900)})`,
      why: 'Speedy vintage คือ LV ที่ Gen Z ค้นหามากที่สุด พวกเขาซื้อมือสองและไม่ผ่านการบูรณะ ร่องรอยการใช้งานเป็นสิ่งที่ต้องการ Monogram canvas ที่มี patina สีน้ำผึ้งเข้มมีมูลค่าสูงสุด มีวางจำหน่ายทั่วไปในตลาดมือสองกรุงเทพ',
    },
    {
      item: 'Loewe Puzzle Bag (เล็ก)', brand: 'Loewe', range: `$900–1,400 (${formatPriceTHB(900, 1400)})`,
      why: 'Loewe ที่ EmSphere กรุงเทพ Puzzle เล็กใน calfskin คือจุดเข้าถึงที่ดีที่สุดและสภาพคล่องการขายต่อที่ดีที่สุด Gen Z version ของ quiet luxury น่าสนใจทางปัญญา ไม่ใช่แค่แพง',
    },
    {
      item: 'แหวน Cartier Trinity / Love', brand: 'Cartier', range: `$500–1,200 (${formatPriceTHB(500, 1200)})`,
      why: 'การซื้อเครื่องประดับ Gen Z ถูกครอบงำโดย "ชิ้นตลอดชีวิต" มือสองทำให้แหวน Trinity และ Love เข้าถึงได้ 20–30% ต่ำกว่าราคาขาย ใส่เป็นสแต็คประจำวัน ไม่ใช่โอกาสพิเศษ Cartier Central Embassy คือร้านค้าหลักกรุงเทพ',
    },
    {
      item: 'กระเป๋า Dior Saddle Y2K (Galliano vintage)', brand: 'Dior', range: `$700–2,200 (${formatPriceTHB(700, 2200)})`,
      why: 'กระเป๋า Saddle ยุค 2000–2005 ของ Galliano กลายเป็นถ้วยรางวัล Y2K ของ Gen Z ตั้งแต่ปี 2022 มูลค่ามือสองขึ้น 40–60% จากจุดต่ำสุดปี 2019 ชิ้น vintage รู้สึกมีความหมายทางวัฒนธรรมมากกว่า reissue ปี 2018',
    },
    {
      item: 'Acne Studios / Nanushka (crossover)', brand: 'ร่วมสมัย', range: `$200–600 (${formatPriceTHB(200, 600)})`,
      why: 'ระดับหรูเข้าถึงได้เพิ่มขึ้นในตลาดมือสองกรุงเทพ Acne Studios หนัง, Nanushka หนัง vegan, และกระเป๋า Staud — คุณค่าน้อยกว่าแต่งานหัตถกรรมจริงในราคาเข้าถึงได้ Gateway หรูที่ยั่งยืนของ Gen Z',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Gen Z Luxury 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Gen Z Luxury Trends 2025: What Pre-Owned Pieces Are They Buying?' : 'เทรนด์หรู Gen Z 2025: กระเป๋ามือสองอะไรที่พวกเขาซื้อ?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Gen Z (born 1997–2012) became the fastest-growing segment of the pre-owned luxury market 2023–2025. Their preferences differ sharply from Millennials — craft over status, vintage over pristine, cultural resonance over brand prestige. Bangkok\'s Chatuchak and online markets have seen significant Gen Z activity.'
          : 'Gen Z (เกิดปี 1997–2012) กลายเป็นกลุ่มที่เติบโตเร็วที่สุดในตลาดหรูมือสองปี 2023–2025 ความชอบของพวกเขาแตกต่างอย่างชัดเจนจาก Millennial งานหัตถกรรมมากกว่าสถานะ vintage มากกว่าสมบูรณ์ ความหมายทางวัฒนธรรมมากกว่าความมีชื่อเสียงของแบรนด์ จตุจักรและตลาดออนไลน์กรุงเทพเห็นกิจกรรม Gen Z อย่างมีนัยสำคัญ'}
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">{isEn ? 'Gen Z vs Millennial luxury buying' : 'การซื้อหรู Gen Z vs Millennial'}</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">{isEn ? 'Millennials prefer:' : 'Millennial ชอบ:'}</p>
            <ul className="text-gray-600 space-y-1">
              {(isEn ? ['Classic: Chanel, Hermès, LV', 'Near-mint condition', 'Investment rationale', 'Box and papers = priority'] : ['คลาสสิก: Chanel, Hermès, LV', 'สภาพใกล้ mint', 'เหตุผลการลงทุน', 'กล่องและบัตร = ลำดับความสำคัญ']).map((i, k) => <li key={k}>• {i}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">{isEn ? 'Gen Z prefers:' : 'Gen Z ชอบ:'}</p>
            <ul className="text-gray-600 space-y-1">
              {(isEn ? ['Fashion-forward: Miu Miu, Loewe, vintage', 'Patina acceptable (even desirable)', 'Cultural meaning over value retention', 'Sustainability narrative matters'] : ['ก้าวหน้า: Miu Miu, Loewe, vintage', 'ร่องรอยการใช้งานยอมรับได้ (ยิ่งดี)', 'ความหมายทางวัฒนธรรมมากกว่าการรักษามูลค่า', 'การเล่าเรื่องความยั่งยืนสำคัญ']).map((i, k) => <li key={k}>• {i}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {picks.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-medium">{p.brand}</span>
                <h2 className="font-semibold text-gray-900">{p.item}</h2>
              </div>
              <span className="text-xs font-semibold text-amber-700">{p.range}</span>
            </div>
            <p className="text-sm text-gray-600">{p.why}</p>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-purple-900 mb-2">{isEn ? 'What this means for pre-owned investors' : 'ความหมายสำหรับนักลงทุนมือสอง'}</h3>
        <p className="text-sm text-purple-800">
          {isEn
            ? 'Gen Z taste sets trends but doesn\'t always sustain them. Miu Miu, vintage LV, and Loewe have already appreciated 20–40% from 2021 lows. Vintage pieces (Galliano-era Dior, 1990s Miu Miu) have fundamental collector value that outlasts trend cycles.'
            : 'รสนิยม Gen Z กำหนดเทรนด์แต่ไม่ได้ยั่งยืนเสมอ Miu Miu, LV vintage และ Loewe ขึ้นไปแล้ว 20–40% จากจุดต่ำสุดปี 2021 ชิ้น vintage (Dior ยุค Galliano, Miu Miu ทศวรรษ 1990) มีมูลค่านักสะสมพื้นฐานที่ยืนยาวกว่าวัฏจักรเทรนด์'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/gen-z-luxury-trends-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/gen-z-luxury-trends-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/trends/miu-miu-rise-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu Rise →</Link>
        <Link href={`/${locale}/trends/y2k-luxury-bags-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Y2K Luxury Bags →</Link>
        <Link href={`/${locale}/trends/phoebe-philo-effect-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Phoebe Philo Effect →</Link>
      </div>
    </div>
  )
}
