import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/leads";
import { VALID_SKINS, VALID_BUDGETS, CONCERNS } from "@/lib/quiz-config";

function isValidEmail(e: string) {
  return typeof e === "string" && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// Lightweight per-instance rate limit — no Redis dependency, just enough to
// stop a single bot from hammering this endpoint and burning KV write quota.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { email, skin, concern, budget } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if (typeof skin !== "string" || !VALID_SKINS.includes(skin as (typeof VALID_SKINS)[number])) {
    return NextResponse.json({ error: "invalid skin" }, { status: 400 });
  }
  if (typeof concern !== "string" || !CONCERNS.includes(concern as (typeof CONCERNS)[number])) {
    return NextResponse.json({ error: "invalid concern" }, { status: 400 });
  }
  if (typeof budget !== "string" || !VALID_BUDGETS.includes(budget as (typeof VALID_BUDGETS)[number])) {
    return NextResponse.json({ error: "invalid budget" }, { status: 400 });
  }

  await addLead({ email, skin, concern, budget, ts: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
