import { notFound } from "next/navigation";
import { loadMasterDb, filterByCuisine } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, FaqJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { CUISINE_FAQS } from "@/lib/faq";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { RatingLegend } from "@/components/RatingLegend";
import { OpenNow } from "@/components/OpenNow";
import { RestaurantTips } from "@/components/RestaurantTips";
import { PriceQuickView } from "@/components/PriceQuickView";
import { ThaiDessertsGuide } from "@/components/ThaiDessertsGuide";
import { BangkokNightMarkets } from "@/components/BangkokNightMarkets";
import { BangkokVeganGuide } from "@/components/BangkokVeganGuide";
import { BangkokBeerGuide } from "@/components/BangkokBeerGuide";
import { BangkokKoreanFood } from "@/components/BangkokKoreanFood";
import { BangkokJapaneseFood } from "@/components/BangkokJapaneseFood";
import { BangkokWesternFood } from "@/components/BangkokWesternFood";
import { BangkokIndianFood } from "@/components/BangkokIndianFood";
import { BangkokItalianFood } from "@/components/BangkokItalianFood";
import { BangkokChineseFood } from "@/components/BangkokChineseFood";
import { BangkokHalalFood } from "@/components/BangkokHalalFood";
import { BangkokSteakHouses } from "@/components/BangkokSteakHouses";
import { BangkokVegetarianRestaurants } from "@/components/BangkokVegetarianRestaurants";
import { BangkokSeafood } from "@/components/BangkokSeafood";
import { BangkokHealthFood } from "@/components/BangkokHealthFood";
import { BangkokFrenchFood } from "@/components/BangkokFrenchFood";
import { BangkokVietnameseFood } from "@/components/BangkokVietnameseFood";
import { BangkokMexicanFood } from "@/components/BangkokMexicanFood";
import { BangkokBBQ } from "@/components/BangkokBBQ";
import { BangkokThaiCuisineRegional } from "@/components/BangkokThaiCuisineRegional";
import { BangkokIsaanFood } from "@/components/BangkokIsaanFood";
import { BangkokDimSum } from "@/components/BangkokDimSum";
import { BangkokNoodleGuide } from "@/components/BangkokNoodleGuide";
import { BangkokPizzaGuide } from "@/components/BangkokPizzaGuide";
import { BangkokBurgerSpots } from "@/components/BangkokBurgerSpots";
import { BangkokSoupGuide } from "@/components/BangkokSoupGuide";
import { BangkokFusionFood } from "@/components/BangkokFusionFood";
import { BangkokVeganOptions } from "@/components/BangkokVeganOptions";
import { BangkokDessertGuide } from "@/components/BangkokDessertGuide";
import { BangkokStreetFoodMap } from "@/components/BangkokStreetFoodMap";
import { BangkokIceCreamGuide } from "@/components/BangkokIceCreamGuide";
import { BangkokSushiGuide } from "@/components/BangkokSushiGuide";
import { BangkokBrunchGuide } from "@/components/BangkokBrunchGuide";
import { BangkokPastaItalian } from "@/components/BangkokPastaItalian";
import { BangkokRamenGuide } from "@/components/BangkokRamenGuide";
import { BangkokMiddleEastern } from "@/components/BangkokMiddleEastern";
import { BangkokGreekFood } from "@/components/BangkokGreekFood";
import { BangkokFrenchPastry } from "@/components/BangkokFrenchPastry";
import { BangkokHealthyFood } from "@/components/BangkokHealthyFood";
import { BangkokTacos } from "@/components/BangkokTacos";
import { BangkokSpanishFood } from "@/components/BangkokSpanishFood";
import { BangkokAmericanFood } from "@/components/BangkokAmericanFood";
import { BangkokPokeGuide } from "@/components/BangkokPokeGuide";
import { BangkokHotpot } from "@/components/BangkokHotpot";
import { BangkokDumplings } from "@/components/BangkokDumplings";
import { BangkokKetoFood } from "@/components/BangkokKetoFood";
import { BangkokKhaoTom } from "@/components/BangkokKhaoTom";
import { BangkokGlutenFree } from "@/components/BangkokGlutenFree";
import { BangkokOmakase } from "@/components/BangkokOmakase";
import { BangkokFilipinoFood } from "@/components/BangkokFilipinoFood";
import { BangkokIndonesianFood } from "@/components/BangkokIndonesianFood";
import { BangkokBrazilianFood } from "@/components/BangkokBrazilianFood";
import { BangkokPersianFood } from "@/components/BangkokPersianFood";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return Object.keys(db.cuisine_counts).map((cuisine) => ({ cuisine }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  const { cuisine } = await params;
  const label = CUISINE_LABELS[cuisine] ?? cuisine;
  const db = await loadMasterDb();
  const list = filterByCuisine(db.restaurants, cuisine);
  const totalReviews = list.reduce((s, r) => s + r.total_reviews, 0);
  const top = [...list].sort((a, b) => b.trust_score - a.trust_score)[0];
  const topSnippet = top ? ` Top-ranked: ${top.name} (★${top.rating}, Trust Score ${top.trust_score}).` : "";
  return {
    title: `Best ${label} Restaurants in Bangkok 2026 — ${list.length} Ranked by Real Reviews`,
    description: `${list.length} ${label.toLowerCase()} restaurants in Bangkok ranked by Trust Score from ${totalReviews.toLocaleString()} Google reviews.${topSnippet} No paid picks, updated 2026.`,
    alternates: { canonical: `/restaurants/cuisine/${cuisine}` },
    openGraph: {
      title: `Best ${label} Restaurants Bangkok 2026`,
      description: `${list.length} ${label.toLowerCase()} restaurants ranked by real Google reviews — no influencer picks, no paid placements.`,
    },
  };
}

export default async function CuisineHub(
  { params }: { params: Promise<{ cuisine: string }> }
) {
  const { cuisine } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const label = CUISINE_LABELS[cuisine] ?? cuisine;
  const list = filterByCuisine(db.restaurants, cuisine);
  if (list.length === 0) notFound();
  const sorted = [...list].sort((a, b) => b.trust_score - a.trust_score);

  const faqs = CUISINE_FAQS[cuisine] ?? [];

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: `${label} Restaurants Bangkok`, url: `/restaurants/cuisine/${cuisine}` },
      ]} />
      <CollectionPageJsonLd
        name={`Best ${label} Restaurants in Bangkok 2026`}
        description={`${list.length} ${label.toLowerCase()} restaurants in Bangkok ranked by Trust Score from real Google reviews.`}
        url={`/restaurants/cuisine/${cuisine}`}
        items={sorted.slice(0, 20)}
        slugMap={slugMap}
      />
      {faqs.length > 0 && <FaqJsonLd faqs={faqs} />}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/" className="hover:text-black">Home</a>
          <span className="mx-1.5">›</span>
          <a href="/restaurants" className="hover:text-black">Restaurants</a>
          <span className="mx-1.5">›</span>
          <span>{label}</span>
        </nav>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-3xl font-bold">
            {CUISINE_ICONS[cuisine] && <span className="mr-2">{CUISINE_ICONS[cuisine]}</span>}
            Best {label} Restaurants in Bangkok (2026)
          </h1>
          <ShareButton
            title={`Best ${label} Restaurants in Bangkok 2026`}
            text={`${sorted.length} ${label} restaurants ranked by real Google reviews`}
            url={`${SITE}/restaurants/cuisine/${cuisine}`}
            line
            whatsapp
          />
        </div>
        <p className="text-[var(--muted)] mb-2">
          {list.length.toLocaleString()} restaurants · Trust Score ranked · No influencer hype
        </p>
        <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed max-w-2xl">
          Rankings are built from real Google review data — rating, volume, Local Guide ratio, and reviewer authority. No restaurant pays to appear here.
        </p>
        <div className="space-y-2 mb-10">
          {sorted.slice(0, 50).map((r, i) => {
            const entry = slugMap[r.id];
            if (!entry) return null;
            return (
              <a key={r.id} href={restaurantUrl(entry)}
                 className="flex items-center gap-3 p-3 border rounded-lg hover:border-orange-400 transition">
                <span className="font-bold text-[var(--muted)] w-6 text-sm">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">{r.district || r.city_label} · ★{r.rating} · {r.total_reviews.toLocaleString()} reviews</div>
                </div>
                <div className="text-sm font-semibold text-orange-600 shrink-0">Trust {r.trust_score}</div>
              </a>
            );
          })}
        </div>
        {faqs.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-black mb-4">Frequently Asked About {label} Food in Bangkok</h2>
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

        <PriceQuickView type="restaurant" />
        <RestaurantTips />
        {cuisine === "dessert" && <ThaiDessertsGuide />}
        {(cuisine === "street_food" || cuisine === "thai") && <BangkokNightMarkets />}
        {(cuisine === "vegan" || cuisine === "vegetarian") && <BangkokVeganGuide />}
        {cuisine === "bar_pub" && <BangkokBeerGuide />}
        {cuisine === "korean" && <BangkokKoreanFood />}
        {cuisine === "japanese" && <BangkokJapaneseFood />}
        {(cuisine === "western" || cuisine === "american") && <BangkokWesternFood />}
        {cuisine === "indian" && <BangkokIndianFood />}
        {cuisine === "italian" && <BangkokItalianFood />}
        {cuisine === "chinese" && <BangkokChineseFood />}
        {cuisine === "halal" && <BangkokHalalFood />}
        {(cuisine === "steak" || cuisine === "grill") && <BangkokSteakHouses />}
        {(cuisine === "vegetarian" || cuisine === "vegan") && <BangkokVegetarianRestaurants />}
        {cuisine === "seafood" && <BangkokSeafood />}
        {(cuisine === "healthy" || cuisine === "organic") && <BangkokHealthFood />}
        {cuisine === "french" && <BangkokFrenchFood />}
        {cuisine === "vietnamese" && <BangkokVietnameseFood />}
        {cuisine === "mexican" && <BangkokMexicanFood />}
        {(cuisine === "bbq" || cuisine === "grill") && <BangkokBBQ />}
        {cuisine === "thai" && <BangkokThaiCuisineRegional />}
        {(cuisine === "isaan" || cuisine === "northeastern") && <BangkokIsaanFood />}
        {(cuisine === "dim_sum" || cuisine === "yum_cha") && <BangkokDimSum />}
        {(cuisine === "noodle" || cuisine === "ramen") && <BangkokNoodleGuide />}
        {cuisine === "pizza" && <BangkokPizzaGuide />}
        {(cuisine === "burger" || cuisine === "fast_food" || cuisine === "american") && <BangkokBurgerSpots />}
        {(cuisine === "soup" || cuisine === "tom_yum") && <BangkokSoupGuide />}
        {(cuisine === "fusion" || cuisine === "modern") && <BangkokFusionFood />}
        {cuisine === "vegan" && <BangkokVeganOptions />}
        {(cuisine === "dessert" || cuisine === "sweets") && <BangkokDessertGuide />}
        {(cuisine === "street_food" || cuisine === "street-food") && <BangkokStreetFoodMap />}
        {(cuisine === "ice_cream" || cuisine === "ice-cream") && <BangkokIceCreamGuide />}
        {cuisine === "sushi" && <BangkokSushiGuide />}
        {(cuisine === "brunch" || cuisine === "breakfast") && <BangkokBrunchGuide />}
        {(cuisine === "italian" || cuisine === "pasta") && <BangkokPastaItalian />}
        {(cuisine === "ramen" || cuisine === "japanese_ramen") && <BangkokRamenGuide />}
        {(cuisine === "middle_eastern" || cuisine === "arabic" || cuisine === "lebanese") && <BangkokMiddleEastern />}
        {(cuisine === "greek" || cuisine === "mediterranean") && <BangkokGreekFood />}
        {(cuisine === "french" || cuisine === "bakery" || cuisine === "pastry") && <BangkokFrenchPastry />}
        {(cuisine === "healthy" || cuisine === "salad" || cuisine === "bowls") && <BangkokHealthyFood />}
        {(cuisine === "mexican" || cuisine === "tacos") && <BangkokTacos />}
        {(cuisine === "spanish" || cuisine === "tapas") && <BangkokSpanishFood />}
        {(cuisine === "american" || cuisine === "bbq") && <BangkokAmericanFood />}
        {(cuisine === "poke" || cuisine === "hawaiian") && <BangkokPokeGuide />}
        {(cuisine === "hotpot" || cuisine === "shabu" || cuisine === "suki") && <BangkokHotpot />}
        {(cuisine === "dumplings" || cuisine === "dim_sum" || cuisine === "gyoza") && <BangkokDumplings />}
        {(cuisine === "keto" || cuisine === "low_carb") && <BangkokKetoFood />}
        {(cuisine === "congee" || cuisine === "jok" || cuisine === "khao_tom") && <BangkokKhaoTom />}
        {(cuisine === "gluten_free" || cuisine === "celiac") && <BangkokGlutenFree />}
        {(cuisine === "omakase" || cuisine === "japanese_fine") && <BangkokOmakase />}
        {(cuisine === "filipino" || cuisine === "pinoy") && <BangkokFilipinoFood />}
        {(cuisine === "indonesian" || cuisine === "balinese" || cuisine === "nasi_goreng") && <BangkokIndonesianFood />}
        {(cuisine === "brazilian" || cuisine === "churrasco" || cuisine === "rodizio") && <BangkokBrazilianFood />}
        {(cuisine === "persian" || cuisine === "iranian" || cuisine === "kebab") && <BangkokPersianFood />}
        <OpenNow />
        <RatingLegend />

        {/* Daily Challenge */}
        <BangkokChallenge />

        {/* Daily Tip */}
        <BangkokTip />

        {/* Quick Poll */}
        <div className="mt-4 mb-4">
          <VersusVote
            question="How do you find great restaurants in Bangkok?"
            a={{ id: "trust-score", label: "Trust Score ranking", emoji: "📊", desc: "Data from real verified Google reviewers — no hype", url: "/trending" }}
            b={{ id: "local-word", label: "Word of mouth / locals", emoji: "🤝", desc: "Ask someone who lives here — never fails", url: "/local-tips" }}
          />
        </div>

        {/* Engagement CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a href="/quiz" className="flex-1 flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-200 hover:border-orange-300 hover:shadow-sm transition group">
            <span className="text-2xl shrink-0">🎯</span>
            <div>
              <div className="font-bold text-sm group-hover:text-orange-700 transition">Find your Bangkok type</div>
              <div className="text-xs text-[var(--muted)]">5-question quiz → personalized picks</div>
            </div>
          </a>
          <a href="/for" className="flex-1 flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-300 hover:shadow-sm transition group">
            <span className="text-2xl shrink-0">✨</span>
            <div>
              <div className="font-bold text-sm group-hover:text-amber-700 transition">Browse by occasion</div>
              <div className="text-xs text-[var(--muted)]">Date night, budget, late-night & more</div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
