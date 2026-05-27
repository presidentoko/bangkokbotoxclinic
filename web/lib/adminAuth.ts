// 어드민 API 라우트 인증 — 쿠키 (admin_session) 토큰을 Upstash 와 대조.
// 쿠키는 /api/admin/auth 로그인 시 발급 (random opaque token, NOT the passcode).
// 쿠키가 leak 되어도 passcode 는 복원 불가.

import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSession } from "./adminSession";
import { verifyAccess } from "./dashboardAccessStore";

export async function isAdminAuthed(req: NextRequest): Promise<boolean> {
  const cookieVal = req.cookies.get("admin_session")?.value;
  if (!cookieVal) return false;
  return verifyAdminSession(cookieVal);
}

// Server component / route segment 용. NextRequest 없이 next/headers 의 cookies() 사용.
export async function isAdminAuthedFromCookies(): Promise<boolean> {
  const jar = await cookies();
  const cookieVal = jar.get("admin_session")?.value;
  if (!cookieVal) return false;
  return verifyAdminSession(cookieVal);
}

// 대쉬보드 API 인증: 운영 admin OR 해당 클리닉 owner 만 통과.
// owner 는 dashboard page 가 받은 ?k=TOKEN 을 client 에서 x-dashboard-token 헤더로 전달.
export async function isDashboardAuthed(
  req: NextRequest,
  clinicId: string | undefined,
): Promise<boolean> {
  if (await isAdminAuthed(req)) return true;
  if (!clinicId) return false;
  const token = req.headers.get("x-dashboard-token");
  if (!token) return false;
  return verifyAccess(clinicId, token);
}
