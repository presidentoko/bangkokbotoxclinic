import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NICHES,
  loadNicheDb,
  loadCommunityDb,
  topNichePlaces,
  qualifyingNichePlaces,
  buildKlookIndex,
  cityScopeLabel,
  nicheCityCounts,
} from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { nicheAreaCounts } from "@/lib/areas";
import { NicheGrid } from "@/components/NicheGrid";
import { toGridPlace, toGridKlook } from "@/lib/gridPlace";
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
import { BangkokSportsWatching } from "@/components/BangkokSportsWatching";
import { BangkokFleaMarkets } from "@/components/BangkokFleaMarkets";
import { BangkokAntiques } from "@/components/BangkokAntiques";
import { BangkokChristmasNewYear } from "@/components/BangkokChristmasNewYear";
import { BangkokSongkran } from "@/components/BangkokSongkran";
import { BangkokLoyKrathong } from "@/components/BangkokLoyKrathong";
import { BangkokSpiritualTours } from "@/components/BangkokSpiritualTours";
import { BangkokWaterParks } from "@/components/BangkokWaterParks";
import { BangkokHotAirBalloon } from "@/components/BangkokHotAirBalloon";
import { BangkokMuayThaiGym } from "@/components/BangkokMuayThaiGym";
import { BangkokFitnessClasses } from "@/components/BangkokFitnessClasses";
import { BangkokCookingClass } from "@/components/BangkokCookingClass";
import { BangkokGardenCafe } from "@/components/BangkokGardenCafe";
import { BangkokKarting } from "@/components/BangkokKarting";
import { BangkokBowling } from "@/components/BangkokBowling";
import { BangkokSkateParks } from "@/components/BangkokSkateParks";
import { BangkokBirding } from "@/components/BangkokBirding";
import { BangkokCanoeing } from "@/components/BangkokCanoeing";
import { BangkokJazzBars } from "@/components/BangkokJazzBars";
import { BangkokPetFriendly } from "@/components/BangkokPetFriendly";
import { BangkokTheatre } from "@/components/BangkokTheatre";
import { BangkokArchitecture } from "@/components/BangkokArchitecture";
import { BangkokKpop } from "@/components/BangkokKpop";
import { BangkokMorningRun } from "@/components/BangkokMorningRun";
import { BangkokSauna } from "@/components/BangkokSauna";
import { BangkokPicnic } from "@/components/BangkokPicnic";
import { BangkokBarHopping } from "@/components/BangkokBarHopping";
import { BangkokCulturalTours } from "@/components/BangkokCulturalTours";
import { BangkokSkydiving } from "@/components/BangkokSkydiving";
import { BangkokBungeeJumping } from "@/components/BangkokBungeeJumping";
import { BangkokConcerts } from "@/components/BangkokConcerts";
import { BangkokMindfulness } from "@/components/BangkokMindfulness";
import { BangkokTennis } from "@/components/BangkokTennis";
import { BangkokBadminton } from "@/components/BangkokBadminton";
import { BangkokBilliards } from "@/components/BangkokBilliards";
import { BangkokCrossFit } from "@/components/BangkokCrossFit";
import { BangkokSoccer } from "@/components/BangkokSoccer";
import { BangkokBasketball } from "@/components/BangkokBasketball";
import { BangkokVolleyball } from "@/components/BangkokVolleyball";
import { BangkokTableTennis } from "@/components/BangkokTableTennis";
import { BangkokMartialArts } from "@/components/BangkokMartialArts";
import { BangkokRugby } from "@/components/BangkokRugby";
import { BangkokCricket } from "@/components/BangkokCricket";
import { BangkokInlineSkating } from "@/components/BangkokInlineSkating";
import { BangkokSwimmingLessons } from "@/components/BangkokSwimmingLessons";
import { BangkokTriathlon } from "@/components/BangkokTriathlon";
import { BangkokMotorSport } from "@/components/BangkokMotorSport";
import { BangkokCyclingClub } from "@/components/BangkokCyclingClub";
import { BangkokHashRun } from "@/components/BangkokHashRun";
import { BangkokWeightlifting } from "@/components/BangkokWeightlifting";
import { BangkokSquash } from "@/components/BangkokSquash";
import { BangkokFencing } from "@/components/BangkokFencing";
import { BangkokGymnastics } from "@/components/BangkokGymnastics";
import { BangkokArcade } from "@/components/BangkokArcade";
import { BangkokBoardGames } from "@/components/BangkokBoardGames";
import { BangkokWineClass } from "@/components/BangkokWineClass";
import { BangkokCoffeeCupping } from "@/components/BangkokCoffeeCupping";
import { BangkokCeramicsWorkshop } from "@/components/BangkokCeramicsWorkshop";
import { BangkokCalligraphy } from "@/components/BangkokCalligraphy";
import { BangkokFlowerArranging } from "@/components/BangkokFlowerArranging";
import { BangkokAstrology } from "@/components/BangkokAstrology";
import { BangkokSoundHealing } from "@/components/BangkokSoundHealing";
import { BangkokReikiHealing } from "@/components/BangkokReikiHealing";
import { BangkokOsteopath } from "@/components/BangkokOsteopath";
import { BangkokFloatTank } from "@/components/BangkokFloatTank";
import { BangkokPhotoTour } from "@/components/BangkokPhotoTour";
import { BangkokNightPhotography } from "@/components/BangkokNightPhotography";
import { BangkokKiteSurf } from "@/components/BangkokKiteSurf";
import { BangkokWindsurfing } from "@/components/BangkokWindsurfing";
import { BangkokSailing } from "@/components/BangkokSailing";
import { BangkokMosaicWorkshop } from "@/components/BangkokMosaicWorkshop";
import { BangkokArtGallery } from "@/components/BangkokArtGallery";
import { BangkokHorseRiding } from "@/components/BangkokHorseRiding";
import { BangkokRockClimbing } from "@/components/BangkokRockClimbing";
import { BangkokKnitting } from "@/components/BangkokKnitting";
import { BangkokSewingClass } from "@/components/BangkokSewingClass";
import { BangkokDragonBoat } from "@/components/BangkokDragonBoat";
import { BangkokZipline } from "@/components/BangkokZipline";
import { BangkokWaterPolo } from "@/components/BangkokWaterPolo";
import { BangkokBeachVolleyball } from "@/components/BangkokBeachVolleyball";
import { BangkokShishaLounge } from "@/components/BangkokShishaLounge";
import { BangkokPickleball } from "@/components/BangkokPickleball";
import { BangkokKorfball } from "@/components/BangkokKorfball";
import { BangkokCoWorking } from "@/components/BangkokCoWorking";
import { BangkokMuralArt } from "@/components/BangkokMuralArt";
import { BangkokBonsai } from "@/components/BangkokBonsai";
import { BangkokWrestling } from "@/components/BangkokWrestling";
import { BangkokParagliding } from "@/components/BangkokParagliding";
import { BangkokAquarium } from "@/components/BangkokAquarium";
import { BangkokTaiChi } from "@/components/BangkokTaiChi";
import { BangkokKendo } from "@/components/BangkokKendo";
import { BangkokBreakdance } from "@/components/BangkokBreakdance";
import { BangkokZumba } from "@/components/BangkokZumba";
import { BangkokPoleDance } from "@/components/BangkokPoleDance";
import { BangkokFitnessBootcamp } from "@/components/BangkokFitnessBootcamp";
import { BangkokFishing } from "@/components/BangkokFishing";
import { BangkokSpeedboat } from "@/components/BangkokSpeedboat";
import { BangkokPaintball } from "@/components/BangkokPaintball";
import { BangkokRoboticsClub } from "@/components/BangkokRoboticsClub";
import { BangkokPhilosophyClub } from "@/components/BangkokPhilosophyClub";
import { BangkokOrchidGarden } from "@/components/BangkokOrchidGarden";
import { BangkokFashionWeek } from "@/components/BangkokFashionWeek";
import { BangkokMuayThaiAmateur } from "@/components/BangkokMuayThaiAmateur";
import { BangkokSupercar } from "@/components/BangkokSupercar";
import { BangkokHeritage } from "@/components/BangkokHeritage";
import { BangkokLuxurySpa } from "@/components/BangkokLuxurySpa";
import { BangkokPride } from "@/components/BangkokPride";
import { BangkokNetball } from "@/components/BangkokNetball";
import { BangkokMusicProduction } from "@/components/BangkokMusicProduction";
import { BangkokOilPainting } from "@/components/BangkokOilPainting";
import { BangkokChessClub } from "@/components/BangkokChessClub";
import { BangkokHomeDecor } from "@/components/BangkokHomeDecor";
import { BangkokStationery } from "@/components/BangkokStationery";
import { BangkokEsports } from "@/components/BangkokEsports";
import { BangkokCookingSchool } from "@/components/BangkokCookingSchool";
import { BangkokUrbanFarming } from "@/components/BangkokUrbanFarming";
import { BangkokPilates } from "@/components/BangkokPilates";
import { BangkokFreeRunning } from "@/components/BangkokFreeRunning";
import { BangkokGraffitiArt } from "@/components/BangkokGraffitiArt";
import { BangkokKiteboarding } from "@/components/BangkokKiteboarding";
import { BangkokCalisthenics } from "@/components/BangkokCalisthenics";
import { BangkokImprov } from "@/components/BangkokImprov";
import { BangkokKaraoke } from "@/components/BangkokKaraoke";
import { BangkokRafting } from "@/components/BangkokRafting";
import { BangkokAcupuncture } from "@/components/BangkokAcupuncture";
import { BangkokStargazing } from "@/components/BangkokStargazing";
import { BangkokPodcast } from "@/components/BangkokPodcast";
import { BangkokSculpture } from "@/components/BangkokSculpture";
import { BangkokJiuJitsu } from "@/components/BangkokJiuJitsu";
import { BangkokBodywork } from "@/components/BangkokBodywork";
import { BangkokPoloClub } from "@/components/BangkokPoloClub";
import { BangkokFootball } from "@/components/BangkokFootball";
import { BangkokHockey } from "@/components/BangkokHockey";
import { BangkokTaekwondo } from "@/components/BangkokTaekwondo";
import { BangkokCoding } from "@/components/BangkokCoding";
import { BangkokAnime } from "@/components/BangkokAnime";
import { BangkokMagic } from "@/components/BangkokMagic";
import { BangkokWhiskey } from "@/components/BangkokWhiskey";
import { BangkokPlantCulture } from "@/components/BangkokPlantCulture";
import { BangkokBeauty } from "@/components/BangkokBeauty";
import { BangkokCustomTailoring } from "@/components/BangkokCustomTailoring";
import { BangkokArtMarket } from "@/components/BangkokArtMarket";
import { BangkokClassicalMusic } from "@/components/BangkokClassicalMusic";
import { BangkokLatinDance } from "@/components/BangkokLatinDance";
import { BangkokHipHop } from "@/components/BangkokHipHop";
import { BangkokThriftShop } from "@/components/BangkokThriftShop";
import { BangkokJewelry } from "@/components/BangkokJewelry";
import { BangkokTechShopping } from "@/components/BangkokTechShopping";
import { BangkokNatureEscape } from "@/components/BangkokNatureEscape";
import { BangkokCoastalDayTrip } from "@/components/BangkokCoastalDayTrip";
import { BangkokMotorcycleRiding } from "@/components/BangkokMotorcycleRiding";
import { BangkokRunning } from "@/components/BangkokRunning";
import { BangkokPaddle } from "@/components/BangkokPaddle";
import { BangkokCombatSports } from "@/components/BangkokCombatSports";
import { BangkokSkateboarding } from "@/components/BangkokSkateboarding";
import { BangkokBouldering } from "@/components/BangkokBouldering";
import { BangkokGhostTour } from "@/components/BangkokGhostTour";
import { BangkokSpecialtyCoffee } from "@/components/BangkokSpecialtyCoffee";
import { BangkokBarbers } from "@/components/BangkokBarbers";
import { BangkokPiercing } from "@/components/BangkokPiercing";
import { BangkokVR } from "@/components/BangkokVR";
import { BangkokAirsoft } from "@/components/BangkokAirsoft";
import { BangkokGolfSimulator } from "@/components/BangkokGolfSimulator";
import { BangkokPadel } from "@/components/BangkokPadel";
import { BangkokHerping } from "@/components/BangkokHerping";
import { BangkokAstronomy } from "@/components/BangkokAstronomy";
import { BangkokFilmmaking } from "@/components/BangkokFilmmaking";
import { BangkokPodcasting } from "@/components/BangkokPodcasting";
import { BangkokMixology } from "@/components/BangkokMixology";
import { BangkokWhisky } from "@/components/BangkokWhisky";
import { BangkokAerialSports } from "@/components/BangkokAerialSports";
import { BangkokMotocross } from "@/components/BangkokMotocross";
import { BangkokWakeboard } from "@/components/BangkokWakeboard";
import { BangkokAcrobatics } from "@/components/BangkokAcrobatics";
import { BangkokKrabiKrabong } from "@/components/BangkokKrabiKrabong";
import { BangkokSalsaDance } from "@/components/BangkokSalsaDance";
import { BangkokHiking } from "@/components/BangkokHiking";
import { BangkokMTB } from "@/components/BangkokMTB";
import { BangkokGrappling } from "@/components/BangkokGrappling";
import { BangkokBallet } from "@/components/BangkokBallet";

export const dynamic = "force-static";
export const dynamicParams = false;
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
  // db.total is the raw scraped count — for niches like spa where most
  // records have no rating/price/review/photo at all, that count is far
  // higher than the number of pages that actually get built (qualifying
  // count), so a "2000 Ranked" title claim above 58 real pages is a false
  // freshness/inventory claim, not just an off-by-a-little rounding.
  const qualifying = qualifyingNichePlaces(niche, db.places);
  const rankedCount = qualifying.length;
  // Scope has to be read off the same set the count describes. Reading it off
  // `.slice(0, 60)` produced "Best Spa & Massage in Bangkok 2026 — 2251
  // Ranked": the 60 highest Trust Scores are 60%+ Bangkok, but the 2,251
  // venues the page actually lists are only 51% Bangkok, so the title claimed
  // a city the page does not deliver. It also put the hub in Google's way for
  // "spa bangkok" (709 impressions, avg. position 50) — a query that should
  // land on /activities/spa/city/bangkok, which is a genuinely Bangkok-only
  // page and currently sits at position 87 behind its own parent.
  const scope = cityScopeLabel(qualifying);
  return {
    title: `Best ${info.label} in ${scope} 2026 — ${rankedCount} Ranked by Real Reviews`,
    description: `Find the best ${info.label.toLowerCase()} in ${scope} in 2026. ${rankedCount} venues ranked by Trust Score from real Google reviews — prices, tips, and Klook booking. No paid picks.`,
    alternates: { canonical: `/activities/${niche}` },
    openGraph: {
      title: `Best ${info.label} in ${scope} 2026 — Data-Driven Rankings`,
      description: `${rankedCount} ${info.label.toLowerCase()} venues ranked by Trust Score from verified Google reviews. ${intro?.sub ?? "No paid picks."}`,
    },
    twitter: {
      title: `Best ${info.label} in ${scope} 2026`,
      description: `${rankedCount} venues ranked by real Google reviews — no influencer picks, no paid placements.`,
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

  // MUST stay in sync with generateStaticParams() in [niche]/[slug] — every
  // card below links to a detail page, so ranking off the ungated
  // topNichePlaces() emitted 58 dead /activities/spa/* links on this page.
  const qualifying = qualifyingNichePlaces(niche, db.places);
  const top = qualifying.slice(0, 60);
  // Off the full set, not `top` — the H1, the Top-10 link and the JSON-LD all
  // read this, and they have to name the same place the <title> does. See the
  // note in generateMetadata.
  const scope = cityScopeLabel(qualifying);
  const klookMap = await buildKlookIndex(top.map((p) => p.id));
  const cityLinks = nicheCityCounts(niche, db.places);
  // Bangkok areas sit a level below the city split. They carry the bulk of the
  // impressions this niche already earns ("wellness spa sukhumvit" alone drew
  // 667 in three months) and they are the shorter path to the ~850 venue pages
  // that otherwise hang off /all alone.
  const areaLinks = nicheAreaCounts(niche, db.places);
  // See generateMetadata above — db.total is the raw scraped count and can
  // wildly overstate how many pages actually exist for thin-data niches.
  const rankedCount = qualifying.length;
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
                Best {NICHE_INTRO[niche as NicheSlug]?.subject ?? info.label} in {scope}
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                {rankedCount.toLocaleString()} venues · {NICHE_INTRO[niche as NicheSlug]?.sub ?? "ranked by real reviews"}
              </p>
            </div>
          </div>
          <ShareButton
            title={`Best ${info.label} in ${scope}`}
            text={`${rankedCount} venues ranked by real Google reviews — no paid picks`}
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
          See our Top 10 {info.label} in {scope} →
        </a>
      </div>

      {/* Browse by city — niche×city landing pages for city-qualified
          search intent ("cooking class chiang mai") the Thailand-wide
          page above doesn't target directly. */}
      {cityLinks.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Browse by city:</span>
          {cityLinks.map((c) => (
            <a
              key={c.slug}
              href={`/activities/${niche}/city/${c.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-sm font-medium hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              {c.city}
              <span className="text-[var(--muted)] tabular-nums text-xs">{c.count}</span>
            </a>
          ))}
        </div>
      )}

      {/* Browse by Bangkok area — the level below city. */}
      {areaLinks.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Browse by Bangkok area:</span>
          {areaLinks.map(({ area, count }) => (
            <a
              key={area.slug}
              href={`/activities/${niche}/area/${area.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-sm font-medium hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              {area.label}
              <span className="text-[var(--muted)] tabular-nums text-xs">{count}</span>
            </a>
          ))}
        </div>
      )}

      {/* "boutique spa bangkok" + "boutique spa and wellness bangkok" pulled
          828 impressions / 0 clicks over three months with nothing to land
          on. This is the one link into that page from anywhere on the spa
          tree. */}
      {niche === "spa" && (
        <div className="mb-6 flex flex-wrap gap-2">
          <a
            href="/activities/spa/boutique"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-300 bg-orange-50 text-orange-800 text-sm font-bold hover:bg-orange-100 transition"
          >
            💆 Boutique spas only (4.7★+, independent)
          </a>
          <a
            href="/activities/spa/rating-report"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm font-bold hover:border-orange-400 transition"
          >
            📊 Rating report — why 4.5★ stopped meaning anything
          </a>
        </div>
      )}

      {/* The grid below is capped at 60, but every qualifying venue has a
          detail page in sitemap.xml — without this link the tail (899 pages
          site-wide) has no inbound link at all and stalls in Search Console
          as "Discovered - currently not indexed". */}
      <div className="mb-6">
        <a
          href={`/activities/${niche}/all`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:underline"
        >
          See the full A–Z list of all {rankedCount.toLocaleString()} {info.label.toLowerCase()} venues →
        </a>
      </div>

      <NicheGrid
        places={top.map(toGridPlace)}
        klookData={toGridKlook([...klookMap.entries()])}
        nicheSlug={niche}
        nicheIcon={info.icon}
        planType={planType}
        PRICE_BAND_LABELS={PRICE_BAND_LABELS}
      />

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
      {niche === "yoga-pilates" && <BangkokYogaStudios />}
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
      {(niche === "spectator-sport" || niche === "watch-sport" || niche === "football") && <BangkokSportsWatching />}
      {(niche === "flea-market" || niche === "vintage" || niche === "antique") && <BangkokFleaMarkets />}
      {(niche === "antique" || niche === "collectibles" || niche === "art") && <BangkokAntiques />}
      {(niche === "new-year" || niche === "christmas" || niche === "countdown") && <BangkokChristmasNewYear />}
      {(niche === "songkran" || niche === "water-festival" || niche === "thai-new-year") && <BangkokSongkran />}
      {(niche === "loy-krathong" || niche === "festival" || niche === "lantern") && <BangkokLoyKrathong />}
      {(niche === "spiritual" || niche === "temple" || niche === "meditation") && <BangkokSpiritualTours />}
      {(niche === "water-park" || niche === "swimming" || niche === "family") && <BangkokWaterParks />}
      {(niche === "hot-air-balloon" || niche === "balloon" || niche === "aerial") && <BangkokHotAirBalloon />}
      {(niche === "muay-thai-training" || niche === "boxing-training" || niche === "martial-arts") && <BangkokMuayThaiGym />}
      {(niche === "zumba" || niche === "dance-fitness" || niche === "fitness-class") && <BangkokFitnessClasses />}
      {(niche === "cooking-class" || niche === "culinary" || niche === "food-experience") && <BangkokCookingClass />}
      {(niche === "cafe-hopping" || niche === "garden-cafe" || niche === "cafe") && <BangkokGardenCafe />}
      {(niche === "karting" || niche === "go-kart" || niche === "racing") && <BangkokKarting />}
      {(niche === "bowling" || niche === "glow-bowling" || niche === "indoor-sport") && <BangkokBowling />}
      {(niche === "skateboarding" || niche === "skating" || niche === "bmx") && <BangkokSkateParks />}
      {(niche === "birdwatching" || niche === "birding" || niche === "wildlife") && <BangkokBirding />}
      {(niche === "kayaking" || niche === "canoeing" || niche === "paddle") && <BangkokCanoeing />}
      {(niche === "jazz" || niche === "live-music-bar" || niche === "blues") && <BangkokJazzBars />}
      {(niche === "pet-friendly" || niche === "dog-walking" || niche === "cat-cafe") && <BangkokPetFriendly />}
      {(niche === "theatre" || niche === "theater" || niche === "traditional-dance") && <BangkokTheatre />}
      {(niche === "architecture" || niche === "design" || niche === "heritage") && <BangkokArchitecture />}
      {(niche === "k-pop" || niche === "kpop" || niche === "korean-pop") && <BangkokKpop />}
      {(niche === "running" || niche === "jogging" || niche === "marathon") && <BangkokMorningRun />}
      {(niche === "sauna" || niche === "steam-room" || niche === "wellness") && <BangkokSauna />}
      {(niche === "picnic" || niche === "park" || niche === "outdoor-leisure") && <BangkokPicnic />}
      {(niche === "bar-hopping" || niche === "nightlife-crawl" || niche === "drinks-crawl") && <BangkokBarHopping />}
      {(niche === "cultural-tour" || niche === "heritage-walk" || niche === "history-tour") && <BangkokCulturalTours />}
      {(niche === "skydiving" || niche === "paragliding" || niche === "indoor-skydiving") && <BangkokSkydiving />}
      {(niche === "bungee" || niche === "bungee-jumping" || niche === "extreme-sport") && <BangkokBungeeJumping />}
      {(niche === "concert" || niche === "music-event" || niche === "live-event") && <BangkokConcerts />}
      {(niche === "mindfulness" || niche === "vipassana" || niche === "retreat") && <BangkokMindfulness />}
      {(niche === "tennis" || niche === "tennis-court" || niche === "racket-sport") && <BangkokTennis />}
      {(niche === "badminton" || niche === "badminton-court" || niche === "shuttlecock") && <BangkokBadminton />}
      {(niche === "billiards" || niche === "snooker" || niche === "pool-table") && <BangkokBilliards />}
      {(niche === "crossfit" || niche === "functional-fitness" || niche === "hiit-gym") && <BangkokCrossFit />}
      {(niche === "football" || niche === "soccer" || niche === "futsal") && <BangkokSoccer />}
      {(niche === "basketball" || niche === "pickup-basketball" || niche === "nba") && <BangkokBasketball />}
      {(niche === "volleyball" || niche === "beach-volleyball" || niche === "sand-volleyball") && <BangkokVolleyball />}
      {(niche === "table-tennis" || niche === "ping-pong" || niche === "table-sport") && <BangkokTableTennis />}
      {(niche === "bjj" || niche === "wrestling" || niche === "mma") && <BangkokMartialArts />}
      {(niche === "rugby" || niche === "rugby-union" || niche === "touch-rugby") && <BangkokRugby />}
      {(niche === "cricket" || niche === "cricket-club" || niche === "t20") && <BangkokCricket />}
      {(niche === "inline-skating" || niche === "rollerblade" || niche === "skating-rink") && <BangkokInlineSkating />}
      {(niche === "swimming-lesson" || niche === "learn-to-swim" || niche === "swim-class") && <BangkokSwimmingLessons />}
      {(niche === "triathlon" || niche === "ironman" || niche === "duathlon") && <BangkokTriathlon />}
      {(niche === "motorsport" || niche === "motogp" || niche === "circuit-racing") && <BangkokMotorSport />}
      {(niche === "cycling-club" || niche === "road-cycling" || niche === "cycling-group") && <BangkokCyclingClub />}
      {(niche === "hash-run" || niche === "hash-house-harriers" || niche === "social-running") && <BangkokHashRun />}
      {(niche === "weightlifting" || niche === "powerlifting" || niche === "strength-training") && <BangkokWeightlifting />}
      {(niche === "squash" || niche === "squash-court" || niche === "racquetball") && <BangkokSquash />}
      {(niche === "fencing" || niche === "sword-fighting" || niche === "saber") && <BangkokFencing />}
      {(niche === "gymnastics" || niche === "acrobatics" || niche === "trampoline") && <BangkokGymnastics />}
      {(niche === "arcade" || niche === "gaming-center" || niche === "video-games") && <BangkokArcade />}
      {(niche === "board-games" || niche === "tabletop" || niche === "game-cafe") && <BangkokBoardGames />}
      {(niche === "wine-tasting" || niche === "wine-class" || niche === "wset") && <BangkokWineClass />}
      {(niche === "coffee-cupping" || niche === "specialty-coffee" || niche === "coffee-class") && <BangkokCoffeeCupping />}
      {(niche === "ceramics" || niche === "wheel-throwing" || niche === "pottery-class") && <BangkokCeramicsWorkshop />}
      {(niche === "calligraphy" || niche === "brush-lettering" || niche === "hand-lettering") && <BangkokCalligraphy />}
      {(niche === "flower-arranging" || niche === "ikebana" || niche === "floral-workshop") && <BangkokFlowerArranging />}
      {(niche === "astrology" || niche === "fortune-telling" || niche === "tarot") && <BangkokAstrology />}
      {(niche === "sound-healing" || niche === "singing-bowls" || niche === "sound-bath") && <BangkokSoundHealing />}
      {(niche === "reiki" || niche === "energy-healing" || niche === "holistic-healing") && <BangkokReikiHealing />}
      {(niche === "osteopath" || niche === "physiotherapy" || niche === "chiropractic") && <BangkokOsteopath />}
      {(niche === "float-tank" || niche === "sensory-deprivation" || niche === "flotation") && <BangkokFloatTank />}
      {(niche === "photo-tour" || niche === "photography-walk" || niche === "street-photography") && <BangkokPhotoTour />}
      {(niche === "night-photography" || niche === "nightscape" || niche === "cityscape") && <BangkokNightPhotography />}
      {(niche === "kite-surfing" || niche === "kiteboarding" || niche === "wing-foil") && <BangkokKiteSurf />}
      {(niche === "windsurfing" || niche === "sup" || niche === "paddleboard") && <BangkokWindsurfing />}
      {(niche === "sailing" || niche === "yacht" || niche === "yacht-charter") && <BangkokSailing />}
      {(niche === "mosaic" || niche === "mosaic-art" || niche === "macrame") && <BangkokMosaicWorkshop />}
      {(niche === "art-gallery" || niche === "contemporary-art" || niche === "art-museum") && <BangkokArtGallery />}
      {(niche === "horse-riding" || niche === "equestrian" || niche === "horse-racing") && <BangkokHorseRiding />}
      {(niche === "rock-climbing" || niche === "bouldering" || niche === "indoor-climbing") && <BangkokRockClimbing />}
      {(niche === "knitting" || niche === "crochet" || niche === "amigurumi") && <BangkokKnitting />}
      {(niche === "sewing" || niche === "tailoring" || niche === "dressmaking") && <BangkokSewingClass />}
      {(niche === "dragon-boat" || niche === "rowing" || niche === "kayaking") && <BangkokDragonBoat />}
      {(niche === "zipline" || niche === "ziplining" || niche === "canopy-walk") && <BangkokZipline />}
      {(niche === "water-polo" || niche === "swim-club" || niche === "competitive-swimming") && <BangkokWaterPolo />}
      {(niche === "beach-volleyball" || niche === "padel" || niche === "sand-volleyball") && <BangkokBeachVolleyball />}
      {(niche === "shisha" || niche === "hookah" || niche === "shisha-lounge") && <BangkokShishaLounge />}
      {(niche === "pickleball" || niche === "paddle-sport" || niche === "kitchen-dink") && <BangkokPickleball />}
      {(niche === "korfball" || niche === "ultimate-frisbee" || niche === "frisbee") && <BangkokKorfball />}
      {niche === "coworking" && <BangkokCoWorking />}
      {(niche === "street-art" || niche === "mural" || niche === "graffiti") && <BangkokMuralArt />}
      {(niche === "bonsai" || niche === "plant-collecting" || niche === "terrarium") && <BangkokBonsai />}
      {(niche === "wrestling" || niche === "bjj" || niche === "grappling") && <BangkokWrestling />}
      {(niche === "paragliding" || niche === "skydiving" || niche === "hot-air-balloon") && <BangkokParagliding />}
      {(niche === "aquarium" || niche === "sea-life" || niche === "marine-life") && <BangkokAquarium />}
      {(niche === "tai-chi" || niche === "qigong" || niche === "chinese-martial-arts") && <BangkokTaiChi />}
      {(niche === "kendo" || niche === "iaido" || niche === "japanese-sword") && <BangkokKendo />}
      {(niche === "breakdance" || niche === "bboy" || niche === "street-dance") && <BangkokBreakdance />}
      {(niche === "zumba" || niche === "latin-dance" || niche === "belly-dance") && <BangkokZumba />}
      {(niche === "pole-dance" || niche === "aerial-silks" || niche === "lyra") && <BangkokPoleDance />}
      {(niche === "bootcamp" || niche === "fitness-bootcamp" || niche === "hiit") && <BangkokFitnessBootcamp />}
      {(niche === "fishing" || niche === "freshwater-fishing" || niche === "sea-fishing") && <BangkokFishing />}
      {(niche === "speedboat" || niche === "canal-tour" || niche === "long-tail-boat") && <BangkokSpeedboat />}
      {(niche === "paintball" || niche === "laser-tag" || niche === "airsoft") && <BangkokPaintball />}
      {(niche === "robotics" || niche === "maker-space" || niche === "drone-racing") && <BangkokRoboticsClub />}
      {(niche === "philosophy" || niche === "book-club" || niche === "dharma") && <BangkokPhilosophyClub />}
      {(niche === "orchid" || niche === "botanical-garden" || niche === "flower-garden") && <BangkokOrchidGarden />}
      {(niche === "fashion" || niche === "fashion-week" || niche === "design-community") && <BangkokFashionWeek />}
      {(niche === "amateur-muay-thai" || niche === "white-collar-boxing" || niche === "fight-night") && <BangkokMuayThaiAmateur />}
      {(niche === "supercar" || niche === "track-day" || niche === "motorsport") && <BangkokSupercar />}
      {(niche === "heritage" || niche === "historical-sites" || niche === "cultural-heritage") && <BangkokHeritage />}
      {(niche === "luxury-spa" || niche === "spa-day" || niche === "wellness-spa") && <BangkokLuxurySpa />}
      {(niche === "pride" || niche === "lgbtq" || niche === "gay-scene") && <BangkokPride />}
      {(niche === "netball" || niche === "touch-rugby" || niche === "expat-sports") && <BangkokNetball />}
      {(niche === "music-production" || niche === "recording-studio" || niche === "music-gear") && <BangkokMusicProduction />}
      {(niche === "oil-painting" || niche === "watercolor" || niche === "traditional-thai-art") && <BangkokOilPainting />}
      {(niche === "chess" || niche === "board-games" || niche === "mahjong") && <BangkokChessClub />}
      {(niche === "home-decor" || niche === "interior-design" || niche === "thai-crafts") && <BangkokHomeDecor />}
      {(niche === "stationery" || niche === "journaling" || niche === "fountain-pens") && <BangkokStationery />}
      {(niche === "esports" || niche === "gaming" || niche === "competitive-gaming") && <BangkokEsports />}
      {(niche === "cooking-school" || niche === "thai-cooking" || niche === "culinary") && <BangkokCookingSchool />}
      {(niche === "urban-farming" || niche === "organic-gardening" || niche === "permaculture") && <BangkokUrbanFarming />}
      {(niche === "pilates" || niche === "reformer-pilates" || niche === "mat-pilates") && <BangkokPilates />}
      {(niche === "parkour" || niche === "freerunning" || niche === "acrobatics") && <BangkokFreeRunning />}
      {(niche === "graffiti" || niche === "street-art" || niche === "urban-art") && <BangkokGraffitiArt />}
      {(niche === "kiteboarding" || niche === "kite-surfing" || niche === "sup") && <BangkokKiteboarding />}
      {(niche === "calisthenics" || niche === "street-workout" || niche === "crossfit") && <BangkokCalisthenics />}
      {(niche === "improv" || niche === "comedy" || niche === "stand-up") && <BangkokImprov />}
      {(niche === "karaoke" || niche === "noraebang" || niche === "singing") && <BangkokKaraoke />}
      {(niche === "rafting" || niche === "white-water" || niche === "kayaking") && <BangkokRafting />}
      {(niche === "acupuncture" || niche === "traditional-medicine" || niche === "tcm") && <BangkokAcupuncture />}
      {(niche === "stargazing" || niche === "astronomy" || niche === "night-sky") && <BangkokStargazing />}
      {(niche === "podcast" || niche === "content-creation" || niche === "youtube") && <BangkokPodcast />}
      {(niche === "sculpture" || niche === "ceramics" || niche === "pottery") && <BangkokSculpture />}
      {(niche === "bjj" || niche === "jiu-jitsu" || niche === "mma") && <BangkokJiuJitsu />}
      {(niche === "bodywork" || niche === "deep-tissue" || niche === "sports-massage") && <BangkokBodywork />}
      {(niche === "polo" || niche === "equestrian" || niche === "horse-riding") && <BangkokPoloClub />}
      {(niche === "football" || niche === "soccer" || niche === "futsal") && <BangkokFootball />}
      {(niche === "hockey" || niche === "ice-hockey" || niche === "field-hockey") && <BangkokHockey />}
      {(niche === "taekwondo" || niche === "karate" || niche === "judo") && <BangkokTaekwondo />}
      {(niche === "coding" || niche === "programming" || niche === "tech") && <BangkokCoding />}
      {(niche === "anime" || niche === "manga" || niche === "cosplay") && <BangkokAnime />}
      {(niche === "magic" || niche === "escape-room" || niche === "board-game-cafe") && <BangkokMagic />}
      {(niche === "whisky" || niche === "whiskey" || niche === "single-malt") && <BangkokWhiskey />}
      {(niche === "plants" || niche === "aquascaping" || niche === "bonsai") && <BangkokPlantCulture />}
      {(niche === "beauty" || niche === "nail-art" || niche === "hair-salon") && <BangkokBeauty />}
      {(niche === "tailoring" || niche === "custom-suit" || niche === "thai-silk") && <BangkokCustomTailoring />}
      {(niche === "art-market" || niche === "galleries" || niche === "street-art") && <BangkokArtMarket />}
      {(niche === "classical-music" || niche === "orchestra" || niche === "jazz") && <BangkokClassicalMusic />}
      {(niche === "salsa" || niche === "bachata" || niche === "latin-dance") && <BangkokLatinDance />}
      {(niche === "hiphop" || niche === "bboy" || niche === "electronic-music") && <BangkokHipHop />}
      {(niche === "thrift" || niche === "vintage-clothing" || niche === "second-hand") && <BangkokThriftShop />}
      {(niche === "jewelry" || niche === "gems" || niche === "amulets") && <BangkokJewelry />}
      {(niche === "tech-shopping" || niche === "gaming" || niche === "cameras") && <BangkokTechShopping />}
      {(niche === "national-park" || niche === "wildlife" || niche === "nature-escape") && <BangkokNatureEscape />}
      {(niche === "beach-trip" || niche === "coastal" || niche === "island") && <BangkokCoastalDayTrip />}
      {(niche === "motorcycle" || niche === "motorbike" || niche === "motorcycle-touring") && <BangkokMotorcycleRiding />}
      {(niche === "running" || niche === "marathon" || niche === "jogging") && <BangkokRunning />}
      {(niche === "sup" || niche === "kayaking" || niche === "dragon-boat" || niche === "wakeboarding") && <BangkokPaddle />}
      {(niche === "mma" || niche === "karate" || niche === "judo" || niche === "krav-maga") && <BangkokCombatSports />}
      {(niche === "skateboarding" || niche === "bmx" || niche === "inline-skating") && <BangkokSkateboarding />}
      {(niche === "bouldering" || niche === "rock-climbing" || niche === "climbing-gym") && <BangkokBouldering />}
      {(niche === "ghost-tour" || niche === "haunted" || niche === "spirit-houses") && <BangkokGhostTour />}
      {(niche === "specialty-coffee" || niche === "third-wave-coffee" || niche === "cafe-hopping") && <BangkokSpecialtyCoffee />}
      {(niche === "barbershop" || niche === "grooming" || niche === "mens-grooming") && <BangkokBarbers />}
      {(niche === "piercing" || niche === "body-modification" || niche === "sak-yant") && <BangkokPiercing />}
      {(niche === "vr" || niche === "gaming" || niche === "esports") && <BangkokVR />}
      {(niche === "airsoft" || niche === "paintball" || niche === "laser-tag") && <BangkokAirsoft />}
      {(niche === "golf-simulator" || niche === "driving-range" || niche === "disc-golf") && <BangkokGolfSimulator />}
      {(niche === "padel" || niche === "pickleball" || niche === "beach-volleyball") && <BangkokPadel />}
      {(niche === "herping" || niche === "reptiles" || niche === "urban-wildlife") && <BangkokHerping />}
      {(niche === "stargazing" || niche === "astronomy" || niche === "astrology") && <BangkokAstronomy />}
      {(niche === "filmmaking" || niche === "content-creation" || niche === "vlogging") && <BangkokFilmmaking />}
      {(niche === "podcasting" || niche === "music-production" || niche === "live-music") && <BangkokPodcasting />}
      {(niche === "mixology" || niche === "craft-cocktails" || niche === "craft-beer") && <BangkokMixology />}
      {(niche === "whisky" || niche === "whiskey" || niche === "sake") && <BangkokWhisky />}
      {(niche === "paramotor" || niche === "hot-air-balloon" || niche === "drone-racing" || niche === "fpv") && <BangkokAerialSports />}
      {(niche === "motocross" || niche === "dirt-bike" || niche === "karting" || niche === "track-day") && <BangkokMotocross />}
      {(niche === "wakeboarding" || niche === "kitesurfing" || niche === "rafting" || niche === "cable-park") && <BangkokWakeboard />}
      {(niche === "aerial-silks" || niche === "acro-yoga" || niche === "pole-dance" || niche === "circus-arts") && <BangkokAcrobatics />}
      {(niche === "krabi-krabong" || niche === "silat" || niche === "capoeira" || niche === "traditional-martial-arts") && <BangkokKrabiKrabong />}
      {(niche === "salsa" || niche === "bachata" || niche === "hip-hop-dance" || niche === "breaking" || niche === "ballroom") && <BangkokSalsaDance />}
      {(niche === "hiking" || niche === "trail-running" || niche === "rock-climbing" || niche === "trekking") && <BangkokHiking />}
      {(niche === "mountain-biking" || niche === "mtb" || niche === "road-cycling" || niche === "bmx" || niche === "skateboarding") && <BangkokMTB />}
      {(niche === "bjj" || niche === "judo" || niche === "wrestling" || niche === "grappling" || niche === "mma") && <BangkokGrappling />}
      {(niche === "ballet" || niche === "contemporary-dance" || niche === "classical-dance" || niche === "khon") && <BangkokBallet />}
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
        name={`Best ${info.label} in ${scope} 2026`}
        items={top.slice(0, 20).map((p) => ({
          name: p.name,
          slug: p.slug,
          niche: niche,
          rating: p.rating,
          review_count: p.review_count,
          address: p.address,
          city: p.city,
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
        name={`Best ${info.label} in ${scope} 2026`}
        description={NICHE_INTRO[niche as NicheSlug]?.sub ?? `${rankedCount} ${info.label.toLowerCase()} venues ranked by real Google reviews.`}
        url={`/activities/${niche}`}
        items={top.slice(0, 10).map((p) => ({
          name: p.name,
          url: `/activities/${niche}/${encodeURIComponent(p.slug)}`,
          rating: p.rating,
          reviewCount: p.review_count,
          address: p.address,
          city: p.city,
        }))}
      />
      <ActivityServiceJsonLd
        name={`${info.label} in ${scope}`}
        description={NICHE_INTRO[niche as NicheSlug]?.sub ?? `${rankedCount} ${info.label.toLowerCase()} venues in ${scope}.`}
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
