const ACTIVITIES = [
  { rank: 1, name: "Thai cooking class for two", emoji: "👨‍🍳", cost: "฿1,800–3,000 for 2", why: "Interactive, you eat what you make. Most romantic shared experience in Bangkok." },
  { rank: 2, name: "Sunset cruise on Chao Phraya", emoji: "🚢", cost: "฿1,600–4,000 for 2", why: "Golden hour city skyline from the water. Many dinner cruise options." },
  { rank: 3, name: "Couple's Thai massage (side by side)", emoji: "💆", cost: "฿600–1,200 for 2", why: "Most spas have couple rooms. Deeply relaxing, 90–120 min." },
  { rank: 4, name: "Muay Thai class together", emoji: "🥊", cost: "฿1,000 for 2", why: "Surprisingly bonding. Padwork together, learn basic combos. Lots of laughing." },
  { rank: 5, name: "Sunrise at Wat Arun (just you two)", emoji: "🌅", cost: "฿8 total (ferry)", why: "Arrive at 6am before tourists. Magical, near-empty, extremely affordable." },
  { rank: 6, name: "Floating market day trip", emoji: "🛶", cost: "฿800–1,500 for 2", why: "Damnoen Saduak or Amphawa — unique shared experience, lots of photos." },
];

export function BangkokCouplesActivities() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        ❤️ Top couples activities ranked
      </div>
      <div className="space-y-1.5">
        {ACTIVITIES.map((a) => (
          <div key={a.name} className="flex gap-3 items-start border border-[var(--border)] rounded-xl p-2.5">
            <div className="shrink-0 w-6 h-6 rounded-full bg-pink-100 text-pink-700 font-black text-xs flex items-center justify-center mt-0.5">
              {a.rank}
            </div>
            <span className="text-xl shrink-0">{a.emoji}</span>
            <div className="min-w-0">
              <div className="font-bold text-xs">{a.name}</div>
              <div className="text-[10px] text-green-700 mb-0.5">{a.cost}</div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">{a.why}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
