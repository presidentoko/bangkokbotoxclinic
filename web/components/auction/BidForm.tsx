"use client";

import { useState } from "react";
import type { Bid } from "@/lib/auctionStore";

const input = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black";

// 클리닉 직원이 폰으로 연다 — 라벨은 태국어 먼저, 영어 같이.
export default function BidForm({ token, prev, quantityHint }: { token: string; prev: Bid | null; quantityHint: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const res = await fetch("/api/bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        price_thb: f.get("price_thb"),
        brand: f.get("brand"),
        quantity: f.get("quantity"),
        includes: f.get("includes"),
        available: f.get("available"),
        note: f.get("note"),
      }),
    }).catch(() => null);
    setBusy(false);
    if (!res) return setError("ส่งไม่สำเร็จ ลองอีกครั้ง / Couldn't send, please try again.");
    if (res.status === 409) return setError("ปิดรับใบเสนอราคาแล้ว / This request is closed.");
    if (res.status === 400) return setError("กรุณาใส่ราคาเป็นตัวเลข (บาท) / Enter the price in baht.");
    if (!res.ok) return setError("ส่งไม่สำเร็จ ลองอีกครั้ง / Couldn't send, please try again.");
    setDone(true);
  }

  if (done) {
    return (
      <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
        <p className="font-bold mb-1">ส่งใบเสนอราคาแล้ว ขอบคุณค่ะ 🙏</p>
        <p className="text-sm">Quote sent. If the patient picks your clinic we&apos;ll send you their contact. You can reopen this link to change your quote while the request is open.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-[var(--border)] rounded-xl p-5 space-y-4">
      <label className="block">
        <span className="text-sm font-semibold">ราคารวม (บาท) · Total price (THB) *</span>
        <input name="price_thb" type="number" inputMode="numeric" min={100} required defaultValue={prev?.price_thb ?? ""} className={`${input} mt-1`} />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold">ยี่ห้อ · Brand</span>
          <input name="brand" maxLength={100} placeholder="Allergan, Nabota, Xeomin…" defaultValue={prev?.brand ?? ""} className={`${input} mt-1`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">ปริมาณ · Amount</span>
          <input name="quantity" maxLength={100} placeholder={quantityHint} defaultValue={prev?.quantity ?? ""} className={`${input} mt-1`} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold">รวมอะไรบ้าง · What&apos;s included</span>
        <input name="includes" maxLength={300} placeholder="ปรึกษาแพทย์, ยาชา, นัดเช็คฟรี 2 สัปดาห์ / doctor consult, numbing, free touch-up" defaultValue={prev?.includes ?? ""} className={`${input} mt-1`} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">วันที่ว่าง · Available dates</span>
        <input name="available" maxLength={200} defaultValue={prev?.available ?? ""} className={`${input} mt-1`} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">ข้อความถึงลูกค้า · Message to the patient</span>
        <textarea name="note" maxLength={1000} rows={3} defaultValue={prev?.note ?? ""} className={`${input} mt-1`} />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="w-full py-3 rounded-lg bg-black text-white font-semibold disabled:opacity-50">
        {busy ? "กำลังส่ง…" : prev ? "แก้ไขใบเสนอราคา · Update quote" : "ส่งใบเสนอราคา · Send quote"}
      </button>
    </form>
  );
}
