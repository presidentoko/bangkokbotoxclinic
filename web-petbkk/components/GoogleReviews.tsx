import { REVIEW_SOURCE, type HospitalReviewSet } from '@/lib/hospitalReviews'

/**
 * What Google reviewers wrote about this clinic, in their own Thai.
 *
 * Deliberately plain: stars, the month, the words, and the clinic's reply when
 * it answered. No reviewer names — the scrape does not collect them — and so
 * no schema.org/Review markup either, since `author` is required there and
 * inventing one to win a rich result is the kind of thing that earns a
 * demotion. The aggregateRating on the page still comes from Google's own
 * rating and count.
 */

const MONTHS_TH = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
]

/** "ต.ค. 2569" — Buddhist era, which is what a Thai reader expects. */
function thaiMonth(iso: string | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return `${MONTHS_TH[d.getMonth()]} ${d.getFullYear() + 543}`
}

function Stars({ stars }: { stars: number | null }) {
  if (stars == null) return null
  const n = Math.max(0, Math.min(5, Math.round(stars)))
  return (
    <span className="text-amber-500 text-sm" aria-label={`${n} จาก 5 ดาว`}>
      {'★'.repeat(n)}
      <span className="text-gray-300">{'★'.repeat(5 - n)}</span>
    </span>
  )
}

// The fallback for clinics with fewer than ten reviews read, which have no
// profile. Same rule as everywhere else on the site since 2026-10-23: short
// excerpts as evidence, never whole reviews — Google already holds the full
// text, and republishing it is not content of ours.
const SHOWN = 3
const MAX_CHARS = 180
function shorten(t: string): string {
  const s = t.replace(/\s+/g, ' ').trim()
  if (s.length <= MAX_CHARS) return s
  const cut = s.lastIndexOf(' ', MAX_CHARS)
  return (cut > 60 ? s.slice(0, cut) : s.slice(0, MAX_CHARS)).replace(/[ ,.]+$/, '') + ' …'
}

export default function GoogleReviews({
  set,
  reviewUrl,
}: {
  set: HospitalReviewSet
  reviewUrl?: string | null
}) {
  const total = set.google_review_count
  return (
    <section className="mb-4 bg-white border rounded-xl p-4">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h2 className="text-base font-bold text-gray-900">รีวิวจากผู้ใช้ Google</h2>
        <span className="text-xs text-gray-400 shrink-0">
          {total
            ? `ตัวอย่าง ${Math.min(SHOWN, set.reviews.length)} จาก ${total.toLocaleString('th-TH')} รีวิว`
            : `ตัวอย่าง ${Math.min(SHOWN, set.reviews.length)} รีวิว`}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        ยกมาจากรีวิวภาษาไทยที่ผู้ใช้เขียนเอง ไม่ใช่คำแปลอัตโนมัติ
      </p>

      <ul className="space-y-4 divide-y divide-gray-100">
        {set.reviews.slice(0, SHOWN).map((r, i) => {
          const when = thaiMonth(r.when)
          return (
            <li key={r.id} className={i > 0 ? 'pt-4' : ''}>
              <div className="flex items-center gap-2 mb-1.5">
                <Stars stars={r.stars} />
                {when && <span className="text-xs text-gray-400">{when}</span>}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {shorten(r.text)}
              </p>
              {r.owner_reply && (
                <div className="mt-2 pl-3 border-l-2 border-orange-100">
                  <p className="text-xs font-semibold text-orange-700 mb-0.5">
                    คำตอบจากคลินิก
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {shorten(r.owner_reply)}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-xs text-gray-400">
          ที่มา: Google Maps · ข้อมูลวันที่ {REVIEW_SOURCE.retrieved}
        </span>
        {reviewUrl && (
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            อ่านรีวิวทั้งหมดใน Google →
          </a>
        )}
      </div>
    </section>
  )
}
