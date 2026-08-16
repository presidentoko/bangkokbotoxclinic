import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const BASE = "https://www.thaigle.com";
const INDEXNOW_KEY = "5a0f5c4a831c592c1e29749b83d79299";

/**
 * Pushes every sitemap URL to IndexNow, which fans out to Bing, Yandex, Naver
 * and Seznam from one call. The /public/{key}.txt file is the ownership proof;
 * no per-engine account verification is needed.
 *
 * Google does not consume IndexNow, so this does nothing for Search Console
 * directly. It is here for two other reasons:
 *
 *  - Answer engines. ChatGPT Search and Copilot retrieve through Bing's index,
 *    so being absent from Bing means being uncitable by them regardless of how
 *    good the markup is.
 *  - Naver, for the /ko tree.
 *
 * Ported from cosmetics/web, which has run this shape for months.
 */
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`, { cache: "no-store" });
  if (!sitemapRes.ok) {
    return NextResponse.json({ error: `sitemap ${sitemapRes.status}` }, { status: 502 });
  }
  const xml = await sitemapRes.text();
  const urlList = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
  if (urlList.length === 0) {
    return NextResponse.json({ error: "No URLs found in sitemap" }, { status: 500 });
  }

  // IndexNow accepts up to 10,000 URLs per request.
  const results: { status: number; count: number }[] = [];
  for (let i = 0; i < urlList.length; i += 10000) {
    const batch = urlList.slice(i, i + 10000);
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.thaigle.com",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      }),
    });
    results.push({ status: res.status, count: batch.length });
  }

  return NextResponse.json({ submitted: urlList.length, batches: results });
}
