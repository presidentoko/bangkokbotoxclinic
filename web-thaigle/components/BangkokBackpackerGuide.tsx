const ESSENTIALS = [
  {
    topic: "Khao San Road — Backpacker HQ",
    emoji: "🎒",
    reality: "Khao San isn't representative of Thailand — it's a backpacker bubble. Fun for one night but don't stay more than 1–2 days.",
    do: ["Book day tours from agencies on Khao San (cheap, easy)", "Pad Thai ฿50 at street stalls", "Mango shake ฿40", "Tuk-tuk to Grand Palace in the morning (before touts wake up)"],
    avoid: ["Accommodation on Khao San itself (overpriced, noisy)", "'Free' tuk-tuk tours (gem shop scam)", "Exchanging money at night (bad rates)"],
  },
  {
    topic: "Budget Daily Costs",
    emoji: "💰",
    reality: "฿1,000–1,500/day is very comfortable backpacker budget. ฿600–800/day if sleeping dorm and eating street food only.",
    do: ["Stay in dorm ฿300–500", "Eat at food courts and street stalls ฿40–80/meal", "Use BTS/MRT not Grab for short hops", "Foot massage ฿150–200/hr (daily)"],
    avoid: ["Taxis without meters", "Tourist restaurants near Grand Palace (3× markup)", "Changing money at airports (terrible rate)"],
  },
  {
    topic: "Transport Hacks",
    emoji: "🚇",
    reality: "BTS + MRT + boats cover 80% of tourist areas. Grab for the rest (use English address, show driver).",
    do: ["Rabbit card for BTS (no single-ticket surcharge)", "Motorbike taxi (Win) for short hops 1km ฿10–20", "Khlong Saen Saeb canal boat ฿12–25 across the city", "Grab for ฿80–120 when BTS isn't convenient"],
    avoid: ["Tuk-tuks unless quoted price first", "Taxi refusing meter (get different taxi)", "Airport Bus Rail Link missing (use A1 bus instead ฿30)"],
  },
];

export function BangkokBackpackerGuide() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🎒 Bangkok backpacker guide — budget travel tips
      </div>
      <div className="space-y-2.5">
        {ESSENTIALS.map((e) => (
          <div key={e.topic} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">{e.emoji}</span>
              <div className="font-bold text-xs">{e.topic}</div>
            </div>
            <div className="text-[10px] text-[var(--muted)] italic mb-2">{e.reality}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] font-black text-green-700 uppercase mb-1">DO ✅</div>
                {e.do.map((d) => (
                  <div key={d} className="text-[10px] flex gap-1 mb-0.5">
                    <span className="shrink-0 text-green-500">▸</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[9px] font-black text-red-700 uppercase mb-1">AVOID ⚠️</div>
                {e.avoid.map((a) => (
                  <div key={a} className="text-[10px] flex gap-1 mb-0.5">
                    <span className="shrink-0 text-red-400">✗</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
