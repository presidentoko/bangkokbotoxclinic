// Newsletter signup. Stores in Upstash list + unique-email set. Honeypot + per-IP rate limit.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function rcmd(cmd: (string | number)[]): Promise<unknown> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { result?: unknown };
    return j.result;
  } catch { return null; }
}

async function rpipeline(cmds: (string | number)[][]): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  try {
    await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
      cache: "no-store",
    });
  } catch { /* fail-silent */ }
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; lang?: string; source?: string; _hp?: string };
  if (body._hp) return NextResponse.json({ ok: true }); // honeypot

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 200) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
  const rlKey = `rl:newsletter:${ip}`;
  const count = (await rcmd(["INCR", rlKey])) as number | null;
  if (count === 1) await rcmd(["EXPIRE", rlKey, 3600]);
  if (typeof count === "number" && count > 3) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  const record = {
    email,
    lang: String(body.lang || "en").slice(0, 5),
    source: String(body.source || "footer").slice(0, 50),
    at: new Date().toISOString(),
    ua: req.headers.get("user-agent")?.slice(0, 200) || "",
  };

  await rpipeline([
    ["LPUSH", "newsletter:subscribers", JSON.stringify(record)],
    ["LTRIM", "newsletter:subscribers", 0, 9999],
    ["SADD", "newsletter:emails", email],
  ]);

  // Telegram ping — owner notified so they can email the PDF / follow up
  try {
    const { sendTelegram } = await import("@/lib/notify");
    await sendTelegram(
      `📧 New subscribe / PDF request\n` +
      `Email: ${email}\n` +
      `Source: ${record.source}\n` +
      `Lang: ${record.lang}\n` +
      `At: ${record.at}`
    );
  } catch (e) { console.error("[subscribe] notify err", e); }

  return NextResponse.json({ ok: true });
}
