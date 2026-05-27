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

  notifyPaymentClaim({
    clinic_name,
    clinic_id: String(body.clinic_id || "").slice(0, 100) || undefined,
    amount_thb: Math.round(amount),
    reference: String(body.reference || "").slice(0, 100) || undefined,
    payer_name: String(body.payer_name || "").slice(0, 200) || undefined,
    partner_email: String(body.partner_email || "").slice(0, 200) || undefined,
    note: String(body.note || "").slice(0, 1000) || undefined,
    at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
