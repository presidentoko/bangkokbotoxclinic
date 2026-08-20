import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listPartners } from "@/lib/partnerStore";
import { getLeadCount } from "@/lib/leadStore";
import { isAdminAuthed } from "@/lib/adminAuth";

export const maxDuration = 30;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const partners = await listPartners();
  const counts = await Promise.all(
    partners.map(async (p) => ({
      clinic_id: p.clinic_id,
      count: await getLeadCount(p.clinic_id),
    }))
  );

  const total = counts.reduce((s, x) => s + x.count, 0);
  return NextResponse.json({ total, by_clinic: counts });
}
