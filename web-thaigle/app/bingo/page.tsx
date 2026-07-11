import type { Metadata } from "next";
import { Suspense } from "react";
import { BangkokBingo } from "@/components/BangkokBingo";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { DontMiss } from "@/components/DontMiss";
import { ActivityFinder } from "@/components/ActivityFinder";
import { TripType } from "@/components/TripType";
import { ThaiWordOfDay } from "@/components/ThaiWordOfDay";
import { BangkokCountdown } from "@/components/BangkokCountdown";
import { BangkokFoodGlossary } from "@/components/BangkokFoodGlossary";
import { NightlifeGuide } from "@/components/NightlifeGuide";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}): Promise<Metadata> {
  const { d } = await searchParams;
  return {
    title: "Bangkok Bucket List Bingo 2026 — Tick What You've Done | Thaigle",
    description: "Bangkok Bucket List: 16 must-do experiences — Thai massage, Muay Thai, Pad Thai, rooftop bar, cooking class & more. Tick what you've done and share your score.",
    alternates: { canonical: "/bingo" },
    openGraph: {
      title: "Bangkok Bucket List Bingo 🇹🇭 — Have You Done All 16?",
      description: "Tick what you've experienced in Bangkok — Thai massage, Muay Thai, street food after midnight, rooftop bar & 12 more. Share your score.",
      // Carries the `d` score payload through so a shared link renders a
      // personalized OG card (the opengraph-image convention alone can't
      // see the page's query string).
      images: [`/bingo/opengraph-image${d ? `?d=${encodeURIComponent(d)}` : ""}`],
    },
  };
}

export default function BingoPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Bangkok Bucket List Bingo", url: "/bingo" },
      ]} />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest mb-4">
            🇹🇭 Bangkok Bucket List
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            Bangkok Bucket List Bingo
          </h1>
          <p className="text-[var(--muted)] text-base max-w-md mx-auto mb-3">
            Tick everything you&apos;ve done in Bangkok. Share your score. How much of the city have you really seen?
          </p>
          <div className="flex justify-center">
            <ShareButton title="Bangkok Bucket List Bingo — Have You Done All 16?" text="Tick what you've experienced in Bangkok and share your score" url={`${SITE}/bingo`} line whatsapp />
          </div>
        </div>

        <Suspense fallback={null}>
          <BangkokBingo />
        </Suspense>

        {/* Don't Miss */}
        <DontMiss />
        <BangkokCountdown />
        <ThaiWordOfDay />
        <BangkokFoodGlossary />
        <NightlifeGuide />
        <TripType />
        <ActivityFinder />

        {/* Daily Challenge */}
        <div className="mt-8">
          <BangkokChallenge />
        </div>

        {/* Poll */}
        <div className="mt-10 mb-4">
          <VersusVote
            question="Bangkok bucket list — which experience was your favourite?"
            a={{ id: "food-experience", label: "A food experience", emoji: "🌶️", desc: "Street food, cooking class, or a truly great meal", url: "/restaurants/cuisine/thai" }}
            b={{ id: "activity", label: "An activity", emoji: "🥊", desc: "Muay Thai, Thai massage, yoga, or something unforgettable", url: "/activities" }}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <a href="/quiz" className="block p-5 rounded-2xl border border-[var(--border)] hover:border-orange-300 hover:shadow-md transition text-center group">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-black mb-1 group-hover:text-orange-600 transition">Take the Quiz</div>
            <div className="text-sm text-[var(--muted)]">Your personalized Bangkok type</div>
          </a>
          <a href="/for" className="block p-5 rounded-2xl border border-[var(--border)] hover:border-orange-300 hover:shadow-md transition text-center group">
            <div className="text-3xl mb-2">✨</div>
            <div className="font-black mb-1 group-hover:text-orange-600 transition">Browse by Occasion</div>
            <div className="text-sm text-[var(--muted)]">Date night, solo, budget & more</div>
          </a>
          <a href="/my-trip" className="block p-5 rounded-2xl border border-[var(--border)] hover:border-blue-300 hover:shadow-md transition text-center group">
            <div className="text-3xl mb-2">🗺️</div>
            <div className="font-black mb-1 group-hover:text-blue-600 transition">My Bangkok Trip</div>
            <div className="text-sm text-[var(--muted)]">Saved places & day plans</div>
          </a>
        </div>

        <div className="mt-6 text-center text-xs text-[var(--muted)]">
          All linked venues ranked by Trust Score from verified Google reviews. No paid placements.
        </div>
      </div>
    </>
  );
}
