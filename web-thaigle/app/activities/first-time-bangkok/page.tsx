import type { Metadata } from "next";
import { NICHES, loadNicheDb } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Things to Do in Bangkok for First-Timers (2026 Guide)",
  description:
    "First time in Bangkok? Here's what to actually do — Muay Thai, Thai massage, cooking classes, yoga, coworking, and more. Ranked by real reviews, not influencers.",
  alternates: { canonical: "/activities/first-time-bangkok" },
};

const FIRST_TIMER_FAQS = [
  {
    q: "What should I do first in Bangkok as a tourist?",
    a: "The classic first-day trifecta: Thai massage (1–2 hours), street food dinner (Yaowarat or Or Tor Kor Market), and Muay Thai (either a training session or watching a bout at Rajadamnern or Lumpinee Stadium). All three are uniquely Bangkok experiences you can't replicate elsewhere.",
  },
  {
    q: "How much money do I need per day for activities in Bangkok?",
    a: "Budget day: ฿800–฿1,500 (Thai massage ฿300, street food ฿200, temple ฿50 donation, transport ฿150). Mid-range day: ฿2,000–฿4,000 (spa ฿800, cooking class ฿1,500, cocktails). Luxury day: ฿8,000+ (hotel spa, rooftop dining, private tours). Bangkok is exceptional value — you can have an incredible day for under ฿2,000.",
  },
  {
    q: "Is Bangkok safe for first-time tourists?",
    a: "Bangkok is very safe for tourists. Major risks: traffic (use the BTS Skytrain and MRT metro instead of street crossing), scams around temples (ignore tuk-tuk drivers offering 'short temple tours'), and stomach issues from street food (stick to busy stalls with high turnover). Petty theft is rare but keep your phone in a front pocket in crowded areas.",
  },
  {
    q: "When is the best time to visit Bangkok?",
    a: "November–February is peak season: cool (25–30°C), dry, and ideal for outdoor activities. March–May is hot (35–40°C) but less crowded. June–October is monsoon season — heavy afternoon rain, but mornings are clear and prices drop. Activity venues operate year-round regardless of weather.",
  },
  {
    q: "Do I need to book activities in advance?",
    a: "Most Bangkok activities don't require advance booking — Muay Thai gyms, massage shops, and yoga studios accept walk-ins. Cooking classes with market tours should be booked 1–2 days ahead. Klook bookings often get priority slots. Peak season (Dec–Feb): book cooking classes and spa packages 3–5 days ahead.",
  },
];

type NicheWithCount = {
  slug: string;
  icon: string;
  label: string;
  total: number;
  firstTimerTip: string;
  priceFrom: string;
};

const FIRST_TIMER_TIPS: Record<string, { tip: string; priceFrom: string }> = {
  "muay-thai": {
    tip: "Book a beginner-friendly gym — don't need boxing experience. One 90-min session is enough to get hooked.",
    priceFrom: "฿300/session",
  },
  spa: {
    tip: "Traditional Thai massage is uniquely Thai. Budget 90 minutes for your first session. Tip ฿50–฿100.",
    priceFrom: "฿200/hour",
  },
  cooking: {
    tip: "Half-day class is ideal. You'll learn 3–4 dishes and eat what you cook. Book one day ahead.",
    priceFrom: "฿800/class",
  },
  "yoga-pilates": {
    tip: "Drop-in classes welcome beginners. Hot yoga studios are a uniquely Bangkok experience.",
    priceFrom: "฿400/class",
  },
  wellness: {
    tip: "Float tanks and infrared sauna are 30–50% cheaper than home. Perfect after Muay Thai training.",
    priceFrom: "฿500/session",
  },
  coworking: {
    tip: "Bangkok is a top digital nomad city. Day passes include fast WiFi, AC, coffee.",
    priceFrom: "฿250/day",
  },
  diving: {
    tip: "Pattaya is 2 hours away — easy day trip. Discover Scuba requires no experience.",
    priceFrom: "฿1,500/dive",
  },
};

export default async function FirstTimeBangkokPage() {
  const nicheData = await Promise.all(
    NICHES.map((n) =>
      loadNicheDb(n.slug as NicheSlug)
        .then((d): NicheWithCount => ({
          slug: n.slug,
          icon: n.icon,
          label: n.label,
          total: d.total,
          firstTimerTip: FIRST_TIMER_TIPS[n.slug]?.tip ?? "",
          priceFrom: FIRST_TIMER_TIPS[n.slug]?.priceFrom ?? "",
        }))
        .catch((): NicheWithCount => ({
          slug: n.slug,
          icon: n.icon,
          label: n.label,
          total: 0,
          firstTimerTip: FIRST_TIMER_TIPS[n.slug]?.tip ?? "",
          priceFrom: FIRST_TIMER_TIPS[n.slug]?.priceFrom ?? "",
        }))
    )
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>First Time Bangkok</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3">
        2026 Guide
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-balance">
        Things to Do in Bangkok — First Timer&apos;s Guide
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-2">
        Ranked by real Google reviews. No influencer picks, no paid placements.
      </p>
      <p className="text-sm text-[var(--muted)] mb-8">
        {nicheData.reduce((s, n) => s + n.total, 0).toLocaleString()}+ venues across {nicheData.length} activity categories.
      </p>

      {/* 3-day itinerary highlight */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-8">
        <h2 className="font-black text-lg mb-4">The Perfect 3-Day Bangkok Activity Plan</h2>
        <div className="space-y-3">
          {[
            {
              day: "Day 1",
              activities: "Thai massage (90 min, ฿300–400) · Street food at Yaowarat · Rooftop view",
              icon: "🙏",
            },
            {
              day: "Day 2",
              activities: "Muay Thai training (beginner session, ฿400) · Thai cooking class (half-day, ฿1,000)",
              icon: "🥊",
            },
            {
              day: "Day 3",
              activities: "Yoga or wellness session (฿500) · Klook tour or diving day trip",
              icon: "🧘",
            },
          ].map((d, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="shrink-0 w-16 text-xs font-black uppercase text-orange-700 pt-0.5">{d.day}</div>
              <div>
                <span className="mr-2">{d.icon}</span>
                <span className="text-sm">{d.activities}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)] mt-4">Total budget: ฿2,000–3,000 for 3 days of activities</p>
      </section>

      {/* Activity cards */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-5">All Bangkok Activities — Ranked by Trust Score</h2>
        <div className="space-y-4">
          {nicheData.map((n, i) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="group flex gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-orange-300 hover:shadow-md transition"
            >
              <div className="text-4xl shrink-0">{n.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-black text-base group-hover:text-orange-700 transition">{n.label}</h3>
                  <span className="text-xs text-[var(--muted)] tabular-nums">{n.total.toLocaleString()} venues</span>
                </div>
                {n.firstTimerTip && (
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">{n.firstTimerTip}</p>
                )}
                {n.priceFrom && (
                  <span className="inline-block text-xs font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                    From {n.priceFrom}
                  </span>
                )}
              </div>
              <div className="shrink-0 text-[var(--muted)] group-hover:text-orange-600 transition self-center text-lg">→</div>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — First Time in Bangkok</h2>
        <div className="space-y-3">
          {FIRST_TIMER_FAQS.map((f, i) => (
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

      {/* Compare section */}
      <section className="mb-8">
        <h2 className="text-lg font-black mb-3">Can&apos;t decide? Compare options</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { slug: "thai-massage-vs-oil-massage", label: "Thai Massage vs Oil Massage" },
            { slug: "muay-thai-vs-boxing", label: "Muay Thai vs Boxing" },
            { slug: "yoga-vs-pilates-bangkok", label: "Yoga vs Pilates" },
          ].map((c) => (
            <a
              key={c.slug}
              href={`/activities/compare/${c.slug}`}
              className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm font-medium hover:text-orange-700 transition text-center"
            >
              {c.label} →
            </a>
          ))}
        </div>
      </section>

      <FaqJsonLd faqs={FIRST_TIMER_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "First Time Bangkok", url: "/activities/first-time-bangkok" },
      ]} />
    </div>
  );
}
