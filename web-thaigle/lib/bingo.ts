export type BingoItem = {
  id: string;
  emoji: string;
  label: string;
  url?: string;
  category: "food" | "activity" | "experience" | "nightlife";
};

export const BINGO_ITEMS: BingoItem[] = [
  { id: "massage", emoji: "💆", label: "Thai massage", url: "/activities/spa", category: "activity" },
  { id: "muay", emoji: "🥊", label: "Muay Thai training", url: "/activities/muay-thai", category: "activity" },
  { id: "cooking", emoji: "👨‍🍳", label: "Cooking class", url: "/activities/cooking", category: "activity" },
  { id: "padthai", emoji: "🍜", label: "Pad Thai on the street", url: "/restaurants/cuisine/street_food", category: "food" },
  { id: "tuk", emoji: "🛺", label: "Tuk tuk ride", url: "/local-tips", category: "experience" },
  { id: "rooftop", emoji: "🌆", label: "Rooftop bar at sunset", url: "/for/views", category: "nightlife" },
  { id: "temple", emoji: "⛩️", label: "Wat Pho temple", url: "/local-tips", category: "experience" },
  { id: "market", emoji: "🥬", label: "Chatuchak market", url: "/local-tips", category: "experience" },
  { id: "somtam", emoji: "🥗", label: "Som Tam (papaya salad)", url: "/restaurants/cuisine/street_food", category: "food" },
  { id: "yoga", emoji: "🧘", label: "Yoga class", url: "/activities/yoga-pilates", category: "activity" },
  { id: "mango", emoji: "🥭", label: "Mango sticky rice", url: "/restaurants/cuisine/street_food", category: "food" },
  { id: "nightlife", emoji: "🎵", label: "Live music or nightclub", url: "/for/late-night", category: "nightlife" },
  { id: "boat", emoji: "⛵", label: "Chao Phraya boat", url: "/local-tips", category: "experience" },
  { id: "streetfood2am", emoji: "🌙", label: "Street food after midnight", url: "/for/late-night", category: "food" },
  { id: "floating", emoji: "🚤", label: "Floating market", url: "/local-tips", category: "experience" },
  { id: "diving", emoji: "🤿", label: "Snorkeling or diving", url: "/activities/diving", category: "activity" },
];

// Bitmask over BINGO_ITEMS order, base36-encoded — compact enough for a URL param.
export function encodeBingo(checked: Set<string>): string {
  let mask = 0;
  BINGO_ITEMS.forEach((item, i) => {
    if (checked.has(item.id)) mask |= 1 << i;
  });
  return mask.toString(36);
}

export function decodeBingo(d: string): Set<string> {
  const mask = parseInt(d, 36);
  const ids = new Set<string>();
  if (!Number.isFinite(mask) || mask <= 0) return ids;
  BINGO_ITEMS.forEach((item, i) => {
    if (mask & (1 << i)) ids.add(item.id);
  });
  return ids;
}
