import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NICHES,
  loadNicheDb,
  loadCommunityDb,
  topNichePlaces,
  buildKlookIndex,
} from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { AdSlot } from "@/components/AffiliateSlot";
import { NicheGrid } from "@/components/NicheGrid";
import { ShareButton } from "@/components/ShareButton";
import { NicheItemListJsonLd, FaqJsonLd, BreadcrumbJsonLd, TouristAttractionJsonLd, ActivityServiceJsonLd, SpeakableJsonLd } from "@/components/JsonLd";
import { NICHE_FAQS, NICHE_INTRO } from "@/lib/niche-content";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { RatingLegend } from "@/components/RatingLegend";
import { KlookBanner } from "@/components/KlookBanner";
import { CookingClassPreview } from "@/components/CookingClassPreview";
import { MuayThaiGuide } from "@/components/MuayThaiGuide";
import { SpaGuide } from "@/components/SpaGuide";
import { YogaGuide } from "@/components/YogaGuide";
import { DivingGuide } from "@/components/DivingGuide";
import { BangkokFoodGlossary } from "@/components/BangkokFoodGlossary";
import { BangkokMuayThaiHistory } from "@/components/BangkokMuayThaiHistory";
import { BangkokYogaStyles } from "@/components/BangkokYogaStyles";
import { BangkokCoworkingTips } from "@/components/BangkokCoworkingTips";
import { BangkokDivingTrips } from "@/components/BangkokDivingTrips";
import { BangkokSpaTypes } from "@/components/BangkokSpaTypes";
import { BangkokCookingClassGuide } from "@/components/BangkokCookingClassGuide";
import { BangkokThaiBoxingWeek } from "@/components/BangkokThaiBoxingWeek";
import { BangkokGolfGuide } from "@/components/BangkokGolfGuide";
import { BangkokFitnessGuide } from "@/components/BangkokFitnessGuide";
import { BangkokDigitalNomadCafe } from "@/components/BangkokDigitalNomadCafe";
import { BangkokThaiMassageTypes } from "@/components/BangkokThaiMassageTypes";
import { BangkokMeditationRetreats } from "@/components/BangkokMeditationRetreats";
import { BangkokMuayThaiStadiums } from "@/components/BangkokMuayThaiStadiums";
import { BangkokWaterSports } from "@/components/BangkokWaterSports";
import { BangkokThaiCookingIngredients } from "@/components/BangkokThaiCookingIngredients";
import { BangkokArtGalleries } from "@/components/BangkokArtGalleries";
import { BangkokNightlife } from "@/components/BangkokNightlife";
import { BangkokSpaGuide } from "@/components/BangkokSpaGuide";
import { BangkokRooftopBars } from "@/components/BangkokRooftopBars";
import { BangkokMedicalTourism } from "@/components/BangkokMedicalTourism";
import { BangkokGolfCourses } from "@/components/BangkokGolfCourses";
import { BangkokHikingDayTrips } from "@/components/BangkokHikingDayTrips";
import { BangkokYogaStudios } from "@/components/BangkokYogaStudios";
import { BangkokTattooStudios } from "@/components/BangkokTattooStudios";
import { BangkokThaiBoxingClass } from "@/components/BangkokThaiBoxingClass";
import { BangkokHairSalon } from "@/components/BangkokHairSalon";
import { BangkokCocktailBars } from "@/components/BangkokCocktailBars";
import { BangkokPhotographySpots } from "@/components/BangkokPhotographySpots";
import { BangkokLGBTGuide } from "@/components/BangkokLGBTGuide";
import { BangkokSoloTravelGuide } from "@/components/BangkokSoloTravelGuide";
import { BangkokIslandHopping } from "@/components/BangkokIslandHopping";
import { BangkokEcoTourism } from "@/components/BangkokEcoTourism";
import { BangkokBirdwatching } from "@/components/BangkokBirdwatching";
import { BangkokExpatsGuide } from "@/components/BangkokExpatsGuide";
import { BangkokLanguageClasses } from "@/components/BangkokLanguageClasses";
import { BangkokKaraokeGuide } from "@/components/BangkokKaraokeGuide";
import { BangkokRooftopPoolHotels } from "@/components/BangkokRooftopPoolHotels";
import { BangkokMassagePriceGuide } from "@/components/BangkokMassagePriceGuide";
import { BangkokSakYantGuide } from "@/components/BangkokSakYantGuide";
import { BangkokBookstores } from "@/components/BangkokBookstores";
import { BangkokPetCafes } from "@/components/BangkokPetCafes";
import { BangkokApartmentAreas } from "@/components/BangkokApartmentAreas";
import { BangkokSkyBarGuide } from "@/components/BangkokSkyBarGuide";
import { BangkokMuayThaiWatch } from "@/components/BangkokMuayThaiWatch";
import { BangkokStreetArt } from "@/components/BangkokStreetArt";
import { BangkokVintageShops } from "@/components/BangkokVintageShops";
import { BangkokClimbingGyms } from "@/components/BangkokClimbingGyms";
import { BangkokCraftBeer } from "@/components/BangkokCraftBeer";
import { BangkokTempleHopping } from "@/components/BangkokTempleHopping";
import { BangkokCinemaGuide } from "@/components/BangkokCinemaGuide";
import { BangkokTattooParlors } from "@/components/BangkokTattooParlors";
import { BangkokGymFitness } from "@/components/BangkokGymFitness";
import { BangkokSwimmingPools } from "@/components/BangkokSwimmingPools";
import { BangkokDentalGuide } from "@/components/BangkokDentalGuide";
import { BangkokElephantSanctuaries } from "@/components/BangkokElephantSanctuaries";
import { BangkokNightClubs } from "@/components/BangkokNightClubs";
import { BangkokWaterActivities } from "@/components/BangkokWaterActivities";
import { BangkokArtToys } from "@/components/BangkokArtToys";
import { BangkokLatteArtCafes } from "@/components/BangkokLatteArtCafes";
import { BangkokPublicArtGuide } from "@/components/BangkokPublicArtGuide";
import { BangkokBoardGameCafes } from "@/components/BangkokBoardGameCafes";
import { BangkokBicycleRentals } from "@/components/BangkokBicycleRentals";
import { BangkokThaiMassageLearn } from "@/components/BangkokThaiMassageLearn";
import { BangkokBestViewpoints } from "@/components/BangkokBestViewpoints";
import { BangkokWeekendGetaways } from "@/components/BangkokWeekendGetaways";
import { BangkokBudgetTravel } from "@/components/BangkokBudgetTravel";
import { BangkokWalkingTours } from "@/components/BangkokWalkingTours";
import { BangkokEscapeRooms } from "@/components/BangkokEscapeRooms";
import { BangkokComedyShows } from "@/components/BangkokComedyShows";
import { BangkokPokerGuide } from "@/components/BangkokPokerGuide";
import { BangkokScubaDiving } from "@/components/BangkokScubaDiving";
import { BangkokParksGardens } from "@/components/BangkokParksGardens";
import { BangkokLiveMusic } from "@/components/BangkokLiveMusic";
import { BangkokAdventureActivities } from "@/components/BangkokAdventureActivities";
import { BangkokPotteryClasses } from "@/components/BangkokPotteryClasses";
import { BangkokDanceLessons } from "@/components/BangkokDanceLessons";
import { BangkokBoxingGyms } from "@/components/BangkokBoxingGyms";
import { BangkokOnsenSpa } from "@/components/BangkokOnsenSpa";
import { BangkokGamingCafes } from "@/components/BangkokGamingCafes";
import { BangkokArchery } from "@/components/BangkokArchery";
import { BangkokFilmPhotography } from "@/components/BangkokFilmPhotography";
import { BangkokSurfingGuide } from "@/components/BangkokSurfingGuide";
import { BangkokVolunteer } from "@/components/BangkokVolunteer";
import { BangkokKlongTour } from "@/components/BangkokKlongTour";
import { BangkokCabaret } from "@/components/BangkokCabaret";
import { BangkokHennaTattoo } from "@/components/BangkokHennaTattoo";
import { BangkokSilentDisco } from "@/components/BangkokSilentDisco";
import { BangkokCraftsWorkshops } from "@/components/BangkokCraftsWorkshops";

export const dynamic = "force-static";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export function generateStaticParams() {
  return NICHES.map((n) => ({ niche: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string }>;
}): Promise<Metadata> {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return {};
  const db = await loadNicheDb(niche as NicheSlug);
  const intro = NICHE_INTRO[niche as NicheSlug];
  return {
    title: `Best ${info.label} in Bangkok 2026 — ${db.total} Ranked by Real Reviews`,
    description: `Find the best ${info.label.toLowerCase()} in Bangkok in 2026. ${db.total} venues ranked by Trust Score from real Google reviews — prices, tips, and Klook booking. No paid picks.`,
    alternates: { canonical: `/activities/${niche}` },
    openGraph: {
      title: `Best ${info.label} in Bangkok 2026 — Data-Driven Rankings`,
      description: `${db.total} ${info.label.toLowerCase()} venues ranked by Trust Score from verified Google reviews. ${intro?.sub ?? "No paid picks."}`,
    },
    twitter: {
      title: `Best ${info.label} in Bangkok 2026`,
      description: `${db.total} venues ranked by real Google reviews — no influencer picks, no paid placements.`,
    },
  };
}

const PRICE_BAND_LABELS: Record<string, string> = {
  budget: "฿",
  mid: "฿฿",
  premium: "฿฿฿",
  luxury: "฿฿฿฿",
};

export default async function NichePage({
  params,
}: {
  params: Promise<{ niche: string }>;
}) {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) notFound();

  const [db, community] = await Promise.all([
    loadNicheDb(niche as NicheSlug),
    loadCommunityDb(niche as NicheSlug),
  ]);

  const top = topNichePlaces(db.places, 60);
  const klookMap = await buildKlookIndex(top.map((p) => p.id));
  const topReddit = community?.top_reddit?.slice(0, 4) ?? [];
  const topNaver = community?.top_naver?.slice(0, 3) ?? [];
  const planType = info.planType;
  const pageUrl = `${SITE}/activities/${niche}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <a href="/activities" className="text-sm text-[var(--muted)] hover:text-black mb-4 inline-flex items-center gap-1">
        ← All Activities
      </a>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{info.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                {NICHE_INTRO[niche as NicheSlug]?.headline ?? `Best ${info.label} in Bangkok`}
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                {NICHE_INTRO[niche as NicheSlug]?.sub ?? `${db.total} venues · ranked by real reviews`}
              </p>
            </div>
          </div>
          <ShareButton
            title={`Best ${info.label} in Bangkok`}
            text={`${db.total} venues ranked by real Google reviews — no paid picks`}
            url={pageUrl}
            kakao
            line
            whatsapp
          />
        </div>

        {/* Filter badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">✓ No paid rankings</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">📊 Trust Score method</span>
          {top.filter((p) => p.is_beginner_friendly).length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
              🌱 {top.filter((p) => p.is_beginner_friendly).length} beginner-friendly
            </span>
          )}
          {top.filter((p) => p.languages?.ko).length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              🇰🇷 {top.filter((p) => p.languages?.ko).length} Korean-speaking
            </span>
          )}
        </div>
      </div>

      {/* Top-10 article link */}
      <div className="mb-4 text-sm">
        <span className="text-[var(--muted)]">Looking for a ranked article? </span>
        <a href={`/activities/${niche}/top-10`} className="text-orange-600 font-bold hover:underline">
          See our Top 10 {info.label} in Bangkok →
        </a>
      </div>

      <NicheGrid
        places={top}
        klookData={[...klookMap.entries()]}
        nicheSlug={niche}
        nicheIcon={info.icon}
        planType={planType}
        PRICE_BAND_LABELS={PRICE_BAND_LABELS}
      />

      <AdSlot slot={`activities-${niche}-mid`} />

      {/* Community discussions */}
      {(topReddit.length > 0 || topNaver.length > 0) && (
        <section className="mb-10 border border-[var(--border)] rounded-2xl p-5 bg-white">
          <h2 className="text-lg font-black mb-1">What travelers say online</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Real discussions about {info.label.toLowerCase()} in Thailand
          </p>

          {topReddit.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
                Reddit · {community?.counts.reddit.toLocaleString()} posts
              </div>
              <div className="space-y-2">
                {topReddit.map((post, i) => (
                  <a
                    key={i}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-orange-300 hover:bg-orange-50/40 transition group"
                  >
                    <div className="text-[var(--muted)] text-xs tabular-nums shrink-0 pt-0.5 font-bold min-w-[36px] text-right">
                      ▲{post.score >= 1000 ? `${(post.score / 1000).toFixed(1)}k` : post.score}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium group-hover:text-orange-700 transition line-clamp-2 leading-snug">
                        {post.title}
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        r/{post.subreddit} · {post.comments.toLocaleString()} comments
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {topNaver.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
                🇰🇷 Naver · {community?.counts.naver.toLocaleString()} posts
              </div>
              <div className="space-y-2">
                {topNaver.map((post, i) => (
                  <a
                    key={i}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-purple-200 hover:bg-purple-50/40 transition group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium group-hover:text-purple-700 transition line-clamp-2 leading-snug">
                        {post.title}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* FAQ section */}
      {(NICHE_FAQS[niche as NicheSlug] ?? []).length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-black mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {(NICHE_FAQS[niche as NicheSlug] ?? []).map((f, i) => (
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

      {/* Cross-link */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          More activities in Bangkok
        </h2>
        <div className="flex flex-wrap gap-2">
          {NICHES.filter((n) => n.slug !== niche).map((n) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition font-medium"
            >
              {n.icon} {n.label}
            </a>
          ))}
        </div>
      </section>

      {niche === "cooking" && <CookingClassPreview />}
      {niche === "cooking" && <BangkokFoodGlossary />}
      {niche === "muay-thai" && <MuayThaiGuide />}
      {niche === "muay-thai" && <BangkokMuayThaiHistory />}
      {niche === "yoga-pilates" && <BangkokYogaStyles />}
      {niche === "coworking" && <BangkokCoworkingTips />}
      {niche === "diving" && <BangkokDivingTrips />}
      {niche === "spa" && <BangkokSpaTypes />}
      {niche === "cooking" && <BangkokCookingClassGuide />}
      {niche === "muay-thai" && <BangkokThaiBoxingWeek />}
      {niche === "golf" && <BangkokGolfGuide />}
      {niche === "fitness" && <BangkokFitnessGuide />}
      {(niche === "coworking" || niche === "digital-nomad") && <BangkokDigitalNomadCafe />}
      {niche === "spa" && <BangkokThaiMassageTypes />}
      {(niche === "wellness" || niche === "meditation") && <BangkokMeditationRetreats />}
      {niche === "muay-thai" && <BangkokMuayThaiStadiums />}
      {(niche === "water-sports" || niche === "surf" || niche === "diving") && <BangkokWaterSports />}
      {niche === "cooking" && <BangkokThaiCookingIngredients />}
      {(niche === "art" || niche === "gallery") && <BangkokArtGalleries />}
      {(niche === "nightlife" || niche === "clubbing" || niche === "bars") && <BangkokNightlife />}
      {(niche === "wellness" || niche === "spa") && <BangkokSpaGuide />}
      {(niche === "rooftop" || niche === "views") && <BangkokRooftopBars />}
      {(niche === "medical" || niche === "dental") && <BangkokMedicalTourism />}
      {niche === "golf" && <BangkokGolfCourses />}
      {(niche === "hiking" || niche === "trekking" || niche === "nature") && <BangkokHikingDayTrips />}
      {niche === "yoga" && <BangkokYogaStudios />}
      {niche === "tattoo" && <BangkokTattooStudios />}
      {(niche === "boxing-class" || niche === "muay-thai-class") && <BangkokThaiBoxingClass />}
      {niche === "beauty" && <BangkokHairSalon />}
      {(niche === "cocktails" || niche === "bar-hopping") && <BangkokCocktailBars />}
      {(niche === "photography" || niche === "street-photography") && <BangkokPhotographySpots />}
      {(niche === "lgbt" || niche === "lgbtq") && <BangkokLGBTGuide />}
      {niche === "solo" && <BangkokSoloTravelGuide />}
      {(niche === "island" || niche === "island-hopping") && <BangkokIslandHopping />}
      {(niche === "eco" || niche === "sustainable") && <BangkokEcoTourism />}
      {niche === "birdwatching" && <BangkokBirdwatching />}
      {(niche === "expat" || niche === "living") && <BangkokExpatsGuide />}
      {(niche === "language" || niche === "language-class" || niche === "study") && <BangkokLanguageClasses />}
      {niche === "karaoke" && <BangkokKaraokeGuide />}
      {(niche === "pool" || niche === "swimming" || niche === "hotel-pool") && <BangkokRooftopPoolHotels />}
      {(niche === "massage" || niche === "traditional-massage") && <BangkokMassagePriceGuide />}
      {(niche === "sak-yant" || niche === "sacred-tattoo") && <BangkokSakYantGuide />}
      {(niche === "reading" || niche === "bookstore") && <BangkokBookstores />}
      {(niche === "pet-cafe" || niche === "cat-cafe") && <BangkokPetCafes />}
      {(niche === "apartment" || niche === "rent" || niche === "relocation") && <BangkokApartmentAreas />}
      {(niche === "sky-bar" || niche === "sunset-bar") && <BangkokSkyBarGuide />}
      {(niche === "muay-thai-watch" || niche === "stadium") && <BangkokMuayThaiWatch />}
      {(niche === "street-art" || niche === "murals") && <BangkokStreetArt />}
      {(niche === "vintage" || niche === "vintage-shopping") && <BangkokVintageShops />}
      {(niche === "climbing" || niche === "bouldering") && <BangkokClimbingGyms />}
      {(niche === "craft-beer" || niche === "beer") && <BangkokCraftBeer />}
      {(niche === "temple-hopping" || niche === "temples") && <BangkokTempleHopping />}
      {(niche === "cinema" || niche === "movie") && <BangkokCinemaGuide />}
      {(niche === "tattoo" || niche === "tattoo-shop") && <BangkokTattooParlors />}
      {(niche === "gym" || niche === "fitness") && <BangkokGymFitness />}
      {(niche === "swimming" || niche === "public-pool") && <BangkokSwimmingPools />}
      {(niche === "dental" || niche === "dental-tourism") && <BangkokDentalGuide />}
      {(niche === "elephant" || niche === "elephant-sanctuary") && <BangkokElephantSanctuaries />}
      {(niche === "nightclub" || niche === "clubbing") && <BangkokNightClubs />}
      {(niche === "water-sports" || niche === "kayaking") && <BangkokWaterActivities />}
      {(niche === "art-toys" || niche === "blind-box" || niche === "labubu") && <BangkokArtToys />}
      {(niche === "coffee" || niche === "latte-art") && <BangkokLatteArtCafes />}
      {(niche === "art" || niche === "galleries") && <BangkokPublicArtGuide />}
      {(niche === "board-game" || niche === "gaming-cafe") && <BangkokBoardGameCafes />}
      {(niche === "cycling" || niche === "bicycle") && <BangkokBicycleRentals />}
      {(niche === "massage-course" || niche === "learn-massage") && <BangkokThaiMassageLearn />}
      {(niche === "viewpoint" || niche === "observation-deck") && <BangkokBestViewpoints />}
      {(niche === "weekend-getaway" || niche === "day-trip-extended") && <BangkokWeekendGetaways />}
      {(niche === "budget" || niche === "backpacker") && <BangkokBudgetTravel />}
      {(niche === "walking-tour" || niche === "self-guided") && <BangkokWalkingTours />}
      {(niche === "escape-room" || niche === "puzzle") && <BangkokEscapeRooms />}
      {(niche === "comedy" || niche === "comedy-show") && <BangkokComedyShows />}
      {(niche === "poker" || niche === "card-games") && <BangkokPokerGuide />}
      {(niche === "scuba" || niche === "diving") && <BangkokScubaDiving />}
      {(niche === "park" || niche === "nature" || niche === "jogging") && <BangkokParksGardens />}
      {(niche === "live-music" || niche === "jazz") && <BangkokLiveMusic />}
      {(niche === "adventure" || niche === "zipline" || niche === "extreme-sports") && <BangkokAdventureActivities />}
      {(niche === "pottery" || niche === "ceramics") && <BangkokPotteryClasses />}
      {(niche === "dance" || niche === "salsa" || niche === "kpop-dance") && <BangkokDanceLessons />}
      {(niche === "boxing" || niche === "muay-thai-training") && <BangkokBoxingGyms />}
      {(niche === "onsen" || niche === "spa" || niche === "wellness") && <BangkokOnsenSpa />}
      {(niche === "gaming" || niche === "esports" || niche === "vr") && <BangkokGamingCafes />}
      {(niche === "archery" || niche === "shooting" || niche === "target-sport") && <BangkokArchery />}
      {(niche === "film-photography" || niche === "analog" || niche === "photography") && <BangkokFilmPhotography />}
      {(niche === "surfing" || niche === "watersports" || niche === "beach") && <BangkokSurfingGuide />}
      {(niche === "volunteer" || niche === "community-service" || niche === "csr") && <BangkokVolunteer />}
      {(niche === "canal-tour" || niche === "klong" || niche === "boat-tour") && <BangkokKlongTour />}
      {(niche === "cabaret" || niche === "show" || niche === "performance") && <BangkokCabaret />}
      {(niche === "henna" || niche === "body-art") && <BangkokHennaTattoo />}
      {(niche === "silent-disco" || niche === "rave" || niche === "club") && <BangkokSilentDisco />}
      {(niche === "crafts" || niche === "workshop" || niche === "diy") && <BangkokCraftsWorkshops />}
      {niche === "spa" && <SpaGuide />}
      {niche === "yoga-pilates" && <YogaGuide />}
      {niche === "diving" && <DivingGuide />}
      <KlookBanner variant={
        niche === "muay-thai" ? "muay-thai" :
        niche === "cooking" ? "cooking" :
        niche === "spa" ? "spa" :
        niche === "diving" ? "diving" :
        niche === "yoga-pilates" ? "yoga" :
        "general"
      } />
      <RatingLegend />

      {/* Daily Challenge */}
      <BangkokChallenge />

      {/* Daily Tip */}
      <BangkokTip />

      {/* Niche VersusVote */}
      {niche === "muay-thai" && (
        <div className="mt-8 mb-4">
          <VersusVote
            question="Muay Thai in Bangkok — what style?"
            a={{ id: "tourist-class", label: "Tourist-friendly gym", emoji: "🥊", desc: "Beginner sessions, English coaching, pad work", url: `/activities/${niche}` }}
            b={{ id: "authentic-gym", label: "Authentic Thai gym", emoji: "🏟️", desc: "Real Muay Thai training alongside Thai fighters", url: `/activities/${niche}/top-10` }}
          />
        </div>
      )}
      {niche === "spa" && (
        <div className="mt-8 mb-4">
          <VersusVote
            question="Bangkok massage — what's your pick?"
            a={{ id: "traditional", label: "Traditional Thai massage", emoji: "💆", desc: "Deep tissue, pressure points — the real Bangkok experience", url: `/activities/${niche}` }}
            b={{ id: "luxury-spa", label: "Luxury spa treatment", emoji: "🌸", desc: "Aromatherapy, couples rooms, hotel-grade experience", url: `/activities/${niche}/top-10` }}
          />
        </div>
      )}
      {niche === "cooking" && (
        <div className="mt-8 mb-4">
          <VersusVote
            question="Thai cooking class — which matters more?"
            a={{ id: "market-tour", label: "Includes market tour", emoji: "🥬", desc: "Buy ingredients at a local market first — the full experience", url: `/activities/${niche}` }}
            b={{ id: "dishes-variety", label: "Most dishes to cook", emoji: "🍜", desc: "Learn 5+ dishes — pad thai, curry, spring rolls & more", url: `/activities/${niche}/top-10` }}
          />
        </div>
      )}
      {(niche === "yoga-pilates" || niche === "wellness") && (
        <div className="mt-8 mb-4">
          <VersusVote
            question="Morning session in Bangkok — what's your vibe?"
            a={{ id: "yoga", label: "Yoga / Pilates class", emoji: "🧘", desc: "Mindful movement, flexibility, breathwork", url: "/activities/yoga-pilates" }}
            b={{ id: "muay-thai-morning", label: "Muay Thai training", emoji: "🥊", desc: "High-intensity, full body, uniquely Bangkok", url: "/activities/muay-thai" }}
          />
        </div>
      )}

      {/* Quiz + Bingo CTAs */}
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <a href="/quiz" className="block p-5 rounded-2xl bg-orange-50 border border-orange-200 hover:shadow-md hover:border-orange-300 transition group">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-black group-hover:text-orange-700 transition">Find your Bangkok type</div>
          <div className="text-sm text-[var(--muted)] mt-1">5-question quiz → personalized picks from real review data</div>
        </a>
        <a href="/bingo" className="block p-5 rounded-2xl bg-green-50 border border-green-200 hover:shadow-md hover:border-green-300 transition group">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-black group-hover:text-green-700 transition">Bangkok Bucket List</div>
          <div className="text-sm text-[var(--muted)] mt-1">Tick what you&apos;ve done — share your score</div>
        </a>
      </div>

      {/* Structured data */}
      <NicheItemListJsonLd
        name={`Best ${info.label} in Bangkok 2026`}
        items={top.slice(0, 20).map((p) => ({
          name: p.name,
          slug: p.slug,
          niche: niche,
          rating: p.rating,
          review_count: p.review_count,
          address: p.address,
        }))}
        url={`/activities/${niche}`}
      />
      <FaqJsonLd faqs={NICHE_FAQS[niche as NicheSlug] ?? []} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: info.label, url: `/activities/${niche}` },
      ]} />
      <TouristAttractionJsonLd
        name={`Best ${info.label} in Bangkok 2026`}
        description={NICHE_INTRO[niche as NicheSlug]?.sub ?? `${db.total} ${info.label.toLowerCase()} venues ranked by real Google reviews.`}
        url={`/activities/${niche}`}
        items={top.slice(0, 10).map((p) => ({
          name: p.name,
          url: `/activities/${niche}/${p.slug}`,
          rating: p.rating,
          reviewCount: p.review_count,
          address: p.address,
        }))}
      />
      <ActivityServiceJsonLd
        name={`${info.label} in Bangkok`}
        description={NICHE_INTRO[niche as NicheSlug]?.sub ?? `${db.total} ${info.label.toLowerCase()} venues in Bangkok.`}
        url={`/activities/${niche}`}
        category={info.label}
        rating={top.length > 0 && top[0].rating ? top[0].rating : undefined}
        reviewCount={top.reduce((s, p) => s + (p.review_count ?? 0), 0)}
      />
      <SpeakableJsonLd
        url={`/activities/${niche}`}
        cssSelectors={["h1", "h2"]}
      />
    </div>
  );
}
