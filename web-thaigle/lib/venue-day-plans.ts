// Returns day-plan URLs that feature a specific venue (by name match, since niches have no id cross-ref)
// Used for "Appears in these day-plans" backlinks (C2) and "Build a day around" TikTok CTA (C4)

import { AREA_DEFS, THEME_DEFS, buildDayPlan } from "@/lib/day-plans";
import type { AreaSlug, ThemeSlug } from "@/lib/day-plans";

export type DayPlanRef = {
  area: AreaSlug;
  theme: ThemeSlug;
  areaLabel: string;
  themeLabel: string;
  themeIcon: string;
  url: string;
};

// Lightweight: check all 25 combos and return ones that contain this venueId
export async function getDayPlansForVenue(venueId: string): Promise<DayPlanRef[]> {
  const areas = Object.keys(AREA_DEFS) as AreaSlug[];
  const themes = Object.keys(THEME_DEFS) as ThemeSlug[];
  const results: DayPlanRef[] = [];

  await Promise.all(
    areas.flatMap((area) =>
      themes.map(async (theme) => {
        try {
          const plan = await buildDayPlan(area, theme);
          if (plan.valid && plan.stops.some((s) => s.venueId === venueId)) {
            results.push({
              area,
              theme,
              areaLabel: AREA_DEFS[area].label,
              themeLabel: THEME_DEFS[theme].label,
              themeIcon: THEME_DEFS[theme].icon,
              url: `/day-plan/${area}/${theme}`,
            });
          }
        } catch {
          // skip failed builds
        }
      })
    )
  );

  return results;
}
