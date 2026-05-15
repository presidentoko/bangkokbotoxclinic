import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { incrementProfileView } from "@/lib/dashboardStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { clinic_id } = (await req.json()) as { clinic_id?: string };
    if (!clinic_id) return NextResponse.json({ ok: false }, { status: 400 });
    await incrementProfileView(clinic_id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
