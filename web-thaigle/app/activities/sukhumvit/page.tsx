import type { Metadata } from "next";
import { NICHES } from "@/lib/niches";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Activities in Sukhumvit Bangkok — Muay Thai, Spa, Yoga, Coworking (2026)",
  description:
    "Best activities in Sukhumvit Bangkok: Muay Thai gyms, Thai massage, yoga studios, coworking spaces. Sukhumvit BTS access, ranked by real reviews.",
  alternates: { canonical: "/activities/sukhumvit" },
};

const SUKHUMVIT_FAQS = [
  {
    q: "What activities can I do in Sukhumvit Bangkok?",
    a: "Sukhumvit is Bangkok's most activity-dense area. Within walking distance of BTS: Muay Thai gyms (Soi 16–32 area), Thai massage shops (every 200m on main road and side streets), yoga studios (Thong Lo/Ekkamai at the eastern end), coworking spaces (Asoke and Phrom Phong area), and quality restaurants and cafes throughout. Most activity venues are within 5–10 min BTS ride of each other.",
  },
  {
    q: "Which BTS stop is best for activities in Sukhumvit?",
    a: "Asoke (Sukhumvit BTS) / Sukhumvit (MRT): Muay Thai gyms, coworking spaces, central location. Phrom Phong: Shopping, Emporium/EmQuartier, quality spas. Thong Lo (Thong Lo BTS): Yoga studios, trendy cafes, wellness centers, upscale spas. Ekkamai: Less touristy, more local yoga studios, coffee shops. On Nut: Most affordable accommodation with BTS access — 15 min to Asoke.",
  },
  {
    q: "Is Sukhumvit good for Muay Thai training?",
    a: "Yes — several quality Muay Thai gyms are accessible from Sukhumvit BTS. Gyms in the Soi 16–31 range are popular with tourists and have English-speaking trainers. Prices are slightly higher than gyms further out (฿500–฿800 vs ฿300–฿500) but the BTS convenience is worth it for short-stay tourists.",
  },
  {
    q: "Are there good spas in Sukhumvit?",
    a: "Excellent spa density. Budget massage shops: scattered throughout Soi 11, Soi 33, and Phrom Phong area (฿250–฿400). Mid-range day spas: Divana, Let's Relax, and other branded chains (฿600–฿1,500). Luxury: Spa by JW (JW Marriott), Elemis at several hotels (฿2,000–฿5,000). Hotel spas in Sukhumvit have some of Bangkok's best facilities.",
  },
  {
    q: "What is the best yoga studio in Sukhumvit?",
    a: "Thong Lo (Sukhumvit Soi 55) has the highest concentration of quality yoga studios. Flow House, Absolute Yoga, and several boutique studios are all within the Thong Lo–Ekkamai corridor. Drop-in classes: ฿400–฿800. Hot yoga studios are popular. Most studios have English instruction and welcome beginners.",
  },
];

const AREA_HIGHLIGHTS = [
  {
    area: "Asoke / Sukhumvit 21",
    bts: "BTS Asoke / MRT Sukhumvit",
    bestFor: ["Muay Thai", "Coworking", "Central transport hub"],
    priceLevel: "฿฿",
    vibe: "Business district meets expat hub",
  },
  {
    area: "Phrom Phong / Soi 39",
    bts: "BTS Phrom Phong",
    bestFor: ["Spas", "Japanese restaurants", "Shopping malls"],
    priceLevel: "฿฿฿",
    vibe: "Upscale, Japanese community, malls",
  },
  {
    area: "Thong Lo / Soi 55",
    bts: "BTS Thong Lo",
    bestFor: ["Yoga", "Wellness", "Trendy cafes", "Nightlife"],
    priceLevel: "฿฿฿",
    vibe: "Trendy, expat-heavy, instagram-worthy",
  },
  {
    area: "Ekkamai / Soi 63",
    bts: "BTS Ekkamai",
    bestFor: ["Local yoga studios", "Coffee shops", "Authentic dining"],
    priceLevel: "฿฿",
    vibe: "Less touristy, local creative scene",
  },
  {
    area: "On Nut / Soi 77",
    bts: "BTS On Nut",
    bestFor: ["Budget accommodation", "Local food", "24h coworking"],
    priceLevel: "฿",
    vibe: "Most affordable Sukhumvit area",
  },
];

export default function SukhumvitActivitiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Sukhumvit</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
        District Guide · BTS Sukhumvit Line
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-balance">
        Activities in Sukhumvit, Bangkok
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Bangkok&apos;s most activity-dense corridor. Muay Thai, Thai massage, yoga, coworking, and more — all within BTS reach.
      </p>

      {/* BTS tip */}
      <div className="mb-8 p-4 rounded-2xl bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🚇</span>
          <span className="font-black">Sukhumvit BTS Line</span>
        </div>
        <p className="text-sm text-[var(--muted)]">
          All areas below are on the BTS Sukhumvit Line (green line). ฿16–฿52 between stations, runs 5:30am–midnight. Use BTS Rabbit Card for 10% discount on fares.
        </p>
      </div>

      {/* Area breakdown */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-5">Sukhumvit by Area</h2>
        <div className="space-y-3">
          {AREA_HIGHLIGHTS.map((area) => (
            <div key={area.area} className="border border-[var(--border)] rounded-xl p-4 bg-white">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-black text-base">{area.area}</h3>
                  <div className="text-xs text-blue-600 font-bold">{area.bts}</div>
                </div>
                <span className="text-sm font-bold text-[var(--muted)] shrink-0">{area.priceLevel}</span>
              </div>
              <p className="text-xs text-[var(--muted)] mb-2">{area.vibe}</p>
              <div className="flex flex-wrap gap-1.5">
                {area.bestFor.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity directory links */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">Browse Activities Near Sukhumvit</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {NICHES.map((n) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="group flex items-center gap-3 p-4 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 hover:shadow-sm transition"
            >
              <span className="text-2xl shrink-0">{n.icon}</span>
              <span className="text-sm font-bold group-hover:text-orange-700 transition leading-tight">{n.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Sukhumvit Activities</h2>
        <div className="space-y-3">
          {SUKHUMVIT_FAQS.map((f, i) => (
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

      {/* Other districts */}
      <section className="mb-6">
        <h2 className="text-lg font-black mb-3">Other Bangkok districts</h2>
        <div className="grid grid-cols-2 gap-2">
          <a href="/activities/silom" className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm font-medium hover:text-orange-700 transition text-center">
            Silom / Sathorn →
          </a>
          <a href="/activities" className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm font-medium hover:text-orange-700 transition text-center">
            All Activities →
          </a>
        </div>
      </section>

      <FaqJsonLd faqs={SUKHUMVIT_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Sukhumvit", url: "/activities/sukhumvit" },
      ]} />
    </div>
  );
}
