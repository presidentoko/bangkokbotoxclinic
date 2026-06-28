import type { Metadata } from "next";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { FoodPairing } from "@/components/FoodPairing";
import { HighlightReel } from "@/components/HighlightReel";
import { BangkokCouplesActivities } from "@/components/BangkokCouplesActivities";
import { BangkokCoupleTips } from "@/components/BangkokCoupleTips";
import { BangkokChaoPhrayaHotels } from "@/components/BangkokChaoPhrayaHotels";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Activities for Couples in Bangkok (2026) — Romantic & Fun Things to Do",
  description:
    "Best things to do in Bangkok as a couple: couples massage, cooking classes, rooftop dinners, Muay Thai, cooking together. Ranked by real reviews.",
  alternates: { canonical: "/activities/couples" },
};

const COUPLES_FAQS = [
  {
    q: "What are the best romantic activities in Bangkok for couples?",
    a: "Top choices: (1) Couples Thai massage at a quality spa — ฿600–฿1,200 for a 90-min side-by-side session. (2) Thai cooking class together — you cook, you eat, you laugh. (3) Rooftop sunset cocktails (Vertigo at Banyan Tree, Sky Bar, Moon Bar). (4) Day trip to Ayutthaya by train. (5) Evening Chao Phraya river cruise with dinner.",
  },
  {
    q: "Is Bangkok a romantic city for couples?",
    a: "Yes — Bangkok blends romance with adventure well. Luxury spas, rooftop cocktail bars, candlelit floating restaurants, and temple sunsets are all accessible. It's also extremely affordable — a high-quality romantic evening for two (spa + dinner) costs ฿2,000–฿5,000, compared to ฿15,000+ in equivalent Western cities.",
  },
  {
    q: "What cooking class should couples do in Bangkok?",
    a: "Half-day cooking classes are ideal for couples — 3 hours, cook 3–4 dishes together, eat what you made. Top rated classes on Thaigle have 4.8+ stars. Full-day classes with a market tour add an adventure element. Costs: ฿1,600–฿3,500 for two. Book via Klook for discounts.",
  },
  {
    q: "Are couples spa packages available in Bangkok?",
    a: "Yes. Most mid-range and upscale spas offer couples rooms with two massage beds side by side. Couples packages typically include: foot soak, 60-90 min massage, herbal compress, and sometimes a flower petal bath. Costs: ฿2,000–฿6,000 for two. Hotel spas in Silom and Sukhumvit often have the best couples rooms.",
  },
  {
    q: "Can couples do Muay Thai training together?",
    a: "Absolutely — Muay Thai is a great couples activity. You train separately (no sparring with your partner), but the experience is shared. Beginner classes are non-contact and focus on technique and fitness. Many gyms have couples rates or package deals. It's a great break from typical tourist activities.",
  },
];

const COUPLE_ACTIVITIES = [
  {
    nicheSlug: "spa",
    icon: "💆",
    title: "Couples Massage",
    tagline: "Most romantic Bangkok activity",
    description: "Side-by-side treatment rooms at quality spas. Packages include foot soak, massage, and herbal compress.",
    priceRange: "฿2,000–฿6,000 for two",
    tip: "Book a couples package (not two separate sessions) for the side-by-side room experience.",
    romantic: 5,
  },
  {
    nicheSlug: "cooking",
    icon: "👨‍🍳",
    title: "Cooking Class Together",
    tagline: "Cook, eat, laugh",
    description: "Cook 3–4 Thai dishes side by side, then eat what you made. One of the highest-rated couple experiences in Bangkok.",
    priceRange: "฿1,600–฿3,500 for two",
    tip: "Half-day is ideal for couples — full focus on cooking and eating, not a long market walk.",
    romantic: 4,
  },
  {
    nicheSlug: "yoga-pilates",
    icon: "🧘",
    title: "Couples Yoga",
    tagline: "Try partner yoga",
    description: "Many studios offer partner yoga or couples classes. Improves connection and communication — and is genuinely fun.",
    priceRange: "฿800–฿1,600 for two",
    tip: "Look for 'partner yoga' or 'couples yoga' classes specifically — not just two people taking a regular class.",
    romantic: 4,
  },
  {
    nicheSlug: "wellness",
    icon: "🛁",
    title: "Wellness Experience",
    tagline: "Float tanks, herbal wraps, infrared",
    description: "Many wellness centers offer couples float sessions or herbal steam packages. Uniquely relaxing shared experience.",
    priceRange: "฿2,000–฿5,000 for two",
    tip: "Float tanks are surprisingly intimate — complete silence and sensory deprivation is a bonding experience.",
    romantic: 4,
  },
  {
    nicheSlug: "muay-thai",
    icon: "🥊",
    title: "Muay Thai Together",
    tagline: "Get sweaty together",
    description: "Train Muay Thai as a couple. Beginners welcome — no experience needed. Non-contact classes for first-timers.",
    priceRange: "฿600–฿1,600 for two",
    tip: "Many gyms offer private couple lessons if you want more personalized instruction.",
    romantic: 3,
  },
  {
    nicheSlug: "diving",
    icon: "🤿",
    title: "Discover Diving",
    tagline: "Underwater adventure",
    description: "Pattaya day trip with Discover Scuba for two. No experience needed — underwater silence is uniquely romantic.",
    priceRange: "฿3,000–฿6,000 for two",
    tip: "Book a private lesson for two instead of a group session — more personalized and more intimate.",
    romantic: 4,
  },
];

function RomanticMeter({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-sm ${i <= score ? "text-pink-500" : "text-gray-200"}`}>♥</span>
      ))}
    </div>
  );
}

export default function CouplesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Couples</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold mb-3">
        Couples Guide
      </div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">
          Best Activities for Couples in Bangkok
        </h1>
        <ShareButton title="Best Couples Activities Bangkok 2026" text="Ranked by real reviews — spas, cooking classes & more" url={`${SITE}/activities/couples`} line whatsapp />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Ranked by real reviews. Bangkok is one of the world&apos;s best couple destinations — world-class spas, cooking classes, and adventure at a fraction of Western prices.
      </p>

      {/* Quick price callout */}
      <div className="mb-8 p-5 rounded-2xl bg-pink-50 border border-pink-200">
        <div className="font-black text-lg mb-2">Romantic Bangkok for less than you think</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Couples spa package", price: "฿2,000–฿4,000" },
            { label: "Cooking class for 2", price: "฿1,600–฿2,500" },
            { label: "Rooftop cocktails for 2", price: "฿1,500–฿3,000" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center">
              <div className="text-sm font-black text-pink-700">{s.price}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity cards */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-5">Activities by Romantic Appeal</h2>
        <div className="space-y-4">
          {COUPLE_ACTIVITIES.sort((a, b) => b.romantic - a.romantic).map((a) => (
            <div key={a.nicheSlug} className="border border-[var(--border)] rounded-2xl p-5 bg-white">
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-black text-lg">{a.title}</h3>
                    <RomanticMeter score={a.romantic} />
                  </div>
                  <div className="text-xs font-bold text-pink-600 mb-2">{a.tagline}</div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">{a.description}</p>
                  <div className="text-sm font-bold mb-2">For two: {a.priceRange}</div>
                  <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                    Tip: {a.tip}
                  </div>
                  <a
                    href={`/activities/${a.nicheSlug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500 text-white text-xs font-bold hover:bg-pink-600 transition"
                  >
                    Browse {a.title} venues →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Couples in Bangkok</h2>
        <div className="space-y-3">
          {COUPLES_FAQS.map((f, i) => (
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

      {/* Bangkok Showdown — couples edition */}
      <section className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2">
          <span className="w-4 h-0.5 bg-current" />
          Couples Poll
          <span className="w-4 h-0.5 bg-current" />
        </div>
        <VersusVote
          question="Best couples activity in Bangkok?"
          a={{ id: "couples-massage", label: "Couples Massage", emoji: "💆‍♀️💆‍♂️", desc: "60-90 min side-by-side Thai massage", url: "/activities/spa", highlight: "Most romantic" }}
          b={{ id: "cooking-class", label: "Cooking Class", emoji: "👨‍🍳👩‍🍳", desc: "Cook Thai dishes together, take the recipes home", url: "/activities/cooking" }}
        />
        <div className="mt-4">
          <VersusVote
            question="For dinner on a date night?"
            a={{ id: "rooftop", label: "Rooftop Restaurant", emoji: "🌆", desc: "Views + cocktails + Bangkok skyline", url: "/for/views", highlight: "Most Instagrammable" }}
            b={{ id: "street-food", label: "Street Food Market", emoji: "🍜", desc: "Local experience, half the price", url: "/restaurants/cuisine/street_food" }}
          />
        </div>
      </section>

      <BangkokCouplesActivities />
      <BangkokChaoPhrayaHotels />
      <BangkokCoupleTips />
      <HighlightReel />
      <FoodPairing />
      <BudgetCalculator />
      <BangkokTip />

      <FaqJsonLd faqs={COUPLES_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Couples Guide", url: "/activities/couples" },
      ]} />
    </div>
  );
}
