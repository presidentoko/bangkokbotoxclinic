import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, getClientIp } from '@/lib/rateLimit'

// ⚠️ 토큰을 이 파일에 적지 말 것.
// 2026-08-21 확인: 여기 하드코딩돼 있던 봇 토큰이 public GitHub 레포
// (presidentoko/bangkokbotoxclinic) 에 그대로 올라가 탈취됐다 — 공격자가 봇 이름을
// "BEST CASINO MINI-APP", description 을 크립토 광고로 바꿔놓은 것을 API 로 확인했다.
// 같은 토큰을 8개 프로젝트가 공유하고 있었고, 유출 경로는 여기와 web-factory 두 곳이었다.
// `?? '리터럴'` 폴백은 환경변수 누락을 조용히 덮어버려서 설정 실수도 눈에 안 띈다.
// 값은 Vercel 환경변수에만 둔다.
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID

export async function POST(req: NextRequest) {
  if (isRateLimited(getClientIp(req), 5, 60_000)) {
    return NextResponse.json({ error: 'too many requests' }, { status: 429 })
  }

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

  // 환경변수가 없으면 여기서 멈춘다. 예전에는 리터럴 폴백이 있어서 미설정도
  // 조용히 성공했고, 그래서 토큰이 코드에 남아 있는 걸 아무도 눈치채지 못했다.
  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json({ error: 'messaging not configured' }, { status: 503 })
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
