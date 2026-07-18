import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/rolex-daytona-investment-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Rolex Daytona Investment Thailand 2025: Which Reference? | ChicPreowned'
      : 'การลงทุน Rolex Daytona ในไทย 2025: อ้างอิงไหน? | ChicPreowned',
    description: isEn
      ? 'Rolex Daytona investment analysis for Thailand buyers 2025 — Panda vs Reverse Panda, ceramic bezel refs, Paul Newman vintage opportunity, THB prices, and 2025 market correction context.'
      : 'การวิเคราะห์การลงทุน Rolex Daytona สำหรับผู้ซื้อในไทย 2025 Panda vs Reverse Panda อ้างอิงขอบเซรามิก โอกาสวินเทจ Paul Newman ราคาบาท และบริบทการปรับตัวของตลาด 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function RolexDaytonaInvestmentTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const references = isEn ? [
    { ref: '116500LN', name: 'Daytona 40mm Ceramic (White dial)', tag: '↑ Stable-High', price: '$18,000–28,000', thb: formatPriceTHB(18000, 28000), retail: '$14,550', note: 'Current flagship. Ceramic bezel since 2016. "Panda" white dial: higher demand than black.' },
    { ref: '116500LN (Black)', name: 'Daytona Ceramic Black Dial', tag: '→ Stable', price: '$17,000–25,000', thb: formatPriceTHB(17000, 25000), retail: '$14,550', note: '"Reverse Panda." Strong floor, slightly lower demand than white dial.' },
    { ref: '116520', name: 'Daytona Steel (Pre-2016)', tag: '↑ Rising', price: '$14,000–20,000', thb: formatPriceTHB(14000, 20000), retail: 'Discontinued', note: 'Last steel Daytona before ceramic bezel. Sought by purists who prefer sapphire bezel.' },
    { ref: '116506', name: 'Daytona Platinum/Ice Blue', tag: '↑ Appreciating', price: '$65,000–90,000', thb: formatPriceTHB(65000, 90000), retail: '$75,000', note: 'Ultra-rare. Volatile secondary market — significant swings possible.' },
    { ref: '6263/6265', name: 'Vintage Paul Newman (1960s–80s)', tag: '↑↑ Steeply rising', price: '$40,000–400,000+', thb: '฿1,440,000+', retail: 'N/A', note: 'Original "Paul Newman" dial. Auction record: $17.8M. Requires expert authentication.' },
  ] : [
    { ref: '116500LN', name: 'Daytona 40mm เซรามิก (หน้าขาว)', tag: '↑ คงที่-สูง', price: '$18,000–28,000', thb: formatPriceTHB(18000, 28000), retail: '$14,550', note: 'รุ่นปัจจุบัน ขอบเซรามิกตั้งแต่ปี 2016 หน้าขาว "Panda": ความต้องการสูงกว่าหน้าดำ' },
    { ref: '116500LN (Black)', name: 'Daytona เซรามิกหน้าดำ', tag: '→ คงที่', price: '$17,000–25,000', thb: formatPriceTHB(17000, 25000), retail: '$14,550', note: '"Reverse Panda" ระดับพื้นแข็งแกร่ง ความต้องการต่ำกว่าหน้าขาวเล็กน้อย' },
    { ref: '116520', name: 'Daytona สแตนเลส (ก่อนปี 2016)', tag: '↑ เพิ่มขึ้น', price: '$14,000–20,000', thb: formatPriceTHB(14000, 20000), retail: 'ยกเลิกผลิต', note: 'Daytona สแตนเลสรุ่นสุดท้ายก่อนขอบเซรามิก ต้องการโดยนักสะสมดั้งเดิม' },
    { ref: '116506', name: 'Daytona แพลตตินัม/Ice Blue', tag: '↑ มูลค่าเพิ่ม', price: '$65,000–90,000', thb: formatPriceTHB(65000, 90000), retail: '$75,000', note: 'หายากมาก ตลาดรองผันผวน อาจมีการเปลี่ยนแปลงมาก' },
    { ref: '6263/6265', name: 'วินเทจ Paul Newman (1960s–80s)', tag: '↑↑ พุ่งสูงชัน', price: '$40,000–400,000+', thb: '฿1,440,000+', retail: 'ไม่มี', note: 'หน้าปัด "Paul Newman" ดั้งเดิม สถิติประมูล: $17.8M ต้องการผู้เชี่ยวชาญยืนยัน' },
  ]

  const tagColor = (tag: string) => {
    if (tag.startsWith('↑↑')) return 'bg-green-900 text-green-100'
    if (tag.startsWith('↑')) return 'bg-green-700 text-green-100'
    return 'bg-gray-700 text-gray-100'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Rolex Daytona Investment 2025' : 'การลงทุน Rolex Daytona 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Rolex Daytona Investment 2025: Which Reference to Buy?' : 'การลงทุน Rolex Daytona 2025: ควรซื้อรุ่นอ้างอิงไหน?'}
      </h1>
      <p className="text-gray-500 mb-6">
        {isEn
          ? 'The Daytona is Rolex\'s most celebrated chronograph and one of the few modern watches that consistently trades above retail. But not all references perform equally in 2025 — and the market has corrected significantly from the 2021-2022 peak.'
          : 'Daytona เป็นโครโนกราฟที่โด่งดังที่สุดของ Rolex และเป็นหนึ่งในนาฬิกาสมัยใหม่ไม่กี่รุ่นที่ซื้อขายเหนือราคา retail อย่างสม่ำเสมอ แต่ไม่ใช่ทุกรุ่นอ้างอิงที่ทำผลงานเท่ากันในปี 2025 และตลาดปรับตัวลดลงอย่างมีนัยสำคัญจากจุดสูงสุดปี 2021-2022'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm font-medium text-amber-900">{isEn ? '2025 market context' : 'บริบทตลาด 2025'}</p>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'Rolex Daytona peaked 2021-2022 (steel 116500LN reaching $35,000–45,000). Since corrected to $18,000–28,000 (฿648,000–฿1,008,000) — still 20-90% above retail, but no longer extreme pandemic-era premiums. This correction is a buying window for long-term holders.'
            : 'Rolex Daytona พุ่งสูงสุด 2021-2022 (สแตนเลส 116500LN ถึง $35,000–45,000) ตั้งแต่นั้นปรับตัวมาที่ $18,000–28,000 (฿648,000–฿1,008,000) ยังคงสูงกว่า retail 20-90% แต่ไม่ใช่เบี้ยล้นสมัยโรคระบาดอีกต่อไป การปรับตัวนี้เป็นโอกาสซื้อสำหรับผู้ถือระยะยาว'}
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {references.map((r, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="font-semibold text-gray-900">{r.name}</h2>
                <p className="text-xs text-gray-500">Ref. {r.ref}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${tagColor(r.tag)}`}>{r.tag}</span>
            </div>
            <div className="flex flex-wrap gap-4 mb-2 text-xs text-gray-500">
              <span>{isEn ? 'Pre-owned' : 'มือสอง'}: <strong className="text-gray-700">{r.price} ({r.thb})</strong></span>
              {r.retail !== 'N/A' && r.retail !== 'ไม่มี' && r.retail !== 'ยกเลิกผลิต' && r.retail !== 'Discontinued' && <span>{isEn ? 'Retail' : 'ราคา retail'}: {r.retail}</span>}
            </div>
            <p className="text-sm text-gray-600">{r.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">{isEn ? 'Paul Newman Daytona: an extraordinary story' : 'Paul Newman Daytona: เรื่องราวอันน่าทึ่ง'}</h3>
        <p className="text-sm text-gray-300">
          {isEn
            ? 'The "Paul Newman" Daytona refers to refs 6239, 6240, 6263, 6265 with a distinctive "exotic" dial. When Newman\'s personal Daytona sold at auction in 2017 for $17.75M, it reset the entire vintage Daytona market. Authentic Newman dials start at $40,000 (฿1.44M+) and can exceed $400,000. Caution: extensively faked — do not buy vintage Daytona without expert authentication.'
            : '"Paul Newman" Daytona หมายถึงรุ่น 6239, 6240, 6263, 6265 พร้อมหน้าปัด "exotic" ที่โดดเด่น เมื่อ Daytona ส่วนตัวของ Newman ขายในประมูลปี 2017 ที่ $17.75M ได้ปรับตลาด Daytona วินเทจทั้งหมด หน้าปัด Newman ของแท้เริ่มต้นที่ $40,000 (฿1.44M+) และอาจเกิน $400,000 ข้อควรระวัง: ถูกปลอมอย่างกว้างขวาง อย่าซื้อ Daytona วินเทจโดยไม่มีผู้เชี่ยวชาญยืนยัน'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/rolex-daytona-investment-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/rolex-daytona-investment-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/how-to-authenticate-rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate Rolex' : 'ยืนยัน Rolex'} →</Link>
        <Link href={`/${locale}/compare/rolex-vs-patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek →</Link>
        <Link href={`/${locale}/guides/rolex-submariner-buying-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Submariner Guide →</Link>
      </div>
    </div>
  )
}
