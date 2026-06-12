import { NextResponse } from "next/server";
import { rcmd } from "@/lib/upstash";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function GET() {
  const result = await rcmd(["PING"]);
  return NextResponse.json({ ok: true, redis: result ?? "disabled" });
}
