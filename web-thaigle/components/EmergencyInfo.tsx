const CONTACTS = [
  { icon: "🚨", label: "Police", number: "191", note: "Tourist Police (English): 1155" },
  { icon: "🚑", label: "Ambulance", number: "1669", note: "Free service — give your location" },
  { icon: "🔥", label: "Fire", number: "199", note: "Or call 191 if unsure" },
  { icon: "🏥", label: "Bangkok Hospital", number: "+66 2-310-3000", note: "Best English-speaking ER" },
  { icon: "🦷", label: "Dental emergency", number: "+66 2-310-3257", note: "Bangkok Hospital dental 24h" },
  { icon: "✈️", label: "Tourist Police Hotline", number: "1155", note: "24h — lost docs, scams, emergencies" },
];

export function EmergencyInfo() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🆘 Bangkok emergency numbers — save before you go
      </div>
      <div className="grid grid-cols-2 gap-2">
        {CONTACTS.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-2.5 border border-red-100">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span>{c.icon}</span>
              <span className="text-xs font-bold text-[var(--fg)]">{c.label}</span>
            </div>
            <div className="font-mono font-black text-sm text-red-700">{c.number}</div>
            <div className="text-[10px] text-[var(--muted)] leading-snug">{c.note}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11px] text-red-700 bg-red-100 rounded-xl px-3 py-2">
        <strong>Tip:</strong> Screenshot this page before traveling. Most calls to these numbers are free from any Thai SIM.
      </div>
    </div>
  );
}
