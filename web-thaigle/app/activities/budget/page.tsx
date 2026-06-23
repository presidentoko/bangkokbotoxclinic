import type { Metadata } from "next";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Budget Activities in Bangkok — Things to Do for Under ฿500 (2026)",
  description:
    "Best cheap and free things to do in Bangkok. Muay Thai from ฿300, Thai massage from ฿200, cooking classes from ฿800. Ranked by real reviews.",
  alternates: { canonical: "/activities/budget" },
};

const BUDGET_FAQS = [
  {
    q: "What are the cheapest activities in Bangkok?",
    a: "Free or under ฿100: temples (most free, some ฿50 donation), public parks (Lumphini, Chatuchak), night markets (walking around is free), river ferry (฿15–฿30), watching Muay Thai at Rajadamnern Stadium cheap seats (฿100). Under ฿500: local Thai massage (฿200–฿300/hour), BTS day pass (฿130), local cooking stalls.",
  },
  {
    q: "How cheap is a Thai massage in Bangkok?",
    a: "Street-level traditional Thai massage: ฿150–฿300/hour in local areas. Tourist areas (Sukhumvit, Silom): ฿250–฿500/hour. Foot massage: ฿150–฿250/30 min. Always cheaper away from tourist streets. Local neighborhoods (On Nut, Ari, Ekkamai side streets) have quality massage for ฿200–฿350.",
  },
  {
    q: "Can I do Muay Thai training cheaply in Bangkok?",
    a: "Yes. Local gyms charge ฿300–฿500/session vs ฿600–฿800 at tourist-oriented gyms. Look for gyms away from Sukhumvit main strip. Many local gyms are ฿300 for a full 90-minute session including equipment. Avoid gyms that primarily market to foreigners — they charge 2x for the same training.",
  },
  {
    q: "What is the cheapest way to do a cooking class in Bangkok?",
    a: "Basic cooking classes: ฿800–฿1,200 for half-day. Avoid Klook premium classes (฿2,000+) for budget travel — find classes via local guesthouses or walk-in at cooking schools in residential areas. Some temples and community centers run traditional cooking workshops for ฿300–฿500.",
  },
  {
    q: "What free activities are there in Bangkok?",
    a: "Free: Grand Palace grounds (exterior), Wat Pho area (enter temple separately), Chatuchak Weekend Market (entry free, just browsing), Yaowarat (Chinatown) night food street, Or Tor Kor market, Bang Nam Pheung floating market (free entry), BRT bus ride along Sathorn, Lumphini Park walk/free exercise classes 5:30–7:30am.",
  },
];

const BUDGET_ACTIVITIES = [
  { icon: "🙏", label: "Thai Massage", price: "From ฿200/hr", tip: "Skip tourist-area spas. Find local shops 1 block off main roads.", nicheSlug: "spa" },
  { icon: "🥊", label: "Muay Thai Training", price: "From ฿300/session", tip: "Local gyms away from Sukhumvit charge 40-50% less than tourist gyms.", nicheSlug: "muay-thai" },
  { icon: "👨‍🍳", label: "Thai Cooking Class", price: "From ฿800/class", tip: "Basic half-day classes teach 3-4 dishes. You eat what you cook.", nicheSlug: "cooking" },
  { icon: "🧘", label: "Yoga Drop-in", price: "From ฿400/class", tip: "Introductory week passes (฿800-฿1,500) best value for short visits.", nicheSlug: "yoga-pilates" },
  { icon: "💻", label: "Coworking Space", price: "From ฿250/day", tip: "Many coworking spaces offer free afternoon coffee — cheaper than cafes for working.", nicheSlug: "coworking" },
  { icon: "🤿", label: "Discover Diving", price: "From ฿1,500/dive", tip: "Pattaya intro dives are cheapest near Bangkok. Koh Tao is better value for certification.", nicheSlug: "diving" },
];

export default function BudgetActivitiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Budget Guide</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mb-3">
        Budget Traveler Guide
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-balance">
        Bangkok Activities on a Budget
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Bangkok is one of the world&apos;s best value cities. Here&apos;s what activities actually cost — and how to avoid tourist-area price inflation.
      </p>

      {/* Price overview */}
      <div className="mb-8 p-5 rounded-2xl bg-green-50 border border-green-200">
        <h2 className="font-black mb-3">Bangkok Activity Prices vs. the World</h2>
        <div className="space-y-2">
          {[
            { activity: "Thai Massage (1 hour)", bangkok: "฿200–฿400", home: "$60–$120" },
            { activity: "Muay Thai session", bangkok: "฿300–฿600", home: "$30–$80" },
            { activity: "Cooking class (half-day)", bangkok: "฿800–฿1,500", home: "$80–$200" },
            { activity: "Yoga drop-in", bangkok: "฿400–฿800", home: "$20–$40" },
            { activity: "Coworking (day pass)", bangkok: "฿250–฿500", home: "$20–$50" },
          ].map((row) => (
            <div key={row.activity} className="grid grid-cols-3 gap-2 text-sm py-1.5 border-b border-green-200 last:border-0">
              <div className="text-[var(--fg)] font-medium col-span-1 leading-tight">{row.activity}</div>
              <div className="text-green-800 font-black tabular-nums">{row.bangkok}</div>
              <div className="text-[var(--muted)] tabular-nums text-xs self-center">~{row.home} abroad</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity cards */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">Budget-Friendly Activity Directory</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {BUDGET_ACTIVITIES.map((a) => (
            <a
              key={a.nicheSlug}
              href={`/activities/${a.nicheSlug}`}
              className="group block border border-[var(--border)] rounded-2xl p-5 bg-white hover:border-green-300 hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <h3 className="font-black text-base group-hover:text-green-700 transition mb-1">{a.label}</h3>
              <div className="text-sm font-bold text-green-700 mb-2">{a.price}</div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{a.tip}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Free activities */}
      <section className="mb-8 border border-[var(--border)] rounded-2xl p-5 bg-white">
        <h2 className="font-black text-lg mb-3">Free Things to Do in Bangkok</h2>
        <ul className="space-y-2">
          {[
            "Lumphini Park — free public park with exercise classes 5:30–7:30am",
            "Chatuchak Weekend Market — free entry, 15,000+ stalls to browse",
            "Yaowarat (Chinatown) — street food and temple hopping",
            "Or Tor Kor Market — premium produce market, free to browse",
            "Bang Nam Pheung Floating Market — local floating market, free entry",
            "Chao Phraya River ferry — ฿15–฿30, best cheap sightseeing",
            "Wat Pho exterior grounds — free to walk through (temple entry paid)",
            "Public Muay Thai training — watch free morning training sessions at Rajadamnern Stadium area",
          ].map((item, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-green-600 shrink-0 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Budget Activities in Bangkok</h2>
        <div className="space-y-3">
          {BUDGET_FAQS.map((f, i) => (
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

      <FaqJsonLd faqs={BUDGET_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Budget Guide", url: "/activities/budget" },
      ]} />
    </div>
  );
}
