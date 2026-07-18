import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/tiffany-vs-van-cleef'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Tiffany vs Van Cleef & Arpels Thailand 2025: Which Jewelry? | ChicPreowned'
      : 'Tiffany vs Van Cleef & Arpels ไทย 2025: ควรซื้ออันไหน? | ChicPreowned',
    description: isEn
      ? 'Tiffany vs VCA for Bangkok buyers — THB prices, resale value, Alhambra vs HardWear, investment case. Which jewelry brand to buy pre-owned in Thailand 2025?'
      : 'Tiffany vs VCA สำหรับผู้ซื้อกรุงเทพ ราคาบาท มูลค่าขายต่อ Alhambra vs HardWear คุณค่าการลงทุน ควรซื้อแบรนด์เครื่องประดับอะไรมือสองในไทย 2025?',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function TiffanyVsVCATH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { label: 'Founded', tiffany: 'New York, 1837. American luxury icon.', vcaf: 'Paris, 1906. French Maison, Place Vendôme.' },
    { label: 'Signature piece', tiffany: 'T Wire, HardWear chain, Tiffany Setting diamond ring', vcaf: 'Alhambra four-leaf clover (1968), Perlée, Magic Alhambra' },
    { label: 'Aesthetic', tiffany: 'Bold, geometric, American confidence', vcaf: 'Delicate, floral, French romantic elegance' },
    { label: 'Entry price (pre-owned)', tiffany: `Return to Tiffany bracelet: $150–$400 (${formatPriceTHB(150)}–${formatPriceTHB(400)})`, vcaf: `Alhambra vintage necklace (1 motif): $1,200–$2,000 (${formatPriceTHB(1200)}–${formatPriceTHB(2000)})` },
    { label: 'Resale value', tiffany: 'Return to Tiffany: 30–50%. HardWear + T: 40–65%. Diamonds hold better.', vcaf: 'Alhambra MOP: 60–90% of retail. Vintage 1970s: 100–150%+ of retail.' },
    { label: 'Investment case', tiffany: 'Moderate. LVMH repositioning upmarket. Long-term upside, short-term resale below retail.', vcaf: 'Strong. VCA appreciates reliably. Vintage Alhambra significantly above retail.' },
    { label: 'Bangkok context', tiffany: 'Tiffany at CentralWorld, Gaysorn. Return to Tiffany pieces very recognizable.', vcaf: 'VCA at Gaysorn, ICONSIAM. Alhambra extremely faked in Bangkok — authentication essential.' },
  ] : [
    { label: 'ก่อตั้ง', tiffany: 'นิวยอร์ก 1837 ไอคอนสินค้าหรูอเมริกัน', vcaf: 'ปารีส 1906 Maison ฝรั่งเศส Place Vendôme' },
    { label: 'ชิ้นหลัก', tiffany: 'T Wire, HardWear chain, แหวนเพชร Tiffany Setting', vcaf: 'ดอกโคลเวอร์สี่ใบ Alhambra (1968), Perlée, Magic Alhambra' },
    { label: 'สไตล์', tiffany: 'กล้าหาญ เรขาคณิต ความมั่นใจแบบอเมริกัน', vcaf: 'ละเอียดอ่อน ดอกไม้ ความโรแมนติกสไตล์ฝรั่งเศส' },
    { label: 'ราคาเริ่มต้น (มือสอง)', tiffany: `Return to Tiffany bracelet: $150–$400 (${formatPriceTHB(150)}–${formatPriceTHB(400)})`, vcaf: `Alhambra vintage necklace (1 motif): $1,200–$2,000 (${formatPriceTHB(1200)}–${formatPriceTHB(2000)})` },
    { label: 'มูลค่าขายต่อ', tiffany: 'Return to Tiffany: 30–50% HardWear+T: 40–65% เพชรรักษาได้ดีกว่า', vcaf: 'Alhambra MOP: 60–90% ราคาร้าน Vintage 1970s: 100–150%+ ราคาร้าน' },
    { label: 'คุณค่าการลงทุน', tiffany: 'ปานกลาง LVMH ปรับตำแหน่งระดับสูง ศักยภาพระยะยาว การขายต่อระยะสั้นต่ำกว่าราคาร้าน', vcaf: 'แข็งแกร่ง VCA เพิ่มมูลค่าอย่างน่าเชื่อถือ Alhambra vintage สูงกว่าราคาร้านอย่างมีนัยสำคัญ' },
    { label: 'บริบทกรุงเทพ', tiffany: 'Tiffany ที่ CentralWorld, Gaysorn ชิ้น Return to Tiffany เป็นที่รู้จักมาก', vcaf: 'VCA ที่ Gaysorn, ICONSIAM Alhambra ถูกปลอมมากในกรุงเทพ ต้องตรวจสอบความถูกต้อง' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Tiffany vs Van Cleef</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Tiffany & Co vs Van Cleef & Arpels 2025' : 'Tiffany & Co vs Van Cleef & Arpels 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'American boldness vs French delicacy. The HardWear chain vs the Alhambra clover. Two completely different jewelry philosophies — both luxury, both recognized globally. For Thai buyers: VCA resale is significantly stronger; Tiffany entry price is much lower.'
          : 'ความกล้าหาญอเมริกัน vs ความละเอียดอ่อนฝรั่งเศส HardWear chain vs ดอกโคลเวอร์ Alhambra สองปรัชญาเครื่องประดับที่แตกต่างกันโดยสิ้นเชิง ทั้งคู่หรูหรา ทั้งคู่เป็นที่รู้จักทั่วโลก สำหรับผู้ซื้อชาวไทย การขายต่อ VCA แข็งแกร่งกว่าอย่างมีนัยสำคัญ ราคาเริ่มต้น Tiffany ถูกกว่ามาก'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-32 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Tiffany & Co</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Van Cleef & Arpels</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.tiffany}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.vcaf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Buy Tiffany if…' : 'ซื้อ Tiffany ถ้า…'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'Budget under ฿20,000 for a recognizable piece',
              'Prefer bold, statement jewelry',
              'Buying diamonds (Tiffany grading strong)',
              'American aesthetic resonates',
            ] : [
              'งบต่ำกว่า ฿20,000 สำหรับชิ้นที่จดจำได้',
              'ชอบเครื่องประดับที่กล้าหาญ โดดเด่น',
              'ซื้อเพชร (การเกรด Tiffany แข็งแกร่ง)',
              'สุนทรียภาพอเมริกันถูกใจ',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Buy Van Cleef if…' : 'ซื้อ Van Cleef ถ้า…'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'Investment/resale value is the priority',
              'Prefer delicate, everyday-wearable jewelry',
              'French craftsmanship and prestige matter',
              'Budget ฿45,000+ for Alhambra',
            ] : [
              'มูลค่าการลงทุน/ขายต่อเป็นสิ่งสำคัญ',
              'ชอบเครื่องประดับละเอียดอ่อน ใส่ได้ทุกวัน',
              'ฝีมือและศักดิ์ศรีฝรั่งเศสมีความสำคัญ',
              'งบ ฿45,000+ สำหรับ Alhambra',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/tiffany-vs-van-cleef" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/tiffany-vs-van-cleef" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/cartier-vs-tiffany`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Tiffany vs Cartier →' : 'Tiffany vs Cartier →'}</Link>
        <Link href={`/${locale}/brands/van-cleef`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Van Cleef Pre-Owned →' : 'Van Cleef มือสอง →'}</Link>
        <Link href={`/${locale}/compare/cartier-vs-van-cleef`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Van Cleef →</Link>
      </div>
    </div>
  )
}
