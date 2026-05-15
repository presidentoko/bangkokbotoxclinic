// 어드민 API 라우트 인증 — 쿠키 (httpOnly admin_session) 또는 헤더 (x-admin-key) 둘 다 허용.
// 쿠키는 /admin 페이지 로그인 시 발급, 7일 유효. JS에서 못 읽지만 fetch는 자동 첨부.
// 헤더는 sessionStorage 기반 fallback — 둘 중 하나라도 맞으면 통과.

import type { NextRequest } from "next/server";

export function isAdminAuthed(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) return false;

  // Try cookie first (preferred — httpOnly, set at login)
  const cookieVal = req.cookies.get("admin_session")?.value ?? "";
  if (cookieVal) {
    try {
      if (Buffer.from(cookieVal, "base64").toString("utf-8") === expected) return true;
    } catch { /* fall through */ }
  }

  // Fallback: x-admin-key header (sessionStorage-based)
  const headerKey = req.headers.get("x-admin-key");
  if (headerKey && headerKey === expected) return true;

  return false;
}
