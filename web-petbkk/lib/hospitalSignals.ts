import raw from '@/data/hospital-signals.json'

/**
 * What owners report at a clinic, counted from their own Thai reviews.
 *
 * Built by petvet/review_signals.py over the 16,308 Thai reviews collected on
 * 2026-10-16. This is the one thing this directory knows that Google Maps does
 * not surface and no competitor has: not "what the clinic advertises" but what
 * the people who went there say they brought and what was done.
 *
 * It exists because the dataset could not answer the question. `has_surgery` is
 * hardcoded true for all 980 records in petvet/transform.py, `has_emergency` is
 * nearly empty, and every price field is null — so "which vet near me will see
 * a rabbit" had no answer on the site at all.
 *
 * WHAT THE SITE MAY SAY WITH THIS
 *
 * A count of reviews, never a claim about the business. "8 owners mention
 * rabbits" is supported by the data; "this clinic treats rabbits" is not — the
 * clinic may have stopped, or the reviewer may have been turned away. Every
 * render therefore keeps the number and the owner's own words next to each
 * other, and the copy is phrased as reporting, not as a service listing.
 *
 * The same rule that governs licences applies here: an absent signal is not
 * evidence of absence. A clinic with no rabbit mentions is a clinic nobody
 * wrote about bringing a rabbit to, which is not the same as one that refuses
 * rabbits, and nothing on the site may imply otherwise.
 */
export interface Signal {
  label_th: string
  label_en: string
  /** Reviews mentioning it. Complaints are counted only from 1-3 star reviews. */
  count: number
  /** The owners' own words, longest first, at most two. */
  quotes: string[]
}

export interface ClinicSignals {
  animals?: Record<string, Signal>
  services?: Record<string, Signal>
  complaints?: Record<string, Signal>
}

const file = raw as {
  source: string
  built: string
  method: string
  hospitals: Record<string, ClinicSignals>
}

export const SIGNAL_SOURCE = { source: file.source, built: file.built, method: file.method }

export function getSignals(hospitalId: string): ClinicSignals | null {
  return file.hospitals[hospitalId] ?? null
}

/**
 * The animals that are worth telling someone about.
 *
 * Cats and dogs are left out on purpose: 574 and 462 of the 629 clinics with
 * any signal have them, so saying so carries no information and would bury the
 * line that does. These six are what an owner cannot easily find.
 */
export const SPECIAL_ANIMALS = ['rabbit', 'rodent', 'bird', 'reptile', 'sugarglider', 'exotic'] as const

export interface SpecialPetClinic {
  id: string
  /** Total review mentions across the special animals. */
  mentions: number
  /** Which special animals, most-mentioned first. */
  kinds: Array<{ key: string; signal: Signal }>
}

let specialCache: SpecialPetClinic[] | null = null

/**
 * Every clinic an owner has written about bringing a rabbit, rodent, bird,
 * reptile or sugar glider to. 103 clinics as of the 2026-10-16 run.
 *
 * Ordered by how many different kinds were mentioned and then by volume: a
 * clinic four owners wrote about across four species is a better answer to
 * "who sees exotics" than one with eight mentions of the same rabbit.
 */
export function specialPetClinics(): SpecialPetClinic[] {
  if (specialCache) return specialCache
  const out: SpecialPetClinic[] = []
  for (const [id, rec] of Object.entries(file.hospitals)) {
    const animals = rec.animals
    if (!animals) continue
    const kinds = SPECIAL_ANIMALS
      .filter(k => animals[k])
      .map(k => ({ key: k as string, signal: animals[k] }))
      .sort((a, b) => b.signal.count - a.signal.count)
    if (kinds.length === 0) continue
    out.push({ id, kinds, mentions: kinds.reduce((n, k) => n + k.signal.count, 0) })
  }
  out.sort((a, b) => b.kinds.length - a.kinds.length || b.mentions - a.mentions)
  specialCache = out
  return out
}

/** Clinic ids with evidence for one particular animal. */
export function clinicsForAnimal(key: string): SpecialPetClinic[] {
  return specialPetClinics().filter(c => c.kinds.some(k => k.key === key))
}
