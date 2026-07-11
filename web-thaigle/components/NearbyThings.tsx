type NearbyLink = { label: string; emoji: string; url: string; hint: string };
type NearbyThingsProps = { city?: string; context?: "restaurant" | "activity" | "general" };

const GENERAL_LINKS: NearbyLink[] = [
  { label: "Top restaurants Bangkok", emoji: "🍜", url: "/restaurants/bangkok", hint: "3,200+ ranked by real reviews" },
  { label: "Muay Thai gyms", emoji: "🥊", url: "/activities/muay-thai", hint: "Train like a local from ฿300" },
  { label: "Spas & massage", emoji: "💆", url: "/activities/spa", hint: "Thai massage from ฿200/hr" },
  { label: "Cooking classes", emoji: "👨‍🍳", url: "/activities/cooking", hint: "Market tour + cook + eat from ฿800" },
  { label: "Yoga & pilates", emoji: "🧘", url: "/activities/yoga-pilates", hint: "Morning classes in Ari & Ekkamai" },
  { label: "Best day plans", emoji: "📅", url: "/day-plan", hint: "25 curated Bangkok itineraries" },
];

const RESTAURANT_LINKS: NearbyLink[] = [
  { label: "Restaurants in Watthana (Sukhumvit/Thonglor)", emoji: "🚉", url: "/restaurants/bangkok/watthana", hint: "International expat hub" },
  { label: "Cafés in Phaya Thai (Ari)", emoji: "☕", url: "/restaurants/bangkok/phaya-thai", hint: "Bangkok's hipster café belt" },
  { label: "Street food in Samphanthawong (Chinatown)", emoji: "🏮", url: "/restaurants/bangkok/samphanthawong", hint: "Best night market eats" },
  { label: "Japanese restaurants Bangkok", emoji: "🍣", url: "/restaurants/cuisine/japanese", hint: "4,000+ Thai-Japanese places" },
  { label: "Vegetarian food Bangkok", emoji: "🌿", url: "/for/vegetarian", hint: "Plant-based scene is thriving" },
  { label: "Rooftop dining", emoji: "🌃", url: "/for/views", hint: "Skyline views + great food" },
];

const ACTIVITY_LINKS: NearbyLink[] = [
  { label: "Muay Thai gyms Bangkok", emoji: "🥊", url: "/activities/muay-thai", hint: "From casual 1-class to intensive camps" },
  { label: "Thai cooking classes", emoji: "👨‍🍳", url: "/activities/cooking", hint: "Half-day + full-day options" },
  { label: "Yoga & meditation", emoji: "🧘", url: "/activities/yoga-pilates", hint: "Drop-in classes from ฿300" },
  { label: "Spa & Thai massage", emoji: "💆", url: "/activities/spa", hint: "Traditional Thai massage from ฿200/hr" },
  { label: "Scuba diving courses", emoji: "🤿", url: "/activities/diving", hint: "PADI courses + day trips" },
  { label: "Wellness centers", emoji: "🌿", url: "/activities/wellness", hint: "Retreat-level experience in the city" },
];

export function NearbyThings({ context = "general" }: NearbyThingsProps) {
  const links =
    context === "restaurant" ? RESTAURANT_LINKS :
    context === "activity" ? ACTIVITY_LINKS :
    GENERAL_LINKS;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📍 More to explore
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border)] hover:border-orange-300 hover:bg-orange-50 transition group"
          >
            <span className="text-base shrink-0">{l.emoji}</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--fg)] group-hover:text-orange-700 transition truncate">{l.label}</div>
              <div className="text-[10px] text-[var(--muted)] truncate">{l.hint}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
