const ROUTES = [
  {
    name: "Classic Grand Palace Route (Half Day)",
    emoji: "👑",
    duration: "4–5 hours",
    temples: ["Wat Phra Kaew (Temple of Emerald Buddha)", "Grand Palace complex", "Wat Pho (Reclining Buddha, 46m long)", "Wat Arun (boat ride required ฿4)"],
    cost: "Wat Phra Kaew ฿500, Wat Pho ฿200, Wat Arun ฿100 (all on tourist ticket)",
    transport: "Chao Phraya ferry to Tha Chang pier (pier N9) or tuk-tuk from Khao San",
    tip: "Start at Grand Palace 8am (opens 8:30am) before heat. Wat Pho for lunch break massage (60-min foot massage ฿420 on-site). Wat Arun best photographed from far bank at sunset.",
    dress: "Dress code strictly enforced: shoulders and knees covered. Free sarongs available at entry.",
  },
  {
    name: "Rattanakosin Hidden Gems (Half Day)",
    emoji: "🗺️",
    duration: "3–4 hours",
    temples: ["Wat Ratchanadda (Loha Prasat Metal Castle)", "Wat Saket (Golden Mount)", "Wat Suthat (massive swing outside)", "Wat Ratchabophit (Thai-European fusion)"],
    cost: "Most ฿20–50, Wat Saket ฿20",
    transport: "Walk from Democracy Monument (bus 15A or Khao San tuk-tuk)",
    tip: "Less touristy route — authentic neighborhood feel. Wat Saket for panoramic city views. Best weekday morning when monks are present.",
    dress: "Shoulders and knees covered required at all temples.",
  },
  {
    name: "Thonburi River Temples (Half Day)",
    emoji: "🛶",
    duration: "3 hours by boat",
    temples: ["Wat Arun (Dawn Temple)", "Wat Kalayanamitr", "Wat Rakhang", "Wat Phichai Yat"],
    cost: "Long-tail boat charter ฿600–1,000/hr for 4 persons. Entry fees ฿20–100 each.",
    transport: "Charter long-tail boat from Tha Chang or Tha Tien pier",
    tip: "Best way to see Bangkok's canal temples. Long-tail boat can be shared with other tourists. Evening light on river temples especially beautiful. Can combine with Floating Market.",
    dress: "Bring cover-up in your bag for temple entries.",
  },
  {
    name: "Sukhumvit Modern Temples (2 hours)",
    emoji: "🌆",
    duration: "2 hours",
    temples: ["Erawan Shrine (not a temple but important)", "Wat Pathum Wanaram (inside CentralWorld area)", "Wat Pleng Naam (near Terminal 21)"],
    cost: "Free entry",
    transport: "BTS Chit Lom (Erawan). Asok for Terminal 21 area.",
    tip: "Erawan Shrine operates 24/7 — not a traditional Buddhist temple but one of Bangkok's most-visited spiritual sites. Best visited at evening for ceremony atmosphere.",
    dress: "Shoulders covered recommended (less strictly enforced near malls).",
  },
];

export function BangkokTempleHopping() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🛕 Bangkok temple hopping — routes by area & time
      </h2>
      <div className="space-y-2">
        {ROUTES.map((r) => (
          <details key={r.name} className="border border-yellow-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-yellow-50 transition">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{r.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{r.duration} · {r.cost}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-yellow-100 pt-2 space-y-1.5">
              <ul className="space-y-0.5">
                {r.temples.map((t) => (
                  <li key={t} className="text-[10px] text-yellow-700 flex items-start gap-1.5">
                    <span className="shrink-0">🛕</span>{t}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-blue-700">🚌 {r.transport}</div>
              <div className="text-[10px] text-orange-600">💡 {r.tip}</div>
              <div className="text-[10px] text-red-600">👗 Dress code: {r.dress}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
