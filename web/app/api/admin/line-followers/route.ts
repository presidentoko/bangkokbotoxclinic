import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listLineFollowers, saveLineFollower, getLineFollower } from "@/lib/lineCapture";
import { isAdminAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const followers = await listLineFollowers();
  return NextResponse.json({ followers });
}

/** PATCH { user_id, matched_clinic_id } — link a follower to a partner clinic */
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { user_id, matched_clinic_id } = (await req.json()) as { user_id?: string; matched_clinic_id?: string };
  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
  const existing = await getLineFollower(user_id);
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  existing.matched_clinic_id = matched_clinic_id || undefined;
  const ok = await saveLineFollower(existing);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
