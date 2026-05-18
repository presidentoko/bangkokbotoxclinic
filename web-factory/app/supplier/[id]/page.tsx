import { notFound } from "next/navigation";
import { loadMasterDb, getSupplierById } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS, type Supplier } from "@/lib/types";
import { BreadcrumbJsonLd, SupplierJsonLd, ProfilePageJsonLd } from "@/components/JsonLd";
import { MapEmbed } from "@/components/MapEmbed";
import { sponsoredTier } from "@/lib/sponsored";
import { SponsoredBadge } from "@/components/Badges";
import { AdSlot } from "@/components/AffiliateSlot";
import { RfqForm } from "@/components/RfqForm";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  // CSV 베이스 ~3,300 suppliers — 전부 정적 생성 (CF Pages 20K 한도 안)
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
      images: r.hero_image ? [{ url: r.hero_image }] : undefined,
    },
    robots: { index: true, follow: true },
  };
}


function formatCapital(thb: number | null | undefined): string {
  if (!thb) return "";
  if (thb >= 1_000_000_000) return `฿${(thb / 1_000_000_000).toFixed(1)}B`;
  if (thb >= 1_000_000) return `฿${(thb / 1_000_000).toFixed(1)}M`;
  if (thb >= 1_000) return `฿${(thb / 1_000).toFixed(0)}K`;
  return `฿${thb.toFixed(0)}`;
}

function formatPhoneTel(s: string): string {
  return s.replace(/[^+\d]/g, "");
}

function whatsAppLink(phone: string, name: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits || digits.length < 6) return null;
  const intl = digits.startsWith("66") ? digits : (digits.startsWith("0") ? "66" + digits.slice(1) : digits);
  const msg = encodeURIComponent(`Hello ${name}, I found you on thaisupplyhub.com and would like to request a quote.`);
  return `https://wa.me/${intl}?text=${msg}`;
}

// match_score >= 90 = "Verified" (강), 80-89 = "Likely match" (약). <80 = 신뢰 시그널 없음.
function dbdConfidence(score: number | null | undefined): "verified" | "likely" | null {
  if (typeof score !== "number") return null;
  if (score >= 90) return "verified";
  if (score >= 80) return "likely";
  return null;
}

function lineLink(phone: string): string | null {
  // LINE 은 phone 만으로는 안 됨 — 검색용 deeplink
  if (!phone) return null;
  return `line://ti/p/~${phone.replace(/\D/g, "")}`;
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
  const cap = formatCapital(r.dbd?.capital_thb);
  const founded = r.dbd?.registered_date ? r.dbd.registered_date.slice(0, 4) : null;
  const years = r.years_in_business || (founded ? new Date().getFullYear() - parseInt(founded) : null);
  const tsic = r.dbd?.tsic_code;
  const confidence = dbdConfidence(r.dbd?.match_score);

  // Similar — same estate first, then same TSIC, then same category
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
    <article className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <nav className="text-sm text-[var(--muted)]" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[var(--fg)]">Home</a>
          <span className="mx-2">›</span>
          {r.city_label && (
            <>
              <a href={`/city/${r.city}`} className="hover:text-[var(--fg)]">{r.city_label}</a>
              <span className="mx-2">›</span>
            </>
          )}
          <span className="text-[var(--fg)] font-medium">{r.name}</span>
        </nav>
      </div>

      {/* HERO — full-bleed photo + title + verified ribbon */}
      <header className="max-w-6xl mx-auto px-4 mt-4 mb-6">
        {photos.length > 0 ? (
          <div className="relative w-full rounded-2xl overflow-hidden bg-stone-200 shadow-sm" style={{ aspectRatio: "16/7" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[0]}
              alt={r.name}
              loading="eager"
              fetchPriority="high"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 md:p-8">
              {confidence === "verified" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow">
                  <span aria-hidden>✓</span> DBD Verified Supplier
                </span>
              )}
              {confidence === "likely" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/95 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow"
                      title={`DBD-listed; name matched at ${r.dbd?.match_score?.toFixed(0)}% — likely but not fully confirmed.`}>
                  <span aria-hidden>≈</span> DBD-listed · Likely match
                </span>
              )}
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{r.name}</h1>
              {r.dbd?.legal_name && (
                <p className="text-white/85 text-sm md:text-base mt-1 font-medium">{r.dbd.legal_name}</p>
              )}
              <p className="text-white/80 text-xs md:text-sm mt-2 flex items-center gap-2 flex-wrap">
                {r.primary_type && <span>🏭 {r.primary_type}</span>}
                {(r.district || r.city_label) && <span>📍 {[r.district, r.city_label].filter(Boolean).join(", ")}</span>}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] p-8 bg-stone-50">
            {confidence === "verified" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider mb-3">
                <span aria-hidden>✓</span> DBD Verified
              </span>
            )}
            {confidence === "likely" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider mb-3"
                    title={`Likely match (${r.dbd?.match_score?.toFixed(0)}% name confidence)`}>
                <span aria-hidden>≈</span> DBD-listed
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{r.name}</h1>
            {r.dbd?.legal_name && (
              <p className="text-base text-[var(--muted)] mt-1 font-medium">{r.dbd.legal_name}</p>
            )}
          </div>
        )}

        {tier && <div className="mt-3"><SponsoredBadge id={r.id} /></div>}

        {/* Trust strip — 핵심 신뢰 지표 한 줄 */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <TrustChip label="Rating" value={r.rating > 0 ? `★ ${r.rating.toFixed(1)}` : "—"}
            sub={r.total_reviews > 0 ? `${r.total_reviews.toLocaleString()} reviews` : "No reviews yet"} />
          {founded ? (
            <TrustChip label="Established" value={founded} sub={years ? `${years} years in business` : ""} accent />
          ) : (
            <TrustChip label="Established" value="—" sub="Not disclosed" />
          )}
          {cap ? (
            <TrustChip label="Registered Capital" value={cap} sub="Thai Baht" accent />
          ) : (
            <TrustChip label="Registered Capital" value="—" sub="Not disclosed" />
          )}
          {r.dbd?.reg_no ? (
            <TrustChip label="DBD Reg. No." value={r.dbd.reg_no} sub="Department of Business Development" accent mono />
          ) : (
            <TrustChip label="DBD Reg. No." value="—" sub="Unverified" />
          )}
        </div>

        {/* Quick actions — multi-channel contact (older buyers + Asian markets) */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
          <a href="#rfq" className="flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold text-base hover:bg-emerald-800 shadow-sm">
            <span aria-hidden>✉</span> Send RFQ
          </a>
          {r.phone && (
            <a href={`tel:${formatPhoneTel(r.phone)}`} className="flex items-center justify-center gap-2 bg-white border-2 border-stone-300 py-3 px-4 rounded-xl font-bold text-base text-stone-900 hover:border-stone-900">
              <span aria-hidden>📞</span> {r.phone}
            </a>
          )}
          {!r.phone && r.website && (
            <a href={r.website} target="_blank" rel="noopener nofollow" className="flex items-center justify-center gap-2 bg-white border-2 border-stone-300 py-3 px-4 rounded-xl font-bold text-base text-stone-900 hover:border-stone-900">
              <span aria-hidden>🌐</span> Website
            </a>
          )}
          {r.maps_url && (
            <a href={r.maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white border-2 border-stone-300 py-3 px-4 rounded-xl font-bold text-base text-stone-900 hover:border-stone-900">
              <span aria-hidden>📍</span> Google Maps
            </a>
          )}
          {r.phone && whatsAppLink(r.phone, r.name) && (
            <a href={whatsAppLink(r.phone, r.name)!} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 bg-white border-2 border-emerald-300 text-emerald-800 py-3 px-4 rounded-xl font-bold text-base hover:border-emerald-700">
              <span aria-hidden>💬</span> WhatsApp
            </a>
          )}
        </div>
      </header>

      {/* Photo gallery — grid */}
      {photos.length > 1 && (
        <section className="max-w-6xl mx-auto px-4 mb-10">
          <h2 className="text-xl font-bold mb-3 text-stone-900">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.slice(0, 8).map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                 className="relative block rounded-xl overflow-hidden bg-stone-100 group" style={{ aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`${r.name} — photo ${i + 1}`} loading="lazy" referrerPolicy="no-referrer"
                     className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Main grid: business profile + sidebar */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Categories chips */}
            {r.categories.length > 0 && (
              <section>
                <div className="flex flex-wrap gap-2">
                  {r.categories.map((c) => (
                    <a key={c} href={`/c/${c}`}
                       className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-100">
                      <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                      {CATEGORY_LABELS[c] ?? c}
                    </a>
                  ))}
                  {r.halal_certified && (
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-900 border border-green-200 px-3 py-1.5 rounded-full text-sm font-medium">
                      ☪ Halal certified
                    </span>
                  )}
                </div>
              </section>
            )}

            {/* Business profile — DBD details */}
            {r.dbd && (
              <section className={`border rounded-2xl p-6 ${confidence === "verified" ? "bg-emerald-50/40 border-emerald-200" : "bg-amber-50/40 border-amber-200"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-base ${confidence === "verified" ? "bg-emerald-600" : "bg-amber-500"}`}>
                    {confidence === "verified" ? "✓" : "≈"}
                  </span>
                  <h2 className="text-xl font-bold text-stone-900">
                    {confidence === "verified" ? "Verified business profile" : "DBD-listed business profile"}
                  </h2>
                </div>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                  {confidence === "verified" ? (
                    <>Cross-checked with Thailand&apos;s Department of Business Development (DBD) — the official business registry.</>
                  ) : (
                    <>This Google Maps listing was matched to a DBD registry entry at {r.dbd.match_score?.toFixed(0)}% name confidence.
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
                  {cap && (
                    <Detail label="Registered capital">{cap} <span className="text-stone-500">THB</span></Detail>
                  )}
                  {tsic && (
                    <Detail label="TSIC industry code" mono>{tsic}</Detail>
                  )}
                  {r.estate_name && (
                    <Detail label="Industrial estate">
                      {r.estate_slug
                        ? <a href={`/estate/${r.estate_slug}`} className="text-emerald-700 hover:underline">{r.estate_name}</a>
                        : r.estate_name}
                    </Detail>
                  )}
                </dl>
                {r.dbd.purpose && (
                  <div className="mt-5 pt-5 border-t border-stone-200">
                    <div className="text-xs uppercase tracking-wide font-bold text-stone-500 mb-1.5">Business purpose</div>
                    <p className="text-sm leading-relaxed text-stone-700">{r.dbd.purpose}</p>
                  </div>
                )}
                {r.dbd.address && r.dbd.address !== r.address && (
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-wide font-bold text-stone-500 mb-1.5">Registered address</div>
                    <p className="text-sm leading-relaxed text-stone-700">{r.dbd.address}</p>
                  </div>
                )}
              </section>
            )}

            {/* YP description fallback */}
            {!r.dbd?.purpose && r.yp?.description && (
              <section className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-3 text-stone-900">About</h2>
                <p className="text-sm leading-relaxed text-stone-700">{r.yp.description}</p>
              </section>
            )}

            {/* Reviews from external_reviews */}
            {reviews.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-3 text-stone-900">
                  Buyer reviews <span className="text-stone-500 font-normal text-base">({reviews.length})</span>
                </h2>
                <p className="text-sm text-stone-600 mb-4">
                  Scraped from Google reviews — not edited or commissioned.
                </p>
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((rev, i) => (
                    <blockquote key={i} className="border-l-4 border-emerald-500 bg-white border border-stone-200 px-5 py-4 rounded-r-xl">
                      <p className="text-[15px] leading-relaxed text-stone-800">{rev.text}</p>
                      <footer className="mt-3 text-xs text-stone-500 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-700">{rev.reviewer || "Google reviewer"}</span>
                        {rev.rating > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-yellow-700 font-bold">★ {rev.rating}</span>
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

            {/* RFQ form — main CTA */}
            <section id="rfq" className="scroll-mt-20">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 mb-2">
                <h2 className="text-2xl font-bold text-emerald-900">Request a quote from {r.name}</h2>
                <p className="text-sm text-emerald-900/80 mt-1">
                  Tell us what you need — we&apos;ll forward to the supplier and copy you on the response. No middleman fees.
                </p>
              </div>
              <RfqForm locale="en" />
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
              <div>
                <div className="text-xs uppercase tracking-wide font-bold text-stone-500 mb-1">Address</div>
                <div className="text-sm text-stone-800 leading-relaxed">{r.address || "—"}</div>
              </div>
              {r.lat && r.lng && (
                <MapEmbed lat={r.lat} lng={r.lng} name={r.name} height={200} />
              )}
              {(r.phone || r.website || r.maps_url) && (
                <div className="pt-3 border-t border-stone-200 space-y-2">
                  {r.phone && (
                    <div>
                      <div className="text-xs uppercase tracking-wide font-bold text-stone-500 mb-0.5">Phone</div>
                      <a href={`tel:${formatPhoneTel(r.phone)}`} className="text-base text-stone-900 font-bold hover:text-emerald-700">{r.phone}</a>
                    </div>
                  )}
                  {r.website && (
                    <div>
                      <div className="text-xs uppercase tracking-wide font-bold text-stone-500 mb-0.5">Website</div>
                      <a href={r.website} target="_blank" rel="noopener nofollow" className="text-sm text-emerald-700 hover:underline truncate block">
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
                <h3 className="text-sm font-bold uppercase tracking-wide text-stone-500 mb-3">
                  {r.estate_name ? `More in ${r.estate_name}` :
                   tsic ? "Same industry (TSIC)" :
                   "Similar suppliers"}
                </h3>
                <div className="divide-y divide-stone-100">
                  {similar.map((s) => (
                    <a key={s.id} href={`/supplier/${s.id}`} className="block py-2.5 group">
                      <div className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 leading-tight">{s.name}</div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        {s.verified && <span className="text-emerald-700 font-bold">✓ Verified</span>}
                        {s.years_in_business ? <span>{s.years_in_business}y</span> : null}
                        {s.dbd?.capital_thb ? <span>{formatCapital(s.dbd.capital_thb)} cap.</span> : null}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Browse related — internal linking */}
        <section className="mt-12 mb-8 bg-stone-50 border border-stone-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 text-stone-900">Browse related</h2>
          <div className="flex flex-wrap gap-2">
            {r.categories.slice(0, 3).map((c) => (
              <a key={c} href={`/c/${c}`}
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-full text-sm hover:border-stone-900 font-medium">
                {CATEGORY_ICONS[c] ?? "🏭"} All {CATEGORY_LABELS[c] ?? c} in Thailand
              </a>
            ))}
            {r.estate_slug && r.estate_name && (
              <a href={`/estate/${r.estate_slug}`}
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-full text-sm hover:border-emerald-700 font-medium text-emerald-800">
                🏘 All suppliers in {r.estate_name}
              </a>
            )}
            {r.city_label && (
              <a href={`/city/${r.city}`}
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-full text-sm hover:border-stone-900 font-medium">
                📍 Suppliers in {r.city_label}
              </a>
            )}
            <a href="/best/highly-recommended"
               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-full text-sm hover:border-stone-900 font-medium">
              ⭐ Top verified suppliers
            </a>
          </div>
        </section>
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


function TrustChip({ label, value, sub, accent, mono }: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? "bg-emerald-50 border-emerald-200" : "bg-white border-stone-200"}`}>
      <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">{label}</div>
      <div className={`text-base md:text-lg font-bold mt-0.5 ${accent ? "text-emerald-900" : "text-stone-900"} ${mono ? "font-mono text-sm md:text-base" : ""}`}>{value}</div>
      {sub && <div className="text-[11px] text-stone-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function Detail({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide font-bold text-stone-500">{label}</dt>
      <dd className={`mt-0.5 text-stone-900 ${mono ? "font-mono text-[13px]" : "text-sm"}`}>{children}</dd>
    </div>
  );
}
