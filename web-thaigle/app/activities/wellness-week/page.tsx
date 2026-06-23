import type { Metadata } from "next";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Wellness Week Itinerary — 7-Day Plan (2026)",
  description:
    "Complete 7-day Bangkok wellness itinerary: Thai massage, yoga, Muay Thai, cooking classes, meditation, and healthy eating. Day-by-day plan with costs.",
  alternates: { canonical: "/activities/wellness-week" },
};

const WELLNESS_FAQS = [
  {
    q: "Is Bangkok good for a wellness retreat?",
    a: "Excellent. Bangkok has world-class wellness infrastructure at 30-50% of Western prices: authentic Thai massage (฿200-400/hr), daily yoga (฿400-800/class), Muay Thai training (฿300-600/session), healthy cafes and juice bars (especially in Ari, Thong Lor, Ekkamai), and wellness centers with float tanks, infrared sauna, and IV therapy.",
  },
  {
    q: "How much does a wellness week in Bangkok cost?",
    a: "Budget wellness week: ฿15,000-25,000 (accommodation + activities + healthy food). Mid-range: ฿35,000-55,000 (better accommodation, daily spa treatments, premium studios). Luxury: ฿80,000-150,000+ (hotel spa packages, private yoga, Michelin-starred healthy dining). All-inclusive spa resort packages at Kamalaya or Anantara start at ฿25,000/night.",
  },
  {
    q: "Can I do a detox program in Bangkok?",
    a: "Yes. Bangkok has dedicated detox programs at wellness resorts and day spas. Juice detox programs: ฿1,500-3,500/day. Herbal detox treatments: ฿2,000-5,000. Colon hydrotherapy and Ayurvedic detox are available at specialist wellness centers. Many wellness cafes (especially in Thong Lor) offer 3-7 day juice cleanse packages.",
  },
  {
    q: "What is the best area of Bangkok for wellness?",
    a: "Thong Lor and Ekkamai have the highest density of premium wellness venues: boutique yoga studios, organic cafes, spa retreats, and wellness centers. Ari is slightly more affordable with excellent yoga studios and healthy cafes. Silom has luxury hotel spas. For a wellness stay, Thong Lor (BTS Thong Lo) is the ideal base.",
  },
  {
    q: "Is vegetarian food easy to find in Bangkok for a wellness week?",
    a: "Excellent vegetarian scene. Jay (เจ) Thai vegetarian food is widely available. Vegan restaurants are concentrated in Thong Lor, Ekkamai, and Silom. Or Tor Kor market has fresh produce for cooking. Most upscale restaurants accommodate vegetarian requests. The HappyCow app maps over 400 vegetarian/vegan options in Bangkok.",
  },
];

const DAILY_PLAN = [
  {
    day: "Day 1",
    theme: "Arrive & Unwind",
    morning: "Settle in, light walk around neighborhood",
    afternoon: "90-minute traditional Thai massage (first timer's welcome)",
    evening: "Healthy dinner at a local Thai vegetarian restaurant",
    cost: "฿800-1,500",
    icon: "🌅",
  },
  {
    day: "Day 2",
    theme: "Movement & Mindfulness",
    morning: "Yoga class (all levels, 7am slot) at a studio near your accommodation",
    afternoon: "Explore Or Tor Kor Market — pick up fresh fruit and Thai herbs",
    evening: "Thai cooking class (3 hours) — learn 3 healthy Thai dishes",
    cost: "฿1,500-2,500",
    icon: "🧘",
  },
  {
    day: "Day 3",
    theme: "Strength & Power",
    morning: "Muay Thai beginner session (90 min) — intense but achievable",
    afternoon: "Rest + light reading at a wellness cafe in Thong Lor",
    evening: "Foot massage (60 min) + healthy dinner",
    cost: "฿900-1,500",
    icon: "🥊",
  },
  {
    day: "Day 4",
    theme: "Deep Recovery",
    morning: "Float tank session (60-90 min) — sensory deprivation for deep rest",
    afternoon: "Infrared sauna session (30-45 min)",
    evening: "Couples or solo oil massage at a quality spa",
    cost: "฿2,500-4,500",
    icon: "✨",
  },
  {
    day: "Day 5",
    theme: "Adventure & Nature",
    morning: "Early Lumphini Park walk + free outdoor exercise",
    afternoon: "Muay Thai session #2 (getting better already)",
    evening: "Sunset river cruise + healthy riverside dinner",
    cost: "฿1,500-3,000",
    icon: "🌿",
  },
  {
    day: "Day 6",
    theme: "Spa & Renewal",
    morning: "Yoga — try a different studio or style (hot yoga if you haven't)",
    afternoon: "Full spa package (herbal compress + Thai massage + foot scrub, 3 hours)",
    evening: "Light dinner + reflection journaling",
    cost: "฿2,000-4,000",
    icon: "💆",
  },
  {
    day: "Day 7",
    theme: "Integration & Depart",
    morning: "Final yoga class or morning run in the park",
    afternoon: "Thai cooking class #2 — learn desserts and Thai herbal teas",
    evening: "Farewell healthy dinner at your favorite spot discovered this week",
    cost: "฿1,200-2,500",
    icon: "🌸",
  },
];

export default function WellnessWeekPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Wellness Week</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-3">
        7-Day Itinerary
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-balance">
        Bangkok Wellness Week — Day-by-Day Plan
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        A complete 7-day wellness itinerary in Bangkok: Thai massage, Muay Thai, yoga, float tanks, cooking classes, and healthy food. All ranked venues, real prices.
      </p>

      {/* Cost overview */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xl font-black text-teal-600">฿10,400+</div>
          <div className="text-xs text-[var(--muted)] mt-1">Budget (activities only)</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xl font-black text-teal-600">7 days</div>
          <div className="text-xs text-[var(--muted)] mt-1">Full itinerary</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xl font-black text-teal-600">0 prep</div>
          <div className="text-xs text-[var(--muted)] mt-1">No experience needed</div>
        </div>
      </div>

      {/* Daily plan */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-5">Day-by-Day Plan</h2>
        <div className="space-y-4">
          {DAILY_PLAN.map((day, i) => (
            <div key={i} className="border border-[var(--border)] rounded-2xl p-5 bg-white">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl shrink-0">{day.icon}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-teal-700">{day.day}</span>
                    <span className="text-sm font-black">{day.theme}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 ml-12">
                <div className="flex gap-2 text-sm">
                  <span className="text-[var(--muted)] shrink-0 w-20 text-xs font-bold uppercase">Morning</span>
                  <span>{day.morning}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-[var(--muted)] shrink-0 w-20 text-xs font-bold uppercase">Afternoon</span>
                  <span>{day.afternoon}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-[var(--muted)] shrink-0 w-20 text-xs font-bold uppercase">Evening</span>
                  <span>{day.evening}</span>
                </div>
                <div className="pt-2 text-xs font-bold text-green-700">Est. activity cost: {day.cost}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity directory links */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">Browse Ranked Venues</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { slug: "spa", icon: "💆", label: "Spas & Massage" },
            { slug: "yoga-pilates", icon: "🧘", label: "Yoga & Pilates" },
            { slug: "muay-thai", icon: "🥊", label: "Muay Thai" },
            { slug: "wellness", icon: "✨", label: "Wellness Centers" },
            { slug: "cooking", icon: "👨‍🍳", label: "Cooking Classes" },
            { slug: "diving", icon: "🤿", label: "Diving" },
          ].map((n) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="flex items-center gap-2 p-3 border border-[var(--border)] rounded-xl bg-white hover:border-teal-300 hover:shadow-sm transition text-sm font-medium group"
            >
              <span>{n.icon}</span>
              <span className="group-hover:text-teal-700 transition">{n.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Bangkok Wellness Travel</h2>
        <div className="space-y-3">
          {WELLNESS_FAQS.map((f, i) => (
            <details key={i} className="bg-white border border-[var(--border)] rounded-xl p-4 group">
              <summary className="font-semibold cursor-pointer flex items-center justify-between gap-3 text-sm">
                <span>{f.q}</span>
                <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0">⌄</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <FaqJsonLd faqs={WELLNESS_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Wellness Week", url: "/activities/wellness-week" },
      ]} />
    </div>
  );
}
