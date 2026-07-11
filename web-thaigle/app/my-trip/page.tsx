import type { Metadata } from "next";
import { Suspense } from "react";
import { BangkokStats } from "@/components/BangkokStats";
import { SavedListHome } from "@/components/SaveButton";
import { RecentlyViewedHome } from "@/components/RecentlyViewedHome";
import { BangkokBingo } from "@/components/BangkokBingo";
import { BangkokTip } from "@/components/BangkokTip";
import { ThaiPhrase } from "@/components/ThaiPhrase";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { WeatherWidget } from "@/components/WeatherWidget";
import { CompareCard } from "@/components/CompareCard";
import { WishlistHighlight } from "@/components/WishlistHighlight";
import { NearbyThings } from "@/components/NearbyThings";
import { SeasonalTip } from "@/components/SeasonalTip";
import { HiddenGemPicker } from "@/components/HiddenGemPicker";
import { ThaiWordOfDay } from "@/components/ThaiWordOfDay";
import { BangkokPhotoSpots } from "@/components/BangkokPhotoSpots";
import { SharedWishlistBanner } from "@/components/SharedWishlist";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "My Bangkok Trip — Saved Places, Bingo & Quiz | Thaigle",
  description: "Your personal Bangkok travel hub on Thaigle. See saved places, bucket list progress, quiz result, and recently viewed venues.",
  robots: "noindex",
};

export default function MyTripPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>My Trip</span>
      </nav>

      <h1 className="text-3xl font-black tracking-tight mb-2">My Bangkok Trip</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Your personal travel hub — saved places, quiz result, and bucket list. All stored locally, no account needed.
      </p>

      <Suspense fallback={null}>
        <SharedWishlistBanner />
      </Suspense>

      {/* Live stats */}
      <BangkokStats />

      {/* Saved wishlist */}
      <SavedListHome />

      {/* Recently viewed */}
      <WishlistHighlight />
      <RecentlyViewedHome />

      {/* Compare saved places */}
      <CompareCard />

      {/* Quick links */}
      <div className="space-y-3 mt-6">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Plan your trip</div>

        <a href="/quiz" className="flex items-center gap-4 p-4 bg-white border border-[var(--border)] rounded-2xl hover:border-orange-300 transition group">
          <span className="text-2xl shrink-0">🎯</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm group-hover:text-orange-600 transition">Bangkok Traveler Quiz</div>
            <div className="text-xs text-[var(--muted)]">5 questions → personalized picks</div>
          </div>
          <span className="text-[var(--muted)] group-hover:translate-x-1 transition shrink-0 text-sm">→</span>
        </a>

        <a href="/day-plan" className="flex items-center gap-4 p-4 bg-white border border-[var(--border)] rounded-2xl hover:border-blue-300 transition group">
          <span className="text-2xl shrink-0">📅</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm group-hover:text-blue-600 transition">Bangkok Day Plans</div>
            <div className="text-xs text-[var(--muted)]">25 curated itineraries by area &amp; theme</div>
          </div>
          <span className="text-[var(--muted)] group-hover:translate-x-1 transition shrink-0 text-sm">→</span>
        </a>

        <a href="/for" className="flex items-center gap-4 p-4 bg-white border border-[var(--border)] rounded-2xl hover:border-pink-300 transition group">
          <span className="text-2xl shrink-0">✨</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm group-hover:text-pink-600 transition">Perfect For...</div>
            <div className="text-xs text-[var(--muted)]">Date nights, groups, solo, budget &amp; more</div>
          </div>
          <span className="text-[var(--muted)] group-hover:translate-x-1 transition shrink-0 text-sm">→</span>
        </a>

        <a href="/local-tips" className="flex items-center gap-4 p-4 bg-white border border-[var(--border)] rounded-2xl hover:border-teal-300 transition group">
          <span className="text-2xl shrink-0">🗺️</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm group-hover:text-teal-600 transition">Local Insider Tips</div>
            <div className="text-xs text-[var(--muted)]">What locals know, tourist traps to skip</div>
          </div>
          <span className="text-[var(--muted)] group-hover:translate-x-1 transition shrink-0 text-sm">→</span>
        </a>
      </div>

      {/* Bucket List */}
      <div className="mt-8">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Your bucket list</div>
        <Suspense fallback={null}>
          <BangkokBingo />
        </Suspense>
      </div>

      <div className="mt-8">
        <WeatherWidget />
        <BangkokPhotoSpots />
        <SeasonalTip />
        <HiddenGemPicker />
        <ThaiWordOfDay />
        <NearbyThings context="general" />
        <BangkokChallenge />
        <ThaiPhrase />
        <BangkokTip />
      </div>

      <div className="mt-4 text-xs text-center text-[var(--muted)]">
        All data stored in your browser only — no account, no tracking.
      </div>
    </div>
  );
}
