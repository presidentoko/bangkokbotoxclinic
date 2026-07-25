import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { categoryBadgeLabel } from "@/lib/categories";
import { RatingBars, hasRatingData } from "./RatingBars";
import { themeLabel } from "@/lib/theme-labels";

// No photo data in the pipeline yet, so cards lean on a textured gradient
// header instead of a blank placeholder — keeps the grid feeling premium
// rather than like a bare directory listing.
function gradientForId(id: string): string {
  const variants = [
    "from-accent to-emerald-700",
    "from-accent-warm to-accent",
    "from-emerald-700 to-ink",
    "from-accent to-accent-warm",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return variants[hash % variants.length];
}

export function PlaceCard({
  place,
  lang,
  editorsPick = false,
  size = "default",
}: {
  place: Place;
  lang: Lang;
  editorsPick?: boolean;
  size?: "default" | "large";
}) {
  const t = tFor(lang);
  const badge = categoryBadgeLabel(place.primaryType, lang);
  const mentionCount = place.therapistMentions.length;
  // Visual "signal strength" for the differentiator — not a fake precision
  // score, just how many named-therapist mentions this place has, capped
  // at 3 dots so it stays legible instead of trying to look scientific.
  const signalDots = Math.min(mentionCount, 3);
  const large = size === "large";

  return (
    <Link
      href={`/${lang}/place/${place.id}`}
      className={`group relative flex flex-col h-full rounded-3xl border border-border bg-bg-elev overflow-hidden hover:shadow-xl hover:shadow-ink/5 hover:-translate-y-1 transition-all duration-300 ${large ? "sm:col-span-2 sm:row-span-2" : ""}`}
    >
      {editorsPick && (
        <div className="absolute top-0 right-0 z-10 bg-gradient-to-r from-accent-warm to-amber-500 text-ink text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
          {t.home.editorsPick}
        </div>
      )}
      <div
        className={`relative bg-gradient-to-br ${gradientForId(place.id)} ${large ? "h-36 sm:h-48" : "h-20"}`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.14) 0, transparent 45%), radial-gradient(circle at 85% 70%, rgb(255 255 255 / 0.1) 0, transparent 40%)",
          backgroundBlendMode: "overlay",
        }}
      >
        {place.rating != null && (
          <div className="absolute -bottom-4 left-4 flex items-center gap-1 rounded-full bg-bg-elev border border-border shadow-sm text-sm font-bold px-2.5 py-1">
            <span className="text-accent-warm" aria-hidden="true">★</span>
            {place.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-5 pt-6 flex-1 flex flex-col">
        <div className={`font-display font-semibold leading-snug group-hover:text-accent transition-colors ${large ? "text-2xl" : "text-lg"}`}>
          {place.name}
        </div>
        <div className={`text-muted line-clamp-1 mt-1.5 mb-3 ${large ? "text-sm" : "text-xs"}`}>{place.address}</div>
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {badge && (
            <span className="rounded-full border border-border px-2.5 py-1 text-muted font-medium">
              {badge}
            </span>
          )}
          {place.serviceThemes.length > 0 && (
            <span className="rounded-full border border-accent-warm/30 bg-accent-warm/10 px-2.5 py-1 text-accent-warm font-medium">
              {themeLabel(place.serviceThemes[0].label, lang)}
            </span>
          )}
          <span className="text-muted">
            {place.reviewCount} {t.place.reviewCountLabel}
          </span>
        </div>
        {mentionCount > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-accent-warm/10 px-3 py-2 w-fit">
            <div className="flex gap-0.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i < signalDots ? "bg-accent-warm" : "bg-accent-warm/25"}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-accent-warm">
              {t.place.namedInReviews.replace("{n}", String(mentionCount))}
            </span>
          </div>
        )}
        {large && hasRatingData(place.ratingDistribution) && (
          <div className="mt-4 border-t border-border pt-4">
            <RatingBars distribution={place.ratingDistribution} size="compact" />
          </div>
        )}
        {large && mentionCount > 0 && place.therapistMentions[0].quotes[0] && (
          <p className="mt-4 text-sm text-muted italic leading-relaxed line-clamp-2 border-t border-border pt-4">
            &ldquo;{place.therapistMentions[0].quotes[0]}&rdquo;
          </p>
        )}
      </div>
    </Link>
  );
}
