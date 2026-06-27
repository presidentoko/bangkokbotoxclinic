import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (redisUrl && redisToken) {
    await fetch(`${redisUrl}/sadd/subscribers/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${redisToken}` },
    })
  }
  return NextResponse.json({ ok: true })
}
