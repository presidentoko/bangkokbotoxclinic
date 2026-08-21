import { NextRequest, NextResponse } from "next/server";
import { getAdSlots } from "@/lib/ads";
import { revalidateForSlots } from "@/lib/ad-revalidate";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Turn campaigns on and off on the days their own dates say they should change.
 *
 * Ad slots carry startsAt/endsAt, and `getActiveAdSlots()` compares them against
 * `new Date()`. On a statically generated page that comparison is frozen at
 * build time, so a campaign starting tomorrow would never appear and one ending
 * today would never disappear — the schedule an advertiser paid for would
 * simply not be honoured.
 *
 * This runs daily and re-renders only the pages whose visible set of slots
 * changes today: the ones starting today, and the ones that ended yesterday.
 * Nothing else is touched, so the ISR write cost is a handful of pages on the
 * days a campaign flips and zero on every other day.
 */
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const slots = await getAdSlots();
  const flipping = slots.filter(
    (s) => s.startsAt === today || s.endsAt === yesterday || s.endsAt === today
  );

  if (flipping.length === 0) {
    return NextResponse.json({ ok: true, today, flipped: 0, paths: [] });
  }

  const report = await revalidateForSlots(flipping);
  return NextResponse.json({
    ok: true,
    today,
    flipped: flipping.length,
    slots: flipping.map((s) => ({ id: s.id, type: s.type, startsAt: s.startsAt, endsAt: s.endsAt })),
    ...report,
  });
}
