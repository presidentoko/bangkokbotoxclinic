// 관리: 클리닉 초대(입찰 링크 발급) · 요청 마감.

import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { createInvite, getRequest, listInvites, makeToken, saveRequest } from "@/lib/auctionStore";
import { getClinicById, loadMasterDb } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return new Response("unauthorized", { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { action?: string; req_id?: string; clinic_ids?: string[] };
  const r = await getRequest(String(body.req_id ?? ""));
  if (!r) return new Response("request not found", { status: 404 });

  if (body.action === "close") {
    if (r.status === "open") {
      r.status = "closed";
      await saveRequest(r);
    }
    return Response.json({ ok: true });
  }

  if (body.action === "invite") {
    const ids = Array.isArray(body.clinic_ids) ? body.clinic_ids.slice(0, 50).map(String) : [];
    const db = await loadMasterDb();
    const already = new Set((await listInvites(r.id)).map((i) => i.clinic_id));
    let created = 0;
    for (const id of ids) {
      if (already.has(id)) continue;
      const c = getClinicById(db.clinics, id);
      if (!c) continue;
      await createInvite({ token: makeToken(24), req_id: r.id, clinic_id: c.id, clinic_name: c.name, at: new Date().toISOString() });
      already.add(id);
      created++;
    }
    return Response.json({ ok: true, created });
  }

  return new Response("unknown action", { status: 400 });
}
