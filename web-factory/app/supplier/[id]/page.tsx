import { notFound } from "next/navigation";
import { loadMasterDb, getSupplierById } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS, type Supplier } from "@/lib/types";
import { BreadcrumbJsonLd, SupplierJsonLd, ProfilePageJsonLd } from "@/components/JsonLd";
import { MapEmbed } from "@/components/MapEmbed";
import { sponsoredTier } from "@/lib/sponsored";
import { SponsoredBadge } from "@/components/Badges";
import { AdSlot } from "@/components/AffiliateSlot";
import { RfqForm } from "@/components/RfqForm";
import { photoUrl } from "@/lib/photoUrl";
import { HeroCertificate } from "@/components/HeroCertificate";
import { TrustGauges } from "@/components/TrustGauges";
import { IndustryRadar } from "@/components/IndustryRadar";
import { MedalWall } from "@/components/MedalWall";
import { CompanyTimeline } from "@/components/CompanyTimeline";
import { OverallScore } from "@/components/OverallScore";
import { computeTrustScore } from "@/lib/trustScore";
import { CapitalHistogram } from "@/components/CapitalHistogram";
import { PeerCompare } from "@/components/PeerCompare";
import { industryStatsByTsic, relScore } from "@/lib/industryStats";
import { relatedSuppliers } from "@/lib/related";
import { SupplierCard } from "@/components/SupplierCard";
import { ShortlistButton } from "@/components/ShortlistButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Metadata } from "next";

// Static export 호환: dynamicParams=false 필수. 모든 supplier 를 prebuild —
// 그래야 즐겨찾기/비교/검색에서 어떤 supplier 로 가도 404 가 안 난다.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return db.suppliers.map((r) => ({ id: r.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getSupplierById(db.suppliers, id);
  if (!r) return { title: "Supplier not found" };

  const loc = [r.district, r.city_label].filter(Boolean).join(", ") || "Thailand";
  const cats = r.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(", ");
  const verified = r.verified ? "DBD-verified · " : "";
  const founded = r.dbd?.registered_date ? `Est. ${r.dbd.registered_date.slice(0, 4)}` : "";
  const top = r.external_reviews?.[0]?.text || r.dbd?.purpose || "";
  const desc = `${verified}${r.name} (${loc}). ${cats}${founded ? " · " + founded : ""}. ${top.slice(0, 140)}`;

  return {
    title: r.verified
      ? `${r.name} — Verified Thai ${cats || "Supplier"} · ${loc}`
      : `${r.name} — Thai Supplier · ${loc}`,
    description: desc.slice(0, 200),
    alternates: { canonical: `/supplier/${id}` },
    openGraph: {
      title: `${r.name}${r.verified ? " — Verified Thai Supplier" : ""}`,
      description: desc.slice(0, 200),
      type: "website",
      images: r.hero_image ? [{ url: photoUrl(r.hero_image) }] : undefined,
    },
    robots: { index: true, follow: true },
  };
}


function formatCap(thb: number | null | undefined): string {
  if (!thb) return "—";
  if (thb >= 1_000_000_000) return `฿${(thb / 1_000_000_000).toFixed(2)}B`;
  if (thb >= 1_000_000) return `฿${(thb / 1_000_000).toFixed(1)}M`;
  if (thb >= 1_000) return `฿${(thb / 1_000).toFixed(0)}K`;
  return `฿${thb.toFixed(0)}`;
}

function dbdConfidence(score: number | null | undefined): "verified" | "likely" | null {
  if (typeof score !== "number") return null;
  if (score >= 90) return "verified";
  if (score >= 80) return "likely";
  return null;
}


export default async function SupplierPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getSupplierById(db.suppliers, id);
  if (!r) notFound();

  const tier = sponsoredTier(r.id);
  const photos = (r.photos && r.photos.length > 0)
    ? r.photos
    : (r.hero_image ? [r.hero_image] : []);
  const reviews = r.external_reviews || [];
  const founded = r.dbd?.registered_date ? r.dbd.registered_date.slice(0, 4) : null;
  const foundedYear = founded ? parseInt(founded) : null;
  const years = r.years_in_business || (foundedYear ? new Date().getFullYear() - foundedYear : null);
  const tsic = r.dbd?.tsic_code || null;
  const confidence = dbdConfidence(r.dbd?.match_score);

  // Related suppliers (same industry / nearby region) — server-rendered, no client JS.
  const related = relatedSuppliers(db, r);

  // ── Industry comparison (radar) ──────────────────────────────
  const stats = industryStatsByTsic(db);
  const peer = tsic ? stats.get(tsic) : undefined;
  const radarAxes = peer ? [
    { label: "Capital",  supplier: relScore(r.dbd?.capital_thb || 0, peer.avgCapital),  industry: 50 },
    { label: "Years",    supplier: relScore(years || 0, peer.avgYears),                  industry: 50 },
    { label: "Rating",   supplier: relScore(r.rating || 0, peer.avgRating),              industry: 50 },
    { label: "Reviews",  supplier: relScore(r.total_reviews || 0, peer.avgReviews),      industry: 50 },
    { label: "Photos",   supplier: relScore(r.photos?.length || 0, peer.avgPhotos),      industry: 50 },
  ] : null;

  // ── 5 trust sub-scores (single source of truth — same as cards + sorting) ──
  const trust = computeTrustScore(r);
  const subBy = (k: string) => trust.subs.find((s) => s.key === k)!.score;
  const capScore = subBy("capital");
  const longevityScore = subBy("longevity");
  const reviewScore = subBy("reviews");
  const photoScore = subBy("photos");
  const verifyScore = subBy("verifications");
  const verifyCount = Math.round(verifyScore / 25); // 0..4, for the "{n}/4" display

  const gauges = [
    {
      label: "Capital",
      sub: r.dbd?.capital_thb ? "Registered THB" : "Not disclosed",
      score: capScore,
      display: formatCap(r.dbd?.capital_thb),
      animateValue: r.dbd?.capital_thb || undefined,
      format: "capital_thb" as const,
      color: "gold" as const,
    },
    {
      label: "Years",
      sub: foundedYear ? `since ${foundedYear}` : "—",
      score: longevityScore,
      display: years ? `${years}y` : "—",
      animateValue: years || undefined,
      format: "years" as const,
      color: "gold" as const,
    },
    {
      label: "Reviews",
      sub: r.rating > 0 ? `★ ${r.rating.toFixed(1)}` : "no reviews",
      score: reviewScore,
      display: `${(r.total_reviews || 0).toLocaleString()}`,
      animateValue: r.total_reviews || 0,
      format: "comma" as const,
      color: "emerald" as const,
    },
    {
      label: "Verifications",
      sub: `${verifyCount} active`,
      score: verifyScore,
      display: `${verifyCount}/4`,
      color: "red" as const,
    },
    {
      label: "Photos",
      sub: "site evidence",
      score: photoScore,
      display: `${r.photos?.length || 0}`,
      animateValue: r.photos?.length || 0,
      format: "int" as const,
      color: "stone" as const,
    },
  ];

  // ── Medals ───────────────────────────────────────────────────
  const medals = [
    {
      key: "dbd",
      label: confidence === "verified" ? "DBD Verified" : "DBD-listed",
      sub: r.dbd?.reg_no ? `Reg. ${r.dbd.reg_no}` : "",
      icon: "✓",
      active: !!r.dbd,
      hint: confidence === "verified"
        ? "Cross-checked with Thailand's Department of Business Development at ≥90 confidence."
        : "Matched at 80–89% confidence — verify identity before contracting.",
    },
    {
      key: "tsic",
      label: "Industry Code",
      sub: tsic || "",
      icon: "🏷",
      active: !!tsic,
      hint: "Thai Standard Industrial Classification — official industry registration.",
    },
    {
      key: "estate",
      label: "Industrial Estate",
      sub: r.estate_name || "",
      icon: "🏘",
      active: !!r.estate_name,
      hint: "Operates inside an IEAT-registered industrial estate.",
    },
    {
      key: "halal",
      label: "Halal Certified",
      sub: r.halal_certified ? "Active" : "",
      icon: "☪",
      active: !!r.halal_certified,
      hint: "Halal certification matched in our brand registry.",
    },
    {
      key: "iso",
      label: "ISO 9001",
      sub: "",
      icon: "ⓘ",
      active: false,
      hint: "ISO 9001 quality management — not yet in our data.",
    },
    {
      key: "iatf",
      label: "IATF 16949",
      sub: "",
      icon: "🚗",
      active: false,
      hint: "Automotive Tier-1 standard — not yet in our data.",
    },
    {
      key: "haccp",
      label: "HACCP",
      sub: "",
      icon: "🥫",
      active: false,
      hint: "Food safety — not yet in our data.",
    },
    {
      key: "boi",
      label: "BOI Promoted",
      sub: "",
      icon: "🇹🇭",
      active: false,
      hint: "Board of Investment promoted — not yet in our data.",
    },
  ];

  // ── Timeline events ──────────────────────────────────────────
  const timelineEvents: { year: number; label: string; highlight?: boolean }[] = [];
  if (years && years >= 10) {
    const mid = (foundedYear || 0) + Math.floor((years || 0) / 2);
    if (mid > 0) timelineEvents.push({ year: mid, label: "Decade mark" });
  }

  // ── Similar suppliers ────────────────────────────────────────
  const similar = (() => {
    if (r.estate_slug) {
      const inEstate = db.suppliers.filter((s) => s.id !== r.id && s.estate_slug === r.estate_slug).slice(0, 6);
      if (inEstate.length >= 3) return inEstate;
    }
    if (tsic) {
      const sameTsic = db.suppliers.filter((s) => s.id !== r.id && s.dbd?.tsic_code === tsic).slice(0, 6);
      if (sameTsic.length >= 3) return sameTsic;
    }
    return db.suppliers
      .filter((s) =>
        s.id !== r.id &&
        s.verified &&
        s.categories.some((c) => r.categories.includes(c)) &&
        (s.city === r.city || s.district === r.district)
      )
      .sort((a, b) => (b.b2b_score ?? b.trust_score) - (a.b2b_score ?? a.trust_score))
      .slice(0, 6);
  })();

  return (
    <article className="bg-stone-50">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <nav className="text-sm text-stone-500 font-mono-data" aria-label="Breadcrumb">
          <a href="/" className="hover:text-stone-900">Home</a>
          <span className="mx-2">›</span>
          {r.city_label && (
            <>
              <a href={`/city/${r.city}`} className="hover:text-stone-900">{r.city_label}</a>
              <span className="mx-2">›</span>
            </>
          )}
          <span className="text-stone-900 font-bold uppercase">{r.name}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-4">
        {tier && <div className="mb-3"><SponsoredBadge id={r.id} /></div>}

        {/* HERO — gold certificate */}
        <HeroCertificate
          name={r.name}
          legalNameTh={r.dbd?.legal_name}
          primaryType={r.primary_type}
          city={r.city_label}
          district={r.district}
          province={r.province_en}
          regNo={r.dbd?.reg_no}
          founded={r.dbd?.registered_date}
          capital={r.dbd?.capital_thb}
          tsicCode={tsic}
          yearsInBusiness={years}
          confidence={confidence}
          heroPhoto={photos[0]}
          photos={photos}
          rating={r.rating}
          totalReviews={r.total_reviews}
          phone={r.phone}
          mapsUrl={r.maps_url}
          website={r.website}
        />

        {/* Overall composite score — big circular scoreboard */}
        <section className="mb-8">
          <SectionHeading kicker="Composite score" title="Trust Index" />
          <OverallScore
            overall={trust.overall}
            caption="TRUST INDEX"
            subs={[
              { label: "Capital",       score: capScore,      color: "#b45309" },
              { label: "Longevity",     score: longevityScore,color: "#0f766e" },
              { label: "Reviews",       score: reviewScore,   color: "#b91c1c" },
              { label: "Verifications", score: verifyScore,   color: "#7c3aed" },
              { label: "Photos",        score: photoScore,    color: "#475569" },
            ]}
          />
        </section>

        {/* 5 trust gauges */}
        <section className="mb-8">
          <SectionHeading kicker="At a glance" title="Trust signals" />
          <TrustGauges gauges={gauges} />
        </section>

        {/* Categories chips */}
        {r.categories.length > 0 && (
          <section className="mb-8">
            <div className="flex flex-wrap gap-2">
              {r.categories.map((c) => (
                <a key={c} href={`/c/${c}`}
                   className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full text-sm font-bold hover:bg-amber-100">
                  <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                  {CATEGORY_LABELS[c] ?? c}
                </a>
              ))}
              {r.halal_certified && (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-900 border border-green-200 px-3 py-1.5 rounded-full text-sm font-bold">
                  ☪ Halal certified
                </span>
              )}
            </div>
          </section>
        )}

        {/* Medal wall — only render if any medal active */}
        {medals.some((m) => m.active) && (
          <section className="mb-8">
            <MedalWall medals={medals} />
          </section>
        )}

        {/* Industry radar + capital histogram side-by-side */}
        {radarAxes && peer && peer.count >= 2 && tsic && (
          <section className="mb-8 grid lg:grid-cols-2 gap-4">
            <IndustryRadar
              axes={radarAxes}
              title="Industry position"
              tsicLabel={`TSIC ${tsic} · ${peer.count} verified peer companies`}
            />
            {r.dbd?.capital_thb && (
              <CapitalHistogram
                myCapital={r.dbd.capital_thb}
                peerCapitals={
                  db.suppliers
                    .filter((s) => s.dbd?.tsic_code === tsic && s.dbd?.capital_thb)
                    .map((s) => s.dbd!.capital_thb!)
                }
                tsicLabel={`TSIC ${tsic} · ${peer.count} verified peers`}
              />
            )}
          </section>
        )}

        {/* Peer comparison table */}
        {tsic && peer && peer.count >= 3 && (
          <section className="mb-8">
            <PeerCompare
              me={r}
              peers={
                db.suppliers
                  .filter((s) => s.id !== r.id && s.dbd?.tsic_code === tsic)
                  .sort((a, b) => (b.b2b_score ?? 0) - (a.b2b_score ?? 0))
                  .slice(0, 3)
              }
              tsicLabel={`TSIC ${tsic}`}
            />
          </section>
        )}

        {/* Company timeline */}
        {foundedYear && (
          <section className="mb-8">
            <CompanyTimeline founded={foundedYear} events={timelineEvents} />
          </section>
        )}

        {/* Photo gallery — if more than 1 */}
        {photos.length > 1 && (
          <section className="mb-8">
            <SectionHeading kicker="Site evidence" title={`Photos (${photos.length})`} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.slice(0, 8).map((url, i) => (
                <a key={i} href={photoUrl(url)} target="_blank" rel="noopener noreferrer"
                   className="relative block rounded-xl overflow-hidden bg-stone-100 group" style={{ aspectRatio: "4/3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl(url)} alt={`${r.name} — photo ${i + 1}`} loading="lazy" referrerPolicy="no-referrer"
                       className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Main 2-col below */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {/* DBD details */}
            {r.dbd && (
              <section className={`border rounded-2xl p-6 ${confidence === "verified" ? "cert-frame" : "bg-stone-50 border-stone-300"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white font-bold text-base bg-amber-700">
                    {confidence === "verified" ? "✓" : "≈"}
                  </span>
                  <h2 className="text-xl font-bold text-stone-900 font-display">
                    {confidence === "verified" ? "Verified business profile" : "DBD-listed business profile"}
                  </h2>
                </div>
                <p className="text-sm text-stone-700 mb-4 leading-relaxed">
                  {confidence === "verified" ? (
                    <>Cross-checked with Thailand&apos;s Department of Business Development (DBD) — the official Ministry of Commerce business registry.</>
                  ) : (
                    <>This Google Maps listing was matched to a DBD registry entry at <span className="font-bold">{r.dbd.match_score?.toFixed(0)}%</span> name confidence.
                       Capital and legal name shown below are from the matched DBD record — please verify the legal identity directly with the supplier before contracting.</>
                  )}
                </p>
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {r.dbd.legal_name && (
                    <Detail label="Legal name (Thai)">{r.dbd.legal_name}</Detail>
                  )}
                  {r.dbd.reg_no && (
                    <Detail label="Registration No." mono>{r.dbd.reg_no}</Detail>
                  )}
                  {r.dbd.registered_date && (
                    <Detail label="Established">
                      {r.dbd.registered_date}
                      {years ? <span className="text-stone-500"> · {years} years</span> : null}
                    </Detail>
                  )}
                  {r.dbd.capital_thb && (
                    <Detail label="Registered capital">{formatCap(r.dbd.capital_thb)} <span className="text-stone-500">THB</span></Detail>
                  )}
                  {tsic && (
                    <Detail label="TSIC industry code" mono>{tsic}</Detail>
                  )}
                  {r.estate_name && (
                    <Detail label="Industrial estate">
                      {r.estate_slug
                        ? <a href={`/estate/${r.estate_slug}`} className="text-amber-800 font-bold hover:underline">{r.estate_name}</a>
                        : r.estate_name}
                    </Detail>
                  )}
                </dl>
                {r.dbd.purpose && (
                  <div className="mt-5 pt-5 border-t border-amber-200">
                    <div className="text-xs uppercase tracking-widest font-bold text-stone-600 mb-1.5">Business purpose</div>
                    <p className="text-sm leading-relaxed text-stone-800">{r.dbd.purpose}</p>
                  </div>
                )}
                {r.dbd.address && r.dbd.address !== r.address && (
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-widest font-bold text-stone-600 mb-1.5">Registered address</div>
                    <p className="text-sm leading-relaxed text-stone-800">{r.dbd.address}</p>
                  </div>
                )}
              </section>
            )}

            {!r.dbd?.purpose && r.yp?.description && (
              <section className="bg-white border border-stone-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-3 text-stone-900 font-display">About</h2>
                <p className="text-sm leading-relaxed text-stone-700">{r.yp.description}</p>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section>
                <SectionHeading kicker="Buyer feedback" title={`Reviews (${reviews.length})`} />
                <p className="text-sm text-stone-600 mb-4">
                  Scraped from Google reviews — not edited or commissioned.
                </p>
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((rev, i) => (
                    <blockquote key={i} className="border-l-4 border-amber-600 bg-white border border-stone-200 px-5 py-4 rounded-r-xl">
                      <p className="text-[15px] leading-relaxed text-stone-800">{rev.text}</p>
                      <footer className="mt-3 text-xs text-stone-500 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-700">{rev.reviewer || "Google reviewer"}</span>
                        {rev.rating > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-amber-700 font-bold">★ {rev.rating}</span>
                          </>
                        )}
                        {rev.date && (
                          <>
                            <span>·</span>
                            <span>{rev.date}</span>
                          </>
                        )}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </section>
            )}

            <AdSlot slot="supplier-detail-mid" />

            {/* RFQ — gold heavy CTA */}
            <section id="rfq" className="scroll-mt-20">
              <div className="cert-frame rounded-2xl p-6 mb-2">
                <h2 className="text-2xl font-bold text-amber-900 font-display">Request a quote from {r.name}</h2>
                <p className="text-sm text-amber-900/85 mt-1">
                  Tell us what you need — we&apos;ll forward to the supplier and copy you on the response. No middleman fees.
                </p>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <ShortlistButton id={r.id} name={r.name} cityLabel={r.city_label} variant="full" />
                  <FavoriteButton id={r.id} name={r.name} cityLabel={r.city_label || ""} variant="full" />
                  <span className="text-xs text-amber-900/70">Comparing several? Add them and request one quote from your shortlist.</span>
                </div>
              </div>
              <RfqForm locale="en" />
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-1">Address</div>
                <div className="text-sm text-stone-800 leading-relaxed">{r.address || "—"}</div>
              </div>
              {r.lat && r.lng && (
                <MapEmbed lat={r.lat} lng={r.lng} name={r.name} height={200} />
              )}
              {(r.phone || r.website || r.maps_url) && (
                <div className="pt-3 border-t border-stone-200 space-y-2">
                  {r.phone && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-0.5">Phone</div>
                      <a href={`tel:${(r.phone || "").replace(/[^+\d]/g, "")}`} className="text-base text-stone-900 font-bold hover:text-amber-800 font-mono-data">{r.phone}</a>
                    </div>
                  )}
                  {r.website && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-0.5">Website</div>
                      <a href={r.website} target="_blank" rel="noopener nofollow" className="text-sm text-amber-800 hover:underline truncate block">
                        {r.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <AdSlot slot="supplier-sidebar" />

            {similar.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-3">
                  {r.estate_name ? `More in ${r.estate_name}` :
                   tsic ? "Same industry (TSIC)" :
                   "Similar suppliers"}
                </h3>
                <div className="divide-y divide-stone-100">
                  {similar.map((s) => (
                    <a key={s.id} href={`/supplier/${s.id}`} className="block py-2.5 group">
                      <div className="font-bold text-sm text-stone-900 group-hover:text-amber-800 leading-tight">{s.name}</div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        {s.verified && <span className="text-amber-800 font-bold">✓ Verified</span>}
                        {s.years_in_business ? <span>{s.years_in_business}y</span> : null}
                        {s.dbd?.capital_thb ? <span>{formatCap(s.dbd.capital_thb)} cap.</span> : null}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Browse related */}
        <section className="mb-12 bg-stone-100 border border-stone-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-stone-900 font-display">Browse related</h2>
          <div className="flex flex-wrap gap-2">
            {r.categories.slice(0, 3).map((c) => (
              <a key={c} href={`/c/${c}`}
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-full text-sm hover:border-stone-900 font-bold">
                {CATEGORY_ICONS[c] ?? "🏭"} All {CATEGORY_LABELS[c] ?? c} in Thailand
              </a>
            ))}
            {r.estate_slug && r.estate_name && (
              <a href={`/estate/${r.estate_slug}`}
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-400 rounded-full text-sm hover:border-amber-700 font-bold text-amber-900">
                🏘 All suppliers in {r.estate_name}
              </a>
            )}
            {r.city_label && (
              <a href={`/city/${r.city}`}
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-full text-sm hover:border-stone-900 font-bold">
                📍 Suppliers in {r.city_label}
              </a>
            )}
            <a href="/best/highly-recommended"
               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-full text-sm hover:border-stone-900 font-bold">
              ⭐ Top verified suppliers
            </a>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mb-12">
            <SectionHeading kicker="Similar companies" title="Related suppliers" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((s) => (
                <SupplierCard key={s.id} r={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      <SupplierJsonLd r={r} />
      <ProfilePageJsonLd r={r} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        ...(r.city_label ? [{ name: r.city_label, url: `/city/${r.city}` }] : []),
        { name: r.name, url: `/supplier/${r.id}` },
      ]} />
    </article>
  );
}


function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] uppercase tracking-widest font-bold text-amber-700 mb-1">{kicker}</div>
      <h2 className="text-xl md:text-2xl font-bold text-stone-900 font-display">{title}</h2>
    </div>
  );
}

function Detail({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest font-bold text-stone-500">{label}</dt>
      <dd className={`mt-0.5 text-stone-900 ${mono ? "font-mono-data text-[13px]" : "text-sm"}`}>{children}</dd>
    </div>
  );
}
