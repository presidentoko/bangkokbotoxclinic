import { NICHES, loadNicheDb, qualifyingNichePlaces, findBySlug } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { AREAS, placesInArea } from "@/lib/areas";
import { getSiteConfig } from "@/lib/site";

/**
 * "Ranked on Thaigle" embed badge — an SVG a venue owner can drop on their
 * own site or Facebook page. The point isn't the graphic, it's the <a> that
 * wraps it: every venue that embeds one is a backlink into its own Thaigle
 * page, which is the one lever that reaches head keywords ("spa bangkok")
 * that a directory with near-zero backlinks otherwise can't touch.
 *
 * Not force-static: 2,000+ spa venues alone would mean 2,000+ prebuilt
 * images for a feature almost none of them have installed yet. This is a
 * plain request-time SVG response, not an ISR page — a Vercel Function
 * invocation, not a read against the ISR quota this site has hit before.
 */
export const dynamic = "force-dynamic";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function stars(rating: number | null): string {
  if (!rating) return "";
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ niche: string; slug: string }> },
) {
  const { niche, slug } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return new Response("Not found", { status: 404 });

  const db = await loadNicheDb(niche as NicheSlug);
  const place = findBySlug(db.places, decodeURIComponent(slug));
  if (!place || place.trust_score <= 0) return new Response("Not found", { status: 404 });

  const qualifying = qualifyingNichePlaces(niche, db.places);
  const rank = qualifying.findIndex((p) => p.slug === place.slug) + 1;
  const total = qualifying.length;

  // Prefer an area-scoped claim ("#4 in Sukhumvit") when the venue's address
  // matches one of the named Bangkok areas — it's a stronger, more specific
  // claim than the Thailand-wide rank, and closer to what people search.
  let scopeLabel = "Thailand";
  let scopeRank = rank;
  let scopeTotal = total;
  if (place.city === "Bangkok") {
    for (const area of AREAS) {
      const inArea = placesInArea(area, niche, db.places);
      const idx = inArea.findIndex((p) => p.slug === place.slug);
      if (idx >= 0) {
        scopeLabel = area.label;
        scopeRank = idx + 1;
        scopeTotal = inArea.length;
        break;
      }
    }
  }

  const cfg = getSiteConfig();
  const accent = cfg.themeAccent;
  const name = esc(place.name.length > 34 ? place.name.slice(0, 33) + "…" : place.name);
  const rankLine = esc(`#${scopeRank} of ${scopeTotal} in ${scopeLabel}`);
  const starsStr = stars(place.rating);
  const ratingStr = place.rating ? `${place.rating.toFixed(1)}` : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120">
  <rect width="320" height="120" rx="14" fill="#ffffff" stroke="#e5e2dd" stroke-width="1"/>
  <rect x="0" y="0" width="6" height="120" rx="3" fill="${accent}"/>
  <circle cx="38" cy="38" r="18" fill="${accent}"/>
  <text x="38" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">T</text>
  <text x="26" y="70" font-family="Arial, sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="#9a9488">RANKED ON</text>
  <text x="26" y="82" font-family="Arial, sans-serif" font-size="13" font-weight="800" fill="#1a1a1a">${cfg.brand}</text>
  <text x="66" y="30" font-family="Arial, sans-serif" font-size="14" font-weight="800" fill="#1a1a1a">${name}</text>
  <text x="66" y="50" font-family="Arial, sans-serif" font-size="13" fill="#d97706">${starsStr}<tspan fill="#6b6558" font-size="11"> ${ratingStr}</tspan></text>
  <text x="66" y="68" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="${accent}">${rankLine}</text>
  <text x="66" y="94" font-family="Arial, sans-serif" font-size="9" fill="#9a9488">${esc(info.label)} · Trust Score ${place.trust_score}/100</text>
  <text x="66" y="108" font-family="Arial, sans-serif" font-size="9" fill="#9a9488">${esc(cfg.domain.replace(/^https?:\/\//, ""))}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // A venue's rank moves as reviews come in, but not fast — daily is
      // plenty and matches the data refresh cadence everywhere else on the
      // site (see [locale]/layout.tsx revalidate note on the other property).
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
