'use server'

// Telegram's legacy "Markdown" parse mode rejects the whole message if any of
// these characters appear unescaped and don't form a valid entity — user
// input can contain them freely (e.g. "call me *ASAP*"), so escape before
// interpolating into a Markdown-formatted message.
function escapeMarkdown(text: string): string {
  return text.replace(/([_*`[])/g, '\\$1')
}

export async function sendContactMessage(formData: FormData) {
  const name = (formData.get('name') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const message = (formData.get('message') as string || '').trim()
  const type = (formData.get('type') as string || 'question').trim()

  if (!name || !message) return { ok: false, error: 'Name and message are required.' }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID
  if (!BOT_TOKEN || !CHAT_ID) return { ok: false, error: 'Server config error.' }

  const typeEmoji: Record<string, string> = { wrong_data: '⚠️', ad: '💰', collaboration: '🤝', question: '❓', other: '📝' }
  const emoji = typeEmoji[type] || '📩'
  const text = `${emoji} *SecondLuxuryItems.com* [${type.replace('_', ' ').toUpperCase()}]\n\n*Name:* ${escapeMarkdown(name)}\n*Email:* ${escapeMarkdown(email) || '–'}\n*Message:* ${escapeMarkdown(message)}`

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
    })
    const data = await res.json()
    if (!data.ok) return { ok: false, error: 'Failed to send. Please try again.' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}
