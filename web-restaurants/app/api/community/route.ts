import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { loadMasterDb } from "@/lib/data";

export const dynamic = "force-dynamic";

const LEADERBOARD_KEY = "leaderboard:flags";

let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("leaderboard")) {
    const limit = Math.min(20, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 5));
    // Ranked from a global sorted set (all restaurants), not a client-supplied
    // candidate list — otherwise a restaurant outside anyone's "top N" prop
    // could never surface here no matter how many flags it collects.
    const top = await getRedis().zrange<string[]>(LEADERBOARD_KEY, 0, limit - 1, {
      rev: true,
      withScores: true,
    });
    const entries: { id: string; flags: number }[] = [];
    for (let i = 0; i < top.length; i += 2) {
      entries.push({ id: String(top[i]), flags: Number(top[i + 1]) });
    }
    const db = await loadMasterDb();
    const byId = new Map(db.restaurants.map((r) => [r.id, r.name]));
    const leaderboard = entries
      .filter((e) => byId.has(e.id))
      .map((e) => ({ id: e.id, name: byId.get(e.id)!, flags: e.flags }));
    return NextResponse.json({ ok: true, leaderboard });
  }

  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) {
    return NextResponse.json({ ok: false, error: "missing ids" }, { status: 400 });
  }
  const idList = ids.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 50);
  if (idList.length === 0) {
    return NextResponse.json({ ok: false, error: "missing ids" }, { status: 400 });
  }

  const redis = getRedis();
  const [flags, ups, downs] = await Promise.all([
    Promise.all(idList.map((id) => redis.get<number>(`flag:${id}`))),
    Promise.all(idList.map((id) => redis.get<number>(`vote:${id}:up`))),
    Promise.all(idList.map((id) => redis.get<number>(`vote:${id}:down`))),
  ]);

  const counts: Record<string, { flags: number; up: number; down: number }> = {};
  idList.forEach((id, i) => {
    counts[id] = { flags: flags[i] ?? 0, up: ups[i] ?? 0, down: downs[i] ?? 0 };
  });

  return NextResponse.json({ ok: true, counts });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
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
  if (typeof restaurantId !== "string" || !/^0x[0-9a-f]+_0x[0-9a-f]+$/i.test(restaurantId)) {
    return NextResponse.json({ ok: false, error: "invalid restaurantId" }, { status: 400 });
  }

  const ip = getIp(req);

  if (action === "flag") {
    const rateLimitKey = `ratelimit:flag:${ip}:${restaurantId}`;
    const acquired = await getRedis().set(rateLimitKey, 1, { ex: 86400, nx: true });
    if (!acquired) return NextResponse.json({ ok: false, error: "already flagged" }, { status: 429 });
    const count = await getRedis().incr(`flag:${restaurantId}`);
    await getRedis().zadd(LEADERBOARD_KEY, { score: count, member: restaurantId });
    return NextResponse.json({ ok: true, count });
  }

  if (action === "vote") {
    if (!value || !["up", "down"].includes(value)) {
      return NextResponse.json({ ok: false, error: "invalid value" }, { status: 400 });
    }
    const rateLimitKey = `ratelimit:vote:${ip}:${restaurantId}`;
    const acquired = await getRedis().set(rateLimitKey, 1, { ex: 86400, nx: true });
    if (!acquired) return NextResponse.json({ ok: false, error: "already voted" }, { status: 429 });
    await getRedis().incr(`vote:${restaurantId}:${value}`);
    const [up, down] = await Promise.all([
      getRedis().get<number>(`vote:${restaurantId}:up`),
      getRedis().get<number>(`vote:${restaurantId}:down`),
    ]);
    return NextResponse.json({ ok: true, up: up ?? 0, down: down ?? 0 });
  }

  if (action === "report") {
    const rateLimitKey = `ratelimit:report:${ip}`;
    const recent = await getRedis().incr(rateLimitKey);
    await getRedis().expire(rateLimitKey, 3600);
    if (recent > 10) return NextResponse.json({ ok: false, error: "rate limited" }, { status: 429 });
    const entry = JSON.stringify({ category, text: text?.slice(0, 500), ts: Date.now() });
    await getRedis().rpush(`report:${restaurantId}`, entry);
    await getRedis().ltrim(`report:${restaurantId}`, -100, -1);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}
