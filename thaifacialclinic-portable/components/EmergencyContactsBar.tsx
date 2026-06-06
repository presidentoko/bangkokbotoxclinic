// 24/7 safety-net contact strip — reduces "what if something goes wrong" anxiety.

export default function EmergencyContactsBar() {
  return (
    <section className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl shrink-0">🆘</span>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-1">If something goes wrong</div>
          <h3 className="text-base font-black">24/7 safety net</h3>
          <p className="text-xs text-[rgb(var(--muted))] mt-1 leading-relaxed">
            Every partner clinic provides 24-hour emergency contact for at least 14 days post-procedure.
            If you can&apos;t reach the clinic, use these backups:
          </p>
        </div>
      </div>

      <ul className="grid sm:grid-cols-3 gap-3 mt-4">
        <li className="rounded-lg bg-white border border-rose-200 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Bangkok ambulance</div>
          <div className="font-black text-base mt-0.5">1669</div>
          <div className="text-[10px] text-[rgb(var(--muted))]">Free national emergency line</div>
        </li>
        <li className="rounded-lg bg-white border border-rose-200 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Tourist police</div>
          <div className="font-black text-base mt-0.5">1155</div>
          <div className="text-[10px] text-[rgb(var(--muted))]">English/Chinese/Korean operators</div>
        </li>
        <li className="rounded-lg bg-white border border-rose-200 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">bkkclinics concierge</div>
          <div className="font-black text-base mt-0.5">LINE @405zhjqb</div>
          <div className="text-[10px] text-[rgb(var(--muted))]">Reach us 9am–9pm ICT, &lt;1h reply</div>
        </li>
      </ul>

      <p className="text-[11px] text-[rgb(var(--muted))] mt-3 leading-relaxed">
        Closest international hospitals to most aesthetic clinics: Bumrungrad (Sukhumvit) · Samitivej (Phrom Phong) · BNH (Silom). Insurance accepted, English-speaking ER.
      </p>
    </section>
  );
}
