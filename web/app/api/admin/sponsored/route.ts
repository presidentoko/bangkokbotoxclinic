import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { listSponsored, saveSponsored, type SponsoredMap } from "@/lib/sponsoredStore";
import { isAdminAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const sponsored = await listSponsored();
  return NextResponse.json({ sponsored });
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<SponsoredMap>;
  const next: SponsoredMap = {
    editors_pick: body.editors_pick ?? [],
    recommended:  body.recommended ?? [],
    featured:     body.featured ?? [],
  };
  const res = await saveSponsored(next);
  // ISR 즉시 무효화 — 홈/카테고리/도시 페이지 다음 요청 시 새로 빌드
  try {
    revalidatePath("/");
    revalidatePath("/ko");
    revalidatePath("/th");
  } catch {
    // revalidatePath 는 build-time path 없으면 noop — 무시
  }
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}
