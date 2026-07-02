import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { OCCASIONS, OCCASION_NAV, findOccasion } from "@/lib/occasions";
import type { OccasionSlug } from "@/lib/occasions";
import { NICHES, loadNicheDb, topNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { BreadcrumbJsonLd, FaqJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { LocalsChoice } from "@/components/LocalsChoice";
import { InstagramSpots } from "@/components/InstagramSpots";
import { NightlifeGuide } from "@/components/NightlifeGuide";
import { RooftopBars } from "@/components/RooftopBars";
import { SeasonalTip } from "@/components/SeasonalTip";
import { BangkokFamilyGuide } from "@/components/BangkokFamilyGuide";
import { BangkokCoupleTips } from "@/components/BangkokCoupleTips";
import { BangkokLGBTGuide } from "@/components/BangkokLGBTGuide";
import { BangkokSoloTravelGuide } from "@/components/BangkokSoloTravelGuide";
import { BangkokRooftopBars } from "@/components/BangkokRooftopBars";
import { BangkokLuxuryGuide } from "@/components/BangkokLuxuryGuide";
import { BangkokKidsActivities } from "@/components/BangkokKidsActivities";
import { BangkokRooftopRestaurants } from "@/components/BangkokRooftopRestaurants";
import { BangkokGroupDining } from "@/components/BangkokGroupDining";
import { BangkokWeddingGuide } from "@/components/BangkokWeddingGuide";
import { BangkokFamilyHotels } from "@/components/BangkokFamilyHotels";
import { BangkokSoloActivities } from "@/components/BangkokSoloActivities";
import { BangkokChildrenMuseum } from "@/components/BangkokChildrenMuseum";
import { BangkokDateNightGuide } from "@/components/BangkokDateNightGuide";
import { BangkokPrivateVilla } from "@/components/BangkokPrivateVilla";
import { BangkokBusinessTips } from "@/components/BangkokBusinessTips";
import { BangkokBirthdayGuide } from "@/components/BangkokBirthdayGuide";
import { BangkokWeddingVenue } from "@/components/BangkokWeddingVenue";
import { BangkokGraduationGuide } from "@/components/BangkokGraduationGuide";
import { BangkokChildrenActivities } from "@/components/BangkokChildrenActivities";
import { BangkokGirlsTrip } from "@/components/BangkokGirlsTrip";
import { BangkokRetirementCelebration } from "@/components/BangkokRetirementCelebration";
import { BangkokAnniversary } from "@/components/BangkokAnniversary";
import { BangkokBachelorParty } from "@/components/BangkokBachelorParty";
import { BangkokTeamBuilding } from "@/components/BangkokTeamBuilding";
import { BangkokGraduationParty } from "@/components/BangkokGraduationParty";
import { BangkokFarewellParty } from "@/components/BangkokFarewellParty";
import { BangkokFamilyReunion } from "@/components/BangkokFamilyReunion";
import { BangkokSeniorTravel } from "@/components/BangkokSeniorTravel";
import { BangkokHoneymoon } from "@/components/BangkokHoneymoon";
import { BangkokDigitalNomad } from "@/components/BangkokDigitalNomad";
import { BangkokBabyShower } from "@/components/BangkokBabyShower";
import { BangkokCorporateEvents } from "@/components/BangkokCorporateEvents";
import { BangkokCatering } from "@/components/BangkokCatering";
import { BangkokPoolVilla } from "@/components/BangkokPoolVilla";
import { BangkokPoolParty } from "@/components/BangkokPoolParty";
import { BangkokCelebration } from "@/components/BangkokCelebration";
import { BangkokHighTea } from "@/components/BangkokHighTea";
import { BangkokNetworking } from "@/components/BangkokNetworking";
import { BangkokGroupTravel } from "@/components/BangkokGroupTravel";
import { BangkokProposal } from "@/components/BangkokProposal";
import { BangkokWellnessRetreat } from "@/components/BangkokWellnessRetreat";
import { BangkokSchoolTrip } from "@/components/BangkokSchoolTrip";
import { BangkokConferenceVenue } from "@/components/BangkokConferenceVenue";
import { BangkokMovingGuide } from "@/components/BangkokMovingGuide";
import { BangkokPhotoshoot } from "@/components/BangkokPhotoshoot";
import { BangkokPrenatalCare } from "@/components/BangkokPrenatalCare";
import { BangkokParenting } from "@/components/BangkokParenting";
import { BangkokLanguageExchange } from "@/components/BangkokLanguageExchange";
import { BangkokMedicalCheckup } from "@/components/BangkokMedicalCheckup";
import type { Metadata } from "next";

type VersusData = { question: string; a: Parameters<typeof VersusVote>[0]["a"]; b: Parameters<typeof VersusVote>[0]["b"] };

const OCCASION_VERSUS: Partial<Record<OccasionSlug, VersusData>> = {
  "date-night": {
    question: "Best date night spot in Bangkok?",
    a: { id: "rooftop-date", label: "Rooftop Restaurant", emoji: "🌆", desc: "Views, cocktails, skyline", url: "/for/views", highlight: "Most romantic" },
    b: { id: "intimate-date", label: "Intimate Fine Dining", emoji: "🕯️", desc: "Quiet, focused on food & each other", url: "/for/date-night" },
  },
  "group-dinner": {
    question: "Best setting for a Bangkok group dinner?",
    a: { id: "bbq-group", label: "Korean / Japanese BBQ", emoji: "🥩", desc: "Interactive, loud, everyone loves it", url: "/restaurants/cuisine/korean", highlight: "Most fun" },
    b: { id: "thai-group", label: "Thai Family-style", emoji: "🍛", desc: "Share dishes, authentic, affordable", url: "/restaurants/cuisine/thai" },
  },
  "budget": {
    question: "Best cheap eat in Bangkok?",
    a: { id: "street-food-bud", label: "Street Food Stalls", emoji: "🍜", desc: "Pad Thai, som tam, khao man gai", url: "/restaurants/cuisine/street_food", highlight: "Under ฿100" },
    b: { id: "food-court-bud", label: "Mall Food Court", emoji: "🏬", desc: "AC, variety, reliable quality", url: "/restaurants/cuisine/thai" },
  },
  "solo": {
    question: "Best solo activity in Bangkok?",
    a: { id: "spa-solo", label: "Thai Massage", emoji: "💆", desc: "Relax, recharge, affordable luxury", url: "/activities/spa", highlight: "Most popular" },
    b: { id: "cowork-solo", label: "Coworking + explore", emoji: "💻", desc: "Work during day, explore at night", url: "/activities/coworking" },
  },
  "views": {
    question: "Best Bangkok views?",
    a: { id: "rooftop-bar", label: "Rooftop Bar", emoji: "🍸", desc: "Sunset cocktails + 360° skyline", url: "/for/views", highlight: "Most Instagrammable" },
    b: { id: "river-cruise", label: "Chao Phraya Cruise", emoji: "⛵", desc: "Moving city lights, unique perspective", url: "/for/date-night" },
  },
};


export const dynamic = "force-static";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ occasion: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ occasion: string }> }): Promise<Metadata> {
  const { occasion } = await params;
  const occ = findOccasion(occasion);
  if (!occ) return { title: "Not Found" };
  return {
    title: occ.metaTitle,
    description: occ.metaDescription,
    alternates: { canonical: `/for/${occ.slug}` },
    openGraph: {
      title: `${occ.emoji} ${occ.title}`,
      description: occ.metaDescription,
    },
  };
}

export default async function OccasionPage({ params }: { params: Promise<{ occasion: string }> }) {
  const { occasion } = await params;
  const occ = findOccasion(occasion);
  if (!occ) notFound();

  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);

  const filtered = db.restaurants
    .filter((r) => occ.filterFn(r))
    .map((r) => ({ ...r, _score: r.trust_score + (occ.sortBonus?.(r) ?? 0) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 40);

  // Load related activity niches if any
  const nicheData = occ.relatedNiches
    ? await Promise.all(
        occ.relatedNiches.map(async (slug) => {
          const n = NICHES.find((x) => x.slug === slug);
          if (!n) return null;
          const db2 = await loadNicheDb(slug as NicheSlug);
          return { ...n, top: topNichePlaces(db2.places, 5) };
        })
      ).then((r) => r.filter(Boolean))
    : [];

  const faqs = [
    {
      q: `What are the best places for ${occ.title.toLowerCase()}?`,
      a: `We've ranked ${filtered.length} venues for ${occ.title.toLowerCase()} based on real Google review data. The top picks are ${filtered.slice(0, 3).map((r) => r.name).join(", ")} — all with Trust Scores above 60 from thousands of verified reviews.`,
    },
    {
      q: `How do I find the best spots for ${occ.slug.replace(/-/g, " ")} in Bangkok?`,
      a: occ.tip ?? `Thaigle ranks venues by Trust Score — a metric combining Google rating, review volume, Local Guide ratio, and reviewer authority. All ${filtered.length} results here are filtered specifically for ${occ.title.toLowerCase()}.`,
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Perfect For", url: "/for" },
        { name: occ.title, url: `/for/${occ.slug}` },
      ]} />
      <CollectionPageJsonLd
        name={occ.title}
        description={occ.metaDescription}
        url={`/for/${occ.slug}`}
        items={filtered.slice(0, 20)}
        slugMap={slugMap}
      />
      <FaqJsonLd faqs={faqs} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--muted)] mb-5 flex items-center gap-1.5 flex-wrap">
          <a href="/" className="hover:text-black">Home</a>
          <span>›</span>
          <a href="/for" className="hover:text-black">Perfect For</a>
          <span>›</span>
          <span>{occ.title}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">{occ.emoji}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">{occ.title}</h1>
                  <p className="text-[var(--muted)] mt-1">{occ.subtitle}</p>
                </div>
              </div>
            </div>
            <ShareButton
              title={occ.title}
              text={`${occ.subtitle} — ranked by real Google reviews`}
              url={`${SITE}/for/${occ.slug}`}
              whatsapp
              line
            />
          </div>

          {occ.tip && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex gap-3">
              <span className="text-lg shrink-0">💡</span>
              <span>{occ.tip}</span>
            </div>
          )}
        </div>

        {/* Occasion nav pills */}
        <div className="flex gap-2 flex-wrap mb-8 pb-4 border-b border-[var(--border)]">
          {OCCASION_NAV.map((o) => (
            <a
              key={o.slug}
              href={`/for/${o.slug}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                o.slug === occ.slug
                  ? "bg-orange-500 text-white"
                  : "border border-[var(--border)] bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              <span>{o.emoji}</span>
              {o.label}
            </a>
          ))}
        </div>

        {/* Restaurant results */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-black">
              {filtered.length} restaurants · ranked by Trust Score
            </h2>
          </div>
          <div className="space-y-2">
            {filtered.map((r, i) => {
              const entry = slugMap[r.id];
              if (!entry) return null;
              return (
                <a
                  key={r.id}
                  href={restaurantUrl(entry)}
                  className="flex items-center gap-3 p-3 border rounded-xl hover:border-orange-400 hover:shadow-sm transition bg-white group"
                >
                  <span className="font-bold text-[var(--muted)] w-6 text-sm shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate group-hover:text-orange-700 transition">{r.name}</div>
                    <div className="text-xs text-[var(--muted)] flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span>📍 {r.district || r.city_label}</span>
                      <span>·</span>
                      <span className="text-yellow-700 font-medium">★ {r.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{r.total_reviews.toLocaleString()} reviews</span>
                      {r.cuisines.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{CUISINE_ICONS[r.cuisines[0]] ?? ""} {CUISINE_LABELS[r.cuisines[0]] ?? r.cuisines[0]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-black text-orange-600">Trust {r.trust_score}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Related activities */}
        {nicheData.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-black mb-4">Related activities</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {nicheData.map((n) => n && (
                <a key={n.slug} href={`/activities/${n.slug}`}
                  className="block border border-[var(--border)] rounded-2xl p-5 bg-white hover:border-orange-300 hover:shadow-md transition group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{n.icon}</span>
                    <div>
                      <div className="font-black group-hover:text-orange-700 transition">{n.label}</div>
                      <div className="text-xs text-[var(--muted)]">{n.top.length}+ venues</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {n.top.slice(0, 3).map((p) => (
                      <div key={p.id} className="text-sm text-[var(--muted)] flex items-center gap-1.5">
                        <span className="text-yellow-700">★ {(p.rating ?? 0).toFixed(1)}</span>
                        <span className="truncate">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-black mb-4">Frequently asked</h2>
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

        <SeasonalTip />
        <LocalsChoice />
        {occasion === "families" && <BangkokFamilyGuide />}
        {(occasion === "couples" || occasion === "honeymoon") && <BangkokCoupleTips />}
        {occasion === "lgbtq" && <BangkokLGBTGuide />}
        {(occasion === "date-night" || occasion === "couples" || occasion === "honeymoon") && <BangkokRooftopBars />}
        {(occasion === "honeymoon" || occasion === "special-occasion") && <BangkokLuxuryGuide />}
        {occasion === "families" && <BangkokKidsActivities />}
        {occasion === "families" && <BangkokFamilyHotels />}
        {(occasion === "solo" || occasion === "solo-travel") && <BangkokSoloActivities />}
        {occasion === "families" && <BangkokChildrenMuseum />}
        {(occasion === "date-night" || occasion === "couples") && <BangkokDateNightGuide />}
        {(occasion === "honeymoon" || occasion === "special-occasion" || occasion === "anniversary") && <BangkokPrivateVilla />}
        {(occasion === "business" || occasion === "corporate") && <BangkokBusinessTips />}
        {occasion === "birthday" && <BangkokBirthdayGuide />}
        {(occasion === "wedding" || occasion === "engagement") && <BangkokWeddingVenue />}
        {(occasion === "graduation" || occasion === "achievement") && <BangkokGraduationGuide />}
        {(occasion === "families" || occasion === "kids") && <BangkokChildrenActivities />}
        {(occasion === "girls-trip" || occasion === "bachelorette" || occasion === "women") && <BangkokGirlsTrip />}
        {(occasion === "retirement" || occasion === "milestone") && <BangkokRetirementCelebration />}
        {(occasion === "anniversary" || occasion === "romantic") && <BangkokAnniversary />}
        {(occasion === "bachelor" || occasion === "bachelorette") && <BangkokBachelorParty />}
        {(occasion === "corporate" || occasion === "team-building") && <BangkokTeamBuilding />}
        {(occasion === "graduation" || occasion === "graduation-party") && <BangkokGraduationParty />}
        {(occasion === "farewell" || occasion === "going-away" || occasion === "farewell-party") && <BangkokFarewellParty />}
        {(occasion === "family-reunion" || occasion === "family-gathering") && <BangkokFamilyReunion />}
        {(occasion === "senior" || occasion === "elderly" || occasion === "60plus") && <BangkokSeniorTravel />}
        {(occasion === "honeymoon" || occasion === "newlyweds") && <BangkokHoneymoon />}
        {(occasion === "digital-nomad" || occasion === "remote-work") && <BangkokDigitalNomad />}
        {(occasion === "baby-shower" || occasion === "baby-party") && <BangkokBabyShower />}
        {(occasion === "corporate" || occasion === "conference" || occasion === "team-outing") && <BangkokCorporateEvents />}
        {(occasion === "catering" || occasion === "private-chef" || occasion === "private-dinner") && <BangkokCatering />}
        {(occasion === "pool-party" || occasion === "villa" || occasion === "staycation") && <BangkokPoolVilla />}
        {(occasion === "pool-event" || occasion === "day-party" || occasion === "summer-party") && <BangkokPoolParty />}
        {(occasion === "celebration" || occasion === "milestone" || occasion === "special") && <BangkokCelebration />}
        {(occasion === "afternoon-tea" || occasion === "high-tea" || occasion === "ladies-lunch") && <BangkokHighTea />}
        {(occasion === "networking" || occasion === "business-mixer" || occasion === "professional") && <BangkokNetworking />}
        {(occasion === "group-trip" || occasion === "group-travel" || occasion === "friends-trip") && <BangkokGroupTravel />}
        {(occasion === "proposal" || occasion === "engagement" || occasion === "will-you-marry-me") && <BangkokProposal />}
        {(occasion === "wellness" || occasion === "detox" || occasion === "self-care") && <BangkokWellnessRetreat />}
        {(occasion === "school-trip" || occasion === "educational-trip" || occasion === "student-excursion") && <BangkokSchoolTrip />}
        {(occasion === "conference" || occasion === "convention" || occasion === "mice") && <BangkokConferenceVenue />}
        {(occasion === "moving-to-bangkok" || occasion === "relocation" || occasion === "expat-move") && <BangkokMovingGuide />}
        {(occasion === "photoshoot" || occasion === "photo-shoot" || occasion === "content-creation") && <BangkokPhotoshoot />}
        {(occasion === "prenatal" || occasion === "pregnancy" || occasion === "maternity") && <BangkokPrenatalCare />}
        {(occasion === "parenting" || occasion === "expat-family" || occasion === "kids-activities") && <BangkokParenting />}
        {(occasion === "language-exchange" || occasion === "language-learning" || occasion === "thai-learning") && <BangkokLanguageExchange />}
        {(occasion === "medical-checkup" || occasion === "health-screening" || occasion === "health-tourism") && <BangkokMedicalCheckup />}
        {(occasion === "date-night" || occasion === "special-occasion") && <BangkokRooftopRestaurants />}
        {(occasion === "group-dinner" || occasion === "birthday") && <BangkokGroupDining />}
        {(occasion === "honeymoon" || occasion === "weddings") && <BangkokWeddingGuide />}
        {(occasion === "solo" || occasion === "women") && <BangkokSoloTravelGuide />}
        <NightlifeGuide />
        <RooftopBars />
        <InstagramSpots />

        {/* Daily Challenge */}
        <BangkokChallenge />

        {/* Daily Tip */}
        <BangkokTip />

        {/* Versus vote (occasion-specific) */}
        {OCCASION_VERSUS[occ.slug] && (
          <section className="mt-4">
            <VersusVote
              question={OCCASION_VERSUS[occ.slug]!.question}
              a={OCCASION_VERSUS[occ.slug]!.a}
              b={OCCASION_VERSUS[occ.slug]!.b}
            />
          </section>
        )}

        {/* Quiz + Bingo CTAs */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <a href="/quiz" className="flex items-center gap-4 p-5 rounded-2xl bg-orange-50 border border-orange-200 hover:shadow-md hover:border-orange-300 transition group">
            <span className="text-3xl shrink-0">🎯</span>
            <div>
              <div className="font-black group-hover:text-orange-700 transition">Take the Bangkok Quiz</div>
              <div className="text-sm text-[var(--muted)]">5 questions → your personalized traveler type</div>
            </div>
          </a>
          <a href="/bingo" className="flex items-center gap-4 p-5 rounded-2xl bg-green-50 border border-green-200 hover:shadow-md hover:border-green-300 transition group">
            <span className="text-3xl shrink-0">🏆</span>
            <div>
              <div className="font-black group-hover:text-green-700 transition">Bangkok Bucket List</div>
              <div className="text-sm text-[var(--muted)]">Tick what you&apos;ve done, share your score</div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
