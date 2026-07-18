import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const BASE = "https://bangkokfillers.com";
const INDEXNOW_KEY = "d82003b907760a7fb6c6c1e4d618cb13";

// Pushes every URL in our sitemap to the IndexNow endpoint, which fans out
// to Bing, Yandex, Naver and Seznam in one call (no per-engine account
// verification needed — the /public/{key}.txt file below is the proof).
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`, { cache: "no-store" });
  const xml = await sitemapRes.text();
  const urlList = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);

  if (urlList.length === 0) {
    return NextResponse.json({ error: "No URLs found in sitemap" }, { status: 500 });
  }

  // IndexNow accepts up to 10,000 URLs per request.
  const batches: string[][] = [];
  for (let i = 0; i < urlList.length; i += 10000) {
    batches.push(urlList.slice(i, i + 10000));
  }

  const results: { status: number; count: number }[] = [];
  for (const batch of batches) {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "bangkokfillers.com",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      }),
    });
    results.push({ status: res.status, count: batch.length });
  }

  return NextResponse.json({ submitted: urlList.length, batches: results });
}
