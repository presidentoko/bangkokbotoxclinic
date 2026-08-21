const SPOTS = [
  {
    name: "Wat Arun at sunrise",
    emoji: "🌅",
    when: "6:00–7:30am",
    tip: "Shoot from the Tha Tien ferry pier side. ฿4 ferry. Backlit spire in golden hour = iconic.",
    vibe: "Spiritual / iconic",
    crowd: "Low before 7am",
  },
  {
    name: "Bangkok from Baiyoke Sky",
    emoji: "🌆",
    when: "Sunset (6–7pm) or 8–10pm",
    tip: "66th floor observation deck ฿300 (includes drink). Best city grid panorama in Bangkok.",
    vibe: "Cityscape / skyline",
    crowd: "Moderate",
  },
  {
    name: "Khlong Lat Mayom (canal houses)",
    emoji: "🛶",
    when: "Morning 8–10am",
    tip: "Local floating market, wooden canal houses. Take Grab to 'Khlong Lat Mayom'. Sat–Sun only.",
    vibe: "Local / documentary",
    crowd: "Very low",
  },
  {
    name: "Neon street food — Yaowarat",
    emoji: "🏮",
    when: "8–11pm",
    tip: "Shoot looking down the main Yaowarat Road with tuk-tuks in foreground. Best on weekdays.",
    vibe: "Street / night life",
    crowd: "High",
  },
  {
    name: "Lumphini Park lake reflections",
    emoji: "🌳",
    when: "6:30–8:00am",
    tip: "Monitor lizards at the lake edge at dawn. Misty reflections of skyscrapers in the water.",
    vibe: "Nature / contrast",
    crowd: "Low",
  },
  {
    name: "Chatuchak weekend market",
    emoji: "🎨",
    when: "10am–noon before it gets crowded",
    tip: "Saturdays or Sundays only. Section 26 (vintage) and Section 2 (art) most photogenic.",
    vibe: "Market / colour",
    crowd: "Very high after noon",
  },
];

export function BangkokPhotoSpots() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📸 Best Bangkok photo spots
      </h2>
      <div className="grid gap-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="flex gap-3 border border-[var(--border)] rounded-xl p-3">
            <span className="text-2xl shrink-0">{s.emoji}</span>
            <div className="min-w-0">
              <div className="font-bold text-xs mb-0.5">{s.name}</div>
              <div className="text-[10px] text-blue-600 mb-0.5">🕐 {s.when} · 👥 {s.crowd}</div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">{s.tip}</div>
              <div className="text-[10px] text-purple-600 font-medium mt-0.5">#{s.vibe.toLowerCase().replace(" / ", " #").replace(" ", "")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
