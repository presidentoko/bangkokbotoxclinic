// app/api/admin-auth/route.ts
// Server-side passcode check for /admin/analytics. Previously the page
// compared against NEXT_PUBLIC_ADMIN_PASSCODE, which Next.js inlines into
// the client JS bundle — anyone could read the real passcode from the
// shipped source. Falls back to that same env var (read here, server-side
// only, so it's never bundled) so this works without provisioning a new
// Vercel env var.
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PASSCODE = process.env.ADMIN_PASSCODE || process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "";
const COOKIE = "thaigle_admin";

function sessionToken(): string {
  return crypto.createHash("sha256").update(`thaigle-admin-session:${PASSCODE}`).digest("hex");
}

export async function GET(req: NextRequest) {
  if (!PASSCODE) return NextResponse.json({ unlocked: true });
  const cookie = req.cookies.get(COOKIE)?.value;
  return NextResponse.json({ unlocked: !!cookie && cookie === sessionToken() });
}

export async function POST(req: NextRequest) {
  if (!PASSCODE) return NextResponse.json({ ok: true });
  let code = "";
  try {
    const body = await req.json();
    code = typeof body?.code === "string" ? body.code : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (code !== PASSCODE) return NextResponse.json({ ok: false }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
