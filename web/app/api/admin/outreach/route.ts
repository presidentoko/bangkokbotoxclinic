import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listOutreach, upsertOutreach, deleteOutreach, type OutreachRecord } from "@/lib/outreachStore";
import { isAdminAuthed } from "@/lib/adminAuth";
import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import type { Clinic } from "@/lib/types";

export const maxDuration = 30;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const records = await listOutreach();

  // Enrich with current clinic context — trust score, district rank, unanswered negs.
  // Lets the OutreachTab show hot prospects vs cold without per-row fetches.
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const byId = new Map(focused.map((c) => [c.id, c]));

  // Pre-compute district rank once
  const byDistrict = new Map<string, Clinic[]>();
  for (const c of focused) {
    const key = c.district || "_unknown";
    if (!byDistrict.has(key)) byDistrict.set(key, []);
    byDistrict.get(key)!.push(c);
  }
  for (const list of byDistrict.values()) list.sort((a, b) => b.trust_score - a.trust_score);
  const rankByClinic = new Map<string, { rank: number; total: number }>();
  for (const [, list] of byDistrict.entries()) {
    list.forEach((c, idx) => rankByClinic.set(c.id, { rank: idx + 1, total: list.length }));
  }

  const enriched = records.map((r) => {
    const c = byId.get(r.clinic_id);
    if (!c) return { ...r, enriched: null };
    const rankInfo = rankByClinic.get(r.clinic_id);
    return {
      ...r,
      enriched: {
        trust_score: c.trust_score,
        district: c.district || "",
        rating: c.rating,
        total_reviews: c.total_reviews,
        unanswered_neg_reviews: c.sample_reviews_negative?.length ?? 0,
        rank_district: rankInfo?.rank ?? 0,
        district_total: rankInfo?.total ?? 0,
      },
    };
  });

  return NextResponse.json({ records: enriched });
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
