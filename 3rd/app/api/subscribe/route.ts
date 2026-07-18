import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = (body as { email?: unknown } | null)?.email
  if (typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (redisUrl && redisToken) {
    try {
      await fetch(`${redisUrl}/sadd/subscribers/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${redisToken}` },
      })
    } catch {
      // Subscriber storage is best-effort; don't fail the request if Upstash is down.
    }
  }
  return NextResponse.json({ ok: true })
}
