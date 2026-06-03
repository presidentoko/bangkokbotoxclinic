import type { Metadata } from "next";
import { CompareClient } from "@/components/CompareClient";

export const metadata: Metadata = {
  title: "Compare Suppliers Side by Side",
  description:
    "Compare your shortlisted Thai suppliers side by side — Trust Score, ratings, verification status, location, and categories — to choose the right partner.",
  alternates: { canonical: "/compare" },
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Compare</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Compare suppliers side by side</h1>
      <p className="text-[var(--muted)] leading-relaxed mb-8">
        Everything you shortlisted, lined up on Trust Score, ratings, verifications, location, and categories —
        so you can pick with confidence and request one quote when ready.
      </p>
      <CompareClient />
    </div>
  );
}
