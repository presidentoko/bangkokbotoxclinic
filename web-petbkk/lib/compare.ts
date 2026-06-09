const KEY = 'compareIds'
const MAX = 3

export function getCompareIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch { return [] }
}

export function toggleCompare(id: string): string[] {
  const ids = getCompareIds()
  const next = ids.includes(id) ? ids.filter(x => x !== id) : ids.length < MAX ? [...ids, id] : ids
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  return next
}

export function clearCompare(): string[] {
  try { localStorage.removeItem(KEY) } catch {}
  return []
}
