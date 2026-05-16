import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listPartners, addPartner, updatePartner, removePartner } from "@/lib/partnerStore";
import type { ClinicPartner } from "@/lib/partners";
import { isAdminAuthed } from "@/lib/adminAuth";
import { sendWelcomeEmail } from "@/lib/welcomeEmails";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const partners = await listPartners();
  return NextResponse.json({ partners });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as ClinicPartner;
  if (!body.clinic_id || !body.plan_tier) {
    return NextResponse.json({ error: "clinic_id and plan_tier required" }, { status: 400 });
  }
  const result = await addPartner(body);
  // Day 0 welcome email — fire-and-forget, don't block partner creation on email
  if (result.ok && body.contact_email) {
    sendWelcomeEmail(body, 0).catch((e) => console.error("[welcome day0]", e));
  }
  return NextResponse.json(result, { status: result.ok ? 201 : 409 });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as { clinic_id: string } & Partial<ClinicPartner>;
  if (!body.clinic_id) {
    return NextResponse.json({ error: "clinic_id required" }, { status: 400 });
  }
  const { clinic_id, ...patch } = body;
  const result = await updatePartner(clinic_id, patch);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { clinic_id } = (await req.json()) as { clinic_id: string };
  if (!clinic_id) return NextResponse.json({ error: "clinic_id required" }, { status: 400 });
  const result = await removePartner(clinic_id);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}
