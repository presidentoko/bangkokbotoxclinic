import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminSession, adminLoginRateLimitOk } from "@/lib/adminSession";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await adminLoginRateLimitOk(ip))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const { username, passcode } = (await req.json()) as { username?: string; passcode?: string };
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSCODE;

  if (!expectedPass || passcode !== expectedPass || (expectedUser && username !== expectedUser)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = await createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
