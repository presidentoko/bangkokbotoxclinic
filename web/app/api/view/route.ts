import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { incrementProfileView } from "@/lib/dashboardStore";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { clinic_id } = (await req.json()) as { clinic_id?: string };
    if (!clinic_id) return NextResponse.json({ ok: false }, { status: 400 });
    // View counter inflation 방지 — IP × clinic 조합으로 1분에 5번까지만.
    // 정상 사용자는 SPA navigation 이라 1번이면 충분; 5번은 새로고침/실수 흡수용.
    // 카운터는 dashboard 메트릭일 뿐이라 Upstash 실패시 fail-OPEN.
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown")
      .split(",")[0].trim();
    if (ip !== "unknown" && !(await checkRateLimit({
      key: `view:${ip}:${clinic_id}`, limit: 5, windowSec: 60, failOpenOnError: true,
    }))) {
      // 조용히 200 — view counter 가 멈춰도 사용자에겐 보이지 않음.
      return NextResponse.json({ ok: true, throttled: true });
    }
    await incrementProfileView(clinic_id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
