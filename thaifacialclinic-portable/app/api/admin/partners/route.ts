// Admin-only: partner CRUD.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { listPartners, addPartner, updatePartner, removePartner, type ClinicPartner } from "@/lib/partnerStore";

export const runtime = "nodejs";

async function ensureAdmin(req: NextRequest) {
  if (!(await isAdminAuthed(req))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const partners = await listPartners();
  return NextResponse.json({ ok: true, partners });
}

export async function POST(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const body = (await req.json()) as ClinicPartner;
  if (!body.clinic_id) return NextResponse.json({ ok: false, error: "clinic_id required" }, { status: 400 });
  const result = await addPartner(body);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function PATCH(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const body = (await req.json()) as { clinic_id: string } & Partial<Omit<ClinicPartner, "clinic_id">>;
  if (!body.clinic_id) return NextResponse.json({ ok: false, error: "clinic_id required" }, { status: 400 });
  const { clinic_id, ...patch } = body;
  const result = await updatePartner(clinic_id, patch);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}

export async function DELETE(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const { clinic_id } = (await req.json()) as { clinic_id?: string };
  if (!clinic_id) return NextResponse.json({ ok: false, error: "clinic_id required" }, { status: 400 });
  const result = await removePartner(clinic_id);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}
