import raw from '@/data/hospital-reviews.json'

/**
 * Google review text for a clinic page.
 *
 * Built by scripts/build_hospital_reviews.py from the 2026-10-16 Apify run.
 * Only reviews a Thai speaker actually wrote are in here: Google's machine
 * translations of non-Thai reviews are excluded on purpose, because publishing
 * one as a reviewer's quote would be putting generated text on a site that is
 * recovering from a quality demotion.
 *
 * No reviewer identity is collected or stored (the scrape ran with
 * personalData: false), so a review has stars, a date and words and nothing
 * else. That is also why none of this is marked up as schema.org/Review —
 * `author` is required there, and inventing one to win a rich result is
 * exactly the kind of thing that got this site demoted. The clinic's
 * aggregateRating, which comes from Google's own figures, stays as it was.
 */
export interface HospitalReview {
  id: string
  stars: number | null
  text: string
  when?: string
  /** The clinic's own reply, when it answered. */
  owner_reply?: string
}

export interface HospitalReviewSet {
  /** How many reviews this page quotes (the cap is 12). */
  quoted: number
  /** Characters of review text, as counted at build time. */
  chars: number
  /**
   * The clinic's full Google figures as read on the retrieval date — NOT an
   * average of the quoted subset. hospitals.json was last built 2026-08-18 and
   * 504 clinics' counts had moved by the time these were read.
   */
  google_rating?: number
  google_review_count?: number
  reviews: HospitalReview[]
}

const file = raw as {
  source: string
  retrieved: string
  note: string
  hospitals: Record<string, HospitalReviewSet>
}

export const REVIEW_SOURCE = {
  source: file.source,
  retrieved: file.retrieved,
}

export function getGoogleReviews(hospitalId: string): HospitalReviewSet | null {
  const set = file.hospitals[hospitalId]
  return set && set.reviews.length > 0 ? set : null
}

/** Clinics with at least one quotable review. 753 of 854 published. */
export function reviewedClinicCount(): number {
  return Object.keys(file.hospitals).length
}
