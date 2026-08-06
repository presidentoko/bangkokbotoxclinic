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
import { GUIDE_TOPICS } from "@/lib/guideTopics";
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
import { BangkokTempleGuide } from "@/components/BangkokTempleGuide";
import { BangkokStreetArt } from "@/components/BangkokStreetArt";
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
import { BangkokMuayThaiGym } from "@/components/BangkokMuayThaiGym";
import { BangkokTravelHacks } from "@/components/BangkokTravelHacks";
import { BangkokCoWorking } from "@/components/BangkokCoWorking";
import { BangkokMovingGuide } from "@/components/BangkokMovingGuide";
import { BangkokMedicalCheckup } from "@/components/BangkokMedicalCheckup";
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

      {/* Bangkok A–Z — the topic blocks that used to render inline here (all
          253 of them, on one 6.5 MB page) now each have their own URL. */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">Bangkok A–Z</h2>
        <a
          href="/guide/bangkok"
          className="group block p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-orange-300 hover:shadow-md transition mb-4"
        >
          <h3 className="text-base font-bold leading-tight group-hover:text-orange-600 transition mb-1">
            All {GUIDE_TOPICS.length} practical Bangkok guides →
          </h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Visas, banking, BTS &amp; boats, temple etiquette, Songkran, street food, SIM cards, safety — indexed A–Z.
          </p>
        </a>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GUIDE_TOPICS.slice(0, 12).map((t) => (
            <a
              key={t.slug}
              href={`/guide/bangkok/${t.slug}`}
              className="flex gap-2 items-start p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 transition min-h-[44px]"
            >
              <span className="text-lg shrink-0">{t.emoji}</span>
              <span className="text-xs font-medium leading-snug">{t.title.split("—")[0].trim()}</span>
            </a>
          ))}
        </div>
      </section>

      <TopSearched />
      <BangkokMonthlyCalendar />
      <BangkokNeighborhoodProfile />
      <BangkokPhotographySpots />
      <BangkokTempleGuide />
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
      <BangkokMuayThaiGym />
      <BangkokCoWorking />
      <BangkokMovingGuide />
      <BangkokMedicalCheckup />
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
