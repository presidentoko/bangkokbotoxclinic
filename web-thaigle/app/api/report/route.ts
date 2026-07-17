import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.CONTACT_EMAIL || "chillanel22@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Telegram's HTML parse_mode rejects unescaped &/</> that don't form a
// supported tag (e.g. "price <300 baht") with a 400 and drops the whole
// message — this is the only delivery path that gets reviewed in practice.
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const REQUEST_TYPE_EMOJI: Record<string, string> = {
  correction: "✏️",
  closed: "🚫",
  removal: "⚠️",
  response: "💬",
  copyright: "©️",
  pdpa: "🔒",
  other: "❓",
};

// Console logs aren't reviewable in practice — this is the actual delivery
// path. Never throws: a failed notification shouldn't fail the request.
async function notifyTelegram(fields: {
  type: string;
  businessName?: string;
  pageUrl?: string;
  contactName?: string;
  contactEmail: string;
  requestType?: string;
  description: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const emoji = REQUEST_TYPE_EMOJI[fields.requestType ?? ""] ?? "📩";
  const description = escapeHtml(fields.description).slice(0, 3500);
  const text =
    `${emoji} <b>Thaigle ${fields.type === "report" ? "Report" : "Takedown"}</b>\n` +
    `Type: ${escapeHtml(fields.requestType ?? fields.type)}\n` +
    `Business: ${escapeHtml(fields.businessName || "-")}\n` +
    `Page: ${escapeHtml(fields.pageUrl || "-")}\n` +
    `From: ${escapeHtml(fields.contactName || "-")} (${escapeHtml(fields.contactEmail)})\n\n` +
    `${description}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!res.ok) {
      console.error("[thaigle-report] telegram delivery failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("[thaigle-report] telegram delivery threw", err);
    // non-fatal — the mailto fallback still fires client-side
  }
}

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of RATE_LIMIT) {
    if (now > entry.resetAt) RATE_LIMIT.delete(key);
  }
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { type, businessName, pageUrl, contactName, contactEmail, requestType, description } = body;

    if (typeof contactEmail !== "string" || typeof description !== "string" || !EMAIL_RE.test(contactEmail)) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }
    const isOptionalString = (v: unknown) => v === undefined || typeof v === "string";
    if (!isOptionalString(businessName) || !isOptionalString(pageUrl) || !isOptionalString(contactName) || !isOptionalString(requestType) || typeof type !== "string") {
      return NextResponse.json({ error: "Invalid field type" }, { status: 400 });
    }
    if (description.length > 5000 || contactEmail.length > 320 || (businessName?.length ?? 0) > 300 || (pageUrl?.length ?? 0) > 2000 || (contactName?.length ?? 0) > 200) {
      return NextResponse.json({ error: "Field too long" }, { status: 400 });
    }

    // Build mailto URL for admin notification
    const subject = encodeURIComponent(`[Thaigle ${type === "report" ? "Report" : "Takedown"}] ${businessName || pageUrl || "Unknown"}`);
    const emailBody = encodeURIComponent(
      `Type: ${requestType || type}\n` +
      `Business: ${businessName || "-"}\n` +
      `Page: ${pageUrl || "-"}\n` +
      `From: ${contactName || "-"} <${contactEmail}>\n\n` +
      `Description:\n${description}\n\n` +
      `Submitted: ${new Date().toISOString()}\n` +
      `Reply to: ${contactEmail}`
    );

    // Log for Vercel logs (always)
    console.log("[thaigle-report]", JSON.stringify({
      type, businessName, pageUrl, contactName, contactEmail, requestType, description,
      ts: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "unknown",
    }));

    await notifyTelegram({ type, businessName, pageUrl, contactName, contactEmail, requestType, description });

    return NextResponse.json({
      ok: true,
      mailtoUrl: `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${emailBody}`,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
