import { listCities, loadCity } from "@/lib/data";
import { isRelevantCategory } from "@/lib/categories";

// Map pins for CityMap, fetched only when a visitor taps "show map"
// (2026-10-23). They used to ride in every city/district page's RSC payload
// as a client prop — 4,096 Bangkok pins were 542KB of the page's 759KB
// flight data, paid on every page view and every ISR read/origin transfer
// whether or not anyone opened the map. Static per city, same data as the
// pages that link here.
//
// Compact rows: [id, name, lat, lng, rating, district].
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listCities().map((city) => ({ city }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const rows = loadCity(city)
    .places.filter((p) => isRelevantCategory(p.primaryType) && p.lat != null && p.lng != null)
    .map((p) => [p.id, p.name, p.lat, p.lng, p.rating, p.district ?? null]);
  return Response.json(rows);
}
