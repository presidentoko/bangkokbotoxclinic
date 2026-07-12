import { GUIDES } from "@/lib/guides";
import { NICHES } from "@/lib/niches";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { LocalsChoice } from "@/components/LocalsChoice";
import { TripType } from "@/components/TripType";
import { BangkokFacts } from "@/components/BangkokFacts";
import { SeasonalTip } from "@/components/SeasonalTip";
import { TopSearched } from "@/components/TopSearched";
import { BangkokEtiquette } from "@/components/BangkokEtiquette";
import { BangkokCountdown } from "@/components/BangkokCountdown";
import { SafetyTips } from "@/components/SafetyTips";
import { InstagramSpots } from "@/components/InstagramSpots";
import { BangkokMonthlyCalendar } from "@/components/BangkokMonthlyCalendar";
import { HiddenGemPicker } from "@/components/HiddenGemPicker";
import { TempleGuide } from "@/components/TempleGuide";
import { BangkokNeighborhoodProfile } from "@/components/BangkokNeighborhoodProfile";
import { ThaiEtiquetteQuiz } from "@/components/ThaiEtiquetteQuiz";
import { BangkokFestivalCalendar } from "@/components/BangkokFestivalCalendar";
import { BangkokWeatherByMonth } from "@/components/BangkokWeatherByMonth";
import { BangkokPhotographySpots } from "@/components/BangkokPhotographySpots";
import { BangkokMuseumGuide } from "@/components/BangkokMuseumGuide";
import { BangkokTempleGuide } from "@/components/BangkokTempleGuide";
import { BangkokChinatownGuide } from "@/components/BangkokChinatownGuide";
import { BangkokBuddhistCalendar } from "@/components/BangkokBuddhistCalendar";
import { BangkokArtScene } from "@/components/BangkokArtScene";
import { BangkokGalleryDistrict } from "@/components/BangkokGalleryDistrict";
import { BangkokRainyDayGuide } from "@/components/BangkokRainyDayGuide";
import { BangkokHistoryGuide } from "@/components/BangkokHistoryGuide";
import { BangkokStreetArt } from "@/components/BangkokStreetArt";
import { BangkokTemples } from "@/components/BangkokTemples";
import { BangkokMuseums } from "@/components/BangkokMuseums";
import { BangkokVisaGuide } from "@/components/BangkokVisaGuide";
import { BangkokBackpackerGuide } from "@/components/BangkokBackpackerGuide";
import { BangkokStats } from "@/components/BangkokStats";
import { BangkokElephantSanctuaries } from "@/components/BangkokElephantSanctuaries";
import { BangkokTempleHopping } from "@/components/BangkokTempleHopping";
import { BangkokCoworkingSpaces } from "@/components/BangkokCoworkingSpaces";
import { BangkokFilmPhotography } from "@/components/BangkokFilmPhotography";
import { BangkokSurfingGuide } from "@/components/BangkokSurfingGuide";
import { BangkokArchery } from "@/components/BangkokArchery";
import { BangkokOmakase } from "@/components/BangkokOmakase";
import { BangkokSongkran } from "@/components/BangkokSongkran";
import { BangkokLoyKrathong } from "@/components/BangkokLoyKrathong";
import { BangkokKlongTour } from "@/components/BangkokKlongTour";
import { BangkokCarRental } from "@/components/BangkokCarRental";
import { BangkokSlowTravel } from "@/components/BangkokSlowTravel";
import { BangkokMuayThaiGym } from "@/components/BangkokMuayThaiGym";
import { BangkokSunsetViews } from "@/components/BangkokSunsetViews";
import { BangkokTravelHacks } from "@/components/BangkokTravelHacks";
import { BangkokHiddenGems } from "@/components/BangkokHiddenGems";
import { BangkokDriving } from "@/components/BangkokDriving";
import { BangkokScooterRental } from "@/components/BangkokScooterRental";
import { BangkokStudentTravel } from "@/components/BangkokStudentTravel";
import { BangkokLongTermVisa } from "@/components/BangkokLongTermVisa";
import { BangkokBankAccount } from "@/components/BangkokBankAccount";
import { BangkokSIMCard } from "@/components/BangkokSIMCard";
import { BangkokTaxGuide } from "@/components/BangkokTaxGuide";
import { BangkokCoWorking } from "@/components/BangkokCoWorking";
import { BangkokMovingGuide } from "@/components/BangkokMovingGuide";
import { BangkokSchoolsGuide } from "@/components/BangkokSchoolsGuide";
import { BangkokMedicalCheckup } from "@/components/BangkokMedicalCheckup";
import { BangkokPropertyGuide } from "@/components/BangkokPropertyGuide";
import { BangkokInsuranceGuide } from "@/components/BangkokInsuranceGuide";
import { BangkokInvestmentGuide } from "@/components/BangkokInvestmentGuide";
import { BangkokFreelanceGuide } from "@/components/BangkokFreelanceGuide";
import { BangkokPetOwner } from "@/components/BangkokPetOwner";
import { BangkokDatingScene } from "@/components/BangkokDatingScene";
import { BangkokRetireLiving } from "@/components/BangkokRetireLiving";
import { BangkokFamilyTravel } from "@/components/BangkokFamilyTravel";
import { BangkokSafetyGuide } from "@/components/BangkokSafetyGuide";
import { BangkokSpirituality } from "@/components/BangkokSpirituality";
import { BangkokWomensGuide } from "@/components/BangkokWomensGuide";
import { BangkokAccessibility } from "@/components/BangkokAccessibility";
import { BangkokMentalHealth } from "@/components/BangkokMentalHealth";
import { BangkokPlasticSurgery } from "@/components/BangkokPlasticSurgery";
import { BangkokExpatLife } from "@/components/BangkokExpatLife";
import { BangkokDatingApps } from "@/components/BangkokDatingApps";
import { BangkokFertility } from "@/components/BangkokFertility";
import { BangkokWeddingPlan } from "@/components/BangkokWeddingPlan";
import { BangkokHighSpeedRail } from "@/components/BangkokHighSpeedRail";
import { BangkokChatuchak } from "@/components/BangkokChatuchak";
import { BangkokCannabis } from "@/components/BangkokCannabis";
import { BangkokAyutthaya } from "@/components/BangkokAyutthaya";
import { BangkokHostelGuide } from "@/components/BangkokHostelGuide";
import { BangkokRemoteWork } from "@/components/BangkokRemoteWork";
import { BangkokInternationalSchool } from "@/components/BangkokInternationalSchool";
import { BangkokRealEstate } from "@/components/BangkokRealEstate";
import { BangkokChauffeur } from "@/components/BangkokChauffeur";
import { BangkokVipassana } from "@/components/BangkokVipassana";
import { BangkokLearnThai } from "@/components/BangkokLearnThai";
import { BangkokTextiles } from "@/components/BangkokTextiles";
import { BangkokGemstones } from "@/components/BangkokGemstones";
import { BangkokStreetFashion } from "@/components/BangkokStreetFashion";
import { BangkokKBeauty } from "@/components/BangkokKBeauty";
import { BangkokAesthetics } from "@/components/BangkokAesthetics";
import { BangkokTherapy } from "@/components/BangkokTherapy";
import { BangkokJainFood } from "@/components/BangkokJainFood";
import { BangkokStartup } from "@/components/BangkokStartup";
import { BangkokNGO } from "@/components/BangkokNGO";
import { BangkokEmergency } from "@/components/BangkokEmergency";
import { BangkokSustainability } from "@/components/BangkokSustainability";
import { BangkokLittleIndia } from "@/components/BangkokLittleIndia";
import { BangkokReligion } from "@/components/BangkokReligion";
import { BangkokThaiCulture } from "@/components/BangkokThaiCulture";
import { BangkokThaiHolidays } from "@/components/BangkokThaiHolidays";
import { BangkokIsanFood } from "@/components/BangkokIsanFood";
import { BangkokKoiPond } from "@/components/BangkokKoiPond";
import { BangkokCraftsWorkshop } from "@/components/BangkokCraftsWorkshop";
import { BangkokCigar } from "@/components/BangkokCigar";
import { BangkokSpokenWord } from "@/components/BangkokSpokenWord";
import { BangkokCrypto } from "@/components/BangkokCrypto";
import { BangkokFiberArts } from "@/components/BangkokFiberArts";
import { BangkokFortuneTelling } from "@/components/BangkokFortuneTelling";
import { BangkokMonkLife } from "@/components/BangkokMonkLife";
import { BangkokAccessible } from "@/components/BangkokAccessible";
import { BangkokMidrangePlanning } from "@/components/BangkokMidrangePlanning";
import { BangkokDermatology } from "@/components/BangkokDermatology";
import { BangkokEyeCare } from "@/components/BangkokEyeCare";
import { BangkokTeaCeremony } from "@/components/BangkokTeaCeremony";
import { BangkokCoffeeRoasting } from "@/components/BangkokCoffeeRoasting";
import { BangkokFineDining } from "@/components/BangkokFineDining";
import { BangkokBachelorette } from "@/components/BangkokBachelorette";
import { BangkokLuxuryCar } from "@/components/BangkokLuxuryCar";
import { BangkokBoardgame } from "@/components/BangkokBoardgame";
import { BangkokZeroWaste } from "@/components/BangkokZeroWaste";
import { BangkokFloralDesign } from "@/components/BangkokFloralDesign";
import { BangkokOrthopedic } from "@/components/BangkokOrthopedic";
import { BangkokSleepClinic } from "@/components/BangkokSleepClinic";
import { BangkokSkincare } from "@/components/BangkokSkincare";
import { BangkokHairTransplant } from "@/components/BangkokHairTransplant";
import { BangkokWeightLoss } from "@/components/BangkokWeightLoss";
import { BangkokDetox } from "@/components/BangkokDetox";
import { BangkokCollectibles } from "@/components/BangkokCollectibles";
import { BangkokContentCreator } from "@/components/BangkokContentCreator";
import { BangkokDogCulture } from "@/components/BangkokDogCulture";
import { BangkokChineseLanguage } from "@/components/BangkokChineseLanguage";
import { BangkokSouthAsianFood } from "@/components/BangkokSouthAsianFood";
import { BangkokCambodianFood } from "@/components/BangkokCambodianFood";
import { BangkokLatinAmerica } from "@/components/BangkokLatinAmerica";
import { BangkokPregnancy } from "@/components/BangkokPregnancy";
import { BangkokBanking } from "@/components/BangkokBanking";
import { BangkokCosplay } from "@/components/BangkokCosplay";
import { BangkokStreetPhotography } from "@/components/BangkokStreetPhotography";
import { BangkokShootingRange } from "@/components/BangkokShootingRange";
import { BangkokMotorbike } from "@/components/BangkokMotorbike";
import { BangkokSpirits } from "@/components/BangkokSpirits";
import { BangkokContemporaryArt } from "@/components/BangkokContemporaryArt";
import { BangkokOpera } from "@/components/BangkokOpera";
import { BangkokCharity } from "@/components/BangkokCharity";
import { BangkokNailArt } from "@/components/BangkokNailArt";
import { BangkokBaking } from "@/components/BangkokBaking";
import { BangkokHawkerCulture } from "@/components/BangkokHawkerCulture";
import { BangkokFarmToTable } from "@/components/BangkokFarmToTable";
import { BangkokExtremeSports } from "@/components/BangkokExtremeSports";
import { BangkokKohSiChang } from "@/components/BangkokKohSiChang";
import { BangkokRiverLife } from "@/components/BangkokRiverLife";
import { BangkokToChiangMai } from "@/components/BangkokToChiangMai";
import { BangkokPattayaGuide } from "@/components/BangkokPattayaGuide";
import { BangkokImmigration } from "@/components/BangkokImmigration";
import { BangkokCosmeticSurgery } from "@/components/BangkokCosmeticSurgery";
import { BangkokSustainableLiving } from "@/components/BangkokSustainableLiving";
import { BangkokLGBTQ } from "@/components/BangkokLGBTQ";
import { BangkokCondoRental } from "@/components/BangkokCondoRental";
import { BangkokCareerJobs } from "@/components/BangkokCareerJobs";
import { BangkokLawLegal } from "@/components/BangkokLawLegal";
import { BangkokPoliticsHistory } from "@/components/BangkokPoliticsHistory";
import { BangkokMuslimCulture } from "@/components/BangkokMuslimCulture";
import { BangkokNorthernFood } from "@/components/BangkokNorthernFood";
import { BangkokInternetTech } from "@/components/BangkokInternetTech";
import { BangkokHandicraft } from "@/components/BangkokHandicraft";
import { BangkokStudyAbroad } from "@/components/BangkokStudyAbroad";
import { BangkokBuddhism } from "@/components/BangkokBuddhism";
import { BangkokRoyalPalace } from "@/components/BangkokRoyalPalace";
import { BangkokNationalParks } from "@/components/BangkokNationalParks";
import { BangkokCreativeEconomy } from "@/components/BangkokCreativeEconomy";
import { BangkokHikingTrails } from "@/components/BangkokHikingTrails";
import { BangkokInfluencerLife } from "@/components/BangkokInfluencerLife";
import { BangkokFemaleTraveler } from "@/components/BangkokFemaleTraveler";
import { BangkokDisabilityAccess } from "@/components/BangkokDisabilityAccess";
import { BangkokPubsGames } from "@/components/BangkokPubsGames";
import { BangkokPakistaniFood } from "@/components/BangkokPakistaniFood";
import { BangkokEnvironment } from "@/components/BangkokEnvironment";
import { BangkokEconomy } from "@/components/BangkokEconomy";
import { BangkokStockInvest } from "@/components/BangkokStockInvest";
import { BangkokHealthcare } from "@/components/BangkokHealthcare";
import { BangkokBoatTransport } from "@/components/BangkokBoatTransport";
import { BangkokBTSMRT } from "@/components/BangkokBTSMRT";
import { BangkokLoiKrathong } from "@/components/BangkokLoiKrathong";
import { BangkokSouvenirs } from "@/components/BangkokSouvenirs";
import { BangkokZooWildlife } from "@/components/BangkokZooWildlife";
import { BangkokKhaoSanRoad } from "@/components/BangkokKhaoSanRoad";
import { BangkokViewpoints } from "@/components/BangkokViewpoints";
import { BangkokFurnitureHome } from "@/components/BangkokFurnitureHome";
import { BangkokRiceCuisine } from "@/components/BangkokRiceCuisine";
import { BangkokDurianFruit } from "@/components/BangkokDurianFruit";
import { BangkokAmuletMarket } from "@/components/BangkokAmuletMarket";
import { BangkokGenderDiversity } from "@/components/BangkokGenderDiversity";
import { BangkokSocialMedia } from "@/components/BangkokSocialMedia";
import { BangkokCanalLife } from "@/components/BangkokCanalLife";
import { BangkokGovernment } from "@/components/BangkokGovernment";
import { BangkokKanchanaburi } from "@/components/BangkokKanchanaburi";
import { BangkokEasternSeaboard } from "@/components/BangkokEasternSeaboard";
import { BangkokTraditionalMedicine } from "@/components/BangkokTraditionalMedicine";
import { BangkokTrafficTransport } from "@/components/BangkokTrafficTransport";
import { BangkokWorkPermit } from "@/components/BangkokWorkPermit";
import { BangkokHousingRent } from "@/components/BangkokHousingRent";
import { BangkokVentureTech } from "@/components/BangkokVentureTech";
import { BangkokCrimeLaw } from "@/components/BangkokCrimeLaw";
import { BangkokCostOfLiving } from "@/components/BangkokCostOfLiving";
import { BangkokFoodAllergy } from "@/components/BangkokFoodAllergy";
import { BangkokIslamicCulture } from "@/components/BangkokIslamicCulture";
import { BangkokPollution } from "@/components/BangkokPollution";
import { BangkokArts } from "@/components/BangkokArts";
import { BangkokGoKart } from "@/components/BangkokGoKart";
import { BangkokInstagram } from "@/components/BangkokInstagram";
import { BangkokSurgery } from "@/components/BangkokSurgery";
import { BangkokNailSalon } from "@/components/BangkokNailSalon";
import { BangkokSecondhand } from "@/components/BangkokSecondhand";
import { BangkokPets } from "@/components/BangkokPets";
import { BangkokNewYear } from "@/components/BangkokNewYear";
import { BangkokRailway } from "@/components/BangkokRailway";
import { BangkokSuvarnabhumi } from "@/components/BangkokSuvarnabhumi";
import { BangkokDinner } from "@/components/BangkokDinner";
import { BangkokAlcohol } from "@/components/BangkokAlcohol";
import { BangkokMosquito } from "@/components/BangkokMosquito";
import { BangkokBike } from "@/components/BangkokBike";
import { BangkokGold } from "@/components/BangkokGold";
import { BangkokVPN } from "@/components/BangkokVPN";
import { BangkokLadprao } from "@/components/BangkokLadprao";
import { BangkokKhonKaen } from "@/components/BangkokKhonKaen";
import { BangkokRetiree } from "@/components/BangkokRetiree";
import { BangkokRomance } from "@/components/BangkokRomance";
import { BangkokHerbal } from "@/components/BangkokHerbal";
import { BangkokRegional } from "@/components/BangkokRegional";
import { BangkokFoodFest } from "@/components/BangkokFoodFest";
import { BangkokSake } from "@/components/BangkokSake";
import { BangkokSathorn } from "@/components/BangkokSathorn";
import { BangkokOldCity } from "@/components/BangkokOldCity";
import { BangkokThonburi } from "@/components/BangkokThonburi";
import { BangkokHuaHin } from "@/components/BangkokHuaHin";
import { BangkokChiangMai } from "@/components/BangkokChiangMai";
import { BangkokWildlife } from "@/components/BangkokWildlife";
import { BangkokShrine } from "@/components/BangkokShrine";
import { BangkokCeremony } from "@/components/BangkokCeremony";
import { BangkokEthnic } from "@/components/BangkokEthnic";
import { BangkokModernArt } from "@/components/BangkokModernArt";
import { BangkokPuppet } from "@/components/BangkokPuppet";
import { BangkokLacquerware } from "@/components/BangkokLacquerware";
import { BangkokScienceMuseum } from "@/components/BangkokScienceMuseum";
import { BangkokMICE } from "@/components/BangkokMICE";
import { BangkokClimate } from "@/components/BangkokClimate";
import { BangkokLegal } from "@/components/BangkokLegal";
import { BangkokChakri } from "@/components/BangkokChakri";
import { BangkokFermented } from "@/components/BangkokFermented";
import { BangkokSunrise } from "@/components/BangkokSunrise";
import { BangkokRacquet } from "@/components/BangkokRacquet";
import { BangkokMarriage } from "@/components/BangkokMarriage";
import { BangkokATM } from "@/components/BangkokATM";
import { BangkokDentist } from "@/components/BangkokDentist";
import { BangkokFunctionalMed } from "@/components/BangkokFunctionalMed";
import { BangkokCharterBoat } from "@/components/BangkokCharterBoat";
import { BangkokHeli } from "@/components/BangkokHeli";
import { BangkokSailboat } from "@/components/BangkokSailboat";
import { BangkokBrewing } from "@/components/BangkokBrewing";
import { BangkokIngredient } from "@/components/BangkokIngredient";
import { BangkokDawn } from "@/components/BangkokDawn";
import { BangkokDisabled } from "@/components/BangkokDisabled";
import { BangkokPregnant } from "@/components/BangkokPregnant";
import { BangkokInsect } from "@/components/BangkokInsect";
import { BangkokSouvenirShop } from "@/components/BangkokSouvenirShop";
import { BangkokSign } from "@/components/BangkokSign";
import { BangkokNomad } from "@/components/BangkokNomad";
import { BangkokPhilanthropy } from "@/components/BangkokPhilanthropy";
import { BangkokPrivateJet } from "@/components/BangkokPrivateJet";
import { BangkokFlood } from "@/components/BangkokFlood";
import { BangkokPatpong } from "@/components/BangkokPatpong";
import { BangkokMarathon } from "@/components/BangkokMarathon";
import { BangkokAuction } from "@/components/BangkokAuction";
import { BangkokBatik } from "@/components/BangkokBatik";
import { BangkokCompany } from "@/components/BangkokCompany";
import { BangkokOrdination } from "@/components/BangkokOrdination";
import { BangkokNigerianFood } from "@/components/BangkokNigerianFood";
import { BangkokChef } from "@/components/BangkokChef";
import { BangkokThaiTV } from "@/components/BangkokThaiTV";
import { BangkokElectric } from "@/components/BangkokElectric";
import { BangkokEducation } from "@/components/BangkokEducation";
import { BangkokAgriculture } from "@/components/BangkokAgriculture";
import { BangkokPhuket } from "@/components/BangkokPhuket";
import { BangkokPrison } from "@/components/BangkokPrison";
import { BangkokAnimal } from "@/components/BangkokAnimal";
import { BangkokMedicine } from "@/components/BangkokMedicine";
import { BangkokDesign } from "@/components/BangkokDesign";
import { BangkokPhilippine } from "@/components/BangkokPhilippine";
import { BangkokKhlong } from "@/components/BangkokKhlong";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const metadata: Metadata = {
  title: "Bangkok Guides — Food, Activities & Local Tips (2026)",
  description:
    "Practical Bangkok guides — Thai food, Muay Thai, Thai massage, yoga, cooking classes, diving, coworking. No tourist traps, no influencer placements.",
  alternates: { canonical: "/guide" },
};

export const dynamic = "force-static";

const ACTIVITY_SLUGS = new Set([
  "best-muay-thai-gyms-bangkok",
  "best-thai-massage-spa-bangkok",
  "best-yoga-studios-bangkok",
  "best-thai-cooking-classes-bangkok",
  "diving-near-bangkok-guide",
  "coworking-bangkok-digital-nomad-guide",
]);

export default function GuideIndexPage() {
  const foodGuides = GUIDES.filter((g) => !ACTIVITY_SLUGS.has(g.slug));
  const activityGuides = GUIDES.filter((g) => ACTIVITY_SLUGS.has(g.slug));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Guides</span>
      </nav>

      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-4xl font-bold tracking-tight">Bangkok Guides</h1>
        <ShareButton title="Bangkok Guides 2026 — Data-Backed, No Fluff" text="Bangkok guides backed by real review data — food, activities, prices" url={`${SITE}/guide`} line whatsapp />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
        No-fluff guides backed by real data — what locals know, prices in Thai Baht, and how to avoid tourist traps.
      </p>

      {/* Activity guides */}
      {activityGuides.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">Activities & Experiences</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {activityGuides.map((g) => {
              const niche = g.nicheSlug ? NICHES.find((n) => n.slug === g.nicheSlug) : null;
              return (
                <a
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="group flex gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-orange-300 hover:shadow-md transition"
                >
                  {niche && (
                    <div className="text-3xl shrink-0 mt-0.5">{niche.icon}</div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-base font-bold leading-tight group-hover:text-orange-600 transition mb-1">
                      {g.title.replace(/ \(\d{4}\)$/, "")}
                    </h2>
                    <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">{g.metaDescription}</p>
                    <div className="mt-2 text-xs text-[var(--muted)]">Updated {g.updated}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Food guides */}
      {foodGuides.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">Food & Restaurants</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {foodGuides.map((g) => (
              <a
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="group flex gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-orange-300 hover:shadow-md transition"
              >
                <div className="text-3xl shrink-0 mt-0.5">🍜</div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold leading-tight group-hover:text-orange-600 transition mb-1">
                    {g.title.replace(/ \(\d{4}\)$/, "")}
                  </h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">{g.metaDescription}</p>
                  <div className="mt-2 text-xs text-[var(--muted)]">Updated {g.updated}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <TopSearched />
      <BangkokMonthlyCalendar />
      <BangkokNeighborhoodProfile />
      <BangkokPhotographySpots />
      <BangkokMuseumGuide />
      <BangkokTempleGuide />
      <BangkokChinatownGuide />
      <BangkokBuddhistCalendar />
      <BangkokArtScene />
      <BangkokGalleryDistrict />
      <BangkokRainyDayGuide />
      <BangkokHistoryGuide />
      <BangkokTemples />
      <BangkokMuseums />
      <BangkokStreetArt />
      <BangkokWeatherByMonth />
      <BangkokFestivalCalendar />
      <ThaiEtiquetteQuiz />
      <HiddenGemPicker />
      <BangkokCountdown />
      <BangkokFacts />
      <BangkokStats />
      <BangkokElephantSanctuaries />
      <BangkokTempleHopping />
      <BangkokCoworkingSpaces />
      <BangkokFilmPhotography />
      <BangkokSurfingGuide />
      <BangkokArchery />
      <BangkokOmakase />
      <BangkokSongkran />
      <BangkokLoyKrathong />
      <BangkokKlongTour />
      <BangkokCarRental />
      <BangkokSlowTravel />
      <BangkokMuayThaiGym />
      <BangkokSunsetViews />
      <BangkokHiddenGems />
      <BangkokDriving />
      <BangkokScooterRental />
      <BangkokStudentTravel />
      <BangkokLongTermVisa />
      <BangkokBankAccount />
      <BangkokSIMCard />
      <BangkokTaxGuide />
      <BangkokCoWorking />
      <BangkokMovingGuide />
      <BangkokSchoolsGuide />
      <BangkokMedicalCheckup />
      <BangkokPropertyGuide />
      <BangkokInsuranceGuide />
      <BangkokInvestmentGuide />
      <BangkokFreelanceGuide />
      <BangkokPetOwner />
      <BangkokDatingScene />
      <BangkokRetireLiving />
      <BangkokFamilyTravel />
      <BangkokSafetyGuide />
      <BangkokSpirituality />
      <BangkokWomensGuide />
      <BangkokAccessibility />
      <BangkokMentalHealth />
      <BangkokPlasticSurgery />
      <BangkokExpatLife />
      <BangkokDatingApps />
      <BangkokFertility />
      <BangkokWeddingPlan />
      <BangkokHighSpeedRail />
      <BangkokChatuchak />
      <BangkokCannabis />
      <BangkokAyutthaya />
      <BangkokHostelGuide />
      <BangkokRemoteWork />
      <BangkokInternationalSchool />
      <BangkokRealEstate />
      <BangkokChauffeur />
      <BangkokVipassana />
      <BangkokLearnThai />
      <BangkokTextiles />
      <BangkokGemstones />
      <BangkokStreetFashion />
      <BangkokKBeauty />
      <BangkokAesthetics />
      <BangkokTherapy />
      <BangkokJainFood />
      <BangkokStartup />
      <BangkokNGO />
      <BangkokEmergency />
      <BangkokSustainability />
      <BangkokLittleIndia />
      <BangkokReligion />
      <BangkokThaiCulture />
      <BangkokThaiHolidays />
      <BangkokIsanFood />
      <BangkokKoiPond />
      <BangkokCraftsWorkshop />
      <BangkokCigar />
      <BangkokSpokenWord />
      <BangkokCrypto />
      <BangkokFiberArts />
      <BangkokFortuneTelling />
      <BangkokMonkLife />
      <BangkokAccessible />
      <BangkokMidrangePlanning />
      <BangkokDermatology />
      <BangkokEyeCare />
      <BangkokTeaCeremony />
      <BangkokCoffeeRoasting />
      <BangkokFineDining />
      <BangkokBachelorette />
      <BangkokLuxuryCar />
      <BangkokBoardgame />
      <BangkokZeroWaste />
      <BangkokFloralDesign />
      <BangkokOrthopedic />
      <BangkokSleepClinic />
      <BangkokSkincare />
      <BangkokHairTransplant />
      <BangkokWeightLoss />
      <BangkokDetox />
      <BangkokCollectibles />
      <BangkokContentCreator />
      <BangkokDogCulture />
      <BangkokChineseLanguage />
      <BangkokSouthAsianFood />
      <BangkokCambodianFood />
      <BangkokLatinAmerica />
      <BangkokPregnancy />
      <BangkokBanking />
      <BangkokCosplay />
      <BangkokStreetPhotography />
      <BangkokShootingRange />
      <BangkokMotorbike />
      <BangkokSpirits />
      <BangkokContemporaryArt />
      <BangkokOpera />
      <BangkokCharity />
      <BangkokNailArt />
      <BangkokBaking />
      <BangkokHawkerCulture />
      <BangkokFarmToTable />
      <BangkokExtremeSports />
      <BangkokKohSiChang />
      <BangkokRiverLife />
      <BangkokToChiangMai />
      <BangkokPattayaGuide />
      <BangkokImmigration />
      <BangkokCosmeticSurgery />
      <BangkokSustainableLiving />
      <BangkokLGBTQ />
      <BangkokCondoRental />
      <BangkokCareerJobs />
      <BangkokLawLegal />
      <BangkokPoliticsHistory />
      <BangkokMuslimCulture />
      <BangkokNorthernFood />
      <BangkokInternetTech />
      <BangkokHandicraft />
      <BangkokStudyAbroad />
      <BangkokBuddhism />
      <BangkokRoyalPalace />
      <BangkokNationalParks />
      <BangkokCreativeEconomy />
      <BangkokHikingTrails />
      <BangkokInfluencerLife />
      <BangkokFemaleTraveler />
      <BangkokDisabilityAccess />
      <BangkokPubsGames />
      <BangkokPakistaniFood />
      <BangkokEnvironment />
      <BangkokEconomy />
      <BangkokStockInvest />
      <BangkokHealthcare />
      <BangkokBoatTransport />
      <BangkokBTSMRT />
      <BangkokLoiKrathong />
      <BangkokSouvenirs />
      <BangkokZooWildlife />
      <BangkokKhaoSanRoad />
      <BangkokViewpoints />
      <BangkokFurnitureHome />
      <BangkokRiceCuisine />
      <BangkokDurianFruit />
      <BangkokAmuletMarket />
      <BangkokGenderDiversity />
      <BangkokSocialMedia />
      <BangkokCanalLife />
      <BangkokGovernment />
      <BangkokKanchanaburi />
      <BangkokEasternSeaboard />
      <BangkokTraditionalMedicine />
      <BangkokTrafficTransport />
      <BangkokWorkPermit />
      <BangkokHousingRent />
      <BangkokVentureTech />
      <BangkokCrimeLaw />
      <BangkokCostOfLiving />
      <BangkokFoodAllergy />
      <BangkokIslamicCulture />
      <BangkokPollution />
      <BangkokArts />
      <BangkokGoKart />
      <BangkokInstagram />
      <BangkokSurgery />
      <BangkokNailSalon />
      <BangkokSecondhand />
      <BangkokPets />
      <BangkokNewYear />
      <BangkokRailway />
      <BangkokSuvarnabhumi />
      <BangkokDinner />
      <BangkokAlcohol />
      <BangkokMosquito />
      <BangkokBike />
      <BangkokGold />
      <BangkokVPN />
      <BangkokLadprao />
      <BangkokKhonKaen />
      <BangkokRetiree />
      <BangkokRomance />
      <BangkokHerbal />
      <BangkokRegional />
      <BangkokFoodFest />
      <BangkokSake />
      <BangkokSathorn />
      <BangkokOldCity />
      <BangkokThonburi />
      <BangkokHuaHin />
      <BangkokChiangMai />
      <BangkokWildlife />
      <BangkokShrine />
      <BangkokCeremony />
      <BangkokEthnic />
      <BangkokModernArt />
      <BangkokPuppet />
      <BangkokLacquerware />
      <BangkokScienceMuseum />
      <BangkokMICE />
      <BangkokClimate />
      <BangkokLegal />
      <BangkokChakri />
      <BangkokFermented />
      <BangkokSunrise />
      <BangkokRacquet />
      <BangkokMarriage />
      <BangkokATM />
      <BangkokDentist />
      <BangkokFunctionalMed />
      <BangkokCharterBoat />
      <BangkokHeli />
      <BangkokSailboat />
      <BangkokBrewing />
      <BangkokIngredient />
      <BangkokDawn />
      <BangkokDisabled />
      <BangkokPregnant />
      <BangkokInsect />
      <BangkokSouvenirShop />
      <BangkokSign />
      <BangkokNomad />
      <BangkokPhilanthropy />
      <BangkokPrivateJet />
      <BangkokFlood />
      <BangkokPatpong />
      <BangkokMarathon />
      <BangkokAuction />
      <BangkokBatik />
      <BangkokCompany />
      <BangkokOrdination />
      <BangkokNigerianFood />
      <BangkokChef />
      <BangkokThaiTV />
      <BangkokElectric />
      <BangkokEducation />
      <BangkokAgriculture />
      <BangkokPhuket />
      <BangkokPrison />
      <BangkokAnimal />
      <BangkokMedicine />
      <BangkokDesign />
      <BangkokPhilippine />
      <BangkokKhlong />
      <BangkokTravelHacks />
      <BangkokVisaGuide />
      <BangkokBackpackerGuide />
      <SeasonalTip />
      <TempleGuide />
      <BangkokEtiquette />
      <SafetyTips />
      <TripType />
      <LocalsChoice />
      <InstagramSpots />
      <BangkokChallenge />
      <BangkokTip />

      {/* Poll */}
      <div className="mb-6">
        <VersusVote
          question="When you're planning Bangkok — what's your style?"
          a={{ id: "guide-research", label: "Read the guides first", emoji: "📖", desc: "Research, plan, compare prices — show up prepared", url: "/guide/best-thai-food-bangkok" }}
          b={{ id: "show-up", label: "Show up and figure it out", emoji: "🎲", desc: "Discover as you go — Bangkok rewards wanderers", url: "/activities" }}
        />
      </div>

      {/* CTA */}
      <section className="border border-orange-200 rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-amber-50">
        <h2 className="font-black text-lg mb-2">Want to book an activity?</h2>
        <p className="text-sm text-[var(--muted)] mb-4">Browse our ranked directories — sorted by Trust Score from real Google reviews.</p>
        <div className="flex flex-wrap gap-3">
          <a href="/activities" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition">
            All Activities →
          </a>
          <a href="/quiz" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-300 text-orange-700 font-bold text-sm hover:bg-orange-50 transition">
            🎯 Take the quiz
          </a>
          <a href="/bingo" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-300 text-green-700 font-bold text-sm hover:bg-green-50 transition">
            🏆 Bucket List Bingo
          </a>
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guide" },
      ]} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Bangkok Travel Guides 2026",
        "description": "Practical Bangkok guides — Thai food, Muay Thai, Thai massage, yoga, cooking classes, diving, coworking.",
        "url": `${SITE}/guide`,
        "numberOfItems": GUIDES.length,
        "itemListElement": GUIDES.map((g, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": g.title,
          "url": `${SITE}/guide/${g.slug}`,
        })),
      }) }} />
    </div>
  );
}
