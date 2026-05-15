import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { username, passcode } = (await req.json()) as { username?: string; passcode?: string };
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSCODE;

  if (!expectedPass || passcode !== expectedPass || (expectedUser && username !== expectedUser)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const value = Buffer.from(expectedPass).toString("base64");
  res.cookies.set("admin_session", value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
