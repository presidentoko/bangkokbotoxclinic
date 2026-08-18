import VaccineCalculator from './VaccineCalculator'
import { DOG_VACCINES, CAT_VACCINES, type VaxItem } from './vaccines'

const SITE = 'https://www.thailandpethub.com'

/**
 * The whole route used to be one `'use client'` calculator that renders nothing
 * until a birth date is entered, so it prerendered to ~170 characters. But
 * "ตารางวัคซีนสุนัข" is a lookup query, and the schedule itself is static — it
 * does not depend on any particular pet's birthday. Rendering it server-side
 * gives the page a real answer for a crawler, an answer engine, and anyone who
 * just wants the standard schedule without filling in a form.
 *
 * Both tables read the same DOG_VACCINES / CAT_VACCINES arrays the calculator
 * uses, so the published schedule cannot drift from the computed one.
 */
function weeksLabel(weeks: number): string {
  if (weeks >= 52) {
    const years = weeks / 52
    return years === 1 ? '1 ปี' : `${years} ปี`
  }
  const months = weeks / 4.345
  return months >= 3 ? `${weeks} สัปดาห์ (~${months.toFixed(1)} เดือน)` : `${weeks} สัปดาห์`
}

function ScheduleTable({ title, vaccines }: { title: string; vaccines: VaxItem[] }) {
  const rows = [...vaccines].sort((a, b) => a.ageWeeks[0] - b.ageWeeks[0])
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-3">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-orange-50">
              <th scope="col" className="text-left px-3 py-2 font-semibold text-gray-700 rounded-l-lg whitespace-nowrap">อายุ</th>
              <th scope="col" className="text-left px-3 py-2 font-semibold text-gray-700">วัคซีน</th>
              <th scope="col" className="text-left px-3 py-2 font-semibold text-gray-700 rounded-r-lg">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(v => (
              <tr key={v.name} className="border-b border-gray-100 align-top">
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{weeksLabel(v.ageWeeks[0])}</td>
                <th scope="row" className="text-left px-3 py-2 font-medium text-gray-800">{v.name}</th>
                <td className="px-3 py-2 text-gray-600">
                  {v.note}
                  {v.recurring ? <span className="text-gray-400"> · กระตุ้นทุก {v.recurring} เดือน</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const FAQS: Array<[string, string]> = [
  [
    'ลูกสุนัขต้องฉีดวัคซีนเข็มแรกตอนอายุเท่าไหร่?',
    'ลูกสุนัขเริ่มวัคซีนรวม DHPPiL เข็มแรกได้ตั้งแต่อายุประมาณ 6 สัปดาห์ แล้วกระตุ้นอีก 2 ครั้งห่างกันครั้งละ 3–4 สัปดาห์ จนครบเมื่ออายุราว 14 สัปดาห์ ส่วนวัคซีนพิษสุนัขบ้าฉีดได้เมื่ออายุประมาณ 14 สัปดาห์ และต้องต่ออายุทุกปีตามกฎหมาย',
  ],
  [
    'ลูกแมวต้องฉีดวัคซีนอะไรบ้าง?',
    'ลูกแมวเริ่มวัคซีนรวม FVRCP (ไข้หวัดแมว คาลิซิไวรัส และแพนลูโคพีเนีย) เข็มแรกเมื่ออายุประมาณ 6 สัปดาห์ กระตุ้นอีก 2 ครั้งจนครบราว 14 สัปดาห์ แมวที่ออกนอกบ้านหรืออยู่รวมหลายตัวควรได้ FeLV เพิ่ม และวัคซีนพิษสุนัขบ้าเมื่ออายุประมาณ 14 สัปดาห์',
  ],
  [
    'วัคซีนสัตว์เลี้ยงต้องกระตุ้นบ่อยแค่ไหน?',
    'หลังชุดวัคซีนวัยเด็กครบแล้ว ให้กระตุ้นเข็มแรกเมื่ออายุ 1 ปี จากนั้นวัคซีนพิษสุนัขบ้ากระตุ้นทุกปี ส่วนวัคซีนรวมกระตุ้นทุก 1–3 ปีขึ้นอยู่กับชนิดวัคซีนและคำแนะนำของสัตวแพทย์',
  ],
  [
    'ถ้าฉีดวัคซีนช้ากว่ากำหนดต้องเริ่มใหม่ไหม?',
    'ส่วนใหญ่ไม่ต้องเริ่มนับหนึ่งใหม่ แต่ถ้าเว้นช่วงนานเกินไปสัตวแพทย์อาจให้ฉีดกระตุ้นเพิ่มเพื่อให้ภูมิคุ้มกันขึ้นครบ ควรพาไปพบสัตวแพทย์เพื่อประเมินเป็นรายตัว',
  ],
]

function VaccineJsonLd() {
  const graph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'ตารางวัคซีนสัตว์เลี้ยง' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

export default function VaccinePage() {
  return (
    <main className="max-w-2xl mx-auto">
      <VaccineJsonLd />
      <h1 className="text-2xl font-black text-gray-900 mb-1">💉 ตารางวัคซีนสุนัขและแมว</h1>
      <p className="text-sm text-gray-500 mb-6">
        ตารางวัคซีนมาตรฐานสำหรับลูกสุนัขและลูกแมว พร้อมเครื่องมือคำนวณวันครบกำหนดจากวันเกิดของน้อง
      </p>

      <VaccineCalculator />

      <div className="mt-10">
        <ScheduleTable title="ตารางวัคซีนสุนัข" vaccines={DOG_VACCINES} />
        <ScheduleTable title="ตารางวัคซีนแมว" vaccines={CAT_VACCINES} />
      </div>

      <section className="bg-white border rounded-2xl p-5 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">คำถามที่พบบ่อยเรื่องวัคซีนสัตว์เลี้ยง</h2>
        <div className="space-y-3 divide-y divide-gray-100">
          {FAQS.map(([q, a], i) => (
            <div key={q} className={i > 0 ? 'pt-3' : ''}>
              <h3 className="font-semibold text-sm text-gray-800 mb-1">{q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 leading-relaxed mb-6">
        ตารางนี้เป็นแนวทางมาตรฐานเพื่อการศึกษา ไม่ใช่คำแนะนำทางสัตวแพทย์
        กำหนดการจริงขึ้นอยู่กับชนิดวัคซีน สุขภาพ และประวัติของสัตว์เลี้ยงแต่ละตัว
        กรุณาปรึกษาสัตวแพทย์ก่อนเสมอ — <a href="/hospital" className="text-orange-600 hover:underline">ค้นหาโรงพยาบาลสัตว์ในกรุงเทพ</a>
      </p>
    </main>
  )
}
