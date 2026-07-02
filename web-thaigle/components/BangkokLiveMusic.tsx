const VENUES = [
  {
    name: "Saxophone Pub & Restaurant",
    emoji: "🎷",
    area: "Victory Monument",
    genre: "Jazz, Blues, R&B — live every night",
    price: "No cover. Beer from ฿120, cocktails ฿180",
    why: "Bangkok's most beloved jazz venue since 1987. Two floors, live bands from 8pm. Authentic dimly-lit jazz club atmosphere. Mix of Thai jazz musicians and international acts.",
    tip: "Arrive by 8pm for good seats. Thursday–Saturday best bands. Food menu is surprisingly good (Thai-Western). Dress casual — not pretentious at all despite reputation.",
    hours: "Daily 6pm–2am",
  },
  {
    name: "Bamboo Bar (Mandarin Oriental)",
    emoji: "🎹",
    area: "Mandarin Oriental Hotel, Charoen Krung",
    genre: "Jazz, Soul, Blues — resident band + touring acts",
    price: "No cover. Cocktails from ฿450",
    why: "Bangkok's most prestigious jazz venue — 60+ years of history. Legendary guest performances. Intimate, beautiful setting in the world's most celebrated Bangkok hotel. International touring jazz acts.",
    tip: "Smart casual required (no flip flops or tank tops). Reservations recommended for dinner+show packages. Live music starts 9pm. Sunday jazz brunch also popular.",
    hours: "Tue–Sun 6pm–1am",
  },
  {
    name: "Live RCA / Soi 11",
    emoji: "🎸",
    area: "Royal City Avenue (RCA) and Sukhumvit Soi 11",
    genre: "Rock, Pop, Electronic — venue-dependent",
    price: "Some venues no cover, some ฿200–500",
    why: "RCA is Bangkok's entertainment strip. Multiple live music bars within walking distance: Route 66 (rock covers), Onyx (electronic with live DJ), Fat Gutz (blues+rock). Soi 11 has smaller live acts.",
    tip: "RCA best Wednesday–Saturday. Route 66 most consistent for live bands 9pm–midnight. Onyx is more dance club than live music. Start at Fat Gutz on Soi 11 for authentic live rock.",
    hours: "Varies. Most open 9pm–2am",
  },
  {
    name: "Studio Lam",
    emoji: "💿",
    area: "Sukhumvit Soi 51",
    genre: "Global music, afrobeat, Southeast Asian sounds",
    price: "No cover. Cocktails ฿280–420",
    why: "Cult favorite vinyl bar and occasional live music space. Run by DJ Maft Sai (one of Thailand's most respected music curators). Rare Southeast Asian and global record selection. Live sets some nights.",
    tip: "Check Instagram for live event nights (not every night). Even without live acts — vinyl DJ sets and the bar atmosphere make it worth visiting. Molam, Luk Thung, Thai soul playlists.",
    hours: "Tue–Sun 6pm–midnight",
  },
];

export function BangkokLiveMusic() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎷 Live music venues in Bangkok — jazz, blues, rock & more
      </div>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{v.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{v.genre} · {v.area} · {v.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-purple-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
