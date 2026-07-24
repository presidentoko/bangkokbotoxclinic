import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { categoryBadgeLabel } from "@/lib/categories";

export function PlaceCard({ place, lang }: { place: Place; lang: Lang }) {
  const t = tFor(lang);
  const badge = categoryBadgeLabel(place.primaryType, lang);

  return (
    <Link
      href={`/${lang}/place/${place.id}`}
      className="group block rounded-2xl border border-border bg-bg-elev p-5 hover:border-accent hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="font-bold text-base leading-snug group-hover:text-accent transition-colors">
          {place.name}
        </div>
        {place.rating != null && (
          <div className="shrink-0 flex items-center gap-1 rounded-full bg-accent/10 text-accent text-sm font-bold px-2.5 py-1">
            <span aria-hidden="true">★</span>
            {place.rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="text-xs text-muted line-clamp-1 mb-3">{place.address}</div>
      <div className="flex items-center flex-wrap gap-2 text-xs">
        {badge && (
          <span className="rounded-full border border-border px-2.5 py-1 text-muted font-medium">
            {badge}
          </span>
        )}
        <span className="text-muted">
          {place.reviewCount} {t.place.reviewCountLabel}
        </span>
        {place.therapistMentions.length > 0 && (
          <span className="rounded-full bg-accent-warm/15 text-accent-warm font-semibold px-2.5 py-1">
            {t.place.namedInReviews.replace("{n}", String(place.therapistMentions.length))}
          </span>
        )}
      </div>
    </Link>
  );
}
