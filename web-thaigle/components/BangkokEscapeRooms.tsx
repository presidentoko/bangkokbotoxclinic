const ROOMS = [
  {
    name: "Lockdown Bangkok",
    emoji: "🔒",
    area: "Phrom Phong / Ekkamai",
    price: "฿350–500/person (groups of 2–8)",
    themes: ["Haunted Hospital", "Time Machine Lab", "Submarine Crisis", "Prison Break"],
    why: "Bangkok's highest-rated escape room company. Professional actors in horror themes. Game design inspired by Hollywood props team. 75-minute sessions.",
    tip: "Book online — popular weekend slots fill 2 weeks ahead. Hospital theme has horror elements (no children under 13). Time Machine Lab best for first-timers.",
    difficulty: "★★★☆☆ to ★★★★☆ depending on room",
  },
  {
    name: "Escape Hunt Bangkok",
    emoji: "🎯",
    area: "Asok / Sukhumvit 21",
    price: "฿300–450/person",
    themes: ["Art Heist: Da Vinci", "Jungle Temple Treasure", "The Saboteur", "Virtual Reality rooms"],
    why: "International franchise with consistently good production quality. Multiple locations. VR escape rooms available — Bangkok has two of the best in Asia.",
    tip: "VR room is next-level — don't skip it if you have mixed ages in the group. International franchise means staff speak excellent English. AIA Capital Center location easiest access.",
    difficulty: "★★☆☆☆ to ★★★★☆",
  },
  {
    name: "Clausthrophobia Bangkok",
    emoji: "🕵️",
    area: "Silom / Sathorn",
    price: "฿400–550/person",
    themes: ["The Bunker (Cold War)", "Sherlock's Office", "Zombie Lab", "Magic Academy"],
    why: "Themed after Bangkok's underground bar scene — atmospheric lighting and sound design sets a unique tone. Zombie Lab particularly popular for Halloween season.",
    tip: "Sherlock's Office suits groups who prefer puzzles over horror. Private bookings available for corporate team-building. Complimentary polaroid photo with room booking.",
    difficulty: "★★★★☆ — challenging but satisfying",
  },
];

export function BangkokEscapeRooms() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🔒 Escape rooms in Bangkok — best rooms & how to book
      </div>
      <div className="space-y-2">
        {ROOMS.map((r) => (
          <details key={r.name} className="border border-indigo-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-indigo-50 transition">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.area} · {r.difficulty}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{r.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-indigo-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{r.why}</div>
              <div className="flex flex-wrap gap-1">
                {r.themes.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-medium">{t}</span>
                ))}
              </div>
              <div className="text-[10px] text-orange-600">💡 {r.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
