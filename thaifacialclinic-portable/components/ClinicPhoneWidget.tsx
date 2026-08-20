// One-click contact widget — phone + WhatsApp + LINE + email + business hours indicator.
// Shows "OPEN NOW" / "CLOSED · opens at X" based on Bangkok local time (UTC+7).

import type { Clinic } from "@/lib/types";

function bangkokHourNow(): number {
  // UTC+7 — Bangkok doesn't observe DST
  const now = new Date();
  const utcH = now.getUTCHours();
  return (utcH + 7) % 24;
}

function isOpenNow(clinic: Clinic): { open: boolean; hint: string } {
  // Assume typical clinic hours: 10am-8pm. We don't have per-clinic hours wired here.
  const h = bangkokHourNow();
  if (h >= 10 && h < 20) return { open: true, hint: `Open until 8pm (Bangkok time)` };
  if (h < 10) return { open: false, hint: `Opens at 10am (Bangkok time)` };
  return { open: false, hint: `Closed · opens 10am tomorrow` };
}

export default function ClinicPhoneWidget({ clinic }: { clinic: Clinic }) {
  const status = isOpenNow(clinic);
  const phone = clinic.phone || "";
  const phoneStripped = phone.replace(/[^+\d]/g, "");

  return (
    <section className="rounded-2xl border-2 bg-white p-5" style={{ borderColor: status.open ? "#86efac" : "#fcd34d" }}>
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Contact this clinic</div>
          <h3 className="text-base font-black mt-0.5">{clinic.name}</h3>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
          status.open ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.open ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
          {status.open ? "Open now" : "Closed"}
        </span>
      </div>
      <p className="text-xs text-[rgb(var(--muted))] mb-3">{status.hint}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {phone && (
          <a href={`tel:${phoneStripped}`}
            className="flex flex-col items-center justify-center rounded-xl bg-slate-900 text-white px-3 py-3 font-bold hover:bg-black transition">
            <span className="text-xl mb-0.5">📞</span>
            <span className="text-xs">Call</span>
          </a>
        )}
        {/* 2026-08-20: phone 가드가 없어서 번호 없는 클리닉에선 https://wa.me/ 로
            링크가 나갔다 — WhatsApp 홈으로 튕기는 죽은 버튼이다. */}
        {phone && (
          <a href={`https://wa.me/${phoneStripped}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center justify-center rounded-xl bg-[#25d366] text-white px-3 py-3 font-bold hover:opacity-90 transition">
            <span className="text-xl mb-0.5">📱</span>
            <span className="text-xs">WhatsApp</span>
          </a>
        )}
        <a href="#booking"
          className="flex flex-col items-center justify-center rounded-xl bg-[#06c755] text-white px-3 py-3 font-bold hover:opacity-90 transition">
          <span className="text-xl mb-0.5">💬</span>
          <span className="text-xs">LINE</span>
        </a>
        <a href="#booking"
          className="flex flex-col items-center justify-center rounded-xl bg-emerald-600 text-white px-3 py-3 font-bold hover:bg-emerald-700 transition">
          <span className="text-xl mb-0.5">📧</span>
          <span className="text-xs">Email</span>
        </a>
      </div>
    </section>
  );
}
