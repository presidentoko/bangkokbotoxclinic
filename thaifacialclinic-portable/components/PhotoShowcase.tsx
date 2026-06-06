import Link from "next/link";
import type { Clinic, Lang } from "@/lib/types";

export default function PhotoShowcase({ clinics, lang }: { clinics: Clinic[]; lang: Lang }) {
  // Pick clinics with multiple photos, top trust, varied cities for visual diversity
  const candidates = clinics
    .filter((c) => c.photos_sample && c.photos_sample.length >= 3 && c.is_hair_relevant && c.city && c.city !== "nan")
    .sort((a, b) => b.trust_score - a.trust_score);

  // Pick 1 photo each from 12 different clinics across cities
  const seen = new Set<string>();
  const tiles: { url: string; clinicName: string; slug: string; city: string }[] = [];
  for (const c of candidates) {
    if (seen.has(c.city)) continue; // diversify cities first
    if (!c.top_photo_url) continue;
    tiles.push({ url: c.top_photo_url, clinicName: c.name, slug: c.slug, city: c.city });
    seen.add(c.city);
    if (tiles.length >= 6) break;
  }
  // Fill remaining slots from remaining top clinics (allow city repeat)
  for (const c of candidates) {
    if (tiles.length >= 12) break;
    if (tiles.find((t) => t.slug === c.slug)) continue;
    for (const p of c.photos_sample.slice(0, 2)) {
      if (tiles.length >= 12) break;
      tiles.push({ url: p, clinicName: c.name, slug: c.slug, city: c.city });
    }
  }

  if (tiles.length < 6) return null;

  // Masonry-ish layout: alternate row-spans for visual rhythm
  const spans = [
    "row-span-2",  // 0 — tall
    "",            // 1
    "",            // 2
    "row-span-2",  // 3 — tall
    "",            // 4
    "",            // 5
    "",            // 6
    "row-span-2",  // 7 — tall
    "",            // 8
    "",            // 9
    "",            // 10
    "",            // 11
  ];

  return (
    <section className="space-y-8">
      <div className="grid items-end gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <div className="eyebrow">Photo wall</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">
            Inside Thailand's top hair clinics
          </h2>
          <p className="mt-2 text-sm muted">
            Real clinic interiors and team photos — pulled from Google Maps. For patient before-after results, visit each clinic's detail page where we link out to their official galleries.
          </p>
        </div>
        <div className="sm:text-right">
          <Link href={`/${lang}/`} className="inline-flex items-center gap-2 rounded-xl border bg-[rgb(var(--bg-elev))] px-4 py-2.5 text-sm font-bold transition hover:border-navy-700"
            style={{ borderColor: "rgb(var(--border))" }}>
            Browse all photos →
          </Link>
        </div>
      </div>

      <div className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[160px] sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
        {tiles.map((t, i) => (
          <Link key={i} href={`/${lang}/clinic/${t.slug}/`}
            className={`group relative overflow-hidden rounded-2xl ring-1 transition hover:ring-2 ${spans[i] || ""}`}
            style={{ ["--tw-ring-color" as never]: "rgb(var(--border))" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.url} alt={t.clinicName} loading="lazy" referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-300">{t.city}</div>
              <div className="mt-0.5 truncate text-xs font-bold leading-tight sm:text-sm">{t.clinicName}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
