import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NICHES, loadNicheDb, qualifyingNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return NICHES.map((n) => ({ niche: n.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ niche: string }> }
): Promise<Metadata> {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return {};
  const db = await loadNicheDb(niche as NicheSlug);
  const count = qualifyingNichePlaces(niche, db.places).length;
  return {
    title: `All ${count} ${info.label} in Thailand — Full A–Z List (2026)`,
    description: `Complete list of every ${info.label.toLowerCase()} venue ranked on Thaigle — ${count} in total, sorted by Trust Score from real Google reviews.`,
    alternates: { canonical: `/activities/${niche}/all` },
  };
}

/**
 * Complete index of a niche's venues.
 *
 * The main /activities/{niche} hub shows the top 60, but up to 365 detail
 * pages exist per niche and every one of them is submitted in sitemap.xml —
 * leaving 899 pages site-wide with no inbound link at all. A URL that only
 * appears in a sitemap and is reachable from nowhere reads as low-value and
 * lands in Search Console's "Discovered - currently not indexed". This is the
 * crawl path for the tail; it's a plain link list, so it stays small even at
 * 365 entries.
 */
export default async function NicheAllPage(
  { params }: { params: Promise<{ niche: string }> }
) {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) notFound();

  const db = await loadNicheDb(niche as NicheSlug);
  const all = qualifyingNichePlaces(niche, db.places);

  const byCity = new Map<string, typeof all>();
  for (const p of all) {
    const city = p.city || "Other";
    if (!byCity.has(city)) byCity.set(city, []);
    byCity.get(city)!.push(p);
  }
  const cities = [...byCity.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: info.label, url: `/activities/${niche}` },
        { name: "All venues", url: `/activities/${niche}/all` },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/" className="hover:text-[var(--fg)]">Home</a>
          <span className="mx-2">›</span>
          <a href="/activities" className="hover:text-[var(--fg)]">Activities</a>
          <span className="mx-2">›</span>
          <a href={`/activities/${niche}`} className="hover:text-[var(--fg)]">{info.label}</a>
          <span className="mx-2">›</span>
          <span>All</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          <span className="mr-2">{info.icon}</span>
          All {all.length.toLocaleString()} {info.label} Venues
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
          Every {info.label.toLowerCase()} venue ranked on Thaigle, grouped by city and sorted by Trust Score.
          For the top picks with photos, prices and booking, see{" "}
          <a href={`/activities/${niche}`} className="underline underline-offset-2 hover:text-orange-600">
            the {info.label} guide
          </a>.
        </p>

        {cities.map(([city, places]) => (
          <section key={city} className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] mb-3">
              {city} · {places.length}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
              {places.map((p) => (
                <li key={p.id} className="border-b border-[var(--border)] last:border-0">
                  <a
                    href={`/activities/${niche}/${encodeURIComponent(p.slug)}`}
                    className="flex items-baseline justify-between gap-3 py-2 min-h-[44px] hover:text-orange-600 transition"
                  >
                    <span className="text-sm leading-snug">{p.name}</span>
                    <span className="shrink-0 text-xs font-mono text-[var(--muted)]">{p.trust_score}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-8 text-center">
          <a href={`/activities/${niche}`} className="text-sm font-semibold text-orange-600 hover:underline">
            ← Back to the {info.label} guide
          </a>
        </p>
      </div>
    </>
  );
}
