const SPOTS = [
  {
    name: "Paragliding at Khao Yai — Closest Thermal Zone",
    emoji: "🪂",
    area: "Khao Yai / Pak Chong area (2.5 hrs from Bangkok)",
    price: "Tandem flight ฿2,500–4,000; Beginner P2 course ฿18,000–30,000",
    why: "The hills around Khao Yai National Park and Pak Chong provide the closest thermal conditions to Bangkok suitable for paragliding. The topography — forested ridges rising 500–800m above the plateau — creates reliable thermal lift during the cool season (November–February). Several Thailand Paragliding Association (TPA) affiliated schools operate in this area with IPPI (International Pilot Proficiency Identification) certified instructors. Tandem flights for first-timers are the primary offering.",
    tip: "Best paragliding weather near Bangkok: November–February for reliable thermal activity and reduced rain risk. A tandem paragliding flight lasts 15–30 minutes in ideal conditions. P2 licence (entry-level pilot qualification) requires approximately 8–12 days of ground training, simulator work, and supervised solo flights — typically done as a residential course at the flying site. Thailand Paragliding Association website lists certified schools.",
  },
  {
    name: "Skydiving — Jumpzone Pattaya",
    emoji: "🪂",
    area: "Pattaya (2 hrs from Bangkok) — Jumpzone Dropzone",
    price: "Tandem skydive ฿11,000–16,000; AFF course ฿35,000–55,000",
    why: "Jumpzone in Pattaya is Thailand's most established civilian skydiving operation — USPA (United States Parachute Association) affiliated, multiple aircraft, and a consistent safety record. Tandem skydive (strapped to an instructor, no prior experience) jumps from 10,000–14,000 feet above the Gulf of Thailand coast, with clear-sky visibility to the islands on good days. The AFF (Accelerated Freefall) course creates independent skydivers in approximately 8 jumps.",
    tip: "Jumpzone Pattaya booking: reserve online at least 1 week ahead for weekends. Weight limit for tandem: 90kg (strictly enforced for safety). The freefall portion of a tandem jump lasts 40–60 seconds at 14,000ft; canopy flight to landing takes 5–8 minutes. The coastal view during canopy phase (islands, beaches, urban Pattaya) is dramatic on clear days. Bring appropriate ID — all jumpers register with name and passport number.",
  },
  {
    name: "Hot Air Ballooning",
    emoji: "🎈",
    area: "Chiang Rai / Chiang Mai (fly from Bangkok, 1 hr); Phra Nakhon Si Ayutthaya",
    price: "Flight ฿7,000–15,000/person",
    why: "Hot air ballooning in Thailand is centered in the North (Chiang Mai/Chiang Rai) where valley terrain, rice paddies, and mountain backdrops create the most spectacular balloon flight environments. The Chiang Mai area balloon operators run dawn flights year-round (best November–March). Balloon flights over Ayutthaya's ancient ruins occasionally operate for special events. For Bangkok-based travelers: a weekend trip to Chiang Mai for dawn balloon flight is a highly accessible luxury experience.",
    tip: "Hot air balloon flights require early morning starts — typically 5:30am for pre-dawn setup, launch at first light (6:00–6:30am). Flights last 1–1.5 hours. Dress warmer than expected — balloon baskets are cold at altitude even in Thailand's climate. Most Chiang Mai balloon operators include breakfast after landing as part of the package. Book directly with balloon operators rather than through tour aggregators for better communication and flexibility.",
  },
];

export function BangkokParagliding() {
  return (
    <div className="rounded-2xl border border-sky-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-800 mb-3">
        🪂 Air sports near Bangkok — paragliding Khao Yai, skydiving Pattaya & hot air balloon
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-sky-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
