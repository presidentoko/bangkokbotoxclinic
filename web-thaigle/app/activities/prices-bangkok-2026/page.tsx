import type { Metadata } from "next";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { PriceCompare } from "@/components/PriceCompare";
import { ShareButton } from "@/components/ShareButton";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { BangkokTip } from "@/components/BangkokTip";
import { SavingsCounter } from "@/components/SavingsCounter";
import { CurrencyHelper } from "@/components/CurrencyHelper";
import { PriceQuickView } from "@/components/PriceQuickView";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Activity Prices 2026 — How Much Does Everything Cost?",
  description:
    "Complete Bangkok activity price guide 2026: Thai massage ฿200-3,000+, Muay Thai ฿300-800, cooking classes ฿800-3,500, yoga ฿400-800, coworking ฿250-600. Real prices, no tourist traps.",
  alternates: { canonical: "/activities/prices-bangkok-2026" },
};

const PRICE_FAQS = [
  {
    q: "How much does a Thai massage cost in Bangkok in 2026?",
    a: "Thai massage prices in Bangkok 2026: Street-level shops in residential areas: ฿150–฿300/hour. Mid-range tourist areas: ฿300–฿500/hour. Quality day spas: ฿600–฿1,200/hour. Luxury hotel spas: ฿1,500–฿4,000/hour. Oil massage costs 20–30% more than traditional Thai massage at the same venue. Always add ฿50–฿100 tip for good service.",
  },
  {
    q: "How much does Muay Thai training cost in Bangkok?",
    a: "Muay Thai training costs in Bangkok 2026: Local neighborhood gyms: ฿250–฿400/session. Tourist-oriented gyms: ฿500–฿800/session. High-end international gyms: ฿800–฿1,500/session. Monthly packages: ฿3,000–฿8,000 unlimited. Morning/afternoon two-a-day packages: ฿4,500–฿10,000/month. Single Klook session: ฿600–฿1,200 with equipment included.",
  },
  {
    q: "How much does a Thai cooking class cost in Bangkok?",
    a: "Thai cooking class prices Bangkok 2026: Basic half-day (3–4 hours, 3–4 dishes): ฿800–฿1,500/person. Premium half-day (with market visit): ฿1,200–฿2,000/person. Full-day class (market tour + 5–6 dishes): ฿1,500–฿3,500/person. Private class (2 people): ฿3,000–฿6,000. Classes include food you cook. Klook prices are often lower than booking direct.",
  },
  {
    q: "How much does yoga cost in Bangkok?",
    a: "Yoga class prices Bangkok 2026: Drop-in single class: ฿400–฿800. Tourist intro week pass: ฿800–฿1,500. Monthly unlimited membership: ฿2,500–฿8,000. Hot yoga classes: ฿500–฿900. Reformer Pilates single class: ฿600–฿1,500. Most studios accept walk-ins; LINE booking recommended for popular time slots.",
  },
  {
    q: "How much does coworking cost per day in Bangkok?",
    a: "Coworking day passes Bangkok 2026: Basic coworking: ฿200–฿350/day. Premium coworking with meeting room access: ฿350–฿600/day. Hot desk monthly: ฿3,500–฿8,000. Dedicated desk monthly: ฿6,000–฿15,000. Many spaces include unlimited coffee, fast WiFi (100Mbps–1Gbps), and air conditioning.",
  },
  {
    q: "Are Bangkok activity prices higher in tourist areas?",
    a: "Yes — significantly. Khao San Road and directly on Sukhumvit main road: 50–100% more than one street off. Silom and Sathorn mid-road: 20–30% more than side streets. General rule: the farther from BTS exits and tourist streets, the cheaper the price for equivalent quality. Local areas like On Nut, Ari, and Ekkamai residential streets offer best price-quality ratio.",
  },
];

type PriceRow = {
  level: string;
  price: string;
  what: string;
  color: string;
};

type ActivityPricing = {
  activity: string;
  icon: string;
  nicheSlug: string;
  unit: string;
  tipping: string;
  rows: PriceRow[];
  bookingTip: string;
};

const PRICING: ActivityPricing[] = [
  {
    activity: "Thai Massage",
    icon: "💆",
    nicheSlug: "spa",
    unit: "per hour",
    tipping: "฿50–฿100 standard tip for good service",
    rows: [
      { level: "Street-level / local area", price: "฿150–฿300", what: "Basic but often good quality", color: "text-green-700" },
      { level: "Tourist-area shops", price: "฿300–฿500", what: "Consistent quality, clean", color: "text-green-700" },
      { level: "Mid-range day spa", price: "฿500–฿1,200", what: "Professional setting, premium oils", color: "text-amber-700" },
      { level: "Luxury hotel spa", price: "฿1,500–฿4,000", what: "5-star environment, full amenities", color: "text-red-700" },
    ],
    bookingTip: "No booking needed at budget/mid-range spas. Book luxury hotel spas 2–3 days ahead.",
  },
  {
    activity: "Muay Thai Training",
    icon: "🥊",
    nicheSlug: "muay-thai",
    unit: "per session (90 min)",
    tipping: "No tipping expected",
    rows: [
      { level: "Local neighborhood gym", price: "฿250–฿400", what: "Authentic, train with locals", color: "text-green-700" },
      { level: "Tourist-friendly gym", price: "฿500–฿800", what: "English-speaking trainers, beginner programs", color: "text-green-700" },
      { level: "Premium international gym", price: "฿800–฿1,500", what: "Air-conditioned, nutritional guidance", color: "text-amber-700" },
      { level: "Klook package (includes equipment)", price: "฿600–฿1,200", what: "Easy booking, all-inclusive experience", color: "text-blue-700" },
    ],
    bookingTip: "Walk-in accepted at most gyms. Klook sessions get you equipment + English instruction.",
  },
  {
    activity: "Thai Cooking Class",
    icon: "👨‍🍳",
    nicheSlug: "cooking",
    unit: "per person",
    tipping: "Optional ฿50–฿100 for excellent instructors",
    rows: [
      { level: "Basic half-day class (3–4 hrs)", price: "฿800–฿1,500", what: "3–4 dishes, eat what you cook", color: "text-green-700" },
      { level: "Premium half-day (with market)", price: "฿1,200–฿2,000", what: "Or Tor Kor market tour + cooking", color: "text-amber-700" },
      { level: "Full-day class (6–7 hrs)", price: "฿1,500–฿3,500", what: "5–6 dishes, market visit, recipes", color: "text-amber-700" },
      { level: "Private class (2 people)", price: "฿3,000–฿6,000", what: "Personalized instruction, flexible menu", color: "text-red-700" },
    ],
    bookingTip: "Book 1–2 days ahead, especially for market-visit classes. Klook prices often 10–15% below direct.",
  },
  {
    activity: "Yoga / Pilates",
    icon: "🧘",
    nicheSlug: "yoga-pilates",
    unit: "per class",
    tipping: "No tipping expected",
    rows: [
      { level: "Drop-in yoga class", price: "฿400–฿800", what: "Standard vinyasa, hatha, or yin", color: "text-green-700" },
      { level: "Intro week pass", price: "฿800–฿1,500", what: "Unlimited classes for 1 week", color: "text-green-700" },
      { level: "Hot yoga class", price: "฿500–฿900", what: "37–42°C room, bring water", color: "text-amber-700" },
      { level: "Reformer Pilates class", price: "฿600–฿1,500", what: "Spring-resistance machine, max 6 per class", color: "text-amber-700" },
    ],
    bookingTip: "Many studios take walk-ins. LINE booking or online booking recommended for hot yoga and Reformer.",
  },
  {
    activity: "Wellness (Float / Sauna / Spa)",
    icon: "✨",
    nicheSlug: "wellness",
    unit: "per session",
    tipping: "Optional ฿100–฿200 for exceptional service",
    rows: [
      { level: "Infrared sauna session", price: "฿300–฿800", what: "30–60 min, private cabin", color: "text-green-700" },
      { level: "Float tank session", price: "฿1,200–฿2,500", what: "60–90 min sensory deprivation", color: "text-amber-700" },
      { level: "Full wellness day pass", price: "฿800–฿2,500", what: "Multiple facilities access", color: "text-amber-700" },
      { level: "Detox juice program (per day)", price: "฿1,500–฿3,500", what: "3–7 day programs available", color: "text-red-700" },
    ],
    bookingTip: "Float tanks require advance booking. Wellness centers in Thong Lor fill up on weekends.",
  },
  {
    activity: "Coworking Space",
    icon: "💻",
    nicheSlug: "coworking",
    unit: "per day / month",
    tipping: "No tipping",
    rows: [
      { level: "Day pass (hot desk)", price: "฿200–฿400", what: "WiFi, AC, coffee included", color: "text-green-700" },
      { level: "Premium day pass", price: "฿400–฿600", what: "Meeting room access, printing", color: "text-green-700" },
      { level: "Hot desk (monthly)", price: "฿3,500–฿7,000", what: "Unlimited access any desk", color: "text-amber-700" },
      { level: "Dedicated desk (monthly)", price: "฿6,000–฿15,000", what: "Your own desk, locker", color: "text-red-700" },
    ],
    bookingTip: "Many spaces offer 1-day free trials. Ask about weekly rates if staying 5–10 days.",
  },
  {
    activity: "Diving",
    icon: "🤿",
    nicheSlug: "diving",
    unit: "per experience",
    tipping: "฿100–฿200 for dive masters",
    rows: [
      { level: "Discover Scuba (intro, no cert)", price: "฿1,500–฿3,000", what: "20–40 min guided dive, no experience needed", color: "text-green-700" },
      { level: "PADI Open Water course", price: "฿8,000–฿15,000", what: "Full certification, 4 ocean dives", color: "text-amber-700" },
      { level: "Fun dive (certified divers)", price: "฿1,200–฿2,500", what: "2 dives, equipment included", color: "text-amber-700" },
      { level: "Day trip to Koh Larn / Pattaya", price: "฿2,500–฿5,000", what: "Transport + 2 dives + lunch", color: "text-red-700" },
    ],
    bookingTip: "Koh Tao is 7 hours by overnight train — much better diving and cheaper PADI courses.",
  },
];

export default function PricesBangkok2026Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Prices 2026</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3">
        Updated 2026
      </div>
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">
          Bangkok Activity Prices 2026
        </h1>
        <ShareButton
          title="Bangkok Activity Prices 2026 — Thaigle"
          text="Real Bangkok activity prices in 2026 — massage, Muay Thai, cooking, yoga, diving. No tourist traps."
          url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com"}/activities/prices-bangkok-2026`}
          line whatsapp
        />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Comprehensive price guide for all Bangkok activities — Thai massage, Muay Thai, cooking classes, yoga, coworking, and diving. Real prices across all budget levels.
      </p>

      {/* Price tables */}
      <section className="space-y-10 mb-10">
        {PRICING.map((p) => (
          <div key={p.nicheSlug} id={p.nicheSlug}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{p.icon}</span>
              <div>
                <h2 className="text-xl font-black">{p.activity}</h2>
                <span className="text-sm text-[var(--muted)]">Prices {p.unit} · Bangkok 2026</span>
              </div>
            </div>

            <div className="border border-[var(--border)] rounded-xl overflow-hidden mb-3">
              <div className="grid grid-cols-3 gap-0 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)]">
                <div>Level</div>
                <div className="text-center">Price</div>
                <div>What you get</div>
              </div>
              {p.rows.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 gap-0 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} ${i < p.rows.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                >
                  <div className="text-[var(--fg)] font-medium leading-tight pr-2">{row.level}</div>
                  <div className={`font-black tabular-nums text-center ${row.color}`}>{row.price}</div>
                  <div className="text-[var(--muted)] text-xs leading-tight pl-2">{row.what}</div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-xs text-[var(--muted)] mb-2">
              <span className="shrink-0 font-bold">Tipping:</span>
              <span>{p.tipping}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[var(--muted)] mb-3">
              <span className="shrink-0 font-bold">Booking tip:</span>
              <span>{p.bookingTip}</span>
            </div>

            <a
              href={`/activities/${p.nicheSlug}`}
              className="inline-flex items-center gap-1.5 text-sm text-orange-600 font-bold hover:underline"
            >
              Browse ranked {p.activity} venues →
            </a>
          </div>
        ))}
      </section>

      {/* Jump to section */}
      <aside className="mb-8 p-4 border border-[var(--border)] rounded-xl bg-white">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">Jump to activity</div>
        <div className="flex flex-wrap gap-2">
          {PRICING.map((p) => (
            <a
              key={p.nicheSlug}
              href={`#${p.nicheSlug}`}
              className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] hover:border-orange-400 hover:text-orange-700 transition"
            >
              {p.icon} {p.activity}
            </a>
          ))}
        </div>
      </aside>

      {/* Interactive price compare */}
      <section className="mb-8">
        <PriceCompare />
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">Price FAQ — Bangkok 2026</h2>
        <div className="space-y-3">
          {PRICE_FAQS.map((f, i) => (
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

      <PriceQuickView type="activity" />
      <CurrencyHelper />
      <SavingsCounter />
      <BudgetCalculator />
      <BangkokTip />
      <FaqJsonLd faqs={PRICE_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Bangkok Prices 2026", url: "/activities/prices-bangkok-2026" },
      ]} />
    </div>
  );
}
