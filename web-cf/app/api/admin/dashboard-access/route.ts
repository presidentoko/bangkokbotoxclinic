// Admin-only API: 클리닉 dashboard 액세스 토큰 발급/조회/무효화.
// GET    ?clinic_id=...  → { token: string | null }
// POST   { clinic_id }   → { token } (regenerate — 기존 토큰 무효화)
// DELETE { clinic_id }   → { ok: true }
//
// 클리닉 owner 에게 보낼 URL: `${origin}/dashboard/${clinic_id}?k=${token}`

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { createAccess, getAccess, revokeAccess } from "@/lib/dashboardAccessStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const clinicId = req.nextUrl.searchParams.get("clinic_id");
  if (!clinicId) return NextResponse.json({ error: "clinic_id required" }, { status: 400 });
  const token = await getAccess(clinicId);
  return NextResponse.json({ token });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { clinic_id?: string };
  if (!body.clinic_id) return NextResponse.json({ error: "clinic_id required" }, { status: 400 });
  const token = await createAccess(body.clinic_id);
  return NextResponse.json({ token });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { clinic_id?: string };
  if (!body.clinic_id) return NextResponse.json({ error: "clinic_id required" }, { status: 400 });
  await revokeAccess(body.clinic_id);
  return NextResponse.json({ ok: true });
}
