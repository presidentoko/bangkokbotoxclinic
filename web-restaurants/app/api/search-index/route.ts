import { NextResponse } from "next/server";
import { loadMasterDb } from "@/lib/data";

// Static, CDN/browser-cacheable search index — fetched once client-side and
// reused across page views, instead of embedding all restaurants inline in
// every page's RSC payload (which was bloating home/th/ko HTML to 1MB+).
export const dynamic = "force-static";

export async function GET() {
  const db = await loadMasterDb();
  const entities = db.restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: r.trust_score,
    cuisines: r.cuisines,
  }));
  return NextResponse.json(entities, {
    headers: { "Cache-Control": "public, max-age=1800, s-maxage=1800" },
  });
}
