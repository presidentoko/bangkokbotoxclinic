import { NextRequest, NextResponse } from "next/server";
import { getHospitals, getAllPackages } from "@/lib/db";

// Backed by the bundled dataset (see lib/db.ts) instead of MySQL LIKE queries.
// Response shape must stay { hospitals, packages } to match
// app/components/SiteSearch.tsx.

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 100);
  if (q.length < 2) return NextResponse.json({ hospitals: [], packages: [] });
  const needle = q.toLowerCase();
  const has = (v: string | null) => !!v && v.toLowerCase().includes(needle);

  const hospitals = (await getHospitals())
    .filter((h) => has(h.name) || has(h.city) || has(h.area))
    .sort((a, b) => b.jci - a.jci || b.package_count - a.package_count)
    .slice(0, 6)
    .map((h) => ({
      slug: h.slug,
      name: h.name,
      city: h.city,
      jci: h.jci,
      min_price: h.min_price,
      pkg_count: h.package_count,
    }));

  // getAllPackages("price") already orders by price ascending, so only the JCI
  // tiebreak has to be layered on top.
  const packages = (await getAllPackages("price"))
    .filter((p) => p.price !== null && has(p.package_name))
    .sort((a, b) => b.jci - a.jci)
    .slice(0, 6)
    .map((p) => ({
      package_id: p.package_id,
      package_name: p.package_name,
      category: p.category,
      price: p.price,
      hospital_slug: p.hospital_slug,
      hospital_name: p.hospital_name,
      jci: p.jci,
    }));

  return NextResponse.json(
    { hospitals, packages },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
  );
}
