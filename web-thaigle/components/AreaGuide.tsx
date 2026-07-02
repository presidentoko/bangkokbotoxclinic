const AREAS = [
  { name: "Sukhumvit", emoji: "🏙️", vibe: "Expat hub · international food · nightlife", url: "/restaurants/bangkok/sukhumvit", restaurants: "1,200+", activities: "muay-thai, spa, yoga" },
  { name: "Silom", emoji: "💼", vibe: "Business district · fine dining · Lumpini Park", url: "/activities/silom", restaurants: "600+", activities: "spa, muay-thai" },
  { name: "Chatuchak", emoji: "🛍️", vibe: "Weekend market · local gems · craft cafés", url: "/restaurants/bangkok/chatuchak", restaurants: "400+", activities: "cooking, yoga" },
  { name: "Ari", emoji: "🌿", vibe: "Trendy local · healthy cafés · creative scene", url: "/restaurants/bangkok/ari", restaurants: "300+", activities: "yoga, spa" },
  { name: "Thonglor", emoji: "✨", vibe: "Premium · Japanese food · rooftop bars", url: "/restaurants/bangkok/thonglor", restaurants: "500+", activities: "spa, yoga" },
  { name: "Ekkamai", emoji: "🍃", vibe: "Hipster · fusion food · indie galleries", url: "/restaurants/bangkok/ekkamai", restaurants: "250+", activities: "cooking, yoga" },
];

export function AreaGuide() {
  return (
    <section className="my-6">
      <h2 className="text-lg font-black mb-3">Explore by Bangkok Area</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {AREAS.map((a) => (
          <a
            key={a.name}
            href={a.url}
            className="group block border border-[var(--border)] rounded-xl p-3 bg-white hover:border-orange-400 hover:shadow-md transition"
          >
            <div className="text-xl mb-1">{a.emoji}</div>
            <div className="font-bold text-sm group-hover:text-orange-700 transition">{a.name}</div>
            <div className="text-xs text-[var(--muted)] leading-tight mt-0.5">{a.vibe}</div>
            <div className="text-xs font-bold text-orange-600 mt-1">{a.restaurants} venues</div>
          </a>
        ))}
      </div>
    </section>
  );
}
