// 손님이 입찰 하나를 고른다 → 형이 양쪽을 연결하도록 텔레그램에 재료를 다 모아 보낸다.
// 클리닉 연락처는 손님에게 보여주지 않는다 (연결은 형이 한다).

import { getRequestBySecret, listBids, saveRequest } from "@/lib/auctionStore";
import { baht, customerMessageLink, igDmLink, mapsLink, procedureLabel } from "@/lib/auctionText";
import { clinicInstagram } from "@/lib/clinicInstagram";
import { getClinicById, loadMasterDb } from "@/lib/data";
import { sendTelegram, type TelegramButton } from "@/lib/notify";
import { getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("invalid body", { status: 400 });
  }
  const r = await getRequestBySecret(String(body.secret ?? ""));
  if (!r) return new Response("not found", { status: 404 });
  if (r.status !== "open") return new Response("already chosen", { status: 409 });

  const bid = (await listBids(r.id)).find((b) => b.token === String(body.token ?? ""));
  if (!bid) return new Response("bid not found", { status: 404 });

  r.status = "chosen";
  r.chosen_token = bid.token;
  r.chosen_at = new Date().toISOString();
  await saveRequest(r);

  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, bid.clinic_id);
  const ig = clinicInstagram(c);
  const site = getSiteUrl();

  const toClinic = [
    `สวัสดีค่ะ ลูกค้าเลือกใบเสนอราคาของคลินิกแล้ว 🎉`,
    `${procedureLabel(r.procedure)} — ${r.details}`,
    `ราคาที่เสนอ: ${baht(bid.price_thb)}${bid.quantity ? ` (${bid.quantity})` : ""}`,
    r.when ? `วันที่สะดวก: ${r.when}` : null,
    `ลูกค้า: ${r.name || "-"} · ${r.contact_method}: ${r.contact}`,
    "รบกวนติดต่อลูกค้าเพื่อนัดหมายด้วยนะคะ ขอบคุณค่ะ",
  ].filter((l) => l !== null).join("\n");
  const toCustomer = `Hi${r.name ? ` ${r.name}` : ""}! ${bid.clinic_name} will contact you to book your ${r.procedure} (${baht(bid.price_thb)}). If you don't hear from them within a day, reply here and we'll follow up.`;

  const buttons: TelegramButton[] = [];
  if (ig) buttons.push({ text: `클리닉 인스타 DM (@${ig})`, url: igDmLink(ig) });
  const custLink = customerMessageLink(r, toCustomer);
  if (custLink) buttons.push({ text: "손님에게 연락", url: custLink });
  buttons.push({ text: "클리닉 지도", url: mapsLink(c?.place_id, bid.clinic_name) });
  buttons.push({ text: "요청 상세", url: `${site}/admin/auctions/${r.id}` });

  await sendTelegram(
    [
      "✅ 손님이 클리닉을 골랐어요",
      `${bid.clinic_name} · ${baht(bid.price_thb)}`,
      `손님: ${r.name || "(이름 없음)"} · ${r.contact_method} ${r.contact}`,
      c?.phone ? `클리닉 전화: ${c.phone}` : null,
      ig ? null : "클리닉 인스타 계정은 DB에 없음 — 지도에서 연락처 확인",
      "",
      "── 클리닉에 보낼 문구 ──",
      toClinic,
      "",
      "── 손님에게 보낼 문구 ──",
      toCustomer,
    ].filter((l) => l !== null).join("\n"),
    buttons,
  );

  return Response.json({ ok: true });
}
