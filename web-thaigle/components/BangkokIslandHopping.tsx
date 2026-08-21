const ISLANDS = [
  {
    name: "Koh Samui",
    emoji: "🏝️",
    distance: "800km south",
    getThereFrom: "Bangkok: fly 1hr 15min (฿1,500–3,000) or overnight train+ferry 14hr (฿600–900)",
    vibe: "Developed, resort-focused, international crowd. Best infrastructure, most services.",
    best: "Chaweng Beach (party), Bophut Fisherman's Village (romantic), Ang Thong Marine Park (day trip)",
    avoid: "Big Buddha area is overdeveloped and touristy. Maenam is quietest but least transport options.",
    budget: "฿2,500–5,000/night (mid-range). Budget guesthouses from ฿800.",
    season: "Best Dec–Apr. Nov and May stormy (Gulf side).",
  },
  {
    name: "Koh Phangan",
    emoji: "🌙",
    distance: "650km south",
    getThereFrom: "Bangkok: fly + ferry (3hr total) or train + ferry (13hr total). Cheapest from Koh Samui by speedboat (30min, ฿300)",
    vibe: "Full Moon Party island. Younger crowd. More raw than Samui. Yoga + party spectrum.",
    best: "Thong Sala area (local town), Haad Rin (Full Moon Party beach), Than Sadet waterfall",
    avoid: "Full Moon week unless you want 10,000 partying tourists.",
    budget: "฿1,000–2,500/night. Budget ฿400–800. Accommodation 10× price on Full Moon week.",
    season: "Best Dec–May. Sep–Nov rough.",
  },
  {
    name: "Koh Tao",
    emoji: "🤿",
    distance: "600km south",
    getThereFrom: "Bangkok: fly to Surat Thani + ferry or combined ticket (6–8hr). From Koh Phangan: 1hr speedboat.",
    vibe: "Diving capital of Southeast Asia. Small, laid-back. Most divers in the world get Open Water certified here.",
    best: "Diving Open Water course (฿8,000–11,000), Sairee Beach sunset, Japanese Gardens snorkel",
    avoid: "Choppy crossing in Nov–Dec can be rough. Worst dive viz Aug–Sep.",
    budget: "Dive package accommodation deals ฿800–1,500 (includes dives).",
    season: "Best Mar–Jun and Oct.",
  },
  {
    name: "Koh Lanta",
    emoji: "🌅",
    distance: "900km south",
    getThereFrom: "Bangkok: fly to Krabi Airport (฿1,500–2,500) then ferry 1–2hr. Or overnight bus + ferry (12hr).",
    vibe: "Quieter, family-friendly, lush interior. Long stretches of beach. Muslim fishing villages.",
    best: "Klong Dao Beach (calmest), Mu Koh Lanta Marine Park (boat tour), Old Town Baan Saladan",
    avoid: "May–Oct — national park closed, limited services, rough seas.",
    budget: "฿1,500–4,000 (mid-range resorts).",
    season: "Best Nov–Apr only.",
  },
];

export function BangkokIslandHopping() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        🏝️ Island hopping from Bangkok — Gulf vs Andaman
      </h2>
      <div className="space-y-2">
        {ISLANDS.map((is) => (
          <details key={is.name} className="border border-cyan-100 rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-cyan-700 transition">
              <span className="text-lg shrink-0">{is.emoji}</span>
              <span className="flex-1">{is.name}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{is.distance}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1.5">
              <div className="text-[10px]"><span className="font-bold">How to get there:</span> {is.getThereFrom}</div>
              <div className="text-[10px]"><span className="font-bold">Vibe:</span> {is.vibe}</div>
              <div className="text-[10px] text-green-700"><span className="font-bold">Best for:</span> {is.best}</div>
              <div className="text-[10px] text-orange-600">⚠️ Avoid: {is.avoid}</div>
              <div className="text-[10px]"><span className="font-bold">Budget:</span> {is.budget}</div>
              <div className="text-[10px] text-blue-700">📅 Season: {is.season}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
