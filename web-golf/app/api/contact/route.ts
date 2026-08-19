import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REASON_LABELS: Record<string, string> = {
  partnership: "🤝 Golf club partnership",
  correction: "✏️ Data correction",
  press: "📰 Press / media",
  claim: "🏌️ Claim listing",
  general: "❓ General",
};

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    reason?: string;
    message?: string;
    context?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 200);
  const reason = (body.reason ?? "general").trim();
  const message = (body.message ?? "").trim().slice(0, 4000);
  const context = (body.context ?? "").trim().slice(0, 300);

  if (!email || !message) {
    return NextResponse.json({ ok: false, error: "Email and message are required" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("contact form: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured");
    return NextResponse.json({ ok: false, error: "Contact form is not configured yet" }, { status: 503 });
  }

  const label = REASON_LABELS[reason] ?? REASON_LABELS.general;
  const lines = [
    `${label} — Thailand Golf Guide`,
    `From: ${name || "(no name)"} <${email}>`,
    context ? `Context: ${context}` : null,
    "",
    message,
  ].filter(Boolean);

  const text = lines.join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    console.error("contact form: Telegram send failed", await res.text());
    return NextResponse.json({ ok: false, error: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
