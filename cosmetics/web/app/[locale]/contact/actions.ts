"use server";

export type ContactState = { ok: boolean; error?: string } | null;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// User-facing errors only — the Telegram notification below goes to the site
// operator, not a visitor, so it stays in whatever language they read.
const ERRORS = {
  th: {
    missingFields: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    invalidEmail: "กรุณากรอกอีเมลให้ถูกต้อง",
    tooShort: "กรุณากรอกข้อความอย่างน้อย 10 ตัวอักษร",
    tooLong: "ข้อความต้องไม่เกิน 2000 ตัวอักษร",
    serverConfig: "เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่ภายหลัง",
    tryAgain: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
  },
  en: {
    missingFields: "Please fill in every field.",
    invalidEmail: "Please enter a valid email address.",
    tooShort: "Please enter at least 10 characters.",
    tooLong: "Message must be 2000 characters or fewer.",
    serverConfig: "A server error occurred. Please try again later.",
    tryAgain: "Something went wrong. Please try again.",
  },
} as const;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const locale = formData.get("locale")?.toString() === "th" ? "th" : "en";
  const err = ERRORS[locale];

  const name = (formData.get("name")?.toString() ?? "").trim();
  const email = (formData.get("email")?.toString() ?? "").trim();
  const type = (formData.get("type")?.toString() ?? "").trim();
  const message = (formData.get("message")?.toString() ?? "").trim();

  if (!name || !email || !type || !message) {
    return { ok: false, error: err.missingFields };
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: err.invalidEmail };
  }

  if (message.length < 10) {
    return { ok: false, error: err.tooShort };
  }
  if (message.length > 2000) {
    return { ok: false, error: err.tooLong };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: err.serverConfig };
  }

  const text = [
    "🌸 <b>BangkokFillers 문의</b>",
    "━━━━━━━━━━━━━━━━",
    `<b>유형:</b> ${escapeHtml(type)}`,
    `<b>이름:</b> ${escapeHtml(name)}`,
    `<b>이메일:</b> ${escapeHtml(email)}`,
    "━━━━━━━━━━━━━━━━",
    escapeHtml(message),
  ].join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      }
    );
    if (!res.ok) return { ok: false, error: err.tryAgain };
    return { ok: true };
  } catch {
    return { ok: false, error: err.tryAgain };
  }
}
