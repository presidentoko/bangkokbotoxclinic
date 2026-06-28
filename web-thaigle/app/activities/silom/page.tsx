import type { Metadata } from "next";
import { NICHES } from "@/lib/niches";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { NearbyLink } from "@/components/NearbyLink";
import { AreaGuide } from "@/components/AreaGuide";
import { OpenNow } from "@/components/OpenNow";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Activities in Silom & Sathorn Bangkok — Spa, Yoga, Muay Thai (2026)",
  description:
    "Best activities in Silom and Sathorn Bangkok: luxury spas, yoga studios, Muay Thai gyms. Business district with excellent transport and world-class wellness.",
  alternates: { canonical: "/activities/silom" },
};

const SILOM_FAQS = [
  {
    q: "What activities are available in Silom Bangkok?",
    a: "Silom and Sathorn offer: luxury hotel spas (Banyan Tree Spa, Mandarin Oriental Spa, JW Marriott Spa), quality Thai massage shops along Silom Road and side streets, yoga studios (several quality studios near BTS Chong Nonsi and Sala Daeng), and Lumphini Park for outdoor running and free exercise. It's Bangkok's premium wellness corridor with a business district feel.",
  },
  {
    q: "Is Silom good for a Thai massage?",
    a: "Excellent. Silom has options across all budgets: Street-level shops near Silom Soi 5-7: ฿200-350/hr. Mid-range branded chains: ฿400-700/hr. Hotel spas (Banyan Tree, Mandarin Oriental): ฿2,000-4,000+. The density means you can compare options easily. Avoid shops directly on Patpong area — tourist trap prices.",
  },
  {
    q: "Are there yoga studios in Silom?",
    a: "Several quality yoga studios are in the Silom/Sathorn area. Absolute Yoga has a Silom location. Other studios near BTS Chong Nonsi and Lumphini area offer morning and evening classes. Less yoga density than Thong Lo/Ekkamai but excellent quality studios. Drop-in: ฿500-800.",
  },
  {
    q: "What is near Lumphini Park for activities?",
    a: "Lumphini Park (BTS Sala Daeng / MRT Lumphini) offers: free outdoor exercise area (5:30-9am, evening), running track, paddleboats, and public yoga/tai chi classes at sunrise. Surrounding area: quality coworking spaces on Silom and Wireless Road, luxury hotel spas within walking distance, and Or Tor Kor market nearby for healthy food.",
  },
  {
    q: "What is the best luxury spa in Silom Bangkok?",
    a: "Top luxury spas in Silom/Sathorn: Vertigo Spa at Banyan Tree Hotel (rooftop pool + spa), Mandarin Oriental Spa (across river, accessible by hotel shuttle), JW Marriott Spa on Sukhumvit (nearby). All offer international standards at Thai prices — ฿2,000-5,000 for 90-minute treatments vs ฿6,000-15,000 equivalent in Singapore or Hong Kong.",
  },
];

const SILOM_HIGHLIGHTS = [
  { name: "Lumphini Park", icon: "🌳", desc: "Free outdoor exercise, running track, tai chi at sunrise. Best morning activity in Bangkok.", bts: "Sala Daeng / MRT Lumphini" },
  { name: "Silom Road spas", icon: "💆", desc: "High density of quality massage shops from budget to luxury. Best variety for spa-hopping.", bts: "Sala Daeng / Surasak" },
  { name: "Banyan Tree Spa", icon: "✨", desc: "Iconic rooftop spa experience. Infinity pool + treatments. Best for luxury splurge.", bts: "Sala Daeng (5 min walk)" },
  { name: "Patpong Night Market", icon: "🌙", desc: "Night market for browsing (tourist), BUT avoid massage shops here — overpriced.", bts: "Sala Daeng" },
];

export default function SilomActivitiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Silom</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-3">
        District Guide · BTS Silom Line
      </div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">
          Activities in Silom & Sathorn, Bangkok
        </h1>
        <ShareButton title="Activities in Silom & Sathorn Bangkok 2026" text="Luxury spas, yoga studios, Muay Thai in Bangkok's business district" url={`${SITE}/activities/silom`} line whatsapp />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Bangkok&apos;s business district meets luxury wellness corridor. Lumphini Park, world-class hotel spas, and quality yoga — all BTS-accessible.
      </p>

      {/* Highlights */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">Silom Area Highlights</h2>
        <div className="space-y-3">
          {SILOM_HIGHLIGHTS.map((h) => (
            <div key={h.name} className="flex gap-4 p-4 border border-[var(--border)] rounded-xl bg-white">
              <span className="text-3xl shrink-0">{h.icon}</span>
              <div className="min-w-0">
                <h3 className="font-black text-base mb-1">{h.name}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-1">{h.desc}</p>
                <span className="text-xs text-purple-600 font-bold">{h.bts}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity directory */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">Browse All Activity Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {NICHES.map((n) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="group flex items-center gap-3 p-4 border border-[var(--border)] rounded-xl bg-white hover:border-purple-300 hover:shadow-sm transition"
            >
              <span className="text-2xl shrink-0">{n.icon}</span>
              <span className="text-sm font-bold group-hover:text-purple-700 transition leading-tight">{n.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Silom Activities</h2>
        <div className="space-y-3">
          {SILOM_FAQS.map((f, i) => (
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

      {/* Other districts */}
      <section className="mb-6">
        <h2 className="text-lg font-black mb-3">Other Bangkok districts</h2>
        <div className="grid grid-cols-2 gap-2">
          <a href="/activities/sukhumvit" className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm font-medium hover:text-orange-700 transition text-center">
            Sukhumvit →
          </a>
          <a href="/activities" className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm font-medium hover:text-orange-700 transition text-center">
            All Activities →
          </a>
        </div>
      </section>

      <div className="mb-2 mt-2"><NearbyLink /></div>
      <OpenNow />
      <AreaGuide />
      <BangkokChallenge />
      <BangkokTip />

      {/* Poll */}
      <div className="mb-8">
        <VersusVote
          question="Silom & Sathorn — your vibe in Bangkok's business district?"
          a={{ id: "luxury-spa", label: "Luxury spa day", emoji: "💆", desc: "Hotel spa, premium massage, full relaxation package", url: "/activities/spa" }}
          b={{ id: "muay-thai-park", label: "Muay Thai + Lumphini Park", emoji: "🥊", desc: "Train hard, run in the park, eat street food outside", url: "/activities/muay-thai" }}
        />
      </div>

      <FaqJsonLd faqs={SILOM_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Silom", url: "/activities/silom" },
      ]} />
    </div>
  );
}
