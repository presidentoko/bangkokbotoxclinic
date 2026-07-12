import { NextRequest, NextResponse } from "next/server";
import { loadMasterDb } from "@/lib/data";

// Fetches full restaurant objects for a bounded set of ids — backs the
// client-side Saved list, which only knows ids (from localStorage) and
// needs the same shape RestaurantCard expects.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) {
    return NextResponse.json({ ok: false, error: "missing ids" }, { status: 400 });
  }
  const idSet = new Set(ids.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 100));
  if (idSet.size === 0) {
    return NextResponse.json({ ok: false, error: "missing ids" }, { status: 400 });
  }

  const db = await loadMasterDb();
  const restaurants = db.restaurants.filter((r) => idSet.has(r.id));

  return NextResponse.json(
    { ok: true, restaurants },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } }
  );
}
