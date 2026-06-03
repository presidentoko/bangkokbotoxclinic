import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminSession, revokeAdminSession, adminLoginRateLimitOk } from "@/lib/adminSession";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
}

function originOk(req: NextRequest): boolean {
  const origin = req.headers.get("origin") || "";
  const host = req.headers.get("host") || "";
  if (!origin) return true; // server-to-server / curl (no origin) — still need passcode
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!originOk(req)) {
    return NextResponse.json({ ok: false, error: "origin" }, { status: 403 });
  }
  const ip = clientIp(req);
  if (!(await adminLoginRateLimitOk(ip))) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  const { passcode } = (await req.json()) as { passcode?: string };
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected || passcode !== expected) {
    // Constant-time-ish delay to slow timing oracles
    await new Promise((r) => setTimeout(r, 200));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = await createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

export async function DELETE(req: NextRequest) {
  const sess = req.cookies.get("admin_session")?.value;
  await revokeAdminSession(sess);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", "", { path: "/", maxAge: 0 });
  return res;
}
