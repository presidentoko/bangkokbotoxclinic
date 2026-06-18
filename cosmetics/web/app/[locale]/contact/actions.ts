"use server";

export type ContactState = { ok: boolean; error?: string } | null;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = ((formData.get("name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const type = ((formData.get("type") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();

  if (!name || !email || !type || !message) {
    return { ok: false, error: "모든 필드를 입력해 주세요." };
  }
  if (message.length < 10) {
    return { ok: false, error: "메시지를 10자 이상 입력해 주세요." };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: "서버 설정 오류입니다." };
  }

  const text = [
    "🌸 *BangkokFillers 문의*",
    "━━━━━━━━━━━━━━━━",
    `*유형:* ${type}`,
    `*이름:* ${name}`,
    `*이메일:* ${email}`,
    "━━━━━━━━━━━━━━━━",
    message,
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    }
  );

  if (!res.ok) {
    return { ok: false, error: "잠시 후 다시 시도해 주세요." };
  }
  return { ok: true };
}
