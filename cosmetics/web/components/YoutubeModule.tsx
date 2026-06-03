import type { Locale } from "@/lib/i18n";
import type { YoutubeData } from "@/lib/types";

export function YoutubeModule({ data, locale }: { data: YoutubeData; locale: Locale }) {
  if (!data || data.comment_count === 0) return null;
  const isTh = locale === "th";
  return (
    <section className="space-y-4">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {isTh ? "คอมเมนต์จาก YouTube" : "YouTube comments"}
      </h2>
      <div className="flex items-center gap-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums text-red-600 leading-none">{data.video_count}</span>
          <span className="text-[10px] text-red-500 mt-0.5 uppercase tracking-wide">{isTh ? "วิดีโอ" : "videos"}</span>
        </div>
        <div className="w-px h-8 bg-red-200" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums text-red-600 leading-none">{data.comment_count}</span>
          <span className="text-[10px] text-red-500 mt-0.5 uppercase tracking-wide">{isTh ? "คอมเมนต์" : "comments"}</span>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-red-400 font-medium">▶ YouTube</span>
      </div>
      {data.snippets.slice(0, 4).map((s, i) => (
        <a key={i} href={`https://www.youtube.com/watch?v=${s.video_id}`} target="_blank" rel="noopener noreferrer"
          className="block rounded-2xl border border-[#f5e6d3] bg-[#fffaf5] px-5 py-4 shadow-sm hover:border-red-200 hover:bg-red-50 transition-colors group">
          <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">&ldquo;{s.text.trim()}&rdquo;</p>
          <footer className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
            {s.author && <span className="text-[#b08050]">{s.author}</span>}
            {(s.like_count ?? 0) > 0 && <span>👍 {s.like_count}</span>}
            <span className="ml-auto text-red-400 group-hover:text-red-600 transition-colors">
              {isTh ? "ดูวิดีโอ →" : "Watch →"}
            </span>
          </footer>
        </a>
      ))}
    </section>
  );
}
