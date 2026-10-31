export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import AdminLogin from "@/components/AdminLogin";
import { isAdminAuthedFromCookies } from "@/lib/adminAuth";
import { getRequest, isOpen, listBids, listInvites } from "@/lib/auctionStore";
import { baht, clinicDmText, customerMessageLink, igDmLink, igHandle, mapsLink, procedureLabel } from "@/lib/auctionText";
import { getClinicById, loadMasterDb } from "@/lib/data";
import { applySiteFilter, getSiteConfig, getSiteUrl } from "@/lib/site";
import { CopyButton } from "../../outreach/[clinicId]/CopyButton";
import { ClinicPicker, CloseButton, type PickerClinic } from "../AuctionAdminClient";

const SITE = getSiteUrl();
const btn = "text-xs px-3 py-1.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700";

export default async function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthedFromCookies())) return <AdminLogin />;
  const { id } = await params;
  const r = await getRequest(id);
  if (!r) notFound();

  const [invites, bids, db] = await Promise.all([listInvites(r.id), listBids(r.id), loadMasterDb()]);
  const bidBy = new Map(bids.map((b) => [b.token, b]));
  const open = isOpen(r);
  const customerUrl = `${SITE}/q/${r.secret}`;
  const custLink = customerMessageLink(
    r,
    `Hi${r.name ? ` ${r.name}` : ""}! You have ${bids.length} quote${bids.length === 1 ? "" : "s"} from Bangkok clinics. Compare and pick one here: ${customerUrl}`,
  );

  const picker: PickerClinic[] = [...applySiteFilter(db.clinics, getSiteConfig())]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 800)
    .map((c) => ({
      id: c.id,
      name: c.name,
      district: c.district ?? "",
      trust: c.trust_score,
      rating: c.rating,
      reviews: c.total_reviews,
      ig: !!igHandle(c.website_instagram),
    }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-sm">
      <div className="flex gap-3 mb-6">
        <a href="/admin/auctions" className={btn}>← 견적 목록</a>
        <a href={customerUrl} target="_blank" rel="noopener noreferrer" className={btn}>손님 화면 ↗</a>
        {r.status === "open" && <CloseButton reqId={r.id} />}
      </div>

      <section className="mb-8">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
          {r.status === "chosen" ? "✅ 선택 완료" : open ? "입찰 받는 중" : r.status === "closed" ? "마감" : "입찰 기간 끝 (손님 선택 대기)"} · {new Date(r.at).toLocaleString("ko-KR", { timeZone: "Asia/Bangkok" })}
        </div>
        <h1 className="text-xl font-black text-white">{procedureLabel(r.procedure)}</h1>
        <p className="text-gray-200 mt-1 whitespace-pre-line">{r.details}</p>
        <p className="text-gray-400 mt-1">{[r.area && `지역 ${r.area}`, r.when && `날짜 ${r.when}`].filter(Boolean).join(" · ")}</p>
        {r.notes && <p className="text-gray-400 mt-1 whitespace-pre-line">메모: {r.notes}</p>}
        <p className="text-gray-200 mt-2">손님: {r.name || "(이름 없음)"} · {r.contact_method} <span className="select-all">{r.contact}</span></p>
        <div className="flex flex-wrap gap-2 mt-2">
          <CopyButton text={customerUrl} label="손님 링크 복사" />
          {custLink && <a href={custLink} target="_blank" rel="noopener noreferrer" className={btn}>손님에게 링크 보내기 ↗</a>}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-gray-300 font-bold text-xs uppercase tracking-widest mb-2">입찰 {bids.length}건</h2>
        {bids.length === 0 ? <p className="text-gray-500">아직 없음</p> : (
          <ul className="space-y-2">
            {bids.map((b) => (
              <li key={b.token} className={`border rounded-lg p-3 ${r.chosen_token === b.token ? "border-emerald-500" : "border-gray-800"}`}>
                <div className="flex justify-between"><span className="font-bold">{b.clinic_name}</span><span className="font-bold">{baht(b.price_thb)}</span></div>
                <div className="text-gray-400">{[b.brand, b.quantity, b.includes, b.available].filter(Boolean).join(" · ")}</div>
                {b.note && <div className="text-gray-400 whitespace-pre-line">{b.note}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-gray-300 font-bold text-xs uppercase tracking-widest mb-2">초대한 클리닉 {invites.length}곳 — 인스타 DM 으로 보내기</h2>
        <ul className="space-y-3">
          {invites.map((inv) => {
            const c = getClinicById(db.clinics, inv.clinic_id);
            const ig = igHandle(c?.website_instagram);
            const bidUrl = `${SITE}/bid/${inv.token}`;
            const bid = bidBy.get(inv.token);
            return (
              <li key={inv.token} className="border border-gray-800 rounded-lg p-3">
                <div className="flex justify-between gap-2 mb-2">
                  <span className="font-bold">{inv.clinic_name}</span>
                  <span className={bid ? "text-emerald-400" : "text-gray-500"}>{bid ? `입찰 ${baht(bid.price_thb)}` : "대기"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <CopyButton text={clinicDmText(r, bidUrl)} label="DM 문구 복사" />
                  {ig
                    ? <a href={igDmLink(ig)} target="_blank" rel="noopener noreferrer" className={btn}>인스타 DM @{ig} ↗</a>
                    : <a href={mapsLink(c?.place_id, inv.clinic_name)} target="_blank" rel="noopener noreferrer" className={btn}>인스타 없음 · 지도 ↗</a>}
                  {c?.phone && <span className="text-xs text-gray-400 self-center">{c.phone}</span>}
                </div>
              </li>
            );
          })}
          {invites.length === 0 && <li className="text-gray-500">아직 없음 — 아래에서 클리닉을 고르세요.</li>}
        </ul>
      </section>

      {open && (
        <section>
          <h2 className="text-gray-300 font-bold text-xs uppercase tracking-widest mb-2">클리닉 고르기 (Trust Score 순)</h2>
          <ClinicPicker reqId={r.id} clinics={picker} invited={invites.map((i) => i.clinic_id)} />
        </section>
      )}
    </div>
  );
}
