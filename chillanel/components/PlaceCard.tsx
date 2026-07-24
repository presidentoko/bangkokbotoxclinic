import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";

export function PlaceCard({ place, lang }: { place: Place; lang: Lang }) {
  return (
    <Link
      href={`/${lang}/place/${place.id}`}
      className="block rounded-2xl border border-border bg-bg-elev p-4 hover:border-accent transition"
    >
      <div className="font-bold text-base leading-snug">{place.name}</div>
      <div className="text-xs text-muted mt-1 line-clamp-1">{place.address}</div>
      <div className="flex items-center gap-3 mt-3 text-sm">
        {place.rating != null && (
          <span className="font-semibold">★ {place.rating.toFixed(1)}</span>
        )}
        <span className="text-muted">{place.reviewCount} reviews</span>
        {place.therapistMentions.length > 0 && (
          <span className="text-accent text-xs font-semibold">
            {place.therapistMentions.length} named in reviews
          </span>
        )}
      </div>
    </Link>
  );
}
