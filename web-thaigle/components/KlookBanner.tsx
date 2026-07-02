type KlookBannerProps = {
  variant?: "cooking" | "muay-thai" | "spa" | "diving" | "yoga" | "general";
};

const VARIANTS: Record<string, { emoji: string; title: string; desc: string; cta: string; url: string }> = {
  cooking: {
    emoji: "👨‍🍳",
    title: "Book Bangkok cooking classes",
    desc: "Half-day + full-day options from ฿800. Free cancellation on most.",
    cta: "Browse on Klook →",
    url: "https://www.klook.com/en-US/activity/1041-thai-cooking-class-bangkok/?aid=thaigle",
  },
  "muay-thai": {
    emoji: "🥊",
    title: "Book Muay Thai classes",
    desc: "Day passes from ฿300. Learn from real Nak Muay trainers. No experience needed.",
    cta: "Browse on Klook →",
    url: "https://www.klook.com/en-US/activity/2009-muay-thai-training-bangkok/?aid=thaigle",
  },
  spa: {
    emoji: "💆",
    title: "Book Bangkok spa packages",
    desc: "Thai massage, aromatherapy & luxury spa packages. Skip the queue with pre-booking.",
    cta: "Browse on Klook →",
    url: "https://www.klook.com/en-US/activity/1056-traditional-thai-massage-bangkok/?aid=thaigle",
  },
  diving: {
    emoji: "🤿",
    title: "Book scuba diving courses",
    desc: "PADI open water from ฿9,500. Day trips to Koh Larn & Koh Chang.",
    cta: "Browse on Klook →",
    url: "https://www.klook.com/en-US/activity/13-padi-open-water-course-phuket/?aid=thaigle",
  },
  yoga: {
    emoji: "🧘",
    title: "Book yoga & pilates classes",
    desc: "Drop-in sessions from ฿300. Studios across Ari, Ekkamai & Thonglor.",
    cta: "Browse on Klook →",
    url: "https://www.klook.com/en-US/search/?query=yoga+bangkok&aid=thaigle",
  },
  general: {
    emoji: "🎟️",
    title: "Book Bangkok activities",
    desc: "2,000+ activities in Bangkok — Klook's top rated. Free cancellation. Instant confirmation.",
    cta: "Browse on Klook →",
    url: "https://www.klook.com/en-US/thailand/bangkok/?aid=thaigle",
  },
};

export function KlookBanner({ variant = "general" }: KlookBannerProps) {
  const v = VARIANTS[variant] ?? VARIANTS.general;

  return (
    <a
      href={v.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center gap-4 p-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 hover:border-orange-400 hover:shadow-md transition group my-4"
    >
      <span className="text-3xl shrink-0">{v.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-black text-sm text-orange-900 group-hover:text-orange-700 transition">{v.title}</div>
        <div className="text-xs text-orange-800 opacity-90 leading-snug mt-0.5">{v.desc}</div>
      </div>
      <div className="shrink-0 text-xs font-bold text-orange-600 border border-orange-300 rounded-full px-3 py-1.5 bg-white group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition whitespace-nowrap">
        {v.cta}
      </div>
    </a>
  );
}
