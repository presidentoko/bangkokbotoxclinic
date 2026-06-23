import type { Metadata } from "next";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Perfect Weekend in Bangkok — 2-Day Activities Plan (2026)",
  description:
    "Best things to do in Bangkok for a weekend: Saturday Thai massage + Muay Thai, Sunday cooking class + rooftop. 48-hour Bangkok plan with real prices.",
  alternates: { canonical: "/activities/weekend-in-bangkok" },
};

const WEEKEND_FAQS = [
  {
    q: "What is the best way to spend a weekend in Bangkok?",
    a: "Saturday: Morning Muay Thai training (beginner session, 90 min), afternoon Thai massage (90 min), evening street food at Yaowarat or a rooftop cocktail bar. Sunday: Thai cooking class (half-day, 3 hours), afternoon at a temple or floating market, evening at a jazz bar or riverfront restaurant. This covers the iconic Bangkok experiences in 48 hours.",
  },
  {
    q: "How many activities can I realistically do in a Bangkok weekend?",
    a: "Realistically 2-3 activities per day in Bangkok given traffic. Morning activity + afternoon activity + evening dinner is a comfortable pace. Over-planning leads to expensive Grab rides and rushed experiences. Better to do 2 things well than 5 things rushed.",
  },
  {
    q: "Is 2 days enough to see Bangkok?",
    a: "Two days covers the essentials (Grand Palace, one food market, one temple, one massage, one activity). For activities specifically, 2 days is enough to experience: one authentic Thai massage, one Muay Thai or cooking session, and Bangkok's food scene. A 4-5 day trip allows more activity depth.",
  },
  {
    q: "How should I get around Bangkok for weekend activities?",
    a: "BTS Skytrain is the backbone — fast, cheap (฿16-52), air-conditioned, and avoids traffic. Grab (Thai Uber) for late nights and areas not on BTS. Avoid tuk-tuks for actual transport (expensive, hot, slow) — use them once for the experience, not for efficiency. MRT Metro covers the old city area well.",
  },
  {
    q: "What is the best neighborhood to stay in for a Bangkok weekend of activities?",
    a: "Sukhumvit (Asoke or Thong Lo BTS stop) is ideal — central, huge range of restaurants, close to quality spas and Muay Thai gyms. Silom is another excellent base with BTS access to activities across the city. Avoid Khao San Road as a base for activities — too far from most venues and transport is harder.",
  },
];

const WEEKEND_PLAN = {
  saturday: [
    {
      time: "7:00am",
      activity: "Morning Muay Thai training",
      detail: "Beginner session — most gyms have morning slots. No experience needed. 90 min.",
      nicheSlug: "muay-thai",
      cost: "฿300–฿600",
      icon: "🥊",
    },
    {
      time: "10:00am",
      activity: "Breakfast + explore local market",
      detail: "Or Tor Kor Market if open (Wed-Sun), or street food near your gym.",
      nicheSlug: null,
      cost: "฿100–฿200",
      icon: "🍜",
    },
    {
      time: "1:00pm",
      activity: "Traditional Thai massage",
      detail: "90-minute session. Book in advance for weekends — quality spas fill up.",
      nicheSlug: "spa",
      cost: "฿350–฿700",
      icon: "💆",
    },
    {
      time: "4:00pm",
      activity: "Rest + explore Chatuchak Weekend Market",
      detail: "Only open weekends. 15,000 stalls — clothes, art, plants, street food.",
      nicheSlug: null,
      cost: "฿0 entry + food",
      icon: "🛍",
    },
    {
      time: "7:00pm",
      activity: "Sunset rooftop cocktails + dinner",
      detail: "Vertigo (Banyan Tree), Sky Bar, or Moon Bar. Reserve ahead for weekends.",
      nicheSlug: null,
      cost: "฿800–฿2,000",
      icon: "🌆",
    },
  ],
  sunday: [
    {
      time: "8:00am",
      activity: "Yoga class or light walk in Lumphini Park",
      detail: "Drop-in yoga at a studio near your hotel. Or free morning exercise in the park.",
      nicheSlug: "yoga-pilates",
      cost: "฿0–฿600",
      icon: "🧘",
    },
    {
      time: "10:00am",
      activity: "Thai cooking class (half-day)",
      detail: "Learn 3-4 Thai dishes. You cook, you eat. 3 hours including instruction.",
      nicheSlug: "cooking",
      cost: "฿800–฿1,500",
      icon: "👨‍🍳",
    },
    {
      time: "2:00pm",
      activity: "Temple or floating market",
      detail: "Wat Arun by longtail boat, or Taling Chan Floating Market (Sunday only).",
      nicheSlug: null,
      cost: "฿100–฿300",
      icon: "🛕",
    },
    {
      time: "5:00pm",
      activity: "Spa or wellness session",
      detail: "Final massage or wellness treatment before your last evening.",
      nicheSlug: "spa",
      cost: "฿350–฿800",
      icon: "✨",
    },
    {
      time: "7:00pm",
      activity: "Final Bangkok dinner",
      detail: "Yaowarat (Chinatown) for street food, or a riverside restaurant.",
      nicheSlug: null,
      cost: "฿300–฿1,200",
      icon: "🍛",
    },
  ],
};

export default function WeekendBangkokPage() {
  const satCost = 2150;
  const sunCost = 2100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Weekend Plan</span>
      </nav>

      <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3">
        2-Day Guide
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-balance">
        Perfect Weekend in Bangkok
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        48 hours in Bangkok done right. Real venues, real prices. Not the tourist-trap version.
      </p>

      {/* Budget strip */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xl font-black text-orange-600">฿2,150+</div>
          <div className="text-xs text-[var(--muted)] mt-1">Saturday (activities)</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xl font-black text-orange-600">฿2,100+</div>
          <div className="text-xs text-[var(--muted)] mt-1">Sunday (activities)</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xl font-black text-orange-600">5 min</div>
          <div className="text-xs text-[var(--muted)] mt-1">avg BTS travel time</div>
        </div>
      </div>

      {/* Saturday */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm shrink-0">S</div>
          <h2 className="text-xl font-black">Saturday</h2>
        </div>
        <div className="relative pl-6 border-l-2 border-orange-200 space-y-4">
          {WEEKEND_PLAN.saturday.map((slot, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-orange-200 border-2 border-orange-400 top-1" />
              <div className="bg-white border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{slot.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-orange-700">{slot.time}</span>
                      <span className="font-black text-sm">{slot.activity}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">{slot.detail}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-700">{slot.cost}</span>
                      {slot.nicheSlug && (
                        <a href={`/activities/${slot.nicheSlug}`} className="text-xs text-orange-600 hover:underline">
                          Browse venues →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sunday */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-sm shrink-0">S</div>
          <h2 className="text-xl font-black">Sunday</h2>
        </div>
        <div className="relative pl-6 border-l-2 border-blue-200 space-y-4">
          {WEEKEND_PLAN.sunday.map((slot, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-blue-200 border-2 border-blue-400 top-1" />
              <div className="bg-white border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{slot.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-blue-700">{slot.time}</span>
                      <span className="font-black text-sm">{slot.activity}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">{slot.detail}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-700">{slot.cost}</span>
                      {slot.nicheSlug && (
                        <a href={`/activities/${slot.nicheSlug}`} className="text-xs text-orange-600 hover:underline">
                          Browse venues →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">FAQ — Bangkok Weekend</h2>
        <div className="space-y-3">
          {WEEKEND_FAQS.map((f, i) => (
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

      <FaqJsonLd faqs={WEEKEND_FAQS} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: "Weekend Plan", url: "/activities/weekend-in-bangkok" },
      ]} />
    </div>
  );
}
