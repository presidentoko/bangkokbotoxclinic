// Admin-only: issue / revoke per-clinic dashboard access tokens.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { createAccess, revokeAccess, getAccess } from "@/lib/dashboardAccessStore";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ ok: false }, { status: 401 });
  const id = req.nextUrl.searchParams.get("clinic_id");
  if (!id) return NextResponse.json({ ok: false, error: "clinic_id required" }, { status: 400 });
  const token = await getAccess(id);
  return NextResponse.json({ ok: true, token });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ ok: false }, { status: 401 });
  const { clinic_id } = (await req.json()) as { clinic_id?: string };
  if (!clinic_id) return NextResponse.json({ ok: false, error: "clinic_id required" }, { status: 400 });
  const token = await createAccess(clinic_id);
  return NextResponse.json({ ok: true, token });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ ok: false }, { status: 401 });
  const { clinic_id } = (await req.json()) as { clinic_id?: string };
  if (!clinic_id) return NextResponse.json({ ok: false, error: "clinic_id required" }, { status: 400 });
  await revokeAccess(clinic_id);
  return NextResponse.json({ ok: true });
}
