import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '8748533217:AAEeWF2hQ0lw_ezz3djk_d2NcbcDndXxvqM'
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID   ?? '8488265054'

export async function POST(req: NextRequest) {
  const { name, topic, message } = await req.json()

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return NextResponse.json({ error: 'message too short' }, { status: 400 })
  }

  const text = [
    `📬 *ThailandPetHub Contact*`,
    ``,
    topic  ? `🏷 ${topic}` : null,
    name   ? `👤 ${name.trim()}` : null,
    ``,
    message.trim(),
  ].filter(l => l !== null).join('\n')

  try {
    const r = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
      }
    )
    const result = await r.json()
    if (!result.ok) throw new Error(result.description ?? 'telegram error')
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Telegram error:', e)
    return NextResponse.json({ error: 'send failed' }, { status: 502 })
  }
}
