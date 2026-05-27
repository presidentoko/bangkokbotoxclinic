import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateAiReply } from "@/lib/aiReply";
import type { ReplyStyle } from "@/lib/replyDrafts";
import { isDashboardAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    clinic_id?: string;
    review_text?: string;
    clinic_name?: string;
    author_name?: string;
    style?: number;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const clinicId = (body.clinic_id || "").trim();
  const reviewText = (body.review_text || "").trim();
  const clinicName = (body.clinic_name || "").trim();
  const authorName = (body.author_name || "").trim();
  const styleNum = typeof body.style === "number" ? body.style : 0;
  if (!reviewText || !clinicName) {
    return NextResponse.json({ error: "review_text and clinic_name required" }, { status: 400 });
  }
  if (![0, 1, 2].includes(styleNum)) {
    return NextResponse.json({ error: "style must be 0|1|2" }, { status: 400 });
  }
  // AI 호출은 비용이 들어가므로 admin OR clinic owner 만 허용.
  if (!(await isDashboardAuthed(req, clinicId))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const style = styleNum as ReplyStyle;
  const result = await generateAiReply({ reviewText, clinicName, authorName, style });
  return NextResponse.json(result);
}
