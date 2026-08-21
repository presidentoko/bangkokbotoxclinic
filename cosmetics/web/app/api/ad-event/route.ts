import { NextRequest, NextResponse } from "next/server";
import { recordMetric } from "@/lib/ad-metrics";
import { getAdSlots } from "@/lib/ads";

export const runtime = "nodejs";

/**
 * Records one impression or click against a sold ad slot.
 *
 * Deliberately tiny: a 204 with no body, so `navigator.sendBeacon` can fire it
 * during the unload that follows a click on the ad without the browser
 * cancelling the request or the user waiting on it.
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60; // a real reader trips a handful of these per minute
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
  if (isRateLimited(ip)) return new NextResponse(null, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const { slotId, kind } = (body ?? {}) as Record<string, unknown>;
  if (typeof slotId !== "string" || slotId.length > 64) {
    return new NextResponse(null, { status: 400 });
  }
  if (kind !== "imp" && kind !== "clk") {
    return new NextResponse(null, { status: 400 });
  }

  // Only count events for slots that actually exist. Without this check the
  // endpoint is an open counter anyone can inflate, and an inflated impression
  // number in an advertiser report is worse than no number at all.
  const slots = await getAdSlots();
  if (!slots.some((s) => s.id === slotId)) {
    return new NextResponse(null, { status: 204 });
  }

  await recordMetric(slotId, kind);
  return new NextResponse(null, { status: 204 });
}
