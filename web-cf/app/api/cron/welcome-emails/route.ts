// Vercel Cron — 매일 한 번 호출, Day 3/7/14/30 환영 이메일 발송.
// vercel.json 의 crons[] 에 등록되어 있어야 함.
// 인증: Vercel Cron 은 자동으로 Authorization: Bearer ${CRON_SECRET} 헤더 보냄.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listPartners } from "@/lib/partnerStore";
import { processWelcomeQueue } from "@/lib/welcomeEmails";

export const maxDuration = 60;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Vercel Cron 인증 — env CRON_SECRET 과 일치하는 Bearer 토큰만 허용.
  // fail-closed: CRON_SECRET 미설정이면 503 (이전엔 인증 스킵하던 버그).
  const auth = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    console.error("[cron.welcome] CRON_SECRET not configured — refusing");
    return NextResponse.json({ error: "cron not configured" }, { status: 503 });
  }
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const partners = await listPartners();
  const result = await processWelcomeQueue(partners);
  console.log("[cron.welcome] processed", result.checked, "partners, sent", result.sent);
  return NextResponse.json(result);
}
