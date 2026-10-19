import { vsForVenue } from "@/lib/vs";
import { pairNames } from "@/lib/vsMetrics";

/**
 * "Compare with…" block for a venue page. Server component: it reads the pair
 * index at build time, and renders nothing for the large majority of venues
 * that are not in one — a link to a comparison that was never built would be
 * a dead end, so this goes through the same index that generates the pages.
 */
export async function VsLinks({ niche, venueId, venueName }: { niche: string; venueId: string; venueName: string }) {
  const pairs = await vsForVenue(niche, venueId, 3);
  if (pairs.length === 0) return null;
  return (
    <section className="mb-6" aria-labelledby="vs-links-heading">
      <h2 id="vs-links-heading" className="text-lg font-black mb-3">Compare {pairNames({ name: venueName }, pairs[0].a.id === venueId ? pairs[0].b : pairs[0].a)[0]} head-to-head</h2>
      <ul className="grid gap-2">
        {pairs.map((p) => {
          const other = p.a.id === venueId ? p.b : p.a;
          const [me, them] = pairNames({ name: venueName }, other);
          return (
            <li key={p.slug}>
              <a
                href={`/activities/${niche}/vs/${p.slug}`}
                className="block p-3 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 text-sm"
              >
                <span className="font-bold">{me} vs {them}</span>
                <span className="text-[var(--muted)]"> — rating, reviews, hours and a confidence-adjusted score, side by side ({p.group.label})</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
