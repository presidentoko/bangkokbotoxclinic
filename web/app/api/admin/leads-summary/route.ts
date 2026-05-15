import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allPartners } from "@/lib/partners";
import { getLeadCount } from "@/lib/leadStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected || key !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const partners = allPartners();
  const counts = await Promise.all(
    partners.map(async (p) => ({
      clinic_id: p.clinic_id,
      count: await getLeadCount(p.clinic_id),
    }))
  );

  const total = counts.reduce((s, x) => s + x.count, 0);
  return NextResponse.json({ total, by_clinic: counts });
}
