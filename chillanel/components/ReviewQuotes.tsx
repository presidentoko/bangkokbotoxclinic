import Link from "next/link";
import type { Lang } from "@/lib/site";

export type QuoteItem = {
  quote: string;
  therapistName: string;
  placeName: string;
  placeId: string;
};

export function ReviewQuotes({ title, items, lang }: { title: string; items: QuoteItem[]; lang: Lang }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-14">
      <h2 className="font-display italic text-2xl sm:text-3xl mb-6">{title}</h2>
      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <Link
            key={`${item.placeId}-${i}`}
            href={`/${lang}/place/${item.placeId}`}
            className="group snap-start shrink-0 w-[260px] sm:w-[300px] rounded-2xl border border-border bg-bg-elev p-5 hover:border-accent-warm/50 hover:shadow-md transition"
          >
            <div className="text-accent-warm text-3xl leading-none mb-1" aria-hidden="true">
              &ldquo;
            </div>
            <p className="text-sm text-fg leading-relaxed mb-4 line-clamp-4">{item.quote}</p>
            <div className="text-xs">
              <span className="font-semibold text-accent-warm">{item.therapistName}</span>
              <span className="text-muted"> · </span>
              <span className="text-muted group-hover:text-accent transition-colors">{item.placeName}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
