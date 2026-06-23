import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.CONTACT_EMAIL || "chillanel22@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, businessName, pageUrl, contactName, contactEmail, requestType, description } = body;

    if (!contactEmail || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
