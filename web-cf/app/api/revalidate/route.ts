// ISR revalidation endpoint — called by the data pipeline after a successful push.
// Protected by REVALIDATE_TOKEN secret.
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const TOKEN = process.env.REVALIDATE_TOKEN;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!TOKEN) {
    return new Response("REVALIDATE_TOKEN not configured", { status: 500 });
  }
  if (token !== TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/c", "layout");

  return Response.json({ ok: true, revalidated: true, ts: Date.now() });
}

export async function GET() {
  return new Response("Use POST with ?token=<secret>", { status: 405 });
}
