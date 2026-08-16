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
 *
 * Scheduled 21:00 UTC in vercel.json, which is 04:00 Asia/Bangkok — the site's
 * own timezone, and the quietest hour for it. Vercel cron schedules are always
 * UTC, so the two never read the same.
 */
/**
 * Report the run to Telegram, where the site's other operational messages
 * already go. A cron's result is otherwise only visible in Vercel's log
 * viewer, which means noticing a silent failure requires remembering to look
 * — this way a broken run announces itself. Never throws: a failed
 * notification must not turn a successful submission into a 500.
 */
async function notify(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("[thaigle-indexnow] telegram delivery threw", err);
  }
}

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`, { cache: "no-store" });
  if (!sitemapRes.ok) {
    await notify(`⚠️ <b>Thaigle IndexNow</b>\nsitemap.xml returned ${sitemapRes.status} — nothing submitted.`);
    return NextResponse.json({ error: `sitemap ${sitemapRes.status}` }, { status: 502 });
  }
  const xml = await sitemapRes.text();
  const urlList = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
  if (urlList.length === 0) {
    await notify("⚠️ <b>Thaigle IndexNow</b>\nsitemap.xml parsed to 0 URLs — nothing submitted.");
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

  // IndexNow answers 200 or 202 on acceptance; 403 means the key file no
  // longer matches, 422 that the host/URL set was rejected. Those are the
  // failures worth being told about.
  const bad = results.filter((r) => r.status !== 200 && r.status !== 202);
  await notify(
    bad.length === 0
      ? `✅ <b>Thaigle IndexNow</b>\n${urlList.length.toLocaleString()} URLs submitted to Bing / Yandex / Naver / Seznam in ${results.length} batch(es).`
      : `⚠️ <b>Thaigle IndexNow</b>\n${urlList.length.toLocaleString()} URLs attempted — ${bad.length} batch(es) rejected: ${bad.map((r) => r.status).join(", ")}`,
  );

  return NextResponse.json({ submitted: urlList.length, batches: results });
}
