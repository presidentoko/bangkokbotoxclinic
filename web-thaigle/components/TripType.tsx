const TYPES = [
  { label: "Backpacker", emoji: "🎒", desc: "Budget tips, hostels & street food", url: "/activities/budget" },
  { label: "Digital Nomad", emoji: "💻", desc: "Co-working, fast WiFi & cafés", url: "/activities/digital-nomad" },
  { label: "First Timer", emoji: "🗺️", desc: "Essentials, must-do & what to skip", url: "/activities/first-time-bangkok" },
  { label: "Wellness Retreat", emoji: "🧘", desc: "Yoga, spa & mindful eating", url: "/activities/wellness-week" },
  { label: "Foodie", emoji: "🍜", desc: "Street food, fine dining & cooking classes", url: "/local-tips" },
  { label: "Couple", emoji: "💑", desc: "Romantic spots & shared experiences", url: "/for/date-night" },
];

export function TripType() {
  return (
    <div className="my-4">
      <div className="text-sm font-black mb-3">🧭 What's your trip style?</div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TYPES.map((t) => (
          <a
            key={t.label}
            href={t.url}
            className="shrink-0 border border-[var(--border)] rounded-xl p-3 bg-white hover:border-orange-400 hover:shadow-md transition w-32 block"
          >
            <div className="text-xl mb-1">{t.emoji}</div>
            <div className="font-bold text-xs mb-0.5">{t.label}</div>
            <div className="text-[10px] text-[var(--muted)] leading-tight">{t.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
