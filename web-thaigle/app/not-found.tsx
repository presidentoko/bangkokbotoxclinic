import { NICHES } from "@/lib/niches";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";

// With dynamicParams=false on every enumerated route, any stale or
// mistyped URL across ~15k pages previously hit Next's unbranded default
// 404 with zero recovery navigation — this gives a lost visitor somewhere
// to go instead of a dead end.
const TOP_CUISINES = ["thai", "street_food", "japanese", "korean", "seafood", "cafe"];

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🧭</div>
      <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Page not found</h1>
      <p className="text-[var(--muted)] mb-8">
        That page doesn&apos;t exist or has moved. Here&apos;s where to go instead.
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <a href="/" className="px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition">
          🏠 Home
        </a>
        <a href="/restaurants" className="px-4 py-2 rounded-full border border-[var(--border)] bg-white text-sm font-bold hover:border-orange-300 hover:text-orange-600 transition">
          🍜 Restaurants
        </a>
        <a href="/activities" className="px-4 py-2 rounded-full border border-[var(--border)] bg-white text-sm font-bold hover:border-orange-300 hover:text-orange-600 transition">
          🎯 Activities
        </a>
      </div>

      <div className="text-left">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Popular activities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {NICHES.map((n) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[var(--border)] hover:border-orange-300 hover:shadow-sm transition text-sm font-bold"
            >
              <span className="text-lg">{n.icon}</span>
              {n.label}
            </a>
          ))}
        </div>

        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Popular cuisines</h2>
        <div className="flex flex-wrap gap-2">
          {TOP_CUISINES.map((c) => (
            <a
              key={c}
              href={`/restaurants/cuisine/${c}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-sm hover:border-orange-300 hover:text-orange-600 transition"
            >
              <span>{CUISINE_ICONS[c] ?? "🍽️"}</span>
              {CUISINE_LABELS[c] ?? c}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
