// 영업 대상 클리닉 CSV export.
// 필터: Trust ≥ 75 + 파트너 아님 + 리뷰 활성 + 영어/태국어 응대 가능 (mentioned_topics 추출).
// per-clinic pitch hook 자동 생성.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loadMasterDb } from "@/lib/data";
import { listPartners } from "@/lib/partnerStore";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import type { Clinic } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const minTrust = parseInt(url.searchParams.get("min_trust") ?? "75", 10);
  const minReviews = parseInt(url.searchParams.get("min_reviews") ?? "50", 10);
  const city = url.searchParams.get("city") ?? "";
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "200", 10), 500);

  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const partnerIds = new Set((await listPartners()).map((p) => p.clinic_id));

  // Build district rank map — for "you're #N in [district]" hook
  const focused = applySiteFilter(db.clinics, cfg);
  const byDistrict = new Map<string, Clinic[]>();
  for (const c of focused) {
    const key = c.district || "_unknown";
    if (!byDistrict.has(key)) byDistrict.set(key, []);
    byDistrict.get(key)!.push(c);
  }
  for (const list of byDistrict.values()) list.sort((a, b) => b.trust_score - a.trust_score);
  const districtRank = new Map<string, number>();
  for (const [d, list] of byDistrict.entries()) {
    list.forEach((c, idx) => districtRank.set(`${d}:${c.id}`, idx + 1));
  }

  // Filter prospects
  const prospects = focused
    .filter((c) => !partnerIds.has(c.id))
    .filter((c) => c.trust_score >= minTrust)
    .filter((c) => c.total_reviews >= minReviews)
    .filter((c) => !city || c.city_label === city || c.city_slug === city.toLowerCase())
    .filter((c) => c.phone || c.website)   // must have contact channel
    .filter((c) => c.business_status === "Open" || !c.business_status)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, limit);

  const origin = url.origin;
  const rows = prospects.map((c) => buildRow(c, districtRank.get(`${c.district || "_unknown"}:${c.id}`) ?? 0, origin));

  if (url.searchParams.get("format") === "json") {
    return NextResponse.json({ count: rows.length, rows });
  }

  // CSV stream
  const csv = toCSV(rows);
  const fname = `prospects_${cfg.focus}_${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fname}"`,
    },
  });
}

type ProspectRow = {
  rank_district: number;
  clinic_id: string;
  name: string;
  district: string;
  city: string;
  phone: string;
  website: string;
  trust_score: number;
  rating: number;
  total_reviews: number;
  recent_reviews_30d: number;
  has_english_reviewers: string;
  has_korean_reviewers: string;
  has_japanese_reviewers: string;
  primary_review_lang: string;
  dashboard_url: string;
  pitch_hook: string;
  unanswered_neg_reviews: number;
};

function topLang(c: Clinic): string {
  const l = c.language_breakdown;
  const pairs: [string, number][] = [
    ["EN", l.en], ["TH", l.th], ["KO", l.ko], ["JA", l.ja], ["other", l.other],
  ];
  return pairs.sort((a, b) => b[1] - a[1])[0][0];
}

function buildRow(c: Clinic, rankDistrict: number, origin: string): ProspectRow {
  const negReviews = c.sample_reviews_negative?.length ?? 0;
  const recent = c.rating_trend.recent.count;
  const lang = topLang(c);

  // pitch hook — 가장 강한 영업 포인트 한 줄
  let hook = "";
  if (rankDistrict > 0 && rankDistrict <= 3) {
    hook = `Top ${rankDistrict} in ${c.district} — visible to every searcher`;
  } else if (rankDistrict > 0 && rankDistrict <= 10) {
    hook = `Ranked #${rankDistrict} in ${c.district} — already strong, leads waiting`;
  } else if (negReviews >= 3) {
    hook = `${negReviews} negative reviews unanswered — AI reply drafts ready`;
  } else if (recent >= 10) {
    hook = `${recent} recent reviews — momentum to convert`;
  } else {
    hook = `Trust ${c.trust_score} — strong fundamentals`;
  }

  return {
    rank_district: rankDistrict,
    clinic_id: c.id,
    name: c.name,
    district: c.district || "",
    city: c.city_label || "",
    phone: c.phone || "",
    website: c.website || "",
    trust_score: c.trust_score,
    rating: c.rating,
    total_reviews: c.total_reviews,
    recent_reviews_30d: recent,
    has_english_reviewers: c.language_breakdown.en > 0 ? "Y" : "",
    has_korean_reviewers: c.language_breakdown.ko > 0 ? "Y" : "",
    has_japanese_reviewers: c.language_breakdown.ja > 0 ? "Y" : "",
    primary_review_lang: lang,
    dashboard_url: `${origin}/dashboard/${c.id}`,
    pitch_hook: hook,
    unanswered_neg_reviews: negReviews,
  };
}

function csvEscape(v: string | number): string {
  if (typeof v === "number") return v.toString();
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCSV(rows: ProspectRow[]): string {
  if (rows.length === 0) return "no prospects matched filters\n";
  const headers = Object.keys(rows[0]) as (keyof ProspectRow)[];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => csvEscape(r[h] as string | number)).join(","));
  }
  return "﻿" + lines.join("\n");  // BOM for Excel UTF-8
}
