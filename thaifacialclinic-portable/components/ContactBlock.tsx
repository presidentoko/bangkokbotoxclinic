// Re-usable contact card. Drop into About, Contact, footer, partner pages.

import { CONTACT, fullAddress, whatsappLink } from "@/lib/contact";

export default function ContactBlock({ compact = false }: { compact?: boolean }) {
  const addr = fullAddress();

  return (
    <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-4"}>
      {/* LINE */}
      <a
        href={CONTACT.line.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl border-2 bg-white p-4 hover:border-[#06c755] transition"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#06c755] text-white text-2xl shrink-0">💬</span>
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#06c755]">LINE · fastest</div>
          <div className="font-bold text-lg">{CONTACT.line.id}</div>
          <div className="text-xs text-gray-500">Tap to open · usually replies &lt; 1h</div>
        </div>
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappLink("Hi! I'd like to ask about a clinic.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl border-2 bg-white p-4 hover:border-[#25d366] transition"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#25d366] text-white text-2xl shrink-0">📱</span>
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#25d366]">WhatsApp</div>
          <div className="font-bold text-lg">{CONTACT.whatsapp.display}</div>
          <div className="text-xs text-gray-500">English · Korean · Arabic</div>
        </div>
      </a>

      {/* Email */}
      <a
        href={`mailto:${CONTACT.email.general}`}
        className="flex items-center gap-3 rounded-xl border-2 bg-white p-4 hover:border-emerald-500 transition"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600 text-white text-2xl shrink-0">📧</span>
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Email</div>
          <div className="font-bold text-sm">{CONTACT.email.general}</div>
          <div className="text-xs text-gray-500">Reply within 24 hours</div>
        </div>
      </a>

      {/* Phone (always shown since we have a real number) */}
      {CONTACT.phone.tel && (
        <a
          href={`tel:${CONTACT.phone.tel}`}
          className="flex items-center gap-3 rounded-xl border-2 bg-white p-4 hover:border-slate-700 transition"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-800 text-white text-2xl shrink-0">📞</span>
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-700">Phone</div>
            <div className="font-bold text-lg">{CONTACT.phone.display}</div>
            <div className="text-xs text-gray-500">{CONTACT.hours.weekdays.split(" ").slice(0, 2).join(" ")}</div>
          </div>
        </a>
      )}

      {/* Address (only if filled) */}
      {addr && CONTACT.address.line1 && (
        <div className="sm:col-span-2 flex items-start gap-3 rounded-xl border-2 bg-white p-4" style={{ borderColor: "rgb(var(--border))" }}>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-2xl shrink-0">📍</span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Office (visits by appointment)</div>
            <div className="text-sm font-bold mt-0.5">{addr}</div>
            <a target="_blank" rel="noopener noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`}
              className="text-xs text-emerald-700 hover:underline mt-1 inline-block">Open in Google Maps →</a>
          </div>
        </div>
      )}

      {/* Hours */}
      <div className="sm:col-span-2 rounded-xl border bg-slate-50 p-4 text-sm" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Business hours</div>
        <div>{CONTACT.hours.weekdays}</div>
        <div>{CONTACT.hours.weekend}</div>
        <div className="text-[11px] text-gray-500 mt-1.5">{CONTACT.hours.note}</div>
      </div>
    </div>
  );
}
