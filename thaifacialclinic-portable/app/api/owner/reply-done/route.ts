// Toggle the "reply done" mark for a review (review_hash from dashboardStore.reviewHash).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { verifyAccess } from "@/lib/dashboardAccessStore";
import { setReplyDone } from "@/lib/dashboardStore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    clinic_id?: string;
    access_token?: string;
    review_hash?: string;
    done?: boolean;
  };

  if (!body.clinic_id || !body.review_hash) {
    return NextResponse.json({ ok: false, error: "clinic_id + review_hash required" }, { status: 400 });
  }

  const staff = await isAdminAuthed(req);
  const tokenOk = body.access_token ? await verifyAccess(body.clinic_id, body.access_token) : false;
  if (!staff && !tokenOk) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const ok = await setReplyDone(body.clinic_id, body.review_hash, Boolean(body.done));
  return NextResponse.json({ ok });
}
