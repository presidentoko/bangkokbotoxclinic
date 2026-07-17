// app/api/resolve-link/route.ts
// Resolves TikTok/IG links to place candidates using oEmbed
// Never scrapes content — uses public oEmbed endpoints only
// Falls back gracefully when oEmbed unavailable

import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/search";

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  for (const [key, e] of RATE_LIMIT) {
    if (now > e.resetAt) RATE_LIMIT.delete(key);
  }
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function extractPlaceCandidates(text: string): string[] {
  const candidates: string[] = [];

  // Hashtag-based: #CafeName #PlaceName
  const hashtagMatches = text.match(/#[\w฀-๿]+/g) ?? [];
  for (const tag of hashtagMatches) {
    const cleaned = tag.replace("#", "").trim();
    if (cleaned.length >= 3 && !/^\d+$/.test(cleaned)) {
      candidates.push(cleaned);
    }
  }

  // Location-tagged patterns: "at X", "@ X", "📍 X"
  const atMatches = text.match(/(?:at|@|📍|ที่)\s+([\w฀-๿\s]{3,30})/gi) ?? [];
  for (const m of atMatches) {
    const cleaned = m.replace(/^(?:at|@|📍|ที่)\s+/i, "").trim().split(/[,.\n]/)[0].trim();
    if (cleaned.length >= 3) candidates.push(cleaned);
  }

  // Deduplicate
  return [...new Set(candidates)].slice(0, 5);
}

async function fetchOembed(url: string): Promise<string | null> {
  // TikTok oEmbed — public, no auth required
  if (url.includes("tiktok.com")) {
    try {
      const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const res = await fetch(endpoint, {
        headers: { "User-Agent": "Thaigle/1.0 (+https://thaigle.com)" },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = (await res.json()) as { title?: string; author_name?: string };
        return [data.title, data.author_name].filter(Boolean).join(" ");
      }
    } catch {
      // oEmbed failed — fall through to null
    }
  }

  // Instagram oEmbed — requires app token for public posts
  if (url.includes("instagram.com")) {
    try {
      if (!process.env.INSTAGRAM_APP_TOKEN) return null;
      const endpoint = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${process.env.INSTAGRAM_APP_TOKEN}`;
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = (await res.json()) as { title?: string };
        return data.title ?? null;
      }
    } catch {
      // oEmbed failed
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let url: string;
  try {
    const body = (await req.json()) as { url: string };
    url = typeof body.url === "string" ? body.url.trim() : "";
    if (!url || url.length > 2000 || !url.startsWith("http")) throw new Error("invalid");
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Detect login walls / blocked content — never attempt to bypass
  if (url.includes("/login") || url.includes("accounts/login")) {
    return NextResponse.json({
      status: "blocked",
      message: "Login required — cannot extract place",
      fallback: "Please type the place name directly",
    });
  }

  // Try oEmbed first
  const caption = await fetchOembed(url);

  if (!caption) {
    return NextResponse.json({
      status: "no_caption",
      message: "Could not extract caption from this link",
      fallback: "Please type the place name directly",
    });
  }

  const candidates = extractPlaceCandidates(caption);

  if (candidates.length === 0) {
    return NextResponse.json({
      status: "no_candidates",
      caption: caption.slice(0, 200),
      message: "No place names found in caption",
      fallback: "Please type the place name directly",
    });
  }

  // Match candidates against places DB
  const matches = candidates.flatMap((c) => searchPlaces(c, 3));
  const dedupedMatches = matches
    .filter((m, i, arr) => arr.findIndex((x) => x.slug === m.slug) === i)
    .slice(0, 4);

  if (dedupedMatches.length === 0) {
    // Log miss for queue
    await logVerificationRequest({ query: caption.slice(0, 200), url, candidates });
    return NextResponse.json({
      status: "no_match",
      candidates,
      message: "Place not in our database yet — added to verification queue",
    });
  }

  return NextResponse.json({
    status: "matched",
    candidates,
    matches: dedupedMatches,
    needsConfirmation: dedupedMatches.length > 1,
  });
}

async function logVerificationRequest(req: {
  query: string;
  url: string;
  candidates: string[];
}) {
  // TODO: persist to DB/KV
  // For now: console.log (pipe to file in production)
  console.log(
    "[verification-queue]",
    JSON.stringify({ ...req, timestamp: new Date().toISOString() })
  );
}
