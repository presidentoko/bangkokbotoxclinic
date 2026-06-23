import { loadMasterDb, filterByDistrict, topByTrust } from "@/lib/data";
import { loadNicheDb, topNichePlaces } from "@/lib/niches";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { getAffiliateLink } from "@/lib/affiliate";
import type { Restaurant } from "@/lib/types";
import type { NichePlace, NicheSlug } from "@/lib/niches";

// Tourist-friendly area slug → Bangkok district name in master_db
export const AREA_DEFS = {
  thonglor:  { label: "Thonglor",   district: "Watthana",    desc: "Bangkok's hippest dining + nightlife strip" },
  ari:       { label: "Ari",         district: "Phaya Thai",  desc: "Indie cafés, local restaurants, relaxed vibe" },
  sukhumvit: { label: "Sukhumvit",   district: "Khlong Toei", desc: "International hub — food from every cuisine" },
  "old-town":{ label: "Old Town",    district: "Phra Nakhon", desc: "Historic Bangkok — street food & temples" },
  riverside: { label: "Riverside",   district: "Bang Rak",    desc: "Chao Phraya views, rooftop bars, classic Thai" },
} as const;

export type AreaSlug = keyof typeof AREA_DEFS;

// Theme → which niches to pull, slot mapping, headline copy
export const THEME_DEFS = {
  foodie: {
    label: "Foodie Day",
    icon: "🍜",
    headline: (area: string) => `Best foodie day in ${area}: cooking class, street food lunch, spa wind-down, dinner`,
    desc: (area: string) => `Cook Thai food in the morning, eat your way through ${area} at lunch, relax with a massage, then a proper dinner.`,
    slots: [
      { time: "9:00", icon: "👨‍🍳", label: "Morning", role: "niche" as const, niche: "cooking" as NicheSlug, rationale: "Start with hands — learn to cook Thai before you eat it." },
      { time: "13:00", icon: "🍜", label: "Lunch",   role: "restaurant" as const, pick: 0, rationale: "Top-rated local lunch by real reviews." },
      { time: "15:30", icon: "💆", label: "Treat",   role: "niche" as const, niche: "spa" as NicheSlug, rationale: "Rest your feet — traditional Thai massage after eating." },
      { time: "19:00", icon: "🍽️", label: "Dinner",  role: "restaurant" as const, pick: 1, rationale: "High Trust Score dinner — the area's most credible evening spot." },
    ],
  },
  wellness: {
    label: "Wellness Day",
    icon: "🌿",
    headline: (area: string) => `Full wellness day in ${area}: yoga, healthy lunch, spa, plant-based dinner`,
    desc: (area: string) => `Morning yoga, a healthy ${area} lunch, afternoon spa, and a dinner focused on clean eating.`,
    slots: [
      { time: "8:00",  icon: "🧘", label: "Morning",   role: "niche" as const, niche: "yoga-pilates" as NicheSlug, rationale: "Start grounded — yoga before the city wakes up." },
      { time: "12:00", icon: "🍜", label: "Lunch",     role: "restaurant" as const, pick: 0, rationale: "Highest trust score restaurant for a clean, real lunch." },
      { time: "14:30", icon: "💆", label: "Afternoon", role: "niche" as const, niche: "wellness" as NicheSlug, rationale: "Meditation + wellness session to reset midday energy." },
      { time: "18:30", icon: "🍽️", label: "Dinner",   role: "restaurant" as const, pick: 1, rationale: "Second-ranked local spot — verified credible by Trust Score." },
    ],
  },
  active: {
    label: "Active Day",
    icon: "🥊",
    headline: (area: string) => `Active Bangkok day in ${area}: Muay Thai training, local lunch, spa recovery, dinner`,
    desc: (area: string) => `Train hard at a Muay Thai gym, fuel up with ${area}'s best lunch, recover with a massage, finish with a great dinner.`,
    slots: [
      { time: "7:30",  icon: "🥊", label: "Morning",   role: "niche" as const, niche: "muay-thai" as NicheSlug, rationale: "Morning session — gyms are less crowded, temperature is manageable." },
      { time: "12:30", icon: "🍜", label: "Lunch",     role: "restaurant" as const, pick: 0, rationale: "High protein, high Trust Score — the most reviewed local lunch." },
      { time: "14:30", icon: "💆", label: "Recovery",  role: "niche" as const, niche: "spa" as NicheSlug, rationale: "Sports massage after Muay Thai — your legs will thank you." },
      { time: "19:00", icon: "🍽️", label: "Dinner",   role: "restaurant" as const, pick: 1, rationale: "Relax over dinner — top evening pick in the area." },
    ],
  },
  couples: {
    label: "Couples Day",
    icon: "💑",
    headline: (area: string) => `Romantic day in ${area}: spa morning, lunch, cooking class together, fine dining`,
    desc: (area: string) => `Couple's massage in the morning, casual ${area} lunch, learn to cook Thai together, finish at the area's best dinner spot.`,
    slots: [
      { time: "10:00", icon: "💆", label: "Morning",   role: "niche" as const, niche: "spa" as NicheSlug, rationale: "Couple's massage — start slow, enjoy together." },
      { time: "13:00", icon: "🍜", label: "Lunch",     role: "restaurant" as const, pick: 0, rationale: "Casual lunch — recharge before the afternoon activity." },
      { time: "15:00", icon: "👨‍🍳", label: "Afternoon", role: "niche" as const, niche: "cooking" as NicheSlug, rationale: "Cook together — best interactive afternoon for couples." },
      { time: "19:30", icon: "🍽️", label: "Dinner",   role: "restaurant" as const, pick: 1, rationale: "Highest Trust Score evening pick — the area's most credible dinner." },
    ],
  },
  "first-day": {
    label: "First Day in Bangkok",
    icon: "✈️",
    headline: (area: string) => `Perfect first day in Bangkok, based in ${area}: orientation walk, local lunch, Muay Thai, Thai food dinner`,
    desc: (area: string) => `Just landed? Start with a gentle yoga session to reset, grab lunch in ${area}, watch or try Muay Thai, then a classic Thai dinner.`,
    slots: [
      { time: "9:00",  icon: "🧘", label: "Morning",   role: "niche" as const, niche: "yoga-pilates" as NicheSlug, rationale: "Gentle yoga first — arrive feeling human, not jet-lagged." },
      { time: "12:00", icon: "🍜", label: "Lunch",     role: "restaurant" as const, pick: 0, rationale: "First meal in Bangkok — highest trust score means safest pick." },
      { time: "14:30", icon: "🥊", label: "Afternoon", role: "niche" as const, niche: "muay-thai" as NicheSlug, rationale: "Watch or join a class — Thailand's most iconic sport." },
      { time: "19:00", icon: "🍽️", label: "Dinner",   role: "restaurant" as const, pick: 1, rationale: "Classic Thai dinner — vetted by hundreds of real reviews." },
    ],
  },
} as const;

export type ThemeSlug = keyof typeof THEME_DEFS;

export type DayPlanStop = {
  time: string;
  icon: string;
  label: string;
  rationale: string;
  venueId: string;
  venueName: string;
  venueUrl: string;
  rating: number | null;
  trust_score: number;
  priceMin: number | null;
  priceLabel: string | null;
  bookUrl: string;
  bookProvider: string;
  bookLabel: string;
};

export type DayPlanData = {
  area: AreaSlug;
  theme: ThemeSlug;
  headline: string;
  desc: string;
  stops: DayPlanStop[];
  valid: boolean; // false if <3 stops resolved
};

function restaurantStop(
  time: string, icon: string, label: string, rationale: string,
  r: Restaurant, slugMap: Record<string, { city: string; district: string; slug: string }>
): DayPlanStop {
  const entry = slugMap[r.id];
  const url = entry ? restaurantUrl(entry) : `/restaurants/bangkok/other/${r.id}`;
  const book = getAffiliateLink({ venue: { name: r.name }, activityType: "restaurant", city: r.city_label });
  return {
    time, icon, label, rationale,
    venueId: r.id,
    venueName: r.name,
    venueUrl: url,
    rating: r.rating,
    trust_score: r.trust_score,
    priceMin: null,
    priceLabel: r.price_symbol || null,
    bookUrl: book.url,
    bookProvider: book.provider,
    bookLabel: `Book on ${book.provider}`,
  };
}

function nicheStop(
  time: string, icon: string, label: string, rationale: string,
  place: NichePlace, niche: string
): DayPlanStop {
  const book = getAffiliateLink({ venue: { name: place.name, affiliate: place.affiliate }, activityType: niche, city: place.city });
  return {
    time, icon, label, rationale,
    venueId: place.id,
    venueName: place.name,
    venueUrl: `/activities/${niche}/${place.slug}`,
    rating: place.rating,
    trust_score: place.trust_score,
    priceMin: place.price_min_thb > 0 ? place.price_min_thb : null,
    priceLabel: place.price_min_thb > 0 ? `฿${place.price_min_thb.toLocaleString()}` : null,
    bookUrl: book.url,
    bookProvider: book.provider,
    bookLabel: `Book on ${book.provider}`,
  };
}

export async function buildDayPlan(area: AreaSlug, theme: ThemeSlug): Promise<DayPlanData> {
  const areaDef = AREA_DEFS[area];
  const themeDef = THEME_DEFS[theme];

  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const areaRestaurants = topByTrust(filterByDistrict(db.restaurants, areaDef.district, "bangkok"), 5);

  // Collect unique niches needed
  const niches = [...new Set(
    themeDef.slots.filter((s) => s.role === "niche").map((s) => (s as { niche: NicheSlug }).niche)
  )];
  const nicheMaps = Object.fromEntries(
    await Promise.all(niches.map(async (n) => {
      const db2 = await loadNicheDb(n);
      return [n, topNichePlaces(db2.places, 3)] as const;
    }))
  );

  const stops: DayPlanStop[] = [];
  const usedNiches = new Set<string>();

  for (const slotDef of themeDef.slots) {
    if (slotDef.role === "restaurant") {
      const pickIdx = (slotDef as { pick: number }).pick;
      const r = areaRestaurants[pickIdx];
      if (!r) continue;
      stops.push(restaurantStop(slotDef.time, slotDef.icon, slotDef.label, slotDef.rationale, r, slugMap));
    } else {
      const niche = (slotDef as { niche: NicheSlug }).niche;
      const candidates = nicheMaps[niche] ?? [];
      // Pick first candidate not already used for a different slot
      const place = candidates.find((p) => !usedNiches.has(`${niche}:${p.id}`));
      if (!place) continue;
      usedNiches.add(`${niche}:${place.id}`);
      stops.push(nicheStop(slotDef.time, slotDef.icon, slotDef.label, slotDef.rationale, place, niche));
    }
  }

  return {
    area,
    theme,
    headline: themeDef.headline(areaDef.label),
    desc: themeDef.desc(areaDef.label),
    stops,
    valid: stops.length >= 3,
  };
}

export function allDayPlanParams(): { area: AreaSlug; theme: ThemeSlug }[] {
  const areas = Object.keys(AREA_DEFS) as AreaSlug[];
  const themes = Object.keys(THEME_DEFS) as ThemeSlug[];
  return areas.flatMap((area) => themes.map((theme) => ({ area, theme })));
}
