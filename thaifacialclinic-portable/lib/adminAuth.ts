import type { NextRequest } from "next/server";
import { verifyAdminSession } from "./adminSession";

export async function isAdminAuthed(req: NextRequest): Promise<boolean> {
  const sess = req.cookies.get("admin_session")?.value;
  return await verifyAdminSession(sess);
}

export async function isAdminAuthedFromCookies(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const sess = (await cookies()).get("admin_session")?.value;
  return await verifyAdminSession(sess);
}
