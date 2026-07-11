import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { getSlugMap, restaurantUrl, slugifySegment } from "@/lib/restaurants";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, FaqJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { OCCASION_NAV } from "@/lib/occasions";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { AreaGuide } from "@/components/AreaGuide";
import { TripType } from "@/components/TripType";
import { RestaurantTips } from "@/components/RestaurantTips";
import { SeasonalTip } from "@/components/SeasonalTip";
import { BangkokTransportGuide } from "@/components/BangkokTransportGuide";
import { BangkokParksGardens } from "@/components/BangkokParksGardens";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return Object.keys(db.city_counts).map((name) => ({ city: name }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params;
  const db = await loadMasterDb();
  const count = db.city_counts[city] ?? 0;
  const label = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: `Best Restaurants in ${label} 2026 — ${count} Ranked by Real Reviews`,
    description: `${count} restaurants in ${label} ranked by Trust Score from real Google reviews. Thai, Japanese, Korean & more — no influencer picks, no paid rankings. Updated 2026.`,
    alternates: { canonical: `/restaurants/${city}` },
    openGraph: {
      title: `Best ${label} Restaurants 2026 — Ranked by Real Reviews`,
      description: `${count} restaurants in ${label} ranked by verified Google review credibility. No paid placements.`,
    },
  };
}

const CITY_FAQS: Record<string, { q: string; a: string }[]> = {
  bangkok: [
    {
      q: "What are the best restaurants in Bangkok in 2026?",
      a: "Bangkok's top restaurants in 2026 span Thai, Japanese, Korean, Italian, and Chinese cuisines. The highest Trust Score restaurants (combining Google rating, review volume, and reviewer credibility) are concentrated in Sukhumvit, Silom, Thong Lor, and Ari. For authentic Thai food, Yaowarat (Chinatown) and local neighborhood spots in Pathum Wan rank highest with locals. Thaigle's Trust Score ranks 3,200+ Bangkok restaurants — no paid placements, no influencer picks.",
    },
    {
      q: "Which Bangkok neighborhood has the best food?",
      a: "Sukhumvit (Soi 1–55): The largest concentration of international restaurants — Japanese, Korean, Italian, and upscale Thai. Especially strong between Asoke and Thong Lor. Yaowarat (Chinatown): Best Bangkok street food at night — noodle soup, roast duck, dim sum, seafood. Silom/Bang Rak: Mix of budget Thai and fine dining, excellent Indian food. Ari: Local-facing, great value Thai restaurants, popular with expats. Thong Lor/Ekkamai: Trendy brunch spots, high-end Asian cuisine, best Japanese food outside Sukhumvit.",
    },
    {
      q: "Is Bangkok street food safe for tourists?",
      a: "At established stalls with Google review history, Bangkok street food is generally safe. Key signals: high turnover (food cooked fresh constantly), locals queuing, food cooked to order, sealed ice bags. Markets like Yaowarat at night, Or Tor Kor, and Chatuchak Weekend Market are safe defaults. Thaigle's Trust Score weighs review credibility — stalls with 100+ reviews and a high Local Guide ratio are statistically more reliable.",
    },
    {
      q: "How much does eating out in Bangkok cost?",
      a: "Street food stall: ฿40–฿80 per dish. Local casual restaurant: ฿80–฿200 per person. Mid-range restaurant: ฿300–฿800 per person. Upscale Thai or Japanese: ฿800–฿2,000 per person. Fine dining (Bo.lan, Sorn, Gaggan): ฿3,000–฿6,000 per person. A satisfying street food meal of 2 dishes + drink is typically under ฿200.",
    },
    {
      q: "What food is Bangkok most famous for?",
      a: "Bangkok is most famous for: Pad Thai (stir-fried rice noodles), Tom Yum Goong (spicy prawn soup), Pad Kra Pao (basil stir-fry with fried egg over rice — the unofficial Bangkok lunch), Green Curry, Som Tam (green papaya salad), and Mango Sticky Rice. For street food, Boat Noodles (tiny bowls, ฿15–฿30 each) and Khao Mun Gai (Hainanese chicken rice) are local staples.",
    },
  ],
  pattaya: [
    {
      q: "Where are the best restaurants in Pattaya in 2026?",
      a: "Pattaya's best restaurants are concentrated in North Pattaya (Naklua area), Central Pattaya (Walking Street adjacent), and Jomtien Beach for seafood. Top-rated by Trust Score include Thai seafood restaurants (the city's strongest category), international restaurants catering to expats, and local food markets. Avoid restaurants directly on Walking Street — prices are inflated.",
    },
    {
      q: "What food is Pattaya famous for?",
      a: "Pattaya is famous for fresh seafood — grilled fish, prawns, crab, and squid available at beachfront restaurants and local markets. Naklua seafood market (night market) and Jomtien night market are the best low-cost options. International food (German, British, Russian) is widely available reflecting Pattaya's expat mix.",
    },
  ],
};

export default async function CityHub(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const restaurants = filterByCity(db.restaurants, city);
  if (restaurants.length === 0) notFound();

  const label = city.charAt(0).toUpperCase() + city.slice(1);
  const districts = [...new Set(restaurants.map((r) => r.district).filter(Boolean))].sort();
  const top = [...restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 20);
  const cuisineCounts: Record<string, number> = {};
  for (const r of restaurants) {
    for (const c of r.cuisines) {
      cuisineCounts[c] = (cuisineCounts[c] ?? 0) + 1;
    }
  }
  const topCuisines = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const faqs = CITY_FAQS[city] ?? [];

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: label, url: `/restaurants/${city}` },
      ]} />
      <CollectionPageJsonLd
        name={`Best Restaurants in ${label} 2026`}
        description={`${restaurants.length} restaurants in ${label} ranked by Trust Score from real Google reviews.`}
        url={`/restaurants/${city}`}
        items={top.slice(0, 20)}
        slugMap={slugMap}
      />
      {faqs.length > 0 && <FaqJsonLd faqs={faqs} />}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Best Restaurants in {label} (2026)</h1>
        <p className="text-[var(--muted)] mb-2">
          {restaurants.length.toLocaleString()} restaurants ranked by Trust Score — real Google reviews, no influencer hype
        </p>
        <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed max-w-2xl">
          Trust Score combines Google rating, review volume, Local Guide ratio, and reviewer authority. No restaurant pays to appear here. Rankings are data-driven and update every 30 minutes.
        </p>

        {topCuisines.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-base mb-3">Browse by Cuisine</h2>
            <div className="flex flex-wrap gap-2">
              {topCuisines.map(([cat, count]) => (
                <a key={cat} href={`/restaurants/cuisine/${cat}`}
                   className="inline-flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-sm hover:bg-orange-50 hover:border-orange-400 transition font-medium">
                  <span aria-hidden>{CUISINE_ICONS[cat] ?? "🍴"}</span>
                  {CUISINE_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] text-xs">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {districts.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-base mb-3">Browse by Area in {label}</h2>
            <div className="flex flex-wrap gap-2">
              {districts.map((d) => (
                <a key={d} href={`/restaurants/${city}/${slugifySegment(d!)}`}
                   className="border rounded-full px-3 py-1.5 text-sm hover:bg-orange-50 hover:border-orange-400 transition">
                  📍 {d}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="font-semibold text-lg mb-3">Top Rated in {label}</h2>
          <div className="space-y-2">
            {top.map((r, i) => {
              const entry = slugMap[r.id];
              if (!entry) return null;
              return (
                <a key={r.id} href={restaurantUrl(entry)}
                   className="flex items-center gap-3 p-3 border rounded-lg hover:border-orange-400 transition">
                  <span className="font-bold text-[var(--muted)] w-6 text-sm">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{r.name}</div>
                    <div className="text-xs text-[var(--muted)]">{r.district || label} · ★{r.rating} · {r.total_reviews.toLocaleString()} reviews</div>
                    {r.cuisines.length > 0 && (
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        {r.cuisines.slice(0, 2).map((c) => CUISINE_LABELS[c] ?? c).join(" · ")}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-orange-600 shrink-0">Trust {r.trust_score}</div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Perfect For quick nav */}
        <section className="mb-8">
          <h2 className="font-semibold text-base mb-3">Find by occasion</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {OCCASION_NAV.slice(0, 8).map((o) => (
              <a key={o.slug} href={`/for/${o.slug}`}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm hover:border-orange-400 hover:bg-orange-50 transition whitespace-nowrap">
                <span>{o.emoji}</span>
                <span>{o.label}</span>
              </a>
            ))}
            <a href="/for" className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-full border text-sm hover:border-orange-400 hover:bg-orange-50 transition whitespace-nowrap text-[var(--muted)]">
              All occasions →
            </a>
          </div>
        </section>

        {faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-black mb-4">Frequently Asked About {label} Restaurants</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <details key={i} className="bg-white border border-[var(--border)] rounded-xl p-4 group">
                  <summary className="font-medium cursor-pointer flex items-center justify-between gap-3 text-sm">
                    <span>{f.q}</span>
                    <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0">⌄</span>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <SeasonalTip />
        <RestaurantTips />
        <AreaGuide />
        <BangkokTransportGuide />
        <BangkokParksGardens />
        <TripType />

        {/* Daily Challenge */}
        <BangkokChallenge />

        {/* Daily Tip */}
        <BangkokTip />

        {/* Poll */}
        <div className="mt-4 mb-4">
          <VersusVote
            question={`Dining in ${label} — what's your priority?`}
            a={{ id: "authentic-local", label: "Authentic local spots", emoji: "🏘️", desc: "No English menu, plastic stools, locals only — perfect", url: `${city === "bangkok" ? "/restaurants/bangkok/hidden-gems" : `/restaurants/${city}`}` }}
            b={{ id: "international", label: "International cuisine", emoji: "🌍", desc: "Sushi, Italian, Mexican — world-class options at Thai prices", url: `/restaurants/cuisine/japanese` }}
          />
        </div>

        {/* Quiz CTA */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-black text-lg">🎯 Not sure where to eat?</div>
            <div className="text-sm opacity-90">Take our Bangkok traveler quiz — 5 questions, personalized picks.</div>
          </div>
          <a href="/quiz" className="shrink-0 px-4 py-2 rounded-full bg-white text-orange-600 font-bold text-sm hover:bg-orange-50 transition">
            Take the quiz →
          </a>
        </div>
      </div>
    </>
  );
}
