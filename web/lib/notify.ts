// Lead 알림 채널 — email (Resend) + LINE Messaging API push.
// env 미설정 시 graceful no-op.

import { getSiteConfig } from "./site";

const RESEND_KEY = process.env.RESEND_API_KEY;
const DEFAULT_LINE_TOKEN = process.env.LINE_DEFAULT_BOT_TOKEN;
const FALLBACK_EMAIL = process.env.FALLBACK_LEAD_EMAIL ?? "";
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

/** From: 헤더 — env override 있으면 그거 우선, 없으면 siteConfig 에서 생성. */
function fromAddress(): string {
  if (process.env.RESEND_FROM_EMAIL) return process.env.RESEND_FROM_EMAIL;
  const cfg = getSiteConfig();
  return `${cfg.brand} <leads@${cfg.domain}>`;
}

export async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  if (!RESEND_KEY) {
    console.log("[notify.email] no RESEND_API_KEY — skipping. to:", to, "subj:", subject);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: fromAddress(), to, subject, html, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[notify.email] resend err", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[notify.email] fetch failed", e);
    return false;
  }
}

export async function sendLinePush(token: string | undefined, userId: string, text: string): Promise<boolean> {
  const tok = token || DEFAULT_LINE_TOKEN;
  if (!tok) {
    console.log("[notify.line] no token — skipping.");
    return false;
  }
  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tok}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: userId,
        messages: [{ type: "text", text: text.slice(0, 4900) }],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[notify.line] err", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[notify.line] fetch failed", e);
    return false;
  }
}

export function getFallbackEmail(): string {
  return FALLBACK_EMAIL;
}

// Partner "I just sent the transfer" claim → ping owner via Telegram + Discord.
// env 미설정 시 graceful: 둘 다 없으면 이메일로 폴백하여 claim 유실 방지.
export interface PaymentClaim {
  clinic_name: string;
  clinic_id?: string;
  amount_thb: number;
  reference?: string;
  payer_name?: string;
  partner_email?: string;
  note?: string;
  at: string;
}

export async function notifyPaymentClaim(claim: PaymentClaim): Promise<void> {
  const text = [
    "💸 Payment claim",
    `Clinic: ${claim.clinic_name}${claim.clinic_id ? ` (${claim.clinic_id})` : ""}`,
    `Amount: ฿${claim.amount_thb.toLocaleString()}`,
    claim.reference ? `Ref: ${claim.reference}` : "",
    claim.payer_name ? `Payer: ${claim.payer_name}` : "",
    claim.partner_email ? `Email: ${claim.partner_email}` : "",
    claim.note ? `Note: ${claim.note}` : "",
    `At: ${claim.at}`,
  ].filter(Boolean).join("\n");

  const results = await Promise.allSettled([sendTelegram(text), sendDiscord(text)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value === true);

  // 두 채널 모두 미설정/실패 → 이메일 폴백 (claim 유실 방지).
  if (!delivered && FALLBACK_EMAIL) {
    await sendEmail(FALLBACK_EMAIL, `Payment claim: ${claim.clinic_name}`,
      `<pre>${text}</pre>`, text);
  }
}

export async function sendTelegram(text: string): Promise<boolean> {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("[notify.telegram] no token/chat — skipping.");
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[notify.telegram] err", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[notify.telegram] fetch failed", e);
    return false;
  }
}

async function sendDiscord(text: string): Promise<boolean> {
  if (!DISCORD_WEBHOOK) {
    console.log("[notify.discord] no webhook — skipping.");
    return false;
  }
  try {
    const res = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[notify.discord] err", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[notify.discord] fetch failed", e);
    return false;
  }
}
