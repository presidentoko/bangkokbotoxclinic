import { NextRequest, NextResponse } from "next/server";
import { getAllPackages, DATA_GENERATED_AT } from "@/lib/db";

// Public read-only JSON API, promoted to AI crawlers via /llms.txt.
// Backed by the bundled dataset rather than a live database — the old version
// returned 503 "DB unavailable" for a day and a half when Railway stopped, and
// that 503 was the only visible symptom of an outage which was meanwhile
// quietly hollowing out every page on the site.
export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10) || 50, 200);

  let rows = await getAllPackages("price");
  if (category) rows = rows.filter((r) => r.category === category);
  if (city) rows = rows.filter((r) => r.city === city);

  const packages = rows.slice(0, limit).map((r) => ({
    hospital: r.hospital_name,
    slug: r.hospital_slug,
    city: r.city,
    jci: r.jci,
    rating: r.rating,
    package_id: r.package_id,
    package_name: r.package_name,
    category: r.category,
    price: r.price,
    currency: r.currency,
    has_blood: r.has_blood,
    has_xray: r.has_xray,
    has_ultrasound: r.has_ultrasound,
    has_ct: r.has_ct,
    has_mri: r.has_mri,
    has_ecg: r.has_ecg,
    has_cancer_marker: r.has_cancer_marker,
    has_doctor_consult: r.has_doctor_consult,
    has_interpreter: r.has_interpreter,
    results_days: r.results_days,
    source_url: r.source_url,
  }));

  return NextResponse.json(
    {
      source: "bangkoktopclinic.com",
      note: "Prices scraped from hospital websites. Verify with hospital before booking.",
      last_updated: DATA_GENERATED_AT,
      count: packages.length,
      packages,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
