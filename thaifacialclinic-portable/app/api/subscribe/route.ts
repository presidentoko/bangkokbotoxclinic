// Newsletter signup endpoint. Stores email in Upstash list for later retrieval.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rcmd, rpipeline } from "@/lib/upstash";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; lang?: string; source?: string; _hp?: string };

  if (body._hp) return NextResponse.json({ ok: true });

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 200) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  // Per-IP rate limit — 3 signups / hour
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
    ["SADD", "newsletter:emails", email],  // unique-email set
  ]);

  return NextResponse.json({ ok: true });
}
