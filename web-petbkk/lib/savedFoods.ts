const KEY = 'savedFoods'

export function getSavedFoodIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch { return [] }
}

export function toggleSavedFood(id: string): string[] {
  const ids = getSavedFoodIds()
  const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  return next
}

export function isFoodSaved(id: string): boolean {
  return getSavedFoodIds().includes(id)
}
