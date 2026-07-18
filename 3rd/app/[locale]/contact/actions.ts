'use server'

// Telegram's legacy Markdown parse_mode rejects the whole message if these
// characters appear unescaped and don't form a valid entity (e.g. a lone "*"
// or "_" in someone's name or message). Escape them in user-supplied text so
// ordinary punctuation doesn't silently break delivery.
function escapeMarkdown(s: string): string {
  return s.replace(/([_*`[])/g, '\\$1')
}

export async function sendContactMessage(formData: FormData) {
  const name = (formData.get('name') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const message = (formData.get('message') as string || '').trim()
  const locale = (formData.get('locale') as string || 'en').trim()
  const type = (formData.get('type') as string || 'question').trim()

  if (!name || !message) return { ok: false, error: locale === 'th' ? 'กรุณากรอกชื่อและข้อความ' : 'Name and message are required.' }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID
  if (!BOT_TOKEN || !CHAT_ID) return { ok: false, error: 'Server config error.' }

  const typeEmoji: Record<string, string> = { wrong_data: '⚠️', ad: '💰', collaboration: '🤝', question: '❓', other: '📝' }
  const emoji = typeEmoji[type] || '📩'
  const safeType = escapeMarkdown(type.replace('_', ' ').toUpperCase())
  const safeLocale = escapeMarkdown(locale.toUpperCase())
  const safeName = escapeMarkdown(name)
  const safeEmail = escapeMarkdown(email || '–')
  const safeMessage = escapeMarkdown(message)
  const text = `${emoji} *ChicPreowned.com* [${safeType}] (${safeLocale})\n\n*Name:* ${safeName}\n*Email:* ${safeEmail}\n*Message:* ${safeMessage}`

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
    })
    const data = await res.json()
    if (!data.ok) return { ok: false, error: locale === 'th' ? 'ส่งไม่สำเร็จ กรุณาลองใหม่' : 'Failed to send. Please try again.' }
    return { ok: true }
  } catch {
    return { ok: false, error: locale === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'Network error. Please try again.' }
  }
}
