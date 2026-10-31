import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'
import data from '@/data/pet-insurance.json'

/**
 * /insurance — every pet insurance plan we could confirm on the insurer's own
 * website, side by side.
 *
 * Until 2026-10-31 this page said "1,500–5,000 บาท/ปี", "ผ่าตัดฉุกเฉิน
 * 30,000–100,000 บาท", that AIA, Muang Thai Life and Tokio Marine sell pet
 * cover, and that premium plans cover chronic disease and neutering. None of it
 * had a source, and the insurers named are not the ones that sell it: the
 * products that exist start at 629 baht, are sold by Muang Thai Insurance,
 * Dhipaya and Falcon, and none lists surgery, chronic disease or neutering as a
 * benefit. Figures now come only from data/pet-insurance.json, which records
 * the page each one was read from.
 */

interface Plan {
  plan: string
  premium: number
  premium_alt?: number
  accident: string
  illness: string
  tpl: string
}
interface Product {
  insurer: string
  insurer_en: string
  product: string
  url: string
  species: string | null
  entry_age: string | null
  waiting: string | null
  exclusions: string | null
  notes: string | null
  plans: Plan[]
}

const file = data as { checked: string; products: Product[] }
const PRODUCTS = file.products
const ALL_PLANS = PRODUCTS.flatMap(p => p.plans)
const MIN_PREMIUM = Math.min(...ALL_PLANS.map(p => p.premium))
const MAX_PREMIUM = Math.max(...ALL_PLANS.map(p => p.premium))
const INSURERS = [...new Set(PRODUCTS.map(p => p.insurer))]

function thaiDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${Number(m[1]) + 543}`
}

const baht = (n: number) => n.toLocaleString('th-TH')

export const metadata: Metadata = {
  title: `ประกันสัตว์เลี้ยง เปรียบเทียบ ${ALL_PLANS.length} แผน — เบี้ย ${baht(MIN_PREMIUM)}–${baht(MAX_PREMIUM)} บาท/ปี`,
  description:
    `เทียบประกันสุนัขและแมวจาก ${INSURERS.join(' ')} ทุกแผนที่ยืนยันได้จากเว็บไซต์บริษัทประกัน ` +
    'เบี้ยต่อปี วงเงินอุบัติเหตุ เจ็บป่วย ความรับผิดต่อบุคคลภายนอก อายุที่รับ และระยะรอคอย',
  alternates: { canonical: 'https://www.thailandpethub.com/insurance' },
  openGraph: {
    title: `ประกันสัตว์เลี้ยง เปรียบเทียบ ${ALL_PLANS.length} แผน`,
    description: `เบี้ย ${baht(MIN_PREMIUM)}–${baht(MAX_PREMIUM)} บาท/ปี จากเว็บไซต์บริษัทประกันโดยตรง`,
    url: 'https://www.thailandpethub.com/insurance',
  },
}

const FAQ = [
  {
    q: 'ประกันสัตว์เลี้ยงในไทยมีบริษัทไหนบ้าง?',
    a: `ที่เรายืนยันได้จากเว็บไซต์บริษัทเอง ณ ${thaiDate(file.checked)} มี ${PRODUCTS.length} ผลิตภัณฑ์จาก ${INSURERS.join(' ')} บางบริษัทให้ความคุ้มครองสัตว์เลี้ยงเป็นสิทธิพิเศษของประกันรถหรือประกันบ้านเท่านั้น ไม่ได้ขายแยก`,
  },
  {
    q: 'ประกันสัตว์เลี้ยงราคาเท่าไหร่?',
    a: `เบี้ยต่อปีตั้งแต่ ${baht(MIN_PREMIUM)} ถึง ${baht(MAX_PREMIUM)} บาท แผนถูกที่สุดส่วนใหญ่คุ้มครองแค่อุบัติเหตุและความรับผิดต่อบุคคลภายนอก ไม่คุ้มครองการเจ็บป่วย`,
  },
  {
    q: 'ประกันสัตว์เลี้ยงคุ้มครองการผ่าตัดไหม?',
    a: 'ไม่มีผลิตภัณฑ์ใดในตารางนี้ระบุค่าผ่าตัดเป็นความคุ้มครองแยก ค่ารักษาจะจ่ายภายใต้วงเงินอุบัติเหตุหรือเจ็บป่วยต่อครั้งเท่านั้น ซึ่งอยู่ระหว่าง 500 ถึง 30,000 บาทต่อครั้งแล้วแต่แผน',
  },
  {
    q: 'ทำประกันสัตว์เลี้ยงได้ถึงอายุเท่าไหร่?',
    a: 'ส่วนใหญ่รับสัตว์แรกเข้าอายุ 3 เดือนถึง 7 ปี และต่ออายุได้ถึง 10 ปี ทิพยรับแรกเข้าถึง 9 ปี โดยอายุ 8–9 ปีต้องตรวจสุขภาพ',
  },
]

export default function InsurancePage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <main className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ประกันสัตว์เลี้ยง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🛡️ ประกันสัตว์เลี้ยง: เทียบทุกแผนที่ขายจริง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2">
        {ALL_PLANS.length} แผนจาก {PRODUCTS.length} ผลิตภัณฑ์ ({INSURERS.join(' · ')}) เบี้ยตั้งแต่{' '}
        <strong>{baht(MIN_PREMIUM)} ถึง {baht(MAX_PREMIUM)} บาทต่อปี</strong>
      </p>
      <p className="text-gray-500 text-xs leading-relaxed mb-6">
        ทุกตัวเลขอ่านจากเว็บไซต์หรือโบรชัวร์ของบริษัทประกันเอง ตรวจสอบเมื่อ {thaiDate(file.checked)} · เงื่อนไขจริงอยู่ในกรมธรรม์ ควรอ่านก่อนซื้อ
      </p>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 text-sm text-amber-900 leading-relaxed">
        <strong>ดูวงเงินต่อครั้ง ไม่ใช่แค่เบี้ย</strong> — แผนถูกส่วนใหญ่จ่ายค่าเจ็บป่วยครั้งละ 500–1,000 บาท
        และแผนเริ่มต้นของเมืองไทย Pet Chill กับทิพย XS ไม่คุ้มครองการเจ็บป่วยเลย คุ้มครองแค่อุบัติเหตุและความเสียหายต่อคนอื่น
      </div>

      {PRODUCTS.map(p => (
        <section key={p.product} className="bg-white rounded-2xl border p-5 mb-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <h2 className="font-black text-gray-900 text-lg">{p.insurer} · {p.product}</h2>
            <a href={p.url} target="_blank" rel="noopener nofollow" className="text-xs text-blue-600 hover:underline">หน้าผลิตภัณฑ์ ↗</a>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {[p.species, p.entry_age && `อายุแรกเข้า ${p.entry_age}`].filter(Boolean).join(' · ')}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="pb-2 pr-3 font-medium">แผน</th>
                  <th className="pb-2 pr-3 font-medium">เบี้ย/ปี</th>
                  <th className="pb-2 pr-3 font-medium">อุบัติเหตุ</th>
                  <th className="pb-2 pr-3 font-medium">เจ็บป่วย</th>
                  <th className="pb-2 font-medium">บุคคลภายนอก</th>
                </tr>
              </thead>
              <tbody>
                {p.plans.map(pl => (
                  <tr key={pl.plan} className="border-t border-gray-100 align-top">
                    <td className="py-2 pr-3 font-semibold whitespace-nowrap">{pl.plan}</td>
                    <td className="py-2 pr-3 tabular-nums whitespace-nowrap font-bold">
                      {baht(pl.premium)}
                      {pl.premium_alt && <span className="block text-xs font-normal text-gray-400">({baht(pl.premium_alt)})</span>}
                    </td>
                    <td className="py-2 pr-3 text-xs text-gray-700">{pl.accident}</td>
                    <td className={`py-2 pr-3 text-xs ${pl.illness === 'ไม่คุ้มครอง' ? 'text-red-600' : 'text-gray-700'}`}>{pl.illness}</td>
                    <td className="py-2 text-xs text-gray-700">{pl.tpl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(p.notes || p.waiting || p.exclusions) && (
            <ul className="text-xs text-gray-500 mt-3 space-y-1">
              {p.notes && <li>• {p.notes}</li>}
              {p.waiting && <li>• ระยะรอคอย: {p.waiting}</li>}
              {p.exclusions && <li>• ไม่คุ้มครอง: {p.exclusions}</li>}
            </ul>
          )}
        </section>
      ))}

      <section className="bg-white rounded-2xl border p-5 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-2">ค่ารักษาจริงเทียบกับวงเงิน</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          ราคาที่โรงพยาบาลสัตว์ประกาศเอง เช่น ทำหมัน วัคซีน และแพ็กเกจตรวจสุขภาพ ดูได้ที่{' '}
          <a href="/hospital/prices" className="text-blue-600 hover:underline">หน้าเทียบราคาโรงพยาบาลสัตว์</a>{' '}
          ใช้เทียบกับวงเงินต่อครั้งของแต่ละแผนได้ ทั้งนี้ทำหมันและวัคซีนเป็นค่าใช้จ่ายตามปกติ ไม่ใช่อุบัติเหตุหรือเจ็บป่วย
          จึงไม่อยู่ในความคุ้มครองของแผนใดในตารางนี้
        </p>
      </section>

      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {FAQ.map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border rounded-2xl p-5 mb-6 text-xs text-gray-500 leading-relaxed">
        <h2 className="text-sm font-bold text-gray-800 mb-2">บริษัทที่ไม่อยู่ในตาราง</h2>
        <p>
          ไทยวิวัฒน์ขายผ่านเว็บไซต์ของโบรกเกอร์ ไม่มีราคาปัจจุบันบนเว็บไซต์บริษัท · กรุงเทพประกันภัย MSIG และ AXA
          ให้ความคุ้มครองสัตว์เลี้ยงเป็นส่วนเสริมของประกันรถหรือบ้าน ไม่ได้ขายแยก · วิริยะและอลิอันซ์ เราเปิดเว็บไซต์ตรวจสอบไม่ได้
          · ซันเดย์ขายแผนของทิพยประกันภัย · เราไม่ได้รับค่าตอบแทนจากบริษัทประกันใด
        </p>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital/prices" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏷️ ราคาโรงพยาบาลสัตว์</a>
        <a href="/cost" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💰 คำนวณค่าใช้จ่าย</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 หาโรงพยาบาลสัตว์</a>
      </div>

      <RelatedGuides current="insurance" count={4} />
    </main>
  )
}
