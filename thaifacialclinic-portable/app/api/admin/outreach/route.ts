// Admin-only: outreach pipeline.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { listOutreach, upsertOutreach, removeOutreach, type OutreachEntry } from "@/lib/outreachStore";

export const runtime = "nodejs";

async function ensureAdmin(req: NextRequest) {
  if (!(await isAdminAuthed(req))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const entries = await listOutreach();
  return NextResponse.json({ ok: true, entries });
}

export async function POST(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const body = (await req.json()) as Partial<OutreachEntry> & { clinic_id?: string };
  if (!body.clinic_id) return NextResponse.json({ ok: false, error: "clinic_id required" }, { status: 400 });
  const result = await upsertOutreach(body as Partial<OutreachEntry> & { clinic_id: string });
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const { clinic_id } = (await req.json()) as { clinic_id?: string };
  if (!clinic_id) return NextResponse.json({ ok: false, error: "clinic_id required" }, { status: 400 });
  const result = await removeOutreach(clinic_id);
  return NextResponse.json(result);
}
