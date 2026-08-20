// Partner clicked "I just sent the transfer" → Telegram + Discord ping owner.
// Body: { clinic_name, clinic_id?, amount_thb, reference?, payer_name?, partner_email?, note? }
// Server-only; rate-limited per IP to prevent spam.

import { notifyPaymentClaim } from "@/lib/notify";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new Response("invalid body", { status: 400 }); }

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  // 3 claims per IP per hour. 결제 클레임은 sensitive — Upstash 실패시 fail-CLOSED.
  if (ip !== "unknown" && !(await checkRateLimit({
    key: `payment-claim:${ip}`, limit: 3, windowSec: 3600, failOpenOnError: false,
  }))) return new Response("rate limit", { status: 429 });

  const clinic_name = String(body.clinic_name || "").trim().slice(0, 200);
  const amount = Number(body.amount_thb);
  if (!clinic_name) return new Response("missing clinic_name", { status: 400 });
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000)
    return new Response("invalid amount", { status: 400 });

  const claim = {
    clinic_name,
    clinic_id: String(body.clinic_id || "").slice(0, 100) || undefined,
    amount_thb: Math.round(amount),
    reference: String(body.reference || "").slice(0, 100) || undefined,
    payer_name: String(body.payer_name || "").slice(0, 200) || undefined,
    partner_email: String(body.partner_email || "").slice(0, 200) || undefined,
    note: String(body.note || "").slice(0, 1000) || undefined,
    at: new Date().toISOString(),
  };

  // 2026-08-20: 예전엔 await 없이 알림만 쏘고 곧바로 200 을 돌려줬다. 서버리스
  // 함수는 응답 직후 동결될 수 있어 Telegram/Discord 전송이 끊길 수 있는데,
  // UI 는 "✅ 알림 완료" 라고 표시한다 — 돈은 들어왔는데 아무도 모르는 상태가
  // 만들어진다. 전송을 기다리고, 전부 실패하면 실패로 응답해서 파트너가
  // 다른 경로로 알릴 수 있게 한다.
  try {
    await notifyPaymentClaim(claim);
  } catch (e) {
    console.error("[payment-claim] notify failed", claim.reference || claim.clinic_name, e);
    return new Response("notify failed", { status: 502 });
  }

  return Response.json({ ok: true });
}
