import { NextRequest, NextResponse } from "next/server";
import { getAllPackages } from "@/lib/db";

// Looks up saved packages by id for the client-side /saved page.
// Previously opened its own MySQL pool (a second one, alongside lib/db's);
// now reads the bundled dataset like everything else.

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids") ?? "";
  const parsed = new Set(
    ids.split(",").map(Number).filter((n) => Number.isFinite(n) && n > 0).slice(0, 100),
  );
  if (!parsed.size) return NextResponse.json([]);

  const rows = (await getAllPackages("price")).filter((r) => parsed.has(r.package_id));
  return NextResponse.json(rows, { headers: { "Cache-Control": "private, max-age=300" } });
}
