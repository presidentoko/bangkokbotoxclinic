// Lead 알림 채널 — email (Resend) + LINE Messaging API push.
// env 미설정 시 graceful no-op.

const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "Bangkok Botox Clinic <leads@bangkokbotoxclinic.com>";
const DEFAULT_LINE_TOKEN = process.env.LINE_DEFAULT_BOT_TOKEN;
const FALLBACK_EMAIL = process.env.FALLBACK_LEAD_EMAIL || "chillanel22@gmail.com";

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
      body: JSON.stringify({ from: RESEND_FROM, to, subject, html, text }),
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
