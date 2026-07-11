import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.CONTACT_EMAIL || "chillanel22@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (!contactEmail || !description || !EMAIL_RE.test(contactEmail)) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
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

    return NextResponse.json({
      ok: true,
      mailtoUrl: `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${emailBody}`,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
