import type { Metadata } from "next";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { ThaiPhrase } from "@/components/ThaiPhrase";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { WeatherWidget } from "@/components/WeatherWidget";
import { PhraseBook } from "@/components/PhraseBook";
import { DontMiss } from "@/components/DontMiss";
import { StreetFoodGuide } from "@/components/StreetFoodGuide";
import { LocalsChoice } from "@/components/LocalsChoice";
import { GrabTips } from "@/components/GrabTips";
import { PublicTransitGuide } from "@/components/PublicTransitGuide";
import { SeasonalTip } from "@/components/SeasonalTip";
import { BangkokEtiquette } from "@/components/BangkokEtiquette";
import { SafetyTips } from "@/components/SafetyTips";
import { HiddenGemPicker } from "@/components/HiddenGemPicker";
import { EmergencyInfo } from "@/components/EmergencyInfo";
import { StreetFoodDistrictMap } from "@/components/StreetFoodDistrictMap";
import { ThaiNumberGuide } from "@/components/ThaiNumberGuide";
import { BangkokAirportGuide } from "@/components/BangkokAirportGuide";
import { BangkokMalls } from "@/components/BangkokMalls";
import { BangkokShopping } from "@/components/BangkokShopping";
import { BangkokBargainingGuide } from "@/components/BangkokBargainingGuide";
import { ThaiAllergenGuide } from "@/components/ThaiAllergenGuide";
import { MoneyGuide } from "@/components/MoneyGuide";
import { TukTukRoutes } from "@/components/TukTukRoutes";
import { BangkokHospitalsGuide } from "@/components/BangkokHospitalsGuide";
import { BangkokScamAlert } from "@/components/BangkokScamAlert";
import { BangkokMallGuide } from "@/components/BangkokMallGuide";
import { BangkokTransportComparison } from "@/components/BangkokTransportComparison";
import { BangkokSupermarketGuide } from "@/components/BangkokSupermarketGuide";
import { BangkokBuySouvenirs } from "@/components/BangkokBuySouvenirs";
import { BangkokTukTukGuide } from "@/components/BangkokTukTukGuide";
import { BangkokJetLagTips } from "@/components/BangkokJetLagTips";
import { BangkokGrabTips } from "@/components/BangkokGrabTips";
import { BangkokMarketGuide } from "@/components/BangkokMarketGuide";
import { BangkokDrinkCultureGuide } from "@/components/BangkokDrinkCultureGuide";
import { BangkokFashionShopping } from "@/components/BangkokFashionShopping";
import { BangkokElectronics } from "@/components/BangkokElectronics";
import { BangkokFoodDelivery } from "@/components/BangkokFoodDelivery";
import { BangkokFreeTourism } from "@/components/BangkokFreeTourism";
import { BangkokHealthTips } from "@/components/BangkokHealthTips";
import { BangkokWeatherByMonth } from "@/components/BangkokWeatherByMonth";
import { BangkokNightTrains } from "@/components/BangkokNightTrains";
import { BangkokCycleFriendly } from "@/components/BangkokCycleFriendly";
import { BangkokStreetShopping } from "@/components/BangkokStreetShopping";
import { BangkokSpiceLevels } from "@/components/BangkokSpiceLevels";
import { BangkokTaxiEtiquette } from "@/components/BangkokTaxiEtiquette";
import { BangkokMoneyExchange } from "@/components/BangkokMoneyExchange";
import { BangkokShoeShops } from "@/components/BangkokShoeShops";
import { BangkokClothingAlteration } from "@/components/BangkokClothingAlteration";
import { BangkokTuktukExperience } from "@/components/BangkokTuktukExperience";
import { BangkokWatchShopping } from "@/components/BangkokWatchShopping";
import { BangkokSilkShopping } from "@/components/BangkokSilkShopping";
import { BangkokThriftStores } from "@/components/BangkokThriftStores";
import { BangkokPharmacyGuide } from "@/components/BangkokPharmacyGuide";
import { BangkokSimCardGuide } from "@/components/BangkokSimCardGuide";
import { BangkokTransportGuide } from "@/components/BangkokTransportGuide";
import { BangkokTailorMade } from "@/components/BangkokTailorMade";
import { BangkokCarRental } from "@/components/BangkokCarRental";
import { BangkokSeniorTravel } from "@/components/BangkokSeniorTravel";
import { BangkokDeliveryApps } from "@/components/BangkokDeliveryApps";
import { BangkokTravelHacks } from "@/components/BangkokTravelHacks";
import { BangkokAntiques } from "@/components/BangkokAntiques";
import { BangkokNaturalWine } from "@/components/BangkokNaturalWine";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Local Tips 2026 — What Locals Actually Do (Not Tourist Traps)",
  description: "Real Bangkok insider tips: where locals eat, how to get around, what to avoid. No sponsored content, no tourist-trap recommendations.",
  alternates: { canonical: "/local-tips" },
  openGraph: {
    title: "Bangkok Local Tips 2026 — What Locals Actually Do",
    description: "Real insider Bangkok knowledge — where locals eat, how to get around, what to skip.",
  },
};

const LOCAL_TIPS = [
  {
    category: "Getting Around",
    emoji: "🚇",
    tips: [
      { tip: "BTS Skytrain beats taxis during rush hour", detail: "7–9am and 5–8pm: BTS is faster and ฿15–฿50. Taxi meter easily 3–5× longer." },
      { tip: "Airport rail link beats Grab to the airport", detail: "฿45 flat vs ฿400–฿600 by car. 30 min from Phaya Thai to Suvarnabhumi. No traffic." },
      { tip: "Khlong boats are the hidden fast lane", detail: "Saen Saep canal express boats: ฿9–฿19, skips all road traffic in central Bangkok." },
      { tip: "Grab beats taxis at night for pricing", detail: "Taxis at night often refuse meter or quote fixed prices. Grab shows price upfront, no negotiation." },
    ],
  },
  {
    category: "Food",
    emoji: "🍜",
    tips: [
      { tip: "Eat where lines form before 11am or after 1pm", detail: "Best local lunch spots sell out by 12:30. Locals queue from 10:45. Arrive early or eat late." },
      { tip: "Skip tourist-area massage — walk one block back", detail: "Main street spa: ฿500/hr. Same quality 50m off the tourist strip: ฿200–฿300." },
      { tip: "Or Tor Kor Market > floating markets for food", detail: "Or Tor Kor (near Chatuchak) has the best fresh produce and prepared food. No tourist mark-up, no show." },
      { tip: "Avoid restaurants with English menus only", detail: "Thai-language menu beside English = locals eating here. English-only = tourist trap. Same rule applies to massage menus." },
    ],
  },
  {
    category: "Money",
    emoji: "💸",
    tips: [
      { tip: "ATMs: Kasikorn and Bangkok Bank charge ฿220 fee", detail: "All local ATMs now charge ฿180–฿220 per withdrawal. Withdraw more, fewer times. Some foreign banks reimburse." },
      { tip: "PromptPay QR codes everywhere — ask if they take it", detail: "Scan QR and pay in Thai Baht at thousands of vendors. Your bank's app may support international transfer." },
      { tip: "Negotiate tuk-tuks and boats — always", detail: "Tuk-tuks and river charter boats have no meter. Name a price before boarding. First quote is rarely final." },
    ],
  },
  {
    category: "Activities",
    emoji: "🎯",
    tips: [
      { tip: "Book Muay Thai training early — gyms fill by 9am", detail: "Good gyms accept walk-ins but morning sessions fill fast. WhatsApp the night before to reserve." },
      { tip: "Cooking classes: choose one near a wet market", detail: "The best cooking classes include a market visit first. Adds 1 hour but teaches ingredient selection." },
      { tip: "Yoga: many studios offer ฿100–฿200 first-class deals", detail: "Nearly every yoga studio has a first-time visitor deal. Check the studio Instagram or just ask at the desk." },
      { tip: "Grand Palace: go before 9am to avoid crowds", detail: "Dress code strictly enforced. Open 8am. By 10am it's packed with tour groups. Morning light is better anyway." },
    ],
  },
];

const LOCAL_FAQS = [
  { q: "When should I avoid Bangkok?", a: "April (Songkran / Thai New Year) is extremely busy but fun if you're prepared to get soaked. Avoid arriving first week of April for pure relaxation. Peak tourist season is Nov–Feb (cool, dry). May–Oct is hot/rainy but cheaper." },
  { q: "What tourist traps should I avoid in Bangkok?", a: "Common ones: (1) Tuk-tuk tours to 'special deals' at jewelry stores — it's a scam. (2) Pad Thai on Khao San Road — overpriced and inauthentic. (3) Long-tail boats at Tha Chang pier — high pressure, inflated prices. (4) Suit tailors near tourist streets — 48-hour suits are low quality." },
  { q: "Is Bangkok safe for solo travelers?", a: "Yes. Bangkok is generally very safe for solo travelers including solo women. Main cautions: watch drinks at nightlife venues, don't accept free tours from strangers (jewelry scam), use Grab not unlicensed taxis at night." },
  { q: "How much money do I need per day in Bangkok?", a: "Budget: ฿1,500–฿2,500/day (hostel + street food + BTS). Mid-range: ฿3,000–฿6,000/day (hotel + restaurants + one activity). Comfortable: ฿8,000–฿15,000/day (nice hotel + spa + dining + taxis). Luxury: unlimited." },
];

export default function LocalTipsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <span>Local Tips</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
        Insider Knowledge
      </div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">
          Bangkok Local Tips 2026
        </h1>
        <ShareButton title="Bangkok Local Tips 2026 — What Locals Actually Do" text="Insider tips: real transport, food, money & avoid tourist traps" url={`${SITE}/local-tips`} line whatsapp />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        No paid placements. No tourism board. What locals and long-term expats actually do — and what they skip.
      </p>

      {/* Local tips grid */}
      {LOCAL_TIPS.map((section) => (
        <section key={section.category} className="mb-10">
          <h2 className="flex items-center gap-2 text-xl font-black mb-4">
            <span>{section.emoji}</span> {section.category}
          </h2>
          <div className="space-y-3">
            {section.tips.map((t, i) => (
              <div key={i} className="border border-[var(--border)] rounded-xl p-4 bg-white">
                <div className="font-bold text-sm mb-1">✓ {t.tip}</div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{t.detail}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <WeatherWidget />
      <DontMiss />

      {/* Thai Phrase of the Day */}
      <BangkokChallenge />

      <ThaiPhrase />
      <PhraseBook />
      <ThaiNumberGuide />
      <StreetFoodGuide />
      <BangkokShopping />
      <BangkokMallGuide />
      <BangkokTransportComparison />
      <BangkokSupermarketGuide />
      <BangkokBuySouvenirs />
      <BangkokTukTukGuide />
      <BangkokJetLagTips />
      <BangkokGrabTips />
      <BangkokMarketGuide />
      <BangkokDrinkCultureGuide />
      <BangkokFashionShopping />
      <BangkokElectronics />
      <BangkokFoodDelivery />
      <BangkokFreeTourism />
      <BangkokHealthTips />
      <BangkokWeatherByMonth />
      <BangkokNightTrains />
      <BangkokCycleFriendly />
      <BangkokStreetShopping />
      <BangkokSpiceLevels />
      <BangkokTaxiEtiquette />
      <BangkokMoneyExchange />
      <BangkokShoeShops />
      <BangkokClothingAlteration />
      <BangkokTuktukExperience />
      <BangkokWatchShopping />
      <BangkokSilkShopping />
      <BangkokThriftStores />
      <BangkokPharmacyGuide />
      <BangkokSimCardGuide />
      <BangkokTransportGuide />
      <BangkokTailorMade />
      <BangkokCarRental />
      <BangkokSeniorTravel />
      <BangkokDeliveryApps />
      <BangkokTravelHacks />
      <BangkokAntiques />
      <BangkokNaturalWine />
      <BangkokBargainingGuide />
      <BangkokMalls />
      <MoneyGuide />
      <ThaiAllergenGuide />
      <StreetFoodDistrictMap />
      <BangkokAirportGuide />
      <TukTukRoutes />
      <GrabTips />
      <PublicTransitGuide />
      <SeasonalTip />
      <HiddenGemPicker />
      <BangkokHospitalsGuide />
      <EmergencyInfo />
      <BangkokEtiquette />
      <BangkokScamAlert />
      <SafetyTips />
      <LocalsChoice />

      {/* Daily Tip */}
      <BangkokTip />

      {/* Polls */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">Bangkok Travelers Agree or Disagree?</h2>
        <div className="space-y-4">
          <VersusVote
            question="Better Bangkok transport during rush hour?"
            a={{ id: "bts-win", label: "BTS Skytrain", emoji: "🚇", desc: "Fast, reliable, ฿15–฿50", url: "/activities/coworking", highlight: "Local choice" }}
            b={{ id: "taxi-win", label: "Taxi / Grab", emoji: "🚕", desc: "Door to door, AC, sometimes faster", url: "/activities/coworking" }}
          />
          <VersusVote
            question="Where to find Bangkok's best food?"
            a={{ id: "street-local", label: "Local street stalls", emoji: "🍜", desc: "Cheapest, freshest, no English menu", url: "/restaurants/cuisine/street_food", highlight: "Local vote" }}
            b={{ id: "market-local", label: "Weekend markets", emoji: "🥬", desc: "Chatuchak, Or Tor Kor, Bang Nam Pheung", url: "/restaurants/cuisine/thai" }}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Bangkok Travel Tips</h2>
        <div className="space-y-3">
          {LOCAL_FAQS.map((f, i) => (
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

      {/* CTA */}
      <div className="grid sm:grid-cols-3 gap-3">
        <a href="/quiz" className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition group">
          <span className="text-xl shrink-0">🎯</span>
          <div>
            <div className="font-bold text-xs group-hover:text-orange-700 transition">Bangkok Quiz</div>
            <div className="text-[10px] text-[var(--muted)]">Find your traveler type</div>
          </div>
        </a>
        <a href="/bingo" className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 hover:border-green-300 transition group">
          <span className="text-xl shrink-0">🏆</span>
          <div>
            <div className="font-bold text-xs group-hover:text-green-700 transition">Bucket List Bingo</div>
            <div className="text-[10px] text-[var(--muted)]">Track your journey</div>
          </div>
        </a>
        <a href="/activities/budget" className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition group">
          <span className="text-xl shrink-0">💸</span>
          <div>
            <div className="font-bold text-xs group-hover:text-blue-700 transition">Budget Guide</div>
            <div className="text-[10px] text-[var(--muted)]">Bangkok on a budget</div>
          </div>
        </a>
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Local Tips", url: "/local-tips" },
      ]} />
      <FaqJsonLd faqs={LOCAL_FAQS} />
    </div>
  );
}
