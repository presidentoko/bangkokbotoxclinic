import { loadDentalDb, topDentalByRating } from "@/lib/dental";
import { AddToPlannerButton } from "@/components/AddToPlannerButton";
import { BangkokFacts } from "@/components/BangkokFacts";
import { SavingsCounter } from "@/components/SavingsCounter";
import { BangkokTip } from "@/components/BangkokTip";
import { TrustScoreExplainer } from "@/components/TrustScoreExplainer";
import { EmergencyInfo } from "@/components/EmergencyInfo";
import { ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Dental Clinics — Top Rated",
  description: "Top-rated dental clinics in Bangkok. Implants, crowns, whitening — verified from real Google reviews.",
  alternates: { canonical: "/dental" },
};

export default async function DentalPage() {
  const db = await loadDentalDb();
  const top = topDentalByRating(db.clinics, 50);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest mb-4">
          🦷 Bangkok Dental
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          Best Dental Clinics in Bangkok
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          {db.clinics.length.toLocaleString()} dental clinics ranked by Google review rating.
          Implants, crowns, whitening — significantly cheaper than Korea or Japan.
        </p>
      </div>

      <div className="grid gap-3">
        {top.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between gap-4 bg-white border border-[var(--border)] rounded-xl p-4 hover:border-blue-300 transition">
            <div className="flex items-center gap-4 min-w-0">
              <div className="text-2xl font-black tabular-nums text-[var(--muted)] shrink-0">#{i + 1}</div>
              <div className="min-w-0">
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-xs text-[var(--muted)] truncate">{c.address.split(",").slice(-3, -1).join(",")}</div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-yellow-700 font-bold">★ {c.rating.toFixed(1)}</span>
                  <span className="text-[var(--muted)]">({c.total_reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
            <AddToPlannerButton item={{
              type: "dental",
              id: c.id,
              name: c.name,
              rating: c.rating,
              url: c.website || c.maps_url,
            }} />
          </div>
        ))}
      </div>
      <TrustScoreExplainer />
      <BangkokFacts />
      <SavingsCounter />
      <EmergencyInfo />
      <BangkokTip />
      <ItemListJsonLd
        name="Best Dental Clinics in Bangkok"
        items={top.map((c) => ({ name: c.name, url: c.website || c.maps_url }))}
      />
    </div>
  );
}
