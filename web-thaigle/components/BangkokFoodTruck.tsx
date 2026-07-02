const SPOTS = [
  {
    name: "Artbox Bangkok — Pop-up Food Trucks",
    emoji: "🚚",
    area: "Artbox Bangkok (location changes seasonally — check @artboxbangkok on IG)",
    price: "Average dish ฿80–250",
    why: "Artbox Bangkok is Thailand's largest pop-up container market — typically 300+ vendors including a large food truck and street food section. The food selection is deliberately international and instagrammable: boba tea served in unusual containers, giant dumplings, Japanese taiyaki, Korean tteokbokki, Taiwanese scallion pancakes alongside Thai-twist items. The food quality is secondary to the experience but some vendors are genuinely excellent.",
    tip: "Artbox typically runs 4–5pm to midnight on weekends. Arrive at 5–6pm for best food selection before popular items sell out. Food trucks circulate between Artbox editions — Instagram is the best way to see which trucks will attend which events. The Artbox food truck zone is separate from the craft market zone — enter through the main gate and follow the food smell.",
  },
  {
    name: "Jodd Fairs Market Food Trucks",
    emoji: "🎪",
    area: "Jodd Fairs Dan Neramit, Ratchadapisek",
    price: "Dishes ฿60–200",
    why: "Jodd Fairs is Bangkok's longest-running trendy night market — more food-focused than Artbox, less Instagram-gimmick and more actual street food trucks. Korean BBQ trucks, Thai-style fried chicken trucks, Italian pizza trucks, Taiwanese bubble tea trucks, and regional Thai specialties coexist. The night market format (6pm–midnight Thursday–Sunday) creates an authentic food truck and night market hybrid experience.",
    tip: "Jodd Fairs Dan Neramit is near MRT Thailand Cultural Centre — walkable from the station. The food trucks in Jodd Fairs change seasonally. The best strategy: arrive hungry, walk the entire market once without buying, identify the highest-quality options (look for the busiest queues with Thai customers), then eat. Thai customers' queue judgment is more reliable than signage.",
  },
  {
    name: "Bangkok Food Truck Parks & Events",
    emoji: "🏙️",
    area: "Various — Asiatique, Central Rama 9, weekend markets",
    price: "Mains ฿100–350",
    why: "Bangkok has a growing food truck park scene separate from the pop-up market circuit. Asiatique the Riverfront has permanent food truck vendors alongside restaurant units. Central Rama 9's outdoor space hosts rotating food trucks. The Food Truck Festival Thailand (annual, location varies) is the largest dedicated event. Corporate office buildings in Silom and Bangna have food trucks visiting weekly for lunch crowds.",
    tip: "Tracking Bangkok food trucks: Line Official Account groups and Facebook groups like 'Bangkok Food Trucks' coordinate events. Bangkok-based food truck owners frequently operate both a truck and a physical restaurant — the truck version is often cheaper with a more limited menu. Food trucks that appear at office lunch events (Silom/Asoke corporate zones) tend to be higher quality — they need to satisfy repeat business.",
  },
];

export function BangkokFoodTruck() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🚚 Food trucks in Bangkok — Artbox pop-ups, Jodd Fairs & weekend market trucks
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
