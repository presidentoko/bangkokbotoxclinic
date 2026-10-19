import type { ClinicSignals, Signal } from '@/lib/hospitalSignals'

/**
 * "What owners say they brought here, and what was done."
 *
 * Counted from this clinic's own Thai reviews (petvet/review_signals.py). The
 * wording is deliberately reportorial — "N owners mention X" — because that is
 * what the data supports. The clinic has not told us it does X, and an absent
 * line means nobody wrote about it, not that the clinic refuses it.
 */

const ANIMAL_ICON: Record<string, string> = {
  cat: '🐱', dog: '🐶', rabbit: '🐰', rodent: '🐹',
  bird: '🦜', reptile: '🦎', sugarglider: '🐿️', exotic: '✨',
}
const SERVICE_ICON: Record<string, string> = {
  neuter: '✂️', vaccine: '💉', surgery: '🏥', dental: '🦷', imaging: '📷',
  labtest: '🩸', admit: '🛏️', emergency: '🚨', grooming: '🛁',
}

/** Cats and dogs are on 90% of clinics; they carry no information. */
const COMMON = new Set(['cat', 'dog'])

function Chip({ icon, s }: { icon: string; s: Signal }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs">
      <span>{icon}</span>
      <span className="font-semibold text-gray-700">{s.label_th}</span>
      <span className="text-gray-400">{s.count}</span>
    </span>
  )
}

export default function OwnerReports({ signals }: { signals: ClinicSignals }) {
  const animals = Object.entries(signals.animals ?? {})
  const services = Object.entries(signals.services ?? {})
  const complaints = Object.entries(signals.complaints ?? {})
  if (animals.length === 0 && services.length === 0) return null

  const special = animals.filter(([k]) => !COMMON.has(k))
  const common = animals.filter(([k]) => COMMON.has(k))

  // The most-cited quote on the page, so the section shows evidence and not
  // only arithmetic.
  const quoted = [...special, ...services, ...common]
    .map(([, s]) => s)
    .find(s => s.quotes.length > 0)

  return (
    <section className="mb-4 bg-white border rounded-xl p-4">
      <h2 className="text-base font-bold text-gray-900 mb-1">
        เจ้าของสัตว์เลี้ยงเล่าถึงอะไรบ้าง
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        นับจากรีวิวภาษาไทยของที่นี่ — ตัวเลขคือจำนวนรีวิวที่พูดถึง ไม่ใช่รายการบริการที่คลินิกประกาศ
      </p>

      {special.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-orange-700 mb-1.5">สัตว์พิเศษที่มีคนพามา</p>
          <div className="flex flex-wrap gap-1.5">
            {special.map(([k, s]) => <Chip key={k} icon={ANIMAL_ICON[k] ?? '•'} s={s} />)}
          </div>
        </div>
      )}

      {services.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">สิ่งที่มีคนเล่าว่าได้รับบริการ</p>
          <div className="flex flex-wrap gap-1.5">
            {services.map(([k, s]) => <Chip key={k} icon={SERVICE_ICON[k] ?? '•'} s={s} />)}
          </div>
        </div>
      )}

      {common.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {common.map(([k, s]) => <Chip key={k} icon={ANIMAL_ICON[k] ?? '•'} s={s} />)}
          </div>
        </div>
      )}

      {complaints.length > 0 && (
        <div className="mb-3">
          {/* Shown because a directory that only prints praise is advertising.
              The bar is higher than for the rest: three or more mentions, and
              only from reviews rated three stars or lower. */}
          <p className="text-xs font-semibold text-gray-500 mb-1.5">
            สิ่งที่มีคนติ (จากรีวิว 1–3 ดาว)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {complaints.map(([k, s]) => (
              <span key={k} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs">
                <span className="font-semibold text-amber-800">{s.label_th}</span>
                <span className="text-amber-500">{s.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {quoted && (
        <blockquote className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
          <span className="text-gray-300 mr-1">“</span>
          {quoted.quotes[0]}
          <span className="text-gray-300 ml-1">”</span>
        </blockquote>
      )}
    </section>
  )
}
