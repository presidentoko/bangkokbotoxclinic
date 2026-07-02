const SPOTS = [
  {
    name: "Skateboarding in Bangkok — Parks & Street Spots",
    emoji: "🛹",
    area: "Benchasiri Park (Sukhumvit), Central Park area, Siam Square, various street spots citywide",
    price: "Skateboard rental ฿100–200/hour; Skate park entry free (public); Lessons ฿500–1,500/hour",
    why: "Bangkok's skateboarding scene has grown from a 1990s street skating underground into an established community with dedicated park infrastructure. The primary skateboarding locations: Benchasiri Park (Sukhumvit Soi 24, near Phrom Phong BTS) has Bangkok's most visible skate park with concrete transitions and rails; the Siam Square area and Central World Plaza surroundings have street skating spots used by Bangkok's skate community; and newer parks in outer districts have added capacity. The Thai skateboarding scene is youth-dominated and increasingly connects to international skateboarding culture through social media — Thai skaters have competed internationally, and the 2021/2024 Olympic skateboarding events increased mainstream visibility. Bangkok's street skating has distinct spots: wide marble plazas, stairsets, and architectural features throughout the city create constant obstacle variety.",
    tip: "Bangkok skateboarding community access: the Bangkok skating community gathers at Benchasiri Park most consistently on weekends; showing up with a board and respectful attitude is the standard introduction approach. Equipment: boards, wheels, and basic protective gear are available at skate shops in the Siam Square area and through Bangkok-based online retailers — imported gear is available at significantly higher cost than home market prices. Safety: Bangkok street skating has real hazards (traffic, uneven pavement, security guards who restrict skating near private buildings) — understand local norms before skating unfamiliar areas. Skateboarding in Bangkok weather: the dry season (November–April) is optimal for outdoor skating; rainy season (May–October) interrupts outdoor sessions frequently.",
  },
  {
    name: "BMX & Inline Skating",
    emoji: "🚲",
    area: "Skateparks, waterfront paths, Benjakitti Park, specific BMX tracks in outer Bangkok",
    price: "BMX track access ฿free–100; Inline skate rental ฿100–200; BMX bike rental uncommon (bring your own)",
    why: "Bangkok's BMX and inline skating scenes exist within a similar urban youth culture space as skateboarding. BMX has dedicated tracks in outer Bangkok areas — the Thailand BMX Federation maintains tracks used for training and competition; these are generally accessible to enthusiastic visitors. The inline skating community in Bangkok uses Benjakitti Park (around the lake circuit) and the Chao Phraya riverside promenade heavily — Bangkok's paved riverside walkway sections (near Saphan Taksin and extending north) provide continuous flat skating with river views. Roller hockey and artistic skating have small but organized communities through the skating rink at Central World and similar facilities.",
    tip: "Bangkok inline skating: the Benjakitti Park loop (approximately 2km paved, flat) is the most popular inline skating circuit in Bangkok — the morning hours (6–9am) before the park fills are optimal. Skate rental at Benjakitti: vendors at the park entrance rent inline skates — quality varies; bringing your own skates is preferable for serious skating. BMX community: the Bangkok BMX community uses Facebook groups for track locations, jam events, and social rides — searching 'BMX Bangkok' or 'Thailand BMX' accesses the current community. Night skating: Bangkok's warm evenings make night skating on paved paths attractive — Rama VIII Bridge riverside park and sections of the Chao Phraya riverside have lighting for evening skaters.",
  },
  {
    name: "Freestyle Scootering & Urban Action Sports",
    emoji: "🛴",
    area: "Skateparks, action sports parks in Bangkok, shopping mall indoor parks",
    price: "Indoor action sports park ฿200–400 entry; Scooter park access ฿50–200; Lessons ฿500–1,000",
    why: "Freestyle scootering has become one of the fastest-growing urban action sports globally among younger demographics — Bangkok is no exception. The scooter community uses the same skatepark infrastructure as skateboarding (Benchasiri Park, newer district parks) and has its own dedicated events and social media presence. Bangkok has also developed indoor action sports facilities in shopping mall spaces — particularly in outer Bangkok malls with larger floor plate footprints — that provide skateboarding, scootering, and BMX facilities in air-conditioned environments, bypassing Bangkok's weather constraints. These indoor facilities often include skill progression coaching programs more structured than street/park environments.",
    tip: "Bangkok urban action sports community: the community is heavily social media-organized — Instagram and TikTok accounts for Bangkok skate/scooter/BMX content surface current activity. The shopping mall indoor action sports parks (various outer Bangkok malls) are most visible for organized, structured learning — coaching staff and beginner-appropriate obstacles make them appropriate starting points for complete beginners. Community events: organized skate competitions, jam sessions, and manufacturer demo events occur periodically in Bangkok — following community social media accounts provides advance notice. Cross-discipline community: the Bangkok skateboarding, scootering, and BMX communities significantly overlap in terms of participants, venues, and social events — the action sports community is more unified than divided.",
  },
];

export function BangkokSkateboarding() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🛹 Bangkok skateboarding & action sports — skate parks, BMX & inline skating
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-violet-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
