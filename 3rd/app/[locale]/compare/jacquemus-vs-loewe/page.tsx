import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/jacquemus-vs-loewe'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Jacquemus vs Loewe Thailand 2025: Which Design Brand for Bangkok? | ChicPreowned'
      : 'Jacquemus vs Loewe ในไทย 2025: แบรนด์ดีไซน์ไหนสำหรับกรุงเทพ? | ChicPreowned',
    description: isEn
      ? 'Jacquemus vs Loewe for Bangkok buyers — Le Bambino vs Puzzle, resale retention, THB prices, and which is the better pre-owned investment in Thailand 2025.'
      : 'Jacquemus vs Loewe สำหรับผู้ซื้อกรุงเทพ Le Bambino vs Puzzle อัตราการรักษามูลค่า ราคาบาท และอันไหนลงทุนมือสองได้ดีกว่าในไทย 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function JacquemusVsLoeweTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Founded', j: 'Marseille 2009', l: 'Madrid 1846' },
    { aspect: 'Design direction', j: 'Mediterranean minimalism, sculptural micro bags', l: 'Jonathan Anderson — intellectual playfulness, craft-focused' },
    { aspect: 'Signature bag', j: 'Le Bambino, Le Chiquito, Le Grand Bambino', l: 'Puzzle Bag, Amazona, Flamenco, Gate Bag' },
    { aspect: 'Price (new)', j: `$350–900 (${formatPriceTHB(350)}–${formatPriceTHB(900)}) Le Bambino`, l: `$1,800–4,500 (${formatPriceTHB(1800)}–${formatPriceTHB(4500)}) Puzzle Medium` },
    { aspect: 'Pre-owned entry', j: `$180–350 (${formatPriceTHB(180)}–${formatPriceTHB(350)}) Le Chiquito`, l: `$900–1,500 (${formatPriceTHB(900)}–${formatPriceTHB(1500)}) Puzzle worn` },
    { aspect: 'Resale retention', j: '30–50% (social-media dependent)', l: '55–75% (Puzzle 65–80%)' },
    { aspect: 'Investment tier', j: 'C-Tier: style buy, not investment', l: 'B+: Puzzle has proven resale durability' },
    { aspect: 'Bangkok boutique', j: 'Available via Ssense, Farfetch (no standalone boutique)', l: 'Loewe boutique at EmSphere, Central' },
  ] : [
    { aspect: 'ก่อตั้ง', j: 'มาร์เซย์ 2009', l: 'มาดริด 1846' },
    { aspect: 'ทิศทางการออกแบบ', j: 'ความเรียบง่ายแบบเมดิเตอร์เรเนียน กระเป๋าประติมากรรมขนาดเล็ก', l: 'Jonathan Anderson ความเล่นสนุกทางปัญญา เน้นงานหัตถกรรม' },
    { aspect: 'กระเป๋าไอคอน', j: 'Le Bambino, Le Chiquito, Le Grand Bambino', l: 'Puzzle Bag, Amazona, Flamenco, Gate Bag' },
    { aspect: 'ราคา (ใหม่)', j: `$350–900 (${formatPriceTHB(350)}–${formatPriceTHB(900)}) Le Bambino`, l: `$1,800–4,500 (${formatPriceTHB(1800)}–${formatPriceTHB(4500)}) Puzzle Medium` },
    { aspect: 'มือสองเริ่มต้น', j: `$180–350 (${formatPriceTHB(180)}–${formatPriceTHB(350)}) Le Chiquito`, l: `$900–1,500 (${formatPriceTHB(900)}–${formatPriceTHB(1500)}) Puzzle สภาพใช้` },
    { aspect: 'อัตราการรักษามูลค่า', j: '30–50% (ขึ้นกับโซเชียลมีเดีย)', l: '55–75% (Puzzle 65–80%)' },
    { aspect: 'ระดับการลงทุน', j: 'C-Tier: ซื้อเพื่อสไตล์ ไม่ใช่การลงทุน', l: 'B+: Puzzle มีความทนทานด้านการขายต่อที่พิสูจน์แล้ว' },
    { aspect: 'บูทีคกรุงเทพ', j: 'ผ่าน Ssense, Farfetch (ไม่มีบูทีคเดี่ยว)', l: 'บูทีค Loewe ที่ EmSphere, Central' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Jacquemus vs Loewe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Jacquemus vs Loewe (2025)</h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two of the most photographed brands of the last five years — but from very different positions. Jacquemus is a viral social-media sensation; Loewe is 180 years of Spanish leather heritage experiencing its greatest commercial moment. Bangkok context and THB prices included.'
          : 'สองแบรนด์ที่ถ่ายรูปมากที่สุดในห้าปีที่ผ่านมา แต่จากตำแหน่งที่ต่างกันมาก Jacquemus เป็นปรากฏการณ์ไวรัลโซเชียล Loewe คือ 180 ปีของมรดกหนังสเปนที่กำลังประสบความสำเร็จทางการค้าสูงสุด รวมบริบทกรุงเทพและราคาบาท'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Jacquemus</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Loewe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.j}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.l}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
          <h3 className="font-semibold text-sky-900 mb-2">{isEn ? 'Buy Jacquemus if…' : 'ซื้อ Jacquemus ถ้า…'}</h3>
          <ul className="text-sm text-sky-800 space-y-1">
            {(isEn ? [
              'You want a fashion moment bag at accessible price',
              'Le Chiquito sculptural handle is your aesthetic',
              'Will wear 1–2 seasons (low resale expectations)',
              'Not concerned about investment performance',
            ] : [
              'ต้องการกระเป๋า fashion moment ในราคาเข้าถึงได้',
              'หูหิ้วประติมากรรมของ Le Chiquito คือ aesthetic ของคุณ',
              'จะใช้ 1–2 ฤดูกาล (ความคาดหวังการขายต่อต่ำ)',
              'ไม่ห่วงเรื่องผลการลงทุน',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'Buy Loewe if…' : 'ซื้อ Loewe ถ้า…'}</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            {(isEn ? [
              'Craft quality matters — Loewe is one of luxury\'s best leather workers',
              'Puzzle\'s geometric origami structure appeals to you',
              'Investment is part of your thinking — Puzzle is a genuine B+ buy',
              'You want intellectually unusual rather than viral',
            ] : [
              'คุณภาพงานหัตถกรรมสำคัญ Loewe เป็นช่างหนังที่ดีที่สุดในหรู',
              'โครงสร้าง origami เรขาคณิตของ Puzzle ดึงดูดคุณ',
              'การลงทุนเป็นส่วนหนึ่งของความคิด Puzzle คือการซื้อ B+ จริง',
              'ต้องการสิ่งที่ผิดปกติทางปัญญามากกว่า viral',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'The Loewe craftsmanship difference' : 'ความแตกต่างด้านหัตถกรรมของ Loewe'}</h3>
        <p className="text-sm text-gray-600">
          {isEn
            ? 'Loewe began as a leather goods cooperative in Madrid in 1846 — 180 years of leather working. The Puzzle Bag\'s geometric panels are cut from a single hide and assembled without any inner lining. A Loewe Puzzle is genuinely hand-crafted at a level Jacquemus doesn\'t attempt.'
            : 'Loewe เริ่มต้นเป็นสหกรณ์ผลิตภัณฑ์หนังในมาดริดปี 1846 — 180 ปีของงานหนัง แผงเรขาคณิตของ Puzzle Bag ถูกตัดจากหนังเดียวและประกอบโดยไม่มีซับใน Puzzle ของ Loewe เป็นงานหัตถกรรมมือจริงในระดับที่ Jacquemus ไม่ได้พยายามทำ'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/jacquemus-vs-loewe" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/jacquemus-vs-loewe" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe →</Link>
        <Link href={`/${locale}/compare/loewe-vs-celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe vs Celine →</Link>
        <Link href={`/${locale}/compare/fendi-vs-loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
      </div>
    </div>
  )
}
