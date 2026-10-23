import raw from '@/data/hospital-profiles.json'

/**
 * What a clinic's reviews add up to, computed by petvet/clinic_profile.py.
 *
 * This is the site's own content, not a copy of Google's. Until 2026-10-23 a
 * clinic page quoted up to twelve full reviews — 3,600 characters that existed
 * only as long as you did not compare them with Google Maps, where every one of
 * them already lives. These figures exist nowhere else: what share of happy
 * owners praise how the vet explains things, whether the clinic answers its one
 * star reviews, whether the last year's reviews are better than the earlier
 * ones, how many of its reviewers are foreign.
 *
 * Every number is "among the reviews read" — up to 30 per clinic, the ones
 * Google ranks most relevant — and the page says so. Praise is counted only
 * from 4-5 star reviews and complaints only from 1-3 star ones.
 */
export interface Theme { th: string; en: string; reviews: number }

export interface ClinicProfile {
  read: number
  low_star_reviews: number
  praise: Record<string, Theme>
  complaints: Record<string, Theme>
  replies: { replied: number; negative: number; negative_replied: number }
  languages: { with_text: number; non_thai: number; top: string[] }
  trend?: { recent_avg: number; recent_n: number; older_avg: number; older_n: number }
  stars: Record<'5' | '4' | '3' | '2' | '1', number>
  excerpts: Array<{ stars: number | null; when: string; text: string }>
}

const file = raw as { source: string; built: string; sample_note: string; hospitals: Record<string, ClinicProfile> }

export const PROFILE_SOURCE = { source: file.source, built: file.built, note: file.sample_note }

export function getProfile(hospitalId: string): ClinicProfile | null {
  return file.hospitals[hospitalId] ?? null
}

export function allProfiles(): Record<string, ClinicProfile> {
  return file.hospitals
}
