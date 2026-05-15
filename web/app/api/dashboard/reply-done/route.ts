import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { setReplyDone } from "@/lib/dashboardStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { clinic_id, hash, done } = (await req.json()) as {
    clinic_id?: string;
    hash?: string;
    done?: boolean;
  };

  if (!clinic_id || !hash) {
    return NextResponse.json({ error: "clinic_id and hash required" }, { status: 400 });
  }

  const ok = await setReplyDone(clinic_id, hash, done !== false);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
