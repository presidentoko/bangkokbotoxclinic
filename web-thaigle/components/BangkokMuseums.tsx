const MUSEUMS = [
  {
    name: "National Museum Bangkok",
    emoji: "🏺",
    area: "Na Phra That Rd, Rattanakosin (near Grand Palace)",
    admission: "฿200",
    hours: "Wed–Sun 9am–4pm",
    time: "3–4 hours",
    why: "Largest museum in Southeast Asia. Thai history, royal regalia, Buddhist art, Sukhothai-era sculptures. Best context-setting for any Thai temple visit.",
    tip: "Free English-speaking volunteer guides Wed–Thu 9:30am. Check nationamuseum.finearts.go.th for tour schedule.",
  },
  {
    name: "Museum of Siam",
    emoji: "🧩",
    area: "Sanam Chai Rd, Rattanakosin (Sanam Chai MRT)",
    admission: "฿200",
    hours: "Tue–Sun 10am–6pm",
    time: "2–3 hours",
    why: "Interactive exhibition asking 'What is Thainess?' Modern multimedia approach. Best museum for understanding Thai culture not just art. Air-conditioned.",
    tip: "Much more engaging than National Museum for non-history specialists. Buy combined ticket with Palace Museum.",
  },
  {
    name: "Jim Thompson House",
    emoji: "🏡",
    area: "National Stadium BTS (across from BACC)",
    admission: "฿200 (Thai) / ฿300 (foreigner)",
    hours: "Daily 10am–6pm (last tour 5pm)",
    time: "1.5 hours (guided tour only)",
    why: "House of Jim Thompson, American who revived Thai silk industry, who mysteriously disappeared in 1967. Stunning traditional Thai house architecture.",
    tip: "Mandatory guided tour every 20 min. Photography in garden OK. Restaurant on-site (decent Thai food).",
  },
  {
    name: "Erawan Museum",
    emoji: "🐘",
    area: "Samut Prakan (40 min from central Bangkok by BTS to Bearing, then songthaw)",
    admission: "฿400",
    hours: "Daily 9am–7pm",
    time: "2 hours",
    why: "Bangkok's most surreal attraction. Giant three-headed elephant statue housing a Thai cosmology museum. Art Deco and Thai architecture fusion.",
    tip: "Combine with Ancient City (Muang Boran) same trip — both in Samut Prakan. Full day out.",
  },
];

export function BangkokMuseums() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🏛️ Bangkok museums — cultural & historical highlights
      </div>
      <div className="space-y-2">
        {MUSEUMS.map((m) => (
          <details key={m.name} className="border border-amber-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-amber-50 transition">
              <span className="text-2xl shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{m.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{m.area} · {m.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{m.admission}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-amber-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{m.why}</div>
              <div className="text-[10px] text-orange-600">💡 {m.tip}</div>
              <div className="text-[10px] text-[var(--muted)]">⏱️ Allow {m.time}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
