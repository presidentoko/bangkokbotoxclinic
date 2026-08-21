import { NICHES, qualifyingNichePlaces, loadNicheDb, type NicheSlug } from "@/lib/niches";

/**
 * Maps a Bangkok A-Z guide topic to the venue niche it should send readers to.
 *
 * The 253 published guide topics form a closed loop: only four of the 773
 * topic components contain a link of any kind, and not one of them links to
 * /activities or /restaurants. So the site's longest, most engaging pages —
 * the ones a visitor actually reads for several minutes — are a dead end, and
 * the pages that carry the booking links get no internal link equity from
 * them at all.
 *
 * Keyword rules rather than a hand-written table of 253 entries: the topic
 * set grows, and a rule that misses simply yields no venue block, whereas a
 * stale table yields a *wrong* one. Order matters — the first match wins, so
 * the more specific patterns come first.
 */
const RULES: { pattern: RegExp; niche: NicheSlug }[] = [
  { pattern: /muay|boxing|martial|fight/, niche: "muay-thai" },
  { pattern: /yoga|pilates|stretch|flexib/, niche: "yoga-pilates" },
  { pattern: /dive|diving|snorkel|scuba|island|beach|reef/, niche: "diving" },
  { pattern: /cowork|nomad|remote-work|wifi|freelance|startup|company|career|jobs/, niche: "coworking" },
  { pattern: /cook|culinary|chef|baking|recipe|food-tour|street-food/, niche: "cooking" },
  { pattern: /massage|spa|onsen|sauna|hammam|scrub|nuad/, niche: "spa" },
  { pattern: /wellness|detox|retreat|meditat|mindful|health|therap|clinic|rehab/, niche: "wellness" },
  // Anything about looking after yourself, unwinding, or recovering lands on
  // spa — the largest niche and the one with the broadest venue coverage.
  { pattern: /relax|hangover|jet-?lag|sleep|stress|beauty|skin|hair|nail|aesthetic|dermatolog/, niche: "spa" },
];

export function nicheForTopic(topicSlug: string, title = ""): NicheSlug | null {
  const haystack = `${topicSlug} ${title}`.toLowerCase();
  for (const { pattern, niche } of RULES) {
    if (pattern.test(haystack)) return niche;
  }
  return null;
}

export type GuideVenue = {
  name: string;
  slug: string;
  niche: NicheSlug;
  nicheLabel: string;
  rating: number | null;
  trustScore: number;
};

/**
 * Up to `limit` Bangkok venues for a topic, best-rated first.
 *
 * Bangkok-scoped on purpose: these blocks sit on pages titled "Bangkok X", and
 * qualifyingNichePlaces ranks nationwide — the same mismatch that put Chiang
 * Mai gyms in Bangkok day plans.
 */
export async function venuesForTopic(
  topicSlug: string,
  title = "",
  limit = 4,
): Promise<GuideVenue[]> {
  const niche = nicheForTopic(topicSlug, title);
  if (!niche) return [];
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return [];

  const db = await loadNicheDb(niche);
  return qualifyingNichePlaces(niche, db.places)
    .filter((p) => p.city === "Bangkok")
    .slice(0, limit)
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      niche,
      nicheLabel: info.label,
      rating: p.rating ?? null,
      trustScore: Math.round(p.trust_score),
    }));
}
