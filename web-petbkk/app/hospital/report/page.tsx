import type { Metadata } from 'next'
import report from '@/data/review-report.json'
import { loadHospitals, hospitalSlug } from '@/lib/hospitals'

/**
 * /hospital/report — what 19,022 reviews of Thai animal clinics say, read
 * together. Built from data/review-report.json (petvet/review_report.py).
 *
 * This is the page the rest of the clinic directory could not be: research, not
 * a listing. Every figure on it was counted by this site from the reviews, and
 * none of it exists on Google Maps, which shows reviews one clinic at a time and
 * never adds them up. The prose is written once, for this page, about these
 * numbers — it is not a template stamped across hundreds of URLs.
 */

const SITE = 'https://www.thailandpethub.com'
const R = report as typeof report

export const metadata: Metadata = {
  title: 'เจ้าของสัตว์เลี้ยง 19,022 รีวิว บอกอะไรเกี่ยวกับโรงพยาบาลสัตว์ในไทย',
  description:
    'วิเคราะห์รีวิว Google ของโรงพยาบาลและคลินิกสัตว์ 795 แห่งในกรุงเทพ เชียงใหม่ พัทยา ภูเก็ต: ' +
    'คลินิกตอบรีวิวแย่แค่ 19% · ที่ได้คะแนนสูงสุดไม่ได้ถูกชมว่าเก่งกว่า แต่ถูกชมว่าสะอาดกว่าเกือบ 2 เท่า',
  alternates: { canonical: `${SITE}/hospital/report` },
  openGraph: {
    title: 'เจ้าของสัตว์เลี้ยง 19,022 รีวิว บอกอะไรเกี่ยวกับโรงพยาบาลสัตว์ในไทย',
    description: 'คลินิกที่ได้คะแนนสูงสุดถูกชมเรื่องความสะอาดมากกว่าเกือบ 2 เท่า ไม่ใช่เรื่องฝีมือ',
    url: `${SITE}/hospital/report`,
  },
}

const CITY_TH: Record<string, string> = { bangkok: 'กรุงเทพ', chiangmai: 'เชียงใหม่', pattaya: 'พัทยา', phuket: 'ภูเก็ต' }
const LANG_TH: Record<string, string> = {
  en: 'อังกฤษ', ru: 'รัสเซีย', ja: 'ญี่ปุ่น', 'zh-Hans': 'จีน', 'zh-Hant': 'จีน', zh: 'จีน',
  de: 'เยอรมัน', ko: 'เกาหลี', fr: 'ฝรั่งเศส', nl: 'ดัตช์', it: 'อิตาลี', 'en-GB': 'อังกฤษ',
}

function pct(a: number, b: number) {
  return b ? Math.round((a / b) * 100) : 0
}

/** One series per chart, so no legend; the value is always printed as text. */
function HBars({ rows, of, tone }: { rows: Array<{ th: string; reviews: number; pct: number }>; of: string; tone: 'good' | 'bad' }) {
  const max = Math.max(...rows.map(r => r.pct), 1)
  return (
    <div className="space-y-2">
      {rows.map(r => (
        <div key={r.th} className="flex items-center gap-3 text-sm">
          <span className="w-36 shrink-0 text-gray-700">{r.th}</span>
          <div className="flex-1 h-3 bg-gray-100 rounded">
            <div
              className={`h-full rounded ${tone === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${(r.pct / max) * 100}%` }}
            />
          </div>
          <span className="w-28 shrink-0 text-right text-gray-600 tabular-nums">
            {r.pct.toFixed(1)}% <span className="text-xs text-gray-400">({r.reviews.toLocaleString()})</span>
          </span>
        </div>
      ))}
      <p className="text-xs text-gray-400 pt-1">ร้อยละของ{of}</p>
    </div>
  )
}

function Stat({ value, label, note }: { value: string; label: string; note: string }) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <p className="text-3xl font-black text-gray-900 tabular-nums">{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{note}</p>
    </div>
  )
}

export default function ReportPage() {
  const byId = new Map(loadHospitals().map(h => [h.id, h]))
  const s = R.sample
  const rp = R.replies
  const sep = R.separation
  const clean = sep.find(x => x.key === 'clean')!
  const skilled = sep.find(x => x.key === 'skilled')!

  const answerers = R.answerers.filter(a => byId.has(a.id))
  const expat = R.expat.filter(a => byId.has(a.id))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'เจ้าของสัตว์เลี้ยง 19,022 รีวิว บอกอะไรเกี่ยวกับโรงพยาบาลสัตว์ในไทย',
        datePublished: '2026-10-23',
        author: { '@type': 'Organization', name: 'ThailandPetHub', url: SITE },
        publisher: { '@type': 'Organization', name: 'ThailandPetHub', url: SITE },
        mainEntityOfPage: `${SITE}/hospital/report`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: `${SITE}/hospital` },
          { '@type': 'ListItem', position: 3, name: 'รายงานรีวิว' },
        ],
      },
    ],
  }

  return (
    <main className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">รายงานรีวิว</span>
      </nav>

      <p className="text-xs font-semibold text-orange-600 mb-2">รายงาน ThailandPetHub · ตุลาคม 2569</p>
      <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">
        เจ้าของสัตว์เลี้ยง {s.reviews.toLocaleString()} รีวิว บอกอะไรเกี่ยวกับโรงพยาบาลสัตว์ในไทย
      </h1>
      <p className="text-gray-600 leading-relaxed mb-8">
        Google Maps ให้อ่านรีวิวทีละคลินิก แต่ไม่เคยบอกว่ารีวิวทั้งหมดรวมกันแล้วพูดอะไร
        เราอ่านรีวิวของโรงพยาบาลและคลินิกสัตว์ {s.clinics.toLocaleString()} แห่งในกรุงเทพ เชียงใหม่
        พัทยา และภูเก็ต แล้วนับ — ใครถูกชมเรื่องอะไร ใครถูกติเรื่องอะไร และใครตอบเมื่อถูกติ
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <Stat
          value={`${pct(rp.negative_replied, rp.negative)}%`}
          label="ของรีวิว 1–2 ดาว ที่คลินิกตอบ"
          note={`${rp.negative_replied.toLocaleString()} จาก ${rp.negative.toLocaleString()} รีวิว`}
        />
        <Stat
          value={`${pct(rp.never, rp.clinics)}%`}
          label="ของคลินิก ไม่เคยตอบรีวิวเลย"
          note={`${rp.never} จาก ${rp.clinics} แห่งที่เราอ่านรีวิวครบ 10 รีวิวขึ้นไป`}
        />
        <Stat
          value={`${(clean.top / clean.low).toFixed(1)}×`}
          label="คลินิกคะแนนสูงสุด ถูกชมว่าสะอาด"
          note={`${clean.top}% เทียบ ${clean.low}% ในคลินิกคะแนนต่ำ`}
        />
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">คลินิกที่ดีที่สุดไม่ได้ถูกชมว่า “เก่งกว่า”</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          เราแบ่งคลินิกตามคะแนน Google แล้วดูว่าในรีวิว 4–5 ดาว เจ้าของชมเรื่องอะไร
          คำว่า “หมอเก่ง” ปรากฏในสัดส่วนเกือบเท่ากันทุกกลุ่ม ({skilled.top}%, {skilled.mid}%, {skilled.low}%)
          สิ่งที่ต่างชัดคือ <strong>ความสะอาด</strong> และ<strong>การใส่ใจกับการอธิบาย</strong> —
          สิ่งที่เจ้าของมองเห็นได้เอง ในขณะที่ฝีมือการรักษาเป็นสิ่งที่คนทั่วไปตัดสินไม่ได้
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-semibold p-2.5">ถูกชมเรื่อง (ในรีวิว 4–5 ดาว)</th>
                <th className="text-right font-semibold p-2.5">คะแนน 4.8+<br /><span className="font-normal">{R.bands.top} แห่ง</span></th>
                <th className="text-right font-semibold p-2.5">4.4–4.7<br /><span className="font-normal">{R.bands.mid} แห่ง</span></th>
                <th className="text-right font-semibold p-2.5">ต่ำกว่า 4.4<br /><span className="font-normal">{R.bands.low} แห่ง</span></th>
              </tr>
            </thead>
            <tbody>
              {[...sep].sort((a, b) => (b.top - b.low) - (a.top - a.low)).map(r => (
                <tr key={r.key} className="border-t">
                  <td className="p-2.5 text-gray-700">{r.th}</td>
                  <td className="p-2.5 text-right tabular-nums font-semibold text-gray-900">{r.top}%</td>
                  <td className="p-2.5 text-right tabular-nums text-gray-600">{r.mid}%</td>
                  <td className="p-2.5 text-right tabular-nums text-gray-600">{r.low}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">เจ้าของที่พอใจ ชมเรื่องอะไรบ่อยที่สุด</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          จากรีวิว 4–5 ดาว {s.high.toLocaleString()} รีวิว ความสะอาดและการใส่ใจถูกพูดถึงมากกว่าฝีมือการรักษาเกินสองเท่า
        </p>
        <HBars rows={R.praise} of={`รีวิว 4–5 ดาว ${s.high.toLocaleString()} รีวิว`} tone="good" />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">เจ้าของที่ไม่พอใจ ติเรื่องอะไร</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          ในรีวิว 1–3 ดาว {s.low.toLocaleString()} รีวิว เรื่องเงินมาก่อนเรื่องการรักษา —
          รองลงมาคือการพูดจาของพนักงาน ซึ่งเป็นสิ่งที่คลินิกแก้ได้โดยไม่ต้องลงทุนอะไรเลย
        </p>
        <HBars rows={R.complaints} of={`รีวิว 1–3 ดาว ${s.low.toLocaleString()} รีวิว`} tone="bad" />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">เมืองไหนตอบเมื่อถูกติ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-semibold p-2.5">เมือง</th>
                <th className="text-right font-semibold p-2.5">คลินิก</th>
                <th className="text-right font-semibold p-2.5">คะแนนกลาง</th>
                <th className="text-right font-semibold p-2.5">ตอบรีวิว 1–2 ดาว</th>
                <th className="text-right font-semibold p-2.5">รีวิวภาษาอื่น</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(R.cities).map(([c, v]) => (
                <tr key={c} className="border-t">
                  <td className="p-2.5 text-gray-700">{CITY_TH[c] ?? c}</td>
                  <td className="p-2.5 text-right tabular-nums text-gray-600">{v.clinics}</td>
                  <td className="p-2.5 text-right tabular-nums text-gray-600">{v.median_rating?.toFixed(1) ?? '—'}</td>
                  <td className="p-2.5 text-right tabular-nums font-semibold text-gray-900">{v.negative_replied}%</td>
                  <td className="p-2.5 text-right tabular-nums text-gray-600">{v.foreign_share}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {answerers.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2">คลินิกที่ตอบแม้ถูกติ</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            คลินิกที่ตอบรีวิว 1–2 ดาวอย่างน้อย 3 ใน 4 ครั้ง (มีรีวิวแย่อย่างน้อย 3 รีวิว) —
            การตอบไม่ได้แปลว่าถูก แต่บอกว่ามีคนรับฟังเมื่อมีปัญหา
          </p>
          <ul className="bg-white border rounded-2xl divide-y">
            {answerers.map(a => {
              const h = byId.get(a.id)!
              return (
                <li key={a.id} className="flex items-baseline justify-between gap-3 p-3">
                  <a href={`/hospital/${hospitalSlug(h)}`} className="font-semibold text-gray-900 hover:text-orange-600">{h.name_th || h.name_en}</a>
                  <span className="text-xs text-gray-500 shrink-0 tabular-nums">ตอบ {a.replied}/{a.of}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {expat.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2">คลินิกที่ชาวต่างชาติใช้บริการ</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            อย่างน้อยหนึ่งในสี่ของรีวิวเขียนเป็นภาษาอื่นที่ไม่ใช่ไทย — สัญญาณว่าคนที่ไม่พูดภาษาไทยไปใช้บริการและสื่อสารได้
          </p>
          <ul className="bg-white border rounded-2xl divide-y">
            {expat.map(a => {
              const h = byId.get(a.id)!
              const langs = a.langs.map(l => LANG_TH[l] ?? l).filter((v, i, x) => x.indexOf(v) === i).join(', ')
              return (
                <li key={a.id} className="flex items-baseline justify-between gap-3 p-3">
                  <a href={`/hospital/${hospitalSlug(h)}`} className="font-semibold text-gray-900 hover:text-orange-600">{h.name_th || h.name_en}</a>
                  <span className="text-xs text-gray-500 shrink-0 tabular-nums">{pct(a.non_thai, a.of)}% · {langs}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="bg-gray-50 border rounded-2xl p-5 mb-8 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-base font-bold text-gray-900 mb-2">วิธีการ และข้อจำกัด</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>รีวิว Google ของ {s.clinics} แห่ง สูงสุด 30 รีวิวต่อแห่ง เป็นรีวิวที่ Google จัดว่า “เกี่ยวข้องที่สุด” ไม่ใช่ทุกรีวิวและไม่ใช่การสุ่ม เก็บเมื่อ 16 ต.ค. 2569</li>
          <li>คำชมนับเฉพาะจากรีวิว 4–5 ดาว คำติเฉพาะจากรีวิว 1–3 ดาว เพราะในรีวิวแย่ คำชมมักใช้เปรียบเทียบ (“บอกว่าจะดูแลดี แต่…”)</li>
          <li>การจับคำภาษาไทยมีตัวป้องกันคำปฏิเสธ — “ราคาไม่แพง” ไม่ถูกนับเป็นคำติเรื่องราคา และตรวจตัวอย่างจริงทีละคำก่อนเผยแพร่</li>
          <li>ตัวเลขเป็นความสัมพันธ์ ไม่ใช่เหตุและผล: คลินิกคะแนนสูงถูกชมว่าสะอาดมากกว่า ไม่ได้พิสูจน์ว่าความสะอาดทำให้คะแนนสูง</li>
          <li>เราไม่เผยแพร่จำนวนรีวิวที่พูดถึงสัตว์เสียชีวิต — โรงพยาบาลฉุกเฉินรับเคสหนักที่สุด ตัวเลขนี้จึงไม่ได้วัดคุณภาพการรักษา</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700">← โรงพยาบาลสัตว์ทั้งหมด</a>
        <a href="/hospital/exotic" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50">🐰 รักษาสัตว์พิเศษ</a>
        <a href="/hospital/emergency" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50">🚨 ฉุกเฉิน</a>
      </div>
    </main>
  )
}
