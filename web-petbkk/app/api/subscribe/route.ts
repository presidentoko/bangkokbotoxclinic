import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '8748533217:AAEeWF2hQ0lw_ezz3djk_d2NcbcDndXxvqM'
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID   ?? '8488265054'

export async function POST(req: NextRequest) {
  let email = ''
  try {
    const body = await req.json()
    email = (body.email ?? '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  if (!email || !email.includes('@') || email.length < 5) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }

  const text = `📧 *PetBKK Newsletter Subscriber*\n\nEmail: \`${email}\``

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
    })
  } catch {
    // non-fatal — still return ok to user
  }

  return NextResponse.json({ ok: true })
}
