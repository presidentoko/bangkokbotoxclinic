const GYMS = [
  {
    name: "Fairtex Boxing Gym",
    emoji: "🥊",
    area: "Bangplee (Samut Prakan) — 45min from Sukhumvit, BTS Bearing taxi",
    type: "World-class Muay Thai facility",
    price: "Day pass ฿500, Training ฿400/session, Weekly ฿2,500",
    why: "One of Thailand's most famous gyms. Professional fighters train here. Foreigners welcome. Full facility: ring, bags, speedbags, pool, accommodation on-site. Run by Fairtex brand.",
    tip: "Residential gym — you can stay on-site (฿500–800/night), eat at the gym restaurant, and train twice daily. English-speaking trainers. Bring your own gloves or rent ฿50/day.",
  },
  {
    name: "Rajadamnern Muay Thai Academy (Stadium Adjacent)",
    emoji: "🏟️",
    area: "Near Rajadamnern Stadium, Old Bangkok",
    type: "Traditional Thai boxing school + fight prep",
    price: "Training ฿350–500/session",
    why: "Train where professional stadium fighters prepare. Authentic atmosphere — seasoned Thai trainers, serious fighters. Not a tourist-gym polish, but real experience. Located in traditional fight district.",
    tip: "Evening training sessions (5–8pm) when serious fighters come. Ask for pad work vs bag work combo. Watch Tuesday/Thursday evening stadium fights to see gym fighters compete.",
  },
  {
    name: "Santai Muay Thai",
    emoji: "🌟",
    area: "Ratchada area (MRT Thailand Cultural Centre)",
    type: "Tourism-friendly, clean, central location",
    price: "Single class ฿600, 5-class package ฿2,500",
    why: "Best option for tourists who want Muay Thai experience without the rough-and-tumble of serious gyms. Clean facilities, English instruction, tourist-appropriate pace. Great for groups.",
    tip: "Morning classes (9am) recommended for beginners — afternoon classes attract more serious students. Pad work included in all sessions. Photography OK here vs professional gyms that restrict it.",
  },
];

export function BangkokBoxingGyms() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥊 Muay Thai & boxing gyms in Bangkok — train like a fighter
      </h2>
      <div className="space-y-2">
        {GYMS.map((g) => (
          <div key={g.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{g.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{g.type} · {g.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{g.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-red-700">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
