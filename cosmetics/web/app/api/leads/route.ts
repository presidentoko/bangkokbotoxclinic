import { NextRequest, NextResponse } from "next/server";
import { kvSet, kvGet } from "@/lib/kv";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function POST(req: NextRequest) {
  const { email, skin, concern, budget } = await req.json();
  if (!isValidEmail(email ?? "")) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const raw = await kvGet("leads");
  const leads: object[] = raw ? JSON.parse(raw as string) : [];
  leads.push({ email, skin, concern, budget, ts: new Date().toISOString() });
  await kvSet("leads", JSON.stringify(leads));

  return NextResponse.json({ ok: true });
}
