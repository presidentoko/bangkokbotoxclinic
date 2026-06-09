const KEY = 'recentFoods'
const MAX = 6

export function getRecentFoodIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function addRecentFood(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const ids = getRecentFoodIds().filter(x => x !== id)
    const next = [id, ...ids].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // ignore localStorage errors
  }
}
