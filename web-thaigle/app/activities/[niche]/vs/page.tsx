import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NICHES, type NicheSlug } from "@/lib/niches";
import { getVsIndex, nichesWithVs, type VsPair } from "@/lib/vs";
import { pairNames } from "@/lib/vsMetrics";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";
export const dynamicParams = false;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thaigle.com";

export async function generateStaticParams() {
  return (await nichesWithVs()).map((niche) => ({ niche }));
}

export async function generateMetadata({ params }: { params: Promise<{ niche: string }> }): Promise<Metadata> {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return {};
  const idx = await getVsIndex(info.slug as NicheSlug);
  const places = new Set(idx.pairs.flatMap((p) => [p.a.id, p.b.id])).size;
  const title = `${info.label} compared: head-to-head across ${idx.pairs.length} pairs`;
  const description = `${idx.pairs.length} side-by-side comparisons of ${places} top-rated ${info.label.toLowerCase()} venues, neighbourhood by neighbourhood — rating, review volume, opening hours and a confidence-adjusted score.`;
  return {
    title,
    description,
    alternates: { canonical: `/activities/${info.slug}/vs` },
    openGraph: { title, description, url: `/activities/${info.slug}/vs` },
  };
}

export default async function VsHub({ params }: { params: Promise<{ niche: string }> }) {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) notFound();
  const idx = await getVsIndex(info.slug as NicheSlug);
  if (idx.pairs.length === 0) notFound();

  const groups = new Map<string, { label: string; href: string; pairs: VsPair[] }>();
  for (const p of idx.pairs) {
    const g = groups.get(p.group.id) ?? { label: p.group.label, href: p.group.href, pairs: [] };
    g.pairs.push(p);
    groups.set(p.group.id, g);
  }
  const ordered = [...groups.values()].sort((x, y) => x.label.localeCompare(y.label));
  const url = `${SITE}/activities/${info.slug}/vs`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Activities", url: "/activities" },
          { name: info.label, url: `/activities/${info.slug}` },
          { name: "Comparisons", url },
        ]}
      />
      <ItemListJsonLd
        name={`${info.label} comparisons`}
        items={idx.pairs.map((p) => ({ name: pairNames(p.a, p.b).join(" vs "), url: `/activities/${info.slug}/vs/${p.slug}` }))}
      />

      <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href={`/activities/${info.slug}`} className="hover:text-black">{info.label}</a>
        <span>›</span>
        <span className="text-[var(--fg)]">Comparisons</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          {info.icon} {info.label}: head-to-head
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl leading-relaxed">
          Each page puts two of the best-evidenced {info.label.toLowerCase()} venues in the same neighbourhood or city side
          by side — Google rating, how many people stand behind it, a confidence-adjusted score, opening hours and
          more — and says plainly when the numbers do not separate them. Pairs are drawn from the top of one area, never
          across the country, because that is the choice a person standing in Bangkok actually faces.
        </p>
      </header>

      <div className="space-y-8">
        {ordered.map((g) => (
          <section key={g.label} aria-labelledby={`g-${g.label}`}>
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2 id={`g-${g.label}`} className="text-lg font-black">{g.label}</h2>
              <a href={g.href} className="text-xs font-bold text-orange-700 hover:underline">All {info.label.toLowerCase()} here →</a>
            </div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {g.pairs.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/activities/${info.slug}/vs/${p.slug}`}
                    className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300"
                  >
                    <div className="text-sm font-bold">{pairNames(p.a, p.b)[0]} <span className="text-[var(--muted)] font-medium">vs</span> {pairNames(p.a, p.b)[1]}</div>
                    <div className="text-xs text-[var(--muted)] mt-1">
                      ★{p.a.rating?.toFixed(1)} ({(p.a.review_count ?? 0).toLocaleString()}) · ★{p.b.rating?.toFixed(1)} ({(p.b.review_count ?? 0).toLocaleString()})
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
