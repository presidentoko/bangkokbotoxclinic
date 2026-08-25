import { NextRequest, NextResponse } from 'next/server'

/**
 * Collect an email address — and actually keep it.
 *
 * This route used to write to Upstash when `UPSTASH_REDIS_REST_URL` and
 * `UPSTASH_REDIS_REST_TOKEN` were set, and to return `{ ok: true }` when they
 * were not. Neither variable has ever been set on this project (the only env
 * vars it carries are the Telegram pair), so every address anyone submitted
 * was discarded while the form answered "You're on the list ✓".
 *
 * Telegram is the delivery channel that demonstrably works here — the contact
 * form already uses it and the owner reads it — so signups go there, and the
 * response now reflects whether the address was actually kept. Upstash is
 * still tried first if it is ever configured.
 *
 * Note for whoever picks this up: storing the address is not the same as
 * having something that sends. There is no scheduled mail job on this site,
 * so the copy on EmailCapture deliberately promises only that we have the
 * address, not that an automated alert will arrive.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = (body as { email?: unknown } | null)?.email
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  let stored = false

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/sadd/subscribers/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${redisToken}` },
      })
      stored = res.ok
    } catch {
      // Fall through to Telegram rather than losing the address.
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!stored && botToken && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `chicpreowned — price update signup\n${email}`,
          disable_web_page_preview: true,
        }),
      })
      stored = res.ok
    } catch {
      stored = false
    }
  }

  // Say which of the two happened. Reporting success on a dropped address is
  // the bug this route existed in for its whole life.
  if (!stored) {
    return NextResponse.json(
      { error: 'Could not save your address right now' },
      { status: 503 }
    )
  }
  return NextResponse.json({ ok: true })
}
