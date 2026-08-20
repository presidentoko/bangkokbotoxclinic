import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return NextResponse.json({ ok: true, redis: "disabled" });
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["PING"]),
      cache: "no-store",
    });
    const j = await res.json();
    return NextResponse.json({ ok: true, redis: j?.result ?? "unknown" });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
