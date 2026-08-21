import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlanTimeline } from "@/components/PlanTimeline";

export const dynamic = "force-dynamic";

// Both routes are force-dynamic, so any first segment reaches them: without
// this, /wp-admin/plan and /xyz/plan/share answered 200. The sibling
// app/[lang]/page.tsx hard-404s an unsupported lang for exactly this reason
// (bot probes); these two were the ones that missed it.
const SUPPORTED_LANGS = ["th", "en", "ko", "ja", "ru", "ar"];


export const metadata: Metadata = {
  title: "My Bangkok Day Plan — Thaigle",
  description: "Build your Bangkok day itinerary. Add places from verified reviews, optimize your route, share with friends on LINE.",
  robots: "noindex",
};

export default async function PlanPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang)) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1">Your Bangkok Day Plan</h1>
        <p className="text-sm text-[var(--muted)]">
          Add places from{" "}
          <a href="/activities" className="text-orange-600 font-bold hover:underline">activity pages</a>
          {" "}· Optimize route · Share on LINE
        </p>
      </div>

      <PlanTimeline />
    </div>
  );
}
