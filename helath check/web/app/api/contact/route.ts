import { NextRequest, NextResponse } from "next/server";

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  if (!TG_TOKEN || !TG_CHAT) {
    return NextResponse.json({ ok: false, error: "Contact not configured" }, { status: 500 });
  }

  let body: { type?: string; name?: string; email?: string; message?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const { type = "general", name = "Anonymous", email = "", message = "", url = "" } = body;

  if (!message.trim()) {
    return NextResponse.json({ ok: false, error: "Message required" }, { status: 400 });
  }

  const typeLabel: Record<string, string> = {
    enquiry: "📋 Patient Enquiry",
    advertising: "📢 Advertising / Listing",
    correction: "🔧 Data Correction",
    general: "💬 General Contact",
  };

  const text = [
    `${typeLabel[type] ?? "💬 Message"} — BangkokCheckup`,
    ``,
    `Name: ${name}`,
    email ? `Email: ${email}` : null,
    url ? `Page: ${url}` : null,
    ``,
    `Message:`,
    message.trim().slice(0, 1000),
  ].filter((l) => l !== null).join("\n");

  const tgResp = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: "HTML" }),
  });

  if (!tgResp.ok) {
    const err = await tgResp.text();
    console.error("Telegram error:", err);
    return NextResponse.json({ ok: false, error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
