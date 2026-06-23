import { loadClinicDb, topClinicsByRating } from "@/lib/clinics";
import { AddToPlannerButton } from "@/components/AddToPlannerButton";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Clinics — Aesthetic & Beauty",
  description: "Top-rated aesthetic clinics in Bangkok ranked by Google reviews. Botox, fillers, facials — verified ratings.",
  alternates: { canonical: "/clinics" },
};

export default async function ClinicsPage() {
  const db = await loadClinicDb();
  const top = topClinicsByRating(db.clinics, 50);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-widest mb-4">
          💉 Bangkok Clinics
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          Best Aesthetic Clinics in Bangkok
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          {db.clinics.length.toLocaleString()} clinics ranked by Google review rating and volume.
          Botox, fillers, facials, skin care — verified from real patient reviews.
        </p>
      </div>

      <div className="grid gap-3">
        {top.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between gap-4 bg-white border border-[var(--border)] rounded-xl p-4 hover:border-pink-300 transition">
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
              type: "clinic",
              id: c.id,
              name: c.name,
              rating: c.rating,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
