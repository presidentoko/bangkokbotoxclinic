// Admin: 한 클리닉의 영업 정보 (trust, district, rank, pitch hook 등). Compose modal에서 사용.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loadMasterDb } from "@/lib/data";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getSiteConfig, applySiteFilter } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const clinicId = url.searchParams.get("clinic_id");
  if (!clinicId) return NextResponse.json({ error: "clinic_id required" }, { status: 400 });

  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const clinic = db.clinics.find((c) => c.id === clinicId);
  if (!clinic) return NextResponse.json({ error: "not found" }, { status: 404 });

  // District rank — recompute against site-filtered population for relevance
  const focused = applySiteFilter(db.clinics, cfg);
  const sameDistrict = focused
    .filter((c) => (c.district || "_unknown") === (clinic.district || "_unknown"))
    .sort((a, b) => b.trust_score - a.trust_score);
  const rank = sameDistrict.findIndex((c) => c.id === clinicId) + 1;

  const neg = clinic.sample_reviews_negative?.length ?? 0;
  const lang = (() => {
    const l = clinic.language_breakdown;
    const pairs: [string, number][] = [
      ["EN", l.en], ["TH", l.th], ["KO", l.ko], ["JA", l.ja], ["other", l.other],
    ];
    return pairs.sort((a, b) => b[1] - a[1])[0][0];
  })();

  return NextResponse.json({
    clinic_id: clinic.id,
    name: clinic.name,
    district: clinic.district || "",
    city: clinic.city_label || "",
    trust_score: clinic.trust_score,
    rating: clinic.rating,
    total_reviews: clinic.total_reviews,
    rank_district: rank,
    district_total: sameDistrict.length,
    unanswered_neg_reviews: neg,
    primary_review_lang: lang,
    has_korean_reviewers: clinic.language_breakdown.ko > 0,
    has_japanese_reviewers: clinic.language_breakdown.ja > 0,
    dashboard_url: `${url.origin}/dashboard/${clinic.id}`,
    public_url: `${url.origin}/clinic/${clinic.id}`,
  });
}
