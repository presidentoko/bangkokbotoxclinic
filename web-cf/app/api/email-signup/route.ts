import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { addEmailSignup } from "@/lib/dashboardStore";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

// Loose email check — server-side defense against accidental garbage,
// not a strict RFC validator. Real validation happens at send time.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: { email?: string; clinic_id?: string };
  try {
    body = (await req.json()) as { email?: string; clinic_id?: string };
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  const clinicId = (body.clinic_id || "").trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if (!clinicId) {
    return NextResponse.json({ error: "clinic_id required" }, { status: 400 });
  }
  // 같은 IP 가 10분에 5번까지만. 폼 friction 최소화 위해 Upstash 실패시 fail-OPEN.
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown")
    .split(",")[0].trim();
  if (ip !== "unknown" && !(await checkRateLimit({
    key: `email-signup:${ip}`, limit: 5, windowSec: 600, failOpenOnError: true,
  }))) {
    return NextResponse.json({ error: "rate limit" }, { status: 429 });
  }
  const ok = await addEmailSignup(email, clinicId);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
