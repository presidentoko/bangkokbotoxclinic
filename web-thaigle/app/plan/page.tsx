import type { Metadata } from "next";
import { PlannerClient } from "@/components/PlannerClient";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ThaiPhrase } from "@/components/ThaiPhrase";
import { BangkokTip } from "@/components/BangkokTip";
import { PrintPlan } from "@/components/PrintPlan";
import { WeatherWidget } from "@/components/WeatherWidget";
import { CurrencyHelper } from "@/components/CurrencyHelper";
import { PublicTransitGuide } from "@/components/PublicTransitGuide";
import { SeasonalTip } from "@/components/SeasonalTip";
import { WeekendPlan } from "@/components/WeekendPlan";
import { BangkokBudgetCalc } from "@/components/BangkokBudgetCalc";
import { BangkokDayPlanner } from "@/components/BangkokDayPlanner";

export const metadata: Metadata = {
  title: "Bangkok Day Planner — Build Your Perfect Day | Thaigle",
  description:
    "Plan your Bangkok day with restaurants, spas, Muay Thai, yoga, cooking classes and more. Save venues, share with friends, and book activities in one place.",
  alternates: { canonical: "/plan" },
  openGraph: {
    title: "Bangkok Day Planner — Build Your Perfect Day",
    description:
      "Plan eat · train · treat · learn · relax. Add Bangkok venues to your day plan, share with friends, and book activities.",
  },
};

const CATEGORIES = [
  { icon: "🍜", label: "Eat", href: "/restaurants/bangkok", desc: "3,200+ restaurants ranked by real reviews" },
  { icon: "🥊", label: "Train", href: "/activities/muay-thai", desc: "Muay Thai gyms from ฿300/session" },
  { icon: "💆", label: "Spa & Massage", href: "/activities/spa", desc: "Thai massage & spas from ฿200" },
  { icon: "💉", label: "Clinic", href: "/clinics", desc: "Aesthetic clinics — botox, fillers, facials" },
  { icon: "🦷", label: "Dental", href: "/dental", desc: "Dental care & cosmetic dentistry" },
  { icon: "👨‍🍳", label: "Cook", href: "/activities/cooking", desc: "Thai cooking classes from ฿800" },
  { icon: "🧘", label: "Relax", href: "/activities/yoga-pilates", desc: "Yoga & pilates studios" },
];

export default function PlanPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Day Planner", url: "/plan" },
      ]} />

      {/* SSR shell — visible to crawlers and JS-off users */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-4">
        <h1 className="text-3xl font-black mb-2">Bangkok Day Planner</h1>
        <p className="text-[var(--muted)] mb-6 text-sm">
          Build your perfect Bangkok day — eat, train, treat, learn, relax. Add venues from any page
          and your plan is saved automatically.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {CATEGORIES.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="border border-[var(--border)] rounded-xl p-4 bg-white hover:border-orange-300 hover:shadow-md transition"
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="font-bold text-sm">{c.label}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5 leading-tight">{c.desc}</div>
            </a>
          ))}
          <a
            href="/day-plan"
            className="border border-orange-200 rounded-xl p-4 bg-orange-50 hover:border-orange-400 hover:shadow-md transition col-span-full sm:col-auto"
          >
            <div className="text-2xl mb-1">📅</div>
            <div className="font-bold text-sm">Pre-built day plans</div>
            <div className="text-xs text-[var(--muted)] mt-0.5 leading-tight">25 curated itineraries by area & theme</div>
          </a>
        </div>
      </div>

      {/* Client planner — hydrates and takes over */}
      <PlannerClient />

      <div className="max-w-2xl mx-auto px-4 pb-8">
        <WeatherWidget />
        <SeasonalTip />
        <BangkokDayPlanner />
        <BangkokBudgetCalc />
        <WeekendPlan />
        <CurrencyHelper />
        <PublicTransitGuide />
        <ThaiPhrase />
        <BangkokTip />
        <div className="mt-4 flex justify-end">
          <PrintPlan label="🖨️ Print itinerary" />
        </div>
      </div>
    </>
  );
}
