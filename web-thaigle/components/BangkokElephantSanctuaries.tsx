const SANCTUARIES = [
  {
    name: "Elephant Jungle Sanctuary (Pattaya)",
    emoji: "🐘",
    distance: "2 hours from Bangkok",
    price: "Half-day ฿2,400, Full-day ฿2,900",
    ethics: "No riding, no chains, no performances — ethical sanctuary",
    why: "Closest ethical elephant sanctuary to Bangkok. Walk with elephants, feed them, bathe with them. All rescued from logging or street begging industries.",
    tip: "Book online 1–2 days ahead. Hotel pickup in Pattaya included. Wear dark clothes you don't mind getting muddy. No elephant riding — if they offer it, leave.",
    transport: "Day trip from Bangkok: bus to Pattaya + sanctuary pickup, or drive yourself (2hr on highway)",
  },
  {
    name: "Elephant Nature Park (Chiang Mai)",
    emoji: "🌿",
    distance: "1 hour flight or 10 hour train from Bangkok",
    price: "Full-day ฿2,500–4,500 per person",
    ethics: "Thailand's most famous ethical elephant sanctuary",
    why: "The gold standard for elephant sanctuaries in Thailand. Founded by Lek Chailert. Sanctuary for 80+ rescued elephants. No riding, no tricks. Educational, moving experience.",
    tip: "Must be booked weeks in advance — extremely popular. Worth combining with Chiang Mai trip (separate from Bangkok). Their volunteer programs (1 week+) are life-changing.",
    transport: "Fly Bangkok→Chiang Mai (1 hour, ฿800–2,000). Then sanctuary pickup.",
  },
  {
    name: "Elephant Sanctuary in Kanchanaburi",
    emoji: "🏕️",
    distance: "2.5 hours from Bangkok",
    price: "Half-day ฿1,800, Full-day ฿2,500",
    ethics: "Ethical no-riding sanctuary near Bangkok",
    why: "Kanchanaburi province has several ethical sanctuaries that are drivable from Bangkok. Fewer crowds than Chiang Mai options. Good day-trip combination with WWII Death Railway.",
    tip: "Combine with Bridge on the River Kwai and Death Railway train ride for a full Kanchanaburi day trip. Rent a car or join an organized tour from Bangkok.",
    transport: "Van from Bangkok: ฿200–300 from Victory Monument or Thonburi terminal (2.5 hrs)",
  },
];

const ETHICS = [
  "Never ride an elephant — riding requires breaking their spirit through cruel training (phajaan).",
  "No elephant shows, tricks, or painting — these require abusive training methods.",
  "Legitimate sanctuaries: elephants free to roam, choose interaction, socialise naturally.",
  "Red flags: chains, bullhooks, thin elephants, forced swimming, any riding.",
  "Green flags: elephants choose to approach you, interaction ends when elephant walks away.",
];

export function BangkokElephantSanctuaries() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🐘 Elephant sanctuaries near Bangkok — ethical options only
      </h2>
      <div className="space-y-2 mb-3">
        {SANCTUARIES.map((s) => (
          <details key={s.name} className="border border-green-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-green-50 transition">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.distance} · {s.price}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-green-100 pt-2 space-y-1">
              <div className="text-[10px] text-green-700">✅ {s.ethics}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">{s.why}</div>
              <div className="text-[10px] text-blue-700">🚌 {s.transport}</div>
              <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
            </div>
          </details>
        ))}
      </div>
      <div className="border border-green-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-green-700 mb-1.5">How to tell ethical from exploitative</div>
        <ul className="space-y-0.5">
          {ETHICS.map((e, i) => (
            <li key={i} className="text-[10px] text-[var(--fg)] leading-snug flex items-start gap-1.5">
              <span className={i < 2 ? "text-red-500 shrink-0" : "text-green-600 shrink-0"}>•</span>{e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
