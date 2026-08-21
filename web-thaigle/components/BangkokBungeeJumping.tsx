const OPTIONS = [
  {
    name: "Jungle Bungy Jump (Pattaya)",
    emoji: "🤸",
    area: "Pattaya city, 1.5 hrs from Bangkok",
    price: "฿2,200 first jump; ฿1,650 subsequent jumps",
    height: "60m (197ft) jump height",
    why: "The classic bungee jump near Bangkok. Purpose-built platform over a lake. Tandem jumping available (extra cost). One of Southeast Asia's most established bungee operators. Thai, European, and Australian instructors. Open water landing option available (you get dunked in the lake).",
    tip: "Bring a change of clothes if doing the water dip option. Weight minimum 40kg, maximum 130kg. Medical conditions must be disclosed. Video and photo packages available. Pattaya day trip: combine with beach, walking street, and bungee.",
  },
  {
    name: "X-Zone Adventure (Pattaya Area)",
    emoji: "🎢",
    area: "Na Jomtien area, south Pattaya",
    price: "฿1,800–2,500 depending on activity",
    height: "Zipline + drop tower combo",
    why: "Adventure park offering bungee jumping alongside ziplines, ATV, and other extreme sports. Good for groups who want multiple activities in one location. Less specialized than dedicated bungee operators but more variety. Can combine with ATV and zipline for a full adventure day.",
    tip: "Better for groups where not everyone wants to bungee — others can do zipline or ATV while one person jumps. Grab from Bangkok to Pattaya is ฿800–1,200 one way. Book packages in advance for group discount.",
  },
];

const NOTE = "No bungee jumping currently operates within Bangkok city limits — all operators are 1.5–3 hrs from the city. Day trip to Pattaya is the standard approach. Always verify current operator status before booking as adventure businesses can close or change seasonally.";

export function BangkokBungeeJumping() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🤸 Bungee jumping near Bangkok — Pattaya operators & adventure day trips
      </h2>
      <div className="space-y-2 mb-3">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area} · {o.height}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-red-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-3 leading-snug">{NOTE}</div>
    </div>
  );
}
