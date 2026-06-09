import reviewsRaw from '@/data/petreviews.json'

export interface PantipThread {
  tid: string
  title: string
  url: string
  replies: number
  snippet: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

export interface EntityReview {
  mention_count: number
  positive_count: number
  negative_count: number
  positive_snippets: string[]
  negative_snippets: string[]
  threads: PantipThread[]
  updated_at: string
}

const reviews = reviewsRaw as {
  foods: Record<string, EntityReview>
  hospitals: Record<string, EntityReview>
}

export function getFoodReviews(foodId: string): EntityReview | null {
  return reviews.foods[foodId] ?? null
}

export function getHospitalReviews(hospitalId: string): EntityReview | null {
  return reviews.hospitals[hospitalId] ?? null
}
