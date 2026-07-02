const FORMATS = [
  {
    emoji: "☀️",
    name: "Morning flow (6–8am)",
    price: "฿300–600 drop-in",
    style: "Vinyasa or Hatha. Set the tone for the whole day. Most popular slot — book ahead.",
    areas: "Ari, Ekkamai, Onnut",
  },
  {
    emoji: "🧘",
    name: "Hot yoga",
    price: "฿350–700 drop-in",
    style: "40°C room, 26 Bikram poses or heated vinyasa. Intense sweat. Bring your own mat or rent.",
    areas: "Phrom Phong, Siam, Silom",
  },
  {
    emoji: "🌿",
    name: "Yin / restorative",
    price: "฿280–550 drop-in",
    style: "Slow, passive holds 3–5 min each. Deep tissue release. Perfect after Muay Thai or long walks.",
    areas: "Most studios offer at least 2 per week",
  },
  {
    emoji: "📅",
    name: "Monthly membership",
    price: "฿2,000–4,500 / month",
    style: "Unlimited classes, access to workshops, community events. Break even at 6–7 classes.",
    areas: "Lila Yoga, Pure Yoga, Yoga Elements Bangkok",
  },
];

export function YogaGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🧘 Yoga in Bangkok — at a glance
      </div>
      <div className="space-y-2">
        {FORMATS.map((f) => (
          <div key={f.name} className="flex gap-3 items-start p-3 rounded-xl border border-[var(--border)]">
            <span className="text-xl shrink-0 leading-none mt-0.5">{f.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-xs">{f.name}</span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-bold shrink-0">{f.price}</span>
              </div>
              <div className="text-[11px] text-[var(--muted)] leading-snug mt-0.5">{f.style}</div>
              <div className="text-[10px] text-[var(--muted)] mt-0.5">Popular in: <span className="font-medium">{f.areas}</span></div>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/activities/yoga-pilates"
        className="mt-3 block text-center text-xs font-bold text-purple-600 border border-purple-200 bg-purple-50 rounded-full py-1.5 hover:bg-purple-100 transition"
      >
        Find yoga studios Bangkok →
      </a>
    </div>
  );
}
