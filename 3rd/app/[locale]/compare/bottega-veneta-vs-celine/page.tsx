import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/bottega-veneta-vs-celine'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Bottega Veneta vs Celine Thailand 2025: Quiet Luxury Showdown | ChicPreowned'
      : 'Bottega Veneta vs Celine ในไทย 2025: การดวลหรูเงียบ | ChicPreowned',
    description: isEn
      ? 'Bottega Veneta vs Celine for Bangkok buyers 2025 — Jodie vs Triomphe, THB prices, resale retention, and which quiet luxury brand is the better pre-owned investment in Thailand.'
      : 'Bottega Veneta vs Celine สำหรับผู้ซื้อกรุงเทพ 2025 Jodie vs Triomphe ราคาบาท อัตราการรักษามูลค่า และแบรนด์ quiet luxury ไหนลงทุนมือสองได้ดีกว่าในไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function BottegaVsCelineTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Founded', bv: 'Vicenza, Italy 1966', ce: 'Paris, France 1945' },
    { aspect: 'Design language', bv: 'Intrecciato weave leather, tactile, craft-focused', ce: 'Structured minimalism, Arc de Triomphe clasp' },
    { aspect: 'Signature bag', bv: 'Jodie, Andiamo, Sardine, Cassette', ce: 'Triomphe, Box Bag, 16 Bag, Tabou' },
    { aspect: 'Entry pre-owned', bv: `$900–1,600 (${formatPriceTHB(900, 1600)}) Jodie small`, ce: `$800–1,400 (${formatPriceTHB(800, 1400)}) Mini Triomphe` },
    { aspect: 'Resale retention', bv: '55–70% (Jodie 60–75%)', ce: '50–70% (Triomphe 60–80%)' },
    { aspect: 'Investment tier', bv: 'B+ (Jodie is exceptional)', ce: 'B+ (Triomphe is exceptional)' },
    { aspect: 'Bangkok boutique', bv: 'Bottega Veneta at EmSphere, ICON Siam, Central Embassy', ce: 'Celine at Emporium, Siam Paragon, Central Embassy' },
  ] : [
    { aspect: 'ก่อตั้ง', bv: 'Vicenza, อิตาลี 1966', ce: 'ปารีส, ฝรั่งเศส 1945' },
    { aspect: 'ภาษาการออกแบบ', bv: 'หนัง intrecciato ถัก สัมผัสได้ เน้นงานหัตถกรรม', ce: 'ความเรียบง่ายแบบมีโครงสร้าง ตัวล็อค Arc de Triomphe' },
    { aspect: 'กระเป๋าไอคอน', bv: 'Jodie, Andiamo, Sardine, Cassette', ce: 'Triomphe, Box Bag, 16 Bag, Tabou' },
    { aspect: 'มือสองเริ่มต้น', bv: `$900–1,600 (${formatPriceTHB(900, 1600)}) Jodie เล็ก`, ce: `$800–1,400 (${formatPriceTHB(800, 1400)}) Mini Triomphe` },
    { aspect: 'อัตราการรักษามูลค่า', bv: '55–70% (Jodie 60–75%)', ce: '50–70% (Triomphe 60–80%)' },
    { aspect: 'ระดับการลงทุน', bv: 'B+ (Jodie ยอดเยี่ยม)', ce: 'B+ (Triomphe ยอดเยี่ยม)' },
    { aspect: 'บูทีคกรุงเทพ', bv: 'Bottega Veneta ที่ EmSphere, ICON Siam, Central Embassy', ce: 'Celine ที่ Emporium, Siam Paragon, Central Embassy' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Bottega Veneta vs Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Bottega Veneta vs Celine (2025): The Quiet Luxury Showdown' : 'Bottega Veneta vs Celine (2025): การดวลหรูเงียบ'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both brands became synonymous with "quiet luxury" — no visible logos, high craft, understated status. Both have exceptional resale on their hero pieces. Bangkok context and THB prices included.'
          : 'ทั้งสองแบรนด์กลายเป็นคำพ้องความหมายกับ "quiet luxury" ไม่มีโลโก้มองเห็น งานหัตถกรรมสูง สถานะเงียบงาม ทั้งสองมีการขายต่อที่ยอดเยี่ยมบนชิ้นฮีโร่ รวมบริบทกรุงเทพและราคาบาท'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-green-800">Bottega Veneta</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-slate-800">Celine</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.bv}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.ce}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold text-green-900 mb-2">{isEn ? 'Buy Bottega Veneta if…' : 'ซื้อ Bottega Veneta ถ้า…'}</h3>
          <ul className="text-sm text-green-800 space-y-1">
            {(isEn ? [
              'The tactile intrecciato weave is your primary draw',
              'You want identifiable to those who know, invisible to others',
              'The Jodie\'s crescent shape and ease of wear appeals',
              'The Daniel Lee (2018–2021) era pieces are your target',
            ] : [
              'การถัก intrecciato สัมผัสได้คือเหตุผลหลักของคุณ',
              'ต้องการสิ่งที่ระบุตัวตนได้สำหรับผู้รู้ มองไม่เห็นสำหรับคนอื่น',
              'รูปร่างพระจันทร์เสี้ยวและความสะดวกของ Jodie ดึงดูดคุณ',
              'ชิ้นยุค Daniel Lee (2018–2021) คือเป้าหมายของคุณ',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-2">{isEn ? 'Buy Celine if…' : 'ซื้อ Celine ถ้า…'}</h3>
          <ul className="text-sm text-slate-800 space-y-1">
            {(isEn ? [
              'The Triomphe clasp is a must-have detail for you',
              'You prefer structured bags with organized interiors',
              'Phoebe Philo-era Celine vintage is your target',
              'The Box Bag\'s structured silhouette is your aesthetic',
            ] : [
              'ตัวล็อค Triomphe คือรายละเอียดที่ต้องมีสำหรับคุณ',
              'ชอบกระเป๋ามีโครงสร้างและภายในจัดระเบียบ',
              'Celine vintage ยุค Phoebe Philo คือเป้าหมายของคุณ',
              'ซิลูเอตแบบมีโครงสร้างของ Box Bag คือ aesthetic ของคุณ',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'The Daniel Lee shadow' : 'เงาของ Daniel Lee'}</h3>
        <p className="text-sm text-gray-600">
          {isEn
            ? 'Daniel Lee\'s tenure at Bottega Veneta (2018–2021) created the modern BV boom. The "Lee-era" pieces (Jodie, Cassette, Pouch) carry collector premiums of 10–15% over Matthieu Blazy-era equivalents. Bangkok buyers specifically seeking Lee-era BV should look for pre-2022 pieces.'
            : 'ช่วงเวลาของ Daniel Lee ที่ Bottega Veneta (2018–2021) สร้างกระแส BV สมัยใหม่ ชิ้น "ยุค Lee" (Jodie, Cassette, Pouch) มีพรีเมียมนักสะสม 10–15% เหนือชิ้นยุค Matthieu Blazy ผู้ซื้อกรุงเทพที่ต้องการ BV ยุค Lee ควรมองหาชิ้นก่อนปี 2022'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/bottega-veneta-vs-celine" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/bottega-veneta-vs-celine" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/bottega-veneta`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega Veneta →</Link>
        <Link href={`/${locale}/brands/celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Celine →</Link>
        <Link href={`/${locale}/compare/loewe-vs-celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe vs Celine →</Link>
      </div>
    </div>
  )
}
