import type { Metadata } from "next";
import { Fragment } from "react";
import { AdSlot } from "@/components/AdSlot";
import { resolveAffiliateUrl } from "@/lib/affiliate";
import { notFound } from "next/navigation";
import {
  NICHES,
  loadNicheDb,
  qualifyingNichePlaces,
  findBySlug,
  loadCommunityDb,
  buildKlookIndex,
} from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { AddToPlannerButton } from "@/components/AddToPlannerButton";
import { trustTierLong } from "@/lib/trust";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { SaveButton } from "@/components/SaveButton";
import { ViewTracker } from "@/components/ViewTracker";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import type { PlanItemType } from "@/lib/planner";
import { LocalBusinessJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { NICHE_FAQS } from "@/lib/niche-content";
import { CardImage } from "@/components/CardImage";
import { getAffiliateLink, withKlookAid } from "@/lib/affiliate";
import { BookingCTAs } from "@/components/BookingCTAs";
import { AffiliateLink } from "@/components/AffiliateLink";
import { MobileStickyBar } from "@/components/MobileStickyBar";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { getDayPlansForVenue } from "@/lib/venue-day-plans";
import { ReportButton } from "@/components/ReportButton";
import { VenueStamp } from "@/components/VenueStamp";
import { PopularTimes } from "@/components/PopularTimes";
import { PhotoHints } from "@/components/PhotoHints";
import { KlookBanner } from "@/components/KlookBanner";
import { NearbyThings } from "@/components/NearbyThings";
import { SeasonalTip } from "@/components/SeasonalTip";
import { VenueBadge } from "@/components/VenueBadge";
import { upscaleGooglePhoto, isLikelyAvatarThumbnail } from "@/lib/googlePhotoSize";

export const dynamic = "force-static";
export const dynamicParams = false;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export async function generateStaticParams() {
  const params: { niche: string; slug: string }[] = [];
  for (const n of NICHES) {
    const db = await loadNicheDb(n.slug as NicheSlug);
    // No artificial cap — qualifyingNichePlaces() already gates on having a
    // real rating + review count (or a trust_score fallback), plus an extra
    // content-depth gate for spa specifically (see lib/niches.ts) — shared
    // with the niche/city listing pages so nothing links to a slug that
    // doesn't actually get built here.
    const top = qualifyingNichePlaces(n.slug, db.places);
    for (const p of top) {
      params.push({ niche: n.slug, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string; slug: string }>;
}): Promise<Metadata> {
  const { niche, slug } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return {};
  const db = await loadNicheDb(niche as NicheSlug);
  const place = findBySlug(db.places, slug);
  if (!place) return {};

  const cityLabel = place.city ? place.city.charAt(0).toUpperCase() + place.city.slice(1) : "Bangkok";
  const hasPrice = place.price_min_thb > 0;
  const priceStr = hasPrice ? ` From ฿${place.price_min_thb.toLocaleString()}.` : "";
  const priceTitleFragment = hasPrice ? " | Prices" : "";
  const trustLabel = trustTierLong(place.trust_score);
  const hasRating = !!(place.rating && place.review_count);
  const ratingTitleFragment = hasRating ? ` | ★${place.rating!.toFixed(1)} (${place.review_count!.toLocaleString()} Reviews)` : "";
  const ratingDescFragment = hasRating
    ? `★${place.rating!.toFixed(1)} from ${place.review_count!.toLocaleString()} Google reviews. `
    : "";
  return {
    title: `${place.name} — ${info.label} in ${cityLabel} 2026${priceTitleFragment}${ratingTitleFragment}`,
    description: `${place.name}: ${info.label} in ${cityLabel}. ${ratingDescFragment}Trust Score ${place.trust_score} (${trustLabel}).${priceStr} Book on Klook or visit directly.`,
    // ~683 niche-place slugs contain Thai characters (kept intentionally,
    // see lib/data.ts slugify) — sitemap spec and strict crawlers require
    // RFC-3986-encoded <loc>/canonical/hreflang, unlike plain <a href>
    // which browsers happily percent-encode themselves.
    alternates: { canonical: `/activities/${niche}/${encodeURIComponent(slug)}` },
    openGraph: {
      title: `${place.name} — ${info.label} ${cityLabel}`,
      description: `${hasRating ? `★${place.rating!.toFixed(1)} · ${place.review_count!.toLocaleString()} reviews · ` : ""}Trust Score ${place.trust_score}${priceStr}`,
      ...(place.top_photo_url ? { images: [{ url: place.top_photo_url, alt: `${place.name} — ${info.label} in ${cityLabel}` }] } : {}),
    },
  };
}

const LANG_LABELS: Record<string, string> = {
  en: "🇬🇧 English",
  ko: "🇰🇷 Korean",
  th: "🇹🇭 Thai",
  zh: "🇨🇳 Chinese",
  ja: "🇯🇵 Japanese",
  ar: "🇸🇦 Arabic",
};

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * Opening hours for display, in week order rather than whatever order the
 * scrape happened to store. Values are shown as Google worded them
 * ("10 AM to 10 PM", "Open 24 hours", "Closed") — openingHoursSpecification
 * in the markup normalises the same strings to 24-hour times.
 */
function readOpeningHours(json?: string | null): { day: string; hours: string }[] {
  if (!json) return [];
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(json);
  } catch {
    return [];
  }
  return DAY_ORDER.filter((d) => typeof parsed[d] === "string" && parsed[d].trim())
    .map((d) => ({ day: d, hours: parsed[d].replace(/ /g, " ").trim() }));
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ niche: string; slug: string }>;
}) {
  const { niche, slug } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) notFound();

  const [db, community] = await Promise.all([
    loadNicheDb(niche as NicheSlug),
    loadCommunityDb(niche as NicheSlug),
  ]);
  const place = findBySlug(db.places, slug);
  if (!place) notFound();

  const klookMap = await buildKlookIndex([place.id]);
  const klook = klookMap.get(place.id);
  const planType = info.planType as PlanItemType;

  // Resolve the scraper's placeholder-bearing URLs once. Anything that comes
  // back null had no real affiliate ID and is treated as if the provider had
  // no link at all, which is what lets the fallback below actually run.
  const viatorUrl = resolveAffiliateUrl(place.affiliate?.viator);
  const gygUrl = resolveAffiliateUrl(place.affiliate?.getyourguide);
  const hasDirectBooking = !!(klook?.products?.[0] || viatorUrl || gygUrl);
  const fallback = hasDirectBooking ? null : getAffiliateLink({
    venue: { name: place.name, affiliate: place.affiliate },
    activityType: niche,
  });

  const dayPlanRefs = await getDayPlansForVenue(place.id);
  const widgetPick = [...place.id].reduce((s, c) => s + c.charCodeAt(0), 0) % 3;

  // Niche hubs only link the top ~60 places, so anything ranked lower is a
  // sitemap orphan with no inbound link from anywhere but the sitemap
  // itself — mirrors the "similar restaurants" cohort on the restaurant
  // detail template so every generated page gets a few inbound links.
  const similarInNiche = qualifyingNichePlaces(niche, db.places)
    .filter((p) => p.slug !== place.slug && p.city === place.city)
    .sort((a, b) => Math.abs(a.trust_score - place.trust_score) - Math.abs(b.trust_score - place.trust_score))
    .slice(0, 6);

  const spokeLanguages = place.languages
    ? Object.entries(place.languages).filter(([, v]) => v).map(([k]) => LANG_LABELS[k] ?? k)
    : [];

  const pageUrl = `${SITE}/activities/${niche}/${encodeURIComponent(slug)}`;
  const openingHours = readOpeningHours(place.opening_hours_json);

  // The third stat tile used to be price, which is populated on 5% of these
  // pages — so 95% of the highest-traffic template opened with an empty box
  // in prime position, reading as auto-generated. Hours are on 85%, and
  // "when is it open" is closer to what a search visitor arrived with.
  //
  // The *typical* day rather than today's: this page is statically generated,
  // so there is no request-time clock to decide what "today" or "open now"
  // means, and rendering either from the server's date would be wrong for
  // most readers. A schedule that repeats on at least four days is worth
  // stating as the venue's hours; anything more irregular is left to the
  // full table further down.
  const typicalHours = (() => {
    if (openingHours.length === 0) return null;
    const tally = new Map<string, number>();
    for (const { hours } of openingHours) tally.set(hours, (tally.get(hours) ?? 0) + 1);
    const [value, count] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
    return count >= 4 && value.length <= 24 ? { value, count } : null;
  })();

  // Whether this page has enough of its own substance to carry an ad.
  //
  // A page that is a name, an address and a map link, wrapped around two ad
  // units, is the definition of a made-for-advertising page and it is a
  // documented AdSense rejection reason — one that gets judged at the account
  // level, so a few thousand thin pages put the whole site's approval at
  // risk, not just their own impressions. Thin venues keep their page (they
  // still answer a real search and still pass internal link equity) and
  // simply carry no ad.
  const hasReviewText = !!(place.reviews_sample && place.reviews_sample.length > 0);
  const contentDepth =
    (place.top_photo_url ? 1 : 0) +
    (hasReviewText ? 1 : 0) +
    (openingHours.length > 0 ? 1 : 0) +
    (place.address ? 1 : 0) +
    (similarInNiche.length >= 3 ? 1 : 0);
  const showAds = contentDepth >= 3;
  // The second unit needs prose on the page, not just structured facts.
  //
  // The 2026-08 spa backfill was run with maxReviews: 0, so ~1,700 of these
  // pages carry a photo, a rating, hours and an address but no review text —
  // complete as a directory entry, thin as a *document*. Two ad units around
  // a page with no prose is the shape AdSense reads as made-for-advertising,
  // and that judgement lands on the account, not the page. One unit keeps the
  // ratio defensible; the second returns automatically for any venue that
  // later gets review text.
  const showSecondAd = showAds && hasReviewText;

  const hasStickyBooking = !!(klook?.products?.[0] || viatorUrl || gygUrl || fallback);

  return (
    <div className={`max-w-3xl mx-auto px-4 py-6${hasStickyBooking ? " pb-24 md:pb-6" : ""}`}>
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href={`/activities/${niche}`} className="hover:text-black">{info.label}</a>
        <span>›</span>
        <span className="text-[var(--fg)] truncate max-w-[200px]">{place.name}</span>
      </nav>

      {/* Photo — LCP element on this template, must not lazy-load */}
      {place.top_photo_url && (
        <div className="rounded-2xl overflow-hidden mb-5 h-52 md:h-72 bg-gray-100">
          <CardImage
            src={upscaleGooglePhoto(place.top_photo_url)}
            alt={place.name}
            className="w-full h-full object-cover"
            fallbackIcon={info.icon}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{info.icon}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{info.label}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">{place.name}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{place.address || place.city}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SaveButton item={{ id: place.id, name: place.name, type: "activity", url: `/activities/${niche}/${slug}`, icon: info.icon }} />
          <ShareButton title={place.name} text={`${place.name} — ${info.label} in Bangkok`} url={pageUrl} kakao line whatsapp />
        </div>
      </div>

      {/* Trust score + stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center">
          <TrustScoreBadge score={place.trust_score} rating={place.rating} reviewCount={place.review_count} />
        </div>
        <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-yellow-700">★{place.rating?.toFixed(1) ?? "—"}</div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-0.5">{(place.review_count ?? 0).toLocaleString()} reviews</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center">
          {place.price_min_thb > 0 ? (
            <>
              <div className="text-lg font-black">฿{place.price_min_thb.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-0.5">
                {place.price_unit && place.price_unit !== "unknown" ? `per ${place.price_unit}` : "price"}
              </div>
            </>
          ) : typicalHours ? (
            <>
              <div className="text-sm font-black leading-tight pt-1">{typicalHours.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1">
                {typicalHours.count === 7 ? "daily" : `${typicalHours.count} days a week`}
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-black">{place.city}</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-0.5">location</div>
            </>
          )}
        </div>
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {place.is_beginner_friendly && (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">🌱 Beginner Friendly</span>
        )}
        {place.is_advanced_oriented && (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">🔥 Advanced</span>
        )}
        {place.is_open_24h && (
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">🕐 Open 24h</span>
        )}
        {spokeLanguages.map((l) => (
          <span key={l} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">{l}</span>
        ))}
      </div>

      {/* Booking CTAs — right under the stats bar, above the fold. Was
          previously pushed below 5 engagement widgets + a generic Klook
          banner, so the revenue-driving action on the page was routinely
          off-screen on mobile. */}
      <BookingCTAs
        nicheSlug={niche}
        placeId={place.id}
        placeName={place.name}
        klookProduct={klook?.products?.[0] ?? null}
        viatorUrl={viatorUrl}
        gygUrl={gygUrl}
        googleMapsUrl={place.google_maps_url ?? null}
        fallbackUrl={fallback?.url ?? null}
        fallbackLabel={fallback?.label ?? null}
        fallbackProvider={fallback?.provider ?? null}
      />

      <SeasonalTip />
      <PopularTimes type={niche === "spa" ? "spa" : niche === "muay-thai" || niche === "yoga-pilates" ? "gym" : "restaurant"} />
      <PhotoHints niche={niche} />
      <NearbyThings context="activity" />
      {/* Generic cross-sell banner only when this venue has no direct
          product of its own — otherwise it competes with (and sits above)
          the venue's own higher-value Klook link. */}
      {!klook?.products?.[0] && (
        <KlookBanner variant={
          niche === "muay-thai" ? "muay-thai" :
          niche === "cooking" ? "cooking" :
          niche === "spa" ? "spa" :
          niche === "diving" ? "diving" :
          niche === "yoga-pilates" ? "yoga" :
          "general"
        } />
      )}

      {/* Contact info */}
      {(place.phone || place.website) && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-4 mb-5 space-y-2">
          {place.phone && (
            <a href={`tel:${place.phone}`} className="flex items-center gap-3 text-sm hover:text-orange-600 transition">
              <span className="w-8 text-center">📞</span>
              <span>{place.phone}</span>
            </a>
          )}
          {place.website && (
            <a href={place.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-orange-600 transition truncate">
              <span className="w-8 text-center">🌐</span>
              <span className="truncate">{place.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>
      )}

      {/* Opening hours. 85% of ranked venues have them and none of them were
          shown — "is it open?" is the question a visitor arrives with, and
          it's also what openingHoursSpecification in the markup below claims.
          Markup and page have to say the same thing. */}
      {openingHours.length > 0 && (
        <section className="mb-5">
          <h2 className="font-black text-lg mb-3">Opening hours</h2>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              {openingHours.map(({ day, hours }) => (
                <Fragment key={day}>
                  <dt className="font-medium">{day}</dt>
                  <dd className={hours === "Closed" ? "text-[var(--muted)]" : ""}>{hours}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </section>
      )}

      <VenueBadge niche={niche} slug={slug} pageUrl={pageUrl} placeName={place.name} />

      {/* First ad sits below the venue's own facts and above the reviews:
          past the point where a search visitor has been answered, so it
          never stands between them and what they came for. */}
      {showAds && <AdSlot name="detailMid" />}

      {/* Review samples */}
      {place.reviews_sample && place.reviews_sample.length > 0 && (
        <section className="mb-6">
          <h2 className="font-black text-lg mb-3">What Google reviewers say about {place.name}</h2>
          <div className="space-y-3">
            {place.reviews_sample.slice(0, 3).map((r, i) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-medium truncate">{r.reviewer}</span>
                  {r.rating && <span className="text-yellow-700 text-sm font-bold shrink-0">★{r.rating}</span>}
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-4">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Photo gallery — some scraped photo arrays are contaminated with
          reviewer profile-picture thumbnails instead of venue photos. */}
      {(() => {
        const gallery = (place.photos_sample ?? []).filter((url) => !isLikelyAvatarThumbnail(url));
        return gallery.length > 1 && (
          <section className="mb-6">
            <h2 className="font-black text-lg mb-3">Photos</h2>
            <div className="grid grid-cols-3 gap-2">
              {gallery.slice(1, 7).map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <CardImage src={url} alt={`${place.name} photo ${i + 2}`} className="w-full h-full object-cover" fallbackIcon={info.icon} />
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Add to planner */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="font-black">Add to your Bangkok trip</div>
          <div className="text-sm text-[var(--muted)]">Save and share your itinerary</div>
        </div>
        <AddToPlannerButton
          item={{
            type: planType,
            id: place.id,
            name: place.name,
            rating: place.rating ?? undefined,
            city: place.city,
            trust_score: place.trust_score,
            price_min_thb: place.price_min_thb > 0 ? place.price_min_thb : undefined,
            url: `/activities/${niche}/${slug}`,
          }}
        />
      </div>

      {/* View tracker (client-side localStorage) */}
      <ViewTracker
        id={place.id}
        name={place.name}
        nicheSlug={niche}
        slug={slug}
        icon={info.icon}
        trust_score={place.trust_score}
      />

      {/* Recently viewed */}
      <RecentlyViewed currentId={place.id} />

      {/* Similar venues in the same niche — gives lower-ranked (61+) pages inbound links */}
      {similarInNiche.length > 0 && (
        <section className="mb-6">
          <h2 className="font-black text-base mb-3">More {info.label} in {place.city}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {similarInNiche.map((p) => (
              <a
                key={p.slug}
                href={`/activities/${niche}/${p.slug}`}
                className="block p-3 rounded-xl bg-white border border-[var(--border)] hover:border-orange-300 hover:shadow-sm transition"
              >
                <div className="text-xs font-bold leading-tight truncate">{p.name}</div>
                <div className="text-[10px] text-[var(--muted)] mt-1">Trust {p.trust_score}{p.rating ? ` · ★${p.rating.toFixed(1)}` : ""}</div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Cross-niche suggestions */}
      <section className="mb-6 border border-[var(--border)] rounded-2xl p-5 bg-gradient-to-br from-gray-50 to-white">
        <h2 className="font-black text-base mb-3">Also try in Bangkok</h2>
        <div className="grid grid-cols-3 gap-2">
          {NICHES.filter((n) => n.slug !== niche).slice(0, 3).map((n) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="group block text-center p-3 rounded-xl bg-white border border-[var(--border)] hover:border-orange-300 hover:shadow-sm transition"
            >
              <div className="text-2xl mb-1">{n.icon}</div>
              <div className="text-xs font-bold group-hover:text-orange-600 transition leading-tight">{n.label}</div>
            </a>
          ))}
        </div>
      </section>

      {/* C2/C4: Day-plans featuring this venue */}
      {dayPlanRefs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
            Appears in these day plans
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dayPlanRefs.slice(0, 6).map((ref) => (
              <a
                key={ref.url}
                href={ref.url}
                className="flex items-center gap-2 border border-[var(--border)] rounded-xl p-3 hover:border-orange-400 transition group"
              >
                <span className="text-xl shrink-0">{ref.themeIcon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold group-hover:text-orange-600 transition">{ref.themeLabel}</div>
                  <div className="text-[10px] text-[var(--muted)]">{ref.areaLabel}</div>
                </div>
              </a>
            ))}
          </div>
          {/* C4: TikTok CTA */}
          <a
            href={`/day-plan/${dayPlanRefs[0].area}/${dayPlanRefs[0].theme}?src=tiktok`}
            className="mt-3 flex items-center justify-between border border-orange-200 bg-orange-50 rounded-xl p-3 hover:border-orange-400 transition group"
          >
            <div className="text-xs font-bold">Build a day around {place.name.split(" ").slice(0, 3).join(" ")} →</div>
            <span className="text-orange-500 group-hover:translate-x-0.5 transition text-xs">📱</span>
          </a>
        </section>
      )}

      {/* One engagement widget, deterministically picked per venue —
          previously all three stacked on every one of ~15k activity pages */}
      {widgetPick === 0 && <BangkokChallenge />}
      {widgetPick === 1 && <BangkokTip />}
      {widgetPick === 2 && (
        <div className="mb-4">
          <VersusVote
            question="First time visiting this type of venue in Bangkok?"
            a={{ id: "first-time", label: "Yes, first time!", emoji: "🌟", desc: "Bangkok is incredible for first-timers — so much to discover", url: `/activities/${niche}` }}
            b={{ id: "regular", label: "Regular visitor", emoji: "🔁", desc: "Always come back — Bangkok just keeps getting better", url: `/activities/${niche}/top-10` }}
          />
        </div>
      )}

      {/* Quiz CTA */}
      <div className="mb-6 p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="font-black text-sm mb-0.5">🎯 What&apos;s your Bangkok traveler type?</div>
          <div className="text-xs text-[var(--muted)]">5 questions → personalized picks for your trip</div>
        </div>
        <a href="/quiz" className="shrink-0 px-4 py-2 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition">
          Take quiz →
        </a>
      </div>

      {showSecondAd && <AdSlot name="detailFoot" />}

      {/* Back link + report */}
      <div className="flex items-center justify-between text-sm flex-wrap gap-2">
        <a href={`/activities/${niche}`} className="text-[var(--muted)] hover:text-black">
          ← Back to {info.label}
        </a>
        <VenueStamp venueId={place.id} venueName={place.name} />
        <div className="flex items-center gap-3">
          <ReportButton venueName={place.name} venueUrl={pageUrl} />
          <a href="/activities" className="text-[var(--muted)] hover:text-black">
            All Activities →
          </a>
        </div>
      </div>

      <LocalBusinessJsonLd
        name={place.name}
        address={place.address}
        city={place.city}
        openingHoursJson={place.opening_hours_json}
        reviews={place.reviews_sample}
        phone={place.phone}
        website={place.website}
        rating={place.rating}
        reviewCount={place.review_count}
        category={place.category}
        imageUrl={place.top_photo_url}
        url={pageUrl}
        priceMin={place.price_min_thb}
        priceMax={place.price_max_thb}
        priceBand={place.price_band}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: info.label, url: `/activities/${niche}` },
        { name: place.name, url: `/activities/${niche}/${encodeURIComponent(slug)}` },
      ]} />

      {/* Mobile sticky bar: Book + Add to plan — mirrors BookingCTAs' klook
          > viator > gyg > fallback priority so venues without a Klook match
          (most of them) still get a sticky booking CTA instead of none. */}
      {(klook?.products?.[0] || viatorUrl || gygUrl || fallback) && (
        <MobileStickyBar
          bookingUrl={
            klook?.products?.[0]
              ? withKlookAid(klook.products[0].product_url)
              : viatorUrl || gygUrl || fallback!.url
          }
          bookingProvider={
            klook?.products?.[0]
              ? "Klook"
              : viatorUrl
              ? "Viator"
              : gygUrl
              ? "GetYourGuide"
              : fallback!.provider ?? "Klook"
          }
          bookingLabel={
            klook?.products?.[0]
              ? "Book on Klook"
              : viatorUrl
              ? "Search on Viator"
              : gygUrl
              ? "GetYourGuide"
              : fallback!.label ?? "Find & book similar"
          }
          priceLabel={klook?.products?.[0]?.price_thb ? `฿${klook.products[0].price_thb.toLocaleString()}` : "View prices"}
          nicheSlug={niche}
          placeId={place.id}
          planItem={{ type: planType, id: place.id, name: place.name, rating: place.rating ?? undefined, city: place.city, trust_score: place.trust_score, price_min_thb: place.price_min_thb > 0 ? place.price_min_thb : undefined, url: `/activities/${niche}/${slug}` }}
        />
      )}
    </div>
  );
}
