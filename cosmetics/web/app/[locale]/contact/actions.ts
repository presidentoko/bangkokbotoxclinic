"use server";

export type ContactState = { ok: boolean; error?: string } | null;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get("name")?.toString() ?? "").trim();
  const email = (formData.get("email")?.toString() ?? "").trim();
  const type = (formData.get("type")?.toString() ?? "").trim();
  const message = (formData.get("message")?.toString() ?? "").trim();

  if (!name || !email || !type || !message) {
    return { ok: false, error: "모든 필드를 입력해 주세요." };
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "올바른 이메일 주소를 입력해 주세요." };
  }

  if (message.length < 10) {
    return { ok: false, error: "메시지를 10자 이상 입력해 주세요." };
  }
  if (message.length > 2000) {
    return { ok: false, error: "메시지는 2000자 이하로 입력해 주세요." };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: "서버 설정 오류입니다." };
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
    if (!res.ok) return { ok: false, error: "잠시 후 다시 시도해 주세요." };
    return { ok: true };
  } catch {
    return { ok: false, error: "잠시 후 다시 시도해 주세요." };
  }
}
