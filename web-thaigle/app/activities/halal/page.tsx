import type { Metadata } from "next";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { PhraseBook } from "@/components/PhraseBook";
import { LocalsChoice } from "@/components/LocalsChoice";
import { NearbyThings } from "@/components/NearbyThings";
import { BangkokHalalGuide } from "@/components/BangkokHalalGuide";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Halal-Friendly Activities in Bangkok (2026) — Muslim Traveler Guide",
  description:
    "Halal-friendly activities in Bangkok for Muslim travelers: Muay Thai, cooking classes, wellness, and more. Prayer facilities, halal dining, and trusted venues.",
  alternates: { canonical: "/activities/halal" },
  openGraph: { locale: "ar_SA" },
};

const HALAL_FAQS = [
  {
    q: "Are there halal-friendly activities in Bangkok?",
    a: "Yes. Many Bangkok activity venues welcome Muslim travelers. Muay Thai gyms, yoga studios, cooking classes, and diving operators all accept visitors regardless of religion. Cooking schools can accommodate halal dietary requirements with advance notice — just ask when booking.",
  },
  {
    q: "Is there halal food near Bangkok activity venues?",
    a: "Yes — Bangkok has an extensive halal food scene. Sukhumvit Soi 3/1 (Arab Street) has halal restaurants and mosques. Central Mosque (Masjid Al-Muhajirin) is in the Silom area. Most major shopping malls have halal food courts. The HALA-Q halal certification is used by certified restaurants.",
  },
  {
    q: "Are prayer facilities available near tourist activity venues?",
    a: "Bangkok has over 150 mosques. Key locations: Central Mosque (Silom), Haroon Mosque (near Asoke), Islamic Centre (Ramkhamhaeng), and prayer rooms in Suvarnabhumi Airport, Central World mall, and Emporium. Most major malls now have Muslim prayer rooms (surau).",
  },
  {
    q: "Can Muslim women participate in Bangkok activities?",
    a: "Yes. Thai culture is respectful of religious dress including hijab. Yoga studios, cooking classes, and wellness centers all accommodate modest dress. Female-only massage therapy is available at most spas by request — ask for a female therapist when booking.",
  },
  {
    q: "What is the best area of Bangkok for Muslim tourists?",
    a: "Sukhumvit Soi 3/1 (Arab Quarter) has halal restaurants, Middle Eastern cafés, and is close to BTS Nana. Ban Krua community near the National Stadium is Bangkok's oldest Muslim community. Chinatown (Yaowarat) adjacent neighborhoods have halal options too.",
  },
];

const CATEGORIES = [
  {
    slug: "muay-thai",
    icon: "🥊",
    label: "Muay Thai",
    halalNote: "Muay Thai gyms are open to all. No dietary restrictions in training. Many trainers speak English. Modest clothing accommodated.",
  },
  {
    slug: "cooking",
    icon: "👨‍🍳",
    label: "Thai Cooking Classes",
    halalNote: "Most cooking schools can prepare halal versions of Thai dishes with advance notice. Ask about pork-free and alcohol-free options when booking.",
  },
  {
    slug: "wellness",
    icon: "🧖",
    label: "Wellness & Spa",
    halalNote: "Female therapists available on request. Private treatment rooms standard. Many spas avoid alcohol-based products on request.",
  },
  {
    slug: "yoga-pilates",
    icon: "🧘",
    label: "Yoga & Pilates",
    halalNote: "Yoga studios welcome all. Modest clothing fine. Many studios have private changing rooms. No dietary aspect.",
  },
  {
    slug: "diving",
    icon: "🤿",
    label: "Diving",
    halalNote: "Diving is open to all. Halal snacks available from operators on request. Muslim-owned dive operators in Pattaya area.",
  },
  {
    slug: "coworking",
    icon: "💻",
    label: "Coworking",
    halalNote: "Coworking spaces are fully halal-compatible. Many have quiet prayer rooms or will accommodate prayer breaks.",
  },
];

export default function HalalActivitiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Halal-Friendly</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mb-3">
        Muslim Traveler Guide
      </div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">
          Halal-Friendly Activities in Bangkok
        </h1>
        <ShareButton title="Halal Activities Bangkok 2026" text="All activity categories open to Muslim travelers — what to know" url={`${SITE}/activities/halal`} line whatsapp />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Bangkok welcomes millions of Muslim tourists annually. All activity categories on Thaigle are open to Muslim travelers — here&apos;s what to know for each.
      </p>

      {/* Arabic language note */}
      <div className="mb-8 p-4 rounded-2xl bg-green-50 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🕌</span>
          <span className="font-black">Muslim-Friendly Bangkok</span>
        </div>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Bangkok has a large Muslim population and extensive halal infrastructure. The Thai government actively promotes Muslim-friendly tourism. Prayer rooms are available at Suvarnabhumi Airport (multiple terminals), Central World, MBK Center, and Emporium mall.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Halal food widely available", "150+ mosques", "Female therapists on request", "Modest dress respected"].map((badge) => (
            <span key={badge} className="text-xs px-2 py-0.5 rounded-full bg-green-200 text-green-900 font-bold">{badge}</span>
          ))}
        </div>
      </div>

      {/* Activity categories */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-5">Activities by Category</h2>
        <div className="space-y-4">
          {CATEGORIES.map((c) => (
            <div key={c.slug} className="border border-[var(--border)] rounded-2xl p-5 bg-white">
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg mb-1">{c.label}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{c.halalNote}</p>
                  <a
                    href={`/activities/${c.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition"
                  >
                    Browse {c.label} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Arabic page link */}
      <section className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
        <h2 className="font-black mb-2">عربي — Arabic Version</h2>
        <p className="text-sm text-[var(--muted)] mb-3">Visit our Arabic-language page for a fully localized Bangkok experience guide.</p>
        <a href="/ar" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition">
          الصفحة العربية →
        </a>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Muslim Travelers in Bangkok</h2>
        <div className="space-y-3">
          {HALAL_FAQS.map((f, i) => (
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

      {/* Halal food vs activities poll */}
      <section className="mb-8">
        <VersusVote
          question="What do you look for most in Bangkok as a Muslim traveler?"
          a={{ id: "halal-food", label: "Halal Food Options", emoji: "🍛", desc: "Restaurants certified halal, wide variety", url: "/for/halal", highlight: "Most requested" }}
          b={{ id: "halal-prayer", label: "Prayer Facilities", emoji: "🕌", desc: "Mosques nearby, prayer room access", url: "/activities/halal" }}
        />
      </section>

      <LocalsChoice />
      <BangkokHalalGuide />
      <NearbyThings context="restaurant" />
      <BangkokChallenge />
      <PhraseBook />
      <BangkokTip />

      <FaqJsonLd faqs={HALAL_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Halal-Friendly", url: "/activities/halal" },
      ]} />
    </div>
  );
}
