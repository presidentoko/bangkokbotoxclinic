// In-memory per-IP rate limiter for API routes. Resets on cold start and isn't
// shared across serverless instances — not a substitute for a real store like
// Upstash, but it's enough to blunt a burst of bot POSTs against a single warm
// instance without adding a new infra dependency for a low-traffic form.
const hits = new Map<string, number[]>()

export function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = (hits.get(ip) ?? []).filter(t => now - t < windowMs)
  timestamps.push(now)
  hits.set(ip, timestamps)

  // Bound memory: drop old IPs once the map gets large.
  if (hits.size > 5000) {
    for (const [key, ts] of hits) {
      if (ts.every(t => now - t > windowMs)) hits.delete(key)
    }
  }

  return timestamps.length > limit
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}
