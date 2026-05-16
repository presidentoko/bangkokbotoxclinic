import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listOutreach, upsertOutreach, deleteOutreach, type OutreachRecord } from "@/lib/outreachStore";
import { isAdminAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const records = await listOutreach();
  return NextResponse.json({ records });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as Omit<OutreachRecord, "last_updated">;
  if (!body.clinic_id || !body.outcome) {
    return NextResponse.json({ error: "clinic_id and outcome required" }, { status: 400 });
  }
  const ok = await upsertOutreach(body);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { clinic_id } = (await req.json()) as { clinic_id?: string };
  if (!clinic_id) return NextResponse.json({ error: "clinic_id required" }, { status: 400 });
  const ok = await deleteOutreach(clinic_id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
