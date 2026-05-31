// International accreditation logos strip — trust signal.

const CERTS = [
  { code: "JCI",     name: "Joint Commission International", emoji: "🏥" },
  { code: "ISO9001", name: "ISO 9001 Quality Mgmt",          emoji: "📜" },
  { code: "TMC",     name: "Thai Medical Council",            emoji: "🇹🇭" },
  { code: "MoPH",    name: "Ministry of Public Health (Thailand)", emoji: "✓" },
  { code: "Hpa",     name: "HQAA Hospital Quality Accreditation", emoji: "🛡️" },
];

export default function CertificationsBar() {
  return (
    <section className="rounded-2xl border bg-white px-5 py-4" style={{ borderColor: "var(--border)" }}>
      <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 text-center">Accreditations across our partner clinics</div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {CERTS.map((c) => (
          <div key={c.code} className="flex items-center gap-2 text-xs">
            <span className="text-2xl">{c.emoji}</span>
            <div>
              <div className="font-black text-sm leading-tight">{c.code}</div>
              <div className="text-[10px] text-[var(--muted)]">{c.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
