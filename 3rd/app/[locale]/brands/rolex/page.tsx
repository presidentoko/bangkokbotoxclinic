import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/rolex'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Pre-Owned Rolex in Thailand 2025 | ChicPreowned'
      : 'Rolex มือสองในไทย 2025 — Submariner, Datejust, GMT | ChicPreowned',
    description: isEn
      ? 'Pre-owned Rolex prices in Thailand (THB). Submariner, GMT-Master II, Datejust, Daytona — sports models often above retail. Updated weekly.'
      : 'ราคา Rolex มือสองในไทย (บาท) Submariner, GMT-Master II, Datejust, Daytona — รุ่น sports มักราคาเกินของใหม่',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Are Rolex prices in Thailand higher or lower than other countries?',
    a: 'Rolex boutique retail prices in Thailand are set by the official Thai distributor and are broadly comparable to other Asian markets, though typically slightly higher than Swiss retail due to import duties and VAT. The pre-owned market in Bangkok is active and competitively priced — you can find grey market Rolex from reputable dealers at Bangkok\'s luxury malls (EmQuartier, ICONSIAM, Siam Paragon) or on established resale platforms.',
  },
  {
    q: 'Which Rolex models are above retail price in Thailand?',
    a: 'Sports steel Rolex models are above retail everywhere, including Thailand. The Submariner Date, GMT-Master II Pepsi/Batman, and Daytona in steel are the most premium. The Datejust and Oyster Perpetual are usually available at or slightly below retail from authorised dealers. Pre-owned sports Rolex in excellent condition trades 20–60% above Thai retail.',
  },
  {
    q: 'Where can I buy pre-owned Rolex in Thailand?',
    a: 'Reliable sources in Thailand: Vestiaire Collective (international authentication, ships to Thailand), authorized grey market dealers at EmQuartier and Siam Paragon luxury floors, and established watch dealers who specialise in pre-owned luxury watches. Avoid unknown sellers on Carousell Thailand for Rolex — sophisticated fakes are common. Always insist on authentication papers or have the watch checked by an authorised Rolex service centre.',
  },
  {
    q: 'Does Rolex hold value in Thailand long-term?',
    a: 'Yes — Rolex has consistently appreciated across all markets including Thailand. Sports models have shown 8–15% annual appreciation over the past decade in line with global trends. Even entry-level Datejust models from the 1980s–90s have multiplied in value. The key is condition and provenance — watch with original bracelet, box, and papers (warranty card) commands the strongest premiums.',
  },
]

const faqsTh = [
  {
    q: 'ราคา Rolex ในไทยสูงหรือต่ำกว่าประเทศอื่น?',
    a: 'ราคาปลีกบูติค Rolex ในไทยกำหนดโดยผู้จัดจำหน่ายอย่างเป็นทางการของไทยและใกล้เคียงกับตลาดเอเชียอื่นๆ แม้ว่าโดยทั่วไปจะสูงกว่าราคาสวิสเล็กน้อยเนื่องจากภาษีนำเข้าและ VAT ตลาดมือสองในกรุงเทพฯ มีความคึกคักและราคาแข่งขันดี — สามารถหาซื้อ Rolex grey market จากดีลเลอร์ที่น่าเชื่อถือที่ศูนย์การค้า luxury ในกรุงเทพฯ หรือบนแพลตฟอร์มขายต่อที่มีชื่อเสียง',
  },
  {
    q: 'Rolex รุ่นไหนในไทยราคาสูงกว่าของใหม่?',
    a: 'Rolex สเตนเลสสตีล sports models ราคาสูงกว่าของใหม่ทุกที่รวมถึงไทย Submariner Date, GMT-Master II Pepsi/Batman และ Daytona ในสเตนเลสสตีลเป็นรุ่นที่มีพรีเมียมมากที่สุด Datejust และ Oyster Perpetual มักหาได้ที่ราคาใหม่หรือต่ำกว่าเล็กน้อยจากดีลเลอร์อย่างเป็นทางการ Rolex sports มือสองสภาพดีเยี่ยมซื้อขายที่ 20–60% เหนือราคาปลีกไทย',
  },
  {
    q: 'ซื้อ Rolex มือสองได้ที่ไหนในไทย?',
    a: 'แหล่งที่น่าเชื่อถือในไทย: Vestiaire Collective (ตรวจสอบสากล ส่งมาไทยได้) ดีลเลอร์ grey market ที่ได้รับอนุญาตที่ชั้น luxury ของเอ็มควอเทียร์และสยามพารากอน และดีลเลอร์นาฬิกาที่ชำนาญในนาฬิกา luxury มือสอง หลีกเลี่ยงผู้ขายที่ไม่รู้จักบน Carousell ไทยสำหรับ Rolex — ของปลอมที่ซับซ้อนมีให้เห็นทั่วไป ควรยืนยันกระดาษรับรองเสมอหรือให้ศูนย์บริการ Rolex ที่ได้รับอนุญาตตรวจสอบ',
  },
  {
    q: 'Rolex รักษามูลค่าในไทยได้ในระยะยาวไหม?',
    a: 'ใช่ — Rolex แข็งค่าอย่างต่อเนื่องในทุกตลาดรวมถึงไทย รุ่น sports แสดงการแข็งค่าประจำปี 8–15% ตลอดทศวรรษที่ผ่านมาสอดคล้องกับแนวโน้มทั่วโลก แม้แต่ Datejust รุ่นเริ่มต้นจากช่วงทศวรรษ 1980–90 ก็มีมูลค่าเพิ่มขึ้นหลายเท่า กุญแจสำคัญคือสภาพและที่มา — นาฬิกาพร้อมสายเดิม กล่อง และกระดาษ (ใบรับประกัน) คือรุ่นที่มีพรีเมียมสูงที่สุด',
  },
]

export default async function RolexBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const faqs = isEn ? faqsEn : faqsTh

  const items = getItemsByBrand('rolex').filter(i => i.retail_price_thb > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: isEn ? 'Pre-Owned Rolex Price Guide Thailand 2025' : 'ราคา Rolex มือสองในไทย 2025',
          url: `${BASE}/${locale}/${SLUG}`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${locale}/${item.slug}`,
            name: isEn ? `Pre-Owned Rolex ${item.model}` : `Rolex ${item.model} มือสอง`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/watches`} className="hover:text-gray-800">{isEn ? 'Watches' : 'นาฬิกา'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Rolex</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? 'Pre-Owned Rolex in Thailand 2025' : 'Rolex มือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? `${items.length} references · sports models often above retail` : `${items.length} รุ่น · รุ่น sports มักราคาเกินของใหม่`}
      </p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 text-sm text-green-900">
        {isEn
          ? <><strong>Above-retail note:</strong> Rolex Submariner, GMT-Master II, and Daytona in stainless steel trade 20–60% above Thai retail on the grey market due to restricted supply and multi-year waitlists at authorised dealers.</>
          : <><strong>หมายเหตุราคาเกินของใหม่:</strong> Rolex Submariner, GMT-Master II และ Daytona ในสเตนเลสสตีลซื้อขายที่ 20–60% เหนือราคาปลีกไทยในตลาด grey market เนื่องจากอุปทานที่จำกัดและรายการรอที่ดีลเลอร์ที่ได้รับอนุญาตนานหลายปี</>
        }
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Price Table — Rolex Pre-Owned (THB)' : 'ตารางราคา Rolex มือสอง (บาท)'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Retail (THB)' : 'ราคาใหม่ (บาท)'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Excellent' : 'สภาพดีเยี่ยม'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Very Good' : 'สภาพดีมาก'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const ex = item.price_ranges?.excellent
                const vg = item.price_ranges?.very_good
                const retail = item.retail_price_thb
                const avg = ex ? (ex.min + ex.max) / 2 : vg ? (vg.min + vg.max) / 2 : null
                const aboveRetail = avg && retail && avg > retail * 1.05
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${locale}/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{item.model}</Link>
                      {aboveRetail && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{isEn ? 'Above Retail' : 'เกินราคาใหม่'}</span>}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">{formatPriceTHB(retail)}</td>
                    <td className="text-right py-3 px-4">{ex ? `${formatPriceTHB(ex.min)}–${formatPriceTHB(ex.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPriceTHB(vg.min)}–${formatPriceTHB(vg.max)}` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-4 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/rolex" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/rolex" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? 'Rolex vs Omega →' : 'Rolex vs Omega →'}
        </Link>
        <Link href={`/${locale}/watches`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? '← All Watches' : '← นาฬิกาทั้งหมด'}
        </Link>
      </div>
    </div>
  )
}
