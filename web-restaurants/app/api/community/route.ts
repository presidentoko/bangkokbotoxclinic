import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, restaurantId, value, category, text } = body as {
    action: "flag" | "vote" | "report";
    restaurantId: string;
    value?: "up" | "down";
    category?: string;
    text?: string;
  };

  if (!restaurantId || !action) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const ip = getIp(req);

  if (action === "flag") {
    const rateLimitKey = `ratelimit:flag:${ip}:${restaurantId}`;
    const already = await redis.get(rateLimitKey);
    if (already) return NextResponse.json({ ok: false, error: "already flagged" }, { status: 429 });
    await redis.set(rateLimitKey, 1, { ex: 86400 });
    const count = await redis.incr(`flag:${restaurantId}`);
    return NextResponse.json({ ok: true, count });
  }

  if (action === "vote") {
    if (!value || !["up", "down"].includes(value)) {
      return NextResponse.json({ ok: false, error: "invalid value" }, { status: 400 });
    }
    const rateLimitKey = `ratelimit:vote:${ip}:${restaurantId}`;
    const already = await redis.get(rateLimitKey);
    if (already) return NextResponse.json({ ok: false, error: "already voted" }, { status: 429 });
    await redis.set(rateLimitKey, 1);
    await redis.incr(`vote:${restaurantId}:${value}`);
    const [up, down] = await Promise.all([
      redis.get<number>(`vote:${restaurantId}:up`),
      redis.get<number>(`vote:${restaurantId}:down`),
    ]);
    return NextResponse.json({ ok: true, up: up ?? 0, down: down ?? 0 });
  }

  if (action === "report") {
    const entry = JSON.stringify({ category, text: text?.slice(0, 500), ts: Date.now() });
    await redis.rpush(`report:${restaurantId}`, entry);
    await redis.ltrim(`report:${restaurantId}`, -100, -1);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}
