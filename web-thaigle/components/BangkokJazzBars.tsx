const BARS = [
  {
    name: "Bamboo Bar (Mandarin Oriental Hotel)",
    emoji: "🎷",
    area: "Charoen Krung (Mandarin Oriental Hotel)",
    nights: "Live jazz Tue–Sun from 8:30pm",
    price: "Cocktails ฿450–850; smart casual required",
    why: "Bangkok's most legendary jazz bar, opened in the 1950s. Weekly international jazz acts ranging from solo piano to full jazz quartet. In the iconic Mandarin Oriental Hotel. Intimate, wood-paneled room. Not just a tourist destination — serious jazz musicians perform here.",
    tip: "Reservation essential for weekends (book via hotel). Smart casual enforced: no shorts or flip-flops, collared shirts preferred. Tuesday 'local jazz night' has upcoming Thai jazz talent at lower cover charge. Single malt whisky and classic cocktails are the house drinks.",
  },
  {
    name: "Brown Sugar Jazz Restaurant",
    emoji: "🎺",
    area: "Sarasin Road, Lumpini",
    nights: "Live jazz nightly from 7pm",
    price: "Drinks ฿120–320; food available",
    why: "Bangkok's longest-running dedicated jazz venue. Live music every night including weekdays. Mixed Thai and international performers — some of Bangkok's best jazz musicians play here regularly. More accessible pricing than Bamboo Bar. Good Thai-Western food menu.",
    tip: "Best visited Tuesday–Thursday when local jazz regulars play. Friday–Saturday have more mainstream jazz crowd and higher prices. The bar's own regular musicians are excellent — don't assume big names = better jazz here.",
  },
  {
    name: "Iron Fairies (Fairy tale jazz-themed bar)",
    emoji: "🧚",
    area: "Thonglor Soi 9",
    nights: "Live music Wed–Sat, starts 9pm",
    price: "Cocktails ฿300–550",
    why: "Enchanted-forest themed cocktail bar with jazz music. Not a pure jazz venue but the music program leans toward jazz and blues with theatrical production value. Unique Bangkok experience — fairy lights, metalwork, intimate booths, craft cocktails. Instagram-famous for atmosphere.",
    tip: "No reservations — queue forms from 8:30pm weekends. Go on Wednesday (less crowded, same music quality). Their signature cocktails are balanced and clever. The bar sells handmade metal fairy figurines at entrance — Instagram moment before entering.",
  },
  {
    name: "Saxophone Pub & Restaurant",
    emoji: "🎸",
    area: "Victory Monument area",
    nights: "Live music nightly from 8pm",
    price: "Drinks ฿100–250; very Bangkok",
    why: "Bangkok's best value live music venue. Multiple acts nightly — jazz, blues, rock, reggae rotating. More local crowd than tourist bars. Huge venue capacity. Running since 1987. Attached restaurant with Thai food. Underground Bangkok music institution.",
    tip: "Victory Monument is easily reachable by BTS. Saxophone doesn't specialize in only jazz — check weekly schedule for jazz nights specifically. Tuesday and Thursday tend toward jazz. No cover charge on most nights (budget option vs Bamboo Bar). Cash only.",
  },
];

export function BangkokJazzBars() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🎷 Jazz bars in Bangkok — from legendary Bamboo Bar to local gems
      </h2>
      <div className="space-y-2">
        {BARS.map((b) => (
          <div key={b.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{b.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{b.nights} · {b.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.why}</div>
            <div className="text-[10px] text-amber-700">💡 {b.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
