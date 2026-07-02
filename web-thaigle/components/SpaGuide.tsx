const TYPES = [
  {
    emoji: "💆",
    name: "Traditional Thai massage",
    duration: "60–120 min",
    price: "฿200–500",
    feel: "Intense, deep pressure. Fully clothed on mat.",
    tip: "Normal to feel sore next day — that's it working. Tell therapist if pain exceeds 7/10.",
  },
  {
    emoji: "🛢️",
    name: "Oil massage",
    duration: "60–90 min",
    price: "฿300–600",
    feel: "Relaxing, full-body strokes. Lighter pressure. Good for first-timers or sensitive muscles.",
    tip: "Ask for Swedish style if you want very gentle. Aromatherapy add-on usually ฿50–100 extra.",
  },
  {
    emoji: "🦶",
    name: "Foot massage",
    duration: "45–60 min",
    price: "฿150–300",
    feel: "Reflexology points on feet and calves. Seated. Perfect after walking all day.",
    tip: "Foot massage streets: Sukhumvit Soi 12, Silom, and Chinatown have cheap, good options.",
  },
  {
    emoji: "✨",
    name: "Luxury spa package",
    duration: "2–4 hours",
    price: "฿1,500–5,000+",
    feel: "Full experience: scrub + body wrap + massage + steam. Resort-quality in Bangkok.",
    tip: "Book 1–2 days in advance for hotel spas. Arium, Divana, and Let's Relax are crowd favorites.",
  },
];

export function SpaGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💆 Bangkok massage — which type?
      </div>
      <div className="space-y-3">
        {TYPES.map((t) => (
          <div key={t.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.emoji}</span>
                <span className="font-bold text-xs">{t.name}</span>
              </div>
              <span className="text-xs font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-bold">{t.price}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-1"><span className="font-medium">Feel:</span> {t.feel}</div>
            <div className="text-[10px] text-[var(--muted)]"><span className="font-medium">Tip:</span> {t.tip}</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5 font-medium">{t.duration}</div>
          </div>
        ))}
      </div>
      <a
        href="/activities/spa"
        className="mt-3 block text-center text-xs font-bold text-purple-600 border border-purple-200 bg-purple-50 rounded-full py-1.5 hover:bg-purple-100 transition"
      >
        Find Bangkok spas & massage →
      </a>
    </div>
  );
}
