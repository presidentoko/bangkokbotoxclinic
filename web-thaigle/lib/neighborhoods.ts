import type { Restaurant } from "@/lib/types";

/**
 * Colloquial Bangkok neighbourhoods — the names people actually search
 * ("wellness spa sukhumvit", "thonglor restaurants"), as opposed to the
 * official khet/district names ("Watthana", "Khlong Toei") that master_db
 * stores and that /restaurants/{city}/{district} generates pages for.
 *
 * Six components (AreaGuide, NearbyLink, RestaurantDistricts,
 * StreetFoodDistrictMap, BangkokNeighborhoodProfile, VenueMatchQuiz) have
 * always linked to /restaurants/bangkok/{sukhumvit,thonglor,silom,...} — none
 * of which existed, so all of them 404'd. Rather than rewrite those links to
 * point at khet slugs nobody searches for (and which would collapse
 * Thonglor/Ekkamai/Sukhumvit into one identical "Watthana" page), these
 * resolve by geo radius off each restaurant's lat/lng.
 *
 * Radii are hand-tuned so each page has a distinct, non-trivial result set —
 * see the counts in the comment on each entry. Some overlap between adjacent
 * areas is expected and correct (Thonglor/Ekkamai genuinely share a border);
 * they are not duplicates because the centre and ranking differ.
 */
export type Neighborhood = {
  slug: string;
  label: string;
  city: string;
  lat: number;
  lng: number;
  radiusKm: number;
  /** Official khet this sits in — shown as a cross-link so the two trees connect. */
  districtSlug: string;
  districtLabel: string;
  transit: string;
  blurb: string;
};

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "sukhumvit", label: "Sukhumvit", city: "bangkok",
    lat: 13.7373, lng: 100.5602, radiusKm: 2.2, // ~365 restaurants
    districtSlug: "khlong-toei", districtLabel: "Khlong Toei",
    transit: "BTS Asok / Nana / Phrom Phong · MRT Sukhumvit",
    blurb: "Bangkok's international spine — the densest stretch of expat restaurants, hotel dining and late-night food in the city, running along the BTS from Nana to Phrom Phong.",
  },
  {
    slug: "thonglor", label: "Thonglor", city: "bangkok",
    lat: 13.7285, lng: 100.5869, radiusKm: 1.2, // ~83 restaurants
    districtSlug: "watthana", districtLabel: "Watthana",
    transit: "BTS Thong Lo",
    blurb: "Bangkok's premium dining strip — Japanese counters, chef-driven bistros and rooftop bars packed into Sukhumvit Soi 55.",
  },
  {
    slug: "ekkamai", label: "Ekkamai", city: "bangkok",
    lat: 13.7197, lng: 100.5853, radiusKm: 1.1, // ~58 restaurants
    districtSlug: "watthana", districtLabel: "Watthana",
    transit: "BTS Ekkamai",
    blurb: "Thonglor's quieter neighbour — indie cafés, fusion kitchens and neighbourhood noodle shops without the Soi 55 price tag.",
  },
  {
    slug: "silom", label: "Silom", city: "bangkok",
    lat: 13.7248, lng: 100.534, radiusKm: 1.3, // ~134 restaurants
    districtSlug: "bang-rak", districtLabel: "Bang Rak",
    transit: "BTS Sala Daeng · MRT Si Lom",
    blurb: "The business district that turns into a street-food corridor after dark — office lunch spots by day, Convent Road and Soi 20 stalls by night.",
  },
  {
    slug: "siam", label: "Siam", city: "bangkok",
    lat: 13.7455, lng: 100.534, radiusKm: 1.0, // ~140 restaurants
    districtSlug: "pathum-wan", districtLabel: "Pathum Wan",
    transit: "BTS Siam / National Stadium",
    blurb: "Bangkok's mall core — Siam Paragon, Siam Square and MBK put several hundred restaurants inside a ten-minute walk of one interchange.",
  },
  {
    slug: "ari", label: "Ari", city: "bangkok",
    lat: 13.7794, lng: 100.5417, radiusKm: 1.2, // ~63 restaurants
    districtSlug: "phaya-thai", districtLabel: "Phaya Thai",
    transit: "BTS Ari",
    blurb: "The local-cool neighbourhood — specialty coffee, small-plate restaurants and weekday brunch spots on the sois off Phahonyothin.",
  },
  {
    slug: "chinatown", label: "Chinatown (Yaowarat)", city: "bangkok",
    lat: 13.74, lng: 100.51, radiusKm: 1.2, // ~133 restaurants
    districtSlug: "samphanthawong", districtLabel: "Samphanthawong",
    transit: "MRT Wat Mangkon",
    blurb: "Yaowarat Road and its side lanes — Bangkok's oldest continuous food scene, from century-old Teochew shophouses to the evening street-grill stretch.",
  },
  {
    slug: "rattanakosin", label: "Rattanakosin (Old Town)", city: "bangkok",
    lat: 13.7515, lng: 100.4927, radiusKm: 1.6, // ~190 restaurants
    districtSlug: "phra-nakhon", districtLabel: "Phra Nakhon",
    transit: "MRT Sanam Chai · Chao Phraya ferry",
    blurb: "The old royal quarter around the Grand Palace and Wat Pho — heritage Thai kitchens, boat-noodle shops and the Khao San fringe.",
  },
];

const NEIGHBORHOOD_SLUGS = new Set(NEIGHBORHOODS.map((n) => `${n.city}/${n.slug}`));

export function isNeighborhoodSlug(city: string, slug: string): boolean {
  return NEIGHBORHOOD_SLUGS.has(`${city}/${slug}`);
}

export function findNeighborhood(city: string, slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.city === city && n.slug === slug);
}

// Equirectangular approximation — accurate to well under 1% at Bangkok's
// latitude over these radii, and far cheaper than haversine across 2,900
// restaurants × 8 neighbourhoods at build time.
const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LNG = 108.05; // 111.32 × cos(13.75°)

export function distanceKm(lat: number, lng: number, n: Neighborhood): number {
  return Math.hypot((lat - n.lat) * KM_PER_DEG_LAT, (lng - n.lng) * KM_PER_DEG_LNG);
}

/** Restaurants whose coordinates fall inside the neighbourhood's radius. */
export function restaurantsInNeighborhood(
  restaurants: Restaurant[],
  n: Neighborhood
): Restaurant[] {
  return restaurants.filter(
    (r) =>
      r.city === n.city &&
      typeof r.lat === "number" &&
      typeof r.lng === "number" &&
      // (0,0) is the scraper's "no coordinate" sentinel, not the Gulf of Guinea.
      r.lat !== 0 &&
      r.lng !== 0 &&
      distanceKm(r.lat, r.lng, n) <= n.radiusKm
  );
}
