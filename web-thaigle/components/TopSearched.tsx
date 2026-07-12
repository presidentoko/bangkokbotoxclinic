const TRENDING_TOPICS = [
  { label: "Muay Thai gyms Sukhumvit", url: "/activities/muay-thai" },
  { label: "Best Thai massage Bangkok", url: "/activities/spa" },
  { label: "Cooking class Silom", url: "/activities/cooking" },
  { label: "Rooftop bars Bangkok 2026", url: "/for/views" },
  { label: "Budget restaurants Bangkok", url: "/activities/budget" },
  { label: "Best ramen Bangkok", url: "/restaurants/cuisine/japanese" },
  { label: "Yoga studios Ari", url: "/activities/yoga-pilates" },
  { label: "Halal food Bangkok", url: "/for/halal" },
  { label: "Brunch Thonglor 2026", url: "/restaurants/bangkok/watthana" },
  { label: "Night market Bangkok", url: "/local-tips" },
];

export function TopSearched() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🔍 Trending searches
      </div>
      <div className="flex flex-wrap gap-2">
        {TRENDING_TOPICS.map((t) => (
          <a
            key={t.url}
            href={t.url}
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-gray-50 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition"
          >
            {t.label}
          </a>
        ))}
      </div>
    </div>
  );
}
