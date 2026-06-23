import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { name, purpose, message, contact } = body as {
    name?: string;
    purpose?: string;
    message?: string;
    contact?: string;
  };

  if (!message?.trim()) {
    return NextResponse.json({ ok: false, error: "missing message" }, { status: 400 });
  }

  const purposeLabel: Record<string, string> = {
    ad: "📢 광고/협찬 문의",
    correction: "✏️ 데이터 수정",
    press: "📰 미디어/취재",
    other: "❓ 기타",
  };

  const text = [
    `🔔 *SNS Stopper 새 문의*`,
    ``,
    `👤 이름: ${name || "미입력"}`,
    `📌 목적: ${purposeLabel[purpose ?? ""] || purpose || "미선택"}`,
    `📞 연락처: ${contact || "미입력"}`,
    ``,
    `💬 내용:`,
    message.trim(),
  ].join("\n");

  const tgRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!tgRes.ok) {
    return NextResponse.json({ ok: false, error: "telegram error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
