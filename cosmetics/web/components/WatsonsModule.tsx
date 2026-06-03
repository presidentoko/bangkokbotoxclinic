import type { Locale } from "@/lib/i18n";
import type { WatsonsData } from "@/lib/types";

export function WatsonsModule({ data, locale }: { data: WatsonsData; locale: Locale }) {
  if (!data || data.review_count === 0) return null;
  const isTh = locale === "th";
  return (
    <section className="space-y-4">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {isTh ? "รีวิวจาก Watsons" : "Watsons reviews"}
      </h2>
      <div className="flex items-center gap-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums text-green-700 leading-none">{data.review_count}</span>
          <span className="text-[10px] text-green-600 mt-0.5 uppercase tracking-wide">{isTh ? "รีวิว" : "reviews"}</span>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-green-500 font-medium">Watsons.co.th</span>
      </div>
      {data.snippets.slice(0, 4).map((s, i) => (
        <div key={i} className="rounded-2xl border border-[#e8f5e9] bg-[#f9fffe] px-5 py-4 shadow-sm">
          <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">&ldquo;{s.text.trim()}&rdquo;</p>
          <footer className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
            {s.author && <span className="text-green-700">{s.author}</span>}
            {(s.rating ?? 0) > 0 && <span className="text-amber-500">{"★".repeat(Math.round(s.rating!))}{"☆".repeat(Math.max(0, 5 - Math.round(s.rating!)))}</span>}
          </footer>
        </div>
      ))}
    </section>
  );
}
