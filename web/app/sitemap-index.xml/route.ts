import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";

// Sitemap index — robots.txt points here.
// /sitemap.xml          → hubs only (static pages, guides, districts, doctors)
// /sitemap-priority.xml → top-200 priority clinics (fast crawl seed)
// /sitemap-clinics.xml  → remaining clinics (dynamic, 2nd phase)
export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap.xml</loc></sitemap>
  <sitemap><loc>${SITE}/sitemap-priority.xml</loc></sitemap>
  <sitemap><loc>${SITE}/sitemap-clinics.xml</loc></sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
