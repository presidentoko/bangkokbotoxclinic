// 클리닉 입찰 페이지 — 인스타 DM 으로 받은 링크. 가입 없이 토큰만으로 연다.
// 손님 이름·연락처는 보여주지 않는다 (우리를 거치지 않는 직거래 방지).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BidForm from "@/components/auction/BidForm";
import { getInvite, getRequest, isOpen, listBids } from "@/lib/auctionStore";
import { procedureLabel } from "@/lib/auctionText";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ใบเสนอราคา · Send a quote", robots: { index: false, follow: false } };

const QTY_HINT = { botox: "50 units", filler: "1 cc", hifu: "300 shots", other: "" } as const;

export default async function BidPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const inv = await getInvite(token);
  if (!inv) notFound();
  const r = await getRequest(inv.req_id);
  if (!r) notFound();
  const prev = (await listBids(r.id)).find((b) => b.token === token) ?? null;
  const open = isOpen(r);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">{inv.clinic_name}</p>
      <h1 className="text-2xl font-bold tracking-tight mb-4">ลูกค้าขอใบเสนอราคา · A patient wants a quote</h1>

      <div className="border border-[var(--border)] rounded-xl p-4 mb-6 bg-white">
        <p className="font-semibold">{procedureLabel(r.procedure)}</p>
        <p className="mb-2 whitespace-pre-line">{r.details}</p>
        <dl className="text-sm space-y-0.5">
          {r.area && <div><dt className="inline text-[var(--muted)]">ย่าน · Area: </dt><dd className="inline">{r.area}</dd></div>}
          {r.when && <div><dt className="inline text-[var(--muted)]">วันที่สะดวก · When: </dt><dd className="inline">{r.when}</dd></div>}
          {r.notes && <div><dt className="inline text-[var(--muted)]">หมายเหตุ · Notes: </dt><dd className="inline whitespace-pre-line">{r.notes}</dd></div>}
        </dl>
      </div>

      {open ? (
        <>
          <BidForm token={token} prev={prev} quantityHint={QTY_HINT[r.procedure]} />
          <p className="text-xs text-[var(--muted)] mt-4">
            ลูกค้าจะเห็นราคา ยี่ห้อ และรายละเอียดที่คุณกรอก พร้อมคะแนนรีวิว Google ของคลินิก ถ้าลูกค้าเลือกคลินิกของคุณ เราจะส่งช่องทางติดต่อลูกค้าให้
            <br />The patient sees your price, brand and details next to your Google rating. If they pick you, we send you their contact.
          </p>
        </>
      ) : (
        <div className="border border-dashed border-[var(--border)] rounded-xl p-6 text-center text-[var(--muted)]">
          ปิดรับใบเสนอราคาแล้ว · This request is closed.
          {prev && <p className="mt-2 text-sm">ใบเสนอราคาของคุณ: ฿{prev.price_thb.toLocaleString()}</p>}
        </div>
      )}
    </div>
  );
}
