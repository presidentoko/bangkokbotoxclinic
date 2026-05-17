import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { addEmailSignup } from "@/lib/dashboardStore";

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
  const ok = await addEmailSignup(email, clinicId);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
