import { PROFILE_SOURCE, type ClinicProfile as Profile } from '@/lib/hospitalProfiles'

/**
 * What this clinic's reviews add up to — measured, not copied.
 *
 * Numbers and labels only. No sentence here is generated: a template that says
 * "owners praise the explanations" on 667 pages with the numbers swapped is the
 * scaled content this site was demoted for, whoever or whatever writes it. A
 * number can be checked against the reviews; a templated sentence only looks
 * written.
 */

const LANG_TH: Record<string, string> = {
  en: 'อังกฤษ', 'en-GB': 'อังกฤษ', ru: 'รัสเซีย', ja: 'ญี่ปุ่น', 'zh-Hans': 'จีน',
  'zh-Hant': 'จีน', zh: 'จีน', 'zh-CN': 'จีน', de: 'เยอรมัน', ko: 'เกาหลี',
  fr: 'ฝรั่งเศส', nl: 'ดัตช์', it: 'อิตาลี', my: 'พม่า', fi: 'ฟินแลนด์', hu: 'ฮังการี',
}

const MONTHS_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
function thaiMonth(ym: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(ym)
  return m ? `${MONTHS_TH[Number(m[2]) - 1]} ${Number(m[1]) + 543}` : ''
}

function Bar({ label, n, of, tone }: { label: string; n: number; of: number; tone: 'good' | 'bad' }) {
  const pct = of ? Math.round((n / of) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-32 shrink-0 text-gray-700">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${tone === 'good' ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-20 shrink-0 text-right text-xs text-gray-500">{n}/{of} · {pct}%</span>
    </div>
  )
}

export default function ClinicProfile({ p, reviewUrl }: { p: Profile; reviewUrl?: string | null }) {
  const high = p.stars['5'] + p.stars['4']
  const praise = Object.values(p.praise).sort((a, b) => b.reviews - a.reviews)
  const complaints = Object.values(p.complaints).sort((a, b) => b.reviews - a.reviews)
  const foreignShare = p.languages.with_text ? p.languages.non_thai / p.languages.with_text : 0

  return (
    <section className="mb-4 bg-white border rounded-xl p-4">
      <h2 className="text-base font-bold text-gray-900 mb-1">รีวิว {p.read} รีวิวบอกอะไรเกี่ยวกับที่นี่</h2>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        ThailandPetHub อ่านและนับเอง จากรีวิว Google {p.read} รีวิวที่ Google จัดว่าเกี่ยวข้องที่สุด
        (ไม่ใช่ทุกรีวิว) — คำชมนับจากรีวิว 4–5 ดาว คำติจากรีวิว 1–3 ดาว
      </p>

      {/* The sample itself, so the reader can judge the percentages below. */}
      <div className="flex items-end gap-1 h-10 mb-1" aria-label="การกระจายดาวของรีวิวที่อ่าน">
        {(['5', '4', '3', '2', '1'] as const).map(s => {
          const n = p.stars[s]
          const h = p.read ? Math.max(2, Math.round((n / p.read) * 40)) : 2
          return (
            <div key={s} className="flex-1 flex flex-col items-center justify-end">
              <div className={`w-full rounded-t ${Number(s) >= 4 ? 'bg-emerald-300' : Number(s) === 3 ? 'bg-gray-300' : 'bg-amber-300'}`} style={{ height: h }} />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1 mb-4">
        {(['5', '4', '3', '2', '1'] as const).map(s => (
          <span key={s} className="flex-1 text-center text-[11px] text-gray-500">{s}★ {p.stars[s]}</span>
        ))}
      </div>

      {praise.length > 0 && high > 0 && (
        <div className="mb-4 space-y-1.5">
          <p className="text-xs font-semibold text-emerald-700">เจ้าของที่ให้ 4–5 ดาว ชมเรื่อง</p>
          {praise.map(t => <Bar key={t.en} label={t.th} n={t.reviews} of={high} tone="good" />)}
        </div>
      )}

      {complaints.length > 0 && p.low_star_reviews > 0 && (
        <div className="mb-4 space-y-1.5">
          <p className="text-xs font-semibold text-amber-700">เจ้าของที่ให้ 1–3 ดาว ติเรื่อง</p>
          {complaints.map(t => <Bar key={t.en} label={t.th} n={t.reviews} of={p.low_star_reviews} tone="bad" />)}
        </div>
      )}

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
        <div>
          <dt className="text-xs text-gray-400">คลินิกตอบรีวิว</dt>
          <dd className="text-gray-800">{p.replies.replied} จาก {p.read} รีวิว</dd>
        </div>
        {p.replies.negative > 0 && (
          <div>
            {/* The one reply that tells you how a clinic behaves when something
                went wrong. */}
            <dt className="text-xs text-gray-400">ตอบรีวิว 1–2 ดาว</dt>
            <dd className="text-gray-800">{p.replies.negative_replied} จาก {p.replies.negative} รีวิว</dd>
          </div>
        )}
        {p.trend && (
          <div>
            <dt className="text-xs text-gray-400">รีวิว 12 เดือนล่าสุด เทียบก่อนหน้า</dt>
            <dd className={p.trend.recent_avg > p.trend.older_avg ? 'text-emerald-700' : 'text-amber-700'}>
              {p.trend.recent_avg.toFixed(1)}★ ({p.trend.recent_n}) เทียบ {p.trend.older_avg.toFixed(1)}★ ({p.trend.older_n})
            </dd>
          </div>
        )}
        {foreignShare >= 0.1 && p.languages.non_thai >= 2 && (
          <div>
            <dt className="text-xs text-gray-400">รีวิวที่เขียนเป็นภาษาอื่น</dt>
            <dd className="text-gray-800">
              {Math.round(foreignShare * 100)}% ({p.languages.top.map(l => LANG_TH[l] ?? l).filter((v, i, a) => a.indexOf(v) === i).join(', ')})
            </dd>
          </div>
        )}
      </dl>

      {p.excerpts.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">ตัวอย่างสั้น ๆ จากรีวิว</p>
          <ul className="space-y-2.5">
            {p.excerpts.map((e, i) => (
              <li key={i} className="text-sm text-gray-600 leading-relaxed">
                <span className="text-amber-500 text-xs mr-1.5">{'★'.repeat(e.stars ?? 0)}</span>
                {e.when && <span className="text-xs text-gray-400 mr-1.5">{thaiMonth(e.when)}</span>}
                “{e.text}”
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-xs text-gray-400">วิเคราะห์โดย ThailandPetHub · ข้อมูลรีวิว {PROFILE_SOURCE.built}</span>
        {reviewUrl && (
          <a href={reviewUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">
            อ่านรีวิวทั้งหมดใน Google →
          </a>
        )}
      </div>
    </section>
  )
}
