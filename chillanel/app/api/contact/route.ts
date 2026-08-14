import { NextResponse } from "next/server";

// Single inbox for chillanel's two visitor-submitted forms (advertise
// inquiries, place-info correction reports) -- both forward to one
// Telegram chat via the Bot API instead of email, so there's one place to
// watch instead of a mailbox nobody checks. No database: Telegram *is* the
// storage/notification layer here.
export const runtime = "nodejs";
// Telegram sendMessage is a single small POST -- if it hangs (DNS, network
// stall) there's no reason for this route to sit at the platform default
// duration burning function time at the visitor's expense; see the
// AbortSignal.timeout below.
export const maxDuration = 10;

const MAX_FIELD_LENGTH = 2000;

// Best-effort per-IP rate limit. This is in-memory, so it only holds within
// one warm serverless instance (Fluid Compute reuses instances across
// concurrent requests, so it's not nothing) -- not a real distributed
// limiter, but it's a free first line of defense against a script hammering
// this route at line rate, on top of the honeypot below which only catches
// bots dumb enough to fill every field.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  rateLimitHits.set(ip, hits);
  // Unbounded growth guard: this map only clears entries for IPs that hit
  // the route again, so on a low-traffic route like this, occasionally trim
  // fully-expired keys to avoid holding onto every IP that ever POSTed.
  if (rateLimitHits.size > 1000) {
    for (const [key, times] of rateLimitHits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) rateLimitHits.delete(key);
    }
  }
  return hits.length > RATE_LIMIT_MAX;
}

type AdvertiseBody = {
  type: "advertise";
  name: string;
  contact: string;
  message: string;
  // Honeypot: real visitors never see or fill this field (see the form's
  // sr-only + tabIndex=-1 input) -- a filled-in value means a bot filled
  // every input on the page indiscriminately.
  website: string;
};

type CorrectionBody = {
  type: "correction";
  placeId: string;
  placeName: string;
  issueType: string;
  details: string;
  contact: string;
  website: string;
};

type Body = AdvertiseBody | CorrectionBody;

function clip(value: unknown, max = MAX_FIELD_LENGTH): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isNonEmpty(value: string): boolean {
  return value.length > 0;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Partial<Body>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot tripped -- pretend success so the bot doesn't learn to leave
  // this field alone, but never call Telegram.
  if (clip(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("contact API: TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not configured");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let text: string;
  if (body.type === "advertise") {
    const name = clip(body.name, 200);
    const contact = clip(body.contact, 200);
    const message = clip(body.message);
    if (![name, contact, message].every(isNonEmpty)) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }
    text = `📢 광고문의 (chillanel)\n\n이름: ${name}\n연락처: ${contact}\n\n${message}`;
  } else if (body.type === "correction") {
    const placeId = clip(body.placeId, 200);
    const placeName = clip(body.placeName, 200);
    const issueType = clip(body.issueType, 100);
    const details = clip(body.details);
    const contact = clip(body.contact, 200);
    if (![placeId, placeName, issueType, details].every(isNonEmpty)) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }
    text = `🛠 정보 오류 제보 (chillanel)\n\n업체: ${placeName} (${placeId})\n유형: ${issueType}${contact ? `\n연락처: ${contact}` : ""}\n\n${details}`;
  } else {
    return NextResponse.json({ ok: false, error: "unknown_type" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`contact API: Telegram sendMessage failed (${res.status}): ${errBody}`);
      return NextResponse.json({ ok: false, error: "telegram_failed" }, { status: 502 });
    }
  } catch (e) {
    // A DNS failure, connection reset, or the 8s timeout above throws here
    // instead of rejecting inside the .ok check -- previously uncaught, so
    // Next returned its generic HTML 500 page instead of this route's JSON
    // error envelope, and callers' `!res.ok` handling never ran.
    console.error(`contact API: Telegram request failed: ${(e as Error).message}`);
    return NextResponse.json({ ok: false, error: "telegram_unreachable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
