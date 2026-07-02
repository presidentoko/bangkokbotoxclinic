const SPOTS = [
  {
    name: "Mahanakhon Skywalk Glass Floor",
    emoji: "🌃",
    area: "King Power Mahanakhon, BTS Chong Nonsi",
    price: "Entry ฿1,080",
    why: "Bangkok's highest observation point (314m, glass floor section) offers unobstructed city light photography at night. The glass floor looking down 78 floors while Bangkok's lights stretch to the horizon is genuinely dramatic. Best for wide-angle city overview photography, light trail photography toward Silom/Sathorn, and the Chao Phraya river as a dark ribbon through the glittering city.",
    tip: "Best camera settings from Mahanakhon: ISO 400–800, f/2.8–4, 1/60s or faster to avoid motion blur (you're moving with the building's subtle sway). The glass floor photography requires lying down or kneeling — staff allow this. Arrive 45 minutes before sunset to capture the golden hour + city lights transition.",
  },
  {
    name: "Yaowarat Chinatown at Night",
    emoji: "🔴",
    area: "Yaowarat Road, Bangrak",
    price: "Free",
    why: "Yaowarat's neon light environment is exceptional for night photography — red paper lanterns, gold shop fronts, street food wok fire, Chinese temple candles, tuk-tuk light trails. The challenge is the density — this is a working street and the photographic element is the chaotic life. Best shots are candid, fast, and spontaneous.",
    tip: "Shoot in P or A mode with Auto ISO (cap at 3200) in Yaowarat — the light changes dramatically within meters. A 35mm or 50mm prime lens captures the scene better than zoom. The corner of Yaowarat and Charoen Krung roads at 7–9pm has the densest photographic opportunity. Be discreet with expensive camera equipment.",
  },
  {
    name: "Riverside at Night — Wat Arun & State Tower",
    emoji: "🌉",
    area: "Chao Phraya River, Tha Tien pier",
    price: "Free (river view); State Tower rooftop ฿1,500+ minimum spend",
    why: "Wat Arun at night (illuminated 6:30pm–midnight) reflected in the Chao Phraya is Bangkok's most iconic night photography composition. The Lebua State Tower's Sirocco bar (famous from The Hangover 2) is across the river — the approach involves shooting the Wat Arun from a river ferry or Tha Tien pier. The ICONSIAM waterfront promenade provides the clearest unobstructed river shot at night.",
    tip: "Best Wat Arun night shots: from the east bank (Tha Tien pier area) looking west. The temple is most dramatically lit at 7–8pm. A tripod gives the best quality for 1–2 second exposures, but handheld at ISO 3200 with image stabilization is viable. The chao phraya tourist boat (฿60) gives a moving platform shot from water level.",
  },
];

export function BangkokNightPhotography() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🌃 Night photography in Bangkok — skyline, Chinatown neon & Wat Arun reflections
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-slate-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
