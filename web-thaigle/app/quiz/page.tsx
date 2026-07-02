import type { Metadata } from "next";
import { BangkokQuiz } from "@/components/BangkokQuiz";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { BangkokTip } from "@/components/BangkokTip";
import { ShareButton } from "@/components/ShareButton";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { TravelChecklist } from "@/components/TravelChecklist";
import { HighlightReel } from "@/components/HighlightReel";
import { NeighborhoodMatcher } from "@/components/NeighborhoodMatcher";
import { ThaiWordOfDay } from "@/components/ThaiWordOfDay";
import { ThaiEtiquetteQuiz } from "@/components/ThaiEtiquetteQuiz";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const metadata: Metadata = {
  title: "What Kind of Bangkok Traveler Are You? — Quiz | Thaigle",
  description: "Take the 5-question Bangkok traveler quiz and get personalized restaurant & activity picks. Find your type: Foodie, Wellness Warrior, Muay Thai Pilgrim, Digital Nomad & more.",
  alternates: { canonical: "/quiz" },
  openGraph: {
    title: "What Kind of Bangkok Traveler Are You? 🇹🇭",
    description: "5 questions → your personalized Bangkok picks. No paid placements, just real Google review data.",
  },
};

export const dynamic = "force-static";

export default function QuizPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Bangkok Traveler Quiz", url: "/quiz" },
      ]} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-widest mb-4">
            🇹🇭 Bangkok Traveler Quiz
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            What kind of Bangkok traveler are you?
          </h1>
          <p className="text-[var(--muted)] text-base max-w-md mx-auto mb-4">
            5 questions. Get your traveler type + personalized picks from real Google review data.
          </p>
          <div className="flex justify-center">
            <ShareButton title="What Kind of Bangkok Traveler Are You? — Quiz" text="5 questions → your personalized Bangkok picks. Take the quiz!" url={`${SITE}/quiz`} line whatsapp />
          </div>
        </div>

        <BangkokQuiz />

        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          <a href="/bingo" className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 hover:border-green-300 transition group">
            <span className="text-2xl shrink-0">🏆</span>
            <div>
              <div className="font-bold text-sm group-hover:text-green-700 transition">Bangkok Bucket List</div>
              <div className="text-xs text-[var(--muted)]">Tick what you&apos;ve done in Bangkok</div>
            </div>
          </a>
          <a href="/my-trip" className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[var(--border)] hover:border-orange-300 transition group">
            <span className="text-2xl shrink-0">🗺️</span>
            <div>
              <div className="font-bold text-sm group-hover:text-orange-700 transition">My Bangkok Trip</div>
              <div className="text-xs text-[var(--muted)]">Saved places, day plans & bucket list</div>
            </div>
          </a>
        </div>

        <div className="mt-8">
          <HighlightReel />
          <NeighborhoodMatcher />
          <ThaiEtiquetteQuiz />
          <ThaiWordOfDay />
          <TravelChecklist />
          <BangkokChallenge />
          <BangkokTip />
        </div>

        <div className="mt-2 text-center text-xs text-[var(--muted)]">
          All recommendations ranked by Trust Score from verified Google reviews. No paid placements.
        </div>
      </div>
    </>
  );
}
