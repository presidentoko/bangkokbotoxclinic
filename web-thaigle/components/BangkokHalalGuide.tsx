const AREAS = [
  {
    name: "Bang Rak / Charoen Krung",
    emoji: "🕌",
    why: "Bangkok's historic Muslim quarter. Best for authentic Southern Thai-Muslim food.",
    spots: ["Café de Norasingh (biryani)", "Roti Mataba (roti canai + beef curry)", "Hajj Shan (authentic biryani)"],
    prayer: "Haroon Mosque (oldest in Bangkok, 1830) nearby",
  },
  {
    name: "Pratunam / Platinum area",
    emoji: "🍲",
    why: "Large Muslim community. Many halal-certified restaurants among the fashion shops.",
    spots: ["Muslim Restaurant (Ratchaprarop, famous since 1948)", "Haji Shad (nasi lemak)", "Dee Dee Muslim (Thai-Muslim fusion)"],
    prayer: "Jama Masjid Pratunam (large mosque, BTS Ratchaprarop)",
  },
  {
    name: "Sukhumvit Soi 3–5 (Arab Street)",
    emoji: "🌙",
    why: "Known as 'Arab Street.' Arabic, Lebanese, Middle Eastern food widely available. All halal.",
    spots: ["Al-Hussein (Arabic BBQ)", "Vienna Café (Lebanese)", "Sheik Ibrahim (Egyptian)"],
    prayer: "Multiple mosques within walking distance",
  },
];

const TIPS = [
  "Look for 'Halal Certified' sticker (blue crescent moon logo) — Thai Islamic Council issues these",
  "Most Thai Muslim restaurants don't serve alcohol — easy to identify",
  "Green curry and massaman curry are often pork-free but check chicken vs fish sauce content",
  "7-Eleven has some halal-certified items (look for sticker). Many snack options",
  "Thai Muslim desserts: roti with banana, burbur hitam, kueh are widely available",
];

export function BangkokHalalGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🌙 Halal food in Bangkok — where to eat
      </div>
      <div className="space-y-3 mb-3">
        {AREAS.map((a) => (
          <div key={a.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{a.emoji}</span>
              <div>
                <div className="font-bold text-xs">{a.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{a.why}</div>
              </div>
            </div>
            <div className="space-y-0.5 mb-1">
              {a.spots.map((s) => (
                <div key={s} className="text-[10px] flex gap-1.5">
                  <span className="text-teal-500 shrink-0">▸</span>{s}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-blue-600">🕌 {a.prayer}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">Tips for Muslim travelers</div>
      <div className="space-y-1">
        {TIPS.map((t) => (
          <div key={t} className="text-[10px] flex gap-1.5 items-start border-l-2 border-teal-300 pl-2">
            <span className="text-[var(--muted)] leading-snug">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
