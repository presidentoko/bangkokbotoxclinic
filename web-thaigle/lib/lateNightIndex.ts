// Which /activities/{niche}/open-late/{city} pages exist. Route params, the
// sitemap and the niche hub's links all read this one list, so a URL is linked
// exactly when it is built.

import { NICHE_CITY_SLUGS, loadNicheDb, qualifyingNichePlaces, type NicheSlug } from "./niches";
import { hasLatePage } from "./lateNight";

/** Only niches whose venues people look for at night. */
export const LATE_NICHES = ["spa"] as const;

export type LateParam = { niche: string; city: string; cityName: string };

export async function allLateParams(): Promise<LateParam[]> {
  const out: LateParam[] = [];
  for (const niche of LATE_NICHES) {
    const places = qualifyingNichePlaces(niche, (await loadNicheDb(niche as NicheSlug)).places);
    for (const [cityName, city] of Object.entries(NICHE_CITY_SLUGS)) {
      if (hasLatePage(places, cityName)) out.push({ niche, city, cityName });
    }
  }
  return out;
}
