import type { Metadata } from "next";
import { SavedListClient } from "@/components/SavedListClient";
import { RecentlyViewedStrip } from "@/components/RecentlyViewedStrip";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Saved Restaurants",
  description: "Your saved Bangkok and Pattaya restaurants.",
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Saved Restaurants</h1>
      <p className="text-[var(--muted)] mb-8">
        Stored on this device only — saved restaurants aren't linked to an account.
      </p>
      <SavedListClient />
      <RecentlyViewedStrip />
    </div>
  );
}
