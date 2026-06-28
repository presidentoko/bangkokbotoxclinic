import type { Metadata } from "next";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { WeatherWidget } from "@/components/WeatherWidget";
import { CurrencyHelper } from "@/components/CurrencyHelper";
import { PublicTransitGuide } from "@/components/PublicTransitGuide";
import { NearbyThings } from "@/components/NearbyThings";
import { WifiFinder } from "@/components/WifiFinder";
import { MonthlyBudgetGuide } from "@/components/MonthlyBudgetGuide";
import { SimCardGuide } from "@/components/SimCardGuide";
import { BangkokVisaGuide } from "@/components/BangkokVisaGuide";
import { BangkokTechScene } from "@/components/BangkokTechScene";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok for Digital Nomads — Coworking, Visa, Cost of Living (2026)",
  description:
    "Complete digital nomad guide to Bangkok: coworking spaces, visa options (LTR, Thailand VISA), internet speeds, cost breakdown, and best neighborhoods.",
  alternates: { canonical: "/activities/digital-nomad" },
};

const NOMAD_FAQS = [
  {
    q: "Is Bangkok a good city for digital nomads?",
    a: "Yes — Bangkok consistently ranks in the top 5 global digital nomad cities. Fast internet (True Move H 5G, AIS Fibre), affordable living (฿30,000–฿60,000/month all-in), excellent food, reliable transport (BTS Skytrain + MRT), and a huge international community. Time zone (UTC+7) overlaps with European mornings and Asian business hours.",
  },
  {
    q: "What visa can digital nomads use in Thailand?",
    a: "Options: (1) Tourist visa with border runs (not recommended long-term). (2) Thailand LTR Visa (Long-Term Resident) — 10-year visa for remote workers earning USD 80,000+/year. (3) DTV (Destination Thailand Visa) — 5-year multiple-entry for remote workers, freelancers, and entrepreneurs. Application at Thai embassies or via online portal. (4) Elite Visa — 5–20 year privilege visa for ฿900,000–฿2M.",
  },
  {
    q: "How much does it cost to live in Bangkok as a digital nomad?",
    a: "Budget: ฿35,000–฿50,000/month (basic condo, local food, coworking day passes). Comfortable: ฿60,000–฿90,000/month (modern condo with pool, mix of restaurants, gym). Expat comfortable: ฿100,000–฿150,000/month (Thong Lor/Ekkamai condo, daily restaurants, activities). Coworking: ฿3,500–฿8,000/month unlimited. Internet: ฿600–฿1,200/month fiber at home.",
  },
  {
    q: "Which areas of Bangkok are best for digital nomads?",
    a: "Ari/Phahon Yothin: Quieter, local feel, great coffee shops, best coworking density. Silom: Business district, fast internet, close to Lumphini Park. Ekkamai/Thong Lor: Trendy, lots of cafés and coworking, expensive. On Nut: More affordable than Sukhumvit, good BTS access. Avoid: Khao San Road (too touristy, unreliable WiFi).",
  },
  {
    q: "Is internet speed reliable in Bangkok for remote work?",
    a: "Yes. Bangkok has excellent internet infrastructure. AIS and True Move H offer 5G coverage throughout the city. Coworking spaces advertise 200Mbps–1Gbps speeds. Home fiber plans start at ฿600/month for 100Mbps. McDonald's, Starbucks, and most cafés have WiFi but reliability varies — coworking spaces are always more reliable.",
  },
];

const NEIGHBORHOODS = [
  { name: "Ari / Phahon Yothin", icon: "🌿", vibe: "Quiet, local, creative", coworking: "Highest density", price: "฿฿", bestFor: "Long-term stay, focus work" },
  { name: "Ekkamai / Thong Lor", icon: "✨", vibe: "Trendy, expat-heavy", coworking: "Premium spots", price: "฿฿฿", bestFor: "Networking, lifestyle" },
  { name: "Silom / Sathorn", icon: "🏢", vibe: "Business district", coworking: "Corporate spaces", price: "฿฿", bestFor: "Client meetings, corporate" },
  { name: "On Nut", icon: "💰", vibe: "Affordable, local", coworking: "Limited", price: "฿", bestFor: "Budget-conscious, long stays" },
];

export default function DigitalNomadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Digital Nomad</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
        2026 Guide
      </div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">
          Bangkok for Digital Nomads
        </h1>
        <ShareButton title="Bangkok Digital Nomad Guide 2026" text="Coworking, visa, neighborhoods, cost of living — real data" url={`${SITE}/activities/digital-nomad`} line whatsapp />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Everything you need to work remotely from Bangkok — coworking spaces, visa options, neighborhoods, and cost of living. Backed by real data.
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Coworking spaces", value: "98+" },
          { label: "Avg day pass", value: "฿350" },
          { label: "5G coverage", value: "City-wide" },
          { label: "LTR Visa duration", value: "10 years" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
            <div className="text-xl font-black text-orange-600">{s.value}</div>
            <div className="text-xs text-[var(--muted)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Neighborhoods */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">Best Bangkok Neighborhoods for Nomads</h2>
        <div className="space-y-3">
          {NEIGHBORHOODS.map((n) => (
            <div key={n.name} className="flex gap-4 p-4 border border-[var(--border)] rounded-xl bg-white">
              <div className="text-3xl shrink-0">{n.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-black text-base">{n.name}</h3>
                  <span className="text-xs font-bold text-[var(--muted)]">{n.price}</span>
                </div>
                <div className="text-xs text-[var(--muted)] mb-1">{n.vibe} · Coworking: {n.coworking}</div>
                <div className="text-xs font-bold text-green-700">Best for: {n.bestFor}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coworking CTA */}
      <section className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">💻</span>
          <div>
            <h2 className="font-black text-lg">Browse Coworking Spaces</h2>
            <p className="text-sm text-[var(--muted)]">98 spaces ranked by real Google reviews. Filter by 24h access, price, and location.</p>
          </div>
        </div>
        <a
          href="/activities/coworking"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition"
        >
          Find Coworking Spaces →
        </a>
      </section>

      {/* Monthly cost breakdown */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">Monthly Cost Breakdown (Mid-Range)</h2>
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          {[
            { item: "Studio condo (furnished, BTS access)", cost: "฿15,000–฿25,000" },
            { item: "Coworking space (unlimited monthly)", cost: "฿4,000–฿8,000" },
            { item: "Food (mix of local + restaurants)", cost: "฿8,000–฿15,000" },
            { item: "Transport (BTS + Grab)", cost: "฿2,000–฿4,000" },
            { item: "Phone data (AIS/True unlimited)", cost: "฿500–฿1,000" },
            { item: "Gym / yoga / activities", cost: "฿2,000–฿5,000" },
            { item: "TOTAL", cost: "฿31,500–฿58,000" },
          ].map((row, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} ${i === 6 ? "font-black border-t-2 border-[var(--border)]" : ""}`}
            >
              <span>{row.item}</span>
              <span className="font-bold tabular-nums">{row.cost}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">USD equivalent at ฿35/USD: ~$900–$1,660/month</p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Working Remotely from Bangkok</h2>
        <div className="space-y-3">
          {NOMAD_FAQS.map((f, i) => (
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

      {/* Nomad showdown */}
      <section className="mb-8">
        <VersusVote
          question="Where do you prefer to work in Bangkok?"
          a={{ id: "cowork", label: "Coworking Space", emoji: "💻", desc: "Fast WiFi, community, meeting rooms", url: "/activities/coworking", highlight: "Most productive" }}
          b={{ id: "cafe", label: "Specialty Cafe", emoji: "☕", desc: "Atmosphere, vibe, Instagram-worthy", url: "/restaurants/cuisine/cafe" }}
        />
      </section>

      <WeatherWidget />
      <BangkokTechScene />
      <BangkokVisaGuide />
      <SimCardGuide />
      <WifiFinder />
      <MonthlyBudgetGuide />
      <CurrencyHelper />
      <PublicTransitGuide />
      <NearbyThings context="activity" />
      <BangkokChallenge />
      <BangkokTip />

      <FaqJsonLd faqs={NOMAD_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Digital Nomad Guide", url: "/activities/digital-nomad" },
      ]} />
    </div>
  );
}
