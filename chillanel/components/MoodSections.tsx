import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place, ThemeCount } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { themeLabel, themeEmoji, slugifyTheme } from "@/lib/theme-labels";
import { PlaceCard } from "./PlaceCard";
import { ArrowRightIcon } from "./Icon";

const SECTION_COUNT = 4;
const PLACES_PER_SECTION = 4;

// Groups a city's places by real review-mined mood (Quiet & relaxing,
// Good value, ...) instead of the flat rating-sorted list or a
// geography-first "browse by neighborhood" layout -- the latter was
// explicitly what this replaced: it reads like a map/directory grouping
// (Google Maps already owns that pattern) rather than something that
// reflects chillanel's own "find the vibe" angle. moodAggregate is
// pre-sorted desc by mention count (see scripts/extract-themes.mjs's
// sumThemeCounts), so the top N here are the moods this city's reviewers
// actually talk about most, not an arbitrary fixed list.
export function MoodSections({
  places,
  moodAggregate,
  lang,
}: {
  places: Place[];
  moodAggregate: ThemeCount[];
  lang: Lang;
}) {
  const t = tFor(lang);
  const topMoods = moodAggregate.slice(0, SECTION_COUNT);

  return (
    <>
      {topMoods.map((mood) => {
        const matching = places
          .filter((p) => p.moodKeywords.some((m) => m.label === mood.label))
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
          .slice(0, PLACES_PER_SECTION);
        if (matching.length === 0) return null;
        const emoji = themeEmoji(mood.label);
        const label = themeLabel(mood.label, lang);
        return (
          <section key={mood.label} className="mb-14">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="font-display italic text-xl sm:text-2xl">
                {emoji && <span aria-hidden="true">{emoji} </span>}
                {t.city.moodSectionTitle.replace("{mood}", label)}
              </h2>
              <Link
                href={`/${lang}/service/${slugifyTheme(mood.label)}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline shrink-0"
              >
                {t.city.viewAll} <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {matching.map((place) => (
                <PlaceCard key={place.id} place={place} lang={lang} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
