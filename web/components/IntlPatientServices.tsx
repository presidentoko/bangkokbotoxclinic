// 4-icon strip showing medical-tourism comforts. Inline near clinic detail.

const ITEMS = [
  { emoji: "🚐", title: "Airport pickup",      sub: "Free for partner clinics · pre-arranged" },
  { emoji: "🗣",  title: "EN/KR/AR translator", sub: "On-call during consult + procedure" },
  { emoji: "🏨", title: "Hotel discount",      sub: "15-20% off partner hotels nearby" },
  { emoji: "🛂", title: "Visa assist",         sub: "Medical visa guidance + invitation letter" },
];

export default function IntlPatientServices() {
  return (
    <section className="rounded-2xl border bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 sm:p-6" style={{ borderColor: "#bfdbfe" }}>
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-blue-700">International patient services</div>
        <h3 className="text-base font-black mt-1">We handle the trip, you handle yourself</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <div key={i} className="rounded-xl bg-white border-2 border-blue-100 p-4 text-center">
            <div className="text-3xl mb-2">{it.emoji}</div>
            <div className="font-black text-sm">{it.title}</div>
            <p className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">{it.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
