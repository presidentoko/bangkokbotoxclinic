const OPTIONS = [
  {
    name: "Wat Mahathat (National Museum Meditation Center)",
    emoji: "🧘",
    type: "Vipassana day/half-day",
    location: "Maharat Rd, Old City (Tha Chang pier)",
    cost: "Free (donations welcome)",
    schedule: "Daily teaching 7am, 1pm, 6pm. English instruction available.",
    why: "Thailand's most accessible introduction to meditation. Thai monks teach the basics. You can drop in without booking. 2–4 hr sessions.",
    tip: "Dress code: shoulders and knees covered. No shorts. Bare feet inside.",
  },
  {
    name: "Wat Pho Traditional Medical School (Wellness)",
    emoji: "☯️",
    type: "Mindful massage + breathwork",
    location: "Phra Nakhon (next to Grand Palace)",
    cost: "฿420–600",
    schedule: "Daily 8am–5pm. 1hr and 2hr sessions.",
    why: "Wat Pho massage school teaches traditional Thai healing alongside mindfulness. The masseuses explain each technique as a meditation in movement.",
    tip: "Book the 2hr traditional Thai massage early morning (7am opening). Best in the pavilion garden setting.",
  },
  {
    name: "Insight Meditation Society Bangkok",
    emoji: "🌿",
    type: "Vipassana 5–10 day silent retreat",
    location: "Bangkapi area (70km from city center)",
    cost: "฿1,500–5,000 (dana-based, suggested)",
    schedule: "Monthly 5-day and 10-day retreats in English",
    why: "Most serious meditation option. Noble silence. 10-hour daily practice. Permanent change in how you experience stress.",
    tip: "Register minimum 4 weeks in advance. Physical and mental health questionnaire required.",
  },
  {
    name: "Urbanice by SPA Cenvaree",
    emoji: "🌸",
    type: "Urban wellness + meditation",
    location: "Centara Grand CentralWorld",
    cost: "฿1,500–3,500/session",
    schedule: "Daily 9am–8pm. Book 48hr in advance.",
    why: "Luxury wellness with mindfulness elements. Sound bath, breathwork + traditional Thai herbal treatment combo. Great for stressed city travelers.",
    tip: "Sunday morning sound bath (฿2,500) combines gong bath + meditation — best single session.",
  },
];

export function BangkokMeditationRetreats() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🧘 Meditation & mindfulness in Bangkok
      </h2>
      <div className="space-y-2.5">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.type} · {o.location}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.cost}</span>
            </div>
            <div className="text-[10px] text-teal-700 mb-0.5">🕐 {o.schedule}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-orange-600">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
