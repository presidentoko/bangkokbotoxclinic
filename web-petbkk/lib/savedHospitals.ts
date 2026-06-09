const KEY = 'savedHospitals'

export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch { return [] }
}

export function toggleSaved(id: string): string[] {
  const ids = getSavedIds()
  const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  return next
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id)
}
