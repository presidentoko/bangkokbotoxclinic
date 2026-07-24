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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <Link
            key={`${item.placeId}-${i}`}
            href={`/${lang}/place/${item.placeId}`}
            className="group rounded-2xl border border-border bg-bg-elev p-5 hover:border-accent-warm/50 hover:shadow-md transition"
          >
            <div className="text-accent-warm text-2xl leading-none mb-2" aria-hidden="true">
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
