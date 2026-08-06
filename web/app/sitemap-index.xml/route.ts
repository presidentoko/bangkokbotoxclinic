import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";

// 내용이 상수 3줄짜리 인덱스 — 동적일 이유가 없음
export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = getSiteUrl();

// Sitemap index — robots.txt points here.
// /sitemap.xml          → hubs only (static pages, guides, districts, doctors)
// /sitemap-priority.xml → top-200 priority clinics (fast crawl seed)
// /sitemap-clinics.xml  → remaining clinics (dynamic, 2nd phase)
// /sitemap-locale.xml   → /th·/ko 클리닉 페이지 + hreflang 주석 (2026-08-06 신설 —
//                         이미 빌드돼 200을 반환하던 수천 페이지가 사이트맵에
//                         홈 2개만 올라가 있어 사실상 미발견 상태였음)
export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap.xml</loc></sitemap>
  <sitemap><loc>${SITE}/sitemap-priority.xml</loc></sitemap>
  <sitemap><loc>${SITE}/sitemap-clinics.xml</loc></sitemap>
  <sitemap><loc>${SITE}/sitemap-locale.xml</loc></sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
