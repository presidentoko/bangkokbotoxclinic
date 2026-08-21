import hoursData from '../data/hospital-hours.json'

/**
 * Opening hours for 442 of the 496 clinics.
 *
 * These live in their own file rather than in hospitals.json because
 * `lib/hospitals.ts` is imported by a `'use client'` component — anything added
 * there is downloaded by every visitor. Hours are only rendered on the
 * statically built detail page, so importing them from a server component keeps
 * them out of the browser bundle entirely.
 */

export interface HourSpec {
  day: string
  opens?: string
  closes?: string
  closed?: boolean
}

export interface HospitalHours {
  /** Human-readable lines exactly as Google returned them, in Thai. */
  text: string[]
  /** One row per opening range, for schema.org openingHoursSpecification. */
  spec: HourSpec[]
}

const HOURS = hoursData as Record<string, HospitalHours>

export function getHours(hospitalId: string): HospitalHours | null {
  const h = HOURS[hospitalId]
  return h && h.text.length > 0 ? h : null
}

/** True when the clinic is open every day, around the clock. */
export function isAlwaysOpen(hours: HospitalHours): boolean {
  const open = hours.spec.filter(s => s.opens === '00:00' && s.closes === '23:59')
  return open.length >= 7
}

/**
 * A one-line summary for meta descriptions and answer engines.
 *
 * Collapses consecutive days that share the same hours, so a clinic open
 * 08:00–20:00 on weekdays reads as one clause instead of five.
 */
const DAY_TH: Record<string, string> = {
  Monday: 'จ.', Tuesday: 'อ.', Wednesday: 'พ.', Thursday: 'พฤ.',
  Friday: 'ศ.', Saturday: 'ส.', Sunday: 'อา.',
}
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function summarizeHours(hours: HospitalHours): string {
  if (isAlwaysOpen(hours)) return 'เปิด 24 ชั่วโมง ทุกวัน'

  // Group each day's ranges into a single comparable signature.
  const byDay = new Map<string, string>()
  for (const day of DAY_ORDER) {
    const rows = hours.spec.filter(s => s.day === day)
    if (rows.length === 0) continue
    byDay.set(
      day,
      rows.every(r => r.closed)
        ? 'ปิด'
        : rows.filter(r => !r.closed).map(r => `${r.opens}–${r.closes}`).join(', '),
    )
  }
  if (byDay.size === 0) return ''

  const runs: { days: string[]; label: string }[] = []
  for (const day of DAY_ORDER) {
    const label = byDay.get(day)
    if (!label) continue
    const last = runs[runs.length - 1]
    if (last && last.label === label) last.days.push(day)
    else runs.push({ days: [day], label })
  }

  return runs
    .map(r => {
      const days = r.days.length > 1
        ? `${DAY_TH[r.days[0]]}–${DAY_TH[r.days[r.days.length - 1]]}`
        : DAY_TH[r.days[0]]
      return `${days} ${r.label}`
    })
    .join(' · ')
}

/** schema.org OpeningHoursSpecification rows, ready to embed. */
export function toSchemaHours(hours: HospitalHours) {
  return hours.spec
    .filter(s => !s.closed && s.opens && s.closes)
    .map(s => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${s.day}`,
      opens: s.opens,
      closes: s.closes,
    }))
}
