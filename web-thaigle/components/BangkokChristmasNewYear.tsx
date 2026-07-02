const EVENTS = [
  {
    name: "CentralWorld Christmas Countdown",
    emoji: "🎄",
    when: "December 1 — January 1",
    area: "CentralWorld Plaza, Siam area",
    why: "Bangkok's biggest outdoor Christmas and New Year celebration. Giant Christmas tree, light displays, countdown stage, live performances, international food village. Central Plaza becomes an outdoor festival for a month.",
    tip: "Countdown party December 31 is ticketed (฿1,500–3,000). December 1–30 events are free. The week before Christmas has best decoration + smallest crowd. Arrive by 5pm for best photo spots.",
  },
  {
    name: "Iconsiam Countdown (Best in Bangkok)",
    emoji: "🎆",
    when: "December 31 countdown event",
    area: "ICONSIAM, Chao Phraya riverfront",
    why: "Bangkok's most spectacular New Year fireworks. Launched from the Chao Phraya River directly in front of ICONSIAM. 360-degree view from both banks. 5-minute fireworks show choreographed to music. Premium riverfront location.",
    tip: "Book riverside hotel 3–6 months ahead for New Year window views. Free viewing from Charoen Nakhon street (across river from ICONSIAM) — arrive by 9pm to stake a spot. ICONSIAM mall has NYE party (separate ticket).",
  },
  {
    name: "Khao San Road Street Party",
    emoji: "🥂",
    when: "December 31 from 8pm to 2am",
    area: "Khaosan Road, Banglamphu",
    why: "Bangkok's biggest free street party. Khaosan Road closes to vehicles 8pm–2am. International crowd of backpackers and expats. Live music stages, DJ sets, bucket cocktails, street food. No tickets — just show up.",
    tip: "Bring: cash only (ATMs run out), comfortable shoes (standing all night), no bags larger than small backpack (bag checks). Best spot: between Rambutri Road junction and the main stage. Midnight countdown is 10-second crowd countdown.",
  },
  {
    name: "Bangkok Christmas Afternoon Tea",
    emoji: "☕",
    when: "December 1 — January 2",
    area: "Mandarin Oriental / Park Hyatt / Lebua",
    why: "Bangkok's 5-star hotels go all-out on Christmas afternoon tea. Themed high tea with mince pies, Christmas pudding, yule log cake. Mandarin Oriental's festive tea is a Bangkok tradition. More memorable than shopping malls.",
    tip: "Reserve 2–3 weeks ahead — these are popular with Bangkok expat community doing holiday traditions. Best value: Capella Bangkok (฿1,800/person) and SO/ Bangkok (฿1,500/person). More affordable than London/Singapore equivalents.",
  },
];

export function BangkokChristmasNewYear() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🎄 Bangkok Christmas & New Year — countdown events & festive guide
      </div>
      <div className="space-y-2">
        {EVENTS.map((e) => (
          <div key={e.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{e.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{e.when} · {e.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{e.why}</div>
            <div className="text-[10px] text-red-700">💡 {e.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
