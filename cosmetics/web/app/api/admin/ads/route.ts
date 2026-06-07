import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdSlots, saveAdSlots, makeAdId, AdSlot } from "@/lib/ads";

async function authorized() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const jar = await cookies();
  return jar.get("admin_s")?.value === pw;
}

// GET /api/admin/ads — list all slots
export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAdSlots());
}

// POST /api/admin/ads — create slot
export async function POST(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json() as Omit<AdSlot, "id">;
  const slots = await getAdSlots();
  const newSlot: AdSlot = { ...body, id: makeAdId() };
  await saveAdSlots([...slots, newSlot]);
  return NextResponse.json(newSlot, { status: 201 });
}

// DELETE /api/admin/ads?id=xxx — remove slot
export async function DELETE(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const slots = await getAdSlots();
  await saveAdSlots(slots.filter((s) => s.id !== id));
  return NextResponse.json({ ok: true });
}

// PATCH /api/admin/ads?id=xxx — toggle active
export async function PATCH(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { active } = await req.json();
  const slots = await getAdSlots();
  await saveAdSlots(slots.map((s) => s.id === id ? { ...s, active } : s));
  return NextResponse.json({ ok: true });
}
