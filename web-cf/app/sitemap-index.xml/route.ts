import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";

// 내용이 상수 4줄짜리 인덱스 — 동적일 이유가 없음
export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = getSiteUrl();

// Sitemap index — robots.txt points here.
// /sitemap.xml          → hubs only (static pages, guides, districts, doctors)
// /sitemap-priority.xml → top-200 priority clinics (fast crawl seed)
// /sitemap-clinics.xml  → remaining clinics (dynamic, 2nd phase)
// /sitemap-locale.xml   → /th 클리닉 페이지 + hreflang 주석 (2026-08-06 신설 —
//                         이미 빌드돼 200을 반환하던 수천 페이지가 사이트맵에
//                         홈 2개만 올라가 있어 사실상 미발견 상태였음)
//
// 2026-09-15 에 /th·/ko 를 noindex 로 돌리면서 이 인덱스에서 locale 을 뺐고,
// LOCALES 배열도 비웠다. 2026-10-15 에 /th 만 되돌린다 — 그 noindex 의 근거였던
// "영어판 복제" 가 현지화 이후 사실이 아니고(라이브 14쌍: TH 전용 텍스트 중앙값
// 57%), 태국어가 이 사이트 클릭의 62%를 1.9~3.1위에서 벌고 있다. 색인 대상이
// 된 1,625장을 제출하지 않으면 hreflang 한 줄로만 발견돼야 한다.
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
